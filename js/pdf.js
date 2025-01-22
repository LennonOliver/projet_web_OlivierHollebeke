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

  // Remplir le PDF avec les livres
  livres.forEach((livre, index) => {
    doc.text(livre.titre, 10, yPos);
    doc.text(livre.auteur, 80, yPos);
    doc.text(livre.annee.toString(), 150, yPos);
    yPos += 10;
  });

  // Sauvegarder le PDF
  doc.save("bibliotheque.pdf");
});

