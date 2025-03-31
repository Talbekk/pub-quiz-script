import { connectDB, getDB, close } from "../../config/db";
import { Message } from "../AddMessages";
import { ulid } from "ulid";
import { Quiz } from "../AddQuizzes";
import { Participant } from "../AddParticipants";
import batch from "../Services/BatchStream";

export type Entry = {
    _id: string;
    player_ref: string;
    quiz_ref: string;
    score: number | null;
    messages: Array<Message>;
    created_at: number;
}

const createEntry = (participantId: Participant['_id'], quizId: Quiz['_id'], messages: Array<Message>): Entry => {
    const participantMessages: Array<Message> = messages.filter(message => message.participant_ref === participantId);
    return {
        _id: ulid(),
        player_ref: participantId,
        quiz_ref: quizId,
        score: null,
        messages: participantMessages,
        created_at: Date.now(),
    };
}


const AddEntries = async () => {
    await connectDB();
    const db = getDB();
    try {
        const quizzesCollection = db.collection<Quiz>("quizzes");
        const quizzesCursor = quizzesCollection.find({}, { sort: [['_id', 1]] });
        const total = await quizzesCollection.countDocuments();
        const messagesCollection = db.collection<Message>("messages");
        const entriesCollection = db.collection<Entry>("entries");
        const participantsCollection = db.collection<Participant>("participants");
        const participants = await participantsCollection.find({}).toArray();
        const batchSize = 25;

        const processQuizBatch = async (quizzes: Array<Quiz>, messages: Array<Message>) => {
            let entries: Array<Entry> = [];
            const updatedQuizzes: Array<Quiz> = quizzes.map((quiz) => {
                const messagesDuringQuizWeek = messages.filter(message => message.timestamp >= quiz.start_datetime && message.timestamp < quiz.end_datetime);
                const quizEntries = participants.map((participant) => createEntry(participant._id, quiz._id, messagesDuringQuizWeek));
                entries.push(...quizEntries);
                return {
                    ...quiz,
                    entries: quizEntries.map((entry) => entry._id),
                }
            });
            const bulkUpdate = updatedQuizzes.map((updatedQuiz) => {
                return {
                    updateOne: {
                        filter: { _id: updatedQuiz._id },
                        update: { $set: { entries: updatedQuiz.entries } }
                    }
                }
            });
            await quizzesCollection.bulkWrite(bulkUpdate);
            await entriesCollection.insertMany(entries);
            console.log(`quizzes added: `, quizzes.length);
        }

        let count = 0;
        const batchedStream = batch<Quiz>(quizzesCursor, batchSize);
        for await (const currentQuizzes of batchedStream) {
            console.log(`currentQuizzes: `, currentQuizzes);
            console.log(`batchedStream: `, batchedStream);
            const quizStartTimes = currentQuizzes.map(quiz => quiz.start_datetime);
            const quizEndTimes = currentQuizzes.map(quiz => quiz.end_datetime);
            const messagesDuringQuizBatch = await messagesCollection.find({
                timestamp: { $gte: Math.min(...quizStartTimes), $lt: Math.max(...quizEndTimes) }
            }).toArray();
            await processQuizBatch(currentQuizzes, messagesDuringQuizBatch);
            count += currentQuizzes.length;
            console.info('Added primary timezone to educator', {
                progress: `${count}/${total}`,
                lastId: currentQuizzes[currentQuizzes.length - 1]._id,
            });
        }
    } finally {
        await close();
        console.info("Database connection closed");
    }
}

AddEntries();