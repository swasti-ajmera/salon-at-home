document.addEventListener('DOMContentLoaded', function() {
    // Materialize initializations
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems);

    var selectElems = document.querySelectorAll('select');
    var selectInstances = M.FormSelect.init(selectElems);

    var modalElems = document.querySelectorAll('.modal');
    var modalInstances = M.Modal.init(modalElems);

    // Fetch and render salons
    async function fetchSalons() {
        try {
            const response = await fetch('/api/salons');
            const salons = await response.json();
            renderSalons(salons);
        } catch (error) {
            console.error('Error fetching salons:', error);
        }
    }

    // Salon rendering function
    function renderSalons(salons) {
        const container = document.getElementById('salons-container');
        container.innerHTML = salons.map(salon => `
            <div class="salon-card">
                <div class="salon-card-content">
                    <h5>${salon.name}</h5>
                    <p>${salon.description}</p>
                    <p>Hours: ${salon.openingTime} - ${salon.closingTime}</p>
                    <button onclick="openAppointmentModal('${salon._id}')" 
                            class="btn waves-effect waves-light book-btn">
                        Book Appointment
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Open appointment modal
    window.openAppointmentModal = function(salonId) {
        const modal = M.Modal.getInstance(document.getElementById('appointment-modal'));
        const serviceSelect = document.getElementById('service');
        
        // Fetch salon details to populate services
        fetch(`/api/salons/${salonId}`)
            .then(response => response.json())
            .then(salon => {
                // Clear existing options
                serviceSelect.innerHTML = '<option value="" disabled selected>Choose Service</option>';
                
                // Populate services
                salon.categoriesAndServices.forEach(category => {
                    const group = document.createElement('optgroup');
                    group.label = category.category;
                    
                    category.services.forEach(service => {
                        const option = document.createElement('option');
                        option.value = service;
                        option.textContent = service;
                        group.appendChild(option);
                    });
                    
                    serviceSelect.appendChild(group);
                });
                
                // Reinitialize select
                M.FormSelect.init(serviceSelect);
            });

        // Set salon ID
        document.getElementById('salon-id').value = salonId;
        modal.open();
    };

    // Submit appointment form
    document.getElementById('appointment-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            salon: document.getElementById('salon-id').value,
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('appointment-date').value,
            time: document.getElementById('appointment-time').value,
            service: document.getElementById('service').value,
            user: localStorage.getItem("userId"),
        };

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                M.toast({html: 'Appointment Booked Successfully!'});
                const modal = M.Modal.getInstance(document.getElementById('appointment-modal'));
                modal.close();
                document.getElementById('appointment-form').reset();
            } else {
                const error = await response.json();
                //M.toast({html: Error: ${error.message}});
            }
        } catch (error) {
            console.error('Error submitting appointment:', error);
            M.toast({html: 'Error booking appointment'});
        }
    });

    // Initial fetch of salons
    fetchSalons();
});