document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // GLOBAL SETTINGS STATE
    // =================================================================================
    const isKeptByPmEnabled = localStorage.getItem('revenueManagement_keptByPmEnabled') !== 'false';
    const isMarkupExpenseEnabled = localStorage.getItem('revenueManagement_markupExpenseEnabled') !== 'false';

    // =================================================================================
    // STATE AND DATA
    // =================================================================================
    const irsCategories = {
        Income: [
            'Rents Received',
            'Advance Rent',
            'Security Deposits Applied',
            'Tenant Paid Expenses',
            'Property/Services in Lieu of Rent',
            'Lease Cancellation Payments',
            'Other Income'
        ],
        Expense: [
            'Advertising',
            'Auto and Travel',
            'Cleaning and Maintenance',
            'Commissions',
            'Depreciation Expense',
            'Insurance',
            'Legal and Other Professional Fees',
            'Management Fees',
            'Mortgage Interest',
            'Other Interest',
            'Repairs',
            'Supplies',
            'Taxes (Real Estate)',
            'Utilities',
            'Other Expenses'
        ]
    };

    const CATEGORIES_STORAGE_KEY = 'propertyManagement_categories';

    const defaultCategories = [
         // Income Categories
         { id: 'cat-inc-1', name: 'Rent Income', type: 'Income', irsCategory: 'Rents Received', status: 'Active', isKeptByPM: false, isMarkupExpense: false },
         { id: 'cat-inc-2', name: 'Late Fee Income', type: 'Income', irsCategory: 'Other Income', status: 'Active', isKeptByPM: false, isMarkupExpense: false },
         { id: 'cat-inc-3', name: 'Application Fee Income', type: 'Income', irsCategory: 'Other Income', status: 'Active', isKeptByPM: false, isMarkupExpense: false },
         { id: 'cat-inc-4', name: 'Laundry Income', type: 'Income', irsCategory: 'Other Income', status: 'Active', isKeptByPM: false, isMarkupExpense: false },
         { id: 'cat-inc-5', name: 'Parking Income', type: 'Income', irsCategory: 'Other Income', status: 'Inactive', isKeptByPM: false, isMarkupExpense: false },
 
         // Expense Categories
         { id: 'cat-exp-1', name: 'Repairs and Maintenance', type: 'Expense', irsCategory: 'Repairs', status: 'Active', isKeptByPM: false, isMarkupExpense: false },
         { id: 'cat-exp-2', name: 'Utilities', type: 'Expense', irsCategory: 'Utilities', status: 'Active', isKeptByPM: false, isMarkupExpense: false },
         { id: 'cat-exp-3', name: 'Property Taxes', type: 'Expense', irsCategory: 'Taxes (Real Estate)', status: 'Active', isKeptByPM: false, isMarkupExpense: false },
         { id: 'cat-exp-4', name: 'Insurance', type: 'Expense', irsCategory: 'Insurance', status: 'Active', isKeptByPM: false, isMarkupExpense: false },
         { id: 'cat-exp-5', name: 'Management Fees', type: 'Expense', irsCategory: 'Management Fees', status: 'Active', isKeptByPM: false, isMarkupExpense: false },
         { id: 'cat-exp-6', name: 'Landscaping', type: 'Expense', irsCategory: 'Cleaning and Maintenance', status: 'Inactive', isKeptByPM: false, isMarkupExpense: false },
         { id: 'cat-exp-7', name: 'Mortgage Interest', type: 'Expense', irsCategory: 'Mortgage Interest', status: 'Active', isKeptByPM: false, isMarkupExpense: false },
         { id: 'cat-exp-8', name: 'Advertising', type: 'Expense', irsCategory: 'Advertising', status: 'Active', isKeptByPM: false, isMarkupExpense: false },
    ];

    let initialCategories = [];

    const saveCategoriesToStorage = () => {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(initialCategories));
    };

    const TEMPLATES_STORAGE_KEY = 'propertyManagement_templates';
    const saveTemplatesToStorage = () => {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(initialTemplates));
    };
    let initialTemplates = [
        {
            id: 'tpl-1',
            name: 'Standard Residential Lease',
            description: 'Default template for all residential properties.',
            categories: ['cat-inc-1', 'cat-inc-2', 'cat-exp-1', 'cat-exp-2']
        },
        {
            id: 'tpl-2',
            name: 'Commercial Office Lease',
            description: 'Template for commercial office spaces.',
            categories: ['cat-inc-1', 'cat-exp-1', 'cat-exp-2', 'cat-exp-5']
        }
    ];

    let currentFilters = {
        type: 'All',
        status: 'All'
    };

    // =================================================================================
    // DOM ELEMENT SELECTORS
    // =================================================================================
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categorySearchInput = document.getElementById('category-search-input');
    const categoryLibraryBody = document.getElementById('category-library-body');
    const addCategoryBtn = document.getElementById('add-category-btn');

    // Modal Elements
    const categoryModal = document.getElementById('category-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const categoryForm = document.getElementById('category-form');
    const categoryIdInput = document.getElementById('category-id');
    const categoryNameInput = document.getElementById('category-name');
    const categoryTypeInput = document.getElementById('category-type');
    const categoryTypeSearchInput = document.getElementById('category-type-search');
    const categoryTypeDropdown = document.getElementById('category-type-dropdown');
    const keptByPmContainer = document.getElementById('kept-by-pm-container');
    const markupExpenseContainer = document.getElementById('markup-expense-container');
    const keptByPmCheckbox = document.getElementById('category-kept-by-pm');
    const markupExpenseCheckbox = document.getElementById('category-markup-expense');

    // Template Elements
    const templatesList = document.getElementById('templates-list');
    const addTemplateBtn = document.getElementById('add-template-btn');
    const mainContent = document.getElementById('main-content');
    const templateEditorView = document.getElementById('template-editor-view');
    const backToTemplatesBtn = document.getElementById('back-to-templates-btn');
    const templateForm = document.getElementById('template-form');
    const templateCategoryList = document.getElementById('template-category-list');
    const templateEditorTitle = document.getElementById('template-editor-title');
    const templateIdInput = document.getElementById('template-id');
    const templateNameInput = document.getElementById('template-name');
    const templateDescriptionInput = document.getElementById('template-description');
    const templateCancelBtn = document.getElementById('template-cancel-btn');
    const templateCategorySearch = document.getElementById('template-category-search');
    const templateSelectAllCheckbox = document.getElementById('template-select-all-categories');

    // =================================================================================
    // RENDER FUNCTIONS
    // =================================================================================

    const updateRevenueFilterVisibility = () => {
        // Show/hide the filter buttons based on global settings
        document.querySelector('[data-filter-value="KeptByPM"]').style.display = isKeptByPmEnabled ? '' : 'none';
        document.querySelector('[data-filter-value="MarkupExpense"]').style.display = isMarkupExpenseEnabled ? '' : 'none';
    };

    const renderCategories = () => {
        categoryLibraryBody.innerHTML = '';
        const searchTerm = categorySearchInput.value.toLowerCase();

        const filteredCategories = initialCategories.filter(cat => {
            const matchesType = currentFilters.type === 'All' || cat.type === currentFilters.type;
            
            let matchesStatus = true;
            if (currentFilters.status !== 'All') {
                if (currentFilters.status === 'Active' || currentFilters.status === 'Inactive') {
                    matchesStatus = cat.status === currentFilters.status;
                } else if (currentFilters.status === 'KeptByPM') {
                    matchesStatus = cat.isKeptByPM === true;
                } else if (currentFilters.status === 'MarkupExpense') {
                    matchesStatus = cat.isMarkupExpense === true;
                }
            }

            const matchesSearch = cat.name.toLowerCase().includes(searchTerm);
            return matchesType && matchesStatus && matchesSearch;
        });

        if (filteredCategories.length === 0) {
            categoryLibraryBody.innerHTML = `<tr><td colspan="4" class="text-center text-gray-500 py-8">No categories found.</td></tr>`;
            return;
        }

        const incomeCategories = filteredCategories.filter(cat => cat.type === 'Income');
        const expenseCategories = filteredCategories.filter(cat => cat.type === 'Expense');

        const createSectionHeader = (type, count) => {
            return `
                <tr class="bg-gray-100 border-t border-b border-gray-300 hover:bg-gray-200 cursor-pointer toggle-section-btn" data-section="${type.toLowerCase()}">
                    <td colspan="4" class="px-6 py-2 font-semibold text-gray-700">
                        <div class="flex items-center justify-between">
                            <span>
                                <i class="fas fa-chevron-down mr-3 section-icon" data-section-icon="${type.toLowerCase()}"></i>
                                ${type} Categories
                            </span>
                            <span class="text-sm font-normal text-gray-500">${count} items</span>
                        </div>
                    </td>
                </tr>
            `;
        };

        const createCategoryRow = (cat) => {
            const row = document.createElement('tr');
            row.className = `hover:bg-gray-50 category-row income-row`;
            if (cat.type === 'Expense') {
                row.className = `hover:bg-gray-50 category-row expense-row`;
            }
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div class="flex items-center">
                        <span class="h-2.5 w-2.5 rounded-full ${cat.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}" title="Status: ${cat.status}"></span>
                        <span class="ml-3">${cat.name}</span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cat.irsCategory} <span class="text-xs text-gray-400">(${cat.type})</span></td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${cat.type === 'Income' ? `
                        <div class="flex items-center" style="display: ${isKeptByPmEnabled ? 'flex' : 'none'}">
                            <label class="relative inline-flex items-center cursor-pointer" title="Enable if this income is kept by the Property Manager and not passed to the owner.">
                                <input type="checkbox" value="" class="sr-only peer pm-revenue-toggle" data-id="${cat.id}" data-revenue-type="keptByPM" ${cat.isKeptByPM ? 'checked' : ''}>
                                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                            <span class="ml-3 text-sm font-medium text-gray-700">Kept by PM</span>
                        </div>
                    ` : ''}
                    ${cat.type === 'Expense' ? `
                        <div class="flex items-center" style="display: ${isMarkupExpenseEnabled ? 'flex' : 'none'}">
                            <label class="relative inline-flex items-center cursor-pointer" title="Enable if this expense is eligible for a markup before being billed to the owner.">
                                <input type="checkbox" value="" class="sr-only peer pm-revenue-toggle" data-id="${cat.id}" data-revenue-type="markupExpense" ${cat.isMarkupExpense ? 'checked' : ''}>
                                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                            <span class="ml-3 text-sm font-medium text-gray-700">Markup Expense</span>
                        </div>
                    ` : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button data-id="${cat.id}" class="action-menu-btn text-gray-500 hover:text-gray-700">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div id="action-menu-${cat.id}" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
                        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <a href="#" data-id="${cat.id}" class="edit-cat-btn block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Edit</a>
                            <a href="#" data-id="${cat.id}" class="status-toggle-btn block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                Mark as ${cat.status === 'Active' ? 'Inactive' : 'Active'}
                            </a>
                            <a href="#" data-id="${cat.id}" class="delete-cat-btn block px-4 py-2 text-sm text-red-600 hover:bg-gray-100" role="menuitem">Delete</a>
                        </div>
                    </div>
                </td>
            `;
            return row;
        };

        if (incomeCategories.length > 0 || currentFilters.type === 'All' || currentFilters.type === 'Income') {
            categoryLibraryBody.insertAdjacentHTML('beforeend', createSectionHeader('Income', incomeCategories.length));
            incomeCategories.forEach(cat => {
                categoryLibraryBody.appendChild(createCategoryRow(cat));
            });
        }

        if (expenseCategories.length > 0 || currentFilters.type === 'All' || currentFilters.type === 'Expense') {
            categoryLibraryBody.insertAdjacentHTML('beforeend', createSectionHeader('Expense', expenseCategories.length));
            expenseCategories.forEach(cat => {
                categoryLibraryBody.appendChild(createCategoryRow(cat));
            });
        }
    };

    const renderTemplates = (highlightId = null) => {
        templatesList.innerHTML = '';
        if (initialTemplates.length === 0) {
            templatesList.innerHTML = `<p class="text-center text-gray-500 py-8">No templates created yet.</p>`;
            return;
        }

        let highlightedElement = null;

        initialTemplates.forEach(template => {
            const card = document.createElement('div');
            const isHighlighted = template.id === highlightId;
            card.className = `bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center transition-all duration-500 ${isHighlighted ? 'bg-indigo-100 border-indigo-300' : ''}`;
            card.dataset.id = template.id; // Add data-id for SortableJS

            card.innerHTML = `
                <div>
                    <h3 class="font-semibold text-gray-800">${template.name}</h3>
                    <p class="text-sm text-gray-500">${template.description}</p>
                </div>
                <div class="flex items-center gap-4">
                    <button data-id="${template.id}" class="edit-tpl-btn text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                    <button data-id="${template.id}" class="copy-tpl-btn text-green-600 hover:text-green-900 text-sm font-medium">Copy</button>
                    <button data-id="${template.id}" class="delete-tpl-btn text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                </div>
            `;
            templatesList.appendChild(card);

            if (isHighlighted) {
                highlightedElement = card;
            }
        });

        if (highlightedElement) {
            highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                highlightedElement.classList.remove('bg-indigo-100', 'border-indigo-300');
            }, 2500); // Highlight for 2.5 seconds
        }
    };

    // =================================================================================
    // MODAL AND EDITOR VIEW LOGIC
    // =================================================================================

    const openCategoryModal = (category = null) => {
        categoryForm.reset();
        keptByPmContainer.classList.add('hidden');
        markupExpenseContainer.classList.add('hidden');
        categoryTypeDropdown.classList.add('hidden');
        categoryTypeSearchInput.value = '';
        categoryTypeInput.value = '';

        const handleTypeChange = (type) => {
            keptByPmContainer.classList.toggle('hidden', type !== 'Income' || !isKeptByPmEnabled);
            keptByPmContainer.classList.toggle('flex', type === 'Income' && isKeptByPmEnabled);
            markupExpenseContainer.classList.toggle('hidden', type !== 'Expense' || !isMarkupExpenseEnabled);
            markupExpenseContainer.classList.toggle('flex', type === 'Expense' && isMarkupExpenseEnabled);
        };

        const populateDropdown = (searchTerm = '') => {
            categoryTypeDropdown.innerHTML = '';
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            let hasResults = false;

            Object.keys(irsCategories).forEach(type => {
                const filteredCategories = irsCategories[type].filter(catName => catName.toLowerCase().includes(lowerCaseSearchTerm));
                if (filteredCategories.length > 0) {
                    hasResults = true;
                    const optgroup = document.createElement('div');
                    optgroup.className = 'px-4 py-2 text-xs font-bold text-gray-500 uppercase';
                    optgroup.textContent = type;
                    categoryTypeDropdown.appendChild(optgroup);

                    filteredCategories.forEach(catName => {
                        const optionDiv = document.createElement('div');
                        optionDiv.className = 'px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-indigo-100';
                        optionDiv.textContent = catName;
                        optionDiv.dataset.value = catName;
                        optionDiv.dataset.type = type;
                        optionDiv.addEventListener('click', () => {
                            categoryTypeSearchInput.value = catName;
                            categoryTypeInput.value = catName; // Set hidden input
                            categoryTypeDropdown.classList.add('hidden');
                            handleTypeChange(type);
                        });
                        categoryTypeDropdown.appendChild(optionDiv);
                    });
                }
            });
            if (!hasResults) {
                categoryTypeDropdown.innerHTML = '<div class="px-4 py-2 text-sm text-gray-500">No results found</div>';
            }
        };

        categoryTypeSearchInput.addEventListener('focus', () => {
            populateDropdown(categoryTypeSearchInput.value);
            categoryTypeDropdown.classList.remove('hidden');
        });

        categoryTypeSearchInput.addEventListener('input', () => {
            populateDropdown(categoryTypeSearchInput.value);
        });

        if (category) {
            modalTitle.textContent = 'Edit Category';
            categoryIdInput.value = category.id;
            categoryNameInput.value = category.name;
            categoryTypeSearchInput.value = category.irsCategory;
            categoryTypeInput.value = category.irsCategory; // Set hidden input
            keptByPmCheckbox.checked = category.isKeptByPM;
            markupExpenseCheckbox.checked = category.isMarkupExpense;
            handleTypeChange(category.type);
        } else {
            modalTitle.textContent = 'Add New Category';
            categoryIdInput.value = '';
            keptByPmCheckbox.checked = false;
            markupExpenseCheckbox.checked = false;
        }

        categoryModal.classList.remove('hidden');
    };

    const closeCategoryModal = () => {
        categoryModal.classList.add('hidden');
    };

    const showTemplateEditor = (template = null) => {
        templateForm.reset();
        templateCategorySearch.value = '';
        templateSelectAllCheckbox.checked = false;
        templateCategoryList.innerHTML = '';

        if (template) {
            templateEditorTitle.textContent = 'Edit Template';
            templateIdInput.value = template.id;
            templateNameInput.value = template.name;
            templateDescriptionInput.value = template.description;
        } else {
            templateEditorTitle.textContent = 'Create New Template';
            templateIdInput.value = '';
        }

        showTemplateEditor.renderTemplateCategories = (searchTerm = '') => {
            templateCategoryList.innerHTML = '';
            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            const activeCategories = initialCategories.filter(c => c.status === 'Active' && c.name.toLowerCase().includes(lowerCaseSearchTerm));
            const incomeCategories = activeCategories.filter(cat => cat.type === 'Income');
            const expenseCategories = activeCategories.filter(cat => cat.type === 'Expense');

            if (activeCategories.length === 0) {
                templateCategoryList.innerHTML = `<p class="text-center text-gray-500 p-4">No categories match your search.</p>`;
                return;
            }

        const createSectionHeader = (type, count) => {
            return `
                <div class="bg-gray-100 border-t border-b border-gray-200 p-2 rounded-t-lg cursor-pointer toggle-template-section-btn" data-section="template-${type.toLowerCase()}">
                    <div class="flex items-center justify-between">
                        <span class="font-semibold text-gray-700">
                            <i class="fas fa-chevron-down mr-3 template-section-icon" data-section-icon="template-${type.toLowerCase()}"></i>
                            ${type} Categories
                        </span>
                        <span class="text-sm font-normal text-gray-500">${count} items</span>
                    </div>
                </div>
            `;
        };

        const createCategoryItem = (cat) => {
            const isChecked = template ? template.categories.includes(cat.id) : false;
            const item = document.createElement('div');
            item.className = `flex items-center justify-between p-3 bg-white border-l border-r border-b border-gray-200 template-category-item template-${cat.type.toLowerCase()}-item`;
            item.innerHTML = `
                <label for="tpl-cat-${cat.id}" class="flex items-center cursor-pointer">
                    <input id="tpl-cat-${cat.id}" type="checkbox" value="${cat.id}" name="templateCategories" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" ${isChecked ? 'checked' : ''}>
                    <span class="ml-3 text-sm font-medium text-gray-800">${cat.name}</span>
                </label>
                <span class="text-xs font-semibold ${cat.type === 'Income' ? 'text-green-600' : 'text-red-600'}">${cat.type}</span>
            `;
            return item;
        };

        if (incomeCategories.length > 0) {
            templateCategoryList.insertAdjacentHTML('beforeend', createSectionHeader('Income', incomeCategories.length));
            incomeCategories.forEach(cat => {
                templateCategoryList.appendChild(createCategoryItem(cat));
            });
        }

        if (expenseCategories.length > 0) {
            templateCategoryList.insertAdjacentHTML('beforeend', createSectionHeader('Expense', expenseCategories.length));
            expenseCategories.forEach(cat => {
                templateCategoryList.appendChild(createCategoryItem(cat));
            });
        }

        };

        showTemplateEditor.renderTemplateCategories();

        templateCategorySearch.removeEventListener('input', handleTemplateCategorySearch);
        templateCategorySearch.addEventListener('input', handleTemplateCategorySearch);

        mainContent.classList.add('hidden');
        templateEditorView.classList.remove('hidden');
    };
    
    const handleTemplateCategorySearch = (e) => {
        showTemplateEditor.renderTemplateCategories(e.target.value);
    };

    const hideTemplateEditor = () => {
        mainContent.classList.remove('hidden');
        templateEditorView.classList.add('hidden');
    };

    // =================================================================================
    // EVENT HANDLERS
    // =================================================================================

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            tabButtons.forEach(btn => {
                btn.classList.remove('border-indigo-500', 'text-indigo-600');
                btn.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
            });
            button.classList.add('border-indigo-500', 'text-indigo-600');
            button.classList.remove('border-transparent', 'text-gray-500');

            tabContents.forEach(content => {
                content.classList.toggle('hidden', content.dataset.tab !== tabId);
            });
        });
    });

    // Category filter
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const group = button.dataset.filterGroup;
            const value = button.dataset.filterValue;
            currentFilters[group] = value;

            document.querySelectorAll(`.filter-btn[data-filter-group="${group}"]`).forEach(btn => {
                btn.classList.remove('bg-indigo-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
            });
            button.classList.add('bg-indigo-600', 'text-white');
            button.classList.remove('bg-gray-200', 'text-gray-700');
            renderCategories();
        });    
    });

    // Category search
    categorySearchInput.addEventListener('input', renderCategories);

    // Add/Edit Category
    addCategoryBtn.addEventListener('click', () => openCategoryModal());
    modalCloseBtn.addEventListener('click', closeCategoryModal);
    modalCancelBtn.addEventListener('click', closeCategoryModal);

    categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = categoryIdInput.value;
        const selectedOption = categoryTypeInput.options[categoryTypeInput.selectedIndex];
        const newCategory = {
            id: id || `cat-new-${Date.now()}`,
            name: categoryNameInput.value,
            irsCategory: selectedOption.value,
            type: selectedOption.dataset.type,
            isKeptByPM: keptByPmCheckbox.checked,
            isMarkupExpense: markupExpenseCheckbox.checked,
            status: 'Active' // Default status
        };

        if (id) { // Editing
            const index = initialCategories.findIndex(c => c.id === id);
            if (index !== -1) {
                initialCategories[index] = { ...initialCategories[index], ...newCategory };
            }
        } else { // Adding
            initialCategories.push(newCategory);
        }
        renderCategories();
        closeCategoryModal();
        saveCategoriesToStorage();
    });

    categoryLibraryBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-cat-btn')) {
            const category = initialCategories.find(c => c.id === e.target.dataset.id);
            if (category) openCategoryModal(category);
        }
        if (e.target.classList.contains('delete-cat-btn')) {
            if (confirm('Are you sure you want to delete this category?')) {
                initialCategories = initialCategories.filter(c => c.id !== e.target.dataset.id);
                renderCategories();
                saveCategoriesToStorage();
            }
        }
        // Handle action menu button click
        if (e.target.closest('.action-menu-btn')) {
            const button = e.target.closest('.action-menu-btn');
            const categoryId = button.dataset.id;
            const menu = document.getElementById(`action-menu-${categoryId}`);
            if (menu) {
                // Close all other menus
                document.querySelectorAll('[id^="action-menu-"]').forEach(m => {
                    if (m.id !== menu.id) m.classList.add('hidden');
                });
                menu.classList.toggle('hidden');
            }
        }
        // Handle status toggle from menu
        if (e.target.classList.contains('status-toggle-btn')) {
            const categoryId = e.target.dataset.id;
            const category = initialCategories.find(c => c.id === categoryId);
            if (category) {
                category.status = category.status === 'Active' ? 'Inactive' : 'Active';
                renderCategories();
                saveCategoriesToStorage();
            }
        }
        // Handle PM Revenue toggle
        if (e.target.classList.contains('pm-revenue-toggle')) {
            const categoryId = e.target.dataset.id; // Corrected from categoryId
            const revenueType = e.target.dataset.revenueType;
            const category = initialCategories.find(c => c.id === categoryId);
            if (category) {
                if (revenueType === 'keptByPM') category.isKeptByPM = e.target.checked;
                if (revenueType === 'markupExpense') category.isMarkupExpense = e.target.checked;
                renderCategories();
                saveCategoriesToStorage();
            }
        }
    });

    // Close action menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.action-menu-btn')) {
            document.querySelectorAll('[id^="action-menu-"]').forEach(m => m.classList.add('hidden'));
        }
        // Close IRS category dropdown when clicking outside
        if (!e.target.closest('#category-type-search') && !e.target.closest('#category-type-dropdown')) {
            categoryTypeDropdown.classList.add('hidden');
        } else if (!e.target.closest('.action-menu-btn')) {
            document.querySelectorAll('[id^="action-menu-"]').forEach(m => m.classList.add('hidden'));
        }
    });

    // Section toggling
    categoryLibraryBody.addEventListener('click', (e) => {
        const header = e.target.closest('.toggle-section-btn');
        if (header) {
            const section = header.dataset.section;
            const rows = document.querySelectorAll(`.${section}-row`);
            rows.forEach(row => row.classList.toggle('hidden'));
            document.querySelector(`[data-section-icon="${section}"]`).classList.toggle('fa-chevron-down');
            document.querySelector(`[data-section-icon="${section}"]`).classList.toggle('fa-chevron-right');
        }
    });

    // Template Editor Section Toggling
    templateEditorView.addEventListener('click', (e) => {
        const header = e.target.closest('.toggle-template-section-btn');
        if (header) {
            const section = header.dataset.section;
            const items = document.querySelectorAll(`.${section}-item`);
            items.forEach(item => item.classList.toggle('hidden'));
            document.querySelector(`[data-section-icon="${section}"]`).classList.toggle('fa-chevron-down');
            document.querySelector(`[data-section-icon="${section}"]`).classList.toggle('fa-chevron-right');
        }
    });

    // Template Actions
    addTemplateBtn.addEventListener('click', () => showTemplateEditor());
    backToTemplatesBtn.addEventListener('click', hideTemplateEditor);
    templateCancelBtn.addEventListener('click', hideTemplateEditor);

    // The search listener is now added inside showTemplateEditor

    templateSelectAllCheckbox.addEventListener('click', (e) => {
        const isChecked = e.target.checked;
        document.querySelectorAll('#template-category-list input[type="checkbox"]').forEach(checkbox => checkbox.checked = isChecked);
    });

    templateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Logic to save template would go here
        alert('Template saved!');
        hideTemplateEditor();
        saveTemplatesToStorage();
        renderTemplates();
    });

    templatesList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-tpl-btn')) {
            const template = initialTemplates.find(t => t.id === e.target.dataset.id);
            if (template) showTemplateEditor(template);
        }
        if (e.target.classList.contains('delete-tpl-btn')) {
            if (confirm('Are you sure you want to delete this template?')) {
                initialTemplates = initialTemplates.filter(t => t.id !== e.target.dataset.id);
                renderTemplates();
                saveTemplatesToStorage();
            }
        }
        if (e.target.classList.contains('copy-tpl-btn')) {
            const templateId = e.target.dataset.id;
            const originalIndex = initialTemplates.findIndex(t => t.id === templateId);
            if (originalIndex > -1) {
                const templateToCopy = initialTemplates[originalIndex];
                const newTemplate = {
                    ...templateToCopy,
                    id: `tpl-new-${Date.now()}`,
                    name: `${templateToCopy.name} - Copy`
                };
                initialTemplates.splice(originalIndex + 1, 0, newTemplate);
                saveTemplatesToStorage();
                renderTemplates(newTemplate.id);
            }
        }
    });

    // =================================================================================
    // INITIALIZATION
    // =================================================================================
    const initialize = () => {
        const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
        if (storedCategories) {
            initialCategories = JSON.parse(storedCategories);
        } else {
            initialCategories = defaultCategories;
            saveCategoriesToStorage();
        }

        const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
        if (storedTemplates) {
            initialTemplates = JSON.parse(storedTemplates);
        } else {
            // initialTemplates is already set with defaults, so we just save it.
            saveTemplatesToStorage();
        }
        updateRevenueFilterVisibility();
        renderCategories();
        renderTemplates();

        // Initialize SortableJS for template reordering
        new Sortable(templatesList, {
            animation: 150,
            ghostClass: 'sortable-ghost', // Class for the drop placeholder
            onEnd: (evt) => {
                // Get the moved item from the data array
                const movedItem = initialTemplates.splice(evt.oldIndex, 1)[0];
                // Insert it at the new position
                initialTemplates.splice(evt.newIndex, 0, movedItem);
                // Save the new order to localStorage
                saveTemplatesToStorage();
            }
        });
    };

    initialize();
});