document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // STATE AND DATA
    // =================================================================================
    const initialVendors = [
        {
            id: 'v1',
            name: 'City Water Dept.',
            category: 'Utilities',
            phone: '555-100-2000',
            email: 'billing@citywater.gov',
            address: '100 Utility Dr, Anytown, USA',
            balance: 225.00,
            transactions: [
                { id: 'vtx1-1', date: '2024-09-05', description: 'Invoice #CW-9876', property: '123 Main St', amount: 225.00, type: 'Bill' },
                { id: 'vtx1-2', date: '2024-08-05', description: 'Invoice #CW-9801', property: '123 Main St', amount: 210.00, type: 'Bill' },
                { id: 'vtx1-3', date: '2024-08-10', description: 'Payment - CK#1234', property: '123 Main St', amount: -210.00, type: 'Payment' },
            ]
        },
        {
            id: 'v2',
            name: 'GreenScape Landscaping',
            category: 'Landscaping',
            phone: '555-300-4000',
            email: 'contact@greenscape.com',
            address: '200 Garden Way, Anytown, USA',
            balance: 150.00,
            transactions: [
                { id: 'vtx2-1', date: '2024-10-25', description: 'Monthly Service', property: '123 Main St', amount: 150.00, type: 'Bill' },
                { id: 'vtx2-2', date: '2024-09-25', description: 'Monthly Service', property: '123 Main St', amount: 150.00, type: 'Bill' },
                { id: 'vtx2-3', date: '2024-09-30', description: 'Payment - ACH', property: '123 Main St', amount: -150.00, type: 'Payment' },
            ]
        },
        {
            id: 'v3',
            name: 'FixIt Plumbing',
            category: 'Plumbing',
            phone: '555-500-6000',
            email: 'service@fixitplumbing.com',
            address: '300 Pipe Ln, Somewhere, USA',
            balance: 0.00,
            transactions: [
                { id: 'vtx3-1', date: '2024-10-15', description: 'Apt 101 - Faucet Repair', property: '123 Main St', amount: 175.00, type: 'Bill' },
                { id: 'vtx3-2', date: '2024-10-20', description: 'Payment - CC', property: '123 Main St', amount: -175.00, type: 'Payment' },
            ]
        },
        {
            id: 'v4',
            name: 'CleanSweep Janitorial',
            category: 'Cleaning',
            phone: '555-700-8000',
            email: 'sales@cleansweep.com',
            address: '400 Clean Ct, Villagetown, USA',
            balance: 800.00,
            transactions: [
                 { id: 'vtx4-1', date: '2024-09-10', description: 'Monthly Cleaning', property: '456 Oak Ave', amount: 400.00, type: 'Bill' },
                 { id: 'vtx4-2', date: '2024-10-10', description: 'Monthly Cleaning', property: '456 Oak Ave', amount: 400.00, type: 'Bill' },
            ]
        }
    ];

    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredVendors = [...initialVendors];
    let currentVendor = null;

    // =================================================================================
    // DOM ELEMENT SELECTORS
    // =================================================================================
    const listingPage = document.getElementById('listingPage');
    const detailsPage = document.getElementById('detailsPage');
    const vendorTableBody = document.getElementById('vendorTableBody');
    const searchInput = document.getElementById('searchInput');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    const backBtn = document.getElementById('backBtn');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const vendorSwitcherInput = document.getElementById('vendorSwitcherInput');
    const prevVendorBtn = document.getElementById('prevVendorBtn');
    const nextVendorBtn = document.getElementById('nextVendorBtn');
    const postBillBtn = document.getElementById('postBillBtn');
    const postRubsBtn = document.getElementById('postRubsBtn');

    // =================================================================================
    // HELPER FUNCTIONS
    // =================================================================================
    const formatCurrency = (value) => {
        const absValue = Math.abs(value);
        const sign = value < 0 ? '-' : '';
        return `${sign}$${absValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const showModal = (title, message) => {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').innerHTML = message;
        document.getElementById('customModal').classList.remove('hidden');
    };

    const hideModal = () => {
        document.getElementById('customModal').classList.add('hidden');
    };

    // =================================================================================
    // CORE APPLICATION LOGIC
    // =================================================================================

    const updatePaginationControls = (vendors) => {
        const totalPages = Math.ceil(vendors.length / itemsPerPage);
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        pageInfo.textContent = `Page ${totalPages > 0 ? currentPage : 0} of ${totalPages}`;
    };

    const renderTable = (vendors) => {
        vendorTableBody.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedVendors = vendors.slice(start, end);

        paginatedVendors.forEach(vendor => {
            const balanceClass = vendor.balance >= 0 ? 'balance-positive' : 'balance-negative';
            const mainRow = document.createElement('tr');
            mainRow.className = 'bg-white font-semibold text-gray-800 hover:bg-gray-100 transition-colors';
            mainRow.setAttribute('data-id', vendor.id);
            mainRow.innerHTML = `
                <td class="px-4 sm:px-6 py-4">${vendor.name}</td>
                <td class="px-4 sm:px-6 py-4 hide-on-mobile text-sm text-gray-600">${vendor.email}<br>${vendor.phone}</td>
                <td class="px-4 sm:px-6 py-4">${vendor.category}</td>
                <td class="px-4 sm:px-6 py-4 ${balanceClass}">${formatCurrency(vendor.balance)}</td>
                <td class="px-4 sm:px-6 py-4">
                    <button data-id="${vendor.id}" title="View Details" aria-label="View Details" class="details-btn text-blue-600 hover:text-blue-800">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </td>
            `;
            vendorTableBody.appendChild(mainRow);
        });

        updatePaginationControls(vendors);
    };

    const renderVendorDetails = (vendor) => {
        currentVendor = vendor;
        vendorSwitcherInput.value = vendor.name;
        document.getElementById('vendorCategory').textContent = `Service: ${vendor.category}`;
        
        // Default to overview tab
        switchTab('overview');
    };

    const populateOverviewTab = (vendor) => {
        const totalBilled = vendor.transactions.filter(tx => tx.type === 'Bill').reduce((sum, tx) => sum + tx.amount, 0);
        const totalPaid = vendor.transactions.filter(tx => tx.type === 'Payment').reduce((sum, tx) => sum + tx.amount, 0);

        document.getElementById('overview-total-billed').textContent = formatCurrency(totalBilled);
        document.getElementById('overview-total-paid').textContent = formatCurrency(totalPaid);
        document.getElementById('overview-balance').textContent = formatCurrency(vendor.balance);
        document.getElementById('overview-balance').className = `text-2xl font-bold mt-1 ${vendor.balance > 0 ? 'text-red-600' : 'text-green-600'}`;

        const detailsList = document.getElementById('vendor-details-list');
        detailsList.innerHTML = `
            <p><strong>Contact Name:</strong> <span class="text-gray-700">N/A</span></p>
            <p><strong>Email:</strong> <a href="mailto:${vendor.email}" class="text-blue-600 hover:underline">${vendor.email}</a></p>
            <p><strong>Phone:</strong> <span class="text-gray-700">${vendor.phone}</span></p>
            <p><strong>Address:</strong> <span class="text-gray-700">${vendor.address}</span></p>
        `;
    };

    const populateTransactionTab = (vendor) => {
        const container = document.getElementById('transaction-list-container');
        const transactions = (vendor.transactions || []).sort((a, b) => new Date(b.date) - new Date(a.date));

        if (transactions.length === 0) {
            container.innerHTML = '<p class="p-4 text-center text-gray-500">No transactions for this vendor.</p>';
            return;
        }

        let tableHTML = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bill</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${transactions.map(tx => `
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${new Date(tx.date).toLocaleDateString()}</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">${tx.description}</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${tx.property || 'N/A'}</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-red-600 text-right">${tx.type === 'Bill' ? formatCurrency(tx.amount) : '-'}</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-green-600 text-right">${tx.type === 'Payment' ? formatCurrency(tx.amount) : '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        container.innerHTML = tableHTML;
    };

    const switchTab = (tabId) => {
        tabButtons.forEach(btn => {
            btn.classList.toggle('border-indigo-500', btn.dataset.tab === tabId);
            btn.classList.toggle('text-indigo-600', btn.dataset.tab === tabId);
            btn.classList.toggle('border-transparent', btn.dataset.tab !== tabId);
            btn.classList.toggle('text-gray-500', btn.dataset.tab !== tabId);
        });
        tabContents.forEach(content => {
            content.classList.toggle('hidden', content.dataset.tab !== tabId);
        });

        if (currentVendor) {
            if (tabId === 'overview') populateOverviewTab(currentVendor);
            if (tabId === 'transaction') populateTransactionTab(currentVendor);
        }
    };

    const showDetailsPage = (vendorId) => {
        const selectedVendor = initialVendors.find(v => v.id === vendorId);
        if (selectedVendor) {
            listingPage.classList.add('hidden');
            detailsPage.classList.remove('hidden');
            renderVendorDetails(selectedVendor);
        }
    };

    const handleVendorNavigation = (direction) => {
        if (!currentVendor) return;
        const currentIndex = initialVendors.findIndex(v => v.id === currentVendor.id);
        if (currentIndex === -1) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % initialVendors.length;
        } else {
            newIndex = (currentIndex - 1 + initialVendors.length) % initialVendors.length;
        }
        showDetailsPage(initialVendors[newIndex].id);
    };

    const handleSearch = () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredVendors = initialVendors.filter(vendor => 
            vendor.name.toLowerCase().includes(searchTerm) ||
            vendor.category.toLowerCase().includes(searchTerm) ||
            vendor.email.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        renderTable(filteredVendors);
    };

    // =================================================================================
    // EVENT LISTENERS
    // =================================================================================
    if (searchInput) searchInput.addEventListener('input', handleSearch);

    if (backBtn) backBtn.addEventListener('click', () => {
        listingPage.classList.remove('hidden');
        detailsPage.classList.add('hidden');
    });

    if (vendorTableBody) vendorTableBody.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        if (row && row.dataset.id) {
            showDetailsPage(row.dataset.id);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable(filteredVendors);
        }
    });

    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable(filteredVendors);
        }
    });

    if (tabButtons) tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    if (prevVendorBtn) prevVendorBtn.addEventListener('click', () => handleVendorNavigation('prev'));
    if (nextVendorBtn) nextVendorBtn.addEventListener('click', () => handleVendorNavigation('next'));

    document.getElementById('addVendorBtn')?.addEventListener('click', () => showModal('Coming Soon', 'Functionality to add a new vendor will be available in a future update.'));
    
    if (postBillBtn) {
        postBillBtn.addEventListener('click', () => {
            if (currentVendor) {
                window.location.href = `create_bill.html?vendorId=${currentVendor.id}`;
            }
        });
    }

    if (postRubsBtn) {
        postRubsBtn.addEventListener('click', () => {
            if (currentVendor) {
                window.location.href = `create_rubs.html?vendorId=${currentVendor.id}`;
            }
        });
    }

    // =================================================================================
    // BUTTON MANAGEMENT (Create, Pay, Expenses, RUBS, CAM)
    // =================================================================================
    const addExpenseBtn = document.getElementById('addExpenseBtn');

    // 1. Create Pay Bill Button
    if (postBillBtn && !document.getElementById('payBillBtn')) {
        const payBillBtn = postBillBtn.cloneNode(true);
        payBillBtn.id = 'payBillBtn';
        payBillBtn.innerHTML = '<i class="fas fa-money-bill-wave mr-1"></i> Pay Bill';
        payBillBtn.addEventListener('click', () => {
            if (currentVendor) {
                alert('Pay Bill functionality coming soon.');
            }
        });
        postBillBtn.parentNode.appendChild(payBillBtn);
    }

    // 2. Create CAM Button
    if (postRubsBtn && !document.getElementById('postCamBtn')) {
        const postCamBtn = postRubsBtn.cloneNode(true);
        postCamBtn.id = 'postCamBtn';
        postCamBtn.innerHTML = postRubsBtn.innerHTML.replace('RUBS', 'CAM');
        
        postCamBtn.addEventListener('click', () => {
            if (currentVendor) {
                window.location.href = `create_cam.html?vendorId=${currentVendor.id}`;
            }
        });
        postRubsBtn.parentNode.appendChild(postCamBtn);
    }

    // 3. Reorder Buttons: Create Bill, Pay Bill, Add Expenses, Create Rubs, Create CAM
    if (postBillBtn && postBillBtn.parentNode) {
        const container = postBillBtn.parentNode;
        const payBillBtn = document.getElementById('payBillBtn');
        const postCamBtn = document.getElementById('postCamBtn');

        container.appendChild(postBillBtn);
        if (payBillBtn) container.appendChild(payBillBtn);
        if (addExpenseBtn) container.appendChild(addExpenseBtn);
        if (postRubsBtn) container.appendChild(postRubsBtn);
        if (postCamBtn) container.appendChild(postCamBtn);
    }

    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', () => {
            if (currentVendor) {
                window.location.href = `add_expense.html?vendorId=${currentVendor.id}`;
            }
        });
    }

    document.getElementById('modalCloseBtn')?.addEventListener('click', hideModal);

    // =================================================================================
    // INITIALIZATION
    // =================================================================================
    if (listingPage && !listingPage.classList.contains('hidden')) {
        renderTable(filteredVendors);
    }
});