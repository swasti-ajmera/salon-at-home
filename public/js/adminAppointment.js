document.addEventListener('DOMContentLoaded', () => {
    const appointmentsTableBody = document.getElementById('appointments-list');
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-input');
    const rejectionModal = document.getElementById('rejection-modal');
    
    // Initialize Materialize components
    M.Modal.init(document.querySelectorAll('.modal'));
    M.FormSelect.init(document.querySelectorAll('select'));

    async function fetchAppointments() {
        try {
            const salonId = localStorage.getItem("salonId");
            if (!salonId) {
                throw new Error('Salon ID not found');
            }
            
            const response = await fetch(`/api/appointments/${salonId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            const appointments = Array.isArray(data) ? data : data.appointments || [];
            
            updateStats(appointments);
            filterAndRenderAppointments(appointments);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
            M.toast({html: 'Failed to load appointments', classes: 'red'});
            updateStats([]);
            filterAndRenderAppointments([]);
        }
    }

    function updateStats(appointments) {
        if (!Array.isArray(appointments)) {
            appointments = [];
        }
        
        document.getElementById('pending-count').textContent = 
            appointments.filter(app => app.status === 'Pending').length;
        document.getElementById('approved-count').textContent = 
            appointments.filter(app => app.status === 'Approved').length;
        document.getElementById('rejected-count').textContent = 
            appointments.filter(app => app.status === 'Rejected').length;
    }

    function filterAndRenderAppointments(appointments) {
        if (!Array.isArray(appointments)) {
            appointments = [];
        }
        
        const selectedStatus = statusFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        const filteredAppointments = appointments.filter(app => {
            const matchesStatus = !selectedStatus || app.status === selectedStatus;
            const matchesSearch = !searchTerm || 
                app.name.toLowerCase().includes(searchTerm) || 
                app.service.toLowerCase().includes(searchTerm);
            return matchesStatus && matchesSearch;
        });

        renderAppointments(filteredAppointments);
    }

    function renderAppointments(appointments) {
        appointmentsTableBody.innerHTML = '';
        
        if (!Array.isArray(appointments) || appointments.length === 0) {
            appointmentsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="center-align">No appointments found</td>
                </tr>
            `;
            return;
        }

        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.className = 'animate_animated animate_fadeIn';
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
                        ${appointment.rejectionReason ? `
                            <span class="rejection-reason">Reason: ${appointment.rejectionReason}</span>
                        ` : ''}
                    `}
                </td>
            `;
            appointmentsTableBody.appendChild(row);
        });
    }

    window.approveAppointment = async (appointmentId) => {
        try {
            const response = await fetch(`/api/appointments/${appointmentId}/respond`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Approved' })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            fetchAppointments();
            M.toast({html: 'Appointment approved successfully', classes: 'green'});
        } catch (error) {
            console.error('Approval failed:', error);
            M.toast({html: 'Failed to approve appointment', classes: 'red'});
        }
    };

    window.showRejectionModal = (appointmentId) => {
        const modal = M.Modal.getInstance(rejectionModal);
        modal.el.dataset.appointmentId = appointmentId;
        document.getElementById('rejection-reason').value = '';
        M.updateTextFields();
        modal.open();
    };

    document.getElementById('submit-rejection').addEventListener('click', async () => {
        const appointmentId = rejectionModal.dataset.appointmentId;
        const rejectionReason = document.getElementById('rejection-reason').value;

        if (!rejectionReason.trim()) {
            M.toast({html: 'Please provide a reason for rejection', classes: 'red'});
            return;
        }

        try {
            const response = await fetch(`/api/appointments/${appointmentId}/respond`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    status: 'Rejected', 
                    rejectionReason 
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const modal = M.Modal.getInstance(rejectionModal);
            modal.close();
            
            fetchAppointments();
            M.toast({html: 'Appointment rejected', classes: 'orange'});
        } catch (error) {
            console.error('Rejection failed:', error);
            M.toast({html: 'Failed to reject appointment', classes: 'red'});
        }
    });

    // Event Listeners
    statusFilter.addEventListener('change', () => {
        const event = new Event('input');
        searchInput.dispatchEvent(event);
    });

    searchInput.addEventListener('input', debounce(() => {
        fetchAppointments();
    }, 300));

    document.querySelector('.logout')?.addEventListener('click', () => {
        localStorage.removeItem('salonId');
        window.location.href = '/login.html';
    });

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initial load
    fetchAppointments();
});