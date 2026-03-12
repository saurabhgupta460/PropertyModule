document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 0;
    const steps = [null, document.getElementById('step-1'), document.getElementById('step-2'), document.getElementById('step-3'), document.getElementById('step-4')];
    const indicators = [null, document.getElementById('step-indicator-1'), document.getElementById('step-indicator-2'), document.getElementById('step-indicator-3'), document.getElementById('step-indicator-4')];

    const startButton = document.getElementById('start-button');
    const cancelButton = document.getElementById('cancel-button');
    const cancelFormButton = document.getElementById('cancel-form-button');
    const landingView = document.getElementById('landing-view');
    const formContainer = document.getElementById('form-container');

    const unitDetailsForm = document.getElementById('unit-details-form');
    const unitAddressContainer = document.getElementById('unit-address-container');
    const rentForm = document.getElementById('rent-form');
    const confirmationModal = document.getElementById('confirmationModal');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');


    const populateProperties = () => {
        const propertySelect = document.getElementById('property-select');
        const propertiesJSON = localStorage.getItem('propertyData');

        if (propertiesJSON) {
            const properties = JSON.parse(propertiesJSON);
            properties.forEach(property => {
                const option = document.createElement('option');
                option.value = property.id;
                option.textContent = property.address;
                propertySelect.appendChild(option);
            });
        } else {
            console.warn('Property data not found in localStorage.');
            // Optionally, disable the form or show a message
        }
    };

    const renderReview = () => {
        // Unit Details
        const propertySelect = document.getElementById('property-select');
        document.getElementById('review-property').textContent = propertySelect.options[propertySelect.selectedIndex].text;
        document.getElementById('review-unit-name').textContent = document.getElementById('unit-name').value;
        const addressOption = document.querySelector('input[name="address-option"]:checked').value;
        if (addressOption === 'same') {
            document.getElementById('review-unit-address').textContent = 'Same as property address';
        } else {
            document.getElementById('review-unit-address').textContent = document.getElementById('unit-address').value || 'N/A';
        }
        document.getElementById('review-unit-beds').textContent = document.getElementById('unit-beds').value;
        document.getElementById('review-unit-baths').textContent = document.getElementById('unit-baths').value;
        document.getElementById('review-unit-sqft').textContent = `${document.getElementById('unit-sqft').value || 'N/A'} sq. ft.`;

        // Rental Information
        document.getElementById('review-unit-status').textContent = document.getElementById('unit-status').value;
        document.getElementById('review-waiting-list').textContent = document.getElementById('waiting-list-status').value;
        document.getElementById('review-ready-for-showing').textContent = document.getElementById('ready-for-showing').value || 'N/A';
        document.getElementById('review-available-on').textContent = document.getElementById('available-on').value || 'N/A';
        document.getElementById('review-market-rent').textContent = `$${document.getElementById('market-rent').value || '0'}`;
        document.getElementById('review-applicant-fee').textContent = `$${document.getElementById('applicant-fee').value || '0'}`;
        document.getElementById('review-security-deposit').textContent = `$${document.getElementById('security-deposit').value || '0'}`;
        document.getElementById('review-non-revenue').textContent = document.getElementById('non-revenue-status').checked ? 'Yes' : 'No';
        document.getElementById('review-ad-description').textContent = document.getElementById('rental-ad-description').value || 'No description provided.';

        // Amenities
        const amenitiesContainer = document.getElementById('review-amenities');
        amenitiesContainer.innerHTML = '';
        const selectedAmenities = document.querySelectorAll('input[name="amenity"]:checked');
        if (selectedAmenities.length > 0) {
            const amenitiesList = document.createElement('ul');
            amenitiesList.className = 'list-disc list-inside grid grid-cols-2 sm:grid-cols-3 gap-x-4';
            selectedAmenities.forEach(checkbox => {
                const amenityItem = document.createElement('li');
                amenityItem.textContent = checkbox.parentElement.querySelector('span').textContent;
                amenitiesList.appendChild(amenityItem);
            });
            amenitiesContainer.appendChild(amenitiesList);
        } else {
            amenitiesContainer.textContent = 'No amenities selected.';
        }
    };

    const goToStep = (stepNumber) => {
        currentStep = stepNumber;

        landingView.classList.add('hidden', 'opacity-0');
        formContainer.classList.remove('hidden');
        setTimeout(() => formContainer.classList.remove('opacity-0'), 10);

        steps.forEach((stepEl, index) => {
            if (index === 0) return;
            if (index === currentStep) {
                stepEl.classList.remove('hidden');
            } else {
                stepEl.classList.add('hidden');
            }
        });

        indicators.forEach((indicatorEl, index) => {
            if (index === 0) return;
            indicatorEl.classList.remove('bg-green-600', 'text-white');
            indicatorEl.classList.add('bg-gray-200', 'text-gray-500');

            if (index < currentStep) {
                indicatorEl.classList.add('bg-green-500', 'text-white');
            } else if (index === currentStep) {
                indicatorEl.classList.add('bg-green-600', 'text-white');
            }
        });

        if (currentStep === 4) {
            renderReview();
        }
    };

    startButton.addEventListener('click', () => {
        goToStep(1);
        populateProperties();
    });
    cancelButton.addEventListener('click', () => window.location.href = 'Property_listing.html');
    cancelFormButton.addEventListener('click', () => window.location.href = 'Property_listing.html');

    document.getElementById('next-step-1').addEventListener('click', (e) => {
        e.preventDefault();
        if (unitDetailsForm.checkValidity()) {
            goToStep(2);
        } else {
            unitDetailsForm.reportValidity();
        }
    });

    document.getElementById('previous-step-2').addEventListener('click', () => goToStep(1));
    document.getElementById('next-step-2').addEventListener('click', (e) => {
        e.preventDefault();
        if (rentForm.checkValidity()) {
            goToStep(3);
        } else {
            rentForm.reportValidity();
        }
    });

    document.getElementById('previous-step-3').addEventListener('click', () => goToStep(2));
    document.getElementById('next-step-3').addEventListener('click', (e) => {
        e.preventDefault();
        goToStep(4);
    });

    document.getElementById('previous-step-4').addEventListener('click', () => goToStep(3));

    document.getElementById('step-4').addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-step-btn');
        if (editBtn) {
            const stepToEdit = parseInt(editBtn.getAttribute('data-edit-step'), 10);
            if (stepToEdit) {
                goToStep(stepToEdit);
            }
        }
    });

    const submitUnitData = () => {
        const amenities = [];
        document.querySelectorAll('input[name="amenity"]:checked').forEach(checkbox => {
            amenities.push(checkbox.value);
        });

        const unitData = {
            property: document.getElementById('property-select').value,
            name: document.getElementById('unit-name').value, 
            addressOption: document.querySelector('input[name="address-option"]:checked').value,
            address: document.getElementById('unit-address').value,
            bedrooms: document.getElementById('unit-beds').value,
            bathrooms: document.getElementById('unit-baths').value,
            size: document.getElementById('unit-sqft').value,
            status: document.getElementById('unit-status').value,
            waitingListStatus: document.getElementById('waiting-list-status').value,
            readyForShowing: document.getElementById('ready-for-showing').value,
            availableOn: document.getElementById('available-on').value,
            rentalAdDescription: document.getElementById('rental-ad-description').value,
            isNonRevenue: document.getElementById('non-revenue-status').checked,
            marketRent: document.getElementById('market-rent').value,
            securityDeposit: document.getElementById('security-deposit').value,
            applicantFee: document.getElementById('applicant-fee').value,
            amenities: amenities
        };

        console.log("Unit Data Submitted:", unitData);
        alert('Unit setup complete! Check the console for the data.');
        window.location.href = 'Property_listing.html';
    };

    document.getElementById('submit-button').addEventListener('click', (e) => {
        e.preventDefault();
        confirmationModal.classList.remove('hidden');
    });

    modalConfirmBtn.addEventListener('click', () => {
        confirmationModal.classList.add('hidden');
        submitUnitData();
    });

    modalCancelBtn.addEventListener('click', () => {
        confirmationModal.classList.add('hidden');
    });

    document.querySelectorAll('input[name="address-option"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'different') {
                unitAddressContainer.classList.remove('hidden');
            } else {
                unitAddressContainer.classList.add('hidden');
            }
        });
    });

    const fileUploadInput = document.getElementById('file-upload');
    const fileList = document.getElementById('file-list');
    fileUploadInput.addEventListener('change', (e) => {
        fileList.innerHTML = '';
        if (fileUploadInput.files.length > 0) {
            const files = Array.from(fileUploadInput.files);
            files.forEach(file => {
                fileList.innerHTML += `<p>${file.name}</p>`;
            });
        }
    });
});