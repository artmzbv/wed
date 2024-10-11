import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TimeBookingDate.css';

const TimeBookingDate = ({
  setErrors,
  setActiveStep,
  selectedDate,
  setSelectedDate,
  selectedDuration,
  setSelectedDuration,
  selectedTime,
  setSelectedTime,
}) => {
  const [durationError, setDurationError] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [reservations, setReservations] = useState([]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isValidDate = selectedDate && selectedDate instanceof Date && new Date(selectedDate).setHours(0, 0, 0, 0) >= today;

  useEffect(() => {
    if (selectedDuration) setDurationError('');
    if (selectedDate) setDateError('');
    if (selectedTime) setTimeError('');
  }, [selectedDuration, selectedDate, selectedTime]);

  const durations = [
    { label: '60 mins', value: 60 },
    { label: '45 mins', value: 45 },
    { label: '30 mins', value: 30 },
    { label: '15 mins', value: 15 },
  ];

  useEffect(() => {
    fetchAllReservations();
  }, []);

  const fetchAllReservations = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/reservations/all`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  };

  // Function to convert Date to custom format string (e.g., 'Thu Oct 24 2024 15:00:00')
  const formatSelectedDate = (date, time) => {
    const hours = time.split(':')[0];
    const minutes = time.split(':')[1];
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleNextStep = async () => {
    let hasError = false;
  
    if (!selectedDuration) {
      setDurationError('Please select a session duration');
      hasError = true;
    }
  
    if (!selectedDate || !isValidDate) {
      setDateError('Please select a valid date');
      hasError = true;
    }
  
    if (!selectedTime) {
      setTimeError('Please select a time slot');
      hasError = true;
    }
  
    // Validate if the selected time slot overlaps with any booked slots
    if (!hasError) {
      const overlapping = isOverlapping(selectedTime, selectedDuration);
      if (overlapping) {
        setTimeError('Selected slot overlaps with another reservation');
        hasError = true;
      }
    }
  
    if (!hasError) {
      try {
        // Use the custom formatted date here
        const formattedDate = formatSelectedDate(selectedDate, selectedTime);
        console.log("Formatted Date:", formattedDate); // For debugging purposes
  
        await fetchAllReservations();
        setActiveStep(1);
        setErrors({});
      } catch (error) {
        console.error('Failed to create reservation:', error);
        setErrors({ message: error.message });
      }
    }
  };
  

  const generateTimeSlots = () => {
    const slots = [];
    let startTime = new Date();
    startTime.setHours(9, 0, 0, 0);
    const endTime = new Date();
    endTime.setHours(20, 0, 0, 0);

    while (startTime < endTime) {
      slots.push(new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      startTime.setMinutes(startTime.getMinutes() + 15);
    }

    return slots;
  };
  const timeSlots = generateTimeSlots();

  const getOverlappingSlots = (startTime, duration) => {
    const slots = [];
    let current = new Date(`1970-01-01T${startTime}`);
    for (let i = 0; i < duration; i += 15) {
      slots.push(current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      current.setMinutes(current.getMinutes() + 15);
    }
    return slots;
  };

  const isSlotBooked = (time) => {
    return reservations.some((res) => {
      const reservationDate = new Date(res.date).toISOString().split('T')[0];
      const currentDate = selectedDate?.toISOString().split('T')[0];
      if (reservationDate !== currentDate) return false;
      const overlappingSlots = getOverlappingSlots(res.time, res.duration);
      return overlappingSlots.includes(time);
    });
  };

  const isOverlapping = (time, duration) => {
    return reservations.some((res) => {
      const reservationDate = new Date(res.date).toISOString().split('T')[0];
      const currentDate = selectedDate?.toISOString().split('T')[0];
      if (reservationDate !== currentDate) return false;

      const selectedSlots = getOverlappingSlots(time, duration);
      const reservedSlots = getOverlappingSlots(res.time, res.duration);
      return selectedSlots.some((slot) => reservedSlots.includes(slot));
    });
  };

  const isNextButtonDisabled = !isValidDate || !selectedDuration || !selectedTime || isOverlapping(selectedTime, selectedDuration);
return(
    <>
      <div className='time__container'>
        <div className='time__duration-buttons'>
          {durations.map((duration) => (
            <button
              key={duration.value}
              className={`time__duration-button ${selectedDuration === duration.value ? 'time__duration-button_active' : ''}`}
              onClick={() => setSelectedDuration(duration.value)}
            >
              {duration.label}
            </button>
          ))}
          {durationError && <p className='time__error-message-duration'>{durationError}</p>}
        </div>

        <div className='time__calendar'>
          {dateError && <p className='time__error-message'>{dateError}</p>}
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </div>

        <div className='time__slots-container'>
          <div className='time__slots'>
            <h2>Available Time Slots</h2>
            <ul className='time__list'>
              {timeError && <p className='time__error-message-time'>{timeError}</p>}
              {timeSlots.map((time, index) => (
                <li
                  key={index}
                  className={`time__slot ${isSlotBooked(time) ? 'time__slot_booked' : ''} ${selectedTime === time ? 'time__slot_selected' : ''}`}
                  onClick={() => !isSlotBooked(time) && setSelectedTime(time)}
                >
                  {time}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className='time__next-step'>
        <button
          className={`time__next-step-button ${!isNextButtonDisabled ? 'time__next-step-button_active' : ''}`}
          onClick={handleNextStep}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default TimeBookingDate;
