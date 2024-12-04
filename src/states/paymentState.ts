import { PaymentStateInterface } from "@interfaces/states/paymentState.interface";

export class PaymentStateManager {
    private paymentState: Map<number, PaymentStateInterface> = new Map();

    // Получение состояния платежа
    public getPaymentState(userId: number): PaymentStateInterface {
        if(!this.paymentState.has(userId)) {
            this.paymentState.set(userId, {userId, status: "pending"});
        }

        return this.paymentState.get(userId)!;
    }

    // Обновление состояния платежа
    public updatePaymentState(userId: number, updates: Partial<PaymentStateInterface>): void {
        const currentState = this.getPaymentState(userId);

        this.paymentState.set(userId, { ...currentState, ...updates});
    }

    // Обнуление состояния платежа
    public resetPaymentState(userId: number): void {
        this.paymentState.delete(userId);
    }
}