window.onload = main;

// Fonction qui déclenche les fonctions principales qui appelleront d'autres fonctions
function main() {
  retrieveItemsFromCache();
  cart.forEach((item) => displayItem(item));
  deleteProduct();
  validateForm();
  listenClickButtonOrder();
}

// Récupère les objet dans le localStorage:
function retrieveItemsFromCache() {
  let productLocalStorage = JSON.parse(localStorage.getItem("key"));
  cart = [];

  if (productLocalStorage === null || productLocalStorage === 0) {
    const titleCard = document.querySelector("h1");
    titleCard.innerHTML = "Votre panier est vide !";
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
  } else {
    for (let i = 0; i < productLocalStorage.length; i++) {
      const item = productLocalStorage[i];
      cart.push(item);
    }
  }
}

//function displayItem(item) represente l'affichage de la section carte__items: appelé dans main
//Affiche les objets sur la page dans la balise article qui contient l'image et le contenu du produit:
function displayItem(item) {
  const article = makeArticle(item);

  const divCardImageItem = makeImageDiv(item);
  article.appendChild(divCardImageItem);

  const divCardItemContent = makeCartContent(item);
  article.appendChild(divCardItemContent);

  displayArticle(article); //pas de return sur fonction parceque passé en param
  displayTotalQuantity();
  displayTotalPrice();
}

// Affiche la balise article à la suite dans la section "cart__items":
function displayArticle(article) {
  document.querySelector("#cart__items").appendChild(article);
}

// Fabrique la balise article "cart__item" et de ses attributs :
function makeArticle(item) {
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = item.idSpec;
  article.dataset.color = item.colorSpec;
  return article; //retourne article à makeArticle
}

// Fabrique de la balise div "cart__item__img" et de ses attributs pour l'image et le texte alternatif de l'objet :
function makeImageDiv(item) {
  const divCartItemImg = document.createElement("div");
  divCartItemImg.classList.add("cart__item__img");
  const imageDiv = document.createElement("img"); //l'image est ds une div
  imageDiv.src = item.imageUrlSpec;
  imageDiv.alt = item.altTxtSpec;
  divCartItemImg.appendChild(imageDiv);
  return divCartItemImg;
}

// Fabrique de la balise divCardItemContent pour l'ensemble du contenu textuel "cart__item__content" :
function makeCartContent(item) {
  const divCardItemContent = document.createElement("div");
  divCardItemContent.classList.add("cart__item__content");
  const divdescription = makeDescription(item);
  const divsettings = makeSettings(item);
  divCardItemContent.appendChild(divdescription);
  divCardItemContent.appendChild(divsettings);
  return divCardItemContent; //return ds displayItem
}

// Fabrique de la balise divDescription et affichage du nom de l'article, de sa couleur et son prix:
function makeDescription(item) {
  const divDescription = document.createElement("div");
  divDescription.classList.add("cart__item__content__description");
  const h2 = document.createElement("h2");
  h2.textContent = item.nameSpec;
  const p = document.createElement("p");
  p.textContent = item.colorSpec;
  const p2 = document.createElement("p");
  p2.textContent = item.priceSpec + " €";
  divDescription.appendChild(h2);
  divDescription.appendChild(p);
  divDescription.appendChild(p2);
  return divDescription;
}

// Fabrique de la balise divSettings dédié à l'affichage des settings: input(quantité sélectionnée) et bouton(supprimer):
function makeSettings(item) {
  const divSettings = document.createElement("div");
  divSettings.classList.add("cart__item__content__settings");
  addDivQuantityOfSettings(divSettings, item);
  addDivDeleteOfSettings(divSettings, item); 
  return divSettings;
}

// Fabrique de la balise divDelete :
function addDivDeleteOfSettings(settings, item) {
  const divDelete = document.createElement("div");
  divDelete.classList.add("cart__item__content__settings__delete");
  const pDelete = document.createElement("p");
  pDelete.classList.add("deleteItem");
  pDelete.textContent = "Supprimer";
  divDelete.appendChild(pDelete);
  settings.appendChild(divDelete); //enfant de divSettings
}

