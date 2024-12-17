import { CreateReferralInterface, ReferralInterface } from "@interfaces/api/referral.interface";
import { ApiService } from "./apiService.service";

export class ReferralService {
    // Получение данных реферальной системы по пригласившему пользователю ID
    static async getReferralsByReferrerId(referrerId: string): Promise<ReferralInterface[] | null> {
        const response = await ApiService.getData<ReferralInterface[]>(`/referrals/by-referrer/${referrerId}`);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }

    // Создание новой реферальной системы
    static async createReferral(data: {referrerId: string, referredUserId: string, bonusCount: number}): Promise<CreateReferralInterface | null> {
        const response = await ApiService.postData<CreateReferralInterface>('/referrals', data);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }
}