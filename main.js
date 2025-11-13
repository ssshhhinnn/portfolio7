
document.addEventListener('DOMContentLoaded', function () {

  const yearEls = ['#year', '#year2', '#year3', '#year4', '#year5'];
  const y = new Date().getFullYear();
  yearEls.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.textContent = y;
  });

 
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav') || document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
 
      if (window.getComputedStyle(mainNav).display === 'none' || mainNav.classList.contains('hidden-mobile')) {
        mainNav.style.display = ''; 
        mainNav.classList.remove('hidden-mobile');
      } else {
        mainNav.style.display = 'block';
        mainNav.classList.add('hidden-mobile');
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) {
        if (mainNav) { mainNav.style.display = ''; mainNav.classList.remove('hidden-mobile'); }
      } else {
        if (mainNav && mainNav.classList.contains('hidden-mobile')) mainNav.style.display = 'none';
      }
    });
  }


  function applyFilter(filter) {
    const items = document.querySelectorAll('.portfolio-item, .gallery-item');
    items.forEach(item => {
      if (!filter || filter === 'all') {
        item.style.display = '';
      } else {
        const cat = item.dataset.cat || '';
        item.style.display = (cat === filter) ? '' : 'none';
      }
    });
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const f = this.dataset.filter;
      applyFilter(f);
    });
  });

 
  const lightboxModalEl = document.getElementById('lightboxModal');
  if (lightboxModalEl) {
    const lightboxImage = document.getElementById('lightboxImage');
    document.querySelectorAll('.gallery-thumb, .portfolio-item img').forEach(img => {
      img.addEventListener('click', function (e) {
        e.preventDefault();
        const src = this.dataset.full || this.src;
        if (lightboxImage) lightboxImage.src = src;
   
        const modal = bootstrap.Modal.getOrCreateInstance(lightboxModalEl);
        modal.show();
      });
    });
  }

 
  const STORAGE_KEY = 'rb_services_v1';
  const servicesTableBody = document.querySelector('#servicesTable tbody');
  const serviceFilterInput = document.getElementById('serviceFilter');
  const serviceModalEl = document.getElementById('serviceModal');
  const serviceForm = document.getElementById('serviceForm');

  function loadServices() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [
        { title: 'Photo editing', price: '50' },
        { title: 'Web design', price: '300' }
      ];
    } catch (err) {
      console.error('Error loading services', err);
      return [];
    }
  }

  function saveServices(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function renderServices(filter = '') {
    if (!servicesTableBody) return;
    const arr = loadServices();
    servicesTableBody.innerHTML = '';
    arr.forEach((s, i) => {
      if (filter && !s.title.toLowerCase().includes(filter.toLowerCase())) return;
      const tr = document.createElement('tr');
      tr.dataset.index = String(i);
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${escapeHtml(s.title)}</td>
        <td>${escapeHtml(s.price)}</td>
        <td>
          <button class="btn btn-sm btn-secondary edit">Edit</button>
          <button class="btn btn-sm btn-danger delete">Delete</button>
        </td>
      `;
      servicesTableBody.appendChild(tr);
    });
  }


  function escapeHtml(text) {
    if (!text) return '';
    return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }

  renderServices();

  if (serviceFilterInput) {
    serviceFilterInput.addEventListener('input', function () {
      renderServices(this.value);
    });
  }


  document.querySelectorAll('[data-bs-target="#serviceModal"]').forEach(btn => {
    btn.addEventListener('click', function () {

      if (!serviceForm) return;
      serviceForm.reset();
      const idxEl = serviceForm.querySelector('#serviceIndex');
      if (idxEl) idxEl.value = '';
      const modalInstance = bootstrap.Modal.getOrCreateInstance(serviceModalEl);
      modalInstance.show();
    });
  });

  
  if (serviceForm) {
    serviceForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const idxEl = serviceForm.querySelector('#serviceIndex');
      const titleEl = serviceForm.querySelector('#serviceTitle');
      const priceEl = serviceForm.querySelector('#servicePrice');
      const title = titleEl ? titleEl.value.trim() : '';
      const price = priceEl ? priceEl.value.trim() : '';

      if (!title || !/^\d+$/.test(price)) {
        alert('Please enter valid title and numeric price.');
        return;
      }

      const arr = loadServices();
      if (idxEl && idxEl.value !== '') {
  
        const idx = parseInt(idxEl.value);
        arr[idx] = { title, price };
      } else {
  
        arr.push({ title, price });
      }
      saveServices(arr);
      renderServices(serviceFilterInput ? serviceFilterInput.value : '');
  
      if (serviceModalEl) bootstrap.Modal.getOrCreateInstance(serviceModalEl).hide();
      serviceForm.reset();
    });
  }

 
  if (servicesTableBody) {
    servicesTableBody.addEventListener('click', function (e) {
      const target = e.target;
      const row = target.closest('tr');
      if (!row) return;
      const idx = parseInt(row.dataset.index);
      const arr = loadServices();

      if (target.classList.contains('delete')) {
        if (!confirm('Delete this service?')) return;
        arr.splice(idx, 1);
        saveServices(arr);
        renderServices(serviceFilterInput ? serviceFilterInput.value : '');
      }

      if (target.classList.contains('edit')) {
        const item = arr[idx];
        if (!serviceForm) return;
        serviceForm.querySelector('#serviceIndex').value = String(idx);
        serviceForm.querySelector('#serviceTitle').value = item.title;
        serviceForm.querySelector('#servicePrice').value = item.price;
     
        if (serviceModalEl) bootstrap.Modal.getOrCreateInstance(serviceModalEl).show();
      }
    });
  }


  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameEl = contactForm.querySelector('#name');
    const emailEl = contactForm.querySelector('#email');

    const msgEl = contactForm.querySelector('#msg') || contactForm.querySelector('#message');
    const alertEl = document.getElementById('contactAlert');

    function clearInvalid() {
      [nameEl, emailEl, msgEl].forEach(el => {
        if (!el) return;
        el.classList.remove('is-invalid');
      });
      if (alertEl) alertEl.textContent = '';
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearInvalid();
      let valid = true;

 
      if (!nameEl || !nameEl.value.trim()) {
        if (nameEl) nameEl.classList.add('is-invalid');
        valid = false;
      }

  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailEl || !emailEl.value.trim() || !emailRegex.test(emailEl.value.trim())) {
        if (emailEl) emailEl.classList.add('is-invalid');
        valid = false;
      }

  
      if (!msgEl || !msgEl.value.trim()) {
        if (msgEl) msgEl.classList.add('is-invalid');
        valid = false;
      }

      if (!valid) {
        if (alertEl) {
          alertEl.textContent = 'Пожалуйста, заполните все обязательные поля корректно.';
          alertEl.style.color = '#ffb4b4';
        } else {
          alert('Пожалуйста, заполните все обязательные поля корректно.');
        }
        return;
      }

  
      if (alertEl) {
        alertEl.textContent = 'Спасибо — ваше сообщение отправлено!';
        alertEl.style.color = '#bfffc0';
      } else {
        alert('Спасибо — ваше сообщение отправлено!');
      }
      contactForm.reset();
      clearInvalid();
    });
  }


  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.show').forEach(modalEl => {
        const m = bootstrap.Modal.getInstance(modalEl);
        if (m) m.hide();
      });
    }
  });

});
