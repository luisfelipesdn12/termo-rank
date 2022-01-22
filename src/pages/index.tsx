import { NextPage } from "next";
import { useEffect, useState } from "react";
import { User } from "../models";

const Index: NextPage = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch("/api/user")
            .then(res => res.json())
            .then((users: User[]) => {
                return users;
            })
            .then(setUsers);
    }, []);

    return (
        <>
            <header>
                <button aria-label="instruções" id="how">?</button>
                <h1>Termo Rank</h1>
                <button aria-label="estatísticas" id="prestats_button"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNyA2My41QzI3IDU5LjM1NzkgMzAuMzU3OSA1NiAzNC41IDU2VjU2QzM4LjY0MjEgNTYgNDIgNTkuMzU3OSA0MiA2My41VjEwMkgyN1Y2My41WiIgZmlsbD0iI0I3QUVCNCIvPgo8cGF0aCBkPSJNNDcgMzMuNUM0NyAyOS4zNTc5IDUwLjM1NzkgMjYgNTQuNSAyNlYyNkM1OC42NDIxIDI2IDYyIDI5LjM1NzkgNjIgMzMuNVYxMDJINDdWMzMuNVoiIGZpbGw9IiNCN0FFQjQiLz4KPHBhdGggZD0iTTY3IDUwLjVDNjcgNDYuMzU3OSA3MC4zNTc5IDQzIDc0LjUgNDNWNDNDNzguNjQyMSA0MyA4MiA0Ni4zNTc5IDgyIDUwLjVWMTAySDY3VjUwLjVaIiBmaWxsPSIjQjdBRUI0Ii8+CjxwYXRoIGQ9Ik04NyA3My41Qzg3IDY5LjM1NzkgOTAuMzU3OSA2NiA5NC41IDY2VjY2Qzk4LjY0MjEgNjYgMTAyIDY5LjM1NzkgMTAyIDczLjVWMTAySDg3VjczLjVaIiBmaWxsPSIjQjdBRUI0Ii8+Cjwvc3ZnPgo=" /></button>
            </header>
            <main>
                {users.map(user => (
                    <div key={user.id}>
                        <h2>{user.nickname}</h2>
                        <ul>
                            {user.days.map((day, index) => (
                                <li key={index}>
                                    <span>{day.day}</span>
                                    <br />
                                    <span>{day.tries}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </main>
        </>
    );
};

export default Index;
