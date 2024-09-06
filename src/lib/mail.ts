import Handlebars from "handlebars";
import nodemailer from "nodemailer";
import { activationTemplate } from "./email-templates/activation";

export async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  //Setup SMTP Server
  const { SMTP_EMAIL, SMTP_GMAIL_PASS, SMTP_USER, SMTP_PASS } = process.env;

  //Gmail SMTP SERVER
  //   const transport = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       user: SMTP_EMAIL,
  //       pass: SMTP_GMAIL_PASS,
  //     },
  //   });

  //Mail Trap SMTP SERVER
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  //Test Connections
  try {
    const testResult = await transport.verify();
    console.log("test result of transport: ", testResult);
  } catch (error) {
    console.error(error);
  }

  //Sending Email

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
    console.log(sendResult);
  } catch (error) {
    console.error(error);
  }
}

export const compileActivationTemplate = (name: string, url: string) => {
  const template = Handlebars.compile(activationTemplate);

  const htmlBody = template({
    name,
    url,
  });

  return htmlBody;
};
