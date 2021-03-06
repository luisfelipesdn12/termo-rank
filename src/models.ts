import { getCurrentDate, nanoid } from "./utils";

export class Day {
    day: string = getCurrentDate();
    tries: number;
    won: boolean;
    word?: string;
    submitedAt: number;
}

export class User {
    id: string = nanoid();
    nickname: string;
    days?: Day[];
}
