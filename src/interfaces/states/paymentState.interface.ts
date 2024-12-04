export interface PaymentStateInterface {
    userId: number;
    transactionId?: string;
    status: "pending" | "success" | "failed";
    amount?: number;
}