"use client";
import { sendMail } from "@/lib/mail";
import Image from "next/image";
import { Accordion, AccordionItem } from "@nextui-org/react";
export default async function Home() {
  // await sendMail({
  //   to: "zreondev@gmail.com",
  //   subject: "test email",
  //   body: "hello world",
  // });
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div>
        <h1 className='text-2xl mb-4'>Advanced NextJS Authentication </h1>

        <Accordion>
          <AccordionItem
            key='1'
            aria-label='Accordion 1'
            title='Email Verification'
          ></AccordionItem>
          <AccordionItem
            key='2'
            aria-label='Accordion 2'
            title='Reset Password'
          ></AccordionItem>
          <AccordionItem
            key='3'
            aria-label='Accordion 3'
            title='Next Middleware'
          ></AccordionItem>
          <AccordionItem
            key='4'
            aria-label='Accordion 4'
            title='Protected Page'
          ></AccordionItem>
        </Accordion>
      </div>
    </main>
  );
}
