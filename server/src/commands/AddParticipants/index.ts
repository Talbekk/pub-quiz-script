import { ulid } from "ulid";
import { connectDB, getDB } from "../../config/db";
import groupChat from "../../data/group-chat.json";

export type Participant = {
    _id: string;
    full_name: string;
}

export const AddParticipants = async () => {
    const db = getDB();
    const participantsCollection = db.collection<Participant>("participants");
    const participants = groupChat.participants;
    console.log(`formattedData: `, participants);
    const formattedParticipants = participants.map((participant) => {
        return {
            _id: ulid(),
            full_name: participant.name,
        }
    })
    try {
        const result = await participantsCollection.insertMany(formattedParticipants, { ordered: true });
        console.log(`${result.insertedCount} documents were inserted`);
    } catch(error) {
        console.error(error);
    }
}

connectDB();
AddParticipants();