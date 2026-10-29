/**
 * Configuration déclarative des catégories et de leurs caractéristiques spécifiques
 * Prince CFA Mall — Architecture extensible et typée
 */

export interface SpecFieldDefinition {
  key: string;
  label: string;
  type: "text" | "number" | "select";
  unit?: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  helpText?: string;
  min?: number;
  max?: number;
}

export interface CategoryDefinition {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  iconName: string;
  supportsStorageVariants: boolean; // Autorise les options multi-stockage avec prix différents (ex: 128Go, 256Go)
  popularBrands: string[]; // Marques suggérées par clic rapide
  placeholderName: string;
  defaultWarranty: string;
  defaultAccessories: string;
  fields: SpecFieldDefinition[];
}

export const PRODUCT_CATEGORIES: Record<string, CategoryDefinition> = {
  phones: {
    id: "phones",
    label: "Téléphones",
    shortLabel: "Smartphones",
    description: "Smartphones haut de gamme, iPhones et téléphones mobiles",
    iconName: "Smartphone",
    supportsStorageVariants: true,
    popularBrands: ["Apple", "Samsung", "Google Pixel", "Redmi", "Xiaomi", "Tecno", "Infinix", "Honor", "OALE", "Itel", "Huawei", "Oppo"],
    placeholderName: "Ex: iPhone 15 Pro Max 256 Go Titane Naturel",
    defaultWarranty: "Garantie 12 Mois Certifiée",
    defaultAccessories: "Câble USB-C officiel, Boîte d'origine, Extracteur de SIM",
    fields: [
      {
        key: "model",
        label: "Modèle",
        type: "text",
        placeholder: "Ex: iPhone 15 Pro Max, Galaxy S24 Ultra",
        required: true,
      },
      {
        key: "storage",
        label: "Capacité de stockage",
        type: "select",
        options: [
          { label: "64 Go", value: "64 Go" },
          { label: "128 Go", value: "128 Go" },
          { label: "256 Go", value: "256 Go" },
          { label: "512 Go", value: "512 Go" },
          { label: "1 To (1024 Go)", value: "1 To" },
          { label: "2 To", value: "2 To" },
          { label: "32 Go", value: "32 Go" },
        ],
        required: false,
        placeholder: "Sélectionnez la capacité de stockage",
        helpText: "Capacité interne de stockage (64 Go, 128 Go, 256 Go, 512 Go, 1 To)",
      },
      {
        key: "ram",
        label: "Mémoire RAM",
        type: "select",
        unit: "Go",
        options: [
          { label: "4 Go", value: "4" },
          { label: "6 Go", value: "6" },
          { label: "8 Go", value: "8" },
          { label: "12 Go", value: "12" },
          { label: "16 Go", value: "16" },
        ],
        required: false,
      },
      {
        key: "batteryCapacity",
        label: "Capacité batterie",
        type: "number",
        unit: "mAh",
        placeholder: "Ex: 4422",
        min: 500,
        max: 10000,
        required: false,
        helpText: "Capacité constructeur de la batterie en milliampères-heures",
      },
      {
        key: "batteryHealth",
        label: "État de la batterie (%)",
        type: "number",
        unit: "%",
        placeholder: "Ex: 100 ou 92",
        min: 50,
        max: 100,
        required: false,
        helpText: "Pertinent pour les téléphones d'occasion ou reconditionnés",
      },
      {
        key: "simFormat",
        label: "Format & Nombre de SIM",
        type: "select",
        options: [
          { label: "Simple SIM", value: "single_sim" },
          { label: "double sim physique", value: "dual_sim_physical" },
          { label: "1 e-sim+1 sim physique", value: "sim_and_esim" },
          { label: "e-sim", value: "esim_only" },
        ],
        required: false,
      },
      {
        key: "screen",
        label: "Écran & Technologie",
        type: "text",
        placeholder: "Ex: 6.7\" Super Retina XDR OLED 120Hz",
        required: false,
      },
      {
        key: "processor",
        label: "Puce / Processeur",
        type: "text",
        placeholder: "Ex: Apple A17 Pro, Snapdragon 8 Gen 3",
        required: false,
      },
      {
        key: "camera",
        label: "Appareil photo",
        type: "text",
        placeholder: "Ex: Triple capteur 48MP + 12MP + 12MP",
        required: false,
      },
      {
        key: "network",
        label: "Réseau cellulaire",
        type: "select",
        options: [
          { label: "5G Ultra-rapide", value: "5G" },
          { label: "4G LTE", value: "4G" },
        ],
        required: false,
      },
    ],
  },

  computers: {
    id: "computers",
    label: "Ordinateurs",
    shortLabel: "Ordinateurs",
    description: "PC portables, MacBooks, PC de bureau et stations de travail",
    iconName: "Laptop",
    supportsStorageVariants: true,
    popularBrands: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Microsoft"],
    placeholderName: "Ex: MacBook Pro 16 M3 Max, Dell XPS 15 9530",
    defaultWarranty: "Garantie 12 Mois Constructeur",
    defaultAccessories: "Chargeur d'origine haute puissance, Câble secteur",
    fields: [
      {
        key: "model",
        label: "Modèle",
        type: "text",
        placeholder: "Ex: MacBook Pro 16 M3 Max, Dell XPS 15",
        required: true,
      },
      {
        key: "computerType",
        label: "Type d'ordinateur",
        type: "select",
        options: [
          { label: "Ordinateur Portable (Laptop)", value: "laptop" },
          { label: "Ordinateur de Bureau (Desktop / Tour)", value: "desktop" },
          { label: "Tout-en-un (All-in-One / iMac)", value: "all_in_one" },
          { label: "Station de travail (Workstation)", value: "workstation" },
        ],
        required: true,
      },
      {
        key: "processor",
        label: "Processeur (CPU)",
        type: "text",
        placeholder: "Ex: Apple M3 Pro, Intel Core i7-14700H, AMD Ryzen 7",
        required: true,
      },
      {
        key: "ram",
        label: "Mémoire RAM",
        type: "select",
        unit: "Go",
        options: [
          { label: "8 Go", value: "8" },
          { label: "16 Go", value: "16" },
          { label: "18 Go unifiée", value: "18" },
          { label: "24 Go unifiée", value: "24" },
          { label: "32 Go", value: "32" },
          { label: "64 Go", value: "64" },
          { label: "128 Go", value: "128" },
        ],
        required: true,
      },
      {
        key: "storageSize",
        label: "Capacité de stockage principale",
        type: "select",
        options: [
          { label: "256 Go", value: "256 Go" },
          { label: "512 Go", value: "512 Go" },
          { label: "1 To (1000 Go)", value: "1 To" },
          { label: "2 To (2000 Go)", value: "2 To" },
          { label: "4 To", value: "4 To" },
        ],
        required: true,
      },
      {
        key: "storageType",
        label: "Type de stockage",
        type: "select",
        options: [
          { label: "SSD NVMe PCIe (Ultra rapide)", value: "ssd_nvme" },
          { label: "SSD SATA", value: "ssd_sata" },
          { label: "Disque Dur HDD", value: "hdd" },
          { label: "Hybride SSD + HDD", value: "hybrid" },
        ],
        required: true,
      },
      {
        key: "gpu",
        label: "Carte graphique (GPU)",
        type: "text",
        placeholder: "Ex: NVIDIA RTX 4070 (8 Go), GPU Apple 18 cœurs, Intel Iris Xe",
        required: false,
      },
      {
        key: "screenSize",
        label: "Taille de l'écran",
        type: "select",
        unit: "pouces",
        options: [
          { label: "13 à 13.6 pouces", value: "13.3" },
          { label: "14 à 14.2 pouces", value: "14.2" },
          { label: "15 à 15.6 pouces", value: "15.6" },
          { label: "16 à 16.2 pouces", value: "16.2" },
          { label: "17.3 pouces", value: "17.3" },
          { label: "24 pouces (Tout-en-un)", value: "24" },
          { label: "27 pouces et plus", value: "27" },
          { label: "Sans écran (Unité centrale)", value: "none" },
        ],
        required: false,
      },
      {
        key: "screenResolution",
        label: "Résolution d'écran",
        type: "text",
        placeholder: "Ex: Retina XDR (3456 x 2234), Full HD 1080p, 4K UHD",
        required: false,
      },
      {
        key: "os",
        label: "Système d'exploitation",
        type: "select",
        options: [
          { label: "macOS Sonoma / Sequoia", value: "macos" },
          { label: "Windows 11 Professionnel", value: "win11_pro" },
          { label: "Windows 11 Famille", value: "win11_home" },
          { label: "Linux (Ubuntu / Fedora)", value: "linux" },
          { label: "Sans OS / FreeDOS", value: "no_os" },
        ],
        required: true,
      },
    ],
  },

  tablets: {
    id: "tablets",
    label: "Tablettes",
    shortLabel: "Tablettes",
    description: "iPads, tablettes graphiques et tablettes Android",
    iconName: "Tablet",
    supportsStorageVariants: true,
    popularBrands: ["Motorola", "BTOUCH", "17 Pro Max", "Apple", "Samsung", "Xiaomi", "Lenovo", "Huawei"],
    placeholderName: "Ex: iPad Pro 11 M4 OLED, Galaxy Tab S9 Ultra",
    defaultWarranty: "Garantie 12 Mois Certifiée",
    defaultAccessories: "Câble USB-C, Adaptateur secteur 20W",
    fields: [
      {
        key: "model",
        label: "Modèle",
        type: "text",
        placeholder: "Ex: iPad Pro 11 M4, Galaxy Tab S9 Ultra",
        required: true,
      },
      {
        key: "screenSize",
        label: "Taille de l'écran",
        type: "text",
        unit: "pouces",
        placeholder: "Ex: 11\" ou 13\" Ultra Retina Tandem OLED",
        required: true,
      },
      {
        key: "storageSize",
        label: "Capacité de stockage",
        type: "select",
        options: [
          { label: "64 Go", value: "64 Go" },
          { label: "128 Go", value: "128 Go" },
          { label: "256 Go", value: "256 Go" },
          { label: "512 Go", value: "512 Go" },
          { label: "1 To", value: "1 To" },
          { label: "2 To", value: "2 To" },
        ],
        required: true,
      },
      {
        key: "ram",
        label: "Mémoire RAM",
        type: "select",
        unit: "Go",
        options: [
          { label: "4 Go", value: "4" },
          { label: "8 Go", value: "8" },
          { label: "12 Go", value: "12" },
          { label: "16 Go", value: "16" },
        ],
        required: false,
      },
      {
        key: "connectivity",
        label: "Connectivité",
        type: "select",
        options: [
          { label: "Wi-Fi uniquement", value: "wifi_only" },
          { label: "Wi-Fi + Cellulaire (4G / 5G)", value: "wifi_cellular" },
        ],
        required: true,
      },
      {
        key: "processor",
        label: "Puce / Processeur",
        type: "text",
        placeholder: "Ex: Puce Apple M4, Snapdragon 8 Gen 2",
        required: false,
      },
      {
        key: "batteryCapacity",
        label: "Capacité batterie",
        type: "number",
        unit: "mAh",
        placeholder: "Ex: 8160",
        min: 1000,
        max: 20000,
        required: false,
      },
      {
        key: "stylusSupport",
        label: "Compatibilité Stylet / Clavier",
        type: "text",
        placeholder: "Ex: Apple Pencil Pro, Magic Keyboard",
        required: false,
      },
    ],
  },

  mobility: {
    id: "mobility",
    label: "Motos Électriques",
    shortLabel: "Motos",
    description: "Motos et scooters électriques haute performance",
    iconName: "Zap",
    supportsStorageVariants: false, // JAMAIS de stockage de téléphone pour les motos
    popularBrands: ["Super Soco", "Niu", "Sur-Ron", "Yadea", "Horwin", "Segway", "Talaria", "Prince Moto"],
    placeholderName: "Ex: Moto Électrique Super Soco TC Max 5000W / 72V",
    defaultWarranty: "Garantie 2 Ans Batterie & Moteur",
    defaultAccessories: "Chargeur rapide secteur 220V, 2 Paires de clés + télécommande alarme, Rétroviseurs, Trousse outils, Casque homologué offert",
    fields: [
      {
        key: "model",
        label: "Modèle",
        type: "text",
        placeholder: "Ex: Super Soco TC Max, Niu NQi GT, Sur-Ron Storm",
        required: true,
      },
      {
        key: "motorPower",
        label: "Puissance du moteur",
        type: "number",
        unit: "W",
        placeholder: "Ex: 5000",
        min: 250,
        max: 50000,
        required: true,
        helpText: "Puissance nominale ou en crête du moteur électrique en Watts",
      },
      {
        key: "batteryCapacityWh",
        label: "Capacité de la batterie",
        type: "number",
        unit: "Wh",
        placeholder: "Ex: 3840 (soit 3.84 kWh)",
        min: 500,
        max: 30000,
        required: true,
        helpText: "Capacité totale de stockage en Watt-heures (Wh)",
      },
      {
        key: "batteryVoltage",
        label: "Tension de fonctionnement (V)",
        type: "number",
        unit: "V",
        placeholder: "Ex: 72 ou 60",
        min: 24,
        max: 120,
        required: false,
        helpText: "Tension du système en Volts (ex: 72V, 60V)",
      },
      {
        key: "rangeKm",
        label: "Autonomie annoncée",
        type: "number",
        unit: "km",
        placeholder: "Ex: 120",
        min: 10,
        max: 500,
        required: true,
        helpText: "Distance estimée franchissable sur une seule charge complète",
      },
      {
        key: "maxSpeedKm",
        label: "Vitesse maximale",
        type: "number",
        unit: "km/h",
        placeholder: "Ex: 95",
        min: 20,
        max: 200,
        required: true,
        helpText: "Vitesse de pointe sur voie dégagée",
      },
      {
        key: "chargeTimeHours",
        label: "Temps de recharge complète",
        type: "number",
        unit: "heures",
        placeholder: "Ex: 4",
        min: 0.5,
        max: 24,
        required: false,
      },
      {
        key: "batteryType",
        label: "Type de batterie",
        type: "select",
        options: [
          { label: "Lithium-Ion amovible (rechargeable à domicile)", value: "lithium_removable" },
          { label: "Lithium-Ion fixe haute capacité", value: "lithium_fixed" },
          { label: "Lithium Fer Phosphate (LFP ultra-durable)", value: "lfp" },
          { label: "Plomb-acide scellée (GEL)", value: "lead_acid" },
        ],
        required: false,
      },
      {
        key: "transmission",
        label: "Transmission",
        type: "select",
        options: [
          { label: "Courroie crantée silencieuse (Belt Drive)", value: "belt" },
          { label: "Chaîne renforcée (Chain Drive)", value: "chain" },
          { label: "Moteur direct intégré dans la roue (Hub Motor)", value: "hub_motor" },
        ],
        required: false,
      },
      {
        key: "brakes",
        label: "Système de freinage",
        type: "text",
        placeholder: "Ex: Double disque hydraulique CBS avant/arrière",
        required: false,
      },
      {
        key: "licenseRequired",
        label: "Permis / Homologation",
        type: "select",
        options: [
          { label: "Sans permis (Équivalent 50cc, dès 14 ans)", value: "no_license" },
          { label: "Permis A1 ou Permis B + formation (Équivalent 125cc)", value: "permis_a1_b" },
          { label: "Permis Moto A / A2 (Grosse cylindrée)", value: "permis_a" },
        ],
        required: false,
      },
      {
        key: "maxLoadKg",
        label: "Charge maximale supportée",
        type: "number",
        unit: "kg",
        placeholder: "Ex: 160",
        min: 50,
        max: 400,
        required: false,
      },
    ],
  },

  accessories: {
    id: "accessories",
    label: "Accessoires Technologiques",
    shortLabel: "Accessoires",
    description: "Écouteurs, chargeurs rapides, coques, câbles et protections",
    iconName: "Headphones",
    supportsStorageVariants: false,
    popularBrands: ["Apple", "Anker", "Samsung", "Baseus", "Oraimo", "JBL", "Sony", "Ugreen"],
    placeholderName: "Ex: Chargeur Rapide GaN 65W Multi-Ports USB-C",
    defaultWarranty: "Garantie 6 Mois Échange à Neuf",
    defaultAccessories: "Câble de charge renforcé, Manuel d'utilisation",
    fields: [
      {
        key: "model",
        label: "Modèle ou Référence",
        type: "text",
        placeholder: "Ex: AirPods Pro 2, Adaptateur USB-C 65W GaN",
        required: true,
      },
      {
        key: "accessoryType",
        label: "Type d'accessoire",
        type: "select",
        options: [
          { label: "Chargeurs & Blocs d'alimentation", value: "charger" },
          { label: "Écouteurs & Casques audio", value: "audio" },
          { label: "Câbles de charge & données", value: "cable" },
          { label: "Batteries externes (Powerbanks)", value: "powerbank" },
          { label: "Coques, Étuis & Verres trempés", value: "protection" },
          { label: "Supports, Trépieds & Stabilisateurs", value: "stand" },
          { label: "Claviers, Souris & Hubs USB", value: "peripherals" },
          { label: "Autre accessoire", value: "other" },
        ],
        required: true,
      },
      {
        key: "compatibility",
        label: "Compatibilité appareils",
        type: "text",
        placeholder: "Ex: iPhone 11 à 16, Samsung Galaxy, Universel USB-C, MacBook",
        required: true,
        helpText: "Précisez avec quels appareils ou marques ce produit fonctionne",
      },
      {
        key: "connectionType",
        label: "Connectivité / Liaison",
        type: "select",
        options: [
          { label: "Sans-fil Bluetooth", value: "bluetooth" },
          { label: "Filaire USB-C", value: "usbc" },
          { label: "Filaire Lightning", value: "lightning" },
          { label: "Sans-fil induction / MagSafe", value: "magsafe_qi" },
          { label: "Filaire Jack 3.5mm", value: "jack" },
          { label: "Non applicable (passif)", value: "none" },
        ],
        required: false,
      },
    ],
  },

  tv: {
    id: "tv",
    label: "TV & Écrans",
    shortLabel: "TV & Écrans",
    description: "Téléviseurs intelligents, écrans OLED et moniteurs",
    iconName: "Tv",
    supportsStorageVariants: false,
    popularBrands: ["Samsung", "LG", "Sony", "TCL", "Hisense", "Xiaomi"],
    placeholderName: "Ex: Samsung 65\" Neo QLED 4K Smart TV",
    defaultWarranty: "Garantie 2 Ans Constructeur",
    defaultAccessories: "Télécommande Magic Remote avec piles, Câble d'alimentation, Support pieds",
    fields: [
      {
        key: "screenSize",
        label: "Diagonale de l'écran",
        type: "text",
        placeholder: "Ex: 65 pouces (165 cm)",
        required: true,
      },
      {
        key: "resolution",
        label: "Résolution",
        type: "select",
        options: [
          { label: "4K Ultra HD (3840 x 2160)", value: "4k" },
          { label: "8K Ultra HD (7680 x 4320)", value: "8k" },
          { label: "Full HD (1920 x 1080)", value: "fhd" },
        ],
        required: true,
      },
      {
        key: "panel",
        label: "Technologie de dalle",
        type: "select",
        options: [
          { label: "OLED / QD-OLED (Noirs absolus)", value: "oled" },
          { label: "QLED / Mini-LED (Haute luminosité)", value: "qled" },
          { label: "LED / Nanocell", value: "led" },
        ],
        required: false,
      },
      {
        key: "smart",
        label: "Système Smart TV",
        type: "text",
        placeholder: "Ex: Google TV, webOS, Tizen OS",
        required: false,
      },
      {
        key: "audio",
        label: "Système audio intégré",
        type: "text",
        placeholder: "Ex: Dolby Atmos 60W 2.2",
        required: false,
      },
    ],
  },

  audio: {
    id: "audio",
    label: "Boomers & Hi-Fi",
    shortLabel: "Boomers",
    description: "Enceintes de fête, boomers et barres de son",
    iconName: "Speaker",
    supportsStorageVariants: false,
    popularBrands: ["JBL", "Sony", "Harman Kardon", "Bose", "Marshall", "Oraimo"],
    placeholderName: "Ex: JBL PartyBox 310 Bluetooth 240W",
    defaultWarranty: "Garantie 12 Mois Certifiée",
    defaultAccessories: "Câble d'alimentation secteur, Câble audio auxiliaire",
    fields: [
      {
        key: "power",
        label: "Puissance sonore",
        type: "text",
        placeholder: "Ex: 240W RMS, 800W Peak",
        required: true,
      },
      {
        key: "connectivity",
        label: "Connectivité",
        type: "text",
        placeholder: "Ex: Bluetooth 5.3, USB, Aux, Entrée Micro & Guitare",
        required: false,
      },
      {
        key: "battery_life",
        label: "Autonomie sur batterie",
        type: "text",
        placeholder: "Ex: 18 heures (Batterie rechargeable intégrée)",
        required: false,
      },
      {
        key: "waterproof",
        label: "Indice de protection étanchéité",
        type: "text",
        placeholder: "Ex: IPX4 anti-éclaboussures, IP67",
        required: false,
      },
    ],
  },

  solar: {
    id: "solar",
    label: "Énergie Solaire",
    shortLabel: "Solaire",
    description: "Kits solaires, onduleurs et batteries de stockage",
    iconName: "Sun",
    supportsStorageVariants: false,
    popularBrands: ["Victron Energy", "Felicity Solar", "Huawei Solar", "Must", "Growatt", "Sunova"],
    placeholderName: "Ex: Kit Solaire Hybride 5kW avec Batterie Lithium 5.12kWh",
    defaultWarranty: "Garantie 5 Ans Onduleur & Batteries",
    defaultAccessories: "Câbles solaires MC4, Coffret de protection DC/AC, Manuel d'installation",
    fields: [
      {
        key: "panels",
        label: "Panneaux Solaires",
        type: "text",
        placeholder: "Ex: 6x 550W Monocristallin Demi-cellules",
        required: true,
      },
      {
        key: "inverter",
        label: "Onduleur / Régulateur",
        type: "text",
        placeholder: "Ex: 5kW Hybride MPPT 48V",
        required: true,
      },
      {
        key: "storage",
        label: "Capacité de stockage batteries",
        type: "text",
        placeholder: "Ex: Lithium LiFePO4 5.12 kWh 100Ah",
        required: true,
      },
    ],
  },
  appliances: {
    id: "appliances",
    label: "Électroménager",
    shortLabel: "Électroménager",
    description: "Réfrigérateurs, climatiseurs, lave-linge, micro-ondes et équipement de maison",
    iconName: "Refrigerator",
    supportsStorageVariants: false,
    popularBrands: ["Samsung", "LG", "Hisense", "Midea", "TCL", "Whirlpool", "Beko", "Sharp", "Bosch", "Nasco", "Solstar"],
    placeholderName: "Ex: Réfrigérateur Multi-Portes No Frost Inverter 450L",
    defaultWarranty: "Garantie 12 Mois Constructeur",
    defaultAccessories: "Câble d'alimentation, Manuel d'utilisation, Kit d'installation",
    fields: [
      {
        key: "applianceType",
        label: "Type d'appareil",
        type: "select",
        options: [
          { label: "Réfrigérateur / Congélateur", value: "fridge" },
          { label: "Climatiseur / Split", value: "ac" },
          { label: "Machine à laver / Lave-linge", value: "washing_machine" },
          { label: "Micro-ondes / Four", value: "microwave_oven" },
          { label: "Cuisinière / Plaque de cuisson", value: "cooker" },
          { label: "Chauffe-eau / Distributeur d'eau", value: "water_heater" },
          { label: "Robot de cuisine / Mixeur", value: "blender" },
          { label: "Fer à repasser / Centrale vapeur", value: "iron" },
          { label: "Autre électroménager", value: "other" },
        ],
        required: true,
      },
      {
        key: "capacity",
        label: "Capacité / Volume",
        type: "text",
        placeholder: "Ex: 450 Litres, 9 kg, 1.5 CV (12000 BTU)...",
        required: false,
      },
      {
        key: "power",
        label: "Puissance & Consommation",
        type: "text",
        placeholder: "Ex: 1200 W, Digital Inverter",
        required: false,
      },
      {
        key: "energyClass",
        label: "Classe Énergétique",
        type: "select",
        options: [
          { label: "A+++ (Inverter Ultra-Économique)", value: "A+++" },
          { label: "A++", value: "A++" },
          { label: "A+", value: "A+" },
          { label: "A", value: "A" },
          { label: "B", value: "B" },
          { label: "Standard", value: "Standard" },
        ],
        required: false,
      },
      {
        key: "features",
        label: "Fonctionnalités & Moteur",
        type: "text",
        placeholder: "Ex: Moteur Inverter Direct Drive, No Frost, Filtre anti-allergène",
        required: false,
      },
    ],
  },

  electromenager: {
    id: "electromenager",
    label: "Électroménager",
    shortLabel: "Électroménager",
    description: "Réfrigérateurs, climatiseurs, lave-linge, micro-ondes et équipement de maison",
    iconName: "Refrigerator",
    supportsStorageVariants: false,
    popularBrands: ["Samsung", "LG", "Hisense", "Midea", "TCL", "Whirlpool", "Beko", "Sharp", "Bosch", "Nasco", "Solstar"],
    placeholderName: "Ex: Réfrigérateur Multi-Portes No Frost Inverter 450L",
    defaultWarranty: "Garantie 12 Mois Constructeur",
    defaultAccessories: "Câble d'alimentation, Manuel d'utilisation, Kit d'installation",
    fields: [
      {
        key: "applianceType",
        label: "Type d'appareil",
        type: "select",
        options: [
          { label: "Réfrigérateur / Congélateur", value: "fridge" },
          { label: "Climatiseur / Split", value: "ac" },
          { label: "Machine à laver / Lave-linge", value: "washing_machine" },
          { label: "Micro-ondes / Four", value: "microwave_oven" },
          { label: "Cuisinière / Plaque de cuisson", value: "cooker" },
          { label: "Chauffe-eau / Distributeur d'eau", value: "water_heater" },
          { label: "Robot de cuisine / Mixeur", value: "blender" },
          { label: "Fer à repasser / Centrale vapeur", value: "iron" },
          { label: "Autre électroménager", value: "other" },
        ],
        required: true,
      },
      {
        key: "capacity",
        label: "Capacité / Volume",
        type: "text",
        placeholder: "Ex: 450 Litres, 9 kg, 1.5 CV (12000 BTU)...",
        required: false,
      },
      {
        key: "power",
        label: "Puissance & Consommation",
        type: "text",
        placeholder: "Ex: 1200 W, Digital Inverter",
        required: false,
      },
      {
        key: "energyClass",
        label: "Classe Énergétique",
        type: "select",
        options: [
          { label: "A+++ (Inverter Ultra-Économique)", value: "A+++" },
          { label: "A++", value: "A++" },
          { label: "A+", value: "A+" },
          { label: "A", value: "A" },
          { label: "B", value: "B" },
          { label: "Standard", value: "Standard" },
        ],
        required: false,
      },
      {
        key: "features",
        label: "Fonctionnalités & Moteur",
        type: "text",
        placeholder: "Ex: Moteur Inverter Direct Drive, No Frost, Filtre anti-allergène",
        required: false,
      },
    ],
  },
  promotion: {
    id: "promotion",
    label: "PROMOTION",
    shortLabel: "Promos",
    description: "Offres spéciales, remises exclusives et produits en promotion",
    iconName: "Flame",
    supportsStorageVariants: true,
    popularBrands: ["Apple", "Samsung", "Xiaomi", "Tecno", "Infinix", "HP", "Dell", "Sony", "LG", "Honda"],
    placeholderName: "Ex: Pack Promo Spéciale / Produit en réduction",
    defaultWarranty: "Garantie 12 Mois Certifiée",
    defaultAccessories: "Accessoires officiels + Cadeaux inclus",
    fields: [
      {
        key: "discountText",
        label: "Remise & Avantage",
        type: "text",
        placeholder: "Ex: -25% de réduction, Remise immédiate...",
        required: false,
      },
      {
        key: "promoEnd",
        label: "Validité de l'offre",
        type: "text",
        placeholder: "Ex: Jusqu'à épuisement du stock, Ce week-end uniquement",
        required: false,
      },
      {
        key: "bonusIncluded",
        label: "Cadeau / Bonus inclus",
        type: "text",
        placeholder: "Ex: Écouteurs sans fil offerts, Coque + Verre trempé",
        required: false,
      },
    ],
  },
};

