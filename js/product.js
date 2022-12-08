window.onload = main;

// Récupération de l'id du produit à partir de l' URL en global dans window :
const queryString = window.location.search;
const urlSearchParams = new URLSearchParams(queryString);
const idProduct = urlSearchParams.get("id");

// Fonction qui déclenche les fonctions principales qui appelleront d'autres fonctions
function main() {
  retrieveItemsFromApi();
  addToCart();
}

// Récupère l'objet Product:
function retrieveItemsFromApi() {
  fetch(`http://localhost:3000/api/products/${idProduct}`)
    .then((response) => response.json())
    .then((res) => {
      handleData(res);
    })
    .catch((err) => {
      document.querySelector(".item").innerHTML = "<h1>erreur 404</h1>";
      console.log("erreur 404, sur ressource api: " + err);
    });
}

// Manipule la data récupérée dans le fetch et renomme la data en constantes représentatives des attributs qui constituent le produit kanap :
function handleData(kanap) {
  let altTxt = kanap.altTxt;
  itemAltTxt = altTxt;
  let colors = kanap.colors;
  let description = kanap.description;
  let imageUrl = kanap.imageUrl;
  itemImgUrl = imageUrl;
  let name = kanap.name;
  itemName = name;
  let price = kanap.price;
  itemPrice = price;
  // let _id = kanap._id;
  makeImage(imageUrl, altTxt);
  makeTitle(name);
  makePrice(price);
  makeDescription(description);
  makeColors(colors);
}

// Fabrique la balise pour l'image et son affichage:
function makeImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  const parentItemImg = document.querySelector(".item__img");
  parentItemImg.appendChild(image);
}

// Fabrique la balise pour le titre et son affichage:
function makeTitle(name) {
  const h1 = document.querySelector("#title");
  h1.textContent = name;
}

// Fabrique la balise pour le prix et son affichage:
function makePrice(price) {
  const span = document.querySelector("#price");
  span.textContent = price;
}

// Fabrique la balise pour la description du produit et son affichage:
function makeDescription(description) {
  const p = document.querySelector("#description");
  p.textContent = description;
}

// Fabrique la balise pour l'option des couleurs et son affichage :
function makeColors(colors) {
  const select = document.querySelector("#colors");
  colors.forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    select.appendChild(option);
  });
}

// Ajoute dans le panier, à l'écoute du clic, le produit sélectionné avec la valeur de sa couleur et sa quantité
function addToCart() {
  const button = document.querySelector("#addToCart");
  if (button != null) {
    button.addEventListener("click", (e) => {
      const colorSelected = document.querySelector("#colors").value;
      const quantitySelected = document.querySelector("#quantity").value;
      if (
        colorSelected == null ||
        colorSelected === "" ||
        quantitySelected == null ||
        quantitySelected < 1 ||
        quantitySelected > 100
      ) {
        alert("Veuillez choisir une couleur et une quantité entre 1 et 100 ");
        return;
      }
      saveObjectProductSpec(colorSelected, quantitySelected);
    });
  }
}

// Enregistre le body du nouvel objet dans le localStorage:

function saveObjectProductSpec(colorSelected, quantitySelected) {
  const objectProductSpec = {
    idSpec: idProduct,
    colorSpec: colorSelected,
    quantitySpec: Number(quantitySelected),
    nameSpec: itemName,
    priceSpec: itemPrice,
    imageUrlSpec: itemImgUrl,
    altTxtSpec: itemAltTxt,
  };
  // Ajoute quantité au produit :
  let productLocalStorage = JSON.parse(localStorage.getItem("key"));
  //Si le localStorage(panier) contient au minimum 1 article qui match avec l'article(pour son id et sa couleur )affiché dans le DOM:
  if (productLocalStorage) {
    const resultFind = productLocalStorage.find(
      (item) => item.idSpec === idProduct && item.colorSpec === colorSelected
    );
    // Ajoute la nouvelle quantité à la quantité d'origine pour le produit spécifique:
    if (resultFind) {
      let newQuantite =
        parseInt(objectProductSpec.quantitySpec) +
        parseInt(resultFind.quantitySpec);
      resultFind.quantitySpec = newQuantite;
      localStorage.setItem("key", JSON.stringify(productLocalStorage));
      //Sinon ajoute un nouvel article dans le localStorage
    } else {
      productLocalStorage.push(objectProductSpec);
      localStorage.setItem("key", JSON.stringify(productLocalStorage));
    }
    //Sinon le localStorage (panier) est vide et on ajoute un nouvel article:
  } else {
    productLocalStorage = [];
    productLocalStorage.push(objectProductSpec);
    localStorage.setItem("key", JSON.stringify(productLocalStorage));
  }
}
