import { GetServerSideProps, NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";

interface CreateProps {
    token?: string;
}

const Create: NextPage<CreateProps> = ({ token }) => {
    const router = useRouter();

    const [error, setError] = useState<string>();
    const [nickname, setNickname] = useState<string>();
    const [userCode, setUserCode] = useState<string>();

    useEffect(() => {
        if (!token) {
            router.push("/");
        }
    }, []);

    return (
        <>
            <header>
                <button onClick={() => router.push("/")} aria-label="entrar" id="prestats_button">
                    <MdArrowBack
                        size="3vh"
                        color="#b7aeb4"
                    />
                </button>
                <h1>Termo Rank</h1>
                <span></span>
            </header>
            <main>
                <h2>Adicionar usuário</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();

                    if (nickname) {
                        fetch("/api/create?nickname=" + nickname, {
                            method: "POST",
                            headers: {
                                "Authorization": "Bearer " + token,
                            },
                        })
                            .then(res => res.json())
                            .then(res => setUserCode(res.code))
                            .catch(err => setError(err.message))
                    }
                }}>
                    <label htmlFor="nickname">Digite o nickname:</label>
                    <br />
                    <input
                        required
                        type="text"
                        name="nickname"
                        minLength={3}
                        maxLength={20}
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        style={{ textTransform: "none" }}
                    />
                    {error && <p className="error">{error}</p>}
                    <br />
                    <button type="submit">
                        Criar
                    </button>
                </form>
                {userCode && <h2
                    className="copyable"
                    onClick={(e) => {
                        const element = e.target as HTMLHeadingElement;
                        element.style.color = "#3aa394";
                        window.navigator.clipboard.writeText(userCode);

                        setTimeout(() => {
                            element.style.color = "#fff";
                        }, 1000);
                    }}
                    style={{ userSelect: "text" }}
                >
                    {userCode}
                </h2>}
            </main>
        </>
    );
};

export default Create;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const token = ctx.req.cookies.termo_rank_auth_token;

    return { props: { token: token || null } };
}
