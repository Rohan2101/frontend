import React, { useState, useEffect } from 'react';
import './tips.css';

import AUMap from './au-map';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { throttle } from 'lodash';

import FoodWasteNews from './foodwastenews';

// Food Journey
const steps = [
  {
    id: 1,
    name: "Smart Shopping",
    description: "Make informed decisions during the purchasing stage",
    color: "#fde47f",
    tips: ["· Create a shopping list to avoid impulse buying", "· Choose seasonal and local to reduce carbon emission in transportation", "· Purchase the right quantities", "· Check the freshness and expiration carefully"]
  },
  {
    id: 2,
    name: "Proper Storage",
    description: "Store ingredients correctly to extend their shelf life and maintain freshness",
    color: "#e0e0e0",
    tips: ["· Know the storage requirements, such as temperature and humidity", "· Use appropriate containers and packaging to prolong the shelf life", "· Regularly check and handle spoiled or expired items", "· Organize fridge space wisely to avoid cross-contamination"]
  },
  {
    id: 3,
    name: "Creative Cooking",
    description: "Utilize every ingredient to its fullest potential with innovative cooking methods",
    color: "#f0f8ff",
    tips: ["· Learn diverse cooking techniques", "· Plan the cooking sequence based on the expiration dates of ingredients", "· Create new dishes with leftover ingredients"]
  },
  {
    id: 4,
    name: "Mindful Eating",
    description: "Develop good eating habits by focusing on the quality and quantity of food",
    color: "#d1c4e9",
    tips: ["· Control portion sizes", "· Listen to your hunger and fullness signals"]

  },
  {
    id: 5,
    name: "Recycling and Repurposing",
    description: "Transform leftover food and scraps into new resources to achieve food circularity",
    color: "#b2dfdb",
    tips: ["· Transform leftovers into new dishes", "· Compost food scraps", "· Participate in local food recovery and repurposing programs"]

  },
  {
    id: 6,
    name: "Community Engagement",
    description: "Promote sustainable development through community collaboration and sharing",
    color: "#fde47f",
    tips: ["· Support food banks and charities", "· Promote local, sustainable food", "· Share excess food with others"]

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



// integrate Map and Food Journey to Information Page
export const Tips = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [newsLinks, setNewsLinks] = useState([]);
  const [activeSection, setActiveSection] = useState('journey');

  useEffect(() => {
    if (selectedState) {
      getTopArticles(selectedState);
    }
  }, [selectedState]);

  const getTopArticles = async (state) => {
    const articles = await FoodWasteNews({ selectedState: state });
    setNewsLinks(articles);
  };

  const handleCloseNews = () => {
    setSelectedState(null);
    setNewsLinks([]);
  };

  const handleStateClick = (state) => {
    console.log("State clicked:", state);
    setSelectedState(state);
    setActiveSection('newsMap');
  };



  return (
  <div className="info-page">
    <div>



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
              <p className="information-text">
                Explore how to reduce waste at every stage of food's journey and contribute to environmental protection.
              </p>
              <p className="information-text">
                Scroll down to start your Food Waste Journey!
              </p>

              <FoodJourneyAnimation />
            </>
          )}

          {activeSection === 'newsMap' && (
            <>
              <h1 className="information-title">News Map</h1>
              <p className="information-text">
                Click on a state on the map below to get its top news about Food Waste.
              </p>
              <FoodWasteNews selectedState={selectedState} onClose={handleCloseNews} />
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
    </div>
  );
}





