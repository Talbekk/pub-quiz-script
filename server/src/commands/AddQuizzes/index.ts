import { Temporal } from "temporal-polyfill";
import { connectDB, getDB, close  } from "../../config/db";

const QUIZ_START_DATE_TIME = 1514764800000;
const WEEK_IN_MILLISECONDS = 604800000;

const AddQuizzes = async () => {
    await connectDB();
    const db = getDB();
    try {
        const quizzesCollection = db.collection("quizzes");
        const messagesCollection = db.collection("messages");
        const todayInMilliseconds = Temporal.Now.instant().epochMilliseconds;
        const weeksSinceStartDate = Math.floor((todayInMilliseconds - QUIZ_START_DATE_TIME) / WEEK_IN_MILLISECONDS);
        console.log(`Weeks since start date: `, weeksSinceStartDate);
        const batchSize = 50;

        const processQuizBatch = async (index: number) => {
            const currentWeekSinceStart  = index + 1;
            
        }

        for (let index = 0; index < weeksSinceStartDate; index += batchSize) {
            try {
                await processQuizBatch(index);
                console.info('Added messages', {
                    progress: `${index  + batchSize}/${weeksSinceStartDate}`,
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