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
  let smallCard = useRef();
  let cardContainer = useRef();
  let [isEditing, setEditingState] = useState(false);
  let [activeCard, setActiveCard] = useState(null);
  let [sidebarIsActive, toggleSideBar] = useState(true);
  let { flashCards, getFlashcards, addFlashCard } = useFirebaseStore();

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

  useEffect(() => {
    setupListener();
    getFlashcards().then(() => {
      let smallCards = Array.from(document.querySelectorAll(".small-card"));
      smallCards.forEach((card) => {
        card.addEventListener("mouseover", (e) => {
          if (e.target === card) {
            card.classList.add("active-card");
          }
        });
        card.addEventListener("mouseout", (e) => {
          if (e.target === card) {
            card.classList.remove("active-card");
          }
        });
      });
    });

    setActiveCard(activeCard);

    return () => removeListener();
  }, [isEditing]);

  function setupListener() {
    mainCard.current.addEventListener("click", toggleFlip);
  }

  function removeListener() {
    mainCard.current.removeEventListener("click", toggleFlip);
  }

  function toggleFlip(event) {
    let cardContainerClassList = cardContainer.current.classList;
    /** Clicking input field should not trigger class toggling */
    if (event.target !== mainCard.current) return;

    cardContainerClassList.toggle("flipme");
  }

  function addNewCard(event) {
    event.preventDefault();
    clearFields();
    setEditingState(true);
  }

  async function saveFlashCard(event) {
    event.preventDefault();

    const flashCard = {
      id: generateId(),
      front: frontValue,
      back: backValue
    };

    await addFlashCard(flashCard);
    setActiveCard(flashCard);
    setEditingState(false);
    clearFields();
  }

  function clearFields() {
    setStateFront("");
    setStateBack("");
  }

  function selectCard(flashCard) {
    flashCard.isActive = true;

    flashCards.forEach((card) => {
      if (card.id !== flashCard.id) {
        card.isActive = false;
      }
    });

    setActiveCard(flashCard);
  }

  /** TODO - ADD EDIT CARD FUNCTION */
  function editCard(selectedCard) {
    setStateFront(selectedCard.front);
    setStateBack(selectedCard.back);

    setEditingState(true);
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
      addNewCard,
      toggleSideMenu,
      sidebarIsActive,
      mainCard,
      cardContainer
    };
  }

  return (
    <form onSubmit={(e) => saveFlashCard(e)}>
      <div className="container">
        <div
          className={`sidebar-nav 
          ${flashCards.length ? "sidebar-nav-displayed" : ""}
          ${!sidebarIsActive ? "sidebar-nav-animated" : ""}`}
        >
          {flashCards.map((card, index) => {
            return (
              <SmallFlashcard
                smallCard={smallCard}
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
