import React from "react";

const Input = ({ name, placeholder, value, onChange, onKeyPress }) => {
  return (
    <input
      name={name}
      id={name}
      className="form-control"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
    />
  );
};

export default Input;
