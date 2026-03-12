document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 0;
    let propertyType = '';
    let propertySubtype = '';

    const startButton = document.getElementById('start-button');
    const cancelButton = document.getElementById('cancel-button');
    const landingView = document.getElementById('landing-view');
    const formContainer = document.getElementById('form-container');
    const quickActionButton = document.getElementById('quick-action-button');
    const quickActionMenu = document.getElementById('quick-action-menu');
    const cancelFormButton = document.getElementById('cancel-form-button');
    const stepIndicator1 = document.getElementById('step-indicator-1');
    const stepIndicator2 = document.getElementById('step-indicator-2');
    const stepIndicator3 = document.getElementById('step-indicator-3');
    const stepIndicator4 = document.getElementById('step-indicator-4');
    const stepIndicator5 = document.getElementById('step-indicator-5');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const step4 = document.getElementById('step-4');
    const step5 = document.getElementById('step-5');
    const step6 = document.getElementById('step-6');
    const steps = [null, step1, step2, step3, step4, step5, step6];
    const indicators = document.querySelectorAll('.step-indicator');

    const residentialCard = document.getElementById('residential-card');
    const commercialCard = document.getElementById('commercial-card');
    const residentialOptions = document.getElementById('residential-options');
    const commercialOptions = document.getElementById('commercial-options');
    const subtypeButtons = document.querySelectorAll('.subtype-button');
    const nextStep1 = document.getElementById('next-step-1');
    const nextStep2 = document.getElementById('next-step-2');
    const nextStep3 = document.getElementById('next-step-3');
    const submitButton = document.getElementById('submit-button');
    const addressForm = document.getElementById('address-form');
    const renewalTemplateRadios = document.querySelectorAll('input[name="renewalTemplate"]');
    const renewalSpecificOptions = document.getElementById('renewal-specific-options');
    const managementFeeRadios = document.querySelectorAll('input[name="managementFee"]');
    const managementFeeSpecificOptions = document.getElementById('management-fee-specific-options');

    const goToStep = (stepNumber) => {
        currentStep = stepNumber;
        landingView.classList.add('hidden', 'opacity-0');
        formContainer.classList.remove('hidden');
        setTimeout(() => formContainer.classList.remove('opacity-0'), 10);

        quickActionMenu.innerHTML = '';
        let actions = [];
        if (currentStep === 3) {
            actions.push({ text: 'Set Bounce Check fee', action: () => alert('Set Bounce Check fee clicked!') });
            actions.push({ text: 'Manage Custom Fields', action: () => alert('Manage Custom Fields clicked!') });
        } else if (currentStep === 4) {
            actions.push({ text: 'Manage Chart of Accounts', action: () => alert('Manage Chart of Accounts clicked!') });
        }

        if (actions.length > 0) {
            actions.forEach(action => {
                const link = document.createElement('a');
                link.href = '#';
                link.className = 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100';
                link.textContent = action.text;
                link.onclick = (e) => { e.preventDefault(); action.action(); quickActionMenu.classList.add('hidden'); };
                quickActionMenu.appendChild(link);
            });
            quickActionButton.classList.remove('hidden');
        } else {
            quickActionButton.classList.add('hidden');
        }

        steps.forEach((stepEl, index) => {
            if (index > 0) {
                stepEl.classList.toggle('hidden', index !== currentStep);
            }
        });

        indicators.forEach((indicatorEl, index) => {
            const stepNum = index + 1;
            indicatorEl.classList.remove('bg-indigo-600', 'bg-green-500', 'text-white', 'bg-gray-200', 'text-gray-500');
            if (stepNum < currentStep) {
                indicatorEl.classList.add('bg-green-500', 'text-white');
            } else if (stepNum === currentStep) {
                indicatorEl.classList.add('bg-indigo-600', 'text-white');
            } else {
                indicatorEl.classList.add('bg-gray-200', 'text-gray-500');
            }
        });

        if (currentStep === 6) {
            renderReview();
        }
    };

    startButton.addEventListener('click', () => {
        goToStep(1);
    });

    cancelButton.addEventListener('click', () => {
        window.location.href = 'Property_listing.html';
    });

    quickActionButton.addEventListener('click', (e) => {
        e.stopPropagation();
        quickActionMenu.classList.toggle('hidden');
    });

    // Close quick action menu if clicking outside
    window.addEventListener('click', (e) => {
        if (!quickActionButton.contains(e.target) && !quickActionMenu.contains(e.target)) {
            quickActionMenu.classList.add('hidden');
        }
    });

    cancelFormButton.addEventListener('click', () => {
        window.location.href = 'Property_listing.html';
    });

    const handleTypeSelection = (card, optionsDiv) => {
        const isSelected = card.classList.contains('border-indigo-500');
        // Deselect others and hide their options
        document.querySelectorAll('.property-card').forEach(c => {
            c.classList.remove('border-indigo-500');
        });
        residentialOptions.classList.add('hidden');
        commercialOptions.classList.add('hidden');
        nextStep1.classList.add('hidden');

        if (!isSelected) {
            card.classList.add('border-indigo-500');
            propertyType = card.dataset.type;
            optionsDiv.classList.remove('hidden');
            propertySubtype = ''; // Reset subtype when main type changes
        } else {
            propertyType = '';
            optionsDiv.classList.add('hidden');
        }
    };

    residentialCard.addEventListener('click', () => {
        handleTypeSelection(residentialCard, residentialOptions);
    });

    commercialCard.addEventListener('click', () => {
        handleTypeSelection(commercialCard, commercialOptions);
    });

    subtypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            subtypeButtons.forEach(btn => btn.classList.remove('bg-indigo-600', 'text-white'));
            button.classList.add('bg-indigo-600', 'text-white');
            propertySubtype = button.dataset.subtype;
            nextStep1.classList.remove('hidden');
        });
    });

    nextStep1.addEventListener('click', () => {
        if (propertyType && propertySubtype) {
            goToStep(2);
        }
    });
    
    nextStep2.addEventListener('click', (e) => {
        e.preventDefault();
        if (addressForm.checkValidity()) {
            goToStep(3);
        } else {
            addressForm.reportValidity();
        }
    });

    nextStep3.addEventListener('click', (e) => {
        e.preventDefault();
        const ownerEntries = document.querySelectorAll('.owner-entry');
        let allFieldsFilled = true;
        let totalPercentage = 0;

        ownerEntries.forEach(entry => {
            const name = entry.querySelector('input[name="ownerName"]').value;
            const percentageValue = entry.querySelector('input[name="ownerPercentage"]').value;
            if (!name || !percentageValue) {
                allFieldsFilled = false;
            } else {
                const percentage = parseFloat(percentageValue);
                totalPercentage += percentage;
            }
        });

        if (!allFieldsFilled) {
            alert('Please fill out all owner names and percentages.');
        } else if (Math.abs(totalPercentage - 100) > 0.001) { // Using a tolerance for float comparison
            alert(`The total ownership percentage must be exactly 100%. The current total is ${totalPercentage.toFixed(2)}%.`);
        } else {
            goToStep(4);
        }
    });

    document.getElementById('next-step-4').addEventListener('click', () => goToStep(5));
    document.getElementById('next-step-5').addEventListener('click', () => goToStep(6));

    // Generic previous button handler
    document.querySelectorAll('[id^="previous-step-"]').forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        });
    });

    // Handle edit button clicks on the review page
    document.getElementById('step-6').addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-step-btn');
        if (editBtn) {
            const stepToEdit = parseInt(editBtn.dataset.editStep, 10);
            goToStep(stepToEdit);
        }
    });
    
    const ownersContainer = document.getElementById('owners-container');
    const addOwnerButton = document.getElementById('add-owner-button');

    const addOwnerFields = () => {
        const ownerDiv = document.createElement('div');
        ownerDiv.className = 'owner-entry grid grid-cols-1 sm:grid-cols-9 gap-4 items-center bg-gray-50 p-4 rounded-lg';
        ownerDiv.innerHTML = `
            <div class="sm:col-span-3">
                <label class="block text-sm font-medium text-gray-700">Owner Name</label>
                <input type="text" name="ownerName" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2">
            </div>
            <div class="sm:col-span-3">
                <label class="block text-sm font-medium text-gray-700">Effective date</label>
                <input type="date" name="ownerEffectiveDate" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2">
            </div>
            <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Ownership (%)</label>
                <input type="number" name="ownerPercentage" required min="0.01" max="100" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2">
            </div>
            <div class="sm:col-span-1 flex items-end h-full">
                <button type="button" class="remove-owner-button bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition-colors w-10 h-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" /></svg>
                </button>
            </div>
        `;
        // Set the effective date to today by default
        const today = new Date().toISOString().split('T')[0];
        ownerDiv.querySelector('input[name="ownerEffectiveDate"]').value = today;

        ownersContainer.appendChild(ownerDiv);
        ownerDiv.querySelector('.remove-owner-button').addEventListener('click', () => {
            ownerDiv.remove();
        });
    };

    addOwnerButton.addEventListener('click', addOwnerFields);
    addOwnerFields(); // Add the first owner fields by default

    // Populate month picker for renewal options
    const monthPicker = document.getElementById('renewal-month-picker');
    for (let i = 3; i <= 20; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} Months`;
        monthPicker.appendChild(option);
    }

    // Handle visibility of specific renewal settings
    renewalTemplateRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'specific') {
                renewalSpecificOptions.classList.remove('hidden');
            } else {
                renewalSpecificOptions.classList.add('hidden');
            }
        });
    });

    // Handle visibility of specific management fee settings
    managementFeeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'specific') {
                managementFeeSpecificOptions.classList.remove('hidden');
            } else {
                managementFeeSpecificOptions.classList.add('hidden');
            }
        });
    });

    const renderReview = () => {
        // Step 1
        document.getElementById('review-property-type').textContent = propertyType || 'N/A';
        document.getElementById('review-property-subtype').textContent = propertySubtype || 'N/A';

        // Step 2
        const address = `${document.getElementById('street').value}, ${document.getElementById('city').value}, ${document.getElementById('state').value} ${document.getElementById('zip').value}, ${document.getElementById('country').value}`;
        document.getElementById('review-address').textContent = address;

        // Step 3
        const ownerNames = Array.from(document.querySelectorAll('input[name="ownerName"]')).map(input => input.value).join(', ');
        document.getElementById('review-owners').textContent = ownerNames || 'N/A';
        document.getElementById('review-site-manager').textContent = document.getElementById('site-manager-name').value || 'N/A';

        // Step 4
        const bankAccounts = Array.from(document.querySelectorAll('input[name="bankAccount"]:checked')).map(cb => cb.value).join(', ');
        document.getElementById('review-bank-accounts').textContent = bankAccounts || 'None';
        const reserve = document.getElementById('property-reserve').value;
        document.getElementById('review-property-reserve').textContent = reserve ? `$${reserve}` : 'Not set';

        // Step 5
        const leaseForm = document.querySelector('input[name="leaseForm"]:checked').value;
        document.getElementById('review-lease-form').textContent = leaseForm === 'global' ? 'Global Setting' : 'Property Specific';

        const renewal = document.querySelector('input[name="renewalTemplate"]:checked').value;
        document.getElementById('review-renewal-settings').textContent = renewal === 'global' ? 'Global Setting' : 'Property Specific';

        const mgmtFee = document.querySelector('input[name="managementFee"]:checked').value;
        document.getElementById('review-management-fee').textContent = mgmtFee === 'global' ? 'Global Setting' : 'Property Specific';

        const lateFee = document.querySelector('input[name="lateFee"]:checked').value;
        document.getElementById('review-late-fee').textContent = lateFee === 'global' ? 'Global Setting' : 'Property Specific';
    };

    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        const address = {
            street: document.getElementById('street').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value,
        };

        const owners = [];
        const ownerEntries = document.querySelectorAll('.owner-entry');
        let totalPercentage = 0;
        ownerEntries.forEach(entry => {
            const name = entry.querySelector('input[name="ownerName"]').value;
            const percentage = parseFloat(entry.querySelector('input[name="ownerPercentage"]').value);
            totalPercentage += percentage;
            owners.push({ name, percentage });
        });
        
        const bankAccounts = [];
        if (document.getElementById('operating-account').checked) {
            bankAccounts.push('Operating');
        }
        if (document.getElementById('deposit-trust-account').checked) {
            bankAccounts.push('DepositTrust');
        }
        const propertyReserve = document.getElementById('property-reserve').value;

        const leaseFormSetting = document.querySelector('input[name="leaseForm"]:checked').value;
        const renewalTemplateSetting = document.querySelector('input[name="renewalTemplate"]:checked').value;

        let specificRenewalSettings = null;
        if (renewalTemplateSetting === 'specific') {
            specificRenewalSettings = {
                rentIncreaseType: document.querySelector('input[name="rentIncreaseType"]:checked').value,
                months: document.getElementById('renewal-month-picker').value,
                chargeAmount: document.getElementById('renewal-charge-amount').value,
                additionalFee: document.getElementById('renewal-additional-fee').value,
                renewalFee: document.getElementById('renewal-fee').value,
            };
        }

        const managementFeeSetting = document.querySelector('input[name="managementFee"]:checked').value;
        let specificManagementFeeSettings = null;
        if (managementFeeSetting === 'specific') {
            specificManagementFeeSettings = {
                startDate: document.getElementById('management-fee-start-date').value,
                chargeIfVacant: document.getElementById('management-fee-charge-vacant').checked,
                percentage: document.getElementById('management-fee-percentage').value,
                minFee: document.getElementById('management-fee-min').value,
                maxFee: document.getElementById('management-fee-max').value,
            };
        }

        const lateFeeSetting = document.querySelector('input[name="lateFee"]:checked').value;


        const siteManager = {
            name: document.getElementById('site-manager-name').value,
            email: document.getElementById('site-manager-email').value,
            phone: document.getElementById('site-manager-phone').value,
        };

        const data = {
            propertyType: propertyType,
            propertySubtype: propertySubtype,
            owners: owners,
            address: address,
            siteManager: siteManager,
            bankAccounts: bankAccounts,
            propertyReserve: propertyReserve,
            leaseForm: leaseFormSetting,
            renewalTemplate: renewalTemplateSetting,
            specificRenewalSettings: specificRenewalSettings,
            managementFee: managementFeeSetting,
            specificManagementFeeSettings: specificManagementFeeSettings,
            lateFee: lateFeeSetting,
            propertyGroup: document.getElementById('property-group-select')?.value || "No group",
        };

        // In a real application, you would send this data to a server.
        // For this demo, we'll simulate success and redirect.
        console.log("Property data submitted:", data);
        window.location.href = 'Property_listing.html';
    });

    const propertyPicturesUpload = document.getElementById('property-pictures-upload');
    const propertyPicturesList = document.getElementById('property-pictures-list');
    propertyPicturesUpload.addEventListener('change', () => {
        propertyPicturesList.innerHTML = '';
        if (propertyPicturesUpload.files.length > 0) {
            const files = Array.from(propertyPicturesUpload.files);
            const fileNames = files.map(file => `<p>${file.name}</p>`).join('');
            propertyPicturesList.innerHTML = fileNames;
        }
    });
});