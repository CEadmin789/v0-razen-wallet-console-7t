/* RAZEN Wallet Console - TrueMoney Style */

const mockData = {
  balance: 12680.00,
  account: { name: 'บัญชีที่ 1', phone: '092****708', status: 'active' },
  summary: { in: 8400, out: 3220, pending: 3 },
  chart: {
    labels: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
    incoming: [1200, 2100, 800, 1500, 900, 1800, 1100],
    outgoing: [400, 600, 1200, 300, 500, 200, 20]
  },
  transactions: [
    { id:1, type:'out', title:'โอน P2P', sub:'ไปยัง 081****234 \u00b7 20 พ.ค. 2026', amount:-1200 },
    { id:2, type:'in', title:'รับเงิน', sub:'จาก 089****567 \u00b7 19 พ.ค. 2026', amount:2500 },
    { id:3, type:'out', title:'โอนพร้อมเพย์', sub:'ไปยัง 098****123 \u00b7 18 พ.ค. 2026', amount:-800 },
    { id:4, type:'in', title:'รับเงิน', sub:'จาก 065****890 \u00b7 17 พ.ค. 2026', amount:1500 },
    { id:5, type:'out', title:'โอน P2P', sub:'ไปยัง 091****456 \u00b7 16 พ.ค. 2026', amount:-500 }
  ],
  accounts: [
    { id:1, name:'บัญชีหลัก', phone:'092****708', status:'active' },
    { id:2, name:'บัญชีรอง', phone:'081****234', status:'active' },
    { id:3, name:'บัญชีทดสอบ', phone:'065****890', status:'inactive' }
  ],
  history: [
    { id:1, type:'out', title:'โอน P2P', date:'2026-05-20', amount:-1200, status:'สำเร็จ' },
    { id:2, type:'in', title:'รับเงิน', date:'2026-05-19', amount:2500, status:'สำเร็จ' },
    { id:3, type:'out', title:'โอนพร้อมเพย์', date:'2026-05-18', amount:-800, status:'สำเร็จ' },
    { id:4, type:'in', title:'รับเงิน', date:'2026-05-17', amount:1500, status:'สำเร็จ' },
    { id:5, type:'out', title:'โอนธนาคาร', date:'2026-05-16', amount:-500, status:'สำเร็จ' },
    { id:6, type:'in', title:'รับเงิน', date:'2026-05-15', amount:3200, status:'สำเร็จ' },
    { id:7, type:'out', title:'โอน P2P', date:'2026-05-14', amount:-2200, status:'สำเร็จ' },
    { id:8, type:'out', title:'โอนพร้อมเพย์', date:'2026-05-13', amount:-300, status:'สำเร็จ' }
  ]
};

// Thai bank data with image mini-logos
var banks = [
  {
    code: 'scb',
    name: 'ไทยพาณิชย์',
    short: 'SCB',
    color: '#4E2A84',

    icon: '<img src="public/icons/runtime-1.svg" alt="" aria-hidden="true">'
  },
  {
    code: 'kbank',
    name: 'กสิกรไทย',
    short: 'KBANK',
    color: '#138F2D',

    icon: '<img src="public/icons/runtime-2.svg" alt="" aria-hidden="true">'
  },
  {
    code: 'bbl',
    name: 'กรุงเทพ',
    short: 'BBL',
    color: '#1E3A8A',

    icon: '<img src="public/icons/runtime-3.svg" alt="" aria-hidden="true">'
  },
  {
    code: 'ktb',
    name: 'กรุงไทย',
    short: 'KTB',
    color: '#1BA5E0',

    icon: '<img src="public/icons/runtime-4.svg" alt="" aria-hidden="true">'
  },
  {
    code: 'gsb',
    name: 'ออมสิน',
    short: 'GSB',
    color: '#EB1E8C',
    icon: '<img src="public/icons/runtime-5.svg" alt="" aria-hidden="true">'
  },
  {
    code: 'bay',
    name: 'กรุงศรีอยุธยา',
    short: 'BAY',
    color: '#FEC601',
    icon: '<img src="public/icons/runtime-6.svg" alt="" aria-hidden="true">'
  },
  {
    code: 'ttb',
    name: 'ทีเอ็มบีธนชาต',
    short: 'TTB',
    color: '#0066B3',
    icon: '<img src="public/icons/runtime-7.svg" alt="" aria-hidden="true">'
  },
  {
    code: 'baac',
    name: 'ธ.ก.ส.',
    short: 'BAAC',
    color: '#8B6914',
    icon: '<img src="public/icons/runtime-8.svg" alt="" aria-hidden="true">'
  }
];

