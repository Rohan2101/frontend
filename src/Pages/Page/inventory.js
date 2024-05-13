import React, { useState, useEffect, useRef } from 'react';
import InventoryList from './InventoryList';
import './inventory.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import Dashboard from './Dashboard';


// Function to calculate the status based on the expiry date
export const calculateStatus = (expiryDate) => {
  const parts = expiryDate.split('/');
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  const expiry = new Date(formattedDate);
  const currentDate = new Date();

  // Set to start of the day for comparison
  currentDate.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  // Set the current datetime to the start of the day, ignoring hours, minutes and seconds currentDate.setHours(0, 0, 0, 0);
  const diffDays = (expiry - currentDate) / (1000 * 60 * 60 * 24);

  // set 3 period(safe/reminder/alert) for status
  if (Math.ceil(diffDays) < 0) {
    return { message: 'Expired ' + Math.abs(Math.ceil(diffDays)) + 'd', color: 'red' };
  } else if (Math.ceil(diffDays) === 0) {
    return { message: 'Expires Today', color: 'red' };
  } else if (Math.ceil(diffDays) <= 5) {
    return { message: Math.ceil(diffDays) + 'd to Expire', color: '#DAA520' };
  } else {
    return { message: 'Safe (>5d)', color: 'green' };
  }
};


export function Maininventory() {
  const [inventory, setInventory] = useState(() => {
    const storedInventory = localStorage.getItem('inventory');
    return storedInventory ? JSON.parse(storedInventory) : [];
  });
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showScanReceiptPopup, setShowScanReceiptPopup] = useState(false);
  const [showScanProducePopup, setShowScanProducePopup] = useState(false);
  const [showScanPackagePopup, setShowScanPackagePopup] = useState(false);
  const [expiryPlaceholder, setExpiryPlaceholder] = useState(new Date());
  const [newItem, setNewItem] = useState({
    name: '',
    amount: '',
    spent: '',
    expiryDate: '',
    status: ''
  });
  const [msg, setMsg] = useState('');
  const [nextItemId, setNextItemId] = useState(inventory.length + 1);
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [msg1, setMsg1] = useState('');
  const [file1, setFile1] = useState(null);
  const [imgSrc1, setImgSrc1] = useState('');
  const [extractedText1, setExtractedText1] = useState('');
  const [msg2, setMsg2] = useState('');
  const [file2, setFile2] = useState(null);
  const [imgSrc2, setImgSrc2] = useState('');
  const [extractedText2, setExtractedText2] = useState('');
const [hasOneItemInInventory, setHasOneItemInInventory] = useState(inventory.length === 1);
const [hasBlinked, setHasBlinked] = useState(false);
  const [showCongratsPopup, setShowCongratsPopup] = useState(true);
    const [showCongratsTimer, setShowCongratsTimer] = useState(true);
  const [blink, setBlink] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 8;
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = Math.min(startIndex + itemsPerPage, inventory.length);
const currentInventory = inventory.slice(startIndex, endIndex);

const totalPages = Math.ceil(inventory.length / itemsPerPage);
const [uploadingImage, setUploadingImage] = useState(false);


  // handle  "Add Manually" "Scan Receipt"  status while editing
  const [editingItem, setEditingItem] = useState(null);
  const handleEditingItemChange = (itemId) => {
    setEditingItem(itemId);
  };


// Use useEffect to automatically close the congratulations popup after 3 seconds
useEffect(() => {
  const timeout = setTimeout(() => {
    setShowCongratsTimer(false);
  }, 3000);

  return () => clearTimeout(timeout);
}, []);

// Use useEffect to hide the congratulations popup when the timer is up
useEffect(() => {
  if (!showCongratsTimer) {
    setShowCongratsPopup(false);
  }
}, [showCongratsTimer]);


useEffect(() => {
  // Show the congratulations popup if there's exactly one item in inventory and the timer is still active
  if (hasOneItemInInventory && showCongratsTimer) {
    setShowCongratsPopup(true);
  } else {
    // Otherwise, hide the congratulations popup
    setShowCongratsPopup(false);
  }
}, [hasOneItemInInventory, showCongratsTimer]);


  // for status indicator popup
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleEditItem = (id, updatedItem) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === id) {
        // Update the status based on the new expiry date
        const status = calculateStatus(updatedItem.expiryDate);
        return { ...item, ...updatedItem, status: status };
      }

      return item;
    });

    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  };

