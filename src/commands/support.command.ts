import { getSupportButton } from "@constants/buttons.const";
import { backToMenuKeyboard } from "@constants/keyboards.const";
import { Context } from "grammy";

export const supportCommand= async (ctx: Context) => {
    const supportDescription = `
👋 **Добро пожаловать в службу поддержки!**
    
Если у вас есть конкретный вопрос, не стесняйтесь задавать его прямо здесь, и мы постараемся помочь вам как можно быстрее!
    
🔗 **Связаться с поддержкой**: [Нажмите здесь](https://t.me/bot_lovemyself) для перехода в чат с нашей службой поддержки.
    
Спасибо, что выбрали нас! Мы здесь, чтобы помочь вам.
    `;

    await ctx.reply(supportDescription, {
        reply_markup: getSupportButton,
        parse_mode: "Markdown",
    });

    await ctx.reply("Выберите действие из меню ниже:", {
        reply_markup: {
            keyboard: backToMenuKeyboard.build(),
            resize_keyboard: true,
            is_persistent: true,
        },
        parse_mode: "Markdown",
    });
}