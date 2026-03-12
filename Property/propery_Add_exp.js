document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // MOCK DATA
    // =================================================================================
    const mockVendors = [
        { id: 'v1', name: 'City Water Dept.' },
        { id: 'v2', name: 'GreenScape Landscaping' },
        { id: 'v3', name: 'FixIt Plumbing' },
        { id: 'v4', name: 'CleanSweep Janitorial' }
    ];
    const mockProperties = [
        { id: 'p1', name: '123 Main St', units: ['Unit 101', 'Unit 102', 'Unit 103'] },
        { id: 'p2', name: '456 Oak Ave', units: ['Unit A', 'Unit B'] },
        { id: 'p3', name: '789 Pine Ln', units: ['Main House'] }
    ];
    const mockExpenses = ['Repairs', 'Maintenance', 'Supplies', 'Utilities', 'Other'];

    // =================================================================================
    // DOM ELEMENT SELECTORS
    // =================================================================================
    const addExpenseForm = document.getElementById('addExpenseForm');
    const billItemsBody = document.getElementById('billItemsBody');
    const addBillItemBtn = document.getElementById('addBillItemBtn');
    const billTotalDisplay = document.getElementById('billTotalDisplay');
    const billMarkupInput = document.getElementById('billMarkup');
    const billDiscountInput = document.getElementById('billDiscount');
    const billSalesTaxInput = document.getElementById('billSalesTax');
    const grandTotalDisplay = document.getElementById('grandTotalDisplay');
    let pagePropertyId = null; // To store the property ID for the entire page context

    // =================================================================================
    // HELPER FUNCTIONS
    // =================================================================================
    const formatCurrency = (value) => {
        const absValue = Math.abs(value);
        const sign = value < 0 ? '-' : '';
        return `${sign}$${absValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const updateBillTotal = () => {
        const amountInputs = document.querySelectorAll('.amount-input');
        let total = 0;
        amountInputs.forEach(input => {
            total += parseFloat(input.value) || 0;
        });
        if (billTotalDisplay) billTotalDisplay.textContent = formatCurrency(total);

        // Calculate defaults: Markup 10%, Sales Tax 2%, Discount 5%
        const markupPercent = 0.10;
        const taxPercent = 0.02;
        const discountPercent = 0.05;

        const markupAmount = total * markupPercent;
        const taxAmount = total * taxPercent;
        const discountAmount = total * discountPercent;

        const grandTotal = total + markupAmount + taxAmount - discountAmount;

        if (billMarkupInput) billMarkupInput.value = formatCurrency(markupAmount);
        if (billSalesTaxInput) billSalesTaxInput.value = formatCurrency(taxAmount);
        if (billDiscountInput) billDiscountInput.value = formatCurrency(discountAmount);
        if (grandTotalDisplay) grandTotalDisplay.textContent = formatCurrency(grandTotal);
    };

    const updateUnitSelect = (select, propertyId) => {
        select.innerHTML = '';
        if (propertyId) {
            const defaultOption = document.createElement('option');
            defaultOption.value = "Property Level";
            defaultOption.textContent = "Property Level";
            defaultOption.selected = true;
            select.appendChild(defaultOption);

            const property = mockProperties.find(p => p.id === propertyId);
            if (property && property.units) {
                property.units.forEach(unit => {
                    const option = document.createElement('option');
                    option.value = unit;
                    option.textContent = unit;
                    select.appendChild(option);
                });
            }
            select.disabled = false;
        } else {
            select.innerHTML = '<option value="">Select Unit</option>';
            select.disabled = true;
        }
    };

    const createBillItemRow = () => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td class="px-4 py-2">
                <select name="property[]" class="property-select w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1.5">
                    <option value="">Select Property</option>
                </select>
            </td>
            <td class="px-4 py-2">
                <select name="unit[]" class="unit-select w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1.5" disabled>
                    <option value="">Select Unit</option>
                </select>
            </td>
            <td class="px-4 py-2">
                <select name="expense[]" class="expense-select w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1.5">
                    <option value="">Select Expense</option>
                </select>
            </td>
            <td class="px-4 py-2">
                <input type="text" name="description[]" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1.5" placeholder="Description">
            </td>
            <td class="px-4 py-2">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500 text-sm">$</span>
                    <input type="number" name="amount[]" step="0.01" class="amount-input w-full pl-5 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1.5" placeholder="0.00">
                </div>
            </td>
            <td class="px-4 py-2 text-center">
                <button type="button" class="remove-row-btn text-red-500 hover:text-red-700 focus:outline-none">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;

        // Populate Property Select
        const propertySelect = row.querySelector('.property-select');
        mockProperties.forEach(prop => {
            const option = document.createElement('option');
            option.value = prop.id;
            option.textContent = prop.name;
            propertySelect.appendChild(option);
        });

        // Populate Expense Select
        const expenseSelect = row.querySelector('.expense-select');
        mockExpenses.forEach(exp => {
            const option = document.createElement('option');
            option.value = exp;
            option.textContent = exp;
            expenseSelect.appendChild(option);
        });

        const unitSelect = row.querySelector('.unit-select');
        
        // If a property ID is passed, pre-select it and populate units.
        if (pagePropertyId) {
            propertySelect.value = pagePropertyId;
            propertySelect.disabled = true; // Make it read-only
            updateUnitSelect(unitSelect, pagePropertyId);
        }

        propertySelect.addEventListener('change', () => {
            updateUnitSelect(unitSelect, propertySelect.value);
        });

        row.querySelector('.amount-input').addEventListener('input', updateBillTotal);
        row.querySelector('.remove-row-btn').addEventListener('click', () => {
            row.remove();
            updateBillTotal();
        });

        return row;
    };

    const initializePage = () => {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('paymentDate').value = today;

        const urlParams = new URLSearchParams(window.location.search);
        pagePropertyId = urlParams.get('propertyId');

        billItemsBody.appendChild(createBillItemRow());
        updateBillTotal();
    };

    // =================================================================================
    // EVENT LISTENERS
    // =================================================================================
    if (addBillItemBtn) {
        addBillItemBtn.addEventListener('click', () => {
            billItemsBody.appendChild(createBillItemRow());
        });
    }

    if (addExpenseForm) {
        addExpenseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(addExpenseForm);
            const expenseData = {
                paymentDate: formData.get('paymentDate'),
                bankName: formData.get('bankName'),
                paymentType: formData.get('paymentType'),
                paymentMethod: formData.get('paymentMethod'),
                refNumber: formData.get('refNumber'),
                items: []
            };

            const rows = billItemsBody.querySelectorAll('tr');
            rows.forEach(row => {
                expenseData.items.push({
                    propertyId: row.querySelector('[name="property[]"]').value,
                    unit: row.querySelector('[name="unit[]"]').value,
                    expenseCategory: row.querySelector('[name="expense[]"]').value,
                    description: row.querySelector('[name="description[]"]').value,
                    amount: row.querySelector('[name="amount[]"]').value,
                });
            });

            console.log('New Expense Created (simulation):', expenseData);
            alert('Expense added successfully! (See console for data). Redirecting to property list.');
            window.location.href = 'Property_listing.html';
        });
    }

    // =================================================================================
    // INITIALIZATION
    // =================================================================================
    initializePage();
});