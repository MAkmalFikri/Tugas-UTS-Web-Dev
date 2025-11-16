// ===== FEATHER ICON RENDER =====
document.addEventListener('DOMContentLoaded', () => {
  feather.replace(); // Render semua ikon setelah DOM siap
});

// ===== UTIL: LOCK/UNLOCK SCROLL =====
let isLocked = false;
function lockScroll() {
  if (isLocked) return;
  document.body.style.overflow = 'hidden';
  // Cegah overscroll/pull to refresh di mobile
  document.addEventListener('touchmove', preventTouch, { passive: false });
  isLocked = true;
}
function unlockScroll() {
  if (!isLocked) return;
  document.body.style.overflow = 'auto';
  document.removeEventListener('touchmove', preventTouch);
  isLocked = false;
}
function preventTouch(e) {
  e.preventDefault();
}

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
setThemeIcon(savedTheme);

function setThemeIcon(theme) {
  themeToggle.innerHTML = theme === 'dark'
    ? '<i data-feather="moon" id="themeIcon"></i>'
    : '<i data-feather="sun" id="themeIcon"></i>';
  feather.replace();
}

themeToggle.addEventListener('click', () => {
  const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  setThemeIcon(newTheme);
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

function setHamburgerIcon(isOpen) {
  hamburger.innerHTML = isOpen
    ? '<i data-feather="x"></i>'
    : '<i data-feather="menu"></i>';
  feather.replace();
}

function toggleMenu(forceState) {
  const isOpen = typeof forceState === 'boolean'
    ? forceState
    : !navMenu.classList.contains('active');

  navMenu.classList.toggle('active', isOpen);
  setHamburgerIcon(isOpen);
  if (isOpen) lockScroll(); else unlockScroll();
}

hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu();
});

// Tutup menu ketika link diklik
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Tutup menu ketika klik di luar
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    if (navMenu.classList.contains('active')) toggleMenu(false);
  }
});

// ===== NAVBAR SCROLL EFFECT (HIDE ON SCROLL DOWN) =====
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  // Style saat scroll
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Sembunyikan saat scroll ke bawah
  const hide = window.scrollY > lastScrollY && window.scrollY > 100;
  navbar.classList.toggle('hidden-nav', hide);

  lastScrollY = Math.max(window.scrollY, 0);

  // Jika menu HP terbuka dan user scroll, tutup menunya
  if (navMenu.classList.contains('active')) toggleMenu(false);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

// ===== SERVICE MODAL =====
const serviceData = {
  komputer: {
    title: 'Servis Komputer',
    description: 'Perbaikan komputer lengkap dengan garansi. Kami menangani semua jenis kerusakan hardware dan software komputer Anda.'
  },
  upgrade: {
    title: 'Upgrade & Maintenance',
    description: 'Tingkatkan performa komputer Anda dengan upgrade hardware dan maintenance rutin untuk performa optimal.'
  },
  jaringan: {
    title: 'Jaringan & Internet',
    description: 'Instalasi dan konfigurasi jaringan komputer, WiFi, dan sistem keamanan CCTV untuk rumah atau kantor.'
  }
};

function openServiceModal(serviceType) {
  const modal = document.getElementById('serviceModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const serviceTypeInput = document.getElementById('serviceType');
  
  const service = serviceData[serviceType];

  if (service) {
    modalTitle.textContent = 'Pesan ' + service.title;
    modalDescription.textContent = service.description;
    serviceTypeInput.value = service.title;

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('serviceDate').setAttribute('min', today);

    modal.style.display = 'block';
    lockScroll(); // kunci scroll saat modal terbuka
    feather.replace(); // render ikon di dalam modal jika ada
  }
}

function closeServiceModal() {
  const modal = document.getElementById('serviceModal');
  modal.style.display = 'none';
  unlockScroll(); // buka kunci scroll saat modal ditutup
  // Reset form
  const form = document.getElementById('serviceForm');
  if (form) form.reset();
}

// Tutup modal ketika klik di luar
window.addEventListener('click', (e) => {
  const modal = document.getElementById('serviceModal');
  if (e.target === modal) {
    closeServiceModal();
  }
});

// Tutup modal dengan tombol ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeServiceModal();
  }
});

// ===== SERVICE FORM HANDLER =====
document.getElementById('serviceForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  const data = {
    serviceType: formData.get('serviceType'),
    name: formData.get('customerName'),
    email: formData.get('customerEmail'),
    phone: formData.get('customerPhone'),
    detail: formData.get('serviceDetail'),
    date: formData.get('serviceDate')
  };
  
  // Format tanggal
  const dateObj = new Date(data.date);
  const formattedDate = dateObj.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Simulasi pengiriman data
  console.log('Pesanan Layanan:', data);
  
  // Pesan WhatsApp
  const waMessage = `*PESANAN LAYANAN BARU*\n\n` +
                    `Layanan: ${data.serviceType}\n` +
                    `Nama: ${data.name}\n` +
                    `Email: ${data.email}\n` +
                    `Telepon: ${data.phone}\n` +
                    `Tanggal: ${formattedDate}\n\n` +
                    `Detail:\n${data.detail}`;
  
  const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`;
  
  // Tampilkan konfirmasi
  alert(`Terima kasih ${data.name}!\n\nPesanan Anda untuk ${data.serviceType} telah kami terima.\n\nAnda akan dihubungkan ke WhatsApp untuk konfirmasi lebih lanjut.`);
  
  // Redirect ke WhatsApp
  window.open(waUrl, '_blank');
  
  // Tutup modal
  closeServiceModal();
});

// ===== AUTO UPDATE YEAR IN FOOTER =====
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer p');
if (footerText) {
  footerText.innerHTML = `&copy; ${currentYear} KomputerQU. All Rights Reserved.`;
}

// ===== EXPOSE MODAL FUNCTIONS TO GLOBAL (untuk onclick HTML) =====
window.openServiceModal = openServiceModal;
window.closeServiceModal = closeServiceModal;
