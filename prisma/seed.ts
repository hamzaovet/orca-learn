import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB seed...');

  // 1. Egypt
  await prisma.country.upsert({
    where: { slug: 'egypt' },
    update: {},
    create: {
      name: 'مصر',
      slug: 'egypt',
      code: 'EG',
      currencyCode: 'EGP',
      usdRate: 48.0,
      universities: {
        create: [
          {
            name: 'جامعة القاهرة',
            slug: 'cairo-univ',
            departments: {
              create: [
                { name: 'محاسبة', slug: 'acc-cairo' },
                { name: 'إدارة أعمال', slug: 'bus-cairo' }
              ]
            }
          },
          {
            name: 'جامعة عين شمس',
            slug: 'ain-shams-univ',
            departments: {
              create: [
                { name: 'تمويل', slug: 'fin-ain-shams' },
                { name: 'اقتصاد', slug: 'eco-ain-shams' }
              ]
            }
          }
        ]
      }
    }
  });

  // 2. KSA
  await prisma.country.upsert({
    where: { slug: 'ksa' },
    update: {},
    create: {
      name: 'السعودية',
      slug: 'ksa',
      code: 'SA',
      currencyCode: 'SAR',
      usdRate: 3.75,
      universities: {
        create: [
          {
            name: 'جامعة الملك سعود',
            slug: 'ksu',
            departments: {
              create: [
                { name: 'محاسبة', slug: 'acc-ksu' },
                { name: 'إدارة مالية', slug: 'fin-ksu' }
              ]
            }
          },
          {
            name: 'جامعة الملك عبدالعزيز',
            slug: 'kau',
            departments: {
              create: [
                { name: 'تمويل', slug: 'fin-kau' }
              ]
            }
          }
        ]
      }
    }
  });

  // 3. UAE
  await prisma.country.upsert({
    where: { slug: 'uae' },
    update: {},
    create: {
      name: 'الإمارات',
      slug: 'uae',
      code: 'AE',
      currencyCode: 'AED',
      usdRate: 3.67,
      universities: {
        create: [
          {
            name: 'جامعة الإمارات العربية المتحدة',
            slug: 'uaeu',
            departments: {
              create: [
                { name: 'محاسبة', slug: 'acc-uaeu' },
                { name: 'إدارة أعمال', slug: 'bus-uaeu' }
              ]
            }
          },
          {
            name: 'جامعة زايد',
            slug: 'zayed-univ',
            departments: {
              create: [
                { name: 'تمويل', slug: 'fin-zayed' }
              ]
            }
          }
        ]
      }
    }
  });

  // 4. Kuwait
  await prisma.country.upsert({
    where: { slug: 'kuwait' },
    update: {},
    create: {
      name: 'الكويت',
      slug: 'kuwait',
      code: 'KW',
      currencyCode: 'KWD',
      usdRate: 0.31,
      universities: {
        create: [
          {
            name: 'جامعة الكويت',
            slug: 'kuwait-univ',
            departments: {
              create: [
                { name: 'محاسبة', slug: 'acc-kuwait' },
                { name: 'إدارة', slug: 'mgmt-kuwait' }
              ]
            }
          }
        ]
      }
    }
  });

  // 5. Seed Super Admin (Maestro) and Admin
  const maestroHashedPassword = await bcrypt.hash("Godfather@2026", 10);
  await prisma.user.upsert({
    where: { email: "maestro@orcalearn.com" },
    update: {
      username: "maestro",
      password: maestroHashedPassword,
      role: "SUPERADMIN" as any,
      isActive: true,
      emailVerified: new Date(),
    },
    create: {
      name: "المايسترو",
      username: "maestro",
      email: "maestro@orcalearn.com",
      password: maestroHashedPassword,
      role: "SUPERADMIN" as any,
      isActive: true,
      emailVerified: new Date(),
    },
  });

  const adminHashedPassword = await bcrypt.hash("123456", 10);
  await prisma.user.upsert({
    where: { email: "admin@orcalearn.com" },
    update: {
      username: "admin",
      password: adminHashedPassword,
      role: "ADMIN" as any,
      isActive: true,
      emailVerified: new Date(),
    },
    create: {
      name: "مدير النظام",
      username: "admin",
      email: "admin@orcalearn.com",
      password: adminHashedPassword,
      role: "ADMIN" as any,
      isActive: true,
      emailVerified: new Date(),
    },
  });

  console.log('Database seeded successfully (including Maestro & Admin)!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
