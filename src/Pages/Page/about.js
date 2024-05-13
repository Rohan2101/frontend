import React from 'react';
import FeatureCard from './FeatureCard';
import './styles.css';

const features = [
  {
    title: "Welcome!",
    description: "Join us in reducing food waste and saving resources.",
    icon: "path/to/intro-icon.png"
  },
  {
    title: "Scan Receipts",
    description: "Automatically add items to your inventory by scanning your receipts.",
    icon: "path/to/scan-receipts-icon.png"
  },
  {
    title: "Scan Expiry Dates",
    description: "Scan expiry dates to keep track of your perishables.",
    icon: "path/to/scan-expiry-icon.png"
  },
  {
    title: "Inventory Display",
    description: "View and manage your inventory with ease.",
    icon: "path/to/inventory-icon.png"
  },
  {
    title: "Recipe Suggestions",
    description: "Get recipe ideas based on your current inventory.",
    icon: "path/to/recipes-icon.png"
  },
  {
    title: "Preservation Tips",
    description: "Learn how to store your groceries to extend their shelf life.",
    icon: "path/to/preservation-icon.png"
  },
  {
    title: "Waste Calculator",
    description: "See how much you could save by reducing waste.",
    icon: "path/to/calculator-icon.png"
  },
  {
    title: "Reminders",
    description: "Set reminders to use items before they expire.",
    icon: "path/to/reminder-icon.png"
  },
  {
    title: "Join Us",
    description: "Help make a positive impact on the planet.",
    icon: "path/to/join-us-icon.png"
  }
];

const AboutPage = () => {
  return (
    <div className="about-page">
      {features.map((feature, index) => (
        <div key={index} className={`feature-row ${index % 2 === 0 ? 'normal' : 'reverse'}`}>
          <img src={feature.icon} alt={feature.title} className="feature-icon" />
          <div className="feature-info">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutPage;