useEffect(() => {
  // Check if the inventory has exactly one item
  const hasOneItem = inventory.length === 1;

  // Update hasOneItemInInventory state if it's different from the current state
  if (hasOneItem !== hasOneItemInInventory) {
    setHasOneItemInInventory(hasOneItem);
  }
}, [inventory]); // Run this effect whenever the inventory changes


  // Define handleDeleteItem function
  const handleDeleteItem = (id) => {
    // Filter out the item with the specified id from the inventory array
    const updatedInventory = inventory.filter(item => item.id !== id);
    setInventory(updatedInventory);
  };

  // Determine if any popup is active
  const isPopupActive = showAddPopup || showScanReceiptPopup || showScanProducePopup || showScanPackagePopup;
  const closeAllPopups = () => {
    setShowAddPopup(false);
    setShowScanReceiptPopup(false);
    setShowScanProducePopup(false);
    setShowScanPackagePopup(false);
  };


  useEffect(() => {
    const storedInventory = localStorage.getItem('inventory');
    if (storedInventory) {
      setInventory(JSON.parse(storedInventory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    console.log("Inventory saved to local storage:", inventory);
  }, [inventory]);



  //change this to close all
  const togglePopup = (popupType) => {
    setShowAddPopup(false);
    setShowScanReceiptPopup(false);
    setShowScanProducePopup(false);
    setShowScanPackagePopup(false);
    setShowStatusModal(false);

    switch (popupType) {
      case 'add':
        if (!showAddPopup) {
          // If the add popup is about to be opened, reset the expiry date as today
          const today = new Date();
          setExpiryPlaceholder(today);
          setNewItem(prevItem => ({
            ...prevItem,
            name: '',
            amount: '',
            spent: '',
            // Ensure the expiryDate is set to a formatted version of today's date
            expiryDate: today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: ''
          }));
        }
        setShowAddPopup(!showAddPopup);
        break;
      case 'receipt':
        setShowScanReceiptPopup(!showScanReceiptPopup);
        break;
      case 'produce':
        setShowScanProducePopup(!showScanProducePopup);
        break;
      case 'package':
        setShowScanPackagePopup(!showScanPackagePopup);
        break;


      // Status Popup
      case 'statusInfo':
        setShowStatusModal(!showStatusModal);
        break;


      default:
        break;
    }
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'status') {
      setNewItem((prevItem) => ({
        ...prevItem,
        status: value
      }));
    } else {
      setNewItem((prevItem) => ({
        ...prevItem,
        [name]: value
      }));
    }
  };

const handleAddItem = () => {
  // Regular expression to check for special characters
  const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;

  // Check if any of the required fields are empty
  if (!newItem.name || !newItem.amount || !newItem.spent) {
    // Display an error message or perform any other action
    alert('Please fill in all the fields');
    return; // Exit the function early if validation fails
  }

  // Check if any field contains special characters
  if (specialCharsRegex.test(newItem.name)) {
    alert('Please do not use special characters in the name or status field');
    return;
  }

  // Check if the amount is a valid number
  const amount = parseFloat(newItem.amount);
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  // Check if the spent is a valid number
  const spent = parseFloat(newItem.spent);
  if (isNaN(spent) || spent <= 0) {
    alert('Please enter a valid spent amount');
    return;
  }

  // If expiry date is not provided, use the current date
  let expiryDate = newItem.expiryDate;
  if (!expiryDate) {
    const currentDate = new Date();
    expiryDate = currentDate.toLocaleDateString('en-GB');
  }

  // Format the spent amount with Australian dollar symbol
  const formattedSpent = `${parseFloat(newItem.spent).toFixed(2)}`;

  // Calculate the status based on the expiry date
  const status = calculateStatus(expiryDate);

  // Find all items with the same name in the inventory
  const itemsWithSameName = inventory.filter(item => item.name === newItem.name);

  // Determine the batch number for the new item
  const batchNumber = itemsWithSameName.length + 1;

  // Create a new item object with the appropriate name
  const newInventoryItem = {
    id: inventory.length + 1,
    name: batchNumber > 1 ? `${newItem.name} - Batch ${batchNumber}` : newItem.name,
    amount: parseFloat(newItem.amount),
    spent: formattedSpent,
    expiryDate: expiryDate,
    status: status
  };

  // Add the new item to the inventory
  const updatedInventory = [...inventory, newInventoryItem];
  setInventory(updatedInventory);
  localStorage.setItem('inventory', JSON.stringify(updatedInventory));

  // Reset the form fields and hide the add popup
  setNewItem({
    name: '',
    amount: '',
    spent: '',
    expiryDate: '',
    status: ''
  });
  setShowAddPopup(false);
};

  const populateItems = (name, amount, spent, expiryDate, status) => {
    const newInventoryItem = {
      id: inventory.length + 1,
      name: name,
      amount: amount,
      spent: spent,
      expiryDate: expiryDate,
      status: status
    };
    setInventory([...inventory, newInventoryItem]);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

const handleUpload = async (e) => {
  e.preventDefault();
  setUploadingImage(true); // Set uploadingImage to true while uploading
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://rohan222.pythonanywhere.com/rc', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    console.log(data);
    if (!data.name || !data.extracted_text) {
      // Image was uploaded but not read
      alert('Error reading image data, try another image.');
      setUploadingImage(false); // Set uploadingImage to false after uploading
      setShowScanReceiptPopup(false); // Close the popup in case of error
      return;
    }
    setName(data.name);
    setImgSrc(data.imgSrc);
    setExtractedText(data.extracted_text);
    setNewItem(prevItem => ({
      ...prevItem,
      name: data.name,
      amount: data.extracted_text,
      spent: data.msg,
      expiryDate: '',
      status: ''
    }));
    const startingId = inventory.length + 1;
    data.extracted_text.forEach((item, index) => {
      const newItem = {
        id: startingId + index,
        name: item.name,
        amount: item.amount,
        spent: item.spent,
        expiryDate: "29 Apr 2024",
        status: ''
      };
      setInventory(prevInventory => [...prevInventory, newItem]);
    });
    setNextItemId(startingId + data.extracted_text.length);
    // Resetting form fields and other relevant states
    setNewItem({
      name: '',
      amount: 0,
      spent: '',
      expiryDate: '',
      status: ''
    });
    setUploadingImage(false); // Set uploadingImage to false after uploading
    setShowAddPopup(false); // Close the popup after successful upload
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Something went wrong, please try again.'); // Image was not read
    setUploadingImage(false); // Set uploadingImage to false after uploading
    setShowScanReceiptPopup(false); // Close the popup in case of error
  }
};

  const handleFileChange1 = (e) => {
    setFile1(e.target.files[0]);
  };

const handleUpload2 = async (e) => {
  e.preventDefault(); // Prevent default form submission behavior
  setUploadingImage(true); // Set uploadingImage to true while uploading

  // Check if a file has been selected
  if (!file1) {
    alert('Please select a file.');
    return;
  }

  const formData = new FormData();
  formData.append('file1', file1);

  setShowScanProducePopup(false); // Close the popup

  try {
    const response = await fetch('https://rohan2101new.pythonanywhere.com/pred', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      // If response status is not OK, throw an error
      throw new Error('Error reading image data, try another image.');
        setUploadingImage(false); // Set uploadingImage to true while uploading

    }

    const data = await response.json();
    console.log(data);

    // Handle response data as needed
    // Update state variables accordingly
    setImgSrc1(data.imgSrc1);
    setExtractedText1(data.extracted_text1);
    setMsg1(data.msg1);
    const daysToAdd = parseInt(data.msg1, 10);
    const currentDate = new Date();

    currentDate.setDate(currentDate.getDate() + daysToAdd);
    const day = currentDate.getDate();
    const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(currentDate);
    const year = currentDate.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;
    console.log(formattedDate); // Output: "13 May 2024"
    setNewItem(prevItem => ({
      ...prevItem,
      name: '',
      amount: '',
      spent: '',
      expiryDate: data.extracted_text2,
      status: ''
    }));
    if (extractedText1 !== '' || msg1 !== '') {
      populateItems(data.extracted_text1, '', '', formattedDate, '');
    }
    else
    {
        alert('Something went wrong. Please try again.');
        setUploadingImage(false); // Set uploadingImage to true while uploading


    }
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Error reading image data, try another image.');
    setMsg1('Failed to upload image');
    setUploadingImage(false); // Set uploadingImage to true while uploading

  }
};




  const handleFileChange2 = (e) => {
    setFile2(e.target.files[0]);
  };

// Toggle blinking effect
useEffect(() => {
  if (!hasBlinked) {
    const blinkInterval = setInterval(() => {
      setBlink(prevBlink => !prevBlink);
    }, 1000);

    // Clear interval after one blink
    setTimeout(() => {
      clearInterval(blinkInterval);
      setHasBlinked(true);
    }, 1000);

    return () => clearInterval(blinkInterval); // Clear interval when unmounting or button has blinked
  }
}, [hasBlinked]);

  const handleUpload3 = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file2', file2);

    try {
      const response = await fetch('https://rohan22.pythonanywhere.com/recpt', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log(data);
      setImgSrc2(data.imgSrc2);
      setExtractedText2(data.extracted_text2);
      setMsg2('Image uploaded successfully!');
      setNewItem(prevItem => ({
        ...prevItem,
        name: '',
        amount: '',
        spent: '',
        expiryDate: "20 Apr 2023",
        status: ''
      }));
if (extractedText2 !== '' || msg2 !== '') {
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
    populateItems('', '', '', formattedDate, '');
    alert("Successfully scanned the image!");
    togglePopup('package');
}

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };


  return (
    <div>
      {isPopupActive && <div className="modal-overlay" onClick={closeAllPopups}></div>}
      <div className="main-content"></div>

      {/* inventory main content */}
      <div className="App">


  <div className="inv-header-container">
  <p className="inv-header-text">Begin Your Flavorful Journey Here!
</p>
<div className="personalized-button"><button> See my personalized analysis</button>
</div></div>
        <header></header>
        <div className="table-and-buttons">
        <div className="inventory-table-container">


        <InventoryList
  inventory={currentInventory}
  onEdit={handleEditItem}
  onDelete={handleDeleteItem}
  togglePopup={togglePopup}
  onEditingItemChange={handleEditingItemChange}
/>
        </div>


        <div className="actions">
                    <button
              onClick={() => togglePopup('receipt')}
                          className="add-button"
              disabled={editingItem !== null}>
              Scan Receipt
            </button>
        <button
            className="add-button"
            onClick={() => togglePopup('add')}
            disabled={editingItem !== null}>
            Add Additional Items
          </button>

               <button onClick={() => togglePopup('produce')}  disabled={editingItem !== null}
                           className="add-button"
  >Scan Fresh Produce</button>

          {showAddPopup && (
            <div
              className="modal-overlay"
              onClick={() => setShowAddPopup(false)}
            ></div>
          )}
          {inventory.length > 0 && (

<Link to="/recipes">
  <button className={`generate-button ${hasOneItemInInventory && !hasBlinked ? 'blink' : ''}`}>Generate recipes!</button>
</Link>

)}


          {/* Add Popup */}
          {showAddPopup && (
            <div className="popup large-popup">
              <h2>Add New Item</h2>
              <div className="form-group">
                <label>Name:</label>
                <input type="text" name="name" value={newItem.name} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Quantity:</label>
                <input type="text" name="amount" value={newItem.amount} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <div className="form-group">
                  <label>Price:</label>
                  <input type="text" name="spent" value={newItem.spent} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Expiry Date:</label>
                <DatePicker
                  selected={expiryPlaceholder}
                  onChange={(date) => {
                    // Format the selected date
                    const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    // Set the formatted date to the expiryPlaceholder
                    setExpiryPlaceholder(date);
                    // Update the expiry date in newItem
                    setNewItem(prevItem => ({ ...prevItem, expiryDate: formattedDate }));
                  }}
                  dateFormat="dd MMM yyyy"

                  // Add a specific class name for date picker in adding item mode
                  className="date-picker add-date-picker"
                />
              </div>

              <div className="form-actions">
                <button onClick={handleAddItem}>Save</button>
                <button onClick={() => togglePopup('add')}>Cancel</button>
              </div>
            </div>

          )}

          {/* Scan Receipt Popup */}
     {showScanReceiptPopup && (
  <div className="popup">
    <h2>Scan Receipt</h2>
    {setUploadingImage && <div className="loading-overlay">Loading...</div>}
    <div className="scan-options">
      <form onSubmit={handleUpload} encType="multipart/form-data">
        <input type="file" name="file" onChange={handleFileChange} />
        <input type="submit" value="Upload" />
      </form>
      {imgSrc && <img src={imgSrc} alt="Uploaded" />}
    </div>
    <button onClick={() => togglePopup('receipt')}>Cancel</button>
  </div>
)}


          {/* Scan Package Popup */}
          {showScanPackagePopup && (

            <div className="popup">
              <h2>Scan Package</h2>
              <div className="scan-options">
                <form onSubmit={handleUpload3} encType="multipart/form-data">
                  <input type="file" name="file2" onChange={handleFileChange2} />
                  <input type="submit" value="Upload" />
                </form>
                {imgSrc2 && <img src={imgSrc2} alt="Uploaded" />}
              </div>
              <button onClick={() => togglePopup('package')}>Cancel</button>
            </div>

          )}

{showScanProducePopup && (
  <div className="popup">
    <h2>Scan Produce</h2>
    {setUploadingImage && <div className="loading-overlay">Loading...</div>}
    <div className="scan-options">
      <form id="uploadForm" onSubmit={handleUpload2} encType="multipart/form-data">
        <input type="file" name="file1" onChange={handleFileChange1} />
        <input type="submit" value="Upload" />
      </form>
      {imgSrc1 && <img src={imgSrc1} alt="Uploaded" />}
      {/* populateItems(extractedText1, '', '', msg1, ''); */}
    </div>
    <button onClick={() => togglePopup('produce')}>Cancel</button>
  </div>
)}

        </div>
      </div>
      </div>
<div className="pagination">
  <button
    onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <span>{`Page ${currentPage} of ${totalPages}`}</span>
  <button
    onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    Next
  </button>

</div>

 {showCongratsPopup && (
        <div className="congrats-popup">
          <p>Congratulations on starting your inventory! Check out some recipes now.</p>
        </div>
      )}

<Dashboard />
    </div>


  );
}

export default Maininventory;