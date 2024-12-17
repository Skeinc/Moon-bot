import { RoleInterface } from "./role.interface";

export interface UserInterface {
    id: string;
    telegramId: string | number;
    username: string | null;
    roleId: number;
    requestsLeft: number;
    subscriptionExpiry: string | null;
    referrerId: string | null;
    referralLink: string;
    createdAt: string;
    updatedAt: string;
    lastLogin: string;
}

export interface CreateUserInterface {
    id: string;
    telegramId: string | number;
    username: string | null;
    role: RoleInterface;
    requestsLeft: number;
    subscriptionExpiry: string | null;
    referrerId: string | null;
    referralLink: string;
    createdAt: string;
    updatedAt: string;
    lastLogin: string;
}