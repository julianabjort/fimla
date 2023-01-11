import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { SwitchTransition, Transition } from "react-transition-group";
import gsap from "gsap";
import { useRef, createRef } from "react";
import { useRouter } from "next/router";

const Layout = ({ children }: any) => {
  const router = useRouter();
  const nodeRef = useRef(null);
  const onPageEnter = (node) => {
    gsap.fromTo(
      node,
      {
        opacity: 0,
        autoAlpha: 0,
        ease: "power3",
      },
      {
        autoAlpha: 1,
        opacity: 1,
        duration: 1,
        ease: "power3",
      }
    );
  };

  const onPageExit = (node) => {
    gsap.fromTo(
      node,
      {
        opacity: 1,
        autoAlpha: 1,
        ease: "power3.out",
      },
      {
        autoAlpha: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
      }
    );
  };
  return (
    <div className="mx-6 md:mx-20">
      <Header />
      <SwitchTransition>
        <Transition
          key={router.pathname} // our route as a key
          timeout={500}
          in={true}
          onEnter={onPageEnter} // our enter animation
          onExit={onPageExit} // our exit animation
          mountOnEnter={true}
          unmountOnExit={true}
        >
          <div className="flex flex-col justify-around md:mx-20 lg:mx-36">
            {children}
            <Footer />
          </div>
        </Transition>
      </SwitchTransition>
    </div>
  );
};

export default Layout;
