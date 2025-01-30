//Popup sur demande
helpBtn.addEventListener("click", () => {
  modalOuverture.show();
  popUpSound.play();
});

// Mode Sombre et clair
switchMode.addEventListener("change", function () {
  if (switchMode.checked) {
    // Si le switch est activé, mettre en mode sombre
    htmlElement.setAttribute("data-bs-theme", "dark");
    labelSwitchMode.textContent = "Mode Sombre";
  } else {
    // Si le switch est désactivé, mettre en mode clair
    htmlElement.setAttribute("data-bs-theme", "light");
    inputRecherche.classList.remove("text-bg-dark");
    labelSwitchMode.textContent = "Mode Clair";
  }
});

//vérif année
function isDigitAndlogicYear(value) {
  return /^(?:[0-9]|[1-9][0-9]{1,2}|1[0-9]{3}|20[0-1][0-9]|202[0-5])$/.test(
    value
  );
}

//Affichage d'alerte
alerte = (alerte, type = "light", message) => {
  alerte.classList.remove(
    "alert-light",
    "alert-warning",
    "alert-danger",
    "alert-success"
  );

  alerte.classList.add(`alert-${type}`);

  alerte.textContent = "";
  alerte.textContent = `${message}`;

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
};