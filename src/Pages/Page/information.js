import React, { useState, useEffect } from 'react';
import './information.css';
import AUMap from './au-map';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { throttle } from 'lodash';

// Food Journey
const steps = [
  {
    id: 1,
    name: "Plan and Purchase",
    description: "Plan meals and use a shopping list.",
    color: "#fde47f",
    tips: ["·Tip 1 for Plan and Purchase", "·Tip 2 for Plan and Purchase"]
  },
  {
    id: 2,
    name: "Proper Storage",
    description: "Store food correctly to extend freshness.",
    color: "#e0e0e0",
    tips: ["·Tip 1 for Plan and Purchase", "·Tip 2 for Plan and Purchase"]
  },
  {
    id: 3,
    name: "Preparation",
    description: "Cook realistically to avoid unnecessary leftovers.",
    color: "#f0f8ff",
    tips: ["·Tip 1 for Plan and Purchase", "·Tip 2 for Plan and Purchase"]
  },
  {
    id: 4,
    name: "Utilizing Leftovers",
    description: "Repurpose leftovers into new meals.",
    color: "#d1c4e9",
    tips: ["·Tip 1 for Plan and Purchase", "·Tip 2 for Plan and Purchase"]
  },
  {
    id: 5,
    name: "Composting",
    description: "Compost food waste instead of disposing of it.",
    color: "#b2dfdb",
    tips: ["·Tip 1 for Plan and Purchase", "·Tip 2 for Plan and Purchase"]
  }
];


const itemVariants = {
  hidden: { scale: 0.95, y: 50, opacity: 0 },
  visible: {
    scale: 1,
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  },

};

const StepCard = ({ step }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.5
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={itemVariants}
      className="step-card"
      style={{ backgroundColor: step.color }}
    >
      <div className="step-content">
        <h2 className="step-title">{step.name}</h2>
        <p className="step-description">{step.description}</p>
      </div>
      <div className="step-tips-container">
        {step.tips.map((tip, index) => (
          <p key={index} className="step-tip">{tip}</p>
        ))}
      </div>
    </motion.div>
  );
};

const FoodJourneyAnimation = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = throttle(() => {
    const cards = document.querySelectorAll('.step-card');


    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const containerRect = card.parentElement.getBoundingClientRect();

      if (cardRect.top >= containerRect.top && cardRect.bottom <= containerRect.bottom) {
        if (activeIndex !== index) {
          setActiveIndex(index);
        }
      } else {
        if (activeIndex === index) {
          setActiveIndex(null);
        }
      }

      console.log('cardRect.top:', cardRect.top, 'containerRect.top:', containerRect.top);
      console.log('cardRect.bottom:', cardRect.bottom, 'containerRect.bottom:', containerRect.bottom);
    });
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeIndex, handleScroll]);

  return (
    <div className="journey-container">
      {steps.map((step, index) => (
        <StepCard key={step.id} step={step} isActive={index === activeIndex} />
      ))}
    </div>
  );
};


// Map
const stateNews = {
  WA: [
    {
      imageUrl: "news-thumbnail-1.jpg",
      title: "WA 1",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "WA 2",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "WA 2",
      link: "https://example.com/news1"
    },
  ],

  QLD: [
    {
      imageUrl: "news-thumbnail-1.jpg",
      title: "QLD 1",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "QLD 2",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "QLD 2",
      link: "https://example.com/news1"
    },
  ],

  NT: [
    {
      imageUrl: "news-thumbnail-1.jpg",
      title: "NT 1",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "NT 2",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "NT 2",
      link: "https://example.com/news1"
    },
  ],

  SA: [
    {
      imageUrl: "news-thumbnail-1.jpg",
      title: "SA 1",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "SA 2",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "WA 2",
      link: "https://example.com/news1"
    },
  ],

  VIC: [
    {
      imageUrl: "news-thumbnail-1.jpg",
      title: "VIC 1",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "VIC 2",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "VIC 2",
      link: "https://example.com/news1"
    },
  ],

  NSW: [
    {
      imageUrl: "news-thumbnail-1.jpg",
      title: "NSW 1",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "NSW 2",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "NSW 2",
      link: "https://example.com/news1"
    },
  ],

  TAS: [
    {
      imageUrl: "news-thumbnail-1.jpg",
      title: "TAS 1",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "TAS 2",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "TAS 2",
      link: "https://example.com/news1"
    },
  ],

  ACT: [
    {
      imageUrl: "news-thumbnail-1.jpg",
      title: "ACT 1",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "ACT 2",
      link: "https://example.com/news1"
    },
    {
      imageUrl: "news-thumbnail-2.jpg",
      title: "ACT 2",
      link: "https://example.com/news1"
    },
  ],
};

const renderNewsItems = (newsLinks, onClose) => {
  return (
    <>
      <div className="close-button" onClick={onClose}>
        &times;
      </div>
      {newsLinks.map((newsItem, index) => (
        <div key={index} className="news-item">
          <div className="news-theme">{newsItem.theme}</div>
          <img src={newsItem.imageUrl} alt="news thumbnail" className="news-thumbnail" />
          <div className="news-title">{newsItem.title}</div>
          <a href={newsItem.link} className="news-link" target="_blank" rel="noopener noreferrer">Read More</a>
        </div>
      ))}
    </>
  );
};

// integrate Map and Food Journey to Information Page
export const Information = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [newsLinks, setNewsLinks] = useState([]);
  const [activeSection, setActiveSection] = useState('journey');
  // news closing
  const handleCloseNews = () => {
    setSelectedState(null);
    setNewsLinks([]);
  };

  const handleStateClick = (state) => {
    console.log("State clicked:", state);
    setSelectedState(state);
    setNewsLinks(stateNews[state] || []);
    setActiveSection('newsMap');
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


      {/* content  */}
      <div className="information-container">
        <div className="sidebar">
          <div className="information">Information</div>
          <button
            className={activeSection === 'journey' ? 'active' : ''}
            onClick={() => setActiveSection('journey')}
          >
            Food Waste Journey
          </button>
          <button
            className={activeSection === 'newsMap' ? 'active' : ''}
            onClick={() => setActiveSection('newsMap')}
          >
            News Map
          </button>
        </div>

        <div className="content">
          {activeSection === 'journey' && (
            <>
              <h1 className="information-title">Food Waste Journey</h1>
              <FoodJourneyAnimation />
            </>
          )}

          {activeSection === 'newsMap' && (
            <>
              <h1 className="information-title">News Map</h1>
              <p className="information-text">
                Click on a state on the map below to learn more about Food Waste and Climate Change.
              </p>
              <div className={`news-container ${newsContainerPosition} ${newsLinks.length > 0 ? 'show' : ''}`}>
                {renderNewsItems(newsLinks, handleCloseNews)}
              </div>
              <div className="map-container">
                <AUMap
                  onStateClick={handleStateClick}
                  selectedState={selectedState}
                  className={selectedState ? 'au-map state-selected' : 'au-map'}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}





