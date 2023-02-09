import React, { useState } from "react";
import { cla } from "../SweetTable/SweetTable";

import { ReactComponent as CheckSvg } from "../../assets/images/check.svg";

import style from "./Checkbox.module.scss";

export const Checkbox: React.FC<{
  autoComplete?: string;
  id: string;
  name: string;
  label: string;
  type: "radio" | "checkbox";
  className?: string;
  classNameForBack?: string;
  value: string | undefined;
  checked: boolean | undefined;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  isLastIndex?: boolean;

  onBlur: React.FocusEventHandler<HTMLInputElement>;
  required?: boolean;
  error?: string | false;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => any; // from Formik library
  isOther?: boolean;
}> = ({
  id,
  name,
  type,
  autoComplete,

  label,
  setFieldValue,
  className,
  classNameForBack,
  value,
  checked,
  onFocus,
  isLastIndex,

  onBlur,
  required,
  error,
  isOther,
}) => {
  const [valueOfTextOfOther, setValueOfTextOfOther] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleLocalChange: React.ChangeEventHandler<HTMLInputElement> = () => {
    let newNewNew: string | boolean | undefined = undefined;
    if (type === "radio") {
      if (!isOther) {
        newNewNew = value;
      } else {
        newNewNew = valueOfTextOfOther;
      }
    } else if (type === "checkbox") {
      setIsOpen(!isOpen);
    }

    setFieldValue(name, newNewNew);
  };

  const handleLocalChangeForInputOfOther: React.ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    const newVal = e.target.value;

    setFieldValue(name, newVal);
    setValueOfTextOfOther(newVal);
  };

  return (
    <div className={cla(className, style.ground)}>
      <div className={style.inpWrap}>
        <div
          className={cla(style.radioCheckWrap, classNameForBack, style[type], {
            [style.checked]: isOpen,
          })}
        >
          <input
            id={id}
            name={name}
            autoComplete={autoComplete}
            className={cla(style.myInput, style[type], {
              [style.checked]: isOpen,
            })}
            type={type}
            required={required}
            value={value}
            checked={isOpen || false}
            onChange={handleLocalChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <CheckSvg
            className={cla(style.checkSvg, {
              [style.show]: type === "checkbox" && isOpen,
            })}
          />
        </div>

        <label
          className={cla(style.label, { [style.isOther]: isOther })}
          htmlFor={id}
        >
          {label}
        </label>
        {isOther && (
          <input
            value={valueOfTextOfOther}
            placeholder="Other"
            className={style.textInpOfOther}
            onChange={handleLocalChangeForInputOfOther}
            type="text"
            name={`otherFor_${name}`}
          />
        )}
      </div>
      {error && (type === "checkbox" || isLastIndex) && (
        <div className={style.error}>{error}</div>
      )}
    </div>
  );
};
