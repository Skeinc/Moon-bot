import { TransactionInterface } from "@interfaces/api/transaction.interface";
import { ApiService } from "./apiService.service";
import { CurrencyEnum } from "../enums/currency.enum";
import { TransactionStatusesEnum, TransactionTypesEnum } from "../enums/transaction.enum";

export class TransactionService {
    static async getTransactionByTransactionId(id: string): Promise<TransactionInterface | null> {
        const response = await ApiService.getData<TransactionInterface | null>(`/transactions/by-transaction/${id}`);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }

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

    static async updateTransaction(id: string, updates: Partial<TransactionInterface>): Promise<TransactionInterface | null> {
        const requestData = {
            id: id,
            ...updates,
        };

        const response = await ApiService.putData<TransactionInterface>("/transactions", requestData);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }
}