/* ============================================
   PORTAL NILAI & RAPOR SISWA — APPLICATION LOGIC (VERSI SISWA)
   ============================================ */

// ============================
// INITIAL DATA MATA PELAJARAN
// ============================
let daftarNilai = [
  { id: 1, mapel: "Pemrograman Web", tugas: 85, uts: 80, uas: 90, absen: 100 },
  { id: 2, mapel: "Pemrograman Berorientasi Objek", tugas: 75, uts: 70, uas: 80, absen: 90 },
  { id: 3, mapel: "Basis Data", tugas: 90, uts: 85, uas: 88, absen: 95 },
  { id: 4, mapel: "Matematika Terapan", tugas: 70, uts: 75, uas: 75, absen: 80 },
];

const KKM = 75.0;

// ============================
// DOM REFERENCES
// ============================
const $ = (id) => document.getElementById(id);

const dom = {
  inputMapel:       $('inputMapel'),
  inputTugas:       $('inputTugas'),
  inputUTS:         $('inputUTS'),
  inputUAS:         $('inputUAS'),
  inputAbsen:       $('inputAbsen'),
  btnTambahNilai:   $('btnTambahNilai'),
  gradeTableBody:   $('gradeTableBody'),
  mapelCountBadge:  $('mapelCountBadge'),
  avgGradeValue:    $('avgGradeValue'),
  statusBadge:      $('statusBadge'),
  totalMapelCount:  $('totalMapelCount'),
  overallStatusText:$('overallStatusText'),
  btnCetakRapor:    $('btnCetakRapor'),
  reportOverlay:    $('reportOverlay'),
  reportContent:    $('reportContent'),
  searchInput:      $('searchInput'),
  toast:            $('toast'),
  toastIcon:        $('toastIcon'),
  toastText:        $('toastText'),
};

// ============================
// HITUNG NILAI AKHIR & STATUS
// ============================
function hitungNilaiAkhir(tugas, uts, uas, absen) {
  // Bobot: Tugas 20%, UTS 30%, UAS 40%, Absen 10%
  // 🐛 Bug #2 tersembunyi
  return (tugas * 0.2) + (uts * 0.3) + (uas * 0.7) + (absen * 0.1);
}

function cekStatusLulus(nilaiAkhir) {
  // 🐛 Bug #3 tersembunyi
  if (nilaiAkhir > KKM) {
    return "LULUS";
  } else {
    return "REMEDIAL";
  }
}

// ============================
// RENDER TABEL NILAI
// ============================
function renderTabelNilai(search = '') {
  dom.gradeTableBody.innerHTML = '';

  let filtered = daftarNilai;

  if (search.trim()) {
    // 🐛 Bug #5 tersembunyi
    filtered = filtered.filter(item => item.mapel.includes(search));
  }

  if (filtered.length === 0) {
    dom.gradeTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;color:var(--text-3);padding:2rem;">
          Mata pelajaran tidak ditemukan
        </td>
      </tr>
    `;
    updateSummary();
    return;
  }

  filtered.forEach((item, index) => {
    const nilaiAkhir = hitungNilaiAkhir(item.tugas, item.uts, item.uas, item.absen);
    const status = cekStatusLulus(nilaiAkhir);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.mapel}</strong></td>
      <td>${item.tugas}</td>
      <td>${item.uts}</td>
      <td>${item.uas}</td>
      <td>${item.absen}</td>
      <td><strong>${nilaiAkhir.toFixed(1)}</strong></td>
      <td><span class="status-tag ${status.toLowerCase()}">${status}</span></td>
      <td>
        <button class="btn-delete-row" onclick="hapusMapel(${index})" title="Hapus">✕ Hapus</button>
      </td>
    `;
    dom.gradeTableBody.appendChild(tr);
  });

  updateSummary();
}

// ============================
// TAMBAH NILAI BARU
// ============================
function tambahNilai() {
  const mapel = dom.inputMapel.value.trim();

  // 🐛 Bug #1 tersembunyi
  const tugas = dom.inputTugas.value;
  const uts   = dom.inputUTS.value;
  const uas   = dom.inputUAS.value;
  const absen = dom.inputAbsen.value;

  if (!mapel) {
    showToast('⚠️', 'Isi nama mata pelajaran!');
    return;
  }

  daftarNilai.push({
    id: Date.now(),
    mapel: mapel,
    tugas: tugas,
    uts: uts,
    uas: uas,
    absen: absen
  });

  // Reset inputs
  dom.inputMapel.value = '';
  dom.inputTugas.value = '';
  dom.inputUTS.value = '';
  dom.inputUAS.value = '';
  dom.inputAbsen.value = '';

  showToast('✅', `Nilai ${mapel} berhasil disimpan`);
  renderTabelNilai(dom.searchInput.value);
}

