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
          <img src="flowerpot.png" alt="Flower Pot" />
          <div>
            <h1>Img and Heading</h1>
            <h2>Congratulations! You have saved $110.</h2>
          </div>
        </div>
        <div className="dashboard-chart-container">
          <Doughnut data={data} options={options} />
        </div>
      </div>
      <div className="dashboard-table-container">
        <h3>Most Wasted Foods</h3>
        <table className="dashboard-table">
          <tr>
            <th>Top 5</th>
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