"use client";

import { useState, useMemo, useEffect } from "react";
import { products as defaultProducts } from "@/data/products";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import ProductDrawer from "@/components/ProductDrawer";
import { getProducts } from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { SHOP_CONFIG } from "@/config/shop";
import { 
  Star, 
  Truck, 
  Store, 
  ArrowRight, 
  ArrowLeft, 
  ArrowDown,
  ShoppingBag, 
  ShieldCheck, 
  Crown, 
  Search, 
  X, 
  MapPin, 
  Clock, 
  Sparkles, 
  Check, 
  Phone, 
  Compass, 
  CreditCard, 
  Smartphone, 
  Receipt 
} from "lucide-react";

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

type Product = {
  id: string | number;
  name: string;
  category: string;
  desc: string;
  price: number;
  image: string;
  rating: number;
  specs?: Record<string, string | number | boolean | undefined>;
  brand?: string;
  quantity?: number;
  colors?: string[];
  images?: string[];
  cartId?: string;
  selectedColor?: string;
  selectedCapacity?: string;
  storageOptions?: { capacity: string; price: number }[];
};

const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'phones', label: 'Téléphones' },
  { id: 'computers', label: 'Ordinateurs' },
  { id: 'tablets', label: 'Tablettes' },
  { id: 'accessories', label: 'Accessoires' },
  { id: 'tv', label: 'TV' },
  { id: 'tech', label: 'High-Tech' },
  { id: 'audio', label: 'Boomers' },
  { id: 'mobility', label: 'Motos Électriques' },
  { id: 'solar', label: 'Solaire' },
];

const phoneBrands = ['Iphones', 'Samsung', 'Google Pixel', 'Redmi', 'Huawei', 'Tecno', 'Infinix', 'Honor', 'Itel', 'OALE'];

const getColorCode = (name: string) => {
  const n = (name || '').toLowerCase();
  if (n.includes('cuivre') || n.includes('copper')) return '#b45309';
  if (n.includes('platine') || n.includes('platinum')) return '#cbd5e1';
  if (n.includes('ciel') || n.includes('ice') || n.includes('glacier') || n.includes('brume')) return '#7dd3fc';
  if (n.includes('onyx') || n.includes('noir') || n.includes('black') || n.includes('sombre') || n.includes('minuit') || n.includes('volcanique') || n.includes('graphite')) return '#18181b';
  if (n.includes('blanc') || n.includes('white') || n.includes('argent') || n.includes('silver') || n.includes('lumière') || n.includes('starlight') || n.includes('porcelaine') || n.includes('neige') || n.includes('lunaire')) return '#f1f5f9';
  if (n.includes('bleu') || n.includes('blue') || n.includes('océan') || n.includes('baie') || n.includes('outremer') || n.includes('navy')) return '#2563eb';
  if (n.includes('champagne') || n.includes('désert') || n.includes('or') || n.includes('gold') || n.includes('jaune') || n.includes('yellow')) return '#d4af37';
  if (n.includes('orange') || n.includes('corail')) return '#f97316';
  if (n.includes('rose') || n.includes('pink')) return '#f472b6';
  if (n.includes('crème') || n.includes('cream') || n.includes('beige') || n.includes('galet') || n.includes('chalk')) return '#e5e5d8';
  if (n.includes('naturel') || n.includes('sable')) return '#a8a29e';
  if (n.includes('vert') || n.includes('green') || n.includes('sauge') || n.includes('menthe') || n.includes('aloe') || n.includes('sarcelle') || n.includes('teal') || n.includes('forêt') || n.includes('graygreen')) return '#10b981';
  if (n.includes('pourpre') || n.includes('violet') || n.includes('purple') || n.includes('mauve') || n.includes('astral')) return '#9333ea';
  if (n.includes('titane') || n.includes('gris') || n.includes('grey') || n.includes('charbon') || n.includes('sidéral')) return '#71717a';
  if (n.includes('rouge') || n.includes('red')) return '#dc2626';
  return '#a1a1aa';
};

