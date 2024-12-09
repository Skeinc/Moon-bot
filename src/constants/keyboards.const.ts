import { Keyboard } from "grammy";

// Клавиатура для главного меню
export const getMenuKeyboard = () => {
    return new Keyboard()
        .text("🔮 Новый расклад").row()
        .text("🎁 Бонусы").text("💎 Подписка").row()
        .text("🗓 Индивидуальный расклад").text("📩 Поддержка").row()
        .text("👥 Реферальная программа").text("📖 О картах Таро").row()
        .text("🛠 Админ Панель");
};

// Клавиатура с кнопкой "🏠 В главное меню"
export const backToMenuKeyboard = new Keyboard().text("🏠 В главное меню").resized();