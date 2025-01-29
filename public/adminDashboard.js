document.addEventListener('DOMContentLoaded', function() {
    // Materialize initializations
    var modalElems = document.querySelectorAll('.modal');
    var modalInstances = M.Modal.init(modalElems);

    // Status filter functionality
    const statusFilter = document.getElementById('status-filter');
    statusFilter.addEventListener('change', function() {
        // Implement filter logic here
    });

    // Render appointments function
    function renderAppointments(appointments) {
        const appointmentsList = document.getElementById('appointments-list');
        appointmentsList.innerHTML = appointments.map(appointment => `
            <tr>
                <td>${appointment.salon.name}</td>
                <td>${appointment.user.name}</td>
                <td>${appointment.service}</td>
                <td>${new Date(appointment.date).toLocaleDateString()}</td>
                <td>${appointment.status}</td>
                <td class="action-buttons">
                    ${appointment.status === 'Pending' ? `
                        <button onclick="approveAppointment('${appointment._id}')" 
                                class="btn approve-btn waves-effect waves-light">
                            Approve
                        </button>
                        <button onclick="openRejectionModal('${appointment._id}')" 
                                class="btn reject-btn waves-effect waves-light">
                            Reject
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    // Approve appointment function
    window.approveAppointment = function(appointmentId) {
        // Implement approve logic
    };

    // Open rejection modal
    window.openRejectionModal = function(appointmentId) {
        const modal = M.Modal.getInstance(document.getElementById('rejection-modal'));
        modal.open();
    };
});