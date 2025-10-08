const USERS_KEY = 'mi_app_users_v1';
const SESSION_KEY = 'logueado';

// --- Helpers ---
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
function strToArrayBuffer(str) {
  return new TextEncoder().encode(str);
}
function genSaltBytes(len = 16) {
  const salt = new Uint8Array(len);
  window.crypto.getRandomValues(salt);
  return salt;
}
function bytesToBase64(bytes) {
  return arrayBufferToBase64(bytes.buffer || bytes);
}
async function hashPassword(saltBase64, password) {
  const saltBuf = base64ToArrayBuffer(saltBase64);
  const pwdBuf = strToArrayBuffer(password);
  const combined = new Uint8Array(saltBuf.byteLength + pwdBuf.byteLength);
  combined.set(new Uint8Array(saltBuf), 0);
  combined.set(new Uint8Array(pwdBuf), saltBuf.byteLength);
  const digest = await crypto.subtle.digest('SHA-256', combined.buffer);
  return arrayBufferToBase64(digest);
}

// --- Storage ---
function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : {};
}
function saveUsers(obj) {
  localStorage.setItem(USERS_KEY, JSON.stringify(obj));
}

// --- Funciones públicas ---
async function registerUser(username, email, password) {
  if (!username || !email || !password) return { ok:false, error:'Todos los campos son requeridos.' };
  if (password.length < 6) return { ok:false, error:'La contraseña debe tener al menos 6 caracteres.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase())) return { ok:false, error:'Correo no válido.' };

  const users = loadUsers();
  if (users[username]) return { ok:false, error:'El usuario ya existe.' };
  if (Object.values(users).some(u => u.email === email)) return { ok:false, error:'Ya existe una cuenta con este correo.' };

  const salt = bytesToBase64(genSaltBytes());
  const hash = await hashPassword(salt, password);

  users[username] = { email, salt, hash, createdAt: new Date().toISOString() };
  saveUsers(users);
  return { ok:true };
}

async function loginUser(username, password) {
  if (!username || !password) return { ok:false, error:'Usuario y contraseña requeridos.' };
  const users = loadUsers();
  const u = users[username];
  if (!u) return { ok:false, error:'Usuario no encontrado.' };

  const hashAttempt = await hashPassword(u.salt, password);
  if (hashAttempt === u.hash) {
    localStorage.setItem(SESSION_KEY, username);
    return { ok:true };
  } else return { ok:false, error:'Contraseña incorrecta.' };
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
}

function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) !== null;
}

function currentUser() {
  return localStorage.getItem(SESSION_KEY);
}

function requireLogin() {
  if (!isLoggedIn()) window.location.href = "index.html";
}

// --- Eventos de formulario ---
document.addEventListener("DOMContentLoaded", () => {
  const regForm = document.getElementById("formRegistro");
  if (regForm) {
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("usuario").value.trim();
      const email = document.getElementById("correo").value.trim();
      const password = document.getElementById("password").value.trim();
      const res = await registerUser(username, email, password);
      alert(res.ok ? "Registro exitoso" : res.error);
      if (res.ok) regForm.reset();
      window.location.href = "index.html";
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.querySelector("#loginForm [name='usuario']").value.trim();
      const password = document.querySelector("#loginForm [name='password']").value.trim();
      const res = await loginUser(username, password);
      alert(res.ok ? "Login correcto" : res.error);
      if (res.ok) {
        // Solo si el login es correcto, redirige
        window.location.href = "inicio.html";
      }
    });
  }
});
