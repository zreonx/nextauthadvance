import ResetPasswordForm from "@/app/components/ResetPasswordForm";
import { verifyJwt } from "@/lib/jwt";
import React from "react";

interface IResetPassword {
  params: {
    jwt: string;
  };
}
export default function ResetPassword({ params }: IResetPassword) {
  const payload = verifyJwt(params.jwt);

  if (!payload)
    return (
      <div className='flex justify-center items-center text-2xl mt-12 text-red-500 '>
        The url is not valid
      </div>
    );
  return (
    <div className='max-w-lg w-full px-8 mt-8 md:w-[70%] mx-auto'>
      <ResetPasswordForm jwtUserId={params.jwt} />
    </div>
  );
}
