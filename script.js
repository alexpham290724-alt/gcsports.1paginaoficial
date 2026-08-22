/* ============================================================
   GC SPORTS — script.js
   Filtrado por categoría, búsqueda en vivo y links de WhatsApp
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const WHATSAPP_NUMBER = '584129497894'; // Número de atención (sin + ni espacios)

  const cards        = Array.from(document.querySelectorAll('.card'));
  const searchInput  = document.getElementById('searchInput');
  const chips        = document.querySelectorAll('.chip');
  const navLinks     = document.querySelectorAll('.nav__link[data-filter]');
  const emptyState   = document.getElementById('emptyState');
  const burgerBtn    = document.getElementById('burgerBtn');
  const mainNav      = document.getElementById('mainNav');
  const yearEl       = document.getElementById('year');

  let currentFilter = 'todos';
  let currentSearch = '';

  /* ---------- Año dinámico en el footer ---------- */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Generar enlaces de WhatsApp por producto ---------- */
  document.querySelectorAll('.js-whatsapp').forEach(btn => {
    const name  = btn.dataset.name;
    const price = btn.dataset.price;

    const message = `Hola, estoy interesado en comprar el modelo ${name} de precio $${price}. ¿Está disponible?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Convertimos el botón en un enlace real para que funcione en móvil y escritorio
    btn.addEventListener('click', () => {
      window.open(url, '_blank', 'noopener');
    });
  });

  /* ---------- Filtrado + búsqueda combinados ---------- */
  function applyFilters() {
    let visibleCount = 0;

    cards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      const name = card.dataset.name.toLowerCase();

      const matchesCategory = currentFilter === 'todos' || categories.includes(currentFilter);
      const matchesSearch   = name.includes(currentSearch.toLowerCase());

      const isVisible = matchesCategory && matchesSearch;
      card.style.display = isVisible ? '' : 'none';
      if (isVisible) visibleCount++;
    });

    emptyState.hidden = visibleCount !== 0;
  }

  /* ---------- Activar chip / nav-link visualmente ---------- */
  function setActiveFilter(filter) {
    currentFilter = filter;

    chips.forEach(chip => {
      chip.classList.toggle('is-active', chip.dataset.filter === filter);
    });
    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.dataset.filter === filter);
    });

    applyFilters();
  }

  /* ---------- Eventos: chips de filtro ---------- */
  chips.forEach(chip => {
    chip.addEventListener('click', () => setActiveFilter(chip.dataset.filter));
  });

  /* ---------- Eventos: menú de categorías (navbar y footer) ---------- */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveFilter(link.dataset.filter);

      // Si el link viene del footer, hacemos scroll suave al catálogo
      document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });

      // Cerrar menú móvil si estaba abierto
      closeMobileNav();
    });
  });

  /* ---------- Búsqueda en vivo ---------- */
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    applyFilters();
  });

  /* ---------- Menú móvil (burger) ---------- */
  function closeMobileNav() {
    mainNav.classList.remove('is-open');
    burgerBtn.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }

  burgerBtn.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    burgerBtn.classList.toggle('is-open', isOpen);
    burgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Cerrar el menú móvil al hacer click fuera de él
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !burgerBtn.contains(e.target)) {
      closeMobileNav();
    }
  });

  /* ---------- Estado inicial ---------- */
  applyFilters();
});
