'use client';

import { useMemo, useState } from 'react';
import { Heart, Search, ShoppingBag, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Product, products } from '@/lib/products';

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Storefront() {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('');
  const [vibe, setVibe] = useState('');
  const [cart, setCart] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  const filtered = useMemo(() => products.filter((p) => {
    const haystack = [p.name, p.brand, p.family, p.vibe, p.intensity, ...p.notes].join(' ').toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (!family || p.family === family) && (!vibe || p.vibe === vibe);
  }), [query, family, vibe]);

  const addToCart = (id: number) => setCart((current) => [...current, id]);
  const toggleFavorite = (id: number) => setFavorites((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);

  return (
    <>
      <div className="topbar">Envio para todo o Brasil • Compra segura • Novidades toda semana</div>
      <header className="siteHeader">
        <a className="logo" href="#home"><strong>G&M</strong><span>IMPORTS</span></a>
        <nav>
          <a href="#home">Início</a>
          <a href="#catalogo">Body Splash</a>
          <a href="#finder">Descobrir fragrância</a>
          <a href="#sobre">Sobre</a>
        </nav>
        <div className="headerActions"><Search size={19}/><Heart size={19}/><div className="cartIcon"><ShoppingBag size={19}/><b>{cart.length}</b></div></div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="heroCopy">
            <span className="eyebrow">Boutique de fragrâncias importadas</span>
            <h1>Sua fragrância favorita, mais perto de você.</h1>
            <p>Descubra body splashes, perfumes e autocuidado com uma experiência de compra feminina, elegante e personalizada.</p>
            <div className="actions"><a className="primary" href="#catalogo">Comprar agora</a><a className="secondary" href="#finder">Descobrir minha fragrância</a></div>
          </div>
          <div className="heroPanel"><Sparkles/><span>G&M Fragrance Finder</span><h2>Qual combina com você hoje?</h2><p>Escolha por vibe, aroma ou ocasião.</p></div>
        </section>

        <section id="catalogo" className="catalogSection">
          <div className="sectionTitle"><div><span className="eyebrow">Encontre seu favorito</span><h2>Body Splashes</h2></div><SlidersHorizontal/></div>
          <div className="toolbar">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por baunilha, floral, Pure Seduction..." />
            <select value={family} onChange={(e) => setFamily(e.target.value)}><option value="">Todas as famílias</option><option>Floral</option><option>Frutado</option><option>Gourmand</option><option>Fresco</option></select>
            <select value={vibe} onChange={(e) => setVibe(e.target.value)}><option value="">Todas as vibes</option><option>Romântica</option><option>Doce</option><option>Sensual</option><option>Fresca</option><option>Elegante</option></select>
          </div>
          <div className="productGrid">{filtered.map((product) => <ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} onFavorite={() => toggleFavorite(product.id)} onAdd={() => addToCart(product.id)} />)}</div>
        </section>

        <section id="finder" className="finder">
          <span className="eyebrow">G&M Fragrance Finder</span><h2>Descubra seu Body Splash ideal</h2><p>Na próxima etapa, esta área será conectada ao catálogo do Supabase para recomendar produtos reais com base em vibe, notas, intensidade e ocasião.</p><button className="primary">Começar meu match</button>
        </section>

        <section id="sobre" className="about"><div><span className="eyebrow">Soft luxury, do seu jeito</span><h2>Uma boutique digital pensada para descobrir, comparar e comprar melhor.</h2></div><p>A G&M Imports é uma loja independente. Marcas de terceiros pertencem aos seus respectivos titulares.</p></section>
      </main>

      <footer><div className="logo"><strong>G&M</strong><span>IMPORTS</span></div><p>Fragrâncias importadas • Autocuidado • Curadoria feminina</p></footer>
    </>
  );
}

function ProductCard({ product, favorite, onFavorite, onAdd }: { product: Product; favorite: boolean; onFavorite: () => void; onAdd: () => void }) {
  return <article className="productCard"><div className="productImage">{product.image ? <img src={product.image} alt={product.name}/> : <div className="placeholder">Foto real<br/>do produto</div>}<span className="badge">{product.badge}</span><button className="heart" onClick={onFavorite}>{favorite ? '♥' : '♡'}</button></div><div className="productBody"><small>{product.brand} • {product.volume}</small><h3>{product.name}</h3><p>{product.family} • {product.intensity} • ★ {product.rating}</p><p className="notes">{product.notes.join(' • ')}</p><strong>{money(product.price)}</strong><button className="addButton" onClick={onAdd}>Adicionar ao carrinho</button></div></article>;
}
