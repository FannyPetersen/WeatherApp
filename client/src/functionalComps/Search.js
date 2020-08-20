const Search = ({ change, submit, value }) => {
 
    return <form className='form' onSubmit={submit}>
    Enter a city:
    <br/>
    <input
      type='text'
      className='form__textfield'
      placeholder="E.g. London"
      value={value}
      onChange={change}
    />
    <input className='form__button' type='submit' value='Submit' onSubmit={submit} />
  </form>
  
  };