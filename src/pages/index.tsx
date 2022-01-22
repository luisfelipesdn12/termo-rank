import { NextPage } from "next";
import { useEffect, useState } from "react";
import { User } from "../models";
import { MdInput, MdArrowForward } from "react-icons/md";

const Index: NextPage = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        setLoading(true);
        fetch("/api/user")
            .then(res => res.json())
            .then((users: User[]) => {
                return users;
            })
            .then(setUsers)
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <header>
                <button onClick={() => setModalOpen(true)} aria-label="sobre" id="how">?</button>
                <h1>Termo Rank</h1>
                <button aria-label="entrar" id="prestats_button">
                    <MdArrowForward
                        size="3vh"
                        color="#b7aeb4"
                    />
                </button>
            </header>
            <div id="modal">
                <div id="help" className={modalOpen ? "show" : ""}>
                    <div onClick={() => setModalOpen(false)} id="helpclose">x</div>

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
                        {new User().id.split("").map((letter, i) => (
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
            </div>
            <main>

            </main>
        </>
    );
};

export default Index;
