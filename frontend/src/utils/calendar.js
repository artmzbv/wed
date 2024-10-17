  export const fetchAllReservations = async (setReservations) => {
    try {
      const response = await fetch(`https://api.self-made-portraits.com/api/reservations/all`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  };

  export const generateTimeSlots = () => {
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

  export const getOverlappingSlots = (startTime, duration) => {
    const slots = [];
    let current = new Date(`1970-01-01T${startTime}`);
    const endTime = new Date('1970-01-01T20:00:00');
    for (let i = 0; i < duration; i += 15) {
      if (current > endTime) break;  // Stop if time exceeds 20:00
      slots.push(current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      current.setMinutes(current.getMinutes() + 15);
    }
    return slots;
  };

  export const isOverlapping = (time, duration, selectedDate, reservations) => {
    return reservations.some((res) => {
      const reservationDate = new Date(res.date).toISOString().split('T')[0];
      const currentDate = selectedDate?.toISOString().split('T')[0];
      if (reservationDate !== currentDate) return false;

      const selectedSlots = getOverlappingSlots(time, duration);
      const reservedSlots = getOverlappingSlots(res.time, res.duration);
      return selectedSlots.some((slot) => reservedSlots.includes(slot));
    });
  };

  export const isSlotBooked = (reservations,selectedDate, time) => {
    return reservations.some((res) => {
      const reservationDate = new Date(res.date).toISOString().split('T')[0];
      const currentDate = selectedDate?.toISOString().split('T')[0];
      if (reservationDate !== currentDate) return false;
      const overlappingSlots = getOverlappingSlots(res.time, res.duration);
      return overlappingSlots.includes(time);
    });
  };

    // Function to convert Date to custom format string (e.g., 'Thu Oct 24 2024 15:00:00')
  export const formatSelectedDate = (date, time) => {
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

    export const durations = [
      { label: '60 mins', value: 60 },
      { label: '45 mins', value: 45 },
      { label: '30 mins', value: 30 },
      { label: '15 mins', value: 15 },
    ];

    export const checkEndTimeBoundary = (startTime, duration) => {
      // Define the end of the allowed time (20:00) in local time
      const dayEndTime = new Date();
      dayEndTime.setHours(20, 0, 0, 0); // 20:00 in local time
    
      // Calculate the start and end times of the new reservation
      const [startHour, startMinute] = startTime.split(':');
      const reservationStartTime = new Date();
      reservationStartTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0); // Set the local start time
    
      const reservationEndTime = new Date(reservationStartTime); // Clone the start time
      reservationEndTime.setMinutes(reservationStartTime.getMinutes() + duration); // Add the duration
    
      // Check if the reservation end time exceeds the allowed dayEndTime (20:00)
      if (reservationEndTime > dayEndTime) {
        console.log('Reservation exceeds the allowed end time of 20:00.');
        return false; // Prevent the reservation if it exceeds the limit
      }
    
      console.log('Reservation is within the allowed time.');
      return true; // Allow reservation if it doesn't overlap with 20:00
    };
    