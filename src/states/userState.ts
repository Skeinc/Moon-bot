import { UserStateInterface } from "@interfaces/states/userState.interface";

export class UserStateManager {
    private userState: Map<number, UserStateInterface> = new Map();

    // Получить состояние пользователя
    public getUserState(userId: number): UserStateInterface | undefined {
        return this.userState.get(userId);
    }

    // Инициализировать состояние пользователя
    public initializeUser(userId: number, roleId: number, initialRequests: number = 3): void {
        if(!this.userState.has(userId)) {
            this.userState.set(userId, {
                userId,
                roleId,
                username: null,
                avaliableRequests: initialRequests,
            });
        }
    }

    // Обновление состояния пользователя
    public updateUserState(userId: number, updates: Partial<UserStateInterface>): void {
        const currentState = this.getUserState(userId);

        if(!currentState) {
            this.initializeUser(userId, 2, 3);
        }
        else {
            this.userState.set(userId, { ...currentState, ...updates });
        }
    }

    // Обновить количество доступных запросов
    public updateAvaliableRequests(userId: number, delta: number): void {
        const user = this.userState.get(userId);

        if(user) {
            user.avaliableRequests = Math.max(0, user.avaliableRequests + delta);
        }
    }

    // Обнуление состояния пользователя
    public resetUserState(userId: number): void {
        this.userState.delete(userId);
    }
}