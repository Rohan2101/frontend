import React from 'react';

export const SRecipeCard = ({ recipe }) => {
  return (
    <div className="srecipe-card">
      {/* Recipe image placeholder */}
      <div className="recipe-image-placeholder">
        {/* Display recipe image */}
        <img src={recipe.image} alt="Recipe" />
      </div>

      {/* Recipe info container */}
      <div className="recipe-info">
        {/* Recipe title */}
        <h2 className="recipe-title">{recipe.title}</h2>
        {/* Recipe instructions */}
         <div className="recipe-instructions">Searched Ingredients: {recipe.searchedIngredients}</div>

        <div className="recipe-instructions">
          <h3>Instructions:</h3>
          <ol>
            {recipe.analyzedInstructions.length > 0 ? recipe.analyzedInstructions[0].steps.map((step, index) => (
              <li key={index}>{`Step ${index + 1}: ${step.step}`}</li>
            )) : <li>No instructions available</li>}
          </ol>
        </div>

        {/* Preparation time */}
        <p className="preparation-time">Preparation time: {recipe.preparationMinutes} minutes</p>
      </div>
    </div>
  );
};
