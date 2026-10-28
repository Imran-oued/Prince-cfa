"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';
import MenuDrawer from '@/components/MenuDrawer';

/**
 * @param {{
 *   cartCount?: number;
 *   searchQuery?: string;
 *   onSearch?: (query: string) => void;
 *   onOpenCart?: () => void;
 *   onSelectCategory?: (category: string) => void;
 *   onSelectBrand?: (brand: string) => void;
 *   products?: any[];
 *   onOpenProduct?: (product: any) => void;
 * }} props
 */
export default function Navbar({
  cartCount = 0,
  searchQuery = '',
  onSearch,
  onOpenCart,
  onSelectCategory,
  onSelectBrand,
  products = [],
  onOpenProduct
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (onSearch) {
      onSearch(value);
    }
    setIsDropdownOpen(value.trim().length > 0);
  };

  const handleClearSearch = () => {
    if (onSearch) {
      onSearch('');
    }
    setIsDropdownOpen(false);
  };

  const scrollToCollection = () => {
    setIsDropdownOpen(false);
    const elem = document.getElementById('collection');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    scrollToCollection();
  };

  // Résultats rapides dans l'autocomplétion de la Navbar (jusqu'à 5)
  const quickResults = useMemo(() => {
    if (!searchQuery.trim() || !products.length) return [];
    
    const normalize = (str) =>
      (str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

    const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const tokens = normalize(searchQuery).split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];

    return products.filter((product) => {
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

      return tokens.every((token) => {
        if (/^[a-z0-9]+$/i.test(token)) {
          const regex = new RegExp(`\\b${escapeRegExp(token)}`, 'i');
          return regex.test(combined);
        }
        return combined.includes(token);
      });
    }).slice(0, 5);
  }, [searchQuery, products]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-gold/15 px-3 py-2.5 sm:px-8 sm:py-4 transition-all w-full max-w-full box-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">

          {/* Vrai Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer flex-shrink-0">
            <div className="relative w-14 h-14 sm:w-20 sm:h-20 group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <Image
                src="/logo.jpeg"
                alt="Logo Prince CFA"
                fill
                sizes="(max-width: 640px) 56px, 80px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Search Bar & Actions (Panier + Hamburger Menu) */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end min-w-0">

            {/* Barre de recherche interactive avec autocomplétion rapide */}
            <div ref={searchContainerRef} className="relative w-full max-w-[200px] sm:max-w-[260px] md:max-w-sm flex-1 min-w-0">
              <form onSubmit={handleSubmit} className="relative" suppressHydrationWarning>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  suppressHydrationWarning
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) {
                      setIsDropdownOpen(true);
                    }
                  }}
                  className="w-full bg-zinc-100/90 border border-zinc-200 rounded-full py-2 sm:py-2.5 pl-3.5 sm:pl-4 pr-12 sm:pr-16 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-inner"
                />

                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
                      title="Effacer la recherche"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}

                  <button
                    type="submit"
                    className={`p-1 rounded-full transition-colors ${searchQuery ? 'text-gold hover:text-amber-600' : 'text-zinc-400'}`}
                    title="Lancer la recherche"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Menu déroulant instantané des résultats (Dropdown) */}
              {isDropdownOpen && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 sm:left-auto sm:right-0 sm:w-96 top-full mt-2 bg-white/95 backdrop-blur-2xl border border-gold/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3.5 py-2 border-b border-zinc-100 flex items-center justify-between text-[11px] font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-50/70">
                    <span>Aperçu rapide</span>
                    <span className="text-gold font-bold">{quickResults.length} trouvé{quickResults.length > 1 ? 's' : ''}</span>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto divide-y divide-zinc-100 p-1">
                    {quickResults.length > 0 ? (
                      quickResults.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            if (onOpenProduct) {
                              onOpenProduct(product);
                            }
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gold/10 hover:border hover:border-gold/30 text-left transition-all duration-200 group"
                        >
                          <div className="relative w-11 h-11 bg-zinc-100 rounded-lg p-1 border border-zinc-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-zinc-900 truncate group-hover:text-gold transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                              {product.brand || 'Prince CFA'} • {product.storageOptions?.[0]?.capacity || 'Haute Qualité'}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600">
                              {(Number(product.price) || 0).toLocaleString('fr-FR')} F
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="py-6 px-4 text-center">
                        <p className="text-xs text-zinc-500">Aucun produit ne correspond à &quot;{searchQuery}&quot;</p>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={scrollToCollection}
                    className="w-full py-2.5 px-4 text-center bg-gold/10 hover:bg-gold/20 text-gold text-xs font-bold border-t border-gold/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Voir tous les résultats dans le catalogue</span>
                    <span>→</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bouton Suivi de Commande */}
            <Link
              href="/suivi"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full border border-zinc-200 bg-zinc-100/80 hover:border-gold/50 hover:bg-gold/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] active:scale-95 transition-all duration-300 text-xs font-bold text-zinc-700 hover:text-gold"
              title="Suivre ma commande en direct"
            >
              <Package className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              <span>Suivi</span>
            </Link>

            {/* Bouton Panier */}
            <button
              onClick={onOpenCart}
              className="hidden sm:flex relative p-2.5 sm:p-3 rounded-full border border-zinc-200 bg-zinc-100/80 hover:border-gold/50 hover:bg-gold/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] active:scale-95 transition-all duration-300 group items-center justify-center flex-shrink-0 cursor-pointer"
              title="Voir mon panier"
              aria-label="Panier"
            >
              <svg
                className="w-5 h-5 text-zinc-700 group-hover:text-gold transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>

              {/* Compteur dynamique */}
              <span className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-gold to-yellow-600 text-[11px] font-bold text-black border-2 border-white shadow-sm transition-transform duration-300 ${cartCount > 0 ? 'scale-100' : 'scale-0'}`}>
                {cartCount}
              </span>
            </button>

            {/* Bouton Hamburger Menu (Slide-over latéral) */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2.5 sm:p-3 rounded-full border border-gold/40 bg-zinc-100/90 hover:bg-gold/15 hover:border-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] active:scale-95 text-gold transition-all duration-300 flex items-center justify-center flex-shrink-0 group cursor-pointer"
              title="Ouvrir le menu de navigation"
              aria-label="Menu"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

          </div>

        </div>
      </nav>

      {/* Tiroir de Navigation Latéral (Slide-Over Drawer) */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectCategory={onSelectCategory}
        onSelectBrand={onSelectBrand}
        onOpenCart={onOpenCart}
        cartCount={cartCount}
      />
    </>
  );
}

