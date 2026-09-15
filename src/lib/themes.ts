export interface ThemeConfig {
  id: string;
  name: string;
  nameEn: string;
  tagline: string;
  category: string;
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    glow: string;
    cardBorder: string;
    cardHoverBorder: string;
    badgeBg: string;
    badgeText: string;
    gradientFrom: string;
    gradientTo: string;
  };
}

export const THEMES: ThemeConfig[] = [
  {
    id: "emerald",
    name: "الزمرد الحيوي",
    nameEn: "Biotech Emerald",
    tagline: "النقاء الحيوي، الميكروبيولوجيا، والبيولوجيا التطبيقية",
    category: "علوم الحياة والبيولوجي",
    colors: {
      primary: "#10b981",
      primaryHover: "#059669",
      secondary: "#06b6d4",
      accent: "#34d399",
      glow: "rgba(16, 185, 129, 0.4)",
      cardBorder: "rgba(16, 185, 129, 0.2)",
      cardHoverBorder: "rgba(16, 185, 129, 0.5)",
      badgeBg: "rgba(16, 185, 129, 0.15)",
      badgeText: "#6ee7b7",
      gradientFrom: "#10b981",
      gradientTo: "#06b6d4",
    },
  },
  {
    id: "cyan",
    name: "السيان التقني",
    nameEn: "Cyber Cyan",
    tagline: "المعلوماتية الحيوية، تقنيات PCR، والتكنولوجيا المخبرية",
    category: "التقنيات الحيوية المتقدمة",
    colors: {
      primary: "#06b6d4",
      primaryHover: "#0891b2",
      secondary: "#3b82f6",
      accent: "#22d3ee",
      glow: "rgba(6, 182, 212, 0.4)",
      cardBorder: "rgba(6, 182, 212, 0.2)",
      cardHoverBorder: "rgba(6, 182, 212, 0.5)",
      badgeBg: "rgba(6, 182, 212, 0.15)",
      badgeText: "#67e8f9",
      gradientFrom: "#06b6d4",
      gradientTo: "#3b82f6",
    },
  },
  {
    id: "violet",
    name: "الأرجوان الجيني",
    nameEn: "Genomic Violet",
    tagline: "شفرة الـ DNA، الهندسة الوراثية، والتسلسل الجينومي",
    category: "البيولوجيا الجزيئية والجينات",
    colors: {
      primary: "#8b5cf6",
      primaryHover: "#7c3aed",
      secondary: "#ec4899",
      accent: "#a78bfa",
      glow: "rgba(139, 92, 246, 0.4)",
      cardBorder: "rgba(139, 92, 246, 0.2)",
      cardHoverBorder: "rgba(139, 92, 246, 0.5)",
      badgeBg: "rgba(139, 92, 246, 0.15)",
      badgeText: "#c4b5fd",
      gradientFrom: "#8b5cf6",
      gradientTo: "#ec4899",
    },
  },
  {
    id: "amber",
    name: "العنبر الأكاديمي",
    nameEn: "Academic Amber",
    tagline: "التميز البحثي، النشر الدولي، والإنجازات العلمية",
    category: "الريادة الأكاديمية والجوائز",
    colors: {
      primary: "#f59e0b",
      primaryHover: "#d97706",
      secondary: "#ea580c",
      accent: "#fbbf24",
      glow: "rgba(245, 158, 11, 0.4)",
      cardBorder: "rgba(245, 158, 11, 0.2)",
      cardHoverBorder: "rgba(245, 158, 11, 0.5)",
      badgeBg: "rgba(245, 158, 11, 0.15)",
      badgeText: "#fcd34d",
      gradientFrom: "#f59e0b",
      gradientTo: "#ea580c",
    },
  },
  {
    id: "ruby",
    name: "الياقوت الخلوي",
    nameEn: "Cellular Ruby",
    tagline: "الميكروبيولوجيا الطبية، المناعة، وعلم الأمراض",
    category: "العلوم الطبية والمناعة",
    colors: {
      primary: "#f43f5e",
      primaryHover: "#e11d48",
      secondary: "#fb7185",
      accent: "#fda4af",
      glow: "rgba(244, 63, 94, 0.4)",
      cardBorder: "rgba(244, 63, 94, 0.2)",
      cardHoverBorder: "rgba(244, 63, 94, 0.5)",
      badgeBg: "rgba(244, 63, 94, 0.15)",
      badgeText: "#fecdd3",
      gradientFrom: "#f43f5e",
      gradientTo: "#fb7185",
    },
  },
  {
    id: "ocean",
    name: "الأزرق المحيطي",
    nameEn: "Deep Ocean",
    tagline: "الميكروبيولوجيا البحرية، بيئة البحر الأحمر، والاستزراع الحيوي",
    category: "العلوم البحرية والبيئية",
    colors: {
      primary: "#0ea5e9",
      primaryHover: "#0284c7",
      secondary: "#2563eb",
      accent: "#38bdf8",
      glow: "rgba(14, 165, 233, 0.4)",
      cardBorder: "rgba(14, 165, 233, 0.2)",
      cardHoverBorder: "rgba(14, 165, 233, 0.5)",
      badgeBg: "rgba(14, 165, 233, 0.15)",
      badgeText: "#7dd3fc",
      gradientFrom: "#0ea5e9",
      gradientTo: "#2563eb",
    },
  },
];

export const DEFAULT_THEME_ID = "emerald";

export function getThemeById(id?: string | null): ThemeConfig {
  const found = THEMES.find((t) => t.id === id);
  return found || THEMES[0];
}
