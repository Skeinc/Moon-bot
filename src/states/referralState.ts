import { ReferralStateInterface } from "@interfaces/states/referralState.interface";
import { logger } from "@services/logger.service";

export class ReferralStateManager {
    private referralState: Map<number, ReferralStateInterface> = new Map();

    // Получение состояния реферала
    public getReferralState(userId: number): ReferralStateInterface | undefined {
        return this.referralState.get(userId);
    }

    // Инициализация реферала
    public initReferralState(userId: number, createdReferral: boolean, referralLink: string, referredUsers: number): void {
        this.referralState.set(userId, {
            userId,
            createdReferral,
            referralLink,
            referredUsers,
        });
    }

    // Обновление состояния реферала
    public updateReferralState(userId: number, updates: Partial<ReferralStateInterface>): void {
        const currentReferral = this.getReferralState(userId);

        if(currentReferral) {
            this.referralState.set(userId, { ...currentReferral, ...updates });
        }
        else {
            logger.error(`Не удалось обновить реферальную систему пользователя с telegramId: ${userId}`)
        }
    }

    // Очистка состояния реферала
    public resetReferralState(userId: number): void {
        this.referralState.delete(userId);
    }
}

// Экспортируем единственный экземпляр
export const referralStateManager = new ReferralStateManager();