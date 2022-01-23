import { get, ref, set } from "firebase/database";
import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../firebase";
import { Day } from "../../models";
import { getCurrentDate } from "../../utils";

export interface SubmitDaysRequestBody extends Day {
    userId: string;
    newNickname?: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        res.status(400).json({ error: "Invalid method" });
        return;
    }

    req.body = JSON.parse(req.body) as SubmitDaysRequestBody;

    const body: SubmitDaysRequestBody = {
        userId: req.body.userId as string,
        day: req.body.day as string || getCurrentDate(),
        tries: parseInt(req.body.tries as string),
        won: req.body.won === true,
        word: req.body.word as string,
        submitedAt: Date.now(),
    };

    for (const key in body) {
        if (key === "word") continue;

        if (body[key] === undefined) {
            res.status(400).json({ error: `Missing ${key}` });
            return;
        }
    }

    if (req.body.newNickname) {
        await set(
            ref(database, `users/${body.userId}/nickname`),
            req.body.newNickname
        );
    }

    await get(ref(database, "users/" + body.userId))
        .then(async (snapshot) => {
            if (!snapshot.exists()) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            const day: Day = body;

            for (const key in day) {
                if (day[key] === undefined) delete day[key];
            }

            await set(ref(database, `users/${body.userId}/days/${body.day}`), day)
                .then(() => {
                    res.status(200).json({ success: true });
                }).catch((error) => {
                    console.error(error);
                    res.status(500).json({ error: error.message });
                });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
};