//Efface le produit stocké identique à l'article du DOM qui a été cliqué et supprime le du localStorage:
function deleteProduct() {
  let productLocalStorage = JSON.parse(localStorage.getItem("key"));
  let deleteButton = document.querySelectorAll(".deleteItem");

  for (let i = 0; i < deleteButton.length; i++) {
    deleteButton[i].addEventListener("click", (event) => {
      event.preventDefault();
      let idToDelete = productLocalStorage[i].idSpec;
      let colorToDelete = productLocalStorage[i].colorSpec;
      productLocalStorage = productLocalStorage.filter(
        (item) => item.idSpec !== idToDelete || item.colorSpec !== colorToDelete
      );
      localStorage.setItem("key", JSON.stringify(productLocalStorage));
      if (productLocalStorage && productLocalStorage.length == 0) {
        localStorage.removeItem("key");
      }
      location.reload();
    });
  }
}

// Fabrique de la balise divSettingsOfQuantity et de ses attributs ainsi que son contenu fonctionnel à l'écoute du "change" :
function addDivQuantityOfSettings(settings, item) {
  const divSettingsQuantity = document.createElement("div");
  divSettingsQuantity.classList.add("cart__item__content__settings__quantity");
  const p = document.createElement("p");
  p.textContent = "Qté : ";
  divSettingsQuantity.appendChild(p);
  const input = document.createElement("input");
  input.type = "number";
  input.classList.add("itemQuantity");
  input.name = "itemQuantity";
  input.min = "1";
  input.max = "100";
  input.value = item.quantitySpec;
  input.colorDom = item.colorSpec;

  input.addEventListener("change", (val) => {
    updatePriceAndQuantity(
      item.idSpec,
      val.target.value,
      val.target.colorDom,
      item
    );
  });
  divSettingsQuantity.appendChild(input);
  settings.appendChild(divSettingsQuantity);
}

// Met à jour la quantité totale d'articles sélectionnés ainsi que le prix total de la commande :
function updatePriceAndQuantity(idParam, newValue, colorDom, item) {
  if (newValue.length <= 0) {
    alert("Attention! Veuillez choisir une quantité entre 1 et 100 SVP");
    return;
  }
  const inputQuantityValue = parseInt(newValue);
  if (
    inputQuantityValue === NaN ||
    inputQuantityValue < 1 ||
    inputQuantityValue > 100
  ) {
    alert("Attention! Veuillez choisir une quantité entre 1 et 100 SVP");
    return;
  }
  let productLocalStorage = JSON.parse(localStorage.getItem("key"));
  const itemToUpdateInCart = productLocalStorage.find(
    (item) => item.idSpec === idParam && item.colorSpec === colorDom
  );
  itemToUpdateInCart.quantitySpec = parseInt(newValue);
  item.quantitySpec = itemToUpdateInCart.quantitySpec;
  localStorage.setItem("key", JSON.stringify(productLocalStorage));
  displayTotalQuantity();
  displayTotalPrice();
}

// Affiche la quantité totale des produits sélectionnés: 
function displayTotalQuantity() {
  const inputQuantity = document.getElementsByClassName("itemQuantity");
  totalQtt = 0;
  for (var i = 0; i < inputQuantity.length; ++i) {
    const totalUnitQuantity = inputQuantity[i].valueAsNumber;
    totalQtt += totalUnitQuantity;
  }
  const totalQuantityDisplay = document.getElementById("totalQuantity");
  totalQuantityDisplay.innerHTML = totalQtt;
}

// Affiche le prix total des produits sélectionnés: 
function displayTotalPrice() {
  let productLocalStorage = JSON.parse(localStorage.getItem("key"));
  const inputQuantity = document.getElementsByClassName("itemQuantity");
  totalPrice = 0;
  for (var i = 0; i < inputQuantity.length; ++i) {
    const totalUnitPrice =
      inputQuantity[i].valueAsNumber * productLocalStorage[i].priceSpec;
    totalPrice += totalUnitPrice;
  }
  const totalPriceDisplay = document.getElementById("totalPrice");
  totalPriceDisplay.innerHTML = totalPrice;
}

//---Début du Formulaire  ----------------------------------------
//Affiche les champs du formulaire et appelle les fonctions pour checker les champs inputs à l'écoute de modifications :
function validateForm() {
  firstName.addEventListener("input", function () {
    checkFirstName(firstName);
  });
  lastName.addEventListener("input", function () {
    checkLastName(lastName);
  });
  city.addEventListener("input", function () {
    checkCity(city);
  });
  address.addEventListener("input", function () {
    checkAddress(address);
  });
  email.addEventListener("input", function () {
    checkEmail(email);
  });
}

