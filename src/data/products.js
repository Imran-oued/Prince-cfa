export const products = [
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
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone11-black-select-2019?wid=940&hei=1112&fmt=png-alpha',
    rating: 4.8,
    colors: ['Noir', 'Blanc', 'Mauve', 'Vert', 'Jaune', 'Rouge'],
    storageOptions: [
      { capacity: '128 Go', price: 120000 }
    ],
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone11-black-select-2019?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone11-white-select-2019?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone11-purple-select-2019?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone11-green-select-2019?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone11-yellow-select-2019?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone11-red-select-2019?wid=940&hei=1112&fmt=png-alpha'
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
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-11-pro-space-select-2019?wid=940&hei=1112&fmt=png-alpha',
    rating: 4.8,
    colors: ['Gris sidéral', 'Argent', 'Vert nuit', 'Or'],
    storageOptions: [
      { capacity: '256 Go', price: 150000 }
    ],
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-11-pro-space-select-2019?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-11-pro-silver-select-2019?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-11-pro-midnight-green-select-2019?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-11-pro-gold-select-2019?wid=940&hei=1112&fmt=png-alpha'
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
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-blue-select-2020?wid=940&hei=1112&fmt=png-alpha',
    rating: 4.8,
    colors: ['Bleu', 'Noir', 'Blanc', 'Vert', 'Mauve'],
    storageOptions: [
      { capacity: '64 Go', price: 130000 },
      { capacity: '128 Go', price: 145000 }
    ],
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-blue-select-2020?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-black-select-2020?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-white-select-2020?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-green-select-2020?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-purple-select-2021?wid=940&hei=1112&fmt=png-alpha'
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
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-blue-select?wid=940&hei=1112&fmt=png-alpha',
    rating: 4.9,
    colors: ['Bleu alpin', 'Graphite', 'Argent', 'Or'],
    storageOptions: [
      { capacity: '256 Go', price: 240000 }
    ],
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-blue-select?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-graphite-select?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-silver-select?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-gold-select?wid=940&hei=1112&fmt=png-alpha'
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
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-max-blue-select?wid=940&hei=1112&fmt=png-alpha',
    rating: 4.9,
    colors: ['Bleu alpin', 'Graphite', 'Argent', 'Or'],
    storageOptions: [
      { capacity: '128 Go', price: 250000 },
      { capacity: '256 Go', price: 280000 }
    ],
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-max-blue-select?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-max-graphite-select?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-max-silver-select?wid=940&hei=1112&fmt=png-alpha',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-max-gold-select?wid=940&hei=1112&fmt=png-alpha'
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
  }
];
