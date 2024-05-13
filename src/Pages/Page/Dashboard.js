import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'


Chart.register(ArcElement);

const Dashboard = () => {
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
        <h3>Most Wasted Foods this week</h3>
        <table className="dashboard-table">
          <tr>
            <th>Item</th>
            <th>Frequency</th>
          </tr>
          <tr>
            <td>Apple</td>
            <td>6</td>
          </tr>
          <tr>
            <td>Egg</td>
            <td>5</td>
          </tr>
          <tr>
            <td>Orange</td>
            <td>3</td>
          </tr>
          <tr>
            <td>Garlic</td>
            <td>2</td>
          </tr>
          <tr>
            <td>Onion</td>
            <td>1</td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;