import Link from "next/link";
import { Dna, Mail, Phone, MapPin, Award, BookOpen, GraduationCap, School } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#030712] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Platform Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-black text-white flex items-center gap-1 tracking-tight">
              أوركا <span className="text-gradient">ليرن</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              المنصة الأكاديمية والبحثية الرائدة في تدريس مادة الأحياء والميكروبيولوجيا والتكنولوجيا الحيوية للمرحلتين الثانوية والجامعية — بإشراف د. صالحة جابر دسوقي.
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--theme-badge-text)] bg-[var(--theme-badge-bg)] px-3 py-1.5 rounded-full border border-[var(--theme-border)] w-max">
              <Award className="w-3.5 h-3.5" />
              <span>كلية العلوم — جامعة السويس</span>
            </div>
          </div>

          {/* Col 2: Academic Tracks */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">المسارات التعليمية</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/courses" className="hover:text-[var(--theme-primary)] transition-colors flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5" />
                  <span>المرحلة الثانوية (علمي علوم)</span>
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[var(--theme-primary)] transition-colors flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>المرحلة الجامعية (علوم، طب، صيدلة)</span>
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[var(--theme-primary)] transition-colors flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5" />
                  <span>البيولوجيا الجزيئية والـ DNA</span>
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[var(--theme-primary)] transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>برامج البحث والماجستير</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[var(--theme-primary)] transition-colors">الصفحة الرئيسية</Link>
              </li>
              <li>
                <Link href="/#research" className="hover:text-[var(--theme-primary)] transition-colors">الأبحاث العلمية وبراءات الابتكار</Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-[var(--theme-primary)] transition-colors">آراء الطلاب وقصص النجاح</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[var(--theme-primary)] transition-colors">تسجيل الدخول وبوابة الطالب</Link>
              </li>
              <li>
                <Link href="/maestro" className="hover:text-[var(--theme-primary)] transition-colors">بوابة إدارة النظام</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Academic Credentials */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">التواصل الأكاديمي</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                <span className="truncate font-mono">Salha.Desouky@sci.suezuni.edu.eg</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                <span dir="ltr" className="font-mono">01011358667</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                <span>جمهورية مصر العربية — جامعة السويس</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-right">
            <p>© {new Date().getFullYear()} <span className="text-white font-bold">منصة أوركا ليرن (Orca Learn)</span> — جميع الحقوق محفوظة بالكامل لـ <span className="text-[var(--theme-primary)] font-bold">أوركا</span>.</p>
          </div>
          <p className="flex items-center gap-2 text-slate-400 text-center md:text-left">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]" />
            <span>المحتوى الأكاديمي والبحثي بإشراف: <strong className="text-slate-200">د. صالحة جابر دسوقي</strong></span>
          </p>
        </div>
      </div>
    </footer>
  );
}
