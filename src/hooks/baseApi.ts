import axios from "axios";
import { env } from "@/lib/env";
import { ClientDBService } from "@/services/clientDBService";
import { ErrorResponse } from "@/utils/types";

const API_BASE_URL = `${env.apiUrl}/`;

export const setAccessTokenExpiry = (timestamp: number) => {
    localStorage.setItem("accessTokenExpiry", timestamp.toString());
};

export const isAccessTokenExpiringSoon = (): boolean => {
    const expiry = localStorage.getItem("accessTokenExpiry");
    if (!expiry || isNaN(Number(expiry))) return true;

    const thresholdMin = 1;
    const thresholdTime = Number(expiry) - (thresholdMin * 60 * 1000);

    return Date.now() >= thresholdTime;
};

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
});

const clearLocalStorageAndDB = () => {
    localStorage.clear();
    ClientDBService.clearAllQuizzes();
};

let refreshPromise: Promise<void> | null = null;

export const callRefreshToken = async () => {
    if (!refreshPromise) {
        refreshPromise = axios
            .get(`${API_BASE_URL}user/auth/refresh`, { withCredentials: true })
            .then((response) => {
                if (response.data?.data?.expiredAt) {
                    setAccessTokenExpiry(response.data.data.expiredAt);
                }
            })
            .catch((err) => {
                clearLocalStorageAndDB();
                window.location.href = '/';
                throw err;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    await refreshPromise;
}

apiClient.interceptors.request.use(
    async (config) => {
        if (localStorage.getItem("accessTokenExpiry") && isAccessTokenExpiringSoon()) {
            await callRefreshToken();
        }
        return config;
    },
    (error) => {
        if (error.status === 401) {
            clearLocalStorageAndDB();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
)

apiClient.interceptors.response.use(
    (response) => {
        return {
            ...response,
            data: response.data.data,
            meta: response.data?.meta || {},
            status: response.data?.status,
            message: response.data?.message
        }
    },
    (error) => {
        if (error.response) {
            // Handle structured error responses
            const serverError = error.response.data;

            if (error.response.status === 401) {
                clearLocalStorageAndDB();
                window.location.href = '/';
            }

            if (error.response.status === 409) {
                // Handle forbidden access
                clearLocalStorageAndDB();
            }
            const validationErrMsg = extractAllErrors(serverError)?.length > 0 ? 'Validation Error' : undefined;
            // Create a new error with the server message
            const errorWithMessage = new Error(
                validationErrMsg ||
                serverError?.message ||
                serverError?.data?.message ||
                serverError || 'An error occurred'
            );

            return Promise.reject(errorWithMessage);
        }
        return Promise.reject(error);
    }
);

function extractAllErrors(errorResponse: ErrorResponse): { key: string, value: string }[] {
    const { error } = errorResponse.data;

    if (!error || typeof error !== 'object') {
        return [];
    }

    const allErrors: { key: string, value: string }[] = [];

    Object.entries(error).forEach(([key, value]) => {
        allErrors.push({ key: key, value: Array.isArray(value) ? value[0] : value });
    });

    return allErrors;
}