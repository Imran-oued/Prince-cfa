"use client";

import { useState, useEffect, useMemo } from 'react';
import { SHOP_CONFIG } from '@/config/shop';
import { X, Star, HardDrive, Check, Zap, Laptop, Refrigerator, Tablet, ShoppingBag } from 'lucide-react';
import { getCategoryConfig, isStorageVariantCategory } from '@/config/categories';
import { getProductImageBg } from '@/lib/productValidation';

const SPEC_LABELS = {
  screen: 'Écran',
  processor: 'Processeur',
  camera: 'Appareil Photo',
  battery: 'Batterie & Autonomie',
  ram: 'Mémoire RAM',
  resolution: 'Résolution',
  hdr: 'Format HDR',
  smart: 'Système Smart TV',
  power: 'Puissance Audio',
  connectivity: 'Connectivité',
  battery_life: 'Autonomie',
  waterproof: 'Étanchéité',
  motor: 'Motorisation',
  range: 'Autonomie',
  max_speed: 'Vitesse Max',
  charge_time: 'Temps de Charge',
  panels: 'Panneaux Solaires',
  inverter: 'Onduleur',
  storage: 'Stockage Énergie',
  warranty: 'Garantie Constructeur',
  noise_cancelling: 'Réduction de Bruit',
  materials: 'Matériaux & Finition'
};


