"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Card {
  id: number;
  imageUrl: string;
  flipped: boolean;
  matched: boolean;
}

interface MemoryMatchGameProps {
  onSuccess: () => void;
  onClose: () => void;
}

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onSuccess, onClose }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if game is completed
  useEffect(() => {
    if (matchedPairs === 3 && cards.length > 0) {
      setGameCompleted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    }
  }, [matchedPairs, cards.length, onSuccess, onClose]);

  // Initialize the game with cards
  const initializeGame = () => {
    const cardImages = [
      "/icons/icons8-book.png",
      "/icons/icons8-ruler.png",
      "/icons/icons8-pencil.png",
    ];

    // Create pairs of cards
    let cardPairs: Card[] = [];
    cardImages.forEach((image, index) => {
      // Create two cards with the same image
      cardPairs.push({
        id: index * 2,
        imageUrl: image,
        flipped: false,
        matched: false,
      });
      cardPairs.push({
        id: index * 2 + 1,
        imageUrl: image,
        flipped: false,
        matched: false,
      });
    });

    // Shuffle the cards
    cardPairs = shuffleCards(cardPairs);
    setCards(cardPairs);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameCompleted(false);
  };

  // Shuffle cards using Fisher-Yates algorithm
  const shuffleCards = (cardArray: Card[]): Card[] => {
    const shuffled = [...cardArray];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Handle card click
  const handleCardClick = (id: number) => {
    // Prevent clicking if already two cards are flipped or the card is already matched/flipped
    if (
      flippedCards.length === 2 ||
      cards.find((card) => card.id === id)?.matched ||
      cards.find((card) => card.id === id)?.flipped
    ) {
      return;
    }

    // Flip the card
    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(updatedCards);

    // Add card to flipped cards
    const updatedFlippedCards = [...flippedCards, id];
    setFlippedCards(updatedFlippedCards);

    // Check for a match if two cards are flipped
    if (updatedFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      
      const firstCardId = updatedFlippedCards[0];
      const secondCardId = updatedFlippedCards[1];
      
      const firstCard = cards.find((card) => card.id === firstCardId);
      const secondCard = cards.find((card) => card.id === secondCardId);

      if (firstCard?.imageUrl === secondCard?.imageUrl) {
        // Cards match
        setTimeout(() => {
          const matchedCards = cards.map((card) =>
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, matched: true }
              : card
          );
          setCards(matchedCards);
          setFlippedCards([]);
          setMatchedPairs((prev) => prev + 1);
        }, 500);
      } else {
        // Cards don't match, flip them back
        setTimeout(() => {
          const resetCards = cards.map((card) =>
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, flipped: false }
              : card
          );
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Reset the game
  const resetGame = () => {
    initializeGame();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Verifikasi Keamanan</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Cocokkan semua pasangan gambar untuk memverifikasi bahwa Anda bukan robot.
          </p>
          <div className="flex justify-between">
            <p className="text-sm">Langkah: {moves}</p>
            <p className="text-sm">Pasangan: {matchedPairs}/3</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 ${
                card.flipped || card.matched
                  ? "bg-white border-2 border-blue-500"
                  : "bg-blue-500"
              } ${card.matched ? "opacity-70" : "opacity-100"}`}
            >
              {(card.flipped || card.matched) && (
                <div className="w-12 h-12 relative">
                  <Image
                    src={card.imageUrl}
                    alt="Card"
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {gameCompleted && (
          <div className="mt-4 text-center">
            <p className="text-green-600 font-medium">Verifikasi berhasil!</p>
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Acak Ulang
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryMatchGame;
