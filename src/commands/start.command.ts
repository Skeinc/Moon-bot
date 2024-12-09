import { getMenuKeyboard } from "@constants/keyboards.const";
import { Context } from "grammy";
import { newSpreadCommand } from "./newSpread.command";

export const startCommand = async (ctx: Context) => {
    // Первое сообщение
    await ctx.reply(
        "Привет! Я здесь, чтобы помочь тебе разобраться в твоем раскладе по колоде ТАРО МАНАРА.\n\n" +
        "✅ Напиши свой вопрос для расклада.\n" +
        "✅ Выбери карты.\n\n" +
        "🎁 Новым пользователям доступно 3 бесплатных запроса!\n\n" +
        "С любовью, твой персональный таролог Moon. 💫\n\n" +
        "P.S. Если что-то пошло не так, попробуй нажать /start.\n" +
        "Меню находится внизу, рядом с полем для ввода текста.\n\n" +
        "Для связи с техподдержкой: @bot_lovemyself.", {
            reply_markup: {
                keyboard: getMenuKeyboard().build(),
                resize_keyboard: true,
                is_persistent: true,
            },
        }
    );

    // Вызов newSpreadCommand после отправки приветственного сообщения
    await newSpreadCommand(ctx);
};