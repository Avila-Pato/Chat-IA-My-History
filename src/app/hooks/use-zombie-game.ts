import { useState, useEffect } from "react";
import type { GameMessage, ConversationMessage } from "@/lib/types";

export function useZombieGame() {
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        body: JSON.stringify({ isStart: true }),
      });

      if (!response.ok) {
        throw new Error("Error al generar la historia");
      }

      const data = await response.json();
      const messageId = crypto.randomUUID();

      const newMessage: GameMessage = {
        id: messageId,
        role: "assistant",
        content: data.narrative,
        imageLoading: true,
      };

      setMessages([newMessage]);

      generateImage(messageId, data.imagePrompt);
    } catch (error) {
      console.error(" Error al generar la historia ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async (messageId: string, imagePrompt: string) => {
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        body: JSON.stringify({
          imagePrompt: imagePrompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar la imagen");
      }

      const imageData = await response.json();

      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.id === messageId) {
            return {
              ...message,
              image: imageData.image,
              imageLoading: false,
            };
          }
          return message;
        })
      );
    } catch (error) {
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.id === messageId) {
            return {
              ...message,
              imageLoading: false,
            };
          }
          return message;
        })
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: GameMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setIsLoading(true);
    setInput("");
    // Generar la historia
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        body: JSON.stringify({
          userMessage: input,
          conversationHistory: messages,
          isStart: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar la historia");
      }

      const data = await response.json();
      const messageId = crypto.randomUUID();

      const assistantMessage: GameMessage = {
        id: messageId,
        role: "assistant",
        content: data.narrative,
        imageLoading: true,
      };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

      generateImage(messageId, data.imagePrompt);
    } catch (error) {
      console.error("Error al generar la historia", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Función para manejar los cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    startGame,
    handleSubmit,
    handleInputChange,
  };
}
