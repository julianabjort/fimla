import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex w-full mt-16 border-t-2 center h-36">
      <h3>
        Built with &#128156; by
        <Link href="https://github.com/julianabjort"> @julianabjort </Link>
        and
        <Link href="https://github.com/Laaufey"> @laaufey </Link>
      </h3>
    </div>
  );
};

export default Footer;
