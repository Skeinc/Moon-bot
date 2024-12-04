export interface SessionStateInterface {
    userId: number;
    currentStep: "idle" | "questionInput" | "cardSelection" | "awaitingPayment";
    tempData?: Record<string, any>;
}