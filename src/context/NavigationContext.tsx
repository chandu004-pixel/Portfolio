'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type NavigationState = {
  activeView: 'main' | 'loading' | 'projects';
  setActiveView: (view: 'main' | 'loading' | 'projects') => void;
};

const NavigationContext = createContext<NavigationState | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<'main' | 'loading' | 'projects'>('main');

  return (
    <NavigationContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
