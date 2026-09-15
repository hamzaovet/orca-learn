import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: "البيانات غير مكتملة" }, { status: 400 });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ error: "هذا الإيميل مسجل بالفعل" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const token = crypto.randomUUID();
    await prisma.verificationToken.create({
      data: { identifier: email, token, expires: new Date(Date.now() + 1000 * 60 * 60 * 24) }
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD }
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;
    await transporter.sendMail({
      from: `"أوركا ليرن" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "تفعيل حسابك في منصة أوركا ليرن 🐋",
      html: `<div dir="rtl" style="font-family: Arial, sans-serif; text-align: center; padding: 20px;"><h2>أهلاً بك يا ${name} في أوركا ليرن!</h2><p>برجاء الضغط على الرابط التالي لتفعيل حسابك:</p><br/><a href="${verifyUrl}" style="background:#06b6d4;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;">تفعيل الحساب الآن</a></div>`
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء التسجيل" }, { status: 500 });
  }
}
