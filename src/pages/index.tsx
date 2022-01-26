import { GetServerSideProps, NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { GoMarkGithub } from "react-icons/go";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import Modal, { ModalType } from "../components/Modal";
import { Day, User } from "../models";
import { getCurrentDate, nanoid } from "../utils";
import { WordForTheDaySuccessReturn } from "./api/word";
import useSWR from "swr";

interface IndexPageProps {
    sampleCode: string;
}

const Index: NextPage<IndexPageProps> = ({ sampleCode }) => {
    const [allDays, setAllDays] = useState<string[]>([]);
    const [selectedDay, setSelectedDay] = useState<string>(getCurrentDate());
    const [modal, setModal] = useState<ModalType>();
    const [wordForTheDay, setWordForTheDay] = useState<WordForTheDaySuccessReturn>();
    const [wordsForTheDaysBank, setWordsForTheDaysBank] = useState<WordForTheDaySuccessReturn[]>([]);
    const [loadingWordForTheDay, setLoadingWordForTheDay] = useState<boolean>(true);

    const [lastUsers, setLastUsers] = useState<User[]>();

    const {
        data: users = lastUsers,
        error, mutate: mutateUsers,
    } = useSWR<User[]>("/api/users", async (url) => {
        return await fetch(url)
            .then(res => res.json())
            .then(users => {
                setLastUsers(users);
                return users;
            });
    });

    const loading = useMemo(() => !error && !users, [error, users]);

    // Get all days that have been played
    useEffect(() => {
        if (users) {
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
        }
    }, [users]);

    // Get the word for the day if it's not already loaded
    useEffect(() => {
        setLoadingWordForTheDay(true);

        if (selectedDay && selectedDay !== getCurrentDate()) {
            if (wordsForTheDaysBank.some(w => w.day === selectedDay)) {
                setWordForTheDay(wordsForTheDaysBank.find(w => w.day === selectedDay));
                setLoadingWordForTheDay(false);
            } else {
                fetch(`/api/word?day=${selectedDay}`)
                    .then(res => res.json())
                    .then((wordForTheDay: WordForTheDaySuccessReturn) => {
                        setWordForTheDay(wordForTheDay);
                        setWordsForTheDaysBank(prev => [...prev, wordForTheDay]);
                    })
                    .catch(console.error)
                    .finally(() => setLoadingWordForTheDay(false));
            }
        } else {
            setWordForTheDay(undefined);
            setLoadingWordForTheDay(false);
        }
    }, [selectedDay]);

    // Close the modal on click outside or ESC
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const element = event.target as HTMLElement;
            if (!element.closest("#modal")) {
                setModal(undefined);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setModal(undefined);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <>
            <header>
                <div>
                    <button
                        onClick={() => setModal(modal === "info" ? null : "info")}
                        aria-label="sobre" id="how" title="Sobre"
                    >
                        ?
                    </button>
                    <button
                        onClick={() => open("https://github.com/luisfelipesdn12/termo-rank")}
                        aria-label="github" id="github" title="Github"
                    >
                        <GoMarkGithub
                            size="3vh"
                            color="#b7aeb4"
                        />
                    </button>
                </div>
                <h1>Termo Rank</h1>
                <button
                    onClick={() => setModal(modal === "input" ? null : "input")}
                    aria-label="entrar" id="prestats_button" title="Entrar"
                >
                    <MdArrowForward
                        size="3vh"
                        color="#b7aeb4"
                    />
                </button>
            </header>
            <Modal
                modal={modal}
                onClose={() => {
                    setModal(null);
                    mutateUsers();
                }}
                sampleCode={sampleCode}
            />
            <main>
                <div className="day-header">
                    <MdArrowBack
                        onClick={() => {
                            setSelectedDay(allDays[allDays.findIndex(d => d === selectedDay) - 1]);
                        }}
                        className={
                            loading || allDays.findIndex(d => d === selectedDay) === 0 ?
                                "inactive" : ""
                        }
                    />
                    <h2>Para o dia {selectedDay}</h2>
                    <MdArrowForward
                        onClick={() => {
                            setSelectedDay(allDays[allDays.findIndex(d => d === selectedDay) + 1]);
                        }}
                        className={
                            loading || allDays.findIndex(d => d === selectedDay) === allDays.length - 1 ?
                                "inactive" : ""
                        }
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
                                    <tr key={i}>
                                        <td>{i + 1}{i === 0 ? " 🥇" : i === 1 ? " 🥈" : i === 2 && " 🥉"}</td>
                                        <td>{user.nickname}</td>
                                        <td>{userDay.won ? userDay.tries : "💀"}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
                </table>
                {!loadingWordForTheDay && selectedDay !== getCurrentDate() && <div id="word-for-the-day">
                    {wordForTheDay && wordForTheDay.word ? <>
                        <p>Palavra:</p>
                        <h2>{wordForTheDay.word}</h2>
                        {wordForTheDay.inputs && wordForTheDay.inputs.length > 1 && (
                            <p id="word-inputs">{wordForTheDay.inputs.map(input => {
                                return `${input.word} (${input.count})`;
                            }).join(", ")}</p>
                        )}
                    </> : <p id="no-info-word">Sem informações de qual palavra foi :/</p>}
                </div>}
            </main>
        </>
    );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {
            sampleCode: nanoid(),
        },
    };
};
