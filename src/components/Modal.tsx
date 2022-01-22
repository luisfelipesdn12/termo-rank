import { User } from "../models";
import { nanoid } from "../utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
}) => (
    <div id="modal">
        <div id="help" className={isOpen ? "show" : ""}>
            <div onClick={onClose} id="helpclose">x</div>

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
                {nanoid().split("").map((letter, i) => (
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
);

export default Modal;
