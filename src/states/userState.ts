import { UserStateInterface } from "@interfaces/states/userState.interface";
import { logger } from "@services/logger.service";

export class UserStateManager {
    private userState: Map<number, UserStateInterface> = new Map();

    // Получить состояние пользователя
    public getUserState(telegramId: number): UserStateInterface | undefined {
        return this.userState.get(telegramId);
    }

    // Инициализировать состояние пользователя
    public initializeUser(data: UserStateInterface): void {
        if(!this.userState.has(Number(data.telegramId))) {
            this.userState.set(Number(data.telegramId), {
                id: data.id,
                telegramId: Number(data.telegramId),
                username: data.username,
                roleId: data.roleId,
                requestsLeft: data.requestsLeft,
                subscriptionExpiry: data.subscriptionExpiry,
                referrerId: data.referrerId,
                referralLink: data.referralLink,
            });
        }
    }

    // Обновление состояния пользователя
    public updateUserState(telegramId: number, updates: Partial<UserStateInterface>): void {
        const currentState = this.getUserState(telegramId);

        if(!currentState) {
            logger.error(`Не удалось обновить пользователя с telegramId: ${telegramId}`)
        }
        else {
            this.userState.set(telegramId, { ...currentState, ...updates });
        }
    }

    // Обновить количество доступных запросов
    public updateAvaliableRequests(telegramId: number, delta: number): void {
        const user = this.userState.get(telegramId);

        if(user) {
            user.requestsLeft = Math.max(0, user.requestsLeft + delta);
        }
    }

    // Обнуление состояния пользователя
    public resetUserState(userId: number): void {
        this.userState.delete(userId);
    }
}

// Экспортируем единственный экземпляр
export const userStateManager = new UserStateManager();