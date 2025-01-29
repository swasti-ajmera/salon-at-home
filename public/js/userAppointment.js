document.addEventListener('DOMContentLoaded', () => {
    const appointmentForm = document.getElementById('appointmentRequestForm');
  
    appointmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData(appointmentForm);
      const appointmentData = {
        salonId: formData.get('salonId'),
        userId: currentUser.id, // Assume global user object
        service: formData.get('service'),
        date: formData.get('date'),
        time: formData.get('time')
      };
  
      try {
        const response = await fetch('/api/appointments/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData)
        });
  
        const result = await response.json();
        if (response.ok) {
          alert('Appointment request sent successfully!');
        } else {
          alert('Failed to send appointment request');
        }
      } catch (error) {
        console.error('Appointment request error:', error);
      }
    });
  });