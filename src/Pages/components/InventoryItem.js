// InventoryItem.js
import React from 'react';
import { calculateStatus } from '../inventory';

function InventoryItem({ item }) {
  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.amount}</td>
      <td>{item.spent}</td>
      <td>{item.expiryDate}</td>
      {/* <td>
        <img
          src={calculateStatus(item.expiryDate)}
          alt="Indicator Fail"
          className="status-image"
          style={{ width: '55px', height: 'auto' }}
        />
      </td> */}

      <td>
        <span style={{ color: calculateStatus(item.expiryDate).color }}>
          {calculateStatus(item.expiryDate).message}
        </span>
      </td>

      {/* <td>{item.status}</td> */}
      <td>
        {/* Render your delete and three-dots menu icon here */}
      </td>
    </tr>
  );
}

export default InventoryItem;
