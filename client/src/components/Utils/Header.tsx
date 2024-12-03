import React from "react";
import "../../styles/Header.css"

interface HeaderProps {
  name: string;
}

function Header ({ name } : HeaderProps) {
  return (
    <div className="header">
      <h2>Hello, {name}!</h2>
      <img src="/assets/avatar.png" alt="Avatar" className="avatar" />
    </div>
  );
};

export default Header;