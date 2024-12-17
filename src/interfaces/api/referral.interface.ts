import { UserInterface } from "./user.interface";

export interface ReferralInterface {
    id: string;
    referrerId: string;
    referredUserId: string;
    bonusCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReferralInterface {
    id: string;
    referrer: UserInterface;
    referredUser: UserInterface;
    bonusCount: number;
    createdAt: string;
    updatedAt: string;
}