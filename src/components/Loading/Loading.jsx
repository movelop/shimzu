import React from 'react';

import './Loading.css';

const Loading = ({ text }) => {
  return (
    <div className="loader">
        <div className="ldsRoller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <h2>{text}</h2>
    </div>
  )
}

export default Loading