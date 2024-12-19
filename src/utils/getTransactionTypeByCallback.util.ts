import { InternationalSubscribeCallbacksEnum, SubscribeCallbacksEnum } from "../enums/subscription.enum";
import { TransactionTypesEnum } from "../enums/transaction.enum";

export function getTransactionTypeByCallback(callback: SubscribeCallbacksEnum | InternationalSubscribeCallbacksEnum): TransactionTypesEnum {
    const requestPurchaseCallbacks = [
        SubscribeCallbacksEnum.SUBSCRIBE_10_REQUESTS,
        SubscribeCallbacksEnum.SUBSCRIBE_30_REQUESTS,
        InternationalSubscribeCallbacksEnum.SUBSCRIBE_10_REQUESTS,
        InternationalSubscribeCallbacksEnum.SUBSCRIBE_30_REQUESTS,
    ];

    const subscriptionCallbacks = [
        SubscribeCallbacksEnum.SUBSCRIBE_1_DAY,
        SubscribeCallbacksEnum.SUBSCRIBE_7_DAYS,
        SubscribeCallbacksEnum.SUBSCRIBE_30_DAYS,
        InternationalSubscribeCallbacksEnum.SUBSCRIBE_1_DAY,
        InternationalSubscribeCallbacksEnum.SUBSCRIBE_7_DAYS,
        InternationalSubscribeCallbacksEnum.SUBSCRIBE_30_DAYS,
    ];

    if (requestPurchaseCallbacks.includes(callback)) {
        return TransactionTypesEnum.REQUEST_PURCHASE;
    }

    if (subscriptionCallbacks.includes(callback)) {
        return TransactionTypesEnum.SUBSCRIPTION;
    }

    throw new Error("Unknown callback type");
}