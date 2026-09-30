<div align="center">

  <img src="images/nobre-logo.png" alt="Nobre+ Logo" width="220" />

  # 🎬 Nobre+ | Plataforma de Streaming Web

  **Uma experiência cinematográfica e imersiva de streaming inspirada nas maiores plataformas do mercado.**

  <p align="center">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/LocalStorage-Database-007ACC?style=for-the-badge&logo=googlecloud&logoColor=white" alt="LocalStorage" />
    <img src="https://img.shields.io/badge/Design-Glassmorphism-gold?style=for-the-badge" alt="Design" />
  </p>

</div>

---

## 📌 Sobre o Projeto

O **Nobre+** é uma aplicação web completa que recria a experiência de navegação das principais plataformas de entretenimento (como Disney+, Netflix e HBO Max). Construído com **HTML5**, **CSS3 moderno** e **JavaScript Vanilla**, o projeto apresenta uma interface elegante com foco em usabilidade, animações fluidas, personalização visual e interatividade.

---

## ✨ Principais Funcionalidades

### 🌟 1. Experiência de Home & Navegação Imersiva
- **Carrosséis Dinâmicos**: Destaques rotativos automáticos com indicadores (*dots*) e controles deslizantes.
- **Preview de Trailers no Hover**: Efeito inteligente com carregamento assíncrono via YouTube no passar do mouse, com transições suaves de fade e scale.
- **Seções Temáticas**: Linhas de filmes categorizadas (Destaques, Mais Assistidos, Shows & Concertos, Sagas).

### 🏷️ 2. Brand Hubs (Portais por Franquia)
Páginas dedicadas e tematizadas para cada estúdio/universo cinematográfico:
- 🛡️ **Marvel Studios** (`marvel.html`): Cronologia estruturada por sagas (*Saga do Infinito* e *Saga do Multiverso*).
- 🏰 **Disney** (`disney.html`): Clássicos e animações renomadas.
- 🚀 **Pixar** (`pixar.html`): Catálogo exclusivo de filmes da Pixar.
- ⚔️ **Star Wars** (`starwars.html`): Filmes, séries e universo galáctico.
- ⚡ **Pokémon** (`pokemon.html`): Coleção completa de filmes da franquia.
- ⭐ **Star** (`star.html`): Produções originais e conteúdo adulto.

### 🔍 3. Sistema de Busca em Tempo Real
- **Pesquisa Instantânea**: Busca cruzada por título, gênero, diretor, elenco e sinopse.
- **Tratamento de Texto**: Normalização com remoção de acentos para resultados precisos.
- **Histórico Inteligente**: Armazena buscas recentes no `localStorage`, permitindo reutilização ou exclusão individual/total.

### 📑 4. Página de Detalhes Completa (`detalhes.html`)
- **Backdrop Cinematográfico**: Hero banner em tela cheia com logotipo oficial do filme.
- **Metadados Ricos**: Classificação indicativa estilizada, resolução (4K HDR), duração, ano de lançamento, diretor e elenco completo.
- **Modal de Trailer**: Player de vídeo incorporado em alta definição com controle de reprodução.
- **Recomendações e Sugestões**: Lista de filmes similares relacionados ao título atual.

### 🎨 5. Theme Engine "Aura Imperial" (`theme.js`)
- **Modos de Visualização**: Suporte a tema **Dark**, **Light** e **Automático**.
- **5 Acentos de Cor Exclusivos**:
  - 👑 **Dourado Imperial** (Padrão)
  - 💎 **Rubi Nobre**
  - 🌊 **Safira Real**
  - 🌿 **Esmeralda**
  - 🔮 **Ametista**
- **Persistência de Tema**: Salva as preferências de personalização no `localStorage`.

### 👤 6. Autenticação, Usuários e Perfis
- **Cadastro e Login** com validação de credenciais e controle de sessão.
- **Galeria de Avatares Temáticos** (`escolha-avatar.html`): Escolha de ícones de personagens icônicos (Marvel, Star Wars, Disney e opções personalizadas).
- **Gestão de Perfil** (`editar-perfil.html`): Alteração de nome de usuário, e-mail e senha.
- **Minha Lista (Watchlist)**: Adicione e remova títulos dos favoritos com sincronização por usuário.

