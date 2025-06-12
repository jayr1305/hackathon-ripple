import { LLM_MODEL_API, LLM_MODEL_NAME, LLM_AGENT } from "./env"

export const getChatResponseFromModel = async (message: string) => {
    const response = await fetch(LLM_AGENT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: message,
        }),
      })

      const data = await response.json();
      console.log(data);
      return { ...data, response: data.answer, done: true };
}

export const getChatResponseFromModelOLLAMA = async (message: string) => {
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

      const data = await response.json()
      console.log(data);
      return data;
}