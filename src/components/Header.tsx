import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { navLinks } from "../data/paths";
import { useTheme } from "next-themes";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <nav className="flex justify-between items-center my-10">
      {React.Children.toArray(
        navLinks.map((link) => (
          <Link href={link.path}>
            {link.icon ? (
              <img src={link.icon} className="h-8"></img>
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
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? "dark" : "light"}
      </button>
    </nav>
  );
};

export default Header;
