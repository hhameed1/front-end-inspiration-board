import NewCardForm from "./NewCardForm";
import CardList from "./CardList";
import React, { useState } from "react";

const MainCard = () => {
  //brains
  const [isCardFormVisible, setIsCardFormVisible] = useState(false);
  //Beauty
  return (
    <>
    <div>
      <header>
        <h2>Card List</h2>
      </header>
      <CardList></CardList>
    </div>
    <div>
      <button onClick={() => setIsCardFormVisible(!isCardFormVisible)}>
        {isCardFormVisible ? 'Hide Form' : 'Create Your Card'}
        </button>
        {isCardFormVisible ? (
          <NewCardForm></NewCardForm>
        ) : null} 
    </div>
    </>
  )
}


export default MainCard;