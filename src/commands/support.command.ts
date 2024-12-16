import { backToMenu } from "@actions/menu.action";
import { getSupportButton } from "@constants/buttons.const";
import { checkTelegramID } from "@utils/checkTelegramID.util";
import { Context } from "grammy";

export const supportCommand= async (ctx: Context) => {
    if(!await checkTelegramID(ctx)) {
        return;
    }
    
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

    await backToMenu(ctx);
}