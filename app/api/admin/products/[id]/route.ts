import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';

function normalizeProduct(input: any) {
  const slug = String(input.slug || input.name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return {
    name: String(input.name || '').trim(),
    slug,
    brand: String(input.brand || "Victoria's Secret").trim(),
    category: String(input.category || 'body-splash').trim(),
    collection: input.collection ? String(input.collection).trim() : null,
    description: input.description ? String(input.description).trim() : null,
    short_description: input.short_description ? String(input.short_description).trim() : null,
    price: Number(input.price || 0),
    sale_price: input.sale_price === '' || input.sale_price == null ? null : Number(input.sale_price),
    volume: input.volume ? String(input.volume).trim() : null,
    stock: Number(input.stock || 0),
    sku: input.sku ? String(input.sku).trim() : null,
    image_url: input.image_url ? String(input.image_url).trim() : null,
    gallery: Array.isArray(input.gallery) ? input.gallery : [],
    family: input.family ? String(input.family).trim() : null,
    top_notes: Array.isArray(input.top_notes) ? input.top_notes : [],
    heart_notes: Array.isArray(input.heart_notes) ? input.heart_notes : [],
    base_notes: Array.isArray(input.base_notes) ? input.base_notes : [],
    sweetness: Number(input.sweetness || 0),
    intensity: Number(input.intensity || 0),
    freshness: Number(input.freshness || 0),
    vibe: Array.isArray(input.vibe) ? input.vibe : [],
    occasions: Array.isArray(input.occasions) ? input.occasions : [],
    tags: Array.isArray(input.tags) ? input.tags : [],
    is_featured: Boolean(input.is_featured),
    is_new: Boolean(input.is_new),
    is_active: input.is_active !== false,
    updated_at: new Date().toISOString()
  };
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await context.params;
  const body = await request.json();
  const product = normalizeProduct(body);

  const { data, error } = await auth.supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ product: data });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await context.params;
  const { error } = await auth.supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
