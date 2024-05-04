


// Title: Recipes Page Component

// Description: 
// This component represents a page where users can search for recipes based on available ingredients, manage their inventory, and view recipe details. 
// It integrates various functionalities including fetching recipes from an external API, displaying inventory data, and handling user interactions.

// Imports:
import './recipe.css';
import InventoryList from '../components/InventoryList';
import React, { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { RecipeCard } from './RecipeCard';
import { calculateStatus } from './calculateStatus';
import { finalizeInventory, handleResetInventory } from './inventoryUtils';
import { fetchRecipes, fetchRecipeDetails } from './apiUtils';

// Recipes Component:
export const Recipes = () => {
  // State Variables:
  const [input, setInput] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pyodideLoaded, setPyodideLoaded] = useState(false);
  const [displayedInventory, setDisplayedInventory] = useState([]);

  // Input Change Handler:
  const handleInputChange = (value) => {
    setInput(value);
  };

  // Effect Hook to Load Inventory from Local Storage:
  useEffect(() => {
    try {
      const storedInventory = localStorage.getItem('inventory');
      if (storedInventory) {
        const parsedInventory = JSON.parse(storedInventory);
        const updatedDisplayedInventory = parsedInventory.map(item => {
          const status = calculateStatus(item.expiryDate);
          return { ...item, status: status };
        });
        setInventory(parsedInventory);
        setDisplayedInventory(updatedDisplayedInventory);
      }
    } catch (error) {
      console.error('Error parsing inventory:', error);
    }
  }, []);

  // Effect Hook to Load Pyodide:
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

  // Function to Fetch with Exponential Backoff:
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

  // Function to Fetch Recipes:
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

  // Function to Fetch Recipe Details:
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

  // Function to Handle Fetching Recipes:
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

  // Function to Finalize Inventory:
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

  // Sample Recipe Data:
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

  // Function to Handle Manual Addition to Search:
  const handleAddToSearchManual = (itemName) => {
    // Update the selected items
    setSelectedItems(prevItems => [...prevItems, itemName]);

    // Update the input value
    setInput(prevInput => {
      const trimmedInput = prevInput.trim();
      return trimmedInput ? trimmedInput + ' ' + itemName : itemName;
    });
  };

  // Function to Add Item to Search:
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

  // Function to Reset Inventory:
  const handleResetInventory = () => {
    // Recalculate status for each item in the main inventory
    const updatedDisplayedInventory = inventory.map(item => {
      const status = calculateStatus(item.expiryDate);
      return { ...item, status: status };
    });
    // Update displayed inventory with recalculated status
    setDisplayedInventory(updatedDisplayedInventory);
    alert("Your inventory state has been reset!")
  };

  // Function to Remove Selected Item:
  const handleRemoveSelected = (itemName) => {
    setSelectedItems(prevItems => prevItems.filter(item => item !== itemName));
    setInput(prevInput => prevInput.replace(itemName, '').trim()); // Remove the item name from the search bar input
  };

  // Return JSX:
  return (
    <div className="recipe-page">
      <div className="inventory-container">
        <div className="top-buttons">
          <button className="finalize-button" onClick={finalizeInventory}>Finalize</button>
          <button className="finalize-button" onClick={handleResetInventory}>Reset</button>
        </div>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="inventory-body">
            {displayedInventory.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.amount}</td>
                <td>{item.status.message}</td> {/* Display status message as text */}
                <td>
                  <button className="add-to-search-button" onClick={() => handleAddToSearch(item.name)}>Add</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <SearchBar
          onInputChange={handleInputChange}
          onSearch={handleFetchRecipes}
          selectedItems={selectedItems}
          onRemoveSelected={handleRemoveSelected}
          onAddToSearch={handleAddToSearchManual}
        />
      </div>
      <div className="App">
        <div className="recipes-container">
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
};
