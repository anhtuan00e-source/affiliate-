import { useState, useEffect } from 'react';
import { CartItem } from '../types';

export function useStore() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('k-outfit-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedOutfits, setSavedOutfits] = useState<string[]>(() => {
    const saved = localStorage.getItem('k-outfit-saved');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('k-outfit-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('k-outfit-saved', JSON.stringify(savedOutfits));
  }, [savedOutfits]);

  const addToCart = (outfitId: string, itemId?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.outfitId === outfitId && i.itemId === itemId);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { outfitId, itemId, quantity: 1 }];
    });
  };

  const removeFromCart = (outfitId: string, itemId?: string) => {
    setCart(prev => prev.filter(i => !(i.outfitId === outfitId && i.itemId === itemId)));
  };

  const toggleSave = (outfitId: string) => {
    setSavedOutfits(prev => 
      prev.includes(outfitId) ? prev.filter(id => id !== outfitId) : [...prev, outfitId]
    );
  };

  return { cart, savedOutfits, addToCart, removeFromCart, toggleSave };
}
