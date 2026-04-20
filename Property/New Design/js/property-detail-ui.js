/* ===============================================
   Property Detail - UI / Tab script
   (originally lines 4639-4906 of Property_detailed_view.html)
   =============================================== */

    (function() {
        const tabs = document.querySelectorAll('.tab-bar .tab');
        const panels = {
            'Overview': document.getElementById('panel-overview'),
            'Advertisement': document.getElementById('panel-advertisement'),
            'Worksheet': document.getElementById('panel-worksheet'),
            'Unit': document.getElementById('panel-unit'),
            'Communications': document.getElementById('panel-communications'),
            'Tasks': document.getElementById('panel-tasks'),
            'Settings': document.getElementById('panel-settings'),
        };

        // Post Ad master toggle — controls all syndication channels in the Ad tab
        (function() {
            const postAdBtn  = document.getElementById('ad-tog-post-ad');
            const postAdBar  = document.getElementById('ad-post-ad-bar');
            const postAdSub  = document.getElementById('ad-post-ad-sub');
            const syndGrid   = document.getElementById('ad-syndication-grid');
            const channelIds = ['ad-tog-zillow', 'ad-tog-rentpath', 'ad-tog-webpage'];
            const statusIds  = {
                'ad-tog-zillow':   'ad-synd-status-zillow',
                'ad-tog-rentpath': 'ad-synd-status-rentpath',
                'ad-tog-webpage':  'ad-synd-status-webpage'
            };

            function setChannelStatus(btn, on) {
                btn.classList.toggle('active', on);
                const statusEl = document.getElementById(statusIds[btn.id]);
                if (!statusEl) return;
                if (on) {
                    statusEl.className = 'synd-status synd-status--active';
                    statusEl.innerHTML = '<span class="synd-status-dot synd-status-dot--active"></span> Active';
                } else {
                    statusEl.className = 'synd-status synd-status--inactive';
                    statusEl.innerHTML = '<span class="synd-status-dot synd-status-dot--inactive"></span> Inactive';
                }
            }

            function setAllChannels(on) {
                channelIds.forEach(id => {
                    const btn = document.getElementById(id);
                    if (btn) setChannelStatus(btn, on);
                });
                syndGrid.classList.toggle('dimmed', !on);
                postAdBar.classList.toggle('is-off', !on);
                postAdSub.textContent = on
                    ? 'Listing is active — toggle individual channels below to customise'
                    : 'Turn on to activate listing on all syndication channels';
            }

            function syncMasterFromChannels() {
                const allOn = channelIds.every(id => {
                    const b = document.getElementById(id);
                    return b && b.classList.contains('active');
                });
                postAdBtn.classList.toggle('on', allOn);
                postAdBar.classList.toggle('is-off', !allOn);
                postAdSub.textContent = allOn
                    ? 'Listing is active — toggle individual channels below to customise'
                    : 'Turn on to activate listing on all syndication channels';
            }

            // Master toggle click
            postAdBtn.addEventListener('click', function() {
                const turningOn = !this.classList.contains('on');
                this.classList.toggle('on', turningOn);
                setAllChannels(turningOn);
            });

            // Individual channel toggle clicks
            channelIds.forEach(id => {
                const btn = document.getElementById(id);
                if (!btn) return;
                btn.addEventListener('click', function() {
                    const on = !this.classList.contains('active');
                    // Re-enable pointer events first (un-dim if clicking while not dimmed)
                    syndGrid.classList.remove('dimmed');
                    setChannelStatus(this, on);
                    syncMasterFromChannels();
                });
            });
        })();

        function adEscapeHtml(str) {
            const d = document.createElement('div');
            d.textContent = str;
            return d.innerHTML;
        }

        function adLinkFromView(anchorEl) {
            const h = anchorEl.getAttribute('href');
            if (h && h !== '#' && h !== '') return h;
            return anchorEl.textContent.replace(/\s+/g, ' ').trim().replace(/\s*$/,'').replace(/^\s*/, '');
        }

        (function adListingLeaseEdit() {
            const cardL = document.getElementById('ad-card-listing');
            const cardLR = document.getElementById('ad-card-lease-rental');
            if (!cardL || !cardLR) return;

            function fillListingFormFromView() {
                const desc = document.getElementById('ad-view-listing-desc');
                document.getElementById('ad-edit-listing-desc').value = desc ? desc.textContent.trim() : '';
                const tags = document.querySelectorAll('#ad-view-amenities .ad-amenity-tag');
                document.getElementById('ad-edit-listing-amenities').value = Array.from(tags).map(t => t.textContent.trim().replace(/\s+/g, ' ')).join('\n');
                const htmlEl = document.getElementById('ad-view-listing-html');
                document.getElementById('ad-edit-listing-html').value = htmlEl ? htmlEl.textContent.trim() : '';
                const furn = document.getElementById('ad-view-prop-furnished');
                const sel = document.getElementById('ad-edit-prop-furnished');
                if (furn && sel) sel.value = furn.textContent.trim() === 'No' ? 'No' : 'Yes';
                document.getElementById('ad-edit-prop-tour').value = adLinkFromView(document.getElementById('ad-view-prop-tour'));
                document.getElementById('ad-edit-prop-lockbox').value = document.getElementById('ad-view-prop-lockbox').textContent.trim();
                document.getElementById('ad-edit-prop-lot').value = document.getElementById('ad-view-prop-lot').textContent.trim();
                document.getElementById('ad-edit-prop-app').value = adLinkFromView(document.getElementById('ad-view-prop-app'));
                document.getElementById('ad-edit-prop-lockbox-desc').value = document.getElementById('ad-view-prop-lockbox-desc').textContent.trim();
            }

            function applyListingFormToView() {
                document.getElementById('ad-view-listing-desc').textContent = document.getElementById('ad-edit-listing-desc').value.trim();
                const lines = document.getElementById('ad-edit-listing-amenities').value.split('\n').map(l => l.trim()).filter(Boolean);
                const grid = document.getElementById('ad-view-amenities');
                grid.innerHTML = lines.map(line =>
                    '<span class="ad-amenity-tag"><i class="fas fa-check"></i> ' + adEscapeHtml(line) + '</span>'
                ).join('');
                document.getElementById('ad-view-listing-html').textContent = document.getElementById('ad-edit-listing-html').value;
                document.getElementById('ad-view-prop-furnished').textContent = document.getElementById('ad-edit-prop-furnished').value;
                const tour = document.getElementById('ad-edit-prop-tour').value.trim();
                const aTour = document.getElementById('ad-view-prop-tour');
                aTour.href = tour || '#';
                aTour.innerHTML = adEscapeHtml(tour || 'https://') + ' <i class="fas fa-external-link-alt" style="font-size:9px;"></i>';
                document.getElementById('ad-view-prop-lockbox').textContent = document.getElementById('ad-edit-prop-lockbox').value.trim();
                document.getElementById('ad-view-prop-lot').textContent = document.getElementById('ad-edit-prop-lot').value.trim();
                const app = document.getElementById('ad-edit-prop-app').value.trim();
                const aApp = document.getElementById('ad-view-prop-app');
                aApp.href = app || '#';
                aApp.innerHTML = adEscapeHtml(app || 'https://') + ' <i class="fas fa-external-link-alt" style="font-size:9px;"></i>';
                document.getElementById('ad-view-prop-lockbox-desc').textContent = document.getElementById('ad-edit-prop-lockbox-desc').value.trim();
            }

            function fillLeaseFormFromView() {
                document.getElementById('ad-edit-lease-avail').value = document.getElementById('ad-view-lease-avail').textContent.trim();
                document.getElementById('ad-edit-lease-desc').value = document.getElementById('ad-view-lease-desc').textContent.trim();
                document.getElementById('ad-edit-lease-deposit-desc').value = document.getElementById('ad-view-lease-deposit-desc').textContent.trim();
                document.getElementById('ad-edit-rent-market').value = document.getElementById('ad-view-rent-market').textContent.trim();
                document.getElementById('ad-edit-rent-deposit').value = document.getElementById('ad-view-rent-deposit').textContent.trim();
                document.getElementById('ad-edit-rent-beds').value = document.getElementById('ad-view-rent-beds').textContent.trim();
                document.getElementById('ad-edit-rent-baths').value = document.getElementById('ad-view-rent-baths').textContent.trim();
                document.getElementById('ad-edit-rent-size').value = document.getElementById('ad-view-rent-size').textContent.trim();
                document.getElementById('ad-edit-rent-pm').value = document.getElementById('ad-view-rent-pm').textContent.trim();
            }

            function applyLeaseFormToView() {
                document.getElementById('ad-view-lease-avail').textContent = document.getElementById('ad-edit-lease-avail').value.trim();
                document.getElementById('ad-view-lease-desc').textContent = document.getElementById('ad-edit-lease-desc').value.trim();
                document.getElementById('ad-view-lease-deposit-desc').textContent = document.getElementById('ad-edit-lease-deposit-desc').value.trim();
                document.getElementById('ad-view-rent-market').textContent = document.getElementById('ad-edit-rent-market').value.trim();
                document.getElementById('ad-view-rent-deposit').textContent = document.getElementById('ad-edit-rent-deposit').value.trim();
                document.getElementById('ad-view-rent-beds').textContent = document.getElementById('ad-edit-rent-beds').value.trim();
                document.getElementById('ad-view-rent-baths').textContent = document.getElementById('ad-edit-rent-baths').value.trim();
                document.getElementById('ad-view-rent-size').textContent = document.getElementById('ad-edit-rent-size').value.trim();
                document.getElementById('ad-view-rent-pm').textContent = document.getElementById('ad-edit-rent-pm').value.trim();
            }

            cardL.querySelector('.ad-btn-listing-edit').addEventListener('click', () => {
                fillListingFormFromView();
                cardL.classList.add('is-editing');
            });
            cardL.querySelector('.ad-btn-listing-cancel').addEventListener('click', () => {
                cardL.classList.remove('is-editing');
            });
            cardL.querySelector('.ad-btn-listing-save').addEventListener('click', () => {
                applyListingFormToView();
                cardL.classList.remove('is-editing');
            });

            cardLR.querySelector('.ad-btn-lease-edit').addEventListener('click', () => {
                fillLeaseFormFromView();
                cardLR.classList.add('is-editing');
            });
            cardLR.querySelector('.ad-btn-lease-cancel').addEventListener('click', () => {
                cardLR.classList.remove('is-editing');
            });
            cardLR.querySelector('.ad-btn-lease-save').addEventListener('click', () => {
                applyLeaseFormToView();
                cardLR.classList.remove('is-editing');
            });
        })();

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                Object.values(panels).forEach(p => { if (p) p.classList.remove('active'); });
                const panel = panels[tab.textContent.trim()];
                if (panel) panel.classList.add('active');
            });
        });

        // Settings accordion
        (function() {
            var expanded = true;
            document.querySelectorAll('.stg-section-header').forEach(function(hdr) {
                hdr.addEventListener('click', function() {
                    hdr.closest('.stg-section').classList.toggle('collapsed');
                    var anyCollapsed = document.querySelectorAll('.stg-section.collapsed').length > 0;
                    expanded = !anyCollapsed;
                    syncBtn();
                });
            });
            function syncBtn() {
                var btn  = document.getElementById('stg-expand-all-btn');
                var icon = document.getElementById('stg-expand-icon');
                if (!btn) return;
                btn.childNodes[0].textContent = expanded ? 'Collapse All ' : 'Expand All ';
                icon.classList.toggle('rotated', expanded);
            }
            var expandBtn = document.getElementById('stg-expand-all-btn');
            if (expandBtn) {
                expandBtn.addEventListener('click', function() {
                    expanded = !expanded;
                    document.querySelectorAll('.stg-section').forEach(function(s) {
                        s.classList.toggle('collapsed', !expanded);
                    });
                    syncBtn();
                });
            }
        })();

        document.querySelectorAll('[data-dropdown]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dd = document.getElementById(btn.dataset.dropdown);
                document.querySelectorAll('.ws-dd-menu.show').forEach(m => {
                    if (m !== dd) m.classList.remove('show');
                });
                dd.classList.toggle('show');
            });
        });

        document.querySelectorAll('[data-popover]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const pop = document.getElementById(el.dataset.popover);
                document.querySelectorAll('.ws-popover.show').forEach(p => {
                    if (p !== pop) p.classList.remove('show');
                });
                pop.classList.toggle('show');
            });
        });

        document.querySelectorAll('.pop-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                btn.closest('.ws-popover').classList.remove('show');
            });
        });

        document.addEventListener('click', () => {
            document.querySelectorAll('.ws-dd-menu.show').forEach(m => m.classList.remove('show'));
            document.querySelectorAll('.ws-popover.show').forEach(p => p.classList.remove('show'));
        });

        document.querySelectorAll('.ws-dd-menu, .ws-popover').forEach(el => {
            el.addEventListener('click', e => e.stopPropagation());
        });
    })();

