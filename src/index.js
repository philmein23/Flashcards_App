import React, { useRef, useState, useEffect, Fragment } from "react";
import ReactDOM from "react-dom";
import Flashcard from "./components/flashcard";
import SmallFlashcard from "./components/small-flashcard";
import { useInputValue } from "./state/useInput";
import { generateId } from "./utils";
import { useFirebaseStore } from "./firebase";

import "./styles.css";

function App() {
  let mainCard = useRef();
  let cardContainer = useRef();
  let [isAdding, setAddingState] = useState(false);
  let [isEditing, setEditingState] = useState(false);
  let [activeCard, setActiveCard] = useState(null);
  let [sidebarIsActive, toggleSideBar] = useState(true);
  let {
    flashCards,
    getFlashcards,
    addFlashCard,
    updateFlashCard
  } = useFirebaseStore();

  const {
    value: frontValue,
    onChange: onChangeFront,
    setState: setStateFront
  } = useInputValue("");
  const {
    value: backValue,
    onChange: onChangeBack,
    setState: setStateBack
  } = useInputValue("");

  useEffect(
    () => {
      setupListener();
      getFlashcards();
      console.log("effect");
      setActiveCard(activeCard);

      return () => removeListener();
    },
    [isEditing]
  );

  function setupListener() {
    mainCard.current.addEventListener("click", toggleFlip);
  }

  function removeListener() {
    mainCard.current.removeEventListener("click", toggleFlip);
  }

  function toggleFlip(event) {
    let cardContainerClassList = cardContainer.current.classList;
    console.log(event.target.closest(".main-card"));
    console.log(event.target);

    /** Clicking input field should not trigger class toggling */
    if (event.target !== mainCard.current) return;

    cardContainerClassList.toggle("flipme");
  }

  function addNewCard(event) {
    event.preventDefault();
    clearFields();
    setAddingState(true);
  }

  async function saveFlashCard(event) {
    event.preventDefault();

    if (isEditing) {
      updateFlashCard();
      setEditingState(false);
      return;
    }

    const flashCard = {
      id: generateId(),
      front: frontValue,
      back: backValue
    };

    await addFlashCard(flashCard);
    setActiveCard(flashCard);
    setAddingState(false);
    clearFields();
  }

  function clearFields() {
    console.log("clear");
    setStateFront("");
    setStateBack("");
    console.log("clear2");
  }

  function selectCard(flashCard) {
    flashCard.isActive = true;

    flashCards.forEach(card => {
      if (card.id !== flashCard.id) {
        card.isActive = false;
      }
    });

    setActiveCard(flashCard);
  }

  /** TODO - ADD EDIT CARD FUNCTION */
  function editCard(event, selectedCard) {
    event.preventDefault();

    setStateFront(selectedCard.front);
    setStateBack(selectedCard.back);

    setAddingState(true);
  }
  /** TODO - ADD REMOVE CARD FUNCTION */

  function toggleSideMenu(e) {
    e.preventDefault();
    toggleSideBar(!sidebarIsActive);
  }

  function addFlashcardProps() {
    return {
      frontValue,
      onChangeFront,
      backValue,
      onChangeBack,
      activeCard,
      isEditing,
      isAdding,
      addNewCard,
      toggleSideMenu,
      sidebarIsActive,
      mainCard,
      cardContainer
    };
  }

  return (
    <form onSubmit={e => saveFlashCard(e)}>
      <div className="container">
        <div
          className={`sidebar-nav 
          ${flashCards.length ? "sidebar-nav-displayed" : ""}
          ${!sidebarIsActive ? "sidebar-nav-animated" : ""}`}
        >
          {flashCards.map((card, index) => {
            return (
              <SmallFlashcard
                editCard={editCard}
                selectCard={selectCard}
                card={card}
                index={index}
              />
            );
          })}
        </div>
        <Flashcard {...addFlashcardProps()} />
      </div>
    </form>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
