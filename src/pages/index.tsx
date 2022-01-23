import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Day, User } from "../models";
import { MdArrowForward, MdArrowBack } from "react-icons/md";
import Modal, { ModalType } from "../components/Modal";
import { getCurrentDate } from "../utils";

const Index: NextPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [allDays, setAllDays] = useState<string[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedDay, setSelectedDay] = useState<string>(getCurrentDate());
    const [modal, setModal] = useState<ModalType>();

    useEffect(() => {
        // Get All users
        fetch("/api/users")
            .then(res => res.json())
            // Set the users state
            .then((users: User[]) => {
                setUsers(users);
                return users;
            })
            // Get all days that have been played
            .then((users) => {
                const days: string[] = [];

                users.forEach(user => {
                    const userDays = user.days.map(day => day.day);

                    userDays.forEach(day => {
                        if (!days.includes(day)) {
                            days.push(day);
                        }
                    });
                });

                if (!days.includes(getCurrentDate())) {
                    days.push(getCurrentDate());
                }

                setAllDays(days.sort());
            })
            .finally(() => setLoading(false));
    }, [modal]);

    return (
        <>
            <header>
                <button onClick={() => setModal(modal === "info" ? null : "info")} aria-label="sobre" id="how">?</button>
                <h1>Termo Rank</h1>
                <button onClick={() => setModal(modal === "input" ? null : "input")} aria-label="entrar" id="prestats_button">
                    <MdArrowForward
                        size="3vh"
                        color="#b7aeb4"
                    />
                </button>
            </header>
            <Modal modal={modal} onClose={() => setModal(null)} />
            <main>
                <div className="day-header">
                    <MdArrowBack
                        onClick={() => {
                            setSelectedDay(allDays[allDays.findIndex(d => d === selectedDay) - 1]);
                        }}
                        className={allDays.findIndex(d => d === selectedDay) === 0 ? "inactive" : ""}
                    />
                    <h2>Para o dia {selectedDay}</h2>
                    <MdArrowForward
                        onClick={() => {
                            setSelectedDay(allDays[allDays.findIndex(d => d === selectedDay) + 1]);
                        }}
                        className={allDays.findIndex(d => d === selectedDay) === allDays.length - 1 ? "inactive" : ""}
                    />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nickname</th>
                            <th>Tentativas</th>
                        </tr>
                    </thead>
                    {loading ? (
                        <tbody>
                            <tr>
                                <td colSpan={3} style={{ textAlign: "center" }}>
                                    Carregando...
                                </td>
                            </tr>
                        </tbody>
                    ) : users.length === 0 || users.every(user => user.days.length === 0) ? (
                        <tbody>
                            <tr>
                                <td colSpan={3} style={{ textAlign: "center" }}>
                                    Nada por enquanto...
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {users.filter(user => {
                                const userDays = user.days.map(day => day.day);
                                return userDays.includes(selectedDay);
                            }).sort((a, b) => {
                                const dayA = a.days.find(day => day.day === selectedDay);
                                const dayB = b.days.find(day => day.day === selectedDay);

                                if (!dayA.won && dayB.won) return 1;
                                if (dayA.won && !dayB.won) return -1;

                                if (dayA.tries > dayB.tries) return 1;
                                if (dayA.tries < dayB.tries) return -1;

                                if (dayA.submitedAt > dayB.submitedAt) return 1;
                                if (dayA.submitedAt < dayB.submitedAt) return -1;

                                return 0;
                            }).map((user, i) => {
                                const userDay: Day = user.days.find(day => day.day === selectedDay);

                                return (
                                    <tr key={user.id}>
                                        <td>{i + 1}</td>
                                        <td>{user.nickname}</td>
                                        <td>{userDay.won ? userDay.tries : "💀"}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
                </table>
            </main>
        </>
    );
};

export default Index;
