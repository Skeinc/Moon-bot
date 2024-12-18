import { TariffInterface } from "@interfaces/api/tariff.interface";
import { InlineKeyboard } from "grammy";
import { PaymentMethodsEnum } from "../enums/paymentMethod.enum";

export const createSubscriptionButtons = (tariffs: TariffInterface[], paymentMethodId: PaymentMethodsEnum) => {
    const keyboard = new InlineKeyboard();

    // Сортировка тарифов по цене по убыванию
    const sortedTariffs: TariffInterface[] = tariffs.sort(
        (a: TariffInterface, b: TariffInterface) => Number(a.price) - Number(b.price)
    );

    // Добавляем кнопки из отсортированного тарифа
    sortedTariffs.forEach(tariff => {
        if (tariff.isActive) {
            keyboard.add({
                text: `${tariff.name}`,
                callback_data: tariff.callback,
            }).row();
        }
    });

    if(paymentMethodId === PaymentMethodsEnum.UKASSA) {
        // Добавляем фиксированную кнопку "Международная оплата"
        keyboard.add({
            text: "🌍 Международная оплата",
            callback_data: "international_payment",
        });
    }

    return keyboard;
};