import { connectDB, getDB, close } from "../../config/db";
import batch from "../Services/BatchStream";
import { Entry } from "../AddEntries";

const AddValidatedStatusToEntry = async () => {
    await connectDB();
    const db = getDB();
    try {
        const entriesCollection = db.collection<Entry>("entries");
        const total = await entriesCollection.countDocuments();
        const entriesCursor = entriesCollection.find({}, { sort: [['_id', 1]] });
        const batchSize = 25;

        const processEntryBatch = async (entries: Array<Entry>) => {
            const bulkUpdate = entries.map((entry) => {
                const validatedStatus = (entry.score !== null) ? true : false;
                return {
                    updateOne: {
                        filter: { _id: entry._id },
                        update: { $set: { validated: validatedStatus} },
                    },
                };
            });
            await entriesCollection.bulkWrite(bulkUpdate);
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

AddValidatedStatusToEntry();