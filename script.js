/* ============================================
   KASIR KOPERASI SEKOLAH — APPLICATION LOGIC
   Bug Hunter Challenge #3
   
   🐛 ADA 5 BUG TERSEMBUNYI DI FILE INI!
   Temukan dan perbaiki semua bug-nya!
   ============================================ */

// ============================
// DATA PRODUK
// ============================
const products = [
  { id: 1,  nama: "Pensil 2B",       harga: 3000,   stok: 50,  kategori: "atk",     emoji: "✏️" },
  { id: 2,  nama: "Pulpen Hitam",    harga: 5000,   stok: 40,  kategori: "atk",     emoji: "🖊️" },
  { id: 3,  nama: "Buku Tulis",      harga: 7000,   stok: 30,  kategori: "atk",     emoji: "📓" },
  { id: 4,  nama: "Penghapus",       harga: 2000,   stok: 60,  kategori: "atk",     emoji: "🧹" },
  { id: 5,  nama: "Penggaris 30cm",  harga: 4000,   stok: 25,  kategori: "atk",     emoji: "📏" },
  { id: 6,  nama: "Rautan",          harga: 3000,   stok: 35,  kategori: "atk",     emoji: "🔧" },
  { id: 7,  nama: "Tipe-X",          harga: 8000,   stok: 20,  kategori: "atk",     emoji: "✂️" },
  { id: 8,  nama: "Roti Cokelat",    harga: 5000,   stok: 15,  kategori: "makanan", emoji: "🍞" },
  { id: 9,  nama: "Biskuit",         harga: 3000,   stok: 20,  kategori: "makanan", emoji: "🍪" },
  { id: 10, nama: "Mie Instan",      harga: 4000,   stok: 25,  kategori: "makanan", emoji: "🍜" },
  { id: 11, nama: "Keripik",         harga: 6000,   stok: 18,  kategori: "makanan", emoji: "🍿" },
  { id: 12, nama: "Permen",          harga: 1000,   stok: 100, kategori: "makanan", emoji: "🍬" },
  { id: 13, nama: "Air Mineral",     harga: 4000,   stok: 30,  kategori: "minuman", emoji: "💧" },
  { id: 14, nama: "Teh Kotak",       harga: 5000,   stok: 20,  kategori: "minuman", emoji: "🧃" },
  { id: 15, nama: "Susu Kotak",      harga: 6000,   stok: 15,  kategori: "minuman", emoji: "🥛" },
  { id: 16, nama: "Jus Buah",        harga: 7000,   stok: 12,  kategori: "minuman", emoji: "🧃" },
  { id: 17, nama: "Es Teh",          harga: 3000,   stok: 25,  kategori: "minuman", emoji: "🍵" },
  { id: 18, nama: "Spidol",          harga: 6000,   stok: 15,  kategori: "atk",     emoji: "🖍️" },
];


// ============================
// STATE
// ============================
let cart = [];
let bugsFound = 0;


// ============================
// DOM REFERENCES
// ============================
const $ = (id) => document.getElementById(id);

const dom = {
  productGrid:     $('productGrid'),
  cartItems:       $('cartItems'),
  cartEmpty:       $('cartEmpty'),
  subtotalValue:   $('subtotalValue'),
  discountInput:   $('discountInput'),
  discountValue:   $('discountValue'),
  totalValue:      $('totalValue'),
  paymentInput:    $('paymentInput'),
  changeDisplay:   $('changeDisplay'),
  changeValue:     $('changeValue'),
  btnPay:          $('btnPay'),
  receiptOverlay:  $('receiptOverlay'),
  receiptContent:  $('receiptContent'),
  searchInput:     $('searchInput'),
  bugsFoundCount:  $('bugsFoundCount'),
  bugPanel:        $('bugPanel'),
  bugPanelOverlay: $('bugPanelOverlay'),
  bugAnswers:      $('bugAnswers'),
  toast:           $('toast'),
  toastIcon:       $('toastIcon'),
  toastText:       $('toastText'),
};


// ============================
// FORMAT CURRENCY
// ============================
function formatRp(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}


// ============================
// RENDER PRODUCTS
// ============================
function renderProducts(filter = 'semua', search = '') {
  dom.productGrid.innerHTML = '';

  let filtered = products;

  if (filter !== 'semua') {
    filtered = filtered.filter(p => p.kategori === filter);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.nama.toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    dom.productGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-3);padding:2rem;">Produk tidak ditemukan</p>';
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = `product-card ${product.stok <= 0 ? 'out-of-stock' : ''}`;
    card.innerHTML = `
      <span class="product-emoji">${product.emoji}</span>
      <div class="product-name">${product.nama}</div>
      <div class="product-price">${formatRp(product.harga)}</div>
      <div class="product-stock">Stok: ${product.stok}</div>
      <div class="add-badge">+</div>
    `;

    if (product.stok > 0) {
      card.addEventListener('click', () => addToCart(product.id));
    }

    dom.productGrid.appendChild(card);
  });
}


