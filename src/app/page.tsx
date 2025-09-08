"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    fetch("/api/generate-story" , {
      method: "POST",
      body: JSON.stringify({
        userMessage: 'I want to go to the forest',
        conversationHistory: [],
        isStart: true
      })
    }).then(res => res.json())
    .then(data => {
      fetch("/api/generate-image" , {
        method: "POST",
        body: JSON.stringify({
          imagePrompt: data.imagePrompt
        })
      }).then(res => res.json())
      .then(imageData => {
        console.log("Generated Image", imageData)
      })
      .catch(err => {
        console.log("Error al generar la imagen",err)
      })
    })
    .catch(err => {
      console.log("Error al generar la historia",err)
    })
  })

  return (
    <div className="font-sans min-h-screen p-8">
      Zombie apocalipsiss
    </div>
  );
}
