import { get, ref } from "firebase/database";
import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../firebase";
import { Day, User } from "../../models";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.id) {
        res.status(400).json({ error: "Missing id" });
        return;
    }

    const code: string = (req.query.id as string).toUpperCase();

    await get(ref(database, "users/" + code))
        .then((snapshot) => {
            if (!snapshot.exists()) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            const user: User = snapshot.val();
            const days: Day[] = [];

            snapshot.child("days").forEach((daySnapshot) => {
                const day: Day = daySnapshot.val();
                delete day.word;
                days.push(day);
            });

            user.days = days;
            delete user.id;
            res.status(200).json(user);
        })
        .catch((error) => {
            res.status(500).json(error);
        });
};
