"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import TornadoAscii from "../components/assets/TornadoLogo";
import { AwardIcon, GiftIcon } from "lucide-react";
import { FileKey2Icon } from "lucide-react";
import { NextPage } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { projects } from "~~/constants";

const Home: NextPage = () => {
  return (
    <section className="w-full">
      <div className="container grid gap-8 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="grid gap-2">
          <div className="flex gap-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Talaria</h2>
              <p className="text-muted-foreground">Address-Free Access Protocol</p>
            </div>
            <div className="whitespace-pre font-mono text-center text-[1.5px]">
              <TornadoAscii />
            </div>
          </div>
        </div>
        <div className="w-full border" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div key={project.id} className="relative group overflow-hidden rounded-lg shadow-lg">
              <Link href={`/${project.url}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {project.title}</span>
              </Link>
              <Image
                src={project.imgSrc}
                alt={project.title}
                width={300}
                height={300}
                className="w-full h-32 object-cover group-hover:opacity-50 transition-opacity"
                style={{ objectFit: "contain" }}
              />
              <div className="p-4 bg-background">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
