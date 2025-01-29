document.addEventListener('DOMContentLoaded', () => {
  const appointmentsTableBody = document.getElementById('appointments-list');
  const statusFilter = document.getElementById('status-filter');
  const rejectionModal = document.getElementById('rejection-modal');
  
  M.Modal.init(document.querySelectorAll('.modal'));
  M.FormSelect.init(document.querySelectorAll('select'));

  async function fetchAppointments() {
      try {
          const salonId = localStorage.getItem("salonId");
          const response = await fetch(`/api/appointments/${salonId}`);
          const appointments = await response.json();
          renderAppointments(appointments);
      } catch (error) {
          console.error('Failed to fetch appointments:', error);
      }
  }

  function renderAppointments(appointments) {
      appointmentsTableBody.innerHTML = '';
      const selectedStatus = statusFilter.value;
      
      const filteredAppointments = selectedStatus 
          ? appointments.filter(app => app.status === selectedStatus)
          : appointments;

      filteredAppointments.forEach(appointment => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${appointment.name}</td>
              <td>${appointment.service}</td>
              <td>${new Date(appointment.date).toLocaleDateString()}</td>
              <td>${appointment.time}</td>
              <td><span class="status ${appointment.status.toLowerCase()}">${appointment.status}</span></td>
              <td>
                  ${appointment.status === 'Pending' ? `
                      <button class="btn waves-effect waves-light green" onclick="approveAppointment('${appointment._id}')">
                          <i class="material-icons">check</i>
                      </button>
                      <button class="btn waves-effect waves-light red" onclick="showRejectionModal('${appointment._id}')">
                          <i class="material-icons">close</i>
                      </button>
                  ` : `
                      ${appointment.rejectionReason ? `<span class="rejection-reason">Reason: ${appointment.rejectionReason}</span>` : ''}
                  `}
              </td>
          `;
          appointmentsTableBody.appendChild(row);
      });
  }

  window.approveAppointment = async (appointmentId) => {
      try {
          await fetch(`/api/appointments/${appointmentId}/respond`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'Approved' })
          });
          fetchAppointments();
          M.toast({html: 'Appointment approved successfully'});
      } catch (error) {
          console.error('Approval failed:', error);
          M.toast({html: 'Failed to approve appointment'});
      }
  };

  window.showRejectionModal = (appointmentId) => {
      const modal = M.Modal.getInstance(rejectionModal);
      modal.el.dataset.appointmentId = appointmentId;
      modal.open();
  };

  document.getElementById('submit-rejection').addEventListener('click', async () => {
      const appointmentId = rejectionModal.dataset.appointmentId;
      const rejectionReason = document.getElementById('rejection-reason').value;

      try {
          await fetch(`/api/appointments/${appointmentId}/respond`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  status: 'Rejected', 
                  rejectionReason 
              })
          });
          
          const modal = M.Modal.getInstance(rejectionModal);
          modal.close();
          document.getElementById('rejection-reason').value = '';
          
          fetchAppointments();
          M.toast({html: 'Appointment rejected successfully'});
      } catch (error) {
          console.error('Rejection failed:', error);
          M.toast({html: 'Failed to reject appointment'});
      }
  });

  statusFilter.addEventListener('change', fetchAppointments);
  fetchAppointments();
});