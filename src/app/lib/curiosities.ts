export type Curiosity = {
  animal: string;
  emoji: string;
  fact: string;
};

/** Curiosidades sobre a fauna brasileira, mostradas ao concluir uma partida. */
export const CURIOSITIES: Curiosity[] = [
  { animal: 'Mico-Leão-Dourado', emoji: '🐵', fact: 'O mico-leão-dourado tem a juba brilhante como o Sol e vive só na Mata Atlântica!' },
  { animal: 'Tucano', emoji: '🐦', fact: 'O bico gigante do tucano é bem levinho e ajuda ele a pegar frutas nas árvores.' },
  { animal: 'Boto-Cor-de-Rosa', emoji: '🐬', fact: 'O boto-cor-de-rosa é um golfinho que vive nos rios da Amazônia e fica rosa quando cresce!' },
  { animal: 'Arara-Azul', emoji: '🦜', fact: 'A arara-azul é enorme e adora comer coquinhos de palmeira com o bico forte.' },
  { animal: 'Onça-Pintada', emoji: '🐆', fact: 'A onça-pintada é o maior felino das Américas e nada muito bem nos rios!' },
  { animal: 'Capivara', emoji: '🦫', fact: 'A capivara é o maior roedor do mundo e fica horas dentro da água se refrescando.' },
  { animal: 'Tamanduá', emoji: '🐜', fact: 'O tamanduá-bandeira tem uma língua enorme para comer muitas formigas por dia.' },
  { animal: 'Preguiça', emoji: '🦥', fact: 'A preguiça é tão devagarinha que plantinhas verdes crescem no seu pelo!' },
  { animal: 'Jacaré', emoji: '🐊', fact: 'O jacaré-do-pantanal fica quietinho na água esperando, com só os olhos de fora.' },
  { animal: 'Tartaruga-da-Amazônia', emoji: '🐢', fact: 'As tartarugas da Amazônia botam seus ovinhos nas praias dos rios.' },
];

export function randomCuriosity(): Curiosity {
  return CURIOSITIES[Math.floor(Math.random() * CURIOSITIES.length)];
}
