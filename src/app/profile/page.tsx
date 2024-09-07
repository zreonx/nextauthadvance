import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session.user) redirect("/signin");
  return (
    <div>
      <Image
        height={300}
        width={300}
        src={user?.image ?? ""}
        alt={user?.firstName ?? ""}
        className='rounded-full'
      />

      <div className='flex gap-4 flex-col'>
        <p>
          First Name: <span className='col-span-3'>{user?.firstName}</span>
        </p>

        <p>
          Last Name: <span className='col-span-3'>{user?.lastName}</span>
        </p>
        <p>
          Phone: <span className='col-span-3'>{user?.phone}</span>
        </p>
        <p>
          email: <span className='col-span-3'>{user?.email}</span>
        </p>
      </div>
    </div>
  );
}
