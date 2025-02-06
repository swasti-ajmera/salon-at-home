document.addEventListener("DOMContentLoaded", () => {
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

  const dropdownToggle = document.getElementById("categoryToggle");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const servicesContainer = document.getElementById("servicesContainer");

  dropdownToggle.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });

  dropdownMenu.addEventListener("change", () => {
    servicesContainer.innerHTML = "";

    const selectedCategories = Array.from(dropdownMenu.querySelectorAll("input:checked")).map(
      (checkbox) => checkbox.value
    );

    selectedCategories.forEach((category) => {
      const categoryContainer = document.createElement("div");
      categoryContainer.classList.add("category-container");

      const categoryTitle = document.createElement("strong");
      categoryTitle.textContent = category;
      categoryContainer.appendChild(categoryTitle);

      const servicesDiv = document.createElement("div");
      servicesDiv.classList.add("services-container");

      categories[category].forEach((service) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = `services[]`;
        checkbox.value = `${category} - ${service}`;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${service}`));
        servicesDiv.appendChild(label);
      });

      categoryContainer.appendChild(servicesDiv);
      servicesContainer.appendChild(categoryContainer);
    });
  });

  // Close the dropdown if clicked outside
  document.addEventListener("click", (event) => {
    if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.classList.remove("show");
    }
  });

  // Handle form submission
salonForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Collect form data
  const formData = new FormData(salonForm);
  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    addressLine: formData.get("addressLine"),
    suburb: formData.get("suburb"),
    openingTime: formData.get("openingTime"),
    closingTime: formData.get("closingTime"),
    selectedCategories: Array.from(dropdownMenu.querySelectorAll("input:checked")).map(
      (checkbox) => checkbox.value
    ),
    categoriesAndServices: [],
  };

  // Group selected services under their respective categories
  data.selectedCategories.forEach((category) => {
    const services = Array.from(document.querySelectorAll(`input[name="services[]"][value^="${category}"]:checked`))
      .map((checkbox) => checkbox.value);

    if (services.length > 0) {
      data.categoriesAndServices.push({ category, services });
    }
  });

  try {
    const response = await fetch("/api/salon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Salon details submitted successfully!");
      window.location.href = "/adminDashboard.html"; // Redirecting to dashboard
    } else {
      alert(result.error || "Something went wrong!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error submitting salon details");
  }
});

});