// ============================
// ADD TO CART
// ============================
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || product.stok <= 0) return;

  // Check if already in cart
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    if (existing.qty >= product.stok) {
      showToast('⚠️', 'Stok tidak cukup!');
      return;
    }
    existing.qty += 1;

    // ========================================
    // 🐛 BUG #1: Subtotal menggunakan + (penjumlahan) bukan * (perkalian)
    // Seharusnya: existing.subtotal = product.harga * existing.qty;
    // ========================================
    existing.subtotal = product.harga + existing.qty;

  } else {
    cart.push({
      id: product.id,
      nama: product.nama,
      emoji: product.emoji,
      harga: product.harga,
      qty: 1,
      subtotal: product.harga * 1  // qty=1 jadi ini masih benar
    });
  }

  showToast('✅', `${product.nama} ditambahkan`);
  renderCart();
  calculateTotal();
}


// ============================
// REMOVE FROM CART
// ============================
function removeFromCart(index) {
  // ========================================
  // 🐛 BUG #3: Selalu menghapus index 0 (item pertama), bukan item yang dipilih
  // Seharusnya: cart.splice(index, 1);
  // ========================================
  cart.splice(0, 1);

  renderCart();
  calculateTotal();
  showToast('🗑️', 'Item dihapus');
}


// ============================
// UPDATE QUANTITY
// ============================
function updateQty(index, delta) {
  const item = cart[index];
  const product = products.find(p => p.id === item.id);

  item.qty += delta;

  if (item.qty <= 0) {
    removeFromCart(index);
    return;
  }

  if (item.qty > product.stok) {
    item.qty = product.stok;
    showToast('⚠️', 'Stok tidak cukup!');
  }

  // ========================================
  // 🐛 BUG #1 (lanjutan): Subtotal menggunakan + bukan *
  // Seharusnya: item.subtotal = item.harga * item.qty;
  // ========================================
  item.subtotal = item.harga + item.qty;

  renderCart();
  calculateTotal();
}


