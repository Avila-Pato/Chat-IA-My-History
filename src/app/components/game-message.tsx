import { Message, MessageContent } from "@/components/ai-elements/message";
import { type GameMessage as GameMessageType } from "@/lib/types";
import { Image } from "@/components/ai-elements/image";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";
// import { UI_MESSAGES } from "@/lib/consts";

export function GameMessage({ message }: { message: GameMessageType }) {
  const { role, content, image, imageLoading } = message;
  //   const imageLoading = true; // fuerza la carga de la imagen

  return (
    <Message from={role}>
      <MessageContent>
        {role === "assistant" && (
          <picture className=" w-full max-w-2xl aspect-video overflow-hidden rounded-md relative">
            {imageLoading && !image && (
              <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center rounded-md">
                <span className="text-gray-500">
                  <Loader size={16}/>
                </span>
              </div>
            )}
            {image && (
              <Image
                base64={image.base64Data}
                mediaType={image.mediaType}
                uint8Array={new Uint8Array()}
                alt="zombie apocalypse scene pixel art style"
                className="w-full h-full object-cover object-center"
              />
            )}
          </picture>
        )}

        <Response>{content}</Response>
      </MessageContent>
    </Message>
  );
}
