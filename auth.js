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

// ==========================================
// ROTEAMENTO INTELIGENTE
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Verifica se estamos em uma tela de autenticação
    if (window.location.pathname.includes('login.html') || window.location.pathname.includes('cadastro.html') || window.location.pathname.includes('auth.html')) {
        
        const { data: { session } } = await cliente_supabase.auth.getSession();
        const manterConectado = localStorage.getItem('manterConectado') === 'true';

        if (session) {
            if (manterConectado) {
                // Usuário marcou a caixinha antes, manda pro Dashboard!
                window.location.replace('index.html'); 
            } else {
                // Usuário NÃO marcou a caixinha, mas o Supabase teimoso salvou a sessão.
                // Destruímos a sessão fantasma para ele conseguir ver a tela de login.
                await cliente_supabase.auth.signOut();
            }
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
}

// ==========================================
// MÓDULO DE LOGIN
// ==========================================
const formLogin = document.getElementById('form-login');

if (formLogin) { // Só executa se estivermos na página de login
    
    // 1. Navegação para a página de Cadastro
    const linkCriarConta = document.getElementById('link-criar-conta');
    if (linkCriarConta) {
        linkCriarConta.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cadastro.html'; // Direciona para a tela de registro
        });
    }

    // 2. Lógica de Autenticação com Email e Senha
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Captura os valores do formulário
        const email = document.getElementById('input-email').value.trim();
        const senha = document.getElementById('input-senha').value;
        const btnEntrar = document.getElementById('btn-entrar');

        // 2. Feedback visual (UX)
        btnEntrar.disabled = true;
        btnEntrar.textContent = 'Autenticando...';

        // 3. SALVA A ESCOLHA DO USUÁRIO ANTES DO LOGIN
        const checkboxLembrar = document.getElementById('input-lembrar');
        if (checkboxLembrar && checkboxLembrar.checked) {
            localStorage.setItem('manterConectado', 'true');
        } else {
            localStorage.removeItem('manterConectado');
        }

        // 4. Dispara requisição para o banco
        const { data, error } = await cliente_supabase.auth.signInWithPassword({
            email: email,
            password: senha,
        });

        // 5. Trata a resposta do Supabase
        if (error) {
            mostrarNotificacao('Credenciais inválidas. Verifique seu e-mail e senha.', 'erro');
            console.error("Erro no login:", error);
            btnEntrar.disabled = false;
            btnEntrar.textContent = 'Entrar na conta';
        } else {
            mostrarNotificacao('Login efetuado com sucesso!', 'sucesso');
            
            // Roteamento para a área logada (Dashboard)
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1000);
        }
    });

    // 3. Gatilho do Google Login
    const btnGoogleLogin = document.getElementById('btn-google');
    if (btnGoogleLogin) {
        btnGoogleLogin.addEventListener('click', async () => {
            const { error } = await cliente_supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) {
                mostrarNotificacao('Erro ao conectar com o Google.', 'erro');
            }
        });
    }

    // ==========================================
    // 4. Mostrar/Ocultar Senha (Olhinho)
    // ==========================================
    const btnToggleSenha = document.getElementById('btn-toggle-senha');
    const inputSenha = document.getElementById('input-senha');

    if (btnToggleSenha && inputSenha) {
        btnToggleSenha.addEventListener('click', () => {
            if (inputSenha.type === 'password') {
                inputSenha.type = 'text';
                btnToggleSenha.textContent = '🙈'; // Troca o ícone
            } else {
                inputSenha.type = 'password';
                btnToggleSenha.textContent = '👁️'; // Volta o ícone
            }
        });
    }

    // ==========================================
    // 5. Recuperação de Senha (Supabase)
    // ==========================================
    const linkEsqueceuSenha = document.getElementById('link-esqueceu-senha');
    const inputEmail = document.getElementById('input-email'); // Reaproveitamos o campo de e-mail do login

    if (linkEsqueceuSenha) {
        linkEsqueceuSenha.addEventListener('click', async (e) => {
            e.preventDefault(); // Impede a tela de pular pro topo
            
            const email = inputEmail.value.trim();
            
            // Verifica se o usuário digitou o e-mail antes de clicar
            if (!email) {
                mostrarNotificacao('Por favor, digite seu e-mail no campo acima para recuperar a senha.', 'erro');
                inputEmail.focus();
                return;
            }

            mostrarNotificacao('Enviando solicitação...', 'sucesso');

            // Dispara o e-mail de redefinição pelo Supabase
            const { data, error } = await cliente_supabase.auth.resetPasswordForEmail(email, {
                // Para onde o usuário volta após clicar no link do e-mail
                redirectTo: window.location.origin + '/redefinir-senha.html', 
            });

            if (error) {
                mostrarNotificacao(`Erro: Não foi possível enviar o e-mail. (${error.message})`, 'erro');
                console.error("Erro na recuperação:", error);
            } else {
                mostrarNotificacao('E-mail de recuperação enviado! Verifique sua caixa de entrada.', 'sucesso');
            }
        });
    }
}

// ==========================================
// REDEFINIÇÃO DE SENHA (redefinir-senha.html)
// ==========================================
const formRedefinir = document.getElementById('form-redefinir-senha');

if (formRedefinir) {
    formRedefinir.addEventListener('submit', async (e) => {
        e.preventDefault();

        const novaSenha = document.getElementById('input-nova-senha').value;
        const confirmaSenha = document.getElementById('input-confirma-senha').value;
        const btnSalvar = document.getElementById('btn-salvar-senha');

        // Validação básica
        if (novaSenha !== confirmaSenha) {
            mostrarNotificacao('As senhas não coincidem!', 'erro');
            return;
        }

        if (novaSenha.length < 8) {
            mostrarNotificacao('A nova senha precisa ter no mínimo 8 caracteres.', 'erro');
            return;
        }

        // UX de carregamento
        btnSalvar.disabled = true;
        btnSalvar.textContent = 'Atualizando segurança...';

        // O Supabase usa o updateUser para trocar a senha de quem tem o token ativo
        const { error } = await cliente_supabase.auth.updateUser({
            password: novaSenha
        });

        if (error) {
            mostrarNotificacao(`Erro ao atualizar: ${error.message}`, 'erro');
            btnSalvar.disabled = false;
            btnSalvar.textContent = 'Atualizar Senha';
            console.error(error);
        } else {
            mostrarNotificacao('Senha atualizada com sucesso!', 'sucesso');
            
            // Manda o usuário para o Dashboard já logado e de senha nova!
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1500);
        }
    });
}