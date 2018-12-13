import * as firebase from "firebase/app";
import "firebase/firestore";
import { useAppReducer } from "./state/reducer";

let config = {
  apiKey: "AIzaSyByNOLd5G_2ebgebwPDl61r433A7GjaaEs",
  authDomain: "flashcard-app-ce0d2.firebaseapp.com",
  databaseURL: "https://flashcard-app-ce0d2.firebaseio.com",
  projectId: "flashcard-app-ce0d2",
  storageBucket: "flashcard-app-ce0d2.appspot.com",
  messagingSenderId: "966286368199"
};

firebase.initializeApp(config);
let database = firebase.firestore();
database.settings({
  timestampsInSnapshots: true
});

export function useFirebaseStore() {
  let flashCardCollection = database.collection("flashcards");
  let { state: flashCards, dispatch } = useAppReducer();
  console.log("firebase", flashCards);
  async function getFlashcards() {
    let querySnapshot = await flashCardCollection.get();
    let flashCards = querySnapshot.docs.map(doc => doc.data());
    console.log("get", flashCards);
    dispatch({ type: "GET_FLASHCARDS", flashCards });
  }

  async function addFlashCard(flashCard) {
    await flashCardCollection.add(flashCard);
    dispatch({ type: "ADD_FLASHCARD", flashCard });
    console.log("dispatch new card");
  }

  async function updateFlashCard(flashCard) {
    await flashCardCollection.doc(flashCard.id).update(flashCard);
    dispatch({ type: "EDIT_FLASHCARD", flashCard });
  }

  return {
    updateFlashCard,
    getFlashcards,
    addFlashCard,
    flashCards
  };
}
