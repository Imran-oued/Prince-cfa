/**
 * Module de validation et d'assainissement des données produits
 * Prince CFA Mall — Validation client & serveur robuste
 */

import { PRODUCT_CATEGORIES, getCategoryConfig } from "../config/categories.ts";

export interface StorageOptionInput {
  capacity: string;
  price: number | string;
}

export interface ProductInput {
  id?: string | number;
  name: string;
  category: string;
  brand?: string;
  price: number | string;
  salePrice?: number | string | null;
  desc: string;
  image?: string;
  images?: string[];
  colors?: string[] | string;
  stock?: number | string;
  condition?: "neuf" | "occasion" | "reconditionne" | string;
  warranty?: string;
  accessories?: string;
  storageOptions?: StorageOptionInput[];
  shortDesc?: string;
  otherFeatures?: string[];
  variants?: Array<{
    id?: string;
    simType: string;
    simTypeId?: string;
    storage: string;
    color: string;
    price: number | string;
    active?: boolean;
    sku?: string;
  }>;
  specs?: Record<string, any>;
  [key: string]: any;
}

export interface ValidationResult {
  valid: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  errorList: string[];
  cleanedProduct?: any;
}

/**
 * Vérifier si une marque donnée correspond à Apple (iPhone)
 */
export function isAppleBrand(brand?: string): boolean {
  if (!brand) return false;
  const b = brand.trim().toLowerCase();
  return b === "apple" || b.includes("iphone") || b === "ios";
}

/**
 * Générer un slug lisible pour l'URL à partir du nom du produit
 */
export function generateSlug(name: string): string {
  if (!name) return "produit";
  return name
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères non alphanumériques
    .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
    .replace(/-+/g, "-") // Supprimer les tirets consécutifs
    .replace(/^-+|-+$/g, ""); // Supprimer les tirets au début et à la fin
}

/**
 * Assainir et convertir les valeurs numériques en respectant les types
 */
function cleanNumber(val: any, fieldName: string, min = 0, max = Infinity): { value?: number; error?: string } {
  if (val === undefined || val === null || val === "") {
    return { value: undefined };
  }
  const parsed = Number(val);
  if (isNaN(parsed) || !isFinite(parsed)) {
    return { error: `Le champ "${fieldName}" doit être un nombre valide.` };
  }
  if (parsed < min) {
    return { error: `Le champ "${fieldName}" ne peut pas être inférieur à ${min}.` };
  }
  if (parsed > max) {
    return { error: `Le champ "${fieldName}" ne peut pas être supérieur à ${max}.` };
  }
  return { value: parsed };
}

/**
 * Valider et normaliser un produit selon sa catégorie
 * Utilisé à la fois côté client (interface admin) et côté serveur (API /api/admin/products)
 */
