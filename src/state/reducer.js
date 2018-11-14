import { useReducer } from "react";

const initialState = [];

function flashCardsReducer(state = [], action) {
  console.log("action", action);
  if (action.type === "GET_FLASHCARDS") {
    return state;
  }

  if (action.type === "ADD_FLASHCARD") {
    console.log("here");
    return [...state, action.flashCard];
  }

  return state;
}

export function useAppReducer() {
  const [state, dispatch] = useReducer(flashCardsReducer, initialState);

  return [state, dispatch];
}
