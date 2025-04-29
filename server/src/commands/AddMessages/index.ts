import { ulid } from 'ulid';
import { connectDB, getDB, close } from '../../config/db';
import groupChat from '../../data/group-chat.json';
import { Participant } from '../AddParticipants';
import { Temporal } from 'temporal-polyfill';

type MessageType = 'text' | 'photo' | 'link';
type BaseMessage = {
    _id: string;
    timestamp: number;
    content: string;
    participant_ref: string | null;
    type: MessageType;
    created_at: number;
};

type TextMessage = BaseMessage & {
    type: 'text';
};

type PhotoMessage = BaseMessage & {
    photos: Array<{
        uri: string;
        backup_uri: string;
    }>;
    type: 'photo';
};

export type LinkMessage = BaseMessage & {
    share: {
        link: string;
        text: string;
    };
    type: 'link';
};

export type Message = TextMessage | PhotoMessage | LinkMessage;

const getParticipantRef = (
    participants: Array<Participant>,
    senderName: string,
): Participant['_id'] | null => {
    const result: Participant | undefined = participants.find(
        (participant) => participant.full_name === senderName,
    );

    if (!result) {
        return null;
    }
    return result._id;
};

export const AddMessages = async () => {
    await connectDB();
    const db = getDB();
    try {
        const participantsCollection =
            db.collection<Participant>('participants');
        const participants = await participantsCollection.find({}).toArray();
        const messagesCollection = db.collection<Message>('messages');
        const exportedMessages = groupChat.messages;
        const total = exportedMessages.length;
        const batchSize = 50;
        let invalidMessages: Array<any> = [];

        const processMessageBatch = async (messages: Array<any>) => {
            const formattedMessages = messages.map((message) => {
                if (message.share) {
                    return {
                        _id: ulid(),
                        type: 'link' as MessageType,
                        timestamp: message.timestamp_ms,
                        content: message.content || '',
                        participant_ref: getParticipantRef(
                            participants,
                            message.sender_name,
                        ),
                        share: message.share,
                        created_at: Temporal.Now.instant().epochMilliseconds,
                    } as LinkMessage;
                }
                if (message.photos) {
                    return {
                        _id: ulid(),
                        type: 'photo' as MessageType,
                        timestamp: message.timestamp_ms,
                        content: message.content || '',
                        participant_ref: getParticipantRef(
                            participants,
                            message.sender_name,
                        ),
                        photos: message.photos,
                        created_at: Temporal.Now.instant().epochMilliseconds,
                    } as PhotoMessage;
                }
                if (message.content) {
                    return {
                        _id: ulid(),
                        type: 'text' as MessageType,
                        timestamp: message.timestamp_ms,
                        content: message.content || '',
                        participant_ref: getParticipantRef(
                            participants,
                            message.sender_name,
                        ),
                        created_at: Temporal.Now.instant().epochMilliseconds,
                    } as TextMessage;
                }
                invalidMessages.push(message);
                return undefined;
            });
            const filteredMessages = formattedMessages.filter(
                (message): message is Message => message !== undefined,
            );
            try {
                const result = await messagesCollection.insertMany(
                    filteredMessages,
                    {
                        ordered: true,
                    },
                );
                console.log(`${result.insertedCount} documents were inserted`);
            } catch (error) {
                console.error(error);
            }
        };

        for (let i = 0; i < total; i += batchSize) {
            const batch = exportedMessages.slice(i, i + batchSize);
            try {
                await processMessageBatch(batch);
                console.info('Added messages', {
                    progress: `${i + batch.length}/${total}`,
                    lastTimestamp: batch[batch.length - 1].timestamp_ms,
                });
            } catch (error) {
                console.error(
                    `Error processing batch ${i / batchSize + 1}:`,
                    error,
                );
            }
        }
        console.info('Messages created');
        console.log(`invalid: `, invalidMessages);
    } finally {
        await close();
        console.info('Database connection closed');
    }
};

AddMessages();
