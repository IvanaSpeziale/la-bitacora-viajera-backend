import axios from "axios";

export class ContentModerationService {
  static async hasOfensiveLanguage(texto: string): Promise<boolean> {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Sos un moderador que detecta si un texto contiene insultos o lenguaje ofensivo.",
            },
            { role: "user", content: texto },
          ],
          temperature: 0.2,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const resultado = response.data.choices[0].message.content.toLowerCase();
      return (
        resultado.includes("sí") ||
        resultado.includes("insulto") ||
        resultado.includes("ofensivo")
      );
    } catch (error) {
      console.error(
        "Error al procesar la solicitud:",
        (axios.isAxiosError(error) ? error.response?.data : null) ||
          (error as Error).message
      );
      return false;
    }
  }
}