function getProductSummarySnippet(product: Product): string {
  const specs = product.specs || {};
  const cat = (product.category || '').toLowerCase();

  if (cat === 'computers' || cat === 'ordinateurs') {
    const parts = [
      specs.processor,
      specs.ram ? `${specs.ram} Go RAM` : null,
      specs.storageSize ? `${specs.storageSize} ${specs.storageType || ''}`.trim() : null
    ].filter(Boolean);
    if (parts.length > 0) return parts.join(' • ');
  }

  if (cat === 'mobility' || cat === 'motos') {
    const parts = [
      specs.motorPower ? `${specs.motorPower} W` : (specs.motor || null),
      specs.rangeKm ? `${specs.rangeKm} km` : (specs.range || null),
      specs.maxSpeedKm ? `${specs.maxSpeedKm} km/h` : (specs.speed || null)
    ].filter(Boolean);
    if (parts.length > 0) return parts.join(' • ');
  }

  if (cat === 'tablets' || cat === 'tablettes') {
    const parts = [
      specs.screenSize ? `${specs.screenSize}"` : (specs.screen || null),
      specs.storageSize ? `${specs.storageSize} Go` : null,
      specs.connectivity
    ].filter(Boolean);
    if (parts.length > 0) return parts.join(' • ');
  }

  if (cat === 'accessories' || cat === 'accessoires') {
    const parts = [
      specs.accessoryType,
      specs.compatibility ? `Pour ${specs.compatibility}` : null
    ].filter(Boolean);
    if (parts.length > 0) return parts.join(' • ');
  }

  if (cat === 'phones' || cat === 'smartphones') {
    const parts = [
      specs.screen,
      specs.processor,
      specs.ram ? `${specs.ram} Go RAM` : null
    ].filter(Boolean);
    if (parts.length > 0) return parts.join(' • ');
  }

  if (specs.screen || specs.processor) {
    return [specs.screen, specs.processor].filter(Boolean).join(' • ');
  }

  return product.desc || '';
}

