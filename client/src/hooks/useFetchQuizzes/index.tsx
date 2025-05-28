import { useQuery } from '@tanstack/react-query';
import type { QueryObserverResult } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { quizAPI } from '../../api/client';

// interface Quiz {
//     id: string;
//     full_name: string;
// }

interface PaginationParams {
    page?: number;
    limit?: number;
}

interface FetchQuizzesResponse {
    data: any[];
    message: string;
    status: boolean;
    next?: { page: number; limit: number };
    previous?: { page: number; limit: number };
}

const fetchQuizzes = async (
    params: PaginationParams = {},
): Promise<AxiosResponse<FetchQuizzesResponse>> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const url = queryString ? `/quizzes/?${queryString}` : '/quizzes/';

    return await quizAPI.get<FetchQuizzesResponse>(url);
};

export const useFetchQuizzes = (
    pagination: PaginationParams = { page: 1, limit: 10 },
): QueryObserverResult<FetchQuizzesResponse, any> => {
    return useQuery<FetchQuizzesResponse, any>({
        queryFn: async () => {
            const { data } = await fetchQuizzes(pagination);
            return data;
        },
        queryKey: ['quizzes', pagination],
    });
};
