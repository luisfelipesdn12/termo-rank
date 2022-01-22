import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../style.css'

export default function TermoRank({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Termo Rank</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
