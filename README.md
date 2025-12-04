# SIGRA - Sistema de Gestão de Rastreadores 🛰️

> Projeto desenvolvido para a disciplina de **Análise e Projeto de Sistemas de Informação (APSI)** do curso de Bacharelado em Sistemas de Informação - IFAL.

## 🎯 Objetivo
O SIGRA tem como objetivo centralizar o controle de rastreadores veiculares, integrando os setores de administração, manutenção e estoque técnico. O sistema garante a rastreabilidade dos equipamentos, o histórico de manutenções e a gestão de clientes.

## 🛠️ Tecnologias Utilizadas
* **Backend:** Node.js + Express
* **Frontend:** EJS (Embedded JavaScript) + CSS
* **Banco de Dados:** SQLite (Desenvolvimento)
* **ORM:** Sequelize (Modelagem de Dados e Relacionamentos)
* **Infraestrutura:** Docker (Container)

## 🏗️ Arquitetura do Projeto (MVC)
O projeto segue estritamente o padrão **Model-View-Controller** conforme documentado no Modelo RUP:

* 📂 **Models:** Definição das tabelas (`Usuario`, `Rastreador`, `Movimentacao`, `Manutencao`, `Cliente`) e seus relacionamentos (1:N).
* 📂 **Views:** Telas renderizadas no servidor (`.ejs`) com controle de exibição baseado no perfil do usuário.
* 📂 **Controllers:** Regras de negócio, validações de segurança e controle de fluxo.

## ✅ Conformidade com Requisitos (Auditoria)

O sistema implementa rigorosamente os requisitos definidos na Especificação de Requisitos de Software (SRS):

### Requisitos Funcionais (RF)
* **[RF01] CRUD de Rastreadores:** Implementado cadastro (com detalhes de Chip/Fabricante), **edição** de dados e exclusão segura.
* **[RF02] Registrar Movimentações:** Módulo completo de logística (Entrada, Saída, Transferência).
* **[RF03] Registrar Manutenções:** Módulo de ordem de serviço com seleção de técnicos.
* **[RF04] Relatórios Consolidados:** Atendido via **Dashboard com KPIs** e **Ficha Técnica (Histórico)** detalhada do equipamento.

### Regras de Negócio (RN) Implementadas
* **[RN01] Identificação Única:** O campo IMEI possui restrição `unique` no banco de dados.
* **[RN02] Associação a Cliente:** Movimentações de "Saída" exigem vínculo com a entidade `Cliente`.
* **[RN03] Controle Obrigatório:** Data e Responsável são registrados automaticamente ou via seleção obrigatória.
* **[RN04] Status Automático:** O sistema atualiza o status (`Em Estoque`, `Em Uso`, `Em Manutenção`) automaticamente após cada operação.
* **[RN05/RN06] Registro Técnico:** Exige descrição do defeito e seleção do técnico responsável.
* **[RN07] Permissões de Usuário:** * Apenas **Administradores** podem excluir ou editar registros.
    * Botões sensíveis são ocultados nas Views para Operadores e Técnicos.
    * **Trava de Segurança:** O Backend bloqueia a exclusão de equipamentos que não estejam com status "Em Estoque" (proteção de histórico).

### Requisitos Não Funcionais (RNF)
* **[RNF01/RNF05] Autenticação e Acesso:** Sistema de Login com controle de sessão (Cookies) e Middleware de proteção de rotas.
* **[RNF02] Integridade:** Garantida pelo uso de Banco Relacional e ORM (Foreign Keys).

## 🔐 Acesso e Usuários Padrão
Ao iniciar a aplicação pela primeira vez, os seguintes usuários são criados automaticamente para teste:

| Perfil (Cargo) | Login (E-mail) | Senha | Permissões Principais |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@sigra.com` | `123` | Acesso total (CRUD completo, Excluir, Editar, Gerir Clientes). |
| **Operador** | `operador@sigra.com` | `123` | Registrar Movimentações. Visualização restrita. |
| **Técnico** | `tecnico@sigra.com` | `123` | Registrar Manutenções. Visualização restrita. |

## 📋 Funcionalidades por Caso de Uso

### CSU01 - Gerenciar Rastreadores
* **Cadastro Detalhado:** Inclusão de Fabricante, Modelo, Operadora e ICCID.
* **Dashboard:** Indicadores visuais (KPIs) de totalizadores de estoque.
* **Busca:** Filtro avançado por IMEI ou Modelo.
* **Edição:** Permite corrigir dados cadastrais (RF01).

### CSU02 - Registrar Movimentação (Rastreabilidade)
* **Logística:** Entrada, Saída e Transferência.
* **Seleção de Responsável:** Lista dinâmica baseada nos usuários cadastrados.
* **Bloqueio de Segurança:** Impede a movimentação de equipamentos que estejam em manutenção.

### CSU03 - Registrar Manutenção
* **Ordem de Serviço:** Seleção dinâmica de técnicos cadastrados no sistema.
* **Histórico:** Visualização da linha do tempo completa (Movimentações + Manutenções) na ficha do equipamento.

## 🚀 Como Rodar o Projeto

### Opção 1: Via Docker (Recomendado)
Certifique-se de ter o Docker instalado e rode:

```bash
# Constrói a imagem e inicia o container
docker build -t sigra-app .
docker run -p 3000:3000 sigra-app
```
### Opção 2: Via Node.js (Local)
```bash
# Instala as dependências
npm install

# Inicia o servidor
node app.js
```
Acesse em seu navegador: http://localhost:3000