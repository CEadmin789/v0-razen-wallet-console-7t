/**
 * RAZEN Wallet Console - Application JavaScript
 * TrueMoney Wallet Style - Thai Language UI
 */

// ========================================
// Mock Data
// ========================================

const mockData = {
  balance: 12680.00,
  account: {
    name: 'บัญชีที่ 1',
    phone: '092****708',
    status: 'active'
  },
  summary: {
    in: 8400,
    out: 3220,
    pending: 3
  },
  chart: {
    labels: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
    incoming: [1200, 2100, 800, 1500, 900, 1800, 1100],
    outgoing: [400, 600, 1200, 300, 500, 200, 20]
  },
  transactions: [
    { id: 1, type: 'out', title: 'โอน P2P', sub: 'ไปยัง 081****234 · 20 พ.ค. 2026', amount: -1200 },
    { id: 2, type: 'in', title: 'รับเงิน', sub: 'จาก 089****567 · 19 พ.ค. 2026', amount: 2500 },
    { id: 3, type: 'out', title: 'โอนพร้อมเพย์', sub: 'ไปยัง 098****123 · 18 พ.ค. 2026', amount: -800 },
    { id: 4, type: 'in', title: 'รับเงิน', sub: 'จาก 065****890 · 17 พ.ค. 2026', amount: 1500 },
    { id: 5, type: 'out', title: 'โอน P2P', sub: 'ไปยัง 091****456 · 16 พ.ค. 2026', amount: -500 }
  ],
  accounts: [
    { id: 1, name: 'บัญชีหลัก', phone: '092****708', status: 'active' },
    { id: 2, name: 'บัญชีรอง', phone: '081****234', status: 'active' },
    { id: 3, name: 'บัญชีทดสอบ', phone: '065****890', status: 'inactive' }
  ],
  history: [
    { id: 1, type: 'out', title: 'โอน P2P', date: '2026-05-20', amount: -1200, status: 'สำเร็จ' },
    { id: 2, type: 'in', title: 'รับเงิน', date: '2026-05-19', amount: 2500, status: 'สำเร็จ' },
    { id: 3, type: 'out', title: 'โอนพร้อมเพย์', date: '2026-05-18', amount: -800, status: 'สำเร็จ' },
    { id: 4, type: 'in', title: 'รับเงิน', date: '2026-05-17', amount: 1500, status: 'สำเร็จ' },
    { id: 5, type: 'out', title: 'โอนธนาคาร', date: '2026-05-16', amount: -500, status: 'สำเร็จ' },
    { id: 6, type: 'in', title: 'รับเงิน', date: '2026-05-15', amount: 3200, status: 'สำเร็จ' },
    { id: 7, type: 'out', title: 'โอน P2P', date: '2026-05-14', amount: -2200, status: 'สำเร็จ' },
    { id: 8, type: 'out', title: 'โอนพร้อมเพย์', date: '2026-05-13', amount: -300, status: 'สำเร็จ' }
  ]
};

// ========================================
// State
// ========================================

let chartInstance = null;
let currentPage = 'dashboard';
let currentTransferType = null;

// ========================================
// Page Navigation
// ========================================

function showPage(page) {
  currentPage = page;
  
  // Hide all pages
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Remove active from all nav items
  document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Show target page
  const targetPage = document.getElementById('page-' + page);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // Activate nav items
  document.querySelectorAll(`[data-page="${page}"]`).forEach(item => {
    item.classList.add('active');
  });
  
  // Close drawer
  document.getElementById('drawer-overlay').classList.remove('open');
  document.getElementById('drawer-sidebar').classList.remove('open');
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Initialize chart if dashboard
  if (page === 'dashboard') {
    setTimeout(initChart, 100);
  }
}

// ========================================
// Drawer Toggle (Mobile)
// ========================================

function toggleDrawer() {
  const overlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById('drawer-sidebar');
  
  if (drawer.classList.contains('open')) {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
  } else {
    overlay.classList.add('open');
    drawer.classList.add('open');
  }
}

// ========================================
// Toast Notifications
// ========================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '';
  if (type === 'success') icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  else if (type === 'error') icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  else icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  
  toast.innerHTML = `${icon}<span>${message}</span>`;
  
  container.appendChild(toast);
  
  // Remove after animation
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}

