window.onload = main;

// Fonction qui déclenche les fonctions principales qui appelleront d'autres fonctions:
function main() {
  retriveDataFromApi();
}

// Récupère les données de l'API:
function retriveDataFromApi() {
  fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => {
      addProducts(data); //passe les données à addProducts
    })
    .catch((err) => {
      document.querySelector(".titles").innerHTML = "<h1>erreur 404</h1>";
      console.log("erreur 404, sur ressource api:" + err);
    });
}

// Affiche les produits dans la page d'accueil:
function addProducts(dataProducts) {
  dataProducts.forEach((kanap) => {
    const { _id, imageUrl, altTxt, name, description } = kanap;
    const anchor = makeAnchor(_id);
    const article = document.createElement("article");
    const image = makeImage(imageUrl, altTxt);
    const h3 = makeH3(name);
    const p = makeParagraph(description);
    appendArticleToAnchor(anchor, article);
    appendElementsToArticle(article, image, h3, p);
  });
}

// Ajoute les éléments des balises image, h3 et p à la suite, à l'intérieur de la balise article:
function appendElementsToArticle(article, image, h3, p) {
  article.appendChild(image);
  article.appendChild(h3);
  article.appendChild(p);
}

// Fabrique l'ancre <a href> qui enveloppe l'article:
function makeAnchor(idProduct) {
  const anchor = document.createElement("a");
  anchor.href = "./product.html?id=" + idProduct;
  return anchor;
}

// Ajoute la balise <article> qui est enveloppée par la balise <a href> qui est enveloppée par la balise <section id= items>:
function appendArticleToAnchor(anchor, article) {
  const items = document.querySelector("#items");
  if (items != null) {
    items.appendChild(anchor);
    anchor.appendChild(article);
  }
}

// Fabrique l'image de l'article:
function makeImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  return image; //return pour pouvoir le appendChild dans appendElementToArticle
}

// Fabrique le nom de l'article:
function makeH3(name) {
  const h3 = document.createElement("h3");
  h3.textContent = name;
  h3.classList.add("productName");
  return h3;
}

//Fabrique la description de l'article dans paragraphe p:
function makeParagraph(description) {
  const p = document.createElement("p");
  p.textContent = description;
  p.classList.add("productDescription");
  return p;
}
