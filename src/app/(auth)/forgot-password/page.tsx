"use client";
import { forgotPassword } from "@/lib/actions/authActions";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email("Please use a valid email address"),
});

type InputType = z.infer<typeof FormSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const submitRequest: SubmitHandler<InputType> = async (data) => {
    try {
      await forgotPassword(data.email);
      toast.success("Reset password link was sent to your email");
      reset();
    } catch (e) {
      console.log(e);
      toast.error("Something Went Wrong!");
    }
  };
  return (
    <div className='max-w-[90%] w-full lg:w-[40%] mx-auto'>
      <form className='w-full mt-3' onSubmit={handleSubmit(submitRequest)}>
        <h2 className='text-xl font-semibold mt-8'>Forgot Password </h2>
        <p className='text-sm font-normal mb-2'>
          Enter your email and we'll send you a link to reset your password{" "}
        </p>
        <Input
          label='Email'
          {...register("email")}
          startContent={<EnvelopeIcon className='w-4' />}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <Button
          className='mt-2'
          type='submit'
          color='primary'
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Please wait..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