let chartInstance = null;
let currentPage = 'dashboard';
let currentTransferType = null;
let selectedBank = null;

// ── Build bank grid ──
function renderBankGrid() {
  var grid = document.getElementById('bank-grid');
  if (!grid) return;
  grid.innerHTML = banks.map(function(b) {
    return '<button class="bank-chip" data-bank="' + b.code + '" type="button" title="' + b.name + '">'
      + '<span class="bank-logo-mini">' + b.icon + '</span>'
      + '<span class="bank-name">' + b.short + '</span>'
      + '</button>';
  }).join('');
  // Bind click events
  grid.querySelectorAll('.bank-chip').forEach(function(chip) {
    chip.addEventListener('click', function() { selectBank(this); });
  });
}

// ── Navigation ──
function showPage(page) {
  currentPage = page;
  document.querySelectorAll('.page-section').forEach(function(s) { s.classList.remove('active'); });
  document.querySelectorAll('.nav-item, .mnav').forEach(function(n) { n.classList.remove('active'); });
  var target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  document.querySelectorAll('[data-page="' + page + '"]').forEach(function(el) { el.classList.add('active'); });
  document.getElementById('drawer-overlay').classList.remove('open');
  document.getElementById('drawer-sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'dashboard') setTimeout(initChart, 100);
}

function toggleDrawer() {
  var o = document.getElementById('drawer-overlay');
  var d = document.getElementById('drawer-sidebar');
  if (d.classList.contains('open')) { o.classList.remove('open'); d.classList.remove('open'); }
  else { o.classList.add('open'); d.classList.add('open'); }
}

// ── Transfer Tabs ──
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  var tab = document.getElementById(tabId);
  if (tab) tab.classList.add('active');
  var btn = document.querySelector('[data-tab="' + tabId + '"]');
  if (btn) btn.classList.add('active');
}

// ── Toast ──
function showToast(message, type) {
  type = type || 'info';
  var container = document.getElementById('toast-container');
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  var icon = '';
  if (type === 'success') icon = '<img src="public/icons/runtime-9.svg" alt="" aria-hidden="true">';
  else if (type === 'error') icon = '<img src="public/icons/runtime-10.svg" alt="" aria-hidden="true">';
  else icon = '<img src="public/icons/runtime-11.svg" alt="" aria-hidden="true">';
  toast.innerHTML = icon + '<span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3000);
}

