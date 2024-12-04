import { SessionStateInterface } from "@interfaces/states/sessionState.interface";

export class SessionStateManager {
    private sessionState: Map<number, SessionStateInterface> = new Map();

    // Получение состояния сессии
    public getSessionState(userId: number): SessionStateInterface {
        if(!this.sessionState.has(userId)) {
            this.sessionState.set(userId, {
                userId,
                currentStep: "idle",
            });
        }

        return this.sessionState.get(userId)!;
    }

    // Обновлении состояния сессии
    public updateSessionState(userId: number, updates: Partial<SessionStateInterface>): void {
        const currentSession = this.getSessionState(userId);

        this.sessionState.set(userId, {...currentSession, ...updates});
    }

    // Обнуление данных сессии
    public resetSessionState(userId: number): void {
        this.sessionState.delete(userId);
    }
}