"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { SHOP_CONFIG } from '@/config/shop';
import { Star, HardDrive, Check, Zap, Laptop, Refrigerator, Tablet, ShoppingBag, ChevronDown, ChevronLeft } from 'lucide-react';
import { getCategoryConfig, isStorageVariantCategory } from '@/config/categories';
import { getProductImageBg, isAppleBrand } from '@/lib/productValidation';

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

export const formatCleanSimLabel = (raw) => {
  if (!raw) return '';
  const s = String(raw).toLowerCase().trim();
  if (s === 'dual_sim_physical' || s.includes('double') || (s.includes('2') && s.includes('sim'))) {
    return 'double sim physique';
  }
  if (s === 'esim_only' || (s.includes('esim') && !s.includes('physique'))) {
    return 'e-sim';
  }
  return '1 e-sim+1 sim physique';
};

export const isSimTypeMatch = (a, b) => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return formatCleanSimLabel(a) === formatCleanSimLabel(b);
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

  const isAppleProduct = (p) => {
    if (!p || p.category !== 'phones') return false;
    return isAppleBrand(p.brand) || Boolean(p.name && p.name.toLowerCase().includes('iphone'));
  };

  const isIPhone = isAppleProduct(currentProduct);

  const isComingSoon = Boolean(
    currentProduct?.stockStatus === 'bientot_disponible' ||
    currentProduct?.isComingSoon === true ||
    currentProduct?.inStock === false ||
    (typeof currentProduct?.stock === 'number' && currentProduct?.stock <= 0)
  );

  const getInitialCapacity = (p) => {
    if (!p) return '';
    if (p.selectedCapacity) return p.selectedCapacity;
    if (isAppleProduct(p)) {
      // Pour les iPhones : aucun pré-choix obligatoire, l'utilisateur doit choisir
      return '';
    }
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
    if (isAppleProduct(p) && !p.selectedSimType && !p.selectedCapacity) {
      // Pour les iPhones : masquer/attendre le choix de la SIM et capacité
      return '';
    }
    return p.colors?.[0] || '';
  };

  const getInitialSimType = (p) => {
    if (!p) return '';
    if (p.selectedSimType) return p.selectedSimType;
    if (isAppleProduct(p)) {
      // Pour les iPhones : aucun pré-choix obligatoire, l'utilisateur doit choisir
      return '';
    }
    if (p.category === 'phones') {
      if (p.simPricing && typeof p.simPricing === 'object') {
        const first = Object.entries(p.simPricing).find(([_, conf]) => conf?.enabled !== false);
        if (first && first[1]?.label) return formatCleanSimLabel(first[1].label);
      }
      return '1 e-sim+1 sim physique';
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
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  // Ajustement de l'état lors d'un changement de produit (pattern officiel React sans effet en cascade)
  if (product && product !== prevProduct) {
    setPrevProduct(product);
    setCachedProduct(product);
    const newColor = getInitialColor(product);
    setActiveColor(newColor);
    setSelectedCapacity(product.selectedCapacity || getInitialCapacity(product));
    setSelectedSimType(product.selectedSimType || getInitialSimType(product));
    const newIdx = product.colors?.indexOf(newColor);
    setActiveImageIndex(newIdx !== -1 && newIdx !== undefined ? newIdx : 0);
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
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    // Si glissement depuis le bord gauche (< 45px) ou 1 seule image, laisser le tiroir gérer le swipe retour
    if (touch.clientX < 45 || productImages.length <= 1) return;
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    setDragOffset(0);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartX;
    const diffY = touch.clientY - touchStartY;

    // Si le mouvement est plutôt vertical (scroll de page), ne pas interférer
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffX) < 15) {
      return;
    }

    // Si on est sur la 1ère photo et qu'on glisse vers la droite, transférer le swipe au volet pour fermer
    if (activeImageIndex === 0 && diffX > 0) {
      setIsDragging(false);
      setDragOffset(0);
      return; // Le geste continue sur le tiroir
    }

    // Empêcher la propagation vers le tiroir quand on fait défiler les photos du carrousel
    e.stopPropagation();

    // Résistance élastique style iOS aux extrémités (effet Rubber-Band)
    if (activeImageIndex === productImages.length - 1 && diffX < 0) {
      setDragOffset(diffX * 0.35);
    } else {
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

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


  // Formats SIM disponibles pour téléphones (1 e-sim+1 sim physique, double sim physique, e-sim)
  const availableSimTypes = useMemo(() => {
    if (!currentProduct || currentProduct.category !== 'phones') return [];

    // Priorité 1 : Variantes explicites configurées par l'administrateur
    if (currentProduct.variants && Array.isArray(currentProduct.variants) && currentProduct.variants.length > 0) {
      const simsMap = new Map();
      currentProduct.variants.forEach(v => {
        const rawLabel = v.simType || v.simTypeId;
        const cleanLabel = formatCleanSimLabel(rawLabel);
        const key = v.simTypeId || cleanLabel;
        if (!simsMap.has(cleanLabel)) {
          simsMap.set(cleanLabel, {
            id: key,
            label: cleanLabel,
            delta: 0
          });
        }
      });
      if (simsMap.size > 0) return Array.from(simsMap.values());
    }

    // Priorité 2 : Configuration simPricing
    if (currentProduct.simPricing && typeof currentProduct.simPricing === 'object') {
      const entries = Object.entries(currentProduct.simPricing)
        .filter(([_, conf]) => conf && conf.enabled !== false)
        .map(([key, conf]) => ({
          id: key,
          label: formatCleanSimLabel(conf.label || key),
          delta: typeof conf.delta === 'number' ? conf.delta : 0
        }));
      if (entries.length > 0) return entries;
    }
    return [
      { id: 'sim_and_esim', label: '1 e-sim+1 sim physique', delta: 0 },
      { id: 'dual_sim_physical', label: 'double sim physique', delta: 30000 },
      { id: 'esim_only', label: 'e-sim', delta: -20000 },
    ];
  }, [currentProduct]);

  // Calcul des capacités disponibles selon le format SIM sélectionné
  const availableCapacities = useMemo(() => {
    if (!currentProduct) return [];
    const supportsStorage = isStorageVariantCategory(currentProduct.category) || currentProduct.category === 'phones';
    if (!supportsStorage) return [];

    // Pour les iPhones : obliger de choisir d'abord le format de SIM
    if (isIPhone && !selectedSimType) {
      return [];
    }

    // Si le produit possède des variantes explicites configurées par SIM
    if (currentProduct.variants && Array.isArray(currentProduct.variants) && currentProduct.variants.length > 0) {
      const matchingVariants = currentProduct.variants.filter(v => 
        !selectedSimType || 
        isSimTypeMatch(v.simType, selectedSimType) ||
        isSimTypeMatch(v.simTypeId, selectedSimType)
      );
      const capsMap = new Map();
      (matchingVariants.length > 0 ? matchingVariants : currentProduct.variants).forEach(v => {
        if (!capsMap.has(v.storage)) {
          capsMap.set(v.storage, v.price);
        }
      });
      if (capsMap.size > 0) {
        return Array.from(capsMap.entries()).map(([capacity, price]) => ({
          capacity,
          price
        }));
      }
    }

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
  }, [currentProduct, selectedSimType, isIPhone]);

  // Delta actif selon le type de SIM choisi (pour compatibilité rétroactive)
  const currentSimDelta = useMemo(() => {
    if (availableSimTypes.length === 0 || !selectedSimType) return 0;
    const match = availableSimTypes.find(
      s => isSimTypeMatch(s.label, selectedSimType) || isSimTypeMatch(s.id, selectedSimType)
    );
    return (match && typeof match.delta === 'number') ? match.delta : 0;
  }, [availableSimTypes, selectedSimType]);

  // Calcul du prix dynamique en fonction de la capacité et du type de SIM choisi
  const currentPrice = useMemo(() => {
    if (!currentProduct) return 0;

    // Priorité 1 : Tarif exact de la variante configurée pour ce SIM et cette capacité
    if (currentProduct.variants && Array.isArray(currentProduct.variants) && currentProduct.variants.length > 0) {
      const match = currentProduct.variants.find(v => 
        (!selectedSimType || isSimTypeMatch(v.simType, selectedSimType) || isSimTypeMatch(v.simTypeId, selectedSimType)) &&
        (!selectedCapacity || v.storage.toLowerCase() === selectedCapacity.toLowerCase())
      );
      if (match && typeof match.price === 'number') {
        return match.price;
      }
    }

    // Priorité 2 : Calcul standard basePrice + delta SIM
    let basePrice = Number(currentProduct.price) || 0;
    if (availableCapacities.length > 0 && selectedCapacity) {
      const match = availableCapacities.find(c => c.capacity === selectedCapacity);
      if (match) basePrice = match.price;
    }

    // Intégration de la surcote / remise du type de SIM
    return Math.max(0, basePrice + currentSimDelta);
  }, [currentProduct, availableCapacities, selectedCapacity, selectedSimType, currentSimDelta]);

  // Couleurs disponibles selon le format SIM et la capacité sélectionnés
  const availableColorsForSelection = useMemo(() => {
    if (!currentProduct?.colors) return [];

    // Pour les iPhones : les couleurs ne sont visibles QUE si SIM ET Capacité sont choisies
    if (isIPhone && (!selectedSimType || !selectedCapacity)) {
      return [];
    }

    if (currentProduct.variants && Array.isArray(currentProduct.variants) && currentProduct.variants.length > 0) {
      const matching = currentProduct.variants.filter(v => 
        (!selectedSimType || isSimTypeMatch(v.simType, selectedSimType) || isSimTypeMatch(v.simTypeId, selectedSimType)) &&
        (!selectedCapacity || v.storage.toLowerCase() === selectedCapacity.toLowerCase())
      );
      if (matching.length > 0) {
        const allowedColors = new Set(matching.map(v => v.color.toLowerCase()));
        const filtered = currentProduct.colors.filter(c => allowedColors.has(c.toLowerCase()));
        if (filtered.length > 0) return filtered;
      }
    }
    return currentProduct.colors;
  }, [currentProduct, selectedSimType, selectedCapacity, isIPhone]);

  // Si la couleur active n'est pas disponible pour cette combinaison, basculer sur la première disponible
  useEffect(() => {
    if (isIPhone) {
      if (selectedSimType && selectedCapacity && availableColorsForSelection && availableColorsForSelection.length > 0) {
        const isCurrentActiveValid = availableColorsForSelection.some(
          c => c.toLowerCase() === (activeColor || '').toLowerCase()
        );
        if (!isCurrentActiveValid) {
          setActiveColor(availableColorsForSelection[0]);
        }
      } else if (!selectedSimType || !selectedCapacity) {
        if (activeColor !== '') {
          setActiveColor('');
        }
      }
    } else {
      if (availableColorsForSelection && availableColorsForSelection.length > 0) {
        const isCurrentActiveValid = availableColorsForSelection.some(
          c => c.toLowerCase() === (activeColor || '').toLowerCase()
        );
        if (!isCurrentActiveValid) {
          setActiveColor(availableColorsForSelection[0]);
        }
      }
    }
  }, [availableColorsForSelection, activeColor, isIPhone, selectedSimType, selectedCapacity]);

  // Si la capacité sélectionnée n'est pas disponible pour ce type de SIM, basculer sur la première disponible
  useEffect(() => {
    if (isIPhone) {
      if (!selectedSimType) {
        if (selectedCapacity !== '') setSelectedCapacity('');
      } else if (availableCapacities && availableCapacities.length > 0) {
        const isCurrentCapValid = selectedCapacity && availableCapacities.some(
          c => c.capacity.toLowerCase() === selectedCapacity.toLowerCase()
        );
        if (!isCurrentCapValid && selectedCapacity !== '') {
          setSelectedCapacity('');
        }
      }
    } else {
      if (availableCapacities && availableCapacities.length > 0) {
        const isCurrentCapValid = availableCapacities.some(
          c => c.capacity.toLowerCase() === (selectedCapacity || '').toLowerCase()
        );
        if (!isCurrentCapValid) {
          setSelectedCapacity(availableCapacities[0].capacity);
        }
      }
    }
  }, [isIPhone, selectedSimType, availableCapacities, selectedCapacity]);

  const drawerRef = useRef(null);
  const backdropRef = useRef(null);
  const isPopStateActionRef = useRef(false);

  // Fermeture propre avec gestion de l'historique de navigation du navigateur
  const handleCleanClose = useCallback(() => {
    if (typeof window !== 'undefined' && !isPopStateActionRef.current) {
      if (window.history.state && window.history.state.modal === 'product-drawer') {
        window.history.back();
      }
    }
    onClose();
  }, [onClose]);

  // Support natif de la navigation retour mobile (iOS Safari swipe back & bouton retour physique Android)
  useEffect(() => {
    if (!isOpen) return;

    isPopStateActionRef.current = false;

    if (typeof window !== 'undefined') {
      try {
        if (!window.history.state || window.history.state.modal !== 'product-drawer') {
          window.history.pushState({ modal: 'product-drawer', id: currentProduct?.id }, '');
        }
      } catch {
        // Ignorer en cas d'environnement restreint
      }

      const handlePopState = () => {
        isPopStateActionRef.current = true;
        onClose();
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isOpen, onClose, currentProduct?.id]);

  // Fermeture avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleCleanClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleCleanClose]);

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
      if (drawerRef.current) {
        drawerRef.current.style.transform = '';
        drawerRef.current.style.transition = '';
      }
      if (backdropRef.current) {
        backdropRef.current.style.opacity = '';
        backdropRef.current.style.transition = '';
      }
      const frame = requestAnimationFrame(() => setSlideIn(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setSlideIn(false);
    }
  }, [isOpen]);

  // Gestion du glissement tactile au doigt vers la droite (Swipe to Dismiss) pour revenir aux catégories
  const drawerTouchRef = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    isDragging: false,
    isScroll: false,
    dragX: 0
  });

  const handleDrawerTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    drawerTouchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isDragging: false,
      isScroll: false,
      dragX: 0
    };
  };

  const handleDrawerTouchMove = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const state = drawerTouchRef.current;
    if (state.isScroll) return;

    const touch = e.touches[0];
    const diffX = touch.clientX - state.startX;
    const diffY = touch.clientY - state.startY;

    // Déterminer la direction principale du mouvement
    if (!state.isDragging) {
      // Si défilement vertical dominant, laisser défiler la fiche technique
      if (Math.abs(diffY) > 8 && Math.abs(diffY) > Math.abs(diffX)) {
        state.isScroll = true;
        return;
      }
      // Si glissement horizontal vers la droite clairement dominant
      if (diffX > 10 && diffX > Math.abs(diffY)) {
        state.isDragging = true;
        if (drawerRef.current) {
          drawerRef.current.style.transition = 'none';
        }
        if (backdropRef.current) {
          backdropRef.current.style.transition = 'none';
        }
      } else {
        return;
      }
    }

    if (state.isDragging && diffX > 0) {
      state.dragX = diffX;
      if (drawerRef.current) {
        drawerRef.current.style.transform = `translateX(${diffX}px)`;
      }
      if (backdropRef.current) {
        const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
        const progress = Math.min(1, Math.max(0, diffX / windowWidth));
        backdropRef.current.style.opacity = String(Math.max(0, 0.75 * (1 - progress)));
      }
    }
  };

  const handleDrawerTouchEnd = () => {
    const state = drawerTouchRef.current;
    if (!state.isDragging) return;

    state.isDragging = false;
    const elapsed = Math.max(1, Date.now() - state.startTime);
    const velocity = state.dragX / elapsed; // px/ms

    // Seuil de fermeture : soit glissé de plus de 80px, soit petit coup rapide (flick) vers la droite
    const shouldClose = state.dragX > 80 || (velocity > 0.35 && state.dragX > 35);

    if (shouldClose) {
      if (drawerRef.current) {
        drawerRef.current.style.transition = 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';
        drawerRef.current.style.transform = 'translateX(100%)';
      }
      if (backdropRef.current) {
        backdropRef.current.style.transition = 'opacity 240ms ease';
        backdropRef.current.style.opacity = '0';
      }
      setTimeout(() => {
        handleCleanClose();
      }, 240);
    } else {
      // Rétablissement élastique
      if (drawerRef.current) {
        drawerRef.current.style.transition = 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';
        drawerRef.current.style.transform = 'translateX(0)';
      }
      if (backdropRef.current) {
        backdropRef.current.style.transition = 'opacity 240ms ease';
        backdropRef.current.style.opacity = '1';
      }
      state.dragX = 0;
    }
  };

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
        ref={backdropRef}
        className={`fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300 ease-out z-[140] ${
          slideIn && isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleCleanClose}
        aria-hidden="true"
      />

      {/* Volet Latéral / Slide-Over Drawer depuis le côté droit */}
      <aside 
        ref={drawerRef}
        onTouchStart={handleDrawerTouchStart}
        onTouchMove={handleDrawerTouchMove}
        onTouchEnd={handleDrawerTouchEnd}
        onTouchCancel={handleDrawerTouchEnd}
        className={`fixed top-0 right-0 h-full w-full sm:w-[540px] md:w-[620px] lg:w-[680px] bg-white border-l border-zinc-200 shadow-[-20px_0_50px_rgba(0,0,0,0.15),-5px_0_20px_rgba(212,175,55,0.1)] z-[150] transition-transform duration-300 ease-out flex flex-col overflow-hidden will-change-transform ${
          slideIn && isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-drawer-title"
      >
        {/* Poignée discrète pour indication de glissement tactile sur mobile */}
        <div className="absolute top-1/2 -translate-y-1/2 left-1.5 w-1 h-12 rounded-full bg-zinc-300/80 sm:hidden pointer-events-none z-30" />

        {/* Header du Drawer avec bouton retour */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-5 border-b border-zinc-200 bg-white/95 backdrop-blur-md relative z-20">
          {/* Bouton Retour rapide pour revenir en 1 tap aux catégories */}
          <button
            type="button"
            onClick={handleCleanClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold border border-zinc-200/80 transition-all active:scale-95 cursor-pointer shadow-xs"
            title="Retour aux catégories (ou glisser vers la droite)"
            aria-label="Retour aux catégories"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-600" aria-hidden="true" />
            <span>Retour</span>
          </button>

          {/* Statut du stock positionné à droite */}
          <div className="flex items-center gap-2">
            {isComingSoon ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-bold bg-amber-500/10 px-2.5 sm:px-3 py-1 rounded-full border border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="hidden sm:inline">⏳ Bientôt disponible (Arrivage imminent)</span>
                <span className="sm:hidden">⏳ Bientôt dispo</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                En stock
              </span>
            )}
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

            {/* Points indicateurs de pagination avec transition dynamique */}
            {productImages.length > 1 && (
              <div className="flex items-center justify-center gap-2 pt-1 pb-1">
                {productImages.map((_, dotIdx) => {
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
            )}
          </div>

          {/* En-tête du produit (Titre, Note & Prix) */}
          <div className="space-y-3">

            <h1 id="product-drawer-title" className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-snug">
              {currentProduct.name}
            </h1>

            <div className="flex flex-wrap items-baseline gap-3 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-600 to-amber-700">
                {isIPhone && (!selectedSimType || !selectedCapacity)
                  ? `À partir de ${(Number(currentProduct.price) || 0).toLocaleString('fr-FR')} FCFA`
                  : `${currentPrice.toLocaleString('fr-FR')} FCFA`
                }
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

          {/* Bannière Produit bientôt disponible */}
          {isComingSoon && (
            <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 flex items-start gap-3 shadow-sm">
              <span className="text-2xl flex-shrink-0">⏳</span>
              <div className="space-y-1">
                <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider">
                  Produit bientôt disponible
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Cet article est actuellement en rupture temporaire de stock dans notre boutique. Il sera de nouveau disponible très prochainement.
                </p>
              </div>
            </div>
          )}

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

          {/* CAS IPHONE : FLUX STRICT (1. FORMAT SIM → 2. CAPACITÉ → 3. COULEURS DISPONIBLES) */}
          {isIPhone ? (
            <div className="space-y-4 pt-3 border-t border-zinc-200">
              {/* 1. Sélecteur Format de SIM */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor="user-sim-type-select" 
                    className="text-xs text-zinc-600 uppercase tracking-wider font-bold"
                  >
                    1. Format SIM {selectedSimType ? <span className="text-zinc-950 font-extrabold normal-case text-sm ml-1">: {selectedSimType}</span> : <span className="text-amber-600 text-[11px] font-semibold normal-case ml-1">(Étape 1 : Requis)</span>}
                  </label>
                  <span className="text-[11px] text-zinc-400 font-medium">{availableSimTypes.length} formats</span>
                </div>

                <div className="relative">
                  <select
                    id="user-sim-type-select"
                    value={selectedSimType}
                    onChange={(e) => setSelectedSimType(e.target.value)}
                    className="w-full bg-zinc-50 hover:bg-zinc-100 border-2 border-zinc-200 focus:border-gold rounded-2xl px-4 py-3 text-sm font-bold text-zinc-900 outline-none transition-all cursor-pointer appearance-none pr-10 shadow-sm"
                  >
                    <option value="">— Veuillez choisir le format de SIM —</option>
                    {availableSimTypes.map((sim) => {
                      const priceNote = sim.delta > 0 
                        ? ` (+${sim.delta.toLocaleString('fr-FR')} FCFA)` 
                        : sim.delta < 0 
                        ? ` (${sim.delta.toLocaleString('fr-FR')} FCFA)` 
                        : '';
                      return (
                        <option key={sim.id || sim.label} value={sim.label}>
                          {sim.label}{priceNote}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* 2. Sélecteur de Capacité (Déverrouillé après le choix de la SIM) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor="user-capacity-select" 
                    className="text-xs text-zinc-600 uppercase tracking-wider font-bold"
                  >
                    2. Capacité {selectedCapacity ? <span className="text-zinc-950 font-extrabold normal-case text-sm ml-1">: {selectedCapacity}</span> : <span className="text-amber-600 text-[11px] font-semibold normal-case ml-1">(Étape 2 : Requis)</span>}
                  </label>
                  {selectedSimType && (
                    <span className="text-[11px] text-zinc-400 font-medium">{availableCapacities.length} options</span>
                  )}
                </div>

                <div className="relative">
                  <select
                    id="user-capacity-select"
                    value={selectedCapacity}
                    disabled={!selectedSimType}
                    onChange={(e) => setSelectedCapacity(e.target.value)}
                    className={`w-full border-2 rounded-2xl px-4 py-3 text-sm font-bold outline-none transition-all appearance-none pr-10 shadow-sm ${
                      !selectedSimType
                        ? 'bg-zinc-100/70 border-zinc-200 text-zinc-400 cursor-not-allowed'
                        : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 focus:border-gold text-zinc-900 cursor-pointer'
                    }`}
                  >
                    {!selectedSimType ? (
                      <option value="">— Veuillez d&apos;abord choisir le format de SIM —</option>
                    ) : (
                      <>
                        <option value="">— Veuillez choisir la capacité —</option>
                        {availableCapacities.map((item) => {
                          const itemWithSimPrice = item.price + currentSimDelta;
                          return (
                            <option key={item.capacity} value={item.capacity}>
                              {item.capacity} — {itemWithSimPrice.toLocaleString('fr-FR')} FCFA
                            </option>
                          );
                        })}
                      </>
                    )}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* 3. Sélecteur de Couleurs : Visible UNIQUEMENT si SIM ET Capacité sont choisies */}
              {selectedSimType && selectedCapacity ? (
                availableColorsForSelection && availableColorsForSelection.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-zinc-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-600 uppercase tracking-wider font-semibold">
                        3. Couleur : <strong className="text-zinc-950 normal-case font-bold text-sm ml-1.5">{activeColor || 'Sélectionnez une couleur'}</strong>
                      </span>
                      <span className="text-[11px] text-zinc-500 font-medium">
                        {availableColorsForSelection.length} {availableColorsForSelection.length > 1 ? 'finitions disponibles' : 'finition disponible'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                      {availableColorsForSelection.map((color, idx) => {
                        const isSelected = activeColor === color;
                        const originalIdx = currentProduct.colors?.indexOf(color) ?? idx;
                        const variantImg = currentProduct.images?.[originalIdx] || currentProduct.image;
                        
                        return (
                          <button
                            key={color}
                            onClick={() => handleColorChange(color, originalIdx)}
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

                            <span className={`text-[11px] font-bold line-clamp-1 leading-tight ${isSelected ? 'text-gold' : 'text-zinc-700'}`}>
                              {color}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              ) : (
                <div className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 text-center space-y-1">
                  <p className="text-xs font-bold text-zinc-800">
                    🎨 Finitions et Couleurs disponibles
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Veuillez choisir le <strong>format de SIM</strong> et la <strong>capacité</strong> ci-dessus pour afficher les couleurs disponibles pour cet iPhone.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* AUTRES PRODUITS : AFFICHAGE HABITUEL SANS RESTRICTION */
            <>
              {/* Sélecteur de Couleurs habituel */}
              {availableColorsForSelection && availableColorsForSelection.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-zinc-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-600 uppercase tracking-wider font-semibold">
                      Couleur : <strong className="text-zinc-950 normal-case font-bold text-sm ml-1.5">{activeColor}</strong>
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {availableColorsForSelection.length} {availableColorsForSelection.length > 1 ? 'finitions disponibles' : 'finition disponible'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    {availableColorsForSelection.map((color, idx) => {
                      const isSelected = activeColor === color;
                      const originalIdx = currentProduct.colors?.indexOf(color) ?? idx;
                      const variantImg = currentProduct.images?.[originalIdx] || currentProduct.image;
                      
                      return (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color, originalIdx)}
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

                          <span className={`text-[11px] font-bold line-clamp-1 leading-tight ${isSelected ? 'text-gold' : 'text-zinc-700'}`}>
                            {color}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sélecteur Format de SIM si applicable */}
              {availableSimTypes.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-zinc-200">
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor="user-sim-type-select" 
                      className="text-xs text-zinc-600 uppercase tracking-wider font-bold"
                    >
                      Format SIM : <span className="text-zinc-950 font-extrabold normal-case text-sm ml-1">{selectedSimType}</span>
                    </label>
                    <span className="text-[11px] text-zinc-400 font-medium">{availableSimTypes.length} formats</span>
                  </div>

                  <div className="relative">
                    <select
                      id="user-sim-type-select"
                      value={selectedSimType}
                      onChange={(e) => setSelectedSimType(e.target.value)}
                      className="w-full bg-zinc-50 hover:bg-zinc-100 border-2 border-zinc-200 focus:border-gold rounded-2xl px-4 py-3 text-sm font-bold text-zinc-900 outline-none transition-all cursor-pointer appearance-none pr-10 shadow-sm"
                    >
                      {availableSimTypes.map((sim) => {
                        const priceNote = sim.delta > 0 
                          ? ` (+${sim.delta.toLocaleString('fr-FR')} FCFA)` 
                          : sim.delta < 0 
                          ? ` (${sim.delta.toLocaleString('fr-FR')} FCFA)` 
                          : '';
                        return (
                          <option key={sim.id || sim.label} value={sim.label}>
                            {sim.label}{priceNote}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              )}

              {/* Sélecteur de Capacité si applicable */}
              {availableCapacities.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-zinc-200">
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor="user-capacity-select" 
                      className="text-xs text-zinc-600 uppercase tracking-wider font-bold"
                    >
                      Capacité : <span className="text-zinc-950 font-extrabold normal-case text-sm ml-1">{selectedCapacity}</span>
                    </label>
                    <span className="text-[11px] text-zinc-400 font-medium">{availableCapacities.length} options</span>
                  </div>

                  <div className="relative">
                    <select
                      id="user-capacity-select"
                      value={selectedCapacity}
                      onChange={(e) => setSelectedCapacity(e.target.value)}
                      className="w-full bg-zinc-50 hover:bg-zinc-100 border-2 border-zinc-200 focus:border-gold rounded-2xl px-4 py-3 text-sm font-bold text-zinc-900 outline-none transition-all cursor-pointer appearance-none pr-10 shadow-sm"
                    >
                      {availableCapacities.map((item) => {
                        const itemWithSimPrice = item.price + currentSimDelta;
                        return (
                          <option key={item.capacity} value={item.capacity}>
                            {item.capacity} — {itemWithSimPrice.toLocaleString('fr-FR')} FCFA
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              )}
            </>
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
              {isIPhone && (!selectedSimType || !selectedCapacity)
                ? 'Configuration requise'
                : `Total ${[selectedCapacity, selectedSimType].filter(Boolean).join(' · ')}`
              }
            </span>
            <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-600 to-amber-700 whitespace-nowrap">
              {isIPhone && (!selectedSimType || !selectedCapacity)
                ? `${(Number(currentProduct.price) || 0).toLocaleString('fr-FR')} `
                : `${currentPrice.toLocaleString('fr-FR')} `
              }
              <span className="text-xs sm:text-sm text-gold font-bold">FCFA</span>
            </span>
          </div>

          {/* Bouton d'action : Désactivé si bientôt disponible, sinon Ajout Panier */}
          {isComingSoon ? (
            <button
              type="button"
              disabled
              className="flex-1 py-3.5 sm:py-4 px-6 rounded-2xl border border-zinc-200 bg-zinc-100 text-zinc-400 font-extrabold uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed shadow-none"
            >
              <span className="text-sm">⏳</span>
              <span>Bientôt disponible</span>
            </button>
          ) : (
            <button 
              disabled={Boolean(isIPhone && (!selectedSimType || !selectedCapacity))}
              onClick={() => {
                if (isIPhone && (!selectedSimType || !selectedCapacity)) {
                  return;
                }
                onAddToCart(currentProduct, activeColor, selectedCapacity, currentPrice, selectedSimType);
                handleCleanClose();
              }}
              className={`flex-1 py-3.5 sm:py-4 px-6 rounded-2xl border font-extrabold uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md ${
                isIPhone && (!selectedSimType || !selectedCapacity)
                  ? 'bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed opacity-75'
                  : 'border-gold/40 bg-gradient-to-r from-gold via-yellow-500 to-yellow-600 text-black hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-105 active:scale-[0.98] cursor-pointer'
              }`}
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
              <span>
                {isIPhone && !selectedSimType
                  ? '1. Choisissez le format SIM'
                  : isIPhone && !selectedCapacity
                  ? '2. Choisissez la capacité'
                  : 'Ajouter au panier'}
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
