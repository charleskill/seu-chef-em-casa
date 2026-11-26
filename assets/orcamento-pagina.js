// Página /o/: o botão Baixar PDF abre a janela de impressão (lá o cliente escolhe Salvar como PDF).
document.querySelector('[data-imprimir]')?.addEventListener('click', () => window.print());
