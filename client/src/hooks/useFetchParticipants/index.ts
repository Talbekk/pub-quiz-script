import { useQuery } from '@tanstack/react-query';
import type { QueryObserverResult } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { quizAPI } from '../../api/client';

interface Participant {
    id: string;
    full_name: string;
}

interface FetchParticipantsResponse {
    data: Participant[];
    message: string;
    status: boolean;
}

const fetchParticipants = async (): Promise<
    AxiosResponse<FetchParticipantsResponse>
> => {
    return await quizAPI.get<FetchParticipantsResponse>('/participants/');
};

export const useFetchParticipants = (): QueryObserverResult<
    FetchParticipantsResponse,
    any
> => {
    return useQuery<FetchParticipantsResponse, any>({
        queryFn: async () => {
            const { data } = await fetchParticipants();
            return data;
        },
        queryKey: ['participants'],
    });
};
