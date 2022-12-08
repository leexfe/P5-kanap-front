window.onload = main;

// Fonction qui déclenche les fonctions principales qui appelleront d'autres fonctions:
function main() {
  getOrderId();
  displayOrderId();
  removeAllCache();
}

// Récupère orderId ds les params de l'Url
function getOrderId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("orderId");
}

//Affiche le numéro de commande
function displayOrderId() {
  const orderIdElement = document.getElementById("orderId");
  orderIdElement.innerHTML = getOrderId();
}

// Vide le localStorage
function removeAllCache() {
  const cache = window.localStorage;
  cache.clear();
}
