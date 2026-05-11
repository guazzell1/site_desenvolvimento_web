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

// Roteamento Inteligente (Executado em login.html e cadastro.html)
document.addEventListener('DOMContentLoaded', async () => {
    // Só faz essa checagem se estiver nas telas de auth
    if (window.location.pathname.includes('login.html') || window.location.pathname.includes('cadastro.html')) {
        const { data: { session } } = await cliente_supabase.auth.getSession();
        if (session) {
            window.location.replace('index.html'); // Já tem sessão? Vai pro Dashboard.
        }
    }
});

// ==========================================
// MÓDULO DE CADASTRO
// ==========================================
const formCadastro = document.getElementById('form-cadastro');

if (formCadastro) {
    formCadastro.addEventListener('submit', async (e) => {
        e.preventDefault(); // 1. Impede o recarregamento da página

        // 2. Captura de valores
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const confirmaSenha = document.getElementById('confirma-senha').value;
        const btnCadastrar = document.getElementById('btn-cadastrar');

        // 3. Validação de Front-end
        if (senha !== confirmaSenha) {
            mostrarNotificacao('As senhas não coincidem.', 'erro');
            return;
        }

        if (senha.length < 8) {
            mostrarNotificacao('A senha deve ter pelo menos 8 caracteres.', 'erro');
            return;
        }

        // 4. Feedback de Loading (UX)
        btnCadastrar.disabled = true;
        btnCadastrar.textContent = 'Criando conta...';

        // 5. Chamada ao Supabase
        const { data, error } = await cliente_supabase.auth.signUp({
            email: email,
            password: senha,
            options: {
                data: {
                    full_name: nome
                }
            }
        });

        if (error) {
            mostrarNotificacao(`Erro: ${error.message}`, 'erro');
            btnCadastrar.disabled = false;
            btnCadastrar.textContent = 'Criar conta';
        } else {
            mostrarNotificacao('Conta criada com sucesso! Redirecionando...', 'sucesso');
            
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1500);
        }
    });

    // 6. Botão Google do Cadastro
    const btnGoogle = document.getElementById('btn-google');
    if (btnGoogle) {
        btnGoogle.addEventListener('click', async () => {
            await cliente_supabase.auth.signInWithOAuth({
                provider: 'google',
            });
        });
    }
}

// ==========================================
// MÓDULO DE LOGIN
// ==========================================
const formLogin = document.getElementById('form-login');

if (formLogin) { // Só executa se estivermos na página login.html
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const senha = document.getElementById('login-senha').value;
        const btnEntrar = document.getElementById('btn-entrar');

        // Feedback visual (UX)
        btnEntrar.disabled = true;
        btnEntrar.textContent = 'Autenticando...';

        // Dispara requisição para o banco
        const { data, error } = await cliente_supabase.auth.signInWithPassword({
            email: email,
            password: senha,
        });

        if (error) {
            mostrarNotificacao('Credenciais inválidas. Verifique seu e-mail e senha.', 'erro');
            console.error("Erro no login:", error);
            btnEntrar.disabled = false;
            btnEntrar.textContent = 'Entrar na conta';
        } else {
            mostrarNotificacao('Login efetuado com sucesso!', 'sucesso');
            
            // Roteamento para a área logada
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1000);
        }
    });

    // Gatilho do Google Login
    document.getElementById('btn-google-login').addEventListener('click', async () => {
        const { error } = await cliente_supabase.auth.signInWithOAuth({
            provider: 'google',
        });
    });
}