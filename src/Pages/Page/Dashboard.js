import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';

Chart.register(ArcElement);

const Dashboard = ({ top5WastedFoods }) => {
  const [wastedFoods, setWastedFoods] = useState(top5WastedFoods);

  useEffect(() => {
    setWastedFoods(top5WastedFoods);
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
          <div>
            <h2>Congratulations! You have spent $110 less than last week.</h2>
          </div>
        </div>
        <div className="justline"></div>
        <div className="dashboard-chart-container">
          <Doughnut data={data} options={options} />
        </div>
      </div>
      <div className="dashboard-table-container">
        <h3>Most Wasted Foods</h3>
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
