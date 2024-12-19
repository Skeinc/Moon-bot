import { logger } from "@services/logger.service";

export async function registerWebhook(): Promise<void> {
    try {
        const response = await axios.post('https://api.yookassa.ru/v3/webhooks', {
            event: 'payment.succeeded',
            url: `${process.env.API_BASE_URL}/webhooks/yookassa`,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.YOOKASSA_SECRET_KEY}`,
            },
        });
        logger.info('Webhook успешно зарегистрирован:', response.data);
    } catch (error) {
        logger.error('Не удалось зарегистрировать webhook:', error);
    }
}