// SearchBar Component: 
// Description: This component provides a search bar for users to input ingredients,
// add them to a search list, remove selected items, and trigger a search for recipes.
// Props:
// - onSearch: Function to trigger a search for recipes.
// - onInputChange: Function to handle input change in the search bar.
// - selectedItems: Array of selected items in the search list.
// - onRemoveSelected: Function to remove selected items from the search list.
// - onAddToSearch: Function to add input value to the search list.

import React, { useState } from 'react';

export const SearchBar = ({ onSearch, onInputChange, selectedItems, onRemoveSelected, onAddToSearch }) => {
  // State to manage the input value in the search bar.
  const [input, setInput] = useState('');

  // Function to handle input change in the search bar.
  const handleInputChange = (value) => {
    // Regular expression to allow only alphabetic characters and spaces.
    const regex = /[^a-zA-Z\s]/;
    if (regex.test(value)) {
      // Alert the user if input contains invalid characters and replace them.
      alert('Please enter only alphabetic characters and spaces.');
      setInput(value.replace(regex, ''));
      onInputChange(value.replace(regex, ''));
    } else {
      setInput(value);
      onInputChange(value);
    }
  };

  // Function to handle key press events in the search bar.
  const handleKeyPress = (e) => {
    // Trigger search when Enter key is pressed and input is not empty.
    if (e.key === 'Enter' && input.trim() !== '') {
      onSearch();
    }
  };

  // Log the current input state for debugging purposes.
  console.log("Input state:", input);

  return (
    <div>
      {/* Search input field */}
      <input
        className="search-input"
        type="text"
        placeholder="Add more items to your search..."
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      {/* Add button to add input value to the search list */}
      <button className="add-to-search-button" onClick={() => onAddToSearch(input)}>Add</button>

      {/* Selected items container */}
      <div className="search-container">
        <div className="selected-items-box">
          {/* Display selected items */}
          {selectedItems.map((item, index) => (
            <div key={index} className="selected-item">
              <span>{item}</span>
              {/* Button to remove selected items */}
              <button onClick={() => onRemoveSelected(item)}>×</button>
            </div>
          ))}
        </div>
        {/* Button to trigger recipe search */}
        <div>
          <button className="search-button" onClick={onSearch}>Search Recipes</button>
        </div>
      </div>
    </div>
  );
};
