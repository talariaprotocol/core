// app/api/kyc/route.ts
import { NextRequest, NextResponse } from "next/server";
import {getUserAction} from "~~/repository/user/getUser.action";
import {updateUserAction} from "~~/repository/user/updateUser.action";
import {UserStatus} from "~~/types/entities/user";
import {MetamapStatusEnum} from "~~/types/entities/user";
import {getCuilFromDni} from "~~/utils/cuil";

export async function POST(req: NextRequest) {
  const { extraData, status, verified, data } = await req.json();
  console.log(`CallbackMetamap: ${extraData}, ${status}, ${verified}, ${data} }`);
  const { walletId } = extraData;
  const { documentNumber } = data;
  try {
    const user = await getUserAction(walletId);
    if (!user) {
      throw new Error("User not found")
    }
    switch (status) {
      case MetamapStatusEnum.VERIFIED:
        const sex =  data.Sex ?  data.Sex.toLowerCase() : "m"
        const [cuil, firstTwo, dniNumber, lastDigit] = getCuilFromDni(documentNumber, sex);
        await updateUserAction({ id: user.id, status: UserStatus.done, document: cuil });
        break;
      case MetamapStatusEnum.REJECTED:
      case MetamapStatusEnum.REVIEW_NEEDED:
        await updateUserAction({ id: user.id, status: UserStatus.error });
        break;
      case MetamapStatusEnum.WAITING:
        await updateUserAction({ id: user.id, status: UserStatus.pending_validation });
        break;
    }
    return NextResponse.json({ message: "user update successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error updating user with kyc", error }, { status: 500 });
  }
}
