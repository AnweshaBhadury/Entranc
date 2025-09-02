import React from 'react';
import { Link } from 'react-router-dom';
import entrancLogo from '../../assets/entranc_logo.png';


// Future note !!

const Header = () => {
  return (
    // Positioning the entire component absolutely. z-20 keeps it above the hero image.
    <header className="absolute top-0 left-0 z-20">
      {/* 
        This div IS the white, pill-shaped background.
        - p-4 for padding inside the shape.
        - bg-white for the color.
        - shadow-xl for the subtle shadow.
        - rounded-br-3xl creates the large curve on the bottom-right.
      */}
      <div className="bg-white p-4 rounded-br-3xl shadow-xl">
        <Link to="/">
          <img 
            src={entrancLogo} 
            alt="EnTranC Logo" 
            className="h-14 w-auto object-contain"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;