const app = {}

//Sélection des éléments
const titre = document.querySelector("#titre");
const auteur = document.querySelector("#auteur");
const annee = document.querySelector("#annee");
const btnSubmit = document.querySelector("#btnSubmit");
const formajout = document.querySelector("#formAjout");
const legend = document.querySelector("#legendAjout");
const btnResetForm = document.querySelector("#resetForm");
const alerteDiv = document.querySelector("#alerteDiv");

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
        alerteDiv.textContent = `Veuillez remplir le(s) champ(s) suivant(s) : ${champsManquants.join(", ")}!`;
        app.alerte(alerteDiv, "light");
        return;
    }

    //Vider la div d'alerte si une alerte a été faite précédemment
    alerteDiv.textContent = "";

    //Si le bouton est ajouter
    if (btnSubmit.textContent === "Ajouter") {
        //Ajout du livre à la db
        await db.ajouterLivre({
            titre: titre.value,
            auteur: auteur.value,
            annee: annee.value,
        });
        alerteDiv.textContent = "Livre ajouté avec succès !";
    } //Si le bouton est modifier
    else if (btnSubmit.textContent === "Modifier") {
        await db.modifierLivre(livreEnModif, {
            titre: titre.value,
            auteur: auteur.value,
            annee: annee.value,
        });
        alerteDiv.textContent = `Livre ${titre.value} modifié avec succès !`;
        btnSubmit.textContent = "Ajouter";
        legend.textContent = "Ajouter un livre"
    }

    app.alerte(alerteDiv, "success");

    //réinitialiser le formulaire
    formajout.reset();

    //Rafraîchir l'affichage
    afficherLivres();

    titre.focus();
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
                alerteDiv.textContent = `Livre ${livre.titre} supprimé avec succès !`;
                app.alerte(alerteDiv, "success");
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
    titre.focus();
};

btnResetForm.addEventListener('click', () => {
    formajout.reset();
})

app.alerte = (alerte, type) => {

    alerte.classList.remove("alert-light", "alert-warning", "alert-danger", "alert-success");

    alerte.classList.add(`alert-${type}`)

    // Afficher avec effet de fondu
    alerte.style.display = "block";
    setTimeout(() => {
        alerte.classList.add("show");
    }, 10);

    // Masquer avec effet de fondu après 3 secondes
    setTimeout(() => {
        alerte.classList.remove("show");
        alerte.classList.add("hide");

        // Attendre la fin de l'animation avant de cacher complètement
        setTimeout(() => {
            alerte.style.display = "none";
            // Réinitialiser pour la prochaine utilisation
            alerte.classList.remove("hide");
        }, 500);
    }, 3000);
}

afficherLivres()