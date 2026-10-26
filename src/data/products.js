export const products = [
  // --- VENTES FLASH & PROMOTIONS ---
  {
    id: 'pcfa-promo-vip-pack',
    name: 'Pack VIP PROMO : iPhone 15 Pro Max 256 Go + AirPods Pro 2 Offerts',
    category: 'promotion',
    brand: 'Apple',
    price: 490000,
    salePrice: 420000,
    image: '/products/apple/iphone-15-pro-naturaltitanium.png',
    rating: 5.0,
    colors: ['Titane Naturel', 'Titane Bleu', 'Titane Noir'],
    storageOptions: [
      { capacity: '256 Go', price: 420000 }
    ],
    images: [
      '/products/apple/iphone-15-pro-naturaltitanium.png',
      '/products/apple/iphone-15-pro-bluetitanium.png',
      '/products/apple/iphone-15-pro-blacktitanium.png'
    ],
    specs: {
      screen: '6.7" Titane Grade 5 Super Retina XDR ProMotion',
      processor: 'A17 Pro 3nm haute vélocité',
      camera: 'Triple optique pro 48MP & Zoom 5x',
      battery: 'Recharge rapide USB-C',
      discountText: '-70 000 FCFA + AirPods Pro 2 offerts',
      promoEnd: 'Dans la limite du stock disponible',
      bonusIncluded: 'AirPods Pro 2 + Coque antichoc offerte'
    },
    desc: 'Offre promotionnelle exclusive Prince CFA : iPhone 15 Pro Max 256 Go neuf scellé avec AirPods Pro 2 offerts et remise immédiate de 70 000 FCFA.'
  },
  // --- IPHONES ---
  {
    id: 'pcfa-se3',
    name: 'iPhone SE (3e Génération)',
    category: 'phones',
    brand: 'Iphones',
    price: 85000,
    image: '/products/apple/iphone-se-midnight.png',
    rating: 4.8,
    colors: ['Minuit', 'Lumière stellaire', '(PRODUCT)RED'],
    storageOptions: [
      { capacity: '128 Go', price: 85000 }
    ],
    images: [
      '/products/apple/iphone-se-midnight.png',
      '/products/apple/iphone-se-starlight.png',
      '/products/apple/iphone-se-product-red.png'
    ],
    specs: {
      screen: '4.7" Retina HD',
      processor: 'A15 Bionic 5G',
      camera: '12MP Grand-angle avec Smart HDR 4',
      battery: 'Touch ID & Recharge rapide'
    },
    desc: 'La puissance de la puce A15 Bionic dans le format compact le plus populaire. 5G ultra-rapide et autonomie améliorée.'
  },
  {
    id: 'pcfa-11',
    name: 'iPhone 11',
    category: 'phones',
    brand: 'Iphones',
    price: 120000,
    image: '/products/apple/iphone-11-black.png',
    rating: 4.8,
    colors: ['Noir', 'Blanc', 'Mauve', 'Vert', 'Jaune', 'Rouge'],
    storageOptions: [
      { capacity: '128 Go', price: 120000 }
    ],
    images: [
      '/products/apple/iphone-11-black.png',
      '/products/apple/iphone-11-white.png',
      '/products/apple/iphone-11-purple.png',
      '/products/apple/iphone-11-green.png',
      '/products/apple/iphone-11-yellow.png',
      '/products/apple/iphone-11-red.png'
    ],
    specs: {
      screen: '6.1" Liquid Retina HD',
      processor: 'A13 Bionic avec Neural Engine',
      camera: 'Double appareil 12MP Ultra grand-angle',
      battery: 'Autonomie d’une journée entière'
    },
    desc: 'Écran Liquid Retina 6,1 pouces, double appareil photo ultra grand-angle et mode Nuit exceptionnel.'
  },
  {
    id: 'pcfa-11pro',
    name: 'iPhone 11 Pro',
    category: 'phones',
    brand: 'Iphones',
    price: 150000,
    image: '/products/apple/iphone-11-pro-space.png',
    rating: 4.8,
    colors: ['Gris sidéral', 'Argent', 'Vert nuit', 'Or'],
    storageOptions: [
      { capacity: '256 Go', price: 150000 }
    ],
    images: [
      '/products/apple/iphone-11-pro-space.png',
      '/products/apple/iphone-11-pro-silver.png',
      '/products/apple/iphone-11-pro-midnightgreen.png',
      '/products/apple/iphone-11-pro-gold.png'
    ],
    specs: {
      screen: '5.8" Super Retina XDR OLED',
      processor: 'A13 Bionic',
      camera: 'Triple capteur 12MP Téléobjectif & Grand-angle',
      battery: 'Acier inoxydable chirurgical et verre mat'
    },
    desc: 'Finition prestige en acier inoxydable, triple capteur photo professionnel et écran Super Retina XDR.'
  },
  {
    id: 'pcfa-12',
    name: 'iPhone 12',
    category: 'phones',
    brand: 'Iphones',
    price: 130000,
    image: '/products/apple/iphone-12-blue.png',
    rating: 4.8,
    colors: ['Bleu', 'Noir', 'Blanc', 'Vert', 'Mauve'],
    storageOptions: [
      { capacity: '64 Go', price: 130000 },
      { capacity: '128 Go', price: 145000 }
    ],
    images: [
      '/products/apple/iphone-12-blue.png',
      '/products/apple/iphone-12-black.png',
      '/products/apple/iphone-12-white.png',
      '/products/apple/iphone-12-green.png',
      '/products/apple/iphone-12-purple.png'
    ],
    specs: {
      screen: '6.1" Super Retina XDR OLED',
      processor: 'A14 Bionic avec 5G',
      camera: 'Double appareil photo 12MP avec Ceramic Shield',
      battery: 'Compatible MagSafe'
    },
    desc: 'Design à bords plats en aluminium aérospatial, écran OLED immersif et protection Ceramic Shield 4x plus résistante.'
  },
  {
    id: 'pcfa-13',
    name: 'iPhone 13',
    category: 'phones',
    brand: 'Iphones',
    price: 170000,
    image: '/products/apple/iphone-13-midnight.png',
    rating: 4.9,
    colors: ['Minuit', 'Lumière stellaire', 'Bleu', 'Rose', 'Vert'],
    storageOptions: [
      { capacity: '128 Go', price: 170000 }
    ],
    images: [
      '/products/apple/iphone-13-midnight.png',
      '/products/apple/iphone-13-starlight.png',
      '/products/apple/iphone-13-blue.png',
      '/products/apple/iphone-13-pink.png',
      '/products/apple/iphone-13-green.png'
    ],
    specs: {
      screen: '6.1" Super Retina XDR OLED',
      processor: 'A15 Bionic ultra-rapide',
      camera: 'Mode Cinématique & Double objectif en diagonale',
      battery: 'Batterie longue durée (+2,5h)'
    },
    desc: 'Le célèbre mode Cinématique avec mise au point automatique dynamique, capteurs photos avancés et puce A15 Bionic.'
  },
  {
    id: 'pcfa-13pro',
    name: 'iPhone 13 Pro',
    category: 'phones',
    brand: 'Iphones',
    price: 240000,
    image: '/products/apple/iphone-13-pro-blue.png',
    rating: 4.9,
    colors: ['Bleu alpin', 'Graphite', 'Argent', 'Or'],
    storageOptions: [
      { capacity: '256 Go', price: 240000 }
    ],
    images: [
      '/products/apple/iphone-13-pro-blue.png',
      '/products/apple/iphone-13-pro-graphite.png',
      '/products/apple/iphone-13-pro-silver.png',
      '/products/apple/iphone-13-pro-gold.png'
    ],
    specs: {
      screen: '6.1" ProMotion 120Hz Super Retina XDR',
      processor: 'A15 Bionic GPU 5 cœurs',
      camera: 'Triple capteur Pro Macro & Zoom optique 3x',
      battery: 'Châssis en acier inoxydable chirurgical'
    },
    desc: 'Écran ultra-fluide ProMotion 120Hz adaptatif, macrophotographie spectaculaire et finition haut de gamme.'
  },
  {
    id: 'pcfa-13promax',
    name: 'iPhone 13 Pro Max',
    category: 'phones',
    brand: 'Iphones',
    price: 250000,
    image: '/products/apple/iphone-13-promax-blue.png',
    rating: 4.9,
    colors: ['Bleu alpin', 'Graphite', 'Argent', 'Or'],
    storageOptions: [
      { capacity: '128 Go', price: 250000 },
      { capacity: '256 Go', price: 280000 }
    ],
    images: [
      '/products/apple/iphone-13-promax-blue.png',
      '/products/apple/iphone-13-promax-graphite.png',
      '/products/apple/iphone-13-promax-silver.png',
      '/products/apple/iphone-13-promax-gold.png'
    ],
    specs: {
      screen: '6.7" ProMotion 120Hz Super Retina XDR',
      processor: 'A15 Bionic avec GPU 5 cœurs',
      camera: 'Triple capteur Pro Zoom 3x + Macro',
      battery: 'Batterie monstre de référence'
    },
    desc: 'Grand écran de 6,7 pouces, autonomie légendaire parmi les meilleures du marché et performances Pro.'
  },
  {
    id: 'pcfa-14pro',
    name: 'iPhone 14 Pro (eSIM)',
    category: 'phones',
    brand: 'Iphones',
    price: 280000,
    image: '/products/apple/iphone-14-pro-deeppurple.png',
    rating: 4.9,
    colors: ['Violet intense', 'Noir sidéral', 'Argent', 'Or'],
    storageOptions: [
      { capacity: '256 Go eSIM', price: 280000 }
    ],
    images: [
      '/products/apple/iphone-14-pro-deeppurple.png',
      '/products/apple/iphone-14-pro-spaceblack.png',
      '/products/apple/iphone-14-pro-silver.png',
      '/products/apple/iphone-14-pro-gold.png'
    ],
    specs: {
      screen: '6.1" Dynamic Island Toujours activé 120Hz',
      processor: 'A16 Bionic 4nm',
      camera: 'Capteur principal 48MP ProRAW',
      battery: 'Détection des accidents et SOS satellite'
    },
    desc: 'L’introduction révolutionnaire de la Dynamic Island, capteur photo pro 48 mégapixels et écran Always-On.'
  },
  {
    id: 'pcfa-14promax',
    name: 'iPhone 14 Pro Max (eSIM)',
    category: 'phones',
    brand: 'Iphones',
    price: 300000,
    image: '/products/apple/iphone-14-pro-deeppurple.png',
    rating: 4.9,
    colors: ['Violet intense', 'Noir sidéral', 'Argent', 'Or'],
    storageOptions: [
      { capacity: '128 Go eSIM', price: 300000 },
      { capacity: '256 Go eSIM', price: 325000 }
    ],
    images: [
      '/products/apple/iphone-14-pro-deeppurple.png',
      '/products/apple/iphone-14-pro-spaceblack.png',
      '/products/apple/iphone-14-pro-silver.png',
      '/products/apple/iphone-14-pro-gold.png'
    ],
    specs: {
      screen: '6.7" Dynamic Island Super Retina XDR 2000 nits',
      processor: 'A16 Bionic 6 cœurs',
      camera: 'Triple capteur 48MP avec mode Action',
      battery: 'Jusqu’à 29h de lecture vidéo'
    },
    desc: 'Le summum de la gamme 14 : grand écran 6,7 pouces 2000 nits au soleil, Dynamic Island et triple optique 48MP.'
  },
  {
    id: 'pcfa-15pro',
    name: 'iPhone 15 Pro (eSIM)',
    category: 'phones',
    brand: 'Iphones',
    price: 350000,
    image: '/products/apple/iphone-15-pro-naturaltitanium.png',
    rating: 4.9,
    colors: ['Titane Naturel', 'Titane Bleu', 'Titane Blanc', 'Titane Noir'],
    storageOptions: [
      { capacity: '256 Go eSIM', price: 350000 }
    ],
    images: [
      '/products/apple/iphone-15-pro-naturaltitanium.png',
      '/products/apple/iphone-15-pro-bluetitanium.png',
      '/products/apple/iphone-15-pro-whitetitanium.png',
      '/products/apple/iphone-15-pro-blacktitanium.png'
    ],
    specs: {
      screen: '6.1" Titane aérospatial ProMotion 120Hz',
      processor: 'A17 Pro avec Ray Tracing matériel (3nm)',
      camera: 'Système photo pro 48MP & Bouton Action',
      battery: 'Connecteur USB-C ultra-rapide (USB 3)'
    },
    desc: 'Châssis en titane ultra-léger et résistant, premier processeur 3nm A17 Pro taillé pour les jeux consoles et USB-C.'
  },
  {
    id: 'pcfa-15promax',
    name: 'iPhone 15 Pro Max (eSIM)',
    category: 'phones',
    brand: 'Iphones',
    price: 400000,
    salePrice: 375000,
    image: '/products/apple/iphone-15-pro-naturaltitanium.png',
    rating: 5.0,
    colors: ['Titane Naturel', 'Titane Bleu', 'Titane Blanc', 'Titane Noir'],
    storageOptions: [
      { capacity: '256 Go eSIM', price: 400000 }
    ],
    images: [
      '/products/apple/iphone-15-pro-naturaltitanium.png',
      '/products/apple/iphone-15-pro-bluetitanium.png',
      '/products/apple/iphone-15-pro-whitetitanium.png',
      '/products/apple/iphone-15-pro-blacktitanium.png'
    ],
    specs: {
      screen: '6.7" Titane Grade 5 Super Retina XDR',
      processor: 'A17 Pro 3nm surpuissant',
      camera: 'Téléobjectif périscopique Zoom Optique 5x tétraprisme',
      battery: 'Port USB-C et autonomie record'
    },
    desc: 'Le monstre de puissance Apple avec le tout nouveau zoom optique 5x à tétraprisme, boîtier titane et connectique USB-C.'
  },
  {
    id: 'pcfa-16',
    name: 'iPhone 16 (1 SIM)',
    category: 'phones',
    brand: 'Iphones',
    price: 385000,
    image: '/products/apple/iphone-16-ultramarine.png',
    rating: 4.9,
    colors: ['Bleu outremer', 'Sarcelle', 'Rose', 'Blanc', 'Noir'],
    storageOptions: [
      { capacity: '256 Go 1SIM', price: 385000 }
    ],
    images: [
      '/products/apple/iphone-16-ultramarine.png',
      '/products/apple/iphone-16-teal.png',
      '/products/apple/iphone-16-pink.png',
      '/products/apple/iphone-16-white.png',
      '/products/apple/iphone-16-black.png'
    ],
    specs: {
      screen: '6.1" OLED avec Bouton Commande de l’appareil photo',
      processor: 'Puce A18 conçue pour Apple Intelligence',
      camera: 'Double capteur Fusion 48MP & Macro 2-en-1',
      battery: 'Autonomie boostée et verre Ceramic Shield dernière génération'
    },
    desc: 'Nouveau bouton tactile dédié Commande de l’appareil photo, puce A18 dernière génération prête pour Apple Intelligence.'
  },
  {
    id: 'pcfa-16pro',
    name: 'iPhone 16 Pro (eSIM)',
    category: 'phones',
    brand: 'Iphones',
    price: 435000,
    image: '/products/apple/iphone-16-pro-deserttitanium.png',
    rating: 5.0,
    colors: ['Titane Désert', 'Titane Naturel', 'Titane Blanc', 'Titane Noir'],
    storageOptions: [
      { capacity: '128 Go eSIM', price: 435000 },
      { capacity: '256 Go eSIM', price: 480000 }
    ],
    images: [
      '/products/apple/iphone-16-pro-deserttitanium.png',
      '/products/apple/iphone-16-pro-naturaltitanium.png',
      '/products/apple/iphone-16-pro-whitetitanium.png',
      '/products/apple/iphone-16-pro-blacktitanium.png'
    ],
    specs: {
      screen: '6.3" Bordures ultra-fines ProMotion 120Hz',
      processor: 'A18 Pro (Gravure 3nm seconde génération)',
      camera: 'Vidéo 4K 120 i/s Dolby Vision & Zoom optique 5x',
      battery: 'Microphones de qualité studio et Audio spatial'
    },
    desc: 'Le chef d’œuvre Apple : écran 6,3 pouces agrandi, zoom optique 5x, vidéo 4K à 120 images par seconde en Dolby Vision.'
  },
  {
    id: 'pcfa-16promax',
    name: 'iPhone 16 Pro Max (eSIM)',
    category: 'phones',
    brand: 'Iphones',
    price: 500000,
    image: '/products/apple/iphone-16-pro-deserttitanium.png',
    rating: 5.0,
    colors: ['Titane Désert', 'Titane Naturel', 'Titane Blanc', 'Titane Noir'],
    storageOptions: [
      { capacity: '256 Go eSIM', price: 500000 }
    ],
    images: [
      '/products/apple/iphone-16-pro-deserttitanium.png',
      '/products/apple/iphone-16-pro-naturaltitanium.png',
      '/products/apple/iphone-16-pro-whitetitanium.png',
      '/products/apple/iphone-16-pro-blacktitanium.png'
    ],
    specs: {
      screen: '6.9" Le plus grand écran jamais créé sur iPhone',
      processor: 'Puce A18 Pro surpuissante avec Neural Engine 16 cœurs',
      camera: 'Bouton Commande de l’appareil photo & Zoom 5x',
      battery: 'La plus grande autonomie de l’histoire d’Apple'
    },
    desc: 'Le smartphone le plus prestigieux et puissant au monde. Écran géant 6,9 pouces, boîtier titane couleur Désert et autonomie phénoménale.'
  },
  {
    id: 'pcfa-17air',
    name: 'iPhone 17 Air',
    category: 'phones',
    brand: 'Iphones',
    price: 625000,
    image: '/products/apple/iphone-17-air-skyblue.png',
    rating: 5.0,
    colors: ['Bleu Ciel Céleste', 'Blanc Pur Nuage', 'Or Champagne', 'Noir Sidéral'],
    storageOptions: [
      { capacity: '256 Go', price: 625000 },
      { capacity: '512 Go', price: 695000 },
      { capacity: '1 To', price: 785000 }
    ],
    images: [
      '/products/apple/iphone-17-air-skyblue.png',
      '/products/apple/iphone-17-air-cloudwhite.png',
      '/products/apple/iphone-17-air-lightgold.png',
      '/products/apple/iphone-17-air-spaceblack.png'
    ],
    specs: {
      screen: '6.6" OLED ProMotion 120Hz Châssis Ultra-Fin (5.5mm)',
      processor: 'Puce Apple A19 Bionic (Gravure 2nm)',
      camera: 'Barre caméra horizontale révolutionnaire avec capteur Fusion 48MP',
      battery: 'Batterie optimisée haute densité avec recharge rapide MagSafe'
    },
    desc: 'Le smartphone le plus fin et raffiné jamais conçu par Apple : silhouette ultra-mince de 5,5 mm, nouveau module caméra horizontal en bandeau et puce A19 Bionic.'
  },
  {
    id: 'pcfa-17',
    name: 'iPhone 17',
    category: 'phones',
    brand: 'Iphones',
    price: 520000,
    image: '/products/apple/iphone-17-black.png',
    rating: 4.9,
    colors: ['Noir Minuit', 'Blanc Pur', 'Vert Sauge', 'Lavande'],
    storageOptions: [
      { capacity: '128 Go', price: 520000 },
      { capacity: '256 Go', price: 580000 },
      { capacity: '512 Go', price: 660000 }
    ],
    images: [
      '/products/apple/iphone-17-black.png',
      '/products/apple/iphone-17-white.png',
      '/products/apple/iphone-17-sage.png',
      '/products/apple/iphone-17-lavender.png'
    ],
    specs: {
      screen: '6.3" ProMotion 120Hz Super Retina XDR',
      processor: 'Puce A19 avec Apple Intelligence 2.0',
      camera: 'Double capteur 48MP avec vidéo spatiale 4K',
      battery: 'Autonomie toute la journée et Ceramic Shield 2'
    },
    desc: 'Écran ProMotion 120Hz désormais de série, double capteur photo ultra-lumineux et puce A19 gravée en 2nm.'
  },
  {
    id: 'pcfa-17pro',
    name: 'iPhone 17 Pro',
    category: 'phones',
    brand: 'Iphones',
    price: 690000,
    image: '/products/apple/iphone-17-pro-deepblue.png',
    rating: 5.0,
    colors: ['Titane Bleu Océan', 'Titane Argent Naturel', 'Titane Orange Cosmique'],
    storageOptions: [
      { capacity: '256 Go', price: 690000 },
      { capacity: '512 Go', price: 780000 },
      { capacity: '1 To', price: 890000 }
    ],
    images: [
      '/products/apple/iphone-17-pro-deepblue.png',
      '/products/apple/iphone-17-pro-silver.png',
      '/products/apple/iphone-17-pro-cosmicorange.png'
    ],
    specs: {
      screen: '6.3" Dynamic Island 120Hz ProMotion 3000 nits',
      processor: 'Puce A19 Pro (2nm) 12 cœurs GPU',
      camera: 'Nouveau module bandeau unifié en titane + Zoom Périscopique optique 5x',
      battery: 'Châssis en titane unibody et recharge sans fil 35W'
    },
    desc: 'L’excellence photographique professionnelle avec le nouveau bandeau caméra transversal en titane, processeur A19 Pro 2nm et zoom optique haute précision.'
  },
  {
    id: 'pcfa-17promax',
    name: 'iPhone 17 Pro Max',
    category: 'phones',
    brand: 'Iphones',
    price: 750000,
    image: '/products/apple/iphone-17-promax-deepblue.png',
    rating: 5.0,
    colors: ['Titane Bleu Océan', 'Titane Argent Naturel', 'Titane Orange Cosmique'],
    storageOptions: [
      { capacity: '256 Go', price: 750000 },
      { capacity: '512 Go', price: 840000 },
      { capacity: '1 To', price: 960000 },
      { capacity: '2 To', price: 1100000 }
    ],
    images: [
      '/products/apple/iphone-17-promax-deepblue.png',
      '/products/apple/iphone-17-promax-silver.png',
      '/products/apple/iphone-17-promax-cosmicorange.png'
    ],
    specs: {
      screen: '6.9" Écran géant Super Retina XDR 3000 nits bordures invisibles',
      processor: 'Puce A19 Pro avec chambre à vapeur intégrée',
      camera: 'Système photo 48MP Triple capteur Zoom optique 8x & 8K Dolby Vision',
      battery: 'Batterie monstre dépassant 35h d’autonomie'
    },
    desc: 'Le fleuron absolu d’Apple. Écran immersif 6,9 pouces, nouveau design caméra bandeau en titane, zoom optique 8x et autonomie record.'
  },
  {
    id: 'pcfa-18',
    name: 'iPhone 18',
    category: 'phones',
    brand: 'Iphones',
    price: 590000,
    image: '/products/apple/iphone-18-glacier.png',
    rating: 5.0,
    colors: ['Bleu Glacier', 'Titane Platine Argent', 'Titane Noir Onyx', 'Titane Bordeaux'],
    storageOptions: [
      { capacity: '128 Go', price: 590000 },
      { capacity: '256 Go', price: 660000 },
      { capacity: '512 Go', price: 750000 }
    ],
    images: [
      '/products/apple/iphone-18-glacier.png',
      '/products/apple/iphone-18-silver.png',
      '/products/apple/iphone-18-black.png',
      '/products/apple/iphone-18-burgundy.png'
    ],
    specs: {
      screen: '6.3" OLED micro-lentilles 120Hz 3200 nits',
      processor: 'Puce Apple A20 Bionic avec IA générative embarquée',
      camera: 'Capteur Fusion 48MP avec capteur spectral',
      battery: 'Batterie au graphène à recharge ultra-rapide'
    },
    desc: 'Nouvelle génération futuriste propulsée par la puce A20 Bionic, écran ultra-lumineux et intelligence prédictive instantanée.'
  },
  {
    id: 'pcfa-18pro',
    name: 'iPhone 18 Pro',
    category: 'phones',
    brand: 'Iphones',
    price: 790000,
    image: '/products/apple/iphone-18-pro-black.png',
    rating: 5.0,
    colors: ['Titane Noir Onyx', 'Titane Platine Argent', 'Titane Bordeaux Impérial', 'Titane Bleu Glacier'],
    storageOptions: [
      { capacity: '256 Go', price: 790000 },
      { capacity: '512 Go', price: 890000 },
      { capacity: '1 To', price: 1020000 }
    ],
    images: [
      '/products/apple/iphone-18-pro-black.png',
      '/products/apple/iphone-18-pro-silver.png',
      '/products/apple/iphone-18-pro-burgundy.png',
      '/products/apple/iphone-18-pro-glacier.png'
    ],
    specs: {
      screen: '6.3" LTPO Super Retina XDR 1-120Hz avec Face ID invisible',
      processor: 'Puce Apple A20 Pro (gravure 2nm) 12 Go RAM',
      camera: 'Triple capteur 48MP Pro Fusion avec ouverture variable mécanique f/1.4 - f/4.0',
      battery: 'Autonomie inégalée avec recharge rapide 45W'
    },
    desc: 'L’apogée de l’ingénierie mobile : ouverture variable mécanique, puce A20 Pro 2nm 12 Go RAM et châssis ultra-résistant.'
  },
  {
    id: 'pcfa-18promax',
    name: 'iPhone 18 Pro Max',
    category: 'phones',
    brand: 'Iphones',
    price: 890000,
    image: '/products/apple/iphone-18-promax-black.png',
    rating: 5.0,
    colors: ['Titane Noir Onyx', 'Titane Platine Argent', 'Titane Bordeaux Impérial', 'Titane Bleu Glacier'],
    storageOptions: [
      { capacity: '256 Go', price: 890000 },
      { capacity: '512 Go', price: 990000 },
      { capacity: '1 To', price: 1150000 },
      { capacity: '2 To', price: 1350000 }
    ],
    images: [
      '/products/apple/iphone-18-promax-black.png',
      '/products/apple/iphone-18-promax-silver.png',
      '/products/apple/iphone-18-promax-burgundy.png',
      '/products/apple/iphone-18-promax-glacier.png'
    ],
    specs: {
      screen: '6.9" Écran géant immersif 120Hz 3000 nits revêtement anti-reflet',
      processor: 'Puce Apple A20 Pro (2nm) avec Apple Intelligence avancée',
      camera: 'Système photo 48MP Pro Fusion ouverture variable mécanique & Zoom périscopique',
      battery: 'Batterie colossale 5567 mAh autonomie record'
    },
    desc: 'Le smartphone le plus puissant et autonome au monde : écran 6,9 pouces, batterie colossale 5567 mAh, capteur à ouverture mécanique et puce A20 Pro.'
  },

  // --- GOOGLE PIXEL ---
  {
    id: 'pcfa-pixel6a',
    name: 'Google Pixel 6a',
    category: 'phones',
    brand: 'Google Pixel',
    price: 110000,
    image: '/products/google/pixel6a-sauge.jpg',
    rating: 4.7,
    colors: ['Sauge', 'Charbon', 'Galet'],
    storageOptions: [
      { capacity: '128 Go', price: 110000 }
    ],
    images: [
      '/products/google/pixel6a-sauge.jpg',
      '/products/google/pixel6a-charbon.jpg',
      '/products/google/pixel6a-galet.jpg'
    ],
    specs: {
      screen: '6.1" OLED FHD+ 60Hz',
      processor: 'Google Tensor G1 avec puce Titan M2',
      camera: 'Double capteur 12MP avec Real Tone & Gomme Magique',
      battery: '4410 mAh avec recharge rapide'
    },
    desc: 'L’intelligence Google et la célèbre gomme magique photo au meilleur prix du marché.'
  },
  {
    id: 'pcfa-pixel7a',
    name: 'Google Pixel 7a',
    category: 'phones',
    brand: 'Google Pixel',
    price: 120000,
    image: '/products/google/pixel7a-ocean.jpg',
    rating: 4.8,
    colors: ['Océan', 'Neige', 'Charbon', 'Corail'],
    storageOptions: [
      { capacity: '128 Go', price: 120000 }
    ],
    images: [
      '/products/google/pixel7a-ocean.jpg',
      '/products/google/pixel7a-neige.jpg',
      '/products/google/pixel7a-charbon.jpg',
      '/products/google/pixel7a-corail.jpg'
    ],
    specs: {
      screen: '6.1" OLED 90Hz Smooth Display',
      processor: 'Google Tensor G2',
      camera: 'Capteur principal 64MP avec Zoom haute résolution 8x',
      battery: '4385 mAh avec recharge sans fil'
    },
    desc: 'L’un des meilleurs photophones de sa catégorie avec capteur 64MP et écran fluide 90Hz.'
  },
  {
    id: 'pcfa-pixel8a',
    name: 'Google Pixel 8a',
    category: 'phones',
    brand: 'Google Pixel',
    price: 150000,
    image: '/products/google/pixel8a-baie.jpg',
    rating: 4.9,
    colors: ['Baie', 'Volcanique', 'Porcelaine', 'Menthe'],
    storageOptions: [
      { capacity: '128 Go', price: 150000 }
    ],
    images: [
      '/products/google/pixel8a-baie.jpg',
      '/products/google/pixel8a-volcanique.jpg',
      '/products/google/pixel8a-porcelaine.jpg',
      '/products/google/pixel8a-menthe.jpg'
    ],
    specs: {
      screen: '6.1" Actua OLED 120Hz (2000 nits)',
      processor: 'Google Tensor G3 avec IA Gemini Nano',
      camera: '64MP Ultra haute précision avec Meilleure Prise & Retouche Magique',
      battery: '4492 mAh avec 7 ans de mises à jour'
    },
    desc: 'Puce Google Tensor G3 avec intelligence artificielle Gemini intégrée et écran lumineux Actua 120Hz.'
  },

  // --- SAMSUNG GALAXY S & FOLD ---
  {
    id: 'pcfa-s21',
    name: 'Samsung Galaxy S21 5G',
    category: 'phones',
    brand: 'Samsung',
    price: 135000,
    image: '/products/samsung/s21-gray.jpg',
    rating: 4.7,
    colors: ['Phantom Gray', 'Phantom Violet', 'Phantom White', 'Phantom Pink'],
    storageOptions: [
      { capacity: '256 Go', price: 135000 }
    ],
    images: [
      '/products/samsung/s21-gray.jpg',
      '/products/samsung/s21-violet.jpg',
      '/products/samsung/s21-white.jpg',
      '/products/samsung/s21-pink.jpg'
    ],
    specs: {
      screen: '6.2" Dynamic AMOLED 2X 120Hz',
      processor: 'Exynos 2100 / Snapdragon 888 5G',
      camera: 'Triple capteur 64MP avec vidéo 8K',
      battery: '4000 mAh avec charge sans fil inversée'
    },
    desc: 'Design emblématique avec bloc photo Contour Cut, vidéo cinéma 8K et écran Dynamic AMOLED 120Hz.'
  },
  {
    id: 'pcfa-s22',
    name: 'Samsung Galaxy S22 5G',
    category: 'phones',
    brand: 'Samsung',
    price: 165000,
    image: '/products/samsung/s22-black.jpg',
    rating: 4.8,
    colors: ['Phantom Black', 'Vert Forêt', 'Phantom White', 'Or Rose'],
    storageOptions: [
      { capacity: '256 Go', price: 165000 }
    ],
    images: [
      '/products/samsung/s22-black.jpg',
      '/products/samsung/s22-green.jpg',
      '/products/samsung/s22-white.jpg',
      '/products/samsung/s22-pink.jpg'
    ],
    specs: {
      screen: '6.1" Dynamic AMOLED 2X 120Hz Vision Booster',
      processor: 'Snapdragon 8 Gen 1 (4nm)',
      camera: 'Capteur principal 50MP Nightography',
      battery: 'Cadre Armor Aluminum et verre Gorilla Glass Victus+'
    },
    desc: 'Photographie de nuit Nightography éclatante, châssis compact en aluminium blindé et écran lumineux 120Hz.'
  },
  {
    id: 'pcfa-fold3',
    name: 'Samsung Galaxy Z Fold 3 5G',
    category: 'phones',
    brand: 'Samsung',
    price: 235000,
    image: '/products/samsung/fold3-black.jpg',
    rating: 4.8,
    colors: ['Phantom Black', 'Phantom Silver', 'Phantom Green'],
    storageOptions: [
      { capacity: '256 Go', price: 235000 },
      { capacity: '512 Go', price: 250000 }
    ],
    images: [
      '/products/samsung/fold3-black.jpg',
      '/products/samsung/fold3-silver.jpg',
      '/products/samsung/fold3-green.jpg'
    ],
    specs: {
      screen: '7.6" Dynamic AMOLED 2X Pliable 120Hz + 6.2" Externe',
      processor: 'Snapdragon 888 5G',
      camera: 'Triple capteur 12MP & Caméra sous l’écran',
      battery: '4400 mAh compatible stylet S-Pen'
    },
    desc: 'L’expérience tablette pliable dans la poche : écran géant 7,6 pouces 120Hz et étanchéité IPX8.'
  },
  {
    id: 'pcfa-fold4',
    name: 'Samsung Galaxy Z Fold 4 5G',
    category: 'phones',
    brand: 'Samsung',
    price: 260000,
    image: '/products/samsung/fold4-graygreen.jpg',
    rating: 4.8,
    colors: ['Graygreen', 'Phantom Black', 'Beige'],
    storageOptions: [
      { capacity: '256 Go', price: 260000 },
      { capacity: '512 Go', price: 280000 }
    ],
    images: [
      '/products/samsung/fold4-graygreen.jpg',
      '/products/samsung/fold4-black.jpg',
      '/products/samsung/fold4-beige.jpg'
    ],
    specs: {
      screen: '7.6" QXGA+ Dynamic AMOLED 2X Pliable + 6.2" HD+',
      processor: 'Snapdragon 8+ Gen 1 ultra-efficace',
      camera: 'Capteur principal 50MP avec Space Zoom 30x',
      battery: '4400 mAh avec barre des tâches multitâche'
    },
    desc: 'Charnière affinée et écran plus large, capteur photo haute définition 50MP et barre des tâches multitâche intuitive.'
  },
  {
    id: 'pcfa-fold5',
    name: 'Samsung Galaxy Z Fold 5 5G',
    category: 'phones',
    brand: 'Samsung',
    price: 325000,
    image: '/products/samsung/fold5-blue.jpg',
    rating: 4.9,
    colors: ['Bleu Glacier', 'Noir Fantôme', 'Crème'],
    storageOptions: [
      { capacity: '256 Go', price: 325000 },
      { capacity: '512 Go', price: 345000 }
    ],
    images: [
      '/products/samsung/fold5-blue.jpg',
      '/products/samsung/fold5-black.jpg',
      '/products/samsung/fold5-cream.jpg'
    ],
    specs: {
      screen: '7.6" Dynamic AMOLED 2X 1750 nits Flex Hinge',
      processor: 'Snapdragon 8 Gen 2 For Galaxy',
      camera: 'Triple capteur 50MP + 12MP + 10MP Zoom optique 3x',
      battery: 'Fermeture plate totale sans espace'
    },
    desc: 'Nouvelle charnière Flex Hinge avec fermeture complètement à plat, processeur Snapdragon 8 Gen 2 surpuissant.'
  },
  {
    id: 'pcfa-fold6',
    name: 'Samsung Galaxy Z Fold 6 5G',
    category: 'phones',
    brand: 'Samsung',
    price: 460000,
    image: '/products/samsung/fold6-silver.png',
    rating: 5.0,
    colors: ['Gris Argent', 'Bleu Nuit', 'Rose'],
    storageOptions: [
      { capacity: '256 Go', price: 460000 },
      { capacity: '512 Go', price: 495000 }
    ],
    images: [
      '/products/samsung/fold6-silver.png',
      '/products/samsung/fold6-navy.png',
      '/products/samsung/fold6-pink.png'
    ],
    specs: {
      screen: '7.6" 2600 nits Dynamic AMOLED 2X + 6.3" Externe',
      processor: 'Snapdragon 8 Gen 3 avec Galaxy AI intégrée',
      camera: '50MP avec ProVisual Engine IA',
      battery: 'Design angulaire ultra-fin en titane & aluminium blindé'
    },
    desc: 'Le smartphone pliant le plus sophistiqué de Samsung avec intelligence artificielle Galaxy AI et écran ultra-lumineux 2600 nits.'
  },
  {
    id: 'pcfa-fold7',
    name: 'Samsung Galaxy Z Fold 7 / Special Edition',
    category: 'phones',
    brand: 'Samsung',
    price: 750000,
    image: '/products/samsung/fold7-black.jpg',
    rating: 5.0,
    colors: ['Noir Titane', 'Or Prestige'],
    storageOptions: [
      { capacity: '256 Go', price: 750000 },
      { capacity: '512 Go', price: 860000 }
    ],
    images: [
      '/products/samsung/fold7-black.jpg',
      '/products/samsung/fold7-gold.jpg'
    ],
    specs: {
      screen: '8.0" Écran Pliable Immense + 6.5" Écran Externe Large',
      processor: 'Snapdragon 8 Gen 3 Extreme Edition (16 Go RAM)',
      camera: 'Capteur Révolutionnaire 200MP Ultra-Précis',
      battery: 'Le pliable le plus fin et prestigieux jamais conçu'
    },
    desc: 'L’édition prestige ultime du Galaxy Z Fold : écran déployé géant de 8 pouces, boîtier titane extra-fin et capteur 200 mégapixels.'
  },

  // --- LIFESTYLE & HAUT DE GAMME ---
  {
    id: 'p-002',
    name: 'Vision 8K Smart TV OLED 85"',
    category: 'tv',
    price: 3200000,
    image: 'https://placehold.co/800x600/121216/d4af37?text=TV+8K',
    rating: 5.0,
    specs: {
      resolution: '7680 x 4320 (8K UHD)',
      panel: 'OLED Evo',
      audio: 'Dolby Atmos 7.1',
      smart: 'WebOS avec IA intégrée'
    },
    desc: 'Une expérience cinématographique immersive au cœur de votre salon, avec un contraste infini et une pureté visuelle inégalée.'
  },
  {
    id: 'p-003',
    name: 'Boomer Titan Gold Edition',
    category: 'audio',
    price: 450000,
    image: 'https://placehold.co/600x600/121216/d4af37?text=BOOMER',
    rating: 4.8,
    specs: {
      power: '1200W RMS',
      connectivity: 'Bluetooth 5.3, Wi-Fi, NFC',
      battery_life: '24 heures',
      waterproof: 'IP67'
    },
    desc: 'Une enceinte surpuissante aux finitions dorées, capable de sonoriser les soirées les plus prestigieuses avec des basses profondes.'
  },
  {
    id: 'pcfa-honda-uvo-gt',
    name: 'Scooter Électrique Honda U-VO GT Smart NFC (72V)',
    category: 'mobility',
    brand: 'Honda',
    price: 925000,
    salePrice: 890000,
    image: '/products/mobility/honda-scooter-vert.jpg',
    rating: 4.9,
    colors: ['Vert Kaki Mat', 'Blanc Nacré', 'Gris Titane', 'Noir Phantom'],
    images: [
      '/products/mobility/honda-scooter-vert.jpg',
      '/products/mobility/honda-scooter-blanc.jpg',
      '/products/mobility/honda-scooter-arriere.jpg',
      '/products/mobility/honda-scooter-gris-side.jpg'
    ],
    warranty: 'Garantie 2 Ans Batterie & Moteur',
    accessories: 'Chargeur rapide secteur 220V, 2 Cartes NFC sans contact, Télécommande alarme antivol, Rétroviseurs, Trousse outils, Casque homologué offert',
    specs: {
      model: 'Wuyang-Honda U-VO GT (Édition NFC)',
      motor: '2100W Brushless Haute Performance (Pic 3200W)',
      motorPower: 2100,
      batteryCapacityWh: 2300,
      batteryVoltage: 72,
      range: '85 - 110 km',
      rangeKm: 100,
      max_speed: '70 km/h',
      speed: '70 km/h',
      maxSpeedKm: 70,
      charge_time: '4 à 5 heures',
      chargeTimeHours: 5,
      batteryType: 'lithium_removable',
      battery: '72V Lithium-Ion amovible haute densité',
      transmission: 'Automatique avec marche arrière assistée',
      brakes: 'Double frein à disque hydraulique avant / arrière',
      display: 'Compteur numérique LCD couleur haute visibilité',
      security: 'Démarrage sans clé NFC + Alarme antivol avec blocage moteur',
      lighting: 'Optiques Full LED haute luminosité avec feux de jour DRL'
    },
    desc: 'Le scooter électrique Honda U-VO GT incarne l’excellence technologique pour la mobilité urbaine à Ouagadougou. Propulsé par un moteur brushless 72V puissant et silencieux, il offre jusqu’à 110 km d’autonomie sur une seule charge, éliminant vos dépenses d’essence et de vidange. Équipé d’un système de démarrage sans clé par badge NFC, d’un double frein à disque pour une sécurité maximale et de suspensions renforcées adaptées aux routes sahéliennes, c’est le choix ultime alliant prestige, économies et robustesse.'
  },
  {
    id: 'p-004',
    name: 'AeroBike E-Urban 2026',
    category: 'mobility',
    price: 1850000,
    image: 'https://placehold.co/800x600/121216/d4af37?text=MOTO',
    rating: 4.7,
    specs: {
      motor: '8000W Brushless',
      range: '150 km',
      max_speed: '120 km/h',
      charge_time: '2 heures (Charge Rapide)'
    },
    desc: 'La moto électrique redéfinie pour la jungle urbaine. Silence de fonctionnement, puissance instantanée et design aérodynamique.'
  },
  {
    id: 'p-005',
    name: 'Kit Solaire Autonomie Totale 10kW',
    category: 'solar',
    price: 4500000,
    image: 'https://placehold.co/600x600/121216/d4af37?text=SOLAR',
    rating: 4.9,
    specs: {
      panels: '12x 800W Monocristallin',
      inverter: '10kW Hybride Intelligent',
      storage: 'Batteries Lithium-Ion 15kWh',
      warranty: '25 ans'
    },
    desc: 'Prenez le contrôle de votre énergie. Un kit solaire premium offrant une indépendance électrique totale pour votre résidence ou commerce.'
  },
  {
    id: 'p-006',
    name: 'Casque Audio Studio Prestige',
    category: 'audio',
    price: 250000,
    image: 'https://placehold.co/600x600/121216/d4af37?text=CASQUE',
    rating: 4.9,
    specs: {
      type: 'Circum-auriculaire sans fil',
      noise_cancelling: 'ANC Actif Adaptatif',
      battery: '40 heures',
      materials: 'Cuir véritable et Aluminium brossé'
    },
    desc: 'L’acoustique d’un studio d’enregistrement alliée au confort absolu, pour une écoute sans la moindre distraction.'
  },

  // --- ÉLECTROMÉNAGER ---
  {
    id: 'pcfa-app-fridge',
    name: 'Réfrigérateur Multi-Portes No Frost Inverter 450L',
    category: 'appliances',
    brand: 'Samsung',
    price: 420000,
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80',
    rating: 4.9,
    colors: ['Inox Brossé'],
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80'
    ],
    specs: {
      applianceType: 'Réfrigérateur / Congélateur',
      capacity: '450 Litres',
      energyClass: 'A+++',
      power: 'Digital Inverter',
      features: 'Froid ventilé No Frost, Distributeur d\'eau en façade'
    },
    desc: 'Réfrigérateur multi-portes haut de gamme avec compresseur Digital Inverter économe en énergie, technologie No Frost et double zone de fraîcheur.'
  },
  {
    id: 'pcfa-app-split',
    name: 'Climatiseur Split Smart Dual Inverter 1.5 CV',
    category: 'appliances',
    brand: 'LG',
    price: 265000,
    image: 'https://images.unsplash.com/photo-1614633833026-0e10b190f845?w=800&q=80',
    rating: 4.8,
    colors: ['Blanc Pur'],
    images: [
      'https://images.unsplash.com/photo-1614633833026-0e10b190f845?w=800&q=80'
    ],
    specs: {
      applianceType: 'Climatiseur / Split',
      capacity: '1.5 CV (12000 BTU)',
      energyClass: 'A+++ Inverter',
      power: 'Dual Inverter 70% économie',
      features: 'Refroidissement ultra-rapide Jet Cool, Silencieux 19dB'
    },
    desc: 'Climatiseur split puissant et ultra-silencieux avec technologie Dual Inverter garantissant une consommation électrique réduite et un confort thermique maximal.'
  },
  {
    id: 'pcfa-app-washer',
    name: 'Machine à Laver Frontale Steam Direct Drive 9 kg',
    category: 'appliances',
    brand: 'Midea',
    price: 295000,
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80',
    rating: 4.9,
    colors: ['Gris Anthracite'],
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80'
    ],
    specs: {
      applianceType: 'Machine à laver / Lave-linge',
      capacity: '9 kg',
      energyClass: 'A+++',
      power: 'Moteur Inverter Direct Drive',
      features: 'Programme vapeur anti-bactérien, Essorage 1400 tr/min'
    },
    desc: 'Lave-linge grande capacité 9 kg avec programme vapeur anti-allergène, essorage haute performance et moteur Inverter Direct Drive silencieux.'
  },

  // --- TABLETTES ---
  {
    id: 'pcfa-tab-enfant',
    name: 'Tablette Enfant Éducative BTOUCH KT12 (8.68")',
    category: 'tablets',
    brand: 'BTOUCH',
    price: 40000,
    image: '/products/tablets/tablette-enfant-kt12.jpg',
    rating: 4.9,
    colors: ['Bleu & Rose (Duo)'],
    storageOptions: [
      { capacity: '64 Go', price: 40000 },
      { capacity: '128 Go', price: 48000 }
    ],
    images: [
      '/products/tablets/tablette-enfant-kt12.jpg'
    ],
    specs: {
      model: 'BTOUCH KT12 Kids Early Education',
      screenSize: '8.68 pouces HD',
      screen: '8.68" HD Eye Protection',
      storageSize: '64 Go',
      ram: 4,
      connectivity: 'wifi_cellular',
      processor: 'Quad-Core Allwinner A133 Kids Boost',
      batteryCapacity: 5000,
      battery: '5000 mAh longue autonomie',
      stylusSupport: 'Compatible stylet & tactile multipoint',
      os: 'Android avec Contrôle Parental iWawa préinstallé'
    },
    desc: 'Tablette éducative 8.68 pouces spécialement conçue pour l\'apprentissage et le divertissement sécurisé des enfants. Livrée avec sa coque intégrale en silicone antichoc avec poignée/support pliable, filtre protecteur des yeux anti-lumière bleue, contrôle parental complet et dizaines de jeux et applications pédagogiques préinstallés.'
  },
  {
    id: 'pcfa-tab-moto-pad60',
    name: 'Tablette Moto Pad 60 Neo (avec Stylet Intelligent)',
    category: 'tablets',
    brand: 'Motorola',
    price: 140000,
    image: '/products/tablets/moto-pad-60-neo.jpg',
    rating: 4.9,
    colors: ['Gris Minéral'],
    storageOptions: [
      { capacity: '128 Go', price: 140000 },
      { capacity: '256 Go', price: 165000 }
    ],
    images: [
      '/products/tablets/moto-pad-60-neo.jpg'
    ],
    specs: {
      model: 'Moto Pad 60 Neo',
      screenSize: '11 pouces 2K (2000 x 1200) 90Hz',
      screen: '11" 2K IPS 90Hz',
      storageSize: '128 Go',
      ram: 8,
      connectivity: 'wifi_cellular',
      processor: 'MediaTek Helio G99 Octa-Core 2.2 GHz',
      batteryCapacity: 7700,
      battery: '7700 mAh + Charge Rapide 20W',
      stylusSupport: 'Stylet actif intelligent haute précision inclus',
      audio: 'Quad Speakers 4 Haut-parleurs Dolby Atmos',
      os: 'Android 14 pur avec mode bureau'
    },
    desc: 'Tablette premium Moto Pad 60 Neo avec châssis métallique monocoque ultra-fin, grand écran 11 pouces 2K 90Hz aux couleurs éclatantes et stylet intelligent inclus pour la prise de notes et le graphisme. Équipée d\'un processeur Octa-Core ultra-rapide, de 4 haut-parleurs Dolby Atmos et d\'une autonomie record de 7700 mAh.'
  },
  {
    id: 'pcfa-tab-17-promax',
    name: 'Tablette 17 Pro Max 5G (Design Prestige Orange)',
    category: 'tablets',
    brand: '17 Pro Max',
    price: 75000,
    image: '/products/tablets/tablette-17-pro-max.jpg',
    rating: 4.8,
    colors: ['Orange Impérial'],
    storageOptions: [
      { capacity: '128 Go', price: 75000 },
      { capacity: '256 Go', price: 89000 }
    ],
    images: [
      '/products/tablets/tablette-17-pro-max.jpg'
    ],
    specs: {
      model: '17 Pro Max 5G',
      screenSize: '10.1 pouces HD+ IPS',
      screen: '10.1" HD+ IPS Grand Format',
      storageSize: '128 Go',
      ram: 6,
      connectivity: 'wifi_cellular',
      processor: 'Octa-Core High Performance 5G',
      batteryCapacity: 6000,
      battery: '6000 mAh autonomie toute la journée',
      camera: 'Triple caméra arrière style Pro avec Flash LED',
      stylusSupport: 'Compatible stylet universel & clavier Bluetooth',
      os: 'Android 13 complet avec Google Play'
    },
    desc: 'Tablette grand format 10.1 pouces au style prestige inspiré des smartphones Pro, arborant un dos orange vibrant avec triple module photo. Connectivité cellulaire 4G/5G double SIM, 128 Go de stockage et 6 Go de RAM pour une utilisation multimédia fluide (YouTube, streaming, réseaux sociaux, télétravail et études).'
  },

  // --- SMARTPHONES (NOUVEAUTÉS) ---
  {
    id: 'pcfa-honor-x5c',
    name: 'Honor X5c',
    category: 'phones',
    brand: 'Honor',
    price: 75000,
    image: '/products/phones/honor-x5c-front.jpg',
    rating: 4.8,
    colors: ['Cyan Émeraude'],
    storageOptions: [
      { capacity: '128 Go', price: 75000 },
      { capacity: '256 Go', price: 95000 }
    ],
    images: [
      '/products/phones/honor-x5c-front.jpg',
      '/products/phones/honor-x5c-back.jpg',
      '/products/phones/honor-x5c.jpg'
    ],
    specs: {
      screen: '6.56" HD+ 90Hz Eye Comfort',
      processor: 'MediaTek Helio G36 Octa-Core',
      camera: 'Double Caméra 50MP AI avec Flash',
      battery: '5200 mAh ultra longue autonomie',
      ram: 4
    },
    desc: 'Smartphone Honor X5c élégant et autonome avec grand écran 6.56 pouces 90Hz, appareil photo 50 MP haute définition, batterie colossale 5200 mAh et mémoire extensible jusqu\'à 256 Go.'
  },
  {
    id: 'pcfa-itel-a200',
    name: 'Itel A200',
    category: 'phones',
    brand: 'Itel',
    price: 65000,
    image: '/products/phones/itel-a200-front.jpg',
    rating: 4.7,
    colors: ['Or Champagne'],
    storageOptions: [
      { capacity: '64 Go', price: 65000 },
      { capacity: '128 Go', price: 72000 }
    ],
    images: [
      '/products/phones/itel-a200-front.jpg',
      '/products/phones/itel-a200-back.jpg',
      '/products/phones/itel-a200.jpg'
    ],
    specs: {
      screen: '6.6" HD+ Waterdrop Display',
      processor: 'Octa-Core Unisoc T603',
      camera: '13MP Dual AI Camera avec Flash',
      battery: '5000 mAh avec charge Type-C',
      ram: 4
    },
    desc: 'Smartphone Itel A200 au design moderne facetté or champagne avec écran panoramique 6.6 pouces, lecteur d\'empreintes digitale, 4 Go de RAM et batterie robuste de 5000 mAh.'
  },
  {
    id: 'pcfa-samsung-a16',
    name: 'Samsung Galaxy A16',
    category: 'phones',
    brand: 'Samsung',
    price: 85000,
    image: '/products/phones/samsung-a16-front.jpg',
    rating: 4.8,
    colors: ['Vert Clair'],
    storageOptions: [
      { capacity: '128 Go', price: 85000 },
      { capacity: '256 Go', price: 98000 }
    ],
    images: [
      '/products/phones/samsung-a16-front.jpg',
      '/products/phones/samsung-a16-back.jpg',
      '/products/phones/samsung-a16.jpg'
    ],
    specs: {
      screen: '6.7" Super AMOLED 90Hz FHD+',
      processor: 'MediaTek Helio G99 / Exynos 1330',
      camera: 'Triple Capteur 50MP + 5MP Ultra-Large + 2MP',
      battery: '5000 mAh + Charge Rapide 25W',
      ram: 6
    },
    desc: 'Samsung Galaxy A16 avec écran immersif Super AMOLED 90Hz, triple capteur photo 50MP, design épuré Key Island et autonomie durable de 5000 mAh avec charge rapide 25W.'
  },
  {
    id: 'pcfa-samsung-a17',
    name: 'Samsung Galaxy A17 5G',
    category: 'phones',
    brand: 'Samsung',
    price: 145000,
    image: '/products/phones/samsung-a17-front.jpg',
    rating: 4.9,
    colors: ['Argent Lavande'],
    storageOptions: [
      { capacity: '128 Go', price: 145000 },
      { capacity: '256 Go', price: 165000 }
    ],
    images: [
      '/products/phones/samsung-a17-front.jpg',
      '/products/phones/samsung-a17-back.jpg',
      '/products/phones/samsung-a17.jpg'
    ],
    specs: {
      screen: '6.7" Super AMOLED+ 120Hz Vision Booster',
      processor: 'Exynos 1480 5G Octa-Core 4nm',
      camera: '50MP OIS Stabilisé + 8MP Ultra Grand-Angle + 2MP Macro',
      battery: '5000 mAh + Recharge Rapide 25W',
      ram: 8
    },
    desc: 'Samsung Galaxy A17 5G nouvelle génération offrant un écran Super AMOLED+ 120Hz ultra-lumineux, capteur photo 50MP stabilisé OIS, connectivité 5G ultra-rapide et châssis fin haut de gamme.'
  },
  {
    id: 'pcfa-huawei-y9',
    name: 'Huawei Y9',
    category: 'phones',
    brand: 'Huawei',
    price: 45000,
    image: '/products/phones/huawei-y9-front.jpg',
    rating: 4.7,
    colors: ['Bleu Saphir'],
    storageOptions: [
      { capacity: '64 Go', price: 45000 },
      { capacity: '128 Go', price: 55000 }
    ],
    images: [
      '/products/phones/huawei-y9-front.jpg',
      '/products/phones/huawei-y9-back.jpg',
      '/products/phones/huawei-y9.jpg'
    ],
    specs: {
      screen: '6.5" FullView FHD+ (2340 x 1080)',
      processor: 'Kirin 710 Octa-Core avec GPU Turbo',
      camera: 'Quadruple Caméra AI (16MP + 2MP Arrière / 13MP + 2MP Avant)',
      battery: '4000 mAh longue autonomie',
      ram: 4
    },
    desc: 'Huawei Y9 classique et ultra-fiable avec grand écran 6.5 pouces FullView haute résolution FHD+, 4 caméras IA avec mode portrait avant/arrière et processeur Kirin performant.'
  },
  {
    id: 'pcfa-tecno-camon50-pro',
    name: 'Tecno Camon 50 Pro 5G',
    category: 'phones',
    brand: 'Tecno',
    price: 225000,
    image: '/products/phones/tecno-camon-50-pro-front.jpg',
    rating: 4.9,
    colors: ['Or Sahara (Cuir Végétal)'],
    storageOptions: [
      { capacity: '256 Go', price: 225000 },
      { capacity: '512 Go', price: 250000 }
    ],
    images: [
      '/products/phones/tecno-camon-50-pro-front.jpg',
      '/products/phones/tecno-camon-50-pro-back.jpg',
      '/products/phones/tecno-camon-50-pro.jpg'
    ],
    specs: {
      screen: '6.78" AMOLED Incurvé 144Hz 1.5K',
      processor: 'MediaTek Dimensity 8200 Ultimate 5G',
      camera: '50MP OIS Sony IMX + 50MP Téléobjectif Périscope + 50MP Selfie',
      battery: '5000 mAh + Ultra Charge 70W',
      ram: 12
    },
    desc: 'Le smartphone photophone d\'excellence Tecno Camon 50 Pro 5G : écran AMOLED incurvé 144Hz, dos bi-matière en cuir végétal doré, triple capteur Sony 50MP avec zoom périscopique et charge ultra-rapide 70W.'
  },
  {
    id: 'pcfa-tecno-camon50-ultra',
    name: 'Tecno Camon 50 Ultra 5G (Prestige Edition)',
    category: 'phones',
    brand: 'Tecno',
    price: 310000,
    image: '/products/phones/tecno-camon-50-ultra-front.jpg',
    rating: 5.0,
    colors: ['Noir Marbre Onyx & Or'],
    storageOptions: [
      { capacity: '256 Go', price: 310000 },
      { capacity: '512 Go', price: 345000 }
    ],
    images: [
      '/products/phones/tecno-camon-50-ultra-front.jpg',
      '/products/phones/tecno-camon-50-ultra-back.jpg',
      '/products/phones/tecno-camon-50-ultra.jpg'
    ],
    specs: {
      screen: '6.82" Quad-Curved LTPO AMOLED 1-144Hz 2K',
      processor: 'Dimensity 9300+ 5G (Flagship 4nm) 16 Go RAM',
      camera: 'Système Quad Caméra 50MP OIS Capteur 1 pouce + Téléobjectif Macro',
      battery: '5400 mAh + Charge Éclair 100W & Sans-fil 50W',
      ram: 16
    },
    desc: 'Le fleuron ultime de la photographie mobile : Tecno Camon 50 Ultra avec châssis titane, dos en verre marbre noir et or veiné, capteur principal 1 pouce ultra-sensible et processeur surpuissant 16 Go RAM.'
  },
  {
    id: 'pcfa-tecno-spark50',
    name: 'Tecno Spark 50',
    category: 'phones',
    brand: 'Tecno',
    price: 100000,
    image: '/products/phones/tecno-spark-50-front.jpg',
    rating: 4.8,
    colors: ['Vert Aurore Cyber'],
    storageOptions: [
      { capacity: '128 Go', price: 100000 },
      { capacity: '256 Go', price: 115000 }
    ],
    images: [
      '/products/phones/tecno-spark-50-front.jpg',
      '/products/phones/tecno-spark-50-back.jpg',
      '/products/phones/tecno-spark-50.jpg'
    ],
    specs: {
      screen: '6.78" FHD+ 120Hz Punch-Hole avec Dynamic Port',
      processor: 'MediaTek Helio G99 Gaming Processor',
      camera: '50MP Ultra Clear Dual Camera avec Aura Light',
      battery: '5000 mAh + Charge Rapide 33W',
      ram: 8
    },
    desc: 'Tecno Spark 50 au design holographique étincelant avec écran fluide 120Hz et Dynamic Port interactif, appareil photo 50MP avec flash annulaire Aura Light, processeur gaming Helio G99 et charge 33W.'
  },
  {
    id: 'pcfa-redmi-a7',
    name: 'Xiaomi Redmi A7',
    category: 'phones',
    brand: 'Redmi',
    price: 65000,
    image: '/products/phones/redmi-a7-front.jpg',
    rating: 4.7,
    colors: ['Vert Forêt (Finition Cuir)'],
    storageOptions: [
      { capacity: '64 Go', price: 65000 },
      { capacity: '128 Go', price: 72000 }
    ],
    images: [
      '/products/phones/redmi-a7-front.jpg',
      '/products/phones/redmi-a7-back.jpg',
      '/products/phones/redmi-a7.jpg'
    ],
    specs: {
      screen: '6.71" HD+ 90Hz Corning Gorilla Glass',
      processor: 'Octa-Core Helio G36',
      camera: '50MP AI Dual Camera avec HDR',
      battery: '5000 mAh longue autonomie',
      ram: 4
    },
    desc: 'Xiaomi Redmi A7 combinant élégance et solidité avec son dos texturé effet cuir vert forêt, son grand écran 6.71 pouces 90Hz résistant Gorilla Glass et sa caméra 50MP avec intelligence artificielle.'
  },
  {
    id: 'pcfa-redmi-a7-pro',
    name: 'Xiaomi Redmi A7 Pro',
    category: 'phones',
    brand: 'Redmi',
    price: 75000,
    image: '/products/phones/redmi-a7-pro-front.jpg',
    rating: 4.8,
    colors: ['Bleu Glacier Givré'],
    storageOptions: [
      { capacity: '128 Go', price: 75000 },
      { capacity: '256 Go', price: 89000 }
    ],
    images: [
      '/products/phones/redmi-a7-pro-front.jpg',
      '/products/phones/redmi-a7-pro-back.jpg',
      '/products/phones/redmi-a7-pro.jpg'
    ],
    specs: {
      screen: '6.74" 90Hz Écran Poinçonné Ultra-Fluide',
      processor: 'MediaTek Helio G85 Haute Performance',
      camera: '50MP Double Caméra avec Bague Dorée & Flash Ring',
      battery: '5000 mAh + Recharge Rapide 18W Type-C',
      ram: 6
    },
    desc: 'Version supérieure Redmi A7 Pro avec écran poinçonné 90Hz, processeur Helio G85 plus puissant, 128 Go de mémoire interne, finition dos en verre dépoli bleu glacier et module caméra cerclé d\'or.'
  },
  {
    id: 'pcfa-infinix-smart20',
    name: 'Infinix Smart 20',
    category: 'phones',
    brand: 'Infinix',
    price: 65000,
    image: '/products/phones/infinix-smart-20.jpg',
    rating: 4.7,
    colors: ['Vert Émeraude'],
    storageOptions: [
      { capacity: '64 Go', price: 65000 },
      { capacity: '128 Go', price: 72000 }
    ],
    images: [
      '/products/phones/infinix-smart-20.jpg'
    ],
    specs: {
      screen: '6.6" 90Hz avec Magic Ring Interactif',
      processor: 'Octa-Core Unisoc T606',
      camera: '13MP Dual AI avec Flash Ring Annulaire',
      battery: '5000 mAh autonomie 2 jours Type-C',
      ram: 4
    },
    desc: 'Infinix Smart 20 équipé de l\'écran Magic Ring à encoche interactive avec notifications animées, affichage fluide 90Hz, son stéréo puissant 200% volume boost et batterie infatigable 5000 mAh.'
  },
  {
    id: 'pcfa-infinix-hot70',
    name: 'Infinix Hot 70 (256 Go)',
    category: 'phones',
    brand: 'Infinix',
    price: 170000,
    image: '/products/phones/infinix-hot-70.jpg',
    rating: 4.9,
    colors: ['Vert Horizon'],
    storageOptions: [
      { capacity: '256 Go', price: 170000 }
    ],
    images: [
      '/products/phones/infinix-hot-70.jpg'
    ],
    specs: {
      screen: '6.78" FHD+ 120Hz Écran Incurvé 3D',
      processor: 'MediaTek Helio G99 Ultimate 6nm Gaming',
      camera: '108MP Ultra-Précis + 32MP Caméra Selfie avec Double Flash',
      battery: '5000 mAh + FastCharge 33W Multi-Vitesse',
      ram: 8
    },
    desc: 'Infinix Hot 70 édition 256 Go : écran géant FHD+ 120Hz immersif, appareil photo révolutionnaire 108 mégapixels pour des clichés d\'une netteté exceptionnelle, processeur Helio G99 Ultimate avec 8 Go de RAM et 256 Go d\'espace de stockage.'
  },
  // --- NOUVEAUX SMARTPHONES & TÉLÉPHONES COMMERCIAUX ---
  {
    id: 'pcfa-redmi-17',
    name: 'Xiaomi Redmi 17',
    category: 'phones',
    brand: 'Redmi',
    price: 120000,
    image: '/products/phones/redmi-17-blue.jpg',
    rating: 4.8,
    colors: ['Bleu Ciel', 'Rose Poudré', 'Or Sable', 'Noir Minuit'],
    storageOptions: [
      { capacity: '128 Go', price: 120000 },
      { capacity: '256 Go', price: 135000 }
    ],
    images: [
      '/products/phones/redmi-17-blue.jpg',
      '/products/phones/redmi-17-pink.jpg',
      '/products/phones/redmi-17-gold.jpg',
      '/products/phones/redmi-17-black.jpg'
    ],
    specs: {
      screen: '6.79" FHD+ 90Hz AdaptiveSync',
      processor: 'MediaTek Helio G91-Ultra',
      camera: '108MP Ultra-Clear + 2MP Macro',
      battery: '5030 mAh + Charge Rapide 33W Type-C',
      ram: 8
    },
    desc: 'Xiaomi Redmi 17 avec grand écran 6.79" 90Hz immersif, appareil photo principal de 108 mégapixels, dos en verre élégant et batterie haute capacité 5030 mAh.'
  },
  {
    id: 'pcfa-redmi-note15-pro-plus',
    name: 'Redmi Note 15 Pro +5G',
    category: 'phones',
    brand: 'Redmi',
    price: 240000,
    image: '/products/phones/redmi-note15pro-black.jpg',
    rating: 4.9,
    colors: ['Noir Minuit', 'Blanc Miroir', 'Violet Aurore'],
    storageOptions: [
      { capacity: '256 Go', price: 240000 },
      { capacity: '512 Go', price: 270000 }
    ],
    images: [
      '/products/phones/redmi-note15pro-black.jpg',
      '/products/phones/redmi-note15pro-white.jpg',
      '/products/phones/redmi-note15pro-purple.jpg'
    ],
    specs: {
      screen: '6.67" CrystalRes 1.5K AMOLED 120Hz Incurvé 3D',
      processor: 'MediaTek Dimensity 7200-Ultra 4nm 5G',
      camera: '200MP OIS Stabilisé Super QPD + 8MP Grand-Angle',
      battery: '5000 mAh + HyperCharge 120W (100% en 19 min)',
      ram: 12
    },
    desc: 'Redmi Note 15 Pro+ 5G fleuron absolu : écran incurvé AMOLED 1.5K, monstrueux capteur 200MP avec stabilisation optique OIS, puce 5G 4nm et recharge ultra-rapide 120W.'
  },
  {
    id: 'pcfa-redmi-15-pro',
    name: 'Redmi 15 Pro',
    category: 'phones',
    brand: 'Redmi',
    price: 180000,
    image: '/products/phones/redmi-15pro-black.jpg',
    rating: 4.8,
    colors: ['Noir Stellaire', 'Bleu Océan', 'Violet Astral'],
    storageOptions: [
      { capacity: '128 Go', price: 180000 },
      { capacity: '256 Go', price: 200000 }
    ],
    images: [
      '/products/phones/redmi-15pro-black.jpg',
      '/products/phones/redmi-15pro-blue.jpg',
      '/products/phones/redmi-15pro-purple.jpg'
    ],
    specs: {
      screen: '6.67" AMOLED 120Hz Ultra-lumineux 1800 nits',
      processor: 'Snapdragon 7s Gen 2 Haute Vitesse',
      camera: '200MP Capteur Ultra-précis + Flash Ring',
      battery: '5100 mAh + Turbo Charge 67W',
      ram: 8
    },
    desc: 'Xiaomi Redmi 15 Pro alliant puissance et élégance avec son écran AMOLED 120Hz, capteur 200MP et batterie 5100 mAh rechargeable à 67W.'
  },
  {
    id: 'pcfa-infinix-note-edge',
    name: 'Infinix Note Edge',
    category: 'phones',
    brand: 'Infinix',
    price: 145600,
    image: '/products/phones/infinix-note-edge-gold.jpg',
    rating: 4.8,
    colors: ['Or Solaire', 'Bleu Palmier', 'Vert Émeraude'],
    storageOptions: [
      { capacity: '256 Go', price: 145600 }
    ],
    images: [
      '/products/phones/infinix-note-edge-gold.jpg',
      '/products/phones/infinix-note-edge-blue.jpg',
      '/products/phones/infinix-note-edge-green.jpg'
    ],
    specs: {
      screen: '6.78" FHD+ 120Hz Écran Bord Incurvé 3D AMOLED',
      processor: 'MediaTek Helio G99 Ultimate 6nm',
      camera: '108MP Triple Caméra AI avec Flash Quad-LED',
      battery: '5000 mAh + FastCharge 45W All-Round',
      ram: 8
    },
    desc: 'Infinix Note Edge avec ses bords incurvés d\'une finesse incomparable, son superbe écran 120Hz immersif, triple capteur photo 108MP et charge 45W ultra-sécurisée.'
  },
  {
    id: 'pcfa-tecno-p20',
    name: 'TECNO P20',
    category: 'phones',
    brand: 'Tecno',
    price: 75000,
    image: '/products/phones/tecno-p20-grey.jpg',
    rating: 4.8,
    colors: ['Gris Météorite', 'Vert Comète'],
    storageOptions: [
      { capacity: '64 Go', price: 75000 },
      { capacity: '128 Go', price: 85000 }
    ],
    images: [
      '/products/phones/tecno-p20-grey.jpg',
      '/products/phones/tecno-p20-green.jpg'
    ],
    specs: {
      screen: '6.78" FHD+ 120Hz Mecha Design',
      processor: 'MediaTek Helio G99 Gaming Turbo',
      camera: '108MP Double Capteur AI avec LED Dynamic Light',
      battery: '6000 mAh Mega Batterie + 70W Ultra Charge',
      ram: 8
    },
    desc: 'TECNO P20 au look futuriste Cyber Mecha avec rétroéclairage LED dynamique, autonomie monstre de 6000 mAh et écran ultra-fluide 120Hz.'
  },
  {
    id: 'pcfa-samsung-b310',
    name: 'Samsung B310 (Guru Music 2)',
    category: 'phones',
    brand: 'Samsung',
    price: 80000,
    image: '/products/phones/samsung-b310-white.jpg',
    rating: 4.9,
    colors: ['Blanc Pur', 'Noir Minuit'],
    storageOptions: [
      { capacity: 'MicroSD Extensible', price: 80000 }
    ],
    images: [
      '/products/phones/samsung-b310-white.jpg',
      '/products/phones/samsung-b310-black.jpg'
    ],
    specs: {
      screen: '2.0" QQVGA Écran Couleur Lumineux',
      processor: 'Processeur Dédié Audio Dual SIM',
      camera: 'Lecteur MP3 & Radio FM Stéréo avec Antenne Intégrée',
      battery: '800 mAh Autonomie Jusqu\'à 11h d\'Appels'
    },
    desc: 'Le légendaire Samsung B310 Guru Music 2 : double carte SIM, son ultra-puissant pour la musique et les appels, radio FM sans écouteurs et autonomie record de plusieurs jours.'
  },
  {
    id: 'pcfa-oale-pop10',
    name: 'OALE PoP 10',
    category: 'phones',
    brand: 'OALE',
    price: 50000,
    image: '/products/phones/oale-pop10-black.jpg',
    rating: 4.7,
    colors: ['Noir Gravité', 'Blanc Mystique', 'Vert Magique'],
    storageOptions: [
      { capacity: '64 Go', price: 50000 }
    ],
    images: [
      '/products/phones/oale-pop10-black.jpg',
      '/products/phones/oale-pop10-white.jpg',
      '/products/phones/oale-pop10-green.jpg'
    ],
    specs: {
      screen: '6.6" HD+ 90Hz Dynamic Notch',
      processor: 'Octa-Core 4G Haute Fluidité',
      camera: '50MP Double Capteur Photo AI avec Double Flash',
      battery: '5000 mAh + 18W Type-C',
      ram: 4
    },
    desc: 'OALE PoP 10 offrant un grand écran 6.6" 90Hz avec encoche dynamique, appareil photo 50MP et batterie haute capacité 5000 mAh pour un rapport qualité-prix imbattable.'
  },
  {
    id: 'pcfa-oale-pop20',
    name: 'OALE PoP 20',
    category: 'phones',
    brand: 'OALE',
    price: 50000,
    image: '/products/phones/oale-pop20-black.jpg',
    rating: 4.7,
    colors: ['Noir Graphite', 'Blanc Givré', 'Bleu Océan'],
    storageOptions: [
      { capacity: '64 Go', price: 50000 }
    ],
    images: [
      '/products/phones/oale-pop20-black.jpg',
      '/products/phones/oale-pop20-white.jpg',
      '/products/phones/oale-pop20-blue.jpg'
    ],
    specs: {
      screen: '6.6" HD+ 90Hz Punch-Hole Immersif',
      processor: 'MediaTek Helio G85 Haute Efficacité',
      camera: '50MP Triple Capteur AI + 32MP Caméra Selfie Lumineuse',
      battery: '5000 mAh Longue Durée Type-C',
      ram: 6
    },
    desc: 'OALE PoP 20 nouvelle génération avec écran poinçonné 90Hz, haut-parleurs stéréo certifiés DTS, capteur d\'empreinte digitale et autonomie infatigable.'
  },
  {
    id: 'pcfa-oale-camon30',
    name: 'OALE Camon 30',
    category: 'phones',
    brand: 'OALE',
    price: 55000,
    image: '/products/phones/oale-camon30-black.jpg',
    rating: 4.8,
    colors: ['Noir Basalte', 'Blanc Sel d\'Uyuni', 'Argent Givré'],
    storageOptions: [
      { capacity: '64 Go', price: 50000 },
      { capacity: '128 Go', price: 55000 }
    ],
    images: [
      '/products/phones/oale-camon30-black.jpg',
      '/products/phones/oale-camon30-white.jpg',
      '/products/phones/oale-camon30-silver.jpg'
    ],
    specs: {
      screen: '6.78" FHD+ 120Hz AMOLED Look',
      processor: 'Octa-Core Helio G99 Performance',
      camera: '64MP Capteur Professionnel avec Bague Lumineuse',
      battery: '5000 mAh + Charge Rapide 33W',
      ram: 6
    },
    desc: 'OALE Camon 30 au design prestige inspiré des appareils photo réflex, dos en cuir texturé ou verre marbré, grand écran 120Hz et caméra 64MP lumineuse.'
  },
  {
    id: 'pcfa-oale-pop9',
    name: 'OALE Pop 9',
    category: 'phones',
    brand: 'OALE',
    price: 50000,
    image: '/products/phones/oale-pop9-blue.jpg',
    rating: 4.6,
    colors: ['Bleu Aurore', 'Noir Nuit'],
    storageOptions: [
      { capacity: '64 Go', price: 50000 }
    ],
    images: [
      '/products/phones/oale-pop9-blue.jpg',
      '/products/phones/oale-pop9-black.jpg'
    ],
    specs: {
      screen: '6.6" HD+ Waterdrop Confort Visuel',
      processor: 'Quad-Core 4G Économe en Énergie',
      camera: '13MP Double Capteur AI + Flash LED',
      battery: '5000 mAh Autonomie 3 Jours',
      ram: 4
    },
    desc: 'OALE Pop 9 ultra-endurant avec sa batterie 5000 mAh, écran lumineux 6.6 pouces, capteur d\'empreinte digitale dorsal et double carte SIM 4G.'
  },
  {
    id: 'pcfa-oale-17-promax',
    name: 'OALE 17 Pro Max (Copie Conforme)',
    category: 'phones',
    brand: 'OALE',
    price: 60000,
    image: '/products/phones/oale-17-promax-deepblue.jpg',
    rating: 4.8,
    colors: ['Titane Bleu Profond', 'Titane Argenté', 'Titane Orange Cosmique'],
    storageOptions: [
      { capacity: '128 Go', price: 60000 },
      { capacity: '256 Go', price: 70000 }
    ],
    images: [
      '/products/phones/oale-17-promax-deepblue.jpg',
      '/products/phones/oale-17-promax-silver.jpg',
      '/products/phones/oale-17-promax-orange.jpg'
    ],
    specs: {
      screen: '6.7" Dynamic Island Écran Complet Sans Bordure',
      processor: 'Octa-Core High-Speed avec Interface iOS Style',
      camera: 'Triple Objectif Look Pro avec Flash Quad-LED',
      battery: '4800 mAh + Recharge Rapide Type-C & MagSafe Look',
      ram: 6
    },
    desc: 'OALE 17 Pro Max Copie Conforme : le style et la prestance du tout dernier fleuron avec contour en titane brossé, écran Dynamic Island immersif, triple objectif photo et port Type-C.'
  },
  {
    id: 'pcfa-oale-hot70',
    name: 'OALE Hot 70',
    category: 'phones',
    brand: 'OALE',
    price: 50000,
    image: '/products/phones/oale-hot70-green.jpg',
    rating: 4.7,
    colors: ['Vert Horizon', 'Bleu Électrique', 'Noir Obscur'],
    storageOptions: [
      { capacity: '64 Go', price: 50000 }
    ],
    images: [
      '/products/phones/oale-hot70-green.jpg',
      '/products/phones/oale-hot70-blue.jpg',
      '/products/phones/oale-hot70-black.jpg'
    ],
    specs: {
      screen: '6.78" 90Hz Grand Écran Punch-Hole',
      processor: 'Octa-Core Gaming Engine',
      camera: '50MP Triple Capteur AI avec Bague Lumineuse',
      battery: '5000 mAh + 33W Fast Charge Type-C',
      ram: 6
    },
    desc: 'OALE Hot 70 conçu pour les divertissements et les jeux : grand affichage 90Hz, son stéréo puissant, appareil photo 50MP et charge rapide 33W.'
  },
  {
    id: 'pcfa-oale-spark30c',
    name: 'OALE Spark 30 C',
    category: 'phones',
    brand: 'OALE',
    price: 50000,
    image: '/products/phones/oale-spark30c-white.jpg',
    rating: 4.7,
    colors: ['Blanc Magic', 'Noir Ébène'],
    storageOptions: [
      { capacity: '64 Go', price: 50000 }
    ],
    images: [
      '/products/phones/oale-spark30c-white.jpg',
      '/products/phones/oale-spark30c-black.jpg'
    ],
    specs: {
      screen: '6.67" 120Hz Ultra-Fluide Protection Yeux',
      processor: 'Octa-Core Haute Efficacité',
      camera: '50MP Caméra Principale Sony Look + Double Flash',
      battery: '5000 mAh + 18W Type-C',
      ram: 4
    },
    desc: 'OALE Spark 30 C avec écran 120Hz d\'une fluidité remarquable, module photo circulaire symétrique moderne, double haut-parleur stéréo et batterie 5000 mAh.'
  },
  {
    id: 'pcfa-oale-s25-ultra',
    name: 'OALE S25 Ultra',
    category: 'phones',
    brand: 'OALE',
    price: 60000,
    image: '/products/phones/oale-s25-ultra-black.jpg',
    rating: 4.8,
    colors: ['Noir Titane', 'Gris Titane', 'Violet Titane', 'Jaune Titane'],
    storageOptions: [
      { capacity: '128 Go', price: 60000 },
      { capacity: '256 Go', price: 70000 }
    ],
    images: [
      '/products/phones/oale-s25-ultra-black.jpg',
      '/products/phones/oale-s25-ultra-gray.jpg',
      '/products/phones/oale-s25-ultra-violet.jpg',
      '/products/phones/oale-s25-ultra-yellow.jpg'
    ],
    specs: {
      screen: '6.8" Quad HD+ Look Écran Plat Angulaire',
      processor: 'Octa-Core Haute Vitesse avec Stylet S-Pen Stylus',
      camera: 'Quad Capteur Look Ultra avec Zoom Optique Simulé',
      battery: '5000 mAh + Charge Rapide Type-C',
      ram: 8
    },
    desc: 'OALE S25 Ultra réplique grandiose : lignes tendues en titane, écran géant 6.8 pouces sans bordure, quadruple optique photo arrière et stylet tactile intégré.'
  },
  {
    id: 'pcfa-honor-x9b-5g',
    name: 'Honor X9b 5G',
    category: 'phones',
    brand: 'Honor',
    price: 100000,
    image: '/products/phones/honor-x9b-orange.jpg',
    rating: 4.9,
    colors: ['Orange Sunrise (Cuir Végan)', 'Noir Minuit'],
    storageOptions: [
      { capacity: '256 Go', price: 100000 }
    ],
    images: [
      '/products/phones/honor-x9b-orange.jpg',
      '/products/phones/honor-x9b-black.jpg'
    ],
    specs: {
      screen: '6.78" 1.5K AMOLED 120Hz Écran Anti-Chute Ultra-Bounce 360°',
      processor: 'Qualcomm Snapdragon 6 Gen 1 4nm 5G',
      camera: '108MP Motion Capture Ultra-Net + 5MP Grand-angle',
      battery: '5800 mAh Monstre d\'Autonomie (3 Jours) + 35W SuperCharge',
      ram: 12
    },
    desc: 'Honor X9b 5G incassable : écran certifié 5 étoiles SGS résistance aux chutes 360°, gigantesque batterie 5800 mAh dans un boîtier ultra-fin de 7.98mm et dos en cuir végan orange luxueux.'
  },
  {
    id: 'pcfa-oale-smart20',
    name: 'OALE Smart 20',
    category: 'phones',
    brand: 'OALE',
    price: 50000,
    image: '/products/phones/oale-smart20-green.jpg',
    rating: 4.7,
    colors: ['Vert Paon', 'Bleu Azur'],
    storageOptions: [
      { capacity: '64 Go', price: 50000 }
    ],
    images: [
      '/products/phones/oale-smart20-green.jpg',
      '/products/phones/oale-smart20-blue.jpg'
    ],
    specs: {
      screen: '6.6" HD+ Affichage Solaire Antibactérien',
      processor: 'Octa-Core Économe 4G',
      camera: '13MP Double Caméra AI avec Double Flash Arrière',
      battery: '5000 mAh Longue Endurance',
      ram: 4
    },
    desc: 'OALE Smart 20 doté d\'une coque arrière texturée 3D antimicrobienne effet vagues d\'eau, grand écran HD+ lisible au soleil et autonomie de 2 jours.'
  },
  {
    id: 'pcfa-itel-a06',
    name: 'Itel A06',
    category: 'phones',
    brand: 'Itel',
    price: 50000,
    image: '/products/phones/itel-a06-black.jpg',
    rating: 4.7,
    colors: ['Noir Nébuleuse', 'Bleu Cristal'],
    storageOptions: [
      { capacity: '32 Go', price: 50000 },
      { capacity: '64 Go', price: 56000 }
    ],
    images: [
      '/products/phones/itel-a06-black.jpg',
      '/products/phones/itel-a06-blue.jpg'
    ],
    specs: {
      screen: '6.6" HD+ Drop Notch Immersif',
      processor: 'Octa-Core 4G Haute Stabilité',
      camera: 'Double Capteur AI avec Capteur d\'Empreinte Dorsal',
      battery: '4000 mAh + Port Moderne Type-C',
      ram: 4
    },
    desc: 'Itel A06 : smartphone accessible et élégant avec écran 6.6 pouces, capteur d\'empreinte digitale sécurisé, déverrouillage facial et batterie 4000 mAh.'
  }
];

