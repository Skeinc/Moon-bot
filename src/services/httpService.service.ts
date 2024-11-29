import axios from "axios";
import { logger } from "./logger.service";

export const httpService = axios.create({
    baseURL: process.env.BACKEND_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

// Интерсептор запросов
httpService.interceptors.request.use(
    (config) => {
        logger.info(`HTTP Request: ${config.method?.toUpperCase()} ${config.url}`);

        return config;
    },
    (error: any) => {
        logger.error(`HTTP Request Error: ${error.message}`);

        return Promise.reject(error);
    }
);

// Интерсептор ответов
httpService.interceptors.response.use(
    (response) => {
        logger.info(`HTTP Response: ${response.status} ${response.statusText}`);

        return response;
    },
    (error) => {
        if (error.response) {
            logger.error(`HTTP Response Error: ${error.response.status} ${JSON.stringify(error.response.data)}`);
        } 
        else {
            logger.error(`HTTP Error: ${error.message}`);
        }

        return Promise.reject(error);
    }
);