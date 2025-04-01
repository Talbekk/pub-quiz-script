import { connectDB, getDB, close } from "../../config/db";
import batch from "../Services/BatchStream";
import { Entry } from "../AddEntries";

const extractAllScores = (message: string): Array<number> => {
    const matches: Array<RegExpExecArray> = [...message.matchAll(/(?<!\/)\b(1[0-9]|2[0-5]|\d)\b/g)];
    return matches.map(match => Number(match[0]));
}

const AddScoreToEntry = async () => {
    await connectDB();
    const db = getDB();
    try {
        const entriesCollection = db.collection<Entry>("entries");
        const total = await entriesCollection.countDocuments();
        const entriesCursor = entriesCollection.find({}, { sort: [['_id', 1]] });
        const batchSize = 25;

        const processEntryBatch = async (entries: Array<Entry>) => {
            const updatedEntries: Array<Entry> = entries.map((entry) => {
                let scores: Array<number> = [];
                entry.messages.map((message) => {
                    if (message.type === 'text') {
                        const messageScores = extractAllScores(message.content);
                        scores = [...scores, ...messageScores];
                    }
                });
                return {
                    ...entry,
                    score: scores.length === 1 ? scores[0] : null,
                    ...(scores.length > 1 ? { possible_scores: scores } : {}),
                };
            });
            const bulkUpdate = updatedEntries.map((updatedEntry) => {
                const updateData: {
                    score: number | null;
                    possible_scores?: Array<number>;
                } = { score: updatedEntry.score };
                if (updatedEntry.possible_scores) {
                    updateData.possible_scores = updatedEntry.possible_scores;
                }
                return {
                    updateOne: {
                        filter: { _id: updatedEntry._id },
                        update: { $set: updateData },
                    },
                };
            });
            await entriesCollection.bulkWrite(bulkUpdate);
            console.log(`updatedEntries updated: `, updatedEntries.length);
            console.log(`bulkUpdate length: `, bulkUpdate.length);
        }

        let count = 0;
        const batchedStream = batch<Entry>(entriesCursor, batchSize);
        for await (const currentEntries of batchedStream) {
            console.log(`batchedStream: `, batchedStream);
            await processEntryBatch(currentEntries);
            count += currentEntries.length;
            console.info('Added valid scores to entries', {
                progress: `${count}/${total}`,
                lastId: currentEntries[currentEntries.length - 1]._id,
            });
        }
    } finally {
        await close();
        console.info("Database connection closed");
    }
}

AddScoreToEntry();