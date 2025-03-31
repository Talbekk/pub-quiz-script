import { Temporal } from "temporal-polyfill";
import { connectDB, getDB, close  } from "../../config/db";
import { ulid } from "ulid";
import { Entry } from "../AddEntries";

const QUIZ_START_DATE_TIME = 1514764800000;
const WEEK_IN_MILLISECONDS = 604800000;

export type Quiz = {
    _id: string;
    start_datetime: number;
    end_datetime: number;
    url: string | null;
    entries: Array<Entry['_id']>;
    created_at: number;
}

const getStartDateTime = (startIndex: number, index: number): number => {
    return QUIZ_START_DATE_TIME + (WEEK_IN_MILLISECONDS * (startIndex + index));
}

const getEndDateTime = (startIndex: number, index: number): number => {
    return QUIZ_START_DATE_TIME + (WEEK_IN_MILLISECONDS * (startIndex + index + 1));
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

        const processQuizBatch = async (startIndex: number, currentBatchSize: number) => {
            let quizzes: Array<Quiz> = [];
            for(let i = 0 ; i < currentBatchSize; i++) {
                const quiz: Quiz = {
                    _id: ulid(),
                    start_datetime: getStartDateTime(startIndex, i),
                    end_datetime: getEndDateTime(startIndex, i),
                    url: null,
                    entries: [],
                    created_at: Date.now(),
                };
                quizzes.push(quiz);
            }
            await quizzesCollection.insertMany(quizzes);
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