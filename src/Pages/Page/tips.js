import React, { useState, useEffect, useRef } from 'react';
import './tips.css';
import tipsdata from './tips-data.json';
import { Link } from 'react-router-dom';
import { calculateStatus } from './calculateStatus';
import Fuse from 'fuse.js';



// image resources
// front images
import cannedLogo from '../images/tips/canned-logo.png';
import dairyLogo from '../images/tips/dairy-logo.png';
import fruitLogo from '../images/tips/fruit-logo.png';
import grainsLogo from '../images/tips/grains-logo.png';
import meatLogo from '../images/tips/meat-logo.png';
import vegeLogo from '../images/tips/vegie-logo.png';
// back images
import vegeTip from '../images/tips/vegie-tip.png';
import meatTip from '../images/tips/meat-tip.png';
import dairyTip from '../images/tips/dairy-tip.png';
import grainsTip from '../images/tips/grains-tip.png';
import cannedTip from '../images/tips/canned-tip.png';
import fruitTip from '../images/tips/fruit-tip.png';
// images for tips results 
import additionalLogo from '../images/tips/additional-logo.png';
import pantryLogo from '../images/tips/pantry-logo.png';
import freezerLogo from '../images/tips/freezer-logo.png';
import refrigeratorLogo from '../images/tips/refrigerator-logo.png';
// footer image
import footer from '../images/tips/tips-footer.png';




const ErrorModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          <p>The keyword you searched for is not in our database, please search again.</p>
        </div>
        <div className="modal-footer">
          <button className="modal-button" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};


const TipsContent = ({ selectedResult }) => {
  if (!selectedResult) return null;

  // Split using line breaks
  const sections = selectedResult.Tips.split(/\n/);

  return (
    <div className="tips-final-content">
      {sections.map((section, index) => {
        // Cutting titles and content
        const splitIndex = section.indexOf(':');
        const title = section.substring(0, splitIndex).trim();
        const content = section.substring(splitIndex + 1).trim();

        // Determine the logo based on the title
        let logo;
        if (title.toLowerCase().includes('pantry')) {
          logo = pantryLogo;
        } else if (title.toLowerCase().includes('freezer')) {
          logo = freezerLogo;
        } else if (title.toLowerCase().includes('refrigerat')) {
          logo = refrigeratorLogo;
        } else {
          logo = additionalLogo;
        }

        return (
          <div key={index} className="tips-section">
            <h4>
              {title}
              <img src={logo} alt={`${title} logo`} className="title-logo" />
            </h4>
            <p>{content}</p>
          </div>
        );
      })}
    </div>
  );
};


