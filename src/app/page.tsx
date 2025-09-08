"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useZombieGame } from "./hooks/use-zombie-game";
import { GameLoader } from "./components/game-loader";
import { GameMessage } from "./components/game-message";

export default function Home() {
  const { messages, input, isLoading, startGame, handleInputChange, handleSubmit } = useZombieGame()

  return (
    <div className="font-sans min-h-screen p-8 max-w-xl mx-auto">
      {
        isLoading && (
          <GameLoader />
        )
      }
      {
        messages.map(message => (
          <GameMessage key={message.id} message={message} />
        ))
      }

    </div>
  );
}



// Llmada de la api

// useEffect(() => {
  //   fetch("/api/generate-story" , {
  //     method: "POST",
  //     body: JSON.stringify({
  //       userMessage: 'I want to go to the forest',
  //       conversationHistory: [],
  //       isStart: true
  //     })
  //   }).then(res => res.json())
  //   .then(data => {
  //     fetch("/api/generate-image" , {
  //       method: "POST",
  //       body: JSON.stringify({
  //         imagePrompt: data.imagePrompt
  //       })
  //     }).then(res => res.json())
  //     .then(imageData => {
  //       console.log("Generated Image", imageData)
  //     })
  //     .catch(err => {
  //       console.log("Error al generar la imagen",err)
  //     })
  //   })
  //   .catch(err => {
  //     console.log("Error al generar la historia",err)
  //   })
  // })
