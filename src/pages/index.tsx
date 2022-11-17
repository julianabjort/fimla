import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { games } from "../data/paths";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <h1>Loading..</h1>;
  }

  return (
    <>
      <section className="w-full grid grid-cols-2 grid-rows-auto gap-2">
        {React.Children.toArray(
          games.map((link) => (
            <Link href={link.path}>
              <div className="flex w-full h-64 bg-lighter dark:bg-darker rounded-md items-center justify-center">
                <div className="flex gap-x-4 p-4 items-center">
                  <div className="w-10 h-10 rounded-md bg-light dark:bg-dark"></div>
                  <h2 className="heading-2">{link.name}</h2>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>

      {session ? (
        <p>Signed in as {session.user?.name}</p>
      ) : (
        <p>Not signed in</p>
      )}
    </>
  );
}
