//Création de la db
const db = {
  instance: new Dexie("bibliotheque"),
};



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

//Récupérer tous les livres
db.getLivres = async () => {
  return await db.instance.livres.toArray()
}

//Supprimer un livre en passant l'id
db.supprimerLivre = async (id) => {
  await db.instance.livres.delete(id);
}

db.modifierLivre = async (livreEnModif, livreModifie) => {
  await db.instance.livres.update(livreEnModif, livreModifie)
}

db.init();
