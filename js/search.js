const btnAnnulerRecherche = document.querySelector("#annulerRecherche");
const listeLivresTrouves = document.querySelector("#listeLivresTrouves");
const tbodyRecherche = document.getElementById("tbodyRecherche");
const inputRecherche = document.querySelector("#inputRecherche");
const btnRechercher = document.querySelector("#btnRechercher");

// Rechercher des livres depuis l'API Open Library
async function rechercherLivresDepuisAPI(motCle) {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(
        motCle
      )}&limit=10`
    );
    const data = await response.json();

    return data.docs.map((livre) => ({
      titre: livre.title || "Titre inconnu",
      auteur: livre.author_name
        ? livre.author_name.join(", ")
        : "Auteur inconnu",
      annee: livre.first_publish_year || "Date inconnue",
    }));
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données depuis l'API :",
      error
    );
    return [];
  }
}

// Fonction d'affichage des résultats dans le tableau des livres trouvés
async function afficherLivresTrouves(motCle) {
  listeLivresTrouves.style.display = "block";
  // Affichage du spinner pendant le chargement des résultats
  tbodyRecherche.innerHTML = `
   <tr>
     <td colspan="4" class="text-center">
       <div class="spinner-border" role="status">
         <span class="visually-hidden">Loading...</span>
       </div>
     </td>
   </tr>
 `;

  const livres = await rechercherLivresDepuisAPI(motCle);

  // Vider le tableau après chargement des résultats
  tbodyRecherche.innerHTML = "";

  if (livres.length === 0) {
    tbodyRecherche.innerHTML =
      '<tr><td colspan="4" class="text-center">Aucun livre trouvé</td></tr>';
    return;
  }

  livres.forEach((livre) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${livre.titre}</td>
    <td>${livre.auteur}</td>
    <td>${livre.annee}</td>
    <td>
      <button class="btn btn-outline-primary btn-sm">
        Ajouter
      </button>
    </td>
  `;

    // Attacher l'événement "Ajouter" avec une fonction
    row.querySelector("button").addEventListener("click", async () => {
        ajouterLivreDB(livre.titre, livre.auteur, livre.annee);
    });

    tbodyRecherche.appendChild(row); // Ajouter la ligne au tableau
  });
}

// Ajouter un livre à la base de données IndexedDB
async function ajouterLivreDB(titre, auteur, annee) {
  await db.ajouterLivre({ titre, auteur, annee });
  app.alerte(alerteDiv, "success", `Livre ${titre} ajouté avec succès!`);
  inputRecherche.value = "";
  listeLivresTrouves.style.display = "none";
  afficherLivres();
}

// Gérer la recherche via le bouton et l'input
document.addEventListener("DOMContentLoaded", () => {
  // Événement lors du clic sur le bouton "Rechercher"
  btnRechercher.addEventListener("click", (event) => {
    event.preventDefault();
    const terme = inputRecherche.value.trim();
    if (terme !== "") {
      afficherLivresTrouves(terme); // Afficher les résultats de la recherche
    }
  });

  // Permettre la recherche en appuyant sur Enter
  inputRecherche.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      btnRechercher.click();
    }
  });
});

// Ajouter un événement de clic sur le bouton d'annulation
btnAnnulerRecherche.addEventListener("click", () => {
  // Masquer la section des résultats de recherche
  listeLivresTrouves.style.display = "none";

  // Réinitialiser le champ de recherche
  document.querySelector("#inputRecherche").value = ""; // Si vous avez un champ pour la recherche

  // Afficher tous les livres
  afficherLivres(); // Cette fonction réaffiche tous les livres dans votre application
});
