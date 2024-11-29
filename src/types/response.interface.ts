export interface ResponseInterface<T> {
    success: boolean;
    message?: string;
    data?: T;
}