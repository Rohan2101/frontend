import React, { useState } from 'react';

export const RecipeCard = ({ recipe, flipStates, setFlipStates }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => {
    // Toggle the flip state of the clicked card
    setIsFlipped(!isFlipped);

    // Reset flip state of all other cards
    const newFlipStates = flipStates.map(() => false);
    setFlipStates(newFlipStates);
  };

  const handleCookingClick = (event) => {
    event.stopPropagation(); // Prevent card flip when button is clicked
    // Implement your logic here for when the user clicks "I'm cooking this"
    console.log(`Cooking ${recipe.title}`);
  };

  return (
    <div className={`recipe-card ${isFlipped ? 'is-flipped' : ''}`} onClick={handleCardFlip}>
      {/* Front side of the card */}
      <div className="card-front">
             {/* Preparation time */}
        <div className="recipe-minutes">
          <p style={{ textAlign: "right" }}>
            Preparation Time (minutes):{" "}
            {recipe.preparationMinutes !== -1 ? (
              <span className="recipe-minutes">{recipe.preparationMinutes}</span>
            ) : (
              <span className="recipe-minutes">Data not available</span>
            )}
          </p>
        </div>

        {/* Display recipe image */}
        <div className="recipe-image-placeholder">
          <img src={recipe.image} alt="Recipe" />
        </div>
        {/* Recipe title */}
        <h2 className="recipe-title">{recipe.title}</h2>
      </div>

      {/* Back side of the card */}
      <div className="card-back">
        {/* Recipe instructions */}
        {/* Preparation time */}
        <div className="recipe-minutes-div">
          <p className="recipe-minutes" style={{ textAlign: "right" }}>
            Preparation Time (minutes):{" "}
            {recipe.preparationMinutes !== -1 ? (
              <span className="recipe-minutes">{recipe.preparationMinutes}</span>
            ) : (
              <span className="recipe-minutes">Data not available</span>
            )}
          </p>
        </div>
        {/* Recipe searched ingredients */}
        <div className="recipe-instructions">Searched Ingredients:</div>
        <div className="recipe-ingredients">{recipe.searchedIngredients}</div>
        {/* Recipe instructions */}
        <div className="recipe-instructions">Instructions:</div>
        <div className="recipe-ingredients">
          <ol>
            {recipe.analyzedInstructions.length > 0 ? recipe.analyzedInstructions[0].steps.map((step, index) => (
              <li key={index}>{`Step ${index + 1}: ${step.step}`}</li>
            )) : <li>No instructions available</li>}
          </ol>
        </div>
        {/* "I'm cooking this" button */}
        <button className="cooking-button" onClick={handleCookingClick}>
          I'm cooking this
        </button>
      </div>
    </div>
  );
};
