// Function: calculateStatus
// Description: This function calculates the status of an item based on its expiry date.
export const calculateStatus = (expiryDate) => {
    // Log the expiry date for debugging purposes.
    console.log("Calculating status for expiry date:", expiryDate);
    
    // Split the expiry date string into day, month, and year parts.
    const parts = expiryDate.split('/');
    
    // Format the date string into a format compatible with the Date object (YYYY-MM-DD).
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    
    // Create a Date object representing the expiry date.
    const expiry = new Date(formattedDate);
    
    // Create a Date object representing the current date.
    const currentDate = new Date();
    
    // Set the time portion of the current and expiry dates to midnight.
    currentDate.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    
    // Calculate the difference in days between the current date and the expiry date.
    const diffDays = (expiry - currentDate) / (1000 * 60 * 60 * 24);
  
    // If the item has already expired:
    if (Math.ceil(diffDays) < 0) {
      // Return a message indicating the number of days it has been expired and color it red.
      return { message: 'Expired ' + Math.abs(Math.ceil(diffDays)) + 'd', color: 'red' };
    } 
    // If the item expires today:
    else if (Math.ceil(diffDays) === 0) {
      // Return a message indicating that it expires today and color it red.
      return { message: 'Expires Today', color: 'red' };
    } 
    // If the item expires within the next 5 days:
    else if (Math.ceil(diffDays) <= 5) {
      // Return a message indicating the number of days until expiry and color it gold.
      return { message: Math.ceil(diffDays) + 'd to Expire', color: '#DAA520' };
    } 
    // If the item is safe to consume for more than 5 days:
    else {
      // Return a message indicating that it is safe to consume and color it green.
      return { message: 'Safe (>5d)', color: 'green' };
    }
  };
  