import { StaticImageData } from "next/image";
import MorphLogo from "~~/public/logos/Morph.logo-Green.png";
import ChilizLogo from "~~/public/logos/chiliz-logo.png";
import ChilizTokenLogo from "~~/public/logos/chz-token.png";
import KintoLogo from "~~/public/logos/kinto-logo.png";
import LayerZero from "~~/public/logos/layer-zero-logo.png";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:" + process.env.PORT;

// Url that includes this slug, will not display connect button
export const CUSTOM_WALLET_PAGES = ["kinto"];

export const KINTO_BASE_URL = `dev.kinto.xyz:${process.env.PORT}`;

export const projects: {
  id: number;
  title: string;
  description: string;
  imgSrc: StaticImageData;
  url: string;
}[] = [
  // {
  //   id: 1,
  //   title: "BCN Token Distribution 🎉",
  //   description:
  //     "The BCN team can distribute tokens to users simply by sharing a code. Are you a team? Create codes to send to your members! Are you a member? Enter your code to get your BCN Token instantly, using any wallet of your choice.",
  //   imgSrc: ChilizLogo,
  //   url: "chiliz",
  // },
  // {
  //   id: 2,
  //   title: "Chiliz Match Ticket Transfer 🎟️",
  //   description:
  //     "Welcome to the MatchTicket Platform! Create a unique access code for an event or redeem a code you’ve received. Whether you're an organizer issuing tickets or a fan securing your spot, it's simple and secure.",
  //   imgSrc: ChilizTokenLogo,
  //   url: "chiliz-ticket",
  // },
  // {
  //   id: 3,
  //   title: "LayerZero Giftcard 💳",
  //   description:
  //     "Send a giftcard across any chain—no need to know where it will be claimed. Just give the code, and the recipient can claim it like magic, on any chain.",
  //   imgSrc: LayerZero,
  //   url: "layerZero",
  // },
  // {
  //   id: 4,
  //   title: "MorphL2 🚀",
  //   description:
  //     "Grant early access to your startup’s key features with a code. Share exclusive access with your favorite users and supporters.",
  //   imgSrc: MorphLogo,
  //   url: "morph",
  // },
  // {
  //   id: 5,
  //   title: "Kinto World Champion NFT 🏆",
  //   description:
  //     "Claim your exclusive World Champion NFT via Kinto L2! Only available for Argentinian champions. Chain-validated. Don’t miss out on history!",
  //   imgSrc: KintoLogo,
  //   url: "kinto",
  // },
];
