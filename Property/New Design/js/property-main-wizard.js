/* ===============================================
   Property Main - Wizard script (APW / BSUW)
   (originally lines 2054-3576 of Property_main.html)
   =============================================== */

    /* ══ ADD PROPERTY WIZARD ══ */
    (function() {
        var overlay      = document.getElementById('apw-overlay');
        var totalSteps   = 5;
        var currentStep  = 1;
        var selectedType = '';

        function apwOpen() {
            currentStep  = 1;
            selectedType = '';
            document.querySelectorAll('#apw-overlay .apw-type-card').forEach(function(c){ c.classList.remove('selected'); });
            if (typeof selectedUnitOption !== 'undefined') selectedUnitOption = '';
            document.querySelectorAll('#apw-overlay .apw-unit-option-card').forEach(function(c){ c.classList.remove('selected'); });
            var uow = document.getElementById('apw-unit-option-wrap');
            if (uow) uow.classList.remove('visible');
            var nuw = document.getElementById('apw-num-units-wrap');
            if (nuw) nuw.classList.remove('visible');
            var nui = document.getElementById('apw-num-units');
            if (nui) nui.value = '';
            if (typeof apwUnitData !== 'undefined') { apwUnitData = []; apwCurrentPage = 1; }
            // Reset redesigned Unit Details state
            var qfCard = document.getElementById('apw-qf-card');
            if (qfCard) qfCard.classList.remove('visible');
            var qfBeds = document.getElementById('apw-bulk-beds');  if (qfBeds)  qfBeds.value = '';
            var qfBath = document.getElementById('apw-bulk-baths'); if (qfBath)  qfBath.value = '';
            var qfSize = document.getElementById('apw-bulk-size');  if (qfSize)  qfSize.value = '';
            var br = document.getElementById('apw-bulk-result');    if (br) br.classList.remove('show');
            var pag = document.getElementById('apw-ut-pagination');
            if (pag) pag.classList.remove('visible');
            var utb = document.getElementById('apw-ut-tbody');
            if (utb) utb.innerHTML = '';
            document.getElementById('apw-success-msg').style.display = 'none';
            document.getElementById('apw-btn-next').classList.remove('finish');
            document.getElementById('apw-btn-next').textContent = 'Next';
            apwRender();
            overlay.classList.add('open');
            overlay.scrollTop = 0;
            document.body.style.overflow = 'hidden';
        }
        window.apwClose = function() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        };
        window.apwOpen = apwOpen;

        function apwRender() {
            document.querySelectorAll('#apw-overlay .apw-step').forEach(function(el) {
                var s = parseInt(el.dataset.step);
                el.classList.toggle('active',    s === currentStep);
                el.classList.toggle('completed', s < currentStep);
                var circle = el.querySelector('.apw-step-circle');
                if (s < currentStep) {
                    circle.innerHTML = '<i class="fas fa-check" style="font-size:11px;"></i>';
                } else {
                    circle.textContent = s;
                }
            });
            document.querySelectorAll('#apw-overlay .apw-step-content').forEach(function(el) {
                el.classList.toggle('active', parseInt(el.dataset.step) === currentStep);
            });
            var step4el = document.querySelector('#apw-overlay .apw-steps-bar .apw-step[data-step="4"]');
            if (step4el) step4el.style.display = (selectedType === 'Commercial') ? 'none' : '';
            var effectiveTotal = (selectedType === 'Commercial') ? totalSteps - 1 : totalSteps;
            var displayStep   = (selectedType === 'Commercial' && currentStep === 5) ? 4 : currentStep;
            document.getElementById('apw-step-label').textContent = 'Step ' + displayStep + ' of ' + effectiveTotal;
            var btnNext = document.getElementById('apw-btn-next');
            if (currentStep === totalSteps) {
                btnNext.textContent = 'Submit';
                btnNext.classList.add('finish');
            } else {
                btnNext.textContent = 'Next';
                btnNext.classList.remove('finish');
            }
            document.getElementById('apw-btn-back').style.visibility = currentStep === 1 ? 'hidden' : 'visible';
            overlay.scrollTop = 0;
        }

        function apwPopulateReview() {
            function v(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
            document.getElementById('rv-type').textContent      = selectedType || '—';
            var rvUnitRow    = document.getElementById('rv-unit-option-row');
            var rvNumUnitsRow = document.getElementById('rv-num-units-row');
            if (rvUnitRow) {
                if (selectedType === 'Residential' && selectedUnitOption) {
                    document.getElementById('rv-unit-option').textContent = selectedUnitOption;
                    rvUnitRow.style.display = '';
                } else { rvUnitRow.style.display = 'none'; }
            }
            if (rvNumUnitsRow) {
                if (selectedUnitOption === 'Multiple Unit') {
                    var nUnits = document.getElementById('apw-num-units');
                    var nVal = nUnits ? nUnits.value.trim() : '';
                    document.getElementById('rv-num-units').textContent = nVal ? nVal + ' units' : '—';
                    rvNumUnitsRow.style.display = '';
                } else { rvNumUnitsRow.style.display = 'none'; }
            }
            document.getElementById('rv-street1').textContent   = v('apw-street1') || '—';
            document.getElementById('rv-street2').textContent   = v('apw-street2') || '—';
            document.getElementById('rv-city').textContent      = v('apw-city')    || '—';
            document.getElementById('rv-state').textContent     = v('apw-state')   || '—';
            document.getElementById('rv-zip').textContent       = v('apw-zip')     || '—';
            document.getElementById('rv-propname').textContent  = v('apw-propname')|| '—';
            document.getElementById('rv-effdate').textContent   = v('apw-eff-date')|| '—';
            var reserveVal = parseFloat(v('apw-prop-reserve'));
            document.getElementById('rv-reserve').textContent = !isNaN(reserveVal) ? '$' + reserveVal.toFixed(2) : '$0.00';
        }

        var selectedUnitOption = '';
        var unitOptionWrap = document.getElementById('apw-unit-option-wrap');

        document.querySelectorAll('#apw-overlay .apw-type-card').forEach(function(card) {
            card.addEventListener('click', function() {
                document.querySelectorAll('#apw-overlay .apw-type-card').forEach(function(c){ c.classList.remove('selected'); });
                this.classList.add('selected');
                selectedType = this.dataset.type;
                if (selectedType === 'Residential') {
                    unitOptionWrap.classList.add('visible');
                } else {
                    unitOptionWrap.classList.remove('visible');
                    document.querySelectorAll('#apw-overlay .apw-unit-option-card').forEach(function(c){ c.classList.remove('selected'); });
                    selectedUnitOption = '';
                }
            });
        });

        var numUnitsWrap = document.getElementById('apw-num-units-wrap');
        var numUnitsInput = document.getElementById('apw-num-units');

        document.querySelectorAll('#apw-overlay .apw-unit-option-card').forEach(function(card) {
            card.addEventListener('click', function() {
                document.querySelectorAll('#apw-overlay .apw-unit-option-card').forEach(function(c){ c.classList.remove('selected'); });
                this.classList.add('selected');
                selectedUnitOption = this.dataset.unitType;
                if (selectedUnitOption === 'Multiple Unit') {
                    numUnitsWrap.classList.add('visible');
                    numUnitsInput.focus();
                } else {
                    numUnitsWrap.classList.remove('visible');
                    numUnitsInput.value = '';
                }
            });
        });

        var bankToggle = document.getElementById('apw-bank-toggle');
        if (bankToggle) {
            bankToggle.addEventListener('click', function() {
                this.classList.toggle('off');
                var fields = document.getElementById('apw-bank-fields');
                if (fields) fields.style.display = this.classList.contains('off') ? 'none' : 'block';
            });
        }

        var addOwnerBtn = document.getElementById('apw-add-owner');
        if (addOwnerBtn) {
            addOwnerBtn.addEventListener('click', function() {
                var list = document.getElementById('apw-owners-list');
                var row = document.createElement('div');
                row.className = 'apw-owner-row';
                row.style.marginBottom = '12px';
                row.innerHTML = '<div class="apw-form-group"><label class="apw-label">Owner Name</label><input class="apw-input" type="text" placeholder="Select or type in"></div><div class="apw-form-group" style="max-width:180px;"><label class="apw-label">Ownership (%)</label><input class="apw-input" type="number" min="0" max="100" placeholder="Enter ownership percentage"></div>';
                list.appendChild(row);
            });
        }

        var apwUnitData = [];
        var apwCurrentPage = 1;
        var APW_PAGE_SIZE = 20;

        function apwInitUnitStep() {
            var qfCard  = document.getElementById('apw-qf-card');
            var unitCount = 1;
            if (selectedUnitOption === 'Multiple Unit') {
                var nInput = document.getElementById('apw-num-units');
                unitCount = Math.max(2, parseInt(nInput ? nInput.value : '2') || 2);
            }
            // Show Quick Fill card only for multi-unit setups
            if (qfCard) qfCard.classList.toggle('visible', unitCount > 1);
            // Reset bulk inputs
            var bBeds = document.getElementById('apw-bulk-beds');   if (bBeds)  bBeds.value = '';
            var bBath = document.getElementById('apw-bulk-baths');  if (bBath)  bBath.value = '';
            var bSize = document.getElementById('apw-bulk-size');   if (bSize)  bSize.value = '';
            // Hide stale result banner
            var br = document.getElementById('apw-bulk-result'); if (br) br.classList.remove('show');
            // Initialize unit data rows
            if (apwUnitData.length !== unitCount) {
                apwUnitData = [];
                for (var i = 0; i < unitCount; i++) {
                    apwUnitData.push({ name: '', beds: '', baths: '', size: '', _selected: false });
                }
            } else {
                // Clear any stale selection when reopening the step with same count
                for (var j = 0; j < apwUnitData.length; j++) apwUnitData[j]._selected = false;
            }
            apwCurrentPage = 1;
            apwBuildTable();
            apwUpdateProgress();
            apwUpdateSelBadge();
        }

        function escAttr(s) { return (s || '').replace(/"/g, '&quot;'); }
        function escHtml(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

        // Returns { cls, icon, label } describing the completion state of a unit row.
        function apwRowStatus(d) {
            var filled = 0;
            if (d.beds)  filled++;
            if (d.baths) filled++;
            if (d.size)  filled++;
            if (filled === 3) return { cls: 'complete', icon: 'fa-check-circle', label: 'Complete' };
            if (filled === 0 && !d.name) return { cls: 'empty',   icon: 'fa-circle',        label: 'Empty'    };
            return                           { cls: 'partial', icon: 'fa-adjust',        label: 'Partial'  };
        }

        function apwBuildTable() {
            var tbody = document.getElementById('apw-ut-tbody');
            var pagination = document.getElementById('apw-ut-pagination');
            if (!tbody) return;
            var total = apwUnitData.length;
            var usePagination = total > APW_PAGE_SIZE;
            if (pagination) pagination.classList.toggle('visible', usePagination);
            var startIdx = usePagination ? (apwCurrentPage - 1) * APW_PAGE_SIZE : 0;
            var endIdx   = usePagination ? Math.min(startIdx + APW_PAGE_SIZE, total) : total;
            var BED_OPTS  = ['', 'Studio', '1', '2', '3', '4', '5', '6+'];
            var BATH_OPTS = ['', '1', '1.5', '2', '2.5', '3', '3+'];
            tbody.innerHTML = '';
            for (var i = startIdx; i < endIdx; i++) {
                (function(idx) {
                    var d = apwUnitData[idx];
                    var tr = document.createElement('tr');
                    tr.dataset.unitIdx = idx;
                    var classes = [];
                    var isFilled = d.beds && d.baths && d.size;
                    if (isFilled) classes.push('apw-ut-filled');
                    if (d._selected) classes.push('apw-ut-selected');
                    if (total === 1) classes.push('apw-ut-single-row');
                    if (classes.length) tr.className = classes.join(' ');
                    tr.innerHTML =
                        '<td class="apw-ut-chk-cell"><label class="apw-chk-wrap"><input type="checkbox" class="ut-ichk"' + (d._selected ? ' checked' : '') + '><span class="apw-chk-box"></span></label></td>' +
                        '<td style="text-align:center;"><div class="apw-ut-num">' + (idx + 1) + '</div></td>' +
                        '<td><input type="text" class="ut-iname" value="' + escAttr(d.name) + '" placeholder="Unit ' + (idx + 1) + '"></td>' +
                        '<td><select class="ut-ibeds">' + BED_OPTS.map(function(o){ return '<option value="' + o + '"' + (o === d.beds ? ' selected' : '') + '>' + (o || 'Select') + '</option>'; }).join('') + '</select></td>' +
                        '<td><select class="ut-ibaths">' + BATH_OPTS.map(function(o){ return '<option value="' + o + '"' + (o === d.baths ? ' selected' : '') + '>' + (o || 'Select') + '</option>'; }).join('') + '</select></td>' +
                        '<td><input type="text" class="ut-isize" value="' + escAttr(d.size) + '" placeholder="e.g. 850"></td>';
                    var chk = tr.querySelector('.ut-ichk');
                    if (chk) chk.addEventListener('change', function() {
                        apwUnitData[idx]._selected = this.checked;
                        tr.classList.toggle('apw-ut-selected', this.checked);
                        apwSyncSelectAll();
                        apwUpdateSelBadge();
                    });
                    function bind(cls, key, evt) {
                        var el = tr.querySelector('.' + cls);
                        if (!el) return;
                        el.addEventListener(evt, function() {
                            apwUnitData[idx][key] = (key === 'size' || key === 'name') ? this.value : this.value;
                            var nd = apwUnitData[idx];
                            var nowFilled = nd.beds && nd.baths && nd.size;
                            tr.classList.toggle('apw-ut-filled', !!nowFilled);
                            apwUpdateProgress();
                        });
                    }
                    bind('ut-iname',  'name',  'input');
                    bind('ut-ibeds',  'beds',  'change');
                    bind('ut-ibaths', 'baths', 'change');
                    bind('ut-isize',  'size',  'input');
                    tbody.appendChild(tr);
                })(i);
            }
            if (usePagination) apwUpdatePagination(startIdx + 1, endIdx, total);
            apwSyncSelectAll();
        }

        // Sync header "select all" checkbox state with current-page row selections.
        function apwSyncSelectAll() {
            var chkAll = document.getElementById('apw-chk-all');
            if (!chkAll) return;
            var total = apwUnitData.length;
            var usePagination = total > APW_PAGE_SIZE;
            var s = usePagination ? (apwCurrentPage - 1) * APW_PAGE_SIZE : 0;
            var e = usePagination ? Math.min(s + APW_PAGE_SIZE, total) : total;
            var pageSize = e - s;
            var pickedOnPage = 0;
            for (var i = s; i < e; i++) if (apwUnitData[i]._selected) pickedOnPage++;
            chkAll.checked = pageSize > 0 && pickedOnPage === pageSize;
            chkAll.indeterminate = pickedOnPage > 0 && pickedOnPage < pageSize;
        }

        // Update "Apply to Selected (N)" button label and disabled state.
        function apwUpdateSelBadge() {
            var total = apwUnitData.length;
            var usePagination = total > APW_PAGE_SIZE;
            var s = usePagination ? (apwCurrentPage - 1) * APW_PAGE_SIZE : 0;
            var e = usePagination ? Math.min(s + APW_PAGE_SIZE, total) : total;
            var count = 0;
            for (var i = s; i < e; i++) if (apwUnitData[i]._selected) count++;
            var btn = document.getElementById('apw-bulk-selected');
            var lbl = document.getElementById('apw-qf-sel-label');
            if (lbl) lbl.textContent = 'Apply to Selected (' + count + ')';
            if (btn) btn.disabled = (count === 0);
        }

        function apwUpdateProgress() {
            var total = apwUnitData.length;
            var pc = Math.max(1, Math.ceil(total / APW_PAGE_SIZE));
            var pageStart = (apwCurrentPage - 1) * APW_PAGE_SIZE;
            var pageEnd = Math.min(pageStart + APW_PAGE_SIZE, total);
            var pageSize = pageEnd - pageStart;
            // Update Quick Fill subtitle with page scope when paginated
            var qfSub = document.getElementById('apw-qf-sub');
            if (qfSub) {
                if (pc > 1) {
                    qfSub.innerHTML = 'Apply the same values to the <strong>' + pageSize + ' unit' + (pageSize === 1 ? '' : 's') + ' on page ' + apwCurrentPage + '</strong> of ' + pc;
                } else {
                    qfSub.innerHTML = 'Apply the same values to all <strong>' + total + ' units</strong>';
                }
            }
            // Update Apply button label to match scope
            var applyLabel = document.getElementById('apw-qf-apply-label');
            if (applyLabel) {
                applyLabel.textContent = pc > 1
                    ? 'Fill ' + pageSize + ' unit' + (pageSize === 1 ? '' : 's') + ' on this page'
                    : 'Fill all ' + total + ' unit' + (total === 1 ? '' : 's');
            }
        }
        function apwShowBulkResult(msg, type) {
            var banner = document.getElementById('apw-bulk-result');
            var icon   = banner ? banner.querySelector('i.fas') : null;
            var msgEl  = document.getElementById('apw-bulk-result-msg');
            if (!banner) return;
            banner.classList.remove('warn', 'err');
            if (type === 'warn') banner.classList.add('warn');
            else if (type === 'err') banner.classList.add('err');
            if (icon) icon.className = 'fas ' + (type === 'warn' ? 'fa-exclamation-triangle' : type === 'err' ? 'fa-times-circle' : 'fa-check-circle');
            if (msgEl) msgEl.textContent = msg;
            banner.classList.add('show');
        }
        (function(){
            var cb = document.getElementById('apw-bulk-result-close');
            if (cb) cb.addEventListener('click', function() {
                var b = document.getElementById('apw-bulk-result');
                if (b) b.classList.remove('show');
            });
        })();

        function apwUpdatePagination(start, end, total) {
            var info = document.getElementById('apw-ut-page-info');
            var prev = document.getElementById('apw-ut-prev');
            var next = document.getElementById('apw-ut-next');
            var pc = Math.max(1, Math.ceil(total / APW_PAGE_SIZE));
            if (info) info.textContent = 'Showing ' + start + ' – ' + end + ' of ' + total + '  (page ' + apwCurrentPage + ' of ' + pc + ')';
            if (prev) prev.disabled = (apwCurrentPage <= 1);
            if (next) next.disabled = (end >= total);
        }

        (function(){
            var prevBtn = document.getElementById('apw-ut-prev');
            var nextBtn = document.getElementById('apw-ut-next');
            if (prevBtn) prevBtn.addEventListener('click', function() {
                if (apwCurrentPage > 1) { apwCurrentPage--; apwBuildTable(); apwUpdateProgress(); apwUpdateSelBadge(); }
            });
            if (nextBtn) nextBtn.addEventListener('click', function() {
                var maxPage = Math.ceil(apwUnitData.length / APW_PAGE_SIZE);
                if (apwCurrentPage < maxPage) { apwCurrentPage++; apwBuildTable(); apwUpdateProgress(); apwUpdateSelBadge(); }
            });
        })();

        // Select-all header checkbox → toggles every visible (current-page) row's selection.
        (function(){
            var chkAll = document.getElementById('apw-chk-all');
            if (!chkAll) return;
            chkAll.addEventListener('change', function() {
                var on = this.checked;
                var total = apwUnitData.length;
                var usePagination = total > APW_PAGE_SIZE;
                var s = usePagination ? (apwCurrentPage - 1) * APW_PAGE_SIZE : 0;
                var e = usePagination ? Math.min(s + APW_PAGE_SIZE, total) : total;
                for (var i = s; i < e; i++) apwUnitData[i]._selected = on;
                apwBuildTable();
                apwUpdateSelBadge();
            });
        })();

        function apwBulkFields() {
            var v = {
                beds:  document.getElementById('apw-bulk-beds').value,
                baths: document.getElementById('apw-bulk-baths').value,
                size:  document.getElementById('apw-bulk-size').value.trim()
            };
            var labels = [];
            if (v.beds)  labels.push('Bed');
            if (v.baths) labels.push('Bath');
            if (v.size)  labels.push('Size');
            v.labels = labels;
            v.any = labels.length > 0;
            return v;
        }
        function apwFormatList(arr) {
            if (arr.length === 0) return '';
            if (arr.length === 1) return arr[0];
            if (arr.length === 2) return arr[0] + ' and ' + arr[1];
            return arr.slice(0, -1).join(', ') + ', and ' + arr[arr.length - 1];
        }
        function apwRemainingEmpty() {
            return apwUnitData.filter(function(d){ return !d.beds || !d.baths || !d.size; }).length;
        }

        function apwPageRange() {
            var total = apwUnitData.length;
            var s = (apwCurrentPage - 1) * APW_PAGE_SIZE;
            var e = Math.min(s + APW_PAGE_SIZE, total);
            return { start: s, end: e, size: e - s, total: total, pageCount: Math.max(1, Math.ceil(total / APW_PAGE_SIZE)) };
        }
        function apwOtherPagesText(r) {
            // Returns "Page 2" when one other page, "Pages 2, 3" for multiple.
            // Empty string when there's only one page total.
            if (r.pageCount <= 1) return '';
            var others = [];
            for (var p = 1; p <= r.pageCount; p++) if (p !== apwCurrentPage) others.push(p);
            return (others.length === 1 ? 'Page ' : 'Pages ') + others.join(', ');
        }

        function apwOtherPagesTail(r) {
            var t = apwOtherPagesText(r);
            return t ? ' ' + t + ' weren\u2019t touched.' : '';
        }

        // Apply to Selected — applies Quick Fill values only to checked rows on the current page.
        (function(){
            var selBtn = document.getElementById('apw-bulk-selected');
            if (!selBtn) return;
            selBtn.addEventListener('click', function() {
                var v = apwBulkFields();
                if (!v.any) { apwShowBulkResult('Pick at least one value above to fill', 'warn'); return; }
                var r = apwPageRange();
                var pickedIdx = [];
                for (var i = r.start; i < r.end; i++) if (apwUnitData[i]._selected) pickedIdx.push(i);
                if (pickedIdx.length === 0) { apwShowBulkResult('Tick at least one unit first', 'warn'); return; }
                var changed = 0;
                pickedIdx.forEach(function(i) {
                    var d = apwUnitData[i], touched = false;
                    if (v.beds  && d.beds  !== v.beds)  { d.beds  = v.beds;  touched = true; }
                    if (v.baths && d.baths !== v.baths) { d.baths = v.baths; touched = true; }
                    if (v.size  && d.size  !== v.size)  { d.size  = v.size;  touched = true; }
                    if (touched) changed++;
                });
                apwBuildTable(); apwUpdateProgress(); apwUpdateSelBadge();
                apwShowBulkResult('Applied ' + apwFormatList(v.labels) + ' to ' + changed + ' of ' + pickedIdx.length + ' selected unit' + (pickedIdx.length === 1 ? '' : 's'), 'ok');
            });
        })();

        (function(){
            var clearBtn = document.getElementById('apw-bulk-clear');
            if (clearBtn) clearBtn.addEventListener('click', function() {
                var r = apwPageRange();
                if (r.size === 0) { apwShowBulkResult('Nothing to clear', 'warn'); return; }
                var hadData = 0;
                for (var i = r.start; i < r.end; i++) {
                    var d = apwUnitData[i];
                    if (d.name || d.beds || d.baths || d.size) hadData++;
                    d.name = ''; d.beds = ''; d.baths = ''; d.size = ''; d._selected = false;
                }
                // Also reset the Quick Fill inputs themselves
                var bBeds = document.getElementById('apw-bulk-beds');  if (bBeds)  bBeds.value = '';
                var bBath = document.getElementById('apw-bulk-baths'); if (bBath)  bBath.value = '';
                var bSize = document.getElementById('apw-bulk-size');  if (bSize)  bSize.value = '';
                apwBuildTable(); apwUpdateProgress(); apwUpdateSelBadge();
                var pc = Math.max(1, Math.ceil(apwUnitData.length / APW_PAGE_SIZE));
                var scope = pc > 1 ? (' on page ' + apwCurrentPage) : '';
                apwShowBulkResult('Reset ' + hadData + ' unit' + (hadData === 1 ? '' : 's') + scope, 'ok');
            });
        })();

        function apwPopulateUnitsReview() {
            var section = document.getElementById('rv-units-section');
            var body    = document.getElementById('rv-units-body');
            if (!section || !body) return;
            if (selectedType !== 'Residential') { section.style.display = 'none'; return; }
            section.style.display = '';
            body.innerHTML = '';
            var tbl = '<table class="rv-units-table"><thead><tr><th>#</th><th>Name</th><th>Bed</th><th>Bath</th><th>Size</th></tr></thead><tbody>';
            apwUnitData.forEach(function(d, i) {
                var name = d.name || ('Unit ' + (i + 1));
                tbl += '<tr><td>' + (i + 1) + '</td><td>' + escHtml(name) + '</td><td>' + (d.beds || '—') + '</td><td>' + (d.baths || '—') + '</td><td>' + (d.size ? d.size + ' sq ft' : '—') + '</td></tr>';
            });
            tbl += '</tbody></table>';
            body.innerHTML = tbl;
        }

        document.getElementById('apw-btn-back').addEventListener('click', function() {
            if (currentStep > 1) {
                currentStep--;
                if (currentStep === 4 && selectedType !== 'Residential') currentStep--;
                apwRender();
            } else { window.apwClose(); }
        });

        document.getElementById('apw-btn-next').addEventListener('click', function() {
            if (currentStep < totalSteps) {
                currentStep++;
                if (currentStep === 4 && selectedType !== 'Residential') currentStep++;
                if (currentStep === 4) apwInitUnitStep();
                if (currentStep === totalSteps) { apwPopulateReview(); apwPopulateUnitsReview(); }
                apwRender();
            } else {
                document.getElementById('apw-success-msg').style.display = 'block';
                var btn = document.getElementById('apw-btn-next');
                btn.textContent = 'Done';
                btn.classList.add('finish');
                setTimeout(function() { window.apwClose(); }, 2000);
            }
        });

        document.getElementById('apw-close-top').addEventListener('click', window.apwClose);

        var openBtn = document.getElementById('btn-add-property');
        if (openBtn) openBtn.addEventListener('click', apwOpen);
    })();

    /* ══ SETUP UNIT WIZARD ══ */
    (function() {
        var overlay     = document.getElementById('suw-overlay');
        var totalSteps  = 5;
        var currentStep = 1;

        /* ── Units per property (generated) ── */
        var SUW_PROPERTY_UNITS = (function() {
            function pad(n) { return n < 10 ? '0' + n : '' + n; }
            var p1 = [];
            for (var f1 = 1; f1 <= 10; f1++)
                for (var u1 = 1; u1 <= 15; u1++)
                    p1.push('Unit ' + f1 + pad(u1));
            var p2 = [];
            ['A','B','C','D'].forEach(function(b) {
                for (var u2 = 101; u2 <= 150; u2++) p2.push('Bldg ' + b + '-' + u2);
            });
            var p3 = [];
            for (var s = 100; s <= 219; s++) p3.push('Suite ' + s);
            var p4 = [];
            for (var f4 = 1; f4 <= 30; f4++)
                ['A','B','C','D','E','F'].forEach(function(u) { p4.push('Unit ' + f4 + u); });
            var p5 = [];
            for (var u5 = 101; u5 <= 200; u5++) p5.push('Apt ' + u5);
            return {
                '5553 A Janson Avenue': p1,
                '433 B Nathan Square':  p2,
                '9343 C City Gardens':  p3,
                '7821 D Oak Boulevard': p4,
                '2210 E Pine Street':   p5,
                '1045 F Maple Court':   ['Cottage A','Cottage B','Cottage C','Cottage D','Cottage E'],
                '3380 G River Road':    ['Unit 100','Unit 101','Unit 102','Unit 200','Unit 201','Unit 202','Unit 300'],
                '6612 H Sunset Drive':  ['Studio 1','Studio 2','Studio 3','One Bed A','One Bed B','Two Bed A','Two Bed B']
            };
        })();

        /* ── Amenity data ── */
        var SUW_AMENITIES = {
            'Interior': ['Air Conditioning','Heating','Ceiling Fans','Hardwood Floors','Carpet','Tile Floors','Walk-in Closet','Linen Closet','In-Unit Washer/Dryer','Washer/Dryer Hookups','Dishwasher','Garbage Disposal','Microwave','Refrigerator','Stove/Range','Oven','Fireplace','Balcony/Patio','Private Yard','Storage Room'],
            'Bathroom': ['Walk-in Shower','Bathtub','Double Vanity','Soaking Tub','Bidet'],
            'Kitchen':  ['Granite Countertops','Quartz Countertops','Kitchen Island','Breakfast Bar','Stainless Steel Appliances','Gas Range','Double Oven'],
            'Tech & Utilities': ['High-Speed Internet','Cable Ready','Smart Thermostat','Smart Lock','EV Charging','Solar Panels'],
            'Accessibility': ['Wheelchair Accessible','Roll-in Shower','Grab Bars','First Floor Unit','Elevator Access']
        };
        var suwSelectedAmenities = new Set();

        function suwRenderAmenityChips() {
            var grid = document.getElementById('suw-am-grid-body');
            if (!grid) return;
            var html = '';
            Object.keys(SUW_AMENITIES).forEach(function(cat) {
                html += '<div class="suw-am-cat-title">' + cat + '</div><div class="suw-am-chip-row">';
                SUW_AMENITIES[cat].forEach(function(item) {
                    var sel = suwSelectedAmenities.has(item) ? ' selected' : '';
                    html += '<button class="suw-am-chip' + sel + '" data-am="' + item + '">' + item + '</button>';
                });
                html += '</div>';
            });
            grid.innerHTML = html;
            grid.querySelectorAll('.suw-am-chip').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var am = this.dataset.am;
                    if (suwSelectedAmenities.has(am)) { suwSelectedAmenities.delete(am); this.classList.remove('selected'); }
                    else { suwSelectedAmenities.add(am); this.classList.add('selected'); }
                    suwRenderSelStrip();
                });
            });
        }

        function suwRenderSelStrip() {
            var strip = document.getElementById('suw-am-sel-strip');
            if (!strip) return;
            if (suwSelectedAmenities.size === 0) {
                strip.innerHTML = '<span class="suw-am-sel-placeholder">No amenities selected yet</span>';
                return;
            }
            var html = '';
            suwSelectedAmenities.forEach(function(am) {
                html += '<span class="suw-am-sel-tag">' + am + '<button data-am="' + am + '" title="Remove">&#x2715;</button></span>';
            });
            strip.innerHTML = html;
            strip.querySelectorAll('button').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var am = this.dataset.am;
                    suwSelectedAmenities.delete(am);
                    var chip = document.querySelector('#suw-am-grid-body .suw-am-chip[data-am="' + am + '"]');
                    if (chip) chip.classList.remove('selected');
                    suwRenderSelStrip();
                });
            });
        }

        /* ── Photo upload ── */
        var suwPhotos = [];

        function suwRenderPhotoGrid() {
            var grid = document.getElementById('suw-uploaded-grid');
            if (!grid) return;
            if (suwPhotos.length === 0) { grid.innerHTML = ''; return; }
            var html = '';
            suwPhotos.forEach(function(p, i) {
                html += '<div class="suw-media-card">'
                    + '<img src="' + p.url + '" alt="photo">'
                    + '<div class="suw-media-tag-row">'
                    + '<span class="suw-media-tag-label">Tag:</span>'
                    + '<select class="suw-media-tag-select" data-idx="' + i + '">'
                    + ['Primary','Living Room','Bedroom','Bathroom','Kitchen','Dining Room','Balcony/Patio','Exterior','Other'].map(function(t){
                        return '<option' + (p.tag===t?' selected':'') + '>' + t + '</option>';
                      }).join('')
                    + '</select>'
                    + '<button class="suw-media-remove" data-idx="' + i + '" title="Remove">&#x2715;</button>'
                    + '</div></div>';
            });
            grid.innerHTML = html;
            grid.querySelectorAll('.suw-media-tag-select').forEach(function(sel) {
                sel.addEventListener('change', function() { suwPhotos[+this.dataset.idx].tag = this.value; });
            });
            grid.querySelectorAll('.suw-media-remove').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    suwPhotos.splice(+this.dataset.idx, 1);
                    suwRenderPhotoGrid();
                });
            });
        }

        function suwHandleFiles(files) {
            Array.from(files).forEach(function(file) {
                if (!file.type.startsWith('image/')) return;
                var reader = new FileReader();
                reader.onload = function(e) {
                    suwPhotos.push({ url: e.target.result, tag: suwPhotos.length === 0 ? 'Primary' : 'Living Room' });
                    suwRenderPhotoGrid();
                };
                reader.readAsDataURL(file);
            });
        }

        function suwPopulateUnitDropdown(propName) {
            var unitSel = document.getElementById('suw-unit-select');
            if (!unitSel) return;
            var units = SUW_PROPERTY_UNITS[propName] || [];
            unitSel.innerHTML = '<option value="">— Select a unit —</option>'
                + units.map(function(u) { return '<option>' + u + '</option>'; }).join('');
            unitSel.style.borderColor = '';
        }

        function suwOpen() {
            currentStep = 1;
            suwSelectedAmenities.clear();
            suwPhotos = [];
            document.getElementById('suw-success-msg').style.display = 'none';
            var propSel = document.getElementById('suw-property-select');
            if (propSel) { propSel.value = ''; propSel.style.borderColor = ''; }
            suwPopulateUnitDropdown(''); // reset to empty
            var editNameEl = document.getElementById('suw-edit-unit-name');
            if (editNameEl) { editNameEl.value = ''; editNameEl.style.borderColor = ''; }
            document.getElementById('suw-btn-next').classList.remove('finish');
            document.getElementById('suw-btn-next').textContent = 'Next';
            suwRender();
            overlay.classList.add('open');
            overlay.scrollTop = 0;
            document.body.style.overflow = 'hidden';
        }
        function suwClose() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }
        window.suwClose = suwClose;

        function suwRender() {
            document.querySelectorAll('#suw-overlay .apw-step').forEach(function(el) {
                var s = parseInt(el.dataset.step);
                el.classList.toggle('active',    s === currentStep);
                el.classList.toggle('completed', s < currentStep);
                var circle = el.querySelector('.apw-step-circle');
                if (s < currentStep) {
                    circle.innerHTML = '<i class="fas fa-check" style="font-size:11px;"></i>';
                } else { circle.textContent = s; }
            });
            document.querySelectorAll('#suw-overlay .apw-step-content').forEach(function(el) {
                el.classList.toggle('active', parseInt(el.dataset.step) === currentStep);
            });
            document.getElementById('suw-step-label').textContent = 'Step ' + currentStep + ' of ' + totalSteps;
            var btnNext = document.getElementById('suw-btn-next');
            if (currentStep === totalSteps) {
                btnNext.textContent = 'Submit';
                btnNext.classList.add('finish');
            } else {
                btnNext.textContent = 'Next';
                btnNext.classList.remove('finish');
            }
            document.getElementById('suw-btn-back').style.visibility = currentStep === 1 ? 'hidden' : 'visible';
            if (currentStep === 3) { suwRenderAmenityChips(); suwRenderSelStrip(); }
            if (currentStep === 4) suwRenderPhotoGrid();
            overlay.scrollTop = 0;
        }

        function suwPopulateReview() {
            function v(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
            var propSel = document.getElementById('suw-property-select');
            document.getElementById('suw-rv-property').textContent  = (propSel && propSel.value) ? propSel.options[propSel.selectedIndex].text : '—';
            document.getElementById('suw-rv-name').textContent      = v('suw-edit-unit-name') || '—';
            document.getElementById('suw-rv-beds').textContent      = v('suw-beds')      || '—';
            document.getElementById('suw-rv-baths').textContent     = v('suw-baths')     || '—';
            document.getElementById('suw-rv-size').textContent      = v('suw-size') ? v('suw-size') + ' sq ft' : '—';
            var amCount = suwSelectedAmenities.size;
            document.getElementById('suw-rv-amenities').textContent = amCount > 0 ? amCount + ' amenit' + (amCount === 1 ? 'y' : 'ies') + ' selected' : '—';
            var phCount = suwPhotos.length;
            document.getElementById('suw-rv-photos').textContent    = phCount > 0 ? phCount + ' photo' + (phCount === 1 ? '' : 's') + ' uploaded' : '—';
        }

        /* Photo drop zone */
        var dropZone = document.getElementById('suw-photo-drop');
        var photoInput = document.getElementById('suw-photo-input');
        if (dropZone) {
            dropZone.addEventListener('click', function() { photoInput.click(); });
            dropZone.addEventListener('dragover', function(e) { e.preventDefault(); dropZone.classList.add('drag-over'); });
            dropZone.addEventListener('dragleave', function() { dropZone.classList.remove('drag-over'); });
            dropZone.addEventListener('drop', function(e) { e.preventDefault(); dropZone.classList.remove('drag-over'); suwHandleFiles(e.dataTransfer.files); });
        }
        if (photoInput) photoInput.addEventListener('change', function() { suwHandleFiles(this.files); this.value=''; });

        // Populate unit dropdown when property is selected
        var propSelEl = document.getElementById('suw-property-select');
        if (propSelEl) {
            propSelEl.addEventListener('change', function() {
                suwPopulateUnitDropdown(this.value);
            });
        }

        document.getElementById('suw-btn-back').addEventListener('click', function() {
            if (currentStep > 1) { currentStep--; suwRender(); }
            else suwClose();
        });

        document.getElementById('suw-btn-next').addEventListener('click', function() {
            if (currentStep < totalSteps) {
                // Step 1 validation: Property and Unit required
                if (currentStep === 1) {
                    var propSel = document.getElementById('suw-property-select');
                    var unitSel = document.getElementById('suw-unit-select');
                    if (!propSel || !propSel.value) { propSel && (propSel.style.borderColor = '#E53E3E'); propSel && propSel.focus(); return; }
                    if (!unitSel || !unitSel.value) { unitSel && (unitSel.style.borderColor = '#E53E3E'); unitSel && unitSel.focus(); return; }
                    propSel.style.borderColor = '';
                    unitSel.style.borderColor = '';
                    // Pre-fill editable Unit Name in Step 2
                    var editNameEl = document.getElementById('suw-edit-unit-name');
                    if (editNameEl) editNameEl.value = unitSel.value;
                }
                if (currentStep === totalSteps - 1) suwPopulateReview();
                currentStep++;
                suwRender();
            } else {
                document.getElementById('suw-success-msg').style.display = 'block';
                var btn = document.getElementById('suw-btn-next');
                btn.textContent = 'Done';
                btn.classList.add('finish');
                setTimeout(function() { suwClose(); }, 2000);
            }
        });

        document.getElementById('suw-close-top').addEventListener('click', suwClose);
    })();

    /* ══ BULK SETUP UNIT WIZARD ══ */
    (function() {
        var overlay     = document.getElementById('bsuw-overlay');
        var totalSteps  = 3;
        var currentStep = 1;
        var BSUW_PAGE_SIZE = 20;
        var bsuwCurrentPage = 1;
        var bsuwUnitData = [];          // [{name,beds,baths,size,strat,rent,desc,_selected,amenities:[]}]
        var bsuwSelectedAmenities = new Set(); // legacy — unused by new tri-state flow but kept for any external refs
        var bsuwChipActions = {};       // { amenity: 'add' | 'remove' } — pending changes before Save
        var bsuwApplyToAll = true;      // true = all units, false = selected units

        /* ─── Units per property (generated) ─── */
        var BSUW_PROPERTY_UNITS = (function() {
            function pad(n) { return n < 10 ? '0' + n : '' + n; }
            // 5553 A Janson Avenue – 150 units: 10 floors × 15 units per floor
            var p1 = [];
            for (var f1 = 1; f1 <= 10; f1++)
                for (var u1 = 1; u1 <= 15; u1++)
                    p1.push('Unit ' + f1 + pad(u1));
            // 433 B Nathan Square – 200 units: 4 buildings (A–D) × 50 units each
            var p2 = [];
            ['A','B','C','D'].forEach(function(b) {
                for (var u2 = 101; u2 <= 150; u2++) p2.push('Bldg ' + b + '-' + u2);
            });
            // 9343 C City Gardens – 120 units: Suite 100–219
            var p3 = [];
            for (var s = 100; s <= 219; s++) p3.push('Suite ' + s);
            // 7821 D Oak Boulevard – 180 units: 30 floors × 6 units per floor (A–F)
            var p4 = [];
            for (var f4 = 1; f4 <= 30; f4++)
                ['A','B','C','D','E','F'].forEach(function(u) { p4.push('Unit ' + f4 + u); });
            // 2210 E Pine Street – 100 units: Apt 101–200
            var p5 = [];
            for (var u5 = 101; u5 <= 200; u5++) p5.push('Apt ' + u5);
            return {
                '5553 A Janson Avenue': p1,  // 150 units
                '433 B Nathan Square':  p2,  // 200 units
                '9343 C City Gardens':  p3,  // 120 units
                '7821 D Oak Boulevard': p4,  // 180 units
                '2210 E Pine Street':   p5,  // 100 units
                '1045 F Maple Court':   ['Cottage A','Cottage B','Cottage C','Cottage D','Cottage E'],
                '3380 G River Road':    ['Unit 100','Unit 101','Unit 102','Unit 200','Unit 201','Unit 202','Unit 300'],
                '6612 H Sunset Drive':  ['Studio 1','Studio 2','Studio 3','One Bed A','One Bed B','Two Bed A','Two Bed B']
            };
        })();

        /* ─── Amenity data ─── */
        var BSUW_AMENITIES = {
            'Interior':          ['Air Conditioning','Heating','Ceiling Fans','Hardwood Floors','Carpet','Tile Floors','Walk-in Closet','Linen Closet','In-Unit Washer/Dryer','Washer/Dryer Hookups','Dishwasher','Garbage Disposal','Microwave','Refrigerator','Stove/Range','Oven','Fireplace','Balcony/Patio','Private Yard','Storage Room'],
            'Bathroom':          ['Walk-in Shower','Bathtub','Double Vanity','Soaking Tub','Bidet'],
            'Kitchen':           ['Granite Countertops','Quartz Countertops','Kitchen Island','Breakfast Bar','Stainless Steel Appliances','Gas Range','Double Oven'],
            'Tech & Utilities':  ['High-Speed Internet','Cable Ready','Smart Thermostat','Smart Lock','EV Charging','Solar Panels'],
            'Accessibility':     ['Wheelchair Accessible','Roll-in Shower','Grab Bars','First Floor Unit','Elevator Access']
        };

        /* ─── Helpers ─── */
        function escAttr(s) { return (s||'').replace(/"/g,'&quot;'); }
        function escHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

        function show(id) { var el=document.getElementById(id); if(el) el.classList.remove('bsuw-hidden'); }
        function hide(id) { var el=document.getElementById(id); if(el) el.classList.add('bsuw-hidden'); }

        /* ─── Unit table ─── */
        function bsuwBuildTable() {
            var tbody  = document.getElementById('bsuw-ut-tbody');
            if (!tbody) return;
            var total  = bsuwUnitData.length;
            var BED_OPTS   = ['','Studio','1','2','3','4','5','6+'];
            var BATH_OPTS  = ['','1','1.5','2','2.5','3','3+'];
            var usePag = total > BSUW_PAGE_SIZE;
            var startIdx = usePag ? (bsuwCurrentPage-1)*BSUW_PAGE_SIZE : 0;
            var endIdx   = usePag ? Math.min(startIdx+BSUW_PAGE_SIZE, total) : total;

            var pag = document.getElementById('bsuw-ut-pagination');
            if (pag) pag.classList.toggle('visible', usePag);
            if (usePag) {
                var pc = Math.ceil(total / BSUW_PAGE_SIZE);
                var info = document.getElementById('bsuw-ut-page-info');
                var prevBtn = document.getElementById('bsuw-ut-prev');
                var nextBtn = document.getElementById('bsuw-ut-next');
                if (info) info.textContent = 'Showing ' + (startIdx+1)+' – '+endIdx+' of '+total + '  (page ' + bsuwCurrentPage + ' of ' + pc + ')';
                if (prevBtn) prevBtn.disabled = bsuwCurrentPage <= 1;
                if (nextBtn) nextBtn.disabled = endIdx >= total;
            }

            tbody.innerHTML = '';
            for (var i = startIdx; i < endIdx; i++) {
                (function(idx) {
                    var d  = bsuwUnitData[idx];
                    var tr = document.createElement('tr');
                    tr.dataset.unitIdx = idx;
                    var isFilled = d.beds && d.baths && d.size;
                    if (isFilled) tr.classList.add('apw-ut-filled');
                    if (d._selected) tr.classList.add('apw-ut-selected');
                    tr.innerHTML =
                        '<td style="text-align:center;"><label class="apw-chk-wrap"><input type="checkbox" class="bsuw-ichk"'+(d._selected?' checked':'')+
                        '><span class="apw-chk-box"></span></label></td>'+
                        '<td style="text-align:center;"><div class="apw-ut-num">'+(idx+1)+'</div></td>'+
                        '<td><input type="text" class="bsuw-iname" value="'+escAttr(d.name)+'" placeholder="Unit '+(idx+1)+'"></td>'+
                        '<td><select class="bsuw-ibeds">'+BED_OPTS.map(function(o){return '<option value="'+o+'"'+(o===d.beds?' selected':'')+'>'+(o||'Select')+'</option>';}).join('')+'</select></td>'+
                        '<td><select class="bsuw-ibaths">'+BATH_OPTS.map(function(o){return '<option value="'+o+'"'+(o===d.baths?' selected':'')+'>'+(o||'Select')+'</option>';}).join('')+'</select></td>'+
                        '<td><input type="text" class="bsuw-isize" value="'+escAttr(d.size)+'" placeholder="e.g. 850"></td>';

                    tr.querySelector('.bsuw-ichk').addEventListener('change', function() {
                        bsuwUnitData[idx]._selected = this.checked;
                        tr.classList.toggle('apw-ut-selected', this.checked);
                        bsuwSyncSelectAll();
                        bsuwUpdateSelBadge();
                    });
                    function bind(cls, key, evt) {
                        var el = tr.querySelector('.'+cls);
                        if (!el) return;
                        el.addEventListener(evt, function() {
                            bsuwUnitData[idx][key] = this.value;
                            var nd = bsuwUnitData[idx];
                            var nowFilled = nd.beds && nd.baths && nd.size;
                            tr.classList.toggle('apw-ut-filled', !!nowFilled);
                            bsuwUpdateProgress();
                        });
                    }
                    bind('bsuw-iname','name','input');
                    bind('bsuw-ibeds','beds','change');
                    bind('bsuw-ibaths','baths','change');
                    bind('bsuw-isize','size','input');
                    tbody.appendChild(tr);
                })(i);
            }
            bsuwSyncSelectAll();
            bsuwUpdateSelBadge();
        }

        function bsuwUpdateSelBadge() {
            var total = bsuwUnitData.length;
            var usePag = total > BSUW_PAGE_SIZE;
            var s = usePag ? (bsuwCurrentPage - 1) * BSUW_PAGE_SIZE : 0;
            var e = usePag ? Math.min(s + BSUW_PAGE_SIZE, total) : total;
            var count = 0;
            for (var i = s; i < e; i++) if (bsuwUnitData[i]._selected) count++;
            var btn = document.getElementById('bsuw-bulk-selected');
            var lbl = document.getElementById('bsuw-qf-sel-label');
            if (lbl) lbl.textContent = 'Apply to Selected (' + count + ')';
            if (btn) btn.disabled = (count === 0);
        }

        function bsuwUpdateProgress() {
            var total = bsuwUnitData.length;
            var pc = Math.max(1, Math.ceil(total / BSUW_PAGE_SIZE));
            var pageStart = (bsuwCurrentPage - 1) * BSUW_PAGE_SIZE;
            var pageEnd   = Math.min(pageStart + BSUW_PAGE_SIZE, total);
            var pageSize  = pageEnd - pageStart;
            // Update QF subtitle with page scope
            var qfSub = document.getElementById('bsuw-qf-sub');
            if (qfSub) {
                if (pc > 1) {
                    qfSub.innerHTML = 'Tick units below, then fill the <strong>' + pageSize + ' on page ' + bsuwCurrentPage + '</strong> of ' + pc;
                } else {
                    qfSub.innerHTML = 'Tick units below, then apply values to your selection';
                }
            }
        }
        function bsuwShowBulkResult(msg, type) {
            var banner = document.getElementById('bsuw-bulk-result');
            var icon   = banner ? banner.querySelector('i.fas') : null;
            var msgEl  = document.getElementById('bsuw-bulk-result-msg');
            if (!banner) return;
            banner.classList.remove('warn', 'err');
            if (type === 'warn') banner.classList.add('warn');
            else if (type === 'err') banner.classList.add('err');
            if (icon) icon.className = 'fas ' + (type === 'warn' ? 'fa-exclamation-triangle' : type === 'err' ? 'fa-times-circle' : 'fa-check-circle');
            if (msgEl) msgEl.textContent = msg;
            banner.classList.add('show');
        }
        (function(){
            var cb = document.getElementById('bsuw-bulk-result-close');
            if (cb) cb.addEventListener('click', function() {
                var b = document.getElementById('bsuw-bulk-result');
                if (b) b.classList.remove('show');
            });
        })();
        function bsuwFmtList(arr) {
            if (arr.length === 0) return '';
            if (arr.length === 1) return arr[0];
            if (arr.length === 2) return arr[0] + ' and ' + arr[1];
            return arr.slice(0, -1).join(', ') + ', and ' + arr[arr.length - 1];
        }

        function bsuwSyncSelectAll() {
            var chkAll = document.getElementById('bsuw-chk-all');
            if (!chkAll) return;
            var total = bsuwUnitData.length;
            var usePag = total > BSUW_PAGE_SIZE;
            var s = usePag ? (bsuwCurrentPage - 1) * BSUW_PAGE_SIZE : 0;
            var e = usePag ? Math.min(s + BSUW_PAGE_SIZE, total) : total;
            var pageSize = e - s;
            var picked = 0;
            for (var i = s; i < e; i++) if (bsuwUnitData[i]._selected) picked++;
            chkAll.checked = pageSize > 0 && picked === pageSize;
            chkAll.indeterminate = picked > 0 && picked < pageSize;
        }

        /* ─── Load units for selected property ─── */
        function bsuwGenerate(propName) {
            var unitNames = BSUW_PROPERTY_UNITS[propName] || [];
            bsuwUnitData = unitNames.map(function(name) {
                return { name: name, beds:'', baths:'', size:'', _selected:false, amenities:[] };
            });
            if (bsuwUnitData.length === 0) return;
            bsuwCurrentPage = 1;
            bsuwBuildTable();
            bsuwUpdateProgress();
            bsuwUpdateSelBadge();
            var qfCard = document.getElementById('bsuw-qf-card');
            if (qfCard) qfCard.classList.add('visible');
            show('bsuw-ut-wrap');
            // Hide any stale result banner from a previous property
            var br = document.getElementById('bsuw-bulk-result');
            if (br) br.classList.remove('show');
        }

        /* ─── Bulk edit actions ─── */
        function bsuwBulkVals() {
            var v = {
                beds:  document.getElementById('bsuw-bulk-beds').value,
                baths: document.getElementById('bsuw-bulk-baths').value,
                size:  document.getElementById('bsuw-bulk-size').value.trim()
            };
            var labels = [];
            if (v.beds)  labels.push('Bed');
            if (v.baths) labels.push('Bath');
            if (v.size)  labels.push('Size');
            v.labels = labels;
            v.any = labels.length > 0;
            return v;
        }
        function bsuwRemainingEmpty() {
            return bsuwUnitData.filter(function(d){ return !d.beds || !d.baths || !d.size; }).length;
        }
        function bsuwPageRange() {
            var total = bsuwUnitData.length;
            var s = (bsuwCurrentPage - 1) * BSUW_PAGE_SIZE;
            var e = Math.min(s + BSUW_PAGE_SIZE, total);
            return { start: s, end: e, size: e - s, total: total, pageCount: Math.max(1, Math.ceil(total / BSUW_PAGE_SIZE)) };
        }
        function bsuwOtherPagesText(r) {
            if (r.pageCount <= 1) return '';
            var others = [];
            for (var p = 1; p <= r.pageCount; p++) if (p !== bsuwCurrentPage) others.push(p);
            return (others.length === 1 ? 'Page ' : 'Pages ') + others.join(', ');
        }
        function bsuwOtherPagesTail(r, verb) {
            verb = verb || 'weren\u2019t touched';
            var t = bsuwOtherPagesText(r);
            return t ? ' ' + t + ' ' + verb + '.' : '';
        }

        /* Apply to Selected — the only fill action */
        (function(){
            var selBtn = document.getElementById('bsuw-bulk-selected');
            if (!selBtn) return;
            selBtn.addEventListener('click', function() {
                var v = bsuwBulkVals();
                if (bsuwUnitData.length === 0) { bsuwShowBulkResult('Select a property first', 'warn'); return; }
                if (!v.any) { bsuwShowBulkResult('Pick at least one value above to fill', 'warn'); return; }
                var r = bsuwPageRange(), pageSelIdx = [];
                for (var i = r.start; i < r.end; i++) if (bsuwUnitData[i]._selected) pageSelIdx.push(i);
                if (pageSelIdx.length === 0) { bsuwShowBulkResult('Tick at least one unit first', 'warn'); return; }
                var changed = 0;
                pageSelIdx.forEach(function(i) {
                    var d = bsuwUnitData[i], touched = false;
                    if (v.beds  && d.beds  !== v.beds)  { d.beds  = v.beds;  touched = true; }
                    if (v.baths && d.baths !== v.baths) { d.baths = v.baths; touched = true; }
                    if (v.size  && d.size  !== v.size)  { d.size  = v.size;  touched = true; }
                    if (touched) changed++;
                });
                bsuwBuildTable(); bsuwUpdateProgress(); bsuwUpdateSelBadge();
                bsuwShowBulkResult('Applied ' + bsuwFmtList(v.labels) + ' to ' + changed + ' of ' + pageSelIdx.length + ' selected unit' + (pageSelIdx.length === 1 ? '' : 's'), 'ok');
            });
        })();

        /* Reset page — clears Bed/Bath/Size on all rows of the current page */
        (function(){
            var clearBtn = document.getElementById('bsuw-bulk-clear');
            if (!clearBtn) return;
            clearBtn.addEventListener('click', function() {
                if (bsuwUnitData.length === 0) { bsuwShowBulkResult('Select a property first', 'warn'); return; }
                var r = bsuwPageRange(), hadData = 0;
                for (var i = r.start; i < r.end; i++) {
                    var d = bsuwUnitData[i];
                    if (d.beds || d.baths || d.size) hadData++;
                    d.beds = d.baths = d.size = ''; d._selected = false;
                }
                // Reset Quick Fill inputs too
                var bBeds = document.getElementById('bsuw-bulk-beds');  if (bBeds)  bBeds.value = '';
                var bBath = document.getElementById('bsuw-bulk-baths'); if (bBath)  bBath.value = '';
                var bSize = document.getElementById('bsuw-bulk-size');  if (bSize)  bSize.value = '';
                bsuwBuildTable(); bsuwUpdateProgress(); bsuwUpdateSelBadge();
                var pc = Math.max(1, Math.ceil(bsuwUnitData.length / BSUW_PAGE_SIZE));
                var scope = pc > 1 ? (' on page ' + bsuwCurrentPage) : '';
                bsuwShowBulkResult('Reset ' + hadData + ' unit' + (hadData === 1 ? '' : 's') + scope, 'ok');
            });
        })();

        /* Select-all header checkbox — toggles current page only */
        (function(){
            var chkAll = document.getElementById('bsuw-chk-all');
            if (!chkAll) return;
            chkAll.addEventListener('change', function() {
                var on = this.checked;
                var total = bsuwUnitData.length;
                var usePag = total > BSUW_PAGE_SIZE;
                var s = usePag ? (bsuwCurrentPage - 1) * BSUW_PAGE_SIZE : 0;
                var e = usePag ? Math.min(s + BSUW_PAGE_SIZE, total) : total;
                for (var i = s; i < e; i++) bsuwUnitData[i]._selected = on;
                bsuwBuildTable();
                bsuwUpdateSelBadge();
            });
        })();

        /* Pagination */
        (function(){
            var prevBtn = document.getElementById('bsuw-ut-prev');
            var nextBtn = document.getElementById('bsuw-ut-next');
            if (prevBtn) prevBtn.addEventListener('click', function() {
                if (bsuwCurrentPage > 1) { bsuwCurrentPage--; bsuwBuildTable(); bsuwUpdateProgress(); bsuwUpdateSelBadge(); }
            });
            if (nextBtn) nextBtn.addEventListener('click', function() {
                if ((bsuwCurrentPage * BSUW_PAGE_SIZE) < bsuwUnitData.length) { bsuwCurrentPage++; bsuwBuildTable(); bsuwUpdateProgress(); bsuwUpdateSelBadge(); }
            });
        })();

        /* Auto-load units when a property is selected */
        document.getElementById('bsuw-property-select').addEventListener('change', function() {
            var propName = this.value;
            // Reset state before loading
            bsuwUnitData = [];
            bsuwSelectedAmenities.clear();
            bsuwChipActions = {};
            bsuwCurrentPage = 1;
            bsuw2Page = 1;
            hide('bsuw-ut-wrap');
            var qfC = document.getElementById('bsuw-qf-card'); if (qfC) qfC.classList.remove('visible');
            var br = document.getElementById('bsuw-bulk-result');
            if (br) br.classList.remove('show');
            var bBeds = document.getElementById('bsuw-bulk-beds');  if (bBeds)  bBeds.value = '';
            var bBath = document.getElementById('bsuw-bulk-baths'); if (bBath)  bBath.value = '';
            var bSize = document.getElementById('bsuw-bulk-size');  if (bSize)  bSize.value = '';
            this.style.borderColor = propName ? '' : '#E53E3E';
            if (propName) bsuwGenerate(propName);
        });

        /* ─── Step 2: Two-panel amenity editor ───
           Left  = paginated unit list with row checkboxes.
           Right = ALL amenity categories + subcategories visible as chips at once — no horizontal scroll.

           Scope rule: if any units are ticked → scope = those units.
                       if nothing ticked      → scope = ALL units.
           Chip states (for the current scope):
             state-all  = every unit in scope has this amenity (green ✓)
             state-some = only some units have it             (amber −)
             state-none = no units have it                    (grey  +)
           Click: all → remove from scope.  some/none → add to scope.
        */
        var BSUW2_PAGE_SIZE = 20;
        var bsuw2Page = 1;
        /* Keep old matrix vars so bsuwOpen() reset code compiles without errors */
        var bsuwMatPage = 1, bsuwMatColFilter = '', bsuwPickedCols = new Set();

        /* Return the units that are currently "in scope". */
        function bsuw2Scope() {
            var sel = bsuwUnitData.filter(function(u) { return u._selected; });
            return sel.length > 0 ? sel : bsuwUnitData;
        }

        /* Returns 'all', 'some', or 'none' for the current scope. */
        function bsuw2AmState(am) {
            var scope = bsuw2Scope();
            if (!scope.length) return 'none';
            var has = scope.filter(function(u) {
                return (u.amenities || []).indexOf(am) !== -1;
            }).length;
            if (has === scope.length) return 'all';
            if (has === 0) return 'none';
            return 'some';
        }

        /* Update scope bar, All-Units row, selall checkbox, and sel-count badge. */
        function bsuw2UpdateScopeBar() {
            var total  = bsuwUnitData.length;
            var selN   = bsuwUnitData.filter(function(u) { return u._selected; }).length;
            var label  = document.getElementById('bsuw2-scope-label');
            var clrBtn = document.getElementById('bsuw2-clear-sel');
            var badge  = document.getElementById('bsuw2-sel-count');
            var allChk = document.getElementById('bsuw2-selall-chk');
            var allRow = document.getElementById('bsuw2-allunits-row');
            var allCnt = document.getElementById('bsuw2-allunits-cnt');
            var isAllScope = (selN === 0);
            if (label) {
                label.textContent = isAllScope
                    ? 'All ' + total + ' unit' + (total === 1 ? '' : 's')
                    : selN + ' selected unit' + (selN === 1 ? '' : 's');
            }
            if (clrBtn) clrBtn.style.display = selN > 0 ? 'inline-flex' : 'none';
            if (badge)  badge.textContent    = selN > 0 ? selN + ' selected' : 'none selected';
            if (allChk) {
                allChk.checked       = total > 0 && selN === total;
                allChk.indeterminate = selN > 0  && selN < total;
            }
            /* All Units row: active (blue) when scope = all, inactive when specific units picked */
            if (allRow) allRow.classList.toggle('active', isAllScope);
            if (allCnt) allCnt.textContent = total;
        }

        /* Render the unit list for the current page. */
        function bsuw2RenderUnits() {
            var list = document.getElementById('bsuw2-unit-list');
            if (!list) return;
            if (!bsuwUnitData.length) {
                list.innerHTML = '<div class="bsuw2-no-units">No units yet.<br>Pick a property in Step 1.</div>';
                var pgInfo = document.getElementById('bsuw2-pg-info');
                var prev   = document.getElementById('bsuw2-prev');
                var nxt    = document.getElementById('bsuw2-next');
                if (pgInfo) pgInfo.textContent = '— / —';
                if (prev)   prev.disabled = true;
                if (nxt)    nxt.disabled  = true;
                bsuw2UpdateScopeBar();
                return;
            }
            var total = bsuwUnitData.length;
            var pc = Math.max(1, Math.ceil(total / BSUW2_PAGE_SIZE));
            if (bsuw2Page > pc) bsuw2Page = pc;
            if (bsuw2Page < 1)  bsuw2Page = 1;
            var s = (bsuw2Page - 1) * BSUW2_PAGE_SIZE;
            var e = Math.min(s + BSUW2_PAGE_SIZE, total);
            var html = '';
            for (var i = s; i < e; i++) {
                var d    = bsuwUnitData[i];
                var name = d.name || ('Unit ' + (i + 1));
                html += '<div class="bsuw2-unit-row' + (d._selected ? ' sel' : '') + '" data-idx="' + i + '">' +
                    '<input type="checkbox" class="bsuw2-unit-chk"' + (d._selected ? ' checked' : '') + '>' +
                    '<span>' + escHtml(name) + '</span>' +
                    '</div>';
            }
            list.innerHTML = html;
            var pgInfo = document.getElementById('bsuw2-pg-info');
            var prev   = document.getElementById('bsuw2-prev');
            var nxt    = document.getElementById('bsuw2-next');
            if (pgInfo) pgInfo.textContent = bsuw2Page + ' / ' + pc;
            if (prev)   prev.disabled = bsuw2Page <= 1;
            if (nxt)    nxt.disabled  = bsuw2Page >= pc;
            bsuw2UpdateScopeBar();
        }

        /* Render (or re-render) the amenity category chips for the current scope. */
        function bsuw2RenderAmenities() {
            var grid = document.getElementById('bsuw2-am-grid');
            if (!grid) return;
            if (!bsuwUnitData.length) { grid.innerHTML = ''; return; }
            var html = '';
            Object.keys(BSUW_AMENITIES).forEach(function(cat) {
                html += '<div class="bsuw2-cat-section" data-cat="' + escHtml(cat) + '">';
                html += '<div class="bsuw2-cat-title">' + escHtml(cat) + '</div>';
                html += '<div class="bsuw2-am-chips">';
                BSUW_AMENITIES[cat].forEach(function(am) {
                    var st = bsuw2AmState(am);
                    html += '<button type="button" class="bsuw2-am-chip state-' + st +
                        '" data-am="' + escHtml(am) + '">' + escHtml(am) + '</button>';
                });
                html += '</div></div>';
            });
            grid.innerHTML = html;
        }

        /* Master render — called by bsuwRender() when stepping to Step 2. */
        function bsuwRenderMatrix() {
            bsuw2RenderUnits();
            bsuw2RenderAmenities();
        }

        /* ── Unit list: row click toggles selection ── */
        (function() {
            var listEl = document.getElementById('bsuw2-unit-list');
            if (!listEl) return;
            listEl.addEventListener('click', function(e) {
                var row = e.target.closest ? e.target.closest('.bsuw2-unit-row') : null;
                if (!row) return;
                var idx = parseInt(row.dataset.idx, 10);
                if (isNaN(idx) || idx < 0 || idx >= bsuwUnitData.length) return;
                bsuwUnitData[idx]._selected = !bsuwUnitData[idx]._selected;
                row.classList.toggle('sel', bsuwUnitData[idx]._selected);
                var chk = row.querySelector('.bsuw2-unit-chk');
                if (chk) chk.checked = bsuwUnitData[idx]._selected;
                bsuw2UpdateScopeBar();
                bsuw2RenderAmenities();
            });
        })();

        /* ── Select-all checkbox ── */
        (function() {
            var chk = document.getElementById('bsuw2-selall-chk');
            if (!chk) return;
            chk.addEventListener('change', function() {
                var on = this.checked;
                bsuwUnitData.forEach(function(u) { u._selected = on; });
                bsuw2RenderUnits();
                bsuw2RenderAmenities();
            });
        })();

        /* ── Clear selection button ── */
        (function() {
            var btn = document.getElementById('bsuw2-clear-sel');
            if (!btn) return;
            btn.addEventListener('click', function() {
                bsuwUnitData.forEach(function(u) { u._selected = false; });
                bsuw2RenderUnits();
                bsuw2RenderAmenities();
            });
        })();

        /* ── "All Units" row — click resets to all-scope ── */
        (function() {
            var row = document.getElementById('bsuw2-allunits-row');
            if (!row) return;
            row.addEventListener('click', function() {
                bsuwUnitData.forEach(function(u) { u._selected = false; });
                bsuw2RenderUnits();
                bsuw2RenderAmenities();
            });
        })();

        /* ── Saved-selections summary (third frame) ── */
        var bsuw2SavedSelections = []; /* [{id, scopeIsAll, unitIndices, scopeLabel, amenities[]}] */

        function bsuw2RenderSummary() {
            var list = document.getElementById('bsuw2-sum-list');
            var cnt  = document.getElementById('bsuw2-sum-count');
            if (!list) return;
            if (cnt) cnt.textContent = bsuw2SavedSelections.length;
            if (!bsuw2SavedSelections.length) {
                list.innerHTML = '<div class="bsuw2-sum-empty">' +
                    '<i class="fas fa-inbox"></i>' +
                    '<div>Nothing saved yet</div>' +
                    '<div class="bsuw2-sum-empty-sub">Pick units &amp; amenities, then click <strong>Save selection</strong></div>' +
                    '</div>';
                return;
            }
            var html = '';
            bsuw2SavedSelections.forEach(function(s) {
                var ams = s.amenities.map(function(a) {
                    return '<span class="bsuw2-sum-row-am">' + escHtml(a) + '</span>';
                }).join('');
                html += '<div class="bsuw2-sum-row" data-id="' + escAttr(s.id) + '">' +
                    '<button type="button" class="bsuw2-sum-row-rm" title="Remove this selection" data-rm-id="' + escAttr(s.id) + '"><i class="fas fa-times"></i></button>' +
                    '<div class="bsuw2-sum-row-scope">' +
                        '<i class="fas ' + (s.scopeIsAll ? 'fa-layer-group' : 'fa-door-closed') + '"></i>' +
                        escHtml(s.scopeLabel) +
                    '</div>' +
                    '<div class="bsuw2-sum-row-ams">' + ams + '</div>' +
                '</div>';
            });
            list.innerHTML = html;
        }

        function bsuw2RemoveSavedById(id) {
            var idx = -1;
            for (var i = 0; i < bsuw2SavedSelections.length; i++) {
                if (bsuw2SavedSelections[i].id === id) { idx = i; break; }
            }
            if (idx === -1) return;
            var entry = bsuw2SavedSelections[idx];
            /* Undo: remove these amenities from these units */
            entry.unitIndices.forEach(function(unitIdx) {
                var u = bsuwUnitData[unitIdx];
                if (!u || !u.amenities) return;
                entry.amenities.forEach(function(am) {
                    var ai = u.amenities.indexOf(am);
                    if (ai !== -1) u.amenities.splice(ai, 1);
                });
            });
            bsuw2SavedSelections.splice(idx, 1);
            bsuw2RenderSummary();
            bsuw2RenderAmenities();
            bsuw2UpdateScopeBar();
        }

        /* Delegated click handler for remove buttons */
        (function() {
            var list = document.getElementById('bsuw2-sum-list');
            if (!list) return;
            list.addEventListener('click', function(e) {
                var btn = e.target.closest ? e.target.closest('.bsuw2-sum-row-rm') : null;
                if (!btn) return;
                var id = btn.getAttribute('data-rm-id');
                if (id) bsuw2RemoveSavedById(id);
            });
        })();

        /* ── Save button ── */
        (function() {
            var btn   = document.getElementById('bsuw2-save-btn');
            var toast = document.getElementById('bsuw2-saved-toast');
            var det   = document.getElementById('bsuw2-saved-detail');
            if (!btn) return;
            btn.addEventListener('click', function() {
                var scope    = bsuw2Scope();
                var scopeN   = scope.length;
                /* Collect amenities currently 'all' state for the active scope */
                var amList = [];
                Object.keys(BSUW_AMENITIES).forEach(function(cat) {
                    BSUW_AMENITIES[cat].forEach(function(am) {
                        if (bsuw2AmState(am) === 'all') amList.push(am);
                    });
                });
                var selN       = bsuwUnitData.filter(function(u) { return u._selected; }).length;
                var scopeIsAll = (selN === 0);

                /* Block save when there are no amenities to record */
                if (amList.length === 0) {
                    if (det) det.textContent = 'Pick at least one amenity before saving.';
                    if (toast) {
                        toast.style.display = 'inline-flex';
                        toast.style.background = '#FFF4E5';
                        toast.style.borderColor = '#E8A83A';
                        toast.style.color = '#8A5B17';
                        clearTimeout(toast._hide);
                        toast._hide = setTimeout(function() {
                            toast.style.display = 'none';
                            toast.style.background = '';
                            toast.style.borderColor = '';
                            toast.style.color = '';
                        }, 3000);
                    }
                    return;
                }

                /* Build scope unit-indices and label */
                var unitIndices = [];
                if (scopeIsAll) {
                    bsuwUnitData.forEach(function(_, i) { unitIndices.push(i); });
                } else {
                    bsuwUnitData.forEach(function(u, i) { if (u._selected) unitIndices.push(i); });
                }
                var scopeLabel;
                if (scopeIsAll) {
                    scopeLabel = 'All Units (' + scopeN + ')';
                } else if (selN <= 3) {
                    scopeLabel = unitIndices.map(function(i) {
                        return bsuwUnitData[i].name || ('Unit ' + (i + 1));
                    }).join(', ');
                } else {
                    var first2 = unitIndices.slice(0, 2).map(function(i) {
                        return bsuwUnitData[i].name || ('Unit ' + (i + 1));
                    }).join(', ');
                    scopeLabel = selN + ' units · ' + first2 + '…';
                }

                bsuw2SavedSelections.push({
                    id: 'sel_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                    scopeIsAll: scopeIsAll,
                    unitIndices: unitIndices,
                    scopeLabel: scopeLabel,
                    amenities: amList.slice()
                });

                var amLabel = amList.length + ' amenit' + (amList.length === 1 ? 'y' : 'ies');
                var sLabel  = scopeIsAll ? 'all ' + scopeN + ' units' : selN + ' unit' + (selN === 1 ? '' : 's');
                if (det) det.textContent = 'Saved — ' + amLabel + ' applied to ' + sLabel + '.';
                if (toast) {
                    toast.style.display = 'inline-flex';
                    toast.style.background = '';
                    toast.style.borderColor = '';
                    toast.style.color = '';
                    clearTimeout(toast._hide);
                    toast._hide = setTimeout(function() { toast.style.display = 'none'; }, 4000);
                }

                /* Auto-reset frames 1 & 2 so user can pick a new batch */
                bsuwUnitData.forEach(function(u) { u._selected = false; });
                bsuw2RenderUnits();
                bsuw2RenderAmenities();
                bsuw2RenderSummary();
            });
        })();

        /* Render summary on initial load */
        bsuw2RenderSummary();

        /* ── Unit list pagination ── */
        document.getElementById('bsuw2-prev').addEventListener('click', function() {
            if (bsuw2Page > 1) { bsuw2Page--; bsuw2RenderUnits(); }
        });
        document.getElementById('bsuw2-next').addEventListener('click', function() {
            var pc = Math.max(1, Math.ceil(bsuwUnitData.length / BSUW2_PAGE_SIZE));
            if (bsuw2Page < pc) { bsuw2Page++; bsuw2RenderUnits(); }
        });

        /* ── Amenity chip click: toggle for entire scope ── */
        (function() {
            var grid = document.getElementById('bsuw2-am-grid');
            if (!grid) return;
            grid.addEventListener('click', function(e) {
                var chip = e.target.closest ? e.target.closest('.bsuw2-am-chip') : null;
                if (!chip) return;
                var am    = chip.dataset.am;
                var scope = bsuw2Scope();
                var state = bsuw2AmState(am);
                if (state === 'all') {
                    /* Remove from every unit in scope */
                    scope.forEach(function(u) {
                        var idx = (u.amenities || []).indexOf(am);
                        if (idx !== -1) u.amenities.splice(idx, 1);
                    });
                } else {
                    /* Add to every unit in scope (covers 'none' and 'some') */
                    scope.forEach(function(u) {
                        if (!u.amenities) u.amenities = [];
                        if (u.amenities.indexOf(am) === -1) u.amenities.push(am);
                    });
                }
                /* Fast path: only re-render chips, units list unchanged */
                bsuw2RenderAmenities();
            });
        })();

        /* ── Back-compat shims (other code paths call these) ── */
        function bsuwRenderChips()       { bsuwRenderMatrix(); }
        function bsuwRenderSelStrip()    { /* no-op */ }
        function bsuwUpdateChipStates()  { /* no-op */ }
        function bsuwAmUpdateStats()     { bsuw2UpdateScopeBar(); }
        function bsuwAmUpdateCTA()       { /* no-op */ }
        function bsuwAmHideSuccess()     { /* no-op */ }
        function bsuwAmScopeUnits()      { return bsuw2Scope(); }

        /* ─── Review step ─── */
        function bsuwBuildReview() {
            var body = document.getElementById('bsuw-review-body');
            var totalUnits = bsuwUnitData.length;
            var filledUnits = bsuwUnitData.filter(function(d){ return d.name||d.beds||d.baths; }).length;
            // Count the unique amenity names that are assigned to at least one unit
            var amSet = {};
            bsuwUnitData.forEach(function(d){ (d.amenities || []).forEach(function(am){ amSet[am] = true; }); });
            var amCount = Object.keys(amSet).length;
            var unitsWithAm = bsuwUnitData.filter(function(d){ return d.amenities && d.amenities.length > 0; }).length;

            var html =
                '<div class="bsuw-review-summary">'+
                  '<div class="bsuw-review-stat"><div class="bsuw-review-stat-num">'+totalUnits+'</div><div class="bsuw-review-stat-lbl">Total Units</div></div>'+
                  '<div class="bsuw-review-stat"><div class="bsuw-review-stat-num">'+filledUnits+'</div><div class="bsuw-review-stat-lbl">Units with Details</div></div>'+
                  '<div class="bsuw-review-stat"><div class="bsuw-review-stat-num">'+amCount+'</div><div class="bsuw-review-stat-lbl">Amenities Selected</div></div>'+
                  '<div class="bsuw-review-stat"><div class="bsuw-review-stat-num">'+unitsWithAm+'</div><div class="bsuw-review-stat-lbl">Units with Amenities</div></div>'+
                '</div>'+
                '<div class="bsuw-review-section">'+
                  '<h4><i class="fas fa-table"></i> Unit Summary</h4>'+
                  '<table class="bsuw-review-table">'+
                    '<thead><tr>'+
                      '<th>#</th><th>Unit Name</th><th>Bed</th><th>Bath</th>'+
                      '<th>Size</th><th>Amenities</th>'+
                    '</tr></thead><tbody>';
            bsuwUnitData.forEach(function(d, idx) {
                var amTags = d.amenities && d.amenities.length
                    ? d.amenities.map(function(a){ return '<span class="bsuw-review-am-tag">'+escHtml(a)+'</span>'; }).join('')
                    : '<span style="color:#C4CDD6;">—</span>';
                html +=
                    '<tr>'+
                    '<td>'+( idx+1)+'</td>'+
                    '<td><strong>'+(d.name ? escHtml(d.name) : '<span style="color:#C4CDD6;">Unit '+(idx+1)+'</span>')+'</strong></td>'+
                    '<td>'+(d.beds||'—')+'</td>'+
                    '<td>'+(d.baths||'—')+'</td>'+
                    '<td>'+(d.size ? d.size+' sq ft' : '—')+'</td>'+
                    '<td>'+amTags+'</td>'+
                    '</tr>';
            });
            html += '</tbody></table></div>';
            body.innerHTML = html;
        }

        /* ─── Wizard nav ─── */
        function bsuwOpen() {
            currentStep = 1;
            bsuwUnitData = [];
            bsuwSelectedAmenities.clear();
            bsuwChipActions = {};
            bsuwApplyToAll = true;
            bsuwCurrentPage = 1;
            var propSel = document.getElementById('bsuw-property-select');
            if (propSel) { propSel.value = ''; propSel.style.borderColor = ''; }
            document.getElementById('bsuw-success-msg').style.display = 'none';
            hide('bsuw-ut-wrap');
            var qfReset = document.getElementById('bsuw-qf-card'); if (qfReset) qfReset.classList.remove('visible');
            // Reset Quick Fill inputs
            var bBeds = document.getElementById('bsuw-bulk-beds');  if (bBeds)  bBeds.value = '';
            var bBath = document.getElementById('bsuw-bulk-baths'); if (bBath)  bBath.value = '';
            var bSize = document.getElementById('bsuw-bulk-size');  if (bSize)  bSize.value = '';
            var brB = document.getElementById('bsuw-bulk-result'); if (brB) brB.classList.remove('show');
            var selLbl = document.getElementById('bsuw-qf-sel-label'); if (selLbl) selLbl.textContent = 'Apply to Selected (0)';
            var selBtn = document.getElementById('bsuw-bulk-selected'); if (selBtn) selBtn.disabled = true;
            // Reset Step 2 state
            bsuw2Page = 1;
            bsuwUnitData.forEach(function(u) { u._selected = false; });
            bsuwRender();
            overlay.classList.add('open');
            overlay.scrollTop = 0;
            document.body.style.overflow = 'hidden';
        }
        function bsuwClose() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        function bsuwRender() {
            document.querySelectorAll('#bsuw-overlay .apw-step').forEach(function(el) {
                var s = parseInt(el.dataset.step);
                el.classList.toggle('active',    s === currentStep);
                el.classList.toggle('completed', s < currentStep);
                var circle = el.querySelector('.apw-step-circle');
                if (s < currentStep) circle.innerHTML = '<i class="fas fa-check" style="font-size:11px;"></i>';
                else circle.textContent = s;
            });
            document.querySelectorAll('#bsuw-overlay .apw-step-content').forEach(function(el) {
                el.classList.toggle('active', parseInt(el.dataset.step) === currentStep);
            });
            document.getElementById('bsuw-step-label').textContent = 'Step '+currentStep+' of '+totalSteps;
            var btnNext = document.getElementById('bsuw-btn-next');
            if (currentStep === totalSteps) { btnNext.textContent = 'Submit'; btnNext.classList.add('finish'); }
            else { btnNext.textContent = 'Next'; btnNext.classList.remove('finish'); }
            document.getElementById('bsuw-btn-back').style.visibility = currentStep === 1 ? 'hidden' : 'visible';
            if (currentStep === 2) {
                bsuwRenderMatrix();
            }
            if (currentStep === 3) bsuwBuildReview();
            overlay.scrollTop = 0;
        }

        document.getElementById('bsuw-btn-back').addEventListener('click', function() {
            if (currentStep > 1) { currentStep--; bsuwRender(); }
            else bsuwClose();
        });
        document.getElementById('bsuw-btn-next').addEventListener('click', function() {
            if (currentStep < totalSteps) {
                // Step 1: must select a property and have at least one unit loaded
                if (currentStep === 1) {
                    var propSel = document.getElementById('bsuw-property-select');
                    if (!propSel || !propSel.value) {
                        if (propSel) { propSel.style.borderColor = '#E53E3E'; propSel.focus(); }
                        return;
                    }
                    if (bsuwUnitData.length === 0) {
                        if (propSel) { propSel.style.borderColor = '#E53E3E'; }
                        return;
                    }
                    if (propSel) propSel.style.borderColor = '';
                }
                currentStep++; bsuwRender();
            } else {
                document.getElementById('bsuw-success-msg').style.display = 'block';
                var btn = document.getElementById('bsuw-btn-next');
                btn.textContent = 'Done'; btn.classList.add('finish');
                setTimeout(function() { bsuwClose(); }, 2500);
            }
        });
        document.getElementById('bsuw-close-top').addEventListener('click', bsuwClose);
        document.getElementById('btn-bulk-setup-unit').addEventListener('click', bsuwOpen);
    })();
