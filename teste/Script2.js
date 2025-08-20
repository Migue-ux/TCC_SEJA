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

// Adiciona comentário
btn.addEventListener('click', () => {
  const valor = texto.value.trim();
  if (valor === '') {
    alert('Por favor, escreva um comentário antes de enviar.');
    return;
  }

  const novoComentario = document.createElement('div');
  novoComentario.classList.add('comentario');
  novoComentario.textContent = valor;
  areaComentarios.prepend(novoComentario);

  texto.value = '';
  contador.textContent = `0 / ${limiteCaracteres}`;
});
