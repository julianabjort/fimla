import Link from "next/link";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: "Play",
      path: "",
    },
    {
      name: "Stats",
      path: "/stats",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "FAQ",
      path: "/faq",
    },
  ];
  return (
    <nav className="flex justify-between my-10">
      {React.Children.toArray(
        navLinks.map((link) => (
          <Link href={link.path}>
            <div>{link.name}</div>
          </Link>
        ))
      )}
      {session ? (
        <button onClick={() => signOut()}>Sign out</button>
      ) : (
        <button onClick={() => signIn()}>Sign in</button>
      )}
    </nav>
  );
};

export default Header;
