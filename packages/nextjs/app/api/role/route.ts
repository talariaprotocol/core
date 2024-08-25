import { NextResponse } from "next/server";
import { status } from "nprogress";
import { getProofsByAddress } from "~~/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address || Array.isArray(address)) {
    return NextResponse.json({ status: 400, error: "Address is required" });
  }

  const proofs = await getProofsByAddress(address);
  console.log("Proofs", proofs);

  if (!proofs) return NextResponse.json({ status: 404, error: "No proofs found" });
  
  return NextResponse.json({ status: 200, proofs });
}