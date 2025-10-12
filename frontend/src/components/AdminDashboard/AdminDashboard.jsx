import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './AdminDashboard.css';
import { URL } from '../../utils/constants/constants';
import {formatSelectedDate, generateTimeSlots, adminDurations, isOverlapping, checkEndTimeBoundary } from '../../utils/calendar';

const AdminDashboard = ({ token }) => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [coupons, setCoupons] = useState([]); // State for coupons
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(''); // Calendar selected date
  const [activeTab, setActiveTab] = useState('bookings'); // State to track active tab
  const [expandedRows, setExpandedRows] = useState([]); // Track which rows are expanded
  const [discountType, setDiscountType] = useState("percent");

    // Helper function to get today's date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure two digits for month
    const day = String(today.getDate()).padStart(2, '0'); // Ensure two digits for day
    return `${year}-${month}-${day}`;
  };

  // New states for creating a reservation
  const [newDate, setNewDate] = useState(getCurrentDate())
  const [newTime, setNewTime] = useState('');
  const [newDiscountValue, setNewDiscountValue] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newWillComeWithPets, setNewWillComeWithPets] = useState(false);
  const [newWillBeRaw, setNewWillBeRaw] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);

  const formatDate = (date) => {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`; // Local format: YYYY-MM-DD
  };

    // Toggle row expansion to show/hide details
    const toggleRow = (id) => {
      setExpandedRows((prevExpandedRows) =>
        prevExpandedRows.includes(id)
          ? prevExpandedRows.filter((rowId) => rowId !== id) // Remove if already expanded
          : [...prevExpandedRows, id] // Add row to expanded
      );
    };

  // Fetch Reservations when bookings tab is active
  useEffect(() => {
    if (activeTab === 'bookings') {
      const fetchReservations = async () => {
        try {
          const response = await fetch(`${URL}/api/reservations/all`, {
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
          const response = await fetch(`${URL}/api/coupons/all`, {
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

  const formattedDate = formatDate(selectedDate); // Format the selected date
  // Filter Reservations by Date
  useEffect(() => {
    if (selectedDate && activeTab === 'bookings') {
      const filtered = reservations
        .filter((reservation) => {
          const reservationDate = new Date(reservation.date).toISOString().split('T')[0]; // Format reservation date
          return reservationDate === formattedDate;
        })
        .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
      setFilteredReservations(filtered);
    } else {
      setFilteredReservations(reservations);
    }
  }, [selectedDate, reservations, activeTab]);

  const handleCreateReservation = async () => {
    if (isOverlapping(newTime, newDuration, new Date(newDate), reservations)) {
      window.alert('Selected time slot overlaps with an existing reservation. Please choose a different time.');
      return;
    }

    try {
      const response = await fetch(`${URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: newDate,
          time: newTime,
          duration: parseInt(newDuration),
          firstName: newFirstName || " ",
          lastName: newLastName || " ",
          email: newEmail || " ",
          phone: newPhone || " ",
          finalPrice: finalPrice > 0 ? finalPrice : 1, // Ensure finalPrice is greater than 0
          willComeWithPets: newWillComeWithPets || " ", // Include pets option
          willBeRaw: newWillBeRaw || " ", // Include pets option
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Display success alert
        window.alert('Reservation created successfully!');
        // Clear the form inputs by resetting state
        setNewDate('');
        setNewTime('');
        setNewDuration('');
        setNewFirstName('');
        setNewLastName('');
        setNewEmail('');
        setNewPhone('');
        setFinalPrice(0);
        setNewWillComeWithPets(false); // Reset pets option
        setNewWillBeRaw(false); // Reset pets option
      } else {
        throw new Error(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error('Error creating reservation:', err.message);
    }
  };

  const handleDeleteReservation = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this reservation?');
    
    if (!confirmDelete) {
      return; // If the user cancels, do nothing
    }
  
    try {
      const response = await fetch(`${URL}/api/reservations/${id}`, {
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
    const confirmDelete = window.confirm('Are you sure you want to delete this coupon?');
    
    if (!confirmDelete) {
      return; // If the user cancels, do nothing
    }
  
    try {
      const response = await fetch(`${URL}/api/coupons/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ couponCode, couponPath: "admin" }),
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

    const handleCreateCoupon = async () => {

     let generatedCouponCode = '';
            // Generate a unique coupon code by checking with the server
     const generateUniqueCouponCode = async () => {
          let isUnique = false;
              
          while (!isUnique) {
          // Generate random coupon code
          generatedCouponCode = `COUPON-${Math.random().toString(36).substring(7).toUpperCase()}`;
      
                // Check if the generated coupon code exists in the database
          const response = await fetch(`${URL}/api/coupons/check-unique`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json'  },
              body: JSON.stringify({ code: generatedCouponCode })
              });
      
          const { isDuplicate } = await response.json();
              if (!isDuplicate) {
                isUnique = true;
              }
            }
          };
      
          // Ensure the coupon code is unique
          await generateUniqueCouponCode();

    try {
      const response = await fetch(`${URL}/api/coupons/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: generatedCouponCode,
          discountType: discountType,
          discountValue: newDiscountValue,
          usageLimit: 1,
          duration: null,
          quantity: 1,
          pricePerItem: newDiscountValue,
          totalPrice: newDiscountValue,
          firstName: 'Promotion',
          lastName: '',
          email: 'info@self-made-portraits.com',
          phone: '',
          isDigital: 'digital',
          address: null,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Display success alert
        window.alert('Coupon created successfully!');
        
        setCoupons((prev) => [...prev, data.coupon]);
        // Clear the form inputs by resetting state
        setNewDiscountValue('');
      } else {
        throw new Error(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error('Error creating coupon:', err.message);
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
         {/* Calendar for selecting a date */}
         <div className="admin-dashboard__container">
          <div className="time__calendar-container">
            <div className="time__calendar">
              <Calendar
                onClickDay={(date) => setSelectedDate(date)} 
                value={selectedDate}
              />
            </div>
            </div>
            {isLoading ? (
              <p>Loading reservations...</p>
            ) : (
              <>
              <div className="admin-dashboard__table-container admin-dashboard__table-container_reservations">
              <table className="admin-dashboard__table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>With Pets</th>
                    <th>Color Photo Package</th>
                    <th>Details</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.length > 0 ? (
                    filteredReservations.sort((a, b) => {
                      const dateA = new Date(`${a.date}T${a.time}`);
                      const dateB = new Date(`${b.date}T${b.time}`);
                      return dateA - dateB;
                    }).map((reservation) => (
                      <React.Fragment key={reservation._id}>
                        <tr>
                          <td>{new Date(reservation.date).toLocaleDateString()}</td>
                          <td>{reservation.time}</td>
                          <td>
                            {reservation.duration > 60 
                              ? `${(reservation.duration / 60).toFixed(0)} hours` 
                              : `${reservation.duration} mins`
                            }
                          </td>
                          <td>£{reservation.finalPrice}</td>
                          <td>{reservation.willComeWithPets}</td>
                          <td>{reservation.willBeRaw}</td>
                          <td>
                            <button
                              className="admin-dashboard__arrow"
                              onClick={() => toggleRow(reservation._id)}
                            >
                              {expandedRows.includes(reservation._id) ? '▲' : '▼'}
                            </button>
                          </td>
                          <td>
                            <button
                              className="admin-dashboard__button"
                              onClick={() => handleDeleteReservation(reservation._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                        {expandedRows.includes(reservation._id) && (
                          <tr>
                            <td className='reservation__table' colSpan="7">
                              <div className="reservation-details">
                                <p><strong>First Name:</strong> {reservation.firstName}</p>
                                <p><strong>Last Name:</strong> {reservation.lastName}</p>
                                <p><strong>Email:</strong> {reservation.email}</p>
                                <p><strong>Phone:</strong> {reservation.phone}</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No reservations found for the selected date.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
              </>
            )}
          </div>
          <div className="admin-dashboard__new-reservation">
          <h3 className="admin-dashboard__title">Add New Reservation</h3>
          
          <label className="admin-dashboard__new-reservation-label">
            Date:
            <input
              className="admin-dashboard__new-reservation-input"
              type="date"
              value={newDate || ""}
              onChange={(e) => setNewDate(e.target.value || "")}
              required
            />
          </label>
          
          <label className="admin-dashboard__new-reservation-label">
            Time:
            <select
              value={newTime || ""}
              onChange={(e) => setNewTime(e.target.value || "")}
              className="admin-dashboard__new-reservation-input" 
              required
            >
              <option className="admin-dashboard__option-time" value="">Select Time</option>
              {generateTimeSlots().map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>  
          <label className="admin-dashboard__new-reservation-label">
            Duration (minutes):
            <select
              value={newDuration || ""}
              onChange={(e) => setNewDuration(e.target.value || "")}
              className="admin-dashboard__new-reservation-input" 
              required
            >
              <option value="" className="admin-dashboard__option-time">Select Duration</option>
              {adminDurations.map((duration) => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </label>
          
          <label className="admin-dashboard__new-reservation-label">
            First Name:
            <input
              type="text"
              className="admin-dashboard__new-reservation-input"
              value={newFirstName || ""}
              onChange={(e) => setNewFirstName(e.target.value || "")}
            />
          </label>
          
          <label className="admin-dashboard__new-reservation-label">
            Last Name:
            <input
              type="text"
              className="admin-dashboard__new-reservation-input"
              value={newLastName || ""}
              onChange={(e) => setNewLastName(e.target.value || "")}
            />
          </label>
          
          <label className="admin-dashboard__new-reservation-label">
            Email:
            <input
              type="email"
              className="admin-dashboard__new-reservation-input"
              value={newEmail || ""}
              onChange={(e) => setNewEmail(e.target.value || "")}
            />
          </label>
          
          <label className="admin-dashboard__new-reservation-label">
            Phone:
            <input
              type="text"
              className="admin-dashboard__new-reservation-input"
              value={newPhone || ""}
              onChange={(e) => setNewPhone(e.target.value || "")}
            />
          </label>
          
          <label className="admin-dashboard__new-reservation-label">
            Will Come with Pets:
            <div className="admin-dashboard__radio-group">
              <label className="admin-dashboard__radio-group-label">
                <input
                  type="radio"
                  value="Yes"
                  checked={newWillComeWithPets === 'Yes'}
                  onChange={() => setNewWillComeWithPets('Yes')}
                />
                Yes
              </label>
              <label className="admin-dashboard__radio-group-label">
                <input
                  type="radio"
                  value="No"
                  checked={newWillComeWithPets === 'No'}
                  onChange={() => setNewWillComeWithPets('No')}
                />
                No
              </label>
            </div>
          </label>
          <label className="admin-dashboard__new-reservation-label">
            Color Photo Package:
            <div className="admin-dashboard__radio-group">
              <label className="admin-dashboard__radio-group-label">
                <input
                  type="radio"
                  value="Yes"
                  checked={newWillBeRaw === 'Yes'}
                  onChange={() => setNewWillBeRaw('Yes')}
                />
                Yes
              </label>
              <label className="admin-dashboard__radio-group-label">
                <input
                  type="radio"
                  value="No"
                  checked={newWillBeRaw === 'No'}
                  onChange={() => setNewWillBeRaw('No')}
                />
                No
              </label>
            </div>
          </label>
              <button className="admin-dashboard__create-button" onClick={handleCreateReservation}>
                Create Reservation
              </button>
            </div>
        </>
      ) : (
        <div className="admin-dashboard__coupons">
          <h3 className="admin-dashboard__title">Coupons Management</h3>
          {isLoading ? (
            <p>Loading coupons...</p>
          ) : (
            <div className="admin-dashboard__table-container admin-dashboard__table-container_coupons">
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
                  <th>Discount Type</th>
                  <th>Card Type</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <tr key={coupon._id}>
                      <td>{coupon.code}</td>
                      <td>
                    {coupon.discountType === "percent"
                      ? `${coupon.discountValue}%`
                      : `£${coupon.discountValue}`}
                      </td>
                      <td>{coupon.duration} mins</td>
                      <td>
                    {coupon.discountType === "percent"
                      ? `${coupon.totalPrice}%`
                      : `£${coupon.totalPrice}`}
                      </td>
                      <td>{coupon.firstName}</td>
                      <td>{coupon.lastName}</td>
                      <td>{coupon.email}</td>
                      <td>{coupon.phone}</td>
                      <td>{coupon.discountType}</td>
                      <td>{coupon.cardType}</td>
                <td>
                  {/* Conditionally display the address or "None" */}
                  {coupon.cardType === 'physical' && coupon.address ? (
                    <span>{`${coupon.address.country}, ${coupon.address.state}, ${coupon.address.city}, ${coupon.address.line1}, ${coupon.address.postal_code}`}</span>
                  ) :  (
                    <span>None</span>
                  )}
                </td>
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
              <td colSpan="11">No coupons available.</td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          )}
        <div className="admin-dashboard__new-reservation">
           <h3 className="admin-dashboard__title">Add New Coupon</h3>  
        <label className="admin-dashboard__new-reservation-label">
          Discount Type:
          <select
            className="admin-dashboard__new-reservation-input"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
          >
            <option value="percent">Percentage (%)</option>
            <option value="fixed">Fixed (£)</option>
          </select>
        </label>
          <label className="admin-dashboard__new-reservation-label">
          Discount Value {discountType === "percent" ?  "(%)" : "(£)"}:
          <input
            type="number"
            className="admin-dashboard__new-reservation-input"
            value={newDiscountValue || ""}
            onChange={(e) => setNewDiscountValue(e.target.value || "")}
            required
          />
        </label>
              <button className="admin-dashboard__create-button" onClick={handleCreateCoupon}>
                Create Coupon
              </button>
        </div>
    </div>
      )}
    </section>
  );
};

export default AdminDashboard;
