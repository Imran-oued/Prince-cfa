import { test } from "node:test";
import assert from "node:assert/strict";
import { 
  validateAndCleanProduct, 
  generateSlug, 
  normalizeProductSpecs,
  getProductImageBg,
  isAppleBrand,
  isProductComingSoon
} from "../src/lib/productValidation.ts";
import { 
  PRODUCT_CATEGORIES, 
  getCategoryConfig, 
  isStorageVariantCategory,
  IPHONE_SIM_TYPES,
  IPHONE_OFFICIAL_COLORS
} from "../src/config/categories.ts";

test("1. Category definitions are declarative, complete, and have units", () => {
  assert.ok(Object.keys(PRODUCT_CATEGORIES).length >= 7, "Au moins 7 catégories configurées");
  
  const expectedCats = ["phones", "computers", "tablets", "mobility", "accessories", "tv", "audio", "solar"];
  for (const catId of expectedCats) {
    const config = getCategoryConfig(catId);
    assert.ok(config, `La configuration pour ${catId} doit exister`);
    assert.ok(config.label, `Le libellé pour ${catId} doit être défini`);
    assert.ok(Array.isArray(config.fields), `Les champs pour ${catId} doivent être un tableau`);
    assert.ok(config.fields.length > 0, `Au moins un champ pour ${catId}`);
  }

  // Vérification des unités déclaratives
  const motoConfig = getCategoryConfig("mobility");
  const motorField = motoConfig.fields.find(f => f.key === "motorPower");
  assert.equal(motorField.unit, "W", "Unité de puissance moteur = W");
  const rangeField = motoConfig.fields.find(f => f.key === "rangeKm");
  assert.equal(rangeField.unit, "km", "Unité d'autonomie = km");
  const speedField = motoConfig.fields.find(f => f.key === "maxSpeedKm");
  assert.equal(speedField.unit, "km/h", "Unité de vitesse = km/h");

  const pcConfig = getCategoryConfig("computers");
  const ramField = pcConfig.fields.find(f => f.key === "ram");
  assert.equal(ramField.unit, "Go", "Unité RAM = Go");

  // Catégories éligibles aux variantes de stockage à prix multiples
  assert.equal(isStorageVariantCategory("phones"), true);
  assert.equal(isStorageVariantCategory("computers"), true);
  assert.equal(isStorageVariantCategory("tablets"), true);
  assert.equal(isStorageVariantCategory("promotion"), true);
  assert.equal(isStorageVariantCategory("mobility"), false);
  assert.equal(isStorageVariantCategory("accessories"), false);

  // Catégorie PROMOTION
  const promoConfig = getCategoryConfig("promotion");
  assert.ok(promoConfig, "Configuration promotion doit exister");
  assert.equal(promoConfig.label, "PROMOTION");
  assert.equal(getCategoryConfig("promotions").id, "promotion");
});

test("2. Slug generation is URL-safe and idempotent", () => {
  const slug1 = generateSlug("iPhone 15 Pro Max (256 Go) - Titane Bleu");
  assert.equal(slug1, "iphone-15-pro-max-256-go-titane-bleu");

  const slug2 = generateSlug("Super Moto Électrique 5000W / 72V !");
  assert.equal(slug2, "super-moto-electrique-5000w-72v");

  const slug3 = generateSlug("   Écran Dell UltraSharp 27\"   ");
  assert.equal(slug3, "ecran-dell-ultrasharp-27");
});