export function validateAndCleanProduct(raw: ProductInput): ValidationResult {
  const errors: Record<string, string> = {};

  // 1. Validation des champs communs obligatoires
  const name = (raw.name || "").trim();
  if (!name) {
    errors.name = "Le nom du produit est obligatoire.";
  } else if (name.length < 2) {
    errors.name = "Le nom du produit doit comporter au moins 2 caractères.";
  }

  const category = (raw.category || "").trim();
  if (!category) {
    errors.category = "La catégorie du produit est obligatoire.";
  } else if (!PRODUCT_CATEGORIES[category] && category !== "all") {
    errors.category = `Catégorie inconnue : "${category}". Choisissez une catégorie valide.`;
  }

  // Validation du prix de vente (FCFA)
  const priceCheck = cleanNumber(raw.price, "Prix de vente", 1);
  if (priceCheck.error) {
    errors.price = priceCheck.error;
  } else if (priceCheck.value === undefined || priceCheck.value <= 0) {
    errors.price = "Le prix de vente est obligatoire et doit être supérieur à zéro.";
  }

  // Prix promotionnel facultatif
  let cleanSalePrice: number | null = null;
  if (raw.salePrice !== undefined && raw.salePrice !== null && raw.salePrice !== "") {
    const salePriceCheck = cleanNumber(raw.salePrice, "Prix promotionnel", 0);
    if (salePriceCheck.error) {
      errors.salePrice = salePriceCheck.error;
    } else if (salePriceCheck.value !== undefined) {
      if (priceCheck.value !== undefined && salePriceCheck.value >= priceCheck.value) {
        errors.salePrice = "Le prix promotionnel doit être inférieur au prix normal.";
      } else {
        cleanSalePrice = salePriceCheck.value;
      }
    }
  }

  // Stock
  const stockCheck = cleanNumber(raw.stock !== undefined ? raw.stock : 10, "Quantité en stock", 0);
  if (stockCheck.error) {
    errors.stock = stockCheck.error;
  }
  const cleanStock = stockCheck.value !== undefined ? Math.floor(stockCheck.value) : 0;

  // Description
  const desc = (raw.desc || "").trim();
  if (!desc) {
    errors.desc = "La description du produit est obligatoire.";
  }

  // Condition (État)
  const validConditions = ["neuf", "occasion", "reconditionne"];
  let condition = "neuf";
  if (raw.condition) {
    if (!validConditions.includes(raw.condition)) {
      errors.condition = `État du produit invalide ("${raw.condition}"). Choix autorisés: ${validConditions.join(", ")}.`;
    } else {
      condition = raw.condition;
    }
  }

  // Garantie & Accessoires
  const warranty = (raw.warranty || "").trim() || "Garantie 12 Mois Certifiée";
  let accessories: string | string[] = "";
  if (Array.isArray(raw.accessories)) {
    accessories = raw.accessories.map(a => String(a).trim()).filter(Boolean);
  } else if (typeof raw.accessories === "string") {
    accessories = raw.accessories.trim();
  }
  const brand = (raw.brand || "").trim();

  // Traitement des couleurs
  let colors: string[] = [];
  if (Array.isArray(raw.colors)) {
    colors = raw.colors.map(c => String(c).trim()).filter(Boolean);
  } else if (typeof raw.colors === "string" && raw.colors.trim()) {
    colors = raw.colors.split(",").map(c => c.trim()).filter(Boolean);
  }

  // Traitement des images
  let images: string[] = [];
  if (Array.isArray(raw.images) && raw.images.length > 0) {
    images = raw.images.map(img => String(img).trim()).filter(Boolean);
  } else if (raw.image) {
    images = [String(raw.image).trim()];
  }
  const mainImage = images[0] || (typeof raw.image === "string" && raw.image ? raw.image : "https://placehold.co/600x600/121216/d4af37?text=PRINCE+CFA");

  const catConfig = getCategoryConfig(category);
  const rawSpecs: Record<string, any> = raw.specs && typeof raw.specs === "object" ? { ...raw.specs } : {};
  if (!rawSpecs.model && name) {
    rawSpecs.model = name;
  }
  // Alias de rétrocompatibilité pour la batterie
  if (rawSpecs.battery !== undefined && rawSpecs.batteryCapacity === undefined) {
    rawSpecs.batteryCapacity = rawSpecs.battery;
  }
  const cleanedSpecs: Record<string, any> = {};

  for (const field of catConfig.fields) {
    const rawVal = rawSpecs[field.key];
    const hasValue = rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== "";

    if (field.required && !hasValue) {
      errors[`specs_${field.key}`] = `Le champ spécifique "${field.label}" est obligatoire pour la catégorie ${catConfig.label}.`;
      continue;
    }

    if (!hasValue) {
      // Les champs facultatifs non renseignés ne sont pas enregistrés (pas de valeurs fictives)
      continue;
    }

    if (field.type === "number" || field.key === "ram" || field.key === "battery") {
      const numVal = typeof rawVal === "string" ? rawVal.replace(/[^\d.]/g, "") : rawVal;
      const numCheck = cleanNumber(numVal, field.label, field.min ?? 0, field.max ?? Infinity);
      if (numCheck.error) {
        errors[`specs_${field.key}`] = numCheck.error;
      } else if (numCheck.value !== undefined) {
        cleanedSpecs[field.key] = numCheck.value;
      }
    } else if (field.type === "select") {
      const stringVal = String(rawVal).trim();
      if (field.options && field.options.length > 0) {
        // Recherche souple par valeur, libellé exact ou inclusion
        const matched = field.options.find(
          o => o.value.toLowerCase() === stringVal.toLowerCase() ||
               o.label.toLowerCase() === stringVal.toLowerCase() ||
               stringVal.toLowerCase().includes(o.value.toLowerCase()) ||
               o.label.toLowerCase().includes(stringVal.toLowerCase())
        );
        if (matched) {
          cleanedSpecs[field.key] = matched.value;
        } else if (!field.required) {
          cleanedSpecs[field.key] = stringVal;
        } else {
          errors[`specs_${field.key}`] = `Valeur invalide pour "${field.label}".`;
        }
      } else {
        cleanedSpecs[field.key] = stringVal;
      }
    } else {
      if (typeof rawVal === "boolean") {
        cleanedSpecs[field.key] = rawVal;
      } else {
        cleanedSpecs[field.key] = String(rawVal).trim();
      }
    }
  }

  // Garantir l'accès via battery ou batteryCapacity
  if (cleanedSpecs.batteryCapacity !== undefined && cleanedSpecs.battery === undefined) {
    cleanedSpecs.battery = cleanedSpecs.batteryCapacity;
  }

  // 3. Traitement des variantes de stockage (ex: iPhones, tablettes)
  let cleanedStorageOptions: Array<{ capacity: string; price: number }> = [];
  if (catConfig.supportsStorageVariants && Array.isArray(raw.storageOptions)) {
    cleanedStorageOptions = raw.storageOptions
      .map(opt => ({
        capacity: (opt.capacity || "").trim(),
        price: Number(opt.price) || (priceCheck.value || 0),
      }))
      .filter(opt => opt.capacity !== "" && opt.price >= 0);
  }

  // 4. Traitement de la tarification par type de SIM (iPhones)
  let cleanedSimPricing: Record<string, { enabled: boolean; delta: number; label: string }> | undefined = undefined;
  if (raw.simPricing && typeof raw.simPricing === "object") {
    cleanedSimPricing = {};
    for (const [key, val] of Object.entries(raw.simPricing)) {
      if (val && typeof val === "object") {
        const v = val as any;
        cleanedSimPricing[key] = {
          enabled: Boolean(v.enabled),
          delta: Number(v.delta) || 0,
          label: String(v.label || key).trim()
        };
      }
    }
  }

  // 5. Traitement des variantes croisées de prix (iPhones : SIM x Stockage x Couleur)
  let cleanedVariants: Array<{
    id: string;
    simType: string;
    simTypeId?: string;
    storage: string;
    color: string;
    price: number;
    active: boolean;
  }> | undefined = undefined;

  const isApple = category === "phones" && isAppleBrand(brand);

  if (isApple && Array.isArray(raw.variants) && raw.variants.length > 0) {
    cleanedVariants = raw.variants
      .map((v, i) => {
        const p = Number(v.price);
        return {
          id: String(v.id || `var-${i}-${Date.now()}`),
          simType: String(v.simType || "").trim(),
          simTypeId: String(v.simTypeId || "").trim(),
          storage: String(v.storage || "").trim(),
          color: String(v.color || "").trim(),
          price: !isNaN(p) && p > 0 ? p : (priceCheck.value || 0),
          active: v.active !== false,
        };
      })
      .filter(v => v.simType && v.storage && v.color);
  }

  // 6. Traitement des tags "Autres caractéristiques" pour iPhones
  let cleanedOtherFeatures: string[] | undefined = undefined;
  if (isApple && Array.isArray(raw.otherFeatures)) {
    cleanedOtherFeatures = raw.otherFeatures
      .map(f => String(f).trim())
      .filter(Boolean);
  }

  // 7. Description courte (exclusivement pour Apple / iPhone)
  const cleanShortDesc = isApple && raw.shortDesc ? String(raw.shortDesc).trim() : undefined;

  const isValid = Object.keys(errors).length === 0;

  // Si des erreurs existent, renvoyer les détails
  if (!isValid) {
    return {
      valid: false,
      isValid: false,
      errors,
      errorList: Object.values(errors),
    };
  }

  // Assemblage de l'objet produit assaini et prêt à persister
  const cleanedProduct = {
    id: raw.id || `p-${Date.now()}`,
    name,
    slug: generateSlug(name),
    category,
    brand,
    price: priceCheck.value!,
    ...(cleanSalePrice !== null ? { salePrice: cleanSalePrice } : {}),
    ...(cleanShortDesc ? { shortDesc: cleanShortDesc } : {}),
    desc,
    stock: cleanStock,
    condition,
    warranty,
    accessories,
    image: mainImage,
    images: images.length > 0 ? images : [mainImage],
    colors,
    specs: cleanedSpecs,
    ...(raw.imageBg ? { imageBg: raw.imageBg } : {}),
    ...(cleanedStorageOptions.length > 0 ? { storageOptions: cleanedStorageOptions } : {}),
    ...(cleanedSimPricing ? { simPricing: cleanedSimPricing } : {}),
    ...(cleanedVariants && cleanedVariants.length > 0 ? { variants: cleanedVariants } : {}),
    ...(cleanedOtherFeatures && cleanedOtherFeatures.length > 0 ? { otherFeatures: cleanedOtherFeatures } : {}),
    updatedAt: new Date().toISOString(),
    ...(raw.createdAt ? { createdAt: raw.createdAt } : { createdAt: new Date().toISOString() }),
  };

  return {
    valid: true,
    isValid: true,
    errors: {},
    errorList: [],
    cleanedProduct,
  };
}

