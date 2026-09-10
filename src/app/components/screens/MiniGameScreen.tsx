import { useGame } from '../GameContext';
import { PortugueseGame } from '../minigames/PortugueseGame';
import { MathGame } from '../minigames/MathGame';
import { EnglishGame } from '../minigames/EnglishGame';

export function MiniGameScreen() {
  const { state } = useGame();

  if (state.subject === 'portuguese') {
    return <PortugueseGame />;
  }

  if (state.subject === 'math') {
    return <MathGame />;
  }

  if (state.subject === 'english') {
    return <EnglishGame />;
  }

  return null;
}