test("3. Validation & sanitization of a Phone (Smartphones)", () => {
  const rawPayload = {
    name: "iPhone 15 Pro Max",
    category: "phones",
    brand: "Apple",
    price: "850000",
    salePrice: "799000",
    stock: "12",
    condition: "neuf",
    warranty: "1 an constructeur",
    desc: "Le summum de la technologie Apple avec puce A17 Pro et cadre titane.",
    image: "https://example.com/iphone15.jpg",
    images: ["https://example.com/iphone15-1.jpg", "https://example.com/iphone15-2.jpg"],
    colors: ["Titane Naturel", "Titane Bleu", "Titane Noir"],
    accessories: ["Câble USB-C", "Boîte d'origine"],
    storageOptions: [
      { capacity: "256 Go", price: "799000" },
      { capacity: "512 Go", price: "899000" },
      { capacity: "1 To", price: "999000" }
    ],
    specs: {
      screen: "6.7 pouces Super Retina XDR OLED 120Hz",
      processor: "A17 Pro (3 nm)",
      ram: "8", // Chaîne qui doit être convertie en nombre
      battery: "4422", // Chaîne qui doit être convertie en nombre
      cameraMain: "48 MP (grand-angle) + 12 MP (téléobjectif 5x)",
      cameraSelfie: "12 MP TrueDepth",
      os: "iOS 17",
      sim: "nano_esim",
      fastCharging: true,
      wirelessCharging: true,
      waterResistant: true
    }
  };

  const result = validateAndCleanProduct(rawPayload);
  assert.equal(result.isValid, true, `La validation doit réussir: ${result.errorList.join(", ")}`);
  assert.ok(result.cleanedProduct);

  const p = result.cleanedProduct;
  assert.equal(p.name, "iPhone 15 Pro Max");
  assert.equal(p.slug, "iphone-15-pro-max");
  assert.equal(p.price, 850000, "Le prix principal doit être un nombre");
  assert.equal(p.salePrice, 799000, "Le prix promo doit être un nombre");
  assert.equal(p.stock, 12, "Le stock doit être un nombre");
  assert.equal(p.condition, "neuf");

  // Spécifications numériques nettoyées
  assert.equal(typeof p.specs.ram, "number", "RAM doit être convertie en nombre");
  assert.equal(p.specs.ram, 8);
  assert.equal(typeof p.specs.battery, "number", "Batterie doit être convertie en nombre");
  assert.equal(p.specs.battery, 4422);

  // Variantes de stockage
  assert.equal(p.storageOptions.length, 3);
  assert.equal(p.storageOptions[0].capacity, "256 Go");
  assert.equal(p.storageOptions[0].price, 799000);
});

test("4. Validation & sanitization of a Computer (Laptops & Desktops)", () => {
  const rawPayload = {
    name: "Dell XPS 15 9530",
    category: "computers",
    brand: "Dell",
    price: 1250000,
    stock: 5,
    condition: "neuf",
    desc: "Station de travail mobile haute performance avec écran OLED 3.5K.",
    image: "https://example.com/xps15.jpg",
    specs: {
      computerType: "laptop",
      processor: "Intel Core i7-13700H (14 cœurs)",
      ram: 32, // RAM numérique
      storageSize: "1 To",
      storageType: "ssd_nvme",
      gpu: "NVIDIA GeForce RTX 4060 8 Go",
      screenSize: "15.6",
      os: "win11_pro"
    }
  };

  const result = validateAndCleanProduct(rawPayload);
  assert.equal(result.isValid, true, `Validation Dell XPS réussie: ${result.errorList.join(", ")}`);
  
  const p = result.cleanedProduct;
  assert.equal(p.specs.ram, 32);
  assert.equal(typeof p.specs.ram, "number");
  assert.equal(p.specs.storageSize, "1 To");
  assert.equal(p.specs.storageType, "ssd_nvme");
  assert.equal(p.specs.screenSize, "15.6");
  assert.equal(p.specs.os, "win11_pro");

  // Si non renseigné, storageOptions n'est pas défini
  assert.equal(p.storageOptions, undefined, "storageOptions ne doit pas exister si non fourni");
});

