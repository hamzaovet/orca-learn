import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from 'next/navigation';
import CoursePlayer from '@/components/dashboard/CoursePlayer';

export default async function SecureCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const userId = (session.user as any).id;

  // Security First: Verify Enrollment & Active Status
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: id,
      }
    }
  });

  if (!enrollment || enrollment.status !== "ACTIVE") {
    redirect(`/courses/${id}`);
  }

  // Fetch Course with full curriculum ordered by creation date
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { createdAt: 'asc' },
        include: {
          lessons: {
            orderBy: { createdAt: 'asc' }
          }
        }
      },
      quizzes: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!course) {
    notFound();
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-200 flex flex-col font-sans">
      <CoursePlayer
        course={course}
        student={{
          id: userId,
          name: dbUser?.name || session.user.name,
          email: dbUser?.email || session.user.email,
          phone: enrollment.senderPhone || undefined,
        }}
      />
    </div>
  );
}
