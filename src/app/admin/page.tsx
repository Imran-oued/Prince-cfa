"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { products as defaultProducts } from "@/data/products";
import { 
  Crown, 
  AlertCircle, 
  Package, 
  Tag, 
  RefreshCw, 
  Coins, 
  ShoppingBag, 
  Truck, 
  Store, 
  Check, 
  X, 
  Search,
  Filter,
  CreditCard, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Save, 
  CloudUpload, 
  Pencil, 
  Trash2, 
  RotateCcw,
  Camera, 
  Upload,
  HardDrive,
  Eye,
  Clock,
  Laptop,
  Smartphone,
  Tablet,
  Zap,
  Headphones,
  Tv,
  Speaker,
  Sun,
  Layers,
  Refrigerator,
  Flame,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Plus
} from "lucide-react";
import { 
  PRODUCT_CATEGORIES, 
  CATEGORIES_LIST, 
  getCategoryConfig, 
  CategoryDefinition, 
  SpecFieldDefinition,
  IPHONE_SIM_TYPES,
  IPHONE_OFFICIAL_COLORS
} from "@/config/categories";
import { 
  validateAndCleanProduct, 
  normalizeProductSpecs,
  isAppleBrand
} from "@/lib/productValidation";
import { isOrderExpired } from "@/lib/firestore";

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

function OrangeMoneyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <img 
      src="/orange-money.png" 
      alt="Orange Money" 
      className={`${className} object-contain rounded-sm inline-block flex-shrink-0`} 
      loading="lazy"
    />
  );
}

function WaveIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <img 
      src="/wave.png" 
      alt="Wave" 
      className={`${className} object-cover rounded-sm inline-block flex-shrink-0`} 
      loading="lazy"
    />
  );
}

function getCategoryIcon(catId: string, className = "w-4 h-4") {
  switch (catId) {
    case "phones":
      return <Smartphone className={className} aria-hidden="true" />;
    case "computers":
      return <Laptop className={className} aria-hidden="true" />;
    case "tablets":
      return <Tablet className={className} aria-hidden="true" />;
    case "mobility":
      return <Zap className={className} aria-hidden="true" />;
    case "accessories":
      return <Headphones className={className} aria-hidden="true" />;
    case "tv":
      return <Tv className={className} aria-hidden="true" />;
    case "audio":
      return <Speaker className={className} aria-hidden="true" />;
    case "solar":
      return <Sun className={className} aria-hidden="true" />;
    case "appliances":
    case "electromenager":
      return <Refrigerator className={className} aria-hidden="true" />;
    case "promotion":
    case "promotions":
      return <Flame className={className} aria-hidden="true" />;
    default:
      return <Package className={className} aria-hidden="true" />;
  }
}

interface StorageOption {
  capacity: string;
  price: number;
  storage?: string;
  ram?: number | string;
}

export interface AndroidPhoneVariant {
  id: string;
  storage: string;
  ram: number | string;
  price: string;
}

interface StorageEntry {
  capacity: string;
  price: string;
}

export interface AppleVariant {
  id: string;
  simType: string;
  simTypeId: string;
  storage: string;
  color: string;
  price: number;
  active: boolean;
}

const PREDEFINED_APPLE_FEATURES = [
  "Écran Super Retina XDR OLED 120Hz",
  "Puce A17 Pro (Gravure 3nm)",
  "Puce A18 Pro (Gravure 3nm)",
  "Dynamic Island interactive",
  "Bouton Action personnalisable",
  "USB-C 3.0 ultra-rapide (10 Gb/s)",
  "Châssis en Titane aérospatial",
  "Face ID biométrique sécurisé",
  "Recharge sans fil MagSafe 15W",
  "Résistance à l'eau IP68 (6 mètres)",
  "Appareil photo 48 MP avec Zoom optique 5x",
  "Enregistrement vidéo 4K Dolby Vision 60 fps",
  "Apple Intelligence Ready",
  "Autonomie jusqu'à 29h en lecture vidéo",
  "Réseau 5G ultra-rapide",
];

const POPULAR_IPHONE_MODELS = [
  "iPhone 16 Pro Max",
  "iPhone 16 Pro",
  "iPhone 16 Plus",
  "iPhone 16",
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15",
  "iPhone 14 Pro Max",
  "iPhone 14",
  "iPhone 13",
  "iPhone 11",
];

const POPULAR_OTHER_PHONE_BRANDS = [
  "Samsung",
  "Xiaomi",
  "Tecno",
  "Infinix",
  "Google",
  "Honor",
  "Huawei",
];

const AVAILABLE_SIM_TYPES = [
  { id: "sim_and_esim", label: "1 e-sim+1 sim physique" },
  { id: "dual_sim_physical", label: "double sim physique" },
  { id: "esim_only", label: "e-sim" },
];

interface SimCapacityItem {
  id: string;
  capacity: string;
  price: string;
  colors: string[];
}

interface SimConfigBlock {
  simId: string;
  simLabel: string;
  capacities: SimCapacityItem[];
}

interface AdminProduct {
  id: string | number;
  name: string;
  slug?: string;
  category: string;
  price: number;
  salePrice?: number | null;
  shortDesc?: string;
  desc?: string;
  image: string;
  brand?: string;
  rating?: number;
  colors?: string[];
  images?: string[];
  storageOptions?: StorageOption[];
  simPricing?: Record<string, { enabled: boolean; delta: number; label: string }>;
  variants?: AppleVariant[];
  otherFeatures?: string[];
  specs?: Record<string, any>;
  stock?: number;
  stockStatus?: "en_stock" | "bientot_disponible" | string;
  isComingSoon?: boolean;
  inStock?: boolean;
  condition?: "neuf" | "occasion" | "reconditionne" | string;
  warranty?: string;
  accessories?: string;
  ram?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface OrderItem {
  productId: string | number;
  name: string;
  unitPrice: number;
  quantity: number;
  selectedCapacity?: string | null;
  selectedColor?: string | null;
  image?: string;
}

interface OrderRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    name: string;
    phone: string;
    deliveryMethod: "delivery" | "pickup";
    city?: string;
    neighborhood?: string;
    notes?: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    total: number;
    currency: string;
  };
  payment: {
    method: "orange_money" | "wave" | "store_pickup";
    expectedAmount: number;
    merchantNumber?: string;
    status: "en_attente" | "confirme" | "echoue" | "rembourse";
    confirmedAt?: string | null;
    confirmedBy?: string | null;
    transactionRef?: string | null;
  };
  orderStatus: "en_attente_paiement" | "paye_en_preparation" | "en_livraison" | "livre" | "annule";
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    updatedBy: string;
    note?: string;
  }>;
  internalTracking?: {
    imei?: string;
    serialNumber?: string;
    internalNote?: string;
    updatedBy?: string;
    updatedAt?: string;
  };
}

