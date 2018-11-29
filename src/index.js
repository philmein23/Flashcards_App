import React, { useRef, useState, useEffect, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { useInputValue } from './state/useInput';
import { useAppReducer } from './state/reducer';
import { generateId } from './utils';
import { useFirebaseStore } from './firebase';

import './styles.css';

function App() {
  let mainCard = useRef();
  let cardContainer = useRef();
  let [isEditing, setEditingState] = useState(false);
  let [activeCard, setActiveCard] = useState(null);
  let { dispatch } = useAppReducer();
  let { flashCards, getFlashcards, addFlashCard } = useFirebaseStore();
  console.log('render');
  useEffect(
    () => {
      console.log('call effect');
      setupListener();
      getFlashcards();
      return () => removeListener();
    },
    [activeCard]
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

  function setupListener() {
    mainCard.current.addEventListener('click', toggleFlip);
  }

  function removeListener() {
    mainCard.current.removeEventListener('click', toggleFlip);
  }

  function toggleFlip(event) {
    let cardContainerClassList = cardContainer.current.classList;

    /** Clicking input field should not trigger class toggling */
    if (event.target !== mainCard.current) return;

    cardContainerClassList.toggle('flipme');
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
      back: backValue,
      isActive: false
    };

    await addFlashCard(flashCard);
    setActiveCard(flashCard);
    setEditingState(false);
    clearFields();
  }

  function clearFields() {
    setStateFront('');
    setStateBack('');
  }

  function selectCard(flashCard) {
    flashCard.isActive = true;

    dispatch({ type: 'SELECT_FLASHCARD', flashCard });
    setActiveCard(flashCard);
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
      <Fragment>
        <div className="main-card-front">
          <input type="text" value={frontValue} onChange={onChangeFront} />
        </div>
        <div className="main-card-back">
          <input type="text" value={backValue} onChange={onChangeBack} />
        </div>
      </Fragment>
    );
  }

  function renderSaveButton() {
    return <button className="submit">Save Card</button>;
  }

  return (
    <form onSubmit={e => saveFlashCard(e)}>
      <div className="container">
        <div className="sidebar-nav">
          {flashCards.map(card => {
            return (
              <div
                key={card.id}
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
              {isEditing ? renderNewCard() : renderActiveCard()}
            </div>
          </div>
          <div className="button-container">
            {isEditing ? renderSaveButton() : null}
          </div>
        </div>
      </div>
    </form>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
