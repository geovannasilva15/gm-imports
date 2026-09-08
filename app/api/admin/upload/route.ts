import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Arquivo inválido.' }, { status: 400 });
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Envie uma imagem.' }, { status: 400 });
  if (file.size > 6 * 1024 * 1024) return NextResponse.json({ error: 'A imagem deve ter no máximo 6 MB.' }, { status: 400 });

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  const path = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await auth.supabase.storage
    .from('product-images')
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const { data } = auth.supabase.storage.from('product-images').getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
