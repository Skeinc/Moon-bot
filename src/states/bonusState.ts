import { BonusStateInterface } from "@interfaces/states/bonusState.interface";

export class BonusStateManager {
    private bonusState: Map<number, BonusStateInterface> = new Map();

    // Получение состояния бонусов
    public getBonusState(userId: number): BonusStateInterface | undefined {
        return this.bonusState.get(userId);
    }

    // Инициализировать бонусы
    public initializeBonusState(userId: number): void {
        if(!this.bonusState.has(userId)) {
            this.bonusState.set(userId, {
                userId,
                bonusRequests: 0,
                claimedBonus: false,
            });
        }
    }

    // Добавить бонусные запросы
    public addBonusRequests(userId: number, count: number): void {
        const bonus = this.bonusState.get(userId);

        if(bonus) {
            bonus.bonusRequests += count;
        }
    }

    // Забрать бонус за подписку
    public claimBonus(userId: number): void {
        const bonus = this.bonusState.get(userId);

        if(bonus && !bonus.claimedBonus) {
            bonus.claimedBonus = true;
            bonus.bonusRequests += 3;
        }
    }

    // Использовать бонусные запросы
    public useBonusRequest(userId: number): boolean {
        const bonus = this.bonusState.get(userId);

        if(bonus && bonus.bonusRequests > 0) {
            bonus.bonusRequests -= 1;

            return true;
        }

        return false;
    }
}