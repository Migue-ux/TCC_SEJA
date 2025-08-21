/* Ajuda.js
   - Acordeão FAQ com animação (usando maxHeight)
   - Busca que filtra FAQ
   - Envio de "ticket" com validação mínima e toast de confirmação
*/

document.addEventListener('DOMContentLoaded', () => {
  // --- FAQ: toggle ---
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const body = item.querySelector('.faq-body');

      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // fechar todos
      document.querySelectorAll('.faq-item .faq-body').forEach(b => {
        b.style.maxHeight = null;
        b.hidden = true;
      });
      document.querySelectorAll('.faq-toggle').forEach(t => t.setAttribute('aria-expanded', 'false'));

      // abrir o atual somente se estava fechado
      if (!expanded) {
        body.hidden = false;
        body.style.maxHeight = body.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Ajusta altura inicial se algum tiver hidden=false (acessibilidade)
  window.addEventListener('resize', () => {
    document.querySelectorAll('.faq-item .faq-body').forEach(b => {
      if (!b.hidden) b.style.maxHeight = b.scrollHeight + 'px';
    });
  });

  // --- Busca FAQ ---
  const faqSearch = document.getElementById('faq-search');
  if (faqSearch) {
    faqSearch.addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.q').textContent.toLowerCase();
        const answer = item.querySelector('.faq-body').textContent.toLowerCase();
        const match = question.includes(q) || answer.includes(q);
        item.style.display = match ? '' : 'none';
      });
    });
  }

  // --- Formulário de ticket ---
  const ticketForm = document.getElementById('ticket-form');
  const toast = document.getElementById('toast');
  const abrirBtn = document.getElementById('abrir-ticket-btn');
  const ticketSection = document.getElementById('ticket-form-section');
  const cancelarBtn = document.getElementById('cancelar-ticket');

  // rolar para o form
  if (abrirBtn) abrirBtn.addEventListener('click', () => {
    ticketSection.scrollIntoView({behavior: 'smooth', block: 'center'});
    const nomeInput = document.getElementById('nome');
    if (nomeInput) nomeInput.focus();
  });

  if (cancelarBtn) cancelarBtn.addEventListener('click', () => {
    ticketForm.reset();
  });

  ticketForm.addEventListener('submit', e => {
    e.preventDefault();
    // validação simples
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const categoria = document.getElementById('categoria').value.trim();
    const descricao = document.getElementById('descricao').value.trim();

    if (!nome || !email || !categoria) {
      showToast('Por favor, preencha nome, email e categoria.', true);
      return;
    }

    // Simula envio (substitua por fetch para API real)
    showToast('Chamado enviado com sucesso. Em breve entraremos em contato.');
    ticketForm.reset();
  });

  function showToast(message, isError = false) {
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.background = isError ? 'linear-gradient(90deg,#d9534f,#c9302c)' : 'linear-gradient(90deg,var(--accent),#5b36b0)';
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(()=> toast.style.display = 'none', 400);
    }, 3800);
  }
});
