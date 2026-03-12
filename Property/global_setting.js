document.addEventListener('DOMContentLoaded', () => {
    const keptByPmToggle = document.getElementById('kept-by-pm-toggle');
    const markupExpenseToggle = document.getElementById('markup-expense-toggle');

    const KEPT_BY_PM_ENABLED_KEY = 'revenueManagement_keptByPmEnabled';
    const MARKUP_EXPENSE_ENABLED_KEY = 'revenueManagement_markupExpenseEnabled';

    // Initialize toggles from localStorage on page load.
    // Default to 'true' if no setting is found, so features are visible initially.
    const isKeptByPmEnabled = localStorage.getItem(KEPT_BY_PM_ENABLED_KEY) !== 'false';
    const isMarkupExpenseEnabled = localStorage.getItem(MARKUP_EXPENSE_ENABLED_KEY) !== 'false';

    if (keptByPmToggle) {
        keptByPmToggle.checked = isKeptByPmEnabled;
    }
    if (markupExpenseToggle) {
        markupExpenseToggle.checked = isMarkupExpenseEnabled;
    }

    // Add event listeners to save changes to localStorage.
    if (keptByPmToggle) {
        keptByPmToggle.addEventListener('change', (e) => {
            localStorage.setItem(KEPT_BY_PM_ENABLED_KEY, e.target.checked);
        });
    }
    if (markupExpenseToggle) {
        markupExpenseToggle.addEventListener('change', (e) => {
            localStorage.setItem(MARKUP_EXPENSE_ENABLED_KEY, e.target.checked);
        });
    }
});