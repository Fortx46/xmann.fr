const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', () => {
  container.classList.remove("sign-up-mode");
});

const signUpForm = document.querySelector(".sign-up-form");
const signInForm = document.querySelector(".sign-in-form");

// Récupère la liste des utilisateurs dans localStorage ou [] si vide
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Sauvegarde un utilisateur dans localStorage
function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  alert("✅ Compte créé et sauvegardé localement !");
}

// Vérifie si un email existe déjà
function emailExists(email) {
  return getUsers().some(user => user.email === email);
}

// Vérifie que le mot de passe respecte les règles
function isValidPassword(password) {
  return (
    password.length >= 7 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  );
}

// Affiche un message d'erreur dans le formulaire donné
function showError(form, message) {
  let error = form.querySelector(".error-message");
  if (!error) {
    error = document.createElement("p");
    error.className = "error-message";
    error.style.color = "red";
    error.style.marginTop = "10px";
    form.appendChild(error);
  }
  error.textContent = message;
}

// Supprime le message d'erreur du formulaire donné
function clearError(form) {
  const error = form.querySelector(".error-message");
  if (error) error.remove();
}

// Gestion de l'inscription
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  clearError(signUpForm);

  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  if (!username || !email || !password) {
    showError(signUpForm, "❌ Veuillez remplir tous les champs.");
    return;
  }

  if (emailExists(email)) {
    showError(signUpForm, "❌ Cet email est déjà utilisé.");
    return;
  }

  if (!isValidPassword(password)) {
    showError(signUpForm, "❌ Le mot de passe doit contenir au moins 7 caractères, une majuscule et un chiffre.");
    return;
  }

  saveUser({ username, email, password });
  signUpForm.reset();
  container.classList.remove("sign-up-mode");
});

// Gestion de la connexion
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();

  clearError(signInForm);

  const identifier = document.getElementById("signin-username").value.trim(); // username ou email
  const password = document.getElementById("signin-password").value;

  if (!identifier || !password) {
    showError(signInForm, "❌ Veuillez remplir tous les champs.");
    return;
  }

  const users = getUsers();
  const user = users.find(u =>
    (u.email === identifier || u.username === identifier) && u.password === password
  );

  if (user) {
    alert("✅ Connexion réussie !");
    signInForm.reset();

    // Sauvegarde l'utilisateur connecté dans localStorage
    localStorage.setItem("connectedUser", JSON.stringify(user));

    // Redirection vers la page lobby.html
    window.location.href = "lobby.html";
  } else {
    showError(signInForm, "❌ Identifiants incorrects.");
  }
});
