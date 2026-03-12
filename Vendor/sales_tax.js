document.addEventListener('DOMContentLoaded', () => {
    // --- Sales Tax Modal Elements ---
    const createNewSalesTaxRuleBtn = document.getElementById('createNewSalesTaxRuleBtn');
    const salesTaxRulesListBody = document.getElementById('sales-tax-rules-list-body');
    const noSalesTaxRulesMessage = document.getElementById('no-sales-tax-rules-message');

    const salesTaxRuleModal = document.getElementById('salesTaxRuleModal');
    const closeSalesTaxModalBtn = document.getElementById('closeSalesTaxModalBtn');

    // Sales Tax Step elements
    const salesTaxStep1 = document.getElementById('salestax-step-1');
    const salesTaxStep2 = document.getElementById('salestax-step-2');
    const salesTaxStep3 = document.getElementById('salestax-step-3');
    const salesTaxStep1Indicator = document.getElementById('salestax-step-1-indicator');
    const salesTaxStep2Indicator = document.getElementById('salestax-step-2-indicator');
    const salesTaxStep3Indicator = document.getElementById('salestax-step-3-indicator');

    // Sales Tax Navigation buttons
    const salesTaxPrevStepBtn = document.getElementById('salesTaxPrevStepBtn');
    const salesTaxNextStepBtn = document.getElementById('salesTaxNextStepBtn');
    const salesTaxSaveRuleBtn = document.getElementById('salesTaxSaveRuleBtn');

    // Sales Tax Form elements
    const salesTaxAgencyNameInput = document.getElementById('salesTaxAgencyName');
    const salesTaxJurisdictionInput = document.getElementById('salesTaxJurisdiction');
    const salesTaxRateInput = document.getElementById('salesTaxRate');
    const salesTaxIncomeSelectInput = document.getElementById('salesTaxIncomeSelectInput');
    const salesTaxIncomeTagsContainer = document.getElementById('salestax-income-tags-container');
    const salesTaxIncomeSuggestionsDropdown = document.getElementById('salestax-income-suggestions-dropdown');
    const salesTaxExpenseSelectInput = document.getElementById('salesTaxExpenseSelectInput');
    const salesTaxExpenseTagsContainer = document.getElementById('salestax-expense-tags-container');
    const salesTaxExpenseSuggestionsDropdown = document.getElementById('salestax-expense-suggestions-dropdown');
    const salesTaxPropertySelectionContainer = document.getElementById('salestax-property-selection-container');

    // Sales Tax Review Elements
    const salesTaxReviewAgencyName = document.getElementById('salestax-review-agencyName');
    const salesTaxReviewJurisdiction = document.getElementById('salestax-review-jurisdiction');
    const salesTaxReviewTaxRate = document.getElementById('salestax-review-taxRate');
    const salesTaxReviewIncome = document.getElementById('salestax-review-income');
    const salesTaxReviewExpenses = document.getElementById('salestax-review-expenses');
    const salesTaxReviewProperties = document.getElementById('salestax-review-properties');

    let currentSalesTaxStep = 1;
    let selectedSalesTaxIncomes = [];
    let selectedSalesTaxExpenses = [];

    // In-memory data store for sales tax rules.
    let salesTaxRules = [
        {
            id: Date.now() + 2,
            agencyName: 'State Revenue Service',
            jurisdiction: 'Anytown',
            taxRate: 7.5,
            income: ['Late Fees'],
            expenses: ['General Maintenance'],
            properties: ['All Properties']
        }
    ];

    // Dummy data for dropdowns.
    const allPropertiesData = [
        { id: 'p0', address: 'All Properties', type: 'All', status: 'Active', owner: 'All' },
        { id: 'p1', address: '123 Main St, Anytown, USA', type: 'Multi-unit', status: 'Active', owner: 'John Doe' },
        { id: 'p2', address: '456 Oak Ave, Somewhere, USA', type: 'Commercial', status: 'Active', owner: 'Jane Smith' },
    ];
    const allExpenses = ['Plumbing', 'Electrical', 'Landscaping', 'General Maintenance', 'HVAC', 'Painting', 'Cleaning', 'Roofing'];
    const allIncomes = ['Rent', 'Late Fees', 'Application Fees', 'Parking', 'Pet Fees', 'Utility Reimbursement'];

    // --- Initial Load ---
    renderSalesTaxRules();

    // --- Event Listeners ---
    createNewSalesTaxRuleBtn.addEventListener('click', () => {
        salesTaxRuleModal.classList.remove('hidden');
        resetSalesTaxModal();
    });

    closeSalesTaxModalBtn.addEventListener('click', () => {
        salesTaxRuleModal.classList.add('hidden');
    });

    window.addEventListener('click', (event) => {
        if (event.target === salesTaxRuleModal) {
            salesTaxRuleModal.classList.add('hidden');
        }
    });

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

    salesTaxNextStepBtn.addEventListener('click', () => {
        const steps = [salesTaxStep1, salesTaxStep2, salesTaxStep3];
        const indicators = [salesTaxStep1Indicator, salesTaxStep2Indicator, salesTaxStep3Indicator];

        if (currentSalesTaxStep < steps.length) {
            steps[currentSalesTaxStep - 1].classList.add('hidden');
            currentSalesTaxStep++;
            steps[currentSalesTaxStep - 1].classList.remove('hidden');
            updateStepIndicator(indicators[currentSalesTaxStep - 1], true);
            salesTaxPrevStepBtn.classList.remove('hidden');

            if (currentSalesTaxStep === 2) {
                populateSalesTaxPropertySelection();
            }

            if (currentSalesTaxStep === steps.length) {
                populateSalesTaxReview();
                salesTaxNextStepBtn.classList.add('hidden');
                salesTaxSaveRuleBtn.classList.remove('hidden');
            }
        }
    });

    salesTaxPrevStepBtn.addEventListener('click', () => {
        const steps = [salesTaxStep1, salesTaxStep2, salesTaxStep3];
        const indicators = [salesTaxStep1Indicator, salesTaxStep2Indicator, salesTaxStep3Indicator];
        if (currentSalesTaxStep > 1) {
            if (currentSalesTaxStep === steps.length) {
                salesTaxNextStepBtn.classList.remove('hidden');
                salesTaxSaveRuleBtn.classList.add('hidden');
            }
            updateStepIndicator(indicators[currentSalesTaxStep - 1], false);
            steps[currentSalesTaxStep - 1].classList.add('hidden');
            currentSalesTaxStep--;
            steps[currentSalesTaxStep - 1].classList.remove('hidden');
            if (currentSalesTaxStep === 1) {
                salesTaxPrevStepBtn.classList.add('hidden');
            }
        }
    });

    salesTaxSaveRuleBtn.addEventListener('click', () => {
        const selectedProperties = Array.from(document.querySelectorAll('#salestax-property-selection-container input[type=checkbox]:checked')).map(cb => cb.value);
        const newRule = {
            id: Date.now(),
            agencyName: salesTaxAgencyNameInput.value || 'Untitled Agency',
            jurisdiction: salesTaxJurisdictionInput.value || 'N/A',
            taxRate: salesTaxRateInput.value || 0,
            income: selectedSalesTaxIncomes.length > 0 ? selectedSalesTaxIncomes : ['None'],
            expenses: selectedSalesTaxExpenses.length > 0 ? selectedSalesTaxExpenses : ['None'],
            properties: selectedProperties.length > 0 ? selectedProperties : ['All Properties']
        };
        salesTaxRules.push(newRule);
        renderSalesTaxRules();
        salesTaxRuleModal.classList.add('hidden');
    });

    // --- UI Rendering & Reset ---
    function renderSalesTaxRules() {
        salesTaxRulesListBody.innerHTML = '';
        if (salesTaxRules.length === 0) {
            noSalesTaxRulesMessage.classList.remove('hidden');
            salesTaxRulesListBody.parentElement.parentElement.classList.add('hidden');
        } else {
            noSalesTaxRulesMessage.classList.add('hidden');
            salesTaxRulesListBody.parentElement.parentElement.classList.remove('hidden');
            salesTaxRules.forEach(rule => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${rule.agencyName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.jurisdiction}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.taxRate}%</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rule.properties.join(', ')}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</a>
                        <a href="#" class="text-red-600 hover:text-red-900">Delete</a>
                    </td>
                `;
                salesTaxRulesListBody.appendChild(row);
            });
        }
    }

    function resetSalesTaxModal() {
        currentSalesTaxStep = 1;
        [salesTaxStep1, salesTaxStep2, salesTaxStep3].forEach((s, i) => s.classList.toggle('hidden', i !== 0));
        [salesTaxStep1Indicator, salesTaxStep2Indicator, salesTaxStep3Indicator].forEach((ind, i) => updateStepIndicator(ind, i === 0));
        salesTaxPrevStepBtn.classList.add('hidden');
        salesTaxNextStepBtn.classList.remove('hidden');
        salesTaxSaveRuleBtn.classList.add('hidden');
        salesTaxAgencyNameInput.value = '';
        salesTaxJurisdictionInput.value = '';
        salesTaxRateInput.value = '';
        selectedSalesTaxIncomes.length = 0;
        salesTaxIncomeTagsContainer.querySelectorAll('.expense-tag').forEach(tag => tag.remove());
        selectedSalesTaxExpenses.length = 0;
        salesTaxExpenseTagsContainer.querySelectorAll('.expense-tag').forEach(tag => tag.remove());

        initializeMultiSelect({
            selectInput: salesTaxIncomeSelectInput,
            tagsContainer: salesTaxIncomeTagsContainer,
            suggestionsDropdown: salesTaxIncomeSuggestionsDropdown,
            dataSource: allIncomes,
            selectedItems: selectedSalesTaxIncomes
        });
        initializeMultiSelect({
            selectInput: salesTaxExpenseSelectInput,
            tagsContainer: salesTaxExpenseTagsContainer,
            suggestionsDropdown: salesTaxExpenseSuggestionsDropdown,
            dataSource: allExpenses,
            selectedItems: selectedSalesTaxExpenses
        });
    }

    function populateSalesTaxReview() {
        salesTaxReviewAgencyName.textContent = salesTaxAgencyNameInput.value || 'N/A';
        salesTaxReviewJurisdiction.textContent = salesTaxJurisdictionInput.value || 'N/A';
        salesTaxReviewTaxRate.textContent = `${salesTaxRateInput.value || 0}%`;
        salesTaxReviewIncome.innerHTML = selectedSalesTaxIncomes.length > 0 ? selectedSalesTaxIncomes.join('<br>') : 'None';
        salesTaxReviewExpenses.innerHTML = selectedSalesTaxExpenses.length > 0 ? selectedSalesTaxExpenses.join('<br>') : 'None';
        const selectedProperties = Array.from(document.querySelectorAll('#salestax-property-selection-container input[type=checkbox]:checked')).map(cb => cb.value);
        salesTaxReviewProperties.innerHTML = selectedProperties.length > 0 ? selectedProperties.join('<br>') : 'All Properties';
    }

    function populateSalesTaxPropertySelection() {
        if (salesTaxPropertySelectionContainer.innerHTML.trim() !== '') return;

        const propertySelectionHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b">
                <div>
                    <label for="salestax-property-type-filter" class="block text-xs font-medium text-gray-500">Property Type</label>
                    <select id="salestax-property-type-filter" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"><option value="all">All Types</option><option value="Residential">Residential</option><option value="Commercial">Commercial</option><option value="Multi-unit">Multi Unit</option></select>
                </div>
                <div>
                    <label for="salestax-property-status-filter" class="block text-xs font-medium text-gray-500">Status</label>
                    <select id="salestax-property-status-filter" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"><option value="all">All Statuses</option><option value="Active">Active</option><option value="Archive">Archive</option></select>
                </div>
                <div>
                    <label for="salestax-property-owner-filter" class="block text-xs font-medium text-gray-500">Owner</label>
                    <select id="salestax-property-owner-filter" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"><option value="all">All Owners</option></select>
                </div>
            </div>
            <div>
                <div class="relative">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><i class="fas fa-search text-gray-400"></i></div>
                    <input type="text" id="salestax-property-search" placeholder="Search properties..." class="block w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm">
                </div>
                <div id="salestax-property-checkbox-list" class="mt-3 h-72 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-1 bg-white"></div>
            </div>
        `;
        salesTaxPropertySelectionContainer.innerHTML = propertySelectionHTML;

        const typeFilter = document.getElementById('salestax-property-type-filter');
        const statusFilter = document.getElementById('salestax-property-status-filter');
        const ownerFilter = document.getElementById('salestax-property-owner-filter');
        const searchInput = document.getElementById('salestax-property-search');
        const checkboxList = document.getElementById('salestax-property-checkbox-list');

        const owners = [...new Set(allPropertiesData.map(p => p.owner).filter(o => o !== 'All'))];
        owners.forEach(owner => {
            ownerFilter.add(new Option(owner, owner));
        });

        const populateList = () => {
            checkboxList.innerHTML = '';
            const filtered = allPropertiesData.filter(prop => {
                if (prop.address === 'All Properties') return true;
                return (typeFilter.value === 'all' || prop.type === typeFilter.value) &&
                       (statusFilter.value === 'all' || prop.status === statusFilter.value) &&
                       (ownerFilter.value === 'all' || prop.owner === ownerFilter.value) &&
                       prop.address.toLowerCase().includes(searchInput.value.toLowerCase());
            });
            filtered.forEach(prop => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'flex items-center';
                itemDiv.innerHTML = `<input id="st-prop-${prop.id}" type="checkbox" value="${prop.address}" class="h-4 w-4 rounded border-gray-300"><label for="st-prop-${prop.id}" class="ml-3 text-sm text-gray-800">${prop.address}</label>`;
                checkboxList.appendChild(itemDiv);
            });
        };

        [typeFilter, statusFilter, ownerFilter].forEach(el => el.addEventListener('change', populateList));
        searchInput.addEventListener('input', populateList);
        populateList();
    }
});