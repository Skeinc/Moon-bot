import { CreateUserInterface, UserInterface } from "@interfaces/api/user.interface";
import { ApiService } from "./apiService.service";

export class UserService {
    // Получение пользователя по ID
    static async getUserById(id: string): Promise<UserInterface | null> {
        const response = await ApiService.getData<UserInterface>(`/users/${id}`);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }

    // Получение пользователя по Telegram ID
    static async getUserByTelegramId(telegramId: number): Promise<UserInterface | null> {
        const response = await ApiService.getData<UserInterface>(`/users/by-telegram-id/${telegramId}`);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }

    // Создание нового пользователя
    static async createUser(data: Partial<CreateUserInterface>): Promise<CreateUserInterface | null> {
        const response = await ApiService.postData<CreateUserInterface>('/users', data);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }

    // Обновление пользователя
    static async updateUser(id: string, updates: Partial<UserInterface>): Promise<UserInterface | null> {
        const requestData = {
            id: id,
            ...updates,
        };

        const response = await ApiService.putData<UserInterface>("/users", requestData);

        if (response.success && response.data) {
            return response.data;
        } else {
            return null;
        }
    }
}