import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ token }) => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [coupons, setCoupons] = useState([]); // State for coupons
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [activeTab, setActiveTab] = useState('bookings'); // State to track active tab

  // New states for creating a reservation
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDuration, setNewDuration] = useState('');

  // Fetch Reservations when bookings tab is active
  useEffect(() => {
    if (activeTab === 'bookings') {
      const fetchReservations = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/reservations/all', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          setReservations(data);
          setIsLoading(false);
        } catch (err) {
          setError(err.message);
          setIsLoading(false);
        }
      };

      fetchReservations();
    }
  }, [token, activeTab]);

  // Fetch Coupons when coupons tab is active
  useEffect(() => {
    if (activeTab === 'coupons') {
      const fetchCoupons = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/coupons/all', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          setCoupons(data);
          setIsLoading(false);
        } catch (err) {
          setError(err.message);
          setIsLoading(false);
        }
      };

      fetchCoupons();
    }
  }, [token, activeTab]);

  // Filter Reservations by Date
  useEffect(() => {
    if (selectedDate && activeTab === 'bookings') {
      const filtered = reservations
        .filter((reservation) => reservation.date === selectedDate)
        .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
      setFilteredReservations(filtered);
    } else {
      const sortedReservations = [...reservations].sort(
        (a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time)
      );
      setFilteredReservations(sortedReservations);
    }
  }, [selectedDate, reservations, activeTab]);

  const handleCreateReservation = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: newDate, time: newTime, duration: parseInt(newDuration) }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const newReservation = await response.json();
      setReservations([...reservations, newReservation.newReservation]);
      setError('');
      setNewDate('');
      setNewTime('');
      setNewDuration('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteReservation = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/reservations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setReservations((prev) => prev.filter((reservation) => reservation._id !== id));
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete the reservation. Please try again.');
    }
  };

  const handleDeleteCoupon = async (couponCode) => {
    try {
      const response = await fetch('http://localhost:3000/api/coupons/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ couponCode }),
      });

      if (response.ok) {
        setCoupons((prev) => prev.filter((coupon) => coupon.code !== couponCode));
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete the coupon. Please try again.');
    }
  };

  return (
    <section className="admin-dashboard">
      {/* Tabs for switching between Bookings and Coupons */}
      <div className="admin-dashboard__tabs">
        <button
          className={`admin-dashboard__tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
        <button
          className={`admin-dashboard__tab ${activeTab === 'coupons' ? 'active' : ''}`}
          onClick={() => setActiveTab('coupons')}
        >
          Coupons
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Conditional rendering based on active tab */}
      {activeTab === 'bookings' ? (
        <>
          {/* Date Filter Input */}
          <div className="admin-dashboard__container">
            <label htmlFor="admin-dashboard__filter">Filter by Date: </label>
            <input
              type="date"
              id="filter-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* New Reservation Form */}
          <div className="admin-dashboard__new-reservation">
            <h3>Create New Reservation</h3>
            <label>
              Date:
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
            </label>
            <label>
              Time:
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
              />
            </label>
            <label>
              Duration (minutes):
              <input
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                min="15"
                step="15"
                required
              />
            </label>
            <button
              className="admin-dashboard__create-button"
              onClick={handleCreateReservation}
            >
              Create Reservation
            </button>
          </div>

          {/* Display Reservations */}
          {isLoading ? (
            <p>Loading reservations...</p>
          ) : (
            <table className="admin-dashboard__table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Final Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.length > 0 ? (
                  filteredReservations.map((reservation) => (
                    <tr key={reservation._id}>
                      <td>{reservation.date}</td>
                      <td>{reservation.time}</td>
                      <td>{reservation.duration} mins</td>
                      <td>{reservation.firstName}</td>
                      <td>{reservation.lastName}</td>
                      <td>{reservation.email}</td>
                      <td>{reservation.phone}</td>
                      <td>£{reservation.finalPrice}</td>
                      <td>
                        <button
                          className="admin-dashboard__button"
                          onClick={() => handleDeleteReservation(reservation._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">No reservations found for the selected date.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <div className="admin-dashboard__coupons">
          <h3 className="admin-dashboard__title">Coupons Management</h3>
          {isLoading ? (
            <p>Loading coupons...</p>
          ) : (
            <table className="admin-dashboard__table">
              <thead>
                <tr>
                  <th>Coupon Code</th>
                  <th>Discount Value</th>
                  <th>Duration</th>
                  <th>Total Price</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Card Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <tr key={coupon._id}>
                      <td>{coupon.code}</td>
                      <td>£{coupon.discountValue}</td>
                      <td>{coupon.duration} mins</td>
                      <td>£{coupon.totalPrice}</td>
                      <td>{coupon.firstName}</td>
                      <td>{coupon.lastName}</td>
                      <td>{coupon.email}</td>
                      <td>{coupon.phone}</td>
                      <td>{coupon.cardType}</td>
                      <td>
                        <button
                          className="admin-dashboard__button"
                          onClick={() => handleDeleteCoupon(coupon.code)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10">No coupons available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
