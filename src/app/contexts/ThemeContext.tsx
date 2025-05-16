'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでの実行を確認
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // サーバーサイドレンダリング時は実行しない
    if (!isClient) return;

    // ローカルストレージから初期テーマを取得
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    // システム設定を確認
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 保存されたテーマがあればそれを使用、なければシステム設定に従う
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    
    // HTML要素にクラスを適用
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, [isClient]);

  const toggleTheme = () => {
    // サーバーサイドレンダリング時は実行しない
    if (!isClient) return;

    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      
      // ローカルストレージに保存
      localStorage.setItem('theme', newTheme);
      
      // HTML要素にクラスを適用
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 