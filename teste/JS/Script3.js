
// 1) Dados iniciais de cada conversa
const conversas = [
  { nome: 'Alice', avatar: 'https://randomuser.me/api/portraits/women/21.jpg', mensagens: [ { de: 'other', texto: 'Oi, tudo bem?', horario: '5min' } ] },
  { nome: 'Bruno', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', mensagens: [ { de: 'other', texto: 'E aí, bora jogar?', horario: '10min' } ] },
  { nome: 'Carla', avatar: 'https://randomuser.me/api/portraits/women/23.jpg', mensagens: [ { de: 'other', texto: 'Legal seu último post!', horario: '20min' } ] }
];

// 2) Seleção de elementos
const lista = document.getElementById('lista-conversas');
const mensagensContainer = document.getElementById('mensagens');
const btnEnviar = document.getElementById('btnEnviar');
const input = document.getElementById('mensagemTexto');
const btnEmoji = document.getElementById('btnEmoji');
const emojiPicker = document.getElementById('emojiPicker');

let chatAtualIndex = null;

// 3) Preencher lista de conversas
function preencherListaConversas() {
  conversas.forEach((c, i) => {
    const item = document.createElement('div');
    item.className = 'conversa';
    item.dataset.index = i;
    const ultima = c.mensagens[c.mensagens.length - 1];
    item.innerHTML =   `<img src="${c.avatar}" alt="${c.nome}" />
      <div class="info">
        <div class="nome">${c.nome}</div>
        <div class="mensagem">${ultima.texto} · <span class="tempo">${ultima.horario}</span></div>
      </div>`;
    item.addEventListener('click', () => renderChat(i));
    lista.appendChild(item);
  });
}

// 4) Renderizar chat específico
function renderChat(index) {
  chatAtualIndex = index;
  const chat = conversas[index];

  // Limpa mensagens
  mensagensContainer.innerHTML = '';

  // Insere mensagens
  chat.mensagens.forEach(m => {
    const div = document.createElement('div');
    div.className = 'mensagem ' + (m.de === 'me' ? 'eu' : 'outro');
    div.textContent = m.texto + (m.de === 'other' ? ` · ${m.horario}` : '');
    mensagensContainer.appendChild(div);
  });

  mensagensContainer.scrollTop = mensagensContainer.scrollHeight;

  document.querySelectorAll('.conversa').forEach(el => el.classList.remove('ativo'));
  document.querySelector(`.conversa[data-index="${index}"]`).classList.add('ativo');

  document.querySelector('.chat-header h2').textContent = chat.nome;
}

// 5) Enviar nova mensagem
btnEnviar.addEventListener('click', () => {
  const texto = input.value.trim();
  if (!texto || chatAtualIndex === null) return;

  conversas[chatAtualIndex].mensagens.push({ de: 'me', texto, horario: 'Agora' });
  renderChat(chatAtualIndex);
  input.value = '';

  // Simular resposta do outro usuário
  setTimeout(() => {  
    let resposta = 'Desculpe, não entendi.';
    // Respostas pré-definidas
    if (texto.toLowerCase().includes('sim, e com você?') || texto.toLowerCase().includes('sim, tudo bem?')   ) {
      resposta = 'Estou bem, obrigado por perguntar!'; 
    } else if (texto.toLowerCase().includes('tudo bem? ')) {
      resposta = 'Tudo ótimo, e você?';
    }
    else if (texto.toLowerCase().includes('oi') || texto.toLowerCase().includes('olá') || texto.toLowerCase().includes('e aí') || texto.toLowerCase().includes('ola')) {
      resposta = 'Oi! quando você está disponível para vim aqui em casa?';
    } else if (texto.toLowerCase().includes('bom dia') || texto.toLowerCase().includes('boa tarde') || texto.toLowerCase().includes('boa noite')) {
      resposta = 'Espero que você esteja tendo um ótimo dia!';
    } else if (texto.toLowerCase().includes('gsotei do seu post') || texto.toLowerCase().includes('gostei do seu comentário')) {
      resposta = 'Obrigado! Fico feliz que tenha gostado.';
    } else if (texto.toLowerCase().includes('') ) {
      resposta = 'TA carente? compra um hmster';
    }

    conversas[chatAtualIndex].mensagens.push({ de: 'other', texto: resposta, horario: 'Agora' });
    renderChat(chatAtualIndex);
  }, 1000);
  input.focus();
  input.selectionStart = input.selectionEnd = input.value.length; // Coloca o cursor no final do input
  document.querySelector('.chat-header h2').textContent = conversas[chatAtualIndex].nome;
  document.querySelector(`.conversa[data-index="${chatAtualIndex}"] .mensagem`).textContent = texto; // Atualiza a última mensagem na lista
  document.querySelector(`.conversa[data-index="${chatAtualIndex}"] .tempo`).textContent = 'Agora'; // Atualiza o horário da última mensagem na lista
  document.querySelector(`.conversa[data-index="${chatAtualIndex}"]`).classList.add('ativo'); // Marca a conversa como ativa
  input.value = ''; // Limpa o campo de input 
});


// 6) Emoji picker toggle
btnEmoji.addEventListener('click', () => {
  emojiPicker.classList.toggle('hidden');
});

// 7) Inserir emoji
emojiPicker.querySelectorAll('.emoji').forEach(span => {
  span.addEventListener('click', () => {
    const emoji = span.textContent;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    input.value = text.slice(0, start) + emoji + text.slice(end);
    input.focus();
    input.selectionStart = input.selectionEnd = start + emoji.length;
  });
});

// 8) Inicialização
preencherListaConversas();
renderChat(0);
