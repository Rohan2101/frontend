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

  return (
    <div className={`recipe-card ${isFlipped ? 'is-flipped' : ''}`} onClick={handleCardFlip}>
      {/* Recipe image placeholder */}
      <div className="recipe-image-placeholder">
        {/* Display recipe image */}
        <img src={recipe.image} alt="Recipe" />
      </div>

      {/* Recipe info container */}
      <div className="recipe-info">
        {/* Recipe title */}
        {/* Back content (instructions, preparation time) */}
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
          <h2 className="recipe-title">{recipe.title}</h2>
          <div className="recipe-instructions">Searched Ingredients:</div>
          <div className="recipe-ingredients">{recipe.searchedIngredients}</div>
          <div className="recipe-instructions">Instructions:</div>
          <div className="recipe-ingredients">
            <ol>
              {recipe.analyzedInstructions.length > 0 ? recipe.analyzedInstructions[0].steps.map((step, index) => (
                <li key={index}>{`Step ${index + 1}: ${step.step}`}</li>
              )) : <li>No instructions available</li>}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
