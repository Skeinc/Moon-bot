import axios from "axios";
import { logger } from "@services/logger.service";

export async function registerWebhook(): Promise<void> {
    try {
        const authString = Buffer
            .from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`)
            .toString('base64');
        const webhookUrl = `${process.env.API_BASE_URL}/webhooks/yookassa`;
    
        console.log('Authorization Header:', authString);
        console.log('Webhook URL:', webhookUrl);
    
        const response = await axios.post(
            'https://api.yookassa.ru/v3/webhooks',
            {
                event: 'payment.succeeded',
                url: webhookUrl,
            },
            {
                headers: {
                    Authorization: `Basic ${authString}`,
                },
            },
        );
    
        logger.info('Webhook успешно зарегистрирован:', response.data);
    } catch (error: any) {
        console.error('Ошибка:', error.response?.data || error.message);
        logger.error('Не удалось зарегистрировать webhook:', error);
    }    
}