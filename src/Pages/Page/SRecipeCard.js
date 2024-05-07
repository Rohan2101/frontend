// RecipeCard Component:
// Description: This component displays details of a recipe including its title,
// image, instructions, and preparation time.
// Props:
// - recipe: Object containing recipe details such as title, image, instructions, and preparation time.
import React from 'react';

export const SRecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      {/* Recipe image placeholder */}

      {/* Recipe info container */}
      <div className="recipe-info">
        {/* Recipe title */}
        <h2 className="recipe-title">{recipe.title}</h2>
        {/* Recipe instructions */}
        <p className="recipe-instructions">Instructions: {recipe.instructions}</p>
        {/* Preparation time */}
        <p className="preparation-time">Preparation time: {recipe.preparationTime}</p>
      </div>
    </div>
  );
};
