import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});
let accesstoken = null;

export function setAccessToken(token) {
    accesstoken = token;
}
axiosInstance.interceptors.request.use(
    (config) => {
         console.log("Access token available:", Boolean(accesstoken));
        if (accesstoken) {
            config.headers.Authorization = `Bearer ${accesstoken}`;
             console.log("Authorization header added:", Boolean(config.headers.Authorization));
            
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.log("Response status:", error.response?.status);
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/api/auth/refreshtoken")
        ) {
            originalRequest._retry = true;

            try {
                const response = await axios.post(
                    "http://localhost:3000/api/auth/refreshtoken",
                    {},
                    { withCredentials: true }
                );

                const newToken = response.data.accesstoken;

                setAccessToken(newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                setAccessToken(null);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);