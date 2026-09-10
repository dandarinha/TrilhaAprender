import React from 'react';

/**
 * Ícone de bichinho tropical padronizado, usado em TODAS as telas do jogo
 * para dar uniformidade aos avatares (mantém o nome AlienIcon por compatibilidade).
 * Muda apenas a cor, de acordo com a trilha/bicho-guia escolhido.
 */
export function AlienIcon({
  color = '#f6a623',
  size = 40,
  className = '',
}: {
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Bichinho da floresta"
    >
      {/* Orelhas */}
      <circle cx="18" cy="16" r="9" fill={color} />
      <circle cx="46" cy="16" r="9" fill={color} />
      <circle cx="18" cy="16" r="4.5" fill="#ffffff" opacity="0.55" />
      <circle cx="46" cy="16" r="4.5" fill="#ffffff" opacity="0.55" />

      {/* Cabeça */}
      <path
        d="M32 12 C 47 12, 55 23, 55 37 C 55 51, 45 59, 32 59 C 19 59, 9 51, 9 37 C 9 23, 17 12, 32 12 Z"
        fill={color}
      />

      {/* Focinho claro */}
      <ellipse cx="32" cy="44" rx="15" ry="12" fill="#ffffff" opacity="0.9" />

      {/* Olhos */}
      <circle cx="24" cy="32" r="6" fill="white" />
      <circle cx="40" cy="32" r="6" fill="white" />
      <circle cx="25" cy="33" r="3" fill="#1f2937" />
      <circle cx="41" cy="33" r="3" fill="#1f2937" />
      <circle cx="26.4" cy="31.6" r="1.1" fill="white" />
      <circle cx="42.4" cy="31.6" r="1.1" fill="white" />

      {/* Nariz / bico */}
      <path d="M28 41 L36 41 L32 46 Z" fill="#f97316" />

      {/* Sorriso */}
      <path
        d="M26 49 Q 32 54, 38 49"
        stroke="#7c3f18"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Cores oficiais das trilhas/bichos por chave de tema (fauna brasileira). */
export const ALIEN_COLORS: Record<string, string> = {
  red: '#e0402b',    // arara-vermelha
  blue: '#2a7de1',   // arara-azul
  yellow: '#f6a623', // mico-leão-dourado
  green: '#35b35b',  // folhagem
  purple: '#f06fa8', // boto-cor-de-rosa
};
