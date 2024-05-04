// Fetch Utility Functions:
// Description: These functions handle fetching data from an API with backoff retries in case of failures.
// Props:
// - url: The URL to fetch data from.
// - options: Additional options for the fetch request.
// - delay: Initial delay for retries.
// - ingredients: List of ingredients for recipe search.
// - pyodideLoaded: Boolean indicating whether Pyodide is loaded.
// - apiKey: API key for accessing the Spoonacular API.
// - baseUrl: Base URL for the Spoonacular API.

// Function: fetchWithBackoff
// Description: Fetch data with backoff retries in case of failures.
export const fetchWithBackoff = async (url, options, delay) => {
    const maxRetries = 3; // Maximum number of retries
    let retries = 0;
    while (retries < maxRetries) {
      try {
        return await fetch(url, options); // Attempt to fetch data
      } catch (error) {
        if (error.name !== 'AbortError' && retries === maxRetries - 1) {
          throw error; // If not recoverable or max retries reached, throw error
        }
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, retries))); // Exponential backoff
        retries++;
      }
    }
  };
  
  // Function: fetchRecipes
  // Description: Fetch recipes based on ingredients.
  export const fetchRecipes = async (ingredients, pyodideLoaded, apiKey, baseUrl) => {
    if (!pyodideLoaded) return; // Exit if Pyodide is not loaded
  
    // Set parameters for recipe search
    const number = 15;
    const ranking = 1;
    const ignorePantry = true;
  
    // Construct URL with query parameters
    const queryParams = new URLSearchParams({
      ingredients: ingredients.join(','),
      number: number,
      ranking: ranking,
      ignorePantry: ignorePantry
    });
    const url = `${baseUrl}?${queryParams}`;
  
    // Set headers for API request
    const headers = {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
    };
    const options = {
      method: 'GET',
      headers: headers
    };
  
    try {
      // Fetch recipes with backoff retries
      const response = await fetchWithBackoff(url, options, 1000); // Initial delay of 1 second
      console.log("Response status:", response.status); // Log response status
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests');
        } else {
          throw new Error('Failed to fetch data');
        }
      }
      const data = await response.json(); // Parse response data
      console.log("Response data:", data); // Log response data
      return data;
    } catch (error) {
      console.error("Error fetching recipes:", error.message); // Log error message
      throw error;
    }
  };
  
  // Function: fetchRecipeDetails
  // Description: Fetch details of a specific recipe.
  export const fetchRecipeDetails = async (recipeId, pyodideLoaded, apiKey, baseUrl) => {
    if (!pyodideLoaded) return; // Exit if Pyodide is not loaded
  
    // Set headers for API request
    const headers = {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
    };
    const options = {
      method: 'GET',
      headers: headers
    };
  
    try {
      // Fetch recipe details with backoff retries
      const response = await fetchWithBackoff(baseUrl, options, 1000); // Initial delay of 1 second
      console.log("Response status:", response.status); // Log response status
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests');
        } else {
          throw new Error('Failed to fetch data');
        }
      }
      const data = await response.json(); // Parse response data
      console.log("Recipe details:", data); // Log recipe details
      return data;
    } catch (error) {
      console.error("Error fetching recipe details:", error.message); // Log error message
      throw error;
    }
  };
  