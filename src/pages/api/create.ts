import { ref, set } from "firebase/database";
import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../firebase";
import { User } from "../../models";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        res.status(400).json({ error: "Invalid method" });
        return;
    }

    if (!process.env.CREATE_AUTH_TOKEN) {
        res.status(500).json({ error: "Missing auth token configuration on server" });
        return;
    }

    const token = req.headers.authorization.split(" ")[1];

    if (token !== process.env.CREATE_AUTH_TOKEN) {
        res.status(401).json({ error: "Invalid auth token" });
        return;
    }

    if (!req.query.nickname) {
        res.status(400).json({ error: "Missing nickname" });
        return;
    }

    const user = new User();
    user.nickname = req.query.nickname as string;

    await set(ref(database, "users/" + user.id), user)
        .then(() => res.json({
            success: true,
            code: user.id,
        }))
        .catch((error) => {
            res.status(500).json(error);
        });
};
