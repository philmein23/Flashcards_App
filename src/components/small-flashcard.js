import React from "react";

export default function SmallFlashcard({
  selectCard,
  card,
  index,
  smallCard,
  editCard
}) {
  return (
    <div
      ref={smallCard}
      key={card.id}
      style={{ "--i": index }}
      className={`small-card ${card.isActive ? "active-card" : ""}`}
      onClick={() => selectCard(card)}
    >
      <div className="front-small">{card.front}</div>
      {card.isActive ? (
        <button className="edit" onClick={() => editCard(card)}>
          Edit
        </button>
      ) : null}
    </div>
  );
}
