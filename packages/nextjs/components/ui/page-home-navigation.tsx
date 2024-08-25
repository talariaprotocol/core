"use client";

import React from "react";
import Link from "next/link";
import { Input } from "./input";
import { Building2Icon, PersonStandingIcon } from "lucide-react";

const PageHomeNavigation = ({ application, title }: { application: string; title: string }) => {
  const [code, setCode] = React.useState("");
  return (
    <div className="container flex flex-col gap-40">
      <h1 className="text-4xl font-bold">{title}</h1>

      <div className="flex gap-28 justify-center">
        <Link
          className="p-10 bg-card  flex justify-center items-center border rounded-2xl"
          href={`/${application}/owner`}
        >
          <Building2Icon className="w-40 h-40" />
        </Link>
        <Link
          className="p-10 bg-card flex flex-col justify-center items-center border rounded-2xl"
          href={code ? `/${application}/user/${code}` : ""}
        >
          <PersonStandingIcon className="w-40 h-40" />
          <Input value={code} placeholder="Enter your code" onChange={e => setCode(e.target.value)} />
        </Link>
      </div>
    </div>
  );
};

export default PageHomeNavigation;
