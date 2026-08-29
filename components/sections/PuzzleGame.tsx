"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Image as ImageIcon, X, RefreshCw, Trophy, Gamepad2, ArrowRight } from "lucide-react";

// --- Types ---
type GameState = "idle" | "camera" | "preview" | "playing" | "success";

// --- Helper Functions ---
// Check if current puzzle is solvable
const isSolvable = (tiles: number[], gridSize: number) => {
  let inversions = 0;
  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] !== 0 && tiles[j] !== 0 && tiles[i] > tiles[j]) {
        inversions++;
      }
    }
  }
  // For odd grid size (3x3), if inversions is even, it's solvable
  if (gridSize % 2 !== 0) {
    return inversions % 2 === 0;
  } else {
    // For even grid size, it depends on the blank row from bottom
    const blankIdx = tiles.indexOf(0);
    const blankRowFromBottom = gridSize - Math.floor(blankIdx / gridSize);
    if (blankRowFromBottom % 2 === 0) {
      return inversions % 2 !== 0;
    } else {
      return inversions % 2 === 0;
    }
  }
};

// Generate a random solvable state by simulating random legal moves from a solved state
const generateSolvableTiles = (gridSize: number) => {
  const total = gridSize * gridSize;
  let tiles = Array.from({ length: total }, (_, i) => (i === total - 1 ? 0 : i + 1));
  
  let blankPos = total - 1;
  const numMoves = 100; // random walk
  
  for (let i = 0; i < numMoves; i++) {
    const row = Math.floor(blankPos / gridSize);
    const col = blankPos % gridSize;
    const neighbors = [];
    
    if (row > 0) neighbors.push(blankPos - gridSize);
    if (row < gridSize - 1) neighbors.push(blankPos + gridSize);
    if (col > 0) neighbors.push(blankPos - 1);
    if (col < gridSize - 1) neighbors.push(blankPos + 1);
    
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    
    // Swap
    [tiles[blankPos], tiles[randomNeighbor]] = [tiles[randomNeighbor], tiles[blankPos]];
    blankPos = randomNeighbor;
  }
  return tiles;
};