// ── Chart ──
function initChart() {
  var canvas = document.getElementById('balanceChart');
  if (!canvas) return;
  if (chartInstance) chartInstance.destroy();
  var ctx = canvas.getContext('2d');
  var g1 = ctx.createLinearGradient(0, 0, 0, 200);
  g1.addColorStop(0, 'rgba(76,175,80,0.25)'); g1.addColorStop(1, 'rgba(76,175,80,0)');
  var g2 = ctx.createLinearGradient(0, 0, 0, 200);
  g2.addColorStop(0, 'rgba(247,147,30,0.25)'); g2.addColorStop(1, 'rgba(247,147,30,0)');
  var isMobile = window.innerWidth <= 768;
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: mockData.chart.labels,
      datasets: [
        { label: 'เงินเข้า', data: mockData.chart.incoming, borderColor: '#4CAF50', backgroundColor: g1, borderWidth: 2.5, tension: 0.4, fill: true, pointRadius: isMobile ? 3 : 5, pointBackgroundColor: '#4CAF50', pointBorderColor: '#111113', pointBorderWidth: 2, pointHoverRadius: isMobile ? 5 : 7 },
        { label: 'เงินออก', data: mockData.chart.outgoing, borderColor: '#F7931E', backgroundColor: g2, borderWidth: 2.5, tension: 0.4, fill: true, pointRadius: isMobile ? 3 : 5, pointBackgroundColor: '#F7931E', pointBorderColor: '#111113', pointBorderWidth: 2, pointHoverRadius: isMobile ? 5 : 7 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#2a2a2e', titleColor: '#fff', bodyColor: '#fff', borderColor: 'rgba(247,147,30,0.3)', borderWidth: 1, padding: 10, cornerRadius: 10, displayColors: true, titleFont: { size: 12, weight: '700', family: 'Sarabun' }, bodyFont: { size: 12, weight: '600', family: 'Sarabun' }, callbacks: { label: function(c) { return c.dataset.label + ': \u0e3f' + c.parsed.y.toLocaleString(); } } }
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#707070', font: { size: 11, weight: '600', family: 'Sarabun' } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#707070', font: { size: 10, weight: '600', family: 'Sarabun' }, callback: function(v) { return '\u0e3f' + v; } } }
      },
      interaction: { intersect: false, mode: 'index' },
      animation: { duration: 800, easing: 'easeOutQuart' }
    }
  });
}

// ── Transfer Modal ──
function openTransferModal(type) {
  currentTransferType = type;
  var overlay = document.getElementById('transfer-modal-overlay');
  var amount = '', phone = '';
  if (type === 'p2p') { amount = document.getElementById('p2p-amount').value || ''; phone = document.getElementById('p2p-phone').value || '08XXXXXXXX'; }
  else if (type === 'promptpay') { amount = document.getElementById('pp-amount').value || ''; phone = document.getElementById('pp-number').value || '08XXXXXXXX'; }
  else if (type === 'bank') { amount = document.getElementById('bank-amount').value || ''; phone = document.getElementById('bank-account').value || 'XXX-X-XXXXX-X'; }
  document.getElementById('confirm-receiver').textContent = 'นาย สมชาย ใจดี';
  document.getElementById('confirm-receiver-en').textContent = 'Somchai Jaidee';
  document.getElementById('confirm-phone').textContent = phone || '082XXXXXXXX';
  document.getElementById('confirm-amount').textContent = amount ? '\u0e3f' + parseFloat(amount).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '\u0e3f1.00';
  var heading = document.getElementById('modal-heading');
  if (type === 'p2p') heading.textContent = 'ยืนยันโอน P2P';
  else if (type === 'promptpay') heading.textContent = 'ยืนยันโอนพร้อมเพย์';
  else if (type === 'bank') heading.textContent = 'ยืนยันโอนธนาคาร';
  overlay.classList.add('open');
}

function closeTransferModal() {
  document.getElementById('transfer-modal-overlay').classList.remove('open');
}

function confirmTransfer() {
  var type = currentTransferType;
  closeTransferModal();
  if (type === 'p2p') { document.getElementById('p2p-phone').value = ''; document.getElementById('p2p-amount').value = ''; document.getElementById('p2p-note').value = ''; }
  else if (type === 'promptpay') { document.getElementById('pp-number').value = ''; document.getElementById('pp-amount').value = ''; }
  else if (type === 'bank') { document.getElementById('bank-account').value = ''; document.getElementById('bank-amount').value = ''; deselectBanks(); }
  currentTransferType = null;
  setTimeout(function() { showToast('โอนเงินสำเร็จ', 'success'); }, 300);
}

// ── History ──
function searchHistory() {
  var list = document.getElementById('history-list');
  list.innerHTML = '<div class="skeleton skeleton-tx"></div><div class="skeleton skeleton-tx"></div><div class="skeleton skeleton-tx"></div><div class="skeleton skeleton-tx"></div>';
  setTimeout(function() { renderHistory(mockData.history); showToast('ค้นหาเสร็จสิ้น', 'success'); }, 1200);
}

