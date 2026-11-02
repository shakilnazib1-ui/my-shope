/* ===== সাধারণ কনফিগ =====
   ব্যাকএন্ড অন্য ঠিকানায় দিলে (যেমন হোস্টিং) শুধু নিচের লাইনটি বদলান। */
const API_BASE = window.API_BASE || "http://127.0.0.1:8000/api";

/* ---------- সাহায্যকারী ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => "৳ " + Number(n).toLocaleString("en-IN");

function placeholderImg(name = "") {
  const ch = esc((name || "?").trim().charAt(0));
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='700'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
    <stop offset='0' stop-color='#0f3d33'/><stop offset='1' stop-color='#1f6b57'/></linearGradient></defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='54%' font-size='220' text-anchor='middle' fill='#e7c875' opacity='.55' font-family='sans-serif'>${ch}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
function productImg(p) {
  return p.image_url && p.image_url.trim() ? p.image_url : placeholderImg(p.name);
}
function imgTag(p, cls = "") {
  const fb = placeholderImg(p.name).replace(/'/g, "%27");
  return `<img src="${esc(productImg(p))}" alt="${esc(p.name)}" class="${cls}" loading="lazy"
           onerror="this.onerror=null;this.src='${fb}'">`;
}

/* ---------- Toast ---------- */
function toast(msg, type = "ok") {
  let box = $("#toast-box");
  if (!box) {
    box = document.createElement("div");
    box.id = "toast-box";
    box.className = "fixed top-20 right-4 z-[100] space-y-2";
    document.body.appendChild(box);
  }
  const el = document.createElement("div");
  el.className =
    "px-4 py-3 rounded-lg shadow-lg text-sm text-white " + (type === "err" ? "bg-red-600" : "bg-emerald-800");
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ---------- Auth ---------- */
const Auth = {
  get token() { return localStorage.getItem("token"); },
  get user() { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } },
  set(data) {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
  },
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.href = "index.html";
  },
};

/* ---------- API ---------- */
async function api(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth || Auth.token) if (Auth.token) headers.Authorization = "Bearer " + Auth.token;
  let res;
  try {
    res = await fetch(API_BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error("সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। ব্যাকএন্ড চালু আছে কিনা দেখুন।");
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth) { localStorage.removeItem("token"); localStorage.removeItem("user"); }
    let msg = data.detail || "কিছু একটা সমস্যা হয়েছে";
    if (Array.isArray(msg)) msg = msg.map((e) => e.msg).join(", ");
    throw new Error(msg);
  }
  return data;
}

/* ---------- কার্ট (localStorage) ---------- */
const Cart = {
  get items() { try { return JSON.parse(localStorage.getItem("cart")) || []; } catch { return []; } },
  save(items) { localStorage.setItem("cart", JSON.stringify(items)); renderCartBadge(); },
  add(p, size, qty = 1) {
    const items = this.items;
    const found = items.find((i) => i.product_id === p.id && i.size === size);
    if (found) found.quantity = Math.min(found.quantity + qty, p.stock);
    else items.push({ product_id: p.id, name: p.name, price: p.price, image_url: p.image_url, size, quantity: qty, stock: p.stock });
    this.save(items);
  },
  setQty(idx, qty) {
    const items = this.items;
    if (!items[idx]) return;
    items[idx].quantity = Math.max(1, Math.min(qty, items[idx].stock || 99));
    this.save(items);
  },
  remove(idx) { const items = this.items; items.splice(idx, 1); this.save(items); },
  clear() { this.save([]); },
  get count() { return this.items.reduce((s, i) => s + i.quantity, 0); },
  get total() { return this.items.reduce((s, i) => s + i.quantity * i.price, 0); },
};

/* ---------- হেডার / ফুটার ---------- */
function renderCartBadge() {
  const b = $("#cart-badge");
  if (!b) return;
  const c = Cart.count;
  b.textContent = c;
  b.classList.toggle("hidden", c === 0);
}

