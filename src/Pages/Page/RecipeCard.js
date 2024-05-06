// RecipeCard Component:
// Description: This component displays details of a recipe including its title,
// image, instructions, and preparation time.
// Props:
// - recipe: Object containing recipe details such as title, image, instructions, and preparation time.
import React from 'react';

export const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
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
        <p className="recipe-instructions">Instructions:</p>
        {/* Display recipe instructions */}
        <p className="recipe-ingredients">{recipe.instructions}</p>
        console.log(recipe.instructions);
        {/* Preparation time */}
        <p className="recipe-instructions">Preparation Time (minutes):</p>
        {/* Display preparation time or message if not available */}
        {recipe.preparationMinutes !== -1 ? (
          <p className="recipe-ingredients">{recipe.preparationMinutes}</p>
        ) : (
          <p className="recipe-ingredients">Data not available</p>
        )}
      </div>
    </div>
  );
};
