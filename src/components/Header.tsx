import Link from "next/link";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { navLinks } from "../data/paths";

const Header = () => {
  const { data: session } = useSession();
  return (
    <nav className="flex justify-between items-center my-10">
      {React.Children.toArray(
        navLinks.map((link) => (
          <Link href={link.path}>
            {link.icon ? (
              <img src={link.icon} className={link.size}></img>
            ) : (
              link.name
            )}
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
