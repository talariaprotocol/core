"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./button";
import { Input } from "./input";
import { useToast } from "./use-toast";
import axios from "axios";
import { CopyIcon, Mail, SendIcon, Twitter } from "lucide-react";

const ShareCode = ({ code, url }: { code: string; url: string }) => {
  const { toast } = useToast();
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const text = `First person redeeming this code will get something for free. Hurry!`;

  const sendEmailApi = async () => {
    try {
      await axios.post("/api/send-code-email", {
        email: inputValue,
        url,
      });
      toast({
        description: "Email sent successfully",
      });
      setInputValue("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex gap-4 justify-center flex-col mt-4 max-w-xs">
      <Link
        href={`${url}`}
        className="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Redeem code
      </Link>
      <div className="flex justify-evenly">
        <CopyIcon
          className="cursor-pointer text-primary h-6 w-6"
          onClick={() => {
            navigator.clipboard.writeText(code);
            toast({ description: "Code copied to clipboard" });
          }}
        />
        <Twitter
          className="cursor-pointer text-primary h-6 w-6"
          onClick={() => {
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
              "_blank",
            );
          }}
        />
        <Mail className="cursor-pointer text-primary h-6 w-6" onClick={() => setShowInput(true)} />
      </div>
      {showInput && (
        <div className="relative flex-1">
          <Input
            value={inputValue}
            onChange={event => setInputValue(event.target.value)}
            placeholder="Enter user email"
            type="text"
            className="pr-12"
          />
          <Button
            className="absolute top-1/2 right-3 -translate-y-1/2 bg-primary rounded-md p-2"
            onClick={sendEmailApi}
          >
            <SendIcon className="h-5 w-5 text-primary-foreground" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShareCode;
