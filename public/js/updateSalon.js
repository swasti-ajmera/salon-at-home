document.addEventListener('DOMContentLoaded', () => {
    // Define the same categories structure as in salonDetails.js
    const categories = {
        "Hair Services": [
          "Haircut (Men)",
          "Haircut (Women)",
          "Haircut (Kids)",
          "Hair Wash & Blow Dry",
          "Hair Styling (Casual)",
          "Hair Styling (Formal)",
          "Hair Coloring (Full)",
          "Hair Coloring (Highlights)",
          "Hair Coloring (Ombre)",
          "Hair Coloring (Balayage)",
          "Keratin Treatment",
          "Smoothening Treatment",
          "Hair Spa",
        ],
        "Skin Care Services": [
          "Basic Facial",
          "Anti-Aging Facial",
          "Hydrating Facial",
          "Brightening Facial",
          "Cleanups",
          "Microdermabrasion",
          "Skin Polishing",
        ],
        "Hair Removal": [
          "Full Body Waxing",
          "Arms Waxing",
          "Legs Waxing",
          "Bikini Waxing",
          "Face Waxing",
          "Eyebrow Threading",
          "Upper Lip Threading",
        ],
        "Nail Care": [
          "Classic Manicure",
          "Gel Manicure",
          "Spa Manicure",
          "Classic Pedicure",
          "Gel Pedicure",
          "Spa Pedicure",
          "Nail Extensions (Acrylic)",
          "Nail Extensions (Gel)",
          "Nail Art",
        ],
        "Makeup Services": [
          "Party Makeup",
          "Bridal Makeup",
          "Makeup Consultation",
        ],
        "Massage & Spa Services": [
          "Aromatherapy Massage",
          "Swedish Massage",
          "Deep Tissue Massage",
          "Body Polishing",
          "Body Scrub",
        ],
        "Grooming": [
          "Eyebrow Shaping",
          "Upper Lip Waxing",
          "Chin Waxing",
          "Facial Hair Removal (Threading)",
          "Hairline Threading",
        ],
        "Specialty Treatments": [
          "Hydrafacial",
          "Microblading",
          "Chemical Peel",
          "Botox",
          "PRP Treatment (Platelet-Rich Plasma)",
        ],
        "Packages": [
          "Bridal Package",
          "Party Package",
          "Wellness Package",
          "Pamper Package",
          "Monthly Package",
        ],
      };

    const form = document.getElementById('updateSalonForm');
    const categoriesContainer = document.getElementById('categoriesContainer');

    async function loadSalonDetails() {
        try {
            const salonId = localStorage.getItem("salonId");
            const response = await fetch(`/api/salons/all/${salonId}`);
            const salon = await response.json();
            
            // Populate basic form fields
            document.getElementById('name').value = salon.name || '';
            document.getElementById('description').value = salon.description || '';
            document.getElementById('phone').value = salon.phone || '';
            document.getElementById('email').value = salon.email || '';
            document.getElementById('addressLine').value = salon.addressLine || '';
            document.getElementById('suburb').value = salon.suburb || '';
            document.getElementById('openingTime').value = salon.openingTime || '';
            document.getElementById('closingTime').value = salon.closingTime || '';

            // Create categories section
            renderCategoriesSection(salon.categoriesAndServices || []);
            
            // Initialize Materialize elements
            M.updateTextFields();
            M.textareaAutoResize(document.getElementById('description'));
        } catch (error) {
            console.error('Failed to load salon details:', error);
            M.toast({html: 'Failed to load salon details'});
        }
    }

    function renderCategoriesSection(existingCategories = []) {
        categoriesContainer.innerHTML = ''; // Clear existing content
        
        // Create category selection dropdown
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'category-dropdown-container';
        dropdownContainer.innerHTML = `
            <div class="input-field">
                <select multiple id="categorySelect">
                    ${Object.keys(categories).map(category => `
                        <option value="${category}" 
                            ${existingCategories.some(ec => ec.category === category) ? 'selected' : ''}>
                            ${category}
                        </option>
                    `).join('')}
                </select>
                <label>Select Categories</label>
            </div>
        `;
        categoriesContainer.appendChild(dropdownContainer);

        // Initialize Materialize select
        const selectElement = dropdownContainer.querySelector('select');
        M.FormSelect.init(selectElement);

        // Create services sections for existing categories
        existingCategories.forEach(categoryData => {
            createServiceSection(categoryData.category, categoryData.services);
        });

        // Add change listener for category selection
        selectElement.addEventListener('change', function() {
            const selectedCategories = M.FormSelect.getInstance(this).getSelectedValues();
            updateServiceSections(selectedCategories, existingCategories);
        });
    }

    function createServiceSection(categoryName, selectedServices = []) {
        const sectionId = `services-${categoryName.replace(/\s+/g, '-').toLowerCase()}`;
        
        // Create or update section
        let section = document.getElementById(sectionId);
        if (!section) {
            section = document.createElement('div');
            section.id = sectionId;
            section.className = 'service-section card-panel';
            categoriesContainer.appendChild(section);
        }

        // Populate services
        section.innerHTML = `
            <h5>${categoryName}</h5>
            <div class="services-list">
                ${categories[categoryName].map(service => `
                    <label>
                        <input type="checkbox" 
                            value="${service}"
                            ${selectedServices.includes(service) ? 'checked' : ''}
                        />
                        <span>${service}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    function updateServiceSections(selectedCategories, existingData = []) {
        // Remove service sections for unselected categories
        document.querySelectorAll('.service-section').forEach(section => {
            const categoryName = section.querySelector('h5').textContent;
            if (!selectedCategories.includes(categoryName)) {
                section.remove();
            }
        });

        // Create or update sections for selected categories
        selectedCategories.forEach(category => {
            const existingCategory = existingData.find(ec => ec.category === category);
            createServiceSection(category, existingCategory ? existingCategory.services : []);
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const salonId = localStorage.getItem("salonId");
        
        // Gather selected categories and services
        const categoriesAndServices = Array.from(document.querySelectorAll('.service-section')).map(section => ({
            category: section.querySelector('h5').textContent,
            services: Array.from(section.querySelectorAll('input[type="checkbox"]:checked'))
                        .map(checkbox => checkbox.value)
        })).filter(cat => cat.services.length > 0);

        const updatedSalon = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            addressLine: document.getElementById('addressLine').value,
            suburb: document.getElementById('suburb').value,
            openingTime: document.getElementById('openingTime').value,
            closingTime: document.getElementById('closingTime').value,
            categoriesAndServices
        };

        try {
            const response = await fetch(`/api/salons/${salonId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSalon)
            });

            if (response.ok) {
                M.toast({html: 'Salon details updated successfully'});
                setTimeout(() => window.location.href = '/adminDashboard.html', 1500);
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Failed to update salon details:', error);
            M.toast({html: 'Failed to update salon details'});
        }
    });

    loadSalonDetails();
});