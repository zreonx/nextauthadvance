import React from "react";
import { Image, Link } from "@nextui-org/react";
import SignUpForm from "@/app/components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className='grid grid-cols-1 place-items-center items-center gap-3'>
      <div className='md:col-span-2 flex flex-col gap-3 px-8 md:px-2 justify-center items-center'>
        <h2 className='text-lg font-semibold mt-8 self-start'>Sign Up Form</h2>
        <SignUpForm />
      </div>

      {/* <Image src='/login.png' alt='Login Form' width={500} height={500} /> */}
    </div>
  );
}
