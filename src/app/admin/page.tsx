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
  Clock
} from "lucide-react";

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
  category: string;
  price: number;
  desc?: string;
  image: string;
  brand?: string;
  rating?: number;
  colors?: string[];
  images?: string[];
  storageOptions?: StorageOption[];
  specs?: Record<string, string | number | boolean | undefined>;
  stock?: number;
  condition?: "neuf" | "occasion" | string;
  warranty?: string;
  accessories?: string;
  ram?: string;
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
  
  const [formData, setFormData] = useState({
    name: "",
    category: "tech",
    brand: "",
    price: "",
    desc: "",
    image: "https://placehold.co/600x600/121216/d4af37?text=NOUVEAU",
    colors: "",
    images: "",
    storageOptions: "",
    stock: "10",
    condition: "neuf",
    warranty: "Garantie 12 Mois Certifiée",
    accessories: "",
    ram: ""
  });

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
            if (defaultMatch && (String(p.id).startsWith('pcfa-17') || String(p.id).startsWith('pcfa-18'))) {
              return {
                ...p,
                image: defaultMatch.image,
                images: defaultMatch.images,
                colors: defaultMatch.colors,
                specs: defaultMatch.specs,
                desc: defaultMatch.desc,
                storageOptions: defaultMatch.storageOptions
              };
            }
            return p;
          });
          const existingIds = new Set(migrated.map((p: AdminProduct) => String(p.id)));
          const newDefaults = defaultProducts.filter(dp => !existingIds.has(String(dp.id)));
          const combined = [...migrated, ...newDefaults];
          setProductsList(combined);
        } catch {
          setProductsList(defaultProducts);
        }
      } else {
        setProductsList(defaultProducts);
      }

      // 2. Commandes
      try {
        const loadedOrders = (await getOrders()) as OrderRecord[];
        if (loadedOrders && Array.isArray(loadedOrders)) {
          setOrdersList(loadedOrders);
        }
      } catch (err) {
        console.warn("Erreur chargement commandes:", err);
      }
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
      
      // Recharger les commandes fraîches depuis l'API
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
  };

  // Recharger manuellement les commandes
  const refreshOrders = async () => {
    try {
      const ordersRes = await fetch("/api/admin/orders", {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
      });
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        if (data.orders) setOrdersList(data.orders);
      }
    } catch {
      const local = (await getOrders()) as OrderRecord[];
      if (local) setOrdersList(local);
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
        `Votre commande est désormais validée et en cours de préparation dans notre showroom !\n\n` +
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
      message = `👑 *PRINCE CFA - APPAREIL PRÊT AU SHOWROOM*\n\n` +
        `Bonjour *${order.customer.name}*,\n` +
        `Votre commande *${order.id}* est prête et disponible dans notre Showroom à Ouagadougou ! 🏬\n\n` +
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
        // Ajouter les nouvelles images : les nouveaux fichiers sélectionnés sont ajoutés
        // Le 1er fichier de la sélection devient l'image principale si aucune n'existait ou si souhaité
        setImageList(prev => {
          const updated = [...compressedUrls, ...prev.filter(old => !compressedUrls.includes(old))];
          setFormData(f => ({ ...f, image: updated[0] }));
          return updated;
        });
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
    setFormData(prev => ({ ...prev, image: updated[0] }));
  };

  // Supprimer une photo de la liste
  const handleRemoveImage = (index: number) => {
    const updated = imageList.filter((_, i) => i !== index);
    setImageList(updated);
    setFormData(prev => ({ 
      ...prev, 
      image: updated.length > 0 ? updated[0] : "https://placehold.co/600x600/121216/d4af37?text=NOUVEAU" 
    }));
  };

  // Ajouter une photo via lien URL
  const handleAddImageUrl = (urlToAdd: string) => {
    const trimmed = urlToAdd.trim();
    if (!trimmed) return;
    if (imageList.includes(trimmed)) {
      setNewImageUrl("");
      return;
    }
    const updated = [...imageList, trimmed];
    setImageList(updated);
    if (updated.length === 1) {
      setFormData(prev => ({ ...prev, image: updated[0] }));
    }
    setNewImageUrl("");
  };

  // Gestion des cases de stockage successives
  const handleAddStorageItem = (capacity = "", price = "") => {
    setStorageItems(prev => [
      ...prev,
      { capacity, price: price || formData.price || "" }
    ]);
  };

  const handleQuickAddStorage = (cap: string) => {
    if (storageItems.some(item => item.capacity.trim().toLowerCase() === cap.trim().toLowerCase())) {
      return;
    }
    setStorageItems(prev => [
      ...prev,
      { capacity: cap, price: formData.price || "" }
    ]);
  };

  const handleUpdateStorageItem = (index: number, field: "capacity" | "price", val: string) => {
    setStorageItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: val } : item));
  };

  const handleRemoveStorageItem = (index: number) => {
    setStorageItems(prev => prev.filter((_, i) => i !== index));
  };

  // Sauvegarder un produit (Ajout ou Édition)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const parsedColors = formData.colors 
      ? formData.colors.split(",").map(c => c.trim()).filter(c => c)
      : [];

    // Détermination de l'image principale (1ère image) et de la liste complète des photos
    const mainImage = imageList.length > 0 ? imageList[0] : (formData.image || "https://placehold.co/600x600/121216/d4af37?text=NOUVEAU");
    const allImages = imageList.length > 0 ? imageList : (mainImage ? [mainImage] : []);

    // Conversion propre des cases de stockage & prix
    const parsedStorage: StorageOption[] = storageItems
      .filter(item => item.capacity.trim() !== "")
      .map(item => ({
        capacity: item.capacity.trim(),
        price: Number(item.price) || Number(formData.price) || 0
      }));
    
    const productPayload = {
      name: formData.name,
      category: formData.category,
      brand: formData.brand || "",
      price: Number(formData.price),
      desc: formData.desc,
      image: mainImage,
      colors: parsedColors,
      images: allImages,
      stock: Number(formData.stock) || 0,
      condition: formData.condition,
      warranty: formData.warranty,
      accessories: formData.accessories,
      ...(formData.ram ? { ram: formData.ram } : {}),
      ...(parsedStorage.length > 0 ? { storageOptions: parsedStorage } : {})
    };

    let updatedList;
    
    if (editingId) {
      if (isCloud && typeof editingId === "string" && !editingId.startsWith("p-") && !editingId.startsWith("phone-") && !editingId.startsWith("shoe-") && !editingId.startsWith("bag-")) {
        await updateProductFirestore(editingId, productPayload);
      }
      updatedList = productsList.map(p => 
        p.id === editingId ? { ...p, ...productPayload } : p
      );
    } else {
      const newId: string = generateProductId();
      if (isCloud) {
        const firestoreId = await addProductFirestore({
          ...productPayload,
          rating: 5.0,
          specs: { info: "Spécifications à ajouter" }
        });
        if (firestoreId) {
          // Utiliser l'ID généré par Firestore
        }
      }
      const newProduct = {
        id: newId,
        ...productPayload,
        rating: 5.0,
        specs: { info: "Spécifications à ajouter" }
      };
      updatedList = [newProduct, ...productsList];
    }

    setProductsList(updatedList);
    localStorage.setItem("prince_cfa_products", JSON.stringify(updatedList));
    setIsSaving(false);
    closeModal();
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      if (isCloud && typeof id === "string" && !id.startsWith("p-") && !id.startsWith("phone-") && !id.startsWith("shoe-") && !id.startsWith("bag-")) {
        await deleteProductFirestore(id);
      }
      const updatedList = productsList.filter(p => p.id !== id);
      setProductsList(updatedList);
      localStorage.setItem("prince_cfa_products", JSON.stringify(updatedList));
    }
  };

  const openModalForEdit = (product: AdminProduct) => {
    // Initialisation des images : le produit image est toujours en tête
    let initialImages: string[] = [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      initialImages = [...product.images];
    } else if (product.image) {
      initialImages = [product.image];
    }
    if (product.image && !initialImages.includes(product.image)) {
      initialImages.unshift(product.image);
    } else if (product.image && initialImages[0] !== product.image) {
      initialImages = [product.image, ...initialImages.filter(img => img !== product.image)];
    }
    setImageList(initialImages);

    // Initialisation des cases de stockage (nettoyage de tout null/undefined)
    let initialStorage: StorageEntry[] = [];
    if (product.storageOptions && Array.isArray(product.storageOptions) && product.storageOptions.length > 0) {
      initialStorage = product.storageOptions.map((o: StorageOption) => {
        const hasValidPrice = o.price !== null && o.price !== undefined && !isNaN(Number(o.price));
        return {
          capacity: o.capacity || "",
          price: hasValidPrice ? String(o.price) : String(product.price || "")
        };
      });
    }
    setStorageItems(initialStorage);
    setNewImageUrl("");

    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand || "",
      price: product.price.toString(),
      desc: product.desc || "",
      image: product.image,
      colors: product.colors ? product.colors.join(", ") : "",
      images: initialImages.join(", "),
      storageOptions: "",
      stock: (product.stock !== undefined ? product.stock : 10).toString(),
      condition: product.condition || "neuf",
      warranty: product.warranty || "Garantie 12 Mois Certifiée",
      accessories: product.accessories || "",
      ram: product.ram || (product.specs?.ram ? String(product.specs.ram) : "")
    });
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setImageList([]);
    setStorageItems([]);
    setNewImageUrl("");
    setFormData({ 
      name: "", 
      category: "tech", 
      brand: "", 
      price: "", 
      desc: "", 
      image: "https://placehold.co/600x600/121216/d4af37?text=NOUVEAU", 
      colors: "", 
      images: "",
      storageOptions: "",
      stock: "10",
      condition: "neuf",
      warranty: "Garantie 12 Mois Certifiée",
      accessories: "",
      ram: ""
    });
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
                      <Store className="w-3.5 h-3.5 text-gold" aria-hidden="true" /> Showroom
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
                            <span>Retrait Showroom</span>
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
                      <span>Retrait au Showroom</span>
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
                      <span>Prêt Showroom</span>
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
                onClick={() => {
                  setEditingId(null);
                  setImageList([]);
                  setStorageItems([]);
                  setNewImageUrl("");
                  setFormData({
                    name: "",
                    category: "phones",
                    brand: "Iphones",
                    price: "",
                    desc: "",
                    image: "https://placehold.co/600x600/121216/d4af37?text=NOUVEAU",
                    colors: "",
                    images: "",
                    storageOptions: "",
                    stock: "10",
                    condition: "neuf",
                    warranty: "Garantie 12 Mois Certifiée",
                    accessories: "",
                    ram: ""
                  });
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
              >
                + Ajouter Produit
              </button>
            </div>
          </div>

          {syncStatus && (
            <div className="bg-gold/10 border-b border-gold/30 px-6 py-2 text-gold text-xs text-center font-medium animate-in fade-in flex items-center justify-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              <span>{syncStatus}</span>
            </div>
          )}

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
                {productsList.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-black/50 p-1 border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm">{product.name}</div>
                          <div className="text-zinc-500 text-xs line-clamp-1 max-w-[250px]">{product.desc}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-white/10 text-zinc-300 text-xs uppercase font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">
                      {product.price.toLocaleString('fr-FR')} <span className="text-gold text-xs">FCFA</span>
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
                {productsList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-500">Aucun produit dans le catalogue.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Ajout/Modification Produit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 w-full max-w-xl z-10 max-h-[90vh] overflow-y-auto relative">
            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
              {editingId ? "Modifier le produit" : "Ajouter au catalogue"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Nom du produit</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-gold/50 outline-none" placeholder="Ex: iPhone 14 Pro Max" />
                </div>
                
                <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Catégorie</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-gold/50 outline-none">
                    <option value="phones">Téléphones</option>
                    <option value="tv">TV & Écrans</option>
                    <option value="tech">High-Tech</option>
                    <option value="audio">Boomers</option>
                    <option value="mobility">Motos Électriques</option>
                    <option value="solar">Solaire</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Marque (Optionnel)</label>
                  <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-gold/50 outline-none" placeholder="Ex: Apple, Samsung, Google Pixel..." />
                </div>

                <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Prix de base (FCFA)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-gold/50 outline-none" placeholder="Ex: 850000" />
                </div>

                {/* Upload et sélection multi-photos (La 1ère est l'image principale) */}
                <div className="col-span-2 p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Camera className="w-4 h-4 text-gold" aria-hidden="true" />
                        <span>Photos du Produit (Multi-fichiers)</span>
                      </label>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Sélectionnez <strong className="text-gold">plusieurs fichiers</strong> dans votre explorateur. Le <strong className="text-white">premier fichier</strong> sera automatiquement l&apos;image principale du produit.
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

                  {/* Galerie visuelle des photos sélectionnées */}
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
                            
                            {/* Badge Image Principale ou Numéro */}
                            <div className="absolute top-1.5 left-1.5 pointer-events-none">
                              {index === 0 ? (
                                <span className="px-2 py-0.5 rounded-md bg-gold text-black text-[10px] font-black uppercase tracking-wider shadow inline-flex items-center gap-1">
                                  <Crown className="w-3 h-3" aria-hidden="true" />
                                  <span>Principale</span>
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-md bg-black/80 text-zinc-300 text-[10px] font-bold border border-white/10">
                                  Photo #{index + 1}
                                </span>
                              )}
                            </div>

                            {/* Bouton de suppression rapide */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-red-600/80 hover:bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                              title="Supprimer cette image"
                              aria-label="Supprimer cette photo"
                            >
                              <X className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>

                          {/* Bouton pour définir comme 1ère (Image Principale) */}
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
                      Aucune photo sélectionnée. Cliquez sur <strong className="text-zinc-300">Choisir des fichiers</strong> pour ajouter vos photos.
                    </div>
                  )}

                  {/* Option alternative : Coller une URL */}
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

                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Couleurs disponibles</label>
                  <input 
                    type="text" 
                    value={formData.colors} 
                    onChange={e => setFormData({...formData, colors: e.target.value})} 
                    className="bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-gold/50 outline-none" 
                    placeholder="Ex: Noir Titane, Blanc, Or, Bleu" 
                  />
                </div>

                {/* OPTIONS STOCKAGE & PRIX SPÉCIFIQUES DANS DIFFÉRENTES CASES SUCCESSIVES */}
                {(formData.category === "phones" || formData.category === "tech" || storageItems.length > 0) && (
                  <div className="col-span-2 p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-gold" aria-hidden="true" />
                          <span>Options de Stockage & Prix Spécifiques</span>
                        </label>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Chaque option est affichée successivement dans des cases distinctes (Capacité et Prix).
                        </p>
                      </div>

                      {/* Raccourcis d'ajout rapide */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold mr-1">Raccourcis :</span>
                        {["128 Go", "256 Go", "512 Go", "1 To"].map((cap) => (
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

                    {/* Liste des cases successives */}
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

                            {/* Case 1: Capacité / Stockage */}
                            <div className="flex-1">
                              <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                                Case Stockage (Capacité)
                              </label>
                              <input 
                                type="text" 
                                value={item.capacity} 
                                onChange={(e) => handleUpdateStorageItem(idx, "capacity", e.target.value)}
                                placeholder="Ex: 256 Go" 
                                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-semibold focus:border-gold/50 outline-none"
                              />
                            </div>

                            {/* Case 2: Prix en FCFA */}
                            <div className="flex-1">
                              <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                                Case Prix (FCFA)
                              </label>
                              <input 
                                type="number" 
                                value={item.price} 
                                onChange={(e) => handleUpdateStorageItem(idx, "price", e.target.value)}
                                placeholder={`Ex: ${formData.price || "625000"}`} 
                                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-bold text-gold focus:border-gold/50 outline-none"
                              />
                            </div>

                            {/* Bouton Supprimer */}
                            <div className="pt-4 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => handleRemoveStorageItem(idx)}
                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-colors cursor-pointer"
                                title="Supprimer cette case de stockage"
                                aria-label={`Supprimer l'option de stockage ${item.capacity || idx + 1}`}
                              >
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-zinc-500 text-xs">
                        Aucune option de stockage. Utilisez les raccourcis ci-dessus ou le bouton ci-dessous pour ajouter des cases.
                      </div>
                    )}

                    {/* Bouton d'ajout d'une nouvelle case */}
                    <button
                      type="button"
                      onClick={() => handleAddStorageItem("", formData.price || "")}
                      className="w-full py-2.5 rounded-xl border border-dashed border-white/20 hover:border-gold text-zinc-300 hover:text-gold text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer bg-white/[0.01] hover:bg-gold/5"
                    >
                      <span>+</span>
                      <span>Ajouter une case de stockage & prix</span>
                    </button>
                  </div>
                )}

                {/* Caractéristiques Technologiques Spécifiques */}
                <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Quantité en Stock</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.stock} 
                    onChange={e => setFormData({...formData, stock: e.target.value})} 
                    className="bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-gold/50 outline-none" 
                    placeholder="Ex: 15" 
                  />
                </div>

                <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">État de l&apos;Appareil</label>
                  <select 
                    value={formData.condition} 
                    onChange={e => setFormData({...formData, condition: e.target.value})} 
                    className="bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-gold/50 outline-none"
                  >
                    <option value="neuf">Neuf sous blister scellé</option>
                    <option value="occasion">Occasion Certifiée A+</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Garantie Vendeur</label>
                  <input 
                    type="text" 
                    value={formData.warranty} 
                    onChange={e => setFormData({...formData, warranty: e.target.value})} 
                    className="bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-gold/50 outline-none" 
                    placeholder="Ex: Garantie 12 Mois Certifiée" 
                  />
                </div>

                <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Mémoire RAM (Optionnel)</label>
                  <input 
                    type="text" 
                    value={formData.ram} 
                    onChange={e => setFormData({...formData, ram: e.target.value})} 
                    className="bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-gold/50 outline-none" 
                    placeholder="Ex: 8 Go RAM, 16 Go unifiée" 
                  />
                </div>

                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Accessoires Inclus dans la Boîte</label>
                  <input 
                    type="text" 
                    value={formData.accessories} 
                    onChange={e => setFormData({...formData, accessories: e.target.value})} 
                    className="bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-gold/50 outline-none" 
                    placeholder="Ex: Chargeur rapide 20W, Câble tressé officiel, Écouteurs" 
                  />
                </div>
                
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Description</label>
                  <textarea required rows={3} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-gold/50 outline-none resize-none" placeholder="Description luxueuse..."></textarea>
                </div>
              </div>

              <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
                <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors cursor-pointer">
                  Annuler
                </button>
                <button type="submit" disabled={isSaving} className="flex-1 py-3 rounded-xl bg-gold text-black font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50 cursor-pointer">
                  {isSaving ? "Enregistrement..." : (editingId ? "Mettre à jour" : "Créer")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
