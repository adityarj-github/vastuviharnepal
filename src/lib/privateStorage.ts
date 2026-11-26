import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function saveBlogImage(
  file: File,
  folder = 'price-list-logo'
): Promise<{ url?: string; error?: string }> {
  try {
    const ext = path.extname(file.name).toLowerCase() || '.webp';
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    if (!allowed.includes(ext)) {
      return { error: 'Unsupported file type. Please use JPG, PNG, WEBP, or GIF.' };
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    const safeBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const fileName = `${Date.now()}-${safeBase}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    return { url: `/uploads/${folder}/${fileName}` };
  } catch (err) {
    console.error('Error saving logo image:', err);
    return { error: 'Failed to save logo file.' };
  }
}
