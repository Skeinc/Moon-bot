export interface TariffInterface {
    id: string;
    name: string;
    description: string | null;
    callback: string;
    paymentMethodId: number;
    price: string;
    currency: string;
    requestLimit: number | null;
    duration: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}