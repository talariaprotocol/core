import React from "react";
import Image from "next/image";
import { FaTelegram } from "react-icons/fa6";
import TalariaLogo from "~~/public/brand/Logo Files/For Web/logo solo/SvgjsG16257.png";

const Footer = () => {
  return (
    <footer className="bg-white py-4 px-6 border-t border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image src={TalariaLogo} alt="Talaria Logo" width={24} height={24} />
          <p className="text-sm text-gray-600">All rights reserved.</p>
        </div>
        <div className="flex items-center space-x-4">
          <a href="https://t.me/+GkoZCLZW9Qg5MTAx" target="_blank" rel="noopener noreferrer">
            <FaTelegram />
          </a>
          <a href="https://docs.talariaprotocol.xyz" target="_blank" rel="noopener noreferrer">
            Docs
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
