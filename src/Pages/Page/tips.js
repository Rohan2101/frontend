import React, { useState } from 'react';
import './tips.css';
import tipsdata from './tips-data.json';  // Updated to the new JSON file

const ErrorModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          <p>The keyword you searched for is not in our database, please search again.</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export const Tips = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showInitialContent, setShowInitialContent] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSearch = () => {
    if (searchValue) {
      const keywords = searchValue.toLowerCase().split(' ');
      const results = tipsdata.filter(item =>
        keywords.every(keyword =>
          item.Keywords.toLowerCase().includes(keyword)
        )
      );
      console.log('Search results:', results);
      setSearchResults(results);
      setSelectedResult(null);
      setShowInitialContent(false);
      setShowErrorModal(results.length === 0);
    } else {
      setSearchResults([]);
      setSelectedResult(null);
      setShowInitialContent(true);
      setShowErrorModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
    if (searchResults.length === 0) {
      setShowInitialContent(true);
    }
  };

  return (
    <div className="tips-page">
      <div className="inventory-tips-container">
        {/* Add storage tips based on inventory here */}
      </div>

      <div className="search-area">
        <input
          type="text"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="Search for food storage tips..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {searchResults.length === 0 && (
        <div className="initial-content">
          <p>This is where the initial content goes. You can place any content you want to display here.</p>
          {/* You can add more content here, such as images, links, etc. */}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="result-tips-container">
          <div className="results-area">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className={`result-item ${selectedResult === result ? 'selected' : ''}`}
                onClick={() => setSelectedResult(result)}
              >
                {result.Category_Name} — {result.Name} ({result.Keywords})
              </div>
            ))}
          </div>

          {!selectedResult && (
            <div className="tips-placeholder">
              <p>Click on any of the results on the left to view the relevant storage tips.</p>
            </div>
          )}

          {selectedResult && (
            <div className="tips-content">
              <h4>{selectedResult.Category_Name} — {selectedResult.Name} ({selectedResult.Keywords})</h4>
              <p>{selectedResult.Tips}</p>
            </div>
          )}
        </div>
      )}
      <ErrorModal isOpen={showErrorModal} onClose={handleCloseModal} />
    </div>
  );
};
