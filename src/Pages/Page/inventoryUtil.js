// Inventory Utility Functions:
// Description: These functions handle finalizing and resetting the inventory state.

// Function: finalizeInventory
// Description: Saves the displayed inventory state to localStorage.
// Parameters:
// - displayedInventory: The inventory to be saved.
export const finalizeInventory = (displayedInventory) => {
  try {
    localStorage.setItem('inventory', JSON.stringify(displayedInventory)); // Save displayed inventory to localStorage
    alert("Your inventory state is updated!"); // Display alert for successful update
  } catch (error) {
    console.error('Error saving inventory to localStorage:', error); // Log error if saving fails
  }
};

// Function: handleResetInventory
// Description: Resets the inventory state and recalculates status for each item.
// Parameters:
// - inventory: The inventory to be reset.
// - calculateStatus: Function to calculate status for each item.
export const handleResetInventory = (inventory, calculateStatus) => {
  // Recalculate status for each item in the inventory
  const updatedDisplayedInventory = inventory.map(item => {
    const status = calculateStatus(item.expiryDate); // Calculate status for the item
    return { ...item, status: status }; // Update item with recalculated status
  });
  return updatedDisplayedInventory; // Return the updated inventory
};
