'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  collection: string | null;
  description: string | null;
  short_description: string | null;
  price: number;
  sale_price: number | null;
  volume: string | null;
  stock: number;
  sku: string | null;
  image_url: string | null;
  gallery: string[];
  family: string | null;
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  sweetness: number;
  intensity: number;
  freshness: number;
  vibe: string[];
  occasions: string[];
  tags: string[];
  is_featured: boolean;
  is_new: boolean;
  is_active: boolean;
};

type FormState = Omit<Product, 'id'>;

const emptyForm: FormState = {
  name: '', slug: '', brand: "Victoria's Secret", category: 'body-splash', collection: '', description: '', short_description: '',
  price: 0, sale_price: null, volume: '250 ml', stock: 0, sku: '', image_url: '', gallery: [], family: '',
  top_notes: [], heart_notes: [], base_notes: [], sweetness: 50, intensity: 50, freshness: 50, vibe: [], occasions: [], tags: [],
  is_featured: false, is_new: false, is_active: true
};

const listFromText = (value: string) => value.split(',').map(v => v.trim()).filter(Boolean);
const textFromList = (value?: string[]) => (value ?? []).join(', ');

export default function AdminProductManager() {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function token() {
    if (!supabase) throw new Error('Configure as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  }

  async function api(path: string, init: RequestInit = {}) {
    const accessToken = await token();
    const headers = new Headers(init.headers);
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    if (!(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
    const response = await fetch(path, { ...init, headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro na operação.');
    return data;
  }

  async function loadProducts() {
    try {
      const data = await api('/api/admin/products');
      setProducts(data.products ?? []);
      setSignedIn(true);
    } catch (error: any) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) loadProducts();
    });
  }, [supabase]);

  async function login(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return setMessage('Supabase ainda não está configurado.');
    setLoading(true); setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setMessage(error.message);
    await loadProducts();
  }

  async function logout() {
    await supabase?.auth.signOut();
    setSignedIn(false); setProducts([]); setEditingId(null); setForm(emptyForm);
  }

  async function uploadImage(file?: File) {
    if (!file) return;
    setLoading(true); setMessage('Enviando imagem...');
    try {
      const body = new FormData(); body.append('file', file);
      const data = await api('/api/admin/upload', { method: 'POST', body });
      setForm(prev => ({ ...prev, image_url: data.url, gallery: Array.from(new Set([data.url, ...prev.gallery])) }));
      setMessage('Imagem enviada com sucesso.');
    } catch (error: any) { setMessage(error.message); }
    finally { setLoading(false); }
  }

  async function saveProduct(e: FormEvent) {
    e.preventDefault(); setLoading(true); setMessage('');
    try {
      const payload = { ...form, price: Number(form.price), sale_price: form.sale_price === null ? null : Number(form.sale_price), stock: Number(form.stock) };
      if (editingId) await api(`/api/admin/products/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
      else await api('/api/admin/products', { method: 'POST', body: JSON.stringify(payload) });
      setForm(emptyForm); setEditingId(null); setMessage(editingId ? 'Produto atualizado.' : 'Produto cadastrado.');
      await loadProducts();
    } catch (error: any) { setMessage(error.message); }
    finally { setLoading(false); }
  }

  function editProduct(product: Product) {
    const { id, ...rest } = product;
    setEditingId(id); setForm({ ...emptyForm, ...rest }); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function removeProduct(id: string) {
    if (!confirm('Excluir este produto?')) return;
    try { await api(`/api/admin/products/${id}`, { method: 'DELETE' }); await loadProducts(); setMessage('Produto excluído.'); }
    catch (error: any) { setMessage(error.message); }
  }

  if (!signedIn) {
    return <main className="admin-shell"><section className="admin-login"><p className="eyebrow">G&M Imports</p><h1>Painel administrativo</h1><p>Entre com uma conta do Supabase que possua <strong>role = admin</strong>.</p><form onSubmit={login} className="admin-form"><label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label><label>Senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label><button className="admin-primary" disabled={loading}>{loading?'Entrando...':'Entrar'}</button></form>{message && <p className="admin-message">{message}</p>}</section></main>;
  }

  return <main className="admin-shell">
    <header className="admin-top"><div><p className="eyebrow">G&M Imports</p><h1>Produtos</h1><p>Cadastre, publique e atualize o catálogo da loja.</p></div><button className="admin-secondary" onClick={logout}>Sair</button></header>
    {message && <p className="admin-message">{message}</p>}

    <section className="admin-card">
      <div className="admin-card-head"><h2>{editingId ? 'Editar produto' : 'Novo produto'}</h2>{editingId && <button className="admin-secondary" onClick={()=>{setEditingId(null);setForm(emptyForm)}}>Cancelar edição</button>}</div>
      <form onSubmit={saveProduct} className="admin-grid-form">
        <label>Nome<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></label>
        <label>Marca<input value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} required /></label>
        <label>Preço<input type="number" step="0.01" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})} required /></label>
        <label>Preço promocional<input type="number" step="0.01" value={form.sale_price ?? ''} onChange={e=>setForm({...form,sale_price:e.target.value===''?null:Number(e.target.value)})} /></label>
        <label>Estoque<input type="number" value={form.stock} onChange={e=>setForm({...form,stock:Number(e.target.value)})} /></label>
        <label>SKU<input value={form.sku ?? ''} onChange={e=>setForm({...form,sku:e.target.value})} /></label>
        <label>Volume<input value={form.volume ?? ''} onChange={e=>setForm({...form,volume:e.target.value})} /></label>
        <label>Família olfativa<input value={form.family ?? ''} onChange={e=>setForm({...form,family:e.target.value})} placeholder="Gourmand, Floral..." /></label>
        <label className="span-2">Descrição curta<input value={form.short_description ?? ''} onChange={e=>setForm({...form,short_description:e.target.value})} /></label>
        <label className="span-2">Descrição<textarea value={form.description ?? ''} onChange={e=>setForm({...form,description:e.target.value})} rows={4} /></label>
        <label className="span-2">Notas de saída<input value={textFromList(form.top_notes)} onChange={e=>setForm({...form,top_notes:listFromText(e.target.value)})} placeholder="pera, frutas vermelhas" /></label>
        <label className="span-2">Notas de coração<input value={textFromList(form.heart_notes)} onChange={e=>setForm({...form,heart_notes:listFromText(e.target.value)})} /></label>
        <label className="span-2">Notas de fundo<input value={textFromList(form.base_notes)} onChange={e=>setForm({...form,base_notes:listFromText(e.target.value)})} /></label>
        <label className="span-2">Vibes<input value={textFromList(form.vibe)} onChange={e=>setForm({...form,vibe:listFromText(e.target.value)})} placeholder="Doce, Romântica, Sensual" /></label>
        <label className="span-2">Ocasiões<input value={textFromList(form.occasions)} onChange={e=>setForm({...form,occasions:listFromText(e.target.value)})} placeholder="Dia a dia, Encontro, Noite" /></label>
        <label>Doçura ({form.sweetness}%)<input type="range" min="0" max="100" value={form.sweetness} onChange={e=>setForm({...form,sweetness:Number(e.target.value)})} /></label>
        <label>Intensidade ({form.intensity}%)<input type="range" min="0" max="100" value={form.intensity} onChange={e=>setForm({...form,intensity:Number(e.target.value)})} /></label>
        <label>Frescor ({form.freshness}%)<input type="range" min="0" max="100" value={form.freshness} onChange={e=>setForm({...form,freshness:Number(e.target.value)})} /></label>
        <label>Foto principal<input type="file" accept="image/*" onChange={e=>uploadImage(e.target.files?.[0])} /></label>
        {form.image_url && <div className="image-preview span-2"><img src={form.image_url} alt="Prévia do produto" /></div>}
        <div className="admin-checks span-2"><label><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form,is_active:e.target.checked})} /> Produto ativo</label><label><input type="checkbox" checked={form.is_new} onChange={e=>setForm({...form,is_new:e.target.checked})} /> Novidade</label><label><input type="checkbox" checked={form.is_featured} onChange={e=>setForm({...form,is_featured:e.target.checked})} /> Destaque</label></div>
        <button className="admin-primary span-2" disabled={loading}>{loading?'Salvando...':editingId?'Salvar alterações':'Cadastrar produto'}</button>
      </form>
    </section>

    <section className="admin-card"><div className="admin-card-head"><h2>Catálogo ({products.length})</h2><button className="admin-secondary" onClick={loadProducts}>Atualizar</button></div><div className="admin-products">{products.map(product=><article key={product.id} className="admin-product-row"><div className="admin-product-thumb">{product.image_url?<img src={product.image_url} alt={product.name}/>:<span>G&M</span>}</div><div className="admin-product-main"><strong>{product.name}</strong><small>{product.brand} · {product.volume || 'Sem volume'} · Estoque {product.stock}</small><span>R$ {Number(product.sale_price ?? product.price).toFixed(2).replace('.', ',')}</span></div><div className="admin-row-actions"><button onClick={()=>editProduct(product)}>Editar</button><button className="danger" onClick={()=>removeProduct(product.id)}>Excluir</button></div></article>)}{!products.length && <p>Nenhum produto cadastrado.</p>}</div></section>
  </main>;
}