test("5. Validation & sanitization of an Electric Motorcycle (Mobility)", () => {
  const rawPayload = {
    name: "Moto Électrique Prince Thunder 5000",
    category: "mobility",
    brand: "Super SOCO",
    price: 1450000,
    stock: 3,
    condition: "neuf",
    desc: "Moto 100% électrique urbaine et périurbaine, zéro émission et accélération instantanée.",
    image: "https://example.com/thunder.jpg",
    specs: {
      vehicleType: "moto",
      motorPower: "5000", // doit être un nombre pur (W), l'unité est déclarée dans la config
      batteryCapacityWh: "3840", // Wh
      batteryVoltage: "72", // V
      batteryType: "lithium_removable",
      rangeKm: "120", // km
      maxSpeedKm: "95", // km/h
      chargingTimeHours: "4.5", // heures
      brakes: "Double disque hydraulique CBS avant/arrière",
      licenseRequired: true
    }
  };

  const result = validateAndCleanProduct(rawPayload);
  assert.equal(result.isValid, true, `Validation Moto réussie: ${result.errorList.join(", ")}`);

  const p = result.cleanedProduct;
  // Les grandeurs physiques doivent être des nombres purs pour faciliter futurs filtres et tris
  assert.equal(p.specs.motorPower, 5000);
  assert.equal(typeof p.specs.motorPower, "number");
  assert.equal(p.specs.batteryCapacityWh, 3840);
  assert.equal(typeof p.specs.batteryCapacityWh, "number");
  assert.equal(p.specs.rangeKm, 120);
  assert.equal(typeof p.specs.rangeKm, "number");
  assert.equal(p.specs.maxSpeedKm, 95);
  assert.equal(typeof p.specs.maxSpeedKm, "number");
  assert.equal(p.specs.batteryType, "lithium_removable");
});

test("6. Validation & sanitization of a Tablet and Tech Accessory", () => {
  // Tablet
  const tabletPayload = {
    name: "iPad Pro 11 M4",
    category: "tablets",
    brand: "Apple",
    price: 750000,
    stock: 8,
    desc: "Écran Ultra Retina XDR Tandem OLED avec puce Apple M4.",
    image: "https://example.com/ipad.jpg",
    storageOptions: [
      { capacity: "256 Go", price: 750000 },
      { capacity: "512 Go", price: 880000 }
    ],
    specs: {
      screenSize: "11 pouces Ultra Retina",
      storageSize: "256 Go",
      connectivity: "wifi_cellular",
      stylusSupport: "Apple Pencil Pro",
      processor: "Apple M4"
    }
  };

  const tabletRes = validateAndCleanProduct(tabletPayload);
  assert.equal(tabletRes.isValid, true, `Validation tablette réussie: ${tabletRes.errorList.join(", ")}`);
  assert.equal(tabletRes.cleanedProduct.specs.screenSize, "11 pouces Ultra Retina");
  assert.equal(tabletRes.cleanedProduct.specs.storageSize, "256 Go");
  assert.equal(tabletRes.cleanedProduct.specs.connectivity, "wifi_cellular");
  assert.equal(tabletRes.cleanedProduct.storageOptions.length, 2);

  // Accessory
  const accPayload = {
    name: "Chargeur Rapide GaN 65W Multi-Ports",
    category: "accessories",
    brand: "Anker",
    price: 25000,
    stock: 50,
    desc: "Chargeur ultra compact pour ordinateurs portables, tablettes et smartphones.",
    image: "https://example.com/gan65w.jpg",
    specs: {
      accessoryType: "chargeur",
      compatibility: "iPhone, Samsung, MacBook, Dell, HP (USB-C Power Delivery)",
      wireless: false,
      color: "Noir mat"
    }
  };

  const accRes = validateAndCleanProduct(accPayload);
  assert.equal(accRes.isValid, true);
  assert.equal(accRes.cleanedProduct.specs.accessoryType, "charger");
  assert.equal(accRes.cleanedProduct.storageOptions, undefined, "Accessoires n'ont pas de storageOptions");
});

