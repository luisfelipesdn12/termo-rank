import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../style/main.css'

export default function TermoRank({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Termo Rank</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet" />
                <link rel="shortcut icon" href="/icon.png" />

                {/* <!-- Primary Meta Tags --> */}
                <title>Termo Rank</title>
                <meta name="title" content="Termo Rank" />
                <meta name="description" content="Este é um ranking para o jogo de advinhação de palavras Termo e foi desenvolvido por Luis Felipe.

Termo foi inspirado no Wordle desenvolvido por Fernando Serboncini.

A partir do código que foi fornecido, você tem acesso à sua conta para adicionar suas estatísticas da palavra de hoje."/>

                {/* <!-- Open Graph / Facebook --> */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://termo-rank.vercel.app/" />
                <meta property="og:title" content="Termo Rank" />
                <meta property="og:description" content="Este é um ranking para o jogo de advinhação de palavras Termo e foi desenvolvido por Luis Felipe.

Termo foi inspirado no Wordle desenvolvido por Fernando Serboncini.

A partir do código que foi fornecido, você tem acesso à sua conta para adicionar suas estatísticas da palavra de hoje."/>
                <meta property="og:image" content="" />

                {/* <!-- Twitter --> */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://termo-rank.vercel.app/" />
                <meta property="twitter:title" content="Termo Rank" />
                <meta property="twitter:description" content="Este é um ranking para o jogo de advinhação de palavras Termo e foi desenvolvido por Luis Felipe.

Termo foi inspirado no Wordle desenvolvido por Fernando Serboncini.

A partir do código que foi fornecido, você tem acesso à sua conta para adicionar suas estatísticas da palavra de hoje."/>
                <meta property="twitter:image" content="" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
