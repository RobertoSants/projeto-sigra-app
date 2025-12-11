# SIGRA - Sistema de Gestão de Rastreadores

> Projeto desenvolvido para a disciplina de **Análise e Projeto de Sistemas de Informação (APSI)** do curso de Bacharelado em Sistemas de Informação - IFAL.

## Acesso Online (Demo)
O sistema está implantado e rodando na nuvem (PaaS Render) via Docker.
**Acesse aqui:** [https://projeto-sigra-app.onrender.com](https://projeto-sigra-app.onrender.com)

---

## Objetivo
O sistema tem como objetivo centralizar o controle interno e logístico do ciclo de vida de rastreadores veiculares, fazendo a integração com os setores de administração, manutenção e estoque técnico. O sistema gerencia desde a aquisição e entrada em estoque até a vinculação com clientes e manutenções, garantindo rastreabilidade total e integridade dos dados.

Suas principais funcionalidades incluem o controle de movimentações (entrada, saída e transferência), a gestão de equipamentos (com detalhes técnicos e de conectividade), o registro de eventos e manutenções, e a emissão de relatórios. Além disso, o sistema oferece suporte à tomada de decisão através de um Dashboard gerencial com KPIs e assegura a segurança das operações mediante controle de acesso por perfis.

---

## Tecnologias Utilizadas
* **Backend:** Node.js + Express
* **Frontend:** EJS (Embedded JavaScript) + CSS
* **Banco de Dados:** SQLite (Desenvolvimento/Containerizado)
* **ORM:** Sequelize (Modelagem de Dados e Relacionamentos)
* **Infraestrutura:** Docker (Containerização) & Render (Cloud Deploy)

## Arquitetura do Projeto (MVC)
O projeto segue estritamente o padrão **Model-View-Controller** conforme documentado no Modelo RUP:

* **Models:** Definição das tabelas (`Usuario`, `Rastreador`, `Movimentacao`, `Manutencao`, `Cliente`) e seus relacionamentos (1:N).
* **Views:** Telas renderizadas no servidor (`.ejs`) com controle de exibição baseado no perfil do usuário.
* **Controllers:** Regras de negócio, validações de segurança e controle de fluxo.

## Conformidade com Requisitos

O sistema implementa os requisitos definidos na Especificação de Requisitos de Software (SRS):

### Requisitos Funcionais (RF)
* **[RF01] CRUD de Rastreadores:** Cadastro técnico (Chip/Fabricante), edição de dados e exclusão segura.
* **[RF02] Registrar Movimentações:** Módulo logístico (Entrada, Saída, Transferência).
* **[RF03] Registrar Manutenções:** Ordem de serviço com seleção de técnicos.
* **[RF04] Relatórios Consolidados:** Dashboard com KPIs e Ficha Técnica (Histórico).
* **[RF05] Gerenciar Clientes:** Cadastro e exclusão de clientes com validação de duplicidade e integridade.

### Regras de Negócio (RN) Implementadas
* **[RN01] Identificação Única:** O campo IMEI possui restrição `unique`.
* **[RN02] Associação a Cliente:** Saídas de estoque exigem vínculo com a entidade `Cliente`.
* **[RN03] Controle Obrigatório:** Data e Responsável são registrados automaticamente ou via seleção.
* **[RN04] Status Automático:** O sistema atualiza o status (`Em Estoque`, `Em Uso`, `Em Manutenção`) após cada operação.
* **[RN05/RN06] Registro Técnico:** Exige descrição do defeito e seleção do técnico responsável.
* **[RN07] Permissões e Segurança:**
    * Apenas **Administradores** podem excluir ou editar registros.
    * **Trava de Segurança (Rastreador):** Impede a exclusão de equipamentos que não estejam com status "Em Estoque".
    * **Trava de Segurança (Cliente):** Impede a exclusão de clientes que possuem histórico de movimentações.

### Requisitos Não Funcionais (RNF)
* **[RNF01/RNF05] Autenticação e Acesso:** Sistema de Login com controle de sessão (Cookies) e Middleware de proteção de rotas.
* **[RNF02] Integridade:** Garantida pelo uso de Banco Relacional e ORM (Foreign Keys).

## Acesso e Usuários Padrão
Ao acessar a Demo Online ou rodar localmente, utilize as credenciais abaixo (criadas automaticamente):

| Perfil (Cargo) | Login (E-mail) | Senha | Permissões Principais |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@sigra.com` | `123` | Acesso total (CRUD completo, Excluir, Editar, Gerir Clientes). |
| **Operador** | `operador@sigra.com` | `123` | Registrar Movimentações. Visualização restrita. |
| **Técnico** | `tecnico@sigra.com` | `123` | Registrar Manutenções. Visualização restrita. |

## Funcionalidades por Caso de Uso

### CSU01 - Gerenciar Rastreadores
* **Cadastro Detalhado:** Inclusão de Fabricante, Modelo, Operadora e ICCID.
* **Dashboard:** Indicadores visuais (KPIs) de totalizadores de estoque.
* **Busca:** Filtro avançado por IMEI ou Modelo.
* **Edição:** Permite corrigir dados cadastrais.

### CSU02 - Registrar Movimentação (Rastreabilidade)
* **Logística:** Entrada, Saída e Transferência.
* **Seleção de Responsável:** Lista dinâmica baseada nos usuários cadastrados.
* **Bloqueio de Segurança:** Impede a movimentação de equipamentos que estejam em manutenção.

### CSU03 - Registrar Manutenção
* **Ordem de Serviço:** Seleção dinâmica de técnicos cadastrados no sistema.
* **Histórico:** Visualização da linha do tempo completa (Movimentações + Manutenções) na ficha do equipamento.

### CSU04 - Gerenciar Clientes
* **Cadastro Unificado:** Interface ágil para cadastro de empresas e pessoas.
* **Integridade de Dados:** Validação de CPF/CNPJ único no banco de dados.
* **Segurança de Exclusão:** Bloqueio automático de exclusão caso o cliente possua histórico de movimentações vinculadas.

## Como Rodar o Projeto (Localmente)

Caso queira executar fora da nuvem:

### Opção 1: Via Docker
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
