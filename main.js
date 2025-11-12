
document.addEventListener('DOMContentLoaded', function(){
  const years = document.querySelectorAll('#year, #year2, #year3, #year4, #year5');
  years.forEach(el => { if(el) el.textContent = new Date().getFullYear(); });

  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav') || document.querySelector('.main-nav');
  if(navToggle && mainNav){
    navToggle.addEventListener('click', function(){
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
 
      if(window.getComputedStyle(mainNav).display === 'none') mainNav.style.display = 'block';
      else mainNav.style.display = 'none';
    });
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function(){
      const f = this.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.portfolio-item, .gallery-item').forEach(item=>{
        if(!f || f === 'all') { item.style.display = ''; }
        else { item.style.display = (item.dataset.cat === f) ? '' : 'none'; }
      });
    });
  });


  const lightboxModalEl = document.getElementById('lightboxModal');
  if(lightboxModalEl){
    const lightboxImage = document.getElementById('lightboxImage');
    document.querySelectorAll('.gallery-thumb').forEach(img => {
      img.addEventListener('click', function(e){
        e.preventDefault();
        const src = this.dataset.full || this.src;
        lightboxImage.src = src;
        const modal = new bootstrap.Modal(lightboxModalEl);
        modal.show();
      });
    });
  }


  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const msg = contactForm.querySelector('#msg');
      let valid = true;

      if(!name.value.trim()){ name.classList.add('is-invalid'); valid = false; } else name.classList.remove('is-invalid');

      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if(!email.value.trim() || !emailRegex.test(email.value)){ email.classList.add('is-invalid'); valid = false; } else email.classList.remove('is-invalid');

      if(!msg.value.trim()){ msg.classList.add('is-invalid'); valid = false; } else msg.classList.remove('is-invalid');

      const alertEl = document.getElementById('contactAlert');
      if(!valid){
        if(alertEl) alertEl.textContent = 'Пожалуйста, исправьте ошибки в форме';
        return;
      }


        alertEl.textContent = 'Спасибо, сообщение отправлено! Я отвечу в течение 24 часов';
      }
      contactForm.reset();
    });
  }
});
