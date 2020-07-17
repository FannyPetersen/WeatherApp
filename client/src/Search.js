import React from 'react';

const Search = props => {
  return (
      <form className='form' onSubmit={props.handleSubmit}>
        <br/>
        <input
          type='text'
          className='form__textfield'
          placeholder="Enter a city"
          value={props.value}
          onChange={props.handleChange}
        />
        <input 
          type='submit' 
          className='form__button' 
          value='Submit' 
          onSubmit={props.handleSubmit} 
        />
      </form>
  );
};

export default Search;