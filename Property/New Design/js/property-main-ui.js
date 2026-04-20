/* ===============================================
   Property Main - UI script
   (originally lines 673-726 of Property_main.html)
   =============================================== */

    (function() {

        /* ── Row click → navigate to Property_detailed_view.html ── */
        document.querySelectorAll('#prop-tbody tr').forEach(function(row) {
            row.addEventListener('click', function(e) {
                // Don't navigate if clicking the dots button or dropdown
                if (e.target.closest('.row-dropdown-wrap')) return;
                var href = this.dataset.href;
                if (href) window.location.href = href;
            });
        });

        /* ── Address links don't bubble ── */
        document.querySelectorAll('.prop-addr').forEach(function(a) {
            a.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });

        /* ── Dots dropdown toggle ── */
        document.addEventListener('click', function(e) {
            var dotsBtn = e.target.closest('.dots-btn');

            // Close all open dropdowns first
            document.querySelectorAll('.row-dropdown.open').forEach(function(dd) {
                if (!dotsBtn || !dd.parentElement.contains(dotsBtn)) {
                    dd.classList.remove('open');
                }
            });

            if (dotsBtn) {
                e.stopPropagation();
                var wrap = dotsBtn.closest('.row-dropdown-wrap');
                var dd = wrap && wrap.querySelector('.row-dropdown');
                if (dd) dd.classList.toggle('open');
            }
        });

        /* ── Live search ── */
        var rows = Array.from(document.querySelectorAll('#prop-tbody tr'));
        document.getElementById('prop-search').addEventListener('input', function() {
            var q = this.value.toLowerCase().trim();
            var visible = 0;
            rows.forEach(function(row) {
                var show = !q || row.textContent.toLowerCase().indexOf(q) !== -1;
                row.style.display = show ? '' : 'none';
                if (show) visible++;
            });
            document.getElementById('result-info').textContent = visible + ' propert' + (visible === 1 ? 'y' : 'ies');
        });

    })();
