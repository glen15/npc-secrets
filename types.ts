export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface GameState {
  status: 'playing' | 'won';
  turnCount: number;
}

export interface NpcDetails {
  name: string;
  role: string;
  description: string[];
  imageUrl: string;
}