// --- Puzzle Component ---
function PuzzleBoard({ 
  imageSrc, 
  onSuccess,
  gridSize = 3 
}: { 
  imageSrc: string;
  onSuccess: (moves: number, time: number) => void;
  gridSize?: number;
}) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Initialize
  useEffect(() => {
    setTiles(generateSolvableTiles(gridSize));
    setMoves(0);
    setStartTime(Date.now());
    setIsWon(false);
  }, [gridSize]);

  // Timer
  useEffect(() => {
    if (isWon || !startTime) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isWon]);

  const moveTile = (index: number) => {
    if (isWon) return;
    const blankIndex = tiles.indexOf(0);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const blankRow = Math.floor(blankIndex / gridSize);
    const blankCol = blankIndex % gridSize;

    // Check if adjacent
    if (
      (Math.abs(row - blankRow) === 1 && col === blankCol) ||
      (Math.abs(col - blankCol) === 1 && row === blankRow)
    ) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[blankIndex]] = [newTiles[blankIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(m => m + 1);
      
      // Check win
      const won = newTiles.every((val, i) => val === 0 ? i === newTiles.length - 1 : val === i + 1);
      if (won) {
        setIsWon(true);
        onSuccess(moves + 1, elapsedTime);
      }
    }
  };

  // Touch swipe handling
  const touchStartRef = useRef<{x: number, y: number} | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isWon) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - touchStartRef.current.x;
    const dy = endY - touchStartRef.current.y;
    
    const blankIndex = tiles.indexOf(0);
    const blankRow = Math.floor(blankIndex / gridSize);
    const blankCol = blankIndex % gridSize;
    
    let targetIndex = -1;
    
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
      // Horizontal swipe
      if (dx > 0 && blankCol > 0) {
        // Swipe right, means we want to move the left tile into the blank spot
        targetIndex = blankIndex - 1;
      } else if (dx < 0 && blankCol < gridSize - 1) {
        // Swipe left, means move right tile into blank spot
        targetIndex = blankIndex + 1;
      }
    } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30) {
      // Vertical swipe
      if (dy > 0 && blankRow > 0) {
        // Swipe down, move top tile into blank
        targetIndex = blankIndex - gridSize;
      } else if (dy < 0 && blankRow < gridSize - 1) {
        // Swipe up, move bottom tile into blank
        targetIndex = blankIndex + gridSize;
      }
    }
    
    if (targetIndex !== -1) {
      moveTile(targetIndex);
    }
    touchStartRef.current = null;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none">
      <div className="flex items-center justify-between w-full mb-4 px-2">
        <div className="bg-white/10 px-4 py-1.5 rounded-full font-mono text-white text-sm">
          ⏱ Vaqt: {formatTime(elapsedTime)}
        </div>
        <div className="bg-white/10 px-4 py-1.5 rounded-full font-mono text-white text-sm">
          🔄 Yurishlar: {moves}
        </div>
      </div>
      
      <div 
        className="relative w-full aspect-square bg-white/5 rounded-xl border border-white/10 p-1 touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {tiles.map((tileValue, index) => {
          if (tileValue === 0) return null; // Blank tile
          
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;
          
          const originalRow = Math.floor((tileValue - 1) / gridSize);
          const originalCol = (tileValue - 1) % gridSize;
          
          const sizePercentage = 100 / gridSize;
          
          return (
            <motion.div
              key={tileValue}
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={() => moveTile(index)}
              className="absolute p-0.5 cursor-pointer"
              style={{
                width: `${sizePercentage}%`,
                height: `${sizePercentage}%`,
                top: `${row * sizePercentage}%`,
                left: `${col * sizePercentage}%`,
              }}
            >
              <div 
                className="w-full h-full rounded-lg overflow-hidden border border-white/20 shadow-lg"
                style={{
                  backgroundImage: `url(${imageSrc})`,
                  backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                  backgroundPosition: `${(originalCol / (gridSize - 1)) * 100}% ${(originalRow / (gridSize - 1)) * 100}%`,
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// --- Main Section Component ---
export default function PuzzleGame() {
  const [modalOpen, setModalOpen] = useState(false);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  
  const [finalTime, setFinalTime] = useState(0);
  const [finalMoves, setFinalMoves] = useState(0);
  const [bestScore, setBestScore] = useState<{time: number, moves: number} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("itcenter_puzzle_best");
    if (saved) {
      try { setBestScore(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (gameState === "camera" && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.error("Video play error:", e));
    }
  }, [gameState, stream]);

  const openGame = () => {
    setModalOpen(true);
    setGameState("idle");
    setImageSrc(null);
  };

  const closeGame = () => {
    setModalOpen(false);
    stopCamera();
    setTimeout(() => {
      setGameState("idle");
      setImageSrc(null);
    }, 300);
  };

  // Keyboard close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGame();
    };
    if (modalOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [modalOpen]);

  const startCamera = async () => {
    setCameraError(false);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      setStream(mediaStream);
      setGameState("camera");
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error(err);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Crop to square
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Center crop
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;
    
    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    
    setImageSrc(dataUrl);
    setGameState("preview");
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = Math.min(img.width, img.height);
        // Optimize resolution to prevent lag
        const targetSize = Math.min(size, 800); 
        canvas.width = targetSize;
        canvas.height = targetSize;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;
        
        ctx.drawImage(img, startX, startY, size, size, 0, 0, targetSize, targetSize);
        setImageSrc(canvas.toDataURL("image/jpeg", 0.8));
        setGameState("preview");
        stopCamera();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const startGame = () => {
    setGameState("playing");
  };

  const handleSuccess = (moves: number, time: number) => {
    setFinalMoves(moves);
    setFinalTime(time);
    setGameState("success");
    
    if (!bestScore || time < bestScore.time) {
      const newBest = { time, moves };
      setBestScore(newBest);
      localStorage.setItem("itcenter_puzzle_best", JSON.stringify(newBest));
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-primary/5">
      <div className="absolute inset-0 pattern-dots pattern-white/5 pattern-size-4" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center glass-card p-10 md:p-14 rounded-3xl border border-primary/20 shadow-[0_0_50px_rgba(0,214,84,0.1)]">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
            <Gamepad2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🧩 O'zingizni sinab ko'ring!
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Suratingizni puzzle'ga aylantiring va uni imkon qadar tezroq yig'ing! 
            Bu nafaqat qiziqarli, balki mantiqiy fikrlashni ham rivojlantiradi.
          </p>
          <button 
            onClick={openGame}
            className="px-8 py-4 bg-primary text-black font-bold rounded-xl hover:bg-primary-dark transition-all transform hover:scale-105 flex items-center justify-center gap-2 mx-auto text-lg shadow-[0_0_20px_rgba(0,214,84,0.3)]"
          >
            🎮 Hohlasangiz, sinab ko'ring
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0a0c0b] border border-white/10 w-full max-w-lg rounded-3xl p-6 relative shadow-2xl flex flex-col items-center"
            >
              <button 
                onClick={closeGame}
                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 p-2 rounded-full transition-colors z-50"
              >
                <X className="w-5 h-5" />
              </button>

              {/* IDLE STATE */}
              {gameState === "idle" && (
                <div className="text-center py-8 w-full flex flex-col items-center gap-6">
                  <h3 className="text-2xl font-bold text-white">Rasmni tanlang</h3>
                  <p className="text-gray-400 text-sm max-w-xs">
                    Puzzle yaratish uchun qurilmangiz kamerasidan foydalaning yoki tayyor rasm yuklang.
                  </p>
                  
                  <div className="flex flex-col gap-4 w-full max-w-xs mt-4">
                    {cameraError ? (
                      <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm flex flex-col items-center gap-2 border border-red-500/20">
                        <Camera className="w-6 h-6" />
                        <span>📷 Kamera ishlamadi</span>
                      </div>
                    ) : (
                      <button 
                        onClick={startCamera}
                        className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        Kamerani yoqish
                      </button>
                    )}
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                      <div className="relative flex justify-center text-sm"><span className="px-2 bg-[#0a0c0b] text-gray-500">yoki</span></div>
                    </div>
                    
                    <label className="w-full py-4 glass hover:bg-white/10 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/10">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      🖼 Galereyadan tanlash
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              )}

              {/* CAMERA STATE */}
              {gameState === "camera" && (
                <div className="w-full flex flex-col items-center gap-4">
                  <h3 className="text-xl font-bold text-white mb-2">Suratga olish</h3>
                  <div className="w-full aspect-square bg-black rounded-2xl overflow-hidden relative">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted
                      className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" // Mirror for selfie
                    />
                    {/* Square guide overlay */}
                    <div className="absolute inset-0 border-4 border-primary/50 m-4 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] pointer-events-none" />
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  
                  <div className="flex gap-4 w-full mt-4">
                    <button 
                      onClick={() => { stopCamera(); setGameState("idle"); }}
                      className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                    >
                      Bekor qilish
                    </button>
                    <button 
                      onClick={takePhoto}
                      className="flex-1 py-4 bg-primary text-black font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      📸 Suratga olish
                    </button>
                  </div>
                </div>
              )}

              {/* PREVIEW STATE */}
              {gameState === "preview" && imageSrc && (
                <div className="w-full flex flex-col items-center gap-6">
                  <h3 className="text-xl font-bold text-white">Tayyormisiz?</h3>
                  <div className="w-64 h-64 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                    <img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex flex-col w-full gap-3 mt-4">
                    <button 
                      onClick={startGame}
                      className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-[0_0_20px_rgba(0,214,84,0.2)]"
                    >
                      ✓ Shu suratdan foydalanish
                    </button>
                    <div className="flex gap-3">
                      <button 
                        onClick={startCamera}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors text-sm"
                      >
                        ↻ Qayta olish
                      </button>
                      <label className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors text-sm text-center cursor-pointer">
                        🖼 Boshqa rasm
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* PLAYING STATE */}
              {gameState === "playing" && imageSrc && (
                <div className="w-full">
                  <PuzzleBoard imageSrc={imageSrc} onSuccess={handleSuccess} gridSize={3} />
                  
                  <button 
                    onClick={() => setGameState("idle")}
                    className="mt-8 text-gray-400 hover:text-white text-sm w-full text-center"
                  >
                    Boshqa surat tanlash
                  </button>
                </div>
              )}

              {/* SUCCESS STATE */}
              {gameState === "success" && imageSrc && (
                <div className="w-full flex flex-col items-center gap-6 text-center py-4">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring" }}
                    className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-2"
                  >
                    <Trophy className="w-10 h-10 text-primary" />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Ajoyib! 🎉</h3>
                    <p className="text-gray-300">Suratni muvaffaqiyatli tikladingiz!</p>
                  </div>
                  
                  <div className="flex gap-6 mb-2">
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-400">Vaqt</span>
                      <span className="text-2xl font-mono font-bold text-white">{finalTime}s</span>
                    </div>
                    <div className="w-px bg-white/10"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-400">Yurishlar</span>
                      <span className="text-2xl font-mono font-bold text-white">{finalMoves}</span>
                    </div>
                  </div>
                  
                  <div className="w-48 h-48 rounded-xl overflow-hidden border-2 border-primary/50 shadow-[0_0_30px_rgba(0,214,84,0.3)] mb-4">
                    <img src={imageSrc} alt="Result" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex w-full gap-3">
                    <button 
                      onClick={() => setGameState("idle")}
                      className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                    >
                      📸 Yangi surat
                    </button>
                    <button 
                      onClick={startGame}
                      className="flex-1 py-4 bg-primary text-black font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Qayta o'ynash
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
