import { TransactionStatusesEnum, TransactionTypesEnum } from "../../enums/transaction.enum";

export interface TransactionInterface {
    id: string;
    userId: string;
    amount: string;
    currency: string;
    type: TransactionTypesEnum;
    status: TransactionStatusesEnum;
    paymentMethodId: number;
    transactionId: string | null;
    tariffId: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    finishedAt: string | null;
}