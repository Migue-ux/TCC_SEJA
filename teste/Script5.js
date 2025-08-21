
const avisoComentario = document.getElementById('aviso-comentario');
const btnSalvar = document.querySelector('.btn.btn-pulse');
const inputNome = document.querySelector('#nome');
const inputEmail = document.querySelector('#email');
const inputSenha = document.querySelector('#senha');
const textareaBio = document.querySelector('#bio');

/**
 * Mostra o aviso na tela por um tempo determinado
 * @param {string} mensagem - mensagem a ser exibida
 * @param {number} duracao - tempo em milissegundos que o aviso ficará visível
 */
const mostrarAviso = (mensagem, duracao = 2000) => {
  avisoComentario.textContent = mensagem;
  avisoComentario.classList.add('show');

  setTimeout(() => {
    avisoComentario.classList.remove('show');
  }, duracao);
};


const validarCampos = () => {
  if (!inputNome.value.trim() || !inputEmail.value.trim() || !inputSenha.value.trim()) {
    mostrarAviso('Por favor, preencha todos os campos obrigatórios!');
    return false;
  }
  return true;
};


const salvarPerfil = () => {
  if (!validarCampos()) return;

  // Aqui você pode adicionar a lógica de salvar os dados em backend ou localStorage
  console.log('Perfil salvo com sucesso:');
  console.log('Nome:', inputNome.value);
  console.log('Email:', inputEmail.value);
  console.log('Senha:', inputSenha.value);
  console.log('Biografia:', textareaBio.value);

  mostrarAviso('Alterações salvas com sucesso!', 2000);
};

btnSalvar.addEventListener('click', salvarPerfil);












