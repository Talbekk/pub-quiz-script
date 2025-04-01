import { connectDB, getDB, close } from "../../config/db";
import { Quiz } from "../AddQuizzes";
import batch from "../Services/BatchStream";
import { Entry } from "../AddEntries";
import { LinkMessage, Message } from "../AddMessages";

const AddLinkToQuiz = async () => {
    await connectDB();
    const db = getDB();
    try {
        const quizzesCollection = db.collection<Quiz>("quizzes");
        const quizzesCursor = quizzesCollection.find({}, { sort: [['_id', 1]] });
        const total = await quizzesCollection.countDocuments();
        const entriesCollection = db.collection<Entry>("entries");
        const batchSize = 25;

        const processQuizBatch = async (quizzes: Array<Quiz>, entries: Array<Entry>) => {
            const updatedQuizzes: Array<Quiz> = quizzes.map((quiz) => {
                const quizEntries: Array<Entry> = entries.filter(entry => entry.quiz_ref === quiz._id);
                const quizMessages: Array<Message> = quizEntries.flatMap((entry) => entry.messages);
                const quizLinkMessages: Array<LinkMessage> = quizMessages.filter(message => message.type === 'link');
                const quizUrls = quizLinkMessages.map(quizLinkMessage => quizLinkMessage.share.link).filter(url => url !== undefined) as Array<string>;
                return {
                    ...quiz,
                    url: quizUrls,
                }
            });
            const bulkUpdate = updatedQuizzes.map((updatedQuiz) => {
                return {
                    updateOne: {
                        filter: { _id: updatedQuiz._id },
                        update: { $set: { url: updatedQuiz.url } }
                    }
                }
            });
            await quizzesCollection.bulkWrite(bulkUpdate);
            console.log(`quizzes updated: `, updatedQuizzes.length);
            console.log(`bulkUpdate: `, bulkUpdate);
            console.log(`bulkUpdate length: `, bulkUpdate.length);
        }

        let count = 0;
        const batchedStream = batch<Quiz>(quizzesCursor, batchSize);
        for await (const currentQuizzes of batchedStream) {
            console.log(`currentQuizzes: `, currentQuizzes);
            console.log(`batchedStream: `, batchedStream);
            const currentQuizBatchIds = currentQuizzes.map(quiz => quiz._id);
            const entriesDuringQuizBatch = await entriesCollection.find({
                quiz_ref: { $in: currentQuizBatchIds }
            }).toArray();
            await processQuizBatch(currentQuizzes, entriesDuringQuizBatch);
            count += currentQuizzes.length;
            console.info('Added valid links to quizzes', {
                progress: `${count}/${total}`,
                lastId: currentQuizzes[currentQuizzes.length - 1]._id,
            });
        }
    } finally {
        await close();
        console.info("Database connection closed");
    }
}

AddLinkToQuiz();