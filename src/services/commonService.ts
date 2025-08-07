import { apiClient } from "@/hooks/baseApi";
import { CustomResponse, PaginatedResponse } from "@/types";

export const CommonService = {
    createPaginationFetcher: <T>() => async (
        endpoint: string,
        page: number = 1,
        limit: number = 10
    ): Promise<PaginatedResponse<T>> => {
        const validatedPage = Math.max(1, page);
        const validatedLimit = Math.min(Math.max(1, limit), 100);

        const response = await apiClient.get<PaginatedResponse<T>>(
            `${endpoint}?page=${validatedPage}&limit=${validatedLimit}`
        );
        const res = response as unknown as CustomResponse<T>;
        return {
            data: Array.isArray(res.data) ? res.data : [],
            meta: res.meta || {
                page: validatedPage,
                limit: validatedLimit,
                totalItems: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false
            }
        };
    }
}