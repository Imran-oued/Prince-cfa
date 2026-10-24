/**
 * Configuration officielle de la boutique PRINCE CFA
 */
export const SHOP_CONFIG = {
  name: "PRINCE CFA",
  phone: "07778740",
  // Format international WhatsApp pour les liens wa.me (Burkina Faso +226)
  whatsappNumber: "22607778740",
  displayPhone: "+226 07 77 87 40",
  address: "Ouagadougou, Burkina Faso",
  mapsUrl: "https://www.google.com/maps/place/12%C2%B021%2746.8%22N+1%C2%B030%2759.2%22W/@12.3630013,-1.5164472,17z/data=!4m4!3m3!8m2!3d12.3630013!4d-1.5164472?entry=mfs&utm_campaign=ml-le-16204870&coh=230964&g_st=ic",
  currency: "FCFA",
  
  // Frais de livraison standard (en FCFA)
  deliveryFee: 1500,

  // Configuration des méthodes de paiement manuel
  paymentMethods: {
    orange_money: {
      id: "orange_money",
      name: "Orange Money",
      shortName: "Orange Money",
      badge: "orange",
      number: "07778740",
      displayNumber: "+226 07 77 87 40",
      recipientName: "PRINCE CFA",
      instructions: "Effectuez votre dépôt ou transfert Orange Money vers le numéro officiel ci-dessus avec le montant exact. Dès réception du SMS de débit, conservez la référence.",
      ussdCode: "*144*4*1*07778740*MONTANT#",
      ussdPrefix: "*144*4*1*",
      appUrl: "https://play.google.com/store/apps/details?id=com.orange.omservices"
    },
    wave: {
      id: "wave",
      name: "Wave",
      shortName: "Wave",
      badge: "wave",
      number: "07778740",
      displayNumber: "+226 07 77 87 40",
      recipientName: "PRINCE CFA",
      instructions: "Ouvrez votre application Wave et effectuez le transfert vers le numéro officiel ci-dessus avec le montant exact. Conservez la capture ou l'ID de transaction.",
      appUrl: "https://wave.com"
    },
    store_pickup: {
      id: "store_pickup",
      name: "Paiement en Showroom",
      shortName: "Showroom",
      badge: "store",
      instructions: "Réglez directement en espèces ou par Mobile Money lors du retrait de votre appareil dans notre boutique à Ouagadougou."
    }
  }
};
