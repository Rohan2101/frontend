import './recipe.css';
import InventoryList from '../components/InventoryList';
import React, { useState, useEffect } from 'react';

// SearchBar Component
const SearchBar = ({ onSearch, onInputChange, selectedItems, onRemoveSelected, onAddToSearch }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (value) => {
    setInput(value);
    onInputChange(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      onSearch();
    }
  };

  console.log("Input state:", input); // Add this console log

  return (
    <div className="search-container">
      <div className="selected-items-box">
        {selectedItems.map((item, index) => (
          <div key={index} className="selected-item">
            <span>{item}</span>
            <button onClick={() => onRemoveSelected(item)}>×</button>
          </div>
        ))}
      </div>
      <div>
      <input
  className="search-input"
  type="text"
  placeholder="Add more items to your search..."
  value={input}
  onChange={(e) => handleInputChange(e.target.value)}
  onKeyPress={handleKeyPress}
/>

            <button className="add-to-search-button" onClick={() => onAddToSearch(input)}>Add to Search</button>
           <div>
              <button className="search-button" onClick={onSearch}>Search Recipes</button>
            </div>
</div>
    </div>
  );
};

// RecipeCard Component
const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
<div className="recipe-image-placeholder">
  <img src={recipe.image} alt="Recipe" />
</div>

      <div className="recipe-info">
        <h2 className="recipe-title">{recipe.title}</h2>
        <p className="recipe-ingredients">{recipe.instructions}</p>
        <p className="recipe-time">{recipe.preparationMinutes}</p>
        <p className="recipe-has-ingredients">{recipe.hasIngredients}</p>
      </div>
    </div>
  );
};

// Recipes Component
export const Recipes = () => {
  const [input, setInput] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pyodideLoaded, setPyodideLoaded] = useState(false);
  const [displayedInventory, setDisplayedInventory] = useState([]);

  const handleInputChange = (value) => {
    setInput(value);
  };

  useEffect(() => {
    try {
      const storedInventory = localStorage.getItem('inventory');
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      }
    } catch (error) {
      console.error('Error parsing inventory:', error);
    }
  }, []);

  useEffect(() => {
    setDisplayedInventory([...inventory]); // Create a shallow copy of the inventory and set it to displayedInventory
  }, [inventory]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.21.2/full/pyodide.js';
    script.async = true;
    script.onload = async () => {
      window.languagePluginUrl = 'https://cdn.jsdelivr.net/pyodide/v0.21.2/full/';
      window.pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.21.2/full/',
      });
      setPyodideLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

const fetchWithBackoff = async (url, options, delay) => {
  const maxRetries = 3; // Maximum number of retries
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fetch(url, options);
    } catch (error) {
      // If the error is not recoverable or max retries are reached, throw error
      if (error.name !== 'AbortError' && retries === maxRetries - 1) {
        throw error;
      }
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, retries)));
      retries++;
    }
  }
};


const fetchRecipes = async () => {
  if (!pyodideLoaded) return; // Exit if pyodide is not loaded

  const baseUrl = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients";
  const apiKey = "590374f09cmshedcb45928ac60bap18e369jsn8f0c8e3fe0a0";
  const ingredients = selectedItems;
  const number = 15;
  const ranking = 1;
  const ignorePantry = true;

  const queryParams = new URLSearchParams({
    ingredients: ingredients.join(','),
    number: number,
    ranking: ranking,
    ignorePantry: ignorePantry
  });

  const url = `${baseUrl}?${queryParams}`;

  const headers = {
    "X-RapidAPI-Key": apiKey,
    "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
  };

  const options = {
    method: 'GET',
    headers: headers
  };

  try {
    const response = await fetchWithBackoff(url, options, 1000); // Initial delay of 1 second
    console.log("Response status:", response.status); // Log the response status
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Too many requests');
      } else {
        throw new Error('Failed to fetch data');
      }
    }
    const data = await response.json();
    console.log("Response data:", data); // Log the response data
    return data;
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
    throw error;
  }
};

