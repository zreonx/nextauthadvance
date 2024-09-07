"use server";

import { User } from "@prisma/client";
import prisma from "../prisma";
import * as bcrypt from "bcrypt";
import {
  compileResetPassTemplate,
  compileActivationTemplate,
  sendMail,
} from "../mail";
import { signJwt, verifyJwt } from "../jwt";

export async function registerUser(
  user: Omit<User, "id" | "emailVerified" | "image">
) {
  const result = await prisma.user.create({
    data: { ...user, password: await bcrypt.hash(user.password, 10) },
  });

  const jwtUserId = signJwt({
    id: result.id,
  });

  const activation_url = `${process.env.NEXTAUTH_URL}/activation/${jwtUserId}`;
  const body = compileActivationTemplate(user.firstName, activation_url);

  await sendMail({ to: user.email, subject: "Activate Your Account", body });

  return result;
}

type ActivateUserFunc = (
  jwtUserId: string
) => Promise<"userNotExits" | "alreadyActivated" | "success">;

export const activateUser: ActivateUserFunc = async (jwtUserId) => {
  const payload = verifyJwt(jwtUserId);
  const userId = payload?.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return "userNotExits";
  if (user.emailVerified) return "alreadyActivated";
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  return "success";
};

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new Error("User does not exists");

  const jwtUserId = signJwt({
    id: user.id,
  });

  const resetPassUrl = `${process.env.NEXTAUTH_URL}/reset-password/${jwtUserId}`;

  const body = compileResetPassTemplate(user.firstName, resetPassUrl);

  const sendResult = await sendMail({
    to: user.email,
    subject: "Reset Your Password",
    body,
  });

  return sendResult;
}

type ResetPasswordFunc = (
  jwtUserId: string,
  password: string
) => Promise<"userNotExist" | "success">;

export const resetPasswordAction: ResetPasswordFunc = async (
  jwtUserId,
  password
) => {
  const payload = verifyJwt(jwtUserId);
  if (!payload) return "userNotExist";

  const userId = payload.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return "userNotExist";

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: { password: await bcrypt.hash(password, 10) },
  });

  if (result) return "success";
  else throw new Error("Something went wrong!");
};