export default function ProductDrawer({
  isOpen,
  onClose,
  product,
  onAddToCart
}) {
  const [prevProduct, setPrevProduct] = useState(product);
  const [cachedProduct, setCachedProduct] = useState(product);
  const currentProduct = product || cachedProduct;

  const getInitialCapacity = (p) => {
    if (!p) return '';
    const supportsStorage = isStorageVariantCategory(p.category) || p.category === 'phones';
    if (!supportsStorage) return '';

    if (p.storageOptions && p.storageOptions.length > 0) {
      return p.storageOptions[0].capacity;
    }
    const singleCap = p.specs?.storage || p.specs?.storageSize || p.storage;
    if (singleCap) {
      return String(singleCap);
    }
    if (p.category === 'phones') {
      return '128 Go';
    }
    return '';
  };

  const getInitialColor = (p) => {
    if (!p) return '';
    if (p.selectedColor && Array.isArray(p.colors) && p.colors.includes(p.selectedColor)) {
      return p.selectedColor;
    }
    return p.colors?.[0] || '';
  };

  const getInitialSimType = (p) => {
    if (!p) return '';
    if (p.selectedSimType) return p.selectedSimType;
    if (p.category === 'phones') {
      if (p.simPricing && typeof p.simPricing === 'object') {
        const first = Object.entries(p.simPricing).find(([_, conf]) => conf?.enabled !== false);
        if (first && first[1]?.label) return first[1].label;
      }
      return 'e-sim + sim physique';
    }
    return '';
  };

  const [activeColor, setActiveColor] = useState(() => getInitialColor(product));
  const [selectedCapacity, setSelectedCapacity] = useState(() => product?.selectedCapacity || getInitialCapacity(product));
  const [selectedSimType, setSelectedSimType] = useState(() => getInitialSimType(product));
  const [activeImageIndex, setActiveImageIndex] = useState(() => {
    const initCol = getInitialColor(product);
    const idx = product?.colors?.indexOf(initCol);
    return idx !== -1 && idx !== undefined ? idx : 0;
  });
  const [isLiked, setIsLiked] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  // Ajustement de l'état lors d'un changement de produit (pattern officiel React sans effet en cascade)
  if (product && product !== prevProduct) {
    setPrevProduct(product);
    setCachedProduct(product);
    const newColor = getInitialColor(product);
    setActiveColor(newColor);
    setSelectedCapacity(product.selectedCapacity || getInitialCapacity(product));
    setSelectedSimType(getInitialSimType(product));
    const newIdx = product.colors?.indexOf(newColor);
    setActiveImageIndex(newIdx !== -1 && newIdx !== undefined ? newIdx : 0);
    setIsLiked(false);
    setShowAllSpecs(false);
  }

  // Fiche technique et caractéristiques dynamiques selon la catégorie (Amazon-like)
  const technicalDetails = useMemo(() => {
    if (!currentProduct) return [];
    const details = [];

    // 1. Marque
    if (currentProduct.brand) {
      details.push({ label: 'Marque', value: currentProduct.brand });
    }

    // 2. Modèle ou nom de produit
    details.push({
      label: 'Nom de modèle',
      value: currentProduct.name
    });

    // 3. État / Condition
    if (currentProduct.condition) {
      const condLabel = currentProduct.condition === 'neuf' 
        ? 'Neuf sous blister scellé' 
        : currentProduct.condition === 'reconditionne' 
        ? 'Reconditionné à Neuf (Certifié)' 
        : 'Occasion Certifiée A+';
      details.push({ label: 'État du produit', value: condLabel });
    }

    // 4. Capacité de stockage sélectionnée (SEULEMENT si la catégorie supporte les variantes)
    const supportsStorage = isStorageVariantCategory(currentProduct.category) || currentProduct.category === 'phones';
    if (supportsStorage && selectedCapacity) {
      details.push({
        label: 'Capacité de stockage',
        value: String(selectedCapacity)
      });
    }

    // 5. Spécifications spécifiques à la catégorie
    const catConfig = getCategoryConfig(currentProduct.category);
    if (catConfig && catConfig.fields && currentProduct.specs) {
      catConfig.fields.forEach(field => {
        const val = currentProduct.specs[field.key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          let displayVal = String(val);
          if (field.options && field.options.length > 0) {
            const opt = field.options.find(o => o.value === String(val));
            if (opt) displayVal = opt.label;
          }
          if (field.unit && !displayVal.toLowerCase().includes(field.unit.toLowerCase())) {
            displayVal = `${displayVal} ${field.unit}`;
          }
          details.push({ label: field.label, value: displayVal });
        }
      });
    }

    // 6. Rétrocompatibilité : autres clés de specs présentes dans les anciens produits
    if (currentProduct.specs) {
      const officialKeys = catConfig?.fields ? catConfig.fields.map(f => f.key) : [];
      const handledKeys = [...officialKeys, 'info'];
      Object.entries(currentProduct.specs).forEach(([k, v]) => {
        if (!handledKeys.includes(k) && v !== undefined && v !== null && String(v).trim() !== '' && typeof v !== 'object') {
          const label = SPEC_LABELS[k] || k.replace(/_/g, ' ');
          details.push({ label, value: String(v) });
        }
      });
    }

    // 7. Garantie
    if (currentProduct.warranty) {
      details.push({ label: 'Garantie', value: currentProduct.warranty });
    }

    // 8. Accessoires inclus
    if (currentProduct.accessories) {
      details.push({ label: 'Accessoires inclus', value: currentProduct.accessories });
    }

    return details;
  }, [currentProduct, selectedCapacity]);

  const visibleDetails = showAllSpecs ? technicalDetails : technicalDetails.slice(0, 7);

  // Liste ordonnée de toutes les photos du produit
  const productImages = useMemo(() => {
    if (!currentProduct) return [];
    if (Array.isArray(currentProduct.images) && currentProduct.images.length > 0) {
      return currentProduct.images.filter(Boolean);
    }
    if (currentProduct.image) {
      return [currentProduct.image];
    }
    return ['https://placehold.co/600x600/121216/d4af37?text=PRINCE+CFA'];
  }, [currentProduct]);

  // Gestion interactive du glissement au doigt en temps réel avec effet ressort (Spring Physics)
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e) => {
    if (productImages.length <= 1) return;
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    setDragOffset(0);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartX;
    const diffY = touch.clientY - touchStartY;

    // Si le mouvement est plutôt vertical (scroll de page), ne pas interférer
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffX) < 15) {
      return;
    }

    // Résistance élastique style iOS aux extrémités (effet Rubber-Band)
    if ((activeImageIndex === 0 && diffX > 0) || (activeImageIndex === productImages.length - 1 && diffX < 0)) {
      setDragOffset(diffX * 0.35);
    } else {
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 45; // Seuil de glissement en px pour valider le changement
    if (dragOffset < -threshold) {
      // Glissement vers la gauche -> Photo suivante
      handleNextImage();
    } else if (dragOffset > threshold) {
      // Glissement vers la droite -> Photo précédente
      handlePrevImage();
    }
    // Réinitialise le décalage pour déclencher l'animation fluide
    setDragOffset(0);
  };

  const handleNextImage = () => {
    if (productImages.length <= 1) return;
    setActiveImageIndex((prev) => {
      const nextIdx = (prev + 1) % productImages.length;
      if (currentProduct?.colors && currentProduct.colors[nextIdx]) {
        setActiveColor(currentProduct.colors[nextIdx]);
      }
      return nextIdx;
    });
  };

  const handlePrevImage = () => {
    if (productImages.length <= 1) return;
    setActiveImageIndex((prev) => {
      const prevIdx = (prev - 1 + productImages.length) % productImages.length;
      if (currentProduct?.colors && currentProduct.colors[prevIdx]) {
        setActiveColor(currentProduct.colors[prevIdx]);
      }
      return prevIdx;
    });
  };

  const handleSelectImage = (idx) => {
    setActiveImageIndex(idx);
    if (currentProduct?.colors && currentProduct.colors[idx]) {
      setActiveColor(currentProduct.colors[idx]);
    }
  };

  const handleColorChange = (color, idx) => {
    setActiveColor(color);
    if (typeof idx === 'number' && productImages[idx]) {
      setActiveImageIndex(idx);
    }
  };

  // Calcul des capacités disponibles (GB, Tera)
  const availableCapacities = useMemo(() => {
    if (!currentProduct) return [];
    const supportsStorage = isStorageVariantCategory(currentProduct.category) || currentProduct.category === 'phones';
    if (!supportsStorage) return [];

    if (currentProduct.storageOptions && Array.isArray(currentProduct.storageOptions) && currentProduct.storageOptions.length > 0) {
      return currentProduct.storageOptions;
    }
    const singleCap = currentProduct.specs?.storage || currentProduct.specs?.storageSize || currentProduct.storage;
    if (singleCap) {
      return [{ capacity: String(singleCap), price: Number(currentProduct.price) || 0 }];
    }
    // Génération automatique pour tous les téléphones sans options explicites
    if (currentProduct.category === 'phones') {
      const base = Number(currentProduct.price) || 0;
      return [
        { capacity: '128 Go', price: base },
        { capacity: '256 Go', price: base + 60000 },
        { capacity: '512 Go', price: base + 140000 },
        { capacity: '1 To (Tera)', price: base + 240000 },
      ];
    }
    return [];
  }, [currentProduct]);

  // Formats SIM disponibles pour téléphones (E-sim, e-sim + sim physique, 2 sim physique)
  const availableSimTypes = useMemo(() => {
    if (!currentProduct || currentProduct.category !== 'phones') return [];
    if (currentProduct.simPricing && typeof currentProduct.simPricing === 'object') {
      const entries = Object.entries(currentProduct.simPricing)
        .filter(([_, conf]) => conf && conf.enabled !== false)
        .map(([key, conf]) => ({
          id: key,
          label: conf.label || (key === 'sim_and_esim' ? 'e-sim + sim physique' : key === 'dual_sim_physical' ? '2 sim physique' : 'E-sim'),
          delta: typeof conf.delta === 'number' ? conf.delta : 0,
          subtitle: key === 'dual_sim_physical' ? 'Double Nano-SIM physique' : key === 'esim_only' ? '100% eSIM sans tiroir' : 'Standard international'
        }));
      if (entries.length > 0) return entries;
    }
    return [
      { id: 'sim_and_esim', label: 'e-sim + sim physique', delta: 0, subtitle: 'Standard international' },
      { id: 'dual_sim_physical', label: '2 sim physique', delta: 30000, subtitle: 'Double Nano-SIM physique' },
      { id: 'esim_only', label: 'E-sim', delta: -20000, subtitle: '100% eSIM sans tiroir' },
    ];
  }, [currentProduct]);

  // Delta actif selon le type de SIM choisi
  const currentSimDelta = useMemo(() => {
    if (availableSimTypes.length === 0 || !selectedSimType) return 0;
    const match = availableSimTypes.find(
      s => s.label.toLowerCase() === selectedSimType.toLowerCase() || s.id === selectedSimType
    );
    return (match && typeof match.delta === 'number') ? match.delta : 0;
  }, [availableSimTypes, selectedSimType]);

  // Calcul du prix dynamique en fonction de la capacité et du type de SIM choisi
  const currentPrice = useMemo(() => {
    if (!currentProduct) return 0;
    let basePrice = Number(currentProduct.price) || 0;
    if (availableCapacities.length > 0 && selectedCapacity) {
      const match = availableCapacities.find(c => c.capacity === selectedCapacity);
      if (match) basePrice = match.price;
    }

    // Intégration de la surcote / remise du type de SIM
    return Math.max(0, basePrice + currentSimDelta);
  }, [currentProduct, availableCapacities, selectedCapacity, currentSimDelta]);

  // Fermeture avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Bloquer le défilement du corps quand le tiroir est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => setSlideIn(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setSlideIn(false);
    }
  }, [isOpen]);

  // Commande directe par WhatsApp avec détails de SIM, capacité et couleur
  const handleDirectWhatsApp = () => {
    if (!currentProduct) return;
    const phoneNumber = SHOP_CONFIG.whatsappNumber;
    let message = "👑 *COMMANDE EXPRESS - PRINCE CFA* 👑\n\n";
    message += `▪ *Produit* : ${currentProduct.name}\n`;
    if (selectedSimType) {
      message += `▪ *Format SIM* : ${selectedSimType}\n`;
    }
    if (selectedCapacity) {
      message += `▪ *Capacité* : ${selectedCapacity}\n`;
    }
    if (activeColor) {
      message += `▪ *Couleur sélectionnée* : ${activeColor}\n`;
    }
    message += `▪ *Prix* : ${currentPrice.toLocaleString('fr-FR')} FCFA\n\n`;
    message += "Bonjour, je souhaite commander ce produit immédiatement !";

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank');
  };

  if (!currentProduct) return null;
  if (!isOpen && !slideIn) return null;

  const activeImage = (productImages && productImages[activeImageIndex]) || currentProduct?.image || '';
  const currentImgBg = getProductImageBg(currentProduct, activeImage);

  return (
    <>
      {/* Arrière-plan assombri et flouté (Backdrop) */}
      <div 
        className={`fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300 ease-out z-[140] ${
          slideIn && isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Volet Latéral / Slide-Over Drawer depuis le côté droit */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full sm:w-[540px] md:w-[620px] lg:w-[680px] bg-white border-l border-zinc-200 shadow-[-20px_0_50px_rgba(0,0,0,0.15),-5px_0_20px_rgba(212,175,55,0.1)] z-[150] transition-transform duration-300 ease-out flex flex-col overflow-hidden will-change-transform ${
          slideIn && isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-drawer-title"
      >
        {/* Header du Drawer avec bouton retour / fermeture */}
        <div className="flex items-center justify-between px-6 py-4 sm:py-5 border-b border-zinc-200 bg-white/95 backdrop-blur-md relative z-20">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              En stock
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-gold hover:border-gold/50 hover:bg-gold/10 transition-all duration-200 group"
              title="Fermer la fiche produit (Échap)"
              aria-label="Fermer la fiche produit"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Corps défilable (Scrollable Content) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
          
          {/* Galerie Photo Style Apple / Minimaliste avec Swipe Tactile au doigt */}
          <div className="space-y-3">
            {/* Boîte photo épurée avec glissement tactile au doigt */}
            <div 
              className={`relative w-full h-80 sm:h-96 md:h-[420px] rounded-3xl ${currentImgBg.containerClass} ${currentImgBg.isBlack ? '' : 'border border-zinc-200/80'} overflow-hidden shadow-sm select-none touch-pan-y flex items-center justify-center cursor-grab active:cursor-grabbing`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Slider des photos avec glissement interactif en temps réel et effet de profondeur */}
              <div 
                className="w-full h-full flex will-change-transform"
                style={{ 
                  transform: `translateX(calc(-${activeImageIndex * 100}% + ${dragOffset}px))`,
                  transition: isDragging ? 'none' : 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {productImages.map((imgSrc, idx) => {
                  const isCurrent = idx === activeImageIndex;
                  const slideBg = getProductImageBg(currentProduct, imgSrc);
                  return (
                    <div 
                      key={idx} 
                      className={`w-full h-full min-w-full flex-shrink-0 p-3 sm:p-6 flex items-center justify-center ${slideBg.isBlack ? 'bg-black' : 'bg-white'}`}
                    >
                      {imgSrc?.length > 4 ? (
                        <img 
                          src={imgSrc} 
                          alt={`${currentProduct.name} - Photo ${idx + 1}`} 
                          className={`w-full h-full object-contain pointer-events-none drop-shadow-sm transition-all duration-300 ${
                            isCurrent ? 'scale-100 opacity-100' : 'scale-90 opacity-40'
                          }`}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://placehold.co/600x600/121216/d4af37?text=${encodeURIComponent(currentProduct.name)}`;
                          }}
                        />
                      ) : (
                        <div className={`text-9xl pointer-events-none transition-all duration-300 ${
                          isCurrent ? 'scale-100 opacity-100' : 'scale-90 opacity-40'
                        }`}>
                          {imgSrc}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Barre inférieure : Points de pagination ronds au centre + Favoris & Partage à droite */}
            <div className="flex items-center justify-between px-2 pt-1 pb-1">
              {/* Espace vide gauche pour centrer parfaitement les points */}
              <div className="w-16"></div>

              {/* Points indicateurs avec transition dynamique */}
              <div className="flex items-center justify-center gap-2">
                {productImages.length > 1 && productImages.map((_, dotIdx) => {
                  const isActive = dotIdx === activeImageIndex;
                  return (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => handleSelectImage(dotIdx)}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        isActive 
                          ? 'w-4 h-2 bg-gold scale-105 shadow-[0_0_8px_rgba(212,175,55,0.8)]' 
                          : currentImgBg.isBlack
                            ? 'w-2 h-2 bg-white/40 hover:bg-white/60'
                            : 'w-2 h-2 bg-zinc-300 hover:bg-zinc-400'
                      }`}
                      aria-label={`Photo ${dotIdx + 1}`}
                    />
                  );
                })}
              </div>

              {/* Actions Favoris ♡ et Partage ↗ */}
              <div className="w-16 flex items-center justify-end gap-3 text-zinc-500">
                <button 
                  type="button" 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-1.5 transition-colors cursor-pointer ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                  title={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
                  aria-label="Favoris"
                >
                  <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.share) {
                      navigator.share({ title: currentProduct.name, url: window.location.href }).catch(() => {});
                    } else if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(window.location.href)
                        .then(() => alert("Lien du produit copié !"))
                        .catch(() => {});
                    } else {
                      try {
                        const tempInput = document.createElement("input");
                        tempInput.value = window.location.href;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand("copy");
                        document.body.removeChild(tempInput);
                        alert("Lien du produit copié !");
                      } catch {
                        alert(`Lien du produit : ${window.location.href}`);
                      }
                    }
                  }}
                  className="p-1.5 hover:text-zinc-900 transition-colors cursor-pointer"
                  title="Partager ce produit"
                  aria-label="Partager"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* En-tête du produit (Titre, Note & Prix) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-zinc-500 font-medium">
                Réf: {String(currentProduct.id).toLowerCase().startsWith('pcfa-') ? String(currentProduct.id).toUpperCase() : `PCFA-${String(currentProduct.id).padStart(3, '0')}`}
              </span>
            </div>

            <h1 id="product-drawer-title" className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-snug">
              {currentProduct.name}
            </h1>

            <div className="flex flex-wrap items-baseline gap-3 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-600 to-amber-700">
                {currentPrice.toLocaleString('fr-FR')} FCFA
              </span>
              {availableCapacities.length > 0 && selectedCapacity && (
                <span className="text-xs text-gold bg-gold/10 border border-gold/30 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true" />
                  <span>{selectedCapacity}</span>
                </span>
              )}
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold ml-auto">TVA incluse</span>
            </div>
          </div>

          {/* Badge de Performances Spécifiques pour Moto Électrique */}
          {currentProduct.category === 'mobility' && currentProduct.specs && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-gold text-xs font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-gold" aria-hidden="true" />
                  <span>Performances Moto Électrique</span>
                </span>
                <span className="text-[10px] text-zinc-500">Écologique · 0% Carburant</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Moteur</span>
                  <span className="text-sm font-black text-zinc-900">
                    {currentProduct.specs.motorPower ? `${currentProduct.specs.motorPower} W` : "—"}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Autonomie</span>
                  <span className="text-sm font-black text-emerald-600">
                    {currentProduct.specs.rangeKm ? `${currentProduct.specs.rangeKm} km` : "—"}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Vitesse</span>
                  <span className="text-sm font-black text-gold">
                    {currentProduct.specs.maxSpeedKm ? `${currentProduct.specs.maxSpeedKm} km/h` : "—"}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Batterie</span>
                  <span className="text-sm font-black text-zinc-900">
                    {currentProduct.specs.batteryCapacityWh ? `${currentProduct.specs.batteryCapacityWh} Wh` : (currentProduct.specs.batteryVoltage ? `${currentProduct.specs.batteryVoltage}V` : "—")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Badge de Spécifications Clés pour Ordinateurs */}
          {currentProduct.category === 'computers' && currentProduct.specs && (
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between text-blue-600 text-xs font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  <span>Configuration Clé — Ordinateur</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">{currentProduct.specs.os || "OS"}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">CPU</span>
                  <span className="text-xs font-black text-zinc-900 line-clamp-1">{currentProduct.specs.processor || "—"}</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">RAM</span>
                  <span className="text-sm font-black text-gold">{currentProduct.specs.ram ? `${currentProduct.specs.ram} Go` : "—"}</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Stockage</span>
                  <span className="text-xs font-black text-emerald-600">{currentProduct.specs.storageSize || "—"}</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Écran</span>
                  <span className="text-xs font-black text-zinc-900">{currentProduct.specs.screenSize ? `${currentProduct.specs.screenSize}"` : "—"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Badge de Spécifications Clés pour Tablettes */}
          {(currentProduct.category === 'tablets' || currentProduct.category === 'tablettes') && currentProduct.specs && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-amber-600 text-xs font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Tablet className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  <span>Fiche Tablette Officielle</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {currentProduct.specs.connectivity === 'wifi_cellular' ? '4G/5G + Wi-Fi' : 'Wi-Fi'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Écran</span>
                  <span className="text-xs font-black text-zinc-900">{currentProduct.specs.screenSize || currentProduct.specs.screen || "—"}</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">RAM</span>
                  <span className="text-sm font-black text-gold">{currentProduct.specs.ram ? `${currentProduct.specs.ram} Go` : "—"}</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Stockage</span>
                  <span className="text-xs font-black text-emerald-600">{currentProduct.specs.storageSize || "—"}</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Batterie</span>
                  <span className="text-xs font-black text-zinc-900">
                    {currentProduct.specs.batteryCapacity ? `${currentProduct.specs.batteryCapacity} mAh` : (currentProduct.specs.battery || "—")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Badge de Spécifications Clés pour Électroménager */}
          {(currentProduct.category === 'appliances' || currentProduct.category === 'electromenager') && currentProduct.specs && (
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-cyan-600 text-xs font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Refrigerator className="w-4 h-4 text-cyan-600" aria-hidden="true" />
                  <span>Fiche Électroménager Officielle</span>
                </span>
                {currentProduct.specs.energyClass && (
                  <span className="text-[10px] bg-cyan-500/15 text-cyan-700 px-2 py-0.5 rounded-full font-mono font-bold">
                    {currentProduct.specs.energyClass}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                {currentProduct.specs.capacity && (
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Capacité</span>
                    <span className="text-xs font-black text-zinc-900">{currentProduct.specs.capacity}</span>
                  </div>
                )}
                {currentProduct.specs.power && (
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Technologie</span>
                    <span className="text-xs font-black text-gold">{currentProduct.specs.power}</span>
                  </div>
                )}
                {currentProduct.specs.applianceType && (
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 col-span-2 sm:col-span-1">
                    <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Type</span>
                    <span className="text-xs font-black text-emerald-600">{currentProduct.specs.applianceType}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sélecteur de Couleurs interactif style Amazon (Image 1) */}
          {currentProduct.colors && currentProduct.colors.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-zinc-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 uppercase tracking-wider font-semibold">
                  Couleur : <strong className="text-zinc-950 normal-case font-bold text-sm ml-1.5">{activeColor}</strong>
                </span>
                <span className="text-[11px] text-zinc-500 font-medium">
                  {currentProduct.colors.length} {currentProduct.colors.length > 1 ? 'finitions' : 'finition'}
                </span>
              </div>

              {/* Cartes de variations de couleur façon Amazon */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {currentProduct.colors.map((color, idx) => {
                  const isSelected = activeColor === color;
                  const variantImg = currentProduct.images?.[idx] || currentProduct.image;
                  
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color, idx)}
                      className={`relative min-w-[90px] sm:min-w-[100px] p-2 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center text-center group flex-shrink-0 cursor-pointer ${
                        isSelected 
                          ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.25)] scale-[1.03]' 
                          : 'border-zinc-200 bg-zinc-50 hover:border-gold/40 hover:bg-zinc-100/70'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gold text-black flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 text-black stroke-[3]" aria-hidden="true" />
                        </span>
                      )}
                      
                      {/* Miniature du téléphone */}
                      <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl ${getProductImageBg(currentProduct, variantImg).containerClass} p-1 flex items-center justify-center overflow-hidden mb-2 shadow-inner`}>
                        {variantImg?.length > 4 ? (
                          <img 
                            src={variantImg} 
                            alt={color} 
                            className={`w-full h-full object-contain ${getProductImageBg(currentProduct, variantImg).isBlack ? '' : 'mix-blend-multiply'} group-hover:scale-105 transition-transform`}
                          />
                        ) : (
                          <span className="text-2xl">{variantImg}</span>
                        )}
                      </div>

                      {/* Nom de la couleur sous l'image */}
                      <span className={`text-[11px] font-bold line-clamp-1 leading-tight ${isSelected ? 'text-gold' : 'text-zinc-700'}`}>
                        {color}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sélecteur Format de SIM (E-sim, e-sim + sim physique, 2 sim physique) */}
          {availableSimTypes.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-zinc-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 uppercase tracking-wider font-semibold">
                  Format SIM : <strong className="text-zinc-950 normal-case font-bold text-sm ml-1.5">{selectedSimType}</strong>
                </span>
                <span className="text-[11px] text-zinc-500 font-medium">{availableSimTypes.length} formats</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {availableSimTypes.map((sim) => {
                  const isSelected = selectedSimType?.toLowerCase() === sim.label.toLowerCase();
                  return (
                    <button
                      key={sim.id || sim.label}
                      type="button"
                      onClick={() => setSelectedSimType(sim.label)}
                      className={`relative p-3 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer ${
                        isSelected 
                          ? 'border-gold bg-gold/15 shadow-[0_0_20px_rgba(212,175,55,0.25)] scale-[1.02]' 
                          : 'border-zinc-200 bg-zinc-50 hover:border-gold/40 hover:bg-zinc-100/70 text-zinc-600'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gold text-black flex items-center justify-center shadow-md">
                          <Check className="w-2.5 h-2.5 text-black stroke-[3]" aria-hidden="true" />
                        </span>
                      )}
                      <span className={`text-xs font-extrabold tracking-wide ${isSelected ? 'text-zinc-950' : 'text-zinc-800'}`}>
                        {sim.label}
                      </span>
                      {sim.delta !== 0 ? (
                        <span className={`text-[11px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                          sim.delta > 0 
                            ? 'bg-amber-500/15 text-amber-700' 
                            : 'bg-blue-500/15 text-blue-700'
                        }`}>
                          {sim.delta > 0 ? `+${sim.delta.toLocaleString('fr-FR')} F` : `${sim.delta.toLocaleString('fr-FR')} F`}
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-semibold mt-1">
                          Standard
                        </span>
                      )}
                      {sim.subtitle && (
                        <span className="text-[9px] text-zinc-400 mt-0.5 line-clamp-1">
                          {sim.subtitle}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sélecteur de Capacité / Taille style Amazon */}
          {availableCapacities.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-zinc-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 uppercase tracking-wider font-semibold">
                  Capacité : <strong className="text-zinc-950 normal-case font-bold text-sm ml-1.5">{selectedCapacity}</strong>
                </span>
                <span className="text-[11px] text-zinc-500 font-medium">{availableCapacities.length} options</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {availableCapacities.map((item) => {
                  const isSelected = selectedCapacity === item.capacity;
                  const itemWithSimPrice = item.price + currentSimDelta;
                  const diff = item.price - (Number(currentProduct.price) || 0);

                  return (
                    <button
                      key={item.capacity}
                      onClick={() => setSelectedCapacity(item.capacity)}
                      className={`relative p-3 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer ${
                        isSelected 
                           ? 'border-gold bg-gold/15 shadow-[0_0_20px_rgba(212,175,55,0.25)] scale-[1.02]' 
                          : 'border-zinc-200 bg-zinc-50 hover:border-gold/40 hover:bg-zinc-100/70 text-zinc-600'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gold text-black flex items-center justify-center shadow-md">
                          <Check className="w-2.5 h-2.5 text-black stroke-[3]" aria-hidden="true" />
                        </span>
                      )}
                      <span className={`text-sm font-extrabold tracking-wide ${isSelected ? 'text-zinc-950' : 'text-zinc-800'}`}>
                        {item.capacity}
                      </span>
                      <span className={`text-xs font-bold mt-1 ${isSelected ? 'text-gold' : 'text-zinc-500'}`}>
                        {itemWithSimPrice.toLocaleString('fr-FR')} F
                      </span>
                      {diff > 0 ? (
                        <span className="text-[9px] text-emerald-600 font-medium mt-0.5">
                          +{diff.toLocaleString('fr-FR')} F
                        </span>
                      ) : (
                        <span className="text-[9px] text-zinc-500 font-medium mt-0.5">
                          Base
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fiche Technique & Détails (Style Amazon épuré sans aucun emoji) */}
          {technicalDetails.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-zinc-200">

              {/* Titre Détails */}
              <div className="pt-1">
                <h3 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight">
                  Détails
                </h3>
              </div>

              {/* Tableau de spécifications en 2 colonnes style Amazon */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                {visibleDetails.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="grid grid-cols-[145px_1fr] sm:grid-cols-[185px_1fr] gap-x-4 items-baseline"
                  >
                    <span className="font-bold text-zinc-900 leading-snug">
                      {item.label}
                    </span>
                    <span className="text-zinc-600 font-normal leading-relaxed break-words">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bouton Voir plus / Voir moins */}
              {technicalDetails.length > 7 && (
                <button
                  type="button"
                  onClick={() => setShowAllSpecs(!showAllSpecs)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:text-amber-600 transition-colors pt-1 cursor-pointer"
                >
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${showAllSpecs ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span>{showAllSpecs ? 'Voir moins' : 'Voir plus'}</span>
                </button>
              )}
            </div>
          )}

          {/* Description du produit */}
          <div className="space-y-2 pt-2 border-t border-zinc-200">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</h3>
            <p className="text-zinc-700 text-sm sm:text-base leading-relaxed border-l-2 border-gold/50 pl-4 py-1 bg-zinc-50/80 rounded-r-xl">
              {currentProduct.desc}
            </p>
          </div>

          {/* État de l'appareil, Garantie & Contenu du Coffret */}
          <div className="space-y-2.5 pt-3 border-t border-zinc-200">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">État, Garantie & Coffret</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-2.5">
                <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-semibold">État de l&apos;Appareil</div>
                  <div className="font-bold text-zinc-900">
                    {currentProduct.condition === 'occasion' ? "Occasion Certifiée A+" : "Neuf sous blister scellé"}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-2.5">
                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-semibold">Garantie Vendeur</div>
                  <div className="font-bold text-zinc-900">{currentProduct.warranty || "Garantie 12 Mois Certifiée"}</div>
                </div>
              </div>

              {currentProduct.accessories ? (
                <div className="col-span-1 sm:col-span-2 p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase font-semibold">Accessoires Inclus dans le Coffret</div>
                    <div className="font-medium text-zinc-800 mt-0.5">{currentProduct.accessories}</div>
                  </div>
                </div>
              ) : (
                <div className="col-span-1 sm:col-span-2 p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase font-semibold">Coffret</div>
                    <div className="font-medium text-zinc-700">Câble de charge d&apos;origine & documentation inclus</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Avantages & Garanties Boutique VIP */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-200">
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-gold font-bold text-xs">
                <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Expédition 24/48h</span>
              </div>
              <span className="text-[11px] text-zinc-500">Livraison rapide et sécurisée</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-gold font-bold text-xs">
                <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Garantie Authentique</span>
              </div>
              <span className="text-[11px] text-zinc-500">100% Produit certifié d&apos;origine</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-gold font-bold text-xs">
                <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Service VIP WhatsApp</span>
              </div>
              <span className="text-[11px] text-zinc-500">Assistance directe 7j/7</span>
            </div>
          </div>

        </div>

        {/* Barre d'Action Inférieure Fixée (Sticky Bottom Bar) */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 bg-white/95 backdrop-blur-md flex items-center justify-between gap-4 relative z-20">
          <div className="flex flex-col pr-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
              Total {[selectedCapacity, selectedSimType].filter(Boolean).join(' · ')}
            </span>
            <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-600 to-amber-700 whitespace-nowrap">
              {currentPrice.toLocaleString('fr-FR')} <span className="text-xs sm:text-sm text-gold font-bold">FCFA</span>
            </span>
          </div>

          {/* Bouton Unique Ultra-Prestige : Ajouter au Panier */}
          <button 
            onClick={() => {
              onAddToCart(currentProduct, activeColor, selectedCapacity, currentPrice, selectedSimType);
              onClose();
            }}
            className="flex-1 py-3.5 sm:py-4 px-6 rounded-2xl border border-gold/40 bg-gradient-to-r from-gold via-yellow-500 to-yellow-600 text-black font-extrabold uppercase tracking-widest text-xs sm:text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-105 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
          >
            <ShoppingBag className="w-4 h-4 text-black stroke-[2.5]" aria-hidden="true" />
            <span>Ajouter au panier</span>
          </button>
        </div>
      </aside>
    </>
  );
}
