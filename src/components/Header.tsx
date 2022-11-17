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
    <nav className="sticky top-0 z-50 flex items-center justify-between py-8 bg-background">
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

      <div className="flex justify-end w-1/3 gap-x-4">
        {session ? (
          <button onClick={() => signOut()}>Sign out</button>
        ) : (
          <button onClick={() => signIn()}>Sign in</button>
        )}
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? <HiMoon /> : <HiSun />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
