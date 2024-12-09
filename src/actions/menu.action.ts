import { getMenuKeyboard } from "@constants/keyboards.const";
import { Context } from "grammy";

// Функция для отправки главного меню
export const sendMenu = async (ctx: Context) => {
    await ctx.reply("Выберите действие из меню ниже:", {
        reply_markup: {
            keyboard: getMenuKeyboard().build(),
            resize_keyboard: true,
            is_persistent: true,
        },
    });
};