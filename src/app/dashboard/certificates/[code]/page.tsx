import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import CertificatePrintView from "./CertificatePrintView";

export const dynamic = "force-dynamic";

interface CertificatePageProps {
  params: Promise<{ code: string }>;
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { code } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/login?callbackUrl=/dashboard/certificates/${code}`);
  }

  const certificate = await prisma.certificate.findUnique({
    where: { certificateCode: code.toUpperCase() },
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true, stage: true } },
    },
  });

  if (!certificate) {
    notFound();
  }

  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;
  const isOwnerOrAdmin = certificate.userId === userId || ["ADMIN", "SUPERADMIN"].includes(userRole);

  if (!isOwnerOrAdmin) {
    redirect("/dashboard");
  }

  return <CertificatePrintView certificate={certificate} />;
}
