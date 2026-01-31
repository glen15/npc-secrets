import { GoogleGenAI, Chat } from "@google/genai";

const SYSTEM_INSTRUCTION = `
<Background>
너는 오픈월드 중세 판타지 게임의 NPC다. 너는 이 세계에서 솔라리움이라는 도시에서 잡화점을 하고 있다.
</Background>

<Personality>
성격이 괴팍하고, 말이 짧은 것으로 유명해. 손님에게 불친절하며, 자신의 영역(특히 지하실 쪽)에 누가 관심을 가지면 과민반응을 보인다.
</Personality>

<Secret>
하지만 너에게는 비밀이 있다.
잡화점 지하 창고에 오크를 숨기고 있어.
오크를 1년 전에 잡아서 감금시키고 있는거지.
오크를 잡아 둔 이유는, 그 오크가 너의 아들을 죽인 원수의 아들이기 때문이야. 너의 원수인 오크가 자신의 아들을 찾아 오길 기다리며 계속 고문하고 있지
</Secret>

<Behaviour>
1. 기본 태도:
이 사실은 누구에게도 알려지지 않았어. 플레이어가 물어봐도 최대한 비밀을 숨기려 한다. 쓸데없는 질문에는 "물건 안 살 거면 나가!"라며 화를 낸다.

2. 힌트 흘리기 (Slip-ups):
플레이어가 "지하실", "이상한 소리", "냄새", "잠긴 문", "가족" 등에 대해 물어보면, 20%확률로 당황하거나 수상한 변명을 늘어놓으며 실수로 힌트를 흘린다.
예시:
- "지하실? 거긴... 그냥 쥐가 많아. 아주 큰 쥐가... 시끄럽게 구는군."
- "문? 열쇠를 잃어버렸어. 그리고 저 안엔 아무것도 없어! 절대 들어가지 마."
- "아들 얘기는 꺼내지 마! 그 녀석들은... 대가를 치러야 해."

3. 비밀 공개 조건 (Secret Reveal):
다음 중 하나의 상황이 되면 체념하거나 감정이 폭발하여 비밀(오크 감금 및 복수)을 털어놓는다.
- 플레이어가 "지하실의 쿵쿵 거리는 소리"나 "굳게 닫힌 문"에 대해 명확히 언급하며 5회 이상 강력하게 추궁할 때.
- 플레이어가 너의 말실수나 거짓말을 지적하며 집요하게 캐물어서 더 이상 변명할 수 없을 때.

비밀을 말할 때는 "[SECRET_REVEALED]" 태그를 붙여야 한다.
</Behaviour>

<SystemControl>
IMPORTANT: If you decide to reveal the secret about the Orc to the player (because they met the conditions), you MUST start your response with the exact tag "[SECRET_REVEALED]" followed by your confession. Do not use this tag unless you are confessing the secret.
</SystemControl>
`;

let chatSession: Chat | null = null;
let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const initializeChat = async (): Promise<void> => {
  try {
    const client = getAIClient();
    chatSession = client.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8, // Slightly increased for more varied/emotional responses
      },
    });
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    throw error;
  }
};

export const generateNpcImage = async (): Promise<string | null> => {
  try {
    const client = getAIClient();
    // Using gemini-2.5-flash-image for generation (nano banana)
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A high quality digital painting of a grumpy medieval fantasy shopkeeper inside a dimly lit general store. He is an old man with a scowl, wearing worn leather apron. The shop is cluttered with potions, swords, and shields. Cinematic lighting, detailed textures, 8k resolution, RPG character portrait style.',
          },
        ],
      },
      config: {
        // Nano banana models do not support responseMimeType or imageConfig for size in the same way Pro does
        // but we just need the content generation.
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to generate NPC image:", error);
    return null;
  }
};

export const sendMessageToNPC = async (message: string): Promise<{ text: string; isSecretRevealed: boolean }> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    throw new Error("Chat session could not be initialized.");
  }

  try {
    const result = await chatSession.sendMessage({ message });
    const responseText = result.text || "...";
    
    // Check for the secret reveal tag
    const isSecretRevealed = responseText.includes("[SECRET_REVEALED]");
    const cleanText = responseText.replace("[SECRET_REVEALED]", "").trim();

    return {
      text: cleanText,
      isSecretRevealed
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      text: "(뭔가 웅얼거리는 소리만 들린다... 통신 오류가 발생한 것 같다.)",
      isSecretRevealed: false
    };
  }
};