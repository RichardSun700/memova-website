import { EmailMessage } from "cloudflare:email";
import { createContactWorker } from "./contact.mjs";

async function sendNotification(env, message) {
  if (!env.EMAIL) throw new Error("Email binding missing");
  const raw = [
    `From: Memova Enterprise <${message.from}>`,
    `To: ${message.to}`,
    `Reply-To: ${message.replyTo}`,
    `Subject: ${message.subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "",
    message.text,
  ].join("\r\n");
  await env.EMAIL.send(new EmailMessage(message.from, message.to, raw));
}
export default createContactWorker(sendNotification);