test("7. Cross-category field leakage prevention: unwanted fields are stripped", () => {
  const dirtyPayload = {
    name: "Smartphone Infiltré",
    category: "phones",
    price: 300000,
    desc: "Un téléphone contenant par erreur des champs de moto et d'ordinateur.",
    image: "https://example.com/test.jpg",
    specs: {
      screen: "6.5 pouces",
      processor: "Snapdragon 8 Gen 2",
      ram: 12,
      // Champs orphelins appartenant à d'autres catégories :
      motorPower: 5000,
      rangeKm: 150,
      computerType: "desktop",
      keyboardLayout: "AZERTY",
      accessoryType: "cable"
    }
  };

  const result = validateAndCleanProduct(dirtyPayload);
  assert.equal(result.isValid, true);
  const specs = result.cleanedProduct.specs;
  
  // Champs légitimes conservés
  assert.equal(specs.screen, "6.5 pouces");
  assert.equal(specs.processor, "Snapdragon 8 Gen 2");
  assert.equal(specs.ram, 12);

  // Fuites nettoyées et isolées
  assert.equal(specs.motorPower, undefined, "motorPower ne doit pas fuiter dans phones");
  assert.equal(specs.rangeKm, undefined, "rangeKm ne doit pas fuiter dans phones");
  assert.equal(specs.computerType, undefined, "computerType ne doit pas fuiter dans phones");
  assert.equal(specs.keyboardLayout, undefined, "keyboardLayout ne doit pas fuiter dans phones");
  assert.equal(specs.accessoryType, undefined, "accessoryType ne doit pas fuiter dans phones");
});

test("8. Strict validation error handling", () => {
  // Nom manquant
  const noName = validateAndCleanProduct({ category: "phones", price: 10000, desc: "Sans nom" });
  assert.equal(noName.isValid, false);
  assert.ok(noName.errorList.some(e => e.includes("nom")));

  // Catégorie invalide
  const badCat = validateAndCleanProduct({ name: "Produit X", category: "vaisseaux_spatiaux", price: 10000 });
  assert.equal(badCat.isValid, false);
  assert.ok(badCat.errorList.some(e => e.includes("Catégorie inconnue")));

  // Prix négatif
  const negPrice = validateAndCleanProduct({ name: "Produit Prix Négatif", category: "phones", price: -5000 });
  assert.equal(negPrice.isValid, false);
  assert.ok(negPrice.errorList.some(e => e.toLowerCase().includes("prix")));

  // Prix nul
  const zeroPrice = validateAndCleanProduct({ name: "Produit Gratuit", category: "phones", price: 0 });
  assert.equal(zeroPrice.isValid, false);

  // Stock négatif
  const negStock = validateAndCleanProduct({ name: "Produit Stock Neg", category: "phones", price: 50000, stock: -4 });
  assert.equal(negStock.isValid, false);
  assert.ok(negStock.errorList.some(e => e.includes("stock")));

  // Prix promo supérieur ou égal au prix standard
  const badSalePrice = validateAndCleanProduct({ 
    name: "Produit Promo Aberrante", 
    category: "phones", 
    price: 100000, 
    salePrice: 120000 
  });
  assert.equal(badSalePrice.isValid, false);
  assert.ok(badSalePrice.errorList.some(e => e.includes("promotionnel")));

  // Condition invalide
  const badCondition = validateAndCleanProduct({ 
    name: "Produit Condition Inconnue", 
    category: "phones", 
    price: 100000, 
    condition: "detruit" 
  });
  assert.equal(badCondition.isValid, false);
  assert.ok(badCondition.errorList.some(e => e.includes("État")));
});