function generateProductId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `p-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `p-${Date.now()}`;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [adminToken, setAdminToken] = useState("");

  // Navigation onglets : 'orders' | 'products'
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");

  // Données des commandes
  const [ordersList, setOrdersList] = useState<OrderRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Formulaire de confirmation manuelle de paiement
  const [verifierName, setVerifierName] = useState("Prince CFA Admin");
  const [confirmTxRef, setConfirmTxRef] = useState("");
  const [confirmNote, setConfirmNote] = useState("");
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // Suivi interne sécurisé (IMEI / Série) pour la commande sélectionnée
  const [imeiInput, setImeiInput] = useState("");
  const [serialInput, setSerialInput] = useState("");
  const [trackingNoteInput, setTrackingNoteInput] = useState("");

  // Données des produits
  const [productsList, setProductsList] = useState<AdminProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [isCloud, setIsCloud] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  
  // Recherche et filtrage du catalogue produits
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  
  // Données dynamiques des produits selon la catégorie
  const [formCategory, setFormCategory] = useState<string>("phones");

  interface CommonFormData {
    name: string;
    brand: string;
    price: string;
    salePrice: string;
    shortDesc?: string;
    desc: string;
    colors: string;
    stock: string;
    stockStatus: "en_stock" | "bientot_disponible";
    condition: string;
    warranty: string;
    accessories: string;
    imageBg?: string;
  }

  const [commonFormData, setCommonFormData] = useState<CommonFormData>({
    name: "",
    brand: "",
    price: "",
    salePrice: "",
    shortDesc: "",
    desc: "",
    colors: "",
    stock: "99",
    stockStatus: "en_stock",
    condition: "neuf",
    warranty: "Garantie 12 Mois Certifiée",
    accessories: "",
    imageBg: "white",
  });
  const [formSpecs, setFormSpecs] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalViewMode, setModalViewMode] = useState<"form" | "preview">("form");
  const [categorySwitchPending, setCategorySwitchPending] = useState<{ from: string; to: string } | null>(null);

  // Variantes dynamiques et caractéristiques pour iPhones (CAS 1)
  const [appleVariants, setAppleVariants] = useState<AppleVariant[]>([]);
  // Configuration hiérarchique : SIM -> Capacité -> Prix -> Couleurs (Souhait client)
  const [simBlocks, setSimBlocks] = useState<SimConfigBlock[]>([
    {
      simId: "sim_and_esim",
      simLabel: "1 e-sim+1 sim physique",
      capacities: [
        {
          id: "cap-128",
          capacity: "128 Go",
          price: "750000",
          colors: ["Titane Naturel", "Titane Noir", "Titane Blanc"],
        },
        {
          id: "cap-256",
          capacity: "256 Go",
          price: "820000",
          colors: ["Titane Naturel", "Titane Noir", "Titane Blanc", "Titane Désert"],
        },
      ],
    },
  ]);
  const [selectedSims, setSelectedSims] = useState<string[]>(["sim_and_esim", "dual_sim_physical", "esim_only"]);
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>(["128 Go", "256 Go", "512 Go", "1 To"]);
  const [selectedColors, setSelectedColors] = useState<string[]>(["Titane Naturel", "Titane Noir", "Titane Blanc"]);
  const [otherFeatures, setOtherFeatures] = useState<string[]>([
    "Écran Super Retina XDR OLED 120Hz",
    "Châssis en Titane aérospatial",
    "Face ID biométrique sécurisé",
    "Recharge sans fil MagSafe 15W"
  ]);
  const [customFeatureInput, setCustomFeatureInput] = useState<string>("");
  const [bulkSimFilter, setBulkSimFilter] = useState<string>("all");
  const [bulkStorageFilter, setBulkStorageFilter] = useState<string>("all");
  const [bulkAdjustAmount, setBulkAdjustAmount] = useState<string>("");
  const [showVariantsTable, setShowVariantsTable] = useState<boolean>(false);

  // Gestion dynamique des options de stockage (cases successives) et des photos multiples
  const [storageItems, setStorageItems] = useState<StorageEntry[]>([]);
  // Déclinaisons de Stockage & RAM avec prix spécifiques pour smartphones Android
  const [androidVariants, setAndroidVariants] = useState<AndroidPhoneVariant[]>([
    { id: "var-android-1", storage: "128 Go", ram: 8, price: "" }
  ]);
  const [imageList, setImageList] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isCompressingImages, setIsCompressingImages] = useState(false);

  // Configuration professionnelle des variantes SIM pour téléphones (notamment iPhones)
  const DEFAULT_SIM_PRICING: Record<string, { enabled: boolean; delta: number; label: string }> = {
    sim_and_esim: { enabled: true, delta: 0, label: "1 e-sim+1 sim physique" },
    dual_sim_physical: { enabled: true, delta: 30000, label: "double sim physique" },
    esim_only: { enabled: true, delta: -20000, label: "e-sim" },
  };

  const [simPricing, setSimPricing] = useState<Record<string, { enabled: boolean; delta: number; label: string }>>(DEFAULT_SIM_PRICING);

  // Basculer l'état ou le delta d'un type de SIM
  const handleUpdateSimType = (key: string, updates: Partial<{ enabled: boolean; delta: number; label: string }>) => {
    setSimPricing(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...updates
      }
    }));
  };

  // Basculer la présence d'une couleur officielle Apple dans la liste
  const toggleOfficialColor = (colorName: string) => {
    const current = commonFormData.colors
      ? commonFormData.colors.split(",").map(c => c.trim()).filter(Boolean)
      : [];
    const exists = current.some(c => c.toLowerCase() === colorName.toLowerCase());
    let next: string[];
    if (exists) {
      next = current.filter(c => c.toLowerCase() !== colorName.toLowerCase());
    } else {
      next = [...current, colorName];
    }
    setCommonFormData(prev => ({ ...prev, colors: next.join(", ") }));
  };

  // Gestionnaire de changement de marque avec nettoyage strict des données (Transition Apple vs Autres)
  const handleBrandChange = (newBrand: string) => {
    const wasApple = isAppleBrand(commonFormData.brand);
    const isNowApple = isAppleBrand(newBrand);

    if (wasApple && !isNowApple) {
      // Transition Apple -> Autres marques : Nettoyage strict
      setCommonFormData(prev => ({
        ...prev,
        brand: newBrand,
        shortDesc: "", // Suppression de la description courte
      }));
      setOtherFeatures([]); // Suppression des tags Apple
      setAppleVariants([]); // Suppression de la matrice croisée
      setStorageItems([]);
      setSimPricing(DEFAULT_SIM_PRICING);
      setAndroidVariants(prev => prev.length > 0 ? prev : [
        { id: "var-android-1", storage: "128 Go", ram: 8, price: commonFormData.price || "" }
      ]);
      // Nettoyer formSpecs pour ne conserver QUE le stockage et la RAM
      setFormSpecs(prev => ({
        storage: prev.storage || "128 Go",
        ram: prev.ram || "8",
      }));
    } else if (!wasApple && isNowApple) {
      // Transition Autres -> Apple : Nettoyage strict
      setCommonFormData(prev => ({
        ...prev,
        brand: newBrand,
      }));
      // Supprimer la RAM non applicable sur fiche Apple
      setFormSpecs(prev => {
        const copy = { ...prev };
        delete copy.ram;
        return copy;
      });
      // Initialiser les tags par défaut si vides
      if (otherFeatures.length === 0) {
        setOtherFeatures([
          "Écran Super Retina XDR OLED 120Hz",
          "Châssis en Titane aérospatial",
          "Face ID biométrique sécurisé",
          "Recharge sans fil MagSafe 15W"
        ]);
      }
    } else {
      setCommonFormData(prev => ({ ...prev, brand: newBrand }));
    }
  };

  // Basculer l'inclusion d'un type de SIM pour Apple
  const toggleSimSelection = (simId: string) => {
    setSelectedSims(prev => {
      const exists = prev.includes(simId);
      if (exists) {
        if (prev.length <= 1) return prev; // Au moins 1 type de SIM conservé
        return prev.filter(s => s !== simId);
      } else {
        return [...prev, simId];
      }
    });
  };

  // Basculer l'inclusion d'une capacité de stockage pour Apple
  const toggleCapacitySelection = (capacity: string) => {
    setSelectedCapacities(prev => {
      const exists = prev.includes(capacity);
      if (exists) {
        if (prev.length <= 1) return prev; // Au moins 1 capacité requise
        return prev.filter(c => c !== capacity);
      } else {
        return [...prev, capacity];
      }
    });
  };

  // Basculer l'inclusion d'une couleur pour Apple
  const toggleAppleColorSelection = (colorName: string) => {
    setSelectedColors(prev => {
      const exists = prev.some(c => c.toLowerCase() === colorName.toLowerCase());
      let next: string[];
      if (exists) {
        if (prev.length <= 1) return prev;
        next = prev.filter(c => c.toLowerCase() !== colorName.toLowerCase());
      } else {
        next = [...prev, colorName];
      }
      setCommonFormData(p => ({ ...p, colors: next.join(", ") }));
      return next;
    });
  };

  // Générer la matrice croisée des variantes Apple (Type de SIM x Capacité x Couleur)
  const generateAppleVariants = () => {
    const basePrice = Number(commonFormData.price) || 0;
    const newVariants: AppleVariant[] = [];

    const simConfigMap: Record<string, { label: string; delta: number }> = {
      sim_and_esim: { label: "1 e-sim+1 sim physique", delta: 0 },
      dual_sim_physical: { label: "double sim physique", delta: 30000 },
      esim_only: { label: "e-sim", delta: -20000 },
    };

    const storageDeltaMap: Record<string, number> = {
      "64 Go": -40000,
      "128 Go": 0,
      "256 Go": 60000,
      "512 Go": 140000,
      "1 To": 240000,
      "2 To": 360000,
    };

    // Conserver les prix manuellement personnalisés par l'administrateur
    const existingPriceMap = new Map<string, number>();
    for (const v of appleVariants) {
      existingPriceMap.set(v.id, v.price);
    }

    for (const simId of selectedSims) {
      const simInfo = simConfigMap[simId] || { label: simId, delta: 0 };
      for (const cap of selectedCapacities) {
        const storageDelta = storageDeltaMap[cap] !== undefined ? storageDeltaMap[cap] : 0;
        for (const col of selectedColors) {
          const id = `${simId}-${cap.replace(/\s+/g, "_")}-${col.replace(/\s+/g, "_")}`;
          const existingPrice = existingPriceMap.get(id);
          const calculatedPrice = Math.max(0, basePrice + simInfo.delta + storageDelta);
          const finalPrice = existingPrice !== undefined ? existingPrice : calculatedPrice;

          newVariants.push({
            id,
            simType: simInfo.label,
            simTypeId: simId,
            storage: cap,
            color: col,
            price: finalPrice,
            active: true,
          });
        }
      }
    }

    setAppleVariants(newVariants);
  };

  // Mettre à jour le prix spécifique d'une variante
  const handleUpdateVariantPrice = (id: string, newPrice: number) => {
    setAppleVariants(prev => prev.map(v => v.id === id ? { ...v, price: Math.max(0, newPrice) } : v));
  };

  // Supprimer / désactiver une combinaison
  const handleRemoveVariant = (id: string) => {
    setAppleVariants(prev => prev.filter(v => v.id !== id));
  };

  // Ajustement en masse des variantes
  const handleApplyBulkAdjustment = () => {
    const amount = Number(bulkAdjustAmount);
    if (!amount || isNaN(amount)) return;

    setAppleVariants(prev => prev.map(v => {
      const matchSim = bulkSimFilter === "all" || v.simTypeId === bulkSimFilter || v.simType === bulkSimFilter;
      const matchStorage = bulkStorageFilter === "all" || v.storage === bulkStorageFilter;
      if (matchSim && matchStorage) {
        return { ...v, price: Math.max(0, v.price + amount) };
      }
      return v;
    }));
    setBulkAdjustAmount("");
  };

  // Basculer un tag de caractéristique prédéfinie
  const toggleOtherFeature = (feature: string) => {
    setOtherFeatures(prev => {
      if (prev.includes(feature)) {
        return prev.filter(f => f !== feature);
      } else {
        return [...prev, feature];
      }
    });
  };

  // Ajouter un tag personnalisé
  const handleAddCustomFeature = () => {
    const trimmed = customFeatureInput.trim();
    if (!trimmed) return;
    if (!otherFeatures.includes(trimmed)) {
      setOtherFeatures(prev => [...prev, trimmed]);
    }
    setCustomFeatureInput("");
  };

  // Synchronisation automatique en temps réel des variantes Apple (aucun clic de génération requis)
  useEffect(() => {
    if (formCategory === "phones" && isAppleBrand(commonFormData.brand)) {
      if (selectedSims.length > 0 && selectedCapacities.length > 0 && selectedColors.length > 0) {
        generateAppleVariants();
      }
    }
  }, [commonFormData.price, selectedSims, selectedCapacities, selectedColors, formCategory, commonFormData.brand]);

  // =========================================================================
  // GESTIONNAIRES HIÉRARCHIQUES IPHONE : SIM -> CAPACITÉ -> PRIX -> COULEURS
  // =========================================================================

  // 1. Ajouter un nouveau type de SIM
  const handleAddSimType = (simId: string) => {
    const def = AVAILABLE_SIM_TYPES.find(s => s.id === simId);
    if (!def) return;
    if (simBlocks.some(b => b.simId === simId)) return;

    const firstBlock = simBlocks[0];
    let newCapacities: SimCapacityItem[] = [];

    if (firstBlock && firstBlock.capacities.length > 0) {
      newCapacities = firstBlock.capacities.map(c => ({
        id: `cap-${simId}-${c.capacity.replace(/\s+/g, '')}-${Date.now()}`,
        capacity: c.capacity,
        price: c.price,
        colors: [...c.colors],
      }));
    } else {
      newCapacities = [
        {
          id: `cap-${simId}-256-${Date.now()}`,
          capacity: "256 Go",
          price: commonFormData.price || "850000",
          colors: ["Titane Naturel", "Titane Noir", "Titane Blanc"],
        },
      ];
    }

    setSimBlocks(prev => [...prev, {
      simId: def.id,
      simLabel: def.label,
      capacities: newCapacities,
    }]);
  };

  // 2. Supprimer un type de SIM
  const handleRemoveSimType = (simId: string) => {
    if (simBlocks.length <= 1) {
      alert("Vous devez conserver au moins un type de SIM pour cet iPhone.");
      return;
    }
    setSimBlocks(prev => prev.filter(b => b.simId !== simId));
  };

  // 3. Ajouter une capacité sous un type de SIM spécifique
  const handleAddCapacityToSim = (simId: string, capacity: string, defaultPrice?: string) => {
    setSimBlocks(prev => prev.map(b => {
      if (b.simId !== simId) return b;
      if (b.capacities.some(c => c.capacity.toLowerCase() === capacity.toLowerCase())) return b;

      let suggestedPrice = defaultPrice;
      if (!suggestedPrice) {
        const last = b.capacities[b.capacities.length - 1];
        if (last && Number(last.price)) {
          suggestedPrice = String(Number(last.price) + 60000);
        } else {
          suggestedPrice = commonFormData.price || "750000";
        }
      }

      const newCap: SimCapacityItem = {
        id: `cap-${simId}-${capacity.replace(/\s+/g, '')}-${Date.now()}`,
        capacity,
        price: suggestedPrice,
        colors: b.capacities[0]?.colors?.length > 0 ? [...b.capacities[0].colors] : ["Titane Naturel", "Titane Noir"],
      };

      return {
        ...b,
        capacities: [...b.capacities, newCap],
      };
    }));
  };

  // 4. Supprimer une capacité sous un type de SIM
  const handleRemoveCapacityFromSim = (simId: string, capId: string) => {
    setSimBlocks(prev => prev.map(b => {
      if (b.simId !== simId) return b;
      if (b.capacities.length <= 1) {
        alert("Chaque type de SIM doit comporter au moins une capacité.");
        return b;
      }
      return {
        ...b,
        capacities: b.capacities.filter(c => c.id !== capId),
      };
    }));
  };

  // 5. Mettre à jour une capacité (prix ou libellé)
  const handleUpdateCapacityItem = (simId: string, capId: string, updates: Partial<SimCapacityItem>) => {
    setSimBlocks(prev => prev.map(b => {
      if (b.simId !== simId) return b;
      return {
        ...b,
        capacities: b.capacities.map(c => c.id === capId ? { ...c, ...updates } : c),
      };
    }));
  };

  // 6. Basculer une couleur pour une capacité spécifique
  const handleToggleColorForCapacity = (simId: string, capId: string, colorName: string) => {
    setSimBlocks(prev => prev.map(b => {
      if (b.simId !== simId) return b;
      return {
        ...b,
        capacities: b.capacities.map(c => {
          if (c.id !== capId) return c;
          const exists = c.colors.some(col => col.toLowerCase() === colorName.toLowerCase());
          let nextCols: string[];
          if (exists) {
            if (c.colors.length <= 1) return c;
            nextCols = c.colors.filter(col => col.toLowerCase() !== colorName.toLowerCase());
          } else {
            nextCols = [...c.colors, colorName];
          }
          return { ...c, colors: nextCols };
        }),
      };
    }));
  };

  // 7. Tout cocher / Décocher pour une capacité
  const handleSelectAllColorsForCapacity = (simId: string, capId: string) => {
    const all = IPHONE_OFFICIAL_COLORS.map(c => c.name);
    setSimBlocks(prev => prev.map(b => {
      if (b.simId !== simId) return b;
      return {
        ...b,
        capacities: b.capacities.map(c => c.id === capId ? { ...c, colors: all } : c),
      };
    }));
  };

  const handleDeselectAllColorsForCapacity = (simId: string, capId: string) => {
    setSimBlocks(prev => prev.map(b => {
      if (b.simId !== simId) return b;
      return {
        ...b,
        capacities: b.capacities.map(c => c.id === capId ? { ...c, colors: [c.colors[0] || "Titane Naturel"] } : c),
      };
    }));
  };

  // 8. Dupliquer les capacités d'un bloc SIM vers un autre
  const handleCopyCapacitiesFromSim = (sourceSimId: string, targetSimId: string) => {
    const sourceBlock = simBlocks.find(b => b.simId === sourceSimId);
    if (!sourceBlock) return;

    setSimBlocks(prev => prev.map(b => {
      if (b.simId !== targetSimId) return b;
      const copiedCapacities: SimCapacityItem[] = sourceBlock.capacities.map(c => ({
        id: `cap-${targetSimId}-${c.capacity.replace(/\s+/g, '')}-${Date.now()}`,
        capacity: c.capacity,
        price: c.price,
        colors: [...c.colors],
      }));
      return {
        ...b,
        capacities: copiedCapacities,
      };
    }));
  };

  // Synchronisation automatique de appleVariants et des couleurs depuis simBlocks
  useEffect(() => {
    if (formCategory === "phones" && isAppleBrand(commonFormData.brand) && simBlocks.length > 0) {
      const flattened: AppleVariant[] = [];
      const colorsSet = new Set<string>();
      const prices: number[] = [];

      simBlocks.forEach(b => {
        b.capacities.forEach(c => {
          const numPrice = Number(c.price) || Number(commonFormData.price) || 0;
          if (numPrice > 0) prices.push(numPrice);
          const cols = c.colors.length > 0 ? c.colors : ["Standard"];
          cols.forEach(col => {
            colorsSet.add(col);
            flattened.push({
              id: `${b.simId}-${c.capacity.replace(/\s+/g, "_")}-${col.replace(/\s+/g, "_")}`,
              simType: b.simLabel,
              simTypeId: b.simId,
              storage: c.capacity,
              color: col,
              price: numPrice,
              active: true,
            });
          });
        });
      });

      setAppleVariants(flattened);
      const allCols = Array.from(colorsSet);
      if (allCols.length > 0 && !commonFormData.colors) {
        setCommonFormData(p => ({ ...p, colors: allCols.join(", ") }));
      }
      if (prices.length > 0 && (!commonFormData.price || Number(commonFormData.price) <= 0)) {
        setCommonFormData(p => ({ ...p, price: String(Math.min(...prices)) }));
      }
    }
  }, [simBlocks, formCategory, commonFormData.brand]);

  // Rendu modulaire du composant d'upload et de gestion des photos
  const renderPhotoUploader = (sectionTitle = "Photos du Produit (Multi-fichiers)") => (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4 text-gold" aria-hidden="true" />
            <span>{sectionTitle}</span>
          </label>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            La <strong className="text-white">première photo</strong> sera l&apos;image principale affichée dans la boutique.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold hover:bg-yellow-400 text-black text-xs font-extrabold uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all flex-shrink-0">
          <Upload className="w-4 h-4 text-black" aria-hidden="true" />
          <span>{isCompressingImages ? "Traitement..." : "Choisir des fichiers"}</span>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            disabled={isCompressingImages}
            onChange={handleMultipleImagesUpload}
            className="hidden" 
          />
        </label>
      </div>

      {imageList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {imageList.map((imgSrc, index) => (
            <div 
              key={index} 
              className={`relative group rounded-xl overflow-hidden border p-1 bg-black/60 transition-all ${
                index === 0 
                  ? "border-gold shadow-[0_0_15px_rgba(212,175,55,0.25)] ring-1 ring-gold/50" 
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <div className="aspect-square w-full rounded-lg bg-black/40 flex items-center justify-center overflow-hidden relative">
                <img 
                  src={imgSrc} 
                  alt={`Photo ${index + 1}`} 
                  className="w-full h-full object-contain"
                />
                
                <div className="absolute top-1.5 left-1.5 pointer-events-none">
                  {index === 0 ? (
                    <span className="px-2 py-0.5 rounded-md bg-gold text-black text-[10px] font-black uppercase tracking-wider shadow inline-flex items-center gap-1">
                      <Crown className="w-3 h-3" aria-hidden="true" />
                      <span>Principale</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-md bg-black/80 text-zinc-300 text-[10px] font-bold border border-white/10">
                      #{index + 1}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-red-600/80 hover:bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                  title="Supprimer cette image"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetMainImage(index)}
                  className="w-full mt-1.5 py-1 px-2 rounded-lg bg-white/5 hover:bg-gold hover:text-black text-[10px] text-zinc-300 font-bold tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                >
                  <Crown className="w-3 h-3" aria-hidden="true" />
                  <span>Définir comme 1ère</span>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-zinc-500 text-xs">
          Aucune photo sélectionnée. Cliquez sur <strong className="text-zinc-300">Choisir des fichiers</strong> ou ajoutez un lien ci-dessous.
        </div>
      )}

      {/* Ajout par URL */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
        <input 
          type="url" 
          value={newImageUrl} 
          onChange={e => setNewImageUrl(e.target.value)} 
          className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-gold/50 outline-none" 
          placeholder="Ou collez un lien URL d'image (https://...)" 
        />
        <button
          type="button"
          onClick={() => handleAddImageUrl(newImageUrl)}
          disabled={!newImageUrl.trim()}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors disabled:opacity-30 cursor-pointer"
        >
          + Ajouter URL
        </button>
      </div>
    </div>
  );

  // 1. Vérification ultra-rapide de session active à l'ouverture de la page (< 50ms)
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "Prince CFA Admin";
    }

    async function checkAuthSession() {
      const storedToken = typeof window !== "undefined" ? sessionStorage.getItem("prince_cfa_admin_token") : null;
      try {
        const res = await fetch("/api/admin/auth", {
          headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            const token = data.token || storedToken || "";
            setAdminToken(token);
            setIsAuthenticated(true);
            setIsCloud(true);
            if (token && typeof window !== "undefined") {
              sessionStorage.setItem("prince_cfa_admin_token", token);
            }
          }
        }
      } catch (err) {
        console.warn("Vérification session:", err);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuthSession();
  }, []);

  // 2. Charger les commandes et les produits UNIQUEMENT quand l'administrateur est authentifié
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadDashboardData() {
      // 1. Charger les commandes immédiatement (onglet par défaut de l'admin)
      try {
        const ordersRes = await fetch("/api/admin/orders", {
          headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (ordersData.orders) setOrdersList(ordersData.orders);
        }
      } catch (err) {
        console.warn("Erreur chargement commandes:", err);
      }

      // 2. Charger les produits via l'API serveur optimisée en mémoire vive (<2ms)
      try {
        const prodRes = await fetch("/api/products", { cache: "no-store" });
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.products && prodData.products.length > 0) {
            setProductsList(prodData.products);
            setIsCloud(true);
            try {
              localStorage.setItem("prince_cfa_products", JSON.stringify(prodData.products));
            } catch {}
            return;
          }
        }
      } catch (err) {
        console.warn("Erreur chargement produits serveur:", err);
      }

      // Repli hors-ligne si besoin
      try {
        const saved = localStorage.getItem("prince_cfa_products");
        if (saved) {
          setProductsList(JSON.parse(saved));
        } else {
          setProductsList(defaultProducts);
        }
      } catch {
        setProductsList(defaultProducts);
      }
    }

    loadDashboardData();
  }, [isAuthenticated, adminToken]);

  // Connexion sécurisée côté serveur
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Mot de passe incorrect.");
        return;
      }

      setAdminToken(data.token);
      setIsAuthenticated(true);
      setIsCloud(true);
      if (typeof window !== "undefined" && data.token) {
        sessionStorage.setItem("prince_cfa_admin_token", data.token);
      }
      
      // Recharger les commandes fraîches depuis l'API sécurisée
      try {
        const ordersRes = await fetch("/api/admin/orders", {
          headers: { Authorization: `Bearer ${data.token}` }
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (ordersData.orders) setOrdersList(ordersData.orders);
        }
      } catch (fetchErr) {
        console.warn("Erreur refresh commandes:", fetchErr);
      }

    } catch {
      setError("Erreur de connexion au serveur d'authentification.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // Ignorer
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("prince_cfa_admin_token");
    }
    setIsAuthenticated(false);
    setAdminToken("");
    setPassword("");
    setOrdersList([]);
    setSelectedOrder(null);
  };

  // Recharger manuellement les commandes via l'API sécurisée
  const refreshOrders = async () => {
    if (!adminToken) return;
    try {
      const ordersRes = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        if (data.orders) setOrdersList(data.orders);
      }
    } catch (e) {
      console.warn("Erreur rechargement commandes:", e);
    }
  };

  // Confirmation MANUELLE du paiement par l'administrateur
  const handleConfirmPayment = async (orderId: string) => {
    if (!verifierName.trim()) {
      alert("Veuillez renseigner le nom de l'agent vérificateur.");
      return;
    }

    setIsUpdatingOrder(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          action: "confirm_payment",
          confirmedBy: verifierName.trim(),
          transactionRef: confirmTxRef.trim(),
          note: confirmNote.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Erreur lors de la confirmation du paiement.");
        return;
      }

      setOrdersList(prev => prev.map(o => o.id === orderId ? data.order : o));
      setSelectedOrder(data.order);
      setConfirmTxRef("");
      setConfirmNote("");
      alert("Paiement vérifié et confirmé manuellement avec succès ! Le stock a été débité.");
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de la confirmation.");
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // Annuler la validation d'un paiement (Restitue automatiquement le stock en magasin)
  const handleCancelPaymentConfirmation = async (orderId: string) => {
    if (!confirm("Voulez-vous vraiment annuler la validation de ce paiement ?\n\n- Le statut repassera à 'En attente de paiement'.\n- Le stock réservé pour cette commande sera automatiquement RESTITUÉ en rayon.")) {
      return;
    }

    setIsUpdatingOrder(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          action: "cancel_payment_confirmation",
          adminUser: verifierName || "Admin Prince CFA"
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Erreur lors de l'annulation du paiement.");
        return;
      }

      setOrdersList(prev => prev.map(o => o.id === orderId ? data.order : o));
      setSelectedOrder(data.order);
      alert("Validation de paiement annulée. Le stock a été restitué avec succès en rayon !");
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de l'annulation.");
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // Supprimer définitivement une commande (ex: commande non payée, fausse commande)
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer DÉFINITIVEMENT la commande ${orderId} ?\n\nCette action est irréversible. Si du stock avait été débité, il sera automatiquement restitué.`)) {
      return;
    }

    setIsUpdatingOrder(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Erreur lors de la suppression de la commande.");
        return;
      }

      setOrdersList(prev => prev.filter(o => o.id !== orderId));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
      alert(`Commande ${orderId} supprimée définitivement avec succès.`);
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de la suppression.");
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // Mise à jour du statut d'acheminement de la commande
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdatingOrder(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          action: "update_status",
          newStatus,
          adminUser: verifierName || "Admin Prince CFA"
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Erreur de mise à jour du statut.");
        return;
      }

      setOrdersList(prev => prev.map(o => o.id === orderId ? data.order : o));
      setSelectedOrder(data.order);
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion.");
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // Notification 1-clic du client sur WhatsApp selon l'état de la commande
  const handleNotifyCustomerWhatsApp = (
    order: OrderRecord,
    type: "payment_confirmed" | "shipping" | "ready_pickup" | "delivered" | "custom" = "custom"
  ) => {
    if (!order.customer?.phone) {
      alert("Numéro de téléphone du client manquant.");
      return;
    }

    let cleanPhone = order.customer.phone.replace(/\D+/g, "");
    if (!cleanPhone.startsWith("226") && cleanPhone.length === 8) {
      cleanPhone = `226${cleanPhone}`;
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const trackingUrl = `${origin}/suivi?id=${encodeURIComponent(order.id)}&phone=${encodeURIComponent(order.customer.phone)}`;

    let message = "";
    if (type === "payment_confirmed") {
      message = `👑 *PRINCE CFA - PAIEMENT CONFIRMÉ*\n\n` +
        `Bonjour *${order.customer.name}*,\n` +
        `Nous vous confirmons la bonne réception de votre paiement de *${order.pricing?.total?.toLocaleString('fr-FR')} FCFA* pour votre commande *${order.id}*. ✅\n\n` +
        `Votre commande est désormais validée et en cours de préparation dans notre boutique !\n\n` +
        `📦 *Suivez votre commande en direct :*\n${trackingUrl}\n\n` +
        `Merci pour votre confiance !\n` +
        `_L'équipe PRINCE CFA Ouagadougou_`;
    } else if (type === "shipping") {
      message = `👑 *PRINCE CFA - COMMANDE EN COURS DE LIVRAISON*\n\n` +
        `Bonjour *${order.customer.name}*,\n` +
        `Votre commande *${order.id}* est actuellement *en cours de livraison* vers votre adresse (${order.customer.neighborhood ? `${order.customer.neighborhood}, ` : ""}${order.customer.city}) ! 🚚\n\n` +
        `Notre livreur prendra contact avec vous très rapidement au ${order.customer.phone}.\n\n` +
        `📦 *Suivi en temps réel :*\n${trackingUrl}\n\n` +
        `_PRINCE CFA Ouagadougou_`;
    } else if (type === "ready_pickup") {
      message = `👑 *PRINCE CFA - APPAREIL PRÊT EN BOUTIQUE*\n\n` +
        `Bonjour *${order.customer.name}*,\n` +
        `Votre commande *${order.id}* est prête et disponible dans notre boutique à Koulouba, Ouagadougou ! 🏬\n\n` +
        `Vous pouvez passer la récupérer dès maintenant avec votre référence.\n\n` +
        `📦 *Détails de votre commande :*\n${trackingUrl}\n\n` +
        `_L'équipe PRINCE CFA_`;
    } else if (type === "delivered") {
      message = `👑 *PRINCE CFA - COMMANDE LIVRÉE*\n\n` +
        `Bonjour *${order.customer.name}*,\n` +
        `Votre commande *${order.id}* a été livrée avec succès ! ✅\n\n` +
        `Toute l'équipe de PRINCE CFA vous remercie pour votre achat et votre confiance. Profitez bien de votre nouvel appareil !\n\n` +
        `👑 _PRINCE CFA - L'Excellence à Ouagadougou_`;
    } else {
      message = `👑 *PRINCE CFA* : Bonjour *${order.customer.name}*, nous vous contactons concernant votre commande *${order.id}*.\n\n📦 Lien de suivi : ${trackingUrl}`;
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  // Ouvrir les détails d'une commande et préremplir le suivi interne
  const openOrderDetails = (order: OrderRecord) => {
    setSelectedOrder(order);
    setImeiInput(order.internalTracking?.imei || "");
    setSerialInput(order.internalTracking?.serialNumber || "");
    setTrackingNoteInput(order.internalTracking?.internalNote || "");
  };

  // Mettre à jour le suivi interne sécurisé (IMEI / Série)
  const handleUpdateInternalTracking = async (orderId: string) => {
    setIsUpdatingOrder(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          action: "update_internal_tracking",
          imei: imeiInput.trim(),
          serialNumber: serialInput.trim(),
          internalNote: trackingNoteInput.trim(),
          adminUser: verifierName || "Admin Prince CFA"
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Erreur de mise à jour du suivi interne.");
        return;
      }

      setOrdersList(prev => prev.map(o => o.id === orderId ? data.order : o));
      setSelectedOrder(data.order);
      alert("Suivi interne SAV (IMEI & N° de série) enregistré avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur de communication.");
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // Synchroniser le catalogue vers Firestore via l'API serveur optimisée
  const handleSeedToCloud = async () => {
    setSyncStatus("Envoi des produits vers Firestore...");
    try {
      const catalogToSync = productsList.length > 0 ? productsList : defaultProducts;
      const res = await fetch("/api/admin/products/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: adminToken ? `Bearer ${adminToken}` : ""
        },
        body: JSON.stringify({ products: catalogToSync })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.products) {
          setProductsList(data.products);
          try {
            localStorage.setItem("prince_cfa_products", JSON.stringify(data.products));
          } catch {}
        }
        setSyncStatus(data.message || "Produits synchronisés avec Firebase !");
      } else {
        setSyncStatus(data.error || "Erreur de synchronisation");
      }
      setTimeout(() => setSyncStatus(null), 4000);
    } catch {
      setSyncStatus("Erreur de synchronisation");
      setTimeout(() => setSyncStatus(null), 3500);
    }
  };

  // Compression d'image via canvas pour conserver la fluidité et compatibilité Firebase/LocalStorage
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.78));
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = () => reject(new Error("Erreur de décodage de l'image"));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
      reader.readAsDataURL(file);
    });
  };

  // Upload de plusieurs fichiers en une seule sélection depuis l'explorateur (le 1er est l'image principale)
  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressingImages(true);
    try {
      const fileList = Array.from(files);
      const compressedUrls: string[] = [];

      for (const file of fileList) {
        const dataUrl = await compressImageFile(file);
        compressedUrls.push(dataUrl);
      }

      if (compressedUrls.length > 0) {
        setImageList(prev => [...compressedUrls, ...prev.filter(old => !compressedUrls.includes(old))]);
      }
    } catch (err) {
      console.error("Erreur lors du traitement des images :", err);
      alert("Une erreur est survenue lors du traitement des images.");
    } finally {
      setIsCompressingImages(false);
      e.target.value = "";
    }
  };

  // Mettre une photo en 1ère position (Image Principale)
  const handleSetMainImage = (index: number) => {
    if (index === 0 || index >= imageList.length) return;
    const updated = [...imageList];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    setImageList(updated);
  };

  // Supprimer une photo de la liste
  const handleRemoveImage = (index: number) => {
    const updated = imageList.filter((_, i) => i !== index);
    setImageList(updated);
  };

  // Ajouter une photo via lien URL
  const handleAddImageUrl = (urlToAdd: string) => {
    const trimmed = urlToAdd.trim();
    if (!trimmed) return;
    if (imageList.includes(trimmed)) {
      setNewImageUrl("");
      return;
    }
    setImageList(prev => [...prev, trimmed]);
    setNewImageUrl("");
  };

  // Gestion des cases de stockage successives
  const handleAddStorageItem = (capacity = "", price = "") => {
    setStorageItems(prev => [
      ...prev,
      { capacity, price: price || commonFormData.price || "" }
    ]);
  };

  const handleQuickAddStorage = (cap: string) => {
    if (storageItems.some(item => item.capacity.trim().toLowerCase() === cap.trim().toLowerCase())) {
      return;
    }
    setStorageItems(prev => [
      ...prev,
      { capacity: cap, price: commonFormData.price || "" }
    ]);
  };

  const handleUpdateStorageItem = (index: number, field: "capacity" | "price", val: string) => {
    setStorageItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: val } : item));
  };

  const handleRemoveStorageItem = (index: number) => {
    setStorageItems(prev => prev.filter((_, i) => i !== index));
  };

  // Gestion des déclinaisons Android (Stockage + RAM + Prix spécifique)
  const handleAddAndroidVariant = () => {
    const last = androidVariants[androidVariants.length - 1];
    const allStorages = ["64 Go", "128 Go", "256 Go", "512 Go", "1 To", "2 To"];
    const currentIdx = last ? allStorages.indexOf(last.storage) : 1;
    const nextStorage = (currentIdx !== -1 && currentIdx < allStorages.length - 1) 
      ? allStorages[currentIdx + 1] 
      : (last ? last.storage : "256 Go");
    const nextRam = last ? last.ram : 8;
    const nextPrice = last && Number(last.price) 
      ? String(Number(last.price) + 60000) 
      : (commonFormData.price || "");

    setAndroidVariants(prev => [
      ...prev,
      {
        id: `var-android-${Date.now()}`,
        storage: nextStorage,
        ram: nextRam,
        price: nextPrice
      }
    ]);
  };

  const handleUpdateAndroidVariant = (index: number, field: keyof AndroidPhoneVariant, value: any) => {
    setAndroidVariants(prev => {
      const updated = prev.map((item, i) => i === index ? { ...item, [field]: value } : item);
      if (index === 0 && field === "price") {
        setCommonFormData(p => ({ ...p, price: value }));
      }
      return updated;
    });
  };

  const handleRemoveAndroidVariant = (index: number) => {
    if (androidVariants.length <= 1) return;
    setAndroidVariants(prev => prev.filter((_, i) => i !== index));
  };

  // Génération automatique des 4 paliers standards pour smartphones
  const handleGenerateStandardTiers = () => {
    const base = Number(commonFormData.price) || 0;
    setStorageItems([
      { capacity: "128 Go", price: base > 0 ? String(base) : "" },
      { capacity: "256 Go", price: base > 0 ? String(base + 60000) : "" },
      { capacity: "512 Go", price: base > 0 ? String(base + 140000) : "" },
      { capacity: "1 To", price: base > 0 ? String(base + 240000) : "" },
    ]);
  };

  // Application du changement de catégorie avec gestion des variantes et suggestions
  const applyCategorySwitch = (newCategory: string, preserveCompatible = false) => {
    const newConfig = getCategoryConfig(newCategory);
    const oldConfig = getCategoryConfig(formCategory);

    if (preserveCompatible) {
      const targetFields = newConfig.fields.map(f => f.key);
      const filteredSpecs: Record<string, any> = {};
      for (const [k, v] of Object.entries(formSpecs)) {
        if (targetFields.includes(k)) {
          filteredSpecs[k] = v;
        }
      }
      setFormSpecs(filteredSpecs);
    } else {
      setFormSpecs({});
    }

    // Réinitialisation absolue des variantes de stockage si la nouvelle catégorie ne les supporte pas (ex: Motos)
    if (!newConfig.supportsStorageVariants) {
      setStorageItems([]);
    }

    // Si on est en création d'un nouveau produit, adapter les suggestions de marque, garantie et accessoires
    if (!editingId) {
      setCommonFormData(prev => {
        const wasOldCategoryBrand = oldConfig.popularBrands?.some(
          b => b.toLowerCase() === prev.brand.trim().toLowerCase()
        );
        return {
          ...prev,
          brand: wasOldCategoryBrand ? "" : prev.brand,
          warranty: newConfig.defaultWarranty || prev.warranty,
          accessories: prev.accessories && prev.accessories !== oldConfig.defaultAccessories
            ? prev.accessories
            : (newConfig.defaultAccessories || "")
        };
      });
    }

    setFormCategory(newCategory);
    setFormErrors({});
  };

  // Demande de changement de catégorie avec détection de spécifications existantes
  const handleCategoryChangeRequest = (newCategory: string) => {
    if (newCategory === formCategory) return;

    const hasExistingSpecs = Object.values(formSpecs).some(
      v => v !== undefined && v !== null && String(v).trim() !== ""
    );

    if (hasExistingSpecs) {
      setCategorySwitchPending({ from: formCategory, to: newCategory });
    } else {
      applyCategorySwitch(newCategory, false);
    }
  };

  // Confirmation du changement de catégorie (avec option de préservation compatible)
  const confirmCategorySwitch = (preserveCompatible: boolean) => {
    if (!categorySwitchPending) return;
    const targetCat = categorySwitchPending.to;
    applyCategorySwitch(targetCat, preserveCompatible);
    setCategorySwitchPending(null);
  };

  // Sauvegarder un produit (Ajout ou Édition avec validation serveur & client)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormErrors({});

    const parsedColors = commonFormData.colors 
      ? commonFormData.colors.split(",").map(c => c.trim()).filter(Boolean)
      : [];

    const mainImage = imageList.length > 0 ? imageList[0] : "https://placehold.co/600x600/121216/d4af37?text=NOUVEAU";
    const allImages = imageList.length > 0 ? imageList : [mainImage];

    const isApple = formCategory === "phones" && isAppleBrand(commonFormData.brand);
    const isOtherPhone = formCategory === "phones" && !isAppleBrand(commonFormData.brand);

    // Les options de stockage ne sont transmises QUE si la catégorie les autorise
    const parsedStorage: StorageOption[] = getCategoryConfig(formCategory).supportsStorageVariants
      ? storageItems
          .filter(item => item.capacity.trim() !== "")
          .map(item => ({
            capacity: item.capacity.trim(),
            price: Number(item.price) || Number(commonFormData.price) || 0
          }))
      : [];

    // Options de stockage et variantes : générées dynamiquement pour Apple depuis simBlocks
    let finalStorageOptions: StorageOption[] | undefined = undefined;
    let finalAppleVariants: AppleVariant[] = [];
    let finalSimPricing: Record<string, { enabled: boolean; delta: number; label: string }> | undefined = undefined;
    let allIPhoneColors: string[] = [];

    if (isApple) {
      const capsMap = new Map<string, number>();
      const colorsSet = new Set<string>();

      simBlocks.forEach(b => {
        b.capacities.forEach(c => {
          const capPrice = Number(c.price) || Number(commonFormData.price) || 0;
          if (!capsMap.has(c.capacity) || capPrice < capsMap.get(c.capacity)!) {
            capsMap.set(c.capacity, capPrice);
          }
          const cols = c.colors.length > 0 ? c.colors : ["Standard"];
          cols.forEach(col => {
            colorsSet.add(col);
            finalAppleVariants.push({
              id: `${b.simId}-${c.capacity.replace(/\s+/g, '_')}-${col.replace(/\s+/g, '_')}`,
              simType: b.simLabel,
              simTypeId: b.simId,
              storage: c.capacity,
              color: col,
              price: capPrice,
              active: true,
            });
          });
        });
      });

      finalStorageOptions = Array.from(capsMap.entries()).map(([capacity, price]) => ({
        capacity,
        price
      }));

      finalSimPricing = {};
      AVAILABLE_SIM_TYPES.forEach(def => {
        const isAct = simBlocks.some(b => b.simId === def.id);
        finalSimPricing![def.id] = {
          enabled: isAct,
          delta: 0,
          label: def.label
        };
      });

      allIPhoneColors = Array.from(colorsSet);
    } else if (isOtherPhone) {
      finalStorageOptions = androidVariants
        .filter(v => v.storage && v.storage.trim() !== "")
        .map(v => {
          const ramLabel = typeof v.ram === "number" ? `${v.ram} Go RAM` : (String(v.ram).includes("RAM") ? String(v.ram) : `${v.ram} Go RAM`);
          const fullLabel = `${v.storage} / ${ramLabel}`;
          return {
            capacity: fullLabel,
            storage: v.storage,
            ram: v.ram,
            price: Number(v.price) || Number(commonFormData.price) || 0
          };
        });

      // Synchroniser le prix de base si vide
      if (!commonFormData.price || Number(commonFormData.price) <= 0) {
        if (finalStorageOptions.length > 0) {
          commonFormData.price = String(finalStorageOptions[0].price);
        }
      }
    } else if (getCategoryConfig(formCategory).supportsStorageVariants) {
      finalStorageOptions = parsedStorage.length > 0 ? parsedStorage : undefined;
    }

    // Spécifications nettoyées selon le cas
    let finalSpecs = { ...formSpecs };
    if (isApple) {
      finalSpecs = {
        model: commonFormData.name,
        storage: (appleVariants[0]?.storage || selectedCapacities[0] || "128 Go")
      };
    } else if (isOtherPhone) {
      const primaryVariant = androidVariants[0];
      finalSpecs = {
        model: commonFormData.name,
        storage: primaryVariant ? primaryVariant.storage : (formSpecs.storage || "128 Go"),
        ram: primaryVariant ? (Number(primaryVariant.ram) || primaryVariant.ram) : (formSpecs.ram ? (Number(formSpecs.ram) || formSpecs.ram) : undefined)
      };
    }

    const rawPayload = {
      id: editingId || undefined,
      name: commonFormData.name,
      category: formCategory,
      brand: commonFormData.brand,
      salePrice: commonFormData.salePrice || null,
      shortDesc: isApple ? commonFormData.shortDesc : undefined,
      desc: commonFormData.desc,
      stock: commonFormData.stockStatus === "bientot_disponible" ? 0 : 99,
      stockStatus: commonFormData.stockStatus || "en_stock",
      inStock: commonFormData.stockStatus !== "bientot_disponible",
      isComingSoon: commonFormData.stockStatus === "bientot_disponible",
      condition: commonFormData.condition,
      warranty: commonFormData.warranty,
      accessories: commonFormData.accessories,
      price: isApple && finalAppleVariants.length > 0 && (!commonFormData.price || Number(commonFormData.price) <= 0)
        ? Math.min(...finalAppleVariants.map(v => v.price))
        : isOtherPhone && androidVariants.length > 0 && (!commonFormData.price || Number(commonFormData.price) <= 0)
        ? (Number(androidVariants[0].price) || Number(commonFormData.price) || 0)
        : commonFormData.price,
      colors: isApple && allIPhoneColors.length > 0 ? allIPhoneColors : parsedColors,
      image: mainImage,
      images: allImages,
      imageBg: commonFormData.imageBg || "white",
      storageOptions: finalStorageOptions && finalStorageOptions.length > 0 ? finalStorageOptions : undefined,
      simPricing: isApple ? finalSimPricing : undefined,
      variants: isApple && finalAppleVariants.length > 0 ? finalAppleVariants : undefined,
      otherFeatures: isApple && otherFeatures.length > 0 ? otherFeatures : undefined,
      specs: finalSpecs
    };

    // 1. Validation stricte selon les règles de la catégorie
    const validation = validateAndCleanProduct(rawPayload);
    if (!validation.valid || !validation.cleanedProduct) {
      setFormErrors(validation.errors);
      setIsSaving(false);
      setModalViewMode("form");
      alert("Certaines caractéristiques sont incomplètes ou invalides. Veuillez vérifier les champs signalés en rouge.");
      return;
    }

    const cleaned = validation.cleanedProduct;
    let savedProduct: AdminProduct = cleaned;

    // 2. Persistance : via API avec vérification token
    try {
      const url = editingId ? `/api/admin/products/${editingId}` : `/api/admin/products`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: adminToken ? `Bearer ${adminToken}` : ""
        },
        body: JSON.stringify(cleaned)
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.product) {
          savedProduct = resData.product;
        }
      }
    } catch (saveErr) {
      console.warn("Erreur sauvegarde API, enregistrement local", saveErr);
    }

    // 3. Mise à jour de la liste locale
    let updatedList: AdminProduct[];
    if (editingId) {
      updatedList = productsList.map(p => p.id === editingId ? savedProduct : p);
    } else {
      updatedList = [savedProduct, ...productsList];
    }

    setProductsList(updatedList);
    try {
      localStorage.setItem("prince_cfa_products", JSON.stringify(updatedList));
    } catch (e) {
      console.warn("Erreur LocalStorage", e);
    }

    setIsSaving(false);
    clearDraft();
    closeModal();
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      try {
        const res = await fetch(`/api/admin/products/${id}`, {
          method: "DELETE",
          headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.success) {
          alert(`Erreur lors de la suppression : ${data?.error || "Échec serveur"}`);
          return;
        }
      } catch (e) {
        console.error("Erreur suppression API", e);
        alert("Erreur de communication réseau lors de la suppression.");
        return;
      }
      const updatedList = productsList.filter(p => String(p.id) !== String(id));
      setProductsList(updatedList);
      try {
        localStorage.setItem("prince_cfa_products", JSON.stringify(updatedList));
      } catch (e) {
        console.warn("LocalStorage warning:", e);
      }
    }
  };

  // Basculer rapidement la disponibilité d'un produit en 1 clic (En stock ↔ Bientôt disponible)
  const handleQuickToggleAvailability = async (product: AdminProduct) => {
    const isCurrentlyComingSoon = (product as any).stockStatus === "bientot_disponible" || 
      (product as any).isComingSoon === true || 
      (product as any).inStock === false || 
      product.stock === 0;
    
    const nextStatus = isCurrentlyComingSoon ? "en_stock" : "bientot_disponible";
    const nextInStock = nextStatus === "en_stock";
    const nextStock = nextStatus === "en_stock" ? 99 : 0;

    // Mise à jour optimiste locale immédiate pour fluidité maximale
    const updatedList = productsList.map(p => {
      if (p.id !== product.id) return p;
      return {
        ...p,
        stockStatus: nextStatus,
        isComingSoon: !nextInStock,
        inStock: nextInStock,
        stock: nextStock
      };
    });
    setProductsList(updatedList);

    try {
      localStorage.setItem("prince_cfa_products", JSON.stringify(updatedList));
    } catch (e) {
      console.warn("LocalStorage warning:", e);
    }

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
        },
        body: JSON.stringify({
          stockStatus: nextStatus,
          isComingSoon: !nextInStock,
          inStock: nextInStock,
          stock: nextStock
        })
      });
      if (!res.ok) {
        console.warn("Avertissement serveur mise à jour disponibilité produit");
      }
    } catch (err) {
      console.warn("Erreur mise à jour disponibilité:", err);
    }
  };

  // Calcul si des informations ont commencé à être renseignées dans le formulaire
  const isFormDirty = Boolean(
    commonFormData.name.trim() ||
    commonFormData.brand.trim() ||
    commonFormData.price.trim() ||
    commonFormData.desc.trim() ||
    imageList.length > 0 ||
    storageItems.length > 0 ||
    androidVariants.some(v => v.price && v.price.trim() !== "") ||
    Object.values(formSpecs).some(v => v !== undefined && v !== null && String(v).trim() !== "")
  );

  // État indiquant si un brouillon précédent a été restauré
  const [draftRestored, setDraftRestored] = useState(false);

  // Sauvegarde automatique du brouillon en arrière-plan (mode création uniquement)
  useEffect(() => {
    if (!isModalOpen || editingId) return;

    if (isFormDirty) {
      try {
        const draftPayload = {
          formCategory,
          commonFormData,
          formSpecs,
          storageItems,
          androidVariants,
          simPricing,
          imageList,
          savedAt: Date.now()
        };
        localStorage.setItem("prince_cfa_product_draft", JSON.stringify(draftPayload));
      } catch (e) {
        console.warn("Erreur sauvegarde brouillon:", e);
      }
    }
  }, [isModalOpen, editingId, isFormDirty, formCategory, commonFormData, formSpecs, storageItems, androidVariants, simPricing, imageList]);

  // Nettoyage du brouillon une fois le produit sauvegardé ou si l'utilisateur annule explicitement
  const clearDraft = () => {
    try {
      localStorage.removeItem("prince_cfa_product_draft");
    } catch {}
    setDraftRestored(false);
  };

  // Verrouillage du scroll en arrière-plan lorsque le modal est ouvert (évite les défilements parasites sur mobile)
  useEffect(() => {
    if (isModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isModalOpen]);

  // Alerte si l'utilisateur quitte ou rafraîchit la page par mégarde avec un formulaire en cours
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isModalOpen && isFormDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isModalOpen, isFormDirty]);

  // Empêcher la soumission involontaire du formulaire lorsqu'on appuie sur Entrée sur clavier mobile
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  };

  const openModalForEdit = (product: AdminProduct) => {
    const normalized = normalizeProductSpecs(product);
    setEditingId(product.id);
    setFormCategory(product.category || "phones");
    setFormSpecs(normalized.specs ? { ...normalized.specs } : {});
    setFormErrors({});
    setModalViewMode("form");
    setCategorySwitchPending(null);
    setDraftRestored(false);

    let initialImages: string[] = [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      initialImages = [...product.images];
    } else if (product.image) {
      initialImages = [product.image];
    }
    if (product.image && !initialImages.includes(product.image)) {
      initialImages.unshift(product.image);
    }
    setImageList(initialImages);

    let initialStorage: StorageEntry[] = [];
    if (product.storageOptions && Array.isArray(product.storageOptions)) {
      initialStorage = product.storageOptions.map(o => ({
        capacity: o.capacity || "",
        price: o.price !== null && o.price !== undefined ? String(o.price) : String(product.price || "")
      }));
    }
    setStorageItems(initialStorage);
    setNewImageUrl("");

    if (product.simPricing && typeof product.simPricing === "object") {
      setSimPricing({
        sim_and_esim: product.simPricing.sim_and_esim ? { ...product.simPricing.sim_and_esim, label: "1 e-sim+1 sim physique" } : { enabled: true, delta: 0, label: "1 e-sim+1 sim physique" },
        dual_sim_physical: product.simPricing.dual_sim_physical ? { ...product.simPricing.dual_sim_physical, label: "double sim physique" } : { enabled: true, delta: 30000, label: "double sim physique" },
        esim_only: product.simPricing.esim_only ? { ...product.simPricing.esim_only, label: "e-sim" } : { enabled: true, delta: -20000, label: "e-sim" },
      });
    } else {
      setSimPricing(DEFAULT_SIM_PRICING);
    }

    const isApple = (product.category || "phones") === "phones" && isAppleBrand(product.brand);
    const prodVariants = (product as any).variants && Array.isArray((product as any).variants)
      ? (product as any).variants
      : [];
    setAppleVariants(prodVariants);

    const prodFeatures = (product as any).otherFeatures && Array.isArray((product as any).otherFeatures)
      ? (product as any).otherFeatures
      : (isApple ? [
          "Écran Super Retina XDR OLED 120Hz",
          "Châssis en Titane aérospatial",
          "Face ID biométrique sécurisé",
          "Recharge sans fil MagSafe 15W"
        ] : []);
    setOtherFeatures(prodFeatures);

    if (isApple) {
      if (prodVariants.length > 0) {
        const simGroupMap = new Map<string, { label: string; caps: Map<string, { price: number; colors: Set<string> }> }>();
        prodVariants.forEach((v: any) => {
          const simKey = v.simTypeId || (String(v.simType).includes("2") || String(v.simType).toLowerCase().includes("double") ? "dual_sim_physical" : String(v.simType).toLowerCase().includes("esim") && !String(v.simType).includes("physique") ? "esim_only" : "sim_and_esim");
          const simDef = AVAILABLE_SIM_TYPES.find(s => s.id === simKey);
          const simLabel = simDef ? simDef.label : (simKey === "dual_sim_physical" ? "double sim physique" : simKey === "esim_only" ? "e-sim" : "1 e-sim+1 sim physique");
          if (!simGroupMap.has(simKey)) {
            simGroupMap.set(simKey, { label: simLabel, caps: new Map() });
          }
          const group = simGroupMap.get(simKey)!;
          if (!group.caps.has(v.storage)) {
            group.caps.set(v.storage, { price: v.price, colors: new Set() });
          }
          group.caps.get(v.storage)!.colors.add(v.color);
        });

        const reconstructed: SimConfigBlock[] = [];
        simGroupMap.forEach((group, simKey) => {
          const caps: SimCapacityItem[] = [];
          group.caps.forEach((capData, capName) => {
            caps.push({
              id: `cap-${simKey}-${capName.replace(/\s+/g, '')}`,
              capacity: capName,
              price: String(capData.price),
              colors: Array.from(capData.colors),
            });
          });
          reconstructed.push({
            simId: simKey,
            simLabel: group.label,
            capacities: caps,
          });
        });
        setSimBlocks(reconstructed);

        const sims = Array.from(new Set(prodVariants.map((v: any) => v.simTypeId || v.simType))).filter(Boolean);
        const caps = Array.from(new Set(prodVariants.map((v: any) => v.storage))).filter(Boolean);
        const cols = Array.from(new Set(prodVariants.map((v: any) => v.color))).filter(Boolean);
        if (sims.length > 0) setSelectedSims(sims as string[]);
        if (caps.length > 0) setSelectedCapacities(caps as string[]);
        if (cols.length > 0) setSelectedColors(cols as string[]);
      } else {
        const initialCaps = initialStorage.length > 0
          ? initialStorage.map((s, idx) => ({
              id: `cap-legacy-${idx}`,
              capacity: s.capacity,
              price: s.price || String(product.price || "750000"),
              colors: product.colors && product.colors.length > 0 ? product.colors : ["Titane Naturel", "Titane Noir"],
            }))
          : [
              {
                id: "cap-128",
                capacity: "128 Go",
                price: String(product.price || "750000"),
                colors: product.colors && product.colors.length > 0 ? product.colors : ["Titane Naturel", "Titane Noir"],
              },
            ];
        setSimBlocks([
          {
            simId: "sim_and_esim",
            simLabel: "1 e-sim+1 sim physique",
            capacities: initialCaps,
          },
        ]);
        setSelectedSims(["sim_and_esim", "dual_sim_physical", "esim_only"]);
        const caps = initialStorage.map(s => s.capacity).filter(Boolean);
        setSelectedCapacities(caps.length > 0 ? caps : ["128 Go", "256 Go", "512 Go", "1 To"]);
        setSelectedColors(product.colors && product.colors.length > 0 ? product.colors : ["Titane Naturel", "Titane Noir"]);
      }
    } else {
      setSelectedSims(["sim_and_esim", "dual_sim_physical", "esim_only"]);
      setSelectedCapacities(["128 Go", "256 Go", "512 Go", "1 To"]);
      setSelectedColors(["Titane Naturel", "Titane Noir"]);

      const isOtherPhone = (product.category || "phones") === "phones" && !isAppleBrand(product.brand);
      if (isOtherPhone) {
        let loadedVariants: AndroidPhoneVariant[] = [];
        if (product.storageOptions && Array.isArray(product.storageOptions) && product.storageOptions.length > 0) {
          loadedVariants = product.storageOptions.map((opt: any, idx) => {
            let storageVal = opt.storage || "";
            let ramVal: any = opt.ram !== undefined ? opt.ram : "";

            if (!storageVal && opt.capacity) {
              if (opt.capacity.includes("/")) {
                const parts = opt.capacity.split("/").map((s: string) => s.trim());
                storageVal = parts[0];
                const ramPart = parts[1];
                const matchNum = ramPart?.match(/(\d+)/);
                ramVal = matchNum ? parseInt(matchNum[1], 10) : ramPart;
              } else {
                storageVal = opt.capacity;
              }
            }

            if (!storageVal) storageVal = normalized.specs?.storage || "128 Go";
            if (!ramVal) ramVal = normalized.specs?.ram || 8;

            return {
              id: `var-android-${idx}-${Date.now()}`,
              storage: storageVal,
              ram: typeof ramVal === "string" && !isNaN(Number(ramVal)) ? Number(ramVal) : ramVal,
              price: opt.price !== undefined && opt.price !== null ? String(opt.price) : String(product.price || "")
            };
          });
        }

        if (loadedVariants.length === 0) {
          loadedVariants = [{
            id: "var-android-1",
            storage: normalized.specs?.storage || "128 Go",
            ram: normalized.specs?.ram || 8,
            price: product.price ? String(product.price) : ""
          }];
        }

        setAndroidVariants(loadedVariants);
      } else {
        setAndroidVariants([
          { id: "var-android-1", storage: "128 Go", ram: 8, price: product.price ? String(product.price) : "" }
        ]);
      }
    }
    setCustomFeatureInput("");

    setCommonFormData({
      name: product.name || "",
      brand: product.brand || "",
      price: product.price ? product.price.toString() : "",
      salePrice: product.salePrice ? product.salePrice.toString() : "",
      shortDesc: (product as any).shortDesc || "",
      desc: product.desc || "",
      colors: product.colors ? product.colors.join(", ") : "",
      stock: (product.stock !== undefined ? product.stock : 99).toString(),
      stockStatus: ((product as any).stockStatus === "bientot_disponible" || (product as any).isComingSoon === true || (product as any).inStock === false || product.stock === 0)
        ? "bientot_disponible"
        : "en_stock",
      condition: (product.condition as any) || "neuf",
      warranty: product.warranty || "Garantie 12 Mois Certifiée",
      accessories: product.accessories || "",
      imageBg: (product as any).imageBg || "white",
    });

    setIsModalOpen(true);
  };

  // Fermeture définitive et réinitialisation de l'état
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setImageList([]);
    setStorageItems([]);
    setAppleVariants([]);
    setAndroidVariants([
      { id: "var-android-1", storage: "128 Go", ram: 8, price: "" }
    ]);
    setOtherFeatures([]);
    setCustomFeatureInput("");
    setSelectedSims(["sim_and_esim", "dual_sim_physical", "esim_only"]);
    setSelectedCapacities(["128 Go", "256 Go", "512 Go", "1 To"]);
    setSelectedColors(["Titane Naturel", "Titane Noir", "Titane Blanc"]);
    setNewImageUrl("");
    setFormCategory("phones");
    setFormSpecs({});
    setFormErrors({});
    setSimPricing(DEFAULT_SIM_PRICING);
    setModalViewMode("form");
    setShowVariantsTable(false);
    setCategorySwitchPending(null);
    setDraftRestored(false);
    setCommonFormData({
      name: "",
      brand: "",
      price: "",
      salePrice: "",
      shortDesc: "",
      desc: "",
      colors: "",
      stock: "99",
      stockStatus: "en_stock",
      condition: "neuf",
      warranty: "Garantie 12 Mois Certifiée",
      accessories: "",
      imageBg: "white",
    });
  };

  // Fermeture sécurisée : demande confirmation si des informations ont été saisies pour ne rien perdre
  const requestCloseModal = () => {
    if (isFormDirty) {
      const confirmLeave = window.confirm(
        "Vous avez commencé à remplir les informations de ce produit.\n\nVoulez-vous vraiment fermer le formulaire ? Les modifications non enregistrées seront perdues."
      );
      if (!confirmLeave) return;
    }
    clearDraft();
    closeModal();
  };

  const openModalForNew = () => {
    setEditingId(null);
    setFormErrors({});
    setModalViewMode("form");
    setCategorySwitchPending(null);
    setAppleVariants([]);
    setOtherFeatures([
      "Écran Super Retina XDR OLED 120Hz",
      "Puce A17 Pro (Gravure 3nm)",
      "Châssis en Titane aérospatial",
      "Face ID biométrique sécurisé",
      "Recharge sans fil MagSafe 15W"
    ]);
    setSelectedSims(["sim_and_esim", "dual_sim_physical", "esim_only"]);
    setSelectedCapacities(["128 Go", "256 Go", "512 Go", "1 To"]);
    setSelectedColors(["Titane Naturel", "Titane Noir", "Titane Blanc"]);
    setCustomFeatureInput("");

    // Vérifier si un brouillon sauvegardé existe
    let restored = false;
    try {
      const savedDraft = localStorage.getItem("prince_cfa_product_draft");
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        // Si le brouillon a moins de 48h et contient des données concrètes
        if (parsed && (Date.now() - (parsed.savedAt || 0) < 48 * 3600 * 1000)) {
          if (parsed.commonFormData && (parsed.commonFormData.name || parsed.commonFormData.price || (parsed.imageList && parsed.imageList.length > 0))) {
            setFormCategory(parsed.formCategory || "phones");
            setCommonFormData(parsed.commonFormData);
            setFormSpecs(parsed.formSpecs || {});
            setStorageItems(parsed.storageItems || []);
            if (parsed.androidVariants && Array.isArray(parsed.androidVariants)) {
              setAndroidVariants(parsed.androidVariants);
            } else {
              setAndroidVariants([{ id: "var-android-1", storage: "128 Go", ram: 8, price: parsed.commonFormData?.price || "" }]);
            }
            if (parsed.appleVariants && Array.isArray(parsed.appleVariants)) {
              setAppleVariants(parsed.appleVariants);
            }
            if (parsed.otherFeatures && Array.isArray(parsed.otherFeatures)) {
              setOtherFeatures(parsed.otherFeatures);
            }
            if (parsed.simPricing && typeof parsed.simPricing === "object") {
              setSimPricing(parsed.simPricing);
            } else {
              setSimPricing(DEFAULT_SIM_PRICING);
            }
            setImageList(parsed.imageList || []);
            setNewImageUrl("");
            setDraftRestored(true);
            restored = true;
          }
        }
      }
    } catch (e) {
      console.warn("Erreur lecture brouillon", e);
    }

    if (!restored) {
      setImageList([]);
      setStorageItems([]);
      setAppleVariants([]);
      setAndroidVariants([
        { id: "var-android-1", storage: "128 Go", ram: 8, price: "" }
      ]);
      setNewImageUrl("");
      setFormCategory("phones");
      setFormSpecs({});
      setSimPricing(DEFAULT_SIM_PRICING);
      setSimBlocks([
        {
          simId: "sim_and_esim",
          simLabel: "1 e-sim+1 sim physique",
          capacities: [
            {
              id: "cap-128",
              capacity: "128 Go",
              price: "750000",
              colors: ["Titane Naturel", "Titane Noir", "Titane Blanc"],
            },
            {
              id: "cap-256",
              capacity: "256 Go",
              price: "820000",
              colors: ["Titane Naturel", "Titane Noir", "Titane Blanc", "Titane Désert"],
            },
          ],
        },
      ]);
      setDraftRestored(false);
      const phoneConfig = getCategoryConfig("phones");
      setCommonFormData({
        name: "",
        brand: "Apple",
        price: "",
        salePrice: "",
        shortDesc: "",
        desc: "",
        colors: "Titane Naturel, Titane Noir, Titane Blanc",
        stock: "99",
        stockStatus: "en_stock",
        condition: "neuf",
        warranty: phoneConfig.defaultWarranty || "Garantie 12 Mois Certifiée",
        accessories: phoneConfig.defaultAccessories || "",
        imageBg: "white",
      });
    }

    setIsModalOpen(true);
  };

  // Filtrage des commandes
  const filteredOrders = ordersList.filter(o => {
    const q = orderSearchQuery.toLowerCase().trim();
    const matchQuery = !q || 
      o.id.toLowerCase().includes(q) || 
      (o.customer?.name || "").toLowerCase().includes(q) || 
      (o.customer?.phone || "").includes(q);

    const expired = isOrderExpired(o);
    let matchStatus = true;
    if (orderStatusFilter === "all") {
      matchStatus = true;
    } else if (orderStatusFilter === "expire") {
      matchStatus = expired;
    } else if (orderStatusFilter === "en_attente") {
      matchStatus = (o.payment?.status === "en_attente" || o.orderStatus === "en_attente_paiement") && !expired;
    } else {
      matchStatus = (o.orderStatus === orderStatusFilter || o.payment?.status === orderStatusFilter) && !expired;
    }

    return matchQuery && matchStatus;
  });

  // Filtrage des produits du catalogue
  const filteredProducts = productsList.filter((product) => {
    // Filtre par catégorie sélectionnée
    if (productCategoryFilter !== "all" && product.category !== productCategoryFilter) {
      return false;
    }
    // Filtre par mot-clé de recherche (insensible à la casse et accents simples)
    if (!productSearchQuery.trim()) return true;
    const q = productSearchQuery.toLowerCase().trim();
    const name = (product.name || "").toLowerCase();
    const brand = (product.brand || "").toLowerCase();
    const desc = (product.desc || "").toLowerCase();
    const id = String(product.id || "").toLowerCase();
    const categoryConfig = getCategoryConfig(product.category);
    const categoryLabel = (categoryConfig?.label || "").toLowerCase();

    return (
      name.includes(q) ||
      brand.includes(q) ||
      desc.includes(q) ||
      id.includes(q) ||
      categoryLabel.includes(q)
    );
  });

  // Statistiques
  const totalCatalogValue = productsList.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const totalProductsCount = productsList.length;
  const categoriesCount = new Set(productsList.map(p => p.category)).size;

  const totalOrdersCount = ordersList.length;
  const pendingPaymentsCount = ordersList.filter(o => o.payment?.status === "en_attente" && !isOrderExpired(o)).length;
  const expiredOrdersCount = ordersList.filter(o => isOrderExpired(o)).length;
  const confirmedPaymentsCount = ordersList.filter(o => o.payment?.status === "confirme").length;
  const totalCollectedRevenue = ordersList
    .filter(o => o.payment?.status === "confirme")
    .reduce((sum, o) => sum + (o.pricing?.total || 0), 0);

  // Écran de chargement ultra-rapide (<50ms) lors de la vérification initiale de session
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4 animate-pulse shadow-[0_0_25px_rgba(212,175,55,0.3)]">
          <Crown className="w-8 h-8 text-gold" aria-hidden="true" />
        </div>
        <p className="text-xs text-gold/80 font-bold uppercase tracking-widest animate-pulse">
          Accès Administration Sécurisé...
        </p>
      </div>
    );
  }

  // Vue Login si non authentifié
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-zinc-200/80 w-full max-w-md z-10 shadow-xl relative bg-white/90">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Crown className="w-8 h-8 text-gold" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-wider">PRINCE <span className="text-gold">ADMIN</span></h1>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-medium">Espace de gestion réservé</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1.5">
                Mot de passe administrateur
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe..."
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs text-center animate-in fade-in flex items-center justify-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-3.5 rounded-xl bg-gold hover:bg-yellow-500 text-black font-extrabold uppercase tracking-widest text-xs transition-all shadow-md cursor-pointer"
            >
              Accéder au panneau
            </button>
          </form>

          <Link href="/" className="block text-center text-xs text-zinc-500 hover:text-zinc-800 mt-6 transition-colors font-medium">
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 sm:p-8 relative">
      
      {/* Navbar Admin */}
      <nav className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-zinc-200/80 mb-6 z-10 flex-wrap gap-4 shadow-sm bg-white/90">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
            <Crown className="w-5 h-5 text-gold" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-widest">PRINCE <span className="text-gold">ADMIN</span></h1>
            <span className="text-xs text-emerald-600 font-semibold">● Connecté en Administrateur</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-700 text-xs sm:text-sm hover:text-zinc-900 hover:bg-zinc-200 transition-colors border border-zinc-200 font-medium">
            Boutique ↗
          </Link>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border border-red-500/30 bg-red-50 text-red-600 text-xs sm:text-sm hover:bg-red-500 hover:text-white transition-colors cursor-pointer font-medium"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Barre d'onglets principale */}
      <div className="flex items-center gap-2 mb-6 z-10 flex-wrap">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "orders"
              ? "bg-gold text-black shadow-md"
              : "bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200"
          }`}
        >
          <Package className="w-4 h-4" aria-hidden="true" />
          <span>Commandes & Paiements</span>
          {pendingPaymentsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse">
              {pendingPaymentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "products"
              ? "bg-gold text-black shadow-md"
              : "bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200"
          }`}
        >
          <Tag className="w-4 h-4" aria-hidden="true" />
          <span>Catalogue Produits</span>
          <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[10px] border border-zinc-200">
            {productsList.length}
          </span>
        </button>

        {activeTab === "orders" && (
          <button
            onClick={refreshOrders}
            className="ml-auto px-3 py-2 rounded-lg bg-white hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-200 shadow-sm"
            title="Rafraîchir les commandes"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Actualiser</span>
          </button>
        )}
      </div>

      {/* DASHBOARD STATS */}
      {activeTab === "orders" ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 z-10">
          <div className="glass-panel p-5 rounded-2xl border border-zinc-200/80 border-l-4 border-l-gold shadow-sm relative overflow-hidden bg-white/90">
            <h3 className="text-zinc-500 text-xs uppercase tracking-wider mb-1 font-semibold">Total Commandes</h3>
            <p className="text-2xl sm:text-3xl font-black text-zinc-900">{totalOrdersCount}</p>
            <span className="text-[11px] text-zinc-500 mt-1 inline-block font-medium">Toutes périodes</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-zinc-200/80 border-l-4 border-l-amber-500 shadow-sm relative overflow-hidden bg-white/90">
            <h3 className="text-amber-700 text-xs uppercase tracking-wider mb-1 font-semibold">En attente paiement</h3>
            <p className="text-2xl sm:text-3xl font-black text-amber-700">{pendingPaymentsCount}</p>
            <span className="text-[11px] text-zinc-500 mt-1 inline-block font-medium">Orange Money / Wave à vérifier</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-zinc-200/80 border-l-4 border-l-emerald-500 shadow-sm relative overflow-hidden bg-white/90">
            <h3 className="text-emerald-700 text-xs uppercase tracking-wider mb-1 font-semibold">Paiements Confirmés</h3>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700">{confirmedPaymentsCount}</p>
            <span className="text-[11px] text-emerald-700/80 mt-1 inline-block font-medium">Validés manuellement</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-zinc-200/80 border-l-4 border-l-gold shadow-sm relative overflow-hidden bg-white/90">
            <h3 className="text-gold text-xs uppercase tracking-wider mb-1 font-semibold">Chiffre Encaissé Réel</h3>
            <p className="text-2xl sm:text-3xl font-black text-zinc-900">{totalCollectedRevenue.toLocaleString('fr-FR')} <span className="text-gold text-lg">F</span></p>
            <span className="text-[11px] text-zinc-500 mt-1 inline-block font-medium">Fonds reçus et vérifiés</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 z-10">
          <div className="glass-panel p-6 rounded-2xl border border-zinc-200/80 border-l-4 border-l-gold shadow-sm relative overflow-hidden bg-white/90">
            <div className="absolute right-[-10px] top-[-10px] text-zinc-900 opacity-5 pointer-events-none">
              <Coins className="w-24 h-24" aria-hidden="true" />
            </div>
            <h3 className="text-zinc-500 text-sm uppercase tracking-wider mb-2 font-semibold">Valeur du Catalogue</h3>
            <p className="text-3xl font-black text-zinc-900">{totalCatalogValue.toLocaleString('fr-FR')} <span className="text-gold text-xl">FCFA</span></p>
            <span className="text-xs text-emerald-600 font-semibold mt-2 inline-block">Valeur marchande totale</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-zinc-200/80 shadow-sm relative overflow-hidden bg-white/90">
            <div className="absolute right-[-10px] top-[-10px] text-zinc-900 opacity-5 pointer-events-none">
              <Package className="w-24 h-24" aria-hidden="true" />
            </div>
            <h3 className="text-zinc-500 text-sm uppercase tracking-wider mb-2 font-semibold">Rayons Actifs</h3>
            <p className="text-3xl font-black text-zinc-900">{categoriesCount}</p>
            <span className="text-xs text-zinc-500 mt-2 inline-block font-medium">Catégories en ligne</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-zinc-200/80 shadow-sm relative overflow-hidden bg-white/90">
            <div className="absolute right-[-10px] top-[-10px] text-zinc-900 opacity-5 pointer-events-none">
              <ShoppingBag className="w-24 h-24" aria-hidden="true" />
            </div>
            <h3 className="text-zinc-500 text-sm uppercase tracking-wider mb-2 font-semibold">Produits en Stock</h3>
            <p className="text-3xl font-black text-zinc-900">{totalProductsCount}</p>
            <span className="text-xs text-gold font-bold mt-2 inline-block">Catalogue actif</span>
          </div>
        </div>
      )}

      {/* CONTENU ONGLETS */}

      {/* ONGLET 1 : GESTION DES COMMANDES */}
      {activeTab === "orders" && (
        <div className="glass-panel rounded-2xl border border-zinc-200/80 flex-1 z-10 overflow-hidden flex flex-col shadow-sm bg-white/90">
          
          {/* Barre de filtres et recherche */}
          <div className="p-4 sm:p-6 border-b border-zinc-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-wrap bg-zinc-50/50">
            <div className="flex-1 max-w-md">
              <input 
                type="text"
                value={orderSearchQuery}
                onChange={e => setOrderSearchQuery(e.target.value)}
                placeholder="Rechercher par N° commande, client ou téléphone..."
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gold shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-gold cursor-pointer shadow-sm font-medium"
              >
                <option value="all">Tous les statuts ({totalOrdersCount})</option>
                <option value="en_attente">Paiement en attente &lt; 48h ({pendingPaymentsCount})</option>
                <option value="expire">Commandes expirées &gt; 48h ({expiredOrdersCount})</option>
                <option value="confirme">Paiement confirmé ({confirmedPaymentsCount})</option>
                <option value="paye_en_preparation">En préparation</option>
                <option value="en_livraison">En livraison</option>
                <option value="livre">Livré</option>
                <option value="annule">Annulé</option>
              </select>
            </div>
          </div>

          {/* Tableau des Commandes */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-[11px] text-zinc-500 uppercase tracking-wider bg-zinc-50/80">
                  <th className="p-4">Réf. Commande</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Mode Réception</th>
                  <th className="p-4">Paiement</th>
                  <th className="p-4">Statut Paiement</th>
                  <th className="p-4">Statut Commande</th>
                  <th className="p-4">Montant</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80 text-xs text-zinc-700">
                {filteredOrders.map(order => {
                  const isPaid = order.payment?.status === "confirme";
                  const methodBadge = order.payment?.method === "wave" ? (
                    <span className="inline-flex items-center gap-1.5 text-cyan-700 font-medium">
                      <WaveIcon className="w-3.5 h-3.5" /> Wave
                    </span>
                  ) : order.payment?.method === "store_pickup" ? (
                    <span className="inline-flex items-center gap-1.5 text-gold font-medium">
                      <Store className="w-3.5 h-3.5 text-gold" aria-hidden="true" /> Boutique
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-orange-700 font-medium">
                      <OrangeMoneyIcon className="w-3.5 h-3.5" /> Orange Money
                    </span>
                  );

                  return (
                    <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-gold">{order.id}</td>
                      <td className="p-4 text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-zinc-900">{order.customer?.name}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">{order.customer?.phone}</div>
                      </td>
                      <td className="p-4">
                        {order.customer?.deliveryMethod === "delivery" ? (
                          <span className="text-zinc-600 inline-flex items-center gap-1.5 font-medium">
                            <Truck className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                            <span>{order.customer.city}</span>
                          </span>
                        ) : (
                          <span className="text-gold inline-flex items-center gap-1.5 font-medium">
                            <Store className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                            <span>Retrait en Boutique</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-semibold">{methodBadge}</td>
                      <td className="p-4">
                        {isPaid ? (
                          <div className="space-y-0.5">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold text-[10px] inline-flex items-center gap-1 w-fit">
                              <Check className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />
                              <span>Confirmé</span>
                            </span>
                            <div className="text-[10px] text-emerald-600 font-medium">Stock débité</div>
                          </div>
                        ) : isOrderExpired(order) ? (
                          <div className="space-y-0.5">
                            <span className="px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 font-bold text-[10px] inline-flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3 text-zinc-500" aria-hidden="true" />
                              <span>Non payée (&gt;48h)</span>
                            </span>
                            <div className="text-[10px] text-zinc-500 font-medium">Stock intact</div>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-700 font-bold text-[10px] inline-flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3 text-amber-600" aria-hidden="true" />
                              <span>En attente (&lt;48h)</span>
                            </span>
                            <div className="text-[10px] text-zinc-500 font-medium">Stock intact</div>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {isOrderExpired(order) ? (
                          <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11px] font-bold inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-500" aria-hidden="true" />
                            Expirée (&gt;48h)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px] font-medium">
                            {order.orderStatus}
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-black text-zinc-900 whitespace-nowrap">
                        {order.pricing?.total?.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openOrderDetails(order)}
                            className="px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold text-yellow-800 hover:text-black font-bold text-xs transition-all border border-gold/40 cursor-pointer whitespace-nowrap shadow-sm"
                          >
                            Détails & Validation
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order.id)}
                            title="Supprimer définitivement la commande"
                            aria-label="Supprimer la commande"
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-red-50 text-zinc-400 hover:text-red-600 border border-zinc-200 hover:border-red-200 text-xs transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-zinc-500 font-medium">
                      Aucune commande ne correspond aux critères.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DÉTAILS DE COMMANDE & VALIDATION MANUELLE */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          
          <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-zinc-200/80 w-full max-w-2xl z-10 max-h-[90vh] overflow-y-auto relative shadow-2xl bg-white">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-widest block font-semibold">Fiche Commande</span>
                <h3 className="text-xl font-black text-gold font-mono">{selectedOrder.id}</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                aria-label="Fermer la fiche commande"
                title="Fermer"
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer border border-zinc-200"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Coordonnées Client */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 mb-4 text-xs">
              <div>
                <span className="text-zinc-500 uppercase tracking-wider block text-[10px] font-semibold">Client</span>
                <span className="font-bold text-zinc-900 text-sm">{selectedOrder.customer.name}</span>
                <div className="text-zinc-500 font-mono mt-0.5">{selectedOrder.customer.phone}</div>
              </div>
              <div>
                <span className="text-zinc-500 uppercase tracking-wider block text-[10px] font-semibold">Mode de réception</span>
                <span className="font-bold text-zinc-900 inline-flex items-center gap-1.5">
                  {selectedOrder.customer.deliveryMethod === "delivery" ? (
                    <>
                      <Truck className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                      <span>Livraison à domicile</span>
                    </>
                  ) : (
                    <>
                      <Store className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                      <span>Retrait en Boutique</span>
                    </>
                  )}
                </span>
                {selectedOrder.customer.deliveryMethod === "delivery" && (
                  <div className="text-zinc-500 mt-0.5">{selectedOrder.customer.city} - {selectedOrder.customer.neighborhood}</div>
                )}
              </div>
              {selectedOrder.customer.notes && (
                <div className="col-span-2 pt-2 border-t border-zinc-200 text-zinc-600">
                  <span className="text-zinc-500 text-[10px] block font-semibold">Note client :</span>
                  &quot;{selectedOrder.customer.notes}&quot;
                </div>
              )}
            </div>

            {/* Articles de la commande (Snapshot figé) */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider block">Articles ({selectedOrder.items?.length})</span>
              <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50/50">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex-1">
                      <div className="font-bold text-zinc-900">{item.name}</div>
                      <div className="text-[11px] text-zinc-500">
                        {[item.selectedCapacity, item.selectedColor].filter(Boolean).join(" • ")}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-500">{item.quantity} × {item.unitPrice.toLocaleString('fr-FR')} F</span>
                      <div className="font-bold text-gold">{(item.quantity * item.unitPrice).toLocaleString('fr-FR')} FCFA</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Décomposition financière */}
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs mb-5">
              <div className="flex justify-between text-zinc-600">
                <span>Sous-total produits</span>
                <span className="font-medium text-zinc-800">{selectedOrder.pricing.subtotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Frais de réception</span>
                <span className="font-medium text-zinc-800">{selectedOrder.pricing.deliveryFee.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-sm">
                <span className="text-zinc-900">Total Commande</span>
                <span className="text-gold font-black">{selectedOrder.pricing.total.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            {/* SECTION VALIDATION DU PAIEMENT MANUEL */}
            <div className="p-4 rounded-2xl border border-gold/30 bg-gold/5 space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-gold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gold" aria-hidden="true" />
                  <span>Vérification Paiement {selectedOrder.payment.method.toUpperCase()}</span>
                </h4>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${selectedOrder.payment.status === "confirme" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"}`}>
                  {selectedOrder.payment.status === "confirme" ? "PAIEMENT CONFIRMÉ" : "PAIEMENT EN ATTENTE"}
                </span>
              </div>

              {selectedOrder.payment.status === "confirme" ? (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-300 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" aria-hidden="true" /><span>Confirmé par : <strong>{selectedOrder.payment.confirmedBy}</strong></span></div>
                    <span className="text-[10px] text-zinc-400">{new Date(selectedOrder.payment.confirmedAt || "").toLocaleString("fr-FR")}</span>
                  </div>
                  {selectedOrder.payment.transactionRef && (
                    <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" aria-hidden="true" /><span>Réf. Transaction : <span className="font-mono font-bold text-white">{selectedOrder.payment.transactionRef}</span></span></div>
                  )}

                  <div className="pt-2 border-t border-green-500/20 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleNotifyCustomerWhatsApp(selectedOrder, "payment_confirmed")}
                      className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-black" />
                      <span>Prévenir le client sur WhatsApp (Paiement Validé)</span>
                    </button>
                    <a
                      href={`/suivi?id=${encodeURIComponent(selectedOrder.id)}&phone=${encodeURIComponent(selectedOrder.customer.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Voir page de suivi client</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCancelPaymentConfirmation(selectedOrder.id)}
                      disabled={isUpdatingOrder}
                      className="py-2 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/30 text-red-300 hover:text-red-200 text-xs font-bold border border-red-500/30 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      title="Annule la validation et restitue immédiatement le stock en rayon"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
                      <span>Annuler le paiement (Restituer le stock)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-[11px] leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <strong>Vérification obligatoire :</strong> Connectez-vous sur votre terminal Orange Money ou Wave et assurez-vous de la réception effective de <strong>{selectedOrder.pricing.total.toLocaleString('fr-FR')} FCFA</strong> avant de cliquer.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-600 uppercase font-bold block mb-1">Nom / Matricule Admin</label>
                      <input 
                        type="text" 
                        value={verifierName} 
                        onChange={e => setVerifierName(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-lg p-2 text-zinc-900 text-xs shadow-sm focus:outline-none focus:border-gold"
                        placeholder="Ex: Moussa (Gérant)"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-600 uppercase font-bold block mb-1">Réf. SMS / Transaction</label>
                      <input 
                        type="text" 
                        value={confirmTxRef} 
                        onChange={e => setConfirmTxRef(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-lg p-2 text-zinc-900 text-xs shadow-sm focus:outline-none focus:border-gold"
                        placeholder="Ex: OM-883719"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-600 uppercase font-bold block mb-1">Note de vérification</label>
                    <input 
                      type="text" 
                      value={confirmNote} 
                      onChange={e => setConfirmNote(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg p-2 text-zinc-900 text-xs shadow-sm focus:outline-none focus:border-gold"
                      placeholder="Ex: Débit reçu et vérifié sur le compte officiel"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConfirmPayment(selectedOrder.id)}
                    disabled={isUpdatingOrder}
                    className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black font-extrabold uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                    <span>Confirmer la réception des fonds ({selectedOrder.pricing.total.toLocaleString('fr-FR')} F)</span>
                  </button>
                </div>
              )}
            </div>

            {/* CHANGEMENT D'ÉTAPE D'ACHEMINEMENT */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Changer le statut d&apos;acheminement</span>
                <span className="text-[10px] text-zinc-500">Statut actuel : <strong className="text-white">{selectedOrder.orderStatus}</strong></span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, "paye_en_preparation")}
                  className={`py-2 px-2 rounded-lg border font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 ${selectedOrder.orderStatus === "paye_en_preparation" ? "bg-white/20 border-white text-white" : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"}`}
                >
                  <Package className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>En préparation</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, "en_livraison")}
                  className={`py-2 px-2 rounded-lg border font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 ${selectedOrder.orderStatus === "en_livraison" ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"}`}
                >
                  <Truck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>En livraison</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, "livre")}
                  className={`py-2 px-2 rounded-lg border font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 ${selectedOrder.orderStatus === "livre" ? "bg-green-500/20 border-green-400 text-green-300" : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Livrée</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Voulez-vous annuler cette commande ? Les stocks réservés seront automatiquement restitués.")) {
                      handleUpdateOrderStatus(selectedOrder.id, "annule");
                    }
                  }}
                  className={`py-2 px-2 rounded-lg border font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 ${selectedOrder.orderStatus === "annule" ? "bg-red-500/20 border-red-500 text-red-400" : "bg-white/5 border-white/10 text-red-400 hover:bg-red-500/10"}`}
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Annuler</span>
                </button>
              </div>

              {/* Boutons d'envoi WhatsApp selon le statut */}
              <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span>Envoyer un message WhatsApp au client :</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleNotifyCustomerWhatsApp(selectedOrder, "shipping")}
                    className="py-1 px-2.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black text-emerald-300 text-[11px] font-bold border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Truck className="w-3 h-3" aria-hidden="true" />
                    <span>En livraison</span>
                  </button>
                  {selectedOrder.customer.deliveryMethod === "pickup" && (
                    <button
                      type="button"
                      onClick={() => handleNotifyCustomerWhatsApp(selectedOrder, "ready_pickup")}
                      className="py-1 px-2.5 rounded-lg bg-white/10 hover:bg-gold hover:text-black text-gold text-[11px] font-bold border border-gold/30 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Store className="w-3 h-3" aria-hidden="true" />
                      <span>Prêt en Boutique</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleNotifyCustomerWhatsApp(selectedOrder, "delivered")}
                    className="py-1 px-2.5 rounded-lg bg-white/10 hover:bg-green-500 hover:text-black text-green-300 text-[11px] font-bold border border-green-500/30 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />
                    <span>Livrée</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SUIVI INTERNE SÉCURISÉ (IMEI / N° DE SÉRIE / SAV) */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                  <span>Suivi Interne Sécurisé (IMEI / N° Série SAV)</span>
                </h4>
                <span className="text-[10px] text-zinc-500 font-medium">Non communiqué au client</span>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-50/70 border border-cyan-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-zinc-600 uppercase font-bold block mb-1">
                      Numéro IMEI de l&apos;Appareil (15 chiffres)
                    </label>
                    <input 
                      type="text" 
                      value={imeiInput} 
                      onChange={e => setImeiInput(e.target.value)} 
                      placeholder="Ex: 356789123456789" 
                      className="w-full bg-white border border-zinc-200 rounded-lg p-2 text-zinc-900 text-xs font-mono shadow-sm focus:outline-none focus:border-cyan-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-600 uppercase font-bold block mb-1">
                      Numéro de Série / Modèle Constructeur
                    </label>
                    <input 
                      type="text" 
                      value={serialInput} 
                      onChange={e => setSerialInput(e.target.value)} 
                      placeholder="Ex: F2LZG9J80D" 
                      className="w-full bg-white border border-zinc-200 rounded-lg p-2 text-zinc-900 text-xs font-mono shadow-sm focus:outline-none focus:border-cyan-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-600 uppercase font-bold block mb-1">
                    Notes Internes SAV & Garantie
                  </label>
                  <input 
                    type="text" 
                    value={trackingNoteInput} 
                    onChange={e => setTrackingNoteInput(e.target.value)} 
                    placeholder="Ex: Appareil testé OK, batterie à 100%, film protecteur posé" 
                    className="w-full bg-white border border-zinc-200 rounded-lg p-2 text-zinc-900 text-xs shadow-sm focus:outline-none focus:border-cyan-600"
                  />
                </div>

                {selectedOrder.internalTracking?.updatedAt && (
                  <div className="text-[10px] text-zinc-500">
                    Dernière saisie par {selectedOrder.internalTracking.updatedBy || "Admin"} le {new Date(selectedOrder.internalTracking.updatedAt).toLocaleString("fr-FR")}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleUpdateInternalTracking(selectedOrder.id)}
                  disabled={isUpdatingOrder}
                  className="w-full py-2.5 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-bold uppercase tracking-wider text-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" aria-hidden="true" />
                  <span>Enregistrer le suivi IMEI / Série interne</span>
                </button>
              </div>
            </div>

            {/* ZONE DE SUPPRESSION DÉFINITIVE DE COMMANDE */}
            <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-zinc-600">
                <span className="font-bold text-zinc-800 block">Commande sans paiement ou erronée ?</span>
                <span className="text-[11px] text-zinc-500">Supprime définitivement cette commande. Si du stock avait été débité, il sera automatiquement restitué.</span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                disabled={isUpdatingOrder}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold border border-red-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                <span>Supprimer cette commande</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ONGLET 2 : GESTION DU CATALOGUE PRODUITS */}
      {activeTab === "products" && (
        <div className="glass-panel rounded-2xl border border-zinc-200/80 flex-1 z-10 overflow-hidden flex flex-col shadow-sm bg-white/90">
          <div className="p-6 border-b border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50/50">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-widest">Gestion du Catalogue</h2>
              {isCloud ? (
                <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 font-medium flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Cloud Firebase Connecté
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs rounded-full bg-amber-50 border border-amber-300 text-amber-700 font-medium shadow-sm">
                  Mode Local
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {isCloud && (
                <button 
                  onClick={handleSeedToCloud}
                  className="px-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  title="Synchroniser tous les produits vers Firebase Firestore"
                >
                  <CloudUpload className="w-4 h-4 text-zinc-500" aria-hidden="true" />
                  <span>Envoyer vers Firebase</span>
                </button>
              )}

              <button 
                onClick={openModalForNew}
                className="px-4 py-2 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>+</span>
                <span>Ajouter Produit</span>
              </button>
            </div>
          </div>

          {syncStatus && (
            <div className="bg-gold/10 border-b border-gold/30 px-6 py-2 text-gold text-xs text-center font-medium animate-in fade-in flex items-center justify-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              <span>{syncStatus}</span>
            </div>
          )}

          {/* Barre de Recherche et Filtres Catalogue */}
          <div className="p-4 sm:px-6 bg-zinc-50/50 border-b border-zinc-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Champ de recherche texte */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                <input 
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, marque (Honda, Apple...), ID ou mot-clé..."
                  className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all shadow-sm"
                />
                {productSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setProductSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 rounded-md transition-colors cursor-pointer"
                    title="Effacer la recherche"
                    aria-label="Effacer la recherche"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filtre par catégorie */}
              <div className="relative min-w-[210px]">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-zinc-400">
                  <Filter className="w-3.5 h-3.5 mr-1 text-gold/80" aria-hidden="true" />
                </div>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs font-medium text-zinc-800 focus:outline-none focus:border-gold cursor-pointer appearance-none shadow-sm"
                  aria-label="Filtrer par catégorie"
                >
                  <option value="all" className="bg-white text-zinc-900">
                    Toutes les catégories ({productsList.length})
                  </option>
                  {CATEGORIES_LIST.map((cat) => {
                    const count = productsList.filter(p => p.category === cat.id).length;
                    return (
                      <option key={cat.id} value={cat.id} className="bg-white text-zinc-900">
                        {cat.label} ({count})
                      </option>
                    );
                  })}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Compteur et bouton de réinitialisation */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-zinc-500 pt-1 md:pt-0">
              <span className="font-medium whitespace-nowrap">
                <span className="text-gold font-bold">{filteredProducts.length}</span> sur {productsList.length} produit{productsList.length > 1 ? "s" : ""}
              </span>

              {(productSearchQuery || productCategoryFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setProductSearchQuery("");
                    setProductCategoryFilter("all");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 hover:text-zinc-900 transition-all text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-sm"
                  title="Réinitialiser les filtres"
                >
                  <X className="w-3 h-3" />
                  <span>Effacer filtres</span>
                </button>
              )}
            </div>
          </div>

          {/* Table des Produits */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-xs text-zinc-500 uppercase tracking-wider bg-zinc-50/80">
                  <th className="p-4">Produit</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Disponibilité</th>
                  <th className="p-4">Prix</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80 text-sm text-zinc-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-100 p-1 border border-zinc-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div>
                          <div className="text-zinc-900 font-bold text-sm flex items-center gap-2">
                            <span>{product.name}</span>
                            {product.brand && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 uppercase font-medium">
                                {product.brand}
                              </span>
                            )}
                          </div>
                          <div className="text-zinc-500 text-xs line-clamp-1 max-w-[280px]">
                            {product.desc}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-medium inline-flex items-center gap-1.5">
                        {getCategoryIcon(product.category, "w-3.5 h-3.5 text-gold")}
                        <span>{getCategoryConfig(product.category).label}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleQuickToggleAvailability(product)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
                          ((product as any).stockStatus === "bientot_disponible" || (product as any).isComingSoon || product.stock === 0)
                            ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 shadow-sm"
                            : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 shadow-sm"
                        }`}
                        title="Cliquer pour basculer : En stock ↔ Bientôt disponible"
                      >
                        {((product as any).stockStatus === "bientot_disponible" || (product as any).isComingSoon || product.stock === 0) ? (
                          <>
                            <span>⏳</span>
                            <span>Bientôt disponible</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>En stock</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 font-bold text-zinc-900">
                      {product.salePrice ? (
                        <div>
                          <span className="text-gold font-extrabold">{product.salePrice.toLocaleString('fr-FR')} FCFA</span>
                          <span className="block text-[11px] text-zinc-400 line-through">{product.price.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                      ) : (
                        <div>
                          {product.price.toLocaleString('fr-FR')} <span className="text-gold text-xs">FCFA</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModalForEdit(product)} 
                          className="p-2 rounded-lg bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition-colors cursor-pointer border border-zinc-200 shadow-sm" 
                          title="Modifier"
                          aria-label={`Modifier ${product.name}`}
                        >
                          <Pencil className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)} 
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer" 
                          title="Supprimer"
                          aria-label={`Supprimer ${product.name}`}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center">
                      <div className="max-w-md mx-auto flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                          <Search className="w-5 h-5 text-gold/70" />
                        </div>
                        <p className="text-sm font-semibold text-white">
                          {productsList.length === 0 
                            ? "Aucun produit dans le catalogue." 
                            : "Aucun produit ne correspond à vos critères."}
                        </p>
                        {productsList.length > 0 && (productSearchQuery || productCategoryFilter !== "all") && (
                          <div className="flex flex-col items-center gap-2">
                            <p className="text-xs text-zinc-400">
                              {productSearchQuery && (
                                <span>Recherche : &laquo; <strong className="text-white">{productSearchQuery}</strong> &raquo; </span>
                              )}
                              {productCategoryFilter !== "all" && (
                                <span>dans <strong className="text-gold">{getCategoryConfig(productCategoryFilter).label}</strong></span>
                              )}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setProductSearchQuery("");
                                setProductCategoryFilter("all");
                              }}
                              className="mt-1 px-3 py-1.5 rounded-xl bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-black transition-all text-xs font-semibold cursor-pointer"
                            >
                              Réinitialiser la recherche
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIALOGUE DE SÉCURITÉ AU CHANGEMENT DE CATÉGORIE */}
      {categorySwitchPending && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-amber-300 bg-white max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-700">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-900">Changement de catégorie</h4>
                <p className="text-[11px] text-zinc-500 font-medium">Confirmation obligatoire</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Vous êtes sur le point de passer de <strong className="text-zinc-900">{getCategoryConfig(categorySwitchPending.from).label}</strong> à <strong className="text-gold">{getCategoryConfig(categorySwitchPending.to).label}</strong>.
            </p>
            <p className="text-[11px] text-zinc-500 leading-normal">
              Des caractéristiques spécifiques sont déjà renseignées pour ce produit. Afin d&apos;éviter toute corruption de vos données, choisissez l&apos;action souhaitée :
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => confirmCategorySwitch(true)}
                className="w-full py-3 px-3.5 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-yellow-800 text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer group shadow-sm"
              >
                <span>Conserver les caractéristiques compatibles</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button
                type="button"
                onClick={() => confirmCategorySwitch(false)}
                className="w-full py-3 px-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer shadow-sm"
              >
                <span>Réinitialiser les caractéristiques spécifiques</span>
                <span>↺</span>
              </button>

              <button
                type="button"
                onClick={() => setCategorySwitchPending(null)}
                className="w-full py-2.5 px-3 rounded-xl bg-transparent hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 text-xs text-center transition-all cursor-pointer font-medium"
              >
                Annuler et rester sur {getCategoryConfig(categorySwitchPending.from).label}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AJOUT / MODIFICATION DYNAMIQUE PAR CATÉGORIE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 overflow-hidden">
          {/* Backdrop sécurisé avec assombrissement doux */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={requestCloseModal}
          ></div>
          
          <div className="glass-panel p-4 sm:p-8 rounded-none sm:rounded-3xl border-0 sm:border border-zinc-200 w-full h-full sm:h-auto sm:max-h-[92vh] max-w-4xl z-10 flex flex-col relative bg-white shadow-2xl">
            
            {/* Entête du Modal & Bascule Formulaire / Aperçu en direct */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                  {getCategoryIcon(formCategory, "w-5 h-5 text-gold")}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-zinc-900 uppercase tracking-wider">
                    {editingId ? "Modifier le produit" : "Ajouter un produit"}
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Catégorie active : <strong className="text-gold">{getCategoryConfig(formCategory).label}</strong>
                  </p>
                </div>
              </div>

              {/* Sélecteur de mode Formulaire / Aperçu */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setModalViewMode("form")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      modalViewMode === "form"
                        ? "bg-gold text-black shadow-sm"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Formulaire</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalViewMode("preview")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      modalViewMode === "preview"
                        ? "bg-gold text-black shadow-sm"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Aperçu en direct</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={requestCloseModal}
                  className="w-8 h-8 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer border border-zinc-200"
                  title="Fermer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Bannière d'information si un brouillon a été restauré */}
            {draftRestored && (
              <div className="px-3.5 py-2 mx-0 mt-3 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-between text-xs text-gold flex-shrink-0">
                <span className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Brouillon précédent restauré automatiquement.</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clearDraft();
                    const phoneConfig = getCategoryConfig("phones");
                    setFormCategory("phones");
                    setFormSpecs({});
                    setStorageItems([]);
                    setAppleVariants([]);
                    setOtherFeatures([]);
                    setCustomFeatureInput("");
                    setImageList([]);
                    setCommonFormData({
                      name: "",
                      brand: "",
                      price: "",
                      salePrice: "",
                      shortDesc: "",
                      desc: "",
                      colors: "",
                      stock: "99",
                      stockStatus: "en_stock",
                      condition: "neuf",
                      warranty: phoneConfig.defaultWarranty || "Garantie 12 Mois Certifiée",
                      accessories: phoneConfig.defaultAccessories || "",
                      imageBg: "white",
                    });
                  }}
                  className="underline text-[11px] font-bold text-zinc-300 hover:text-white cursor-pointer ml-3 flex-shrink-0"
                >
                  Recommencer à zéro
                </button>
              </div>
            )}

            {/* Contenu Défilant */}
            <div className="overflow-y-auto flex-1 py-4 sm:py-6 pr-1 space-y-6">

              {/* VUE 1 : APERÇU EN DIRECT (LIVE PREVIEW) */}
              {modalViewMode === "preview" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-gold/5 border border-gold/20 flex items-center gap-3 text-gold text-xs">
                    <Eye className="w-4 h-4 flex-shrink-0 text-gold" aria-hidden="true" />
                    <span>Voici comment votre produit sera affiché sur la boutique et dans la fiche détaillée du client.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl bg-black/60 border border-white/10">
                    {/* Colonne Gauche : Photos */}
                    <div className="space-y-3">
                      <div className="aspect-square w-full rounded-2xl bg-black/80 border border-white/10 flex items-center justify-center overflow-hidden p-4 relative">
                        <img 
                          src={imageList.length > 0 ? imageList[0] : "https://placehold.co/600x600/121216/d4af37?text=PRINCE+CFA"} 
                          alt="Aperçu" 
                          className="max-w-full max-h-full object-contain"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gold/90 text-black text-[10px] font-black uppercase tracking-wider">
                          {commonFormData.condition === "neuf" ? "Neuf scellé" : commonFormData.condition === "reconditionne" ? "Reconditionné A+" : "Occasion certifiée"}
                        </span>
                      </div>

                      {imageList.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {imageList.map((img, i) => (
                            <div key={i} className="w-14 h-14 rounded-lg bg-black/50 border border-white/10 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                              <img src={img} alt={`Thumb ${i+1}`} className="w-full h-full object-contain" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Colonne Droite : Fiche Technique */}
                    <div className="space-y-4">
                      <div>
                        {commonFormData.brand && (
                          <span className="text-xs font-bold text-gold uppercase tracking-wider">
                            {commonFormData.brand}
                          </span>
                        )}
                        <h4 className="text-xl font-black text-white mt-1">
                          {commonFormData.name || "Nom du produit"}
                        </h4>
                        <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                          <span>Catégorie : <strong>{getCategoryConfig(formCategory).label}</strong></span>
                          <span>•</span>
                          <span>Stock : <strong className={Number(commonFormData.stock) > 0 ? "text-green-400" : "text-red-400"}>{commonFormData.stock || 0} unité(s)</strong></span>
                        </div>
                      </div>

                      {/* Prix */}
                      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-baseline gap-3">
                        {commonFormData.salePrice ? (
                          <>
                            <span className="text-2xl font-black text-gold">
                              {Number(commonFormData.salePrice).toLocaleString("fr-FR")} FCFA
                            </span>
                            <span className="text-xs text-zinc-500 line-through">
                              {Number(commonFormData.price || 0).toLocaleString("fr-FR")} FCFA
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 text-[10px] font-bold">
                              PROMO
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-black text-gold">
                            {Number(commonFormData.price || 0).toLocaleString("fr-FR")} FCFA
                          </span>
                        )}
                      </div>

                      {/* Bloc Spécial Moto Électrique en aperçu */}
                      {formCategory === "mobility" && (
                        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                          <div className="flex items-center justify-between text-gold text-xs font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              <Zap className="w-4 h-4 text-gold" aria-hidden="true" />
                              <span>Performances Moto Électrique</span>
                            </span>
                            <span className="text-[10px] text-zinc-400">0% Carburant</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                            <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                              <span className="text-[9px] text-zinc-400 uppercase font-semibold block">Moteur</span>
                              <span className="text-sm font-black text-white">
                                {formSpecs.motorPower ? `${formSpecs.motorPower} W` : "—"}
                              </span>
                            </div>
                            <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                              <span className="text-[9px] text-zinc-400 uppercase font-semibold block">Autonomie</span>
                              <span className="text-sm font-black text-emerald-400">
                                {formSpecs.rangeKm ? `${formSpecs.rangeKm} km` : "—"}
                              </span>
                            </div>
                            <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                              <span className="text-[9px] text-zinc-400 uppercase font-semibold block">Vitesse Max</span>
                              <span className="text-sm font-black text-gold">
                                {formSpecs.maxSpeedKm ? `${formSpecs.maxSpeedKm} km/h` : "—"}
                              </span>
                            </div>
                            <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                              <span className="text-[9px] text-zinc-400 uppercase font-semibold block">Batterie</span>
                              <span className="text-sm font-black text-white">
                                {formSpecs.batteryCapacityWh ? `${formSpecs.batteryCapacityWh} Wh` : (formSpecs.batteryVoltage ? `${formSpecs.batteryVoltage}V` : "—")}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bloc Spécial Ordinateurs en aperçu */}
                      {formCategory === "computers" && (
                        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                          <div className="flex items-center justify-between text-blue-400 text-xs font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              <Laptop className="w-4 h-4 text-blue-400" aria-hidden="true" />
                              <span>Configuration Clé — Ordinateur</span>
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">{formSpecs.os || "OS"}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                            <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                              <span className="text-[9px] text-zinc-400 uppercase font-semibold block">CPU</span>
                              <span className="text-xs font-black text-white line-clamp-1">{formSpecs.processor || "—"}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                              <span className="text-[9px] text-zinc-400 uppercase font-semibold block">RAM</span>
                              <span className="text-sm font-black text-gold">{formSpecs.ram ? `${formSpecs.ram} Go` : "—"}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                              <span className="text-[9px] text-zinc-400 uppercase font-semibold block">Stockage</span>
                              <span className="text-xs font-black text-emerald-400">{formSpecs.storageSize || "—"}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                              <span className="text-[9px] text-zinc-400 uppercase font-semibold block">Écran</span>
                              <span className="text-xs font-black text-white">{formSpecs.screenSize ? `${formSpecs.screenSize}"` : "—"}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CAS 1 : APERÇU IPHONE (APPLE) */}
                      {formCategory === "phones" && isAppleBrand(commonFormData.brand) && (
                        <div className="space-y-3 pt-2 border-t border-white/10">
                          {commonFormData.shortDesc && (
                            <div className="p-3 rounded-xl bg-gold/5 border border-gold/20">
                              <span className="text-[10px] font-bold text-gold uppercase tracking-wider block mb-1">Accroche / Description courte :</span>
                              <p className="text-xs text-white/90 italic font-medium">{commonFormData.shortDesc}</p>
                            </div>
                          )}

                          {otherFeatures.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Caractéristiques sélectionnées :</span>
                              <div className="flex flex-wrap gap-1.5">
                                {otherFeatures.map((feat, idx) => (
                                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/20 text-[11px] text-gold flex items-center gap-1 font-medium">
                                    <Sparkles className="w-3 h-3 text-gold" aria-hidden="true" />
                                    <span>{feat}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {appleVariants.length > 0 ? (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                  Variantes de prix ({appleVariants.length} combinaisons) :
                                </span>
                                <span className="text-[10px] text-gold font-bold">
                                  Min: {Math.min(...appleVariants.map(v => v.price)).toLocaleString("fr-FR")} F
                                </span>
                              </div>
                              <div className="max-h-40 overflow-y-auto rounded-xl border border-white/10 divide-y divide-white/5 text-[11px]">
                                {appleVariants.slice(0, 8).map(v => (
                                  <div key={v.id} className="p-2 flex items-center justify-between bg-black/40">
                                    <span className="text-zinc-300 font-medium">{v.storage} • {v.color} • <span className="text-zinc-500">{v.simType}</span></span>
                                    <span className="text-gold font-bold">{v.price.toLocaleString("fr-FR")} FCFA</span>
                                  </div>
                                ))}
                                {appleVariants.length > 8 && (
                                  <div className="p-1.5 text-center text-[10px] text-zinc-500 bg-black/60">
                                    + {appleVariants.length - 8} autres variantes configurées
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400">
                              Aucune variante générée. Le prix de base sera appliqué.
                            </div>
                          )}
                        </div>
                      )}

                      {/* CAS 2 : APERÇU AUTRE MARQUE DE TÉLÉPHONE */}
                      {formCategory === "phones" && !isAppleBrand(commonFormData.brand) && (
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Spécifications Clés :</span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col">
                              <span className="text-[10px] text-zinc-500 uppercase font-semibold">Stockage</span>
                              <span className="text-white font-bold mt-0.5 text-sm">{formSpecs.storage || "128 Go"}</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col">
                              <span className="text-[10px] text-zinc-500 uppercase font-semibold">Mémoire RAM</span>
                              <span className="text-gold font-bold mt-0.5 text-sm">{formSpecs.ram ? `${formSpecs.ram} Go` : "Standard"}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* AUTRES CATÉGORIES (Ordinateurs, Mobilité, Accessoires, etc.) */}
                      {formCategory !== "phones" && (
                        <>
                          {getCategoryConfig(formCategory).supportsStorageVariants && storageItems.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Options de capacité :</span>
                              <div className="flex flex-wrap gap-2">
                                {storageItems.map((opt, i) => (
                                  <span key={i} className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5">
                                    <span>{opt.capacity}</span>
                                    <span className="text-gold text-[10px]">({Number(opt.price).toLocaleString("fr-FR")} F)</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="space-y-2 pt-2 border-t border-white/10">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Spécifications techniques :</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {getCategoryConfig(formCategory).fields.map(f => {
                                const val = formSpecs[f.key];
                                if (val === undefined || val === null || String(val).trim() === "") return null;
                                const optionMatch = f.options?.find(o => o.value === String(val));
                                const displayVal = optionMatch ? optionMatch.label : String(val);

                                return (
                                  <div key={f.key} className="p-2 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col">
                                    <span className="text-[10px] text-zinc-500 uppercase">{f.label}</span>
                                    <span className="text-white font-semibold mt-0.5">
                                      {displayVal} {f.unit ? <span className="text-gold text-[10px] ml-1">{f.unit}</span> : null}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Description */}
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Description :</span>
                        <p className="text-xs text-zinc-300 leading-relaxed font-light whitespace-pre-line">
                          {commonFormData.desc || "Aucune description saisie."}
                        </p>
                      </div>

                      {/* Garantie & Accessoires */}
                      <div className="text-[11px] text-zinc-400 space-y-1 pt-2">
                        {commonFormData.warranty && <div>🛡️ Garantie : <strong className="text-white">{commonFormData.warranty}</strong></div>}
                        {commonFormData.accessories && <div>📦 Inclus : <strong className="text-white">{commonFormData.accessories}</strong></div>}
                      </div>

                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalViewMode("form")}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Revenir à l&apos;édition
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProduct}
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl bg-gold text-black font-extrabold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving ? "Enregistrement..." : (editingId ? "Mettre à jour" : "Confirmer & Enregistrer")}
                    </button>
                  </div>
                </div>
              )}

              {/* VUE 2 : FORMULAIRE DYNAMIQUE DE SAISIE */}
              {modalViewMode === "form" && (
                <form 
                  onSubmit={handleSaveProduct} 
                  onKeyDown={handleFormKeyDown}
                  className="space-y-6"
                >

                  {/* 1. SÉLECTION DYNAMIQUE DE LA CATÉGORIE */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4 text-gold" aria-hidden="true" />
                        <span>1. Choisissez la Catégorie du Produit</span>
                      </label>
                      <span className="text-[10px] text-gold font-semibold uppercase">
                        Adapte les champs automatiquement
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {CATEGORIES_LIST.map((cat) => {
                        const isSelected = formCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryChangeRequest(cat.id)}
                            className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "border-gold bg-gold/15 shadow-[0_0_15px_rgba(212,175,55,0.25)] ring-1 ring-gold/50"
                                : "border-white/10 bg-black/40 hover:border-white/30 hover:bg-white/[0.03]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`p-1.5 rounded-lg ${isSelected ? "bg-gold text-black" : "bg-white/5 text-zinc-400"}`}>
                                {getCategoryIcon(cat.id, "w-4 h-4")}
                              </span>
                              {isSelected && <Check className="w-4 h-4 text-gold" aria-hidden="true" />}
                            </div>
                            <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-zinc-300"}`}>
                              {cat.label}
                            </span>
                            <span className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                              {cat.shortLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2 & 3. INFORMATIONS GÉNÉRALES ET PHOTOS (RÉSERVÉES AUX AUTRES CATÉGORIES HORS TÉLÉPHONES) */}
                  {formCategory !== "phones" && (
                    <>
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gold" aria-hidden="true" />
                      <span>2. Informations Générales Communes</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nom du produit */}
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                          Nom du Produit <span className="text-red-400">*</span>
                        </label>
                        <input 
                          type="text" 
                          required 
                          value={commonFormData.name} 
                          onChange={e => setCommonFormData({ ...commonFormData, name: e.target.value })} 
                          placeholder={getCategoryConfig(formCategory).placeholderName || "Ex: Nom du modèle..."} 
                          className={`w-full bg-black/60 border rounded-xl p-3 text-white text-xs outline-none focus:border-gold ${
                            formErrors.name ? "border-red-500" : "border-white/10"
                          }`}
                        />
                        {formErrors.name && <span className="text-[10px] text-red-400 mt-1 block">{formErrors.name}</span>}
                      </div>

                      {/* Marque Fabricant avec suggestions intelligentes par catégorie et détection Apple vs Autres */}
                      <div className="sm:col-span-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-2">
                            <label className="text-[11px] text-zinc-400 uppercase font-bold block">
                              Marque Fabricant <span className="text-red-400">*</span>
                            </label>
                            {formCategory === "phones" && (
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                                isAppleBrand(commonFormData.brand)
                                  ? "bg-gold/20 text-gold border border-gold/40 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                                  : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                              }`}>
                                <span>{isAppleBrand(commonFormData.brand) ? "🍎 Mode iPhone (Variantes Dynamiques)" : "🤖 Mode Autres Marques (Standard)"}</span>
                              </span>
                            )}
                          </div>
                          {getCategoryConfig(formCategory).popularBrands && getCategoryConfig(formCategory).popularBrands.length > 0 && (
                            <span className="text-[10px] text-zinc-500">
                              Marques suggérées pour {getCategoryConfig(formCategory).shortLabel} :
                            </span>
                          )}
                        </div>
                        
                        {getCategoryConfig(formCategory).popularBrands && getCategoryConfig(formCategory).popularBrands.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {getCategoryConfig(formCategory).popularBrands.map((brandName) => {
                              const isSelected = commonFormData.brand.trim().toLowerCase() === brandName.toLowerCase();
                              return (
                                <button
                                  key={brandName}
                                  type="button"
                                  onClick={() => handleBrandChange(brandName)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                                    isSelected
                                      ? "bg-gold text-black border-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                                      : "bg-white/5 text-zinc-300 border-white/10 hover:border-gold/50 hover:text-white hover:bg-white/10"
                                  }`}
                                >
                                  {isSelected ? `✓ ${brandName}` : brandName}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <input 
                          type="text" 
                          value={commonFormData.brand} 
                          onChange={e => handleBrandChange(e.target.value)} 
                          placeholder={getCategoryConfig(formCategory).popularBrands && getCategoryConfig(formCategory).popularBrands[0] ? `Ex: ${getCategoryConfig(formCategory).popularBrands.slice(0, 3).join(", ")}... ou saisie libre` : "Ex: Nom du fabricant ou marque..."} 
                          className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-gold"
                        />
                      </div>

                      {/* État du produit */}
                      <div>
                        <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                          État du Produit
                        </label>
                        <select 
                          value={commonFormData.condition} 
                          onChange={e => setCommonFormData({ ...commonFormData, condition: e.target.value })} 
                          className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-gold"
                        >
                          <option value="neuf">Neuf sous blister scellé</option>
                          <option value="occasion">Occasion Certifiée A+</option>
                          <option value="reconditionne">Reconditionné à Neuf (Certifié)</option>
                        </select>
                      </div>

                      {/* Prix de base (FCFA) */}
                      <div>
                        <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                          Prix de Vente Normal (FCFA) <span className="text-red-400">*</span>
                        </label>
                        <input 
                          type="number" 
                          required 
                          min="0"
                          value={commonFormData.price} 
                          onChange={e => setCommonFormData({ ...commonFormData, price: e.target.value })} 
                          placeholder="Ex: 850000" 
                          className={`w-full bg-black/60 border rounded-xl p-3 text-white text-xs font-bold text-gold outline-none focus:border-gold ${
                            formErrors.price ? "border-red-500" : "border-white/10"
                          }`}
                        />
                        {formErrors.price && <span className="text-[10px] text-red-400 mt-1 block">{formErrors.price}</span>}
                      </div>

                      {/* Prix promotionnel (FCFA) */}
                      <div>
                        <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                          Prix Promotionnel (FCFA, Facultatif)
                        </label>
                        <input 
                          type="number" 
                          min="0"
                          value={commonFormData.salePrice} 
                          onChange={e => setCommonFormData({ ...commonFormData, salePrice: e.target.value })} 
                          placeholder="Ex: 790000 (laisser vide si pas de promo)" 
                          className={`w-full bg-black/60 border rounded-xl p-3 text-white text-xs outline-none focus:border-gold ${
                            formErrors.salePrice ? "border-red-500" : "border-white/10"
                          }`}
                        />
                        {formErrors.salePrice && <span className="text-[10px] text-red-400 mt-1 block">{formErrors.salePrice}</span>}
                      </div>

                      {/* Disponibilité & Statut du Stock (Sans limite numérique contraignante) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] text-zinc-400 uppercase font-bold block">
                            Disponibilité en Magasin
                          </label>
                          <span className="text-[10px] text-zinc-500 font-medium">
                            Sans limite de stock numérique
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Option 1 : En Stock */}
                          <button
                            type="button"
                            onClick={() => setCommonFormData(prev => ({ ...prev, stockStatus: "en_stock", stock: "99" }))}
                            className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                              commonFormData.stockStatus !== "bientot_disponible"
                                ? "border-emerald-500 bg-emerald-500/15 text-white ring-1 ring-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                : "border-white/10 bg-black/40 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                              <div>
                                <div className="text-xs font-bold text-white">En stock</div>
                                <div className="text-[10px] text-zinc-400">Disponible immédiatement en boutique</div>
                              </div>
                            </div>
                            {commonFormData.stockStatus !== "bientot_disponible" && (
                              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            )}
                          </button>

                          {/* Option 2 : Bientôt disponible */}
                          <button
                            type="button"
                            onClick={() => setCommonFormData(prev => ({ ...prev, stockStatus: "bientot_disponible", stock: "0" }))}
                            className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                              commonFormData.stockStatus === "bientot_disponible"
                                ? "border-amber-500 bg-amber-500/15 text-white ring-1 ring-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                : "border-white/10 bg-black/40 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm flex-shrink-0">⏳</span>
                              <div>
                                <div className="text-xs font-bold text-amber-400">Bientôt disponible</div>
                                <div className="text-[10px] text-zinc-400">En rupture temporaire / Arrivage imminent</div>
                              </div>
                            </div>
                            {commonFormData.stockStatus === "bientot_disponible" && (
                              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Couleurs disponibles avec Nuancier Officiel Apple & Universel */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] text-zinc-400 uppercase font-bold block">
                            Couleurs disponibles
                          </label>
                          {commonFormData.colors && (
                            <button
                              type="button"
                              onClick={() => setCommonFormData(prev => ({ ...prev, colors: "" }))}
                              className="text-[10px] text-zinc-500 hover:text-red-400 underline cursor-pointer"
                            >
                              Tout effacer
                            </button>
                          )}
                        </div>

                        {/* Palette interactive 1-clic des teintes Apple */}
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                          <span className="text-[10px] text-gold font-bold uppercase tracking-wider block">
                            Palette officielle Apple (Cliquez pour ajouter / retirer en 1 clic) :
                          </span>
                          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto custom-scrollbar p-1">
                            {IPHONE_OFFICIAL_COLORS.map(c => {
                              const activeColors = commonFormData.colors
                                ? commonFormData.colors.split(",").map(x => x.trim().toLowerCase())
                                : [];
                              const isSelected = activeColors.includes(c.name.toLowerCase());
                              return (
                                <button
                                  key={c.name}
                                  type="button"
                                  onClick={() => toggleOfficialColor(c.name)}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-gold/20 border-gold text-white shadow-[0_0_10px_rgba(212,175,55,0.3)] scale-[1.02]"
                                      : "bg-white/5 border-white/10 text-zinc-300 hover:border-white/30 hover:text-white"
                                  }`}
                                >
                                  <span 
                                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 border shadow-sm"
                                    style={{ 
                                      backgroundColor: c.hex, 
                                      borderColor: c.border || "rgba(255,255,255,0.25)" 
                                    }}
                                  />
                                  <span>{c.name}</span>
                                  {isSelected && <span className="text-gold font-bold text-[10px]">✓</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Champ texte direct modifiable */}
                        <input 
                          type="text" 
                          value={commonFormData.colors} 
                          onChange={e => setCommonFormData({ ...commonFormData, colors: e.target.value })} 
                          placeholder="Ex: Titane Naturel, Titane Noir, Blanc, Or" 
                          className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-gold font-medium"
                        />
                        <p className="text-[10px] text-zinc-500">
                          Sélectionnez les teintes ci-dessus ou saisissez vos couleurs personnalisées séparées par une virgule.
                        </p>
                      </div>

                      {/* Garantie vendeur */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] text-zinc-400 uppercase font-bold block">
                            Garantie Vendeur / Fabricant
                          </label>
                          {getCategoryConfig(formCategory).defaultWarranty && commonFormData.warranty !== getCategoryConfig(formCategory).defaultWarranty && (
                            <button
                              type="button"
                              onClick={() => setCommonFormData({ ...commonFormData, warranty: getCategoryConfig(formCategory).defaultWarranty })}
                              className="text-[10px] text-gold hover:underline cursor-pointer"
                            >
                              Appliquer par défaut
                            </button>
                          )}
                        </div>
                        <input 
                          type="text" 
                          value={commonFormData.warranty} 
                          onChange={e => setCommonFormData({ ...commonFormData, warranty: e.target.value })} 
                          placeholder={getCategoryConfig(formCategory).defaultWarranty || "Ex: Garantie 12 Mois Certifiée"} 
                          className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-gold"
                        />
                      </div>

                      {/* Accessoires inclus */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] text-zinc-400 uppercase font-bold block">
                            Accessoires Inclus dans le Coffret
                          </label>
                          {getCategoryConfig(formCategory).defaultAccessories && commonFormData.accessories !== getCategoryConfig(formCategory).defaultAccessories && (
                            <button
                              type="button"
                              onClick={() => setCommonFormData({ ...commonFormData, accessories: getCategoryConfig(formCategory).defaultAccessories })}
                              className="text-[10px] text-gold hover:underline cursor-pointer"
                            >
                              Appliquer par défaut
                            </button>
                          )}
                        </div>
                        <input 
                          type="text" 
                          value={commonFormData.accessories} 
                          onChange={e => setCommonFormData({ ...commonFormData, accessories: e.target.value })} 
                          placeholder={getCategoryConfig(formCategory).defaultAccessories || "Ex: Chargeur, Manuel, Accessoires..."} 
                          className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-gold"
                        />
                      </div>

                      {/* Description courte (Exclusivement affichée pour Apple / iPhone - CAS 1) */}
                      {formCategory === "phones" && isAppleBrand(commonFormData.brand) && (
                        <div className="sm:col-span-2">
                          <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                            Description Courte (Accroche iPhone)
                          </label>
                          <input 
                            type="text" 
                            value={commonFormData.shortDesc} 
                            onChange={e => setCommonFormData({ ...commonFormData, shortDesc: e.target.value })} 
                            placeholder="Ex: Le fleuron Apple en titane avec puce A17 Pro et zoom optique 5x..." 
                            className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-gold"
                          />
                          <p className="text-[10px] text-zinc-500 mt-1">
                            Texte synthétique d&apos;accroche affiché sous le titre du produit pour les clients.
                          </p>
                        </div>
                      )}

                      {/* Description longue / commerciale */}
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                          Description Longue <span className="text-red-400">*</span>
                        </label>
                        <textarea 
                          rows={3} 
                          required
                          value={commonFormData.desc} 
                          onChange={e => setCommonFormData({ ...commonFormData, desc: e.target.value })} 
                          placeholder="Description élégante mettant en valeur la performance, le design et les points forts..." 
                          className={`w-full bg-black/60 border rounded-xl p-3 text-white text-xs outline-none resize-none focus:border-gold ${
                            formErrors.desc ? "border-red-500" : "border-white/10"
                          }`}
                        />
                        {formErrors.desc && <span className="text-[10px] text-red-400 mt-1 block">{formErrors.desc}</span>}
                      </div>
                    </div>
                  </div>

                  {/* 3. PHOTOS DU PRODUIT (MULTI-FICHIERS AVEC COMPRESSION) */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Camera className="w-4 h-4 text-gold" aria-hidden="true" />
                          <span>3. Photos du Produit (Multi-fichiers)</span>
                        </label>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          La <strong className="text-white">première photo</strong> sera l&apos;image principale affichée dans la boutique.
                        </p>
                      </div>

                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold hover:bg-yellow-400 text-black text-xs font-extrabold uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all flex-shrink-0">
                        <Upload className="w-4 h-4 text-black" aria-hidden="true" />
                        <span>{isCompressingImages ? "Traitement..." : "Choisir des fichiers"}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          disabled={isCompressingImages}
                          onChange={handleMultipleImagesUpload}
                          className="hidden" 
                        />
                      </label>
                    </div>

                    {imageList.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                        {imageList.map((imgSrc, index) => (
                          <div 
                            key={index} 
                            className={`relative group rounded-xl overflow-hidden border p-1 bg-black/60 transition-all ${
                              index === 0 
                                ? "border-gold shadow-[0_0_15px_rgba(212,175,55,0.25)] ring-1 ring-gold/50" 
                                : "border-white/10 hover:border-white/30"
                            }`}
                          >
                            <div className="aspect-square w-full rounded-lg bg-black/40 flex items-center justify-center overflow-hidden relative">
                              <img 
                                src={imgSrc} 
                                alt={`Photo ${index + 1}`} 
                                className="w-full h-full object-contain"
                              />
                              
                              <div className="absolute top-1.5 left-1.5 pointer-events-none">
                                {index === 0 ? (
                                  <span className="px-2 py-0.5 rounded-md bg-gold text-black text-[10px] font-black uppercase tracking-wider shadow inline-flex items-center gap-1">
                                    <Crown className="w-3 h-3" aria-hidden="true" />
                                    <span>Principale</span>
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded-md bg-black/80 text-zinc-300 text-[10px] font-bold border border-white/10">
                                    #{index + 1}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-red-600/80 hover:bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                                title="Supprimer cette image"
                              >
                                <X className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            </div>

                            {index !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetMainImage(index)}
                                className="w-full mt-1.5 py-1 px-2 rounded-lg bg-white/5 hover:bg-gold hover:text-black text-[10px] text-zinc-300 font-bold tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                              >
                                <Crown className="w-3 h-3" aria-hidden="true" />
                                <span>Définir comme 1ère</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-zinc-500 text-xs">
                        Aucune photo sélectionnée. Cliquez sur <strong className="text-zinc-300">Choisir des fichiers</strong> ou ajoutez un lien ci-dessous.
                      </div>
                    )}

                    {/* Sélecteur de couleur de fond pour le cadrage photo */}
                    <div className="pt-2.5 pb-1 flex flex-wrap items-center justify-between gap-2 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-300">Fond du cadrage photo</span>
                        <span className="text-[10px] text-zinc-500">Fond blanc pur recommandé pour harmoniser avec le site clair</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
                        <button
                          type="button"
                          onClick={() => setCommonFormData(prev => ({ ...prev, imageBg: "white" }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            (commonFormData.imageBg || "white") === "white"
                              ? "bg-gold text-black shadow-sm"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          <span>⬜</span>
                          <span>Blanc (Recommandé)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCommonFormData(prev => ({ ...prev, imageBg: "black" }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            commonFormData.imageBg === "black"
                              ? "bg-gold text-black shadow-sm"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          <span>⬛</span>
                          <span>Noir</span>
                        </button>
                      </div>
                    </div>

                    {/* Ajout par URL */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <input 
                        type="url" 
                        value={newImageUrl} 
                        onChange={e => setNewImageUrl(e.target.value)} 
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-gold/50 outline-none" 
                        placeholder="Ou collez un lien URL d'image (https://...)" 
                      />
                      <button
                        type="button"
                        onClick={() => handleAddImageUrl(newImageUrl)}
                        disabled={!newImageUrl.trim()}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors disabled:opacity-30 cursor-pointer"
                      >
                        + Ajouter URL
                      </button>
                    </div>
                  </div>
                </>
              )}

                  {/* 4. CONFIGURATEUR CONDITIONNEL : TÉLÉPHONES (APPLE VS AUTRES MARQUES) OU AUTRE CATÉGORIE */}
                  {formCategory === "phones" ? (
                    <div className="space-y-6">
                      {/* BASCULE RAPIDE : IPHONE (APPLE) VS AUTRES MARQUES (ANDROID) */}
                      <div className="flex p-1.5 bg-black/60 border border-white/10 rounded-2xl gap-2 shadow-lg">
                        <button
                          type="button"
                          onClick={() => handleBrandChange("Apple")}
                          className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                            isAppleBrand(commonFormData.brand)
                              ? "bg-gradient-to-r from-gold to-yellow-400 text-black shadow-[0_0_20px_rgba(212,175,55,0.35)] scale-[1.01]"
                              : "text-zinc-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span className="text-base">🍎</span>
                          <span>Mode iPhone (Apple)</span>
                          {isAppleBrand(commonFormData.brand) && (
                            <span className="text-[10px] bg-black/25 text-black px-2 py-0.5 rounded-full font-black">Actif</span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBrandChange(commonFormData.brand && !isAppleBrand(commonFormData.brand) ? commonFormData.brand : "Samsung")}
                          className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                            !isAppleBrand(commonFormData.brand)
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] scale-[1.01]"
                              : "text-zinc-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>Mode Autres Marques (Android)</span>
                          {!isAppleBrand(commonFormData.brand) && (
                            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-black">Actif</span>
                          )}
                        </button>
                      </div>

                      {isAppleBrand(commonFormData.brand) ? (
                        /* ========================================================================= */
                        /* CAS 1 : MODE IPHONE (APPLE) — SAISIE SIMPLIFIÉE & ERGONOMIQUE */
                        /* ========================================================================= */
                        <>
                          {/* 1. NOM DE L'IPHONE ET PRIX DE BASE */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/[0.03] border border-gold/40 space-y-4 shadow-md">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-gold" aria-hidden="true" />
                                <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                                  1. Modèle & Prix de Base de l&apos;iPhone
                                </h4>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 text-[10px] font-black uppercase">
                                Apple iPhone
                              </span>
                            </div>

                            {/* Raccourcis modèles populaires */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                                Raccourcis 1-clic modèles populaires :
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {POPULAR_IPHONE_MODELS.map((modelName) => {
                                  const isSelected = commonFormData.name.trim().toLowerCase() === modelName.toLowerCase();
                                  return (
                                    <button
                                      key={modelName}
                                      type="button"
                                      onClick={() => {
                                        setCommonFormData(prev => ({
                                          ...prev,
                                          name: modelName,
                                          brand: "Apple",
                                        }));
                                      }}
                                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                                        isSelected
                                          ? "bg-gold text-black border-gold shadow-[0_0_10px_rgba(212,175,55,0.3)] scale-[1.02]"
                                          : "bg-white/5 text-zinc-300 border-white/10 hover:border-gold/50 hover:text-white hover:bg-white/10"
                                      }`}
                                    >
                                      {isSelected ? `✓ ${modelName}` : modelName}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                              {/* Nom exact de l'iPhone */}
                              <div>
                                <label className="text-[11px] text-zinc-300 uppercase font-bold block mb-1">
                                  Nom de l&apos;iPhone <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={commonFormData.name}
                                  onChange={(e) => setCommonFormData({ ...commonFormData, name: e.target.value })}
                                  placeholder="Ex: iPhone 16 Pro Max"
                                  className={`w-full bg-black/60 border rounded-xl p-3 text-white text-xs outline-none focus:border-gold ${
                                    formErrors.name ? "border-red-500" : "border-white/10"
                                  }`}
                                />
                                {formErrors.name && (
                                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.name}</span>
                                )}
                              </div>

                              {/* Prix de base (FCFA) */}
                              <div>
                                <label className="text-[11px] text-zinc-300 uppercase font-bold block mb-1">
                                  Prix de Référence / Base (FCFA) <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    required
                                    min="0"
                                    step="5000"
                                    value={commonFormData.price}
                                    onChange={(e) => setCommonFormData({ ...commonFormData, price: e.target.value })}
                                    placeholder="Ex: 850000"
                                    className={`w-full bg-black/60 border rounded-xl p-3 pr-16 text-gold font-mono font-bold text-sm outline-none focus:border-gold ${
                                      formErrors.price ? "border-red-500" : "border-gold/40"
                                    }`}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 pointer-events-none">
                                    FCFA
                                  </span>
                                </div>
                                {formErrors.price && (
                                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.price}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 2. DESCRIPTIONS (COURTE ET LONGUE SUFFISENT SELON LE SOUHAIT DU CLIENT) */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                              <FileText className="w-4 h-4 text-gold" aria-hidden="true" />
                              <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                                2. Descriptions de l&apos;iPhone
                              </h4>
                            </div>

                            <div className="space-y-3">
                              {/* Description courte (Accroche percutante) */}
                              <div>
                                <label className="text-[11px] text-zinc-300 uppercase font-bold block mb-1">
                                  Description Courte (Accroche commerciale)
                                </label>
                                <input
                                  type="text"
                                  value={commonFormData.shortDesc || ""}
                                  onChange={(e) => setCommonFormData({ ...commonFormData, shortDesc: e.target.value })}
                                  placeholder="Ex: Puce A18 Pro, Châssis en Titane, Commande de l'appareil photo et autonomie record."
                                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-gold"
                                />
                                <span className="text-[10px] text-zinc-500 mt-1 block">
                                  Phrase synthétique mise en avant sous le titre du produit sur la boutique.
                                </span>
                              </div>

                              {/* Description longue */}
                              <div>
                                <label className="text-[11px] text-zinc-300 uppercase font-bold block mb-1">
                                  Description Longue Complète <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                  required
                                  rows={4}
                                  value={commonFormData.desc}
                                  onChange={(e) => setCommonFormData({ ...commonFormData, desc: e.target.value })}
                                  placeholder="Présentez les atouts de cet iPhone, les accessoires inclus dans la boîte, l'état esthétique et la garantie..."
                                  className={`w-full bg-black/60 border rounded-xl p-3 text-white text-xs outline-none focus:border-gold custom-scrollbar leading-relaxed ${
                                    formErrors.desc ? "border-red-500" : "border-white/10"
                                  }`}
                                />
                                {formErrors.desc && (
                                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.desc}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 3. CONFIGURATION HIÉRARCHIQUE : SIM → CAPACITÉS → PRIX → COULEURS (LISTES DÉROULANTES SANS BULLES) */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/[0.04] border border-gold/40 space-y-6 shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-gold" aria-hidden="true" />
                                  <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                                    3. Prix selon Type de SIM, Capacité & Finitions
                                  </h4>
                                </div>
                                <p className="text-[11px] text-zinc-400 mt-0.5">
                                  Sélectionnez le type de SIM et la capacité dans les listes déroulantes, fixez le prix et cochez les couleurs disponibles.
                                </p>
                              </div>
                              <span className="text-[11px] text-gold font-bold self-start sm:self-auto">
                                {simBlocks.length} Format(s) SIM Actif(s)
                              </span>
                            </div>

                            {/* LISTE DES FORMATS SIM ACTIFS */}
                            <div className="space-y-5">
                              {simBlocks.map((block, simIndex) => {
                                const unusedSims = simBlocks.filter(b => b.simId !== block.simId);

                                return (
                                  <div 
                                    key={block.simId}
                                    className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-gold/30 space-y-4 shadow-md"
                                  >
                                    {/* EN-TÊTE DU BLOC SIM : LISTE DÉROULANTE POUR LE TYPE DE SIM (SANS BULLE) */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider whitespace-nowrap">
                                          Type de SIM :
                                        </label>
                                        <select
                                          value={block.simId}
                                          onChange={(e) => {
                                            const nextId = e.target.value;
                                            const def = AVAILABLE_SIM_TYPES.find(s => s.id === nextId);
                                            if (!def) return;
                                            setSimBlocks(prev => prev.map((b, idx) => {
                                              if (idx !== simIndex) return b;
                                              return { ...b, simId: def.id, simLabel: def.label };
                                            }));
                                          }}
                                          className="bg-black border border-white/20 rounded-xl px-3 py-2 text-white text-xs font-semibold outline-none focus:border-gold cursor-pointer min-w-[240px]"
                                        >
                                          {AVAILABLE_SIM_TYPES.map(simDef => {
                                            const isUsedElsewhere = simBlocks.some((b, idx) => idx !== simIndex && b.simId === simDef.id);
                                            return (
                                              <option key={simDef.id} value={simDef.id} disabled={isUsedElsewhere}>
                                                {simDef.label} {isUsedElsewhere ? "(Déjà sélectionné)" : ""}
                                              </option>
                                            );
                                          })}
                                        </select>
                                      </div>

                                      <div className="flex items-center gap-2 self-end sm:self-auto">
                                        {unusedSims.length > 0 && (
                                          <button
                                            type="button"
                                            onClick={() => handleCopyCapacitiesFromSim(block.simId, unusedSims[0].simId)}
                                            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
                                            title={`Dupliquer ces capacités vers ${unusedSims[0].simLabel}`}
                                          >
                                            <span>Dupliquer vers {unusedSims[0].simLabel}</span>
                                          </button>
                                        )}

                                        {simBlocks.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveSimType(block.simId)}
                                            className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                                            title="Supprimer ce format de SIM"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Supprimer</span>
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    {/* LISTE DES CAPACITÉS POUR CE FORMAT SIM */}
                                    <div className="space-y-4">
                                      <span className="text-[11px] text-zinc-400 font-bold block">
                                        Capacités, Prix & Couleurs pour &quot;{block.simLabel}&quot; :
                                      </span>

                                      {block.capacities.map((capItem) => (
                                        <div 
                                          key={capItem.id}
                                          className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-gold/30 transition-all space-y-3"
                                        >
                                          {/* SÉLECTION CAPACITÉ (LISTE DÉROULANTE SANS BULLE) + PRIX */}
                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                                            <div className="flex items-center gap-3">
                                              <label className="text-xs font-bold text-zinc-300 whitespace-nowrap">
                                                Capacité :
                                              </label>
                                              <select
                                                value={capItem.capacity}
                                                onChange={(e) => handleUpdateCapacityItem(block.simId, capItem.id, { capacity: e.target.value })}
                                                className="bg-black border border-white/20 rounded-xl px-3 py-2 text-white text-xs font-semibold outline-none focus:border-gold cursor-pointer min-w-[120px]"
                                              >
                                                {["64 Go", "128 Go", "256 Go", "512 Go", "1 To", "2 To"].map(capChoice => {
                                                  const isUsedInSameBlock = block.capacities.some(c => c.id !== capItem.id && c.capacity.toLowerCase() === capChoice.toLowerCase());
                                                  return (
                                                    <option key={capChoice} value={capChoice} disabled={isUsedInSameBlock}>
                                                      {capChoice} {isUsedInSameBlock ? "(Déjà ajouté)" : ""}
                                                    </option>
                                                  );
                                                })}
                                              </select>
                                            </div>

                                            {/* PRIX POUR CETTE CAPACITÉ */}
                                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                              <label className="text-xs font-bold text-zinc-300">
                                                Prix :
                                              </label>
                                              <div className="relative">
                                                <input
                                                  type="number"
                                                  min="0"
                                                  step="5000"
                                                  value={capItem.price}
                                                  onChange={(e) => handleUpdateCapacityItem(block.simId, capItem.id, { price: e.target.value })}
                                                  placeholder="Prix en FCFA"
                                                  className="w-32 sm:w-36 bg-black border border-gold/40 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-gold text-right outline-none focus:ring-1 focus:ring-gold"
                                                />
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500 font-bold pointer-events-none">
                                                  FCFA
                                                </span>
                                              </div>

                                              {block.capacities.length > 1 && (
                                                <button
                                                  type="button"
                                                  onClick={() => handleRemoveCapacityFromSim(block.simId, capItem.id)}
                                                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                                  title="Supprimer cette capacité"
                                                >
                                                  <X className="w-4 h-4" />
                                                </button>
                                              )}
                                            </div>
                                          </div>

                                          {/* COULEURS DISPONIBLES POUR CETTE CAPACITÉ (SANS BULLE : CASES À COCHER PROPRES) */}
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <span className="text-[11px] text-zinc-400 font-medium">
                                                Couleurs disponibles ({capItem.colors.length} sélectionnée(s)) :
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <button
                                                  type="button"
                                                  onClick={() => handleSelectAllColorsForCapacity(block.simId, capItem.id)}
                                                  className="text-[10px] text-gold hover:underline font-bold cursor-pointer"
                                                >
                                                  Tout cocher
                                                </button>
                                                <span className="text-zinc-600">•</span>
                                                <button
                                                  type="button"
                                                  onClick={() => handleDeselectAllColorsForCapacity(block.simId, capItem.id)}
                                                  className="text-[10px] text-zinc-400 hover:underline cursor-pointer"
                                                >
                                                  Tout décocher
                                                </button>
                                              </div>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-2 bg-black/40 rounded-xl border border-white/5 custom-scrollbar">
                                              {IPHONE_OFFICIAL_COLORS.map(c => {
                                                const isSelected = capItem.colors.some(col => col.toLowerCase() === c.name.toLowerCase());
                                                return (
                                                  <label
                                                    key={c.name}
                                                    className="flex items-center gap-2 text-xs text-zinc-300 hover:text-white cursor-pointer select-none py-1 px-1.5 rounded hover:bg-white/5"
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={isSelected}
                                                      onChange={() => handleToggleColorForCapacity(block.simId, capItem.id, c.name)}
                                                      className="w-3.5 h-3.5 accent-[#d4af37] rounded cursor-pointer"
                                                    />
                                                    <span 
                                                      className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
                                                      style={{ backgroundColor: c.hex }}
                                                    />
                                                    <span className="truncate">{c.name}</span>
                                                  </label>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      ))}

                                      {/* BOUTON AJOUTER UNE CAPACITÉ POUR CE FORMAT SIM (SANS BULLES) */}
                                      <div className="pt-1">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const allCaps = ["64 Go", "128 Go", "256 Go", "512 Go", "1 To", "2 To"];
                                            const unusedCap = allCaps.find(c => !block.capacities.some(item => item.capacity.toLowerCase() === c.toLowerCase())) || "256 Go";
                                            handleAddCapacityToSim(block.simId, unusedCap);
                                          }}
                                          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-gold/10 text-gold text-xs font-semibold border border-dashed border-gold/40 transition-all cursor-pointer flex items-center gap-1.5"
                                        >
                                          <Plus className="w-3.5 h-3.5" />
                                          <span>+ Ajouter une capacité</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* BOUTON POUR AJOUTER UN AUTRE TYPE DE SIM (SANS BULLE) */}
                            {AVAILABLE_SIM_TYPES.filter(def => !simBlocks.some(b => b.simId === def.id)).length > 0 && (
                              <div className="pt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const unusedDef = AVAILABLE_SIM_TYPES.find(def => !simBlocks.some(b => b.simId === def.id));
                                    if (unusedDef) handleAddSimType(unusedDef.id);
                                  }}
                                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-gold/10 text-gold text-xs font-bold border border-dashed border-gold/40 transition-all cursor-pointer flex items-center gap-2"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>+ Ajouter un autre type de SIM</span>
                                </button>
                              </div>
                            )}
                          </div>

{/* 4. AUTRES CARACTÉRISTIQUES (LISTE DE SÉLECTION MULTIPLE EN 1 CLIC) */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/10 pb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-gold" aria-hidden="true" />
                                  <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                                    4. Autres caractéristiques (Sélection multiple)
                                  </h4>
                                </div>
                                <p className="text-[11px] text-zinc-400 mt-0.5">
                                  Cochez simplement les technologies phares de cet iPhone ou ajoutez un tag libre.
                                </p>
                              </div>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                {otherFeatures.length} caractéristique(s) active(s)
                              </span>
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                                Puces et caractéristiques phares recommandées :
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {PREDEFINED_APPLE_FEATURES.map((feat) => {
                                  const isSelected = otherFeatures.includes(feat);
                                  return (
                                    <button
                                      key={feat}
                                      type="button"
                                      onClick={() => toggleOtherFeature(feat)}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                        isSelected
                                          ? "bg-gold text-black border-gold shadow-[0_0_12px_rgba(212,175,55,0.3)] scale-[1.02]"
                                          : "bg-white/5 text-zinc-300 border-white/10 hover:border-gold/40 hover:text-white"
                                      }`}
                                    >
                                      <span>{feat}</span>
                                      {isSelected && <span className="font-black text-black">✓</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Ajout d'une caractéristique personnalisée */}
                            <div className="pt-2 border-t border-white/5 flex gap-2">
                              <input 
                                type="text" 
                                value={customFeatureInput}
                                onChange={(e) => setCustomFeatureInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddCustomFeature();
                                  }
                                }}
                                placeholder="Ajouter une caractéristique personnalisée (ex: Coque cuir offerte, Écran 120Hz...)"
                                className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-gold"
                              />
                              <button
                                type="button"
                                onClick={handleAddCustomFeature}
                                disabled={!customFeatureInput.trim()}
                                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-gold hover:text-black text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
                              >
                                + Ajouter
                              </button>
                            </div>
                          </div>

                          {/* 5. PHOTOS DE L'IPHONE */}
                          {renderPhotoUploader("Photos de l'iPhone (Multi-fichiers)")}
                        </>
                      ) : (
                        /* ========================================================================= */
                        /* CAS 2 : AUTRES MARQUES (ANDROID) — ULTRA-SIMPLIFIÉ EN 30 SECONDES */
                        /* ========================================================================= */
                        <>
                          {/* 1. MARQUE, MODÈLE ET PRIX UNIQUE */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/[0.03] border border-blue-500/30 space-y-4 shadow-md">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                              <div className="flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-blue-400" aria-hidden="true" />
                                <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                                  1. Marque, Modèle & Prix Unique
                                </h4>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] font-black uppercase">
                                Android / Universel
                              </span>
                            </div>

                            {/* Raccourcis marques populaires */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                                Marques de smartphones populaires :
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {POPULAR_OTHER_PHONE_BRANDS.map((brandName) => {
                                  const isSelected = commonFormData.brand.trim().toLowerCase() === brandName.toLowerCase();
                                  return (
                                    <button
                                      key={brandName}
                                      type="button"
                                      onClick={() => handleBrandChange(brandName)}
                                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                                        isSelected
                                          ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.4)] scale-[1.02]"
                                          : "bg-white/5 text-zinc-300 border-white/10 hover:border-blue-400/50 hover:text-white hover:bg-white/10"
                                      }`}
                                    >
                                      {isSelected ? `✓ ${brandName}` : brandName}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                              {/* Marque */}
                              <div>
                                <label className="text-[11px] text-zinc-300 uppercase font-bold block mb-1">
                                  Marque Fabricant <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={commonFormData.brand}
                                  onChange={(e) => handleBrandChange(e.target.value)}
                                  placeholder="Ex: Samsung, Xiaomi..."
                                  className={`w-full bg-black/60 border rounded-xl p-3 text-white text-xs outline-none focus:border-blue-400 ${
                                    formErrors.brand ? "border-red-500" : "border-white/10"
                                  }`}
                                />
                                {formErrors.brand && (
                                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.brand}</span>
                                )}
                              </div>

                              {/* Nom du modèle */}
                              <div>
                                <label className="text-[11px] text-zinc-300 uppercase font-bold block mb-1">
                                  Nom du Modèle <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={commonFormData.name}
                                  onChange={(e) => setCommonFormData({ ...commonFormData, name: e.target.value })}
                                  placeholder="Ex: Galaxy S24 Ultra"
                                  className={`w-full bg-black/60 border rounded-xl p-3 text-white text-xs outline-none focus:border-blue-400 ${
                                    formErrors.name ? "border-red-500" : "border-white/10"
                                  }`}
                                />
                                {formErrors.name && (
                                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.name}</span>
                                )}
                              </div>

                              {/* Prix unique ou Prix de base */}
                              <div>
                                <label className="text-[11px] text-zinc-300 uppercase font-bold block mb-1">
                                  {androidVariants.length > 1 ? "Prix de base (Option 1) (FCFA)" : "Prix de Vente (FCFA)"} <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    required
                                    min="0"
                                    step="5000"
                                    value={commonFormData.price}
                                    onChange={(e) => {
                                      const newPrice = e.target.value;
                                      setCommonFormData({ ...commonFormData, price: newPrice });
                                      setAndroidVariants(prev => prev.map((v, i) => i === 0 ? { ...v, price: newPrice } : v));
                                    }}
                                    placeholder="Ex: 450000"
                                    className={`w-full bg-black/60 border rounded-xl p-3 pr-16 text-blue-400 font-mono font-bold text-sm outline-none focus:border-blue-400 ${
                                      formErrors.price ? "border-red-500" : "border-blue-500/40"
                                    }`}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 pointer-events-none">
                                    FCFA
                                  </span>
                                </div>
                                {formErrors.price && (
                                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.price}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 2. DÉCLINAISONS DE PRIX : CAPACITÉ DE STOCKAGE & MÉMOIRE RAM */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-blue-400" aria-hidden="true" />
                                <div>
                                  <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                                    2. Déclinaisons de Prix (Stockage & RAM)
                                  </h4>
                                  <p className="text-[11px] text-zinc-400">
                                    Configurez les combinaisons de Stockage et RAM avec leur prix spécifique en FCFA.
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={handleAddAndroidVariant}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Ajouter une déclinaison</span>
                              </button>
                            </div>

                            <div className="space-y-3">
                              {androidVariants.map((variant, index) => (
                                <div
                                  key={variant.id || `var-${index}`}
                                  className="p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-blue-500/30 transition-all space-y-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/15 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                                        Configuration #{index + 1}
                                        {index === 0 && " — Principale"}
                                      </span>
                                      <span className="text-[11px] text-zinc-400 font-mono">
                                        {variant.storage} / {variant.ram} Go RAM
                                      </span>
                                    </div>
                                    {androidVariants.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveAndroidVariant(index)}
                                        className="text-zinc-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                                        title="Supprimer cette déclinaison"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* Capacité de stockage */}
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-zinc-300 uppercase font-bold block">
                                        Capacité de Stockage <span className="text-red-400">*</span>
                                      </label>
                                      <select
                                        value={variant.storage}
                                        onChange={(e) => handleUpdateAndroidVariant(index, "storage", e.target.value)}
                                        className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white text-xs outline-none focus:border-blue-400 cursor-pointer"
                                      >
                                        <option value="32 Go">32 Go</option>
                                        <option value="64 Go">64 Go</option>
                                        <option value="128 Go">128 Go</option>
                                        <option value="256 Go">256 Go</option>
                                        <option value="512 Go">512 Go</option>
                                        <option value="1 To">1 To</option>
                                        <option value="2 To">2 To</option>
                                      </select>
                                    </div>

                                    {/* Mémoire RAM */}
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-zinc-300 uppercase font-bold block">
                                        Mémoire RAM <span className="text-red-400">*</span>
                                      </label>
                                      <select
                                        value={variant.ram}
                                        onChange={(e) => handleUpdateAndroidVariant(index, "ram", Number(e.target.value) || e.target.value)}
                                        className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white text-xs outline-none focus:border-blue-400 cursor-pointer"
                                      >
                                        <option value={2}>2 Go RAM</option>
                                        <option value={3}>3 Go RAM</option>
                                        <option value={4}>4 Go RAM</option>
                                        <option value={6}>6 Go RAM</option>
                                        <option value={8}>8 Go RAM</option>
                                        <option value={12}>12 Go RAM</option>
                                        <option value={16}>16 Go RAM</option>
                                        <option value={24}>24 Go RAM</option>
                                      </select>
                                    </div>

                                    {/* Prix spécifique en FCFA */}
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-zinc-300 uppercase font-bold block">
                                        Prix de cette Option (FCFA) <span className="text-red-400">*</span>
                                      </label>
                                      <div className="relative">
                                        <input
                                          type="number"
                                          min="0"
                                          step="5000"
                                          value={variant.price}
                                          onChange={(e) => handleUpdateAndroidVariant(index, "price", e.target.value)}
                                          placeholder={index === 0 ? (commonFormData.price || "Ex: 450000") : (commonFormData.price || "Ex: 500000")}
                                          className="w-full bg-black/60 border border-blue-500/40 rounded-xl p-2.5 pr-14 text-blue-400 font-mono font-bold text-xs outline-none focus:border-blue-400"
                                        />
                                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 pointer-events-none">
                                          FCFA
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={handleAddAndroidVariant}
                              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-blue-500/40 hover:border-blue-400 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Ajouter une autre déclinaison (Stockage & RAM)</span>
                            </button>
                          </div>

                          {/* 3. LONGUE DESCRIPTION SEULEMENT */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                              <FileText className="w-4 h-4 text-blue-400" aria-hidden="true" />
                              <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                                3. Description Longue du Smartphone
                              </h4>
                            </div>

                            <textarea
                              required
                              rows={5}
                              value={commonFormData.desc}
                              onChange={(e) => setCommonFormData({ ...commonFormData, desc: e.target.value })}
                              placeholder="Présentez les qualités du smartphone, ses performances, son écran, son autonomie, ses accessoires..."
                              className={`w-full bg-black/60 border rounded-xl p-3 text-white text-xs outline-none focus:border-blue-400 custom-scrollbar leading-relaxed ${
                                formErrors.desc ? "border-red-500" : "border-white/10"
                              }`}
                            />
                            {formErrors.desc && (
                              <span className="text-[10px] text-red-400 mt-1 block">{formErrors.desc}</span>
                            )}
                          </div>

                          {/* 4. PHOTOS DU SMARTPHONE */}
                          {renderPhotoUploader("Photos du Smartphone (Multi-fichiers)")}
                        </>
                      )}
                    </div>
                  ) : (
                    /* AUTRES CATÉGORIES (Ordinateurs, Motos, TV, Electroménager, etc.) */
                    <>
                      {/* CARACTÉRISTIQUES SPÉCIFIQUES DYNAMIQUES PAR CATÉGORIE */}
                      <div className="p-4 rounded-2xl bg-gold/[0.02] border border-gold/30 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(formCategory, "w-4 h-4 text-gold")}
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                              4. Spécifications : {getCategoryConfig(formCategory).label}
                            </h4>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/30">
                            {getCategoryConfig(formCategory).fields.length} champ(s) configuré(s)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {getCategoryConfig(formCategory).fields.map((field) => {
                            const val = formSpecs[field.key] !== undefined ? formSpecs[field.key] : "";
                            const errorMsg = formErrors[`specs_${field.key}`];

                            return (
                              <div key={field.key} className={field.key === "model" ? "sm:col-span-2" : ""}>
                                <label className="text-[11px] text-zinc-300 uppercase font-bold flex items-center justify-between mb-1">
                                  <span>
                                    {field.label} {field.required && <span className="text-red-400">*</span>}
                                  </span>
                                  {field.unit && (
                                    <span className="text-[10px] text-gold font-mono px-1.5 py-0.2 rounded bg-gold/10 border border-gold/20">
                                      {field.unit}
                                    </span>
                                  )}
                                </label>

                                {field.type === "select" ? (
                                  <select
                                    value={val}
                                    onChange={(e) => setFormSpecs({ ...formSpecs, [field.key]: e.target.value })}
                                    className={`w-full bg-black/60 border rounded-xl p-3 text-white text-xs outline-none focus:border-gold ${
                                      errorMsg ? "border-red-500" : "border-white/10"
                                    }`}
                                  >
                                    <option value="">-- Sélectionner {field.label} --</option>
                                    {field.options?.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                ) : field.type === "number" ? (
                                  <div className="relative">
                                    <input
                                      type="number"
                                      min={field.min ?? 0}
                                      max={field.max ?? Infinity}
                                      step="any"
                                      value={val}
                                      onChange={(e) => setFormSpecs({ ...formSpecs, [field.key]: e.target.value })}
                                      placeholder={field.placeholder || `Valeur en ${field.unit || "nombre"}`}
                                      className={`w-full bg-black/60 border rounded-xl p-3 text-white text-xs outline-none focus:border-gold ${
                                        field.unit ? "pr-14" : ""
                                      } ${errorMsg ? "border-red-500" : "border-white/10"}`}
                                    />
                                    {field.unit && (
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gold font-bold pointer-events-none">
                                        {field.unit}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <input
                                    type="text"
                                    value={val}
                                    onChange={(e) => setFormSpecs({ ...formSpecs, [field.key]: e.target.value })}
                                    placeholder={field.placeholder || `Saisir ${field.label.toLowerCase()}`}
                                    className={`w-full bg-black/60 border rounded-xl p-3 text-white text-xs outline-none focus:border-gold ${
                                      errorMsg ? "border-red-500" : "border-white/10"
                                    }`}
                                  />
                                )}

                                {field.helpText && (
                                  <p className="text-[10px] text-zinc-500 mt-1">{field.helpText}</p>
                                )}
                                {errorMsg && (
                                  <span className="text-[10px] text-red-400 mt-1 block font-medium">{errorMsg}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* VARIANTES MULTI-STOCKAGE (UNIQUEMENT SI LA CATÉGORIE LE SUPPORTE) */}
                      {getCategoryConfig(formCategory).supportsStorageVariants && (
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <HardDrive className="w-4 h-4 text-gold" aria-hidden="true" />
                                <span>5. Options de Stockage & Prix Différenciés</span>
                              </label>
                              <p className="text-[11px] text-zinc-400 mt-0.5">
                                Permet au client de choisir entre différentes capacités avec recalcul automatique du prix.
                              </p>
                            </div>

                            {/* Raccourcis d'ajout rapide */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold mr-1">Raccourcis :</span>
                              {["64 Go", "128 Go", "256 Go", "512 Go", "1 To", "2 To"].map((cap) => (
                                <button
                                  key={cap}
                                  type="button"
                                  onClick={() => handleQuickAddStorage(cap)}
                                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-gold hover:text-black text-zinc-300 text-[10px] font-bold border border-white/10 transition-all cursor-pointer"
                                >
                                  + {cap}
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={handleGenerateStandardTiers}
                                className="px-2.5 py-1 rounded-lg bg-gold/15 hover:bg-gold text-gold hover:text-black text-[10px] font-bold border border-gold/30 transition-all cursor-pointer flex items-center gap-1"
                                title="Générer automatiquement les 4 paliers standards (128G, 256G, 512G, 1T)"
                              >
                                <span>⚡</span>
                                <span>Paliers automatiques</span>
                              </button>
                            </div>
                          </div>

                          {storageItems.length > 0 ? (
                            <div className="space-y-2.5 pt-1">
                              {storageItems.map((item, idx) => (
                                <div 
                                  key={idx} 
                                  className="flex items-center gap-2.5 p-3 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-all"
                                >
                                  <div className="w-7 h-7 rounded-lg bg-gold/10 text-gold flex items-center justify-center font-black text-xs flex-shrink-0">
                                    #{idx + 1}
                                  </div>

                                  <div className="flex-1">
                                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                                      Capacité de stockage
                                    </label>
                                    <input 
                                      type="text" 
                                      value={item.capacity} 
                                      onChange={(e) => handleUpdateStorageItem(idx, "capacity", e.target.value)}
                                      placeholder="Ex: 256 Go" 
                                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-semibold focus:border-gold/50 outline-none"
                                    />
                                  </div>

                                  <div className="flex-1">
                                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                                      Prix associé (FCFA)
                                    </label>
                                    <input 
                                      type="number" 
                                      value={item.price} 
                                      onChange={(e) => handleUpdateStorageItem(idx, "price", e.target.value)}
                                      placeholder={`Ex: ${commonFormData.price || "625000"}`} 
                                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-bold text-gold focus:border-gold/50 outline-none"
                                    />
                                  </div>

                                  <div className="pt-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveStorageItem(idx)}
                                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-colors cursor-pointer"
                                      title="Supprimer cette option"
                                    >
                                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-3.5 rounded-xl border border-dashed border-white/10 text-center text-zinc-500 text-xs">
                              Optionnel : Utilisez les boutons de raccourci ci-dessus pour ajouter des variantes de stockage si ce modèle existe en plusieurs capacités.
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => handleAddStorageItem("", commonFormData.price || "")}
                            className="w-full py-2.5 rounded-xl border border-dashed border-white/20 hover:border-gold text-zinc-300 hover:text-gold text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer bg-white/[0.01] hover:bg-gold/5"
                          >
                            <span>+</span>
                            <span>Ajouter une option de stockage personnalisée</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* BOUTONS D'ACTION DU FORMULAIRE */}
                  <div className="flex gap-4 pt-4 border-t border-white/10">
                    <button 
                      type="button" 
                      onClick={requestCloseModal} 
                      className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>

                    <button 
                      type="button" 
                      onClick={() => setModalViewMode("preview")} 
                      className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-gold font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4 text-gold" aria-hidden="true" />
                      <span>Aperçu client</span>
                    </button>

                    <button 
                      type="submit" 
                      disabled={isSaving} 
                      className="flex-1 py-3.5 rounded-xl bg-gold text-black font-extrabold text-xs uppercase tracking-wider hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving ? "Enregistrement..." : (editingId ? "Mettre à jour" : "Créer le produit")}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
