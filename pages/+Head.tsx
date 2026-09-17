// pages/+Head.tsx

export function Head() {
    return (
        <>
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            <link rel="icon" type="image/svg+xml" href="/logo_jaga.svg" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/manifest.json" />

            <meta name="theme-color" content="#0a0a0a" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Jaga Fight" />
            <meta property="og:locale" content="fr_FR" />

            <link
                rel="preconnect"
                href="https://fonts.googleapis.com"
            />

            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
            />

            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap"
            />
        </>
    )
}