function renderHistory(data) {
  var list = document.getElementById('history-list');
  if (!data || !data.length) { list.innerHTML = '<div style="text-align:center;padding:36px;color:#707070;font-weight:600;">ไม่พบรายการ</div>'; return; }
  list.innerHTML = data.map(function(tx) {
    var cls = tx.type === 'in' ? 'tx-in' : 'tx-out';
    var amtCls = tx.type === 'in' ? 'tx-amount-in' : 'tx-amount-out';
    var icon = tx.type === 'in'
      ? '<img src="public/icons/runtime-12.svg" alt="" aria-hidden="true">'
      : '<img src="public/icons/runtime-13.svg" alt="" aria-hidden="true">';
    return '<div class="tx-item"><div class="tx-icon ' + cls + '">' + icon + '</div>'
      + '<div class="tx-info"><div class="tx-title">' + tx.title + '</div><div class="tx-sub">' + tx.date + ' \u00b7 <span style="color:#6FCF73;font-weight:600;">' + tx.status + '</span></div></div>'
      + '<div class="tx-amount ' + amtCls + '">' + (tx.type === 'in' ? '+' : '') + '\u0e3f' + Math.abs(tx.amount).toLocaleString() + '</div></div>';
  }).join('');
}

// ── Accounts ──
function renderAccounts() {
  var container = document.getElementById('accounts-list');
  if (!container) return;
  container.innerHTML = mockData.accounts.map(function(a) {
    var initial = a.name.charAt(0);
    var badgeCls = a.status === 'active' ? 'active' : 'inactive';
    var badgeText = a.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน';
    return '<div class="account-card">'
      + '<div class="account-avatar">' + initial + '</div>'
      + '<div class="account-info"><div class="account-name">' + a.name + '</div><div class="account-phone">' + a.phone + '</div></div>'
      + '<span class="account-badge ' + badgeCls + '">' + badgeText + '</span></div>';
  }).join('');
}

function openAccountSheet() {
  document.getElementById('account-sheet-overlay').classList.add('open');
  document.getElementById('account-sheet').classList.add('open');
}

function closeAccountSheet() {
  var sheet = document.getElementById('account-sheet');
  sheet.style.transform = 'translateY(100%)';
  setTimeout(function() {
    document.getElementById('account-sheet-overlay').classList.remove('open');
    sheet.classList.remove('open');
    sheet.style.transform = '';
  }, 300);
}

function submitAccountForm(e) {
  e.preventDefault();
  closeAccountSheet();
  var name = document.getElementById('acc-name').value || 'บัญชีใหม่';
  mockData.accounts.push({ id: mockData.accounts.length + 1, name: name, phone: '09X****XXX', status: 'active' });
  renderAccounts();
  e.target.reset();
  setTimeout(function() { showToast('เชื่อมบัญชีแล้ว', 'success'); }, 300);
}

// ── Envelope ──
function createEnvelope() {
  var total = document.getElementById('env-total').value;
  var count = document.getElementById('env-count').value;
  if (!total || !count) { showToast('กรุณากรอกข้อมูลให้ครบ', 'error'); return; }
  showToast('สร้างซองแล้ว', 'success');
  document.getElementById('env-total').value = '';
  document.getElementById('env-count').value = '';
}

