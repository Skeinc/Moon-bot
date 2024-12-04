import { AppStateInterface } from "@interfaces/states/appState.interface";

export class AppStateManager {
    private appState: AppStateInterface = {
        isConnectedToOpenAI: false,
        isConnectedToPaymentGateway: false,
        logs: [],
    };

    // Получение состояния приложения
    public getAppState(): AppStateInterface {
        return this.appState;
    };

    // Обновление состояния приложения
    public updateAppState(updates: Partial<AppStateInterface>): void {
        this.appState = { ...this.appState, ...updates };
    }

    // Добавление сообщения в список логов
    public addLog(message: string): void {
        this.appState.logs.push(message);
    }
}