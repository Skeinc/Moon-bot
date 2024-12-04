import { ReferralStateInterface } from "@interfaces/states/referralState.interface";

export class ReferralStateManager {
    private referralState: Map<number, ReferralStateInterface> = new Map();

    // Получение состояния реферала
    public getReferralState(userId: number): ReferralStateInterface {
        if(!this.referralState.has(userId)) {
            this.referralState.set(userId, {
                userId,
                referralLink: '',
                referredUsers: 0,
            });
        }

        return this.referralState.get(userId)!;
    }

    // Обновление состояния реферала
    public updateReferralState(userId: number, updates: Partial<ReferralStateInterface>): void {
        const currentReferral = this.getReferralState(userId);

        this.referralState.set(userId, { ...currentReferral, ...updates });
    }

    // Очистка состояния реферала
    public resetReferralState(userId: number): void {
        this.referralState.delete(userId);
    }
}