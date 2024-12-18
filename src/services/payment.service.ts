import { ApiService } from "./apiService.service";

export class PaymentService {
    // Создание платежа через ЮКасса
    static async createPaymentWithYooKassa(data: {amount: string, description: string}): Promise<any | null> {
        const response = await ApiService.postData<any>('/payments/yookassa', data);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }
}