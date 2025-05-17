'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodo } from '../contexts/TodoContext';

export function PachinkoEffect() {
  const { showPachinkoEffect, hidePachinkoEffect } = useTodo();
  const [audioReady, setAudioReady] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 花火のランダム表示用のデータ
  const fireworksData = useMemo(() => {
    if (!isClient) return Array.from({ length: 20 }, (_, i) => ({ id: i, x: 0, y: 0, delay: 0, repeatDelay: 1, hue: 0, shadowHue: 0 }));
    
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * windowSize.width,
      y: Math.random() * windowSize.height,
      delay: Math.random() * 3,
      repeatDelay: Math.random() * 4 + 1,
      hue: Math.floor(Math.random() * 360),
      shadowHue: Math.floor(Math.random() * 360)
    }));
  }, [windowSize, isClient]);
  
  // 落下するコインのデータ
  const coinsData = useMemo(() => {
    if (!isClient) return Array.from({ length: 30 }, (_, i) => ({ id: i, x: 0, duration: 2, delay: 0, xOffset: 0 }));
    
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * windowSize.width,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      xOffset: (Math.random() - 0.5) * 200 + (i / 30) * windowSize.width
    }));
  }, [windowSize, isClient]);
  
  // キラキラエフェクトのデータ
  const sparksData = useMemo(() => {
    if (!isClient) return Array.from({ length: 50 }, (_, i) => ({ id: i, x: 0, y: 0, scale: 0, duration: 2, delay: 0, repeatDelay: 0 }));
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * windowSize.width,
      y: Math.random() * windowSize.height,
      scale: Math.random() + 0.5,
      duration: 2,
      delay: Math.random() * 3,
      repeatDelay: Math.random() * 2
    }));
  }, [windowSize, isClient]);

  // クライアントサイド判定
  useEffect(() => {
    setIsClient(true);
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 音声ファイルの初期化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/pachinko.mp3');
      audioRef.current = audio;
      
      const handleCanPlayThrough = () => {
        setAudioReady(true);
      };
      
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.load();

      return () => {
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      };
    }
  }, []);

  // エフェクト表示時に音声再生
  useEffect(() => {
    if (showPachinkoEffect && audioReady && audioRef.current && isClient) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log('音声再生エラー:', err));
      
      // 5秒後に自動的に非表示
      const timer = setTimeout(() => {
        hidePachinkoEffect();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showPachinkoEffect, audioReady, hidePachinkoEffect, isClient]);

  // サーバーサイドレンダリング時は何も表示しない
  if (!isClient) return null;

  return (
    <AnimatePresence>
      {showPachinkoEffect && windowSize.width > 0 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={hidePachinkoEffect}
        >
          {/* 中央の大きなテキスト */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: [0.5, 1.2, 1],
              opacity: 1,
              rotate: [0, 5, -5, 3, -3, 0]
            }}
            transition={{ duration: 1, times: [0, 0.4, 1] }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]"
              animate={{ 
                scale: [1, 1.1, 1],
                color: [
                  '#facc15', // yellow-400
                  '#ef4444', // red-500
                  '#3b82f6', // blue-500
                  '#22c55e', // green-500
                  '#facc15'  // yellow-400
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: 'loop'
              }}
            >
              全タスク完了！
            </motion.h1>
            <motion.p 
              className="mt-4 text-2xl md:text-3xl text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              おめでとうございます！
            </motion.p>
          </motion.div>

          {/* 花火エフェクト */}
          {fireworksData.map((firework) => (
            <motion.div
              key={`firework-${firework.id}`}
              className="absolute z-0"
              initial={{ 
                x: firework.x, 
                y: firework.y,
                scale: 0
              }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1.5, 
                delay: firework.delay,
                repeat: Infinity,
                repeatDelay: firework.repeatDelay
              }}
            >
              <div 
                className="h-24 w-24 rounded-full" 
                style={{ 
                  background: `radial-gradient(circle, hsl(${firework.hue}, 100%, 60%) 0%, transparent 70%)`,
                  boxShadow: `0 0 20px hsl(${firework.shadowHue}, 100%, 60%)`
                }}
              />
            </motion.div>
          ))}

          {/* 落下するコイン */}
          {coinsData.map((coin) => (
            <motion.div
              key={`coin-${coin.id}`}
              className="absolute z-0 text-4xl"
              initial={{ 
                x: coin.x, 
                y: -50,
                rotate: 0
              }}
              animate={{ 
                y: windowSize.height + 50,
                rotate: 360,
                x: coin.xOffset
              }}
              transition={{ 
                duration: coin.duration,
                delay: coin.delay,
                repeat: Infinity,
                repeatDelay: 0.5
              }}
            >
              🪙
            </motion.div>
          ))}

          {/* キラキラエフェクト */}
          {sparksData.map((spark) => (
            <motion.div
              key={`spark-${spark.id}`}
              className="absolute h-2 w-2 bg-white rounded-full z-0"
              style={{ 
                boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)' 
              }}
              initial={{ 
                x: windowSize.width / 2, 
                y: windowSize.height / 2,
                scale: 0
              }}
              animate={{ 
                x: spark.x,
                y: spark.y,
                scale: [0, spark.scale, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: spark.duration,
                delay: spark.delay,
                repeat: Infinity,
                repeatDelay: spark.repeatDelay
              }}
            />
          ))}
          
          {/* 閉じるボタン */}
          <motion.button
            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-gray-800 text-white rounded-full border-2 border-white hover:bg-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={hidePachinkoEffect}
          >
            閉じる
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 