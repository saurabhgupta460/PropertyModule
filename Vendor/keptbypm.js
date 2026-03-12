document.addEventListener('DOMContentLoaded', function () {
    // Mock Data - Replace with actual API calls
    const mockChargeCategories = [
        { id: 1, name: 'Management Fee' },
        { id: 2, name: 'Leasing Fee' },
        { id: 3, name: 'Maintenance Coordination' },
        { id: 4, name: 'Late Fee Income' },
        { id: 5, name: 'Application Fee' },
        { id: 6, name: 'Pet Fee' },
    ];

    const mockProperties = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Property ${i + 1}`,
        type: ['Residential', 'Commercial', 'Multi-unit'][i % 3],
        status: ['Active', 'Archive'][i % 2],
        owner: `Owner ${['A', 'B', 'C'][i % 3]}`
    }));

    const mockOwners = ['Owner A', 'Owner B', 'Owner C'];

    let keptByPMRules = []; // To store created rules
    let selectedCharges = [];

    // DOM Elements
    const createNewRuleBtn = document.getElementById('createNewKeptByPMRuleBtn');
    const modal = document.getElementById('keptByPMRuleModal');
    const closeModalBtn = document.getElementById('closeKeptByPMModalBtn');
    const nextStepBtn = document.getElementById('keptByPMNextStepBtn');
    const prevStepBtn = document.getElementById('keptByPMPrevStepBtn');
    const saveRuleBtn = document.getElementById('keptByPMSaveRuleBtn');

    const steps = ['keptbypm-step-1', 'keptbypm-step-2', 'keptbypm-step-3'];
    const stepIndicators = ['keptbypm-step-1-indicator', 'keptbypm-step-2-indicator', 'keptbypm-step-3-indicator'];
    let currentStep = 0;

    // Form Elements
    const ruleNameInput = document.getElementById('keptByPMRuleName');
    const chargeSelectInput = document.getElementById('keptByPMChargeSelectInput');
    const chargeTagsContainer = document.getElementById('keptbypm-charge-tags-container');
    const chargeSuggestionsDropdown = document.getElementById('keptbypm-charge-suggestions-dropdown');

    
    // Property Selection
    const propertySearchInput = document.getElementById('keptByPMPropertySearchInput');
    const propertyCheckboxList = document.getElementById('keptbypm-property-checkbox-list');
    const propertyTypeFilter = document.getElementById('keptbypm-property-type-filter');
    const propertyStatusFilter = document.getElementById('keptbypm-property-status-filter');
    const propertyOwnerFilter = document.getElementById('keptbypm-property-owner-filter');

    // Review Elements
    const reviewRuleName = document.getElementById('keptbypm-review-ruleName');
    const reviewCharges = document.getElementById('keptbypm-review-charges');
    const reviewProperties = document.getElementById('keptbypm-review-properties');

    // Rules List
    const rulesListBody = document.getElementById('keptbypm-rules-list-body');
    const noRulesMessage = document.getElementById('no-keptbypm-rules-message');

    // --- Modal and Step Navigation ---

    const openModal = () => {
        resetModal();
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    };

    const updateStepView = () => {
        steps.forEach((stepId, index) => {
            document.getElementById(stepId).classList.toggle('hidden', index !== currentStep);
        });

        stepIndicators.forEach((indicatorId, index) => {
            const indicator = document.getElementById(indicatorId);
            const span = indicator.querySelector('span:first-child');
            const textSpan = span.querySelector('span');

            if (index < currentStep) {
                span.classList.remove('border-2', 'border-gray-300');
                span.classList.add('bg-indigo-600');
                textSpan.classList.add('text-white');
                indicator.classList.add('text-indigo-600');
            } else if (index === currentStep) {
                span.classList.remove('border-2', 'border-gray-300');
                span.classList.add('bg-indigo-600');
                textSpan.classList.add('text-white');
                indicator.classList.add('text-indigo-600');
            } else {
                span.classList.remove('bg-indigo-600');
                span.classList.add('border-2', 'border-gray-300');
                textSpan.classList.remove('text-white');
                indicator.classList.remove('text-indigo-600');
                indicator.classList.add('text-gray-500');
            }
        });

        prevStepBtn.classList.toggle('hidden', currentStep === 0);
        nextStepBtn.classList.toggle('hidden', currentStep === steps.length - 1);
        saveRuleBtn.classList.toggle('hidden', currentStep !== steps.length - 1);
    };

    const goToNextStep = () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                if (currentStep === steps.length - 1) {
                    populateReview();
                }
                updateStepView();
            }
        }
    };

    const goToPrevStep = () => {
        if (currentStep > 0) {
            currentStep--;
            updateStepView();
        }
    };

    const resetModal = () => {
        currentStep = 0;
        ruleNameInput.value = '';
        selectedCharges = [];
        updateChargeTags();
        Array.from(propertyCheckboxList.querySelectorAll('input')).forEach(cb => cb.checked = false);
        propertyTypeFilter.value = 'all';
        propertyStatusFilter.value = 'all';
        propertyOwnerFilter.value = 'all';
        filterProperties();
        updateStepView();
    };

    // Multi-select Charge Logic
    const renderChargeSuggestions = (filter = '') => {
        chargeSuggestionsDropdown.innerHTML = '';
        const filteredCharges = mockChargeCategories.filter(charge =>
            !selectedCharges.some(sc => sc.id === charge.id) &&
            charge.name.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredCharges.length === 0) {
            chargeSuggestionsDropdown.classList.add('hidden');
        } else {
            filteredCharges.forEach(charge => {
                const div = document.createElement('div');
                div.className = 'p-2 hover:bg-indigo-100 cursor-pointer text-sm';
                div.textContent = charge.name;
                div.onclick = () => addCharge(charge);
                chargeSuggestionsDropdown.appendChild(div);
            });
            chargeSuggestionsDropdown.classList.remove('hidden');
        }
    };

    const addCharge = (charge) => {
        selectedCharges.push(charge);
        updateChargeTags();
        chargeSelectInput.value = '';
        chargeSuggestionsDropdown.classList.add('hidden');
        chargeSelectInput.focus();
    };

    const removeCharge = (chargeId) => {
        selectedCharges = selectedCharges.filter(c => c.id !== chargeId);
        updateChargeTags();
    };

    const updateChargeTags = () => {
        const tags = chargeTagsContainer.querySelectorAll('.tag');
        tags.forEach(tag => tag.remove());

        selectedCharges.forEach(charge => {
            const tag = document.createElement('span');
            tag.className = 'tag bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded flex items-center';
            tag.innerHTML = `${charge.name} <button type="button" class="ml-2 text-indigo-800 hover:text-indigo-900">&times;</button>`;
            tag.querySelector('button').onclick = () => removeCharge(charge.id);
            chargeTagsContainer.insertBefore(tag, chargeSelectInput);
        });
    };

    chargeSelectInput.addEventListener('input', () => renderChargeSuggestions(chargeSelectInput.value));
    chargeSelectInput.addEventListener('focus', () => renderChargeSuggestions(chargeSelectInput.value));
    document.addEventListener('click', (e) => {
        if (!chargeSelectInput.contains(e.target) && !chargeSuggestionsDropdown.contains(e.target)) {
            chargeSuggestionsDropdown.classList.add('hidden');
        }
    });

    // --- Step 2: Properties ---

    const populatePropertyFilters = () => {
        propertyOwnerFilter.innerHTML = '<option value="all">All Owners</option>';
        mockOwners.forEach(owner => {
            const option = document.createElement('option');
            option.value = owner;
            option.textContent = owner;
            propertyOwnerFilter.appendChild(option);
        });
    };

    const filterProperties = () => {
        const searchTerm = propertySearchInput.value.toLowerCase();
        const type = propertyTypeFilter.value;
        const status = propertyStatusFilter.value;
        const owner = propertyOwnerFilter.value;

        const filtered = mockProperties.filter(prop =>
            prop.name.toLowerCase().includes(searchTerm) &&
            (type === 'all' || prop.type === type) &&
            (status === 'all' || prop.status === status) &&
            (owner === 'all' || prop.owner === owner)
        );

        renderPropertyCheckboxes(filtered);
    };

    const renderPropertyCheckboxes = (properties) => {
        propertyCheckboxList.innerHTML = '';
        if (properties.length === 0) {
            propertyCheckboxList.innerHTML = '<p class="text-center text-gray-500 p-4">No properties match the criteria.</p>';
            return;
        }
        properties.forEach(prop => {
            const div = document.createElement('div');
            div.className = 'flex items-center p-2 rounded hover:bg-gray-50';
            div.innerHTML = `
                <input id="prop-${prop.id}" type="checkbox" value="${prop.id}" class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                <label for="prop-${prop.id}" class="ml-3 block text-sm font-medium text-gray-700">${prop.name}</label>
            `;
            propertyCheckboxList.appendChild(div);
        });
    };

    // --- Step 3: Review ---

    const populateReview = () => {
        reviewRuleName.textContent = ruleNameInput.value || 'N/A';

        if (selectedCharges.length > 0) {
            reviewCharges.innerHTML = selectedCharges.map(c => `<div>${c.name}</div>`).join('');
        } else {
            reviewCharges.textContent = 'All Charges';
        }

        const selectedProperties = Array.from(propertyCheckboxList.querySelectorAll('input:checked'))
            .map(cb => {
                const prop = mockProperties.find(p => p.id == cb.value);
                return prop ? `<div>${prop.name}</div>` : '';
            });

        if (selectedProperties.length > 0) {
            reviewProperties.innerHTML = selectedProperties.join('');
        } else {
            reviewProperties.textContent = 'All Properties';
        }
    };

    // --- Validation ---

    const validateStep = (stepIndex) => {
        let isValid = true;
        // Clear previous errors
        document.getElementById('keptByPMRuleName-error').classList.add('hidden');
        document.getElementById('keptbypm-charge-error').classList.add('hidden');

        if (stepIndex === 0) {
            if (!ruleNameInput.value.trim()) {
                document.getElementById('keptByPMRuleName-error').classList.remove('hidden');
                isValid = false;
            }
            if (selectedCharges.length === 0) {
                document.getElementById('keptbypm-charge-error').classList.remove('hidden');
                isValid = false;
            }
        }
        // No validation needed for step 1 (Properties) or 2 (Review) as selections are optional
        return isValid;
    };

    // --- Save and Render Rules ---

    const saveRule = () => {
        if (!validateStep(0)) { // Re-validate just in case
            alert("Please fill out all required fields.");
            return;
        }

        const selectedPropertyIds = Array.from(propertyCheckboxList.querySelectorAll('input:checked')).map(cb => parseInt(cb.value));

        const newRule = {
            id: Date.now(),
            name: ruleNameInput.value,
            charges: selectedCharges.map(c => c.name),
            properties: selectedPropertyIds.length > 0 ? selectedPropertyIds.map(id => mockProperties.find(p => p.id === id).name) : ['All Properties'],
        };

        // In a real app, you would send this to the server
        console.log('Saving rule:', newRule);
        keptByPMRules.push(newRule);
        renderRulesList();
        closeModal();
    };

    const renderRulesList = () => {
        rulesListBody.innerHTML = '';
        if (keptByPMRules.length === 0) {
            noRulesMessage.classList.remove('hidden');
            rulesListBody.parentElement.parentElement.querySelector('table').classList.add('hidden');
        } else {
            noRulesMessage.classList.add('hidden');
            rulesListBody.parentElement.parentElement.querySelector('table').classList.remove('hidden');

            keptByPMRules.forEach(rule => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${rule.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.charges.join(', ')}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.properties.join(', ')}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-indigo-600 hover:text-indigo-900 mr-4" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="text-red-600 hover:text-red-900" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                rulesListBody.appendChild(tr);
            });
        }
    };

    const init = () => {
        // Buttons
        createNewRuleBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        nextStepBtn.addEventListener('click', goToNextStep);
        prevStepBtn.addEventListener('click', goToPrevStep);
        saveRuleBtn.addEventListener('click', saveRule);

        // Step 1
        populatePropertyFilters();
        renderPropertyCheckboxes(mockProperties);
        propertySearchInput.addEventListener('input', filterProperties);
        propertyTypeFilter.addEventListener('change', filterProperties);
        propertyStatusFilter.addEventListener('change', filterProperties);
        propertyOwnerFilter.addEventListener('change', filterProperties);

        // Initial Render
        updateStepView();
        renderRulesList();
    };

    init();
});