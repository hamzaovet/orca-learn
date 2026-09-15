import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

  // 1. Seed Secondary Grades
  const secondaryGrades = [
    {
      name: "الصف الثالث الثانوي (علمي علوم)",
      slug: "thanawya-amma-grade-3",
      countryCode: "EGY",
      description: "البيولوجيا الجزيئية (DNA & RNA)، المناعة، التكاثر، والتنسيق الهرموني والدعامة والحركة.",
      order: 1,
    },
    {
      name: "الصف الثاني الثانوي",
      slug: "secondary-grade-2",
      countryCode: "EGY",
      description: "التغذية الذاتية وغير الذاتية، النقل، التنفس الخلوي، الإخراج والإحساس.",
      order: 2,
    },
    {
      name: "الصف الأول الثانوي",
      slug: "secondary-grade-1",
      countryCode: "EGY",
      description: "التركيب الكيميائي للخلية، الكروموسومات، توارث الصفات وتصنيف الكائنات الحية.",
      order: 3,
    },
    {
      name: "المرحلة الثانوية (نظام المسارات)",
      slug: "ksa-secondary-tracks",
      countryCode: "KSA",
      description: "أحياء 1 و 2 و 3 والتحضير لاختبار التحصيلي.",
      order: 4,
    },
    {
      name: "مدارس اللغات والـ STEM (Biology)",
      slug: "stem-languages-biology",
      countryCode: "EGY",
      description: "Advanced Biology, Molecular Genetics, and Practical Labs in English.",
      order: 5,
    },
  ];

  for (const grade of secondaryGrades) {
    await prisma.secondaryGrade.upsert({
      where: { slug: grade.slug },
      update: grade,
      create: grade,
    });
  }
  console.log("Secondary grades seeded.");

  // 2. Seed Research Papers
  const papers = [
    {
      title: "Bacterial self-healing and mechanical strength enhancement in concrete: a comparative study of Bacillus subtilis, Bacillus sphaericus, and Escherichia coli",
      titleAr: "الشفاء الذاتي للخرسانة بالبكتيريا وتعزيز قوتها الميكانيكية: دراسة مقارنة",
      journal: "Innovative Infrastructure Solutions (Springer)",
      year: 2025,
      category: "concrete",
      authors: "Sameh Yehia, Arafa M. A. Ibrahim, Doaa F. Ahmed, Salha G. Desouky",
      abstractAr: "بحث رائد يدرس استخدام سلالات بكتيريا معينة لمعالجة تشققات الخرسانة ذاتياً وترسيب كربونات الكالسيوم الحيوية لإطالة العمر الافتراضي للمنشآت.",
      impact: "نشر دولي مفهرس في Springer Nature (2025)",
      doi: "https://doi.org/10.1007/s41062-025-0509-x",
      order: 1,
    },
    {
      title: "Effect of eggshell powder as fly ash replacement and nutrient source for bacteria on the properties and self-healing of geopolymer concrete",
      titleAr: "تأثير مسحوق قشر البيض كمصدر غذائي للبكتيريا في الشفاء الذاتي للخرسانة الجيوبوليمرية",
      journal: "Innovative Infrastructure Solutions (Springer)",
      year: 2025,
      category: "concrete",
      authors: "Nour Bassim, Omar Mohamed, Ibrahim Saad, Abdullah M. Zeyad, Salha G. Desouky",
      abstractAr: "تطوير خرسانة خضراء مستدامة تعتمد على إعادة تدوير المخلفات الحيوية كمغذيات لبكتيريا الشفاء الذاتي، محققة وفراً اقتصادياً وحماية بيئية.",
      impact: "ابتكار بيئي تطبيقي في الخرسانة الحيوية المستدامة",
      doi: "https://doi.org/10.1007/s41062-025-0410-y",
      order: 2,
    },
    {
      title: "The natural product biosynthetic potential of Red Sea nudibranch microbiomes",
      titleAr: "القدرة التخليقية للمنتجات الطبيعية لميكروبيوم كائنات البحر الأحمر",
      journal: "PeerJ (Life & Environment)",
      year: 2021,
      category: "marine",
      authors: "Samar M. Abdelrahman, Amro Hanora, Salha G. Desouky, Frank J. Stewart, Nicole B. Lopanik",
      abstractAr: "كشف التسلسل الجيني والميكروبي لكائنات البحر الأحمر لاستخلاص مركبات حيوية طبيعية ذات فاعلية مضادة للأورام السرطانية والميكروبات المقاومة للمضادات.",
      impact: "بحث دولي مشترك بالتعاون مع فرق بحثية أمريكية وأوروبية",
      doi: "https://doi.org/10.7717/peerj.11985",
      order: 3,
    },
    {
      title: "Evaluate the Toxicity of Pyrethroid Insecticide Cypermethrin before and after Biodegradation by Lysinibacillus cresolivorans Strain HIS7",
      titleAr: "تقييم سُمية مبيد السايبرمثرين قبل وبعد التحلل الحيوي بواسطة بكتيريا Lysinibacillus",
      journal: "Plants (MDPI)",
      year: 2021,
      category: "biodegradation",
      authors: "Ebrahim Saied, Amr Fouda, Salha G. Desouky, Saad El-Din Hassan, et al.",
      abstractAr: "عزل وتوصيف سلالة بكتيرية قادرة على التكسير الحيوي للمبيدات الحشرية الخطرة وتحويلها إلى مركبات آمنة لحماية المياه الجوفية والتربة الزراعية.",
      impact: "نشر في MDPI بتصنيف Q1 في العلوم البيئية والنباتية",
      doi: "https://doi.org/10.3390/plants10101903",
      order: 4,
    },
    {
      title: "Subsequent improvement of lactic acid production from beet molasses by Enterococcus hirae using different fermentation strategies",
      titleAr: "تحسين إنتاج حمض اللاكتيك من مولاس البنجر بواسطة بكتيريا التخمر Enterococcus hirae",
      journal: "Bioresource Technology Reports (Elsevier)",
      year: 2021,
      category: "probiotics",
      authors: "Mohamed Ali Abdel-Rahman, Amr Fouda, Salha G. Desouky, Sadat Khattab",
      abstractAr: "استراتيجيات تخمير متطورة لإنتاج حمض اللاكتيك الحيوي عالي النقاوة من المخلفات الزراعية، واستخدامه في الصناعات الدوائية والبوليمرات الحيوية.",
      impact: "أبحاث تطبيقية رائدة في التكنولوجيا الحيوية الصناعية",
      doi: "https://doi.org/10.1016/j.biteb.2020.100615",
      order: 5,
    },
    {
      title: "Cholesterol reduction in vitro by Novel probiotic lactic acid bacteria strains isolated from healthy infants stool",
      titleAr: "خفض الكوليسترول معملياً بواسطة سلالات بروبيوتيك جديدة من بكتيريا حمض اللاكتيك",
      journal: "African Journal of Microbiology Research",
      year: 2017,
      category: "probiotics",
      authors: "Akram A. Aboseidah, Abdel-Hamied Rasmey, Magdy Osman, Salha G. Desouky, Nehal Kamal",
      abstractAr: "عزل سلالات بروبيوتيك نافعة ذات قدرة استثنائية على امتصاص وتكسير الكوليسترول الضار في الأمعاء لاستخدامها كمكملات علاجية وطبية آمنة.",
      impact: "دراسة سريرية ومعملية واعدة لصحة الجهاز الهضمي والقلب",
      order: 6,
    },
  ];

  for (const paper of papers) {
    const existing = await prisma.researchPaper.findFirst({
      where: { title: paper.title },
    });
    if (!existing) {
      await prisma.researchPaper.create({ data: paper });
    }
  }
  console.log("Research papers seeded.");

  // 3. Seed Student Reviews
  const reviews = [
    {
      name: "أحمد حسام الشربيني",
      stage: "secondary",
      stageLabel: "ثانوية عامة (علمي علوم)",
      affiliation: "المركز الرابع على المحافظة - 2024",
      rating: 5,
      date: "دفعة 2024",
      subject: "مادة الأحياء (DNA والمناعة والتكاثر)",
      review: "شرح دكتورة صالحة لفصل البيولوجيا الجزيئية والـ DNA نقل مستواي لمرحلة ثانية تماماً! الطريقة اللي بتربط بيها بين تركيب الخلية والتطبيقات الواقعية خلتني أحل أصعب أفكار امتحانات الثانوية العامة بدون تردد. قفلت الأحياء بفضل الله ثم فضل تبسيطها العبقري.",
      order: 1,
    },
    {
      name: "مريم عبد الرحمن القاضي",
      stage: "secondary",
      stageLabel: "ثانوية عامة (علمي علوم)",
      affiliation: "طالبة طب بشري حالياً",
      rating: 5,
      date: "دفعة 2024",
      subject: "مراجعات ليلة الامتحان والنماذج الوزارية",
      review: "أهم ما يميز الدكتورة صالحة هو أنها أستاذة جامعية متمكنة تشرح منهج الثانوية بأسلوب تربوي سلس جداً. أسئلة الفهم والربط اللي كانت بتدربنا عليها هي نفسها اللي لقيناها في الامتحان بنظام البابل شيت الحديث.",
      order: 2,
    },
    {
      name: "عمر خالد المنصوري",
      stage: "university",
      stageLabel: "المرحلة الجامعية",
      affiliation: "كلية العلوم - قسم الميكروبيولوجي",
      rating: 5,
      date: "الفصل الدراسي الثاني",
      subject: "مقرر الميكروبيولوجيا العامة والفسيولوجيا",
      review: "مقررات علم البكتيريا والأيض الميكروبي كانت دائماً تبدو معقدة في الكتب الأجنبية، لكن أسلوب دكتورة صالحة في توضيح المسارات البيوكيميائية وتجارب المعمل جعل المادة ممتعة وحصلت على تقدير امتياز في الكلية.",
      order: 3,
    },
    {
      name: "نوران إبراهيم النجار",
      stage: "university",
      stageLabel: "المرحلة الجامعية",
      affiliation: "كلية الصيدلة - الفرقة الثالثة",
      rating: 5,
      date: "2024",
      subject: "الميكروبيولوجيا الطبية والمناعة",
      review: "كورس المناعة والبكتيريا الطبية ساعدني جداً في مواد الفارما والمضادات الحيوية. دكتورة صالحة بتشرح آليات مقاومة البكتيريا وتصنيف السلالات بمنتهى الاحترافية والعمق.",
      order: 4,
    },
    {
      name: "د. إسلام سعد الدين رضوان",
      stage: "postgrad",
      stageLabel: "دراسات عليا وبحث علمي",
      affiliation: "باحث ماجستير في التقنية الحيوية",
      rating: 5,
      date: "2023 - 2025",
      subject: "تقنيات PCR وتطبيقات الشفاء الذاتي للخرسانة",
      review: "الإشراف العلمي والبحثي مع الدكتورة صالحة كان نقطة التحول في مسيرتي العلمية. دقتها في مراجعة النتائج المعملية وتصميم التجارب ساعدتنا في نشر بحث دولي في دوريات Springer المرموقة.",
      order: 5,
    },
    {
      name: "سارة محمد العتيبي",
      stage: "secondary",
      stageLabel: "نظام المسارات (المرحلة الثانوية)",
      affiliation: "المملكة العربية السعودية",
      rating: 5,
      date: "2024",
      subject: "علم البيئة والأحياء المتقدمة",
      review: "المنصة أتاحت لي متابعة شروحات الأحياء والبيئة بأسلوب ممتع جداً ورسوم توضيحية غاية في الدقة. أنصح كل طالب يريد الفهم الحقيقي وليس مجرد حفظ الإجابات بمتابعة دكتورة صالحة.",
      order: 6,
    },
  ];

  for (const rev of reviews) {
    const existing = await prisma.studentReview.findFirst({
      where: { name: rev.name },
    });
    if (!existing) {
      await prisma.studentReview.create({ data: rev });
    }
  }
  console.log("Student reviews seeded.");

  console.log("All seed data successfully created!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
