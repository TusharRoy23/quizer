import { ClientDBService } from "@/services/clientDBService";
import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/`;

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
    window.location.href = '/';
};

let refreshPromise: Promise<void> | null = null;

const callRefreshToken = async () => {
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
        }
        return Promise.reject(error);
    }
)

apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.status === 401) {
            clearLocalStorageAndDB();
        }
        return Promise.reject(error);
    }
)