import {
    PromptInput,
    PromptInputTextarea,
    PromptInputSubmit
} from "@/components/ai-elements/prompt-input"
import { UI_MESSAGES } from "@/lib/consts"
import React from "react"

interface GameInpputProps {
    input: string
    onInputChange:(e: React.ChangeEvent<HTMLTextAreaElement>) => void
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    isLoading: boolean
}

export function GameInput({ input, onInputChange, onSubmit, isLoading }: GameInpputProps) {
    const inputTrimmed = input.trim();
    const inputSubmitIsDisavled = isLoading || inputTrimmed === "";
    return (
        <PromptInput onSubmit={onSubmit} className="relative pr-8">
            <PromptInputTextarea
            placeholder={UI_MESSAGES.PLACEHOLDER.INPUT}
            value={input}
            onChange={onInputChange}
            disabled={isLoading}
            />
            <PromptInputSubmit
                disabled={inputSubmitIsDisavled} 
                className="absolute right-2 bottom-2"
            />
        </PromptInput>
    )
}