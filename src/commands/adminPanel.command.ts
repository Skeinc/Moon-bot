import { backToMenu } from "@actions/menu.action";
import { Context } from "grammy";

export const adminPanelCommand = async (ctx: Context) => {
    const adminPanelDescription = `🛠️ **Сервис в разработке, скоро будет готов!**

Мы работаем над улучшением и добавлением новых функций. 
Скоро ты сможешь воспользоваться нашим сервисом и наслаждаться всеми преимуществами! Благодарим за твоё терпение.`;

    await backToMenu(ctx, adminPanelDescription);
};