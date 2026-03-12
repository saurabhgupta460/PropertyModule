document.addEventListener('DOMContentLoaded', () => {
    // Page view elements
    const existingRulesPage = document.getElementById('existingRulesPage');

    // Modal elements
    const expenseMarkupModal = document.getElementById('expenseMarkupModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const createNewRuleBtn = document.getElementById('createNewRuleBtn');

    // Step elements
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const step4 = document.getElementById('step-4');
    const step1Indicator = document.getElementById('step-1-indicator');
    const step2Indicator = document.getElementById('step-2-indicator');
    const step3Indicator = document.getElementById('step-3-indicator');
    const step4Indicator = document.getElementById('step-4-indicator');

    // Navigation buttons
    const prevStepBtn = document.getElementById('prevStepBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const saveRuleBtn = document.getElementById('saveRuleBtn');

    // Form elements
    const ruleNameInput = document.getElementById('ruleName');
    const expenseSelectInput = document.getElementById('expenseSelectInput');
    const expenseTagsContainer = document.getElementById('expense-tags-container');
    const expenseSuggestionsDropdown = document.getElementById('expense-suggestions-dropdown');
    const valueTypeSelect = document.getElementById('valueType');
    const percentageInputContainer = document.getElementById('percentage-input-container');
    const percentageValueInput = document.getElementById('percentageValue');
    const flatFeeInputContainer = document.getElementById('flat-fee-input-container');
    const flatFeeValueInput = document.getElementById('flatFeeValue');
    const vendorCheckboxList = document.getElementById('vendor-checkbox-list');
    const vendorSearchInput = document.getElementById('vendorSearchInput');
    const propertyCheckboxList = document.getElementById('property-checkbox-list');
    const propertySearchInput = document.getElementById('propertySearchInput');
    const propertyTypeFilter = document.getElementById('property-type-filter');
    const propertyStatusFilter = document.getElementById('property-status-filter');
    const propertyOwnerFilter = document.getElementById('property-owner-filter');

    // Review elements
    const reviewRuleName = document.getElementById('review-ruleName');
    const reviewExpenses = document.getElementById('review-expenses');
    const reviewValue = document.getElementById('review-value');
    const reviewVendors = document.getElementById('review-vendors');
    const reviewProperties = document.getElementById('review-properties');

    // Rule list elements
    const rulesListBody = document.getElementById('rules-list-body');
    const noRulesMessage = document.getElementById('no-rules-message');

    let currentStep = 1;
    let selectedExpenses = [];

    // In-memory data store for rules. In a real app, this would come from an API.
    let rules = [
        {
            id: Date.now(),
            ruleName: '10% Plumbing Markup',
            expenses: ['Plumbing'],
            type: 'percentage',
            value: 10,
            vendors: ['FixIt Plumbing'],
            properties: ['123 Main St, Anytown, USA']
        }
    ];

    // Dummy data for dropdowns. In a real app, this would be fetched from an API.
    const allVendors = [
        { name: 'City Water Dept.', category: 'Utilities' },
        { name: 'GreenScape Landscaping', category: 'Landscaping' },
        { name: 'FixIt Plumbing', category: 'Plumbing' },
        { name: 'CleanSweep Janitorial', category: 'Cleaning' },
        { name: 'Vendor A', category: 'General Maintenance' },
        { name: 'Vendor B', category: 'Electrical' },
        { name: 'Vendor C', category: 'HVAC' },
    ];
    const allPropertiesData = [
        { id: 'p0', address: 'All Properties', type: 'All', status: 'Active', owner: 'All' },
        { id: 'p1', address: '123 Main St, Anytown, USA', type: 'Multi-unit', status: 'Active', owner: 'John Doe' },
        { id: 'p2', address: '456 Oak Ave, Somewhere, USA', type: 'Commercial', status: 'Active', owner: 'Jane Smith' },
        { id: 'p3', address: '789 Pine Ln, Villagetown, USA', type: 'Residential', status: 'Active', owner: 'John Doe' },
        { id: 'p4', address: '101 Maple Dr, Oldtown, USA', type: 'Residential', status: 'Archive', owner: 'Sam Wilson' },
        { id: 'p5', address: '222 Birch Rd, Newville, USA', type: 'Multi-unit', status: 'Active', owner: 'Jane Smith' }
    ];
    const allExpenses = ['Plumbing', 'Electrical', 'Landscaping', 'General Maintenance', 'HVAC', 'Painting', 'Cleaning', 'Roofing'];

    // --- Initial Load ---
    renderRules();

    // --- Populate Selects ---
    function createCheckboxItem(id, value, name, listContainer, labelHTML = null) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex items-center checkbox-item';
        const isChecked = value === 'All Properties';
        itemDiv.innerHTML = `
            <input id="${id}" name="${name}" type="checkbox" value="${value}" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" ${isChecked ? 'checked' : ''}>
            <label for="${id}" class="ml-3 block text-sm text-gray-800 w-full cursor-pointer">${labelHTML || value}</label>
        `;
        listContainer.appendChild(itemDiv);
    }

    function populateSelects() {
        vendorCheckboxList.innerHTML = '';
        allVendors.forEach(vendor => {
            const id = `vendor-${vendor.name.replace(/\s+/g, '-')}`;
            const labelHTML = `
                <div class="flex justify-between items-center w-full">
                    <span class="font-medium text-gray-800">${vendor.name}</span>
                    <span class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">${vendor.category}</span>
                </div>`;
            createCheckboxItem(id, vendor.name, 'selectedVendors', vendorCheckboxList, labelHTML);
        });

        const owners = [...new Set(allPropertiesData.map(p => p.owner).filter(o => o !== 'All'))];
        propertyOwnerFilter.innerHTML = '<option value="all">All Owners</option>';
        owners.forEach(owner => {
            const option = document.createElement('option');
            option.value = owner;
            option.textContent = owner;
            propertyOwnerFilter.appendChild(option);
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
    createNewRuleBtn.addEventListener('click', () => {
        expenseMarkupModal.classList.remove('hidden');
        populateSelects();
        resetModal();
    });

    closeModalBtn.addEventListener('click', () => {
        expenseMarkupModal.classList.add('hidden');
    });

    window.addEventListener('click', (event) => {
        if (event.target === expenseMarkupModal) {
            expenseMarkupModal.classList.add('hidden');
        }
    });

    valueTypeSelect.addEventListener('change', (e) => {
        percentageInputContainer.classList.toggle('hidden', e.target.value !== 'percentage');
        flatFeeInputContainer.classList.toggle('hidden', e.target.value !== 'flat_fee');
    });

    vendorSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        vendorCheckboxList.querySelectorAll('.checkbox-item').forEach(item => {
            const label = item.querySelector('label');
            const vendorName = label.querySelector('span.font-medium')?.textContent.toLowerCase() || '';
            const vendorCategory = label.querySelector('span.text-xs')?.textContent.toLowerCase() || '';
            item.style.display = (vendorName.includes(searchTerm) || vendorCategory.includes(searchTerm)) ? 'flex' : 'none';
        });
    });

    propertyTypeFilter.addEventListener('change', populatePropertyCheckboxes);
    propertyStatusFilter.addEventListener('change', populatePropertyCheckboxes);
    propertyOwnerFilter.addEventListener('change', populatePropertyCheckboxes);
    propertySearchInput.addEventListener('input', populatePropertyCheckboxes);

    // --- Multi-Select Logic ---
    function initializeMultiSelect(config) {
        const { selectInput, tagsContainer, suggestionsDropdown, dataSource, selectedItems } = config;

        function renderSuggestions(filter = '') {
            suggestionsDropdown.innerHTML = '';
            const availableItems = dataSource.filter(item => !selectedItems.includes(item) && item.toLowerCase().includes(filter.toLowerCase()));
            if (availableItems.length === 0) {
                suggestionsDropdown.classList.add('hidden');
                return;
            }
            availableItems.forEach(item => {
                const div = document.createElement('div');
                div.className = 'p-2 hover:bg-indigo-100 cursor-pointer text-sm';
                div.textContent = item;
                div.addEventListener('click', () => selectItem(item));
                suggestionsDropdown.appendChild(div);
            });
            suggestionsDropdown.classList.remove('hidden');
        }

        function selectItem(item) {
            selectedItems.push(item);
            addTag(item);
            selectInput.value = '';
            suggestionsDropdown.classList.add('hidden');
            selectInput.focus();
        }

        function addTag(item) {
            const tag = document.createElement('span');
            tag.className = 'expense-tag flex items-center bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-1 rounded-full';
            tag.innerHTML = `${item} <button type="button" class="ml-2 text-indigo-500 hover:text-indigo-700 focus:outline-none"><i class="fas fa-times-circle"></i></button>`;
            tag.querySelector('button').addEventListener('click', () => {
                const index = selectedItems.indexOf(item);
                if (index > -1) selectedItems.splice(index, 1);
                tag.remove();
            });
            tagsContainer.insertBefore(tag, selectInput);
        }

        selectInput.addEventListener('focus', () => renderSuggestions(selectInput.value));
        selectInput.addEventListener('input', () => renderSuggestions(selectInput.value));
        document.addEventListener('click', (e) => {
            if (!selectInput.parentElement.contains(e.target)) {
                suggestionsDropdown.classList.add('hidden');
            }
        });
    }

    initializeMultiSelect({
        selectInput: expenseSelectInput,
        tagsContainer: expenseTagsContainer,
        suggestionsDropdown: expenseSuggestionsDropdown,
        dataSource: allExpenses,
        selectedItems: selectedExpenses
    });

    // --- Step Navigation & Validation ---
    function updateStepIndicator(stepIndicator, isActive) {
        if (!stepIndicator) return;
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

    function validateField(inputEl, errorEl, validationFn) {
        const value = inputEl.value;
        const isValid = validationFn(value);
        errorEl.classList.toggle('hidden', isValid);
        inputEl.classList.toggle('border-red-500', !isValid);
        return isValid;
    }

    function validateStep1() {
        let isValid = true;
        isValid &= validateField(ruleNameInput, document.getElementById('ruleName-error'), val => val.trim() !== '');
        isValid &= validateField(expenseTagsContainer, document.getElementById('expense-error'), () => selectedExpenses.length > 0);
        if (valueTypeSelect.value === 'percentage') {
            isValid &= validateField(percentageValueInput, document.getElementById('percentage-error'), val => val.trim() !== '');
        } else {
            isValid &= validateField(flatFeeValueInput, document.getElementById('flatFee-error'), val => val.trim() !== '');
        }
        return !!isValid;
    }

    nextStepBtn.addEventListener('click', () => {
        const steps = [step1, step2, step3, step4];
        const indicators = [step1Indicator, step2Indicator, step3Indicator, step4Indicator];
        if (currentStep === 1 && !validateStep1()) return;

        if (currentStep < steps.length) {
            steps[currentStep - 1].classList.add('hidden');
            currentStep++;
            steps[currentStep - 1].classList.remove('hidden');
            updateStepIndicator(indicators[currentStep - 1], true);
            prevStepBtn.classList.remove('hidden');

            if (currentStep === steps.length) {
                populateReview();
                nextStepBtn.classList.add('hidden');
                saveRuleBtn.classList.remove('hidden');
            }
        }
    });

    prevStepBtn.addEventListener('click', () => {
        const steps = [step1, step2, step3, step4];
        const indicators = [step1Indicator, step2Indicator, step3Indicator, step4Indicator];
        if (currentStep > 1) {
            if (currentStep === steps.length) {
                nextStepBtn.classList.remove('hidden');
                saveRuleBtn.classList.add('hidden');
            }
            updateStepIndicator(indicators[currentStep - 1], false);
            steps[currentStep - 1].classList.add('hidden');
            currentStep--;
            steps[currentStep - 1].classList.remove('hidden');
            if (currentStep === 1) {
                prevStepBtn.classList.add('hidden');
            }
        }
    });

    saveRuleBtn.addEventListener('click', () => {
        const selectedVendors = Array.from(document.querySelectorAll('#vendor-checkbox-list input:checked')).map(cb => cb.value);
        const selectedProperties = Array.from(document.querySelectorAll('#property-checkbox-list input:checked')).map(cb => cb.value);
        const newRule = {
            id: Date.now(),
            ruleName: ruleNameInput.value || 'Untitled Rule',
            expenses: selectedExpenses.length > 0 ? selectedExpenses : ['Any'],
            type: valueTypeSelect.value,
            value: valueTypeSelect.value === 'percentage' ? percentageValueInput.value : flatFeeValueInput.value,
            vendors: selectedVendors.length === 0 ? ['All'] : selectedVendors,
            properties: selectedProperties.length === 0 ? ['All'] : selectedProperties
        };
        rules.push(newRule);
        renderRules();
        expenseMarkupModal.classList.add('hidden');
    });

    // --- UI Rendering & Reset ---
    function renderRules() {
        rulesListBody.innerHTML = '';
        if (rules.length === 0) {
            noRulesMessage.classList.remove('hidden');
            rulesListBody.parentElement.parentElement.classList.add('hidden');
        } else {
            noRulesMessage.classList.add('hidden');
            rulesListBody.parentElement.parentElement.classList.remove('hidden');
            rules.forEach(rule => {
                const valueDisplay = rule.type === 'percentage' ? `${rule.value}%` : `$${parseFloat(rule.value).toFixed(2)}`;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${rule.ruleName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.expenses.join(', ')}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">${rule.type.replace('_', ' ')}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${valueDisplay}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.vendors.join(', ') || 'All'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.properties.join(', ') || 'All'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</a>
                        <a href="#" class="text-red-600 hover:text-red-900">Delete</a>
                    </td>
                `;
                rulesListBody.appendChild(row);
            });
        }
    }

    function resetModal() {
        currentStep = 1;
        [step1, step2, step3, step4].forEach((s, i) => s.classList.toggle('hidden', i !== 0));
        [step1Indicator, step2Indicator, step3Indicator, step4Indicator].forEach((ind, i) => updateStepIndicator(ind, i === 0));
        prevStepBtn.classList.add('hidden');
        nextStepBtn.classList.remove('hidden');
        saveRuleBtn.classList.add('hidden');
        ruleNameInput.value = '';
        selectedExpenses.length = 0;
        expenseTagsContainer.querySelectorAll('.expense-tag').forEach(tag => tag.remove());
        valueTypeSelect.value = 'percentage';
        percentageValueInput.value = '';
        flatFeeValueInput.value = '';
        percentageInputContainer.classList.remove('hidden');
        flatFeeInputContainer.classList.add('hidden');
        document.querySelectorAll('[id$="-error"]').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));
    }

    function populateReview() {
        reviewRuleName.textContent = ruleNameInput.value || 'N/A';
        reviewExpenses.innerHTML = selectedExpenses.length > 0 ? selectedExpenses.join('<br>') : 'Any';
        reviewValue.textContent = valueTypeSelect.value === 'percentage' ? `${percentageValueInput.value}% Markup` : `$${parseFloat(flatFeeValueInput.value || 0).toFixed(2)} Flat Fee`;
        const selectedVendors = Array.from(document.querySelectorAll('#vendor-checkbox-list input:checked')).map(cb => cb.value);
        reviewVendors.innerHTML = selectedVendors.length > 0 ? selectedVendors.join('<br>') : 'All Vendors';
        const selectedProperties = Array.from(document.querySelectorAll('#property-checkbox-list input:checked')).map(cb => cb.value);
        reviewProperties.innerHTML = selectedProperties.length > 0 ? selectedProperties.join('<br>') : 'All Properties';
    }
});