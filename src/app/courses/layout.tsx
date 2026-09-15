import Navbar from "@/components/Navbar";

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-24">{children}</div>
    </>
  );
}
