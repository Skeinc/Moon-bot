import { RequestStatusesEnum, RequestTypesEnum } from "../../enums/request.enum";
import { UserInterface } from "./user.interface";

export interface RequestInterface {
    id: string;
    userId: string;
    type: RequestTypesEnum;
    status: RequestStatusesEnum;
    requestData: any;
    responseData: any | null;
    isPaid: boolean;
    createdAt: string;
    updatedAt: string;
    finishedAt: string | null;
}

export interface CreateRequestInterface {
    id: string;
    user: UserInterface;
    type: RequestTypesEnum;
    status: RequestStatusesEnum;
    requestData: any;
    responseData: any | null;
    isPaid: boolean;
    createdAt: string;
    updatedAt: string;
    finishedAt: string | null;
    openAIResponse?: string;
}