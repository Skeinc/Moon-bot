import { BonusTypeEnum } from "../../enums/bonus.enum";
import { UserInterface } from "./user.interface";

export interface BonusInterface {
    id: string;
    userId: string;
    referralId: string | null;
    bonusType: BonusTypeEnum;
    bonusValue: number;
    isRedeemed: boolean;
    expiresAt: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface CreateBonusInterface {
    id: string;
    user: UserInterface;
    bonusType: BonusTypeEnum;
    bonusValue: number;
    isRedeemed: boolean;
    expiresAt: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}