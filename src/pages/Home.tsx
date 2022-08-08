import React from "react";
import { Link } from "react-router-dom";

import "../styles/home-page.scss";

export const HomePage: React.FC = () => {
  return <div className="home-page">
    <Link to="/missions" className="button">Missions</Link>
  </div>;
};