/* ===============================================
   Property Detail - Loan Docs handler
   (originally lines 6433-6453 of Property_detailed_view.html)
   =============================================== */

                    window.handleLoanDocs = function(files) {
                        var list = document.getElementById('loan-doc-list');
                        if (!files || !files.length) return;
                        Array.from(files).forEach(function(file) {
                            var row = document.createElement('div');
                            row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 12px;background:#fff;border:1px solid #EDF2F7;border-radius:10px;';
                            var ext = file.name.split('.').pop().toLowerCase();
                            var icColor = ext === 'pdf' ? '#C53030' : ext === 'docx' ? '#2B6CB0' : '#22894A';
                            var icClass = ext === 'pdf' ? 'fa-file-pdf' : ext === 'docx' ? 'fa-file-word' : 'fa-file-image';
                            var sizeMB = (file.size / 1048576).toFixed(1);
                            row.innerHTML = '<div style="width:34px;height:34px;border-radius:9px;background:#FEE8E8;color:' + icColor + ';display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">'
                                + '<i class="fas ' + icClass + '"></i></div>'
                                + '<div style="flex:1;min-width:0;">'
                                + '<div style="font-size:12.5px;font-weight:600;color:#0F172A;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + file.name + '</div>'
                                + '<div style="font-size:11px;color:#94A3B8;margin-top:1px;">' + sizeMB + ' MB</div></div>'
                                + '<button onclick="this.closest(\'div[style]\').remove();" style="width:26px;height:26px;border:none;background:#F0F2F5;border-radius:7px;cursor:pointer;color:#718096;font-size:12px;display:flex;align-items:center;justify-content:center;" title="Remove"><i class="fas fa-times"></i></button>';
                            list.appendChild(row);
                        });
                    };
