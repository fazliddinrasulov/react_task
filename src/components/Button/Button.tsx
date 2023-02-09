import React from "react";
import { cla } from "../SweetTable/SweetTable";
import style from "./Button.module.scss";

export const Button: React.FC<{
  kind: "bGray" | "bGray2" | "bLightGray" | "bBlack" | "bBlue";
  text: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ kind, text, className, type = "button", disabled, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cla(className, style.myButton, style[kind])}
    >
      {text}
    </button>
  );
};
