export interface UserStateInterface {
    id: string;
    telegramId: string | number;
    username: string | null;
    roleId: number;
    requestsLeft: number;
    subscriptionExpiry: string | null;
    referrerId: string | null;
    referralLink: string;
}