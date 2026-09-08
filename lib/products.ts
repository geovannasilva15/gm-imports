export type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  volume: string;
  family: string;
  vibe: string;
  intensity: string;
  notes: string[];
  rating: number;
  badge: string;
  occasion: string;
  image?: string;
};

export const products: Product[] = [
  { id: 1, name: 'Bare Vanilla Fragrance Mist', brand: "Victoria's Secret", price: 169.9, volume: '250 ml', family: 'Gourmand', vibe: 'Doce', intensity: 'Moderada', notes: ['baunilha', 'cashmere'], rating: 4.9, badge: 'Queridinho', occasion: 'Dia a dia' },
  { id: 2, name: 'Pure Seduction Fragrance Mist', brand: "Victoria's Secret", price: 169.9, volume: '250 ml', family: 'Frutado', vibe: 'Sensual', intensity: 'Marcante', notes: ['ameixa', 'frésia'], rating: 4.9, badge: 'Mais vendido', occasion: 'Encontro' },
  { id: 3, name: 'Love Spell Fragrance Mist', brand: "Victoria's Secret", price: 169.9, volume: '250 ml', family: 'Floral', vibe: 'Romântica', intensity: 'Marcante', notes: ['maçã vermelha', 'flor de cerejeira', 'pêssego'], rating: 4.9, badge: 'Clássico', occasion: 'Dia a dia' },
  { id: 4, name: 'Velvet Petals Fragrance Mist', brand: "Victoria's Secret", price: 179.9, volume: '250 ml', family: 'Floral', vibe: 'Elegante', intensity: 'Moderada', notes: ['florais', 'amêndoa'], rating: 4.8, badge: 'Elegante', occasion: 'Noite' },
  { id: 5, name: 'Aqua Kiss Fragrance Mist', brand: "Victoria's Secret", price: 159.9, volume: '250 ml', family: 'Fresco', vibe: 'Fresca', intensity: 'Leve', notes: ['notas aquáticas', 'flores'], rating: 4.8, badge: 'Fresh', occasion: 'Depois do banho' },
  { id: 6, name: 'Amber Romance Fragrance Mist', brand: "Victoria's Secret", price: 169.9, volume: '250 ml', family: 'Gourmand', vibe: 'Sensual', intensity: 'Marcante', notes: ['âmbar', 'baunilha'], rating: 4.8, badge: 'Marcante', occasion: 'Noite' },
  { id: 7, name: 'Coconut Passion Fragrance Mist', brand: "Victoria's Secret", price: 169.9, volume: '250 ml', family: 'Gourmand', vibe: 'Doce', intensity: 'Moderada', notes: ['coco', 'baunilha'], rating: 4.8, badge: 'Cremoso', occasion: 'Dia a dia' },
  { id: 8, name: 'Love Spell Brulee Fragrance Mist', brand: "Victoria's Secret", price: 149.9, volume: '250 ml', family: 'Gourmand', vibe: 'Doce', intensity: 'Marcante', notes: ['mel', 'pêssego', 'sândalo açucarado'], rating: 4.8, badge: 'Novidade', occasion: 'Encontro' }
];
