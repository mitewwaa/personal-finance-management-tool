import React from "react";

interface HeaderProps {
  name: string;
}

const Header: React.FC<HeaderProps> = ({ name}) => {
  return (
    <div className="header">
      <h2>Hello, {name}!</h2>
      <img src="../../assets/avatar.png" alt="Avatar" className="avatar" />
    </div>
  );
};

export default Header;