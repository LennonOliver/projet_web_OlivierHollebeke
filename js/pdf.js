const { jsPDF } = window.jspdf;
const btnPdf = document.querySelector("#exportPdf");

btnPdf.addEventListener("click", async () => {
  const doc = new jsPDF();
  
  // Récupérer les livres
  const livres = await db.getLivres();

  // Ajouter un titre au PDF
  doc.setFontSize(18);
  doc.text("Liste des livres", 10, 10);

  // Définir les colonnes du tableau
  let yPos = 20;
  doc.setFontSize(12);
  doc.text("Titre", 10, yPos);
  doc.text("Auteur", 80, yPos);
  doc.text("Année", 150, yPos);

  // Ajouter une ligne sous les titres
  doc.line(10, yPos + 2, 200, yPos + 2);

  yPos += 10; // Ajustement de la position verticale

  // Définition des largeurs maximales des colonnes
  const maxWidthTitre = 60;
  const maxWidthAuteur = 60;

  // Remplir le PDF avec les livres
  livres.forEach((livre) => {
    // Gestion du texte avec retour à la ligne si nécessaire
    let titre = doc.splitTextToSize(livre.titre, maxWidthTitre);
    let auteur = doc.splitTextToSize(livre.auteur, maxWidthAuteur);

    // Ajouter chaque ligne de titre
    doc.text(titre, 10, yPos);
    doc.text(auteur, 80, yPos);
    doc.text(livre.annee.toString(), 150, yPos);

    // Ajuster la position verticale selon le nombre de lignes du titre ou de l'auteur
    yPos += Math.max(titre.length, auteur.length) * 7; // 7 px par ligne

    // Éviter de sortir de la page
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
  });

  // Sauvegarder le PDF
  doc.save("bibliotheque.pdf");
});


