'use client';

import { useEffect, useMemo, useState } from 'react';
import { Heart, Search, ShoppingBag, SlidersHorizontal, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  sale_price: number | null;
  volume: string | null;
  family: string | null;
  vibe: string[];
  intensity: number;
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  rating: number;
  image_url: string | null;
  is_new: boolean;
  is_featured: boolean;
};

const demoProducts: Product[] = [
  { id:'demo-1',name:'Bare Vanilla Fragrance Mist',brand:"Victoria's Secret",price:169.9,sale_price:null,volume:'250 ml',family:'Gourmand',vibe:['Doce'],intensity:60,top_notes:['baunilha'],heart_notes:['cashmere'],base_notes:[],rating:4.9,image_url:null,is_new:false,is_featured:true },
  { id:'demo-2',name:'Pure Seduction Fragrance Mist',brand:"Victoria's Secret",price:169.9,sale_price:null,volume:'250 ml',family:'Frutado',vibe:['Sensual'],intensity:85,top_notes:['ameixa'],heart_notes:['frésia'],base_notes:[],rating:4.9,image_url:null,is_new:false,is_featured:true },
  { id:'demo-3',name:'Love Spell Fragrance Mist',brand:"Victoria's Secret",price:169.9,sale_price:null,volume:'250 ml',family:'Floral',vibe:['Romântica'],intensity:80,top_notes:['maçã vermelha'],heart_notes:['flor de cerejeira'],base_notes:['pêssego'],rating:4.9,image_url:null,is_new:false,is_featured:false }
];

const money = (value: number) => value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const intensityLabel = (value:number) => value < 35 ? 'Leve' : value < 70 ? 'Moderada' : 'Marcante';

export default function Storefront() {
  const [products,setProducts]=useState<Product[]>(demoProducts);
  const [query,setQuery]=useState('');
  const [family,setFamily]=useState('');
  const [vibe,setVibe]=useState('');
  const [cart,setCart]=useState<string[]>([]);
  const [favorites,setFavorites]=useState<string[]>([]);
  const [catalogStatus,setCatalogStatus]=useState('Modo demonstração');

  useEffect(()=>{
    const supabase=createClient();
    if(!supabase) return;
    supabase.from('products').select('id,name,brand,price,sale_price,volume,family,vibe,intensity,top_notes,heart_notes,base_notes,rating,image_url,is_new,is_featured').eq('is_active',true).order('created_at',{ascending:false}).then(({data,error})=>{
      if(!error && data?.length){ setProducts(data as Product[]); setCatalogStatus('Catálogo ao vivo'); }
      else if(!error){ setProducts([]); setCatalogStatus('Catálogo conectado — cadastre produtos no painel'); }
    });
  },[]);

  const families=useMemo(()=>Array.from(new Set(products.map(p=>p.family).filter(Boolean))) as string[],[products]);
  const vibes=useMemo(()=>Array.from(new Set(products.flatMap(p=>p.vibe||[]))),[products]);
  const filtered=useMemo(()=>products.filter(p=>{
    const notes=[...(p.top_notes||[]),...(p.heart_notes||[]),...(p.base_notes||[])];
    const haystack=[p.name,p.brand,p.family,...(p.vibe||[]),...notes].join(' ').toLowerCase();
    return (!query||haystack.includes(query.toLowerCase())) && (!family||p.family===family) && (!vibe||(p.vibe||[]).includes(vibe));
  }),[products,query,family,vibe]);

  return <>
    <div className="topbar">Envio para todo o Brasil • Compra segura • Novidades toda semana</div>
    <header className="siteHeader"><a className="logo" href="#home"><strong>G&M</strong><span>IMPORTS</span></a><nav><a href="#home">Início</a><a href="#catalogo">Body Splash</a><a href="#finder">Descobrir fragrância</a><a href="#sobre">Sobre</a></nav><div className="headerActions"><Search size={19}/><Heart size={19}/><div className="cartIcon"><ShoppingBag size={19}/><b>{cart.length}</b></div></div></header>
    <main>
      <section id="home" className="hero"><div className="heroCopy"><span className="eyebrow">Boutique de fragrâncias importadas</span><h1>Sua fragrância favorita, mais perto de você.</h1><p>Descubra body splashes, perfumes e autocuidado com uma experiência de compra feminina, elegante e personalizada.</p><div className="actions"><a className="primary" href="#catalogo">Comprar agora</a><a className="secondary" href="#finder">Descobrir minha fragrância</a></div></div><div className="heroPanel"><Sparkles/><span>G&M Fragrance Finder</span><h2>Qual combina com você hoje?</h2><p>Escolha por vibe, aroma ou ocasião.</p></div></section>
      <section id="catalogo" className="catalogSection"><div className="sectionTitle"><div><span className="eyebrow">{catalogStatus}</span><h2>Body Splashes</h2></div><SlidersHorizontal/></div><div className="toolbar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por baunilha, floral, Pure Seduction..."/><select value={family} onChange={e=>setFamily(e.target.value)}><option value="">Todas as famílias</option>{families.map(item=><option key={item}>{item}</option>)}</select><select value={vibe} onChange={e=>setVibe(e.target.value)}><option value="">Todas as vibes</option>{vibes.map(item=><option key={item}>{item}</option>)}</select></div><div className="productGrid">{filtered.map(product=><ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} onFavorite={()=>setFavorites(current=>current.includes(product.id)?current.filter(x=>x!==product.id):[...current,product.id])} onAdd={()=>setCart(current=>[...current,product.id])}/>)}{!filtered.length&&<p>Nenhum produto encontrado.</p>}</div></section>
      <section id="finder" className="finder"><span className="eyebrow">G&M Fragrance Finder</span><h2>Descubra seu Body Splash ideal</h2><p>O catálogo agora está preparado para usar dados reais cadastrados no Supabase, incluindo vibe, notas, intensidade e ocasião.</p><button className="primary">Começar meu match</button></section>
      <section id="sobre" className="about"><div><span className="eyebrow">Soft luxury, do seu jeito</span><h2>Uma boutique digital pensada para descobrir, comparar e comprar melhor.</h2></div><p>A G&M Imports é uma loja independente. Marcas de terceiros pertencem aos seus respectivos titulares.</p></section>
    </main>
    <footer><div className="logo"><strong>G&M</strong><span>IMPORTS</span></div><p>Fragrâncias importadas • Autocuidado • Curadoria feminina</p></footer>
  </>;
}

function ProductCard({product,favorite,onFavorite,onAdd}:{product:Product;favorite:boolean;onFavorite:()=>void;onAdd:()=>void}){
  const notes=[...(product.top_notes||[]),...(product.heart_notes||[]),...(product.base_notes||[])].slice(0,4);
  const price=Number(product.sale_price??product.price);
  return <article className="productCard"><div className="productImage">{product.image_url?<img src={product.image_url} alt={product.name}/>:<div className="placeholder">Foto real<br/>do produto</div>}{product.is_new&&<span className="badge">Novidade</span>}<button className="heart" onClick={onFavorite}>{favorite?'♥':'♡'}</button></div><div className="productBody"><small>{product.brand} • {product.volume||'Volume não informado'}</small><h3>{product.name}</h3><p>{product.family||'Família não informada'} • {intensityLabel(Number(product.intensity||0))} • ★ {Number(product.rating||0).toFixed(1)}</p><p className="notes">{notes.length?notes.join(' • '):'Notas olfativas em breve'}</p><strong>{money(price)}</strong><button className="addButton" onClick={onAdd}>Adicionar ao carrinho</button></div></article>;
}
