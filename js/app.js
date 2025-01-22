const app = {}

//Sélection des éléments
const titre = document.querySelector("#titre");
const auteur = document.querySelector("#auteur");
const annee = document.querySelector("#annee");
const btnSubmit = document.querySelector("#btnSubmit");
const formajout = document.querySelector("#formAjout");
const legend = document.querySelector("#legendAjout");
const errorMessage = document.querySelector("#error-message");

//Soumettre le formulaire
btnSubmit.addEventListener("click", async (event) => {
    //Empêcher le rechargement de la page
    event.preventDefault();

    if (btnSubmit.textContent === "Ajouter") {
        //Ajout du livre à la db
        await db.ajouterLivre({
            titre: titre.value,
            auteur: auteur.value,
            annee: annee.value,
        });
    } else if (btnSubmit.textContent === "Modifier") {
        console.log("Modification en cours pour le livre avec ID:", livreEnModif);
        await db.modifierLivre(livreEnModif, {
            titre: titre.value,
            auteur: auteur.value,
            annee: annee.value,
        });
        btnSubmit.textContent = "Ajouter";
        legend.textContent = "Ajouter un livre"
    }

    //réinitialiser le formulaire
    formajout.reset();

    //Rafraîchir l'affichage
    afficherLivres();
});

const afficherLivres = () => {
    //Récupérer tous les livres
    db.getLivres().then(livres => {
        const tbody = document.querySelector('#tbody');
        //Vider le tableau
        tbody.innerHTML = "";
        livres.forEach(livre => {
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
            btnSupprimer.classList.add("btn", "btn-outline-danger", "btn-sm", "me-2");
            btnSupprimer.addEventListener("click", async () => {
                await db.supprimerLivre(livre.id);
                afficherLivres();
            });

            btnModifier.textContent = `Modifier`;
            btnModifier.classList.add("btn", "btn-outline-warning", "btn-sm");
            btnModifier.addEventListener("click", async () => {
                await app.formModifier(livre);
            });

            td4.appendChild(btnSupprimer);
            td4.appendChild(btnModifier);

            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)

            tbody.appendChild(tr);
        });
    })
};

app.formModifier = (livre) => {
    titre.value = livre.titre;
    auteur.value = livre.auteur;
    annee.value = livre.annee;
    livreEnModif = livre.id;
    btnSubmit.textContent = "Modifier";
    legend.textContent = `Modifier le livre ${titre.value}`
    console.log(livreEnModif);
};




afficherLivres()