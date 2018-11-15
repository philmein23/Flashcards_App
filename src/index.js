import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useInputValue } from "./state/useInput";
import { useAppReducer } from "./state/reducer";

import "./styles.css";

function App() {
  let activeCard = useRef(null);
  let mainCard = useRef();
  let cardContainer = useRef();
  let [isAdding, setState] = useState(false);

  console.log("actives", activeCard);

  useEffect(() => {
    console.log("effect");
    resetFlipClass();
    setupListener();

    return () => removeListener();
  });

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
  const [flashCards, dispatch] = useAppReducer();

  function setupListener() {
    mainCard.current.addEventListener("click", toggleFlip);
  }

  function removeListener() {
    cardContainer.current.removeEventListener("click", toggleFlip);
  }

  function resetFlipClass() {
    console.log(cardContainer.current.classList.toggle("flipme"));
    if (cardContainer.current.classList.toggle("flipme")) {
      cardContainer.current.classList.remove("flipme");
    }
  }

  function toggleFlip(event) {
    console.log("listener");
    console.log(event.target);
    // if (event.target !== mainCard) {
    //   return;
    // }
    let value = cardContainer.current.classList.toggle("flipme");
    console.log(value);
  }

  function addNewCard(event) {
    event.preventDefault();
    setState(true);
  }

  function saveFlashCard(event) {
    event.preventDefault();
    const flashCard = {
      front: frontValue,
      back: backValue
    };

    activeCard.current = flashCard;

    dispatch({ type: "ADD_FLASHCARD", flashCard });
    setState(false);
    clearFields();
  }

  function clearFields() {
    setStateFront("");
    setStateBack("");
  }

  function renderActiveCard() {
    return (
      <>
        {activeCard.current ? (
          <>
            <div className="main-card-front">{activeCard.current.front}</div>
            <div className="main-card-back">{activeCard.current.back}</div>
          </>
        ) : (
          <div>{null}</div>
        )}
      </>
    );
  }

  function renderNewCard() {
    return (
      <>
        <div className="main-card-front">
          <input type="text" value={frontValue} onChange={onChangeFront} />
        </div>
        <div className="main-card-back">
          <input type="text" value={backValue} onChange={onChangeBack} />
        </div>
      </>
    );
  }

  return (
    <form onSubmit={e => saveFlashCard(e)}>
      <div className="container">
        <div className="sidebar-nav">
          {flashCards.map(card => {
            return (
              <div className="small-card">
                <div className="front-small">{card.front}</div>
              </div>
            );
          })}
        </div>
        <div className="relative">
          <div className="add-new-button">
            <button className="add-new" onClick={e => addNewCard(e)}>
              <span className="plus">+</span>
            </button>
          </div>
          <div
            ref={cardContainer}
            id="card-container"
            className="card-container"
          >
            <div ref={mainCard} className="main-card">
              {isAdding ? renderNewCard() : renderActiveCard()}
            </div>
          </div>
          <div className="button-container">
            <button className="submit">Save Card</button>
          </div>
        </div>
      </div>
    </form>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
