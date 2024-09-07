"use client";
import { button, Button, ButtonGroup } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function SigninButton() {
  const { data: session } = useSession();
  return (
    <div className='flex items-center gap-2'>
      {session && session.user ? (
        <>
          <Link href={"/profile"}>Profile</Link>

          <Button
            variant='flat'
            type='button'
            className='text-sky-500 hover:text-sky-600 transition-colors'
            onClick={() => {
              signOut({
                redirect: true,
                callbackUrl: `${window.location.origin}/signin`,
              });
            }}
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button as={Link} href={"/api/auth/signin"}>
            Sign In
          </Button>
          <Button as={Link} href={"/signup"}>
            Sign Up
          </Button>
        </>
      )}
    </div>
  );
}
