import { getMoreInfoButton } from "@constants/buttons.const";
import { backToMenuKeyboard } from "@constants/keyboards.const";
import { Context } from "grammy";

export const aboutTarotCommand = async (ctx: Context) => {
    const tarotDescription = `
Таро — это система из 78 карт, используемых для гадания и саморазмышлений. Колода делится на два типа карт:

1. **Старшие Арканы (22 карты)** — представляют важные жизненные уроки и события. Например, **Шут** (новые начинания) или **Солнце** (счастье, успех).
2. **Младшие Арканы (56 карт)** — отражают повседневные аспекты жизни. Они делятся на 4 масти:
    - **Кубки** (эмоции, отношения)
    - **Мечи** (мысли, конфликты)
    - **Пентакли** (материальные вопросы)
    - **Жезлы** (действия, амбиции)

Каждая карта имеет своё значение и помогает раскрыть подсознательные мысли, эмоции и возможные пути решения проблем.

Таро используется для предсказаний, саморазмышлений и гармонизации внутренней энергии.
    `;

    await ctx.reply(tarotDescription, {
        reply_markup: getMoreInfoButton,
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
};