import { backToMenuKeyboard, getMenuKeyboard } from "@constants/keyboards.const";
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

// Функция для возвращения в главное меню
export const backToMenu = async (ctx: Context, message?: string) => {
    await ctx.reply((message || "Выберите действие из меню ниже:"), {
        reply_markup: {
            keyboard: backToMenuKeyboard.build(),
            resize_keyboard: true,
            is_persistent: true,
        },
        parse_mode: "Markdown",
    });
}