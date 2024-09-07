"use client";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import PasswordStrength from "./PasswordStrength";
import { passwordStrength } from "check-password-strength";
import { resetPasswordAction } from "@/lib/actions/authActions";
import { toast } from "react-toastify";
interface IResetPasswordForm {
  jwtUserId: string;
}

const FormSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be atleast 6 characters")
      .max(52, "Password must be less than 52 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do't match",
    path: ["confirmPassword"],
  });

type InputType = z.infer<typeof FormSchema>;

export default function ResetPasswordForm({ jwtUserId }: IResetPasswordForm) {
  const [visible, setVisible] = useState(false);
  const [passStrength, setPassStrength] = useState(0);
  const [passMessage, setPassMessage] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
    setPassMessage(passwordStrength(watch().password).value);
  }, [watch().password]);

  const resetPassword: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await resetPasswordAction(jwtUserId, data.password);

      if (result === "success")
        toast.success("Your password has been reset successfully.");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(resetPassword)}>
      <h2 className='font-semibold text-lg mb-2'>Reset your password</h2>
      <div className='flex flex-col gap-[1rem]'>
        <Input
          label='Password'
          {...register("password")}
          isInvalid={!!errors.password}
          type={visible ? "text" : "password"}
          errorMessage={errors.password?.message}
          endContent={
            <button type='button' onClick={() => setVisible((prev) => !prev)}>
              {visible ? (
                <EyeSlashIcon className='w-4' />
              ) : (
                <EyeIcon className='w-4' />
              )}
            </button>
          }
        />
        {watch().password && watch().password.length > 0 && (
          <PasswordStrength passStrength={passStrength} message={passMessage} />
        )}
        <Input
          label='Confirm Password'
          type={visible ? "text" : "password"}
          {...register("confirmPassword")}
          isInvalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
        />
      </div>
      <Button
        className='px-8 mt-4'
        isLoading={isSubmitting}
        type='submit'
        disabled={isSubmitting}
        color='primary'
      >
        {isSubmitting ? "Please wait..." : "Update Password"}
      </Button>
    </form>
  );
}