// ── Tools ──
function saveAPI() { showToast('บันทึก API แล้ว', 'success'); }
function testAPI() { showToast('กำลังทดสอบ...', 'info'); setTimeout(function() { showToast('API ออนไลน์', 'success'); }, 1000); }
function exportCSV() {
  showToast('Export CSV แล้ว', 'success');
  var csv = '\ufeffวันที่,รายการ,จำนวน,สถานะ\n' + mockData.history.map(function(tx) {
    return tx.date + ',' + tx.title + ',' + tx.amount + ',' + tx.status;
  }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'razen_transactions.csv';
  link.click();
}
function simulateError() { showToast('เกิดข้อผิดพลาด', 'error'); }

// ── Bank Select ──
function deselectBanks() {
  selectedBank = null;
  document.querySelectorAll('.bank-chip').forEach(function(c) { c.classList.remove('active'); });
}

function selectBank(el) {
  document.querySelectorAll('.bank-chip').forEach(function(c) { c.classList.remove('active'); });
  el.classList.add('active');
  selectedBank = el.getAttribute('data-bank');
}

// ── Init ──
document.addEventListener('DOMContentLoaded', function() {
  renderBankGrid();
  showPage('dashboard');
  renderAccounts();
  renderHistory(mockData.history);

  // Set default dates
  var today = new Date();
  var week = new Date(today);
  week.setDate(week.getDate() - 7);
  var hs = document.getElementById('hist-start');
  var he = document.getElementById('hist-end');
  if (hs) hs.value = week.toISOString().split('T')[0];
  if (he) he.value = today.toISOString().split('T')[0];

  // Transfer buttons
  document.getElementById('btn-p2p').addEventListener('click', function() { openTransferModal('p2p'); });
  document.getElementById('btn-pp').addEventListener('click', function() { openTransferModal('promptpay'); });
  document.getElementById('btn-bank').addEventListener('click', function() { openTransferModal('bank'); });

  // Modal overlay click
  document.getElementById('transfer-modal-overlay').addEventListener('click', function(e) { if (e.target === this) closeTransferModal(); });
  document.getElementById('account-sheet-overlay').addEventListener('click', function(e) { if (e.target === this) closeAccountSheet(); });

  // Account form
  document.getElementById('account-form').addEventListener('submit', submitAccountForm);

  // Envelope & Tools
  document.getElementById('btn-envelope').addEventListener('click', createEnvelope);
  document.getElementById('btn-save-api').addEventListener('click', saveAPI);
  document.getElementById('btn-test-api').addEventListener('click', testAPI);
  document.getElementById('btn-export-csv').addEventListener('click', exportCSV);
  document.getElementById('btn-sim-error').addEventListener('click', simulateError);
  document.getElementById('btn-search').addEventListener('click', searchHistory);

  // Quick actions
  document.querySelectorAll('.qa-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var goto = this.getAttribute('data-goto');
      if (goto) showPage(goto);
    });
  });

  // Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeTransferModal(); closeAccountSheet(); document.getElementById('drawer-overlay').classList.remove('open'); document.getElementById('drawer-sidebar').classList.remove('open'); }
  });

  // Resize chart
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() { if (currentPage === 'dashboard' && chartInstance) chartInstance.resize(); }, 250);
  });
});


(function () {
  if (!window.RazenSound) return;
  var booted = false;
  var skipClose = false;

  var _toast = showToast;
  showToast = function (message, type) {
    _toast(message, type);
    if (type === "success") RazenSound.play("success");
    else if (type === "error") RazenSound.play("error");
  };

  var _page = showPage;
  showPage = function (page) {
    _page(page);
    if (booted) RazenSound.play("nav");
  };

  var _open = openTransferModal;
  openTransferModal = function (type) {
    _open(type);
    RazenSound.play("open");
  };

  var _close = closeTransferModal;
  closeTransferModal = function () {
    _close();
    if (!skipClose) RazenSound.play("close");
  };

  var _confirm = confirmTransfer;
  confirmTransfer = function () {
    skipClose = true;
    try { _confirm(); } finally { skipClose = false; }
  };

  var _bank = selectBank;
  selectBank = function (el) {
    _bank(el);
    RazenSound.play("tick");
  };

  var _drawer = toggleDrawer;
  toggleDrawer = function () {
    var open = document.getElementById("drawer-sidebar").classList.contains("open");
    _drawer();
    RazenSound.play(open ? "close" : "open");
  };

  document.addEventListener("DOMContentLoaded", function () {
    RazenSound.mount();
    booted = true;
  });
})();