test("9. Backward compatibility: normalizeProductSpecs bridges legacy products seamlessly", () => {
  // Produit Téléphone legacy
  const legacyPhone = {
    category: "phones",
    specs: {
      screen: "6.1 Super Retina",
      cpu: "A15 Bionic", // ancienne clé 'cpu'
      ram: "4 Go", // ancienne chaîne avec unité
      battery: "3240 mAh" // ancienne chaîne avec unité
    }
  };

  const normPhone = normalizeProductSpecs(legacyPhone);
  assert.equal(normPhone.specs.screen, "6.1 Super Retina");
  assert.equal(normPhone.specs.processor, "A15 Bionic", "cpu mappé vers processor");
  assert.equal(normPhone.specs.ram, 4, "4 Go extrait vers nombre 4");
  assert.equal(normPhone.specs.battery, 3240, "3240 mAh extrait vers nombre 3240");

  // Produit Moto legacy
  const legacyMoto = {
    category: "mobility",
    specs: {
      motor: "8000W Brushless",
      range: "150 km",
      speed: "110 km/h"
    }
  };

  const normMoto = normalizeProductSpecs(legacyMoto);
  assert.equal(normMoto.specs.motorPower, 8000, "8000W converti en motorPower = 8000");
  assert.equal(normMoto.specs.rangeKm, 150, "150 km converti en rangeKm = 150");
  assert.equal(normMoto.specs.maxSpeedKm, 110, "110 km/h converti en maxSpeedKm = 110");
  // Clés brutes d'origine conservées pour rétro-compatibilité totale de l'affichage
  assert.equal(normMoto.specs.motor, "8000W Brushless");
  assert.equal(normMoto.specs.range, "150 km");
  assert.equal(normMoto.specs.speed, "110 km/h");
});

test("10. Image Framing: Catalog Apple products and user-added photos get sleek white framing for optimal light theme display", () => {
  // A. Produits catalogue Apple officiels -> fond blanc épuré
  const apple1 = getProductImageBg({ id: "pcfa-12", image: "/products/apple/iphone-12-blue.png" });
  assert.equal(apple1.isBlack, false);
  assert.equal(apple1.containerClass, "bg-white", "Les iPhones catalogue doivent rester sur fond blanc");

  const apple2 = getProductImageBg({ id: "pcfa-13", name: "iPhone 13" }, "/products/apple/iphone-13-black.png");
  assert.equal(apple2.isBlack, false);
  assert.equal(apple2.containerClass, "bg-white");

  // B. Photos ajoutées par l'utilisateur / smartphone (moto, frigo, pc) -> fond blanc professionnel en harmonie avec le site clair
  const moto = getProductImageBg({ id: "UOGdbGVosnh6CovWNOkD", name: "Moto Electrique" }, "/products/mobility/moto-electrique-1.jpg");
  assert.equal(moto.isBlack, false);
  assert.equal(moto.containerClass, "bg-white", "La moto électrique ajoutée doit avoir un cadrage blanc");

  const customPhoto = getProductImageBg({ id: "p-custom-99", name: "Réfrigérateur" }, "data:image/jpeg;base64,/9j/4AAQSkZJRg==");
  assert.equal(customPhoto.isBlack, false);
  assert.equal(customPhoto.containerClass, "bg-white", "Une photo personnalisée doit avoir un cadrage blanc");

  // C. Choix explicite par l'administrateur
  const explicitWhite = getProductImageBg({ id: "custom-1", imageBg: "white" });
  assert.equal(explicitWhite.isBlack, false);
  assert.equal(explicitWhite.containerClass, "bg-white");

  const explicitBlack = getProductImageBg({ id: "pcfa-se3", imageBg: "black" });
  assert.equal(explicitBlack.isBlack, true);
  assert.ok(explicitBlack.containerClass.includes("bg-black"));
});

