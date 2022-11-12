import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  console.log("session", session);
  if (status === "loading") {
    return <h1>Loading..</h1>;
  }
  if (session) {
    return (
      <>
        <div>Signed in as {session.user?.email}</div>
        <button type="button" onClick={() => signOut()}>
          Sign out
        </button>
      </>
    );
  }
  return (
    <div>
      <div>
        <h1>Not signed in</h1>
      </div>
      <button type="button" onClick={() => signIn()}>
        Sign in
      </button>
    </div>
  );
}
