# Zombie Survival Conversacional

Juego conversacional de supervivencia zombie con pixel art generado por IA.  
El jugador escribe acciones en texto libre y la IA responde con una narrativa y una imagen generada en tiempo real.

---

## Como funciona

```
Usuario escribe accion
       |
       v
useZombieGame (hook)
       |
       |--- POST /api/generate-story  →  narrativa + prompt de imagen
       |
       |--- POST /api/generate-image  →  imagen en base64
              (paralelo, no bloquea la narrativa)
```

La narrativa aparece de inmediato. La imagen llega despues de forma independiente gracias a que `generateImage` se llama sin `await` en el hook — el mensaje se muestra primero con un loader y la imagen se inyecta cuando llega.

---

## Variables de entorno

Crea un archivo `.env.local` en la raiz con:

```env
GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_de_ai_studio
```

Obten la key en [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

> [!WARNING]
> El modelo de generacion de imagen (`gemini-2.5-flash-image`) **no tiene tier gratuito**.
> Necesitas creditos de pago en tu cuenta de AI Studio para que funcione la imagen.
> El texto (`gemini-2.5-flash-lite`) si tiene tier gratuito.

---

## Estructura de carpetas

```
src/
├── app/
│   ├── api/
│   │   ├── generate-story/     API: genera narrativa
│   │   └── generate-image/     API: genera imagen
│   │
│   ├── components/             COMPONENTES DEL JUEGO
│   │   ├── game-input.tsx
│   │   ├── game-loader.tsx
│   │   └── game-message.tsx
│   │
│   ├── hooks/
│   │   └── use-zombie-game.ts  LOGICA DEL JUEGO
│   │
│   ├── page.tsx                Pagina principal
│   └── layout.tsx
│
├── components/                 COMPONENTES REUTILIZABLES
│   ├── ai-elements/            Elementos de UI para IA (chat, mensajes, etc.)
│   └── ui/                     Primitivos de UI (button, input, avatar, etc.)
│
└── lib/
    ├── consts.ts               Constantes (textos UI, config del juego)
    ├── prompts.ts              Prompts del sistema para la IA
    ├── types.ts                Tipos TypeScript del juego
    └── utils.ts                Utilidades generales
```

---

## Por que hay dos carpetas `components`

> [!IMPORTANT]
> `src/app/components/` y `src/components/` tienen propositos distintos.

| | `src/app/components/` | `src/components/` |
|---|---|---|
| Proposito | Componentes especificos del juego zombie | Componentes genericos reutilizables |
| Depende de | Logica del juego, tipos, constantes del juego | Nada especifico del juego |
| Ejemplos | `GameMessage`, `GameInput`, `GameLoader` | `Button`, `Loader`, `Conversation`, `PromptInput` |
| Se podria mover a otro proyecto | No | Si |

La separacion sigue la convencion de Next.js: lo que vive dentro de `app/` es especifico de esa ruta/feature; lo que esta en `src/components/` es una libreria de componentes independiente del dominio.

---

## Detalle de cada modulo

### `src/lib/`

> [!NOTE]
> Es el nucleo de configuracion. Todo lo que cambia el comportamiento del juego esta aqui.

- **`consts.ts`** — textos de la UI (`LOADING`, `ERROR`, `PLACEHOLDER`) y configuracion del juego (`GAME_CONFIG.IMAGE.SEPARATOR` define el token que separa narrativa de prompt de imagen en la respuesta de la IA).
- **`prompts.ts`** — prompts del sistema enviados a Gemini. `INITIAL_STORY` arranca el juego, `CONTINUE_STORY` mantiene el contexto, `GENERATE_IMAGE` convierte el prompt en instruccion para el modelo de imagen.
- **`types.ts`** — interfaces: `GameMessage`, `ConversationMessage`, `GeneratedImage`, y los tipos de request/response de cada endpoint.
- **`utils.ts`** — utilidades de Tailwind (`cn`).

---

### `src/app/hooks/use-zombie-game.ts`

> [!TIP]
> Toda la logica del juego vive aqui. El componente `page.tsx` solo renderiza.

Maneja tres estados: `messages`, `input`, `isLoading`.

Flujo al enviar accion:
1. Agrega mensaje del usuario a la lista.
2. Llama `/api/generate-story` con el historial completo.
3. Agrega la respuesta del asistente con `imageLoading: true`.
4. Llama `generateImage()` en paralelo — cuando resuelve, actualiza el mensaje por `id` con la imagen.

---

### `src/app/api/`

#### `generate-story`
- Modelo: `gemini-2.5-flash-lite` (texto, tier gratuito disponible)
- Si `isStart: true` → usa `INITIAL_STORY` (sin historial).
- Si `isStart: false` → concatena historial + accion del usuario y usa `CONTINUE_STORY`.
- La respuesta tiene formato `narrativa + "IMAGEN: " + prompt_imagen`. El separador `GAME_CONFIG.IMAGE.SEPARATOR` divide los dos fragmentos.

#### `generate-image`
- Modelo: `gemini-2.5-flash-image` (imagen, **requiere creditos de pago**)
- Recibe el `imagePrompt` extraido por `generate-story`.
- Devuelve `{ image: base64 }`.

---

### `src/app/components/`

> [!NOTE]
> Componentes acoplados al juego. No son reutilizables fuera de este contexto.

- **`GameInput`** — textarea + boton de envio. Desactiva el boton mientras `isLoading`.
- **`GameLoader`** — spinner con texto mientras la IA genera la narrativa.
- **`GameMessage`** — renderiza cada turno: si es `assistant` muestra narrativa + imagen (o loader de imagen si `imageLoading: true`). Si es `user` muestra solo el texto de la accion.

---

### `src/components/`

> [!TIP]
> Libreria de componentes independiente del juego. Se podria extraer a otro proyecto.

- **`ai-elements/`** — componentes para construir interfaces de chat con IA: `Conversation`, `Message`, `Loader`, `PromptInput`, `Response`, `Actions`, `CodeBlock`, etc.
- **`ui/`** — primitivos de UI basados en Radix: `Button`, `Input`, `Textarea`, `Avatar`, `Badge`, `ScrollArea`, `Select`, `Tooltip`, etc.
