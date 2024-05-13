import React, { useState, useEffect, useRef } from 'react';
import logo from "../ProjectLogo.png"; // Import the image

export const Navigation = (props) => {
  const [showScanProducePopup, setShowScanProducePopup] = useState(false);
  const [showUploadInfoPopup, setShowUploadInfoPopup] = useState(false);
  const [msg1, setMsg1] = useState('');
  const [file1, setFile1] = useState(null);
  const [imgSrc1, setImgSrc1] = useState('');
  const [extractedText1, setExtractedText1] = useState('');
  const togglePopup = (popupType) => {
    setShowScanProducePopup(false);

    switch (popupType) {
      case 'produce':
        setShowScanProducePopup(!showScanProducePopup);
        break;
      case 'uploadInfo':
        setShowUploadInfoPopup(!showUploadInfoPopup);
        break;  
      default:
        break;
    }
  };


  const handleFileChange1 = (e) => {
    setFile1(e.target.files[0]);
  };

const handleUpload2 = async (e) => {
  e.preventDefault(); // Prevent default form submission behavior

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
    }

    const data = await response.json();
    console.log(data);

    // Handle response data as needed
    // Update state variables accordingly
    setImgSrc1(data.imgSrc1);
    setExtractedText1(data.extracted_text1);
    setMsg1(data.msg1);
    togglePopup('uploadInfo');
    const daysToAdd = parseInt(data.msg1, 10);
    const currentDate = new Date();

    currentDate.setDate(currentDate.getDate() + daysToAdd);
    const day = currentDate.getDate();
    const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(currentDate);
    const year = currentDate.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;
    console.log(formattedDate); // Output: "13 May 2024"

  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Error reading image data, try another image.');
    setMsg1('Failed to upload image');
  }
};


  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          {/* Container for the logo and text */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
              <a href="/">
                <img src={logo} style={{ width: '80px', height: '60px', marginRight: '0px', borderRadius: '50%', padding: '2px', boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)', transition: 'box-shadow 0.3s ease', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0px 0px 20px rgba(0, 0.2, 0.3, 0.8)' }} onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0px 0px 3px rgba(0, 0, 0, 0.5)' }}/>
              </a>
              <a className="navbar-brand page-scroll" style={{ padding: '25px' }} href="/">
              Ecopalette
            </a>{" "}
          </div>
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="/inventory" >
                Inventory
              </a>
            </li>
            <li>
              <a href="/recipes" className="page-scroll">
                Recipes
              </a>
            </li>


            <li>
              <a href="/tips" className="page-scroll"> 
                Tips
              </a>
            </li>


            <li>
              <a href="/About" className="page-scroll">
                About
              </a>
            </li>
            <li>
            <button onClick={() => togglePopup('produce')}  
                           className="add-button"         style={{
                            position: 'fixed',
                            top: '10px',
                            right: '10px', // Adjusted position to the top right corner
                            zIndex: '9999',
                            padding: '10px 20px',
                            backgroundColor: 'black',
                            color: 'red',
                            border: 'black',
                            borderRadius: '15px',
                            cursor: 'pointer',
                            boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.2)',
                            transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s',
                            overflow: 'hidden',
                            lineHeight: '1.2',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0px 0px 20px rgba(0.2, 0.2, 0.3, 0.8)' }}
                        onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0px 5px 5px rgba(0, 0, 0, 0.2)' }}
  >Fresh Produce scanner</button>
            </li>
          {/* Scan Fresh Produce Popup */}
          {showScanProducePopup && (

<div className="popup">
<h2 style={{textAlign: 'center', fontFamily: 'Arial, sans-serif'}}>Scan Your fresh Produce to get an estimated self life</h2>

  <div className="scan-options">
    <form id="uploadForm" onSubmit={handleUpload2} encType="multipart/form-data">
      <input type="file" name="file1" onChange={handleFileChange1} />
      <input type="submit" value="Upload" />
    </form>
    {imgSrc1 && <img src={imgSrc1} alt="Uploaded" />}
    {/* populateItems(extractedText1, '', '', msg1, ''); */}
  </div>
  <button onClick={() => togglePopup('produce')}     style={{
        display: 'block',
        margin: '0 auto',
    }}>Cancel</button>
</div>

)}
            {/* Upload Info Popup */}
            {showUploadInfoPopup && (
              <div className="popup">
                <h2 style={{textAlign: 'center', fontFamily: 'Arial, sans-serif'}}>Estimated Shelf life(in days)</h2>
                <h2 style={{textAlign: 'center', fontFamily: 'Arial, sans-serif'}}>{msg1}</h2>
                <div>
                  {/* <p>Fruit Name: {extractedText1}</p> */}
                  {/* <p>Estimated Shelf life(in days): {msg1}</p> */}
                </div>
                <button onClick={() => togglePopup('uploadInfo')} style={{
        display: 'block',
        margin: '0 auto',
    }}>Close</button>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
