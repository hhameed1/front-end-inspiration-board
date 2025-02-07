import NewCardForm from './NewCardForm';
import CardList from './CardList';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CardContainer.css';
import PropTypes from 'prop-types';

export const baseURL = process.env['REACT_APP_BACKEND_URL'];

const CardContainer = (props) => {
  //brains

  const [cardData, setCardData] = useState([]);
  useEffect(() => {
    axios
      .get(`${baseURL}/boards/${props.selectedBoard.id}/cards`)
      .then((response) => {
        setCardData(response.data);
      })
      .catch((error) => {
        console.log('Error in getting cards', error.response.data);
      });
  }, [props.selectedBoard]);

  const deleteCard = (card) => {
    axios
      .delete(`${baseURL}/cards/${card.id}`)
      .then((response) => {
        const newCardData = cardData.filter((existingCard) => {
          return existingCard.id !== card.id;
        });
        setCardData(newCardData);
      })
      .catch((error) => {
        console.log('Error in deleteing card', error.response.data);
      });
  };

  const addOneLike = (card) => {
    axios
      .put(`${baseURL}/cards/${card.id}`)
      .then((response) => {
        const newCardData = cardData.map((existingCard) => {
          return existingCard.id !== card.id
            ? existingCard
            : { ...card, likes: card.likes + 1 };
        });
        setCardData(newCardData);
        console.log(cardData);
      })
      .catch((error) => {
        console.log('Error in adding a like', error.response.data);
      });
  };

  const postNewCard = (message) => {
    axios
      .post(`${baseURL}/boards/${props.selectedBoard.id}/cards`, message)
      .then((response) => {
        const cards = [...cardData];
        const newCard = {
          id: response.data.card.id,
          message: response.data.card.message,
          likes: 0,
        };

        console.log(response.data.card);
        cards.push(newCard);
        setCardData(cards);
      })
      .catch((error) => {
        console.log('Error in creating a new card', error.response.data);
      });
  };

  // toggle Card form
  const [isCardFormVisible, setIsCardFormVisible] = useState(false);

  // Sort Cards by either Most Recent, Likes, Alpha
  const [value, setValue] = useState('');

  const sortCards = (event) => {
    console.log('yes');
    setValue(event.target.value);
    if (event.target.value === 'alpha') {
      const newCardsSorted = [...cardData].sort((a, b) => {
        let fa = a.message.toLowerCase(),
          fb = b.message.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      setCardData(newCardsSorted);
    } else if (event.target.value === 'mostRecent') {
      const newCardsSorted = [...cardData].sort((a, b) => b.id - a.id);
      setCardData(newCardsSorted);
    } else if (event.target.value === 'likes') {
      const newCardsSorted = [...cardData].sort((a, b) => b.likes - a.likes);
      setCardData(newCardsSorted);
    }
  };

  //Beauty
  return (
    <>
      <div>
        <header>
          <h2 className="card-list_header">Card List</h2>
        </header>
      </div>
      <div className="card-form_container">
        <button
          className="button-toggle"
          onClick={() => setIsCardFormVisible(!isCardFormVisible)}
        >
          {isCardFormVisible ? 'Hide Form' : 'Create Your Card'}
        </button>
        {isCardFormVisible ? <NewCardForm postNewCard={postNewCard} /> : null}
      </div>
      <div>
        <label className="button-toggle">
          Sort By:
          <select value={value} onChange={sortCards}>
            <option value="mostRecent">Most Recent</option>
            <option value="alpha">Alphabetically</option>
            <option value="likes">Likes</option>
          </select>
        </label>
      </div>
      <div>
        <CardList
          cardData={cardData}
          deleteCard={deleteCard}
          addOneLike={addOneLike}
        ></CardList>
      </div>
    </>
  );
};

export default CardContainer;

// proptypes
CardContainer.propTypes = {
  selectedBoard: PropTypes.object.isRequired,
};
