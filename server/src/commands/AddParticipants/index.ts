import { ulid } from 'ulid';
import { connectDB, getDB, close } from '../../config/db';
import groupChat from '../../data/group-chat.json';

export type Participant = {
    _id: string;
    full_name: string;
};

export const AddParticipants = async () => {
    await connectDB();
    const db = getDB();
    const participantsCollection = db.collection<Participant>('participants');
    const participants = groupChat.participants;
    console.log(`formattedData: `, participants);
    try {
        const formattedParticipants = participants.map((participant) => {
            return {
                _id: ulid(),
                full_name: participant.name,
            };
        });
        const result = await participantsCollection.insertMany(
            formattedParticipants,
            { ordered: true },
        );
        console.log(`${result.insertedCount} documents were inserted`);
    } catch (error) {
        console.error(error);
    } finally {
        await close();
        console.info('Database connection closed');
    }
};

AddParticipants();
