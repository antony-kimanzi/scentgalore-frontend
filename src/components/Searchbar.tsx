import React from "react";
import "../styles/Searchbar.scss";

export default function Searchbar() {
  return (
    <div>
      <form>
        <input type="text" placeholder="Search..." />
        <button type="submit" className="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-2 -2 39 39" id="Magnifying-Glass--Streamline-Core" height="39" width="39">
  <desc>
    Magnifying Glass Streamline Icon: https://streamlinehq.com
  </desc>
  <g id="magnifying-glass--glass-search-magnifying">
    <path id="Union" fill="#000000" fillRule="evenodd" d="M5 15a10 10 0 1 1 20 0 10 10 0 0 1 -20 0Zm10 -15a15 15 0 1 0 8.69 27.225l7.0425 7.0425a2.5 2.5 0 0 0 3.5349999999999997 -3.5349999999999997l-7.039999999999999 -7.039999999999999A15 15 0 0 0 15 0Z" clipRule="evenodd" strokeWidth="2.5"></path>
  </g>
</svg>
        </button>
      </form>
    </div>
  );
}
