
export interface ImageData {
  id: string;
  imageUrl: string;
  answer: string;
  originalImageUrl?: string;
}

export interface GameState {
  currentImage: ImageData | null;
  revealedTiles: boolean[];
  allRevealed: boolean;
  showOriginal: boolean;
  currentRoundImages: ImageData[];
  currentImageIndex: number;
  loading: boolean;
  score: number;
  totalScore: number;
  questionsAnswered: number;
  gameCompleted: boolean;
  categoryDisplayName: string;
}
