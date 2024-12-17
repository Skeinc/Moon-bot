export interface ReferralStateInterface {
    userId: number;
    createdReferral: boolean;
    referralLink: string;
    referredUsers: number | undefined;
}