const CATEGORY_CANONICAL_ORDER = [
  "phones",
  "computers",
  "tablets",
  "tv",
  "appliances",
  "accessories",
  "audio",
  "mobility",
  "solar",
  "promotion",
];

export const CATEGORIES_LIST = Object.values(PRODUCT_CATEGORIES)
  .filter((cat, index, self) => index === self.findIndex((c) => c.label === cat.label))
  .sort((a, b) => {
    const idxA = CATEGORY_CANONICAL_ORDER.indexOf(a.id);
    const idxB = CATEGORY_CANONICAL_ORDER.indexOf(b.id);
    const posA = idxA === -1 ? 999 : idxA;
    const posB = idxB === -1 ? 999 : idxB;
    return posA - posB;
  });

/**
 * Obtenir la configuration d'une catégorie donnée (avec repli sûr)
 */
export function getCategoryConfig(categoryId: string): CategoryDefinition {
  const normId = (categoryId || "").toLowerCase().trim();
  if (normId === "promotion" || normId === "promotions" || normId === "promo") {
    return PRODUCT_CATEGORIES["promotion"];
  }
  return (
    PRODUCT_CATEGORIES[categoryId] || {
      id: categoryId || "other",
      label: "Autre Catégorie",
      shortLabel: "Autre",
      description: "Articles et accessoires divers",
      iconName: "Package",
      supportsStorageVariants: false,
      popularBrands: ["Générique", "Autre"],
      placeholderName: "Nom du produit",
      defaultWarranty: "Garantie 6 Mois",
      defaultAccessories: "Accessoires standards",
      fields: [],
    }
  );
}