test("11. Phone Storage: Quick storage selector is configured and validates cleanly without forcing manual variants", () => {
  const phoneCat = getCategoryConfig("phones");
  
  // A. Le champ de stockage existe dans la configuration déclarative
  const storageField = phoneCat.fields.find(f => f.key === "storage");
  assert.ok(storageField, "Le champ 'storage' doit exister pour la catégorie téléphones");
  assert.ok(storageField.options && storageField.options.length >= 5, "Le champ storage doit proposer les capacités clés");
  
  const optionsValues = storageField.options.map(o => o.value);
  assert.ok(optionsValues.includes("64 Go"));
  assert.ok(optionsValues.includes("128 Go"));
  assert.ok(optionsValues.includes("256 Go"));
  assert.ok(optionsValues.includes("512 Go"));
  assert.ok(optionsValues.includes("1 To"));

  // B. Validation d'un téléphone avec stockage unique sélectionné sans créer de variantes manuelles
  const singleStoragePhone = {
    name: "iPhone 14 Plus 256 Go",
    category: "phones",
    brand: "Apple",
    price: 495000,
    desc: "iPhone grand format avec autonomie exceptionnelle.",
    specs: {
      storage: "256 Go",
      ram: 6,
      battery: 4323
    }
  };

  const validated = validateAndCleanProduct(singleStoragePhone);
  assert.equal(validated.isValid, true, "Doit être validé avec succès");
  assert.equal(validated.cleanedProduct.specs.storage, "256 Go", "Le stockage 256 Go doit être conservé dans les specs");
});

test("12. iPhone SIM Types & Official Colors: Config and validation adhere to professional market standard", () => {
  // A. Types de SIM officiels déclarés
  assert.equal(IPHONE_SIM_TYPES.length, 3, "Il doit y avoir exactement 3 types de SIM pour iPhone");
  const simIds = IPHONE_SIM_TYPES.map(s => s.id);
  assert.ok(simIds.includes("sim_and_esim"), "Standard e-sim + sim physique");
  assert.ok(simIds.includes("dual_sim_physical"), "2 sim physique");
  assert.ok(simIds.includes("esim_only"), "E-sim seule");

  // B. Nuancier officiel Apple déclaré avec codes hex
  assert.ok(IPHONE_OFFICIAL_COLORS.length >= 10, "Au moins 10 finitions officielles Apple déclarées");
  const titaneNaturel = IPHONE_OFFICIAL_COLORS.find(c => c.name.toLowerCase().includes("naturel"));
  assert.ok(titaneNaturel, "Titane Naturel doit être présent");
  assert.ok(titaneNaturel.hex.startsWith("#"), "Code hex valide");

  // C. Validation d'un produit avec simPricing personnalisé
  const rawIphone = {
    name: "iPhone 16 Pro Max",
    category: "phones",
    brand: "Apple",
    price: 850000,
    colors: ["Titane Naturel", "Titane Noir"],
    desc: "Le summum de la technologie Apple.",
    storageOptions: [
      { capacity: "256 Go", price: 850000 },
      { capacity: "512 Go", price: 950000 },
      { capacity: "1 To", price: 1090000 }
    ],
    simPricing: {
      sim_and_esim: { enabled: true, delta: 0, label: "e-sim + sim physique" },
      dual_sim_physical: { enabled: true, delta: 35000, label: "2 sim physique" },
      esim_only: { enabled: true, delta: -25000, label: "E-sim" }
    },
    specs: {
      storage: "256 Go",
      ram: 8,
      screen: "6.9 Super Retina XDR"
    }
  };

  const validated = validateAndCleanProduct(rawIphone);
  assert.equal(validated.isValid, true, "Doit être validé avec succès");
  assert.ok(validated.cleanedProduct.simPricing, "simPricing doit être préservé");
  assert.equal(validated.cleanedProduct.simPricing.dual_sim_physical.delta, 35000);
  assert.equal(validated.cleanedProduct.simPricing.esim_only.delta, -25000);
  assert.equal(validated.cleanedProduct.colors.length, 2);
});

