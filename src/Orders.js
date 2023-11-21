import React, { useState, useEffect } from 'react';

const RestaurantOrderTracker = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [orders, setOrders] = useState({});

  useEffect(() => {
    // On page load, display existing orders if available
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || {};
    setOrders(existingOrders);
  }, []);

  // Function to add a new order or update an existing order
  const saveOrder = (order) => {
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || {};

    if (isEditing && editIndex !== null) {
      // If in edit mode, update the order details at the specified index
      existingOrders[editIndex] = order;
      setIsEditing(false);
      setEditIndex(null);
    } else {
      // If not in edit mode, add the new order to the existing orders object
      const tableNumber = order.tableNumber;
      if (!existingOrders[tableNumber]) {
        existingOrders[tableNumber] = [];
      }
      existingOrders[tableNumber].push(order);
    }

    localStorage.setItem('orders', JSON.stringify(existingOrders));
    setOrders(existingOrders);
  };

  // Function to delete an order
  const deleteOrder = (tableNumber, index) => {
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || {};
    existingOrders[tableNumber].splice(index, 1);

    localStorage.setItem('orders', JSON.stringify(existingOrders));
    setOrders(existingOrders);
  };

  // Function to populate form fields with order details for editing
  const editOrder = (tableNumber, index) => {
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || {};
    const order = existingOrders[tableNumber][index];

    setIsEditing(true);
    setEditIndex(index);
  };

  // Function to display orders under their respective tables
  const displayOrders = () => {
    const orderElements = [];

    for (const tableNumber in orders) {
      orderElements.push(
        <div key={tableNumber}>
          <h3>Table {tableNumber}</h3>
          {orders[tableNumber].map((order, index) => (
            <div key={index}>
              <strong>Order ID:</strong> {order.orderId}<br />
              <strong>Price:</strong> {order.price}<br />
              <strong>Dish:</strong> {order.dish}<br />
              <strong>Table Number:</strong> {order.tableNumber}<br />
              
              <button onClick={() => deleteOrder(tableNumber, index)}>Delete</button><br /><br />
            </div>
          ))}
        </div>
      );
    }

    return orderElements;
  };

  // Handle form submission
  const handleFormSubmit = (event) => {
    event.preventDefault();

    const orderId = new Date().getTime(); // Generate a unique order ID
    const price = event.target.price.value;
    const dish = event.target.dish.value;
    const tableNumber = event.target.tableNumber.value;

    const newOrder = {
      orderId: orderId,
      price: price,
      dish: dish,
      tableNumber: tableNumber
    };

    saveOrder(newOrder);
    event.target.reset();
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="price">Choose price</label>
        <input type="number" id="price" required /><br /><br />

        <label htmlFor="dish">Choose dish</label>
        <input type="text" id="dish" required /><br /><br />

        <label htmlFor="tableNumber">Choose a table (1 to 10)</label>
        <select id="tableNumber" name="tableNumber">
          {[...Array(10)].map((_, index) => (
            <option key={index + 1} value={index + 1}>{index + 1}</option>
          ))}
        </select>
        <br /><br />

        <button type="submit">Add to Bill</button>
      </form>

      <div>
        {displayOrders()}
      </div>
    </div>
  );
};

export default RestaurantOrderTracker;
