import { RequestPagination } from "../../middlewares/pagination";

export interface PaginationInfo {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    status: boolean;
    message: string;
    data: T[];
    next?: PaginationInfo;
    previous?: PaginationInfo;
}

interface GeneratePaginatedResponseProps<T> {
    status: boolean,
    message: string,
    data: T[],
    collectionCount: number,
    requestPagination: RequestPagination
}

export const generatePaginatedResponse = <T>(
    { status, message, data, collectionCount, requestPagination }: GeneratePaginatedResponseProps<T>
): PaginatedResponse<T> => {
    const { skip, take, page, limit } = requestPagination;
    return {
       status,
        message,
        data,
        ...(skip + take < collectionCount && {
            next: {
                page: page + 1,
                limit: limit,
            },
        }),
        ...(skip > 0 && {
            previous: {
                page: page - 1,
                limit: limit,
            },
        }),
    };
};