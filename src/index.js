import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useInputValue } from "./state/useInput";
import { useAppReducer } from "./state/reducer";

import "./styles.css";

function App() {
  let activeCard = useRef(null);
  let [isAdding, setState] = useState(false);

  console.log("actives", activeCard);

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
          <div className="card-container">
            <div className="main-card">
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
