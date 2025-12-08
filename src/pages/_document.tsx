// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth" style={{ colorScheme: "light" }}>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
