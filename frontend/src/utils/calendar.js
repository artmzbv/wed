  export const fetchAllReservations = async (setReservations) => {
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
    for (let i = 0; i < duration; i += 15) {
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