test("13. Conditional Phone Form Logic: Apple (CAS 1) vs Autres Marques (CAS 2)", () => {
  // A. Détection intelligente de la marque
  assert.equal(isAppleBrand("Apple"), true);
  assert.equal(isAppleBrand("apple"), true);
  assert.equal(isAppleBrand("iPhone"), true);
  assert.equal(isAppleBrand("Samsung"), false);
  assert.equal(isAppleBrand("Xiaomi"), false);
  assert.equal(isAppleBrand("Tecno"), false);

  // B. CAS 1 : Apple (iPhone) avec matrice croisée de variantes, shortDesc et otherFeatures
  const applePayload = {
    name: "iPhone 15 Pro Max 256 Go Titane Naturel",
    category: "phones",
    brand: "Apple",
    price: 850000,
    shortDesc: "Modèle pro en titane avec puce A17 Pro et zoom 5x.",
    desc: "Description complète du smartphone Apple avec finition Titane aérospatial.",
    otherFeatures: [
      "Écran Super Retina XDR OLED",
      "Puce A17 Pro",
      "Dynamic Island",
      "Bouton Action"
    ],
    variants: [
      {
        id: "sim_and_esim-256_Go-Titane_Naturel",
        simType: "e-sim + sim physique",
        simTypeId: "sim_and_esim",
        storage: "256 Go",
        color: "Titane Naturel",
        price: 850000,
        active: true
      },
      {
        id: "dual_sim_physical-256_Go-Titane_Naturel",
        simType: "2 sim physique",
        simTypeId: "dual_sim_physical",
        storage: "256 Go",
        color: "Titane Naturel",
        price: 880000,
        active: true
      }
    ],
    specs: {
      storage: "256 Go"
    }
  };

  const appleRes = validateAndCleanProduct(applePayload);
  assert.equal(appleRes.isValid, true, `Validation Apple réussie: ${appleRes.errorList.join(", ")}`);
  assert.equal(appleRes.cleanedProduct.shortDesc, "Modèle pro en titane avec puce A17 Pro et zoom 5x.");
  assert.equal(appleRes.cleanedProduct.otherFeatures.length, 4);
  assert.equal(appleRes.cleanedProduct.variants.length, 2);
  assert.equal(appleRes.cleanedProduct.variants[1].price, 880000);

  // C. CAS 2 : Autres marques (ex: Samsung) - Nettoyage strict et absence de pollution
  const samsungPayload = {
    name: "Samsung Galaxy S24 Ultra",
    category: "phones",
    brand: "Samsung",
    price: 790000,
    desc: "Smartphone Android avec processeur Snapdragon 8 Gen 3.",
    // Données parasites qu'on veut s'assurer de ne PAS polluer si soumises par mégarde
    shortDesc: "Ne doit pas être conservé pour les autres marques",
    otherFeatures: ["Feature parasite"],
    variants: [{ simType: "2 sim", storage: "256 Go", color: "Noir", price: 800000 }],
    simPricing: { esim_only: { enabled: true, delta: -20000, label: "E-sim" } },
    specs: {
      storage: "256 Go",
      ram: 12
    }
  };

  const samsungRes = validateAndCleanProduct(samsungPayload);
  assert.equal(samsungRes.isValid, true, `Validation Samsung réussie: ${samsungRes.errorList.join(", ")}`);
  assert.equal(samsungRes.cleanedProduct.shortDesc, undefined, "shortDesc doit être nettoyé pour les autres marques");
  assert.equal(samsungRes.cleanedProduct.otherFeatures, undefined, "otherFeatures doit être nettoyé pour les autres marques");
  assert.equal(samsungRes.cleanedProduct.variants, undefined, "variants croisés ne doivent pas exister pour les autres marques");
  assert.equal(samsungRes.cleanedProduct.specs.storage, "256 Go");
  assert.equal(samsungRes.cleanedProduct.specs.ram, 12);
});

