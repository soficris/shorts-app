// Lógica para seguir/deixar de seguir usuários
document.addEventListener('DOMContentLoaded', () => {
    const toggleFollowBtn = document.getElementById('toggleFollowBtn');
    if (toggleFollowBtn) {
        toggleFollowBtn.addEventListener('click', async () => {
            const userIdToFollow = toggleFollowBtn.dataset.userId;
            try {
                const response = await fetch(`/user/${userIdToFollow}/toggle-follow`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest' // Indica que é uma requisição AJAX
                    }
                });
                const data = await response.json();
                if (data.success) {
                    // Atualiza o texto do botão e a classe
                    if (data.status === 'followed') {
                        toggleFollowBtn.textContent = 'Deixar de Seguir';
                        toggleFollowBtn.classList.remove('btn-primary');
                        toggleFollowBtn.classList.add('btn-secondary');
                        // Atualiza o contador de seguidores (opcional, pode ser feito via EJS refresh ou AJAX)
                        const followersCountElement = document.querySelector('.profile-card h5:nth-child(2)');
                        if (followersCountElement) {
                            followersCountElement.textContent = parseInt(followersCountElement.textContent) + 1;
                        }
                    } else {
                        toggleFollowBtn.textContent = 'Seguir';
                        toggleFollowBtn.classList.remove('btn-secondary');
                        toggleFollowBtn.classList.add('btn-primary');
                        // Atualiza o contador de seguidores (opcional)
                        const followersCountElement = document.querySelector('.profile-card h5:nth-child(2)'); if (followersCountElement) {
                            followersCountElement.textContent = parseInt(followersCountElement.textContent) - 1;
                        }
                    }
                    // Exibir mensagem de sucesso (opcional, pode usar um toast ou flash message)
                    console.log(data.message);
                } else {
                    console.error('Erro ao alternar seguimento:', data.message);
                    alert(data.message);
                }
            } catch (error) {
                console.error('Erro na requisição AJAX:', error);
                alert('Ocorreu um erro ao processar sua solicitação.');
            }
        });
    }
});