"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { products as defaultProducts } from "@/data/products";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import ProductDrawer from "@/components/ProductDrawer";
import { getProducts } from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { getProductImageBg } from "@/lib/productValidation";
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
  Receipt,
  Flame,
  Laptop,
  Tablet,
  Tv,
  Refrigerator,
  Package,
  Speaker,
  Bike,
  SunMedium
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
  salePrice?: number | null;
  oldPrice?: number | null;
  isPromo?: boolean;
  isPromotion?: boolean;
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
  { id: 'all', label: 'Toutes les collections', icon: Crown },
  { id: 'phones', label: 'Téléphones & Smartphones', icon: Smartphone },
  { id: 'computers', label: 'Ordinateurs & PC', icon: Laptop },
  { id: 'tablets', label: 'Tablettes & iPads', icon: Tablet },
  { id: 'tv', label: 'Téléviseurs & Smart TV', icon: Tv },
  { id: 'appliances', label: 'Électroménager & Maison', icon: Refrigerator },
  { id: 'tech', label: 'High-Tech & Accessoires', icon: Package },
  { id: 'audio', label: 'Boomers & Son Haute Fidélité', icon: Speaker },
  { id: 'mobility', label: 'Motos Électriques', icon: Bike },
  { id: 'solar', label: 'Énergie Solaire & Kits', icon: SunMedium },
  { id: 'promotion', label: 'PROMOTION & Bons Plans', icon: Flame },
];

const phoneBrands = ['Iphones', 'Samsung', 'Google Pixel', 'Redmi', 'Huawei', 'Tecno', 'Infinix', 'Honor', 'Itel', 'OALE'];

