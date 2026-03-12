document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // STATE AND DATA
    // =================================================================================
    const initialProperties = [
        {
            id: 'p1',
            address: '123 Main St, Anytown, USA',
            type: 'Residential',
            owner: 'John Doe',
            owners: [
                { name: 'John Doe', percentage: 60, effectiveDate: '2018-05-15' },
                { name: 'Sarah Investments LLC', percentage: 40, effectiveDate: '2022-01-01' }
            ],
            balance: 1850.00,
            purchaseDate: '05/15/2018',
            currentValue: 450000,
            lastInspection: '03/01/2024',
            nextInspection: '03/01/2025',
            units: [
                { id: 'u1a', name: 'Apt 101', type: 'Studio', vacant: false, tenant: 'Jane Doe', leaseStart: '2024-08-01', leaseEnd: '2025-07-31', sqft: 550, rent: 1200 },
                { id: 'u1b', name: 'Apt 102', type: '1 Bed', vacant: false, tenant: 'Future Tenant', leaseStart: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0], leaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], sqft: 750, rent: 1350 },
                { id: 'u1c', name: 'Apt 103', type: '2 Bed', vacant: false, tenant: 'Bob Johnson', leaseStart: '2023-11-01', leaseEnd: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString().split('T')[0], sqft: 950, rent: 1450 },
                { id: 'u1d', name: 'Apt 104', type: '1 Bed', vacant: false, tenant: 'Alice Williams', leaseStart: '2023-09-15', leaseEnd: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], sqft: 720, rent: 1350 },
                { id: 'u1e', name: 'Apt 105', type: '2 Bed', vacant: false, tenant: 'Charlie Brown', leaseStart: '2023-10-01', leaseEnd: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString().split('T')[0], sqft: 980, rent: 1500 },
                { id: 'u1f', name: 'Apt 106', type: 'Studio', vacant: true, marketRent: 1150, sqft: 500 }
            ],
            tenants: [
                { name: 'Jane Doe', unit: 'Apt 101', status: 'current', email: 'jane.d@email.com', phone: '555-123-4567' },
                { name: 'Bob Johnson', unit: 'Apt 103', status: 'current', email: 'bob.j@email.com', phone: '555-987-6543' },
                { name: 'Alice Williams', unit: 'Apt 104', status: 'current', email: 'alice.w@email.com', phone: '555-111-2222' },
                { name: 'Charlie Brown', unit: 'Apt 105', status: 'current', email: 'charlie.b@email.com', phone: '555-333-4444' },
                { name: 'John Smith', unit: 'Apt 102', status: 'past', movedOut: '05/20/2023', email: 'john.s@email.com', phone: '555-555-1212' }
            ],
            applications: [
                { applicant: 'Emily White', unit: 'Apt 102', status: 'Pending Review', archived: false },
                { applicant: 'Mark Davis', unit: 'Apt 102', status: 'Approved, awaiting lease signing', archived: false },
                { applicant: 'Sarah Taylor', unit: 'Apt 101', status: 'Denied', archived: true, date: '04/01/2024' },
                { applicant: 'David Garcia', unit: 'Apt 104', status: 'Approved', archived: true, date: '03/15/2024' }
            ],
            messages: [
                { from: 'Jane Doe', subject: 'Leaking faucet in Apt 101', timestamp: '2024-07-28', status: 'New', text: 'The faucet in my bathroom is dripping constantly. It\'s been doing it since yesterday.' },
                { from: 'Bob Johnson', subject: 'Parking spot question', timestamp: '2024-07-26', status: 'New', text: 'Is there an assigned parking spot for Apt 103?' },
                { from: 'Property Manager', subject: 'Payment received for July rent', timestamp: '2024-07-27', status: 'Read', text: 'Just confirming I received the rent payment for July. Thank you!' }
            ],
            announcements: [
                { title: 'Planned Water Shutoff', date: '2024-07-25', content: 'There will be a planned water shutoff for maintenance on Tuesday, July 30th, from 9 AM to 1 PM.' },
                { title: 'Notice of Entry for Inspection', date: '2024-07-20', content: 'We will be performing a routine inspection on August 5th. Please ensure we have clear access to all units.' }
            ],
            tasks: [
                { id: 't1', description: 'Fix leaky faucet', unit: 'Apt 101', dueDate: '09/25/2025', assignee: 'Maintenance Team', status: 'open' },
                { id: 't2', description: 'Schedule annual fire alarm inspection', unit: null, dueDate: '10/10/2025', assignee: 'Property Manager', status: 'open' }, // Property-level task
                { id: 't3', description: 'Replace broken window in Apt 103', unit: 'Apt 103', dueDate: '08/15/2025', assignee: 'Maintenance Team', status: 'completed', completionDate: '08/12/2025' },
                { id: 't1a', description: 'Paint bedroom', unit: 'Apt 105', dueDate: '09/30/2025', assignee: 'Maintenance Team', status: 'open' }
            ],
            vendors: [
                { id: 'v1', name: 'City Water Dept.', category: 'Utilities', phone: '555-100-2000', email: 'billing@citywater.gov' },
                { id: 'v2', name: 'GreenScape Landscaping', category: 'Landscaping', phone: '555-300-4000', email: 'contact@greenscape.com' },
                { id: 'v3', name: 'FixIt Plumbing', category: 'Plumbing', phone: '555-500-6000', email: 'service@fixitplumbing.com' }
            ],
            transactions: [
                // --- NEW DATA FOR OCTOBER 2024 ---
                { id: 'tx-p1-oct-1', date: '2024-10-01', description: 'Jane Doe - Rent', unit: 'Apt 101', amount: 1200.00 },
                { id: 'tx-p1-oct-2', date: '2024-10-01', description: 'Bob Johnson - Rent', unit: 'Apt 103', amount: 1450.00 },
                { id: 'tx-p1-oct-3', date: '2024-10-05', description: 'Alice Williams - Rent', unit: 'Apt 104', amount: 1350.00 },
                { id: 'tx-p1-oct-4', date: '2024-10-06', description: 'Alice Williams - Late Fee', unit: 'Apt 104', amount: 50.00 },
                { id: 'tx-p1-oct-5', date: '2024-10-01', description: 'Charlie Brown - Rent', unit: 'Apt 105', amount: 1500.00 },
                { id: 'tx-p1-oct-6', date: '2024-10-01', description: 'Mortgage', unit: null, amount: -2200.00 },
                { id: 'tx-p1-oct-7', date: '2024-10-15', description: 'Plumbing Repair', unit: 'Apt 101', amount: -175.00 },
                { id: 'tx-p1-oct-8', date: '2024-10-25', description: 'Landscaping', unit: null, amount: -150.00 },
                // --- NEW DATA FOR SEPTEMBER 2024 ---
                { id: 'tx-p1-sep-1', date: '2024-09-01', description: 'Jane Doe - Rent', unit: 'Apt 101', amount: 1200.00 },
                { id: 'tx-p1-sep-2', date: '2024-09-01', description: 'Bob Johnson - Rent', unit: 'Apt 103', amount: 1450.00 },
                { id: 'tx-p1-sep-3', date: '2024-09-02', description: 'Alice Williams - Rent', unit: 'Apt 104', amount: 1350.00 },
                { id: 'tx-p1-sep-4', date: '2024-09-01', description: 'Charlie Brown - Rent', unit: 'Apt 105', amount: 1500.00 },
                { id: 'tx-p1-sep-5', date: '2024-09-15', description: 'Laundry Vending', unit: null, amount: 235.00 },
                { id: 'tx-p1-sep-6', date: '2024-09-01', description: 'Mortgage', unit: null, amount: -2200.00 },
                { id: 'tx-p1-sep-7', date: '2024-09-05', description: 'Utilities (Water/Sewer)', unit: null, amount: -225.00 },
                { id: 'tx-p1-sep-8', date: '2024-09-25', description: 'Landscaping', unit: null, amount: -150.00 },
                // --- NEW DATA FOR AUGUST 2024 ---
                { id: 'tx-p1-aug-1', date: '2024-08-01', description: 'Jane Doe - Rent', unit: 'Apt 101', amount: 1200.00 },
                { id: 'tx-p1-aug-2', date: '2024-08-01', description: 'Bob Johnson - Rent', unit: 'Apt 103', amount: 1450.00 },
                { id: 'tx-p1-aug-3', date: '2024-08-02', description: 'Alice Williams - Rent', unit: 'Apt 104', amount: 1350.00 },
                { id: 'tx-p1-aug-4', date: '2024-08-01', description: 'Charlie Brown - Rent', unit: 'Apt 105', amount: 1500.00 },
                { id: 'tx-p1-aug-6', date: '2024-08-05', description: 'Common Area Electricity', unit: null, amount: -185.50 },
                { id: 'tx-p1-aug-7', date: '2024-08-10', description: 'Unit 104 - Faucet Repair', unit: 'Apt 104', amount: -125.00 },
                { id: 'tx-p1-aug-8', date: '2024-08-12', description: 'Lobby painting', unit: null, amount: -450.00 },
                // Income for July
                { id: 'tx-p1-1', date: '2024-07-28', description: 'Jane Doe', unit: 'Apt 101', amount: 1200.00 },
                { id: 'tx-p1-2', date: '2024-07-27', description: 'Bob Johnson', unit: 'Apt 103', amount: 1450.00 },
                { id: 'tx-p1-3', date: '2024-07-20', description: 'Alice Williams', unit: 'Apt 104', amount: 1350.00 },
                { id: 'tx-p1-4', date: '2024-07-29', description: 'Charlie Brown', unit: 'Apt 105', amount: 1500.00 },
                { id: 'tx-p1-5', date: '2024-07-18', description: 'Late Fee', unit: 'Apt 101', amount: 50.00 },
                { id: 'tx-p1-6', date: '2024-07-19', description: 'Laundry Vending', unit: null, amount: 220.00 },
                // Expenses for July
                { date: '2024-07-25', description: 'Landscaping', amount: -150.00 },
                { date: '2024-07-15', description: 'Plumbing Repair', amount: -275.50 },
                { date: '2024-07-01', description: 'Mortgage', amount: -2200.00 },
                { date: '2024-07-10', description: 'General Maintenance', amount: -350.00 },
                { date: '2024-07-05', description: 'Utilities (Water/Sewer)', amount: -210.00 },
                { date: '2024-07-22', description: 'Pest Control', amount: -75.00 },
                // Income for June
                { id: 'tx-p1-7', date: '2024-06-28', description: 'Jane Doe', unit: 'Apt 101', amount: 1200.00 },
                { id: 'tx-p1-8', date: '2024-06-27', description: 'Bob Johnson', unit: 'Apt 103', amount: 1450.00 },
                { id: 'tx-p1-9', date: '2024-06-20', description: 'Alice Williams', unit: 'Apt 104', amount: 1350.00 },
                { id: 'tx-p1-10', date: '2024-06-15', description: 'Laundry Vending', unit: null, amount: 215.00 },
                { id: 'tx-p1-26', date: '2024-06-10', description: 'Application Fee', unit: 'Apt 102', amount: 50.00 },
                // Expenses for June
                { id: 'tx-p1-11', date: '2024-06-25', description: 'Landscaping', amount: -150.00 },
                { id: 'tx-p1-12', date: '2024-06-01', description: 'Mortgage', amount: -2200.00 },
                { date: '2024-06-18', description: 'Insurance', amount: -450.00 },
                { date: '2024-06-08', description: 'Electrical Repair', unit: 'Apt 103', amount: -180.00 },
                // Data for May
                { id: 'tx-p1-13', date: '2024-05-28', description: 'Jane Doe', unit: 'Apt 101', amount: 1200.00 },
                { id: 'tx-p1-14', date: '2024-05-27', description: 'Bob Johnson', unit: 'Apt 103', amount: 1450.00 },
                { id: 'tx-p1-15', date: '2024-05-20', description: 'Alice Williams', unit: 'Apt 104', amount: 1350.00 },
                { id: 'tx-p1-16', date: '2024-05-10', description: 'Electricity Bill', amount: -180.00 },
                { id: 'tx-p1-17', date: '2024-05-01', description: 'Mortgage', amount: -2200.00 },
                { date: '2024-05-25', description: 'Landscaping', amount: -150.00 },
                { date: '2024-05-15', description: 'Property Tax (Installment)', amount: -1100.00 },
            ],
            budget: {
                'Landscaping': 150,
                'Plumbing Repair': 200,
                'General Maintenance': 400,
                'Utilities (Water/Sewer)': 250
            }
        },
        {
            id: 'p3',
            address: '789 Pine Ln, Villagetown, USA',
            type: 'Residential',
            owner: 'Sam Tenant',
            owners: [
                { name: 'Sam Tenant', percentage: 100, effectiveDate: '2023-03-01' }
            ],
            balance: 500.00,
            purchaseDate: '03/01/2023',
            currentValue: 320000,
            lastInspection: '01/10/2024',
            nextInspection: '01/10/2025',
            units: [
                { id: 'u3a', name: 'Unit 101', type: '2 Bed', vacant: false, tenant: 'Sam Tenant', leaseStart: '2023-04-01', leaseEnd: '2025-03-31', sqft: 1100, rent: 1500 }
            ],
            tenants: [{ name: 'Sam Tenant', unit: 'Unit 101', status: 'current', email: 'sam.t@email.com', phone: '555-789-1234' }],
            applications: [],
            messages: [],
            announcements: [],
            tasks: [],
            vendors: [],
            transactions: [
                // Nov
                { id: 'tx-p3-nov-1', date: '2024-11-01', description: 'Sam Tenant - Rent', unit: 'Unit 101', amount: 150.00 },
                { id: 'tx-p3-nov-2', date: '2024-11-10', description: 'Laundry Income', unit: null, amount: 30.00 },
                { id: 'tx-p3-nov-3', date: '2024-11-15', description: 'Gas', unit: null, amount: -20.00 },
                // Oct
                { id: 'tx-p3-oct-1', date: '2024-10-01', description: 'Sam Tenant - Rent', unit: 'Unit 101', amount: 100.00 },
                { id: 'tx-p3-oct-2', date: '2024-10-10', description: 'Laundry Income', unit: null, amount: 20.00 },
                { id: 'tx-p3-oct-3', date: '2024-10-15', description: 'Gas', unit: null, amount: -10.00 },
                // Sep
                { id: 'tx-p3-sep-1', date: '2024-09-01', description: 'Sam Tenant - Rent', unit: 'Unit 101', amount: 100.00 },
                { id: 'tx-p3-sep-2', date: '2024-09-10', description: 'Laundry Income', unit: null, amount: 10.00 },
                { id: 'tx-p3-sep-3', date: '2024-09-15', description: 'Gas', unit: null, amount: -10.00 },
            ],
            budget: {}
        },
        {
            id: 'p2',
            address: '456 Oak Ave, Somewhere, USA',
            type: 'Commercial',
            owner: 'Jane Smith',
            owners: [
                { name: 'Jane Smith', percentage: 100, effectiveDate: '2022-01-10' }
            ],
            balance: 3250.50,
            purchaseDate: '01/10/2022',
            currentValue: 1200000,
            lastInspection: '02/15/2024',
            nextInspection: '02/15/2025',
            units: [
                { id: 'u2a', name: 'Unit 201', type: 'Office', vacant: false, tenant: 'Acme Corp', leaseStart: '2022-01-01', leaseEnd: new Date(new Date().setDate(new Date().getDate() + 85)).toISOString().split('T')[0], sqft: 2000, rent: 3500 },
                { id: 'u2b', name: 'Unit 202', type: 'Retail', vacant: false, tenant: 'Innovate Group', leaseStart: '2024-08-01', leaseEnd: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString().split('T')[0], sqft: 1500, rent: 2500 },
                { id: 'u2c', name: 'Unit 203', type: 'Office', vacant: true, marketRent: 1800, sqft: 1000 }
            ],
            tenants: [
                { name: 'Acme Corp', unit: 'Unit 201', status: 'current', email: 'contact@acme.com', phone: '555-222-3333' },
                { name: 'Innovate Group', unit: 'Unit 202', status: 'current', email: 'contact@innovate.com', phone: '555-333-4444' }
            ],
            applications: [
                { applicant: 'Future Tech', unit: 'Unit 203', status: 'Pending Review', archived: false }
            ],
            messages: [
                { from: 'Acme Corp', subject: 'Request for extended hours access', timestamp: '2024-07-29', status: 'New', text: 'We would like to request extended building access hours for a project launch. Please let us know the process.' }
            ],
            announcements: [
                { title: 'Elevator Maintenance', date: '2024-07-28', content: 'The elevator will be out of service for scheduled maintenance on Wednesday, July 31st.' }
            ],
            tasks: [
                { id: 't4', description: 'Repair Unit 201 AC unit', unit: 'Unit 201', dueDate: '09/30/2025', assignee: 'Maintenance Team', status: 'open' },
                { id: 't5', description: 'Repaint lobby', unit: null, dueDate: '10/15/2025', assignee: 'Contractor', status: 'open' }
            ],
            vendors: [
                { id: 'v4', name: 'CleanSweep Janitorial', category: 'Cleaning', phone: '555-700-8000', email: 'sales@cleansweep.com' }
            ],
            transactions: [
                // July
                { id: 'tx-p2-1', date: '2024-07-29', description: 'Acme Corp', unit: 'Unit 201', amount: 3500.00 },
                { id: 'tx-p2-2', date: '2024-07-28', description: 'Innovate Group', unit: 'Unit 202', amount: 2500.00 },
                { id: 'tx-p2-3', date: '2024-07-18', description: 'Window Cleaning', amount: -400.00 },
                { id: 'tx-p2-4', date: '2024-07-02', description: 'Insurance', amount: -800.00 },
                { date: '2024-07-20', description: 'Common Area Maintenance', amount: -550.00 },
                { date: '2024-07-12', description: 'Legal Fees', amount: -300.00 },
                // June
                { id: 'tx-p2-5', date: '2024-06-29', description: 'Acme Corp', unit: 'Unit 201', amount: 3500.00 },
                { id: 'tx-p2-6', date: '2024-06-28', description: 'Innovate Group', unit: 'Unit 202', amount: 2500.00 },
                { id: 'tx-p2-7', date: '2024-06-10', description: 'Elevator Maintenance', amount: -1200.00 },
                { date: '2024-06-20', description: 'Common Area Maintenance', amount: -550.00 },
                { date: '2024-06-05', description: 'Marketing for Unit 203', amount: -250.00 },
                // May
                { id: 'tx-p2-8', date: '2024-05-29', description: 'Acme Corp', unit: 'Unit 201', amount: 3500.00 },
                { id: 'tx-p2-9', date: '2024-05-28', description: 'Innovate Group', unit: 'Unit 202', amount: 2500.00 },
                { id: 'tx-p2-10', date: '2024-05-05', description: 'Common Area Electricity', amount: -350.00 },
                { date: '2024-05-20', description: 'Common Area Maintenance', amount: -550.00 },
                { date: '2024-05-02', description: 'Insurance', amount: -800.00 },
            ],
            budget: {}
        },
        // ... other properties truncated for brevity but would be here in the full file
    ];

    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredProperties = [...initialProperties];
    let currentProperty = null;
    let incomeData = {};
    let expenseData = {};
    let financialChart = null;

    // =================================================================================
    // DOM ELEMENT SELECTORS
    // =================================================================================
    const listingPage = document.getElementById('listingPage');
    const detailsPage = document.getElementById('detailsPage');
    const propertyTableBody = document.getElementById('propertyTableBody');
    const propertySwitcherInput = document.getElementById('propertySwitcherInput');
    const prevBtn = document.getElementById('prevBtn');
    const prevPropertyBtn = document.getElementById('prevPropertyBtn');
    const nextPropertyBtn = document.getElementById('nextPropertyBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    const backBtn = document.getElementById('backBtn');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const unitsList = document.getElementById('unitsList');
    const activeApplicationsList = document.getElementById('activeApplicationsList');
    const archivedApplicationsList = document.getElementById('archivedApplicationsList');
    const createNewAppBtn = document.getElementById('createNewAppBtn');
    const customModal = document.getElementById('customModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const messagesList = document.getElementById('messagesList');
    const announcementsList = document.getElementById('announcementsList');
    const newMessageBtn = document.getElementById('newMessageBtn');
    const newAnnouncementBtn = document.getElementById('newAnnouncementBtn');
    const openTasksList = document.getElementById('openTasksList');
    const completedTasksList = document.getElementById('completedTasksList');
    const addNewTaskBtn = document.getElementById('addNewTaskBtn');
    const vendorsList = document.getElementById('vendorsList');
    const addNewVendorBtn = document.getElementById('addNewVendorBtn');
    const addPropertyBtn = document.getElementById('addPropertyBtn');
    const setupUnitBtn = document.getElementById('setupUnitBtn');
    const globalSettingsBtn = document.getElementById('globalSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const propertyViewBtn = document.getElementById('property-view-btn');
    const propertyLedgerList = document.getElementById('property-ledger-list');
    const postExpenseBtn = document.getElementById('post-expense-btn');
    const worksheetViewBtn = document.getElementById('worksheet-view-btn');
    const transactionViewBtn = document.getElementById('transaction-view-btn');
    const postExpenseDropdownToggle = document.getElementById('post-expense-dropdown-toggle');
    const postExpenseDropdownMenu = document.getElementById('post-expense-dropdown-menu');
    const postRecurringExpenseBtn = document.getElementById('post-recurring-expense-btn');
    const addPropertyIncomeBtn = document.getElementById('add-property-income-btn');
    const addIncomeDropdownToggle = document.getElementById('add-income-dropdown-toggle');
    const addIncomeDropdownMenu = document.getElementById('add-income-dropdown-menu');
    const addRecurringIncomeBtn = document.getElementById('add-recurring-income-btn');
    const propertySwitcherDropdown = document.getElementById('propertySwitcherDropdown');
    const searchInput = document.getElementById('searchInput');

    // Header Add Expense Dropdown
    const addExpenseDropdownToggle = document.getElementById('add-expense-dropdown-toggle');
    const addExpenseDropdownMenu = document.getElementById('add-expense-dropdown-menu');
    const addRecurringExpenseBtn = document.getElementById('add-recurring-expense-btn');

    // Modal Elements
    const addExpenseModal = document.getElementById('addExpenseModal');
    const addExpenseForm = document.getElementById('addExpenseForm');
    const addExpenseBtn = document.getElementById('addExpenseBtn');

    const addExpenseModalCloseBtn = document.getElementById('addExpenseModalCloseBtn');
    const cancelAddExpenseBtn = document.getElementById('cancelAddExpenseBtn');
    const addIncomeModalCloseBtn = document.getElementById('addIncomeModalCloseBtn');
    const cancelAddIncomeBtn = document.getElementById('cancelAddIncomeBtn');

    // All event listeners and initial setup that require the DOM to be ready go here.

    // =================================================================================
    // HELPER AND UTILITY FUNCTIONS
    // =================================================================================

    const showModal = (title, message) => {
        modalTitle.innerHTML = title;
        modalMessage.innerHTML = message;
        customModal.classList.remove('hidden');
    };

    const hideModal = () => {
        customModal.classList.add('hidden');
    };

    const renderList = (container, items, renderItem, emptyMessage) => {
        container.innerHTML = '';
        if (items && items.length > 0) {
            items.forEach(item => {
                const element = renderItem(item);
                if (element) {
                   container.appendChild(element);
                }
            });
        } else {
            container.innerHTML = `<p class="text-gray-500 p-4 text-center">${emptyMessage}</p>`;
        }
    };

    const createViewButton = (text, iconClass, dataAttribute, dataValue) => {
        const button = document.createElement('button');
        button.className = 'view-btn bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors w-full sm:w-auto mt-2 sm:mt-0';
        button.setAttribute(dataAttribute, dataValue);
        button.innerHTML = `<i class="fas ${iconClass} mr-1"></i> ${text}`;
        return button;
    };

    // =================================================================================
    // CORE APPLICATION LOGIC
    // =================================================================================

    const updatePaginationControls = (properties) => {
        const totalPages = Math.ceil(properties.length / itemsPerPage);
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        pageInfo.textContent = `Page ${totalPages > 0 ? currentPage : 0} of ${totalPages}`;
    };

    const renderTable = (properties) => {
        propertyTableBody.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedProperties = properties.slice(start, end);

        paginatedProperties.forEach(property => {
            const vacantCount = property.units.filter(unit => unit.vacant).length;
            let propertyTypeDisplay = '';
            if (property.units.length === 1 && property.type === 'Residential') {
                propertyTypeDisplay = 'Single Family Home';
            } else if (property.units.length > 1) {
                propertyTypeDisplay = `Multi Unit (${property.units.length})`;
            } else {
                propertyTypeDisplay = property.type;
            }

            const mainRow = document.createElement('tr');
            mainRow.className = 'bg-white font-semibold text-gray-800 hover:bg-gray-100 transition-colors';
            mainRow.setAttribute('data-id', property.id);
            mainRow.innerHTML = `
                <td class="px-4 sm:px-6 py-4">${property.address}</td>
                <td class="px-4 sm:px-6 py-4 hide-on-mobile">${propertyTypeDisplay}</td>
                <td class="px-4 sm:px-6 py-4">
                    <span class="vacant-badge vacant-count">${vacantCount} vacant</span>
                </td>
                <td class="px-4 sm:px-6 py-4 hide-on-mobile">${property.owner}</td>
                <td class="px-4 sm:px-6 py-4">
                    <div class="flex space-x-3">
                        <button data-id="${property.id}" title="Quick View" aria-label="Quick View" class="quick-view-btn text-gray-500 hover:text-blue-600">
                            <i class="fas fa-magnifying-glass"></i>
                        </button>
                        <button data-id="${property.id}" title="View Full Details" aria-label="View Full Details" class="details-btn text-blue-600 hover:text-blue-800">
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </td>
            `;
            propertyTableBody.appendChild(mainRow);
        });

        updatePaginationControls(properties);
    };

    const renderPropertyDetails = (property) => {
        currentProperty = property;
        document.getElementById('propertyOwner').textContent = `Owner: ${property.owner}`;
        propertySwitcherInput.value = property.address;
        populateOverviewTab(property);
    };

    const handlePropertyNavigation = (direction) => {
        if (!currentProperty) return;
        const currentIndex = initialProperties.findIndex(p => p.id === currentProperty.id);
        if (currentIndex === -1) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % initialProperties.length;
        } else {
            newIndex = (currentIndex - 1 + initialProperties.length) % initialProperties.length;
        }
        showDetailsPage(initialProperties[newIndex].id);
    };

    const populatePropertySwitcherDropdown = (filter = '') => {
        propertySwitcherDropdown.innerHTML = '';
        const filtered = initialProperties.filter(p => p.address.toLowerCase().includes(filter.toLowerCase()));

        if (filtered.length === 0) {
            propertySwitcherDropdown.innerHTML = '<div class="p-3 text-sm text-gray-500">No properties found.</div>';
            return;
        }

        filtered.forEach(p => {
            const item = document.createElement('div');
            item.className = 'p-3 text-sm text-gray-800 cursor-pointer hover:bg-indigo-500 hover:text-white';
            item.textContent = p.address;
            item.dataset.propertyId = p.id;
            item.addEventListener('click', () => {
                propertySwitcherInput.value = p.address;
                propertySwitcherDropdown.classList.add('hidden');
                showDetailsPage(p.id);
            });
            propertySwitcherDropdown.appendChild(item);
        });
    };

    const populateOverviewTab = (property) => {
        // KPIs
        const ytdIncome = (property.transactions || []).filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
        const ytdExpense = (property.transactions || []).filter(tx => tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0);
        const pendingAppsCount = (property.applications || []).filter(a => !a.archived).length;
        document.getElementById('kpi-pending-apps').textContent = pendingAppsCount;
        const leasingContentContainer = document.getElementById('leasing-module-content');

        // Helper to create a donut chart for occupancy
        const createDonutChart = (occupied, vacant) => {
            const total = occupied + vacant;
            const occupiedPercent = total > 0 ? (occupied / total) * 100 : 0;
            const vacantPercent = total > 0 ? (vacant / total) * 100 : 0;
            const circumference = 2 * Math.PI * 20; // 2 * pi * radius

            return `
                <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 44 44">
                    <circle class="text-gray-200" stroke-width="4" stroke="currentColor" fill="transparent" r="20" cx="22" cy="22" />
                    <circle class="text-blue-600" stroke-width="4" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference - (occupiedPercent / 100) * circumference}" stroke-linecap="round" stroke="currentColor" fill="transparent" r="20" cx="22" cy="22" />
                </svg>
            `;
        };

        const renderLeasingModuleContent = () => {
            const selectedUnitId = document.getElementById('leasing-module-unit-filter')?.value || 'all';
            const selectedView = document.getElementById('leasing-module-view-filter')?.value || 'occupied';
            leasingContentContainer.innerHTML = ''; // Clear previous content

            if (selectedUnitId === 'all') {
                // leasingViewFilter.classList.remove('hidden');
                const totalUnits = property.units.length;
                const occupiedUnits = property.units.filter(u => !u.vacant);
                const vacantUnits = property.units.filter(u => u.vacant);

                const occupiedPercent = totalUnits > 0 ? Math.round((occupiedUnits.length / totalUnits) * 100) : 0;

                let allUnitsHTML = `
                    <div class="flex items-center justify-around p-2 bg-gray-50 rounded-xl">
                        <div class="relative flex items-center justify-center">
                            ${createDonutChart(occupiedUnits.length, vacantUnits.length)}
                            <div class="absolute flex flex-col items-center justify-center">
                                <span class="text-2xl font-bold text-gray-800">${occupiedPercent}%</span>
                                <span class="text-xs text-gray-500">Occupied</span>
                            </div>
                        </div>
                        <div class="text-sm space-y-2">
                            <p><i class="fas fa-circle text-blue-600 mr-2"></i><span class="font-bold">${occupiedUnits.length}</span> Occupied</p>
                            <p><i class="fas fa-circle text-gray-200 mr-2"></i><span class="font-bold">${vacantUnits.length}</span> Vacant</p>
                        </div>
                    </div>
                    <div id="leasing-filters-container" class="flex justify-end items-center space-x-3 pt-4 border-t mt-4">
                        <select id="leasing-module-view-filter" class="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1">
                            <option value="occupied">Occupied</option>
                            <option value="vacant">Vacant</option>
                        </select>
                        <select id="leasing-module-unit-filter" class="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1">
                            <option value="all">All Units</option>
                            ${property.units.map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
                        </select>
                    </div>
                `;

                if (selectedView === 'occupied') {
                    const expiringLeases = property.units.filter(u => {
                        if (u.vacant || !u.leaseEnd) return false;
                        const leaseEndDate = new Date(u.leaseEnd);
                        // Show all occupied units with an end date
                        return leaseEndDate >= new Date();
                    }).sort((a, b) => new Date(a.leaseEnd) - new Date(b.leaseEnd));

                    allUnitsHTML += `
                        <div class="border-t mt-4 pt-4">
                            <h4 class="text-sm font-semibold text-gray-800 mb-2">Occupied Units (by Lease End Date)</h4>
                    `;
                    if (expiringLeases.length > 0) {
                        allUnitsHTML += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">';
                        expiringLeases.forEach(unit => {
                            allUnitsHTML += `
                            <div class="bg-white p-3 rounded-md shadow-sm border">
                                <h5 class="font-medium text-gray-800"><i class="fas fa-user-tie text-blue-500 mr-2"></i>${unit.tenant}</h5>
                                <p class="text-sm text-gray-500">Unit: ${unit.name}</p>
                                <div class="mt-2 flex justify-between items-center">
                                    <span class="text-sm text-gray-600">Ends: ${new Date(unit.leaseEnd).toLocaleDateString()}</span>
                                    <a href="#" class="renew-lease-link text-blue-600 hover:underline text-xs font-semibold" data-unit-id="${unit.id}">Renew</a>
                                </div>
                            </div>
                        `;
                        });
                        allUnitsHTML += '</div>';
                    } else {
                        allUnitsHTML += '<p class="text-sm text-gray-500">No occupied units with active leases.</p>';
                    }
                    allUnitsHTML += '</div>';
                } else { // selectedView === 'vacant'
                    allUnitsHTML += `
                        <div class="border-t mt-4 pt-4">
                            <h4 class="text-sm font-semibold text-gray-800 mb-2">Vacant Units</h4>
                    `;
                    if (vacantUnits.length > 0) {
                        allUnitsHTML += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">';
                        vacantUnits.forEach(unit => {
                            allUnitsHTML += `
                                <div class="bg-white p-3 rounded-md shadow-sm border">
                                    <h5 class="font-medium text-gray-800"><i class="fas fa-door-open text-yellow-500 mr-2"></i>${unit.name}</h5>
                                    <p class="text-sm text-gray-500">Type: ${unit.type}</p>
                                    <div class="mt-2 flex justify-between items-center">
                                        <span class="text-sm text-gray-600">Market Rent: $${(unit.marketRent || 0).toLocaleString()}</span>
                                        <a href="#" class="vacancy-link text-purple-600 hover:underline text-xs font-semibold" data-unit-id="${unit.id}">List Vacancy</a>
                                    </div>
                                </div>
                            `;
                        });
                        allUnitsHTML += '</div>';
                    } else {
                        allUnitsHTML += '<p class="text-sm text-gray-500">No vacant units.</p>';
                    }
                    allUnitsHTML += '</div>';
                }

                leasingContentContainer.innerHTML = allUnitsHTML;

                // Set the selected values on the newly created dropdowns
                document.getElementById('leasing-module-view-filter').value = selectedView;
                document.getElementById('leasing-module-unit-filter').value = selectedUnitId;

                // Re-attach event listeners
                document.getElementById('leasing-module-unit-filter').addEventListener('change', renderLeasingModuleContent);
                document.getElementById('leasing-module-view-filter').addEventListener('change', renderLeasingModuleContent);
            } else {
                const unit = property.units.find(u => u.id === selectedUnitId);
                if (!unit) return;

                let unitDetailHTML = `<div class="p-4 bg-gray-50 rounded-xl text-center">`;
                if (unit.vacant) {
                    unitDetailHTML += `
                        <i class="fas fa-door-open text-4xl text-yellow-500 mb-2"></i>
                        <p class="font-semibold text-gray-800">Currently Vacant</p>
                        <p class="text-sm text-gray-500">Market Rent: $${(unit.marketRent || 0).toLocaleString()}</p>
                        <button class="mt-3 text-sm bg-purple-100 text-purple-700 font-semibold py-1 px-3 rounded-full hover:bg-purple-200 transition">List Vacancy</button>
                    `;
                } else {
                    // When a single unit is selected, we still need the "All Units" dropdown to go back
                    unitDetailHTML = `
                        <div class="flex justify-end items-center space-x-3 mb-4">
                             <select id="leasing-module-unit-filter" class="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1">
                                <option value="all">All Units</option>
                                ${property.units.map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
                            </select>
                        </div>
                    `;

                    const leaseStartDate = new Date(unit.leaseStart);
                    const leaseEndDate = new Date(unit.leaseEnd);
                    const today = new Date();
                    const totalDuration = leaseEndDate - leaseStartDate;
                    const elapsedDuration = today - leaseStartDate;
                    const progress = Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));

                    const status = leaseStartDate > today ? 'Future Tenant' : 'Active';
                    const statusColor = status === 'Active' ? 'text-green-600' : 'text-blue-600';

                    unitDetailHTML += `
                        <div class="p-3 bg-gray-50 rounded-lg border">
                            <p class="text-md font-semibold text-gray-900">${unit.tenant}</p>
                            <p class="text-sm font-medium ${statusColor}">${status} Tenant</p>
                            <p class="text-xs text-gray-500 mt-1">Lease: ${leaseStartDate.toLocaleDateString()} - ${leaseEndDate.toLocaleDateString()}</p>
                        </div>
                        <div class="mt-4">
                            <h4 class="text-sm font-semibold text-gray-700 mb-1">Lease Progress</h4>
                            <div class="w-full bg-gray-200 rounded-full h-2.5">
                                <div class="bg-green-500 h-2.5 rounded-full" style="width: ${progress}%"></div>
                            </div>
                        </div>
                    `;
                }
                unitDetailHTML += `</div>`;
                leasingContentContainer.innerHTML = unitDetailHTML;
                // Set the selected value and add listener for the single unit view
                const unitFilter = document.getElementById('leasing-module-unit-filter');
                unitFilter.value = selectedUnitId;
                unitFilter.addEventListener('change', renderLeasingModuleContent);
            }
        };
        renderLeasingModuleContent();
        
        // Recent Transactions
        const recentTransactionsList = document.getElementById('recent-transactions-list');
        const recentTransactions = (property.transactions || []).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

        renderList(recentTransactionsList, recentTransactions, (tx) => {
            const el = document.createElement('div');
            el.className = 'recent-tx-item text-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded-md';
            el.dataset.transactionId = tx.id;
            const amountClass = tx.amount >= 0 ? 'text-green-600' : 'text-red-600';
            const formattedAmount = `${tx.amount < 0 ? '-' : ''}$${Math.abs(tx.amount).toFixed(2)}`;

            el.innerHTML = `
                <div>
                    <p class="font-semibold text-gray-800">${tx.description}</p>
                    <p class="text-xs text-gray-500">${new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <p class="font-bold ${amountClass}">${formattedAmount}</p>
            `;
            return el;

        }, 'No recent transactions.');

        // Open Tasks
        const taskUnitFilter = document.getElementById('overview-task-unit-filter');
        taskUnitFilter.innerHTML = '<option value="all">All Units</option>';
        property.units.forEach(u => {
            const option = document.createElement('option');
            option.value = u.name;
            option.textContent = u.name;
            taskUnitFilter.appendChild(option);
        });

        const renderOpenTasks = () => {
            const openTasksOverviewList = document.getElementById('open-tasks-overview-list');
            const selectedUnit = taskUnitFilter.value;
            const allOpenTasks = (property.tasks || []).filter(t => t.status === 'open');
            
            const filteredTasks = allOpenTasks.filter(task => {
                if (selectedUnit === 'all') return true;
                return task.unit === selectedUnit; // When a specific unit is selected, only show tasks for that unit.
            });

            renderList(openTasksOverviewList, filteredTasks, (task) => {
                const el = document.createElement('div');
                el.className = 'bg-white p-3 rounded-md shadow-sm border border-gray-200';

                const priorityMap = {
                    'High': { icon: 'fa-exclamation-circle', color: 'text-red-500' },
                    'Medium': { icon: 'fa-minus-circle', color: 'text-yellow-500' },
                    'Low': { icon: 'fa-info-circle', color: 'text-blue-500' }
                };
                const priorityInfo = priorityMap[task.priority] || priorityMap['Medium']; // Default to Medium
                const unitDisplay = task.unit ? `for <strong>${task.unit}</strong>` : 'for the property';

                el.innerHTML = `
                    <div class="flex items-start justify-between">
                        <p class="font-semibold text-gray-800 text-sm pr-2">${task.description}</p>
                        <i class="fas ${priorityInfo.icon} ${priorityInfo.color}" title="Priority: ${task.priority}"></i>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                        <i class="fas fa-building mr-1"></i> ${unitDisplay}
                    </p>
                    <div class="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                        <div class="text-xs text-gray-500">
                            <i class="fas fa-calendar-alt mr-1"></i> Due: ${task.dueDate}
                        </div>
                        <button class="view-task-btn text-blue-600 hover:underline text-xs font-semibold" data-task-id="${task.id}">View Details</button>
                    </div>
                `;
                return el;
            }, 'No open tasks for this filter.');
        };
        renderOpenTasks();
        taskUnitFilter.addEventListener('change', renderOpenTasks);

        // NEW: Populate Owner Module
        const ownersListContainer = document.getElementById('property-owners-list');
        const propertyOwners = property.owners || [{ name: property.owner, percentage: 100 }]; // Fallback to single owner
        const totalIncome = (property.transactions || [])
            .filter(tx => tx.amount > 0)
            .reduce((sum, tx) => sum + tx.amount, 0);

        renderList(ownersListContainer, propertyOwners, (owner) => {
            const el = document.createElement('div');
            el.className = 'flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 rounded-lg border';
            
            const paymentDue = totalIncome * (owner.percentage / 100);

            el.innerHTML = `
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center">
                        <span class="font-bold text-lg">${owner.name.charAt(0)}</span>
                    </div>
                    <div class="ml-4">
                        <p class="text-md font-semibold text-gray-900">${owner.name}</p>
                        <p class="text-sm text-gray-500">Ownership: ${owner.percentage}%</p>
                    </div>
                </div>
                <div class="flex items-center mt-3 sm:mt-0 w-full sm:w-auto justify-between">
                    <div class="text-left sm:text-right mr-4">
                        <p class="text-sm text-gray-500">Payment Due</p>
                        <p class="text-lg font-bold text-green-600">$${paymentDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <a href="#" class="pay-owner-link bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap">Pay Owner</a>
                </div>
            `;
            return el;
        }, 'No owner information available.');
    };

    const renderFinancialChart = (property) => {
        const container = document.getElementById('financialSummaryContainer');
        container.innerHTML = '';

        if (financialChart) {
            financialChart.destroy();
            financialChart = null;
        }

        const transactions = property.transactions || [];
        const months = [];
        const today = new Date();

        for (let i = 2; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push({
                name: d.toLocaleString('default', { month: 'short' }),
                month: d.getMonth(),
                year: d.getFullYear(),
                income: 0,
                expense: 0
            });
        }

        transactions.forEach(tx => {
            const txDate = new Date(tx.date);
            const monthData = months.find(m => m.month === txDate.getMonth() && m.year === txDate.getFullYear());
            if (monthData) {
                if (tx.amount >= 0) {
                    monthData.income += tx.amount;
                } else {
                    monthData.expense += Math.abs(tx.amount);
                }
            }
        });

        // Calculate YTD totals
        const currentYear = today.getFullYear();
        const ytdTransactions = transactions.filter(tx => new Date(tx.date).getFullYear() === currentYear);
        const ytdIncome = ytdTransactions
            .filter(tx => tx.amount > 0)
            .reduce((sum, tx) => sum + tx.amount, 0);
        const ytdExpense = ytdTransactions
            .filter(tx => tx.amount < 0)
            .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
        const ytdNetIncome = ytdIncome - ytdExpense;

        const netIncomes = months.map(m => m.income - m.expense);

        const formatCurrency = (value) => {
            return `${value < 0 ? '-' : ''}$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        };

        const createCell = (value, type, monthIndex, isYTD = false) => {
            if (value === 0) return `<td class="py-3 px-4 text-right text-sm text-gray-500">${formatCurrency(value)}</td>`;
            
            const month = isYTD ? null : months[monthIndex].month;
            const year = isYTD ? currentYear : months[monthIndex].year;
            const colorClass = type === 'income' ? 'text-green-600' : (type === 'expense' ? 'text-red-600' : (value >= 0 ? 'text-gray-900' : 'text-red-600'));
            const fontWeight = type === 'net' || isYTD ? 'font-bold' : '';

            return `<td class="py-3 px-4 text-right text-sm ${fontWeight} ${colorClass}"><a href="#" class="hover:underline financial-detail-link" data-type="${type}" data-month="${month}" data-year="${year}" data-is-ytd="${isYTD}">${formatCurrency(value)}</a></td>`;
        };

        let tableHTML = `
            <div class="overflow-x-auto">
                <table id="financial-summary-table" class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr class="border-b">
                            <th class="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                            ${months.map(m => `<th class="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">${m.name}</th>`).join('')}
                            <th class="py-3 px-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border-l">YTD</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr>
                            <td class="py-3 px-4 text-sm font-medium text-gray-800">Income</td>
                            ${months.map((m, i) => createCell(m.income, 'income', i)).join('')}
                            ${createCell(ytdIncome, 'income', null, true)}
                        </tr>
                        <tr>
                            <td class="py-3 px-4 text-sm font-medium text-gray-800">Expense</td>
                            ${months.map((m, i) => createCell(m.expense > 0 ? -m.expense : 0, 'expense', i)).join('')}
                            ${createCell(ytdExpense > 0 ? -ytdExpense : 0, 'expense', null, true)}
                        </tr>
                        <tr class="bg-gray-50 font-bold">
                            <td class="py-2 px-4 text-sm text-gray-900">Net Income</td>
                            ${netIncomes.map((ni, i) => createCell(ni, 'net', i)).join('')}
                            ${createCell(ytdNetIncome, 'net', null, true)}
                        </tr>
                    </tbody>
                </table>
            </div>`;
        
        container.className = "h-auto";
        container.innerHTML = tableHTML + `
            <div class="text-right mt-4">
                <a href="#" id="financial-summary-detail-view" class="text-sm font-medium text-blue-600 hover:underline">
                    Detail View <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
        `;

        const summaryTable = document.getElementById('financial-summary-table');
        if (summaryTable) {
            summaryTable.addEventListener('click', (e) => {
                const link = e.target.closest('.financial-detail-link');
                if (link) {
                    e.preventDefault();
                    const { type, month, year, isYtd } = link.dataset;
                    showFinancialDetailModal(type, parseInt(month), parseInt(year), isYtd === 'true');
                }
            });
        }

        document.getElementById('financial-summary-detail-view').addEventListener('click', (e) => { e.preventDefault(); switchTab('units'); });
    };

    const refreshCurrentWorksheetView = () => {
        if (!currentProperty) return;
        const worksheetBtn = document.getElementById('worksheet-view-btn');
        // Check which view is active and re-render it
        if (worksheetBtn.classList.contains('border-indigo-500')) {
            renderPropertyLedger(currentProperty);
        } else {
            renderTransactionListView(currentProperty);
        }
    };

    const switchToView = (view) => {
        const worksheetContainer = document.getElementById('worksheet-view-container');
        const transactionContainer = document.getElementById('transaction-view-container');
        const worksheetBtn = document.getElementById('worksheet-view-btn');
        const worksheetSummaryContainer = document.getElementById('worksheet-summary-container');
        const transactionBtn = document.getElementById('transaction-view-btn');
        const toggleDetailViewBtn = document.getElementById('toggle-detail-view-btn');

        if (view === 'worksheet') { // This is the summary view
            worksheetContainer.classList.remove('hidden');
            transactionContainer.classList.add('hidden');
            toggleDetailViewBtn.classList.remove('hidden');
            worksheetBtn.classList.add('border-indigo-500', 'text-indigo-600');
            worksheetBtn.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
            transactionBtn.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
            transactionBtn.classList.remove('border-indigo-500', 'text-indigo-600');
            renderPropertyLedger(currentProperty); // Render the summary table
        } else { // This is the transaction list view, which the user calls "Transaction List"
            closeWorksheetDetailView(); // Ensure detail view is closed when switching away
            worksheetContainer.classList.add('hidden');
            transactionContainer.classList.remove('hidden');
            transactionBtn.classList.add('border-indigo-500', 'text-indigo-600');
            transactionBtn.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
            worksheetBtn.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
            worksheetBtn.classList.remove('border-indigo-500', 'text-indigo-600');
            renderTransactionListView(currentProperty);
        }
    };

    const renderTransactionListView = (property) => {
        const transactionContainer = document.getElementById('transaction-view-container');
        const unitFilter = document.getElementById('unit-ledger-filter');
        const selectedUnitName = unitFilter.value;

        if (!property || !property.transactions || property.transactions.length === 0) {
            transactionContainer.innerHTML = '<p class="p-4 text-center text-gray-500">No transactions for this property.</p>';
            return;
        }

        // 1. Calculate running balance for ALL transactions first to get it right
        const allTransactionsSorted = [...property.transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        const totalTransactionSum = allTransactionsSorted.reduce((sum, tx) => sum + tx.amount, 0);
        const startingBalance = property.balance - totalTransactionSum;

        let currentBalance = startingBalance;
        allTransactionsSorted.forEach(tx => {
            currentBalance += tx.amount;
            tx.runningBalance = currentBalance;
        });

        // 2. Filter transactions based on the selected unit
        const filteredTransactions = allTransactionsSorted.filter(tx => {
            if (selectedUnitName === 'all') return true;
            // Show transactions for the specific unit OR property-level transactions (unit is null)
            return tx.unit === selectedUnitName || tx.unit === null;
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort descending for display

        if (filteredTransactions.length === 0) {
            transactionContainer.innerHTML = '<p class="p-4 text-center text-gray-500">No transactions for this unit.</p>';
            return;
        }

        const formatCurrency = (value) => `${value < 0 ? '-' : ''}$${Math.abs(value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

        // 3. Build the HTML table
        let tableHTML = `
            <div class="overflow-x-auto border rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                            <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Expense</th>
                            <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                            <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${filteredTransactions.map(tx => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${new Date(tx.date).toLocaleDateString()}</td>
                                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">${tx.description}</td>
                                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${tx.unit || 'Property'}</td>
                                <td class="px-4 py-3 whitespace-nowrap text-sm text-red-600 text-right">${tx.amount < 0 ? formatCurrency(tx.amount) : '-'}</td>
                                <td class="px-4 py-3 whitespace-nowrap text-sm text-green-600 text-right">${tx.amount > 0 ? formatCurrency(tx.amount) : '-'}</td>
                                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right font-semibold">${formatCurrency(tx.runningBalance)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        transactionContainer.innerHTML = tableHTML;
    };

    const renderPropertyLedger = (property) => {
        const unitFilter = document.getElementById('unit-ledger-filter');
        const selectedUnitName = unitFilter.value;
        const worksheetSummaryContainer = document.getElementById('worksheet-summary-container');

        if (!property || !property.transactions || property.transactions.length === 0) {
            worksheetSummaryContainer.innerHTML = '<p class="p-4 text-center text-gray-500">No transactions for this property.</p>';
            return;
        }

        // --- START: New Summary View Logic ---
        // Determine the most recent transaction date to make the view dynamic
        const latestTransactionDate = property.transactions.reduce((latest, tx) => {
            const txDate = new Date(tx.date);
            return txDate > latest ? txDate : latest;
        }, new Date(0));
        const months = getWorksheetMonths();

        const transactions = property.transactions.filter(tx => {
            if (selectedUnitName !== 'all' && tx.unit !== selectedUnitName && tx.unit !== null) {
                return false;
            }
            const txDate = new Date(tx.date);
            return months.some(m => m.month === txDate.getMonth() && m.year === txDate.getFullYear());
        }).sort((a, b) => new Date(a.date) - new Date(b.date));

        if (transactions.length === 0) {
            worksheetSummaryContainer.innerHTML = '<p class="p-4 text-center text-gray-500">No transactions in the last 3 months.</p>';
            return;
        }

        const incomeByCat = {};
        const expenseByCat = {};
        const monthlyTotals = months.map(() => ({ income: 0, expense: 0 }));

        transactions.forEach(tx => {
            const txDate = new Date(tx.date);
            const monthIndex = months.findIndex(m => m.month === txDate.getMonth() && m.year === txDate.getFullYear());
            if (monthIndex === -1) return;

            let category = tx.description;
            // Group rent payments by tenant/unit
            if (tx.description.toLowerCase().includes('rent') && tx.unit) {
                const tenant = property.tenants.find(t => t.unit === tx.unit);
                category = tenant ? `${tenant.name} (${tx.unit})` : `${tx.unit} - Rent`;
            }

            if (tx.amount > 0) {
                if (!incomeByCat[category]) incomeByCat[category] = months.map(() => 0);
                incomeByCat[category][monthIndex] += tx.amount;
                monthlyTotals[monthIndex].income += tx.amount;
            } else {
                if (!expenseByCat[category]) expenseByCat[category] = months.map(() => 0);
                expenseByCat[category][monthIndex] += Math.abs(tx.amount);
                monthlyTotals[monthIndex].expense += Math.abs(tx.amount);
            }
        });

        const formatCurrency = (value) => value === 0 ? '-' : `$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

        const createRow = (label, values, isBold = false, isSub = false) => {
            const labelClass = isBold ? 'font-bold text-gray-800' : (isSub ? 'pl-4 text-gray-600' : 'font-medium text-gray-700');
            const valueClass = isBold ? 'font-bold text-gray-800' : 'text-blue-600 hover:underline cursor-pointer';
            const cells = values.map((v, index) => {
                if (isBold || v === 0) {
                    // Not clickable for total rows or zero values
                    return `<td class="py-2 px-4 text-right text-sm ${isBold ? 'font-bold text-gray-800' : 'text-gray-600'}">${formatCurrency(v)}</td>`;
                } else {
                    // Clickable amount for drill-down
                    return `<td class="py-2 px-4 text-right text-sm"><a href="#" class="worksheet-drilldown ${valueClass}" data-category="${label}" data-month-index="${index}">${formatCurrency(v)}</a></td>`;
                }
            }).join('');
            return `<tr><td class="py-2 px-4 text-left text-sm ${labelClass}">${label}</td>${cells}</tr>`;
        };


        let tableHTML = `
            <table class="min-w-full">
                <thead class="bg-gray-50">
                    <tr class="border-b">
                        <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        ${months.map(m => `<th class="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">${m.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
        `;

        // Income Rows
        tableHTML += `<tr><td colspan="${months.length + 1}" class="pt-4 pb-1 px-4 text-left text-lg font-semibold text-green-700">Income</td></tr>`;
        const rentCategories = Object.keys(incomeByCat).filter(cat => cat.toLowerCase().includes('rent') || property.tenants.some(t => cat.startsWith(t.name)));
        if (rentCategories.length > 0) {
            tableHTML += createRow('Rent Income', [], true);
            rentCategories.forEach(cat => {
                tableHTML += createRow(cat, incomeByCat[cat], false, true);
            });
        }

        const otherIncomeCategories = Object.keys(incomeByCat).filter(cat => !rentCategories.includes(cat));
        if (otherIncomeCategories.length > 0) {
            tableHTML += createRow('Other Income', [], true);
            otherIncomeCategories.forEach(cat => {
                tableHTML += createRow(cat, incomeByCat[cat], false, true);
            });
        }
        tableHTML += createRow('Total Income', monthlyTotals.map(t => t.income), true);

        // Spacer
        tableHTML += `<tr><td colspan="${months.length + 1}" class="py-2"></td></tr>`;

        // Expense Rows
        tableHTML += `<tr><td colspan="${months.length + 1}" class="pt-2 pb-1 px-4 text-left text-lg font-semibold text-red-700">Expenses</td></tr>`;
        Object.keys(expenseByCat).sort().forEach(cat => {
            tableHTML += createRow(cat, expenseByCat[cat], false, false);
        });
        tableHTML += createRow('Total Expenses', monthlyTotals.map(t => t.expense), true);

        // Net Income
        const netIncomes = monthlyTotals.map(t => t.income - t.expense);
        tableHTML += `<tr class="bg-gray-100">`;
        tableHTML += createRow('Net Income', netIncomes, true);
        tableHTML += `</tr>`;

        tableHTML += `</tbody></table>`;

        worksheetSummaryContainer.innerHTML = tableHTML;
        // --- END: New Summary View Logic ---
    };

    if (worksheetViewBtn) worksheetViewBtn.addEventListener('click', () => switchToView('worksheet'));
    if (transactionViewBtn) transactionViewBtn.addEventListener('click', () => switchToView('transaction'));
    
    // Function to handle search and filtering
    const handleSearch = () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredProperties = initialProperties.filter(property => {
            const matchesProperty = property.address.toLowerCase().includes(searchTerm) ||
                                   property.owner.toLowerCase().includes(searchTerm);
            const newTypeLabel = property.units.length === 1 && property.type === 'Residential' ? 'single family home' : `multi unit (${property.units.length})`;
            const matchesTypeLabel = newTypeLabel.includes(searchTerm);
            const matchesUnit = property.units.some(unit => 
                unit.name.toLowerCase().includes(searchTerm) ||
                unit.type.toLowerCase().includes(searchTerm)
            );
            return matchesProperty || matchesTypeLabel || matchesUnit;
        });
        currentPage = 1;
        renderTable(filteredProperties);
    }; 

    // --- Add Expense Modal Logic ---
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseAllocationPreview = document.getElementById('expense-allocation-preview');
    const saveAddExpenseBtn = document.getElementById('saveAddExpenseBtn');
    const expensePropertyTab = document.getElementById('expense-property-tab');
    const expenseUnitTab = document.getElementById('expense-unit-tab');
    const expenseUnitWiseSection = document.getElementById('expense-unit-wise-section');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseNameSuggestions = document.getElementById('expense-name-suggestions');

    const openAddExpenseModal = (preselectedUnitId = null, selectAll = false) => {
        addExpenseForm.reset();
        document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
        expenseNameSuggestions.classList.add('hidden');
        
        // Populate vendor dropdown
        const vendorSelect = document.getElementById('expense-vendor');
        vendorSelect.innerHTML = '<option value="">Select a vendor...</option>';
        if (currentProperty && currentProperty.vendors) {
            currentProperty.vendors.forEach(vendor => {
                const option = document.createElement('option');
                option.value = vendor.name;
                option.textContent = vendor.name;
                vendorSelect.appendChild(option);
            });
        }

        // Always default to the Property Wise tab on open
        switchExpenseTab('property');

        updateExpenseAllocationPreview();
        addExpenseModal.classList.remove('hidden');
    };

    const switchExpenseTab = (tab) => {
        if (tab === 'unit') {
            expenseUnitTab.className = 'expense-type-tab whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-red-500 text-red-600';
            expensePropertyTab.className = 'expense-type-tab whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
            expenseUnitWiseSection.classList.remove('hidden');
            populateUnitSelectorForExpense();
        } else { // 'property' tab
            expensePropertyTab.className = 'expense-type-tab whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-red-500 text-red-600';
            expenseUnitTab.className = 'expense-type-tab whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
            expenseUnitWiseSection.classList.add('hidden');
        }
        updateExpenseAllocationPreview();
    };

    const populateUnitSelectorForExpense = (preselectedUnitId = null, selectAll = false) => {
        const unitMultiselect = document.getElementById('expense-unit-multiselect');
        unitMultiselect.innerHTML = '';
        if (currentProperty && currentProperty.units.length > 0) {
            currentProperty.units.forEach(u => {
                const isChecked = selectAll || (u.id === preselectedUnitId);
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'flex items-center';
                checkboxDiv.innerHTML = `
                    <input id="unit-expense-${u.id}" type="checkbox" value="${u.id}" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 unit-expense-checkbox" ${isChecked ? 'checked' : ''}>
                    <label for="unit-expense-${u.id}" class="ml-3 block text-sm text-gray-800">${u.name} ${u.vacant ? '(Vacant)' : `(${u.tenant})`}</label>
                `;
                unitMultiselect.appendChild(checkboxDiv);
            });
        }
        document.querySelectorAll('.unit-expense-checkbox').forEach(cb => cb.addEventListener('change', updateExpenseAllocationPreview));
        document.getElementById('expense-unit-select-all').checked = selectAll;
        document.getElementById('expense-unit-select-all').addEventListener('change', (e) => {
            document.querySelectorAll('.unit-expense-checkbox').forEach(cb => cb.checked = e.target.checked);
            updateExpenseAllocationPreview();
        });
    };

    const closeAddExpenseModal = () => {
        addExpenseModal.classList.add('hidden');
        expenseNameSuggestions.classList.add('hidden');
    };

    const updateExpenseAllocationPreview = () => {
        const totalAmount = parseFloat(expenseAmountInput.value) || 0;
        expenseAllocationPreview.innerHTML = '';
        saveAddExpenseBtn.disabled = true;

        // Allocation preview is only for Unit Wise tab
        if (expenseUnitWiseSection.classList.contains('hidden')) {
            saveAddExpenseBtn.disabled = totalAmount <= 0;
            return;
        }

        const selectedUnitIds = Array.from(document.querySelectorAll('.unit-expense-checkbox:checked')).map(cb => cb.value);
        if (selectedUnitIds.length === 0 || totalAmount <= 0) {
            expenseAllocationPreview.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-500">Select one or more units and enter an amount to see the allocation.</td></tr>';
            return;
        }

        const allSelectedUnits = currentProperty.units.filter(u => selectedUnitIds.includes(u.id));

        if (allSelectedUnits.length === 0) {
            expenseAllocationPreview.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-gray-500">No units selected.</td></tr>`;
            return;
        }

        let allocations = [];
        // For now, we just distribute evenly. The user did not specify other methods.
        const amountPerUnit = totalAmount / allSelectedUnits.length;
        allocations = allSelectedUnits.map(unit => ({ ...unit, allocatedAmount: amountPerUnit }));

        allocations.forEach(unit => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-4 py-3 text-sm text-gray-800">${unit.name}</td>
                <td class="px-4 py-3 text-sm text-gray-500">${unit.tenant || 'N/A'}</td>
                <td class="px-4 py-3 text-sm text-gray-800 text-right font-medium">$${unit.allocatedAmount.toFixed(2)}</td>
            `;
            expenseAllocationPreview.appendChild(row);
        });

        saveAddExpenseBtn.disabled = false;
    };

    // addExpenseBtn is handled above
    if (addExpenseModalCloseBtn) addExpenseModalCloseBtn.addEventListener('click', closeAddExpenseModal);
    if (cancelAddExpenseBtn) cancelAddExpenseBtn.addEventListener('click', closeAddExpenseModal);
    
    if (expensePropertyTab) expensePropertyTab.addEventListener('click', () => switchExpenseTab('property'));
    if (expenseUnitTab) expenseUnitTab.addEventListener('click', () => switchExpenseTab('unit'));

    if (expenseAmountInput) expenseAmountInput.addEventListener('input', updateExpenseAllocationPreview);

    const commonExpenseNames = ['Landscaping', 'Plumbing Repair', 'General Maintenance', 'Utilities (Water/Sewer)', 'Pest Control', 'Insurance', 'Taxes', 'Mortgage', 'Repairs'];
    expenseNameInput.addEventListener('input', () => {
        const inputText = expenseNameInput.value.toLowerCase();
        if (inputText.length === 0) {
            expenseNameSuggestions.classList.add('hidden');
            return;
        }
        const filtered = commonExpenseNames.filter(name => name.toLowerCase().includes(inputText));
        expenseNameSuggestions.innerHTML = '';
        if (filtered.length > 0) {
            filtered.forEach(suggestion => {
                const div = document.createElement('div');
                div.textContent = suggestion;
                div.className = 'p-2 cursor-pointer hover:bg-gray-100';
                div.onclick = () => {
                    expenseNameInput.value = suggestion;
                    expenseNameSuggestions.classList.add('hidden');
                };
                expenseNameSuggestions.appendChild(div);
            });
            expenseNameSuggestions.classList.remove('hidden');
        } else {
            expenseNameSuggestions.classList.add('hidden');
        }
    });

    if (addExpenseForm) addExpenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = document.getElementById('expense-name').value;
        showModal('Expense Added', `The expense for "${description}" has been successfully posted.`);
        closeAddExpenseModal();
    });

    // --- Worksheet Add Expense Dropdown Logic ---
    if (postExpenseBtn) postExpenseBtn.addEventListener('click', () => {
        const unitFilter = document.getElementById('unit-ledger-filter');
        const selectedUnitName = unitFilter.value;
        let preselectedUnitId = null, selectAll = false;
    
        if (selectedUnitName && currentProperty) {
            if (selectedUnitName === 'all') {
                selectAll = true;
            } else {
                const unit = currentProperty.units.find(u => u.name === selectedUnitName);
                if (unit) preselectedUnitId = unit.id;
            }
        }
        openAddExpenseModal(preselectedUnitId, selectAll);
    });
    
    if (postExpenseDropdownToggle) postExpenseDropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        postExpenseDropdownMenu.classList.toggle('hidden');
    });
    
    if (postRecurringExpenseBtn) postRecurringExpenseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('Coming Soon', 'Adding recurring expenses from the worksheet will be available in a future update.');
        postExpenseDropdownMenu.classList.add('hidden');
    });

    // --- Header Add Expense Button ---
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', () => openAddExpenseModal());
    }
    const addIncomeForm = document.getElementById('addIncomeForm');
    const addIncomeModal = document.getElementById('addIncomeModal');
    const incomeFileName = document.getElementById('income-file-name');
    const incomeNameInput = document.getElementById('income-name');
    const incomeNameSuggestions = document.getElementById('income-name-suggestions');
    const incomeUnitSelectorContainer = document.getElementById('income-unit-selector-container');
    const incomePropertyTab = document.getElementById('income-property-tab');
    const incomeUnitTab = document.getElementById('income-unit-tab');
    const incomeUnitSelector = document.getElementById('income-unit-selector');
    const toggleAutoAllocationContainer = document.getElementById('toggle-auto-allocation-container');
    const toggleSendReceiptContainer = document.getElementById('toggle-send-receipt-container');

    const updateIncomeModalToggles = () => {
        const incomeName = incomeNameInput.value;
        const tenantNames = currentProperty ? currentProperty.tenants.map(t => t.name) : [];
        const isTenant = tenantNames.includes(incomeName);

        toggleAutoAllocationContainer.classList.toggle('hidden', !isTenant);
        toggleSendReceiptContainer.classList.toggle('hidden', !isTenant);
    };

    const openAddIncomeModal = (preselectedUnitName = null) => {
        addIncomeForm.reset();
        incomeFileName.textContent = '';
        document.getElementById('income-date').value = new Date().toISOString().split('T')[0];

        // Default to property level tab
        switchIncomeTab('property');
        incomeUnitSelectorContainer.classList.add('hidden');

        updateIncomeModalToggles(); // Reset toggles based on empty input
        addIncomeModal.classList.remove('hidden');
        incomeNameInput.focus();
    };

    const closeAddIncomeModal = () => {
        incomeNameSuggestions.classList.add('hidden');
        addIncomeModal.classList.add('hidden');
    };

    const getIncomeSuggestions = () => {
        if (!currentProperty) return [];
        const tenantNames = currentProperty.tenants.map(t => t.name);
        const otherIncomes = ['Parking Income', 'Laundry Income', 'Late Fees', 'Application Fees', 'Pet Fees'];
        return [...new Set([...tenantNames, ...otherIncomes])]; // Use Set to remove duplicates
    };

    incomeNameInput.addEventListener('input', () => {
        const inputText = incomeNameInput.value.toLowerCase();
        updateIncomeModalToggles(); // Update toggles as user types
        const suggestions = getIncomeSuggestions();
        
        if (inputText.length === 0) {
            incomeNameSuggestions.classList.add('hidden');
            return;
        }

        const filteredSuggestions = suggestions.filter(s => s.toLowerCase().includes(inputText));
        
        incomeNameSuggestions.innerHTML = '';
        if (filteredSuggestions.length > 0) {
            filteredSuggestions.forEach(suggestion => {
                const div = document.createElement('div');
                div.textContent = suggestion;
                div.className = 'p-2 cursor-pointer hover:bg-gray-100';
                div.onclick = () => {
                    incomeNameInput.value = suggestion;
                    incomeNameSuggestions.classList.add('hidden');
                    updateIncomeModalToggles(); // Update toggles when a suggestion is clicked
                };
                incomeNameSuggestions.appendChild(div);
            });
            incomeNameSuggestions.classList.remove('hidden');
        } else {
            incomeNameSuggestions.classList.add('hidden');
        }
    });

    const switchIncomeTab = (tab) => {
        if (tab === 'unit') {
            incomeUnitTab.className = 'income-type-tab whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-green-500 text-green-600';
            incomePropertyTab.className = 'income-type-tab whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
            incomeUnitSelectorContainer.classList.remove('hidden');
            // Populate the unit selector when switching to this tab
            incomeUnitSelector.innerHTML = '';
            if (currentProperty && currentProperty.units) {
                currentProperty.units.forEach(unit => {
                    const option = document.createElement('option');
                    option.value = unit.name;
                    option.textContent = `${unit.name} ${unit.vacant ? '(Vacant)' : `- ${unit.tenant}`}`;
                    incomeUnitSelector.appendChild(option);
                });
            }
            incomeUnitSelector.value = incomeUnitSelector.options[0]?.value || '';
        } else { // 'property' tab
            incomePropertyTab.className = 'income-type-tab whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-green-500 text-green-600';
            incomeUnitTab.className = 'income-type-tab whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
            incomeUnitSelectorContainer.classList.add('hidden');
        }
    };

    if (incomePropertyTab) incomePropertyTab.addEventListener('click', () => switchIncomeTab('property'));
    if (incomeUnitTab) incomeUnitTab.addEventListener('click', () => switchIncomeTab('unit'));

    // Event listeners for income modal
    if (addIncomeModalCloseBtn) addIncomeModalCloseBtn.addEventListener('click', closeAddIncomeModal);
    if (cancelAddIncomeBtn) cancelAddIncomeBtn.addEventListener('click', closeAddIncomeModal);
    
    if (addIncomeForm) addIncomeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const isUnitWise = !incomeUnitSelectorContainer.classList.contains('hidden');
        const newTransaction = {
            id: `tx-global-${Date.now()}`,
            date: document.getElementById('income-date').value,
            description: document.getElementById('income-name').value,
            amount: parseFloat(document.getElementById('income-amount').value),
            unit: isUnitWise ? incomeUnitSelector.value : null
        };

        if (currentProperty) {
            currentProperty.transactions.push(newTransaction);
            renderPropertyLedger(currentProperty);
        }
    
        closeAddIncomeModal();
        showModal('Success', 'Income has been successfully added.');
    });

    // --- Worksheet Add Income Dropdown Logic ---
    if (addPropertyIncomeBtn) addPropertyIncomeBtn.addEventListener('click', () => {
        const unitFilter = document.getElementById('unit-ledger-filter');
        openAddIncomeModal(unitFilter.value); 
    });
    
    if (addExpenseDropdownToggle) addExpenseDropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        addExpenseDropdownMenu.classList.toggle('hidden');
    });
    
    if (addRecurringExpenseBtn) addRecurringExpenseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('Coming Soon', 'Adding recurring expenses will be available in a future update.');
        addExpenseDropdownMenu.classList.add('hidden');
    });

    // Placeholder for recurring income
    if (addRecurringIncomeBtn) addRecurringIncomeBtn.addEventListener('click', (e) => { e.preventDefault(); showModal('Coming Soon', 'Adding recurring income will be available in a future update.'); addIncomeDropdownMenu.classList.add('hidden'); });
    
    if (addIncomeDropdownToggle) addIncomeDropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        addIncomeDropdownMenu.classList.toggle('hidden');
    });

    const incomeFileUpload = document.getElementById('income-file-upload');
    if (incomeFileUpload) incomeFileUpload.addEventListener('change', () => {
        const incomeFileName = document.getElementById('income-file-name');
        if (incomeFileUpload.files.length > 0) {
            incomeFileName.textContent = `Selected file: ${incomeFileUpload.files[0].name}`;
        } else {
            incomeFileName.textContent = '';
        }
    });
    
    const quickViewModal = document.getElementById('quickViewModal');
    const quickViewDetailsBtn = document.getElementById('quickViewDetailsBtn');
    const quickViewModalCloseBtn = document.getElementById('quickViewModalCloseBtn');
    const quickViewCloseBtn = document.getElementById('quickViewCloseBtn');
    const openQuickViewModal = (propertyId) => {
        const property = initialProperties.find(p => p.id === propertyId);
        if (!property) return;

        // Populate modal content
        document.getElementById('quickViewAddress').textContent = property.address;
        document.getElementById('quickViewOwner').textContent = `Owner: ${property.owner}`;

        const vacantUnitsCount = property.units.filter(u => u.vacant).length;
        const totalUnits = property.units.length;
        const occupancyRate = totalUnits > 0 ? `${((totalUnits - vacantUnitsCount) / totalUnits * 100).toFixed(0)}%` : 'N/A';
        
        document.getElementById('quickViewOccupancy').textContent = occupancyRate;
        document.getElementById('quickViewTotalUnits').textContent = totalUnits;
        document.getElementById('quickViewVacantUnits').textContent = vacantUnitsCount;
        
        const balanceEl = document.getElementById('quickViewBalance');
        balanceEl.textContent = `$${property.balance.toFixed(2)}`;
        balanceEl.className = 'text-lg font-bold ';
        balanceEl.classList.add(property.balance >= 0 ? 'text-green-600' : 'text-red-600');

        const unitsListContainer = document.getElementById('quickViewUnitsList');
        unitsListContainer.innerHTML = '';
        if (property.units.length > 0) {
            property.units.forEach(unit => {
                const unitRow = document.createElement('div');
                unitRow.className = 'p-3 flex justify-between items-center text-sm';
                const statusClass = unit.vacant ? 'text-green-600' : 'text-red-600';
                const statusText = unit.vacant ? 'Vacant' : 'Occupied';
                unitRow.innerHTML = `
                    <div>
                        <p class="font-semibold text-gray-800">${unit.name} <span class="font-normal text-gray-500">(${unit.type})</span></p>
                        ${!unit.vacant ? `<p class="text-xs text-gray-500">Tenant: ${unit.tenant}</p>` : `<p class="text-xs text-gray-500">Market Rent: $${(unit.marketRent || 0).toLocaleString()}</p>`}
                    </div>
                    <span class="font-bold ${statusClass}">${statusText}</span>
                `;
                unitsListContainer.appendChild(unitRow);
            });
        } else {
            unitsListContainer.innerHTML = '<p class="p-4 text-center text-gray-500">No units defined for this property.</p>';
        }

        // Populate mini-ledger
        const ledgerListContainer = document.getElementById('quickViewLedgerList');
        ledgerListContainer.innerHTML = '';
        if (property.transactions && property.transactions.length > 0) {
            const recentTransactions = property.transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
            recentTransactions.forEach(tx => {
                const txRow = document.createElement('div');
                txRow.className = 'p-3 flex justify-between items-center text-sm border-b last:border-b-0 border-gray-200';
                const amountClass = tx.amount >= 0 ? 'text-green-600' : 'text-red-600';
                const formattedDate = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                txRow.innerHTML = `
                    <div>
                        <p class="font-semibold text-gray-800">${tx.description}</p>
                        <p class="text-xs text-gray-500">${formattedDate}</p>
                    </div>
                    <span class="font-bold ${amountClass}">${tx.amount < 0 ? '-' : ''}$${Math.abs(tx.amount).toFixed(2)}</span>
                `;
                ledgerListContainer.appendChild(txRow);
            });
        } else {
            ledgerListContainer.innerHTML = '<p class="p-4 text-center text-gray-500">No recent transactions.</p>';
        }


        quickViewDetailsBtn.onclick = () => {
            closeQuickViewModal();
            showDetailsPage(propertyId);
        };

        quickViewModal.classList.remove('hidden');
    };

    const closeQuickViewModal = () => quickViewModal.classList.add('hidden');

    if (quickViewModalCloseBtn) quickViewModalCloseBtn.addEventListener('click', closeQuickViewModal);
    if (quickViewCloseBtn) quickViewCloseBtn.addEventListener('click', closeQuickViewModal);

    // --- Unit View Filtering and Bulk Actions ---
    const unitFilterStatus = document.getElementById('unit-filter-status');
    const unitFilterType = document.getElementById('unit-filter-type');
    const unitFilterLease = document.getElementById('unit-filter-lease');
    const resetUnitFiltersBtn = document.getElementById('reset-unit-filters');
    const bulkActionBtn = document.getElementById('bulk-action-btn');
    const bulkActionsContainer = document.getElementById('bulk-actions-container');

    const applyUnitFilters = () => {
        if (!currentProperty) return;

        const statusFilter = unitFilterStatus.value;
        const typeFilter = unitFilterType.value;
        const leaseFilter = unitFilterLease.value;

        let filteredUnits = currentProperty.units;

        if (statusFilter !== 'all') {
            const today = new Date();
            if (statusFilter === 'vacant') {
                filteredUnits = filteredUnits.filter(u => u.vacant);
            } else if (statusFilter === 'occupied') {
                // Occupied means not vacant and lease has started
                filteredUnits = filteredUnits.filter(u => !u.vacant && new Date(u.leaseStart) <= today);
            } else if (statusFilter === 'future') {
                // Future means not vacant and lease starts in the future.
                filteredUnits = filteredUnits.filter(u => !u.vacant && new Date(u.leaseStart) > today);
            }
        }

        if (typeFilter !== 'all') {
            filteredUnits = filteredUnits.filter(u => u.type === typeFilter);
        }

        if (leaseFilter !== 'all'){
            const today = new Date();
            const daysOut = leaseFilter === 'ending_30' ? 30 : 90;
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + daysOut);

            filteredUnits = filteredUnits.filter(u => {
                if (u.vacant || !u.leaseEnd) return false;
                const leaseEndDate = new Date(u.leaseEnd);
                return leaseEndDate >= today && leaseEndDate <= targetDate;
            });
        }

        renderUnitsTab(currentProperty, filteredUnits);
    };

    const handleUnitSelection = () => {
        const selectedCheckboxes = document.querySelectorAll('.unit-checkbox:checked');
        if (selectedCheckboxes.length > 0) {
            bulkActionsContainer.classList.remove('hidden');
        } else {
            bulkActionsContainer.classList.add('hidden');
        }
    };

    if (unitFilterStatus) unitFilterStatus.addEventListener('change', applyUnitFilters);
    if (unitFilterType) unitFilterType.addEventListener('change', applyUnitFilters);
    if (unitFilterLease) unitFilterLease.addEventListener('change', applyUnitFilters);
    if (resetUnitFiltersBtn) resetUnitFiltersBtn.addEventListener('click', () => {
        unitFilterStatus.value = 'all';
        unitFilterType.value = 'all';
        unitFilterLease.value = 'all';
        applyUnitFilters();
    });

    // --- Bulk Actions Logic ---
    if (bulkActionBtn) {
        const bulkActionMenu = document.getElementById('bulk-action-menu');

        bulkActionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            bulkActionMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            bulkActionMenu.classList.add('hidden');
        });

        document.getElementById('bulk-post-income').addEventListener('click', (e) => {
            e.preventDefault();
            const selectedUnitIds = Array.from(document.querySelectorAll('.unit-checkbox:checked')).map(cb => cb.dataset.unitId);
            // This is a placeholder. In a real app, you'd open a modal pre-filled with these units.
            showModal('Bulk Action', `This would open the 'Add Income' modal for the ${selectedUnitIds.length} selected units.`);
            bulkActionMenu.classList.add('hidden');
        });

        document.getElementById('bulk-post-expense').addEventListener('click', (e) => {
            e.preventDefault();
            const selectedUnitIds = Array.from(document.querySelectorAll('.unit-checkbox:checked')).map(cb => cb.dataset.unitId);
            // This reuses the existing expense modal logic.
            openAddExpenseModal(true, selectedUnitIds, false);
            bulkActionMenu.classList.add('hidden');
        });

        document.getElementById('bulk-send-message').addEventListener('click', (e) => {
            e.preventDefault();
            const selectedUnitIds = Array.from(document.querySelectorAll('.unit-checkbox:checked')).map(cb => cb.dataset.unitId);
            // This is a placeholder.
            showModal('Bulk Action', `This would open a 'New Message' modal addressed to the tenants of the ${selectedUnitIds.length} selected units.`);
            bulkActionMenu.classList.add('hidden');
        });
    }

    // --- Worksheet Detail View (Split View) Logic ---
    const worksheetSummaryContainer = document.getElementById('worksheet-summary-container');
    const worksheetDetailContainer = document.getElementById('worksheet-detail-container');

    const getWorksheetMonths = () => {
        if (!currentProperty) return [];
        const latestTransactionDate = currentProperty.transactions.reduce((latest, tx) => {
            const txDate = new Date(tx.date);
            return txDate > latest ? txDate : latest;
        }, new Date(0));

        const today = latestTransactionDate > new Date(0) ? latestTransactionDate : new Date();
        return Array.from({ length: 3 }, (_, i) => {
            const d = new Date(today.getFullYear(), today.getMonth() - (2 - i), 1);
            return { name: d.toLocaleString('default', { month: 'short' }), month: d.getMonth(), year: d.getFullYear() };
        });
    };

    const showWorksheetDetailView = (category, monthIndex, isOpening = false) => {
        if (!currentProperty) return;

        // Adjust layout for split view
        worksheetSummaryContainer.classList.remove('w-full');
        worksheetSummaryContainer.classList.add('w-3/5'); // 60%
        worksheetDetailContainer.classList.remove('w-0', 'opacity-0');
        worksheetDetailContainer.classList.add('w-2/5', 'opacity-100'); // 40%

        if (isOpening && !category && !monthIndex) {
            worksheetDetailContainer.innerHTML = `<div class="bg-white p-4 rounded-lg border h-full flex items-center justify-center"><p class="text-gray-500">Select an amount to see details.</p></div>`;
            return;
        }

        const monthData = getWorksheetMonths()[monthIndex];
        const filteredTransactions = currentProperty.transactions.filter(tx => {
            const txDate = new Date(tx.date);
            let txCategory = tx.description;
            if (tx.description.toLowerCase().includes('rent') && tx.unit) {
                const tenant = currentProperty.tenants.find(t => t.unit === tx.unit);
                txCategory = tenant ? `${tenant.name} (${tx.unit})` : `${tx.unit} - Rent`;
            }
            return txDate.getMonth() === monthData.month && txDate.getFullYear() === monthData.year && txCategory === category && tx.id;
        });

        if (filteredTransactions.length === 1) {
            // If only one transaction, show the edit form directly
            renderTransactionDetailInPanel(filteredTransactions[0].id);
        } else {
            // If multiple transactions, or if it's an expense, show a list first
            renderTransactionListForDetail(filteredTransactions, category, monthData);
        }
    };

    const renderTransactionListForDetail = (transactions, category, monthData) => {
        const formatCurrency = (value) => `${value < 0 ? '-' : ''}$${Math.abs(value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        worksheetDetailContainer.innerHTML = `
            <div class="bg-white p-4 rounded-lg border h-full">
                <h3 class="text-lg font-medium text-gray-900 mb-1">Details</h3>
                <h4 class="text-sm font-semibold text-gray-700">"${category}"</h4>
                <p class="text-xs text-gray-500 mb-4">in ${monthData.name} ${monthData.year}</p>
                <div class="max-h-[70vh] overflow-y-auto">
                    <ul class="divide-y divide-gray-200">
                        ${transactions.map(tx => `
                            <li class="py-3 flex justify-between items-center group">
                                <a href="#" class="w-full" data-tx-id="${tx.id}">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <p class="text-sm font-medium text-gray-800">${tx.description}</p>
                                            <p class="text-xs text-gray-500">${new Date(tx.date).toLocaleDateString()}</p>
                                        </div>
                                        <p class="text-sm font-semibold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}">${formatCurrency(tx.amount)}</p>
                                    </div>
                                </a>
                            </li>`).join('')}
                    </ul>
                </div>
            </div>`;

        worksheetDetailContainer.querySelector('ul').addEventListener('click', (e) => {
            const link = e.target.closest('a[data-tx-id]');
            if (link) {
                e.preventDefault();
                renderTransactionDetailInPanel(link.dataset.txId);
            }
        });
    };

    const renderTransactionDetailInPanel = (transactionId) => {
        const transaction = currentProperty.transactions.find(tx => tx.id === transactionId);
        if (!transaction) return;

        // For now, this just shows a simple form. Could be expanded.
        const isIncome = transaction.amount >= 0;

        worksheetDetailContainer.innerHTML = `
            <div class="bg-white p-4 rounded-lg border h-full">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Details</h3>
                <form id="worksheet-detail-form" class="space-y-3 text-sm max-h-[80vh] overflow-y-auto pr-2">
                    <input type="hidden" id="detail-tx-id" value="${transaction.id}">
                    <div>
                        <label for="detail-income-name" class="block text-xs font-medium text-gray-600">Income Name</label>
                        <input type="text" id="detail-income-name" value="${transaction.description}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-indigo-500 focus:ring-indigo-500">
                    </div>
                    <div>
                        <label for="detail-income-date" class="block text-xs font-medium text-gray-600">Date</label>
                        <input type="date" id="detail-income-date" value="${transaction.date}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-indigo-500 focus:ring-indigo-500">
                    </div>
                    <div>
                        <label for="detail-income-amount" class="block text-xs font-medium text-gray-600">Amount Received</label>
                        <input type="number" id="detail-income-amount" value="${Math.abs(transaction.amount).toFixed(2)}" required min="0.01" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-indigo-500 focus:ring-indigo-500">
                    </div>
                    <div>
                        <label for="detail-income-bank" class="block text-xs font-medium text-gray-600">Bank Account</label>
                        <select id="detail-income-bank" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <option>Operating Account</option>
                            <option>Trust Account</option>
                        </select>
                    </div>
                    <div>
                        <label for="detail-income-check" class="block text-xs font-medium text-gray-600">Check Number</label>
                        <input type="text" id="detail-income-check" placeholder="N/A" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-indigo-500 focus:ring-indigo-500">
                    </div>
                    <div>
                        <label for="detail-income-method" class="block text-xs font-medium text-gray-600">Payment Method</label>
                        <select id="detail-income-method" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <option>Bank Transfer</option>
                            <option>Check</option>
                            <option>Cash</option>
                            <option>Credit Card</option>
                        </select>
                    </div>
                    <div>
                        <label for="detail-income-notes" class="block text-xs font-medium text-gray-600">Notes</label>
                        <textarea id="detail-income-notes" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-indigo-500 focus:ring-indigo-500">${transaction.notes || ''}</textarea>
                    </div>
                    <div class="pt-2 flex justify-end">
                        <button type="button" id="cancel-detail-edit" class="bg-gray-200 text-gray-800 font-semibold py-1.5 px-4 rounded-lg shadow hover:bg-gray-300 text-sm mr-2">Cancel</button>
                        <button type="submit" class="bg-indigo-600 text-white font-semibold py-1.5 px-4 rounded-lg shadow hover:bg-indigo-700 text-sm">Save</button>
                    </div>
                </form>
            </div>
        `;

        const cancelButton = document.getElementById('cancel-detail-edit');
        if (cancelButton) {
            cancelButton.addEventListener('click', closeWorksheetDetailView);
        }
    };

    const transactionDetailModal = document.getElementById('transactionDetailModal');
    const transactionDetailContent = document.getElementById('transactionDetailContent');
    const closeWorksheetDetailView = () => {
        worksheetSummaryContainer.classList.remove('w-3/5');
        worksheetSummaryContainer.classList.add('w-full');
        worksheetDetailContainer.classList.remove('w-2/5', 'opacity-100');
        worksheetDetailContainer.classList.add('w-0', 'opacity-0');
        worksheetDetailContainer.innerHTML = ''; // Clear content

        const arrow = document.querySelector('#toggle-detail-view-btn i');
        if (arrow) arrow.className = 'fas fa-chevron-left fa-lg';
    };

    const transactionDetailModalCloseBtn = document.getElementById('transactionDetailModalCloseBtn');
    const closeTransactionDetailModalBtn = document.getElementById('closeTransactionDetailModalBtn');
    const editTransactionBtn = document.getElementById('editTransactionBtn');
    const deleteTransactionBtn = document.getElementById('deleteTransactionBtn');
    const editTransactionModal = document.getElementById('editTransactionModal');
    const editTransactionForm = document.getElementById('editTransactionForm');
    const editTransactionModalCloseBtn = document.getElementById('editTransactionModalCloseBtn');
    const cancelEditTransactionBtn = document.getElementById('cancelEditTransactionBtn');


    const openTransactionDetailModal = (transactionId) => {
        let transaction = null;
        let propertyAddress = null;

        // Find the transaction and its property
        for (const prop of initialProperties) {
            const foundTx = prop.transactions.find(tx => tx.id === transactionId);
            if (foundTx) {
                transaction = foundTx;
                propertyAddress = prop.address;
                break;
            }
        }

        if (!transaction) {
            showModal('Error', 'Transaction details could not be found.');
            return;
        }

        const isIncome = transaction.amount >= 0;
        const detailItem = (label, value) => `<div class="grid grid-cols-3 gap-4"><dt class="text-sm font-medium text-gray-500">${label}</dt><dd class="mt-1 text-sm text-gray-900 col-span-2">${value}</dd></div>`;

        transactionDetailContent.innerHTML = `
            <dl class="space-y-3">
                ${detailItem('Transaction ID', `<code class="text-xs bg-gray-100 p-1 rounded">${transaction.id}</code>`)}
                ${detailItem('Date', new Date(transaction.date).toLocaleDateString())}
                ${detailItem('Description', transaction.description)}
                ${detailItem('Amount', `<span class="font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}">$${Math.abs(transaction.amount).toFixed(2)}</span>`)}
                ${detailItem('Type', isIncome ? 'Income' : 'Expense')}
                ${detailItem('Property', propertyAddress)}
                ${detailItem('Unit', transaction.unit || 'Property-Level')}
            </dl>
        `;

        editTransactionBtn.onclick = () => {
            closeTransactionDetailModal();
            openEditTransactionModal(transaction.id);
        };

        deleteTransactionBtn.onclick = () => showModal('Action', `This would start the deletion process for transaction ${transaction.id}.`);

        transactionDetailModal.classList.remove('hidden');
    };

    const closeTransactionDetailModal = () => transactionDetailModal.classList.add('hidden');
    if (transactionDetailModalCloseBtn) transactionDetailModalCloseBtn.addEventListener('click', closeTransactionDetailModal);
    if (closeTransactionDetailModalBtn) closeTransactionDetailModalBtn.addEventListener('click', closeTransactionDetailModal);
    
    const openEditTransactionModal = (transactionId) => {
        let transaction = null;
        let property = null;

        for (const prop of initialProperties) {
            const foundTx = prop.transactions.find(tx => tx.id === transactionId);
            if (foundTx) {
                transaction = foundTx;
                property = prop;
                break;
            }
        }

        if (!transaction || !property) {
            showModal('Error', 'Could not find transaction to edit.');
            return;
        }

        // Populate form
        document.getElementById('edit-tx-id').value = transaction.id;
        document.getElementById('edit-tx-property-id').value = property.id;
        document.getElementById('edit-tx-date').value = transaction.date;
        document.getElementById('edit-tx-description').value = transaction.description;
        document.getElementById('edit-tx-amount').value = Math.abs(transaction.amount).toFixed(2);

        const unitSelect = document.getElementById('edit-tx-unit');
        unitSelect.innerHTML = '<option value="">Property-Level</option>';
        property.units.forEach(u => {
            const option = document.createElement('option');
            option.value = u.name;
            option.textContent = u.name;
            unitSelect.appendChild(option);
        });
        unitSelect.value = transaction.unit || '';

        editTransactionModal.classList.remove('hidden');
    };

    const closeEditTransactionModal = () => editTransactionModal.classList.add('hidden');
    if (editTransactionModalCloseBtn) editTransactionModalCloseBtn.addEventListener('click', closeEditTransactionModal);
    if (cancelEditTransactionBtn) cancelEditTransactionBtn.addEventListener('click', closeEditTransactionModal);
    
    const openEditIncomeModal = (transactionId) => {
        const transaction = currentProperty.transactions.find(tx => tx.id === transactionId);
        if (!transaction) {
            showModal('Error', 'Transaction not found.');
            return;
        }

        // Reset form and set title for editing
        addIncomeForm.reset();
        document.querySelector('#addIncomeModal h3').textContent = 'Edit Income';
        document.getElementById('income-file-name').textContent = '';

        // Add transaction ID to the form
        document.getElementById('income-transaction-id').value = transaction.id;

        // Populate fields
        document.getElementById('income-name').value = transaction.description;
        document.getElementById('income-date').value = transaction.date;
        document.getElementById('income-amount').value = Math.abs(transaction.amount).toFixed(2);
        
        // These fields are not in the base transaction data, so we'll use placeholders
        document.getElementById('income-bank-account').value = 'Operating Account';
        document.getElementById('income-payment-method').value = 'Bank Transfer';
        document.getElementById('income-description').value = `${transaction.description} - (Edited)`;

        // Handle unit selection
        if (transaction.unit) {
            unitWiseIncomeLink.click(); // Switch to unit-wise view
            incomeUnitSelector.value = transaction.unit;
        } else {
            propertyLevelIncomeLink.click(); // Switch to property-level view
        }

        // Handle toggles
        const isTenantPayment = currentProperty.tenants.some(t => transaction.description.includes(t.name));
        toggleAutoAllocationContainer.classList.toggle('hidden', !isTenantPayment);
        toggleSendReceiptContainer.classList.toggle('hidden', !isTenantPayment);
        document.getElementById('toggle-tenant-ledger').checked = isTenantPayment;
        document.getElementById('toggle-open-charges').checked = isTenantPayment;
        document.getElementById('toggle-email-receipt').checked = false;

        // Show the modal
        addIncomeModal.classList.remove('hidden');
        incomeNameInput.focus();
    };

    if (editTransactionForm) editTransactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const txId = document.getElementById('edit-tx-id').value;
        const propId = document.getElementById('edit-tx-property-id').value;
        const property = initialProperties.find(p => p.id === propId);
        const transaction = property.transactions.find(tx => tx.id === txId);

        if (transaction) {
            const originalAmount = transaction.amount;
            const newAmount = parseFloat(document.getElementById('edit-tx-amount').value);

            transaction.date = document.getElementById('edit-tx-date').value;
            transaction.description = document.getElementById('edit-tx-description').value;
            transaction.amount = originalAmount >= 0 ? newAmount : -newAmount; // Keep original sign
            transaction.unit = document.getElementById('edit-tx-unit').value || null;
        }
        closeEditTransactionModal();
        renderPropertyLedger(property); // Re-render the worksheet
        showModal('Success', 'Transaction has been updated.');
    });

    const txDetailList = document.getElementById('transaction-detail-list');
    if (txDetailList) txDetailList.addEventListener('click', (e) => {
        const link = e.target.closest('.transaction-detail-link');
        if (link) {
            e.preventDefault();
            const transactionId = link.dataset.transactionId;
            if (transactionId) openTransactionDetailModal(transactionId);
        }
    });

    // --- Global Button Listeners ---


    // --- Leases Ending Soon - Send Renewal Notice ---
    const leasesEndingList = document.getElementById('leases-ending-list');
    if (leasesEndingList) leasesEndingList.addEventListener('click', (e) => {
        const renewBtn = e.target.closest('.renew-btn');
        if (renewBtn && !renewBtn.disabled) {
            const unitId = renewBtn.dataset.unitId;
            const tenantName = renewBtn.dataset.tenantName;

            // Provide immediate feedback
            renewBtn.textContent = 'Sending...';
            renewBtn.disabled = true;

            // Simulate sending the notice
            setTimeout(() => {
                renewBtn.textContent = 'Sent ✓';
                renewBtn.classList.remove('text-blue-600', 'hover:underline');
                renewBtn.classList.add('text-green-600', 'cursor-default');
                
                showModal('Renewal Notice Sent', `A lease renewal notice has been sent to ${tenantName}.`);
            }, 1000); // Simulate 1 second network delay
        }
    });

    // --- Open Tasks Card - View Task Details ---
    const openTasksOverviewList = document.getElementById('open-tasks-overview-list');
    if (openTasksOverviewList) openTasksOverviewList.addEventListener('click', (e) => {
        const viewBtn = e.target.closest('.view-task-btn');
        if (viewBtn && currentProperty) {
            const taskId = viewBtn.dataset.taskId;
            const task = currentProperty.tasks.find(t => t.id === taskId);

            if (task) {
                const taskDetails = `
                    <p><strong>Due Date:</strong> ${task.dueDate}</p>
                    <p><strong>Assigned to:</strong> ${task.assignee}</p>
                `;
                showModal(`Task: ${task.description}`, taskDetails);
            }
        }
    });

    // Event listeners for property navigation
    if (prevPropertyBtn) prevPropertyBtn.addEventListener('click', () => handlePropertyNavigation('prev'));
    if (nextPropertyBtn) nextPropertyBtn.addEventListener('click', () => handlePropertyNavigation('next'));

    // --- Open Tasks Card - New Task Button ---
    const overviewNewTaskBtn = document.getElementById('overview-new-task-btn');
    if (overviewNewTaskBtn) overviewNewTaskBtn.addEventListener('click', () => {
        if (currentProperty) {
            openNewWorkOrderModal();
        }
    });

    // --- Recent Transactions Card - Detail View Link ---
    const recentTxDetailView = document.getElementById('recent-transactions-detail-view');
    if (recentTxDetailView) recentTxDetailView.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('units'); // Switch to the "WorkSheet" tab
        switchToView('transaction'); // Activate the "Transaction View" within the worksheet
    });

    // --- Recent Transactions Card - View Transaction Details ---
    const recentTxList = document.getElementById('recent-transactions-list');
    if (recentTxList) recentTxList.addEventListener('click', (e) => {
        const item = e.target.closest('.recent-tx-item');
        if (item) {
            const transactionId = item.dataset.transactionId;
            if (transactionId) {
                openTransactionDetailModal(transactionId);
            }
        }
    });

    // --- Quick Actions Toolbar Logic ---
    const quickActionPostIncome = document.getElementById('quick-action-post-income');
    if (quickActionPostIncome) quickActionPostIncome.addEventListener('click', () => {
        if (currentProperty) {
            // Open income modal for all units in the current property
            openAddIncomeModal(true, null, true);
        }
    });
    
    const quickActionPostExpense = document.getElementById('quick-action-post-expense');
    if (quickActionPostExpense) quickActionPostExpense.addEventListener('click', () => {
        if (currentProperty) {
            // Open expense modal for all units in the current property
            openAddExpenseModal(true, null, true);
        }
    });
    
    const quickActionNewWorkOrder = document.getElementById('quick-action-new-work-order');
    if (quickActionNewWorkOrder) quickActionNewWorkOrder.addEventListener('click', () => {
        if (currentProperty) {
            openNewWorkOrderModal();
        }
    });
    
    const quickActionListVacancy = document.getElementById('quick-action-list-vacancy');
    if (quickActionListVacancy) quickActionListVacancy.addEventListener('click', () => {
        if (currentProperty) {
            openListVacancyModal();
        }
    });
    
    // --- New Work Order Modal Logic ---
    const newWorkOrderModal = document.getElementById('newWorkOrderModal');
    const newWorkOrderForm = document.getElementById('newWorkOrderForm');
    const newWorkOrderModalCloseBtn = document.getElementById('newWorkOrderModalCloseBtn');
    const cancelNewWorkOrderBtn = document.getElementById('cancelNewWorkOrderBtn');

    const openNewWorkOrderModal = () => {
        newWorkOrderForm.reset();
        const unitSelect = document.getElementById('work-order-unit');
        unitSelect.innerHTML = '<option value="">Property-Level / Common Area</option>';
        if (currentProperty) {
            currentProperty.units.forEach(u => {
                const option = document.createElement('option');
                option.value = u.name;
                option.textContent = u.name;
                unitSelect.appendChild(option);
            });
        }
        newWorkOrderModal.classList.remove('hidden');
    };

    const closeNewWorkOrderModal = () => newWorkOrderModal.classList.add('hidden');

    if (newWorkOrderModalCloseBtn) newWorkOrderModalCloseBtn.addEventListener('click', closeNewWorkOrderModal);
    if (cancelNewWorkOrderBtn) cancelNewWorkOrderBtn.addEventListener('click', closeNewWorkOrderModal);
    
    if (newWorkOrderForm) newWorkOrderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = document.getElementById('work-order-description').value;
        const unit = document.getElementById('work-order-unit').value;
        const newTaskId = `t-${Date.now()}`;

        const newTask = {
            id: newTaskId,
            description: description,
            unit: unit || null,
            dueDate: document.getElementById('work-order-due-date').value || 'N/A',
            assignee: document.getElementById('work-order-assignee').value || 'Unassigned',
            status: 'open'
        };

        if (currentProperty) {
            if (!currentProperty.tasks) {
                currentProperty.tasks = [];
            }
            currentProperty.tasks.push(newTask);
            // Re-render relevant parts of the UI
            populateOverviewTab(currentProperty);
            renderTasksTab(currentProperty);
        }

        closeNewWorkOrderModal();
        showModal('Success', `Work order for "${description}" has been created.`);
    });

    // --- List Vacancy Modal Logic ---
    const listVacancyModal = document.getElementById('listVacancyModal');
    const listVacancyForm = document.getElementById('listVacancyForm');
    const listVacancyModalCloseBtn = document.getElementById('listVacancyModalCloseBtn');
    const cancelListVacancyBtn = document.getElementById('cancelListVacancyBtn');
    const unitsContainer = document.getElementById('list-vacancy-units-container');
    const selectAllCheckbox = document.getElementById('list-vacancy-select-all');

    const openListVacancyModal = () => {
        unitsContainer.innerHTML = '';
        selectAllCheckbox.checked = false;
        const vacantUnits = currentProperty.units.filter(u => u.vacant);

        if (vacantUnits.length === 0) {
            unitsContainer.innerHTML = '<p class="text-center text-gray-500">There are no vacant units in this property to list.</p>';
        } else {
            vacantUnits.forEach(unit => {
                const unitEl = document.createElement('div');
                unitEl.className = 'flex items-center justify-between p-2 rounded-md hover:bg-gray-50';
                unitEl.innerHTML = `
                    <label for="list-unit-${unit.id}" class="flex items-center cursor-pointer">
                        <input id="list-unit-${unit.id}" type="checkbox" value="${unit.id}" name="vacantUnits" class="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500">
                        <span class="ml-3 text-sm font-medium text-gray-800">${unit.name} (${unit.type})</span>
                    </label>
                    <span class="text-sm text-gray-600">Market Rent: <strong>$${(unit.marketRent || 0).toLocaleString()}</strong></span>
                `;
                unitsContainer.appendChild(unitEl);
            });
        }
        listVacancyModal.classList.remove('hidden');
    };

    const closeListVacancyModal = () => listVacancyModal.classList.add('hidden');

    if (listVacancyModalCloseBtn) listVacancyModalCloseBtn.addEventListener('click', closeListVacancyModal);
    if (cancelListVacancyBtn) cancelListVacancyBtn.addEventListener('click', closeListVacancyModal);
    if (selectAllCheckbox) selectAllCheckbox.addEventListener('change', (e) => {
        document.querySelectorAll('input[name="vacantUnits"]').forEach(cb => cb.checked = e.target.checked);
    });
    
    if (listVacancyForm) listVacancyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedCount = document.querySelectorAll('input[name="vacantUnits"]:checked').length;
        closeListVacancyModal();
        showModal('Listing Started', `The process to list ${selectedCount} vacant unit(s) has been initiated.`);
    });

    // Initial render of the table
    if (listingPage && !listingPage.classList.contains('hidden')) renderTable(filteredProperties);

    const renderCommunicationTab = (property) => {
        renderList(messagesList, property.messages, msg => {
            const el = document.createElement('div');
            const messageClass = msg.status === 'New' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200';
            el.className = `p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row sm:items-center sm:justify-between ${messageClass}`;
            el.innerHTML = `
                <div class="mb-2 sm:mb-0">
                    <p class="font-bold text-gray-900">${msg.subject}</p>
                    <p class="text-sm text-gray-700">From: ${msg.from}</p>
                    <p class="text-xs text-gray-500 mt-1">${msg.timestamp}</p>
                </div>
            `;
            el.appendChild(createViewButton('View Message', 'fa-envelope-open', 'data-message-id', msg.from));
            return el;
        }, 'No messages for this property.');

        renderList(announcementsList, property.announcements, ann => {
            const el = document.createElement('div');
            el.className = 'p-4 rounded-lg shadow-sm border border-gray-200 bg-gray-50';
            el.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-bold text-gray-900">${ann.title}</h3>
                    <span class="text-xs text-gray-500">${ann.date}</span>
                </div>
                <p class="text-sm text-gray-700">${ann.content}</p>
            `;
            return el;
        }, 'No announcements for this property.');
    };

    const renderTasksTab = (property) => {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        if (property.tasks && property.tasks.length > 0) {
            const openTasks = property.tasks.filter(task => task.status === 'open');
            const completedTasks = property.tasks.filter(task => {
                if (task.status === 'completed' && task.completionDate) {
                    const completionDate = new Date(task.completionDate);
                    return completionDate >= thirtyDaysAgo && completionDate <= today;
                }
                return false;
            });

            const renderTask = (task, isCompleted = false) => {
                const el = document.createElement('div');
                el.className = 'bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between';
                el.innerHTML = `
                    <div>
                        <p class="text-sm font-bold text-gray-900">
                            ${task.description} ${task.unit ? `- ${task.unit}` : ''}
                        </p>
                        <p class="text-xs text-gray-600">${isCompleted ? `Completed: ${task.completionDate}` : `Due: ${task.dueDate} | Assigned to: ${task.assignee}`}</p>
                    </div>
                `;
                el.appendChild(createViewButton('View Task', 'fa-eye', 'data-task-id', task.id));
                return el;
            };

            renderList(openTasksList, openTasks, (task) => renderTask(task, false), 'No open tasks for this property.');
            renderList(completedTasksList, completedTasks, (task) => renderTask(task, true), 'No completed tasks in the past 30 days.');

        } else {
            openTasksList.innerHTML = '<p class="text-gray-500 p-4 text-center">No open tasks for this property.</p>';
            completedTasksList.innerHTML = '<p class="text-gray-500 p-4 text-center">No completed tasks in the past 30 days.</p>';
        }
    };

    const renderVendorTab = (property) => {
        renderList(vendorsList, property.vendors, (vendor) => {
            const el = document.createElement('div');
            el.className = 'bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between';
            el.innerHTML = `
                <div class="mb-2 sm:mb-0">
                    <p class="text-lg font-bold text-gray-900">${vendor.name}</p>
                    <p class="text-sm text-gray-700">Category: ${vendor.category}</p>
                    <p class="text-xs text-gray-500 mt-1">
                        <i class="fas fa-phone-alt mr-1"></i> ${vendor.phone} | <i class="fas fa-envelope mr-1 ml-2"></i> ${vendor.email}
                    </p>
                </div>
            `;
            el.appendChild(createViewButton('View Details', 'fa-user-tie', 'data-vendor-id', vendor.id));
            return el;
        }, 'No vendors have been added for this property.');

        addNewVendorBtn.onclick = () => showModal('Add New Vendor', 'This would open a form to add a new vendor.');
    };

    const switchTab = (tabId) => {
        tabButtons.forEach(btn => {
            btn.classList.toggle('border-blue-500', btn.dataset.tab === tabId);
            btn.classList.toggle('text-blue-600', btn.dataset.tab === tabId);
            btn.classList.toggle('border-transparent', btn.dataset.tab !== tabId);
            btn.classList.toggle('text-gray-500', btn.dataset.tab !== tabId);
        });
        tabContents.forEach(content => {
            content.classList.toggle('hidden', content.dataset.tab !== tabId);
        });

        if (currentProperty) {
            if (tabId === 'units') {
                const unitFilter = document.getElementById('unit-ledger-filter');
                unitFilter.removeEventListener('change', refreshCurrentWorksheetView);
                unitFilter.addEventListener('change', refreshCurrentWorksheetView);
                switchToView('worksheet');
                // renderPropertyLedger is now called inside switchToView
            }
            if (tabId === 'overview') renderFinancialChart(currentProperty);
            if (tabId === 'unit') renderUnitsTab(currentProperty);
            if (tabId === 'applications') renderApplicationsTab(currentProperty);
            if (tabId === 'communication') renderCommunicationTab(currentProperty);
            if (tabId === 'tasks') renderTasksTab(currentProperty);
            if (tabId === 'vendor') renderVendorTab(currentProperty);
        }
    };

    const renderUnitsTab = (property, unitsToRender = null) => {
        const unitsList = document.getElementById('unitsList');
        const units = unitsToRender || property.units;

        // Populate unit type filter
        const unitFilterType = document.getElementById('unit-filter-type');
        const currentTypeFilterValue = unitFilterType.value;
        const unitTypes = [...new Set(property.units.map(u => u.type))];
        unitFilterType.innerHTML = '<option value="all">All Unit Types</option>';
        unitTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            unitFilterType.appendChild(option);
        });
        unitFilterType.value = currentTypeFilterValue;

        const renderUnitRow = (unit) => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';

            const statusClass = unit.vacant ? 'vacant-yes' : 'vacant-no';
            const statusText = unit.vacant ? 'Vacant' : 'Occupied';

            const isFutureTenant = !unit.vacant && new Date(unit.leaseStart) > new Date();

            const tenantInfo = unit.vacant
                ? `<span class="text-gray-500">Market Rent: $${(unit.marketRent || 0).toLocaleString()}</span>`
                : isFutureTenant
                ? `<p class="font-semibold text-gray-800">${unit.tenant}</p><p class="text-xs text-blue-600 font-medium">Moves in: ${new Date(unit.leaseStart).toLocaleDateString()}</p>`
                : `<p class="font-semibold text-gray-800">${unit.tenant}</p><p class="text-xs text-gray-500">Rent: $${unit.rent.toLocaleString()}</p>`;

            // Lease Progress Bar
            let leaseProgressHTML = '<span class="text-gray-400 text-xs">N/A</span>';
            if (!unit.vacant && unit.leaseStart && unit.leaseEnd) {
                const start = new Date(unit.leaseStart);
                const end = new Date(unit.leaseEnd);
                const today = new Date();
                if (isFutureTenant) today.setTime(start.getTime()); // For future tenants, show progress as 0
                const totalDuration = end - start;
                const elapsedDuration = today - start;
                const progress = Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));

                let progressBarColor = 'bg-green-500';
                if (progress > 85) progressBarColor = 'bg-yellow-500';
                if (progress >= 100) progressBarColor = 'bg-red-500';

                leaseProgressHTML = `
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="${progressBarColor} h-2.5 rounded-full" style="width: ${progress}%"></div>
                    </div>
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>${start.toLocaleDateString()}</span>
                        <span>${end.toLocaleDateString()}</span>
                    </div>
                `;
            }

            row.innerHTML = `
                <td class="p-4 text-left"><input type="checkbox" class="unit-checkbox h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" data-unit-id="${unit.id}"></td>
                <td class="px-4 sm:px-6 py-4">
                    <p class="font-semibold text-gray-800">${unit.name}</p>
                    <p class="text-xs text-gray-500">${unit.type}</p>
                </td>
                <td class="px-4 sm:px-6 py-4">
                    <span class="vacant-badge ${statusClass}">${statusText}</span>
                </td>
                <td class="px-4 sm:px-6 py-4 text-sm">${tenantInfo}</td>
                <td class="px-4 sm:px-6 py-4 w-1/4 min-w-[200px]">${leaseProgressHTML}</td>
                <td class="px-4 sm:px-6 py-4">
                    <div class="flex space-x-3">
                        ${unit.vacant || isFutureTenant ? `<button title="Move In Tenant" aria-label="Move In Tenant" class="move-in-btn text-green-500 hover:text-green-700" data-unit-id="${unit.id}"><i class="fas fa-sign-in-alt"></i></button>` : ''}
                        ${!unit.vacant && !isFutureTenant ? `<button title="Move Out Tenant" aria-label="Move Out Tenant" class="move-out-btn text-red-500 hover:text-red-700" data-unit-id="${unit.id}" data-tenant-name="${unit.tenant}"><i class="fas fa-sign-out-alt"></i></button>` : ''}
                        <button title="Edit Unit" aria-label="Edit Unit" class="text-gray-500 hover:text-blue-600"><i class="fas fa-pencil-alt"></i></button>
                        <button title="View Details" aria-label="View Details" class="text-blue-600 hover:text-blue-800"><i class="fas fa-arrow-right"></i></button>
                    </div>
                </td>
            `;
            return row;
        };

        renderList(unitsList, units, renderUnitRow, 'No units found for this property or filter.');

        unitsList.addEventListener('click', (e) => {
            const moveOutBtn = e.target.closest('.move-out-btn');
            const moveInBtn = e.target.closest('.move-in-btn');
            if (moveOutBtn) {
                const { unitId, tenantName } = moveOutBtn.dataset;
                showModal('Confirm Move Out', `This will start the move-out process for <strong>${tenantName}</strong> from unit ${unitId}. This action cannot be undone.`);
            }
            if (moveInBtn) {
                const { unitId } = moveInBtn.dataset;
                showModal('Start Move In', `This will start the move-in process for unit ${unitId}.`);
            }
        });

        // Add event listeners for checkboxes
        document.getElementById('select-all-units-checkbox').addEventListener('change', (e) => {
            document.querySelectorAll('.unit-checkbox').forEach(cb => cb.checked = e.target.checked);
            handleUnitSelection();
        });
        document.querySelectorAll('.unit-checkbox').forEach(cb => cb.addEventListener('change', handleUnitSelection));
        handleUnitSelection(); // Initial check
    };

    const renderApplicationsTab = (property) => {
        const activeApplications = property.applications.filter(app => !app.archived);
        const archivedApplications = property.applications.filter(app => app.archived);

        const renderApp = (app) => {
            const el = document.createElement('div');
            el.className = 'bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between';
            el.innerHTML = `
                <div class="mb-2 sm:mb-0">
                    <p class="text-lg font-bold text-gray-900">Applicant: ${app.applicant}</p>
                    <p class="text-sm text-gray-700">Unit: ${app.unit}</p>
                    <p class="text-sm text-gray-700">Status: ${app.status}</p>
                </div>
            `;
            el.appendChild(createViewButton('View Application', 'fa-file-alt', 'data-applicant-name', app.applicant));
            return el;
        };

        renderList(activeApplicationsList, activeApplications, renderApp, 'No active applications for this property.');
        renderList(archivedApplicationsList, archivedApplications, renderApp, 'No archived applications for this property.');
    };

    const showDetailsPage = (propertyId) => {
        const selectedProperty = initialProperties.find(p => p.id === propertyId);
        if (selectedProperty) {
            listingPage.classList.add('hidden');
            detailsPage.classList.remove('hidden');
            if (financialChart) financialChart.destroy(); // Destroy previous chart instance
            renderPropertyDetails(selectedProperty);
            switchTab('overview'); // Default to the Overview tab

            // Populate unit filter dropdown for the property details page context
            const unitFilter = document.getElementById('unit-ledger-filter');
            unitFilter.innerHTML = '<option value="all">All Units</option>';
            selectedProperty.units.forEach(unit => {
                const option = document.createElement('option');
                option.value = unit.name;
                option.textContent = unit.name;
                unitFilter.appendChild(option);
            });
        }
    };

    // =================================================================================
    // EVENT LISTENERS
    // =================================================================================

    // --- Global Listeners ---
    if (searchInput) searchInput.addEventListener('input', handleSearch);
    if (backBtn) backBtn.addEventListener('click', () => {
        listingPage.classList.remove('hidden');
        detailsPage.classList.add('hidden');
    });
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideModal);
    
    // --- Listing Page Listeners ---
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable(filteredProperties);
        }
    });
    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable(filteredProperties);
        }
    });
    if (propertyTableBody) propertyTableBody.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        if (!row) return;

        const quickViewBtn = e.target.closest('.quick-view-btn');
        const detailsBtn = e.target.closest('.details-btn');

        if (detailsBtn) {
            showDetailsPage(detailsBtn.dataset.id);
            return;
        }
        if (quickViewBtn) {
            openQuickViewModal(quickViewBtn.dataset.id);
            return;
        }
        if (row.dataset.id) {
            showDetailsPage(row.dataset.id);
        }
    });

    // --- Details Page Listeners ---
    if (tabButtons) tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
    if (prevPropertyBtn) prevPropertyBtn.addEventListener('click', () => handlePropertyNavigation('prev'));
    if (nextPropertyBtn) nextPropertyBtn.addEventListener('click', () => handlePropertyNavigation('next'));
    if (propertySwitcherInput) propertySwitcherInput.addEventListener('focus', () => {
        populatePropertySwitcherDropdown();
        propertySwitcherDropdown.classList.remove('hidden');
    });
    if (propertySwitcherInput) propertySwitcherInput.addEventListener('input', () => {
        populatePropertySwitcherDropdown(propertySwitcherInput.value);
    });
    document.addEventListener('click', (e) => {
        const container = document.getElementById('propertySwitcherContainer'); // This is on details page
        if (container && !container.contains(e.target)) {
            propertySwitcherDropdown.classList.add('hidden');
            if (currentProperty && propertySwitcherInput.value !== currentProperty.address) {
                propertySwitcherInput.value = currentProperty.address;
            }
        }
    });

    // --- Worksheet Drilldown Listener ---
    if (worksheetSummaryContainer) worksheetSummaryContainer.addEventListener('click', (e) => {
        const link = e.target.closest('.worksheet-drilldown');
        if (link) {
            e.preventDefault();
            showWorksheetDetailView(link.dataset.category, parseInt(link.dataset.monthIndex, 10));
        }
    });

    // --- Global Detail View Toggle ---
    const toggleDetailViewBtn = document.getElementById('toggle-detail-view-btn');
    if (toggleDetailViewBtn) toggleDetailViewBtn.addEventListener('click', () => {
        const isOpen = worksheetDetailContainer.classList.contains('w-2/5');
        isOpen ? closeWorksheetDetailView() : showWorksheetDetailView(null, null, true); // Open empty
        toggleDetailViewBtn.querySelector('i').className = isOpen ? 'fas fa-chevron-left fa-lg' : 'fas fa-chevron-right fa-lg';
    });

    // --- Worksheet/Ledger Listeners ---
    if (worksheetViewBtn) worksheetViewBtn.addEventListener('click', () => switchToView('worksheet'));
    const transactionDetailList = document.getElementById('transaction-detail-list');
    if (transactionDetailList) transactionDetailList.addEventListener('click', (e) => {
        const link = e.target.closest('.transaction-detail-link');
        if (link && link.dataset.transactionId) {
            e.preventDefault();
            openTransactionDetailModal(link.dataset.transactionId);
        }
    });

    // --- Button & Action Listeners ---
    if (addPropertyBtn) addPropertyBtn.addEventListener('click', () => window.location.href = 'Add_Property.html');
    if (setupUnitBtn) setupUnitBtn.addEventListener('click', () => window.location.href = 'setupunit.html');
    if (globalSettingsBtn) globalSettingsBtn.addEventListener('click', () => window.location.href = 'global_setting.html');

    const addPropertyExpenseBtn = document.getElementById('add-property-expense-btn');
    if (addPropertyExpenseBtn) {
        addPropertyExpenseBtn.addEventListener('click', () => {
            if (currentProperty) {
                window.location.href = `propery_Add_exp.html?propertyId=${currentProperty.id}`;
            } else {
                window.location.href = 'propery_Add_exp.html';
            }
        });
    }
});