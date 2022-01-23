import { get, ref } from "firebase/database";
import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../firebase";
import { Day } from "../../models";
import { getCurrentDate } from "../../utils";

const DAY_PATTERN = /^\d{2}-\d{2}-\d{4}$/;

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.day) {
        res.status(400).json({ error: "Missing day" });
        return;
    }

    if (!DAY_PATTERN.test(req.query.day as string)) {
        res.status(400).json({ error: "Invalid date format" });
        return;
    }

    if (req.query.day === getCurrentDate()) {
        res.status(400).json({ error: "Cannot get current day" });
        return;
    }

    await get(ref(database, "users"))
        .then((snapshot) => {
            let wordInputs: {
                word: string;
                count: number;
            }[] = [];

            snapshot.forEach((childSnapshot) => {
                childSnapshot.child("days").forEach((daySnapshot) => {
                    const day: Day = daySnapshot.val();

                    if (day.day === req.query.day && day.won && day.word) {
                        const word = day.word.toUpperCase();
                        const index = wordInputs.findIndex((input) => input.word === word);
                        if (index === -1) {
                            wordInputs.push({ word, count: 1 });
                        } else {
                            wordInputs[index].count++;
                        }
                    }
                });
            });

            if (wordInputs.length === 0) {
                res.status(404).json({ error: "No word inputs found for this date" });
                return;
            }

            wordInputs = wordInputs.sort((a, b) => b.count - a.count);
            const word = wordInputs[0].word;

            res.status(200).json(wordInputs);
        })
        .catch((error) => {
            res.status(500).json(error);
        });
};
