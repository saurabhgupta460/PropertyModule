/* ===============================================
   Property Detail - NLW wizard IIFE
   (originally lines 6560-7286 of Property_detailed_view.html)
   =============================================== */

    (function() {
        function openSlideout(bgId, panelId) {
            document.getElementById(bgId).classList.add('open');
            document.getElementById(panelId).classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        function closeSlideout(bgId, panelId) {
            document.getElementById(panelId).classList.remove('open');
            setTimeout(() => {
                document.getElementById(bgId).classList.remove('open');
                document.body.style.overflow = '';
            }, 300);
        }
        function openModal(id) {
            document.getElementById(id).classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        function closeModal(id) {
            document.getElementById(id).classList.remove('open');
            document.body.style.overflow = '';
        }

        /* ── NEW LISTING WIZARD ── */
        (function() {
            var currentStep = 1;
            var totalSteps  = 5;
            var overlay     = document.getElementById('nlw-overlay');

            function openWizard() {
                currentStep = 1;
                renderStep();
                overlay.classList.add('open');
                overlay.scrollTop = 0;
                document.body.style.overflow = 'hidden';
            }
            window.openWizard = openWizard;
            function closeWizard() {
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            }

            function renderStep() {
                // Step indicator dots
                document.querySelectorAll('.nlw-step').forEach(function(el) {
                    var s = parseInt(el.dataset.step);
                    el.classList.toggle('active',    s === currentStep);
                    el.classList.toggle('completed', s < currentStep);
                    // Show checkmark on completed steps
                    var circle = el.querySelector('.nlw-step-circle');
                    if (s < currentStep) {
                        circle.innerHTML = '<i class="fas fa-check" style="font-size:11px;"></i>';
                    } else {
                        circle.textContent = s;
                    }
                });
                // Step content panels
                document.querySelectorAll('.nlw-step-content').forEach(function(el) {
                    el.classList.toggle('active', parseInt(el.dataset.step) === currentStep);
                });
                // Footer label
                document.getElementById('nlw-step-label').textContent = 'Step ' + currentStep + ' of ' + totalSteps;
                // Next/Finish button
                var btnNext = document.getElementById('nlw-btn-next');
                if (currentStep === totalSteps) {
                    btnNext.textContent = 'Finish & Publish';
                    btnNext.classList.add('finish');
                } else {
                    btnNext.textContent = 'Next';
                    btnNext.classList.remove('finish');
                }
                // Back button visibility
                document.getElementById('nlw-btn-back').style.visibility = currentStep === 1 ? 'hidden' : 'visible';
                // Scroll body to top on step change
                overlay.scrollTop = 0;
                // Render amenity chips when arriving at step 2
                if (currentStep === 2) {
                    nlwRenderAmenityChips();
                    nlwRenderSelStrip();
                    nlwUpdateAmCounts();
                }
            }

            function publishToAdTab() {
                function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }

                // Step 1 → Listing Description card
                var descEl = document.getElementById('ad-view-listing-desc');
                if (descEl && val('nlw-desc')) descEl.textContent = val('nlw-desc');

                var amenEl = document.getElementById('ad-view-amenities');
                if (amenEl) {
                    var allSelected = Array.from(nlwAmenities.property).concat(Array.from(nlwAmenities.unit));
                    if (allSelected.length > 0) {
                        var iconMap = {
                            'a/c':'fa-snowflake','air':'fa-snowflake','garage':'fa-car','pool':'fa-swimming-pool',
                            'pet':'fa-paw','laundry':'fa-tshirt','fitness':'fa-dumbbell','gym':'fa-dumbbell',
                            'furnished':'fa-couch','internet':'fa-wifi','wifi':'fa-wifi','parking':'fa-car',
                            'balcony':'fa-door-open','washer':'fa-tshirt','dryer':'fa-tshirt',
                            'dishwasher':'fa-utensils','hardwood':'fa-chess-board','fireplace':'fa-fire'
                        };
                        amenEl.innerHTML = allSelected.map(function(line) {
                            var icon = 'fa-check';
                            var lc = line.toLowerCase();
                            Object.keys(iconMap).forEach(function(k){ if(lc.indexOf(k) !== -1) icon = iconMap[k]; });
                            return '<span class="ad-amenity-tag"><i class="fas ' + icon + '"></i> ' + line + '</span>';
                        }).join('');
                    }
                }

                var furnEl = document.getElementById('ad-view-prop-furnished');
                if (furnEl) furnEl.textContent = val('nlw-furnished') || 'No';

                var tourEl = document.getElementById('ad-view-prop-tour');
                if (tourEl && val('nlw-tour')) { tourEl.href = val('nlw-tour'); tourEl.childNodes[0].textContent = val('nlw-tour') + ' '; }

                var lbEl = document.getElementById('ad-view-prop-lockbox');
                if (lbEl && val('nlw-lockbox')) lbEl.textContent = val('nlw-lockbox');

                var lotEl = document.getElementById('ad-view-prop-lot');
                if (lotEl && val('nlw-lot')) lotEl.textContent = val('nlw-lot');

                var appEl = document.getElementById('ad-view-prop-app');
                if (appEl && val('nlw-app-link')) { appEl.href = val('nlw-app-link'); appEl.childNodes[0].textContent = val('nlw-app-link') + ' '; }

                var lbdEl = document.getElementById('ad-view-prop-lockbox-desc');
                if (lbdEl && val('nlw-lockbox-desc')) lbdEl.textContent = val('nlw-lockbox-desc');

                // Step 3 → Lease & Rental card
                var availEl = document.getElementById('ad-view-lease-avail');
                if (availEl && val('nlw-avail')) availEl.textContent = val('nlw-avail');

                var rentEl = document.getElementById('ad-view-rent-market');
                if (rentEl && val('nlw-market-rent')) rentEl.textContent = val('nlw-market-rent');

                var depEl = document.getElementById('ad-view-rent-deposit');
                if (depEl && val('nlw-deposit-amt')) depEl.textContent = val('nlw-deposit-amt');

                var bedsEl = document.getElementById('ad-view-rent-beds');
                if (bedsEl && val('nlw-beds')) bedsEl.textContent = val('nlw-beds');

                var bathEl = document.getElementById('ad-view-rent-baths');
                if (bathEl && val('nlw-baths')) bathEl.textContent = val('nlw-baths');

                var sizeEl = document.getElementById('ad-view-rent-size');
                if (sizeEl && val('nlw-size')) sizeEl.textContent = val('nlw-size');

                // Step 4 → Advertising card date chip
                var adDate = val('nlw-ad-date');
                if (adDate) {
                    var chips = document.querySelectorAll('.ad-stat-chip .chip-val');
                    if (chips[0]) chips[0].textContent = adDate;
                }

                // Syndication toggles → sync to Ad tab Post Ad toggles
                var wizToggles = ['nlw-tog-zillow','nlw-tog-rentpath','nlw-tog-webpage'];
                var tabToggles = ['ad-tog-zillow','ad-tog-rentpath','ad-tog-webpage'];
                var tabStatuses= ['ad-synd-status-zillow','ad-synd-status-rentpath','ad-synd-status-webpage'];
                wizToggles.forEach(function(wid, i) {
                    var wbtn = document.getElementById(wid);
                    var tbtn = document.getElementById(tabToggles[i]);
                    var sbadge = document.getElementById(tabStatuses[i]);
                    if (!wbtn || !tbtn) return;
                    var isOn = wbtn.classList.contains('on');
                    if (isOn) {
                        tbtn.classList.add('active');
                        if (sbadge) { sbadge.className = 'synd-status synd-status--active'; sbadge.innerHTML = '<span class="synd-status-dot synd-status-dot--active"></span> Active'; }
                    } else {
                        tbtn.classList.remove('active');
                        if (sbadge) { sbadge.className = 'synd-status synd-status--inactive'; sbadge.innerHTML = '<span class="synd-status-dot synd-status-dot--inactive"></span> Inactive'; }
                    }
                });
            }

            // Individual channel toggles (simple)
            document.querySelectorAll('.nlw-channel-toggle').forEach(function(btn) {
                btn.addEventListener('click', function() { this.classList.toggle('on'); });
            });

            // ── AI Market Rent Suggestion ──
            (function() {
                var aiBtn    = document.getElementById('nlw-ai-rent-btn');
                var aiCard   = document.getElementById('nlw-ai-card');
                var aiLoad   = document.getElementById('nlw-ai-loading');
                var aiResult = document.getElementById('nlw-ai-result');
                var aiClose  = document.getElementById('nlw-ai-card-close');

                function calcRent() {
                    var beds = parseFloat(document.getElementById('nlw-beds').value) || 2;
                    var size = parseFloat((document.getElementById('nlw-size').value || '').replace(/[^0-9.]/g,'')) || 1200;
                    var pets = (document.getElementById('nlw-pets').value || 'No Pets');
                    var park = (document.getElementById('nlw-parking').value || 'None');
                    var furn = (document.getElementById('nlw-furnished').value || 'No');

                    // Base rent per bed
                    var base = 900 + beds * 420 + size * 0.28;
                    if (furn === 'Yes')                     base += 180;
                    if (pets === 'Pets Allowed')            base += 60;
                    if (park.indexOf('Garage') !== -1)      base += 120;
                    if (park.indexOf('2-Car') !== -1)       base += 80;

                    var mid  = Math.round(base / 10) * 10;
                    var low  = mid - Math.round(mid * 0.07 / 10) * 10;
                    var high = mid + Math.round(mid * 0.09 / 10) * 10;

                    return { low: low, mid: mid, high: high, beds: beds, size: size, pets: pets, park: park, furn: furn };
                }

                function fmt(n) { return '$' + n.toLocaleString(); }

                function buildFactors(r) {
                    var chips = [];
                    chips.push({ icon:'fa-bed',           label: r.beds + ' Bed(s)' });
                    chips.push({ icon:'fa-ruler-combined', label: r.size.toLocaleString() + ' sq ft' });
                    if (r.furn === 'Yes') chips.push({ icon:'fa-couch', label:'Furnished' });
                    if (r.pets === 'Pets Allowed') chips.push({ icon:'fa-paw', label:'Pet Friendly' });
                    if (r.park !== 'None') chips.push({ icon:'fa-car', label: r.park });
                    chips.push({ icon:'fa-map-marker-alt', label:'Local Comparables' });
                    return chips;
                }

                aiBtn.addEventListener('click', function() {
                    // Show card & loading
                    aiCard.style.display = 'block';
                    aiLoad.style.display = 'flex';
                    aiResult.style.display = 'none';
                    aiBtn.classList.add('loading');
                    aiBtn.querySelector('span span:last-child').textContent = 'Analysing…';

                    setTimeout(function() {
                        var r = calcRent();

                        document.getElementById('nlw-ai-low').textContent  = fmt(r.low);
                        document.getElementById('nlw-ai-mid').textContent  = fmt(r.mid);
                        document.getElementById('nlw-ai-high').textContent = fmt(r.high);

                        var factorsList = document.getElementById('nlw-ai-factors-list');
                        factorsList.innerHTML = buildFactors(r).map(function(c) {
                            return '<span class="nlw-ai-factor-chip"><i class="fas ' + c.icon + '"></i>' + c.label + '</span>';
                        }).join('');

                        aiLoad.style.display = 'none';
                        aiResult.style.display = 'block';
                        aiBtn.classList.remove('loading');
                        aiBtn.querySelector('span span:last-child').textContent = 'AI Suggest';
                    }, 1800);
                });

                // Close card
                aiClose.addEventListener('click', function() {
                    aiCard.style.display = 'none';
                });

                // Apply buttons
                function applyRent(id, fieldId) {
                    document.getElementById(id).addEventListener('click', function() {
                        var val = document.getElementById(fieldId).textContent;
                        document.getElementById('nlw-market-rent').value = val;
                        aiCard.style.display = 'none';
                    });
                }
                applyRent('nlw-ai-apply-low',  'nlw-ai-low');
                applyRent('nlw-ai-apply-mid',  'nlw-ai-mid');
                applyRent('nlw-ai-apply-high', 'nlw-ai-high');
            })();

            // Photo upload with tagging
            // ── Step 2: Amenities ─────────────────────────────────────────────────
            var NLW_AMENITIES = {
                property: [
                    { icon:'fa-dumbbell',       label:'Recreation & Fitness',   items:['Swimming Pool','Spa / Hot Tub','Fitness Center / Gym','Tennis Court','Basketball Court','Playground / Tot Lot','Rooftop Deck / Lounge'] },
                    { icon:'fa-tree',           label:'Outdoor & Landscaping',  items:['BBQ / Grilling Stations','Courtyard','Outdoor Seating Areas','Gated Entry','Rooftop Garden','Lush Landscaping'] },
                    { icon:'fa-car',            label:'Parking & Transport',    items:['On-Site Parking','Covered Parking / Carport','Parking Garage','Assigned Parking','EV Charging Stations','Bike Parking','Guest Parking'] },
                    { icon:'fa-door-open',      label:'Common Spaces',          items:['Clubhouse / Resident Lounge','Business Center','Package Lockers','On-Site Laundry Room','Lobby / Controlled Access','Elevator','Coffee Bar'] },
                    { icon:'fa-shield-alt',     label:'Security & Safety',      items:['Gated / Controlled Access','On-Site Security','Security Cameras / CCTV','Key Fob / Card Access','Video Intercom','Well-Lit Pathways'] },
                    { icon:'fa-paw',            label:'Pet Amenities',          items:['Dog Park / Dog Run','Pet Washing Station','Pet-Friendly Areas','Pet Waste Stations'] },
                    { icon:'fa-wifi',           label:'Technology',             items:['High-Speed Internet (Common)','Online Resident Portal','Smart Building Access','Online Rent Payment'] }
                ],
                unit: [
                    { icon:'fa-utensils',       label:'Kitchen Features',       items:['Dishwasher','Refrigerator','Range / Oven','Microwave (Built-in)','Garbage Disposal','Stainless Steel Appliances','Granite / Quartz Countertops','Island / Breakfast Bar'] },
                    { icon:'fa-tshirt',         label:'Laundry',                items:['In-Unit Washer & Dryer','Washer / Dryer Hookups','Washer / Dryer (Stackable)'] },
                    { icon:'fa-thermometer-half',label:'Climate Control',       items:['Central Air Conditioning','Central Heating','Ceiling Fans','Smart Thermostat','HVAC System'] },
                    { icon:'fa-grip-lines',     label:'Flooring',               items:['Hardwood Floors','Laminate / Vinyl Plank (LVP)','Tile Flooring','Carpet (New)','Luxury Vinyl Tile (LVT)'] },
                    { icon:'fa-home',           label:'Rooms & Interior',       items:['Walk-In Closet(s)','Fireplace','High / Vaulted Ceilings','Large Windows / Natural Light','Window Coverings / Blinds','Built-in Shelving'] },
                    { icon:'fa-leaf',           label:'Outdoor (Unit)',         items:['Private Balcony / Patio','Covered Porch','Private Yard / Fenced Yard','Deck','Attached Private Garage'] },
                    { icon:'fa-mobile-alt',     label:'Smart Home / Tech',      items:['Smart Lock / Keyless Entry','Video Doorbell','Smart Thermostat','USB Outlets'] }
                ]
            };
            var nlwAmenities = { property: new Set(), unit: new Set() };
            var nlwActiveAmTab = 'property';

            function nlwRenderAmenityChips() {
                var body = document.getElementById('nlw-am-grid-body');
                if (!body) return;
                body.innerHTML = '';
                NLW_AMENITIES[nlwActiveAmTab].forEach(function(cat) {
                    var section = document.createElement('div');
                    section.className = 'am-cat-section';
                    section.innerHTML = '<div class="am-cat-title"><i class="fas ' + cat.icon + '"></i>' + cat.label + '<span class="am-cat-badge">' + cat.items.length + '</span></div><div class="am-amenity-grid"></div>';
                    var grid = section.querySelector('.am-amenity-grid');
                    cat.items.forEach(function(item) {
                        var isSel = nlwAmenities[nlwActiveAmTab].has(item);
                        var chip = document.createElement('button');
                        chip.type = 'button';
                        chip.className = 'am-amenity-chip' + (isSel ? ' selected' : '');
                        chip.innerHTML = '<span class="am-check-icon"><i class="fas fa-check" style="font-size:9px;pointer-events:none;"></i></span>' + item;
                        chip.addEventListener('click', function() {
                            if (nlwAmenities[nlwActiveAmTab].has(item)) {
                                nlwAmenities[nlwActiveAmTab].delete(item);
                                chip.classList.remove('selected');
                            } else {
                                nlwAmenities[nlwActiveAmTab].add(item);
                                chip.classList.add('selected');
                            }
                            nlwUpdateAmCounts();
                            nlwRenderSelStrip();
                        });
                        grid.appendChild(chip);
                    });
                    body.appendChild(section);
                });
            }

            function nlwUpdateAmCounts() {
                var pEl = document.getElementById('nlw-am-count-prop');
                var uEl = document.getElementById('nlw-am-count-unit');
                if (pEl) pEl.textContent = nlwAmenities.property.size;
                if (uEl) uEl.textContent = nlwAmenities.unit.size;
            }

            function nlwRenderSelStrip() {
                var items = Array.from(nlwAmenities[nlwActiveAmTab]);
                var countEl = document.getElementById('nlw-am-sel-count');
                var tagsEl  = document.getElementById('nlw-am-sel-tags');
                if (!countEl || !tagsEl) return;
                countEl.textContent = items.length;
                if (items.length === 0) {
                    tagsEl.innerHTML = '<span class="nlw-am-sel-empty">No amenities selected yet.</span>';
                    return;
                }
                tagsEl.innerHTML = '';
                items.forEach(function(item) {
                    var tag = document.createElement('span');
                    tag.className = 'nlw-am-sel-tag';
                    tag.innerHTML = item + '<button class="nlw-am-sel-tag-remove" type="button"><i class="fas fa-times" style="pointer-events:none;"></i></button>';
                    tag.querySelector('.nlw-am-sel-tag-remove').addEventListener('click', function() {
                        nlwAmenities[nlwActiveAmTab].delete(item);
                        nlwUpdateAmCounts();
                        nlwRenderAmenityChips();
                        nlwRenderSelStrip();
                    });
                    tagsEl.appendChild(tag);
                });
            }

            // Tab switching
            document.querySelectorAll('.nlw-am-tab-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    nlwActiveAmTab = btn.dataset.amtab;
                    document.querySelectorAll('.nlw-am-tab-btn').forEach(function(b) {
                        b.classList.toggle('active', b === btn);
                    });
                    nlwRenderAmenityChips();
                    nlwRenderSelStrip();
                });
            });

            // ── Step 3: Photo upload (Property + Unit) ────────────────────────────
            var photoTagOptions = ['Primary','Living Room','Kitchen','Bedroom','Bathroom','Exterior','Floor Plan','Dining Room','Balcony','Other'];

            function nlwMakePhotoUploader(inputId, gridId) {
                var input = document.getElementById(inputId);
                if (!input) return;
                input.addEventListener('change', function() {
                    var grid = document.getElementById(gridId);
                    var files = Array.from(this.files);
                    if (!files.length) return;
                    var hint = grid.querySelector('.nlw-upload-empty-hint');
                    if (hint) hint.remove();
                    files.forEach(function(file, idx) {
                        var card = document.createElement('div');
                        card.className = 'nlw-uploaded-photo';
                        var thumb = document.createElement('div');
                        thumb.className = 'photo-thumb';
                        var img = document.createElement('img');
                        var reader = new FileReader();
                        reader.onload = function(e) { img.src = e.target.result; };
                        reader.readAsDataURL(file);
                        thumb.appendChild(img);
                        var tagRow = document.createElement('div');
                        tagRow.className = 'nlw-photo-tag-row';
                        tagRow.innerHTML = '<i class="fas fa-tag tag-icon"></i>';
                        var sel = document.createElement('select');
                        sel.className = 'nlw-photo-tag-select';
                        photoTagOptions.forEach(function(opt, oi) {
                            var o = document.createElement('option');
                            o.value = opt; o.textContent = opt;
                            if (oi === 0 && grid.querySelectorAll('.nlw-uploaded-photo').length === 0 && idx === 0) o.selected = true;
                            sel.appendChild(o);
                        });
                        var removeBtn = document.createElement('button');
                        removeBtn.className = 'nlw-photo-remove';
                        removeBtn.type = 'button';
                        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                        removeBtn.addEventListener('click', function() {
                            card.remove();
                            if (!grid.querySelector('.nlw-uploaded-photo')) {
                                var emptyHint = document.createElement('div');
                                emptyHint.className = 'nlw-upload-empty-hint';
                                emptyHint.innerHTML = '<i class="fas fa-images"></i><span>No photos yet — use the area above to upload</span>';
                                grid.appendChild(emptyHint);
                            }
                        });
                        tagRow.appendChild(sel);
                        tagRow.appendChild(removeBtn);
                        card.appendChild(thumb);
                        card.appendChild(tagRow);
                        grid.appendChild(card);
                    });
                    this.value = '';
                });
            }
            nlwMakePhotoUploader('nlw-prop-file-input', 'nlw-prop-uploaded-grid');
            nlwMakePhotoUploader('nlw-unit-file-input', 'nlw-unit-uploaded-grid');

            // Open wizard
            document.getElementById('btn-new-listing').addEventListener('click', openWizard);

            // Close via header back button
            document.getElementById('nlw-close-top').addEventListener('click', closeWizard);

            // Close on overlay background click
            overlay.addEventListener('click', function(e) { if (e.target === overlay) closeWizard(); });

            // Back button
            document.getElementById('nlw-btn-back').addEventListener('click', function() {
                if (currentStep > 1) { currentStep--; renderStep(); }
                else closeWizard();
            });

            // Next / Finish button
            document.getElementById('nlw-btn-next').addEventListener('click', function() {
                if (currentStep < totalSteps) {
                    currentStep++;
                    renderStep();
                } else {
                    publishToAdTab();
                    closeWizard();
                    // Brief success flash on the Ad tab
                    var btn = document.getElementById('btn-new-listing');
                    var orig = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check-circle"></i> Listing Published!';
                    btn.style.background = '#3BAA6E';
                    setTimeout(function() { btn.innerHTML = orig; btn.style.background = ''; }, 2800);
                }
            });

            // Init back button state
            document.getElementById('nlw-btn-back').style.visibility = 'hidden';
        })();


        /* ── Appliance slideout: unit-grouped expand/collapse + filter ── */
        /* Exposed on window so inline onclick handlers can reach them */
        window.slToggleUnit = function(row) {
            var unit = row.getAttribute('data-unit');
            var detail = document.querySelector('.sl-detail-row[data-unit="' + unit + '"]');
            if (!detail) return;
            var isOpen = row.classList.contains('expanded');
            if (isOpen) {
                row.classList.remove('expanded');
                detail.style.display = 'none';
            } else {
                row.classList.add('expanded');
                detail.style.display = 'table-row';
            }
        };

        /* Edit appliance — open modal with "Edit Appliance" title */
        window.slEditAppliance = function(btn, e) {
            if (e) e.stopPropagation();
            var modalH2 = document.querySelector('#modal-add-appliance .mh-title-group h2');
            var modalSub = document.querySelector('#modal-add-appliance .mh-title-group .mh-sub');
            if (modalH2) modalH2.textContent = 'Edit Appliance';
            if (modalSub) modalSub.textContent = 'Update brand, warranty, and service schedule for this appliance';
            openModal('modal-add-appliance');
        };

        /* Reset title when "Add Appliance" button is used */
        var origAddBtn = document.getElementById('btn-add-appliance');
        if (origAddBtn) {
            origAddBtn.addEventListener('click', function() {
                var modalH2 = document.querySelector('#modal-add-appliance .mh-title-group h2');
                var modalSub = document.querySelector('#modal-add-appliance .mh-title-group .mh-sub');
                if (modalH2) modalH2.textContent = 'Add Appliance';
                if (modalSub) modalSub.textContent = 'Track brand, warranty, and service schedule for this unit';
            });
        }

        window.slFilterApplianceRows = function(query) {
            var q = (query || '').toLowerCase().trim();
            var unitFilter = document.getElementById('sl-appl-filter').value;
            var unitRows = document.querySelectorAll('#sl-appl-table .sl-unit-row');
            unitRows.forEach(function(row) {
                var unit = row.getAttribute('data-unit');
                var detail = document.querySelector('.sl-detail-row[data-unit="' + unit + '"]');
                var unitName = row.querySelector('.sl-unit-label span').textContent.toLowerCase();

                // Check unit filter dropdown
                var unitMatch = !unitFilter || unit === unitFilter;
                // Check text search — match against unit name or any appliance name in the detail
                var textMatch = !q || unitName.indexOf(q) !== -1;
                if (!textMatch && detail) {
                    var appNames = detail.querySelectorAll('strong');
                    for (var i = 0; i < appNames.length; i++) {
                        if (appNames[i].textContent.toLowerCase().indexOf(q) !== -1) {
                            textMatch = true; break;
                        }
                    }
                }
                var show = unitMatch && textMatch;
                row.style.display = show ? '' : 'none';
                if (detail) detail.style.display = (show && row.classList.contains('expanded')) ? 'table-row' : 'none';
            });
            // Also hide/show total row based on whether any units are visible
            var totalRow = document.querySelector('#sl-appl-table .sl-total-row');
            if (totalRow) totalRow.style.display = (unitFilter || q) ? 'none' : '';
        };

        document.getElementById('btn-view-appliances').addEventListener('click', () => openSlideout('slideout-appliances-bg', 'slideout-appliances'));
        document.getElementById('close-appliances').addEventListener('click', () => closeSlideout('slideout-appliances-bg', 'slideout-appliances'));
        document.getElementById('slideout-appliances-bg').addEventListener('click', () => closeSlideout('slideout-appliances-bg', 'slideout-appliances'));

        document.getElementById('btn-add-appliance').addEventListener('click', () => openModal('modal-add-appliance'));
        document.getElementById('close-add-appliance').addEventListener('click', () => closeModal('modal-add-appliance'));
        document.getElementById('cancel-add-appliance').addEventListener('click', () => closeModal('modal-add-appliance'));
        document.getElementById('modal-add-appliance').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeModal('modal-add-appliance'); });

        document.getElementById('btn-view-loan').addEventListener('click', () => openSlideout('slideout-loan-bg', 'slideout-loan'));
        document.getElementById('close-loan').addEventListener('click', () => closeSlideout('slideout-loan-bg', 'slideout-loan'));
        document.getElementById('slideout-loan-bg').addEventListener('click', () => closeSlideout('slideout-loan-bg', 'slideout-loan'));

        (function loanModalArm() {
            const btnAddLoan = document.getElementById('btn-add-loan');
            const typeSel = document.getElementById('add-loan-type');
            const panel = document.getElementById('add-loan-arm-panel');
            const hint = document.getElementById('add-loan-rate-hint');
            const rateInput = document.getElementById('add-loan-rate-input');
            const indexSel = document.getElementById('arm-index');
            const marginIn = document.getElementById('arm-margin');
            const indexCustom = document.getElementById('arm-index-custom');
            const previewText = document.getElementById('arm-fully-indexed-text');

            function getArmIndexPercent() {
                if (!indexSel || !indexCustom) return null;
                const opt = indexSel.selectedOptions[0];
                if (opt.value === 'custom') {
                    const v = parseFloat(String(indexCustom.value).replace(',', '.'));
                    return Number.isFinite(v) ? v : null;
                }
                const v = parseFloat(opt.value);
                return Number.isFinite(v) ? v : null;
            }

            function updateArmIndexedPreview() {
                if (!typeSel || typeSel.value !== 'ARM' || !previewText || !marginIn) return;
                const idx = getArmIndexPercent();
                const margin = parseFloat(String(marginIn.value).replace(',', '.'));
                if (idx == null || !Number.isFinite(margin)) {
                    previewText.textContent = 'Select index and enter margin to estimate index + margin.';
                    return;
                }
                const full = idx + margin;
                const idxName = indexSel ? optLabel(indexSel) : 'Index';
                previewText.textContent = idxName + ': ' + idx.toFixed(2) + '% + margin ' + margin.toFixed(2) + '% → fully indexed ' + full.toFixed(3) + '% (illustrative; caps/floors not applied).';
            }

            function optLabel(sel) {
                const o = sel.selectedOptions[0];
                return (o && o.dataset.label) ? o.dataset.label : 'Index';
            }

            function syncLoanTypeUi() {
                if (!typeSel || !panel) return;
                const isArm = typeSel.value === 'ARM';
                panel.classList.toggle('is-visible', isArm);
                panel.setAttribute('aria-hidden', String(!isArm));
                if (hint) {
                    hint.textContent = isArm ? '— start rate for initial fixed period' : '';
                }
                if (rateInput) {
                    rateInput.placeholder = isArm ? 'e.g. 5.875 (initial fixed)' : 'e.g. 5.25';
                }
                if (isArm) updateArmIndexedPreview();
            }

            if (btnAddLoan) {
                btnAddLoan.addEventListener('click', () => {
                    openModal('modal-add-loan');
                    syncLoanTypeUi();
                });
            }
            if (typeSel) typeSel.addEventListener('change', syncLoanTypeUi);
            if (indexSel) indexSel.addEventListener('change', updateArmIndexedPreview);
            if (marginIn) marginIn.addEventListener('input', updateArmIndexedPreview);
            if (indexCustom) indexCustom.addEventListener('input', updateArmIndexedPreview);
        })();

        document.getElementById('close-add-loan').addEventListener('click', () => closeModal('modal-add-loan'));
        document.getElementById('cancel-add-loan').addEventListener('click', () => closeModal('modal-add-loan'));
        document.getElementById('modal-add-loan').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeModal('modal-add-loan'); });

        // ── Make Payment modal handlers ──
        document.getElementById('btn-make-payment').addEventListener('click', () => {
            // Default payment date to today
            var dateInput = document.getElementById('pmt-date');
            if (dateInput && !dateInput.value) {
                var d = new Date();
                dateInput.value = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
            }
            openModal('modal-make-payment');
        });
        document.getElementById('close-make-payment').addEventListener('click', () => closeModal('modal-make-payment'));
        document.getElementById('cancel-make-payment').addEventListener('click', () => closeModal('modal-make-payment'));
        document.getElementById('modal-make-payment').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeModal('modal-make-payment'); });

        // Expose openPaymentModal for external use
        window.openPaymentModal = function() {
            document.getElementById('btn-make-payment').click();
        };

        // ── Loan tab switching ──
        window.switchLoanTab = function(btn) {
            var tabs = document.querySelectorAll('.ovm-loan-tab');
            var contents = document.querySelectorAll('.ovm-loan-content');
            var loanId = btn.getAttribute('data-loan');
            tabs.forEach(function(t) { t.classList.remove('active'); });
            contents.forEach(function(c) { c.classList.remove('active'); });
            btn.classList.add('active');
            var target = document.getElementById(loanId);
            if (target) target.classList.add('active');
        };

        // ── Payment modal: live remaining calculation ──
        function parseCurrency(val) {
            if (!val) return 0;
            var n = parseFloat(String(val).replace(/[^0-9.\-]/g, ''));
            return Number.isFinite(n) ? n : 0;
        }

        window.pmtCalcRemaining = function() {
            var total = parseCurrency(document.getElementById('pmt-total').value);
            var principal = parseCurrency(document.getElementById('pmt-principal').value);
            var interest = parseCurrency(document.getElementById('pmt-interest').value);
            var remaining = total - principal - interest;
            var el = document.getElementById('pmt-remaining');
            if (!el) return;
            el.textContent = 'Remaining: $' + Math.abs(remaining).toFixed(2);
            el.classList.remove('is-zero', 'has-remainder');
            if (Math.abs(remaining) < 0.01) {
                el.classList.add('is-zero');
                el.textContent = 'Remaining: $0.00 — Fully allocated';
            } else {
                el.classList.add('has-remainder');
            }
        };

        // ── Interest adjustment (slideout) ──
        window.slToggleInterestAdj = function() {
            var panel = document.getElementById('int-adj-panel');
            if (!panel) return;
            panel.classList.toggle('is-open');
            // Reset on close
            if (!panel.classList.contains('is-open')) {
                var inp = document.getElementById('interest-adj-amount');
                if (inp) inp.value = '';
                var succ = document.getElementById('int-adj-success');
                if (succ) succ.style.display = 'none';
                window.intAdjPreview();
            }
        };

        window.intAdjPreview = function() {
            var totalPaid = 24000;
            var moveAmt = parseCurrency(document.getElementById('interest-adj-amount').value);
            if (moveAmt < 0) moveAmt = 0;
            if (moveAmt > totalPaid) moveAmt = totalPaid;
            var newPrincipal = totalPaid - moveAmt;
            var newInterest = moveAmt;
            var elP = document.getElementById('int-adj-new-principal');
            var elI = document.getElementById('int-adj-new-interest');
            if (elP) elP.textContent = '$' + newPrincipal.toLocaleString();
            if (elI) elI.textContent = '$' + newInterest.toLocaleString();
        };

        window.applyInterestAdj = function() {
            var moveAmt = parseCurrency(document.getElementById('interest-adj-amount').value);
            var totalPaid = 24000;
            if (moveAmt < 0) moveAmt = 0;
            if (moveAmt > totalPaid) moveAmt = totalPaid;
            var newPrincipal = totalPaid - moveAmt;
            var newInterest = moveAmt;
            // Update the "current" display
            var curP = document.getElementById('int-adj-cur-principal');
            var curI = document.getElementById('int-adj-cur-interest');
            if (curP) curP.textContent = '$' + newPrincipal.toLocaleString();
            if (curI) curI.textContent = '$' + newInterest.toLocaleString();
            // Show success message
            var succ = document.getElementById('int-adj-success');
            if (succ) succ.style.display = 'block';
            // Collapse after a short delay
            setTimeout(function() {
                window.slToggleInterestAdj();
            }, 1500);
        };

        // ── Tax & Insurance adjustment (slideout) ──
        window.slToggleTaxInsAdj = function() {
            var panel = document.getElementById('tax-ins-adj-panel');
            if (!panel) return;
            panel.classList.toggle('is-open');
            // Reset on close
            if (!panel.classList.contains('is-open')) {
                var taxInp = document.getElementById('tax-adj-amount');
                var insInp = document.getElementById('ins-adj-amount');
                if (taxInp) taxInp.value = '';
                if (insInp) insInp.value = '';
                var succ = document.getElementById('tax-ins-adj-success');
                if (succ) succ.style.display = 'none';
                window.taxInsAdjPreview();
            }
        };

        window.taxInsAdjPreview = function() {
            var taxAmt = parseCurrency((document.getElementById('tax-adj-amount') || {}).value || '');
            var insAmt = parseCurrency((document.getElementById('ins-adj-amount') || {}).value || '');
            var elT = document.getElementById('tax-adj-new-tax');
            var elI = document.getElementById('tax-adj-new-ins');
            if (elT) elT.textContent = '$' + (taxAmt || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
            if (elI) elI.textContent = '$' + (insAmt || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
        };

        window.applyTaxInsAdj = function() {
            var taxAmt = parseCurrency((document.getElementById('tax-adj-amount') || {}).value || '');
            var insAmt = parseCurrency((document.getElementById('ins-adj-amount') || {}).value || '');
            // Update the "current" display values
            var curT = document.getElementById('tax-adj-cur-tax');
            var curI = document.getElementById('tax-adj-cur-ins');
            if (curT) curT.textContent = '$' + (taxAmt || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
            if (curI) curI.textContent = '$' + (insAmt || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
            // Show success message
            var succ = document.getElementById('tax-ins-adj-success');
            if (succ) succ.style.display = 'block';
            // Collapse after a short delay
            setTimeout(function() {
                window.slToggleTaxInsAdj();
            }, 1500);
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSlideout('slideout-appliances-bg', 'slideout-appliances');
                closeSlideout('slideout-loan-bg', 'slideout-loan');
                closeModal('modal-add-appliance');
                closeModal('modal-add-loan');
                closeModal('modal-make-payment');
            }
        });
    })();
