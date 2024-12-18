// Функция для генерации случайных карт
export function generateRandomCards(count: number): string[] {
    const tarotDeck = [
        "Шут", "Маг", "Жрица", "Императрица", "Император", "Иерофант",
        "Влюбленные", "Колесница", "Сила", "Отшельник", "Колесо Фортуны",
        "Справедливость", "Повешенный", "Смерть", "Умеренность", "Дьявол",
        "Башня", "Звезда", "Луна", "Солнце", "Суд", "Мир"
    ];
    
    return Array.from({ length: count }, () => {
        const randomIndex = Math.floor(Math.random() * tarotDeck.length);
        return tarotDeck[randomIndex];
    });
}