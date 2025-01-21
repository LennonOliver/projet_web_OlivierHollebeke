//Création de la db
const db = {
  instance: new Dexie("bibliotheque"),
};

//Sélection des éléments
const titre = document.querySelector("#titre");
const auteur = document.querySelector("#auteur");
const annee = document.querySelector("#annee");
const btnSubmit = document.querySelector("#btnSubmit");
const formajout = document.querySelector("#formAjout");

//initialisation de la db
db.init = () => {
  db.instance.version(1).stores({
    livres: `
            ++id,
            titre,
            auteur,
            annee`,
  });
};

//Ajouter un livre
db.ajouterLivre = (livre) => {
  db.instance.livres.add(livre);
};

//Soumettre le formulaire
btnSubmit.addEventListener("submit", async (event) => {
    //Empêcher le rechargement de la page
    event.preventDefault();
  
    //Ajout du livre à la db
    await db.ajouterLivre({
      titre: titre.value,
      auteur: auteur.value,
      annee: annee.value,
    });
  
    //réinitialiser le formulaire
    formajout.reset();
  });


db.init();
