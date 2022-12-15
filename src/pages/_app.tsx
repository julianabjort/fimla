import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import Layout from "../components/Layout";
import { Manrope } from "@next/font/google";

const manrope = Manrope({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider attribute="class">
        <main className={manrope.className}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </main>
      </ThemeProvider>
    </SessionProvider>
  );
}
