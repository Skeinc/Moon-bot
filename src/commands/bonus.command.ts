
import { bonusButtons } from "@constants/buttons.const";
import { backToMenuKeyboard } from "@constants/keyboards.const";
import { Context } from "grammy";

export const bonusCommand = async (ctx: Context) => {
    // Тестовые переменные
    const claimedBonus: boolean = false;

    if (!claimedBonus) {
        // Если бонус не был забран
        const bonusDescription = `
📢 **Подпишись на наш канал, чтобы получить дополнительные 3 запроса!**

На нашем канале ты найдешь много интересной информации про эзотерику и астрологию, а также научишься делать свои Таро расклады! 🌟

Подписавшись, ты не только получишь бонус, но и будешь в курсе всех новинок и полезных советов.
        `;

        await ctx.reply(bonusDescription, {
            reply_markup: bonusButtons,
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
    else {
        // Если бонус уже был забран
        const bonusDescription = `
⛔️ Вы уже забирали бонус
        `;

        await ctx.reply(bonusDescription, {
            reply_markup: {
                keyboard: backToMenuKeyboard.build(),
                resize_keyboard: true,
                is_persistent: true,
            },
            parse_mode: "Markdown",
        });
    }
}