import React from 'react';

const Temp = props => {
  const celsius = props.cels ? 'show' : 'no-show';
  const farenheit = props.cels ? 'no-show' : 'show';

  return (
    <div>
      <p>temperature is </p>
      <button 
        className={`temp-button ${celsius}`} 
        onClick={props.handleClick}>
        {`${props.celsius} °C`}
      </button>
      <button 
        className={`temp-button ${farenheit}`} 
        onClick={props.handleClick}>
        {`${props.farenheit} F`}
      </button>
    </div>
  );
};

export default Temp;
