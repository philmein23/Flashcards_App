import { useReducer } from "react";

const initialState = [];

function flashCardsReducer(state = [], action) {
  if (action.type === "GET_FLASHCARDS") {
    console.log("here", state);
    return [...action.flashCards];
  }

  if (action.type === "ADD_FLASHCARD") {
    console.log("state", state, "card", action.flashCard);
    return [...state, action.flashCard];
  }

  if (action.type === "SELECT_FLASHCARD") {
    let selectedFlashCard = action.flashCard;
    let flashCards = state;

    return flashCards.map(card => {
      if (card.id === selectedFlashCard.id) {
        card = { ...card, ...selectedFlashCard };
      } else {
        card.isActive = false;
      }
      return card;
    });
  }

  if (action.type === "EDIT_FLASHCARD") {
    let flashCards = state;
    let editedFlashCard = action.flashCard;
    return flashCards.map(card => {
      if (card.id === editedFlashCard.id) {
        card = { ...card, ...editedFlashCard };
      }
      return card;
    });
  }

  if (action.type === "REMOVE_FLASHCARD") {
    let selectedFlashCard = action.flashCard;
    let flashCards = state;

    return flashCards.filter(card => card.id !== selectedFlashCard.id);
  }

  return state;
}

export function useAppReducer() {
  const [state, dispatch] = useReducer(flashCardsReducer, initialState);

  return { state, dispatch };
}
