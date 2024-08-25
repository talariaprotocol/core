"use client";

import { FormEvent, use, useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Copy, CreditCard, File, ListFilter, MoreVertical, Truck } from "lucide-react";
import { NextPage } from "next";
import QRCode from "qrcode.react";
import { useAccount } from "wagmi";
import { useRole } from "~~/components/ScaffoldEthAppWithProviders";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~~/components/ui/dropdown-menu";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { Pagination, PaginationContent, PaginationItem } from "~~/components/ui/pagination";
import { Progress } from "~~/components/ui/progress";
import { Separator } from "~~/components/ui/separator";
import { Switch } from "~~/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";
import { useToast } from "~~/components/ui/use-toast";
import {
  Role,
  getNationalityCredentialProofRequest,
  getOldRoleCredentialProofRequest,
  getRoleCredentialProofRequest,
} from "~~/utils/privadoId/identities";

const Home: NextPage = () => {
  const { address } = useAccount();

  const [QR, setQR] = useState<string>("");
  const [proof, setProof] = useState<any>("");

  useEffect(() => {
    if (!address) return;
    getRoleCredentialProofRequest(address).then(request => {
      setQR(JSON.stringify(request));
    });
  }, [address]);

  const roleContext = useRole();

  const [polling, setPolling] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const checkRole = async () => {
    console.log("role", roleContext?.role);
    fetch("/api/role?address=" + address)
      .then(res => res.json())
      .then(data => {
        setPolling(false);
        setProof(data);
        console.log("roles from backend: ", data);
        const dataRoles = data as {
          data: {
            role: Role;
          }[];
        };

        if (!dataRoles?.data || dataRoles?.data.length === 0) {
          return;
        }

        roleContext?.setRole({ ...roleContext, role: dataRoles?.data[0].role });
        setIsDialogOpen(false); // Close the dialog when role is set
      })
      .catch(error => {
        console.error("Error fetching roles: ", error);
      });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (polling) {
      checkRole(); // Check immediately
      interval = setInterval(checkRole, 2000); // Check every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [polling]);

  useEffect(() => {
      setPolling(false);
    
  }, []);

  const getNFT = async () => {
    console.log("Getting NFT", "data", proof);
  };

  return (
    <>
      {!roleContext?.role.role ? (
        <div>
          <h1>🇦🇷 Welcome Aleph Citizens! - Please Verify yourself to get your badge. 🇦🇷</h1>

          <QRCode
            // size={256}
            height={100}
            width={100}
            style={{ maxHeight: "400px", maxWidth: "400px" }}
            value={QR ?? ""}
            viewBox={`0 0 256 256`}
          />
        </div>
      ) : (
        <>
          <h1>🇦🇷 Welcome Aleph Citizen! - You are verified as founder! 🇦🇷</h1>

          <Button onClick={() => getNFT().catch(error => console.error(error))}> Get your Badge! </Button>
        </>
      )}
    </>
  );
};

export default Home;
