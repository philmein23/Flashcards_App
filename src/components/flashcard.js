import React, { Fragment } from "react";

export default function Flashcard({
  frontValue,
  onChangeFront,
  backValue,
  onChangeBack,
  activeCard,
  isEditing,
  addNewCard,
  toggleSideMenu,
  sidebarIsActive,
  cardContainer,
  mainCard
}) {
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
    <div
      className={`relative 
            ${!sidebarIsActive ? "sidebar-nav-animated" : ""}`}
    >
      <div className="add-new-button">
        <button className="toggle-button" onClick={e => toggleSideMenu(e)}>
          Toggle Menu
        </button>
        <button className="add-new" onClick={e => addNewCard(e)}>
          <span className="plus">+</span>
        </button>
      </div>
      <div ref={cardContainer} id="card-container" className="card-container">
        <div ref={mainCard} className="main-card">
          {isEditing ? renderNewCard() : renderActiveCard()}
        </div>
      </div>
      <div className="button-container">
        {isEditing ? renderSaveButton() : null}
      </div>
    </div>
  );
}