//Verification du Prenom et selon validité affiche message d'erreur
function checkFirstName() {
  let toNameRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
  let testFirstName = toNameRegExp.test(firstName.value);
  if (testFirstName == false) {
    firstName.nextElementSibling.innerHTML = `Ne peut contenir de chiffres ou caractères spéciaux`;
    return false;
  } else {
    firstName.nextElementSibling.innerHTML = "";
    return true;
  }
}
//Verification du Nom de famille et selon validité affiche message d'erreur
function checkLastName() {
  let toNameRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
  let testlastName = toNameRegExp.test(lastName.value);
  if (testlastName == false) {
    lastName.nextElementSibling.innerHTML = `Ne peut contenir de chiffres ou caractères spéciaux`;
    return false;
  } else {
    lastName.nextElementSibling.innerHTML = "";
    return true;
  }
}
//Verification de la Ville et selon validité affiche message d'erreur
function checkCity() {
  let toNameRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
  let testCity = toNameRegExp.test(city.value);
  if (testCity == false) {
    city.nextElementSibling.innerHTML = `Veuillez saisir une nom de ville valide <br> Ne doit pas contenir de chiffre`;
    return false;
  } else {
    city.nextElementSibling.innerHTML = "";
    return true;
  }
}
//Verification de l'Adresse et selon validité affiche message d'erreur
function checkAddress() {
  let addressRegExp = new RegExp(
    "^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+"
  );
  let testAddress = addressRegExp.test(address.value);
  if (testAddress == false) {
    address.nextElementSibling.innerHTML = `Veuillez saisir une adresse valide <br> Exemple: <i>1 rue de la Paix</i>`;
    return false;
  } else {
    address.nextElementSibling.innerHTML = "";
    return true;
  }
}
//Verification de l'Email et selon validité affiche message d'erreur
function checkEmail() {
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,3}$"
  );
  let testEmail = emailRegExp.test(email.value);
  if (testEmail == false) {
    email.nextElementSibling.innerHTML =
      "Veuillez saisir une adresse email valide, exemple: durand@gmail.com";
    return false;
  } else {
    email.nextElementSibling.innerHTML = "";
    return true;
  }
}
//---Fin du Formulaire  ----------------------------------------

//Soumet le formulaire si tout les champs sont valides et poste le corps de la requète ainsi que son numéro de commande:
function submitForm(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Veuillez sélectionner un article");
    return;
  }
  if (
    checkFirstName(firstName) &&
    checkLastName(lastName) &&
    checkCity(city) &&
    checkAddress(address) &&
    checkEmail(email)
  ) {
    const form = document.querySelector(".cart__order__form");
    const body = makeRequestBody(); //voir ds back/controllers/product.js
    const options = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch("http://localhost:3000/api/products/order", options)
      .then((res) => res.json())
      .then((data) => {
        window.location.href =
          "/front/html/confirmation.html" + "?orderId=" + data.orderId;
        return console.log(data);
      })
      .catch((err) => {
        document.querySelector(".cart").innerHTML = "<h1>erreur 404</h1>";
        console.log("erreur 404, sur ressource api: " + err);
      });
  } else {
    alert(
      "ATTENTION! les champs du formulaire ne sont pas correctement remplis!"
    );
  }
}

// Fabrique le corps de la requète avec les données du client contact et des identifiants des products sélectionnés puis retourne le body à la constante body dans submitForm:
function makeRequestBody() {
  const form = document.querySelector(".cart__order__form");
  const firstNameValue = form.elements.firstName.value;
  const lasstNameValue = form.elements.lastName.value;
  const addressValue = form.elements.address.value;
  const cityValue = form.elements.city.value;
  const emailValue = form.elements.email.value;
  const body = {
    contact: {
      firstName: firstNameValue,
      lastName: lasstNameValue,
      address: addressValue,
      city: cityValue,
      email: emailValue,
    },
    products: getIdsFromCache(),
  };
  return body;
}

// Prend les ids stockés dans le localStorage et retourne les ids à products : dans makeRequestBody()
function getIdsFromCache() {
  let productLocalStorage = JSON.parse(localStorage.getItem("key"));
  const numberOfProductsId = productLocalStorage.length;
  const idsOfProducts = [];
  for (let i = 0; i < numberOfProductsId; i++) {
    idsOfProducts.push(productLocalStorage[i].idSpec);
  }
  return idsOfProducts;
}

// Ecoute l'évènement au clic sur le bouton Commander et déclenche la fonction submitForm
function listenClickButtonOrder() {
  const orderButton = document.querySelector("#order");
  orderButton.addEventListener("click", (e) => submitForm(e)); //on lui passe l'evènement e pour e.preventdefault
}
