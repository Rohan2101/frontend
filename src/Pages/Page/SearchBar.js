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
  const [input, setInput] = useState('');

  const handleInputChange = (value) => {
    setInput(value);
    onInputChange(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      // Add the typed item to the selected items
      onAddToSearch(input.trim());
      // Clear the input field
      setInput('');
    }
  };

  return (
    <div>
      <div className="search-container">
        <div className="selected-items-box">
          {selectedItems.map((item, index) => (
            <div key={index} className="selected-item">
              <span>{item}</span>
              <button onClick={() => onRemoveSelected(item)}>×</button>
            </div>
          ))}
          {/* Editable input field for adding more items */}
          <input
            className="search-input"
            type="text"
            placeholder="Add more items..."
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
      <div>
        <button className="search-button" onClick={onSearch}>Generate Recipes</button>
      </div>
    </div>
  );
};
