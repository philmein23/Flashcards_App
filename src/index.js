import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useInputValue } from './state/useInput';
import { useAppReducer } from './state/reducer';
import { generateId } from './utils';

import './styles.css';

function App() {
  let mainCard = useRef();
  let cardContainer = useRef();
  let [isAdding, setState] = useState(false);
  let [activeCard, setActiveCard] = useState(null);

  console.log('actives', activeCard);

  useEffect(
    () => {
      console.log('effectsss');
      setupListener();

      return () => removeListener();
    },
    [isAdding]
  );

  const {
    value: frontValue,
    onChange: onChangeFront,
    setState: setStateFront
  } = useInputValue('');
  const {
    value: backValue,
    onChange: onChangeBack,
    setState: setStateBack
  } = useInputValue('');
  const [flashCards, dispatch] = useAppReducer();

  function setupListener() {
    mainCard.current.addEventListener('click', toggleFlip);
  }

  function removeListener() {
    mainCard.current.removeEventListener('click', toggleFlip);
  }

  function toggleFlip(event) {
    let cardContainerClassList = cardContainer.current.classList;
    console.log('listener');
    console.log(event.target);

    /** Clicking input field should not trigger class toggling */
    if (event.target !== mainCard.current) return;

    cardContainerClassList.toggle('flipme');
  }

  function addNewCard(event) {
    event.preventDefault();
    clearFields();
    setState(true);
  }

  function saveFlashCard(event) {
    event.preventDefault();

    const flashCard = {
      id: generateId(),
      front: frontValue,
      back: backValue,
      isActive: false
    };

    setActiveCard(flashCard);

    dispatch({ type: 'ADD_FLASHCARD', flashCard });
    setState(false);
    clearFields();
  }

  function clearFields() {
    setStateFront('');
    setStateBack('');
  }

  function selectCard(flashCard) {
    flashCard.isActive = true;
    console.log(flashCard);

    dispatch({ type: 'UPDATE_FLASHCARD', flashCard });
  }

  function renderActiveCard() {
    return (
      <>
        {activeCard ? (
          <>
            <div className="main-card-front">{activeCard.front}</div>
            <div className="main-card-back">{activeCard.back}</div>
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
              <div
                className={`small-card ${card.isActive ? 'active-card' : ''}`}
                onClick={() => selectCard(card)}
              >
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

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
