import { useReducer } from 'react';

const initialState = [];

function flashCardsReducer(state = [], action) {
  if (action.type === 'GET_FLASHCARDS') {
    return state;
  }

  if (action.type === 'ADD_FLASHCARD') {
    return [...state, action.flashCard];
  }

  if (action.type === 'UPDATE_FLASHCARD') {
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

  return state;
}

export function useAppReducer() {
  const [state, dispatch] = useReducer(flashCardsReducer, initialState);

  return [state, dispatch];
}
