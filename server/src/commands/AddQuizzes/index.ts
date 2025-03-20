import { Temporal } from "temporal-polyfill";
import { connectDB, getDB, close  } from "../../config/db";
import { Message } from "../AddMessages";
import { ulid } from "ulid";

const QUIZ_START_DATE_TIME = 1514764800000;
const WEEK_IN_MILLISECONDS = 604800000;

type Entry = {
    _id: string;
    player_ref: string;
    score: number | null;
    messages: Array<Message>;
    created_at: number;
}

type Quiz = {
    _id: string;
    start_datetime: number;
    end_datetime: number;
    url: string | null;
    entries: Array<Entry>;
    created_at: number;
}
const AddQuizzes = async () => {
    await connectDB();
    const db = getDB();
    try {
        const quizzesCollection = db.collection<Quiz>("quizzes");
        const todayInMilliseconds = Temporal.Now.instant().epochMilliseconds;
        const weeksSinceStartDate = Math.floor((todayInMilliseconds - QUIZ_START_DATE_TIME) / WEEK_IN_MILLISECONDS);
        console.log(`Weeks since start date: `, weeksSinceStartDate);
        const batchSize = 50;

        const processQuizBatch = async (index: number, currentBatchSize: number) => {
            const currentWeekSinceStart  = index + 1;
            let quizzes: Array<Quiz> = [];
            for(let i = index ; i < (index + currentBatchSize); i++) {
                const quiz: Quiz = {
                    _id: ulid(),
                    start_datetime: QUIZ_START_DATE_TIME + (WEEK_IN_MILLISECONDS * (index + i)),
                    end_datetime: QUIZ_START_DATE_TIME + (WEEK_IN_MILLISECONDS * (index + i + 1)),
                    url: null,
                    entries: [],
                    created_at: Date.now(),
                };
                quizzes.push(quiz);
            }
            // await quizzesCollection.insertMany(quizzes);
            console.log(`quizzes added: `, quizzes.length);
        }

        for (let index = 0; index < weeksSinceStartDate; index += batchSize) {
            const currentBatchSize = Math.min(batchSize, weeksSinceStartDate - index);
            try {
                await processQuizBatch(index, currentBatchSize);
                console.info('Added quizzes', {
                    progress: `${index  + currentBatchSize}/${weeksSinceStartDate}`,
                    lastTimestamp: QUIZ_START_DATE_TIME + (WEEK_IN_MILLISECONDS * index),
                });
            } catch (error) {
                console.error(`Error processing batch ${index / batchSize + 1}:`, error);
            }
        }
    } finally {
        await close();
        console.info("Database connection closed");
    }
}

AddQuizzes();