import React from "react";
import ReactDOM from "react-dom";
import { useInputValue } from "./state/useInput";
import { useAppReducer } from "./state/reducer";

import "./styles.css";

function App() {
  const { value: frontValue, onChange: onChangeFront } = useInputValue("");
  const { value: backValue, onChange: onChangeBack } = useInputValue("");
  const [flashCards, dispatch] = useAppReducer();

  console.log(flashCards);
  console.log(frontValue, backValue);

  function saveFlashCard(event) {
    event.preventDefault();
    const flashCard = {
      front: frontValue,
      back: backValue
    };

    dispatch({ type: "ADD_FLASHCARD", flashCard });
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
          <div className="main-card-front">
            <input type="text" value={frontValue} onChange={onChangeFront} />
          </div>
          <div className="main-card-back">
            <input type="text" value={backValue} onChange={onChangeBack} />
          </div>
        </div>
      </div>
      <button type="submit">Add Card</button>
    </form>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
