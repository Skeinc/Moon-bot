import { TransactionInterface } from "@interfaces/api/transaction.interface";
import { ApiService } from "./apiService.service";
import { CurrencyEnum } from "../enums/currency.enum";
import { TransactionStatusesEnum, TransactionTypesEnum } from "../enums/transaction.enum";

export class TransactionService {
    static async createTransaction(userId: string, amount: string, currency: CurrencyEnum, type: TransactionTypesEnum, status: TransactionStatusesEnum, paymentMethodId: number, tariffId: string, transactionId: string | null): Promise<TransactionInterface | null> {
        const transactionData = {
            userId,
            amount,
            currency,
            type,
            status,
            paymentMethodId,
            tariffId,
            transactionId,
        };

        const response = await ApiService.postData<TransactionInterface>("/transactions", transactionData);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }
}