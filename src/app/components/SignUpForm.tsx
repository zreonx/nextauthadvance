"use client";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import validator from "validator";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength } from "check-password-strength";
import PasswordStrength from "./PasswordStrength";
import { registerUser } from "@/lib/actions/authActions";
import { toast } from "react-toastify";

const FormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(44, "First name less than 45 characters")
      .regex(new RegExp("^[a-zA-Z]+$"), "No special character allowed"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(44, "Last name less than 45 characters")
      .regex(new RegExp("^[a-zA-Z]+$"), "No special character allowed"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .refine(validator.isMobilePhone, "Please enter a valid phone number"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters"),
    accepted: z.literal(true, {
      errorMap: () => ({
        message: "Please accept all terms",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

type InputType = z.infer<typeof FormSchema>;

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    watch,
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const [passStrength, setPassStrength] = useState(0);
  const [passMessage, setPassMessage] = useState("");
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
    setPassMessage(passwordStrength(watch().password).value);
  }, [watch().password]);
  const toggleVisiblePass = () => setIsVisiblePass((prev) => !prev);

  const saveUser: SubmitHandler<InputType> = async (data) => {
    const { accepted, confirmPassword, ...user } = data;

    try {
      const result = await registerUser(user);
      toast.success("The user successfully.");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(saveUser)}
      className='grid grid-cols-2 gap-3 p-2 place-self-stretch shadow border rounded-md'
    >
      <Input
        {...register("firstName")}
        label='First Name'
        startContent={<UserIcon className='w-4' />}
        isInvalid={!!errors.firstName}
        errorMessage={errors.firstName?.message}
      />
      <Input
        {...register("lastName")}
        label='Last Name'
        startContent={<UserIcon className='w-4' />}
        isInvalid={!!errors.lastName}
        errorMessage={errors.lastName?.message}
      />
      <Input
        {...register("email")}
        className='col-span-2'
        label='Email'
        startContent={<EnvelopeIcon className='w-4' />}
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
      />
      <Input
        {...register("phone")}
        className='col-span-2'
        label='Phone'
        startContent={<PhoneIcon className='w-4' />}
        isInvalid={!!errors.phone}
        errorMessage={errors.phone?.message}
      />
      <Input
        {...register("password")}
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        className='col-span-2'
        label='Password'
        type={isVisiblePass ? "text" : "password"}
        startContent={<KeyIcon className='w-4' />}
        endContent={
          !isVisiblePass ? (
            <EyeIcon
              className='w-4 cursor-pointer'
              onClick={toggleVisiblePass}
            />
          ) : (
            <EyeSlashIcon
              className='w-4 cursor-pointer'
              onClick={toggleVisiblePass}
            />
          )
        }
      />
      {watch().password && watch().password.length > 0 && (
        <PasswordStrength passStrength={passStrength} message={passMessage} />
      )}
      <Input
        {...register("confirmPassword")}
        isInvalid={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword?.message}
        className='col-span-2'
        type={isVisiblePass ? "text" : "password"}
        label='Confirm Password'
        startContent={<KeyIcon className='w-4' />}
      />
      <Controller
        control={control}
        name='accepted'
        render={({ field }) => (
          <Checkbox
            onChange={field.onChange}
            onBlur={field.onBlur}
            className='col-span-2'
          >
            I agree to the <Link href='/terms'>Terms and Conditions</Link>
          </Checkbox>
        )}
      />
      {!!errors.accepted && (
        <p className='text-red-500 font-light text-xs'>
          {errors.accepted.message}
        </p>
      )}

      <div className='flex justify-center col-span-2'>
        <Button className='w-1/3' color='primary' type='submit'>
          Submit
        </Button>
      </div>
    </form>
  );
}
