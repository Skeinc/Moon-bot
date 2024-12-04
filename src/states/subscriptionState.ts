import { SubscriptionStateInterface } from "@interfaces/states/subscriptionState.interface";

export class SubscriptionStateManager {
    private subscriptionState: Map<number, SubscriptionStateInterface> = new Map();

    // Получение состояния подписки
    public getSubscriptionState(userId: number): SubscriptionStateInterface | undefined {
        return this.subscriptionState.get(userId);
    }

    // Установка подписки
    public setSubscription(userId: number, subscriptionEnd: string): void {
        this.subscriptionState.set(userId, {
            userId,
            active: true,
            subscriptionEnd,
        });
    }

    // Отключение подписки
    public deactivateSubscription(userId: number): void {
        const subscription = this.subscriptionState.get(userId);

        if(subscription) {
            subscription.active = false;
            subscription.subscriptionEnd = new Date().toISOString();
        }
    }

    // Получить оставшееся время подписки в формате "Часы:Минуты:Секунды"
    public getTimeRemaining(userId: number): string | undefined {
        const subscription = this.subscriptionState.get(userId);

        if(subscription && subscription.active) {
            const endTime = new Date(subscription.subscriptionEnd).getTime();
            const nowTime = Date.now();
            const differenceTime = Math.max(0, endTime - nowTime);

            const hours = Math.floor(differenceTime / (1000 * 60 * 60));
            const minutes = Math.floor((differenceTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((differenceTime % (1000 * 60)) / 1000);

            return `${hours}:${minutes}:${seconds}`;
        }

        return undefined;
    }

    // Получить оставшееся время подписки в секундах
    public getTimeRemainingInSeconds(userId: number): number | undefined {
        const subscription = this.subscriptionState.get(userId);
    
        if (subscription && subscription.active) {
            const endTime = new Date(subscription.subscriptionEnd).getTime();
            const nowTime = Date.now();
            const differenceTime = Math.max(0, endTime - nowTime);
    
            return Math.floor(differenceTime / 1000);
        }
    
        return undefined;
    }
}