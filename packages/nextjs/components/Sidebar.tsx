import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, Tornado } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~~/components/ui/tooltip";
import { projects } from "~~/constants";

const CustomSidebar = () => {
  // Get current page
  const pathname = usePathname();

  return (
    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5 h-full">
      <Link
        href="/"
        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
      >
        <Tornado className="h-4 w-4 transition-all group-hover:scale-110" />
        <span className="sr-only">Tornado Codes</span>
      </Link>
      {projects.map(project => (
        <Tooltip key={project.id}>
          <TooltipTrigger asChild>
            <Link
              href={`/${project.url}`}
              className={`${
                pathname.startsWith(project.url) ? "bg-accent" : ""
              }  flex flex-col h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8`}
            >
              <Image src={project.imgSrc} alt={project.title} className="h-10 w-auto" />
              <span className="sr-only">{project.title}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{project.title}</TooltipContent>
        </Tooltip>
      ))}
      {/* Bottom, Help */}
      <div className="flex flex-col items-center gap-4 absolute bottom-2 w-full p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="https://docs.google.com/presentation/d/12PwnsFwsrl054mIC5i5yWiceh10vNPuxJU4zGZ7LStU/pub?start=false&loop=false&delayms=3000"
              target="_blank"
            >
              <HelpCircle></HelpCircle>
              {/* <Image className="h-7 w-7" src={HelpCircle} alt="kinto-logo" /> */}
              <span className="sr-only">About & Help</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">About & Help</TooltipContent>
        </Tooltip>
      </div>
    </nav>
  );
};

export { CustomSidebar };
