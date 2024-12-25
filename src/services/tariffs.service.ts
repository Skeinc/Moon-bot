import { TariffInterface } from "@interfaces/api/tariff.interface";
import { ApiService } from "./apiService.service";
import { PaymentMethodsEnum } from "../enums/paymentMethod.enum";

export class TariffService {
    static async getTariff(id: string): Promise<TariffInterface | null> {
        const response = await ApiService.getData<TariffInterface>(`/tariffs/${id}`);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }

    static async getTariffByCallback(callback: string): Promise<TariffInterface | null> {
        const response = await ApiService.getData<TariffInterface>(`/tariffs/by-callback/${callback}`);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }

    static async getTariffsByPaymentMethod(id: PaymentMethodsEnum): Promise<TariffInterface[] | null> {
        const response = await ApiService.getData<TariffInterface[]>(`/tariffs/by-payment-method/${id}`);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }
}