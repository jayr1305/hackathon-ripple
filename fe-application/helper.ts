import { LLM_MODEL_API, LLM_MODEL_NAME } from "./env"

export const getChatResponseFromModel = async (message: string) => {
    const response = await fetch(LLM_MODEL_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: LLM_MODEL_NAME,
          prompt: message,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1000,
          },
        }),
      })

      return await response.json()
}