// ============================
// RENDER CART
// ============================
function renderCart() {
  // Clear existing items (keep empty message)
  const existingItems = dom.cartItems.querySelectorAll('.cart-item');
  existingItems.forEach(el => el.remove());

  if (cart.length === 0) {
    dom.cartEmpty.classList.remove('hidden');
    dom.btnPay.disabled = true;
    return;
  }

  dom.cartEmpty.classList.add('hidden');

  cart.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <span class="cart-item-emoji">${item.emoji}</span>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nama}</div>
        <div class="cart-item-price">${formatRp(item.harga)} / pcs</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="updateQty(${index}, -1)">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${index}, +1)">+</button>
      </div>
      <div class="cart-item-subtotal">${formatRp(item.subtotal)}</div>
      <button class="btn-remove-item" onclick="removeFromCart(${index})" title="Hapus">✕</button>
    `;
    dom.cartItems.appendChild(row);
  });
}


// ============================
// CALCULATE TOTAL
// ============================
function calculateTotal() {
  // Subtotal
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.subtotal;
  });

  dom.subtotalValue.textContent = formatRp(subtotal);

  // Discount
  const diskon = parseFloat(dom.discountInput.value) || 0;

  // ========================================
  // 🐛 BUG #2: Rumus diskon salah — mengurangi dengan angka persen langsung
  // Seharusnya: let potongan = subtotal * diskon / 100;
  // ========================================
  let potongan = subtotal - diskon;

  dom.discountValue.textContent = `- ${formatRp(potongan)}`;

  // Grand total
  let grandTotal = subtotal - potongan;
  if (grandTotal < 0) grandTotal = 0;
  dom.totalValue.textContent = formatRp(grandTotal);

  // Update payment validation
  validatePayment();

  // Store for payment processing
  dom.totalValue.dataset.value = grandTotal;
  dom.subtotalValue.dataset.value = subtotal;
}


// ============================
// VALIDATE PAYMENT
// ============================
function validatePayment() {
  const bayar = parseFloat(dom.paymentInput.value) || 0;
  const grandTotal = parseFloat(dom.totalValue.dataset.value) || 0;
  const subtotal = parseFloat(dom.subtotalValue.dataset.value) || 0;

  if (bayar > 0 && cart.length > 0) {
    dom.changeDisplay.classList.remove('hidden');

    // ========================================
    // 🐛 BUG #4: Kembalian dihitung dari subtotal, bukan grandTotal (setelah diskon)
    // Seharusnya: let kembalian = bayar - grandTotal;
    // ========================================
    let kembalian = bayar - subtotal;

    if (kembalian >= 0) {
      dom.changeDisplay.classList.remove('error');
      dom.changeValue.textContent = formatRp(kembalian);
      dom.btnPay.disabled = false;
    } else {
      dom.changeDisplay.classList.add('error');
      dom.changeValue.textContent = `Kurang ${formatRp(Math.abs(kembalian))}`;
      dom.btnPay.disabled = true;
    }
  } else {
    dom.changeDisplay.classList.add('hidden');
    dom.btnPay.disabled = true;
  }
}


// ============================
// PROCESS PAYMENT
// ============================
function processPayment() {
  const bayar = parseFloat(dom.paymentInput.value) || 0;
  const grandTotal = parseFloat(dom.totalValue.dataset.value) || 0;

  if (bayar < grandTotal || cart.length === 0) return;

  // ========================================
  // 🐛 BUG #4 (lanjutan): kembalian di struk juga salah
  // Seharusnya: const kembalian = bayar - grandTotal;
  // ========================================
  const subtotal = parseFloat(dom.subtotalValue.dataset.value) || 0;
  const kembalian = bayar - subtotal;

  generateReceipt(bayar, kembalian);
  dom.receiptOverlay.classList.remove('hidden');
}


// ============================
// GENERATE RECEIPT
// ============================
function generateReceipt(bayar, kembalian) {
  const now = new Date();

  // ========================================
  // 🐛 BUG #5: getMonth() mengembalikan 0-11, perlu +1
  // Seharusnya: const bulan = now.getMonth() + 1;
  // ========================================
  const tanggal = `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`;
  const waktu = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  const subtotal = parseFloat(dom.subtotalValue.dataset.value) || 0;
  const diskon = parseFloat(dom.discountInput.value) || 0;
  const grandTotal = parseFloat(dom.totalValue.dataset.value) || 0;
  const potongan = subtotal - grandTotal;

  let itemsHTML = '';
  cart.forEach(item => {
    itemsHTML += `
      <div class="receipt-row">
        <span>${item.nama} x${item.qty}</span>
        <span>${formatRp(item.subtotal)}</span>
      </div>
    `;
  });

  dom.receiptContent.innerHTML = `
    <div class="receipt-header-text">
      <h3>🏪 Koperasi Sekolah</h3>
      <p>SMK Yappenda</p>
      <p>${tanggal} ${waktu}</p>
    </div>
    <hr class="receipt-divider">
    ${itemsHTML}
    <hr class="receipt-divider">
    <div class="receipt-row">
      <span>Subtotal</span>
      <span>${formatRp(subtotal)}</span>
    </div>
    ${diskon > 0 ? `
    <div class="receipt-row">
      <span>Diskon (${diskon}%)</span>
      <span>-${formatRp(potongan)}</span>
    </div>
    ` : ''}
    <div class="receipt-row total">
      <span>TOTAL</span>
      <span>${formatRp(grandTotal)}</span>
    </div>
    <hr class="receipt-divider">
    <div class="receipt-row">
      <span>Bayar</span>
      <span>${formatRp(bayar)}</span>
    </div>
    <div class="receipt-row change">
      <span>Kembalian</span>
      <span>${formatRp(kembalian)}</span>
    </div>
    <hr class="receipt-divider">
    <div class="receipt-footer">
      <p>Terima kasih sudah berbelanja! 🙏</p>
    </div>
  `;
}


// ============================
// CLEAR / NEW TRANSACTION
// ============================
function clearCart() {
  cart = [];
  dom.discountInput.value = 0;
  dom.paymentInput.value = '';
  dom.changeDisplay.classList.add('hidden');
  renderCart();
  calculateTotal();
}


// ============================
// TOAST
// ============================
function showToast(icon, text) {
  dom.toastIcon.textContent = icon;
  dom.toastText.textContent = text;
  dom.toast.classList.remove('hidden');
  dom.toast.classList.add('show');
  setTimeout(() => {
    dom.toast.classList.remove('show');
    setTimeout(() => dom.toast.classList.add('hidden'), 300);
  }, 2000);
}


// ============================
// EVENT LISTENERS
// ============================
function initEvents() {
  // Category tabs
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderProducts(tab.dataset.cat, dom.searchInput.value);
    });
  });

  // Search
  dom.searchInput.addEventListener('input', () => {
    const activeCat = document.querySelector('.cat-tab.active').dataset.cat;
    renderProducts(activeCat, dom.searchInput.value);
  });

  // Clear cart
  $('btnClearCart').addEventListener('click', () => {
    if (cart.length === 0) return;
    clearCart();
    showToast('🗑️', 'Keranjang dikosongkan');
  });

  // Discount input
  dom.discountInput.addEventListener('input', calculateTotal);

  // Payment input
  dom.paymentInput.addEventListener('input', validatePayment);

  // Pay button
  dom.btnPay.addEventListener('click', processPayment);

  // Receipt close
  $('btnCloseReceipt').addEventListener('click', () => {
    dom.receiptOverlay.classList.add('hidden');
  });

  // New transaction
  $('btnNewTransaction').addEventListener('click', () => {
    dom.receiptOverlay.classList.add('hidden');
    clearCart();
    showToast('🔄', 'Transaksi baru dimulai');
  });

  // Close modal on overlay click
  dom.receiptOverlay.addEventListener('click', (e) => {
    if (e.target === dom.receiptOverlay) {
      dom.receiptOverlay.classList.add('hidden');
    }
  });
}


// ============================
// LIVE CLOCK
// ============================
function startLiveClock() {
  const clockEl = $('liveClock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const opts = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    const dateStr = now.toLocaleDateString('id-ID', opts);
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    clockEl.textContent = `${dateStr} • ${timeStr}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}


// ============================
// INIT
// ============================
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initEvents();
  calculateTotal();
  startLiveClock();
});