const fetchRecipeDetails = async (recipeId) => {
  if (!pyodideLoaded) return; // Exit if pyodide is not loaded

  const baseUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`;
  const apiKey = "590374f09cmshedcb45928ac60bap18e369jsn8f0c8e3fe0a0";

  const headers = {
    "X-RapidAPI-Key": apiKey,
    "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
  };

  const options = {
    method: 'GET',
    headers: headers
  };

  try {
    const response = await fetchWithBackoff(baseUrl, options, 1000); // Initial delay of 1 second
    console.log("Response status:", response.status); // Log the response status
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Too many requests');
      } else {
        throw new Error('Failed to fetch data');
      }
    }
    const data = await response.json();
    console.log("Recipe details:", data); // Log the recipe details
    return data;
  } catch (error) {
    console.error("Error fetching recipe details:", error.message);
    throw error;
  }
};

const handleFetchRecipes = async () => {
  try {
    const result = await fetchRecipes();
    console.log(result);

    // Assuming result is an array of objects with recipe IDs
    const recipeIds = result.map(recipe => recipe.id);

    // Fetch details for each recipe ID
    const recipeDetails = await Promise.all(recipeIds.map(fetchRecipeDetails));
    setRecipes(recipeDetails);
    console.log(recipeDetails);

    // Handle the recipe details as needed, e.g., display them in your application
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
  }
};



  const finalizeInventory = () => {
    // Update the main inventory with the displayed inventory
    setInventory([...displayedInventory]);

    // Optionally, you can also save the updated inventory to localStorage
    try {
      localStorage.setItem('inventory', JSON.stringify(displayedInventory));
      alert("Your inventory state is updated!")
    } catch (error) {
      console.error('Error saving inventory to localStorage:', error);
    }
  };



  const sampleRecipes = [
    { title: 'Egg Salad Sandwich', ingredients: 'Bread, Eggs, Mayonnaise', time: '10 mins', hasIngredients: 'You have 2/3 ingredients', imageUrl: 'placeholder-image.jpg' },
    { title: 'Deviled Eggs', ingredients: 'Eggs, Mayonnaise, Mustard', time: '20 mins', hasIngredients: 'You have all ingredients', imageUrl: 'placeholder-image.jpg' },
    { title: 'Scrambled Eggs with Toast', ingredients: 'Bread, Eggs, Butter', time: '15 mins', hasIngredients: 'You have all ingredients', imageUrl: 'placeholder-image.jpg' },
    { title: 'Egg Fried Rice', ingredients: 'Rice, Eggs, Soy Sauce', time: '15 mins', hasIngredients: 'You have 2/3 ingredients', imageUrl: 'placeholder-image.jpg' },
    { title: 'Egg and Veggie Breakfast Burrito', ingredients: 'Tortilla, Eggs, Bell Peppers', time: '20 mins', hasIngredients: 'You have 2/3 ingredients', imageUrl: 'placeholder-image.jpg' },
    { title: 'Egg and Spinach Omelette', ingredients: 'Eggs, Spinach, Cheese', time: '10 mins', hasIngredients: 'You have 2/3 ingredients', imageUrl: 'placeholder-image.jpg' },
    { title: 'Egg McMuffin', ingredients: 'English Muffin, Eggs, Canadian Bacon', time: '15 mins', hasIngredients: 'You have 2/3 ingredients', imageUrl: 'placeholder-image.jpg' },
    { title: 'Egg and Bacon Breakfast Hash', ingredients: 'Potatoes, Eggs, Bacon', time: '25 mins', hasIngredients: 'You have all ingredients', imageUrl: 'placeholder-image.jpg' },
    { title: 'Egg and Avocado Toast', ingredients: 'Bread, Eggs, Avocado', time: '10 mins', hasIngredients: 'You have 2/3 ingredients', imageUrl: 'placeholder-image.jpg' }
  ];

const handleAddToSearch = (itemName) => {
  // Find the item in the displayed inventory
  const selectedItem = displayedInventory.find(item => item.name === itemName);
  if (selectedItem) {
    // Reduce the quantity by 1
    const updatedQuantity = selectedItem.amount - 1;

    if (updatedQuantity < 0) {
      // Check if the updated quantity is less than 0
      // Display an alert
      alert("Oops! Sorry, you ran out of this item.");
    } else {
      // Reduce the quantity by 1
      const updatedItem = { ...selectedItem, amount: updatedQuantity };
      // Update the displayed inventory
      setDisplayedInventory(prevInventory => {
        // Find the index of the updated item in the inventory array
        const index = prevInventory.findIndex(item => item.name === itemName);
        if (index !== -1) {
          // Create a copy of the previous inventory array
          const updatedInventory = [...prevInventory];
          // Update the item at the found index with the updated item
          updatedInventory[index] = updatedItem;
          return updatedInventory;
        }
        return prevInventory;
      });

      if (updatedQuantity >= 0) {
        // Update the selected items only if quantity is greater than or equal to 0
        setSelectedItems(prevItems => [...prevItems, itemName]);
        setInput(prevInput => {
          const trimmedInput = prevInput.trim();
          return trimmedInput ? trimmedInput + ' ' + itemName : itemName;
        });
      }
    }
  }
};


  const handleRemoveSelected = (itemName) => {
    setSelectedItems(prevItems => prevItems.filter(item => item !== itemName));
    setInput(prevInput => prevInput.replace(itemName, '').trim()); // Remove the item name from the search bar input
  };


  //Filter component
// Define state for the filter
const [filter, setFilter] = useState({
  column: 'name', // Default filter column
  keyword: '',    // Default filter keyword
  applyFilter: false // Flag to indicate if filter should be applied
});

// Inside the Recipes component

// Define applyFilter function to trigger the filter application
const applyFilter = () => {
  setFilter(prevFilter => ({ ...prevFilter, applyFilter: true }));
};

// Filter the displayed inventory based on the selected filter when "Filter" button is clicked
useEffect(() => {
  if (filter.applyFilter) {
    setDisplayedInventory(prevInventory => {
      return prevInventory.filter(item => {
        const { column, keyword } = filter;
        // Apply filtering logic based on the selected column
        if (column === 'name') {
          return item.name.toLowerCase().includes(keyword.toLowerCase());
        } else if (column === 'quantity') {
          return item.amount.toString().toLowerCase().includes(keyword.toLowerCase());
        } else if (column === 'status') {
          // Assuming status is a string property of the item
          return item.status.toLowerCase().includes(keyword.toLowerCase());
        }
        return true; // Return true by default to include all items if no filter applied
      });
    });
  }
}, [filter]);

// Function to handle changes in filter selection
const handleFilterChange = (column, keyword) => {
  setFilter({ column, keyword, applyFilter: false }); // Set applyFilter to false when filter changes
};


  return (
    <div>
      <div class="inventory-container">
      <div class="top-buttons">
      <button class="finalize-button" onClick={finalizeInventory}>Finalize</button>
      <button class="finalize-button" onClick={applyFilter}>Filter</button>
      </div>
        <table class="inventory-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody class="inventory-body">
            {displayedInventory.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.amount}</td>
                <td>
                  <img
                    src={item.status}
                    alt="Status Indicator"
                    className="status-image"
                    style={{ width: '55px', height: 'auto' }}
                  />
                </td>
                <td>
                  <button className="add-to-search-button" onClick={() => handleAddToSearch(item.name)}>Add to Search</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


      </div>
      <div className="App">
        <SearchBar
          onInputChange={handleInputChange}
          onSearch={handleFetchRecipes }
          selectedItems={selectedItems}
          onRemoveSelected={handleRemoveSelected}
          onAddToSearch={handleAddToSearch}
        />
        <div className="recipes-container">
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
