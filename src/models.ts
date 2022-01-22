import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

const getCurrentDate = (): string => new Date()
    .toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })
    .replace(/\//g, "-");

export class Day {
    day: string = getCurrentDate();
    tries: number;
    won: boolean;
    word: string;
}

export class User {
    readonly id: string = nanoid();
    nickname: string;
    days: Day[];
}
