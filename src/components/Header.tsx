import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { navLinks } from "../data/paths";
import { useTheme } from "next-themes";
import { HiSun, HiMoon, HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/router";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showMobileMenu = () => {
    mobileMenuOpen ? setMobileMenuOpen(false) : setMobileMenuOpen(true);
  };
  const mobileMenu = () => {
    return (
      <div className="flex flex-col w-full text-center md:hidden">
        {React.Children.toArray(
          navLinks.map((link) => (
            <Link href={link.path} className="py-6 text-xl border-y">
              {link.name}
            </Link>
          ))
        )}
      </div>
    );
  };
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const router = useRouter();
  return (
    <div>
      <nav className="sticky top-0 z-50 flex items-center justify-between py-8 dark:bg-background">
        <div className="w-1/5">
          <Link href="/">
            {theme === "light" ? (
              <img src="/logo-light.png" className="w-20" />
            ) : (
              <img src="/logo-dark.png" className="w-20" />
            )}
          </Link>
        </div>

        <div className="items-center hidden w-3/5 justify-evenly md:flex">
          {React.Children.toArray(
            navLinks.map((link) => {
              const active = router.pathname === link.path
              ? "border-b border-black"
              : ""
              return (
              <Link className={`${active}`} href={link.path}>
                {link.name}
              </Link>
            )})
          )}
        </div>

        <div className="flex justify-end w-1/5 gap-x-4">
          <div className="hidden md:block">
            {session ? (
              <button onClick={() => signOut()}>Sign out</button>
            ) : (
              <button onClick={() => signIn()}>Sign in</button>
            )}
          </div>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <HiMoon /> : <HiSun />}
          </button>

          <button
            onClick={() => {
              showMobileMenu();
            }}
            className="col-span-2 text-xl text-center md:hidden"
          >
            {mobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </nav>
      {mobileMenuOpen ? mobileMenu() : ""}
    </div>
  );
};

export default Header;
