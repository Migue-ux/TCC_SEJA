/* Diario.js — responsivo: inclui toggle da sidebar (hamburger), overlay, modais e funcionalidades do diário */
(function () {
  const STORAGE_KEY = 'diarioEntries';

  // DOM
  const novoBtn = document.getElementById('novo-btn');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const entryForm = document.getElementById('entry-form');
  const entryIdInput = document.getElementById('entry-id');
  const titleInput = document.getElementById('entry-title');
  const textInput = document.getElementById('entry-text');
  const tagsInput = document.getElementById('entry-tags');
  const privateInput = document.getElementById('entry-private');

  const entriesList = document.getElementById('entries-list');
  const searchInput = document.getElementById('search-input');
  const tagFilter = document.getElementById('tag-filter');
  const orderSelect = document.getElementById('order-select');

  const exportBtn = document.getElementById('export-btn');
  const importInput = document.getElementById('import-input');

  const confirmModal = document.getElementById('confirm-modal');
  const confirmOk = document.getElementById('confirm-ok');
  const confirmCancel = document.getElementById('confirm-cancel');
  const toast = document.getElementById('toast');

  // responsive controls
  const menuBtn = document.getElementById('menuBtn');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  let entries = []; // array de objetos {id, title, text, tags[], date, private, fav}
  let toDeleteId = null;

  // --- inicialização ---
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      entries = raw ? JSON.parse(raw) : [];
    } catch (e) {
      entries = [];
    }
    render();
    buildTagFilter();
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  // --- render ---
  function render() {
    const q = (searchInput.value || '').trim().toLowerCase();
    const tag = tagFilter.value;
    const order = orderSelect.value;

    let list = entries.slice();

    // filtros
    if (order === 'fav') {
      list = list.filter(e => e.fav);
    }
    if (tag) {
      list = list.filter(e => e.tags && e.tags.includes(tag));
    }
    if (q) {
      list = list.filter(e => (e.title + ' ' + e.text + ' ' + (e.tags || []).join(' ')).toLowerCase().includes(q));
    }

    // ordenação
    list.sort((a,b) => {
      if (order === 'oldest') return a.date - b.date;
      if (order === 'fav') return (b.fav - a.fav) || (b.date - a.date);
      return b.date - a.date; // newest
    });

    // limpar
    entriesList.innerHTML = '';

    if (list.length === 0) {
      entriesList.innerHTML = `<div class="card" style="text-align:center;color:var(--muted)">Nenhuma entrada encontrada.</div>`;
      return;
    }

    // gerar cards
    list.forEach(e => {
      const card = document.createElement('article');
      card.className = 'entry-card';

      const meta = document.createElement('div');
      meta.className = 'entry-meta';
      meta.innerHTML = `<div class="entry-title">${escapeHtml(e.title || '(Sem título)')}</div><div class="entry-date">${new Date(e.date).toLocaleString()}</div>`;

      const text = document.createElement('p');
      text.className = 'entry-text';
      text.innerHTML = escapeHtml(truncate(e.text || '', 320));

      const tagsWrap = document.createElement('div');
      tagsWrap.className = 'tags';
      (e.tags || []).forEach(t => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = t;
        tagsWrap.appendChild(span);
      });

      const actions = document.createElement('div');
      actions.className = 'card-actions';

      // privacy icon
      const privBtn = document.createElement('button');
      privBtn.className = 'icon-btn';
      privBtn.title = e.private ? 'Privado' : 'Público';
      privBtn.innerHTML = e.private ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-lock-open"></i>';
      privBtn.addEventListener('click', () => {
        e.private = !e.private;
        save();
        render();
        showToast('Visibilidade atualizada.');
      });

      // fav
      const favBtn = document.createElement('button');
      favBtn.className = 'icon-btn';
      favBtn.title = e.fav ? 'Remover favorito' : 'Marcar favorito';
      favBtn.innerHTML = e.fav ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
      favBtn.addEventListener('click', () => {
        e.fav = !e.fav;
        save();
        render();
      });

      // edit
      const editBtn = document.createElement('button');
      editBtn.className = 'icon-btn';
      editBtn.title = 'Editar';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.addEventListener('click', () => openEdit(e.id));

      // delete
      const delBtn = document.createElement('button');
      delBtn.className = 'icon-btn';
      delBtn.title = 'Excluir';
      delBtn.innerHTML = '<i class="fas fa-trash"></i>';
      delBtn.addEventListener('click', () => {
        toDeleteId = e.id;
        confirmModal.setAttribute('aria-hidden', 'false');
      });

      actions.appendChild(privBtn);
      actions.appendChild(favBtn);
      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      card.appendChild(meta);
      card.appendChild(actions);
      card.appendChild(text);
      if ((e.tags || []).length) card.appendChild(tagsWrap);

      entriesList.appendChild(card);
    });
  }

  // --- CRUD simples ---
  function openNew() {
    entryIdInput.value = '';
    titleInput.value = '';
    textInput.value = '';
    tagsInput.value = '';
    privateInput.checked = true;
    openModal('Nova entrada');
  }

  function openEdit(id) {
    const e = entries.find(x => x.id === id);
    if (!e) return showToast('Entrada não encontrada.', true);
    entryIdInput.value = e.id;
    titleInput.value = e.title || '';
    textInput.value = e.text || '';
    tagsInput.value = (e.tags || []).join(', ');
    privateInput.checked = !!e.private;
    openModal('Editar entrada');
  }

  function openModal(title) {
    document.getElementById('modal-title').textContent = title;
    modal.setAttribute('aria-hidden', 'false');
    // foco no título depois de abrir
    setTimeout(() => titleInput.focus(), 150);
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
  }

  function saveFromForm(evt) {
    evt.preventDefault();
    const id = entryIdInput.value;
    const title = (titleInput.value || '').trim();
    const text = (textInput.value || '').trim();
    const tags = (tagsInput.value || '').split(',').map(t => t.trim()).filter(Boolean);
    const isPrivate = privateInput.checked;

    if (!title && !text) return showToast('Adicione título ou texto.', true);

    if (id) {
      const e = entries.find(x => x.id === id);
      if (e) {
        e.title = title;
        e.text = text;
        e.tags = tags;
        e.private = isPrivate;
        e.date = Date.now();
        showToast('Entrada atualizada.');
      } else {
        showToast('Entrada não encontrada.', true);
      }
    } else {
      const novo = { id: String(Date.now()) + '-' + Math.floor(Math.random()*1000), title, text, tags, private: isPrivate, fav:false, date: Date.now() };
      entries.push(novo);
      showToast('Entrada criada.');
    }

    save();
    buildTagFilter();
    render();
    closeModal();
  }

  // --- excluir ---
  function confirmOkHandler() {
    if (!toDeleteId) return;
    entries = entries.filter(e => e.id !== toDeleteId);
    save();
    buildTagFilter();
    render();
    showToast('Entrada excluída.');
    toDeleteId = null;
    confirmModal.setAttribute('aria-hidden', 'true');
  }
  function confirmCancelHandler() {
    toDeleteId = null;
    confirmModal.setAttribute('aria-hidden', 'true');
  }

  // --- export / import ---
  function exportEntries() {
    const data = JSON.stringify(entries, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diario-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Exportação iniciada.');
  }

  function importEntries(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) throw new Error('Formato inválido');
        imported.forEach(it => {
          if (!it.id) it.id = String(Date.now()) + '-' + Math.floor(Math.random()*1000);
          entries.push({
            id: it.id,
            title: it.title || '',
            text: it.text || '',
            tags: Array.isArray(it.tags) ? it.tags : (typeof it.tags === 'string' ? it.tags.split(',').map(t=>t.trim()).filter(Boolean) : []),
            private: !!it.private,
            fav: !!it.fav,
            date: it.date ? Number(it.date) : Date.now()
          });
        });
        save();
        buildTagFilter();
        render();
        showToast('Importação concluída.');
      } catch (err) {
        showToast('Arquivo inválido.', true);
      }
    };
    reader.readAsText(file);
  }

  // --- utilitários ---
  function buildTagFilter() {
    const allTags = new Set();
    entries.forEach(e => (e.tags || []).forEach(t => allTags.add(t)));
    const prev = tagFilter.value;
    tagFilter.innerHTML = '<option value="">Filtrar por tag</option>';
    Array.from(allTags).sort().forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      tagFilter.appendChild(opt);
    });
    if ([...tagFilter.options].some(o => o.value === prev)) tagFilter.value = prev;
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
  }

  function truncate(str, max) {
    if (str.length <= max) return str;
    return str.slice(0,max).replace(/\s+\S*$/,'') + '...';
  }

  function showToast(message, isError=false) {
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    toast.style.background = isError ? 'linear-gradient(90deg,#d9534f,#c9302c)' : '';
    setTimeout(()=> {
      toast.style.opacity = '0';
      setTimeout(()=> toast.style.display = 'none', 300);
    }, 3000);
  }

  // --- SIDEBAR (mobile) ---
  function toggleSidebar(open) {
    const body = document.body;
    if (open) {
      body.classList.add('sidebar-open');
      menuBtn.setAttribute('aria-expanded', 'true');
      sidebarOverlay.hidden = false;
      sidebarOverlay.classList.add('show');
    } else {
      body.classList.remove('sidebar-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      sidebarOverlay.classList.remove('show');
      // hide after animation
      setTimeout(()=> sidebarOverlay.hidden = true, 220);
    }
  }

  // --- eventos ---
  novoBtn.addEventListener('click', openNew);
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (ev) => { if (ev.target === modal) closeModal(); });

  entryForm.addEventListener('submit', saveFromForm);

  searchInput.addEventListener('input', render);
  tagFilter.addEventListener('change', render);
  orderSelect.addEventListener('change', render);

  exportBtn.addEventListener('click', exportEntries);
  importInput.addEventListener('change', (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (file) importEntries(file);
    importInput.value = '';
  });

  confirmOk.addEventListener('click', confirmOkHandler);
  confirmCancel.addEventListener('click', confirmCancelHandler);

  // Keyboard: ESC fecha modais / sidebar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal.getAttribute('aria-hidden') === 'false') closeModal();
      if (confirmModal.getAttribute('aria-hidden') === 'false') confirmCancelHandler();
      if (document.body.classList.contains('sidebar-open')) toggleSidebar(false);
    }
  });

  // sidebar toggles
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const open = document.body.classList.contains('sidebar-open');
      toggleSidebar(!open);
    });
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
  }

  // close confirm modal by click outside
  confirmModal.addEventListener('click', (ev) => { if (ev.target === confirmModal) confirmCancelHandler(); });

  // close modal on backdrop click (already handled), and focus management simple
  modal.addEventListener('transitionend', () => {
    // keep simple: focus title input when modal opened
    if (modal.getAttribute('aria-hidden') === 'false') titleInput.focus();
  });

  // inicializa
  load();
})();
