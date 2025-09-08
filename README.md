# 🧟‍♂️ Zombie Survival Conversacional

Este proyecto es un **juego conversacional de supervivencia zombie** en estilo **pixel art**.  
El usuario escribe acciones y la IA responde con una narrativa y una imagen generada en tiempo real.  

---

## 1. `Home` (componente principal)
- Página principal y layout del juego.  
- Consume el hook `useZombieGame()` para manejar estado y llamadas a la API.  
- Renderiza:
  - `<Conversation>` → contenedor del chat.  
  - `<ConversationContent>` → lista de mensajes.  
  - `<GameMessage>` → cada mensaje (texto + imagen).  
  - `<GameLoader>` → loader mientras la IA responde.  
  - `<GameInput>` → textarea + botón de enviar.  

---

## 2. `GameInput`
- Componente para escribir y enviar acciones.  
- Props:
  - `input`: texto del jugador.  
  - `onInputChange`: actualiza el estado del input.  
  - `onSubmit`: envía el formulario.  
  - `isLoading`: desactiva el botón si está cargando.  
- Usa `UI_MESSAGES.PLACEHOLDER.INPUT` como placeholder.  

---

## 3. `GameLoader`
- Muestra un mensaje de “cargando historia…” mientras la IA responde.  
- Renderiza:
  - `Loader` (spinner).  
  - Texto desde `UI_MESSAGES.LOADING.STORY`.  

---

## 4. `GameMessage`
- Renderiza cada mensaje del chat.  
- Propiedades:
  - `id`, `role` (`user` | `assistant`), `content`.  
  - `image?`: imagen generada por IA.  
  - `imageLoading?`: estado de carga de imagen.  
- Flujo:
  - Si es **assistant** → muestra narrativa y la imagen (cuando carga).  
  - Si `imageLoading = true` → aparece overlay con `Loader`.  
  - Cuando la imagen llega → se renderiza en `<Image>` a partir de base64.  

---

## 5. Componentes de conversación
- **Conversation** → wrapper general del chat.  
- **ConversationContent** → contenedor centrado (`max-w-xl mx-auto`).  
- **ConversationScrollButton** → botón para saltar al último mensaje.  

---

## 6. Endpoint `/api/generate-story`
- Recibe:
  ```json
  {
    "userMessage": "...",
    "conversationHistory": [...],
    "isStart": true|false
  }

- Modelo: google("gemini-2.5-flash-lite").


## 7. Endpoint /api/generate-image
- Recibe:
  ```json
  {
    "imagePrompt": "..."
  }

- Modelo: google("gemini-2.5-flash-image-preview").