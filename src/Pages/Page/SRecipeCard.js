//import React, { useState } from 'react';
//import PropTypes from 'prop-types';
//
//export const SRecipeCard = ({ recipe }) => {
//  // State to track if the modal is open
//  const [isModalOpen, setIsModalOpen] = useState(false);
//
//  // Function to handle modal toggle
//  const toggleModal = () => {
//    setIsModalOpen(!isModalOpen);
//  };
//
//  return (
//    <div className="srecipe-card" style={{ cursor: 'pointer' }}>
//      {/* Recipe image placeholder */}
//      <div className="recipe-image-placeholder" onClick={toggleModal}>
//        {/* Display recipe image */}
//        <img src={recipe.image} alt="Recipe" />
//      </div>
//
//      {/* Modal */}
//      {isModalOpen && (
//        <div  onClick={toggleModal}>
//          <div  onClick={(e) => e.stopPropagation()}>
//            {/* Close button */}
//            <button className="close-btn" onClick={toggleModal}>
//              Close
//            </button>
//
//            {/* Recipe info container */}
//            <div className="recipe-info">
//              {/* Recipe title */}
//              <h2 className="recipe-title">{recipe.title}</h2>
//
//              {/* Recipe instructions */}
//              <div className="recipe-instructions">
//                <h3>Instructions:</h3>
//                <ol>
//                  {recipe.analyzedInstructions.length > 0 ? (
//                    recipe.analyzedInstructions[0].steps.map((step, index) => (
//                      <li key={index}>{`Step ${index + 1}: ${step.step}`}</li>
//                    ))
//                  ) : (
//                    <li>No instructions available</li>
//                  )}
//                </ol>
//              </div>
//
//              {/* Searched Ingredients */}
//              <div className="recipe-instructions">Searched Ingredients: {recipe.searchedIngredients}</div>
//
//              {/* Preparation time */}
//              <p className="preparation-time">Preparation time: {recipe.preparationMinutes} minutes</p>
//            </div>
//          </div>
//        </div>
//      )}
//    </div>
//  );
//};
//
//SRecipeCard.propTypes = {
//  recipe: PropTypes.object.isRequired,
//};


//import React, { useState } from 'react';
//
//export const SRecipeCard = ({ recipe }) => {
//  // State to track if the popup is open
//  const [isPopupOpen, setIsPopupOpen] = useState(false);
//
//  // Function to handle click event
//  const handleClick = () => {
//    setIsPopupOpen(true);
//  };
//
//  // Function to close the popup
//  const handleClose = () => {
//    setIsPopupOpen(false);
//  };
//
//  return (
//    <div className="srecipe-card" style={{ cursor: 'pointer' }}>
//      {/* Recipe image placeholder */}
//      <div className="recipe-image-placeholder" onClick={handleClick}>
//        {/* Display recipe image */}
//        <img src={recipe.image} alt="Recipe" />
//      </div>
//
//      {/* Popup */}
//      {isPopupOpen && (
//        <div className="popup">
//          <div className="popup-content">
//            {/* Close button */}
//            <span className="close" onClick={handleClose}>
//              &times;
//            </span>
//            {/* Recipe information */}
//            <h2>{recipe.title}</h2>
//            <p>Searched Ingredients: {recipe.searchedIngredients}</p>
//            <h3>Instructions:</h3>
//            <ol>
//              {recipe.analyzedInstructions.length > 0 ? (
//                recipe.analyzedInstructions[0].steps.map((step, index) => (
//                  <li key={index}>{`Step ${index + 1}: ${step.step}`}</li>
//                ))
//              ) : (
//                <li>No instructions available</li>
//              )}
//            </ol>
//            <p>Preparation time: {recipe.preparationMinutes} minutes</p>
//          </div>
//        </div>
//      )}
//    </div>
//  );
//};




import React, { useState } from 'react';

export const SRecipeCard = ({ recipe }) => {
  // State to track if the popup is open
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to handle click event
  const handleClick = () => {
    setIsPopupOpen(true);
  };

  // Function to close the popup
  const handleClose = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="srecipe-container">
      {/* Recipe Circle */}
      <div className="srecipe-card" style={{ cursor: 'pointer' }} onClick={handleClick}>
        <div className="srecipe-card">
          <img src={recipe.image} alt="Recipe" />
        </div>
      </div>

      {/* Recipe Title */}
      <div className="recipe-title">{recipe.title}</div>

      {/* Popup */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            {/* Close button */}
            <span className="close" onClick={handleClose}>
              &times;
            </span>
            {/* Recipe information */}
            <h2>{recipe.title}</h2>
            <p>Searched Ingredients: {recipe.searchedIngredients}</p>
            <h3>Instructions:</h3>
            <ol>
              {recipe.analyzedInstructions.length > 0 ? (
                recipe.analyzedInstructions[0].steps.map((step, index) => (
                  <li key={index}>{`Step ${index + 1}: ${step.step}`}</li>
                ))
              ) : (
                <li>No instructions available</li>
              )}
            </ol>
            <p>Preparation time: {recipe.preparationMinutes} minutes</p>
          </div>
        </div>
      )}
    </div>
  );
};
