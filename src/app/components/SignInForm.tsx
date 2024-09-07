"use client";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

interface SignInFormProps {
  callbackUrl?: string;
}

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type InputType = z.infer<typeof FormSchema>;
export default function SignInForm(props: SignInFormProps) {
  const [visiblePass, setVisiblePass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      username: data.email,
      password: data.password,
    });

    if (!result?.ok) {
      toast.error(result?.error);
      return;
    }

    router.push(props.callbackUrl ? props.callbackUrl : "/");
    router.push("/");
    // router.refresh();
  };

  console.log(errors);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
      <div className=''>
        <h2 className='mb-2 font-semibold text-lg'>Sign In Form</h2>
        <Input
          className='mb-4'
          label='Email'
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <Input
          className='mb-4'
          label='Password'
          {...register("password")}
          type={visiblePass ? "text" : "password"}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          endContent={
            <button
              type='button'
              onClick={() => setVisiblePass((prev) => !prev)}
            >
              {visiblePass ? (
                <EyeSlashIcon className='w-4' />
              ) : (
                <EyeIcon className='w-4' />
              )}
            </button>
          }
        />

        <div className='flex items-center justify-between gap-2 mb-4'>
          <Link
            className=' hover:underline hover:underline-offset-2'
            href={"/forgot-password"}
          >
            Forgot your password?
          </Link>

          <Link
            className=' hover:underline hover:underline-offset-2'
            href='/signup'
          >
            Sign Up
          </Link>
        </div>
        <Button
          color='primary'
          type='submit'
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className='px-8'
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}
