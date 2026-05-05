import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

const IMAGEKIT_URL = process.env.IMAGEKIT_URL;
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!IMAGEKIT_URL || !IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY) {
    return NextResponse.json({ error: 'ImageKit configuration missing' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit
    const imagekitFormData = new FormData();
    imagekitFormData.append('file', new Blob([buffer]), file.name);
    imagekitFormData.append('fileName', file.name);
    imagekitFormData.append('publicKey', IMAGEKIT_PUBLIC_KEY);

    const response = await fetch(`https://upload.imagekit.io/api/v1/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${IMAGEKIT_PRIVATE_KEY}:`).toString('base64')}`,
      },
      body: imagekitFormData,
    });

    const responseText = await response.text();
    console.log('ImageKit response:', response.status, responseText);

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        console.error('ImageKit upload error:', errorData);
        return NextResponse.json({ error: errorData.message || 'Upload failed' }, { status: 500 });
      } catch {
        console.error('ImageKit upload error:', responseText);
        return NextResponse.json({ error: `Upload failed: ${responseText}` }, { status: 500 });
      }
    }

    const data = JSON.parse(responseText);
    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
