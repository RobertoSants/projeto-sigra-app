# SIGRA - Sistema de Gestão de Rastreadores 🛰️

> Projeto desenvolvido para a disciplina de **Análise e Projeto de Sistemas de Informação (APSI)** do curso de Bacharelado em Sistemas de Informação - IFAL.

## 🎯 Objetivo
O SIGRA tem como objetivo centralizar o controle de rastreadores veiculares, integrando os setores de administração, manutenção e estoque técnico. O sistema garante a rastreabilidade dos equipamentos, o histórico de manutenções e a gestão de clientes.

## 🛠️ Tecnologias Utilizadas
* **Backend:** Node.js + Express
* **Frontend:** EJS (Embedded JavaScript) + CSS
* **Banco de Dados:** SQLite (Desenvolvimento)
* **ORM:** Sequelize (Modelagem de Dados)
* **Infraestrutura:** Docker

## 🏗️ Arquitetura do Projeto (MVC)
O projeto segue estritamente o padrão **Model-View-Controller** conforme documentado no Modelo RUP:

* 📂 **Models:** Definição das tabelas (`Usuario`, `Rastreador`, `Movimentacao`, `Manutencao`, `Cliente`) e seus relacionamentos.
* 📂 **Views:** Telas renderizadas no servidor (`.ejs`) com controle de exibição baseado no perfil do usuário.
* 📂 **Controllers:** Regras de negócio, validações de segurança e controle de fluxo.

## 🔐 Acesso e Usuários Padrão
O sistema conta com autenticação e controle de permissões (RBAC). Ao iniciar a aplicação pela primeira vez, os seguintes usuários são criados automaticamente:

| Perfil (Cargo) | Login (E-mail) | Senha | Permissões Principais |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@sigra.com` | `123` | Acesso total (CRUD completo, Excluir registros, Gerir Clientes). |
| **Operador** | `operador@sigra.com` | `123` | Registrar Movimentações. Visualização restrita (sem botão excluir). |
| **Técnico** | `tecnico@sigra.com` | `123` | Registrar Manutenções. Visualização restrita. |

## 📋 Funcionalidades Principais (Casos de Uso)

### CSU01 - Gerenciar Rastreadores
* **Cadastro Completo:** Inclui dados técnicos (Fabricante, Modelo) e dados do Chip (Operadora, ICCID).
* **Dashboard Gerencial:** Exibição de **KPIs** (Total em Estoque, Em Cliente, Em Manutenção).
* **Busca:** Filtro avançado por IMEI ou Modelo.
* **Segurança:** Bloqueio de exclusão para equipamentos que não estejam com status "Em Estoque".

### CSU02 - Registrar Movimentação (Rastreabilidade)
* **Fluxo Logístico:** Registro de Entrada, Saída (vínculo com Cliente real) e Transferência.
* **Regra de Negócio (RN04):** O sistema atualiza automaticamente o status do rastreador.
* **Bloqueio de Segurança:** Impede a saída de equipamentos com status "Em Manutenção".
* **Seleção de Responsável:** Lista dinâmica de usuários do sistema.

### CSU03 - Registrar Manutenção
* **Ordem de Serviço:** Registro de defeitos e seleção dinâmica de técnicos cadastrados.
* **Histórico Detalhado:** Visualização completa da linha do tempo do equipamento (Movimentações + Manutenções).

### Gestão de Clientes
* Cadastro de clientes (Empresas/Pessoas) para vínculo nas movimentações de saída.
* Proteção contra exclusão acidental por usuários não-administradores.

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