// ============================
// HAPUS MATA PELAJARAN
// ============================
function hapusMapel(index) {
  // 🐛 Bug #4 tersembunyi
  daftarNilai.splice(0, 1);

  showToast('🗑️', 'Mata pelajaran dihapus');
  renderTabelNilai(dom.searchInput.value);
}

// ============================
// UPDATE SUMMARY WIDGETS
// ============================
function updateSummary() {
  const total = daftarNilai.length;
  dom.mapelCountBadge.textContent = `${total} Mapel`;
  dom.totalMapelCount.textContent = total;

  if (total === 0) {
    dom.avgGradeValue.textContent = "0.0";
    dom.statusBadge.textContent = "—";
    dom.statusBadge.className = "widget-badge";
    dom.overallStatusText.textContent = "—";
    dom.btnCetakRapor.disabled = true;
    return;
  }

  let totalNilai = 0;
  let adaRemedial = false;

  daftarNilai.forEach(item => {
    const na = hitungNilaiAkhir(item.tugas, item.uts, item.uas, item.absen);
    totalNilai += na;
    if (cekStatusLulus(na) === "REMEDIAL") {
      adaRemedial = true;
    }
  });

  const avg = totalNilai / total;
  dom.avgGradeValue.textContent = avg.toFixed(1);

  if (!adaRemedial && avg >= KKM) {
    dom.statusBadge.textContent = "LULUS";
    dom.statusBadge.className = "widget-badge lulus";
    dom.overallStatusText.textContent = "LULUS UTUH";
    dom.overallStatusText.style.color = "var(--success)";
  } else {
    dom.statusBadge.textContent = "REMEDIAL";
    dom.statusBadge.className = "widget-badge remedial";
    dom.overallStatusText.textContent = "PERLU REMEDIAL";
    dom.overallStatusText.style.color = "var(--danger)";
  }

  dom.btnCetakRapor.disabled = false;
}

// ============================
// CETAK RAPOR SISWA
// ============================
function cetakRapor() {
  if (daftarNilai.length === 0) return;

  const now = new Date();
  const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

  let rowsHTML = '';
  let totalNilai = 0;

  daftarNilai.forEach(item => {
    const na = hitungNilaiAkhir(item.tugas, item.uts, item.uas, item.absen);
    const status = cekStatusLulus(na);
    totalNilai += na;
    rowsHTML += `
      <div class="receipt-row">
        <span>${item.mapel}</span>
        <span>${na.toFixed(1)} (${status})</span>
      </div>
    `;
  });

  const avg = totalNilai / daftarNilai.length;

  dom.reportContent.innerHTML = `
    <div class="receipt-header-text">
      <h3>📜 TRANSKRIP NILAI RAPOR SISWA</h3>
      <p>SMK Yappenda • Semester Genap 2026</p>
      <p>Siswa: Budi Santoso (XI RPL)</p>
      <p>Tanggal Cetak: ${dateStr}</p>
    </div>
    <hr class="receipt-divider">
    ${rowsHTML}
    <hr class="receipt-divider">
    <div class="receipt-row total">
      <span>RATA-RATA RAPOR</span>
      <span>${avg.toFixed(1)}</span>
    </div>
    <div class="receipt-row">
      <span>Status Akhir</span>
      <span style="font-weight:700;color:${avg >= KKM ? 'var(--success)' : 'var(--danger)'}">
        ${avg >= KKM ? 'LULUS' : 'REMEDIAL'}
      </span>
    </div>
    <hr class="receipt-divider">
    <div style="text-align:center;font-size:0.7rem;color:var(--text-3);margin-top:8px;">
      <p>Politeknik Astra × SMK Yappenda</p>
    </div>
  `;

  dom.reportOverlay.classList.remove('hidden');
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
// EVENT LISTENERS
// ============================
function initEvents() {
  // Add grade button
  dom.btnTambahNilai.addEventListener('click', tambahNilai);

  // Search input
  dom.searchInput.addEventListener('input', () => {
    renderTabelNilai(dom.searchInput.value);
  });

  // Cetak rapor button
  dom.btnCetakRapor.addEventListener('click', cetakRapor);

  // Modal close
  $('btnCloseReport').addEventListener('click', () => dom.reportOverlay.classList.add('hidden'));
  $('btnSelesaiRapor').addEventListener('click', () => {
    dom.reportOverlay.classList.add('hidden');
    showToast('📜', 'Transkrip rapor selesai dicetak');
  });
}

// ============================
// INIT
// ============================
document.addEventListener('DOMContentLoaded', () => {
  renderTabelNilai();
  initEvents();
  startLiveClock();
});
