import React, { useState, useMemo } from 'react'; // Import useMemo

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { calculateStatus } from './inventory';
import './inventory.css';
import samimg3 from "./3.jpeg"; // Import the image


const InventoryList = ({ inventory, onEdit, onDelete, togglePopup, onEditingItemChange}) => {
  const [editingItem, setEditingItem] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});
  const [originalValues, setOriginalValues] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [imgSrc, setImgSrc] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [msg2, setMsg2] = useState('');
  const [file2, setFile2] = useState(null);
  const [imgSrc2, setImgSrc2] = useState('');
  const [extractedText2, setExtractedText2] = useState('');
  const [showScanExpiryPopup, setShowScanExpiryPopup] = useState(false);
  const [scanningItemId, setScanningItemId] = useState(null); // Store the ID of the item being scanned
  const [sortingOrder, setSortingOrder] = useState('asc'); // State to track sorting order
const [uploadingImage, setUploadingImage] = useState(false);


const toggleSortingOrder = () => {
  console.log("Current sorting order:", sortingOrder);
  setSortingOrder(sortingOrder === 'asc' ? 'desc' : 'asc');
  console.log("New sorting order:", sortingOrder === 'asc' ? 'desc' : 'asc');
};


const sortedInventory = useMemo(() => {
  console.log("Sorting inventory...");
  const sorted = [...inventory].sort((a, b) => {
    const dateA = new Date(a.expiryDate);
    const dateB = new Date(b.expiryDate);
    return sortingOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });
  console.log("Sorted inventory:", sorted);
  return sorted;
}, [inventory, sortingOrder]);




// Function to handle file input change
  const handleFileChange = (e) => {
    setFile2(e.target.files[0]);
  };


const handleUpload = async (e) => {
  e.preventDefault();
    setUploadingImage(true); // Set uploadingImage to true while uploading

  const formData = new FormData();
  formData.append('file2', file2);

  try {
    console.log('Uploading image...');
    const response = await fetch('https://rohan22.pythonanywhere.com/recpt', {
      method: 'POST',
      body: formData
    });
    console.log('Image uploaded successfully.');
    const data = await response.json();
    console.log('Extracted Text:', data);
    setImgSrc2(data.imgSrc2);
    setExtractedText2(data.extracted_text2);
    setMsg2('Image uploaded successfully!');

    let newExpiryDate;

    // Check if extracted_text2 is available
    if (data.extracted_text2) {
      const dateString = data.extracted_text2; // Assuming data.extracted_text2 is a string representing a date
      const date = new Date(dateString); // Parse the date string into a Date object
      if (isNaN(date.getTime())) {
        // Handle case where data.extracted_text2 is not a valid date string
        console.error("Invalid date format");
        // Optionally, you can provide a default date or exit the function
        return;
      }
      const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      console.log(formattedDate);

      // Use the extracted date
      newExpiryDate = formattedDate;
    } else {
      // Use a default date (1 Jan 2025)
      newExpiryDate = '1 Jan 2025';
    }

    // Find the index of the item in the inventory array
    const index = inventory.findIndex(item => item.id === scanningItemId);
    if (index !== -1) {
      // Update the expiry date of the item
      const updatedInventory = [...inventory];
      updatedInventory[index] = {
        ...updatedInventory[index],
        expiryDate: newExpiryDate
      };
      // Update the state with the modified inventory
      onEdit(scanningItemId, updatedInventory[index]);
    }

    setExtractedText(data.extracted_text);
  } catch (error) {
    console.error('Error uploading image:', error);
    // Display appropriate feedback based on the error
    if (error instanceof TypeError) {
      setMsg2('Could not read image, please try another image');
    } else {
      setMsg2('Something went wrong, please try again');
    }
  } finally {
    // Close the popup regardless of success or failure
        setUploadingImage(false); // Set uploadingImage to false after uploading
    setShowScanExpiryPopup(false);
  }
};



  const handleEdit = (id, item) => {
    // Prevent editing if another item is currently being edited
    if (editingItem !== null && editingItem !== id) return;
    const parts = item.expiryDate.split('/');
    const formattedExpiryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    setOriginalValues(item);
    setEditingItem(id);
    onEditingItemChange(id); // pass edit status changes to Inventory.js
    setUpdatedValues({
      ...item,
      expiryDate: formattedExpiryDate,
    });
  };

