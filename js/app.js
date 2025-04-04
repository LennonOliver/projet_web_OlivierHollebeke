const app = {};

//Sélection des éléments
const titre = document.querySelector("#titre");
const auteur = document.querySelector("#auteur");
const annee = document.querySelector("#annee");
const btnSubmit = document.querySelector("#btnSubmit");
const formajout = document.querySelector("#formAjout");
const legend = document.querySelector("#legendAjout");
const btnResetForm = document.querySelector("#resetForm");
const alerteDiv = document.querySelector("#alerteDiv");
const listeLivres = document.querySelector("#listeLivres");
const btnAnnulerModif = document.querySelector("#annulerModif");
const switchMode = document.querySelector("#flexSwitchCheckChecked");
const htmlElement = document.documentElement;
const labelSwitchMode = document.querySelector("#labelSwitchMode");
const modalOuverture = new bootstrap.Modal(document.getElementById('modalOuverture'));
const helpBtn = document.querySelector('#helpBtn');
const popUpSound = new Audio('../audio/multiPop.mp3');
const allButtons = document.querySelectorAll('button');

//Soumettre le formulaire
btnSubmit.addEventListener("click", async (event) => {
  //Empêcher le rechargement de la page
  event.preventDefault();

  //Vérifier si les champs sont remplis
  const champsManquants = [];
  //Si le champ n'est pas rempli le pousser dans le tableau
  if (titre.value.trim() === "") champsManquants.push("Titre");
  if (auteur.value.trim() === "") champsManquants.push("Auteur");
  if (annee.value.trim() === "") champsManquants.push("Année");

  //Si un champ n'est pas rempli afficher le message et donner les champs à remplir
  if (champsManquants.length > 0) {
    alerte(
      alerteDiv,
      "light",
      `Veuillez remplir le(s) champ(s) suivant(s) : ${champsManquants.join(
        ", "
      )}!`
    );
    return;
  }

  //Vérifier si l'année est un nombre compris entre 0 et 2025
  if (!isDigitAndlogicYear(annee.value.trim())) {
    alerte(
      alerteDiv,
      "light",
      "L'année doit être un nombre compris entre 0 et 2025!"
    );
    return;
  }
  let ajoutOuModifMessage = "";
  //Si le bouton est ajouter
  if (btnSubmit.textContent.trim() === "Ajouter") {
    //Ajout du livre à la db
    await db.ajouterLivre({
      titre: titre.value,
      auteur: auteur.value,
      annee: annee.value,
    });
    console.log(btnSubmit.textContent)
    ajoutOuModifMessage = "ajouté";
  } //Si le bouton est modifier
  else if (btnSubmit.textContent.trim() === "Modifier") {
    await db.modifierLivre(livreEnModif, {
      titre: titre.value,
      auteur: auteur.value,
      annee: annee.value,
    });
    ajoutOuModifMessage = "modifié";
    btnSubmit.textContent = "Ajouter";
    legend.textContent = "Ajouter un livre";
  }

  alerte(
    alerteDiv,
    "success",
    `Livre ${titre.value} ${ajoutOuModifMessage} avec succès`
  );

  //réinitialiser le formulaire
  formajout.reset();

  //Rafraîchir l'affichage
  afficherLivres();

  titre.focus();

  btnAnnulerModif.style.display = "none";
});

const afficherLivres = async () => {
  const livres = await db.getLivres();
  if (livres.length > 0) {
    listeLivres.style.display = "block";
    //Récupérer tous les livres
    db.getLivres().then((livres) => {
      const tbody = document.querySelector("#tbody");
      //Vider le tableau
      tbody.innerHTML = "";
      livres.forEach((livre) => {
        const tr = document.createElement("tr");

        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");

        const btnSupprimer = document.createElement("button");
        const btnModifier = document.createElement("button");

        td1.textContent = `${livre.titre}`;
        td2.textContent = `${livre.auteur}`;
        td3.textContent = `${livre.annee}`;

        btnSupprimer.textContent = `Supprimer`;
        btnSupprimer.classList.add(
          "btn",
          "btn-danger",
          "btn-sm",
          "me-2"
        );
        btnSupprimer.addEventListener("click", async () => {
          await db.supprimerLivre(livre.id);
          alerte(
            alerteDiv,
            "success",
            `Livre ${livre.titre} supprimé avec succès !`
          );
          afficherLivres();
          btnSubmit.textContent = "Ajouter";
          legend.textContent = "Ajouter un livre";
          btnAnnulerModif.style.display = "none";
          formajout.reset();
        });

        btnModifier.textContent = `Modifier`;
        btnModifier.classList.add("btn", "btn-warning", "btn-sm");
        btnModifier.addEventListener("click", async () => {
          await app.formModifier(livre);
        });

        td4.appendChild(btnSupprimer);
        td4.appendChild(btnModifier);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        tbody.appendChild(tr);
      });
    });
  } else {
    listeLivres.style.display = "none";
  }
};

app.formModifier = (livre) => {
  titre.value = livre.titre;
  auteur.value = livre.auteur;
  annee.value = livre.annee;
  livreEnModif = livre.id;
  btnSubmit.textContent = "Modifier";
  legend.textContent = `Modifier le livre ${titre.value}`;
  titre.focus();
  btnAnnulerModif.style.display = "block";
};

btnResetForm.addEventListener("click", () => {
  formajout.reset();
});

btnAnnulerModif.addEventListener("click", () => {
  formajout.reset();
  legend.textContent = "Ajouter un livre";
  btnSubmit.textContent = "Ajouter";
  btnAnnulerModif.style.display = "none";
});



afficherLivres();
