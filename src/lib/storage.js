import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage, isFirebaseConfigured } from "./firebase";

/**
 * Upload d'une image de produit vers Firebase Storage
 * @param {File} file - Le fichier image sélectionné
 * @param {string} productId - L'ID du produit (pour organiser les fichiers)
 * @returns {string|null} L'URL publique de l'image ou null en cas d'erreur
 */
export async function uploadProductImage(file, productId = "general") {
  if (!isFirebaseConfigured()) return null;

  try {
    // Créer un nom de fichier unique pour éviter les conflits
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `products/${productId}/${timestamp}_${safeName}`;
    
    const storageRef = ref(storage, filePath);
    
    // Upload du fichier
    const snapshot = await uploadBytes(storageRef, file);
    
    // Récupérer l'URL publique
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image:", error);
    return null;
  }
}

/**
 * Supprimer une image de Firebase Storage
 * @param {string} imageUrl - L'URL de l'image à supprimer
 */
export async function deleteProductImage(imageUrl) {
  if (!isFirebaseConfigured() || !imageUrl) return false;

  try {
    // Extraire le chemin du fichier depuis l'URL Firebase
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    return false;
  }
}

/**
 * Upload de plusieurs images
 * @param {FileList|File[]} files - Les fichiers à uploader
 * @param {string} productId - L'ID du produit
 * @returns {string[]} Les URLs des images uploadées
 */
export async function uploadMultipleImages(files, productId = "general") {
  const urls = [];
  for (const file of files) {
    const url = await uploadProductImage(file, productId);
    if (url) urls.push(url);
  }
  return urls;
}