const handleScanExpiry = (id, item) => {
  console.log("Scanning Item ID:", id); // Check if the correct ID is logged
  if (editingItem !== null) return;
  setScanningItemId(id); // Store the ID of the item being scanned
  setShowScanExpiryPopup(true);
};



  const handleCancel = () => {
    setUpdatedValues(originalValues);
    setEditingItem(null);
    onEditingItemChange(null); // pass edit status changes to Inventory.js
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setUpdatedValues(prevValues => ({
      ...prevValues,
      [field]: value
    }));
  };

  const handleDateChange = (date) => {
    setUpdatedValues(prevValues => ({
      ...prevValues,
      expiryDate: date
    }));
  };

  const handleSave = (id) => {
    // Validation code
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!updatedValues.name || !updatedValues.amount || !updatedValues.spent) {
      alert('Please fill in all the fields');
      return;
    }

    if (specialCharsRegex.test(updatedValues.name)) {
      alert('Please do not use special characters in the name or status field');
      return;
    }

    const amount = parseFloat(updatedValues.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const spent = parseFloat(updatedValues.spent);
    if (isNaN(spent) || spent <= 0) {
      alert('Please enter a valid spent amount');
      return;
    }

    // Date validation can be added if required

    const formattedExpiryDate = `${updatedValues.expiryDate.getDate()} ${getMonthName(updatedValues.expiryDate.getMonth())} ${updatedValues.expiryDate.getFullYear()}`;

    onEdit(id, { ...updatedValues, expiryDate: formattedExpiryDate });
    setEditingItem(null);
    onEditingItemChange(null); // pass edit status changes to Inventory.js
    setUpdatedValues({});
  };


  const getMonthName = (month) => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return monthNames[month];
  };

  const confirmDelete = (id) => {
    setShowDeleteConfirmation(true);
    setItemToDelete(id);
  };

  const handleDelete = () => {
    onDelete(itemToDelete);
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  return (
    <div>
    {/* Sorting button */}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
                   <th>Expiry Status
  <button onClick={toggleSortingOrder} className="sort-button">
     {sortingOrder === 'asc' ? '↑' : '↓'}
  </button>
</th>
            <th>Expiry Date</th>
            <th>Price $</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sortedInventory.map((item) => (
            <tr key={item.id}>
              <td>
                {editingItem === item.id ? (
                  <input type="text" value={updatedValues.name} onChange={(e) => handleInputChange(e, 'name')} />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editingItem === item.id ? (
                  <input type="text" value={updatedValues.amount} onChange={(e) => handleInputChange(e, 'amount')} />
                ) : (
                  item.amount
                )}
              </td>
                     <td>
                <span style={{ color: calculateStatus(item.expiryDate).color }}>
                  {calculateStatus(item.expiryDate).message}
                </span>
              </td>

                   <td>
                {editingItem === item.id ? (
                  <DatePicker
                    selected={updatedValues.expiryDate}
                    onChange={(date) => handleDateChange(date)}
                    dateFormat="dd MMM yyyy"
                    className="date-picker edit-date-picker"
                  />
                ) : (
                  item.expiryDate
                )}
              </td>
              <td>
                {editingItem === item.id ? (
                  <input type="text" value={updatedValues.spent} onChange={(e) => handleInputChange(e, 'spent')} />
                ) : (
                  item.spent
                )}
              </td>



              <td>
                <div className="inventory-action-button">
                  {editingItem === item.id ? (
                    <React.Fragment>
                      <button className="save-button" onClick={() => handleSave(item.id)}>Save</button>
                      <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <button
                        className="edit-button action-buttons"
                        onClick={() => handleEdit(item.id, item)}
                        style={{
                          cursor: editingItem !== null && editingItem !== item.id ? 'not-allowed' : 'pointer',
                        }}
                        disabled={editingItem !== null && editingItem !== item.id}
                      >
                        Edit
                      </button>

   {/* Button to trigger scan expiry popup */}
<button className= "scan-button" onClick={() => handleScanExpiry(item.id, item)}>Scan Expiry</button>


      {/* Scan expiry popup */}
      {showScanExpiryPopup && (
  <div className="popup">
  <h2 style={{ fontSize: '2.5rem' }}>Scan your package to log Expiry Date</h2>

    {uploadingImage && <div className="loading-overlay">Loading...</div>}
    <div className="scan-options">
      <form onSubmit={handleUpload} encType="multipart/form-data">
        <input type="file" name="file" onChange={handleFileChange} />
        <input type="submit" value="Upload" />
      </form>
      {imgSrc && <img src={imgSrc} alt="Uploaded" />}
      <img src={samimg3} alt="Sample Image" width="25" height="25" />
      <a href={samimg3} download>  Download Sample Image</a>
    </div>
    <button onClick={() => setShowScanExpiryPopup(false)}>Cancel</button>
  </div>
)}


                      <button
                        className="delete-button action-buttons"
                        onClick={() => confirmDelete(item.id)}
                        style={{
                          cursor: editingItem !== null && editingItem !== item.id ? 'not-allowed' : 'pointer',
                        }}
                        disabled={editingItem !== null && editingItem !== item.id}
                      >
                        Delete
                      </button>

                    </React.Fragment>
                  )}
                </div>

              </td>
            </tr>
          ))}
        </tbody>

      </table>
{inventory.length === 0 ? (
  <React.Fragment>
    <div className="empty-cart-image"></div>
    <div className="empty-inventory-message">
      <p>Uh, oh! So empty. Did some shopping? Scan your woolies receipt now -></p>
    </div>
  </React.Fragment>
) : (
  <div>
    {/* Your existing inventory display logic */}
  </div>
)}

      {showDeleteConfirmation && (
        <div className="delete-confirmation-popup">
          <p>Are you sure you want to delete this item?</p>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={cancelDelete}>No</button>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
