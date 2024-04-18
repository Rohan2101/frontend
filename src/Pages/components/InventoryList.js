import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { calculateStatus } from '../inventory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faCamera, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import '../App.css'; // 路径根据实际项目结构调整


const InventoryList = ({ inventory, onEdit, onDelete, togglePopup }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});
  const [originalValues, setOriginalValues] = useState({});

  const handleEdit = (id, item) => {
    const parts = item.expiryDate.split('/');
    const formattedExpiryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    setOriginalValues(item);
    setEditingItem(id);
    setUpdatedValues({
      ...item,
      expiryDate: formattedExpiryDate,
    });
  };

  const handleCancel = () => {
    setUpdatedValues(originalValues);
    setEditingItem(null);
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setUpdatedValues(prevValues => ({
      ...prevValues,
      [field]: value
    }));
  };

  const handleDateChange = (date) => {
    setUpdatedValues(prevValues => ({
      ...prevValues,
      expiryDate: date
    }));
  };

  const handleSave = (id) => {
    // Validation code
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!updatedValues.name || !updatedValues.amount || !updatedValues.spent) {
      alert('Please fill in all the fields');
      return;
    }

    if (specialCharsRegex.test(updatedValues.name)) {
      alert('Please do not use special characters in the name or status field');
      return;
    }

    const amount = parseFloat(updatedValues.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const spent = parseFloat(updatedValues.spent);
    if (isNaN(spent) || spent <= 0) {
      alert('Please enter a valid spent amount');
      return;
    }

    // Date validation can be added if required

    const formattedExpiryDate = `${updatedValues.expiryDate.getDate()} ${getMonthName(updatedValues.expiryDate.getMonth())} ${updatedValues.expiryDate.getFullYear()}`;

    onEdit(id, { ...updatedValues, expiryDate: formattedExpiryDate });
    setEditingItem(null);
    setUpdatedValues({});
  };

  const handlescanExpiry = () => {
    togglePopup('package');
  };

  const getMonthName = (month) => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return monthNames[month];
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Expiry Date</th>
          {/* <th>Status</th> */}
          <th>Status <FontAwesomeIcon icon={faInfoCircle} className="info-icon" onClick={() => togglePopup('statusInfo')} /></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {inventory.map((item) => (
          <tr key={item.id}>
            <td>
              {editingItem === item.id ? (
                <input type="text" value={updatedValues.name} onChange={(e) => handleInputChange(e, 'name')} />
              ) : (
                item.name
              )}
            </td>
            <td>
              {editingItem === item.id ? (
                <input type="text" value={updatedValues.amount} onChange={(e) => handleInputChange(e, 'amount')} />
              ) : (
                item.amount
              )}
            </td>
            <td>
              {editingItem === item.id ? (
                <input type="text" value={updatedValues.spent} onChange={(e) => handleInputChange(e, 'spent')} />
              ) : (
                item.spent
              )}
            </td>
            <td>
              {editingItem === item.id ? (
                <DatePicker
                  selected={updatedValues.expiryDate}
                  onChange={(date) => handleDateChange(date)}
                  dateFormat="dd MMM yyyy"
                  className="date-picker edit-date-picker"
                />
              ) : (
                item.expiryDate
              )}
            </td>
            <td>
              <img
                src={calculateStatus(item.expiryDate)}
                alt="Indicator Fail"
                className="status-image"
                style={{ width: '55px', height: 'auto' }}
              />
            </td>
            <td>
              <div className="action-icons">
                {editingItem === item.id ? (
                  <React.Fragment>
                    <FontAwesomeIcon icon={faCheck} className="save-icon" onClick={() => handleSave(item.id)} />
                    <FontAwesomeIcon icon={faTimes} className="cancel-icon" onClick={handleCancel} />
                  </React.Fragment>
                ) : (
<React.Fragment>
  <FontAwesomeIcon
    icon={faEdit}
    className="edit-icon action-icons"
    onClick={() => handleEdit(item.id, item)}
  />
  <span className="hover-text edit-hover">Edit</span>

  <FontAwesomeIcon
    icon={faTrashAlt}
    className="delete-icon action-icons"
    onClick={() => onDelete(item.id)}
  />
  <span className="hover-text delete-hover">Delete</span>

  <FontAwesomeIcon
    icon={faCamera}
    className="scan-icon action-icons"
    onClick={handlescanExpiry}
  />
  <span className="hover-text scan-hover">Scan Expiry</span>
</React.Fragment>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryList;
