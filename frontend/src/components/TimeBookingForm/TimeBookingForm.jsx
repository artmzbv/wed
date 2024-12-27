// TimeBookingForm.jsx
import React, { useState, useEffect } from 'react';
import './TimeBookingForm.css';

const TimeBookingForm = ({ setErrors, setActiveStep, selectedDate, selectedTime, selectedDuration, renderError, firstName, setFirstName, lastName, setLastName, phone, setPhone, email, setEmail, willComeWithPets, setWillComeWithPets, willBeRaw, setWillBeRaw, handleBackStep }) => {
  const [isFormValid, setIsFormValid] = useState(false);
  // Function to validate email format
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Function to validate phone format
  const isValidPhone = (phone) => /^\d+$/.test(phone);

  // Validate fields before submission
  const validateForm = () => {
    const validationErrors = {};
    if (!firstName.trim()) validationErrors.firstName = "- first name is required";
    if (!lastName.trim()) validationErrors.lastName = "- last name is required";
    if (!phone.trim()) validationErrors.phone = "- phone number is required";
    else if (!isValidPhone(phone)) validationErrors.phone = "- phone number must have only digits";
    if (!email.trim()) validationErrors.email = "- email is required";
    else if (!isValidEmail(email)) validationErrors.email = "- invalid email format";
    if (willComeWithPets === null) validationErrors.willComeWithPets = "- select an option";
    if (willBeRaw === null) validationErrors.willBeRaw = "- select an option";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Existing form submission function with validation logic
    const handleFormSubmit = async () => {
      if (validateForm()) {
        const bookingData = {
          date: selectedDate?.toLocaleDateString(),
          time: selectedTime,
          duration: selectedDuration,
          firstName,
          lastName,
          phone,
          email,
          willComeWithPets,
          willBeRaw
        };
  
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
          });
  
          const result = await response.json();
          console.log('Booking data sent successfully:', result);
          setActiveStep(2); // Move to Step 3 (Done) after successful form submission
        } catch (error) {
          console.error('Error sending booking data:', error);
        }
      }
    }
  // Handle form validation
  useEffect(() => {
    setIsFormValid(
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      phone.trim() !== '' &&
      email.trim() !== '' &&
      willComeWithPets !== null &&
      willBeRaw !== null
    );
  }, [firstName, lastName, phone, email, willComeWithPets, willBeRaw]);
  
    
    // Handle form field changes to clear specific error messages
    useEffect(() => {
      if (firstName.trim()) setErrors((prevErrors) => ({ ...prevErrors, firstName: '' }));
      if (lastName.trim()) setErrors((prevErrors) => ({ ...prevErrors, lastName: '' }));
      if (phone.trim() && isValidPhone(phone)) setErrors((prevErrors) => ({ ...prevErrors, phone: '' }));
      if (email.trim() && isValidEmail(email)) setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
      if (willComeWithPets !== null) setErrors((prevErrors) => ({ ...prevErrors, willComeWithPets: '' }));
      if (willBeRaw !== null) setErrors((prevErrors) => ({ ...prevErrors, willBeRaw: '' }));
    }, [firstName, lastName, phone, email, willComeWithPets, willBeRaw]);

    // Handle form field changes to clear specific error messages
    useEffect(() => {
      const validationErrors = {};
    
      if (firstName.trim()) setErrors((prevErrors) => ({ ...prevErrors, firstName: '' }));
      if (lastName.trim()) setErrors((prevErrors) => ({ ...prevErrors, lastName: '' }));
      if (phone.trim()) setErrors((prevErrors) => ({ ...prevErrors, phone: '' }));
      if (email.trim()) setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
      else if (!isValidEmail(email)) validationErrors.email = "Invalid email format";
      if (willComeWithPets !== null) setErrors((prevErrors) => ({ ...prevErrors, willComeWithPets: '' }));
      if (willBeRaw !== null) setErrors((prevErrors) => ({ ...prevErrors, willBeRaw: '' }));
      }, [firstName, lastName, phone, email, willComeWithPets, willBeRaw])
  
  return (
      <>
      {/* Form Section */}
      <div className='time__confirmation'>
        <button type='button' className='time__back-button' onClick={handleBackStep}>
          Back
        </button>
        <p className='time__confirmation-text'>
          Your selected date and time is:<br /> <strong>{selectedDate?.toLocaleDateString()}</strong> at <strong>{selectedTime}</strong> for <strong>{selectedDuration} minutes</strong>.
        </p>
      </div>

      <form className='time__form'>
        <div className='time__form-group'>
          <label className='time__form-field' htmlFor='firstName'>First Name&nbsp; {renderError('firstName')}</label>
          <input
            id='firstName'
            type='text'
            value={firstName}
            placeholder="John"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className='time__form-group'>
          <label className='time__form-field' htmlFor='lastName'>Last Name&nbsp; {renderError('lastName')}</label>
          <input
            id='lastName'
            type='text'
            value={lastName}
            placeholder="Smith"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className='time__form-group'>
          <label className='time__form-field'  htmlFor='phone'>Phone&nbsp; {renderError('phone')}</label>
          <input
            id='phone'
            type='tel'
            value={phone}
            placeholder="e.g., 07123456789" // Placeholder for British phone format
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className='time__form-group'>
          <label className='time__form-field'  htmlFor='email'>Email&nbsp; {renderError('email')}</label>
          <input
            id='email'
            type='email'
            value={email}
            placeholder="example@domain.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Will you come with pets? */}
        <div className='time__form-group'>
          <label className='time__form-field'>Will you come with pets? (+ £10)&nbsp; <div className='time__form-field-pets-desktop'>{renderError('willComeWithPets')}</div></label>
          <span className='time__form-field-pets-mobile'>
          {renderError('willComeWithPets')}
        </span>
          <div className='time__form-options'>
            <label className='time__form-field'>
              <input
                type='radio'
                className='time__radio'
                name='pets'
                value='Yes'
                onChange={(e) => setWillComeWithPets(e.target.value)}
                checked={willComeWithPets === 'Yes'}
                required
              />
              Yes
            </label>
            <label>
              <input
                type='radio'
                className='time__radio'
                name='pets'
                value='No'
                onChange={(e) => setWillComeWithPets(e.target.value)}
                checked={willComeWithPets === 'No'}
                required
              />
              No
            </label>
          </div>
        </div>
        {/* Will be .RAW format? */}
          <div className='time__form-group'>
          <label className='time__form-field'>Will be in RAW format? (+ £10)&nbsp; <div className='time__form-field-pets-desktop'>{renderError('willBeRaw')}</div></label>
          <span className='time__form-field-pets-mobile'>
          {renderError('willBeRaw')}
        </span>
          <div className='time__form-options'>
            <label className='time__form-field'>
              <input
                type='radio'
                className='time__radio'
                name='raw'
                value='Yes'
                onChange={(e) => setWillBeRaw(e.target.value)}
                checked={willBeRaw === 'Yes'}
                required
              />
              Yes
            </label>
            <label>
              <input
                type='radio'
                className='time__radio'
                name='raw'
                value='No'
                onChange={(e) => setWillBeRaw(e.target.value)}
                checked={willBeRaw === 'No'}
                required
              />
              No
            </label>
          </div>
        </div>
      </form>

      <div className='time__button-container'>
      <button
          type='button'
          className={`time__next-step-button ${isFormValid ? 'time__next-step-button_active' : ''}`}
          onClick={handleFormSubmit}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default TimeBookingForm;