function ProductCardItem({ 
  product, 
  onOpen, 
  onAddToCart 
}: { 
  product: Product; 
  onOpen: (p: Product) => void; 
  onAddToCart: (p: Product, color?: string) => void;
}) {
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const images = (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : []);
  const activeImage = images[activeColorIdx] || product.image;
  const activeColor = product.colors?.[activeColorIdx] || '';
  const optionsCount = product.storageOptions?.length || (product.category === 'phones' ? 4 : 0);
  const specsSnippet = getProductSummarySnippet(product);

  // Glissement tactile au doigt directement sur la carte (Amazon / AliExpress Style)
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);

  const handlePrevImage = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setActiveColorIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setActiveColorIdx((prev) => (prev + 1) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (images.length <= 1) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (images.length <= 1 || touchStartX === 0) return;
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(diffX) > 28 && Math.abs(diffX) > Math.abs(diffY)) {
      e.stopPropagation();
      if (diffX < 0) {
        handleNextImage(e);
      } else {
        handlePrevImage(e);
      }
    }
    setTouchStartX(0);
    setTouchStartY(0);
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={() => onOpen(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(product);
        }
      }}
      className="glass-panel p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex flex-row items-stretch transition-all duration-300 hover:shadow-[0_12px_32px_rgba(212,175,55,0.18)] hover:border-gold/40 hover:-translate-y-0.5 active:scale-[0.99] group relative overflow-hidden bg-black/40 border border-white/10 gap-3 sm:gap-4 cursor-pointer"
    >
      {/* 1. Colonne GAUCHE : Image Style Amazon / AliExpress avec glissement tactile */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-32 sm:w-44 md:w-48 flex-shrink-0 rounded-xl sm:rounded-2xl bg-white overflow-hidden flex items-center justify-center p-2.5 sm:p-4 relative shadow-inner group/img select-none"
      >
        {activeImage?.length > 4 ? (
          <img 
            key={activeImage}
            src={activeImage} 
            alt={product.name} 
            className="max-w-full max-h-full object-contain group-hover/img:scale-105 transition-all duration-300 animate-in fade-in" 
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://placehold.co/600x600/121216/d4af37?text=${encodeURIComponent(product.name)}`;
            }}
          />
        ) : (
          <div className="text-6xl sm:text-7xl group-hover/img:scale-105 transition-transform duration-300">{activeImage}</div>
        )}

        {/* Flèches de navigation rapide style Amazon au survol desktop */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Couleur précédente"
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/90 text-white text-xs items-center justify-center hidden sm:group-hover/img:flex transition-all shadow-md z-10 cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Couleur suivante"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/90 text-white text-xs items-center justify-center hidden sm:group-hover/img:flex transition-all shadow-md z-10 cursor-pointer"
            >
              ›
            </button>
          </>
        )}

        {/* Indicateur de pagination à points style Amazon / AliExpress (ex: ● ○ ○ ○) */}
        {images.length > 1 && (
          <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-center gap-1 z-10 pointer-events-none">
            {images.map((_, i) => (
              <span 
                key={i} 
                className={`transition-all duration-200 rounded-full ${
                  activeColorIdx === i 
                    ? 'w-2 h-2 bg-gold shadow-[0_0_6px_rgba(212,175,55,0.8)] scale-110' 
                    : 'w-1.5 h-1.5 bg-black/30 border border-white/40'
                }`} 
              />
            ))}
          </div>
        )}

        {/* Badge discret nombre de photos */}
        {images.length > 1 && (
          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-white/20 text-[9px] font-bold text-white/90 shadow-sm pointer-events-none">
            {activeColorIdx + 1}/{images.length}
          </div>
        )}
      </div>

      {/* 2. Colonne DROITE : Caractéristiques & Infos Style Amazon */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Titre Produit */}
          <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 group-hover:text-gold transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Sous-titre / Spécifications courtes */}
          {specsSnippet && (
            <p className="text-[11px] sm:text-xs text-zinc-400 line-clamp-1 mt-0.5">
              {specsSnippet}
            </p>
          )}

          {/* Options & Étoiles */}
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {optionsCount > 0 && (
              <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium">
                Options : <strong className="text-gold font-semibold">{optionsCount} tailles</strong>
              </span>
            )}
            {/* Note & Étoiles masquées pour le moment (conservées pour mise à jour ultérieure) :
            <div className="flex items-center gap-1 text-[11px]">
              <span className="font-bold text-white text-[11px]">{product.rating || 4.8}</span>
              <div className="flex items-center gap-0.5 text-gold" aria-label="Note 5 sur 5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-gold text-gold" aria-hidden="true" />
                ))}
              </div>
              <span className="text-zinc-500 text-[10px]">({Math.round((product.rating || 4.8) * 28)})</span>
            </div>
            */}
          </div>

          {/* Prix FCFA en grand format doré */}
          <div className="mt-1.5">
            <span className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-400 to-white tracking-tight">
              {product.price.toLocaleString('fr-FR')} <span className="text-xs sm:text-sm text-gold font-bold">FCFA</span>
            </span>
          </div>

          {/* Mention Livraison & Retrait */}
          <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium mt-1 flex items-center gap-2 flex-wrap">
            <span className="text-zinc-300 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
              <span>Livraison Express</span>
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-gold flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              <span>Retrait Showroom</span>
            </span>
          </p>

          {/* Pastilles de couleurs interactives style Amazon */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/5">
              <div className="text-[10px] sm:text-[11px] text-zinc-400 mb-1">
                Couleur : <strong className="text-white font-semibold">{activeColor}</strong>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.colors.map((colorName, idx) => {
                  const isCurrent = activeColorIdx === idx;
                  const bgHex = getColorCode(colorName);
                  return (
                    <button
                      key={idx}
                      type="button"
                      title={colorName}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveColorIdx(idx);
                      }}
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all relative flex items-center justify-center flex-shrink-0 cursor-pointer ${
                        isCurrent 
                          ? 'ring-2 ring-gold ring-offset-2 ring-offset-black scale-110 shadow-sm' 
                          : 'border border-white/30 opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: bgHex }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Boutons d'action optimisés pour mobile & desktop */}
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(product);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <span>Détails & Tailles</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, activeColor);
              }}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-gold to-yellow-600 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(212,175,55,0.3)] hover:brightness-110 transition-all active:scale-95 cursor-pointer"
              title="Ajouter directement au panier"
              aria-label="Ajouter directement au panier"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-black" aria-hidden="true" />
              <span className="text-[11px] font-black">Ajouter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Produit actif pour le drawer
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false); // État d'ouverture du slide-over
  
  const [localProducts, setLocalProducts] = useState<Product[]>(defaultProducts);

  // Charger les produits : Firebase d'abord, mais TOUJOURS fusionner les nouveaux produits par défaut
  useEffect(() => {
    async function loadProducts() {
      try {
        // 1. Essayer Firebase en priorité (données partagées entre tous les visiteurs)
        if (isFirebaseConfigured()) {
          const firebaseProducts = (await getProducts()) as Product[] | null;
          if (firebaseProducts && firebaseProducts.length > 0) {
            // Fusionner Firebase avec les nouveaux produits par défaut non présents dans Firebase
            const existingIds = new Set(firebaseProducts.map((p: Product) => String(p.id)));
            const newDefaults = defaultProducts.filter(dp => !existingIds.has(String(dp.id)));
            const combined = [...firebaseProducts, ...newDefaults];
            setLocalProducts(combined);
            try {
              localStorage.setItem("prince_cfa_products", JSON.stringify(combined));
            } catch (e) {
              console.warn("Storage warning:", e);
            }
            return;
          }
        }
      } catch (err) {
        console.warn("Firebase non disponible, utilisation du fallback local.", err);
      }

      // 2. Fallback : localStorage + produits par défaut
      const saved = localStorage.getItem("prince_cfa_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        const migrated = parsed.map((p: Product) => {
          const defaultMatch = defaultProducts.find(dp => dp.id === p.id);
          const updatedProduct = { ...p };
          if (defaultMatch) {
            const isNewIphone = String(p.id).startsWith('pcfa-17') || String(p.id).startsWith('pcfa-18');
            if (isNewIphone) {
              updatedProduct.image = defaultMatch.image;
              updatedProduct.images = defaultMatch.images;
              updatedProduct.colors = defaultMatch.colors;
              updatedProduct.specs = defaultMatch.specs;
              updatedProduct.desc = defaultMatch.desc;
              if (defaultMatch.storageOptions && (!p.storageOptions || p.storageOptions.length <= 1)) {
                updatedProduct.storageOptions = defaultMatch.storageOptions;
              }
            } else {
              if (defaultMatch.colors && !p.colors) updatedProduct.colors = defaultMatch.colors;
              if (defaultMatch.images && !p.images) updatedProduct.images = defaultMatch.images;
              if (defaultMatch.brand && !p.brand) updatedProduct.brand = defaultMatch.brand;
              if (defaultMatch.storageOptions && !p.storageOptions) updatedProduct.storageOptions = defaultMatch.storageOptions;
            }
          }
          if (updatedProduct.category === 'phones' && !updatedProduct.brand) {
            const nameLower = updatedProduct.name.toLowerCase();
            if (nameLower.includes('iphone') || nameLower.includes('se 128')) updatedProduct.brand = 'Iphones';
            else if (nameLower.includes('samsung') || nameLower.includes('fold')) updatedProduct.brand = 'Samsung';
            else if (nameLower.includes('pixel')) updatedProduct.brand = 'Google Pixel';
            else if (nameLower.includes('redmi')) updatedProduct.brand = 'Redmi';
            else if (nameLower.includes('huawei')) updatedProduct.brand = 'Huawei';
            else if (nameLower.includes('tecno')) updatedProduct.brand = 'Tecno';
            else if (nameLower.includes('infinix')) updatedProduct.brand = 'Infinix';
            else if (nameLower.includes('honor')) updatedProduct.brand = 'Honor';
            else if (nameLower.includes('itel')) updatedProduct.brand = 'Itel';
            else if (nameLower.includes('oale')) updatedProduct.brand = 'OALE';
          }
          return updatedProduct;
        });
        const existingIds = new Set(migrated.map((p: Product) => String(p.id)));
        const newDefaults = defaultProducts.filter(dp => !existingIds.has(String(dp.id)));
        const combined = [...migrated, ...newDefaults];
        setLocalProducts(combined);
      } else {
        setLocalProducts(defaultProducts);
      }
    }
    loadProducts();
  }, []);

  // Gestionnaire de changement de catégorie avec réinitialisation de marque (sans effet en cascade)
  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedBrand('all');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Filtrage combiné (Recherche intelligente + Catégorie + Marque)
  const filteredProducts = useMemo(() => {
    let filtered = localProducts;
    
    // Si l'utilisateur effectue une recherche globale, on recherche en priorité dans l'ensemble du catalogue
    if (searchQuery.trim()) {
      const normalize = (str: string) =>
        (str || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();

      const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const tokens = normalize(searchQuery).split(/\s+/).filter(Boolean);

      return filtered.filter((product: Product) => {
        const brandAlias = (product.name?.toLowerCase().includes('iphone') || product.brand?.toLowerCase() === 'iphones')
          ? 'apple iphones'
          : (product.brand || '');

        const capacities = product.storageOptions?.map(s => s.capacity).join(' ') || '';
        const colors = product.colors?.join(' ') || '';
        const specs = product.specs ? Object.values(product.specs).join(' ') : '';
        
        const combined = normalize([
          product.name,
          brandAlias,
          product.category,
          product.desc,
          capacities,
          colors,
          specs
        ].join(' '));

        return tokens.every((token: string) => {
          if (/^[a-z0-9]+$/i.test(token)) {
            const regex = new RegExp(`\\b${escapeRegExp(token)}`, 'i');
            return regex.test(combined);
          }
          return combined.includes(token);
        });
      });
    }

    // 1. Filtre par catégorie (quand aucune recherche active)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // 1.5 Filtre par marque (si catégorie Téléphones)
    if (selectedCategory === 'phones' && selectedBrand !== 'all') {
      filtered = filtered.filter(p => {
        const matchBrand = p.brand?.toLowerCase() === selectedBrand.toLowerCase();
        const matchName = p.name.toLowerCase().includes(selectedBrand.toLowerCase()) || 
                          (selectedBrand === 'Iphones' && p.name.toLowerCase().includes('iphone'));
        return matchBrand || matchName;
      });
    }
    
    return filtered;
  }, [searchQuery, selectedCategory, selectedBrand, localProducts]);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDrawerOpen(true);
  };

  const handleCloseProduct = () => {
    setIsProductDrawerOpen(false);
  };

  const handleAddToCart = (
    product: Product, 
    color?: string, 
    capacity?: string, 
    customPrice?: number
  ) => {
    const chosenColor = color || product.colors?.[0] || '';
    const chosenCapacity = capacity || product.selectedCapacity || '';
    const finalPrice = customPrice !== undefined ? customPrice : product.price;
    
    const cartId = [product.id, chosenColor, chosenCapacity].filter(Boolean).join('-');
    
    setCartItems(prev => {
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item => item.cartId === cartId ? { ...item, quantity: (item.quantity || 1) + 1 } : item);
      }
      return [...prev, { 
        ...product, 
        price: finalPrice, 
        quantity: 1, 
        selectedColor: chosenColor, 
        selectedCapacity: chosenCapacity,
        cartId 
      }];
    });
    setIsCartOpen(true); // Ouvre le panier automatiquement
  };

  const updateCartQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeCartItem(cartId);
      return;
    }
    setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: newQuantity } : item));
  };

  const removeCartItem = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  return (
    <div className="flex flex-col min-h-screen items-center relative overflow-hidden bg-background">
      
      {/* Intégration de la Navbar */}
      <Navbar 
        cartCount={cartCount} 
        searchQuery={searchQuery}
        onSearch={setSearchQuery} 
        onOpenCart={() => setIsCartOpen(true)} 
        onSelectCategory={handleSelectCategory}
        onSelectBrand={setSelectedBrand}
        products={localProducts}
        onOpenProduct={handleOpenProduct}
      />

      {/* Intégration du Tiroir de Panier */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        updateQuantity={updateCartQuantity}
        removeItem={removeCartItem}
        onClearCart={() => setCartItems([])}
      />

      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <main className="z-10 flex flex-col items-center w-full mt-32 px-4 sm:px-8 max-w-7xl pb-24 sm:pb-0">
        
        {/* Section Hero Percutante */}
        <div className="space-y-6 py-12 sm:py-16 text-center animate-in slide-in-from-bottom-8 duration-1000 fade-in max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground drop-shadow-lg">
            PRINCE <span className="text-transparent bg-clip-text bg-gradient-to-br from-gold to-yellow-600">CFA</span> MALL
          </h1>
          
          <div className="space-y-3">
            <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-white tracking-wide">
              Bienvenue dans l&apos;univers de la technologie.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed">
              Smartphones, ordinateurs et accessoires technologiques : trouvez ce qu&apos;il vous faut au meilleur prix.
            </p>
          </div>

          {/* Bouton Découvrir nos produits */}
          <div className="pt-2">
            <a
              href="#produits"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById('produits');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold via-yellow-500 to-yellow-600 text-black font-bold text-sm sm:text-base tracking-wider uppercase shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
            >
              <span>Découvrir nos produits</span>
              <ArrowDown className="w-4 h-4 text-black group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Badges de Réassurance Prestige (Point 4) */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 my-4 z-20">
          <div className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-gold/40 hover:bg-gold/[0.03] transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform text-gold">
              <ShieldCheck className="w-6 h-6 text-gold" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-gold transition-colors">100% Authentique</h4>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 leading-snug">Produits certifiés d&apos;origine sous garantie.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-gold/40 hover:bg-gold/[0.03] transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center gap-1 p-1 flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
              <img src="/orange-money.png" alt="Orange Money" className="w-4 h-4 rounded object-contain" />
              <img src="/wave.png" alt="Wave" className="w-4 h-4 rounded-full object-cover" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-gold transition-colors">Orange Money & Wave</h4>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 leading-snug">Dépôt Orange Money ou Wave, ou règlement direct en boutique physique.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-gold/40 hover:bg-gold/[0.03] transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform text-gold">
              <Truck className="w-6 h-6 text-gold" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-gold transition-colors">Livraison Express</h4>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 leading-snug">Expédition rapide et sécurisée à votre porte.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-gold/40 hover:bg-gold/[0.03] transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform text-gold">
              <Crown className="w-6 h-6 text-gold" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-gold transition-colors">Service VIP 7j/7</h4>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 leading-snug">Assistance et conseils personnalisés sur WhatsApp.</p>
            </div>
          </div>
        </div>

        {/* Barres de Filtres Dynamiques */}
        <div id="produits" className="flex flex-col items-center w-full max-w-5xl mx-auto mt-8 mb-16 relative z-20 scroll-mt-28">
          
          {/* Catégories Principales */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {selectedCategory === 'all' ? (
              categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-300 active:scale-95 cursor-pointer ${
                    selectedCategory === cat.id 
                    ? 'bg-gradient-to-r from-gold to-yellow-600 text-black shadow-[0_0_20px_rgba(212,175,55,0.5)] scale-105' 
                    : 'bg-black/60 text-zinc-400 border border-white/10 hover:border-gold/50 hover:text-gold hover:bg-gold/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))
            ) : (
              <div className="flex items-center gap-3 sm:gap-4 animate-in zoom-in-95 duration-300">
                <button
                  onClick={() => handleSelectCategory('all')}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all duration-300 bg-black/60 text-zinc-400 border border-white/10 hover:border-white/50 hover:text-white active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Retour</span>
                </button>
                <div className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase bg-gradient-to-r from-gold to-yellow-600 text-black shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                  {categories.find(c => c.id === selectedCategory)?.label}
                </div>
              </div>
            )}
          </div>

          {/* Sous-catégories Marques (Uniquement si Téléphones est sélectionné) */}
          {selectedCategory === 'phones' && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 animate-in slide-in-from-top-4 fade-in duration-300">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all active:scale-95 cursor-pointer ${
                  selectedBrand === 'all'
                    ? "bg-white/20 text-white border border-white/30"
                    : "bg-transparent text-zinc-500 border border-white/5 hover:text-white"
                }`}
              >
                Toutes les marques
              </button>
              {phoneBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all active:scale-95 cursor-pointer ${
                    selectedBrand === brand
                      ? "bg-white/20 text-white border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                      : "bg-transparent text-zinc-500 border border-white/5 hover:border-white/20 hover:text-zinc-300"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grille de Produits */}
        <div className="w-full flex flex-col items-center mb-24 min-h-[500px]" id="collection">
          
          {/* Bandeau d'état de recherche active */}
          {searchQuery.trim() && (
            <div className="w-full max-w-4xl mx-auto mb-8 p-4 sm:p-5 rounded-2xl glass-panel border border-gold/40 bg-gold/5 flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300 shadow-[0_0_25px_rgba(212,175,55,0.1)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                  <Search className="w-5 h-5 text-gold" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Résultats de votre recherche</div>
                  <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                    &quot;<span className="text-gold">{searchQuery}</span>&quot;
                    <span className="text-xs font-normal text-zinc-400 ml-2">
                      ({filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''})
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-gold/20 hover:text-gold text-xs font-bold text-zinc-200 border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Effacer la recherche</span>
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4 text-gold">
                <Search className="w-8 h-8 text-gold" aria-hidden="true" />
              </div>
              <p className="text-xl text-white font-semibold">
                {searchQuery.trim() ? `Aucun produit ne correspond à "${searchQuery}"` : "Aucun produit ne correspond à votre sélection."}
              </p>
              <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto font-light">
                {searchQuery.trim() 
                  ? "Vérifiez l'orthographe ou essayez un mot-clé plus simple (ex: iPhone, Samsung, AirPods, 128 Go)." 
                  : "Veuillez choisir une autre catégorie ou marque."}
              </p>
              {searchQuery.trim() && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    handleSelectCategory('all');
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer"
                >
                  Afficher tout le catalogue
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-5 text-left w-full">
              {filteredProducts.map((product) => (
                <ProductCardItem
                  key={product.id}
                  product={product}
                  onOpen={handleOpenProduct}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section À Propos & Showroom Physique (Point 3) */}
        <section id="about" className="w-full max-w-6xl mx-auto my-20 pt-8 scroll-mt-28">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-gold/25 relative overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.08)]">
            {/* Décoration d'arrière-plan */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
            <Crown className="absolute -bottom-10 -left-10 w-44 h-44 text-gold opacity-5 pointer-events-none select-none" aria-hidden="true" />

            <div className="relative z-10 text-center max-w-3xl mx-auto mb-12">
              <div className="inline-block px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold tracking-widest uppercase mb-4">
                Boutique & Showroom Physique
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                L&apos;Expérience <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-400 to-yellow-600">PRINCE CFA</span> en Réel
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 mt-4 leading-relaxed font-light">
                Plus qu&apos;une simple boutique en ligne, venez découvrir, toucher et tester nos appareils dans un cadre haut de gamme pensé pour votre confort.
              </p>
            </div>

            {/* 3 Cartes d'Informations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              
              {/* Carte 1 : Localisation */}
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-gold/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-gold">
                    <MapPin className="w-6 h-6 text-gold" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Notre Showroom</h3>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed mb-1">
                    Ouagadougou, Burkina Faso
                  </p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Point GPS : 12°21&apos;46.8&quot;N 1°30&apos;59.2&quot;W<br/>
                    (Accès direct & Parking sécurisé)
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-gold font-semibold flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                    <span>Retrait sur place</span>
                  </span>
                  <a 
                    href={SHOP_CONFIG.mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-gold underline transition-colors flex items-center gap-1"
                  >
                    <span>Ouvrir Maps</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Carte 2 : Horaires */}
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-gold/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-gold">
                    <Clock className="w-6 h-6 text-gold" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Horaires d&apos;Ouverture</h3>
                  <div className="text-xs text-zinc-400 space-y-1.5 leading-relaxed">
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Lun - Sam :</span>
                      <strong className="text-white">08h30 - 20h00</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Dimanche :</span>
                      <strong className="text-white">14h00 - 19h30</strong>
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-[11px] text-green-400 font-semibold gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span>Commandes WhatsApp 24h/24</span>
                </div>
              </div>

              {/* Carte 3 : Services VIP en magasin */}
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-gold/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-gold">
                    <Sparkles className="w-6 h-6 text-gold" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Avantages Showroom</h3>
                  <ul className="text-xs text-zinc-400 space-y-2 leading-relaxed">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true" />
                      <span>Déballage et test sur place</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true" />
                      <span>Transfert de vos données offert</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true" />
                      <span>Facture légale & Garantie certifiée</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-[11px] text-gold font-semibold gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                  <span>Service client personnalisé</span>
                </div>
              </div>

            </div>

            {/* Boutons d'Action Rapides */}
            <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 relative z-10">
              <a 
                href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=Bonjour%20Prince%20CFA,%20je%20souhaite%20visiter%20votre%20boutique.`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] text-xs font-bold uppercase tracking-wider hover:bg-[#25D366] hover:text-white transition-all flex items-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp Showroom ({SHOP_CONFIG.displayPhone})</span>
              </a>

              <a 
                href={`tel:${SHOP_CONFIG.phone}`}
                className="px-6 py-3 rounded-xl border border-gold/40 bg-gold/10 text-gold text-xs font-bold uppercase tracking-wider hover:bg-gold hover:text-black transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-gold" aria-hidden="true" />
                <span>Appeler ({SHOP_CONFIG.phone})</span>
              </a>

              <a 
                href={SHOP_CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl border border-white/20 bg-white/5 text-zinc-200 text-xs font-bold uppercase tracking-wider hover:bg-gold hover:text-black hover:border-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4" aria-hidden="true" />
                <span>Ouvrir l&apos;Itinéraire Google Maps</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Luxueux */}
      <footer className="w-full border-t border-white/10 bg-[#08080a] relative z-20 mt-16 pt-16 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          
          {/* Col 1 : Marque */}
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-xl font-black text-white tracking-widest flex items-center gap-2">
              PRINCE <span className="text-gold">CFA</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Maison de référence pour les smartphones haut de gamme, l&apos;électronique de prestige et le high-tech en Afrique de l&apos;Ouest.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <CreditCard className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
              <span>Devises : <strong>Francs CFA (XOF / XAF)</strong></span>
            </div>
          </div>

          {/* Col 2 : Rayons */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest text-gold">Nos Rayons</h4>
            <ul className="text-xs text-zinc-400 space-y-2">
              <li><button onClick={() => { handleSelectCategory('phones'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-gold transition-colors">Smartphones & iPhones</button></li>
              <li><button onClick={() => { handleSelectCategory('tv'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-gold transition-colors">Smart TV & Écrans</button></li>
              <li><button onClick={() => { handleSelectCategory('audio'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-gold transition-colors">Boomers & Hi-Fi</button></li>
              <li><button onClick={() => { handleSelectCategory('mobility'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-gold transition-colors">Motos Électriques</button></li>
              <li><button onClick={() => { handleSelectCategory('solar'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-gold transition-colors">Énergie Solaire</button></li>
            </ul>
          </div>

          {/* Col 3 : Sécurité & Engagements */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest text-gold">Engagements</h4>
            <ul className="text-xs text-zinc-400 space-y-2">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true" />
                <span>Garantie 100% Produit Neuf</span>
              </li>
              <li className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true" />
                <span>Dépôt Mobile Money & En Boutique</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true" />
                <span>Expédition express & sécurisée</span>
              </li>
              <li className="flex items-center gap-2">
                <Receipt className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true" />
                <span>Facture légale certifiée</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Ligne Copyright */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 PRINCE CFA. Tous droits réservés.</p>
          <p className="flex items-center gap-3">
            <span>Sécurisé par Firebase Cloud</span>
            <span>•</span>
            <span className="text-gold">Excellence & Prestige</span>
          </p>
        </div>
      </footer>

      {/* Barre de Navigation Mobile Inférieure : Style Amazon (Épurée, Tailles Identiques, Minimaliste) */}
      <nav 
        aria-label="Navigation mobile" 
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-t border-white/10 grid grid-cols-3 items-center py-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))] shadow-[0_-8px_20px_rgba(0,0,0,0.8)]"
      >
        {/* 1. Accueil */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center py-1.5 text-zinc-400 hover:text-gold active:text-gold active:scale-95 transition-all gap-1 cursor-pointer touch-manipulation select-none group"
        >
          <svg className="w-5 h-5 group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-medium tracking-tight">Accueil</span>
        </button>

        {/* 2. Panier (Même taille, badge épuré style Amazon) */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1.5 text-zinc-400 hover:text-gold active:text-gold active:scale-95 transition-all gap-1 cursor-pointer touch-manipulation select-none group"
          title="Mon Panier"
        >
          <div className="relative flex items-center justify-center">
            <svg className="w-5 h-5 group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-gold text-black text-[9px] font-black flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight">Panier</span>
        </button>

        {/* 3. Showroom */}
        <button 
          onClick={() => {
            const elem = document.getElementById('about');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center py-1.5 text-zinc-400 hover:text-gold active:text-gold active:scale-95 transition-all gap-1 cursor-pointer touch-manipulation select-none group"
        >
          <svg className="w-5 h-5 group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-[10px] font-medium tracking-tight">Showroom</span>
        </button>
      </nav>

      {/* Fiche Produit en Slide-Over Drawer (Image 1) */}
      <ProductDrawer 
        isOpen={isProductDrawerOpen} 
        onClose={handleCloseProduct} 
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