### ⚙️ 7. Central de Configurações (`configuracoes.html`)
- Preferências de reprodução (qualidade de vídeo, uso de dados, autoplay de trailers).
- Controle de downloads e armazenamento simulado.
- Gerenciamento de conta, segurança e aparência.

---

## 🗂️ Estrutura do Projeto

```plaintext
pagina de filmes/
│
├── images/                       # Logotipos, pôsteres, banners e avatares dos filmes
│
├── index.html                    # Página Principal (Home) com carrosséis e categorias
├── login.html                    # Página de Autenticação (Login / Cadastro)
├── detalhes.html                 # Página de Detalhes do Filme selecionado
├── configuracoes.html            # Painel de Configurações Geral
├── configuracoes-tema.html       # Painel de Customização de Cores e Temas
├── configuracoes-conta.html      # Gerenciamento de Conta e Assinatura
├── editar-perfil.html            # Edição dos Dados do Usuário
├── escolha-avatar.html           # Seletor de Avatares Temáticos
│
├── disney.html                   # Hub da Disney
├── marvel.html                   # Hub da Marvel Studios
├── pixar.html                    # Hub da Pixar
├── starwars.html                 # Hub de Star Wars
├── pokemon.html                  # Hub de Pokémon
├── star.html                     # Hub do Star
│
├── movies-data.js                # Base de dados central com catálogo detalhado de filmes
├── database.js                   # Módulo de persistência (Usuários, Sessões, Watchlist, Busca)
├── theme.js                      # Motor de temas e personalização de cores
├── script.js                     # Controladores da Home (Carrosséis, Hover de Trailers, Busca)
├── detalhes.js                   # Controlador da página de detalhes e modal de trailers
└── style.css                     # Folha de estilos completa, responsiva e com Glassmorphism
```

---

## 🛠️ Tecnologias e Recursos Utilizados

- **Linguagens**:
  - **HTML5**: Estrutura semântica e acessível.
  - **CSS3 Moderno**: Variáveis CSS (Custom Properties), Flexbox, CSS Grid, Glassmorphism, transições e animações com `@keyframes`.
  - **JavaScript ES6+**: Manipulação dinâmica do DOM, Promises, URLSearchParams, Event Listeners e Web Storage API.
- **Armazenamento**:
  - `localStorage` para persistência de dados de login, histórico de busca, temas e favoritos.
- **Tipografia e Ícones**:
  - [Google Fonts](https://fonts.google.com/) — *Manrope* & *Montserrat*.
  - [Google Material Symbols](https://fonts.google.com/icons) — Ícones de navegação e controles.
  - [Font Awesome 6](https://fontawesome.com/) — Ícones complementares.
- **Mídia**:
  - Imagens de alta definição e logos originais de produções cinematográficas (TMDB / Wikimedia).
  - Trailers dinâmicos integrados via player embed do YouTube.

---

## 🚀 Como Executar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd "pagina de filmes"
   ```

3. **Abra o projeto no seu navegador:**
   - **Opção 1**: Basta clicar duas vezes no arquivo `login.html` ou `index.html`.
   - **Opção 2 (Recomendada)**: Utilize a extensão **Live Server** no [Visual Studio Code](https://code.visualstudio.com/) clicando em *Go Live*.

---

## 💡 Recursos em Destaque

| Recurso | Descrição |
| :--- | :--- |
| **Trailer Hover Preview** | Pré-visualização com som mudo e delay inteligente de ~600ms ao posicionar o cursor. |
| **Aura Imperial Themes** | Alterne instantaneamente as cores de destaque e contraste de toda a interface. |
| **Watchlist Multi-usuário** | Cada usuário cadastrado possui sua própria lista salva de filmes favoritos. |
| **Design Totalmente Responsivo** | Experiência fluida e adaptada para celulares, tablets e desktops. |

---

## 👤 Autor

Desenvolvido por **Samuel Nobre**  
Entre em contato ou acompanhe meus projetos:

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/)

---

<div align="center">
  <sub>Projeto desenvolvido para fins educacionais e portfólio. Todos os direitos de imagens e marcas pertencem aos seus respectivos criadores.</sub>
</div>
