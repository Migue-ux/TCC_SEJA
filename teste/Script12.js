const btn = document.getElementById('btnComentar');
const texto = document.getElementById('comentarioTexto');
const areaComentarios = document.querySelector('.comentarios');
const contador = document.getElementById('contador');
const limiteCaracteres = 300;

// Atualiza contador enquanto digita
texto.addEventListener('input', () => {
  if (texto.value.length > limiteCaracteres) {
    texto.value = texto.value.substring(0, limiteCaracteres);
  }
  contador.textContent = `${texto.value.length} / ${limiteCaracteres}`;
});

// Adiciona comentário com estilo de post
btn.addEventListener('click', () => {
  const valor = texto.value.trim();
  if (valor === '') {
    alert('Por favor, escreva um comentário antes de enviar.');
    return;
  }

  // Cria div principal do comentário
  const novoComentario = document.createElement('div');
  novoComentario.classList.add('post'); // reutiliza a classe post para estilo

  // Conteúdo interno
  novoComentario.innerHTML = `
    <img src="/Image/Avatar1.png" alt="Avatar">
    <h2>Artur Maverick</h2>
    <p>${valor}</p>
    <div class="reactions">
      <button class="like-button"><i class="fa-solid fa-thumbs-up"></i> Curtir</button>
        <a href="/comentar.html"><button class="comment-button"><i class="fa-solid fa-comment"></i> Comentar</button></a>
      <button class="share-button"><i class="fa-solid fa-share"></i> Compartilhar</button>
    </div>
  `;

  // Adiciona no topo dos comentários
  areaComentarios.prepend(novoComentario);

  // Reseta textarea e contador
  texto.value = '';
  contador.textContent = `0 / ${limiteCaracteres}`;
});
    setTimeout(() => {
        const resposta = `Resposta automática para: ${texto}`;
        conversas[chatAtualIndex].mensagens.push({ de: 'other', texto: resposta, horario: 'Agora' });
        renderChat(chatAtualIndex);
    }, 1000);
    

  // ------------------- NOME -------------------
  const displayName = document.getElementById('displayName');
  const inputName = document.getElementById('nameInput');
  const btnEditName = document.getElementById('btnEditName');
  const btnSaveName = document.getElementById('btnSaveName');
  const btnCancelName = document.getElementById('btnCancelName');

  const savedName = localStorage.getItem('userName');
  if (savedName) displayName.textContent = savedName;

  function enterEditName() {
    inputName.value = displayName.textContent;
    displayName.style.display = 'none';
    inputName.style.display = 'inline';
    btnEditName.style.display = 'none';
    btnSaveName.style.display = 'inline';
    btnCancelName.style.display = 'inline';
    inputName.focus();
  }

  function exitEditName(save) {
    if (save) {
      const value = inputName.value.trim() || 'Sem nome';
      displayName.textContent = value;
      localStorage.setItem('userName', value);
    }
    displayName.style.display = 'inline';
    inputName.style.display = 'none';
    btnEditName.style.display = 'inline';
    btnSaveName.style.display = 'none';
    btnCancelName.style.display = 'none';
  }

  btnEditName.onclick = enterEditName;
  btnSaveName.onclick = () => exitEditName(true);
  btnCancelName.onclick = () => exitEditName(false);

  inputName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') exitEditName(true);
    if (e.key === 'Escape') exitEditName(false);
  });

 
  // ------------------- DESCRIÇÃO -------------------
  const displayDesc = document.getElementById('displayDesc');
  const inputDesc = document.getElementById('descInput');
  const btnEditDesc = document.getElementById('btnEditDesc');
  const btnSaveDesc = document.getElementById('btnSaveDesc');
  const btnCancelDesc = document.getElementById('btnCancelDesc');

  const savedDesc = localStorage.getItem('userDesc');
  if (savedDesc) displayDesc.innerHTML = savedDesc;

  function enterEditDesc() {
    // tira as <br> para edição no textarea
    inputDesc.value = displayDesc.innerHTML.replace(/<br>/g, '\\n');
    displayDesc.style.display = 'none';
    inputDesc.style.display = 'block';
    btnEditDesc.style.display = 'none';
    btnSaveDesc.style.display = 'inline';
    btnCancelDesc.style.display = 'inline';
    inputDesc.focus();
  }

  function exitEditDesc(save) {
    if (save) {
      const value = inputDesc.value.trim() || 'Sem descrição';
      // converte quebras de linha para <br>
      const formatted = value.replace(/\\n/g, '<br>');
      displayDesc.innerHTML = formatted;
      localStorage.setItem('userDesc', formatted);
    }
    displayDesc.style.display = 'inline';
    inputDesc.style.display = 'none';
    btnEditDesc.style.display = 'inline';
    btnSaveDesc.style.display = 'none';
    btnCancelDesc.style.display = 'none';
  }

  btnEditDesc.onclick = enterEditDesc;
  btnSaveDesc.onclick = () => exitEditDesc(true);
  btnCancelDesc.onclick = () => exitEditDesc(false);

  inputDesc.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') exitEditDesc(false);
    if (e.ctrlKey && e.key === 'Enter') exitEditDesc(true); // Ctrl+Enter para salvar
  });