export const Tips = () => {
  const [showInitialContent, setShowInitialContent] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const searchResultsRef = useRef(null);

  // get not-expiry items name 
  const [validInventoryNames, setValidInventoryNames] = useState([]);
  useEffect(() => {
    try {
      console.log('Attempting to read inventory from localStorage...');
      const storedInventory = localStorage.getItem('inventory');
      if (storedInventory) {
        console.log('Stored inventory:', storedInventory);
        const parsedInventory = JSON.parse(storedInventory);
        // get unexpired items
        const validItems = parsedInventory.filter(item => {
          const status = calculateStatus(item.expiryDate);
          console.log(`Item: ${item.name}, ExpiryDate: ${item.expiryDate}, Status:`, status);
          // unexpired items 
          return status.color === 'green' || status.color === '#DAA520';
        });

        // Convert names to lowercase before getting unique names
        const uniqueNames = [...new Set(validItems.map(item => item.name.toLowerCase()))];

        console.log('Valid inventory names:', uniqueNames);
        setValidInventoryNames(uniqueNames);
      } else {
        console.log('No inventory found in localStorage.');
      }
    } catch (error) {
      console.error('Error parsing inventory:', error);
    }
  }, []);

  //  search keywords
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);


  const [searchPerformed, setSearchPerformed] = useState(false);
  const handleSearch = (name) => {
    // Clear previous search results and selected result
    setSearchResults([]);
    setSelectedResult(null);

    // Preprocessing user input
    let processedName = name.trim();

    // If the search bar is empty, reset the search value and return
    if (processedName === '') {
      setSearchValue('');
      setShowInitialContent(true);
      return;
    }

    // Check if the input is a number
    if (/^\d+$/.test(processedName)) {
      setShowInitialContent(false);
      setShowErrorModal(true);
      setSearchValue(name);
      return;
    }

    // Convert to lowercase
    processedName = processedName.toLowerCase();

    // Segment user input keywords
    const inputKeywords = processedName.split(' ');

    // Generate all combinations of keywords
    const keywordCombinations = generateCombinations(inputKeywords);

    // Sort keyword combinations in descending order of length
    keywordCombinations.sort((a, b) => b.length - a.length);

    // Try to match keyword combinations one by one
    for (const combination of keywordCombinations) {
      const combinationString = combination.join(' ');
      const results = tipsdata.filter(item => {
        const itemKeywords = item.Keywords.toLowerCase().split(', ');
        return itemKeywords.includes(combinationString);
      });

      if (results.length > 0) {
        setSearchResults(results);
        setShowInitialContent(false);
        setShowErrorModal(false);
        setSearchValue(name);
        setSearchPerformed(true);



        // If there is only one search result, automatically select and display it
        if (results.length === 1) {
          setSelectedResult(results[0]);
        }
        // if (searchResultsRef.current) {
        //   searchResultsRef.current.scrollIntoView({ behavior: 'smooth' });
        // }
        return;
      }
    }

    // If there are no exact matches, try fuzzy matching
    const threshold = 0.3; // Set the matching threshold, e.g., 0.3
    const fuse = new Fuse(tipsdata, {
      keys: ['Keywords'],
      threshold: threshold,
      includeScore: true,
    });

    const fuzzyResults = fuse.search(processedName);

    if (fuzzyResults.length > 0) {
      // Extract the matched items and their scores
      const matchedItems = fuzzyResults.map(result => ({
        item: result.item,
        score: result.score,
      }));

      // Sort the matched items by their scores in ascending order
      matchedItems.sort((a, b) => a.score - b.score);

      // Choose the best match (the item with the lowest score)
      const bestMatch = matchedItems[0].item;

      setSearchResults([bestMatch]);
      setShowInitialContent(false);
      setShowErrorModal(false);
      setSearchValue(name);
      setSelectedResult(bestMatch);
      setSearchPerformed(true);

      return;
    }

    // If there are no matches, show the error modal
    setShowInitialContent(false);
    setShowErrorModal(true);
    setSearchValue(name);
  };
  useEffect(() => {
    if (searchPerformed && searchResultsRef.current) {
      searchResultsRef.current.scrollIntoView({ behavior: 'smooth' });
      setSearchPerformed(false);
    }
  }, [searchPerformed, searchResultsRef]);


  // Generate all combinations of keywords
  function generateCombinations(keywords) {
    const combinations = [];

    for (let i = 0; i < keywords.length; i++) {
      combinations.push([keywords[i]]);

      for (let j = i + 1; j < keywords.length; j++) {
        combinations.push([keywords[i], keywords[j]]);

        for (let k = j + 1; k < keywords.length; k++) {
          combinations.push([keywords[i], keywords[j], keywords[k]]);
        }
      }
    }

    return combinations;
  }



  // error popup close
  const handleCloseModal = () => {
    setShowErrorModal(false);
    if (searchResults.length === 0) {
      setShowInitialContent(true);
    }
  };


  // Pages in inventory container
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const itemsPerPage = 10;
    if (validInventoryNames.length > 0) {
      const totalPages = Math.ceil(validInventoryNames.length / itemsPerPage);
      setTotalPages(totalPages);
    }
  }, [validInventoryNames]);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`page-number-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => goToPage(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };


  // Selected results processing logic
  const handleResultSelection = (result) => {
    setSelectedResult(result);
  };


  // quick tips
  const categoryTips = [
    { category: 'Meat', frontLogo: meatLogo, backLogo: meatTip },
    { category: 'Fruits', frontLogo: fruitLogo, backLogo: fruitTip },
    { category: 'Vegetables', frontLogo: vegeLogo, backLogo: vegeTip },
    { category: 'Dairy', frontLogo: dairyLogo, backLogo: dairyTip },
    { category: 'Grains', frontLogo: grainsLogo, backLogo: grainsTip },
    { category: 'Canned Foods', frontLogo: cannedLogo, backLogo: cannedTip },
  ];

  const CategoryTipItem = ({ frontLogo, backLogo }) => {
    const [showBackLogo, setShowBackLogo] = useState(false);

    const toggleLogo = () => {
      setShowBackLogo(!showBackLogo);
    };

    return (
      <div className="category-tip-item" onClick={toggleLogo}>
        <div className="category-logo-tip">
          <img src={frontLogo} alt="Category Front" className="logo-front" />
          <img src={backLogo} alt="Category Back" className="logo-back" />
        </div>
      </div>
    );
  };

  return (
    <div className="tips-whole-page">
      <div className="quick-category-tips">
        <h2 className="tips-section-title">Quick Category Tips</h2>
        <p className="guidance-paragraph">What is the best way to store your food by categories? Hover over the images below to find out!</p>
        <div className="category-tips-container">
          {categoryTips.map((item, index) => (
            <CategoryTipItem key={index} frontLogo={item.frontLogo} backLogo={item.backLogo} />
          ))}
        </div>
      </div>

      <div className="detailed-storage-tips">
        <h2 className="tips-section-title">Not enough? Try More Below</h2>
        {/* <p className="guidance-paragraph">Not enough? Try More Below</p> */}
      </div>
      {/* Detailed Storage Tips content */}
      <h2 className="centered-title">Your Inventory</h2>
      <p className="explanatory-text">Try clicking on the item below and scroll down, you may get ways to extend their shelf life.</p>
      <div className="inventory-tips-container">
        {validInventoryNames.length > 0 ? (
          validInventoryNames
            .slice((currentPage - 1) * 10, currentPage * 10)  // Only show 10 items per page
            .map((name, index) => (
              <button
                key={index}
                className={`inventory-item-button ${searchValue === name ? 'selected' : ''}`}
                onClick={() => handleSearch(name)}
              >
                <span className="item-text">{name}</span>
              </button>
            ))
        ) : (
          <p className="centered-message-inventory">
            Sorry, There are NO items in your inventory or all items have EXPIRED. Click here to {' '}
            <Link to="/inventory" className="link-style">ADD FRESH ONES</Link> to inventory or use the Search Bar below to manually search for storage tips.
          </p>
        )}
      </div>
      <div className="tips-pagination-controls">
        {renderPageNumbers()}
      </div>


      <h2 className="centered-title">Search By Keywords</h2>
      <p className="explanatory-text">We may handle keywords Incorrectly above,or you wanna Find Out More, so try entering more explicit keywords manually below!</p>
      <div className="tips-search-area">
        <input
          type="text"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="Enter some keywords like oil, cheese ..."
        />
        <button
          className="tips-search-button"
          onClick={() => handleSearch(searchValue)}
        >
          Search
        </button>
      </div>

      {searchResults.length === 0 && showInitialContent && (
        <div className="initial-content-footer">
          <img src={footer} alt="Footer Image" />
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="result-tips-container" ref={searchResultsRef}>
          <div className="tips-results-area">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className={`tips-result-item ${selectedResult === result ? 'selected' : ''}`}
                onClick={() => handleResultSelection(result)}
              >
                {result.Category_Name} — {result.Name}
              </div>
            ))}
          </div>

          {!selectedResult && (
            <div className="tips-initial-placeholder">
              <p>Click on any of the results on the left to view the relevant storage tips.</p>
            </div>
          )}

          {selectedResult && (
            <TipsContent selectedResult={selectedResult} />
          )}
        </div>
      )}

      <ErrorModal isOpen={showErrorModal} onClose={handleCloseModal} />
    </div>
  );
};
