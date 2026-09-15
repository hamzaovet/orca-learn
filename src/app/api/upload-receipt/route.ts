import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get('file') as unknown as File | null;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'لم يتم إرفاق أي ملف' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
    await mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name || '') || '.jpg';
    const filename = `receipt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/receipts/${filename}`;
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error('Error uploading receipt:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء رفع صورة الإيصال' }, { status: 500 });
  }
}
