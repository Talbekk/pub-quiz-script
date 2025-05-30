import groupChat from '../data/group-chat.json';

const possibleScores = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
];

const getGroupChatMessages = () => {
    console.log(typeof groupChat);
    const formattedData = groupChat.messages;
    const filteredData = formattedData.filter((data) => {
        if (data.content) {
            return possibleScores.some(
                (v) =>
                    data.content.includes(v) &&
                    !data.content.includes('https://'),
            );
        }
        return false;
    });
    filteredData.forEach((data) => {
        console.log('sender:', data.sender_name);
        console.log('entry:', data.content);
    });
};

getGroupChatMessages();
