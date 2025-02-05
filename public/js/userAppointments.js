document.addEventListener('DOMContentLoaded', () => {
    const appointmentsTableBody = document.getElementById('appointments-list');
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-input');
    
    // Initialize Materialize components
    M.FormSelect.init(document.querySelectorAll('select'));

    async function fetchUserAppointments() {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                throw new Error('User ID not found');
            }
            
            const response = await fetch(`/api/appointments/user/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            const appointments = Array.isArray(data) ? data : data.appointments || [];
            
            // updateStats(appointments);
            filterAndRenderAppointments(appointments);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
            M.toast({html: 'Failed to load appointments', classes: 'red'});
            // updateStats([]);
            filterAndRenderAppointments([]);
        }
    }

    // function updateStats(appointments) {
    //     if (!Array.isArray(appointments)) {
    //         appointments = [];
    //     }
        
    //     document.getElementById('pending-count').textContent = 
    //         appointments.filter(app => app.status === 'Pending').length;
    //     document.getElementById('approved-count').textContent = 
    //         appointments.filter(app => app.status === 'Approved').length;
    //     document.getElementById('rejected-count').textContent = 
    //         appointments.filter(app => app.status === 'Rejected').length;
    // }

    function filterAndRenderAppointments(appointments) {
        if (!Array.isArray(appointments)) {
            appointments = [];
        }
        
        const selectedStatus = statusFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        const filteredAppointments = appointments.filter(app => {
            const matchesStatus = !selectedStatus || app.status === selectedStatus;
            const matchesSearch = !searchTerm || 
                app.service.toLowerCase().includes(searchTerm) ||
                new Date(app.date).toLocaleDateString().toLowerCase().includes(searchTerm);
            return matchesStatus && matchesSearch;
        });

        renderAppointments(filteredAppointments);
    }

    function renderAppointments(appointments) {
        appointmentsTableBody.innerHTML = '';
        
        if (!Array.isArray(appointments) || appointments.length === 0) {
            appointmentsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="center-align">No appointments found</td>
                </tr>
            `;
            return;
        }

        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.className = 'animate__animated animate__fadeIn';
            
            // Get status color class
            const statusClass = {
                'Pending': 'status-pending',
                'Approved': 'status-approved',
                'Rejected': 'status-rejected'
            }[appointment.status] || '';

            row.innerHTML = `
                <td>${appointment.service}</td>
                <td>${new Date(appointment.date).toLocaleDateString()}</td>
                <td>${appointment.time}</td>
                <td><span class="status-chip ${statusClass}">${appointment.status}</span></td>
                <td>
                    ${appointment.rejectionReason ? 
                        `<span class="rejection-reason">${appointment.rejectionReason}</span>` 
                        : (appointment.status === 'Pending' ? 'Awaiting response' : '')}
                </td>
            `;
            appointmentsTableBody.appendChild(row);
        });
    }

    // Event Listeners
    statusFilter.addEventListener('change', () => {
        const event = new Event('input');
        searchInput.dispatchEvent(event);
    });

    searchInput.addEventListener('input', debounce(() => {
        fetchUserAppointments();
    }, 300));

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
    fetchUserAppointments();
});