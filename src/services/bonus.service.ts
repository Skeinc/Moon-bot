import { CreateBonusInterface } from "@interfaces/api/bonus.interface";
import { BonusTypeEnum } from "../enums/bonus.enum";
import { ApiService } from "./apiService.service";

export class BonusService {
    // Создание нового бонуса
    static async createBonus(data: {userId: string, referralId: string | null, bonusType: BonusTypeEnum, bonusValue: number}): Promise<CreateBonusInterface | null> {
        const response = await ApiService.postData<CreateBonusInterface>('/bonuses', data);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }
}