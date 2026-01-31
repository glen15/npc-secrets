import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NpcCard from './components/NpcCard';
import ChatInterface from './components/ChatInterface';
import { Message, GameState, NpcDetails } from './types';
import { sendMessageToNPC, initializeChat, generateNpcImage } from './services/geminiService';

// Initial Mock Data (Image will be updated dynamically)
const SHOPKEEPER_DETAILS: NpcDetails = {
  name: "까칠한 잡화점 주인",
  role: "솔라리움 잡화점 운영",
  description: [
    "녹슨 검부터 수상한 물약까지 온갖 잡동사니를 팔고 있다.",
    "누군가 들어오고 나갈 때마다 낡은 종소리가 울린다.",
    "계산대 뒤편에 있는 문은 자물쇠로 굳게 잠겨 있다.",
    "바닥 아래에서 간헐적으로 쿵쿵거리는 소리가 들려온다.",
  ],
  imageUrl: "" // Will be populated by AI
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [npcData, setNpcData] = useState<NpcDetails>(SHOPKEEPER_DETAILS);
  const [gameState, setGameState] = useState<GameState>({
    status: 'playing',
    turnCount: 0
  });

  // Initialization: Chat & Image
  useEffect(() => {
    const init = async () => {
      try {
        // 1. Initialize Chat
        await initializeChat();
        const initialGreeting: Message = {
          id: uuidv4(),
          role: 'model',
          text: "(딸랑 하는 종소리와 함께 당신이 먼지 쌓인 잡화점에 들어갔다.)\n...무슨 일이야? 살 거 없으면 당장 나가.",
          timestamp: new Date()
        };
        setMessages([initialGreeting]);

        // 2. Generate NPC Image
        const generatedImage = await generateNpcImage();
        if (generatedImage) {
          setNpcData(prev => ({ ...prev, imageUrl: generatedImage }));
        } else {
          // Fallback if generation fails
          setNpcData(prev => ({ ...prev, imageUrl: "https://picsum.photos/seed/shopkeeper_fallback/800/1000" }));
        }
      } catch (error) {
        console.error("Initialization failed", error);
      } finally {
        setIsImageLoading(false);
      }
    };
    init();
  }, []);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const { text: responseText, isSecretRevealed } = await sendMessageToNPC(text);

      const npcMsg: Message = {
        id: uuidv4(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, npcMsg]);

      setGameState(prev => ({
        ...prev,
        turnCount: prev.turnCount + 1,
        status: isSecretRevealed ? 'won' : prev.status
      }));

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden font-sans bg-dark-900 text-gray-200">
      {/* Mobile Title Bar */}
      <div className="md:hidden h-14 bg-dark-800 border-b border-white/10 flex items-center justify-between px-4 z-50">
          <h1 className="font-fantasy font-bold text-lg text-gold-500 tracking-wider">NPC 비밀 찾기</h1>
          <div className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/10 text-gray-400 font-bold uppercase">RPG APP</div>
      </div>

      {/* Left Panel: NPC Details */}
      <div className="md:w-[450px] lg:w-[500px] flex-shrink-0 h-[45%] md:h-full z-10 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
        <NpcCard details={npcData} isWon={gameState.status === 'won'} isImageLoading={isImageLoading} />
      </div>

      {/* Right Panel: Chat Interface */}
      <div className="flex-1 h-[55%] md:h-full relative z-0">
        <ChatInterface 
          messages={messages} 
          isLoading={isLoading} 
          onSendMessage={handleSendMessage}
          gameStatus={gameState.status}
        />
      </div>
    </div>
  );
};

export default App;