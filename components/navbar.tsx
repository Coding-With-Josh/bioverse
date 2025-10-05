import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <div className="flex items-center bg-black/30 z-[5000000] fixed w-screen backdrop-blur-md justify-between lg:px-[5rem] px-3 py-5">
      <div className="flex items-center justify-center gap-4">
        <Image src={require("@/assets/logo.png")} alt="Logo" width={40} />
        <h1 className="font-sans font-bold text-xl">BioVerse<   /h1>
      </div>
      <Link href="/sign-in">
        <Button>Sign in</Button>
      </Link>
    </div>
  );
};

export default Navbar;
