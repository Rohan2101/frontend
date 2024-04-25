import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { calculateStatus } from '../inventory';
import '../App.css';


const InventoryList = ({ inventory, onEdit, onDelete, togglePopup, onEditingItemChange}) => {
  const [editingItem, setEditingItem] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});
  const [originalValues, setOriginalValues] = useState({});

  const handleEdit = (id, item) => {
    // Prevent editing if another item is currently being edited
    if (editingItem !== null && editingItem !== id) return;

    const parts = item.expiryDate.split('/');
    const formattedExpiryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    setOriginalValues(item);
    setEditingItem(id);
    onEditingItemChange(id); // pass edit status changes to Inventory.js
    setUpdatedValues({
      ...item,
      expiryDate: formattedExpiryDate,
    });
  };

  const handleCancel = () => {
    setUpdatedValues(originalValues);
    setEditingItem(null);
    onEditingItemChange(null); // pass edit status changes to Inventory.js
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
    onEditingItemChange(null); // pass edit status changes to Inventory.js
    setUpdatedValues({});
  };

  const handlescanExpiry = () => {
    // Prevent scanning if another item is currently being edited
    if (editingItem !== null) return;
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

          {/* <th>Expiry Status <FontAwesomeIcon icon={faInfoCircle} className="info-icon" onClick={() => togglePopup('statusInfo')} /></th> */}
          <th>Expiry Status</th>



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


            <td>
              <div className="action-icons">
                {editingItem === item.id ? (
                  <React.Fragment>
                    <button className="save-button" onClick={() => handleSave(item.id)}>Save</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <button
                      className="edit-button action-buttons"
                      onClick={() => handleEdit(item.id, item)}
                      style={{
                        cursor: editingItem !== null && editingItem !== item.id ? 'not-allowed' : 'pointer',
                      }}
                      disabled={editingItem !== null && editingItem !== item.id}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button action-buttons"
                      onClick={() => {
                        if (editingItem === null || editingItem === item.id) {
                          onDelete(item.id);
                        }
                      }}
                      style={{
                        cursor: editingItem !== null && editingItem !== item.id ? 'not-allowed' : 'pointer',
                      }}
                      disabled={editingItem !== null && editingItem !== item.id}
                    >
                      Delete
                    </button>

                    <button
                      className="scan-button action-buttons"
                      onClick={handlescanExpiry}
                      style={{
                        cursor: editingItem !== null && editingItem !== item.id ? 'not-allowed' : 'pointer',
                      }}
                      disabled={editingItem !== null && editingItem !== item.id}
                    >
                      Scan Expiry
                    </button>
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
