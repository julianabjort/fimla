import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { navLinks } from "../data/paths";
import { useTheme } from "next-themes";
import { HiSun, HiMoon } from "react-icons/hi";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <nav className="flex justify-between items-center my-10">
      <div className="w-1/3">
        <Link href="/">
          {theme === "light" ? (
            <img src="/logo-light.png" className="w-20" />
          ) : (
            <img src="/logo-dark.png" className="w-20" />
          )}
        </Link>
      </div>

      <div className="w-1/3 flex center gap-x-[10vw]">
        {React.Children.toArray(
          navLinks.map((link) => <Link href={link.path}>{link.name}</Link>)
        )}
      </div>

      <div className="flex w-1/3 gap-x-4 justify-end">
        {session ? (
          <button onClick={() => signOut()}>SIGN OUT</button>
        ) : (
          <button onClick={() => signIn()}>SIGN IN</button>
        )}
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? <HiMoon /> : <HiSun />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
