import React from "react";
import ReactDOM from "react-dom";
import { useInputValue } from "./state/useInput";
import { useAppReducer } from "./state/reducer";

import "./styles.css";

function App() {
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

  function saveFlashCard(event) {
    event.preventDefault();
    const flashCard = {
      front: frontValue,
      back: backValue
    };

    dispatch({ type: "ADD_FLASHCARD", flashCard });
    clearFields();
  }

  function clearFields() {
    setStateFront("");
    setStateBack("");
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
        <div className="card-container">
          <div className="add-new-button">
            <button className="add-new" type="submit">
              <span className="plus">+</span>
            </button>
          </div>
          {/** New card */}
          <div className="main-card">
            <div className="main-card-front">
              <input type="text" value={frontValue} onChange={onChangeFront} />
            </div>
            <div className="main-card-back">
              <input type="text" value={backValue} onChange={onChangeBack} />
            </div>
          </div>
          {/** TO-DO: Add active card display. If card is active, then new card display should be hidden */}
        </div>
      </div>
    </form>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
