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
    const vendorSelect = document.getElementById('vendorSelect');
    const addExpenseForm = document.getElementById('addExpenseForm');
    const billItemsBody = document.getElementById('billItemsBody');
    const addBillItemBtn = document.getElementById('addBillItemBtn');
    const billTotalDisplay = document.getElementById('billTotalDisplay');
    const billMarkupInput = document.getElementById('billMarkup');
    const billDiscountInput = document.getElementById('billDiscount');
    const billSalesTaxInput = document.getElementById('billSalesTax');
    const grandTotalDisplay = document.getElementById('grandTotalDisplay');
    const resetMarkupBtn = document.getElementById('resetMarkupBtn');
    const resetDiscountBtn = document.getElementById('resetDiscountBtn');
    const resetSalesTaxBtn = document.getElementById('resetSalesTaxBtn');

    // =================================================================================
    // HELPER FUNCTIONS
    // =================================================================================
    const formatCurrency = (value) => {
        const absValue = Math.abs(value);
        const sign = value < 0 ? '-' : '';
        return `${sign}$${absValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const updateBillTotal = (recalculateFees = true) => {
        const amountInputs = document.querySelectorAll('.amount-input');
        let total = 0;

        const markupPercent = 0.10;
        const taxPercent = 0.02;
        const discountPercent = 0.05;

        amountInputs.forEach(input => {
            const val = parseFloat(input.value) || 0;
            total += val;

            const row = input.closest('tr');
            const tooltip = row.querySelector('.row-tooltip');
            if (tooltip) {
                tooltip.innerHTML = `
                    <div class="mb-1 border-b border-gray-600 pb-1">
                        <div class="flex justify-between gap-4"><span>Markup (10%):</span> <span>${formatCurrency(val * markupPercent)}</span></div>
                        <div class="text-xs text-gray-400">Rule: Standard Expense Markup</div>
                    </div>
                    <div class="mb-1 border-b border-gray-600 pb-1">
                        <div class="flex justify-between gap-4"><span>Discount (5%):</span> <span>${formatCurrency(val * discountPercent)}</span></div>
                        <div class="text-xs text-gray-400">Rule: Vendor Discount</div>
                    </div>
                    <div>
                        <div class="flex justify-between gap-4"><span>Sales Tax (2%):</span> <span>${formatCurrency(val * taxPercent)}</span></div>
                        <div class="text-xs text-gray-400">Rule: State Tax</div>
                    </div>
                `;
            }
        });
        if (billTotalDisplay) billTotalDisplay.textContent = formatCurrency(total);

        let markupAmount, taxAmount, discountAmount;

        if (recalculateFees) {

            markupAmount = total * markupPercent;
            taxAmount = total * taxPercent;
            discountAmount = total * discountPercent;

            if (billMarkupInput) billMarkupInput.value = formatCurrency(markupAmount);
            if (billSalesTaxInput) billSalesTaxInput.value = formatCurrency(taxAmount);
            if (billDiscountInput) billDiscountInput.value = formatCurrency(discountAmount);
        } else {
            markupAmount = billMarkupInput ? (parseFloat(billMarkupInput.value.replace(/[^0-9.-]+/g,"")) || 0) : 0;
            taxAmount = billSalesTaxInput ? (parseFloat(billSalesTaxInput.value.replace(/[^0-9.-]+/g,"")) || 0) : 0;
            discountAmount = billDiscountInput ? (parseFloat(billDiscountInput.value.replace(/[^0-9.-]+/g,"")) || 0) : 0;
        }

        const grandTotal = total + markupAmount + taxAmount - discountAmount;

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
                <div class="flex items-center space-x-2">
                    <div class="relative flex-grow">
                        <span class="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500 text-sm">$</span>
                        <input type="number" name="amount[]" step="0.01" class="amount-input w-full pl-5 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1.5" placeholder="0.00">
                    </div>
                    <div class="relative group">
                        <i class="fas fa-info-circle text-gray-400 cursor-help"></i>
                        <div class="row-tooltip absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 z-50 shadow-lg whitespace-nowrap min-w-[150px]">
                            <div class="mb-1 border-b border-gray-600 pb-1">
                                <div class="flex justify-between gap-4"><span>Markup (10%):</span> <span>$0.00</span></div>
                                <div class="text-xs text-gray-400">Rule: Standard Expense Markup</div>
                            </div>
                            <div class="mb-1 border-b border-gray-600 pb-1">
                                <div class="flex justify-between gap-4"><span>Discount (5%):</span> <span>$0.00</span></div>
                                <div class="text-xs text-gray-400">Rule: Vendor Discount</div>
                            </div>
                            <div>
                                <div class="flex justify-between gap-4"><span>Sales Tax (2%):</span> <span>$0.00</span></div>
                                <div class="text-xs text-gray-400">Rule: State Tax</div>
                            </div>
                        </div>
                    </div>
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

    const populateVendors = () => {
        if (!vendorSelect) return;
        mockVendors.forEach(vendor => {
            const option = document.createElement('option');
            option.value = vendor.id;
            option.textContent = vendor.name;
            vendorSelect.appendChild(option);
        });
    };

    const initializePage = () => {
        populateVendors();

        const urlParams = new URLSearchParams(window.location.search);
        const vendorId = urlParams.get('vendorId');
        if (vendorId && vendorSelect) {
            vendorSelect.value = vendorId;
        }

        const today = new Date().toISOString().split('T')[0];
        document.getElementById('paymentDate').value = today;

        billItemsBody.appendChild(createBillItemRow());
        updateBillTotal();
    };

    // =================================================================================
    // EVENT LISTENERS
    // =================================================================================
    if (billMarkupInput) billMarkupInput.addEventListener('input', () => updateBillTotal(false));
    if (billDiscountInput) billDiscountInput.addEventListener('input', () => updateBillTotal(false));
    if (billSalesTaxInput) billSalesTaxInput.addEventListener('input', () => updateBillTotal(false));

    const getBillSubTotal = () => {
        const amountInputs = document.querySelectorAll('.amount-input');
        let total = 0;
        amountInputs.forEach(input => {
            total += parseFloat(input.value) || 0;
        });
        return total;
    };

    if (resetMarkupBtn) {
        resetMarkupBtn.addEventListener('click', () => {
            const total = getBillSubTotal();
            if (billMarkupInput) billMarkupInput.value = formatCurrency(total * 0.10);
            updateBillTotal(false);
        });
    }
    if (resetDiscountBtn) {
        resetDiscountBtn.addEventListener('click', () => {
            const total = getBillSubTotal();
            if (billDiscountInput) billDiscountInput.value = formatCurrency(total * 0.05);
            updateBillTotal(false);
        });
    }
    if (resetSalesTaxBtn) {
        resetSalesTaxBtn.addEventListener('click', () => {
            const total = getBillSubTotal();
            if (billSalesTaxInput) billSalesTaxInput.value = formatCurrency(total * 0.02);
            updateBillTotal(false);
        });
    }

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
                vendorId: formData.get('vendorId'),
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
            alert('Expense added successfully! (See console for data). Redirecting to vendor list.');
            window.location.href = 'vendor.html';
        });
    }

    // =================================================================================
    // INITIALIZATION
    // =================================================================================
    initializePage();
});