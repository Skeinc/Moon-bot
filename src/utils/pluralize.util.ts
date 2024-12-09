export const pluralize = (count: number, singular: string, few: string, many: string): string => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod100 >= 11 && mod100 <= 14) {
        return many;
    }

    if (mod10 === 1) {
        return singular;
    }

    if (mod10 >= 2 && mod10 <= 4) {
        return few;
    }

    return many;
};