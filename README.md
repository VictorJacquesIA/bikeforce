# Bike Force Floripa — Landing Page

Landing page premium para a Bike Force Floripa, oficina especializada e revendedor autorizado Look, ENVE e OGGI em Florianópolis, SC.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Build tool | Vite 5.x |
| Linguagem | HTML5 + CSS3 + JavaScript ES2022 (vanilla, sem frameworks) |
| Módulos JS | ES Modules nativos (`type="module"`) |
| Fontes | Google Fonts — Bebas Neue, Barlow, Barlow Condensed |
| Deploy | Vercel (via `vercel.json`) |

Zero dependências de runtime. Zero frameworks. Zero jQuery.

---

## Estrutura de arquivos

```
├── index.html
├── vite.config.js
├── vercel.json
├── assets/
│   ├── imagens/        # hero.png, p1–p6.png (produtos)
│   └── logo/           # logo.png
├── styles/
│   ├── variables.css   # tokens de design (cores, fontes, espaçamentos)
│   ├── reset.css       # normalização cross-browser
│   ├── utilities.css   # botões (.btn-primary, .btn-secondary), badges
│   ├── animations.css  # @keyframes globais
│   ├── header.css      # nav liquid glass + menu fullscreen
│   ├── hero.css        # hero break-through layout
│   ├── sections.css    # todas as seções de conteúdo
│   ├── footer.css      # footer + mapa
│   └── responsive.css  # breakpoints 1024px / 860px / 520px
└── js/
    ├── main.js         # entrypoint — inicializa todos os módulos
    ├── animations.js   # todas as animações e interações
    ├── cursor.js       # cursor customizado
    └── utils.js        # lerp, easeOutQuad, isTouchDevice
```

---

## Design System

### Tokens (`variables.css`)
- `--yellow: #FFD100` — cor de destaque principal
- `--black: #080808` — fundo escuro
- `--text: #EDE8DF` — texto principal
- `--muted` — texto secundário
- `--card` — background de cards
- `--sep` — bordas/separadores
- `--font-display: 'Bebas Neue'` — títulos grandes
- `--font-cond: 'Barlow Condensed 700'` — labels, badges
- `--font-body: 'Barlow 300/400'` — corpo de texto

### Botões — Liquid Glass
`.btn-primary` e `.btn-secondary` usam `backdrop-filter: blur() saturate() brightness()` com gradiente semitransparente, `border-radius: 999px` e `box-shadow` em camadas (inset highlight + outer glow). Efeito de vidro fosco que reage ao fundo.

---

## Animações

### 1. Hero entrance (JS + CSS transitions)
Ao carregar a página (`window load`), cada elemento do hero recebe a classe `.visible` com delay escalonado:

| Elemento | Delay |
|----------|-------|
| `hero-bg-headline` (PERFORMANCE) | 300ms |
| `hero-bike-center` (bike) | 450ms |
| `hero-title-front` (SEM LIMITES.) | 600ms |
| Botões | 840ms |
| Stats | 1000ms |

Cada elemento tem `opacity: 0 → 1` + `translateY(20px) → 0` via CSS transition.

### 2. Hero — Efeito Break-Through (Poster)
A linha **PERFORMANCE** fica em `z-index: 1` (atrás da bike), posicionada acima do centro.
A linha **SEM LIMITES.** fica em `z-index: 4` (na frente da bike), posicionada abaixo.
A bike (`z-index: 3`) "rasga" entre as duas linhas — efeito poster/cinema 3D sem nenhum JavaScript.

### 3. Bike 3D Parallax (`initBikeParallax`)
Em desktop (`@media hover`), a posição do mouse é mapeada para rotações 3D da bike:
- `rotateX` → movimento vertical do mouse
- `rotateY` → movimento horizontal do mouse
- Interpolação suave com `lerp(last, target, 0.06)` a cada frame (`requestAnimationFrame`)
- Float vertical senoidal contínuo: `Math.sin((performance.now() % 7000 / 7000) * Math.PI * 2) * 18px`

### 4. Scroll Reveal (`initScrollReveal`)
`IntersectionObserver` com `threshold: 0.12` observa todos os elementos `.reveal`.
Ao entrar no viewport, adiciona `.visible` e para de observar (`unobserve`). Um-shot, sem reprocessamento.

### 5. CountUp (`initCountUp`)
Ao entrar no viewport, os `.stat-number[data-target]` contam do zero até o valor-alvo com easing `easeOutQuad`. Duração: 1200ms (valores < 500) ou 1500ms (valores ≥ 500). Implementado com `requestAnimationFrame` + `performance.now()`.

### 6. Ticker (`initTicker`)
Faixa amarela de serviços em loop infinito. Implementada 100% em JS via `requestAnimationFrame` para evitar jank (CSS animation de 55s causava stuttering):
- `x -= 0.4px` por frame
- Reset quando `|x| >= scrollWidth / 2` (conteúdo duplicado para seamless loop)
- `scrollWidth` calculado uma vez no `load` e no `resize` — sem reflow por frame
- Pausa no `mouseenter`, retoma no `mouseleave`

### 7. Carrossel de Produtos (`initCarousel`)
6 slides com animações de entrada/saída por CSS `@keyframes`:
- `slideEnterRight/Left`: `translateX(±120px) + translateY(40px) → 0`
- `slideExitLeft/Right`: `0 → translateX(±120px) + translateY(30px)`
- Todos os slides ficam `position: absolute` com o container em `height: 560px` fixo — elimina salto de layout no troca de slide
- Auto-play 5s com `setInterval`
- Navegação: setas (←→), dots clicáveis, swipe touch (`diff > 40px`), segurar para pausar (`mousedown/touchstart`)

### 8. Menu Fullscreen (`initFullscreenMenu`)
- Hamburger com 3 `span.ham-line` → anima para X (rotate 45°/-45° + opacity 0)
- Overlay com `backdrop-filter: blur(24px)` + `opacity: 0 → 1`
- Links com `transition-delay` escalonado (efeito cascata)
- Fecha com: clique no link, tecla `Escape`, novo clique no hambúrguer
- Visível apenas em mobile (≤ 860px) — desktop usa nav links diretos

### 9. Nav Liquid Glass (`#main-nav`)
- `position: fixed`, `top: 1rem`, `left: 50%`, `transform: translateX(-50%)` — pill flutuante
- `backdrop-filter: blur(40px) saturate(180%) brightness(0.88)`
- `background: linear-gradient(135deg, rgba(10,10,10,0.72), rgba(4,4,4,0.58))`
- Ao scroll > 60px: classe `.scrolled` reduz padding (shrink animado via CSS transition)

### 10. Cursor customizado (`cursor.js`)
- `#cursor-dot` (10px, amarelo, `mix-blend-mode: difference`) — segue o mouse sem delay
- `#cursor-ring` (34px, borda amarela) — segue com `lerp(0.12)` para suavidade
- Expande em hover de links/botões
- Desativado em touch devices (`@media (hover: none)`)

---

## SEO & Performance

- Meta tags completas: description, keywords, Open Graph, Twitter Card
- `loading="eager"` na imagem hero, `loading="lazy"` nas demais
- `will-change: transform` no ticker track (GPU compositing)
- `{ passive: true }` em todos os event listeners de scroll/touch
- `IntersectionObserver` com `unobserve` após trigger (sem observadores zumbis)
- Google Fonts com `preconnect` para reduzir latência de fonte
- Vite build: tree-shaking + minificação automática

---

## Comandos

```bash
npm run dev      # servidor local (localhost:5173)
npm run build    # build de produção em /dist
npm run preview  # preview do build
```
