import { get, ref } from "firebase/database";
import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../firebase";
import { Day, User } from "../../models";

export default async (_req: NextApiRequest, res: NextApiResponse) => {
    await get(ref(database, "users"))
        .then((snapshot) => {
            const users: User[] = [];

            snapshot.forEach((childSnapshot) => {
                const user: User = childSnapshot.val();
                const days: Day[] = [];

                childSnapshot.child("days").forEach((daySnapshot) => {
                    const day: Day = daySnapshot.val();
                    delete day.word;
                    days.push(day);
                });

                user.days = days;
                delete user.id;
                users.push(user);
            });

            res.status(200).json(users);
        })
        .catch((error) => {
            res.status(500).json(error);
        });
};
