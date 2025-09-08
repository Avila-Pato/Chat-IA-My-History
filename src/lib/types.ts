export interface GameMessage {
    id: string;
    role: 'user' | 'assistant';
    content:  string;
    image?: string;
    imageLoading?: string;
}

export interface GeneratedImage {
    base64: string;
    mediaType: string;
    uint8ArrayData?: Uint8Array;
}

export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface GeneratedStoryRequest {
    userMessage: string;
    conversationHistory: ConversationMessage[];
    isStart: boolean;
}

export interface GeneratedImageRequest {
    imagePrompt: string;
}

export interface GeneratedStoryResponse {
    story: string;
    imagePrompt: string;
}