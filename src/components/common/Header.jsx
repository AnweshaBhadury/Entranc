import React from 'react';
import { Link } from 'react-router-dom';
import entrancLogo from '../../assets/entranc_logo.png';


const Header = () => {
  return (
    <header className="absolute top-0 left-0 z-20">

      <div className="">
        <Link to="/">
          <img
            src={entrancLogo}
            alt="EnTranC Logo"
            className="block h-32 w-auto object-contain mix-blend-screen md:mix-blend-normal"
          />

        </Link>
      </div>
    </header>
  );
};

export default Header;