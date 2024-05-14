import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';

Chart.register(ArcElement);

const Dashboard = ({ top5WastedFoods }) => {
  const [wastedFoods, setWastedFoods] = useState([]);

  useEffect(() => {
    // Retrieve the top 5 wasted foods from localStorage
    const storedWastedFoods = JSON.parse(localStorage.getItem('top5WastedFoods')) || [];
    // Combine the new top 5 with the existing ones
    const updatedWastedFoods = [...storedWastedFoods, ...top5WastedFoods];
    // Sort the combined array in descending order by wasted amount
    updatedWastedFoods.sort((a, b) => b.wastedAmount - a.wastedAmount);
    // Take the top 5 items
    const newTop5WastedFoods = updatedWastedFoods.slice(0, 5);
    // Set the state with the new top 5 wasted foods
    setWastedFoods(newTop5WastedFoods);
    // Store the updated top 5 wasted foods in localStorage
    localStorage.setItem('top5WastedFoods', JSON.stringify(newTop5WastedFoods));
  }, [top5WastedFoods]);

  const data = {
    labels: ['Saved', 'Wasted', 'Waiting to be consumed'],
    datasets: [{
      label: 'Food Spending',
      data: [110, 90, 200],
      backgroundColor: ['#4CAF50', '#8BC34A', '#CDDC39'],
      borderWidth: 0
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 70,
    legend: {
      display: false
    },
    tooltips: {
      enabled: true
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-left-side">
        <div className="dashboard-header">
          <div className="dashboard-image"></div>

        </div>
        <div className="justline"></div>
      </div>
      <div className="dashboard-table-container">
        <h3>Most Wasted Foods this week:</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Frequency</th>
            </tr>
          </thead>
          <tbody>
            {wastedFoods.map((food, index) => (
              <tr key={index}>
                <td>{food.name}</td>
                <td>{food.wastedAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
