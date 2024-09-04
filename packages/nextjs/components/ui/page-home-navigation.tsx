"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import TornadoAscii from "../assets/TornadoLogo";
import { Input } from "./input";
import { ArrowRightIcon } from "lucide-react";

const PageHomeNavigation = ({
  application,
  title,
  logoSrc,
  subTitle,
}: {
  application: string;
  title: string;
  logoSrc: StaticImageData;
  subTitle: string;
}) => {
  const [code, setCode] = React.useState("");
  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <div className="container justify-center flex items-center gap-32 flex-col lg:flex-row">
        <div className="space-y-4">
          <div className="flex gap-1 items-center">
            <Image src={logoSrc} alt="home-navigation-logo" className="w-24 h-24" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
          </div>
          <p className="text-muted-foreground">{subTitle}</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/${application}/owner`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Create a Code
            </Link>
            <div className="relative flex-1 max-w-48">
              <Input
                type="text"
                placeholder="Enter your code"
                className="pr-12"
                value={code}
                onChange={e => setCode(e.target.value)}
              />
              <Link
                className="absolute top-1/2 right-3 -translate-y-1/2 bg-primary rounded-md p-2"
                href={`/${application}/user/${code}`}
              >
                <ArrowRightIcon className="h-5 w-5 text-primary-foreground" />
              </Link>
            </div>
          </div>
        </div>
        <div className="whitespace-pre font-mono text-center lg:text-[5px] text-[3px]">
          <TornadoAscii />
        </div>
      </div>
    </div>
  );
};

export default PageHomeNavigation;