/**
 * Vérifier si une catégorie supporte les variantes de stockage à prix multiples
 */
export function isStorageVariantCategory(categoryId: string): boolean {
  return Boolean(getCategoryConfig(categoryId).supportsStorageVariants);
}

/**
 * Types de SIM officiels pour iPhones sur le marché africain et international
 */
export const IPHONE_SIM_TYPES = [
  { 
    id: "sim_and_esim", 
    label: "1 e-sim+1 sim physique", 
    shortLabel: "1 e-sim+1 sim physique",
    description: "",
    defaultDelta: 0,
    badge: "Standard" 
  },
  { 
    id: "dual_sim_physical", 
    label: "double sim physique", 
    shortLabel: "double sim physique",
    description: "",
    defaultDelta: 30000,
    badge: "Recommandé" 
  },
  { 
    id: "esim_only", 
    label: "e-sim", 
    shortLabel: "e-sim",
    description: "",
    defaultDelta: -20000,
    badge: "Économique" 
  },
] as const;

/**
 * Palette des coloris officiels Apple pour iPhones (sélection en 1 clic)
 */
export const IPHONE_OFFICIAL_COLORS = [
  // Coloris intemporels & standards (iPhone 11, 12, 13, 14, 15, SE)
  { name: "Noir", hex: "#1c1d1f", border: "#000000" },
  { name: "Blanc", hex: "#f5f5f7", border: "#d2d2d7" },
  { name: "Mauve", hex: "#d1cdda", border: "#b8b2c4" },
  { name: "Vert", hex: "#dae5d8", border: "#b2c7b0" },
  { name: "Rouge", hex: "#ba0c2f", border: "#8a0620" },
  { name: "Bleu", hex: "#215e7f", border: "#17435a" },
  { name: "Jaune", hex: "#fde87e", border: "#dbc55e" },
  { name: "Rose", hex: "#fed0d3", border: "#dbadb0" },
  { name: "Minuit", hex: "#19212c", border: "#0d131b" },
  { name: "Lumière Stellaire", hex: "#faf6f2", border: "#dcd6cf" },
  { name: "Rouge (PRODUCT RED)", hex: "#ba0c2f", border: "#8a0620" },

  // Coloris Pro Titane (iPhone 15 Pro, 16 Pro)
  { name: "Titane Naturel", hex: "#9a958e", border: "#7a756e" },
  { name: "Titane Noir", hex: "#3b3a36", border: "#252422" },
  { name: "Titane Blanc", hex: "#e4e5e7", border: "#c5c6c8" },
  { name: "Titane Bleu", hex: "#3b4452", border: "#28303c" },
  { name: "Titane Sable / Désert", hex: "#c4a683", border: "#a58866" },

  // Coloris Pro Acier Chirurgical & Éditions Spéciales (iPhone 11 Pro, 12 Pro, 13 Pro, 14 Pro, 16)
  { name: "Gris sidéral", hex: "#535150", border: "#3c3b3a" },
  { name: "Noir Sidéral", hex: "#1f2024", border: "#111214" },
  { name: "Graphite", hex: "#4b4845", border: "#373533" },
  { name: "Argent", hex: "#e3e4e5", border: "#c1c2c4" },
  { name: "Or", hex: "#fae7cf", border: "#d8c4ad" },
  { name: "Vert nuit", hex: "#4e5851", border: "#363e39" },
  { name: "Vert Alpin", hex: "#505e4d", border: "#384435" },
  { name: "Bleu alpin", hex: "#94a9bf", border: "#6c849c" },
  { name: "Bleu Pacifique", hex: "#2d4e60", border: "#1b3442" },
  { name: "Bleu Sierra", hex: "#9bb5ce", border: "#7b94ad" },
  { name: "Violet Intense", hex: "#594f63", border: "#3e3646" },
  { name: "Bleu outremer", hex: "#3b5898", border: "#273f73" },
  { name: "Sarcelle", hex: "#408282", border: "#2b5c5c" },
  { name: "Titane Désert", hex: "#c4a683", border: "#a58866" },

  // Coloris concept & nouvelles générations (iPhone 17 & 18)
  { name: "Bleu Ciel Céleste", hex: "#a4c2e6", border: "#7da2d0" },
  { name: "Blanc Pur Nuage", hex: "#f0f2f5", border: "#d0d4dc" },
  { name: "Or Champagne", hex: "#edd9b4", border: "#d1b98d" },
  { name: "Noir Minuit", hex: "#15171c", border: "#08090b" },
  { name: "Blanc Pur", hex: "#fcfcfc", border: "#dcdcdc" },
  { name: "Vert Sauge", hex: "#9bb09f", border: "#768d7b" },
  { name: "Lavande", hex: "#b5a7c9", border: "#9381ad" },
  { name: "Titane Bleu Océan", hex: "#2b4c6f", border: "#18324f" },
  { name: "Titane Argent Naturel", hex: "#c0c2c4", border: "#9ea1a4" },
  { name: "Titane Orange Cosmique", hex: "#e67332", border: "#b85319" },
  { name: "Bleu Glacier", hex: "#8fb7d2", border: "#6896b5" },
  { name: "Titane Platine Argent", hex: "#d5d7da", border: "#abadb1" },
  { name: "Titane Noir Onyx", hex: "#1a1a1c", border: "#0d0d0e" },
  { name: "Titane Bordeaux", hex: "#5e1927", border: "#3e0d17" },
  { name: "Titane Bordeaux Impérial", hex: "#521422", border: "#360a14" },
];
