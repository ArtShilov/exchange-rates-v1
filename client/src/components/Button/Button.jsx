import React from "react";
import "./Button.css";

export default function Button({ type, onClick, isSelect, children }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button ${isSelect ? "button--select" : ""}`}
    >
      {children}
    </button>
  );
}
