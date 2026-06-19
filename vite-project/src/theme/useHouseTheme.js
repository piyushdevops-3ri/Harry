import { useEffect, useState } from 'react';
import { HOUSES } from './houses';

const STORAGE_KEY = 'hp-house';

try {
  localStorage.removeItem(STORAGE_KEY);
} catch {
  // storage unavailable (private browsing, etc) — nothing to clear
}

function readStoredHouse() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value && HOUSES[value] ? value : null;
  } catch {
    return null;
  }
}

function writeStoredHouse(id) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // storage unavailable (private browsing, etc) — theme just won't persist
  }
}

function applyHouseAttribute(id) {
  document.documentElement.setAttribute('data-house', id ?? 'default');
}

export function useHouseTheme() {
  const [house, setHouseState] = useState(() => readStoredHouse());

  useEffect(() => {
    applyHouseAttribute(house);
  }, [house]);

  const setHouse = (id) => {
    writeStoredHouse(id);
    setHouseState(id);
  };

  return { house, setHouse };
}
