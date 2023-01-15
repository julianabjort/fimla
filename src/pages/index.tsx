import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { games } from "../data/paths";
import Head from "next/head";
import GameCard from "../components/GameCard";
import LoadingIcon from "../components/LoadingIcon";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingIcon isPage />;
  }

  return (
    <>
      <Head>
        <title>
          Fimla - Íslenskir orðaleikir - Word games in Icelandic, play wordle,
          quordle, spelling bee and crosswords for free!
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="all" />
        <meta
          name="description"
          content="Word games in Icelandic, play wordle, quordle, spelling bee and crosswords for free"
          key="titleDescription"
        />
        <meta name="keywords" content="wordgames" key="titleKeywords" />
      </Head>

      <section className="grid w-full gap-6 md:gap-3 lg:gap-6 lg:p-6 md:mt-12 sm:grid-cols-2 grid-rows-auto">
        {React.Children.toArray(
          games.map((game) => (
            <Link href={game.path}>
              <GameCard image={game.image} title={game.name} placeholderImg={game.placeholderImg}/>
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
