import { Context } from "grammy";

export async function checkTelegramID(ctx: Context): Promise<boolean> {
    const userId = ctx.from?.id;

    if (!userId) {
        await ctx.reply("Не удалось определить ваш идентификатор. Попробуйте снова.");

        return false;
    }

    return true;
}