function renderHeader() {
  const u = Auth.user;
  const links = u
    ? `${u.is_admin ? '<a href="admin.html" class="hover:text-gold">অ্যাডমিন</a>' : ""}
       <a href="orders.html" class="hover:text-gold">আমার অর্ডার</a>
       <span class="hidden md:inline text-emerald-200/80">হ্যালো, ${esc(u.name.split(" ")[0])}</span>
       <button id="logout-btn" class="hover:text-gold">লগআউট</button>`
    : `<a href="login.html" class="hover:text-gold">লগইন</a>
       <a href="register.html" class="bg-gold text-emerald-950 px-3 py-1.5 rounded-full font-semibold hover:brightness-110">সাইন আপ</a>`;
  $("#header").innerHTML = `
  <header class="bg-emerald-950 text-white sticky top-0 z-50 shadow-md">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
      <a href="index.html" class="font-display text-xl md:text-2xl font-bold tracking-wide">
        <span class="text-gold">নূর</span> মডেস্ট শপ
      </a>
      <nav class="flex items-center gap-4 text-sm">
        <a href="index.html#products" class="hidden sm:inline hover:text-gold">পণ্য</a>
        ${links}
        <a href="cart.html" class="relative hover:text-gold" aria-label="কার্ট">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2 4h13M9 21a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z"/></svg>
          <span id="cart-badge" class="hidden absolute -top-2 -right-2 bg-gold text-emerald-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">0</span>
        </a>
      </nav>
    </div>
  </header>`;
  $("#logout-btn")?.addEventListener("click", () => Auth.logout());
  renderCartBadge();
}

function renderFooter() {
  $("#footer").innerHTML = `
  <footer class="bg-emerald-950 text-emerald-100/80 mt-16">
    <div class="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3 text-sm">
      <div><div class="font-display text-lg text-white mb-2"><span class="text-gold">নূর</span> মডেস্ট শপ</div>
        <p>মার্জিত ও আরামদায়ক পাঞ্জাবি এবং বোরকার নির্ভরযোগ্য ঠিকানা।</p></div>
      <div><div class="text-white font-semibold mb-2">সুবিধা</div>
        <ul class="space-y-1"><li>ক্যাশ অন ডেলিভারি</li><li>সারা দেশে ডেলিভারি</li><li>সাইজ না মিললে এক্সচেঞ্জ</li></ul></div>
      <div><div class="text-white font-semibold mb-2">যোগাযোগ</div>
        <p>ফোন: ০১XXXXXXXXX<br>ইমেইল: info@yourshop.com</p></div>
    </div>
    <div class="text-center text-xs py-3 border-t border-emerald-900">© ${new Date().getFullYear()} নূর মডেস্ট শপ। সর্বস্বত্ব সংরক্ষিত।</div>
  </footer>`;
}

function productCard(p) {
  const out = p.stock <= 0;
  return `
  <a href="product.html?id=${p.id}" class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition border border-emerald-900/5">
    <div class="aspect-[4/5] overflow-hidden bg-emerald-50 relative">
      ${imgTag(p, "w-full h-full object-cover group-hover:scale-105 transition duration-500")}
      ${out ? '<span class="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full">স্টক শেষ</span>' : ""}
      ${p.category ? `<span class="absolute top-3 right-3 bg-white/90 text-emerald-900 text-xs px-2 py-1 rounded-full">${esc(p.category.name)}</span>` : ""}
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-emerald-950 leading-snug line-clamp-2 min-h-[2.75rem]">${esc(p.name)}</h3>
      <div class="mt-2 text-lg font-bold text-emerald-800">${money(p.price)}</div>
    </div>
  </a>`;
}

/* অ্যাডমিন/লগইন-আবশ্যক পেজের জন্য */
function requireLogin() {
  if (!Auth.token) {
    sessionStorage.setItem("after_login", location.pathname.split("/").pop() + location.search);
    location.href = "login.html";
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  if ($("#header")) renderHeader();
  if ($("#footer")) renderFooter();
});
