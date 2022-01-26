import { useEffect, useState } from "react";
import { User } from "../models";
import { SubmitDaysRequestBody } from "../pages/api/submit-day";
import { getCurrentDate, nanoid } from "../utils";

export type ModalType = "info" | "input" | null;

interface ModalProps {
    modal: ModalType;
    onClose: () => void;
    sampleCode?: string;
}

const Modal: React.FC<ModalProps> = ({
    modal,
    onClose,
    sampleCode = nanoid(),
}) => {
    const [code, setCode] = useState<string>();

    useEffect(() => {
        setCode(window.localStorage.getItem("code"));
    }, []);

    useEffect(() => {
        window.localStorage.setItem("code", code);
    }, [code]);

    const [_, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [user, setUser] = useState<User>();

    const [won, setWon] = useState<boolean>(true);
    const [tries, setTries] = useState<number>(4);
    const [word, setWord] = useState<string>();
    const [nickname, setNickname] = useState<string>();

    const [sent, setSent] = useState<boolean>(false);

    useEffect(() => setNickname(user?.nickname ?? undefined), [user]);

    return (
        <div id="modal">
            <div id="help" className={modal === "info" ? "show" : ""}>
                <div onClick={onClose} id="modalclose">x</div>

                <p>
                    Este é um ranking para o jogo de advinhação de palavras <a href="https://term.ooo/" target="_blank" rel="noopener noreferrer">Termo</a> e foi desenvolvido por <a href="https://luisfelipesdn12.now.sh/" target="_blank" rel="noopener noreferrer">Luis Felipe</a>.
                </p>

                <p>
                    <a href="https://term.ooo/" target="_blank" rel="noopener noreferrer">Termo</a> foi inspirado no <a href="https://www.powerlanguage.co.uk/wordle/" target="_blank" rel="noopener noreferrer">Wordle</a> desenvolvido por <a href="https://fserb.com/" target="_blank" rel="noopener noreferrer">Fernando Serboncini</a>.
                </p>

                <hr />

                <p>
                    A partir do código que foi fornecido, você tem acesso à "sua conta" para adicionar suas estatísticas da palavra de hoje. Exemplo de código:
                </p>

                <div className="example">
                    {sampleCode.split("").map((letter, i) => (
                        <span key={i} role="text" className="letter">
                            {letter}
                        </span>
                    ))}
                </div>

                <hr />

                <p>
                    <b>Termo Rank</b> é um projeto em <a href="https://github.com/luisfelipesdn12/termo-rank" target="_blank" rel="noopener noreferrer">código aberto</a> feito por <a href="https://luisfelipesdn12.now.sh/" target="_blank" rel="noopener noreferrer">Luis Felipe</a>.
                </p>
            </div>
            <div id="input-modal" className={modal === "input" ? "show" : ""}>
                <div onClick={onClose} id="modalclose">x</div>

                <h2>Enviar resultados</h2>
                <p style={{ marginTop: 0 }}>
                    do dia {getCurrentDate()}
                    {user && (<><br /> para {user.nickname}</>)}
                </p>

                {!user && <form onSubmit={(e) => {
                    e.preventDefault();

                    setLoading(true);
                    setError(undefined);
                    fetch("/api/user?id=" + code)
                        .then((res) => {
                            if (res.status === 200) {
                                return res.json();
                            }

                            setUser(undefined);

                            if (res.status === 404) {
                                throw new Error("Código inválido");
                            }

                            throw new Error("Erro ao buscar usuário");
                        })
                        .then(setUser)
                        .catch(e => setError(e.message))
                        .finally(() => setLoading(false));
                }}>
                    <label htmlFor="code">Digite seu código:</label>
                    <br />
                    <input
                        value={code} required
                        placeholder={sampleCode}
                        maxLength={8} minLength={8}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    {error && <p className="error">{error}</p>}
                    <br />
                    <button type="submit">
                        Entrar
                    </button>
                </form>}

                {!sent && user && <form onSubmit={(e) => {
                    e.preventDefault();

                    const body: Partial<SubmitDaysRequestBody> = {
                        won: won,
                        userId: code,
                        newNickname: nickname && nickname !== "" ? nickname : undefined,
                        tries: won ? tries : 6,
                        word: won ? word : undefined,
                    };

                    setLoading(true);
                    fetch("/api/submit-day", {
                        method: "POST",
                        body: JSON.stringify(body),
                    }).then(res => {
                        if (res.status === 200) {
                            setSent(true);
                            return;
                        }

                        throw new Error("Erro ao enviar resultados");
                    }).catch(e => {
                        console.error(e);
                        setError(e.message);
                    }).finally(() => setLoading(false));
                }}>
                    <label htmlFor="won">Você conseguiu advinhar a palavra?</label>
                    <br />
                    <div role="list" className="row">
                        <div
                            onClick={() => setWon(true)}
                            className={"option letter " + (won ? "right" : "empty")}
                        >
                            Sim
                        </div>
                        <div
                            onClick={() => setWon(false)}
                            className={"option letter " + (won ? "empty" : "right")}
                        >
                            Não
                        </div>
                    </div>

                    {won && <>
                        <br />
                        <label htmlFor="trie">Em quantas tentativas?</label>
                        <div role="list" className="row">
                            {[1, 2, 3, 4, 5, 6].map((trie, i) => (
                                <div
                                    key={i}
                                    onClick={() => setTries(trie)}
                                    className={"option letter " + (tries === trie ? "right" : "empty")}
                                >
                                    {trie}
                                </div>
                            ))}
                        </div>
                        <br />
                        <label htmlFor="word">Qual foi a palavra? (opcional)</label>
                        <input
                            id="word"
                            name="word"
                            maxLength={5}
                            minLength={5}
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                        />
                        <br />
                    </>}

                    <br />
                    <label htmlFor="nickname">Alterar nickname (opcional)</label>
                    <input
                        id="nickname"
                        name="nickname"
                        maxLength={20}
                        value={nickname}
                        style={{ textTransform: "none" }}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <br />

                    {error && <p className="error">{error}</p>}

                    <br />
                    <button type="submit">
                        Enviar
                    </button>
                </form>}

                {sent && <>
                    <p>
                        Resultados enviados!
                    </p>
                </>}
            </div>
        </div>
    );
};

export default Modal;
