import React, { useState, useEffect, useRef } from 'react';
import InventoryList from './components/InventoryList';
import './App.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



import statusGreen from './images/status-green.png';
import statusYellow from './images/status-yellow.png';
import statusRed from './images/status-red.png';


import statusIndicator from './images/status-indicator.png';



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

  // if (diffDays <= 0) {
  //   return './images/status-red.png';
  // } else if (diffDays <= 5) {
  //   return './images/status-yellow.png';
  // } else {
  //   return './images/status-green.png';
  // }

  // set 3 period(safe/reminder/alert) for status
  if (Math.ceil(diffDays) < 0) {
    return statusRed;
  } else if (Math.ceil(diffDays) === 0) {
    return statusRed
  } else if (Math.ceil(diffDays) <= 5) {
    return statusYellow;
  } else {
    return statusGreen;
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


  // for status indicator popup 
  const [showStatusModal, setShowStatusModal] = useState(false);


  // const webcamRef = useRef(null);

  // // Define handleEditItem function
  // const handleEditItem = (id, updatedItem) => {
  //   // Find the item in the inventory array and update it
  //   const updatedInventory = inventory.map(item => {
  //     if (item.id === id) {
  //       //return { ...item, ...updatedItem };
  //       return updatedItem;
  //     }
  //     return item;
  //   });
  //   setInventory(updatedInventory);
  //   //localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  // };

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



  //  useEffect(() => {
  //    // Check expiry dates against current date
  //    const updatedInventory = inventory.map(item => {
  //      // Split the date string and rearrange it to "YYYY-MM-DD" format
  //      const parts = item.expiryDate.split('/');
  //      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

  //      const expiryDate = new Date(formattedDate);
  //      const currentDate = new Date();

  //      if (expiryDate < currentDate) {
  //        console.log("Item expired:", item.name);
  //        return { ...item, status: 'Expired' };
  //      } else {
  //        console.log("Item not expired:", item.name);
  //        return { ...item, status: 'Not Expired' };
  //      }
  //    });
  //    setInventory(updatedInventory);
  //  }, []);





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
    // if (specialCharsRegex.test(newItem.name) || specialCharsRegex.test(newItem.status)) {
    //   alert('Please do not use special characters in the name or status field');
    //   return;
    // }
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

    // Create a new item object
    const newInventoryItem = {
      id: inventory.length + 1,
      name: newItem.name,
      amount: parseFloat(newItem.amount),
      spent: formattedSpent,
      expiryDate: expiryDate,
      status: status
    };

    // Add the new item to the inventory
    const updatedInventory = [...inventory, newInventoryItem];
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));

    // Check expiry date and update status for the new item
    // const updatedInventoryWithStatus = updatedInventory.map(item => {
    //   if (item.id === newInventoryItem.id) {
    //     const parts = item.expiryDate.split('/');
    //     const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    //     const expiryDate = new Date(formattedDate);
    //     const currentDate = new Date();

    //     if (expiryDate < currentDate) {
    //       return { ...item, status: 'Expired' };
    //     } else {
    //       return { ...item, status: 'Not Expired' };
    //     }
    //   }
    //   return item;
    // });
    // setInventory(updatedInventoryWithStatus);


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
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://rohan2121.pythonanywhere.com/', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log(data);
      setName(data.name);
      setImgSrc(data.imgSrc);
      setExtractedText(data.extracted_text);
      setMsg(data.msg);
      setNewItem(prevItem => ({
        ...prevItem,
        name: data.name,
        amount: data.extracted_text,
        spent: data.msg,
        expiryDate: '',
        status: ''
      }));
      if (extractedText !== '' || msg !== '') {
        populateItems(data.name, data.extracted_text, data.msg, '', '');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMsg('Failed to upload image');
    }
  };

  const handleFileChange1 = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleUpload2 = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file1', file1);
    setShowScanReceiptPopup(false); // Close the popup
    try {
      const response = await fetch('https://new12222-18275757747f.herokuapp.com/pred', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log(data);
      setImgSrc1(data.imgSrc1);
      setExtractedText1(data.extracted_text1);
      setMsg1(data.msg1);
      const daysToAdd = parseInt(data.msg1, 10);
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + daysToAdd);
      const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
      if (extractedText1 !== '' || msg1 !== '') {
        populateItems(data.extracted_text1, '', '', formattedDate, '');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMsg1('Failed to upload image');
    }
  };

  const handleFileChange2 = (e) => {
    setFile2(e.target.files[0]);
  };

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
        expiryDate: data.extracted_text2,
        status: ''
      }));
      if (extractedText2 !== '' || msg2 !== '') {
        populateItems('', '', '', data.extracted_text2, '');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMsg('Failed to upload image');
    }
  };

  return (


    <div>
      {isPopupActive && <div className="modal-overlay" onClick={closeAllPopups}></div>}
      <div className="main-content"></div>
      <div className="toolbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="ProjectLogo.png" alt="App Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
          <span style={{ color: 'green', fontWeight: 'bold' }}>EcoEats</span>
        </div>
        <div className="toolbardiv">
          <button onClick={() => console.log("Recipes clicked")}>Recipes</button>
          <button onClick={() => console.log("Information clicked")}>Information</button>
          <button onClick={() => console.log("Recycling Agencies Clicked")}>Recycling Agencies</button>
          <button onClick={() => console.log("Check My Knowledge Clicked")}>Check My Knowledge</button>
        </div>
        <div></div>
      </div>
      <div className="App">
        <header></header>
        <InventoryList
          inventory={inventory}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}

          togglePopup={togglePopup} // Add this line to pass the function as a prop
        />
        <div className="actions">
          <button className="add-button" onClick={() => togglePopup('add')}>Add Manually</button>
          <div className="scan-buttons">
            <button onClick={() => togglePopup('receipt')}>Scan Receipt</button>
            {/* <button onClick={() => togglePopup('package')}>Scan Package</button>
            <button onClick={() => togglePopup('produce')}>Scan Fresh Produce</button> */}
          </div>



          {showAddPopup && (
            <div
              className="modal-overlay"
              onClick={() => setShowAddPopup(false)}
            ></div>
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

              {/* scan  bottons to get expiry date directly
              <div className="scan-buttons">
                <button onClick={() => togglePopup('package')}>Scan Package</button>
                <button onClick={() => togglePopup('produce')}>Scan Fresh Produce</button>
              </div>
              */}


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

          {/* Scan Fresh Produce Popup */}
          {showScanProducePopup && (

            <div className="popup">
              <h2>Scan Produce</h2>

              <div className="scan-options">
                <form id="uploadForm" onSubmit={handleUpload2} encType="multipart/form-data">
                  <input type="file" name="file1" onChange={handleFileChange1} />
                  <input type="submit" value="Upload" />
                </form>
                {imgSrc1 && <img src={imgSrc1} alt="Uploaded" />}
                {/* populateItems(extractedText1, '', '', msg1, ''); */}
              </div>
              {/* <button onClick={() => {
              document.getElementById("uploadForm").submit();
              populateItems(extractedText1, '', '', msg1, '');
              }}>Upload</button> */}
              <button onClick={() => togglePopup('produce')}>Cancel</button>
            </div>
          )}

          {/* Show Status Indicator Popup */}
          {showStatusModal && (
            <div className="popup status-popup">
              <div className="content">
                <img src={statusIndicator} alt="Status Indicator"  />
              </div>
              <button className="center-button" onClick={() => togglePopup('statusInfo')}>Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Maininventory;