/**
 * Rétrocompatibilité : normalise un produit existant pour garantir son affichage
 * sans perte d'information sur les 215 produits déjà créés.
 */
export function normalizeProductSpecs(product: any): any {
  if (!product) return null;
  const copy = { ...product };
  
  if (!copy.specs || typeof copy.specs !== "object") {
    copy.specs = {};
  } else {
    copy.specs = { ...copy.specs };
  }

  // Compatibilité générale processeur
  if (copy.specs.cpu && !copy.specs.processor) {
    copy.specs.processor = copy.specs.cpu;
  }

  // Extraction RAM numérique si chaîne (ex: "4 Go" -> 4)
  if (typeof copy.specs.ram === "string") {
    const match = copy.specs.ram.match(/(\d+)/);
    if (match) copy.specs.ram = parseInt(match[1], 10);
  }

  // Extraction Batterie numérique si chaîne (ex: "3240 mAh" -> 3240)
  if (typeof copy.specs.battery === "string") {
    const match = copy.specs.battery.match(/(\d+)/);
    if (match) copy.specs.battery = parseInt(match[1], 10);
  }

  // Mappage descendant pour ordinateurs
  if (copy.category === "computers" || copy.category === "tech") {
    if (copy.ram && !copy.specs.ram) copy.specs.ram = copy.ram;
    if (copy.processor && !copy.specs.processor) copy.specs.processor = copy.processor;
    if (copy.specs.screen && !copy.specs.screenSize) copy.specs.screenSize = copy.specs.screen;
  }

  // Mappage descendant pour motos
  if (copy.category === "mobility") {
    if (typeof copy.specs.motor === "string" && !copy.specs.motorPower) {
      const match = copy.specs.motor.match(/(\d+)/);
      if (match) copy.specs.motorPower = parseInt(match[1], 10);
    }
    if (typeof copy.specs.range === "string" && !copy.specs.rangeKm) {
      const match = copy.specs.range.match(/(\d+)/);
      if (match) copy.specs.rangeKm = parseInt(match[1], 10);
    }
    if (typeof copy.specs.speed === "string" && !copy.specs.maxSpeedKm) {
      const match = copy.specs.speed.match(/(\d+)/);
      if (match) copy.specs.maxSpeedKm = parseInt(match[1], 10);
    }
    if (typeof copy.specs.max_speed === "string" && !copy.specs.maxSpeedKm) {
      const match = copy.specs.max_speed.match(/(\d+)/);
      if (match) copy.specs.maxSpeedKm = parseInt(match[1], 10);
    }
  }

  return copy;
}

/**
 * Détermine le style de fond du conteneur d'image :
 * - Fond blanc épuré par défaut pour tous les produits (catalogue officiel Apple et photos réelles ajoutées),
 *   assurant un cadrage net, lumineux et professionnel en harmonie avec le thème blanc du site.
 * - Le choix explicite 'black' reste honoré si expressément sélectionné par l'administrateur.
 */
export function getProductImageBg(product?: any, imageSrc?: string): {
  containerClass: string;
  isBlack: boolean;
} {
  // 1. Choix explicite 'black' si expressément spécifié
  if (product?.imageBg === 'black' || product?.bgBlack === true) {
    return { containerClass: 'bg-black border border-white/10', isBlack: true };
  }

  // 2. Par défaut pour tous les produits (catalogue officiel Apple, smartphone, uploads réels, moto, réfrigérateur, etc.)
  // -> Fond blanc pur pour un rendu professionnel, épuré et parfaitement optimisé
  return { containerClass: 'bg-white', isBlack: false };
}
