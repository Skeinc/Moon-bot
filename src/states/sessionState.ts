import { SessionStateInterface } from "@interfaces/states/sessionState.interface";
import { SessionStepsEnum } from "../enums/session.enum";
import { logger } from "@services/logger.service";

export class SessionStateManager {
    private sessionState: Map<number, SessionStateInterface> = new Map();

    public getSessionState(userId: number): SessionStateInterface | undefined {
        return this.sessionState.get(userId);
    }

    public setSession(userId: number): void {
        this.sessionState.set(userId, {
            userId,
            currentStep: SessionStepsEnum.IDLE,
        });
    }

    public updateSessionState(userId: number, updates: Partial<SessionStateInterface>): void {
        const currentSession = this.getSessionState(userId);

        if (currentSession) {
            this.sessionState.set(userId, { ...currentSession, ...updates });
        } else {
            logger.error(`Не удалось обновить сессию пользователя с telegramId: ${userId}`);
        }
    }

    public resetSessionState(userId: number): void {
        this.sessionState.delete(userId);
    }
}

// Экспортируем единственный экземпляр
export const sessionStateManager = new SessionStateManager();