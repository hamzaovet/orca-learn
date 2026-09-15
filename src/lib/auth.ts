import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "orcalearn_secret_key_2026_super_secure_random_string",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const identifier = (credentials?.username || (credentials as any)?.email)?.trim();
        const password = credentials?.password;

        if (!identifier || !password) {
          throw new Error("بيانات الدخول غير مكتملة");
        }

        const lowerIdentifier = identifier.toLowerCase();

        // Find user by username or email
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: lowerIdentifier },
              { email: lowerIdentifier }
            ]
          }
        });

        // Ensure default Super Admin (maestro) exists
        if (!user && (lowerIdentifier === "maestro" || lowerIdentifier === "maestro@orcalearn.com")) {
          const hashedAdminPassword = await bcrypt.hash("Godfather@2026", 10);
          user = await prisma.user.create({
            data: {
              name: "المايسترو",
              username: "maestro",
              email: "maestro@orcalearn.com",
              password: hashedAdminPassword,
              role: "SUPERADMIN",
              isActive: true,
              emailVerified: new Date()
            }
          });
        }

        // Ensure default Admin (admin) exists
        if (!user && (lowerIdentifier === "admin" || lowerIdentifier === "admin@orcalearn.com")) {
          const hashedAdminPassword = await bcrypt.hash("123456", 10);
          user = await prisma.user.create({
            data: {
              name: "مدير النظام",
              username: "admin",
              email: "admin@orcalearn.com",
              password: hashedAdminPassword,
              role: "ADMIN",
              isActive: true,
              emailVerified: new Date()
            }
          });
        }

        if (!user || !user.password) {
          throw new Error("لا يوجد حساب بهذا الاسم أو البريد");
        }

        // Check if account is active
        if (!user.isActive) {
          throw new Error("تم تعطيل هذا الحساب. يرجى مراجعة إدارة المنصة");
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("كلمة المرور غير صحيحة");
        }

        // If user is a student, require email verification
        if (user.role === "USER" && !user.emailVerified) {
          throw new Error("برجاء تفعيل حسابك من الإيميل أولاً");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
          image: user.image
        };
      }
    })
  ],
  pages: { signIn: '/login' },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.username = (user as any).username;
        token.isActive = (user as any).isActive;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
        (session.user as any).isActive = token.isActive;
      }
      return session;
    }
  }
};
