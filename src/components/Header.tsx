import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { navLinks, games } from "../data/paths";
import { useTheme } from "next-themes";
import { HiSun, HiMoon, HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  // Mobile menu
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

  // Dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const showDropdown = () => {
    dropdownOpen ? setDropdownOpen(false) : setDropdownOpen(true);
  };

  const dropdown = () => {
    return (
      <div className="flex flex-col w-36 rounded-xl bg-light dark:bg-dark">
        {React.Children.toArray(
          games.map((link) => (
            <Link
              onClick={() => setDropdownOpen(false)}
              href={link.path}
              className="p-3 hover:bg-medium hover:dark:bg-darker"
            >
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

        <div className="relative items-center hidden w-3/5 justify-evenly md:flex">
          <div className="absolute top-8 left-12">
            {dropdownOpen ? dropdown() : ""}
          </div>
          {React.Children.toArray(
            navLinks.map((link) => {
              const active =
                router.pathname === link.path ? "border-b border-black" : "";
              return (
                <div>
                  {link.dropdown === true ? (
                    <div
                      onClick={showDropdown}
                      className={`${active} cursor-pointer`}
                    >
                      {link.name}
                    </div>
                  ) : (
                    <Link className={`${active}`} href={link.path}>
                      {link.name}
                    </Link>
                  )}
                </div>
              );
            })
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
