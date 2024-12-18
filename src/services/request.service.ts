import { CreateRequestInterface, RequestInterface } from "@interfaces/api/request.interface";
import { RequestStatusesEnum, RequestTypesEnum } from "../enums/request.enum";
import { ApiService } from "./apiService.service";

export class RequestService {
    static async createRequest(userId: string, telegramId: number, type: RequestTypesEnum, question: string, cards: string[], isPaid: boolean): Promise<CreateRequestInterface | null> {
        const requestData = {
            userId,
            type,
            requestData: { 
                telegramId,
                question,
                cards
            },
            status: RequestStatusesEnum.PENDING,
            isPaid
        };

        const response = await ApiService.postData<CreateRequestInterface>("/requests", requestData);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }

    static async updateRequest(userId: string, updates: Partial<RequestInterface>): Promise<RequestInterface | null> {
        const requestData = {
            id: userId,
            ...updates,
        };

        const response = await ApiService.putData<RequestInterface>("/requests", requestData);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }
}