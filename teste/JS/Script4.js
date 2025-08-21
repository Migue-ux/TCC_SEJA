const btnCopiar = document.getElementById('copiar-link');
    const inputLink = document.getElementById('link-comentario');
    const notificacao = document.getElementById('notificacao');

    btnCopiar.addEventListener('click', () => {
      inputLink.select();
      document.execCommand('copy');
      notificacao.style.opacity = '1';
      setTimeout(() => { notificacao.style.opacity = '0'; }, 2000);
    });

    function compartilharWhatsApp() {
      const url = encodeURIComponent(inputLink.value);
      window.open(`https://wa.me/?text=${url}`, '_blank');
    }

    function compartilharTelegram() {
      const url = encodeURIComponent(inputLink.value);
      window.open(`https://t.me/share/url?url=${url}`, '_blank');
    }

    function compartilharEmail() {
  const comentario = document.getElementById('texto-comentario').textContent;
  const link = document.getElementById('link-comentario').value;
  const assunto = encodeURIComponent("Comentário compartilhado");
  const corpo = encodeURIComponent(`Oi! 👋\n\nQuero compartilhar este comentário com você:\n\n"${comentario}"\n\nConfira o comentário aqui: ${link}\n\nAbraços!`);
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${assunto}&body=${corpo}`, '_blank');
}
