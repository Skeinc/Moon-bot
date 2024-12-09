# MoonBot Frontend

## Архитектура проекта

```
// Хранилище статических ресурсов: изображения, шрифты, файлы для отправки пользователям.
/assets

// Конфигурационные файлы для разных окружений.
/environments
|-- development.env     // Настройки для разработки.
|-- production.env      // Настройки для боевого окружения.
|-- testing.env         // Настройки для тестирования.

// Лог-файлы приложения.
/logs
|-- app.log             // Основные логи работы приложения.
|-- error.log           // Логи ошибок.
|-- exceptions.log      // Логи необработанных исключений.

// Основной исходный код приложения.
/src

// Логика обработки взаимодействий (например, нажатий кнопок).
|-- /actions
|   |-- menu.action.ts              // Действия, связанные с главным меню.
|   |-- registerActions.ts          // Действия, связанные с главным меню.

|-- /callbacks
|   |-- bonus.callback.ts
|   |-- referral.callback.ts
|   |-- registerCallbacks.ts
|   |-- subscription.callback.ts

// Логика обработки текстовых команд.
|-- /commands
|   |-- aboutTarot.command.ts       // Команда "О картах Таро".
|   |-- adminPanel.command.ts       // Команда для перехода в админ-панель.
|   |-- bonus.command.ts            // Команда "Бонусы".
|   |-- customSpread.command.ts     // Команда "Индивидуальный расклад".
|   |-- newSpread.command.ts        // Команда "Новый расклад".
|   |-- referral.command.ts         // Команда "Реферальная программа".
|   |-- registerCommands.ts         // Регистрация всех текстовых команд.
|   |-- start.command.ts            // Команда "Старт".
|   |-- subscription.command.ts     // Команда "Подписка".
|   |-- support.command.ts          // Команда "Поддержка".

// Файлы с константами.
|-- /constants
|   |-- buttons.const.ts            // Константы для inline-кнопок.
|   |-- keyboards.const.ts          // Константы для клавиатур.
|   |-- logger.const.ts             // Конфигурация логгера.

// Интерфейсы для строгой типизации данных.
|-- /interfaces
|   |-- /api
|   |   |-- response.interface.ts           // Интерфейс для типизации ответов API.
|   |-- /states
|   |   |-- appState.interface.ts           // Интерфейс состояния приложения.
|   |   |-- bonusState.interface.ts         // Интерфейс состояния бонусов.
|   |   |-- paymentState.interface.ts       // Интерфейс состояния платежей.
|   |   |-- sessionState.interface.ts       // Интерфейс сессий пользователей.
|   |   |-- subscriptionState.interface.ts  // Интерфейс состояния подписок.
|   |   |-- userState.interface.ts          // Интерфейс данных пользователя.

// Промежуточные обработчики для расширения логики обработки запросов.
|-- /middlewares

// Сервисы для работы с внешними источниками и бизнес-логикой.
|-- /services
|   |-- apiService.service.ts       // Сервис для работы с API.
|   |-- httpService.service.ts      // Сервис для работы с HTTP-запросами.
|   |-- logger.service.ts           // Сервис для логирования.

// Файлы для управления состояниями приложения.
|-- /states
|   |-- appState.ts                 // Логика состояния приложения.
|   |-- bonusState.ts               // Логика состояния бонусов.
|   |-- paymentState.ts             // Логика состояния платежей.
|   |-- sessionState.ts             // Логика управления сессиями.
|   |-- subscriptionState.ts        // Логика состояния подписок.
|   |-- userState.ts                // Логика состояния пользователя.

// Утилиты и вспомогательные функции.
|-- /utils
|   |-- envLoader.util.ts           // Утилита для загрузки переменных окружения.
|   |-- initConfig.util.ts          // Утилита для начальной конфигурации бота.
|   |-- logger.util.ts              // Утилита для создания и настройки логгера.

// Основной файл инициализации и запуска бота.
|-- bot.ts
```