// ========================================
// Chart Initialization
// ========================================

function initChart() {
  const canvas = document.getElementById('balanceChart');
  if (!canvas) return;
  
  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  const ctx = canvas.getContext('2d');
  
  // Create gradients - TrueMoney colors
  const gradientGreen = ctx.createLinearGradient(0, 0, 0, 260);
  gradientGreen.addColorStop(0, 'rgba(76, 175, 80, 0.3)');
  gradientGreen.addColorStop(1, 'rgba(76, 175, 80, 0.0)');
  
  const gradientOrange = ctx.createLinearGradient(0, 0, 0, 260);
  gradientOrange.addColorStop(0, 'rgba(247, 147, 30, 0.3)');
  gradientOrange.addColorStop(1, 'rgba(247, 147, 30, 0.0)');
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: mockData.chart.labels,
      datasets: [
        {
          label: 'เงินเข้า',
          data: mockData.chart.incoming,
          borderColor: '#4CAF50',
          backgroundColor: gradientGreen,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: '#4CAF50',
          pointBorderColor: '#1a1a1a',
          pointBorderWidth: 2,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#6FCF73',
          pointHoverBorderColor: '#1a1a1a',
          pointHoverBorderWidth: 3
        },
        {
          label: 'เงินออก',
          data: mockData.chart.outgoing,
          borderColor: '#F7931E',
          backgroundColor: gradientOrange,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: '#F7931E',
          pointBorderColor: '#1a1a1a',
          pointBorderWidth: 2,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#FFAA42',
          pointHoverBorderColor: '#1a1a1a',
          pointHoverBorderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#3a3a3a',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: 'rgba(247, 147, 30, 0.3)',
          borderWidth: 1,
          padding: 14,
          cornerRadius: 12,
          displayColors: true,
          titleFont: {
            size: 13,
            weight: '700',
            family: 'Sarabun'
          },
          bodyFont: {
            size: 13,
            weight: '600',
            family: 'Sarabun'
          },
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ฿ ' + context.parsed.y.toLocaleString();
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#808080',
            font: {
              size: 12,
              weight: '600',
              family: 'Sarabun'
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#808080',
            font: {
              size: 11,
              weight: '600',
              family: 'Sarabun'
            },
            callback: function(value) {
              return '฿' + value;
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  });
}

// ========================================
// Transfer Modal - TrueMoney Style
// ========================================

function openTransferModal(type) {
  currentTransferType = type;
  
  const overlay = document.getElementById('transfer-modal-overlay');
  
  // Get amount and phone from form
  let amount = '';
  let phone = '';
  
  if (type === 'p2p') {
    amount = document.getElementById('p2p-amount')?.value || '';
    phone = document.getElementById('p2p-phone')?.value || '08XXXXXXXX';
  } else if (type === 'promptpay') {
    amount = document.getElementById('pp-amount')?.value || '';
    phone = document.getElementById('pp-number')?.value || '08XXXXXXXX';
  } else if (type === 'bank') {
    amount = document.getElementById('bank-amount')?.value || '';
    phone = document.getElementById('bank-account')?.value || 'XXX-X-XXXXX-X';
  }
  
  // Mock receiver data
  const receiver = 'นาย สมชาย ใจดี';
  const receiverEn = 'Somchai Jaidee';
  
  // Update modal content
  document.getElementById('confirm-receiver').textContent = receiver;
  document.getElementById('confirm-receiver-en').textContent = receiverEn;
  document.getElementById('confirm-phone').textContent = phone || '082XXXXXXXX';
  document.getElementById('confirm-amount').textContent = amount 
    ? '฿' + parseFloat(amount).toLocaleString('th-TH', { minimumFractionDigits: 2 }) 
    : '฿1.00';
  
  // Update modal title based on type
  const modalTitle = document.querySelector('.modal-title');
  if (modalTitle) {
    if (type === 'p2p') modalTitle.textContent = 'ยืนยันโอน P2P';
    else if (type === 'promptpay') modalTitle.textContent = 'ยืนยันโอนพร้อมเพย์';
    else if (type === 'bank') modalTitle.textContent = 'ยืนยันโอนธนาคาร';
  }
  
  // Show modal
  overlay.classList.add('open');
}

function closeTransferModal() {
  const overlay = document.getElementById('transfer-modal-overlay');
  overlay.classList.remove('open');
  currentTransferType = null;
}

function confirmTransfer() {
  closeTransferModal();
  
  // Clear form
  if (currentTransferType === 'p2p') {
    document.getElementById('p2p-phone').value = '';
    document.getElementById('p2p-amount').value = '';
    document.getElementById('p2p-note').value = '';
  } else if (currentTransferType === 'promptpay') {
    document.getElementById('pp-number').value = '';
    document.getElementById('pp-amount').value = '';
  } else if (currentTransferType === 'bank') {
    document.getElementById('bank-select').value = '';
    document.getElementById('bank-account').value = '';
    document.getElementById('bank-amount').value = '';
  }
  
  setTimeout(() => {
    showToast('โอนเงินสำเร็จ', 'success');
  }, 300);
}

// ========================================
// History Search
// ========================================

function searchHistory() {
  const list = document.getElementById('history-list');
  
  // Show skeleton loading
  list.innerHTML = `
    <div class="skeleton skeleton-tx"></div>
    <div class="skeleton skeleton-tx"></div>
    <div class="skeleton skeleton-tx"></div>
    <div class="skeleton skeleton-tx"></div>
  `;
  
  // Simulate API call
  setTimeout(() => {
    renderHistory(mockData.history);
    showToast('ค้นหาเสร็จสิ้น', 'success');
  }, 1200);
}

function renderHistory(data) {
  const list = document.getElementById('history-list');
  
  if (!data || data.length === 0) {
    list.innerHTML = `
      <div style="text-align:center;padding:40px;color:#808080;font-weight:600;">
        ไม่พบรายการ
      </div>
    `;
    return;
  }
  
  list.innerHTML = data.map(tx => `
    <div class="tx-item ${tx.type}">
      <div class="tx-icon ${tx.type}">
        ${tx.type === 'in' 
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/></svg>'
        }
      </div>
      <div class="tx-info">
        <div class="tx-title">${tx.title}</div>
        <div class="tx-sub">${tx.date} · <span style="color:#6FCF73;font-weight:600;">${tx.status}</span></div>
      </div>
      <div class="tx-amount ${tx.type}">${tx.type === 'in' ? '+' : ''}฿ ${Math.abs(tx.amount).toLocaleString()}</div>
    </div>
  `).join('');
}

// ========================================
// Accounts Management
// ========================================

function renderAccounts() {
  const tbody = document.getElementById('accounts-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = mockData.accounts.map(account => `
    <tr>
      <td><strong style="color:#fff;">${account.name}</strong></td>
      <td style="color:#b0b0b0;">${account.phone}</td>
      <td>
        <span class="badge ${account.status === 'active' ? 'badge-green' : 'badge-yellow'}">
          ${account.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
        </span>
      </td>
    </tr>
  `).join('');
}

function openAccountSheet() {
  document.getElementById('account-sheet-overlay').classList.add('open');
  document.getElementById('account-sheet').classList.add('open');
}

function closeAccountSheet() {
  const overlay = document.getElementById('account-sheet-overlay');
  const sheet = document.getElementById('account-sheet');
  
  sheet.style.transform = 'translateY(100%)';
  
  setTimeout(() => {
    overlay.classList.remove('open');
    sheet.classList.remove('open');
    sheet.style.transform = '';
  }, 300);
}

function submitAccountForm(e) {
  e.preventDefault();
  
  closeAccountSheet();
  
  setTimeout(() => {
    showToast('เชื่อมบัญชีแล้ว', 'success');
  }, 300);
  
  // Add to mock data
  const name = document.getElementById('acc-name')?.value || 'บัญชีใหม่';
  mockData.accounts.push({
    id: mockData.accounts.length + 1,
    name: name,
    phone: '09X****XXX',
    status: 'active'
  });
  
  // Re-render
  renderAccounts();
  
  // Reset form
  e.target.reset();
}

// ========================================
// Envelope Creation
// ========================================

function createEnvelope() {
  const total = document.getElementById('env-total')?.value;
  const count = document.getElementById('env-count')?.value;
  
  if (!total || !count) {
    showToast('กรุณากรอกข้อมูลให้ครบ', 'error');
    return;
  }
  
  showToast('สร้างซองแล้ว', 'success');
  
  // Clear form
  document.getElementById('env-total').value = '';
  document.getElementById('env-count').value = '';
}

// ========================================
// Tools Page Functions
// ========================================

function saveAPI() {
  showToast('บันทึก API แล้ว', 'success');
}

function testAPI() {
  showToast('กำลังทดสอบ...', 'info');
  
  setTimeout(() => {
    showToast('API ออนไลน์', 'success');
  }, 1000);
}

function exportCSV() {
  showToast('Export CSV แล้ว', 'success');
  
  // Create and download fake CSV
  const csvContent = 'วันที่,รายการ,จำนวน,สถานะ\n' + 
    mockData.history.map(tx => 
      `${tx.date},${tx.title},${tx.amount},${tx.status}`
    ).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'razen_transactions.csv';
  link.click();
}

function simulateError() {
  showToast('เกิดข้อผิดพลาด', 'error');
}

// ========================================
// Bank Selection
// ========================================

function selectBank(bankCode) {
  const select = document.getElementById('bank-select');
  if (select) {
    select.value = bankCode;
  }
}

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Initial page
  showPage('dashboard');
  
  // Render accounts
  renderAccounts();
  
  // Render history
  renderHistory(mockData.history);
  
  // Set default dates for history filter
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const histStart = document.getElementById('hist-start');
  const histEnd = document.getElementById('hist-end');
  
  if (histStart) histStart.value = weekAgo.toISOString().split('T')[0];
  if (histEnd) histEnd.value = today.toISOString().split('T')[0];
  
  // ========================================
  // Event Listeners
  // ========================================
  
  // Transfer buttons
  document.getElementById('btn-p2p')?.addEventListener('click', () => openTransferModal('p2p'));
  document.getElementById('btn-pp')?.addEventListener('click', () => openTransferModal('promptpay'));
  document.getElementById('btn-bank')?.addEventListener('click', () => openTransferModal('bank'));
  
  // Transfer modal overlay click to close
  document.getElementById('transfer-modal-overlay')?.addEventListener('click', function(e) {
    if (e.target === this) {
      closeTransferModal();
    }
  });
  
  // Account sheet overlay click to close
  document.getElementById('account-sheet-overlay')?.addEventListener('click', function(e) {
    if (e.target === this) {
      closeAccountSheet();
    }
  });
  
  // Account form submit
  document.getElementById('account-form')?.addEventListener('submit', submitAccountForm);
  
  // Envelope button
  document.getElementById('btn-envelope')?.addEventListener('click', createEnvelope);
  
  // Tools buttons
  document.getElementById('btn-save-api')?.addEventListener('click', saveAPI);
  document.getElementById('btn-test-api')?.addEventListener('click', testAPI);
  document.getElementById('btn-export-csv')?.addEventListener('click', exportCSV);
  document.getElementById('btn-sim-error')?.addEventListener('click', simulateError);
  
  // History search
  document.getElementById('btn-search')?.addEventListener('click', searchHistory);
  
  // Quick action cards
  document.querySelectorAll('.qa-card').forEach(card => {
    card.addEventListener('click', function() {
      const goto = this.dataset.goto;
      if (goto) {
        showPage(goto);
      }
    });
  });
  
  // Bank items click to select
  document.querySelectorAll('.bank-item').forEach(item => {
    item.addEventListener('click', function() {
      const bankCode = this.dataset.bank;
      if (bankCode) {
        selectBank(bankCode);
        showToast('เลือก ' + this.querySelector('span').textContent, 'info');
      }
    });
  });
  
  // Handle escape key to close modals
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeTransferModal();
      closeAccountSheet();
      
      // Close drawer
      document.getElementById('drawer-overlay')?.classList.remove('open');
      document.getElementById('drawer-sidebar')?.classList.remove('open');
    }
  });
  
  // Handle window resize for chart
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (currentPage === 'dashboard' && chartInstance) {
        chartInstance.resize();
      }
    }, 250);
  });
});

// ========================================
// Utility Functions
// ========================================

function formatCurrency(amount) {
  return '฿ ' + amount.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 
                  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
}
