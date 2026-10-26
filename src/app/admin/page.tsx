"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { products as defaultProducts } from "@/data/products";
import { 
  getProducts, 
  addProduct as addProductFirestore, 
  updateProduct as updateProductFirestore, 
  deleteProduct as deleteProductFirestore,
  seedProducts,
  getOrders
} from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
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
  Flame
} from "lucide-react";
import { 
  PRODUCT_CATEGORIES, 
  CATEGORIES_LIST, 
  getCategoryConfig, 
  CategoryDefinition, 
  SpecFieldDefinition 
} from "@/config/categories";
import { 
  validateAndCleanProduct, 
  normalizeProductSpecs 
} from "@/lib/productValidation";

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
}

interface StorageEntry {
  capacity: string;
  price: string;
}

interface AdminProduct {
  id: string | number;
  name: string;
  slug?: string;
  category: string;
  price: number;
  salePrice?: number | null;
  desc?: string;
  image: string;
  brand?: string;
  rating?: number;
  colors?: string[];
  images?: string[];
  storageOptions?: StorageOption[];
  specs?: Record<string, any>;
  stock?: number;
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
  const [isCloud, setIsCloud] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  
  // Recherche et filtrage du catalogue produits
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  
  // Données dynamiques des produits selon la catégorie
  const [formCategory, setFormCategory] = useState<string>("phones");
  const [commonFormData, setCommonFormData] = useState({
    name: "",
    brand: "",
    price: "",
    salePrice: "",
    desc: "",
    colors: "",
    stock: "10",
    condition: "neuf",
    warranty: "Garantie 12 Mois Certifiée",
    accessories: "",
  });
  const [formSpecs, setFormSpecs] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalViewMode, setModalViewMode] = useState<"form" | "preview">("form");
  const [categorySwitchPending, setCategorySwitchPending] = useState<{ from: string; to: string } | null>(null);

  // Gestion dynamique des options de stockage (cases successives) et des photos multiples
  const [storageItems, setStorageItems] = useState<StorageEntry[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isCompressingImages, setIsCompressingImages] = useState(false);

  // Charger les commandes et les produits
  useEffect(() => {
    async function loadData() {
      const configured = isFirebaseConfigured();
      setIsCloud(configured);

      // 1. Produits
      if (configured) {
        try {
          const cloudItems = (await getProducts()) as AdminProduct[] | null;
          if (cloudItems && cloudItems.length > 0) {
            setProductsList(cloudItems);
            localStorage.setItem("prince_cfa_products", JSON.stringify(cloudItems));
          }
        } catch (err) {
          console.warn("Erreur chargement Firestore, repli sur local", err);
        }
      }

      const saved = localStorage.getItem("prince_cfa_products");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const migrated = parsed.map((p: AdminProduct) => {
            const defaultMatch = defaultProducts.find(dp => String(dp.id) === String(p.id));
            if (defaultMatch) {
              return {
                ...p,
                image: defaultMatch.image,
                images: defaultMatch.images,
                colors: defaultMatch.colors,
                specs: defaultMatch.specs,
                desc: defaultMatch.desc,
                brand: defaultMatch.brand || p.brand,
                storageOptions: defaultMatch.storageOptions || p.storageOptions
              };
            }
            return p;
          });
          const existingIds = new Set(migrated.map((p: AdminProduct) => String(p.id)));
          const newDefaults = defaultProducts.filter(dp => !existingIds.has(String(dp.id)));
          const combined = [...migrated, ...newDefaults];
          try {
            localStorage.setItem("prince_cfa_products", JSON.stringify(combined));
          } catch {}
          setProductsList(combined);
        } catch {
          setProductsList(defaultProducts);
        }
      } else {
        setProductsList(defaultProducts);
      }
      // Les commandes des clients ne sont JAMAIS chargées sans authentification administrateur vérifiée
    }

    loadData();
  }, []);

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
      alert("Paiement vérifié et confirmé manuellement avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de la confirmation.");
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

  // Synchroniser le catalogue vers Firestore
  const handleSeedToCloud = async () => {
    if (!isCloud) return;
    setSyncStatus("Envoi des produits vers Firestore...");
    try {
      const catalogToSync = productsList.length > 0 ? productsList : defaultProducts;
      await seedProducts(catalogToSync);
      const refreshed = (await getProducts()) as AdminProduct[] | null;
      if (refreshed) {
        setProductsList(refreshed);
        localStorage.setItem("prince_cfa_products", JSON.stringify(refreshed));
        setSyncStatus(`${refreshed.length} produits synchronisés avec Firebase !`);
      } else {
        setSyncStatus("Produits synchronisés avec Firebase !");
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

    // Les options de stockage ne sont transmises QUE si la catégorie les autorise
    const parsedStorage: StorageOption[] = getCategoryConfig(formCategory).supportsStorageVariants
      ? storageItems
          .filter(item => item.capacity.trim() !== "")
          .map(item => ({
            capacity: item.capacity.trim(),
            price: Number(item.price) || Number(commonFormData.price) || 0
          }))
      : [];

    const rawPayload = {
      id: editingId || undefined,
      name: commonFormData.name,
      category: formCategory,
      brand: commonFormData.brand,
      price: commonFormData.price,
      salePrice: commonFormData.salePrice || null,
      desc: commonFormData.desc,
      stock: commonFormData.stock,
      condition: commonFormData.condition,
      warranty: commonFormData.warranty,
      accessories: commonFormData.accessories,
      colors: parsedColors,
      image: mainImage,
      images: allImages,
      storageOptions: parsedStorage.length > 0 ? parsedStorage : undefined,
      specs: formSpecs
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

    // 2. Persistance : via API avec vérification token, ou fallback Firestore
    try {
      if (adminToken) {
        const url = editingId ? `/api/admin/products/${editingId}` : `/api/admin/products`;
        const method = editingId ? "PUT" : "POST";
        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(cleaned)
        });

        if (res.ok) {
          const resData = await res.json();
          if (resData.product) {
            savedProduct = resData.product;
          }
        } else {
          // Repli direct Firestore si problème API
          if (editingId) {
            await updateProductFirestore(String(editingId), cleaned);
          } else {
            const firestoreId = await addProductFirestore(cleaned);
            if (firestoreId) savedProduct.id = firestoreId;
          }
        }
      } else if (isCloud) {
        if (editingId) {
          await updateProductFirestore(String(editingId), cleaned);
        } else {
          const firestoreId = await addProductFirestore(cleaned);
          if (firestoreId) savedProduct.id = firestoreId;
        }
      }
    } catch (saveErr) {
      console.warn("Erreur sauvegarde API/Cloud, enregistrement local", saveErr);
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
      if (isCloud && typeof id === "string" && !id.startsWith("p-") && !id.startsWith("phone-") && !id.startsWith("shoe-") && !id.startsWith("bag-")) {
        try {
          if (adminToken) {
            await fetch(`/api/admin/products/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${adminToken}` }
            });
          } else {
            await deleteProductFirestore(id);
          }
        } catch {
          await deleteProductFirestore(id);
        }
      }
      const updatedList = productsList.filter(p => p.id !== id);
      setProductsList(updatedList);
      try {
        localStorage.setItem("prince_cfa_products", JSON.stringify(updatedList));
      } catch (e) {
        console.warn("LocalStorage warning:", e);
      }
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
          imageList,
          savedAt: Date.now()
        };
        localStorage.setItem("prince_cfa_product_draft", JSON.stringify(draftPayload));
      } catch (e) {
        console.warn("Erreur sauvegarde brouillon:", e);
      }
    }
  }, [isModalOpen, editingId, isFormDirty, formCategory, commonFormData, formSpecs, storageItems, imageList]);

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

    setCommonFormData({
      name: product.name || "",
      brand: product.brand || "",
      price: product.price ? product.price.toString() : "",
      salePrice: product.salePrice ? product.salePrice.toString() : "",
      desc: product.desc || "",
      colors: product.colors ? product.colors.join(", ") : "",
      stock: (product.stock !== undefined ? product.stock : 10).toString(),
      condition: (product.condition as any) || "neuf",
      warranty: product.warranty || "Garantie 12 Mois Certifiée",
      accessories: product.accessories || ""
    });

    setIsModalOpen(true);
  };

  // Fermeture définitive et réinitialisation de l'état
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setImageList([]);
    setStorageItems([]);
    setNewImageUrl("");
    setFormCategory("phones");
    setFormSpecs({});
    setFormErrors({});
    setModalViewMode("form");
    setCategorySwitchPending(null);
    setDraftRestored(false);
    setCommonFormData({
      name: "",
      brand: "",
      price: "",
      salePrice: "",
      desc: "",
      colors: "",
      stock: "10",
      condition: "neuf",
      warranty: "Garantie 12 Mois Certifiée",
      accessories: "",
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
      setNewImageUrl("");
      setFormCategory("phones");
      setFormSpecs({});
      setDraftRestored(false);
      const phoneConfig = getCategoryConfig("phones");
      setCommonFormData({
        name: "",
        brand: "",
        price: "",
        salePrice: "",
        desc: "",
        colors: "",
        stock: "10",
        condition: "neuf",
        warranty: phoneConfig.defaultWarranty || "Garantie 12 Mois Certifiée",
        accessories: phoneConfig.defaultAccessories || "",
      });
    }

    setIsModalOpen(true);
  };

  // Filtrage des commandes
  const filteredOrders = ordersList.filter(o => {
    const q = orderSearchQuery.toLowerCase().trim();
    const matchQuery = !q || 
      o.id.toLowerCase().includes(q) || 
      o.customer.name.toLowerCase().includes(q) || 
      o.customer.phone.includes(q);

    const matchStatus = orderStatusFilter === "all" || o.orderStatus === orderStatusFilter || o.payment.status === orderStatusFilter;
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
  const pendingPaymentsCount = ordersList.filter(o => o.payment.status === "en_attente").length;
  const confirmedPaymentsCount = ordersList.filter(o => o.payment.status === "confirme").length;
  const totalCollectedRevenue = ordersList
    .filter(o => o.payment.status === "confirme")
    .reduce((sum, o) => sum + (o.pricing?.total || 0), 0);

  // Vue Login si non authentifié
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 w-full max-w-md z-10 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Crown className="w-8 h-8 text-gold" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-wider">PRINCE <span className="text-gold">ADMIN</span></h1>
            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-light">Espace de gestion réservé</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                Mot de passe administrateur
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center animate-in fade-in flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-3.5 rounded-xl bg-gold hover:bg-yellow-400 text-black font-extrabold uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
            >
              Accéder au panneau
            </button>
          </form>

          <Link href="/" className="block text-center text-xs text-zinc-500 hover:text-zinc-300 mt-6 transition-colors">
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 sm:p-8 relative">
      
      {/* Navbar Admin */}
      <nav className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-white/10 mb-6 z-10 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
            <Crown className="w-5 h-5 text-gold" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-widest">PRINCE <span className="text-gold">ADMIN</span></h1>
            <span className="text-xs text-green-500 font-medium">● Connecté en Administrateur</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" className="px-4 py-2 rounded-lg bg-white/5 text-zinc-300 text-xs sm:text-sm hover:text-white hover:bg-white/10 transition-colors border border-white/5">
            Boutique ↗
          </Link>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-xs sm:text-sm hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
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
              ? "bg-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
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
              ? "bg-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <Tag className="w-4 h-4" aria-hidden="true" />
          <span>Catalogue Produits</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 text-[10px]">
            {productsList.length}
          </span>
        </button>

        {activeTab === "orders" && (
          <button
            onClick={refreshOrders}
            className="ml-auto px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
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
          <div className="glass-panel p-5 rounded-2xl border border-white/5 border-l-gold/50 shadow-lg relative overflow-hidden">
            <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-1 font-semibold">Total Commandes</h3>
            <p className="text-2xl sm:text-3xl font-black text-white">{totalOrdersCount}</p>
            <span className="text-[11px] text-zinc-400 mt-1 inline-block">Toutes périodes</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 border-l-yellow-500/50 shadow-lg relative overflow-hidden">
            <h3 className="text-yellow-400 text-xs uppercase tracking-wider mb-1 font-semibold">En attente paiement</h3>
            <p className="text-2xl sm:text-3xl font-black text-yellow-400">{pendingPaymentsCount}</p>
            <span className="text-[11px] text-zinc-400 mt-1 inline-block">Orange Money / Wave à vérifier</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 border-l-green-500/50 shadow-lg relative overflow-hidden">
            <h3 className="text-green-400 text-xs uppercase tracking-wider mb-1 font-semibold">Paiements Confirmés</h3>
            <p className="text-2xl sm:text-3xl font-black text-green-400">{confirmedPaymentsCount}</p>
            <span className="text-[11px] text-green-500/80 mt-1 inline-block">Validés manuellement</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 border-l-gold/50 shadow-lg relative overflow-hidden">
            <h3 className="text-gold text-xs uppercase tracking-wider mb-1 font-semibold">Chiffre Encaissé Réel</h3>
            <p className="text-2xl sm:text-3xl font-black text-white">{totalCollectedRevenue.toLocaleString('fr-FR')} <span className="text-gold text-lg">F</span></p>
            <span className="text-[11px] text-zinc-400 mt-1 inline-block">Fonds reçus et vérifiés</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 z-10">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 border-l-gold/50 shadow-lg relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] text-white opacity-5 pointer-events-none">
              <Coins className="w-24 h-24" aria-hidden="true" />
            </div>
            <h3 className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Valeur du Catalogue</h3>
            <p className="text-3xl font-black text-white">{totalCatalogValue.toLocaleString('fr-FR')} <span className="text-gold text-xl">FCFA</span></p>
            <span className="text-xs text-green-500 mt-2 inline-block">Valeur marchande totale</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] text-white opacity-5 pointer-events-none">
              <Package className="w-24 h-24" aria-hidden="true" />
            </div>
            <h3 className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Rayons Actifs</h3>
            <p className="text-3xl font-black text-white">{categoriesCount}</p>
            <span className="text-xs text-zinc-500 mt-2 inline-block">Catégories en ligne</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] text-white opacity-5 pointer-events-none">
              <ShoppingBag className="w-24 h-24" aria-hidden="true" />
            </div>
            <h3 className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Produits en Stock</h3>
            <p className="text-3xl font-black text-white">{totalProductsCount}</p>
            <span className="text-xs text-gold mt-2 inline-block">Catalogue actif</span>
          </div>
        </div>
      )}

      {/* CONTENU ONGLETS */}

      {/* ONGLET 1 : GESTION DES COMMANDES */}
      {activeTab === "orders" && (
        <div className="glass-panel rounded-2xl border border-white/10 flex-1 z-10 overflow-hidden flex flex-col">
          
          {/* Barre de filtres et recherche */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-wrap">
            <div className="flex-1 max-w-md">
              <input 
                type="text"
                value={orderSearchQuery}
                onChange={e => setOrderSearchQuery(e.target.value)}
                placeholder="Rechercher par N° commande, client ou téléphone..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-gold/50"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50"
              >
                <option value="all">Tous les statuts</option>
                <option value="en_attente">Paiement en attente</option>
                <option value="confirme">Paiement confirmé</option>
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
                <tr className="border-b border-white/10 text-[11px] text-zinc-400 uppercase tracking-wider bg-white/[0.02]">
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
              <tbody className="divide-y divide-white/5 text-xs text-zinc-300">
                {filteredOrders.map(order => {
                  const isPaid = order.payment?.status === "confirme";
                  const methodBadge = order.payment?.method === "wave" ? (
                    <span className="inline-flex items-center gap-1.5 text-cyan-400">
                      <WaveIcon className="w-3.5 h-3.5" /> Wave
                    </span>
                  ) : order.payment?.method === "store_pickup" ? (
                    <span className="inline-flex items-center gap-1.5 text-gold">
                      <Store className="w-3.5 h-3.5 text-gold" aria-hidden="true" /> Boutique
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-orange-400">
                      <OrangeMoneyIcon className="w-3.5 h-3.5" /> Orange Money
                    </span>
                  );

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-mono font-bold text-gold">{order.id}</td>
                      <td className="p-4 text-zinc-400">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{order.customer?.name}</div>
                        <div className="text-[11px] text-zinc-400 font-mono">{order.customer?.phone}</div>
                      </td>
                      <td className="p-4">
                        {order.customer?.deliveryMethod === "delivery" ? (
                          <span className="text-zinc-300 inline-flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                            <span>{order.customer.city}</span>
                          </span>
                        ) : (
                          <span className="text-gold inline-flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                            <span>Retrait en Boutique</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-semibold">{methodBadge}</td>
                      <td className="p-4">
                        {isPaid ? (
                          <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-[10px] inline-flex items-center gap-1 w-fit">
                            <Check className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />
                            <span>Confirmé</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold text-[10px] inline-flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3" aria-hidden="true" />
                            <span>En attente</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 text-[11px]">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 font-black text-white whitespace-nowrap">
                        {order.pricing?.total?.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleNotifyCustomerWhatsApp(order, order.payment.status === "confirme" ? "payment_confirmed" : "custom")}
                            title="Notifier ou contacter le client sur WhatsApp"
                            aria-label="Contacter le client sur WhatsApp"
                            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                            <span className="hidden xl:inline text-[11px]">WhatsApp</span>
                          </button>
                          <button
                            onClick={() => openOrderDetails(order)}
                            className="px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold text-gold hover:text-black font-bold text-xs transition-all border border-gold/30 cursor-pointer whitespace-nowrap"
                          >
                            Détails & Validation
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-zinc-500">
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
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          
          <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-gold/30 w-full max-w-2xl z-10 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <span className="text-xs text-zinc-400 uppercase tracking-widest block font-medium">Fiche Commande</span>
                <h3 className="text-xl font-black text-gold font-mono">{selectedOrder.id}</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                aria-label="Fermer la fiche commande"
                title="Fermer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Coordonnées Client */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 mb-4 text-xs">
              <div>
                <span className="text-zinc-500 uppercase tracking-wider block text-[10px]">Client</span>
                <span className="font-bold text-white text-sm">{selectedOrder.customer.name}</span>
                <div className="text-zinc-400 font-mono mt-0.5">{selectedOrder.customer.phone}</div>
              </div>
              <div>
                <span className="text-zinc-500 uppercase tracking-wider block text-[10px]">Mode de réception</span>
                <span className="font-bold text-white inline-flex items-center gap-1.5">
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
                  <div className="text-zinc-400 mt-0.5">{selectedOrder.customer.city} - {selectedOrder.customer.neighborhood}</div>
                )}
              </div>
              {selectedOrder.customer.notes && (
                <div className="col-span-2 pt-2 border-t border-white/5 text-zinc-400">
                  <span className="text-zinc-500 text-[10px] block">Note client :</span>
                  &quot;{selectedOrder.customer.notes}&quot;
                </div>
              )}
            </div>

            {/* Articles de la commande (Snapshot figé) */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Articles ({selectedOrder.items?.length})</span>
              <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-white/[0.01]">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex-1">
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-[11px] text-zinc-400">
                        {[item.selectedCapacity, item.selectedColor].filter(Boolean).join(" • ")}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-400">{item.quantity} × {item.unitPrice.toLocaleString('fr-FR')} F</span>
                      <div className="font-bold text-gold">{(item.quantity * item.unitPrice).toLocaleString('fr-FR')} FCFA</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Décomposition financière */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5 text-xs mb-5">
              <div className="flex justify-between text-zinc-400">
                <span>Sous-total produits</span>
                <span>{selectedOrder.pricing.subtotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Frais de réception</span>
                <span>{selectedOrder.pricing.deliveryFee.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm">
                <span className="text-white">Total Commande</span>
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
                      <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Nom / Matricule Admin</label>
                      <input 
                        type="text" 
                        value={verifierName} 
                        onChange={e => setVerifierName(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white text-xs"
                        placeholder="Ex: Moussa (Gérant)"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Réf. SMS / Transaction</label>
                      <input 
                        type="text" 
                        value={confirmTxRef} 
                        onChange={e => setConfirmTxRef(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white text-xs"
                        placeholder="Ex: OM-883719"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Note de vérification</label>
                    <input 
                      type="text" 
                      value={confirmNote} 
                      onChange={e => setConfirmNote(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white text-xs"
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

              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                      Numéro IMEI de l&apos;Appareil (15 chiffres)
                    </label>
                    <input 
                      type="text" 
                      value={imeiInput} 
                      onChange={e => setImeiInput(e.target.value)} 
                      placeholder="Ex: 356789123456789" 
                      className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                      Numéro de Série / Modèle Constructeur
                    </label>
                    <input 
                      type="text" 
                      value={serialInput} 
                      onChange={e => setSerialInput(e.target.value)} 
                      placeholder="Ex: F2LZG9J80D" 
                      className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                    Notes Internes SAV & Garantie
                  </label>
                  <input 
                    type="text" 
                    value={trackingNoteInput} 
                    onChange={e => setTrackingNoteInput(e.target.value)} 
                    placeholder="Ex: Appareil testé OK, batterie à 100%, film protecteur posé" 
                    className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white text-xs"
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
                  className="w-full py-2.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 font-bold uppercase tracking-wider text-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" aria-hidden="true" />
                  <span>Enregistrer le suivi IMEI / Série interne</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ONGLET 2 : GESTION DU CATALOGUE PRODUITS */}
      {activeTab === "products" && (
        <div className="glass-panel rounded-2xl border border-white/10 flex-1 z-10 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-bold text-white uppercase tracking-widest">Gestion du Catalogue</h2>
              {isCloud ? (
                <span className="px-2.5 py-1 text-xs rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Cloud Firebase Connecté
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
                  Mode Local
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {isCloud && (
                <button 
                  onClick={handleSeedToCloud}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white hover:border-gold/50 transition-all flex items-center gap-2 cursor-pointer"
                  title="Synchroniser tous les produits vers Firebase Firestore"
                >
                  <CloudUpload className="w-4 h-4 text-zinc-400" aria-hidden="true" />
                  <span>Envoyer vers Firebase</span>
                </button>
              )}

              <button 
                onClick={openModalForNew}
                className="px-4 py-2 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer flex items-center gap-2"
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
          <div className="p-4 sm:px-6 bg-white/[0.02] border-b border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Champ de recherche texte */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                <input 
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, marque (Honda, Apple...), ID ou mot-clé..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                />
                {productSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setProductSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white rounded-md transition-colors cursor-pointer"
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
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs font-medium text-zinc-200 focus:outline-none focus:border-gold/50 cursor-pointer appearance-none"
                  aria-label="Filtrer par catégorie"
                >
                  <option value="all" className="bg-zinc-900 text-white">
                    Toutes les catégories ({productsList.length})
                  </option>
                  {CATEGORIES_LIST.map((cat) => {
                    const count = productsList.filter(p => p.category === cat.id).length;
                    return (
                      <option key={cat.id} value={cat.id} className="bg-zinc-900 text-white">
                        {cat.label} ({count})
                      </option>
                    );
                  })}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Compteur et bouton de réinitialisation */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-zinc-400 pt-1 md:pt-0">
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
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
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
                <tr className="border-b border-white/10 text-xs text-zinc-400 uppercase tracking-wider bg-white/[0.02]">
                  <th className="p-4">Produit</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Prix</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-black/50 p-1 border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm flex items-center gap-2">
                            <span>{product.name}</span>
                            {product.brand && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 uppercase">
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
                      <span className="px-3 py-1 rounded-full bg-white/10 text-zinc-300 text-xs font-medium inline-flex items-center gap-1.5">
                        {getCategoryIcon(product.category, "w-3.5 h-3.5 text-gold")}
                        <span>{getCategoryConfig(product.category).label}</span>
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">
                      {product.salePrice ? (
                        <div>
                          <span className="text-gold font-extrabold">{product.salePrice.toLocaleString('fr-FR')} FCFA</span>
                          <span className="block text-[11px] text-zinc-500 line-through">{product.price.toLocaleString('fr-FR')} FCFA</span>
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
                          className="p-2 rounded-lg bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" 
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
                    <td colSpan={4} className="p-10 text-center">
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-amber-500/50 bg-[#0d0d10] max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-white">Changement de catégorie</h4>
                <p className="text-[11px] text-zinc-400">Confirmation obligatoire</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Vous êtes sur le point de passer de <strong className="text-white">{getCategoryConfig(categorySwitchPending.from).label}</strong> à <strong className="text-gold">{getCategoryConfig(categorySwitchPending.to).label}</strong>.
            </p>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Des caractéristiques spécifiques sont déjà renseignées pour ce produit. Afin d&apos;éviter toute corruption de vos données, choisissez l&apos;action souhaitée :
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => confirmCategorySwitch(true)}
                className="w-full py-3 px-3.5 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer group"
              >
                <span>Conserver les caractéristiques compatibles</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button
                type="button"
                onClick={() => confirmCategorySwitch(false)}
                className="w-full py-3 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <span>Réinitialiser les caractéristiques spécifiques</span>
                <span>↺</span>
              </button>

              <button
                type="button"
                onClick={() => setCategorySwitchPending(null)}
                className="w-full py-2.5 px-3 rounded-xl bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white text-xs text-center transition-all cursor-pointer"
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
          {/* Backdrop sombre sécurisé : sur grand écran, demande confirmation si des données sont saisies ; sur mobile, ne ferme jamais accidentellement */}
          <div 
            className="absolute inset-0 bg-black/85 backdrop-blur-md" 
            onClick={requestCloseModal}
          ></div>
          
          <div className="glass-panel p-4 sm:p-8 rounded-none sm:rounded-3xl border-0 sm:border border-white/15 w-full h-full sm:h-auto sm:max-h-[92vh] max-w-4xl z-10 flex flex-col relative bg-[#0d0d11] sm:bg-[#0d0d11]/95 shadow-2xl">
            
            {/* Entête du Modal & Bascule Formulaire / Aperçu en direct */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                  {getCategoryIcon(formCategory, "w-5 h-5 text-gold")}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                    {editingId ? "Modifier le produit" : "Ajouter un produit"}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Catégorie active : <strong className="text-gold">{getCategoryConfig(formCategory).label}</strong>
                  </p>
                </div>
              </div>

              {/* Sélecteur de mode Formulaire / Aperçu */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalViewMode("form")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      modalViewMode === "form"
                        ? "bg-gold text-black shadow"
                        : "text-zinc-400 hover:text-white"
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
                        ? "bg-gold text-black shadow"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Aperçu en direct</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={requestCloseModal}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
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
                    setImageList([]);
                    setCommonFormData({
                      name: "",
                      brand: "",
                      price: "",
                      salePrice: "",
                      desc: "",
                      colors: "",
                      stock: "10",
                      condition: "neuf",
                      warranty: phoneConfig.defaultWarranty || "Garantie 12 Mois Certifiée",
                      accessories: phoneConfig.defaultAccessories || "",
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

                      {/* Variantes de stockage (SEULEMENT si la catégorie les autorise) */}
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

                      {/* Caractéristiques Spécifiques Renseignées */}
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

                  {/* 2. INFORMATIONS GÉNÉRALES COMMUNES */}
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

                      {/* Marque Fabricant avec suggestions intelligentes par catégorie */}
                      <div className="sm:col-span-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                          <label className="text-[11px] text-zinc-400 uppercase font-bold block">
                            Marque Fabricant
                          </label>
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
                                  onClick={() => setCommonFormData({ ...commonFormData, brand: brandName })}
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
                          onChange={e => setCommonFormData({ ...commonFormData, brand: e.target.value })} 
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

                      {/* Quantité en stock */}
                      <div>
                        <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                          Quantité en Stock
                        </label>
                        <input 
                          type="number" 
                          min="0"
                          value={commonFormData.stock} 
                          onChange={e => setCommonFormData({ ...commonFormData, stock: e.target.value })} 
                          placeholder="Ex: 10" 
                          className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-gold"
                        />
                      </div>

                      {/* Couleurs disponibles */}
                      <div>
                        <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                          Couleurs (séparées par une virgule)
                        </label>
                        <input 
                          type="text" 
                          value={commonFormData.colors} 
                          onChange={e => setCommonFormData({ ...commonFormData, colors: e.target.value })} 
                          placeholder="Ex: Noir Titane, Blanc, Or, Bleu" 
                          className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-gold"
                        />
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

                      {/* Description commerciale */}
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-zinc-400 uppercase font-bold block mb-1">
                          Description Commerciale <span className="text-red-400">*</span>
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

                  {/* 4. CARACTÉRISTIQUES SPÉCIFIQUES DYNAMIQUES PAR CATÉGORIE */}
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

                  {/* 5. VARIANTES MULTI-STOCKAGE (UNIQUEMENT SI LA CATÉGORIE LE SUPPORTE) */}
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
                          {["128 Go", "256 Go", "512 Go", "1 To", "2 To"].map((cap) => (
                            <button
                              key={cap}
                              type="button"
                              onClick={() => handleQuickAddStorage(cap)}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-gold hover:text-black text-zinc-300 text-[10px] font-bold border border-white/10 transition-all cursor-pointer"
                            >
                              + {cap}
                            </button>
                          ))}
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