const getColorCode = (name: string) => {
  const n = (name || '').toLowerCase();
  if (n.includes('cyan') || n.includes('turquoise')) return '#06b6d4';
  if (n.includes('émeraude') || n.includes('horizon')) return '#059669';
  if (n.includes('lavande')) return '#c084fc';
  if (n.includes('inox') || n.includes('acier')) return '#94a3b8';
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
      specs.screenSize ? (String(specs.screenSize).includes('"') || String(specs.screenSize).includes('pouces') ? specs.screenSize : `${specs.screenSize}"`) : (specs.screen || null),
      specs.storageSize ? (String(specs.storageSize).includes('Go') ? specs.storageSize : `${specs.storageSize} Go`) : null,
      specs.ram ? `${specs.ram} Go RAM` : null,
      specs.connectivity === 'wifi_cellular' ? '4G/5G' : (specs.connectivity === 'wifi_only' ? 'Wi-Fi' : specs.connectivity)
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

  if (cat === 'appliances' || cat === 'electromenager') {
    const parts = [
      specs.applianceType,
      specs.capacity,
      specs.power,
      specs.energyClass ? `Classe ${specs.energyClass}` : null
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
  const activeColor = product.colors?.[activeColorIdx] || product.colors?.[0] || '';
  const specsSnippet = getProductSummarySnippet(product);
  const imgBg = getProductImageBg(product, activeImage);

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
      {/* 1. Colonne GAUCHE : Image Grande & Immersive Style Amazon avec glissement tactile */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`w-[38%] min-w-[130px] sm:w-48 md:w-52 flex-shrink-0 rounded-xl sm:rounded-2xl ${imgBg.containerClass} overflow-hidden flex items-center justify-center p-1.5 sm:p-2.5 relative shadow-md group/img select-none`}
      >
        {activeImage?.length > 4 ? (
          <img 
            key={activeImage}
            src={activeImage} 
            alt={product.name} 
            className="w-full h-full object-contain object-center group-hover/img:scale-105 transition-transform duration-300 animate-in fade-in" 
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
                    : imgBg.isBlack
                      ? 'w-1.5 h-1.5 bg-white/40 border border-white/20'
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

        {/* Badge PROMO si en promotion ou catégorie promotion */}
        {(product.category === 'promotion' || (product.salePrice && product.salePrice < product.price)) && (
          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-gradient-to-r from-red-600 to-amber-600 text-[9px] font-black tracking-wider uppercase text-white shadow-md z-10 flex items-center gap-1 pointer-events-none animate-pulse">
            <Flame className="w-3 h-3 text-yellow-200 fill-yellow-200" aria-hidden="true" />
            <span>PROMO</span>
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

          {/* Prix FCFA en grand format doré avec gestion promotionnelle */}
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            {product.salePrice && product.salePrice < product.price ? (
              <>
                <span className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-gold tracking-tight">
                  {product.salePrice.toLocaleString('fr-FR')} <span className="text-xs sm:text-sm text-gold font-bold">FCFA</span>
                </span>
                <span className="text-xs sm:text-sm text-zinc-500 line-through">
                  {product.price.toLocaleString('fr-FR')} FCFA
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                  PROMO
                </span>
              </>
            ) : (
              <span className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-400 to-white tracking-tight">
                {product.price.toLocaleString('fr-FR')} <span className="text-xs sm:text-sm text-gold font-bold">FCFA</span>
              </span>
            )}
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
              <span>Retrait en Boutique</span>
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
                  const isCurrent = (product.colors && product.colors.length === 1) || activeColorIdx === idx;
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
              <span>Détails</span>
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
        // 1. Essayer l'API serveur optimisée avec cache mémoire (protection anti-épuisement des quotas Firestore)
        const apiRes = await fetch("/api/products").catch(() => null);
        if (apiRes && apiRes.ok) {
          const apiData = await apiRes.json();
          if (apiData?.success && Array.isArray(apiData.products) && apiData.products.length > 0) {
            setLocalProducts(apiData.products);
            try {
              localStorage.setItem("prince_cfa_products", JSON.stringify(apiData.products));
            } catch (e) {
              console.warn("Storage warning:", e);
            }
            return;
          }
        }

        // 2. Repli direct sur Firebase SDK si l'API est indisponible
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
            updatedProduct.image = defaultMatch.image;
            updatedProduct.images = defaultMatch.images;
            updatedProduct.colors = defaultMatch.colors;
            updatedProduct.specs = defaultMatch.specs;
            updatedProduct.desc = defaultMatch.desc;
            if (defaultMatch.brand) updatedProduct.brand = defaultMatch.brand;
            if (defaultMatch.storageOptions && (!p.storageOptions || p.storageOptions.length <= 1)) {
              updatedProduct.storageOptions = defaultMatch.storageOptions;
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
        try {
          localStorage.setItem("prince_cfa_products", JSON.stringify(combined));
        } catch {}
        setLocalProducts(combined);
      } else {
        setLocalProducts(defaultProducts);
      }
    }
    loadProducts();
  }, []);

  // Défilement horizontal naturel des catégories et marques
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const brandScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftPosRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Centrage automatique de la catégorie active
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeEl = categoryScrollRef.current?.querySelector(`[data-cat-id="${selectedCategory}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  // Centrage automatique de la marque active dans le ruban des marques
  useEffect(() => {
    if (selectedCategory === 'phones') {
      const timer = setTimeout(() => {
        const activeBrandEl = brandScrollRef.current?.querySelector(`[data-brand="${selectedBrand}"]`) as HTMLElement;
        if (activeBrandEl) {
          activeBrandEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedBrand, selectedCategory]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = categoryScrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftPosRef.current = el.scrollLeft;
    hasMovedRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = categoryScrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    el.scrollLeft = scrollLeftPosRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Gestionnaire de changement de catégorie avec réinitialisation de marque et défilement direct vers les sous-catégories
  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedBrand('all');

    if (catId === 'phones') {
      setTimeout(() => {
        const subCatElem = document.getElementById('sous-categories-telephones');
        if (subCatElem) {
          subCatElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
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
      filtered = filtered.filter(p => {
        if (selectedCategory === 'appliances' || selectedCategory === 'electromenager') {
          return p.category === 'appliances' || p.category === 'electromenager';
        }
        if (selectedCategory === 'tech' || selectedCategory === 'accessories') {
          return p.category === 'tech' || p.category === 'accessories';
        }
        if (selectedCategory === 'computers' || selectedCategory === 'ordinateurs') {
          return p.category === 'computers' || p.category === 'ordinateurs';
        }
        if (selectedCategory === 'tablets' || selectedCategory === 'tablettes') {
          return p.category === 'tablets' || p.category === 'tablettes';
        }
        if (selectedCategory === 'audio' || selectedCategory === 'boomers') {
          return p.category === 'audio' || p.category === 'boomers';
        }
        if (selectedCategory === 'mobility' || selectedCategory === 'motos') {
          return p.category === 'mobility' || p.category === 'motos';
        }
        if (selectedCategory === 'solar' || selectedCategory === 'solaire') {
          return p.category === 'solar' || p.category === 'solaire';
        }
        if (selectedCategory === 'promotion' || selectedCategory === 'promotions') {
          const cat = (p.category || '').toLowerCase();
          const isPromoCat = cat === 'promotion' || cat === 'promotions' || cat === 'promo';
          const hasDiscount = Boolean(
            (p.salePrice && p.price && p.salePrice < p.price) ||
            (p.oldPrice && p.oldPrice > p.price) ||
            (p as any).isPromo ||
            (p as any).isPromotion ||
            (p.desc && p.desc.toLowerCase().includes('promo')) ||
            (p.name && p.name.toLowerCase().includes('promo'))
          );
          return isPromoCat || hasDiscount;
        }
        return p.category === selectedCategory;
      });
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

  const handleOpenProductFromCart = (cartItem: any) => {
    const fullProduct = localProducts.find(p => String(p.id) === String(cartItem.id)) || cartItem;
    const targetProduct: Product = {
      ...fullProduct,
      selectedColor: cartItem.selectedColor || fullProduct.selectedColor,
      selectedCapacity: cartItem.selectedCapacity || fullProduct.selectedCapacity
    };
    setSelectedProduct(targetProduct);
    setIsProductDrawerOpen(true);
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
        onViewProduct={handleOpenProductFromCart}
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
        <div id="produits" className="flex flex-col items-center w-full max-w-6xl mx-auto mt-8 mb-14 relative z-20 scroll-mt-28 px-2 sm:px-4">
          
          {/* Ruban Horizontal Défilable des Catégories (Défilement naturel) */}
          <div className="w-full">
            {/* Piste de Défilement Horizontal */}
            <div
              ref={categoryScrollRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="flex items-center gap-2 sm:gap-3 overflow-x-auto scroll-smooth py-3 px-3 sm:px-6 no-scrollbar cursor-grab active:cursor-grabbing select-none"
            >
              {categories.map(cat => {
                const isPromo = cat.id === 'promotion';
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;

                return (
                  <button
                    key={cat.id}
                    data-cat-id={cat.id}
                    onClick={(e) => {
                      if (hasMovedRef.current) {
                        e.preventDefault();
                        return;
                      }
                      handleSelectCategory(cat.id);
                    }}
                    className={`shrink-0 flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap group ${
                      isSelected
                        ? isPromo
                          ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 text-white font-bold shadow-[0_0_25px_rgba(239,68,68,0.5)] border border-red-400/60 scale-[1.02]'
                          : 'bg-gradient-to-r from-gold via-amber-400 to-yellow-500 text-black font-bold shadow-[0_0_24px_rgba(212,175,55,0.45)] border border-yellow-300/60 scale-[1.02]'
                        : isPromo
                          ? 'bg-red-950/30 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/60 shadow-[0_0_12px_rgba(239,68,68,0.15)]'
                          : 'bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-300 hover:text-gold border border-white/10 hover:border-gold/40 shadow-sm backdrop-blur-sm'
                    }`}
                  >
                    {Icon && (
                      <Icon
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 ${
                          isSelected
                            ? isPromo
                              ? 'text-white fill-white'
                              : 'text-black fill-current'
                            : isPromo
                              ? 'text-red-400 group-hover:scale-110'
                              : 'text-zinc-400 group-hover:text-gold group-hover:scale-110'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>


          {/* Sous-catégories Marques (Uniquement si Téléphones est sélectionné) */}
          {selectedCategory === 'phones' && (
            <div 
              id="sous-categories-telephones" 
              className="w-full max-w-5xl mt-3 pt-3 border-t border-white/10 animate-in slide-in-from-top-2 fade-in duration-300 scroll-mt-24 sm:scroll-mt-28"
            >
              <div className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] mb-2 px-2 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                <span>MARQUES</span>
              </div>
              <div 
                ref={brandScrollRef}
                className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scroll-smooth py-2 px-3 sm:px-4 no-scrollbar justify-start"
              >
                <button
                  data-brand="all"
                  onClick={() => setSelectedBrand('all')}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer ${
                    selectedBrand === 'all'
                      ? "bg-gradient-to-r from-gold to-yellow-600 text-black font-extrabold shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105"
                      : "bg-zinc-900/90 text-zinc-200 border border-white/20 hover:border-gold/50 hover:text-gold"
                  }`}
                >
                  Toutes les marques
                </button>
                {phoneBrands.map(brand => (
                  <button
                    key={brand}
                    data-brand={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer ${
                      selectedBrand === brand
                        ? "bg-gradient-to-r from-gold to-yellow-600 text-black font-extrabold shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105"
                        : "bg-zinc-900/90 text-zinc-200 border border-white/20 hover:border-gold/50 hover:text-gold"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
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

      </main>

      {/* Footer Luxueux */}
      <footer id="about" className="w-full border-t border-white/10 bg-[#08080a] relative z-20 mt-16 pt-16 pb-12 px-4 sm:px-8 scroll-mt-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1 : Marque */}
          <div className="space-y-4">
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
              <li><button onClick={() => { handleSelectCategory('phones'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-gold transition-colors">Téléphones & Smartphones</button></li>
              <li><button onClick={() => { handleSelectCategory('computers'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-gold transition-colors">Ordinateurs & PC</button></li>
              <li><button onClick={() => { handleSelectCategory('tablets'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-gold transition-colors">Tablettes & iPads</button></li>
              <li><button onClick={() => { handleSelectCategory('tv'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-gold transition-colors">Téléviseurs & Smart TV</button></li>
              <li><button onClick={() => { handleSelectCategory('appliances'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-gold transition-colors">Électroménager & Maison</button></li>
              <li><button onClick={() => { handleSelectCategory('tech'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-gold transition-colors">High-Tech & Accessoires</button></li>
              <li><button onClick={() => { handleSelectCategory('audio'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-gold transition-colors">Boomers & Son Haute Fidélité</button></li>
              <li><button onClick={() => { handleSelectCategory('mobility'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-gold transition-colors">Motos Électriques</button></li>
              <li><button onClick={() => { handleSelectCategory('solar'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-gold transition-colors">Énergie Solaire & Kits</button></li>
              <li>
                <button 
                  onClick={() => { handleSelectCategory('promotion'); window.scrollTo({top: 400, behavior: 'smooth'}); }} 
                  className="text-red-400 font-bold hover:text-gold transition-colors flex items-center gap-1.5 pt-1"
                >
                  <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" aria-hidden="true" />
                  <span>PROMOTION & Bons Plans</span>
                </button>
              </li>
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
              <li className="pt-2 border-t border-white/5 flex items-center gap-2.5 text-[11px] text-zinc-400">
                <Link href="/mentions-legales" className="hover:text-gold transition-colors">
                  Mentions Légales
                </Link>
                <span>•</span>
                <Link href="/politique-de-confidentialite" className="hover:text-gold transition-colors">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 : NOUS JOINDRE */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              <span>NOUS JOINDRE</span>
            </h4>
            <div className="space-y-3 text-xs text-zinc-300">
              <div className="space-y-1.5">
                {(SHOP_CONFIG.phones || [
                  { display: "+226 77 43 43 97", raw: "+22677434397", wa: "22677434397", isWhatsApp: true },
                  { display: "+226 64 76 91 30", raw: "+22664769130" },
                  { display: "+226 77 14 67 13", raw: "+22677146713" }
                ]).map((item, idx) => {
                  const isWa = item.isWhatsApp || idx === 0;
                  return (
                    <a 
                      key={idx}
                      href={isWa ? `https://wa.me/${item.wa || '22677434397'}?text=Bonjour%20Prince%20CFA` : `tel:${item.raw}`}
                      target={isWa ? "_blank" : undefined}
                      rel={isWa ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2 hover:text-gold transition-colors group"
                      title={isWa ? "Contacter sur WhatsApp" : "Appeler"}
                    >
                      {isWa ? (
                        <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] flex-shrink-0" />
                      ) : (
                        <Phone className="w-3 h-3 text-gold/80 group-hover:text-gold flex-shrink-0" aria-hidden="true" />
                      )}
                      <span className="font-semibold text-zinc-200 group-hover:text-gold">{item.display}</span>
                    </a>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-white/5 space-y-1.5">
                <p className="flex items-center gap-2 text-zinc-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true" />
                  <span>Koulouba, Ouagadougou</span>
                </p>
                <a 
                  href={SHOP_CONFIG.directionsUrl || SHOP_CONFIG.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gold hover:underline"
                >
                  <Compass className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                  <span>Itinéraire Google Maps</span>
                </a>
              </div>

              <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400 space-y-1 leading-relaxed">
                <p className="flex justify-between">
                  <span className="text-zinc-500">Lundi – Samedi :</span>
                  <span className="text-white font-medium">9 h – 19 h</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-zinc-500">Dimanche :</span>
                  <span className="text-white font-medium">10 h – 16 h</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Ligne Copyright & Liens Légaux */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© 2026 PRINCE CFA. Tous droits réservés.</p>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <div className="flex items-center gap-3">
              <Link href="/a-propos" className="hover:text-gold transition-colors">
                À Propos
              </Link>
              <span>•</span>
              <Link href="/mentions-legales" className="hover:text-gold transition-colors">
                Mentions Légales
              </Link>
              <span>•</span>
              <Link href="/politique-de-confidentialite" className="hover:text-gold transition-colors">
                Politique de Confidentialité
              </Link>
            </div>
          </div>
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

        {/* 3. Boutique */}
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
          <span className="text-[10px] font-medium tracking-tight">Boutique</span>
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
