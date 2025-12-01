# SIGRA - Sistema de Gestão de Rastreadores 🛰️

> Projeto desenvolvido para a disciplina de **Análise e Projeto de Sistemas de Informação (APSI)** do curso de Bacharelado em Sistemas de Informação - IFAL.

## 🎯 Objetivo
O SIGRA tem como objetivo centralizar o controle de rastreadores veiculares, integrando os setores de administração, manutenção e estoque técnico. O sistema garante a rastreabilidade dos equipamentos e o histórico de manutenções.

## 🛠️ Tecnologias Utilizadas
* **Backend:** Node.js + Express
* **Frontend:** EJS + CSS
* **Banco de Dados:** SQLite (Desenvolvimento)
* **ORM:** Sequelize (Modelagem de Dados)
* **Infraestrutura:** Docker

## 🏗️ Arquitetura do Projeto (MVC)
O projeto segue estritamente o padrão **Model-View-Controller** conforme documentado no Modelo RUP:

* 📂 **Models:** Definição das tabelas (`Rastreador`, `Movimentacao`, `Manutencao`, `Cliente`) e seus relacionamentos (1:N).
* 📂 **Views:** Telas renderizadas no servidor (`.ejs`) contendo as interfaces de gestão.
* 📂 **Controllers:** Regras de negócio, validações (Ex: Bloqueio de saída se estiver em manutenção) e controle de fluxo.

## 📋 Funcionalidades Principais (Casos de Uso)

### CSU01 - Gerenciar Rastreadores
* Cadastro completo com detalhes técnicos (IMEI, Fabricante, Chip).
* Dashboard com **KPIs** (Indicadores de Estoque).
* Busca avançada por IMEI ou Modelo.

### CSU02 - Registrar Movimentação (Rastreabilidade)
* Registro de **Entrada**, **Saída** (para Clientes) e **Transferência**.
* **Regra de Negócio (RN04):** O sistema atualiza automaticamente o status do rastreador.
* **Bloqueio de Segurança:** Impede a saída de equipamentos com status "Em Manutenção".

### CSU03 - Registrar Manutenção
* Registro de defeitos e técnicos responsáveis.
* Histórico completo visível na ficha técnica do equipamento.

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