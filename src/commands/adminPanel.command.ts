import { backToMenuKeyboard } from "@constants/keyboards.const";
import { Context } from "grammy";

export const adminPanelCommand = async (ctx: Context) => {
    await ctx.reply(
        `🛠️ **Сервис в разработке, скоро будет готов!**

Мы работаем над улучшением и добавлением новых функций. 
Скоро ты сможешь воспользоваться нашим сервисом и наслаждаться всеми преимуществами! Благодарим за твоё терпение.`,
        {
            reply_markup: {
                keyboard: backToMenuKeyboard.build(),
                resize_keyboard: true,
                is_persistent: true,
            },
            parse_mode: "Markdown",
        }
    );
};