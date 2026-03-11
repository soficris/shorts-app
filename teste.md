# Plano de testes Shortz-App

## 1 - Identificação 

- **Projeto:** Shortz-App
- **Versão:** 1.0v
- **Grupo:** Amandha Kae, Ana Julia, Sofia Silva 
- **Data de Criação: ** 10 de março de 2026

## 2 - Escopo 
### O que será testado 

### O que não será testado


## 3 - Estratégia  
### Níveis de Teste 
- **Unitários:** funções de validações - senhaForte, validarEmail
- **Integração:** POST /auth/register, POST /auth/login,

### Ferramentas 
- Vitest, Suepertest, c8/coverage, GitHub Actions


## 4 - Riscos Identificados
| Sistema de Referência | Risco                                                        | Categoria  | Prob  | Impacto | Prioridade |
|-----------------------|--------------------------------------------------------------|------------|-------|---------|------------|
| F01 | Sistema aceitar senha sem possuir as regras necessárias | Funcional | Alta | Crítico | Alta |
| T01 | Outros usuários conseguirem editar o perfil de outros usuários | Técnico | Baixa | Crítico | Média |
| F02 | Foto de perfil aceitar arquivos não suportados | Funcional | Média | Médio | Média |
| F03 | Sistema permitir cadastro com email inválido ou formato incorreto | Funcional | Média | Médio | Média |
| F04 | Sistema permitir login com credenciais incorretas | Funcional | Baixa | Crítico | Média |
| T02 | Falha na conexão com o banco de dados durante o login | Técnico | Média | Crítico | Alta |
| S01 | Sistema não limitar múltiplas tentativas de login consecutivas | Segurança | Média | Médio | Média |
| T03 | Aplicativo apresentar erro ao carregar a tela de login | Técnico | Baixa | Médio | Baixa |
| F05 | Dados do usuário não serem carregados corretamente após o login | Funcional | Média | Médio | Média |
| T04 | Instabilidade na conexão com a internet impedir o acesso ao aplicativo | Técnico | Média | Médio | Média |


## 5 - Recursos e Ambientes 
- **Ambiente:** Node.js 20+, MySQL, Vitest e Supertest
- **Dados de teste:** Seeds via fixture
- **CI/CD:** Github Actions executa um npm test a cada push para a branch principal 


## 6 - Cronograma  
| Semana | Atividade | Entrega |
|--------|-----------|---------|
| 4 | Protótipo do Plano | plano-de-teste.md |
| 5 | Casos de teste manuais | tests/manuais/casos-de-teste.md |
| 6 | Plano de Teste finalizado | Entrega 1 |


## 7 - Critérios de Entrada e Saída
**Entrada:** Ambiente configurado + migration rodando sem erros + codigo no repositório com build passando 
**Saída:** Cobertura ≥ 70% + zero falhas em riscos Críticos/Altos + PR aprovado em code review
**Suspensão:** Falha grave no migration que impede execução dos testes + bloqueador no build que impede de rodar o npm teste