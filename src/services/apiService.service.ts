import { ResponseInterface } from "../types/response.interface";
import { httpService } from "./httpService.service";

export class ApiService {
    static async getData<T>(endPoint: string, params?: Record<string, any>): Promise<ResponseInterface<T>> {
        try {
            const response = await httpService.get<ResponseInterface<T>>(endPoint, { params });

            return response.data;
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to GET data from ${endPoint}: ${(error as Error).message}`,
            };
        }
    }

    static async postData<T>(endPoint: string, data: Record<string, any>): Promise<ResponseInterface<T>> {
        try {
            const response = await httpService.post<ResponseInterface<T>>(endPoint, data);

            return response.data;
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to POST data to ${endPoint}: ${(error as Error).message}`,
            };
        }
    }

    static async putData<T>(endPoint: string, data: Record<string, any>): Promise<ResponseInterface<T>> {
        try {
            const response = await httpService.put<ResponseInterface<T>>(endPoint, data);

            return response.data;
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to PUT data to ${endPoint}: ${(error as Error).message}`,
            };
        }
    }

    static async patchData<T>(endPoint: string, data: Record<string, any>): Promise<ResponseInterface<T>> {
        try {
            const response = await httpService.patch<ResponseInterface<T>>(endPoint, data);

            return response.data;
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to PATCH data to ${endPoint}: ${(error as Error).message}`,
            };
        }
    }

    static async deleteData<T>(endPoint: string, params?: Record<string, any>): Promise<ResponseInterface<T>> {
        try {
            const response = await httpService.delete<ResponseInterface<T>>(endPoint, { params });

            return response.data;
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to DELETE data from ${endPoint}: ${(error as Error).message}`,
            };
        }
    }
}