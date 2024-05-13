import React, { useState, useEffect } from 'react';
import './tips.css';
import tipsdata from './tips-data.json';
import { Link } from 'react-router-dom';
import { calculateStatus } from './calculateStatus';
import cannedLogo from '../images/canned-logo.png';
import dairyLogo from '../images/dairy-logo.png';
import fruitLogo from '../images/fruit-logo.png';
import grainsLogo from '../images/grains-logo.png';
import meatLogo from '../images/meat-logo.png';
import vegeLogo from '../images/vegie-logo.png';
import footer from '../images/tips-footer.png';
import Fuse from 'fuse.js';


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


// The TipsContent component is used to display segmented Tips information.
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

        return (
          <div key={index} className="tips-section">
            <h4>{title}</h4>
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

  const handleSearch = (name) => {
    // Preprocessing user input
    let processedName = name.trim();

    // Check if the input is a number
    if (/^\d+$/.test(processedName)) {
      setSearchResults([]);
      setSelectedResult(null);
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
        setSelectedResult(null);
        setShowInitialContent(false);
        setShowErrorModal(false);
        setSearchValue(name);
        // If there is only one search result, automatically select and display it
        if (results.length === 1) {
          setSelectedResult(results[0]);
        } else {
          setSelectedResult(null);
        }
        return;
      }
    }

    // If you don't get an exact match, try a fuzzy match.
    if (searchResults.length === 0) {
      const threshold = 0.3;
      const fuse = new Fuse(tipsdata, {
        keys: ['Keywords'],
        threshold: threshold,
        includeScore: true,
      });

      const fuzzyResults = fuse.search(processedName);

      if (fuzzyResults.length > 0) {
        // Extract matches
        const matchedItems = fuzzyResults.map(result => result.item);

        setSearchResults(matchedItems);
        setSelectedResult(null);
        setShowInitialContent(false);
        setShowErrorModal(false);
        setSearchValue(name);

        // If there is only one fuzzy match, it is automatically selected and displayed.
        if (matchedItems.length === 1) {
          setSelectedResult(matchedItems[0]);
        }

        // Show highest match score
        const highestScore = fuzzyResults[0].score;
        alert(`Found ${matchedItems.length} result(s) with ${(1 - highestScore).toFixed(2)} match score.`);

        return;
      }
    }

    // If there are no matches, show the error modal directly
    setSearchResults([]);
    setSelectedResult(null);
    setShowInitialContent(false);
    setShowErrorModal(true);
    setSearchValue(name);
  };

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


  // quick tips
  const categoryTips = [
    { category: 'Meat', tip: 'Freezer / Over 3 months', logo: meatLogo },
    { category: 'Fruits', tip: 'Refrigerate / 1 week', logo: fruitLogo },
    { category: 'Vegetables', tip: 'Refrigerate / 2 weeks', logo: vegeLogo },
    { category: 'Dairy', tip: 'Refrigerate / 2 weeks', logo: dairyLogo },
    { category: 'Grains', tip: 'Pantry / 6 months', logo: grainsLogo },
    { category: 'Canned Foods', tip: 'Pantry / 1 year', logo: cannedLogo },
  ];


  const CategoryTipItem = ({ category, tip, logo }) => {
    const [showTip, setShowTip] = useState(false);

    const toggleTip = () => {
      setShowTip(!showTip);
    };

    return (
      <div className="category-tip-item">
        <div className="category-name">{category}</div>
        <div className="category-logo-tip" onClick={toggleTip}>
          {showTip ? (
            <div className="tip-content">{tip}</div>
          ) : (
            <img src={logo} alt={`${category} logo`} />
          )}
        </div>
      </div>
    );
  };

  // Selected results processing logic
  const handleResultSelection = (result) => {
    setSelectedResult(result);
  };


  return (
    <div className="tips-whole-page">

      <div className="quick-category-tips">
        <h2 className="section-title">Quick Category Tips</h2>
        <p className="guidance-paragraph">What is the best way to store your food? Try clicking and flipping the image below!</p>
        <div className="category-tips-container">
          {categoryTips.map((item, index) => (
            <CategoryTipItem key={index} category={item.category} tip={item.tip} logo={item.logo} />
          ))}
        </div>
      </div>

      <div className="detailed-storage-tips">
        <h2 className="section-title">Detailed Storage Tips</h2>
        <p className="guidance-paragraph">Not enough? Try More Below</p>
        {/* Detailed Storage Tips content */}
      </div>

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
        <div className="result-tips-container">
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
