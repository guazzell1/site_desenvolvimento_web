// Sistema de Notificação Simples (Toast)
function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    // Estilo inline básico para o MVP rodar, o CSS pode melhorar depois
    toast.style.padding = '15px 25px';
    toast.style.marginBottom = '10px';
    toast.style.borderRadius = '5px';
    toast.style.color = '#fff';
    toast.style.backgroundColor = tipo === 'erro' ? '#ef4444' : '#10b981';
    toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    toast.textContent = mensagem;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// Interceptando o Formulário de Cadastro
document.getElementById('form-cadastro').addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede a página de recarregar

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirma-senha').value;
    const btnCadastrar = document.getElementById('btn-cadastrar');

    // Validação de Front-end (Segurança e UX)
    if (senha !== confirmaSenha) {
        mostrarNotificacao('As senhas não coincidem.', 'erro');
        return;
    }

    // Feedback de Loading (UX)
    btnCadastrar.disabled = true;
    btnCadastrar.textContent = 'Creating account...';

    // Chamada Assíncrona para o Supabase
    const { data, error } = await cliente_supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
            data: {
                full_name: nome // Salvando o nome nos metadados do Auth
            }
        }
    });

    if (error) {
        mostrarNotificacao(`Erro: ${error.message}`, 'erro');
        btnCadastrar.disabled = false;
        btnCadastrar.textContent = 'Create account';
    } else {
        mostrarNotificacao('Conta criada com sucesso! Redirecionando...', 'sucesso');
        
        // Redireciona para o Dashboard após 1.5 segundos
        setTimeout(() => {
            window.location.href = 'index.html'; 
        }, 1500);
    }
});

// 4. Botão Google (Opcional para o MVP, mas já deixo o gatilho pronto)
document.getElementById('btn-google').addEventListener('click', async () => {
    const { data, error } = await cliente_supabase.auth.signInWithOAuth({
        provider: 'google',
    });
    // O Supabase cuida do redirecionamento automático
});