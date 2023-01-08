import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { games } from "../data/paths";
import Head from "next/head";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <h1>Loading..</h1>;
  }

  return (
    <>
      <Head>
        <title>
          Fimla - Íslenskir orðaleikir - Word games in Icelandic, play wordle,
          quordle, spelling bee and crosswords for free!
        </title>
        <meta name="robots" content="all" />
        <meta
          name="description"
          content="Word games in Icelandic, play wordle, quordle, spelling bee and crosswords for free"
          key="titleDescription"
        />
        <meta name="keywords" content="wordgames" key="titleKeywords" />
      </Head>

      <section className="grid w-full gap-2 md:mt-12 md:grid-cols-2 grid-rows-auto">
        {React.Children.toArray(
          games.map((link) => (
            <Link href={link.path}>
              <div className="flex items-center justify-center w-full h-48 rounded-md md:h-64 bg-lighter dark:bg-darker">
                <div className="flex items-center p-4 gap-x-4">
                  <div className="w-10 h-10 rounded-md bg-light dark:bg-dark"></div>
                  <h2 className="heading-2">{link.name}</h2>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
      <div className="mt-6">
        {session && <p>Signed in as {session.user?.name}</p>}
      </div>
    </>
  );
}
