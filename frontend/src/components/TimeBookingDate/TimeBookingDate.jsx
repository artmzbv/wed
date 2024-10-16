import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TimeBookingDate.css';
import { fetchAllReservations, generateTimeSlots, isOverlapping,  isSlotBooked,  formatSelectedDate, durations, checkEndTimeBoundary } from '../../utils/calendar';

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


  useEffect(() => {
    fetchAllReservations(setReservations);
  }, []);


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
      const overlapping = isOverlapping(selectedTime, selectedDuration, selectedDate, reservations);
      if (overlapping) {
        setTimeError('Selected slot overlaps with another reservation');
        hasError = true;
      }

      if (!checkEndTimeBoundary(selectedTime, selectedDuration)) {
        setTimeError('The selected time slot exceeds the allowed limit of 20:00');
        hasError = true;
      }
    }
  
    if (!hasError) {
      try {
        // Use the custom formatted date here
        const formattedDate = formatSelectedDate(selectedDate, selectedTime);
        // console.log("Formatted Date:", formattedDate); // For debugging purposes
  
        await fetchAllReservations();
        setActiveStep(1);
        setErrors({});
      } catch (error) {
        console.error('Failed to create reservation:', error);
        setErrors({ message: error.message });
      }
    }
  };
  
  const timeSlots = generateTimeSlots();
  const isNextButtonDisabled = !isValidDate || !selectedDuration || !selectedTime || isOverlapping(selectedTime, selectedDuration, selectedDate, reservations);

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
          <Calendar onChange={setSelectedDate} value={selectedDate} minDate={today} />
        </div>
{/* ds */}
        <div className='time__slots-container'>
          <div className='time__slots'>
            <h2>Available Time Slots</h2>
            <ul className='time__list'>
              {timeError && <p className='time__error-message-time'>{timeError}</p>}
              {timeSlots.map((time, index) => (
                <li
                  key={index}
                  className={`time__slot ${isSlotBooked(reservations, selectedDate, time) ? 'time__slot_booked' : ''} ${selectedTime === time ? 'time__slot_selected' : ''}`}
                  onClick={() => !isSlotBooked(reservations, selectedDate, time) && setSelectedTime(time)}
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
