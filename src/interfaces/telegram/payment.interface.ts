export interface TelegramPaymentInterface {
    title: string;
    description: string;
    payload: string;
    currency: string;
    amount: number;
}