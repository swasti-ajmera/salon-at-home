document.addEventListener("DOMContentLoaded", function () {
    // Materialize initializations
    var elems = document.querySelectorAll(".datepicker");
    var instances = M.Datepicker.init(elems, {
      format: "yyyy-mm-dd",
      minDate: new Date(),
      autoClose: true,
    });
  
    var selectElems = document.querySelectorAll("select");
    var selectInstances = M.FormSelect.init(selectElems);
  
    var modalElems = document.querySelectorAll(".modal");
    var modalInstances = M.Modal.init(modalElems, {
      dismissible: true,
      opacity: 0.8,
      inDuration: 300,
      outDuration: 200,
    });
  
    // Search functionality
    document.getElementById("search").addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const salonCards = document.querySelectorAll(".salon-card");
  
      salonCards.forEach((card) => {
        const salonName = card
          .querySelector(".salon-card-title")
          .textContent.toLowerCase();
        const salonDesc = card
          .querySelector(".salon-info")
          .textContent.toLowerCase();
        const salonAdd = card
        .querySelector(".salon-info-add")
        .textContent.toLowerCase();
      const salonSub = card
        .querySelector(".salon-info-sub")
        .textContent.toLowerCase();
  
        if (salonName.includes(searchTerm) || salonDesc.includes(searchTerm)|| salonAdd.includes(searchTerm) || salonSub.includes(searchTerm)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  
    // Filter functionality
    document.getElementById("filter").addEventListener("change", (e) => {
      const filterValue = e.target.value;
      const container = document.getElementById("salons-container");
      const salonCards = Array.from(container.children);
  
      salonCards.sort((a, b) => {
        if (filterValue === "suburb") {
          const suburbA = a.dataset.suburb.toLowerCase();
          const suburbB = b.dataset.suburb.toLowerCase();
          return suburbA.localeCompare(suburbB);
        } 
        // Add more filter options as needed
      });
  
      salonCards.forEach((card) => container.appendChild(card));
    });
  
    // Fetch and render salons
    async function fetchSalons() {
      try {
        const response = await fetch("/api/salons");
        const salons = await response.json();
        renderSalons(salons);
      } catch (error) {
        console.error("Error fetching salons:", error);
        M.toast({ html: "Error loading salons. Please try again later." });
      }
    }
  
    // Salon rendering function
    function renderSalons(salons) {
      const container = document.getElementById("salons-container");
      container.innerHTML = salons
        .map(
          (salon) => `
              <div class="salon-card" data-suburb="${salon.suburb}">
                  <div class="salon-image" style="background-image: url(${
                        salon.image || "null"
                   })"></div>
                  <div class="salon-card-content">
                      <h5 class="salon-card-title">${salon.name}</h5>
                      <p class="salon-info">${salon.description}</p>
                      <p class="salon-info-add">${salon.addressLine}</p>
                      <p class="salon-info-sub">${salon.suburb}</p>
                      <p class = "salon-info">Salon Hours :</p>
                      <p class="salon-info">
                          <i class="material-icons tiny">schedule</i>
                          ${salon.openingTime} - ${salon.closingTime}
                      </p>
                      <button onclick="openAppointmentModal('${salon._id}')" 
                              class="btn waves-effect waves-light book-btn">
                          Book Appointment
                          <i class="material-icons right">event</i>
                      </button>
                  </div>
              </div>
          `
        )
        .join("");
    }
  
    // Rest of your existing JavaScript...
    // (appointment modal and form submission code remains the same)
    // Open appointment modal
    window.openAppointmentModal = function (salonId) {
      const modal = M.Modal.getInstance(
        document.getElementById("appointment-modal")
      );
      const serviceSelect = document.getElementById("service");
  
      // Fetch salon details to populate services
      fetch(`/api/salons/${salonId}`)
        .then((response) => response.json())
        .then((salon) => {
          // Clear existing options
          serviceSelect.innerHTML =
            '<option value="" disabled selected>Choose Service</option>';
  
          // Populate services
          salon.categoriesAndServices.forEach((category) => {
            const group = document.createElement("optgroup");
            group.label = category.category;
  
            category.services.forEach((service) => {
              const option = document.createElement("option");
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
      document.getElementById("salon-id").value = salonId;
      modal.open();
    };
  
    // Submit appointment form
    document
      .getElementById("appointment-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = {
          salon: document.getElementById("salon-id").value,
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          date: document.getElementById("appointment-date").value,
          time: document.getElementById("appointment-time").value,
          service: document.getElementById("service").value,
          user: localStorage.getItem("userId"),
        };
        console.log(formData);
  
        try {
          const response = await fetch("/api/appointments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
  
          if (response.ok) {
            M.toast({ html: "Appointment Booked Successfully!" });
            const modal = M.Modal.getInstance(
              document.getElementById("appointment-modal")
            );
            modal.close();
            document.getElementById("appointment-form").reset();
          } else {
            const error = await response.json();
            //M.toast({html: Error: ${error.message}});
          }
        } catch (error) {
          console.error("Error submitting appointment:", error);
          M.toast({ html: "Error booking appointment" });
        }
      });
  
    // Initial fetch of salons
    fetchSalons();
  });
  