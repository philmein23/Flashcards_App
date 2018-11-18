import { useReducer } from 'react';

const initialState = [];

function flashCardsReducer(state = [], action) {
  if (action.type === 'GET_FLASHCARDS') {
    return state;
  }

  if (action.type === 'ADD_FLASHCARD') {
    return [...state, action.flashCard];
  }

  if (action.type === 'SELECT_FLASHCARD') {
    let selctedFlashCard = action.flashCard;
    let flashCards = state;

    return flashCards.map(card => {
      if (card.id === selctedFlashCard.id) {
        card = { ...card, ...selctedFlashCard };
      } else {
        card.isActive = false;
      }
      return card;
    });
  }

  if (action.type === 'REMOVE_FLASHCARD') {
    let selectedFlashCard = action.flashCard;
    let flashCards = state;

    return flashCards.filter(card => card.id !== selectedFlashCard.id);
  }

  return state;
}

export function useAppReducer() {
  const [state, dispatch] = useReducer(flashCardsReducer, initialState);

  return [state, dispatch];
}
