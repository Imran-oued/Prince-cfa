/**
 * Configuration officielle de la boutique PRINCE CFA
 */
export const SHOP_CONFIG = {
  name: "PRINCE CFA",
  phone: "+226 77 43 43 97",
  // Format international WhatsApp pour les liens wa.me (Burkina Faso +226)
  whatsappNumber: "22677434397",
  displayPhone: "+226 77 43 43 97",
  address: "Koulouba, Ouagadougou",
  fullAddress: "Koulouba, Ouagadougou, Burkina Faso",
  
  // Contacts officiels (section NOUS JOINDRE)
  phones: [
    { display: "+226 77 43 43 97", raw: "+22677434397", wa: "22677434397", isWhatsApp: true, isPrimary: true },
    { display: "+226 64 76 91 30", raw: "+22664769130" },
    { display: "+226 77 14 67 13", raw: "+22677146713" }
  ],

  // Horaires d'ouverture officiels
  hours: {
    weekdays: "Lundi – Samedi : 9 h – 19 h",
    sunday: "Dimanche : 10 h – 16 h"
  },

  // Liens Google Maps & Itinéraire
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Koulouba,+Ouagadougou,+Burkina+Faso",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Koulouba,+Ouagadougou,+Burkina+Faso",
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
      number: "8451921",
      displayNumber: "8451921",
      recipientName: "SANA OMAR MALL DES IPHONES",
      instructions: "Effectuez votre paiement Orange Money avec le code USSD ci-dessous vers le compte officiel avec le montant exact. Dès réception du SMS, conservez la référence.",
      ussdCode: "*144*3*8451921*MONTANT#",
      ussdPrefix: "*144*3*",
      merchantCode: "8451921",
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
      name: "Paiement en Boutique",
      shortName: "Boutique",
      badge: "store",
      instructions: "Réglez directement en espèces ou par Mobile Money lors du retrait de votre appareil dans notre boutique à Koulouba, Ouagadougou."
    }
  },

  // Conditions officielles de garantie
  warrantyPolicy: {
    devices: {
      duration: "1 MOIS",
      title: "CONDITIONS DE GARANTIE — DURÉE : 1 MOIS",
      shortLabel: "Garantie 1 Mois",
      exclusionsTitle: "La garantie ne couvre pas les cas suivants :",
      exclusions: [
        "Problème lié à l'écran",
        "Dommage causé par un liquide",
        "Appareil qui ne s'allume plus"
      ]
    },
    phonesAndTablets: {
      duration: "1 MOIS",
      title: "CONDITIONS DE GARANTIE — DURÉE : 1 MOIS",
      shortLabel: "Garantie 1 Mois",
      exclusionsTitle: "La garantie ne couvre pas les cas suivants :",
      exclusions: [
        "Problème lié à l'écran",
        "Dommage causé par un liquide",
        "Appareil qui ne s'allume plus"
      ]
    },
    computers: {
      duration: "1 MOIS",
      title: "CONDITIONS DE GARANTIE — DURÉE : 1 MOIS",
      shortLabel: "Garantie 1 Mois",
      exclusionsTitle: "La garantie ne couvre pas les cas suivants :",
      exclusions: [
        "Problème lié à l'écran",
        "Dommage causé par un liquide",
        "Appareil qui ne s'allume plus"
      ]
    }
  }
};
