document.addEventListener('DOMContentLoaded', () => {
    // Modal elements
    const rubsRulesPage = document.getElementById('rubsRulesPage');
    const rubsRuleModal = document.getElementById('rubsRuleModal');
    const createNewRubsRuleBtn = document.getElementById('createNewRubsRuleBtn');
    const closeRubsModalBtn = document.getElementById('closeRubsModalBtn');

    // Step elements
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const step1Indicator = document.getElementById('step-1-indicator');
    const step2Indicator = document.getElementById('step-2-indicator');
    const step3Indicator = document.getElementById('step-3-indicator');

    // Navigation buttons
    const prevStepBtn = document.getElementById('prevStepBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const saveRuleBtn = document.getElementById('saveRuleBtn');

    // Form elements
    const ruleNameInput = document.getElementById('ruleName');
    const utilityTypeSelect = document.getElementById('utilityType');
    const calculationMethodSelect = document.getElementById('calculationMethod');
    const paidByTenantInput = document.getElementById('paidByTenant');
    const vendorSelect = document.getElementById('vendorSelect');
    const propertyCheckboxList = document.getElementById('property-checkbox-list');
    const propertySearchInput = document.getElementById('propertySearchInput');
    const propertyTypeFilter = document.getElementById('property-type-filter');
    const propertyStatusFilter = document.getElementById('property-status-filter');
    const propertyOwnerFilter = document.getElementById('property-owner-filter');
    const backToGlobalSettingsBtn = document.getElementById('backToGlobalSettingsBtn');

    // Review elements
    const reviewRuleName = document.getElementById('review-ruleName');
    const reviewUtilityType = document.getElementById('review-utilityType');
    const reviewCalculationMethod = document.getElementById('review-calculationMethod');
    const reviewVendor = document.getElementById('review-vendor');
    const reviewProperties = document.getElementById('review-properties');
    const reviewPaidByTenant = document.getElementById('review-paidByTenant');

    // Rule list elements
    const rulesListBody = document.getElementById('rubs-rules-list-body');
    const noRulesMessage = document.getElementById('no-rubs-rules-message');

    // Calculation Modal Elements
    const calculationModal = document.getElementById('calculationModal');
    const closeCalculationModalBtn = document.getElementById('closeCalculationModalBtn');
    const calculationRuleName = document.getElementById('calculation-rule-name');
    const totalBillAmountInput = document.getElementById('totalBillAmount');
    const runCalculationBtn = document.getElementById('runCalculationBtn');
    const calculationResultsContainer = document.getElementById('calculation-results-container');
    const calculationResultsPlaceholder = document.getElementById('calculation-results-placeholder');
    const calculationResultsTable = document.getElementById('calculation-results-table');

    let currentStep = 1;
    let currentRuleForCalc = null;

    // In-memory data store for rules.
    let rules = [
        {
            id: 1672531200000, // A fixed timestamp for Jan 1, 2023
            ruleName: 'Water/Sewer for 123 Main St',
            utilityType: 'Water',
            calculationMethodValue: 'sqft',
            calculationMethod: 'Based on Square Footage',
            vendor: 'City Water Dept.',
            paidByTenant: '100',
            properties: ['123 Main St, Anytown, USA']
        },
        {
            id: 1675209600000, // A fixed timestamp for Feb 1, 2023
            ruleName: 'Trash Service for All Properties',
            utilityType: 'Trash',
            calculationMethodValue: 'units',
            calculationMethod: 'Number of Units',
            vendor: 'CleanSweep Janitorial',
            paidByTenant: '80',
            properties: ['All Properties']
        }
    ];

    // Dummy data for properties. In a real app, this would be fetched from an API.
    const allPropertiesData = [
        { id: 'p0', address: 'All Properties', type: 'All', status: 'Active', owner: 'All', bathrooms: 0, sqft: 0, beds: 0, tenants: 0 },
        { id: 'p1', address: '123 Main St, Anytown, USA', type: 'Multi-unit', status: 'Active', owner: 'John Doe', bathrooms: 2, sqft: 1200, beds: 2, tenants: 2 },
        { id: 'p2', address: '456 Oak Ave, Somewhere, USA', type: 'Commercial', status: 'Active', owner: 'Jane Smith', bathrooms: 4, sqft: 5000, beds: 0, tenants: 10 },
        { id: 'p3', address: '789 Pine Ln, Villagetown, USA', type: 'Residential', status: 'Active', owner: 'John Doe', bathrooms: 1, sqft: 900, beds: 1, tenants: 1 },
        { id: 'p4', address: '101 Maple Dr, Oldtown, USA', type: 'Residential', status: 'Archive', owner: 'Sam Wilson', bathrooms: 2, sqft: 1500, beds: 3, tenants: 4 },
        { id: 'p5', address: '222 Birch Rd, Newville, USA', type: 'Multi-unit', status: 'Active', owner: 'Jane Smith', bathrooms: 3, sqft: 2500, beds: 4, tenants: 5 }
    ];
    const allVendors = [
        'City Water Dept.', 'GreenScape Landscaping', 'FixIt Plumbing', 'CleanSweep Janitorial', 'General Electric Co.'
    ];

    // --- Initial Load ---
    renderRules();

    // --- Populate Selects ---
    function createCheckboxItem(id, value, name, listContainer) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex items-center checkbox-item';
        const isChecked = value === 'All Properties';
        itemDiv.innerHTML = `
            <input id="${id}" name="${name}" type="checkbox" value="${value}" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" ${isChecked ? 'checked' : ''}>
            <label for="${id}" class="ml-3 block text-sm text-gray-800">${value}</label>
        `;
        listContainer.appendChild(itemDiv);
    }

    function populateSelects() {
        // Populate Owner Filter
        const owners = [...new Set(allPropertiesData.map(p => p.owner).filter(o => o !== 'All'))];
        propertyOwnerFilter.innerHTML = '<option value="all">All Owners</option>';
        owners.forEach(owner => {
            const option = document.createElement('option');
            option.value = owner;
            option.textContent = owner;
            propertyOwnerFilter.appendChild(option);
        });

        // Populate Vendor Select
        vendorSelect.innerHTML = '<option value="">Select a vendor</option>';
        allVendors.forEach(vendor => {
            const option = document.createElement('option');
            option.value = vendor;
            option.textContent = vendor;
            vendorSelect.appendChild(option);
        });

        populatePropertyCheckboxes();
    }

    function populatePropertyCheckboxes() {
        propertyCheckboxList.innerHTML = '';
        const type = propertyTypeFilter.value;
        const status = propertyStatusFilter.value;
        const owner = propertyOwnerFilter.value;
        const searchTerm = propertySearchInput.value.toLowerCase();

        const filteredProperties = allPropertiesData.filter(prop => {
            if (prop.address === 'All Properties') return true;
            const typeMatch = type === 'all' || prop.type === type;
            const statusMatch = status === 'all' || prop.status === status;
            const ownerMatch = owner === 'all' || prop.owner === owner;
            const searchMatch = prop.address.toLowerCase().includes(searchTerm);
            return typeMatch && statusMatch && ownerMatch && searchMatch;
        });

        filteredProperties.forEach(prop => {
            const id = `prop-${prop.id}`;
            createCheckboxItem(id, prop.address, 'includedProperties', propertyCheckboxList);
        });
    }

    // --- Event Listeners ---
    createNewRubsRuleBtn.addEventListener('click', () => {
        rubsRuleModal.classList.remove('hidden');
        populateSelects();
        resetModal();
    });

    closeRubsModalBtn.addEventListener('click', () => {
        rubsRuleModal.classList.add('hidden');
    });

    window.addEventListener('click', (event) => {
        if (event.target === rubsRuleModal) {
            rubsRuleModal.classList.add('hidden');
        }
    });

    // --- Back to Global Settings ---
    if (backToGlobalSettingsBtn) {
        backToGlobalSettingsBtn.addEventListener('click', () => window.location.href = 'global_setting.html');
    }

    // --- Property Filter Listeners ---
    propertyTypeFilter.addEventListener('change', populatePropertyCheckboxes);
    propertyStatusFilter.addEventListener('change', populatePropertyCheckboxes);
    propertyOwnerFilter.addEventListener('change', populatePropertyCheckboxes);
    propertySearchInput.addEventListener('input', populatePropertyCheckboxes);

    function updateStepIndicator(stepIndicator, isActive) {
        const circle = stepIndicator.querySelector('span');
        const connector = stepIndicator.nextElementSibling;

        circle.classList.toggle('bg-indigo-600', isActive);
        circle.classList.toggle('text-white', isActive);
        circle.classList.toggle('border-indigo-600', isActive);
        circle.classList.toggle('bg-white', !isActive);
        circle.classList.toggle('border-gray-300', !isActive);
        stepIndicator.classList.toggle('text-indigo-600', isActive);
        stepIndicator.classList.toggle('text-gray-500', !isActive);
        stepIndicator.setAttribute('aria-current', isActive ? 'step' : 'false');

        if (connector) {
            connector.classList.toggle('border-indigo-600', isActive);
            connector.classList.toggle('border-gray-300', !isActive);
        }
    }

    // --- Step Navigation ---
    nextStepBtn.addEventListener('click', () => {
        // Helper to show/hide errors
        const showError = (inputEl, errorEl, show) => {
            errorEl.classList.toggle('hidden', !show);
            inputEl.classList.toggle('border-red-500', show);
            inputEl.classList.toggle('border-gray-300', !show);
        };

        if (currentStep === 1) {
            let isValid = true;
            if (ruleNameInput.value.trim() === '') {
                showError(ruleNameInput, document.getElementById('ruleName-error'), true);
                isValid = false;
            } else {
                showError(ruleNameInput, document.getElementById('ruleName-error'), false);
            }

            if (vendorSelect.value.trim() === '') {
                showError(vendorSelect, document.getElementById('vendor-error'), true);
                isValid = false;
            } else {
                showError(vendorSelect, document.getElementById('vendor-error'), false);
            }

            if (!isValid) return;

            currentStep = 2;
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            updateStepIndicator(step2Indicator, true);
            prevStepBtn.classList.remove('hidden');
        } else if (currentStep === 2) {
            currentStep = 3;
            step2.classList.add('hidden');
            step3.classList.remove('hidden');
            updateStepIndicator(step3Indicator, true);
            nextStepBtn.classList.add('hidden');
            saveRuleBtn.classList.remove('hidden');
            populateReview();
        }
    });

    prevStepBtn.addEventListener('click', () => {
        if (currentStep === 3) {
            currentStep = 2;
            step3.classList.add('hidden');
            step2.classList.remove('hidden');
            updateStepIndicator(step3Indicator, false);
            saveRuleBtn.classList.add('hidden');
            nextStepBtn.classList.remove('hidden');
        } else if (currentStep === 2) {
            currentStep = 1;
            resetModal();
        }
    });

    saveRuleBtn.addEventListener('click', () => {
        const selectedProperties = Array.from(document.querySelectorAll('#property-checkbox-list input:checked')).map(cb => cb.value);

        const newRule = {
            id: Date.now(),
            ruleName: ruleNameInput.value || 'Untitled RUBS Rule',
            utilityType: utilityTypeSelect.value,
            calculationMethodValue: calculationMethodSelect.value,
            calculationMethod: calculationMethodSelect.options[calculationMethodSelect.selectedIndex].text,
            vendor: vendorSelect.value,
            paidByTenant: paidByTenantInput.value,
            properties: selectedProperties.length === 0 ? ['All'] : selectedProperties
        };

        rules.push(newRule);
        renderRules();
        rubsRuleModal.classList.add('hidden');
    });

    // --- Calculation Modal Listeners ---
    if (closeCalculationModalBtn) closeCalculationModalBtn.addEventListener('click', () => calculationModal.classList.add('hidden'));
    if (runCalculationBtn) runCalculationBtn.addEventListener('click', () => {
        const totalBill = parseFloat(totalBillAmountInput.value);
        runAndDisplayCalculation(currentRuleForCalc, totalBill);
    });

    // --- UI Rendering ---
    function renderRules() {
        rulesListBody.innerHTML = '';

        if (rules.length === 0) {
            noRulesMessage.classList.remove('hidden');
            rulesListBody.parentElement.parentElement.classList.add('hidden');
        } else {
            noRulesMessage.classList.add('hidden');
            rulesListBody.parentElement.parentElement.classList.remove('hidden');

            rules.forEach(rule => {
                const propertiesDisplay = rule.properties.join(', ');
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${rule.ruleName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.utilityType}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.calculationMethod}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.vendor || 'N/A'}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">${propertiesDisplay}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button data-rule-id="${rule.id}" class="calculate-btn text-green-600 hover:text-green-800 mr-4" title="Run Calculation"><i class="fas fa-calculator"></i></button>
                        <button data-rule-id="${rule.id}" class="edit-btn text-indigo-600 hover:text-indigo-900 mr-4" title="Edit Rule"><i class="fas fa-pencil-alt"></i></button>
                        <button data-rule-id="${rule.id}" class="delete-btn text-red-600 hover:text-red-800" title="Delete Rule"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                rulesListBody.appendChild(row);
            });
        }

        // Add event listeners for action buttons
        document.querySelectorAll('.calculate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ruleId = e.currentTarget.dataset.ruleId;
                const rule = rules.find(r => r.id == ruleId);
                if (rule) {
                    openCalculationModal(rule);
                }
            });
        });
    }

    function populateReview() {
        reviewRuleName.textContent = ruleNameInput.value || 'N/A';
        reviewUtilityType.textContent = utilityTypeSelect.value;
        reviewCalculationMethod.textContent = calculationMethodSelect.options[calculationMethodSelect.selectedIndex].text;
        reviewPaidByTenant.textContent = `${paidByTenantInput.value}%`;
        reviewVendor.textContent = vendorSelect.value || 'N/A';
        const selectedProperties = Array.from(document.querySelectorAll('#property-checkbox-list input:checked')).map(cb => cb.value);
        reviewProperties.innerHTML = selectedProperties.length > 0 ? selectedProperties.join('<br>') : 'All Properties';
    }

    function resetModal() {
        currentStep = 1;
        step1.classList.remove('hidden');
        step2.classList.add('hidden');
        step3.classList.add('hidden');

        updateStepIndicator(step1Indicator, true);
        updateStepIndicator(step2Indicator, false);
        updateStepIndicator(step3Indicator, false);

        prevStepBtn.classList.add('hidden');
        nextStepBtn.classList.remove('hidden');
        saveRuleBtn.classList.add('hidden');
        
        ruleNameInput.value = '';
        utilityTypeSelect.selectedIndex = 0;
        calculationMethodSelect.selectedIndex = 0;
        vendorSelect.selectedIndex = 0;
        paidByTenantInput.value = '100';
    }

    // --- CALCULATION LOGIC ---

    function openCalculationModal(rule) {
        currentRuleForCalc = rule;
        calculationRuleName.textContent = `For rule: ${rule.ruleName}`;
        totalBillAmountInput.value = '';
        calculationResultsPlaceholder.classList.remove('hidden');
        calculationResultsTable.classList.add('hidden');
        calculationResultsTable.innerHTML = '';
        calculationModal.classList.remove('hidden');
    }

    function runAndDisplayCalculation(rule, totalBill) {
        if (!rule || isNaN(totalBill) || totalBill <= 0) {
            alert('Please enter a valid total bill amount.');
            return;
        }

        const billableAmount = totalBill * (rule.paidByTenant / 100);
        
        // Determine which properties/units are affected by the rule
        const targetProperties = rule.properties.includes('All Properties') 
            ? allPropertiesData.filter(p => p.id !== 'p0') // Exclude 'All Properties' meta-item
            : allPropertiesData.filter(p => rule.properties.includes(p.address));

        // For simplicity, we'll assume each property is a single billable entity/unit for now.
        // A more complex implementation would iterate through units within each property.
        const billableUnits = targetProperties;

        let totalBasis = 0;
        const calculationMethod = rule.calculationMethodValue;

        // 1. Calculate the total basis for allocation
        switch (calculationMethod) {
            case 'units':
                totalBasis = billableUnits.length;
                break;
            case 'sqft':
                totalBasis = billableUnits.reduce((sum, unit) => sum + (unit.sqft || 0), 0);
                break;
            case 'beds':
                totalBasis = billableUnits.reduce((sum, unit) => sum + (unit.beds || 0), 0);
                break;
            case 'tenants':
            case 'tenants_occupants': // Simplified to just tenants for this example
                totalBasis = billableUnits.reduce((sum, unit) => sum + (unit.tenants || 0), 0);
                break;
            case 'bathrooms':
                totalBasis = billableUnits.reduce((sum, unit) => sum + (unit.bathrooms || 0), 0);
                break;
            default:
                console.error('Unknown calculation method:', calculationMethod);
                return;
        }

        if (totalBasis === 0) {
            alert('Cannot calculate bill. The total basis (e.g., total sqft, total beds) is zero for the selected properties.');
            return;
        }

        // 2. Calculate the charge for each unit
        const results = billableUnits.map(unit => {
            let unitBasis = 0;
            switch (calculationMethod) {
                case 'units': unitBasis = 1; break;
                case 'sqft': unitBasis = unit.sqft || 0; break;
                case 'beds': unitBasis = unit.beds || 0; break;
                case 'tenants':
                case 'tenants_occupants': unitBasis = unit.tenants || 0; break;
                case 'bathrooms': unitBasis = unit.bathrooms || 0; break;
            }

            const allocationPercentage = unitBasis / totalBasis;
            const charge = billableAmount * allocationPercentage;

            return {
                address: unit.address,
                basisValue: unitBasis,
                charge: charge
            };
        });

        // 3. Display the results
        renderCalculationResults(results, totalBill, billableAmount);
    }

    function renderCalculationResults(results, totalBill, billableAmount) {
        calculationResultsPlaceholder.classList.add('hidden');
        calculationResultsTable.classList.remove('hidden');
        
        const totalAllocated = results.reduce((sum, res) => sum + res.charge, 0);
        const remainder = totalBill - totalAllocated;

        let tableHTML = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Property/Unit</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Basis</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Charge</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${results.map(res => `
                        <tr>
                            <td class="px-4 py-2 text-sm text-gray-800">${res.address}</td>
                            <td class="px-4 py-2 text-sm text-gray-500 text-right">${res.basisValue}</td>
                            <td class="px-4 py-2 text-sm text-gray-900 font-semibold text-right">$${res.charge.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot class="bg-gray-100 font-bold">
                    <tr>
                        <td colspan="2" class="px-4 py-2 text-right text-sm">Total Bill:</td>
                        <td class="px-4 py-2 text-right text-sm">$${totalBill.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2" class="px-4 py-2 text-right text-sm">Total Allocated to Tenants (${currentRuleForCalc.paidByTenant}%):</td>
                        <td class="px-4 py-2 text-right text-sm">$${totalAllocated.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2" class="px-4 py-2 text-right text-sm">Amount Paid by Landlord:</td>
                        <td class="px-4 py-2 text-right text-sm">$${remainder.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        `;
        calculationResultsTable.innerHTML = tableHTML;
    }
});