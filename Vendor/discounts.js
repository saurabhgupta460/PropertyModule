document.addEventListener('DOMContentLoaded', () => {
    // --- Discount Modal Elements ---
    const createNewDiscountRuleBtn = document.getElementById('createNewDiscountRuleBtn');
    const discountRulesListBody = document.getElementById('discount-rules-list-body');
    const noDiscountRulesMessage = document.getElementById('no-discount-rules-message');

    const discountRuleModal = document.getElementById('discountRuleModal');
    const closeDiscountModalBtn = document.getElementById('closeDiscountModalBtn');

    // Discount Step elements
    const discountStep1 = document.getElementById('discount-step-1');
    const discountStep2 = document.getElementById('discount-step-2');
    const discountStep3 = document.getElementById('discount-step-3');
    const discountStep1Indicator = document.getElementById('discount-step-1-indicator');
    const discountStep2Indicator = document.getElementById('discount-step-2-indicator');
    const discountStep3Indicator = document.getElementById('discount-step-3-indicator');

    // Discount Navigation buttons
    const discountPrevStepBtn = document.getElementById('discountPrevStepBtn');
    const discountNextStepBtn = document.getElementById('discountNextStepBtn');
    const discountSaveRuleBtn = document.getElementById('discountSaveRuleBtn');

    // Discount Form elements
    const discountRuleNameInput = document.getElementById('discountRuleName');
    const discountVendorSelectInput = document.getElementById('discountVendorSelectInput');
    const discountVendorTagsContainer = document.getElementById('discount-vendor-tags-container');
    const discountVendorSuggestionsDropdown = document.getElementById('discount-vendor-suggestions-dropdown');
    const discountExpenseSelectInput = document.getElementById('discountExpenseSelectInput');
    const discountExpenseTagsContainer = document.getElementById('discount-expense-tags-container');
    const discountExpenseSuggestionsDropdown = document.getElementById('discount-expense-suggestions-dropdown');
    const discountValueTypeSelect = document.getElementById('discountValueType');
    const discountPercentageInputContainer = document.getElementById('discount-percentage-input-container');
    const discountPercentageValueInput = document.getElementById('discountPercentageValue');
    const discountFlatFeeInputContainer = document.getElementById('discount-flat-fee-input-container');
    const discountFlatFeeValueInput = document.getElementById('discountFlatFeeValue');

    // Discount Property Selection
    const discountPropertyTypeFilter = document.getElementById('discount-property-type-filter');
    const discountPropertyStatusFilter = document.getElementById('discount-property-status-filter');
    const discountPropertyOwnerFilter = document.getElementById('discount-property-owner-filter');
    const discountPropertySearchInput = document.getElementById('discountPropertySearchInput');
    const discountPropertyCheckboxList = document.getElementById('discount-property-checkbox-list');

    // Discount Review Elements
    const discountReviewRuleName = document.getElementById('discount-review-ruleName');
    const discountReviewVendors = document.getElementById('discount-review-vendors');
    const discountReviewExpenses = document.getElementById('discount-review-expenses');
    const discountReviewValue = document.getElementById('discount-review-value');
    const discountReviewProperties = document.getElementById('discount-review-properties');

    let currentDiscountStep = 1;
    let selectedDiscountVendors = [];
    let selectedDiscountExpenses = [];

    // In-memory data store for discount rules.
    let discountRules = [
        {
            id: Date.now() + 1,
            ruleName: '5% Early Payment Discount',
            vendors: ['GreenScape Landscaping'],
            expenses: ['Landscaping'],
            type: 'percentage',
            value: 5,
            properties: ['All Properties']
        }
    ];

    // Dummy data for dropdowns.
    const allVendors = [
        { name: 'City Water Dept.', category: 'Utilities' },
        { name: 'GreenScape Landscaping', category: 'Landscaping' },
        { name: 'FixIt Plumbing', category: 'Plumbing' },
        { name: 'CleanSweep Janitorial', category: 'Cleaning' },
    ];
    const allPropertiesData = [
        { id: 'p0', address: 'All Properties', type: 'All', status: 'Active', owner: 'All' },
        { id: 'p1', address: '123 Main St, Anytown, USA', type: 'Multi-unit', status: 'Active', owner: 'John Doe' },
        { id: 'p2', address: '456 Oak Ave, Somewhere, USA', type: 'Commercial', status: 'Active', owner: 'Jane Smith' },
    ];
    const allExpenses = ['Plumbing', 'Electrical', 'Landscaping', 'General Maintenance', 'HVAC', 'Painting', 'Cleaning', 'Roofing'];

    // --- Initial Load ---
    renderDiscountRules();

    // --- Event Listeners ---
    createNewDiscountRuleBtn.addEventListener('click', () => {
        discountRuleModal.classList.remove('hidden');
        resetDiscountModal();
    });

    closeDiscountModalBtn.addEventListener('click', () => {
        discountRuleModal.classList.add('hidden');
    });

    window.addEventListener('click', (event) => {
        if (event.target === discountRuleModal) {
            discountRuleModal.classList.add('hidden');
        }
    });

    discountValueTypeSelect.addEventListener('change', (e) => {
        discountPercentageInputContainer.classList.toggle('hidden', e.target.value !== 'percentage');
        discountFlatFeeInputContainer.classList.toggle('hidden', e.target.value !== 'flat_fee');
    });

    // --- Multi-Select Logic ---
    function initializeMultiSelect(config) {
        const { selectInput, tagsContainer, suggestionsDropdown, dataSource, selectedItems } = config;

        function renderSuggestions(filter = '') {
            suggestionsDropdown.innerHTML = '';
            const dataSourceNames = dataSource.map(item => typeof item === 'object' ? item.name : item);
            const availableItems = dataSourceNames.filter(item => !selectedItems.includes(item) && item.toLowerCase().includes(filter.toLowerCase()));
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
        selectInput: discountVendorSelectInput,
        tagsContainer: discountVendorTagsContainer,
        suggestionsDropdown: discountVendorSuggestionsDropdown,
        dataSource: allVendors,
        selectedItems: selectedDiscountVendors
    });

    initializeMultiSelect({
        selectInput: discountExpenseSelectInput,
        tagsContainer: discountExpenseTagsContainer,
        suggestionsDropdown: discountExpenseSuggestionsDropdown,
        dataSource: allExpenses,
        selectedItems: selectedDiscountExpenses
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

    function validateDiscountStep1() {
        let isValid = true;
        isValid &= validateField(discountRuleNameInput, document.getElementById('discountRuleName-error'), val => val.trim() !== '');
        isValid &= validateField(discountVendorTagsContainer, document.getElementById('discount-vendor-error'), () => selectedDiscountVendors.length > 0);
        isValid &= validateField(discountExpenseTagsContainer, document.getElementById('discount-expense-error'), () => selectedDiscountExpenses.length > 0);
        if (discountValueTypeSelect.value === 'percentage') {
            isValid &= validateField(discountPercentageValueInput, document.getElementById('discount-percentage-error'), val => val.trim() !== '');
        } else {
            isValid &= validateField(discountFlatFeeValueInput, document.getElementById('discount-flatFee-error'), val => val.trim() !== '');
        }
        return !!isValid;
    }

    discountNextStepBtn.addEventListener('click', () => {
        const steps = [discountStep1, discountStep2, discountStep3];
        const indicators = [discountStep1Indicator, discountStep2Indicator, discountStep3Indicator];
        if (currentDiscountStep === 1 && !validateDiscountStep1()) return;

        if (currentDiscountStep < steps.length) {
            steps[currentDiscountStep - 1].classList.add('hidden');
            currentDiscountStep++;
            steps[currentDiscountStep - 1].classList.remove('hidden');
            updateStepIndicator(indicators[currentDiscountStep - 1], true);
            discountPrevStepBtn.classList.remove('hidden');

            if (currentDiscountStep === 2) {
                populateDiscountPropertyCheckboxes();
            }

            if (currentDiscountStep === steps.length) {
                populateDiscountReview();
                discountNextStepBtn.classList.add('hidden');
                discountSaveRuleBtn.classList.remove('hidden');
            }
        }
    });

    discountPrevStepBtn.addEventListener('click', () => {
        const steps = [discountStep1, discountStep2, discountStep3];
        const indicators = [discountStep1Indicator, discountStep2Indicator, discountStep3Indicator];
        if (currentDiscountStep > 1) {
            if (currentDiscountStep === steps.length) {
                discountNextStepBtn.classList.remove('hidden');
                discountSaveRuleBtn.classList.add('hidden');
            }
            updateStepIndicator(indicators[currentDiscountStep - 1], false);
            steps[currentDiscountStep - 1].classList.add('hidden');
            currentDiscountStep--;
            steps[currentDiscountStep - 1].classList.remove('hidden');
            if (currentDiscountStep === 1) {
                discountPrevStepBtn.classList.add('hidden');
            }
        }
    });

    discountSaveRuleBtn.addEventListener('click', () => {
        const selectedProperties = Array.from(document.querySelectorAll('#discount-property-checkbox-list input:checked')).map(cb => cb.value);
        const newRule = {
            id: Date.now(),
            ruleName: discountRuleNameInput.value || 'Untitled Discount Rule',
            vendors: selectedDiscountVendors.length > 0 ? selectedDiscountVendors : ['All'],
            expenses: selectedDiscountExpenses.length > 0 ? selectedDiscountExpenses : ['Any'],
            type: discountValueTypeSelect.value,
            value: discountValueTypeSelect.value === 'percentage' ? discountPercentageValueInput.value : discountFlatFeeValueInput.value,
            properties: selectedProperties.length > 0 ? selectedProperties : ['All Properties']
        };
        discountRules.push(newRule);
        renderDiscountRules();
        discountRuleModal.classList.add('hidden');
    });

    // --- UI Rendering & Reset ---
    function renderDiscountRules() {
        discountRulesListBody.innerHTML = '';
        if (discountRules.length === 0) {
            noDiscountRulesMessage.classList.remove('hidden');
            discountRulesListBody.parentElement.parentElement.classList.add('hidden');
        } else {
            noDiscountRulesMessage.classList.add('hidden');
            discountRulesListBody.parentElement.parentElement.classList.remove('hidden');
            discountRules.forEach(rule => {
                const valueDisplay = rule.type === 'percentage' ? `${rule.value}%` : `$${parseFloat(rule.value).toFixed(2)}`;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${rule.ruleName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.vendors.join(', ')}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.expenses.join(', ')}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">${rule.type.replace('_', ' ')}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${valueDisplay}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.properties.join(', ')}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</a>
                        <a href="#" class="text-red-600 hover:text-red-900">Delete</a>
                    </td>
                `;
                discountRulesListBody.appendChild(row);
            });
        }
    }

    function resetDiscountModal() {
        currentDiscountStep = 1;
        [discountStep1, discountStep2, discountStep3].forEach((s, i) => s.classList.toggle('hidden', i !== 0));
        [discountStep1Indicator, discountStep2Indicator, discountStep3Indicator].forEach((ind, i) => updateStepIndicator(ind, i === 0));
        discountPrevStepBtn.classList.add('hidden');
        discountNextStepBtn.classList.remove('hidden');
        discountSaveRuleBtn.classList.add('hidden');
        discountRuleNameInput.value = '';
        selectedDiscountVendors.length = 0;
        discountVendorTagsContainer.querySelectorAll('.expense-tag').forEach(tag => tag.remove());
        selectedDiscountExpenses.length = 0;
        discountExpenseTagsContainer.querySelectorAll('.expense-tag').forEach(tag => tag.remove());
        discountValueTypeSelect.value = 'percentage';
        discountPercentageValueInput.value = '';
        discountFlatFeeValueInput.value = '';
        discountPercentageInputContainer.classList.remove('hidden');
        discountFlatFeeInputContainer.classList.add('hidden');
        document.querySelectorAll('[id$="-error"]').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));
    }

    function populateDiscountReview() {
        discountReviewRuleName.textContent = discountRuleNameInput.value || 'N/A';
        discountReviewVendors.innerHTML = selectedDiscountVendors.length > 0 ? selectedDiscountVendors.join('<br>') : 'All Vendors';
        discountReviewExpenses.innerHTML = selectedDiscountExpenses.length > 0 ? selectedDiscountExpenses.join('<br>') : 'Any Expense';
        discountReviewValue.textContent = discountValueTypeSelect.value === 'percentage' ? `${discountPercentageValueInput.value}% Discount` : `$${parseFloat(discountFlatFeeValueInput.value || 0).toFixed(2)} Flat Discount`;
        const selectedProperties = Array.from(document.querySelectorAll('#discount-property-checkbox-list input:checked')).map(cb => cb.value);
        discountReviewProperties.innerHTML = selectedProperties.length > 0 ? selectedProperties.join('<br>') : 'All Properties';
    }

    function createCheckboxItem(id, value, name, listContainer) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex items-center checkbox-item';
        itemDiv.innerHTML = `<input id="${id}" name="${name}" type="checkbox" value="${value}" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"><label for="${id}" class="ml-3 block text-sm text-gray-800">${value}</label>`;
        listContainer.appendChild(itemDiv);
    }

    function populateDiscountPropertyCheckboxes() {
        discountPropertyCheckboxList.innerHTML = '';
        const owners = [...new Set(allPropertiesData.map(p => p.owner).filter(o => o !== 'All'))];
        discountPropertyOwnerFilter.innerHTML = '<option value="all">All Owners</option>';
        owners.forEach(owner => {
            const option = document.createElement('option');
            option.value = owner;
            option.textContent = owner;
            discountPropertyOwnerFilter.appendChild(option);
        });

        const type = discountPropertyTypeFilter.value;
        const status = discountPropertyStatusFilter.value;
        const owner = discountPropertyOwnerFilter.value;
        const searchTerm = discountPropertySearchInput.value.toLowerCase();

        const filteredProperties = allPropertiesData.filter(prop => {
            if (prop.address === 'All Properties') return true;
            const typeMatch = type === 'all' || prop.type === type;
            const statusMatch = status === 'all' || prop.status === status;
            const ownerMatch = owner === 'all' || prop.owner === owner;
            const searchMatch = prop.address.toLowerCase().includes(searchTerm);
            return typeMatch && statusMatch && ownerMatch && searchMatch;
        });

        filteredProperties.forEach(prop => {
            createCheckboxItem(`discount-prop-${prop.id}`, prop.address, 'discountIncludedProperties', discountPropertyCheckboxList);
        });
    }

    discountPropertyTypeFilter.addEventListener('change', populateDiscountPropertyCheckboxes);
    discountPropertyStatusFilter.addEventListener('change', populateDiscountPropertyCheckboxes);
    discountPropertyOwnerFilter.addEventListener('change', populateDiscountPropertyCheckboxes);
    discountPropertySearchInput.addEventListener('input', populateDiscountPropertyCheckboxes);
});