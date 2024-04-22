import React, { useState } from 'react';
import './information.css';
import AUMap from './au-map';

export const Information = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [newsLinks, setNewsLinks] = useState([]);


  const stateNews = {
    WA: [
      {
        theme: "Topic 1",
        imageUrl: "news-thumbnail-1.jpg", 
        title: "WA 1",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 2",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "WA 2",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 3",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "WA 2",
        link: "https://example.com/news1"
      },
    ],
    
    

    QLD: [
      // 
      {
        theme: "Topic 1",
        imageUrl: "news-thumbnail-1.jpg", 
        title: "QLD 1",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 2",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "QLD 2",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 3",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "QLD 2",
        link: "https://example.com/news1"
      },
    ],




    NT: [
      {
        theme: "Topic 1",
        imageUrl: "news-thumbnail-1.jpg", 
        title: "NT 1",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 2",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "NT 2",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 3",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "NT 2",
        link: "https://example.com/news1"
      },
    ],


    SA: [
      {
        theme: "Topic 1",
        imageUrl: "news-thumbnail-1.jpg", 
        title: "SA 1",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 2",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "SA 2",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 3",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "WA 2",
        link: "https://example.com/news1"
      },
    ],




    VIC: [
      
      {
        theme: "Topic 1",
        imageUrl: "news-thumbnail-1.jpg", 
        title: "VIC 1",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 2",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "VIC 2",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 3",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "VIC 2",
        link: "https://example.com/news1"
      },
    ],


    NSW: [
      
      {
        theme: "Topic 1",
        imageUrl: "news-thumbnail-1.jpg", 
        title: "NSW 1",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 2",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "NSW 2",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 3",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "NSW 2",
        link: "https://example.com/news1"
      },
    ],

    TAS: [
      
      {
        theme: "Topic 1",
        imageUrl: "news-thumbnail-1.jpg", 
        title: "TAS 1",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 2",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "TAS 2",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 3",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "TAS 2",
        link: "https://example.com/news1"
      },
    ],

    ACT: [
      
      {
        theme: "Topic 1",
        imageUrl: "news-thumbnail-1.jpg", 
        title: "ACT 1",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 2",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "ACT 2",
        link: "https://example.com/news1"
      },
      {
        theme: "Topic 3",
        imageUrl: "news-thumbnail-2.jpg", 
        title: "ACT 2",
        link: "https://example.com/news1"
      },
    ],
  };


  const handleStateClick = (state) => {
    console.log("State clicked:", state);
    setSelectedState(state);
    setNewsLinks(stateNews[state] || []);
  };



  const renderNewsItems = () => {
    return newsLinks.map((newsItem, index) => (
      <div key={index} className="news-item">
        <div className="news-theme">{newsItem.theme}</div>
        <img src={newsItem.imageUrl} alt="news thumbnail" className="news-thumbnail" />
        <div className="news-title">{newsItem.title}</div>
        <a href={newsItem.link} className="news-link" target="_blank" rel="noopener noreferrer"> Read More</a>
      </div>
    ));
  };


  // news dispaly position
  const newsContainerPosition = selectedState && ['WA', 'NT', 'SA'].includes(selectedState) ? 'left' : 'right';






  return (
    <div>
      <div className="toolbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="applogo.png" alt="App Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
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


      <div className="information-container">
        <h1 className="information-title">Information</h1>
        <p className="information-text">
          Click on a state on the map below to learn more about Food Waste and Climate Change.
        </p>

        <div className={`news-container ${newsContainerPosition} ${newsLinks.length > 0 ? 'show' : ''}`}>
          {renderNewsItems()}
        </div>
        
        <div className="map-container">
          <AUMap
            onStateClick={handleStateClick}
            selectedState={selectedState}
            className={selectedState ? 'au-map state-selected' : 'au-map'}
          />
        </div>
        
      </div>

    </div>
  );
}





