export const mockTextMessage = {
    id: '1',
    timestamp: 1234567890,
    type: 'text',
    created_at: 1234567890,
    participant_ref: 'participant1',
    content: "20",
    photos: [],
    share: null,
};

export const mockImageMessage = {
    id: '2',
    timestamp: 1234567891,
    type: 'image',
    created_at: 1234567891,
    participant_ref: 'participant2',
    content: "20",
    photos: [],
    share: null,
};

export const mockMessages = [
    mockTextMessage,
    mockImageMessage,
];
