// constants.js (in utils folder)
export const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };
  
export const transactionTimer = (activeStep, setActiveStep, setRemainingTime, resetFormData) => {
    let timer;

    clearInterval(timer);
  
    if (activeStep === 2) {
      setRemainingTime(600); // Reset to 10 minutes
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            alert('Time is up! You will be redirected to the first step.');
            setActiveStep(0); // Redirect to Step 1
            resetFormData();  // Optional: Reset all form data
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  
    return () => clearInterval(timer); // Cleanup the timer when component unmounts or step changes
  };
  