test("14. Stock Availability: 'En stock' (continu sans limite) vs 'Bientôt disponible' (rupture temporaire / arrivage imminent)", () => {
  // A. Produit par défaut : en stock sans limite
  const inStockProd = validateAndCleanProduct({
    name: "Produit En Stock Continu",
    category: "phones",
    brand: "Apple",
    price: 500000,
    desc: "Test disponibilité continue sans limite numérique."
  });
  assert.equal(inStockProd.isValid, true);
  assert.equal(inStockProd.cleanedProduct.stockStatus, "en_stock");
  assert.equal(inStockProd.cleanedProduct.inStock, true);
  assert.equal(inStockProd.cleanedProduct.isComingSoon, false);
  assert.ok(inStockProd.cleanedProduct.stock > 0, "Stock initial disponible sans blocage");

  // B. Produit marqué comme bientôt disponible
  const comingSoonProd = validateAndCleanProduct({
    name: "iPhone 16 Pro Max Bientôt Dispo",
    category: "phones",
    brand: "Apple",
    price: 950000,
    desc: "En cours de réapprovisionnement.",
    stockStatus: "bientot_disponible"
  });
  assert.equal(comingSoonProd.isValid, true);
  assert.equal(comingSoonProd.cleanedProduct.stockStatus, "bientot_disponible");
  assert.equal(comingSoonProd.cleanedProduct.inStock, false);
  assert.equal(comingSoonProd.cleanedProduct.isComingSoon, true);
  assert.equal(comingSoonProd.cleanedProduct.stock, 0);

  // C. Helper isProductComingSoon
  assert.equal(isProductComingSoon(comingSoonProd.cleanedProduct), true);
  assert.equal(isProductComingSoon(inStockProd.cleanedProduct), false);
  assert.equal(isProductComingSoon({ stock: 0 }), true);
  assert.equal(isProductComingSoon({ inStock: false }), true);
  assert.equal(isProductComingSoon({ isComingSoon: true }), true);
});

test("15. Android Phone Storage & RAM Multi-Price Variants", () => {
  const androidPhoneData = {
    name: "Samsung Galaxy S24 Ultra",
    category: "phones",
    brand: "Samsung",
    price: 650000,
    desc: "Smartphone flagship Samsung Galaxy S24 Ultra avec Snapdragon 8 Gen 3.",
    storageOptions: [
      {
        capacity: "256 Go / 12 Go RAM",
        storage: "256 Go",
        ram: 12,
        price: 650000
      },
      {
        capacity: "512 Go / 12 Go RAM",
        storage: "512 Go",
        ram: 12,
        price: 740000
      },
      {
        capacity: "1 To / 16 Go RAM",
        storage: "1 To",
        ram: 16,
        price: 890000
      }
    ],
    specs: {
      storage: "256 Go",
      ram: 12
    }
  };

  const res = validateAndCleanProduct(androidPhoneData);
  assert.equal(res.isValid, true, "Le produit Android avec multi-prix RAM/stockage doit être valide");
  assert.equal(res.cleanedProduct.storageOptions.length, 3);
  assert.equal(res.cleanedProduct.storageOptions[0].capacity, "256 Go / 12 Go RAM");
  assert.equal(res.cleanedProduct.storageOptions[0].storage, "256 Go");
  assert.equal(res.cleanedProduct.storageOptions[0].ram, 12);
  assert.equal(res.cleanedProduct.storageOptions[0].price, 650000);

  assert.equal(res.cleanedProduct.storageOptions[1].capacity, "512 Go / 12 Go RAM");
  assert.equal(res.cleanedProduct.storageOptions[1].storage, "512 Go");
  assert.equal(res.cleanedProduct.storageOptions[1].ram, 12);
  assert.equal(res.cleanedProduct.storageOptions[1].price, 740000);

  assert.equal(res.cleanedProduct.storageOptions[2].capacity, "1 To / 16 Go RAM");
  assert.equal(res.cleanedProduct.storageOptions[2].storage, "1 To");
  assert.equal(res.cleanedProduct.storageOptions[2].ram, 16);
  assert.equal(res.cleanedProduct.storageOptions[2].price, 890000);
});


