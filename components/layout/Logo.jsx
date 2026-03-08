import React from "react";
import Link from "next/link";
import { HOME_URL } from "@/lib/constants";

const Logo = () => {
  return (
    <Link href={HOME_URL} className="flex items-center uppercase">
      <span className="text-lg ">trak</span>
      <span className="text-lg text-brand">dayr</span>
    </Link>
  );
};

export default Logo;
