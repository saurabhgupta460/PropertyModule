/* ===============================================
   Property Detail - SUW + BSUW wizards
   (originally lines 7380-8687 of Property_detailed_view.html)
   =============================================== */

    (function () {
        'use strict';

        // ── Amenities Master Data ─────────────────────────────────────────────────
        var AMENITIES = {
            property: [
                { id:'rec',      label:'Recreation & Fitness',     icon:'fa-dumbbell',
                  items:['Swimming Pool','Spa / Hot Tub','Fitness Center / Gym','Yoga / Aerobics Room',
                         'Tennis Court','Basketball Court','Playground / Tot Lot',
                         'Walking / Jogging Trails','Rooftop Deck / Lounge','Bike Paths'] },
                { id:'pet_prop', label:'Pet Amenities',            icon:'fa-paw',
                  items:['Dog Park / Dog Run','Pet Washing Station / Grooming',
                         'Pet-Friendly Designated Areas','Pet Waste Stations'] },
                { id:'outdoor',  label:'Outdoor & Landscaping',    icon:'fa-tree',
                  items:['Community Garden / Green Space','BBQ / Grilling Stations','Courtyard',
                         'Outdoor Seating Areas / Patio','Gazebo / Picnic Area',
                         'Fenced Property / Gated Entry','Lush Landscaping / Flowerbeds','Rooftop Garden'] },
                { id:'parking',  label:'Parking & Transport',      icon:'fa-car',
                  items:['On-Site Parking (Surface Lot)','Covered Parking / Carport','Parking Garage',
                         'Assigned Parking Spaces','EV Charging Stations',
                         'Bike Parking / Bike Storage','Guest Parking'] },
                { id:'common',   label:'Common Spaces',            icon:'fa-door-open',
                  items:['Clubhouse / Resident Lounge','Business Center / Co-Working',
                         'Conference / Meeting Room','Package Lockers / Package Room','Mailroom',
                         'Laundry Room / On-Site Laundry','Lobby / Controlled-Access Entry',
                         'Elevator','Coffee Bar / Complimentary Coffee'] },
                { id:'security', label:'Security & Safety',        icon:'fa-shield-alt',
                  items:['Gated / Controlled Access Entry','On-Site Security / 24-Hr Security',
                         'Security Cameras / CCTV','Key Fob / Card Access',
                         'Video Intercom System','Well-Lit Parking & Pathways'] },
                { id:'services', label:'Services & Conveniences',  icon:'fa-concierge-bell',
                  items:['24-Hour Emergency Maintenance','On-Site Management Office',
                         'Concierge Service','Trash / Recycling Service','Valet Trash',
                         'On-Site Dry Cleaners','Storage Units / Facilities','Common Area WiFi'] },
                { id:'tech_prop',label:'Technology',               icon:'fa-wifi',
                  items:['High-Speed Internet / Fiber (Common)','Online Resident Portal / App',
                         'Smart Building Access System','Online Rent Payment'] }
            ],
            unit: [
                { id:'kitchen',      label:'Kitchen Features',       icon:'fa-utensils',
                  items:['Dishwasher','Refrigerator','Range / Oven (Gas or Electric)',
                         'Microwave (Built-in)','Garbage Disposal','Stainless Steel Appliances',
                         'Granite / Quartz Countertops','Island / Breakfast Bar','Pantry',
                         'Gas Stove / Cooktop','Wine Refrigerator','Open Floor Plan'] },
                { id:'laundry',      label:'Laundry',               icon:'fa-tshirt',
                  items:['In-Unit Washer & Dryer','Washer / Dryer Hookups','Washer / Dryer (Stackable)'] },
                { id:'climate',      label:'Climate Control',        icon:'fa-thermometer-half',
                  items:['Central Air Conditioning (A/C)','Central Heating / Forced Air',
                         'HVAC System','Ceiling Fans','Radiant / Baseboard Heat','Smart Thermostat'] },
                { id:'flooring',     label:'Flooring',              icon:'fa-grip-lines',
                  items:['Hardwood Floors','Laminate / Vinyl Plank (LVP)','Tile Flooring',
                         'Carpet (New)','Luxury Vinyl Tile (LVT)','Concrete / Polished Floors'] },
                { id:'rooms',        label:'Rooms & Interior',       icon:'fa-home',
                  items:['Walk-In Closet(s)','Extra Storage Space','Fireplace (Gas or Wood)',
                         'Loft / Extra Room','Den / Office Space','High / Vaulted Ceilings',
                         'Large Windows / Natural Light','Window Coverings / Blinds',
                         'Built-in Shelving','Wet Bar'] },
                { id:'outdoor_unit', label:'Outdoor (Unit)',         icon:'fa-leaf',
                  items:['Private Balcony / Patio','Covered Porch','Private Yard / Fenced Yard',
                         'Deck','Attached Private Garage','Garden Area / Planting Box'] },
                { id:'smart',        label:'Smart Home / Tech',      icon:'fa-mobile-alt',
                  items:['Smart Lock / Keyless Entry','Video Doorbell',
                         'Smart Thermostat (Unit-Level)','Smart Lighting / Motion Sensors',
                         'High-Speed Internet / Fiber Ready','Cable TV / Satellite Ready',
                         'USB Outlets / Modern Electrical'] },
                { id:'pet_unit',     label:'Pet-Friendly (Unit)',    icon:'fa-paw',
                  items:['Pets Allowed (Cats / Dogs)','Easy-Clean Flooring (Pet-Safe)',
                         'Ground-Floor / Yard Access'] }
            ]
        };

        // ── State ────────────────────────────────────────────────────────────────
        var saved = {
            propAmenities: new Set(),
            propPhotos: []      // [{id, src, name, isPrimary}]
        };

        // Working copies (modified in modal, committed on Save)
        var working       = new Set();
        var workingPhotos = [];
        var photoIdCounter = 0;

        // Modal context
        var activeFilter = 'all';
        var searchQuery  = '';

        // ── Utility ───────────────────────────────────────────────────────────────
        function esc(s) {
            return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
                            .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        }
        function openModal(id)  { var el=document.getElementById(id); if(el){el.classList.add('am-open');    document.body.style.overflow='hidden';} }
        function closeModal(id) { var el=document.getElementById(id); if(el){el.classList.remove('am-open'); document.body.style.overflow='';} }

        // ── Quad-section preview helpers ─────────────────────────────────────────
        function renderTagsPreview(containerEl, items, btnId) {
            if (items.length === 0) {
                containerEl.innerHTML = '<span class="am-empty-hint">None selected yet.</span>';
                return;
            }
            var html = items.map(function(a) {
                return '<span class="am-tag"><i class="fas fa-check" style="font-size:8px;opacity:0.65;"></i>' + esc(a) + '</span>';
            }).join('');
            containerEl.innerHTML = html;
        }

        function renderSelectedStrip() {
            var items = Array.from(working);
            var countEl = document.getElementById('am-sel-count');
            var tagsEl  = document.getElementById('am-sel-tags');
            if (!countEl || !tagsEl) return;
            countEl.textContent = items.length;
            if (items.length === 0) {
                tagsEl.innerHTML = '<span class="am-sel-empty">Nothing selected yet — pick amenities below.</span>';
                return;
            }
            tagsEl.innerHTML = '';
            items.forEach(function(amenity) {
                var tag = document.createElement('span');
                tag.className = 'am-sel-tag';
                tag.innerHTML = esc(amenity)
                    + '<button class="am-sel-tag-remove" type="button" title="Remove"><i class="fas fa-times" style="pointer-events:none;"></i></button>';
                tag.querySelector('.am-sel-tag-remove').addEventListener('click', function() {
                    working.delete(amenity);
                    renderSelectedStrip();
                    renderAmenities();
                    refreshAmenityCount();
                });
                tagsEl.appendChild(tag);
            });
        }

        function renderPhotosPreview(containerEl, photos, btnId) {
            var max = 6, extra = photos.length - max;
            var html = '';
            photos.slice(0, max).forEach(function(ph, i) {
                var isLastMore = (i === max - 1 && extra > 0);
                html += '<div class="am-photo-thumb">'
                    + '<img src="' + esc(ph.src) + '" alt="' + esc(ph.name) + '">'
                    + (isLastMore ? '<div class="am-photo-more-overlay">+' + (extra + 1) + '</div>' : '')
                    + (ph.isPrimary && !isLastMore ? '<div style="position:absolute;bottom:3px;left:3px;background:rgba(59,141,189,0.88);color:#fff;font-size:8px;font-weight:700;padding:1px 5px;border-radius:3px;">PRIMARY</div>' : '')
                    + '</div>';
            });
            html += '<div class="am-photo-upload-hint" onclick="document.getElementById(\'' + btnId + '\').click()">'
                  + '<i class="fas fa-cloud-upload-alt" style="font-size:15px;"></i><span>Upload</span></div>';
            containerEl.innerHTML = html;
        }

        function updateAllPreviews() {
            // Property Amenities
            var pAm = Array.from(saved.propAmenities);
            document.getElementById('am-count-prop-am').textContent = pAm.length + ' selected';
            renderTagsPreview(document.getElementById('am-tags-prop'), pAm, 'btn-prop-amenities');

            // Property Photos
            var pPh = saved.propPhotos;
            document.getElementById('am-count-prop-ph').textContent =
                pPh.length === 0 ? '0 photos' : pPh.length + (pPh.length === 1 ? ' photo' : ' photos');
            renderPhotosPreview(document.getElementById('am-photos-prop'), pPh, 'btn-prop-photos');
        }

        // ── Amenities Modal ───────────────────────────────────────────────────────
        function openAmenitiesModal() {
            activeFilter = 'all';
            searchQuery  = '';
            working = new Set(saved.propAmenities);
            document.getElementById('am-amenity-search').value = '';
            renderCategoryChips();
            renderAmenities();
            renderSelectedStrip();
            openModal('am-modal-amenities');
        }

        function renderAmenities() {
            var container = document.getElementById('am-amenity-body');
            var cats = AMENITIES['property'];
            var q = searchQuery.toLowerCase();
            container.innerHTML = '';
            var anyVisible = false;

            cats.forEach(function(cat) {
                if (activeFilter !== 'all' && activeFilter !== cat.id) return;
                var items = q === '' ? cat.items : cat.items.filter(function(i) {
                    return i.toLowerCase().indexOf(q) !== -1;
                });
                if (items.length === 0) return;
                anyVisible = true;

                var section = document.createElement('div');
                section.className = 'am-cat-section';
                section.innerHTML =
                    '<div class="am-cat-title"><i class="fas ' + cat.icon + '"></i>'
                    + esc(cat.label) + '<span class="am-cat-badge">' + items.length + '</span></div>'
                    + '<div class="am-amenity-grid" id="amgrid-' + cat.id + '"></div>';
                container.appendChild(section);

                var grid = section.querySelector('.am-amenity-grid');
                items.forEach(function(amenity) {
                    var isSel = working.has(amenity);
                    var chip = document.createElement('button');
                    chip.type = 'button';
                    chip.className = 'am-amenity-chip' + (isSel ? ' selected' : '');
                    chip.innerHTML =
                        '<span class="am-check-icon"><i class="fas fa-check" style="font-size:9px;pointer-events:none;"></i></span>'
                        + esc(amenity);
                    chip.addEventListener('click', function() {
                        if (working.has(amenity)) {
                            working.delete(amenity);
                            chip.classList.remove('selected');
                        } else {
                            working.add(amenity);
                            chip.classList.add('selected');
                        }
                        refreshAmenityCount();
                        renderSelectedStrip();
                    });
                    grid.appendChild(chip);
                });
            });

            if (!anyVisible) {
                container.innerHTML = '<div class="am-no-results"><i class="fas fa-search"></i>No amenities match your search.</div>';
            }
            refreshAmenityCount();
        }

        function refreshAmenityCount() {
            var count = working.size;
            var fc = document.getElementById('am-footer-count');
            if (fc) fc.innerHTML = '<strong>' + count + '</strong> amenities selected';
        }

        function renderCategoryChips() {
            var cats = AMENITIES['property'];
            var el = document.getElementById('am-cat-chips');
            var html = '<button class="am-chip' + (activeFilter === 'all' ? ' active' : '') + '" data-filter="all">All Categories</button>';
            cats.forEach(function(cat) {
                html += '<button class="am-chip' + (activeFilter === cat.id ? ' active' : '') + '" data-filter="' + cat.id + '">' + esc(cat.label) + '</button>';
            });
            el.innerHTML = html;
            el.querySelectorAll('.am-chip').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    activeFilter = btn.dataset.filter;
                    renderCategoryChips();
                    renderAmenities();
                });
            });
        }

        // ── Media Modal ───────────────────────────────────────────────────────────
        function openMediaModal() {
            workingPhotos = saved.propPhotos.map(function(p) { return Object.assign({}, p); });
            document.getElementById('am-modal-media-title').textContent = 'Property Photos';
            renderMediaGrid();
            openModal('am-modal-media');
        }

        function renderMediaGrid() {
            var grid     = document.getElementById('am-media-grid');
            var countEl  = document.getElementById('am-media-count');
            if (!grid) return;

            if (workingPhotos.length === 0) {
                grid.innerHTML = '<div class="am-media-empty"><i class="fas fa-images"></i>No photos uploaded yet.</div>';
                if (countEl) countEl.innerHTML = '<strong>0</strong> photos uploaded';
                return;
            }
            if (countEl) countEl.innerHTML =
                '<strong>' + workingPhotos.length + '</strong> photo'
                + (workingPhotos.length !== 1 ? 's' : '') + ' uploaded';

            var tagOptions = ['Primary','Living Room','Kitchen','Bedroom','Bathroom','Exterior','Floor Plan','Dining Room','Balcony','Other'];
            grid.innerHTML = '';
            workingPhotos.forEach(function(ph) {
                var card = document.createElement('div');
                card.className = 'am-media-card';

                var item = document.createElement('div');
                item.className = 'am-media-item';
                item.innerHTML =
                    '<img src="' + esc(ph.src) + '" alt="' + esc(ph.name) + '">'
                    + (ph.isPrimary
                        ? '<span class="am-primary-badge">PRIMARY</span>'
                        : '<button class="am-set-primary-btn" data-id="' + ph.id + '">Set Primary</button>')
                    + '<button class="am-media-del" data-id="' + ph.id + '" title="Remove"><i class="fas fa-times"></i></button>';

                var tagRow = document.createElement('div');
                tagRow.className = 'am-media-tag-row';
                tagRow.innerHTML = '<i class="fas fa-tag tag-icon"></i>';

                var sel = document.createElement('select');
                sel.className = 'am-media-tag-select';
                tagOptions.forEach(function(opt) {
                    var o = document.createElement('option');
                    o.value = opt; o.textContent = opt;
                    if (opt === (ph.tag || (ph.isPrimary ? 'Primary' : 'Living Room'))) o.selected = true;
                    sel.appendChild(o);
                });
                sel.addEventListener('change', function() { ph.tag = sel.value; });

                tagRow.appendChild(sel);
                card.appendChild(item);
                card.appendChild(tagRow);
                grid.appendChild(card);
            });

            grid.querySelectorAll('.am-media-del').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var id = btn.dataset.id;
                    var wasPrimary = workingPhotos.some(function(p) { return p.id === id && p.isPrimary; });
                    workingPhotos = workingPhotos.filter(function(p) { return p.id !== id; });
                    if (wasPrimary && workingPhotos.length > 0) workingPhotos[0].isPrimary = true;
                    renderMediaGrid();
                });
            });
            grid.querySelectorAll('.am-set-primary-btn').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var id = btn.dataset.id;
                    workingPhotos.forEach(function(p) { p.isPrimary = (p.id === id); });
                    renderMediaGrid();
                });
            });
            // Sync tag selects to photo objects after re-render
            grid.querySelectorAll('.am-media-tag-select').forEach(function(sel, i) {
                sel.addEventListener('change', function() {
                    if (workingPhotos[i]) workingPhotos[i].tag = sel.value;
                });
            });
        }

        function handleFiles(files) {
            Array.from(files).forEach(function(file) {
                if (!file.type.startsWith('image/')) return;
                var reader = new FileReader();
                reader.onload = function(e) {
                    photoIdCounter++;
                    workingPhotos.push({
                        id: 'ph_' + photoIdCounter,
                        src: e.target.result,
                        name: file.name,
                        isPrimary: workingPhotos.length === 0,
                        tag: workingPhotos.length === 0 ? 'Primary' : 'Living Room'
                    });
                    renderMediaGrid();
                };
                reader.readAsDataURL(file);
            });
        }

        // ── Wire everything up ────────────────────────────────────────────────────
        document.addEventListener('DOMContentLoaded', function() {

            // Property Amenities button
            // Property Amenities button
            document.getElementById('btn-prop-amenities').addEventListener('click', function() {
                openAmenitiesModal();
            });

            // Search
            document.getElementById('am-amenity-search').addEventListener('input', function(e) {
                searchQuery  = e.target.value;
                activeFilter = 'all';
                renderCategoryChips();
                renderAmenities();
            });

            // Save Amenities
            document.getElementById('am-save-amenities').addEventListener('click', function() {
                saved.propAmenities = new Set(working);
                updateAllPreviews();
                closeModal('am-modal-amenities');
            });

            // Close amenities modal
            document.getElementById('am-close-amenities').addEventListener('click', function() { closeModal('am-modal-amenities'); });
            document.getElementById('am-cancel-amenities').addEventListener('click', function() { closeModal('am-modal-amenities'); });
            document.getElementById('am-modal-amenities').addEventListener('click', function(e) {
                if (e.target.id === 'am-modal-amenities') closeModal('am-modal-amenities');
            });

            // Property Photos button
            document.getElementById('btn-prop-photos').addEventListener('click', function() {
                openMediaModal();
            });

            // Save Photos
            document.getElementById('am-save-media').addEventListener('click', function() {
                saved.propPhotos = workingPhotos.map(function(p) { return Object.assign({}, p); });
                updateAllPreviews();
                closeModal('am-modal-media');
            });

            // Close media modal
            document.getElementById('am-close-media').addEventListener('click', function() { closeModal('am-modal-media'); });
            document.getElementById('am-cancel-media').addEventListener('click', function() { closeModal('am-modal-media'); });
            document.getElementById('am-modal-media').addEventListener('click', function(e) {
                if (e.target.id === 'am-modal-media') closeModal('am-modal-media');
            });

            // Drag & Drop
            var dropZone  = document.getElementById('am-drop-zone');
            var fileInput = document.getElementById('am-file-input');
            document.getElementById('am-browse-btn').addEventListener('click', function() { fileInput.click(); });
            fileInput.addEventListener('change', function() { handleFiles(fileInput.files); fileInput.value = ''; });
            dropZone.addEventListener('dragover',  function(e) { e.preventDefault(); dropZone.classList.add('drag-over'); });
            dropZone.addEventListener('dragleave', function()  { dropZone.classList.remove('drag-over'); });
            dropZone.addEventListener('drop', function(e) {
                e.preventDefault(); dropZone.classList.remove('drag-over');
                handleFiles(e.dataTransfer.files);
            });

            // ESC to close any open modal
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeModal('am-modal-amenities');
                    closeModal('am-modal-media');
                }
            });

            // Initial preview render
            updateAllPreviews();
        });
    })();

    /* ══ SETUP UNIT WIZARD ══ */
    (function() {
        var overlay     = document.getElementById('suw-overlay');
        if (!overlay) return;
        var totalSteps  = 5;
        var currentStep = 1;
        var suwEditMode = false;

        /* Units per property – 150 units generated for 5553 A Janson Avenue */
        var SUW_PROPERTY_UNITS = (function() {
            function pad(n) { return n < 10 ? '0' + n : '' + n; }
            var units = [];
            for (var f = 1; f <= 10; f++)
                for (var u = 1; u <= 15; u++)
                    units.push('Unit ' + f + pad(u));
            return { '5553 A Janson Avenue': units };
        })();

        var SUW_AMENITIES = {
            'Interior': ['Air Conditioning','Heating','Ceiling Fans','Hardwood Floors','Carpet','Tile Floors','Walk-in Closet','Linen Closet','In-Unit Washer/Dryer','Washer/Dryer Hookups','Dishwasher','Garbage Disposal','Microwave','Refrigerator','Stove/Range','Oven','Fireplace','Balcony/Patio','Private Yard','Storage Room'],
            'Bathroom': ['Walk-in Shower','Bathtub','Double Vanity','Soaking Tub','Bidet'],
            'Kitchen':  ['Granite Countertops','Quartz Countertops','Kitchen Island','Breakfast Bar','Stainless Steel Appliances','Gas Range','Double Oven'],
            'Tech & Utilities': ['High-Speed Internet','Cable Ready','Smart Thermostat','Smart Lock','EV Charging','Solar Panels'],
            'Accessibility': ['Wheelchair Accessible','Roll-in Shower','Grab Bars','First Floor Unit','Elevator Access']
        };
        var suwSelectedAmenities = new Set();
        var suwPhotos = [];

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

        function suwOpen() {
            suwEditMode = false;
            currentStep = 1;
            suwSelectedAmenities.clear();
            suwPhotos = [];
            document.getElementById('suw-success-msg').style.display = 'none';
            document.getElementById('suw-btn-next').classList.remove('finish');
            document.getElementById('suw-btn-next').textContent = 'Next';
            // Populate unit dropdown from the current property
            var propName = (document.getElementById('suw-property-select') || {}).value || '5553 A Janson Avenue';
            var unitSel = document.getElementById('suw-unit-select');
            if (unitSel) {
                var units = SUW_PROPERTY_UNITS[propName] || [];
                unitSel.innerHTML = '<option value="">— Select a unit —</option>'
                    + units.map(function(u) { return '<option>' + u + '</option>'; }).join('');
                unitSel.style.borderColor = '';
            }
            var editNameEl = document.getElementById('suw-edit-unit-name');
            if (editNameEl) { editNameEl.value = ''; editNameEl.style.borderColor = ''; }
            suwRender();
            overlay.classList.add('open');
            overlay.scrollTop = 0;
            document.body.style.overflow = 'hidden';
        }
        /* Opens wizard at Step 2, pre-filled with the unit's name — used by Edit Unit 3-dot */
        function suwOpenEdit(unitName) {
            suwEditMode = true;
            currentStep = 2;
            suwSelectedAmenities.clear();
            suwPhotos = [];
            document.getElementById('suw-success-msg').style.display = 'none';
            document.getElementById('suw-btn-next').classList.remove('finish');
            document.getElementById('suw-btn-next').textContent = 'Next';
            var editNameEl = document.getElementById('suw-edit-unit-name');
            if (editNameEl) { editNameEl.value = unitName || ''; editNameEl.style.borderColor = ''; }
            suwRender();
            overlay.classList.add('open');
            overlay.scrollTop = 0;
            document.body.style.overflow = 'hidden';
        }
        function suwClose() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }
        window.suwOpen     = suwOpen;
        window.suwOpenEdit = suwOpenEdit;
        window.suwClose    = suwClose;

        function suwRender() {
            // Toggle edit-mode class to show/hide Step 1 pill
            overlay.classList.toggle('edit-mode', suwEditMode);
            // Swap topbar title based on mode
            var titleEl = document.querySelector('#suw-overlay .apw-topbar-title h1');
            var subtitleEl = document.querySelector('#suw-overlay .apw-topbar-title p');
            if (titleEl) titleEl.textContent = suwEditMode ? 'Edit Unit' : 'Set Up Unit';
            if (subtitleEl) subtitleEl.textContent = suwEditMode
                ? 'Update unit details, amenities and photos'
                : 'Add a new unit with details, amenities and photos';
            document.querySelectorAll('#suw-overlay .apw-step').forEach(function(el) {
                var s = parseInt(el.dataset.step);
                el.classList.toggle('active',    s === currentStep);
                el.classList.toggle('completed', s < currentStep);
                var circle = el.querySelector('.apw-step-circle');
                if (s < currentStep) circle.innerHTML = '<i class="fas fa-check" style="font-size:11px;"></i>';
                else circle.textContent = s;
            });
            document.querySelectorAll('#suw-overlay .apw-step-content').forEach(function(el) {
                el.classList.toggle('active', parseInt(el.dataset.step) === currentStep);
            });
            document.getElementById('suw-step-label').textContent = 'Step ' + currentStep + ' of ' + totalSteps;
            var btnNext = document.getElementById('suw-btn-next');
            if (currentStep === totalSteps) { btnNext.textContent = 'Save'; btnNext.classList.add('finish'); }
            else { btnNext.textContent = 'Next'; btnNext.classList.remove('finish'); }
            document.getElementById('suw-btn-back').style.visibility = currentStep === 1 ? 'hidden' : 'visible';
            if (currentStep === 3) { suwRenderAmenityChips(); suwRenderSelStrip(); }
            if (currentStep === 4) suwRenderPhotoGrid();
            overlay.scrollTop = 0;
        }

        function suwPopulateReview() {
            function v(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
            document.getElementById('suw-rv-property').textContent  = v('suw-property-select') || '—';
            document.getElementById('suw-rv-name').textContent      = v('suw-edit-unit-name') || '—';
            document.getElementById('suw-rv-beds').textContent      = v('suw-beds')      || '—';
            document.getElementById('suw-rv-baths').textContent     = v('suw-baths')     || '—';
            document.getElementById('suw-rv-size').textContent      = v('suw-size') ? v('suw-size') + ' sq ft' : '—';
            var amCount = suwSelectedAmenities.size;
            document.getElementById('suw-rv-amenities').textContent = amCount > 0 ? amCount + ' amenit' + (amCount === 1 ? 'y' : 'ies') + ' selected' : '—';
            var phCount = suwPhotos.length;
            document.getElementById('suw-rv-photos').textContent    = phCount > 0 ? phCount + ' photo' + (phCount === 1 ? '' : 's') + ' uploaded' : '—';
        }

        var dropZone   = document.getElementById('suw-photo-drop');
        var photoInput = document.getElementById('suw-photo-input');
        if (dropZone) {
            dropZone.addEventListener('click', function() { photoInput.click(); });
            dropZone.addEventListener('dragover', function(e) { e.preventDefault(); dropZone.classList.add('drag-over'); });
            dropZone.addEventListener('dragleave', function() { dropZone.classList.remove('drag-over'); });
            dropZone.addEventListener('drop', function(e) { e.preventDefault(); dropZone.classList.remove('drag-over'); suwHandleFiles(e.dataTransfer.files); });
        }
        if (photoInput) photoInput.addEventListener('change', function() { suwHandleFiles(this.files); this.value = ''; });

        document.getElementById('suw-btn-back').addEventListener('click', function() {
            // In edit mode step 2 is the first visible step — Back closes
            if (currentStep > 1 && !(suwEditMode && currentStep === 2)) { currentStep--; suwRender(); }
            else suwClose();
        });
        document.getElementById('suw-btn-next').addEventListener('click', function() {
            if (currentStep < totalSteps) {
                // Step 1 validation: a unit must be selected
                if (currentStep === 1) {
                    var unitSel = document.getElementById('suw-unit-select');
                    if (!unitSel || !unitSel.value) {
                        if (unitSel) { unitSel.style.borderColor = '#E53E3E'; unitSel.focus(); }
                        return;
                    }
                    unitSel.style.borderColor = '';
                    // Pre-fill the editable unit name in Step 2 from the dropdown selection
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
                setTimeout(function() { suwClose(); }, 2000);
            }
        });
        document.getElementById('suw-close-top').addEventListener('click', suwClose);

        // Toggle unit-tab 3-dot dropdowns
        document.addEventListener('click', function(e) {
            var dotsBtn = e.target.closest('.unit-dots-btn');
            if (dotsBtn) {
                var wrap = dotsBtn.closest('.unit-dots-wrap');
                var dd   = wrap && wrap.querySelector('.unit-dropdown');
                var isOpen = dd && dd.classList.contains('open');
                // Close all first
                document.querySelectorAll('.unit-dropdown').forEach(function(d) { d.classList.remove('open'); });
                if (dd && !isOpen) dd.classList.add('open');
                e.stopPropagation();
                return;
            }
            // Close on outside click
            if (!e.target.closest('.unit-dots-wrap')) {
                document.querySelectorAll('.unit-dropdown').forEach(function(d) { d.classList.remove('open'); });
            }
            // Wire dropdown actions
            if (e.target.closest('.unit-dd-new-listing')) {
                document.querySelectorAll('.unit-dropdown').forEach(function(d) { d.classList.remove('open'); });
                openWizard();
            }
            if (e.target.closest('.unit-dd-edit-unit')) {
                document.querySelectorAll('.unit-dropdown').forEach(function(d) { d.classList.remove('open'); });
                var row = e.target.closest('tr');
                var nameEl = row && row.querySelector('.unit-name');
                suwOpenEdit(nameEl ? nameEl.textContent.trim() : '');
            }
        });

        // ── Unit Tab Filter Dropdowns ─────────────────────────────────────────────
        (function() {
            var filters = { status: 'All', lease: 'All', ad: 'All' };

            function toggleMenu(btnId, menuId) {
                var btn  = document.getElementById(btnId);
                var menu = document.getElementById(menuId);
                if (!btn || !menu) return;
                var isOpen = menu.classList.contains('open');
                // Close all first
                document.querySelectorAll('.unit-filter-menu.open').forEach(function(m) { m.classList.remove('open'); });
                document.querySelectorAll('.unit-filter-btn.open').forEach(function(b) { b.classList.remove('open'); });
                if (!isOpen) {
                    menu.classList.add('open');
                    btn.classList.add('open');
                }
            }

            document.getElementById('uf-status-btn') && document.getElementById('uf-status-btn').addEventListener('click', function(e) {
                e.stopPropagation(); toggleMenu('uf-status-btn', 'uf-status-menu');
            });
            document.getElementById('uf-lease-btn') && document.getElementById('uf-lease-btn').addEventListener('click', function(e) {
                e.stopPropagation(); toggleMenu('uf-lease-btn', 'uf-lease-menu');
            });
            document.getElementById('uf-ad-btn') && document.getElementById('uf-ad-btn').addEventListener('click', function(e) {
                e.stopPropagation(); toggleMenu('uf-ad-btn', 'uf-ad-menu');
            });

            // Option selection
            document.querySelectorAll('.unit-filter-option').forEach(function(opt) {
                opt.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var filterKey = opt.dataset.filter;
                    var val       = opt.dataset.val;
                    filters[filterKey] = val;

                    // Update val label
                    var valEl = document.getElementById('uf-' + filterKey + '-val');
                    if (valEl) valEl.textContent = val;

                    // Mark selected in menu
                    opt.closest('.unit-filter-menu').querySelectorAll('.unit-filter-option').forEach(function(o) {
                        o.classList.toggle('selected', o === opt);
                    });

                    // Toggle active state on button
                    var btn = document.getElementById('uf-' + filterKey + '-btn');
                    if (btn) btn.classList.toggle('active', val !== 'All');

                    // Close menus
                    document.querySelectorAll('.unit-filter-menu.open').forEach(function(m) { m.classList.remove('open'); });
                    document.querySelectorAll('.unit-filter-btn.open').forEach(function(b) { b.classList.remove('open'); });

                    applyFilters();
                });
            });

            function applyFilters() {
                var rows = document.querySelectorAll('.unit-table tbody tr');
                rows.forEach(function(row) {
                    var statusBadge = row.querySelector('.unit-badge');
                    var leaseCell   = row.cells[3] ? row.cells[3].textContent.trim() : '';
                    var adToggle    = row.querySelector('.unit-activate-toggle');

                    var statusOk = filters.status === 'All' || (statusBadge && statusBadge.textContent.trim() === filters.status);

                    var leaseOk = filters.lease === 'All';
                    if (!leaseOk) {
                        var lc = leaseCell.toLowerCase();
                        if (filters.lease === 'Active')    leaseOk = lc.indexOf('active') !== -1;
                        else if (filters.lease === 'Expired')   leaseOk = lc.indexOf('expired') !== -1;
                        else if (filters.lease === 'Moving In') leaseOk = lc.indexOf('moves-in') !== -1 || lc.indexOf('moving in') !== -1;
                        else if (filters.lease === 'Moved Out') leaseOk = lc.indexOf('moved-out') !== -1 || lc.indexOf('moved out') !== -1;
                    }

                    var adOk = filters.ad === 'All';
                    if (!adOk) {
                        var isOn = adToggle && adToggle.classList.contains('on');
                        adOk = (filters.ad === 'Active' && isOn) || (filters.ad === 'Inactive' && !isOn);
                    }

                    row.style.display = (statusOk && leaseOk && adOk) ? '' : 'none';
                });
            }

            // Close menus on outside click
            document.addEventListener('click', function() {
                document.querySelectorAll('.unit-filter-menu.open').forEach(function(m) { m.classList.remove('open'); });
                document.querySelectorAll('.unit-filter-btn.open').forEach(function(b) { b.classList.remove('open'); });
            });
        })();
    })();

    /* ══ BULK SETUP UNIT WIZARD (Detail View) ══ */
    (function() {
        var overlay        = document.getElementById('bsuw-overlay');
        if (!overlay) return;
        var totalSteps     = 3, currentStep = 1;
        var BSUW_PAGE_SIZE = 20, bsuwPage = 1;
        var bsuwUnitData   = [], bsuwSelectedAmenities = new Set(), bsuwChipActions = {}, bsuwApplyToAll = true;

        var BSUW_AMENITIES = {
            'Interior':         ['Air Conditioning','Heating','Ceiling Fans','Hardwood Floors','Carpet','Tile Floors','Walk-in Closet','Linen Closet','In-Unit Washer/Dryer','Washer/Dryer Hookups','Dishwasher','Garbage Disposal','Microwave','Refrigerator','Stove/Range','Oven','Fireplace','Balcony/Patio','Private Yard','Storage Room'],
            'Bathroom':         ['Walk-in Shower','Bathtub','Double Vanity','Soaking Tub','Bidet'],
            'Kitchen':          ['Granite Countertops','Quartz Countertops','Kitchen Island','Breakfast Bar','Stainless Steel Appliances','Gas Range','Double Oven'],
            'Tech & Utilities': ['High-Speed Internet','Cable Ready','Smart Thermostat','Smart Lock','EV Charging','Solar Panels'],
            'Accessibility':    ['Wheelchair Accessible','Roll-in Shower','Grab Bars','First Floor Unit','Elevator Access']
        };

        function escA(s){return(s||'').replace(/"/g,'&quot;');} function escH(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');} function escHtml(s){return escH(s);}
        function show(id){var e=document.getElementById(id);if(e)e.classList.remove('bsuw-hidden');}
        function hide(id){var e=document.getElementById(id);if(e)e.classList.add('bsuw-hidden');}

        /* Step navigation */
        function bsuwRenderStep(n) {
            currentStep = n;
            overlay.querySelectorAll('.apw-step-content').forEach(function(el) {
                el.classList.toggle('active', parseInt(el.dataset.step) === n);
            });
            overlay.querySelectorAll('.apw-step').forEach(function(el) {
                var s = parseInt(el.dataset.step);
                el.classList.toggle('active', s === n);
                el.classList.toggle('completed', s < n);
            });
            var lbl = document.getElementById('bsuw-step-label');
            if (lbl) lbl.textContent = 'Step ' + n + ' of ' + totalSteps;
            var back = document.getElementById('bsuw-btn-back');
            var next = document.getElementById('bsuw-btn-next');
            if (back) back.style.visibility = n === 1 ? 'hidden' : 'visible';
            if (next) next.textContent = n === totalSteps ? 'Finish' : 'Next';
            if (n === 1) { bsuwGenerate(); }
            if (n === 2) { bsuw2Page = 1; bsuw2RenderUnits(); bsuw2RenderAmenities(); }
        }
        /* Wire Next / Back footer buttons */
        (function() {
            var nxt = document.getElementById('bsuw-btn-next');
            var bck = document.getElementById('bsuw-btn-back');
            if (nxt) nxt.addEventListener('click', function() {
                if (currentStep < totalSteps) bsuwRenderStep(currentStep + 1);
                else bsuwClose();
            });
            if (bck) bck.addEventListener('click', function() {
                if (currentStep > 1) bsuwRenderStep(currentStep - 1);
            });
        })();

        function bsuwBuildTable() {
            var tbody=document.getElementById('bsuw-ut-tbody');
            if(!tbody) return;
            var total=bsuwUnitData.length;
            var BED=['','Studio','1','2','3','4','5','6+'], BATH=['','1','1.5','2','2.5','3','3+'];
            var usePag=total>BSUW_PAGE_SIZE, s=usePag?(bsuwPage-1)*BSUW_PAGE_SIZE:0, e=usePag?Math.min(s+BSUW_PAGE_SIZE,total):total;
            var pag=document.getElementById('bsuw-ut-pagination'); if(pag) pag.classList.toggle('visible',usePag);
            if(usePag){
                var pc=Math.ceil(total/BSUW_PAGE_SIZE);
                var info=document.getElementById('bsuw-ut-page-info'); if(info) info.textContent='Showing '+(s+1)+' – '+e+' of '+total+'  (page '+bsuwPage+' of '+pc+')';
                var pv=document.getElementById('bsuw-ut-prev'); if(pv) pv.disabled=bsuwPage<=1;
                var nx=document.getElementById('bsuw-ut-next'); if(nx) nx.disabled=e>=total;
            }
            tbody.innerHTML='';
            for(var i=s;i<e;i++){(function(idx){
                var d=bsuwUnitData[idx],tr=document.createElement('tr');
                tr.dataset.unitIdx=idx;
                var isFilled=d.beds&&d.baths&&d.size;
                if(isFilled) tr.classList.add('apw-ut-filled');
                if(d._selected) tr.classList.add('apw-ut-selected');
                tr.innerHTML='<td class="apw-ut-chk-cell"><label class="apw-chk-wrap"><input type="checkbox" class="bsuw-ichk"'+(d._selected?' checked':'')+
                    '><span class="apw-chk-box"></span></label></td>'+
                    '<td style="text-align:center;"><div class="apw-ut-num">'+(idx+1)+'</div></td>'+
                    '<td><input type="text" class="bsuw-iname" value="'+escA(d.name)+'" placeholder="Unit '+(idx+1)+'"></td>'+
                    '<td><select class="bsuw-ibeds">'+BED.map(function(o){return'<option value="'+o+'"'+(o===d.beds?' selected':'')+'>'+(o||'Select')+'</option>';}).join('')+'</select></td>'+
                    '<td><select class="bsuw-ibaths">'+BATH.map(function(o){return'<option value="'+o+'"'+(o===d.baths?' selected':'')+'>'+(o||'Select')+'</option>';}).join('')+'</select></td>'+
                    '<td><input type="text" class="bsuw-isize" value="'+escA(d.size)+'" placeholder="e.g. 850"></td>';
                tr.querySelector('.bsuw-ichk').addEventListener('change',function(){bsuwUnitData[idx]._selected=this.checked;tr.classList.toggle('apw-ut-selected',this.checked);bsuwSyncAll();bsuwUpdateSelBadge();bsuwUpdateUnitChecklist();});
                function bind(cls,key,evt){var el=tr.querySelector('.'+cls);if(!el)return;el.addEventListener(evt,function(){bsuwUnitData[idx][key]=this.value;var nd=bsuwUnitData[idx];tr.classList.toggle('apw-ut-filled',!!(nd.beds&&nd.baths&&nd.size));bsuwUpdateProgress();});}
                bind('bsuw-iname','name','input');bind('bsuw-ibeds','beds','change');bind('bsuw-ibaths','baths','change');bind('bsuw-isize','size','input');
                tbody.appendChild(tr);
            })(i);}
            bsuwSyncAll();
            bsuwUpdateSelBadge();
        }
        function bsuwUpdateSelBadge(){
            var t=bsuwUnitData.length, usePag=t>BSUW_PAGE_SIZE;
            var s=usePag?(bsuwPage-1)*BSUW_PAGE_SIZE:0, e=usePag?Math.min(s+BSUW_PAGE_SIZE,t):t, c=0;
            for(var i=s;i<e;i++) if(bsuwUnitData[i]._selected) c++;
            var btn=document.getElementById('bsuw-bulk-selected'); if(btn) btn.disabled=c===0;
            var lbl=document.getElementById('bsuw-qf-sel-label'); if(lbl) lbl.textContent='Apply to Selected ('+c+')';
        }
        function bsuwUpdateProgress(){
            var t=bsuwUnitData.length;
            var pc=Math.max(1, Math.ceil(t/BSUW_PAGE_SIZE));
            var s=(bsuwPage-1)*BSUW_PAGE_SIZE, e=Math.min(s+BSUW_PAGE_SIZE,t), ps=e-s;
            var sub=document.getElementById('bsuw-qf-sub');
            if(sub){
                if(pc>1) sub.innerHTML='Tick units below, then fill the <strong>'+ps+' on page '+bsuwPage+'</strong> of '+pc;
                else     sub.innerHTML='Tick units below, then apply values to your selection';
            }
        }
        function bsuwShowBulkResult(msg, type){
            var banner=document.getElementById('bsuw-bulk-result');
            var icon=banner?banner.querySelector('i.fas'):null;
            var msgEl=document.getElementById('bsuw-bulk-result-msg');
            if(!banner) return;
            banner.classList.remove('warn','err');
            if(type==='warn') banner.classList.add('warn');
            else if(type==='err') banner.classList.add('err');
            if(icon) icon.className='fas '+(type==='warn'?'fa-exclamation-triangle':type==='err'?'fa-times-circle':'fa-check-circle');
            if(msgEl) msgEl.textContent=msg;
            banner.classList.add('show');
        }
        (function(){
            var cb=document.getElementById('bsuw-bulk-result-close');
            if(cb) cb.addEventListener('click',function(){
                var b=document.getElementById('bsuw-bulk-result');
                if(b) b.classList.remove('show');
            });
        })();
        function bsuwFmtList(arr){
            if(arr.length===0) return '';
            if(arr.length===1) return arr[0];
            if(arr.length===2) return arr[0]+' and '+arr[1];
            return arr.slice(0,-1).join(', ')+', and '+arr[arr.length-1];
        }
        /* bsuwSyncAll — checks current page only */
        function bsuwSyncAll(){
            var c=document.getElementById('bsuw-chk-all'); if(!c) return;
            var t=bsuwUnitData.length, usePag=t>BSUW_PAGE_SIZE;
            var s=usePag?(bsuwPage-1)*BSUW_PAGE_SIZE:0, e=usePag?Math.min(s+BSUW_PAGE_SIZE,t):t;
            var ps=e-s, picked=0;
            for(var i=s;i<e;i++) if(bsuwUnitData[i]._selected) picked++;
            c.checked=ps>0&&picked===ps; c.indeterminate=picked>0&&picked<ps;
        }
        /* Generate 150 units: 10 floors × 15 units */
        function bsuwGenerate(){
            function pad(n){return n<10?'0'+n:''+n;}
            bsuwUnitData=[];
            for(var f=1;f<=10;f++)
                for(var u=1;u<=15;u++)
                    bsuwUnitData.push({name:'Unit '+f+pad(u),beds:'',baths:'',size:'',_selected:false,amenities:[]});
            bsuwPage=1; bsuwBuildTable(); bsuwUpdateProgress(); bsuwUpdateSelBadge();
            var qf=document.getElementById('bsuw-qf-card'); if(qf) qf.classList.add('visible');
            show('bsuw-ut-wrap');
            var br=document.getElementById('bsuw-bulk-result'); if(br) br.classList.remove('show');
        }
        /* Select-all header — current page only */
        (function(){
            var chkAll=document.getElementById('bsuw-chk-all'); if(!chkAll) return;
            chkAll.addEventListener('change',function(){
                var on=this.checked, t=bsuwUnitData.length, usePag=t>BSUW_PAGE_SIZE;
                var s=usePag?(bsuwPage-1)*BSUW_PAGE_SIZE:0, e=usePag?Math.min(s+BSUW_PAGE_SIZE,t):t;
                for(var i=s;i<e;i++) bsuwUnitData[i]._selected=on;
                bsuwBuildTable(); bsuwUpdateSelBadge();
            });
        })();
        /* Pagination */
        (function(){
            var pv=document.getElementById('bsuw-ut-prev'), nx=document.getElementById('bsuw-ut-next');
            if(pv) pv.addEventListener('click',function(){if(bsuwPage>1){bsuwPage--;bsuwBuildTable();bsuwUpdateProgress();bsuwUpdateSelBadge();}});
            if(nx) nx.addEventListener('click',function(){if(bsuwPage*BSUW_PAGE_SIZE<bsuwUnitData.length){bsuwPage++;bsuwBuildTable();bsuwUpdateProgress();bsuwUpdateSelBadge();}});
        })();

        function bsuwVals(){
            var v={beds:document.getElementById('bsuw-bulk-beds').value,baths:document.getElementById('bsuw-bulk-baths').value,size:document.getElementById('bsuw-bulk-size').value.trim()};
            var labels=[]; if(v.beds) labels.push('Bed'); if(v.baths) labels.push('Bath'); if(v.size) labels.push('Size');
            v.labels=labels; v.any=labels.length>0; return v;
        }
        function bsuwPageRange(){
            var t=bsuwUnitData.length, s=(bsuwPage-1)*BSUW_PAGE_SIZE, e=Math.min(s+BSUW_PAGE_SIZE,t);
            return {start:s,end:e,size:e-s,total:t,pageCount:Math.max(1,Math.ceil(t/BSUW_PAGE_SIZE))};
        }
        function bsuwOtherPagesText(r){
            if(r.pageCount<=1) return '';
            var others=[]; for(var p=1;p<=r.pageCount;p++) if(p!==bsuwPage) others.push(p);
            return (others.length===1 ? 'Page ' : 'Pages ') + others.join(', ');
        }
        function bsuwOtherPagesTail(r, verb){
            verb = verb || 'weren\u2019t touched';
            var t=bsuwOtherPagesText(r);
            return t ? ' '+t+' '+verb+'.' : '';
        }
        /* Apply to Selected — the only fill action */
        (function(){
            var selBtn=document.getElementById('bsuw-bulk-selected'); if(!selBtn) return;
            selBtn.addEventListener('click',function(){
                var v=bsuwVals();
                if(!v.any){ bsuwShowBulkResult('Pick at least one value above to fill','warn'); return; }
                var r=bsuwPageRange(), pageSelIdx=[];
                for(var i=r.start;i<r.end;i++) if(bsuwUnitData[i]._selected) pageSelIdx.push(i);
                if(pageSelIdx.length===0){ bsuwShowBulkResult('Tick at least one unit first','warn'); return; }
                var changed=0;
                pageSelIdx.forEach(function(i){
                    var d=bsuwUnitData[i], touched=false;
                    if(v.beds && d.beds!==v.beds){ d.beds=v.beds; touched=true; }
                    if(v.baths && d.baths!==v.baths){ d.baths=v.baths; touched=true; }
                    if(v.size && d.size!==v.size){ d.size=v.size; touched=true; }
                    if(touched) changed++;
                });
                bsuwBuildTable(); bsuwUpdateProgress(); bsuwUpdateSelBadge();
                bsuwShowBulkResult('Applied '+bsuwFmtList(v.labels)+' to '+changed+' of '+pageSelIdx.length+' selected unit'+(pageSelIdx.length===1?'':'s'),'ok');
            });
        })();
        /* Reset page */
        (function(){
            var clearBtn=document.getElementById('bsuw-bulk-clear'); if(!clearBtn) return;
            clearBtn.addEventListener('click',function(){
                var r=bsuwPageRange(), hadData=0;
                for(var i=r.start;i<r.end;i++){
                    var d=bsuwUnitData[i];
                    if(d.beds||d.baths||d.size) hadData++;
                    d.beds=d.baths=d.size=''; d._selected=false;
                }
                var bBeds=document.getElementById('bsuw-bulk-beds'); if(bBeds) bBeds.value='';
                var bBath=document.getElementById('bsuw-bulk-baths'); if(bBath) bBath.value='';
                var bSize=document.getElementById('bsuw-bulk-size'); if(bSize) bSize.value='';
                bsuwBuildTable(); bsuwUpdateProgress(); bsuwUpdateSelBadge();
                var pc=Math.max(1,Math.ceil(bsuwUnitData.length/BSUW_PAGE_SIZE));
                bsuwShowBulkResult('Reset '+hadData+' unit'+(hadData===1?'':'s')+(pc>1?' on page '+bsuwPage:''),'ok');
            });
        })();

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

        /* ── Save button ── */
        (function() {
            var btn   = document.getElementById('bsuw2-save-btn');
            var toast = document.getElementById('bsuw2-saved-toast');
            var det   = document.getElementById('bsuw2-saved-detail');
            if (!btn) return;
            btn.addEventListener('click', function() {
                var scope    = bsuw2Scope();
                var scopeN   = scope.length;
                /* Count amenities that every unit in scope now has */
                var amWithAll = 0;
                Object.keys(BSUW_AMENITIES).forEach(function(cat) {
                    BSUW_AMENITIES[cat].forEach(function(am) {
                        if (bsuw2AmState(am) === 'all') amWithAll++;
                    });
                });
                var selN = bsuwUnitData.filter(function(u) { return u._selected; }).length;
                var scopeLabel = selN === 0 ? 'all ' + scopeN + ' units' : scopeN + ' unit' + (scopeN === 1 ? '' : 's');
                var amLabel    = amWithAll + ' amenit' + (amWithAll === 1 ? 'y' : 'ies');
                if (det) det.textContent = 'Saved — ' + amLabel + ' applied to ' + scopeLabel + '. Pick new units to continue.';
                if (toast) {
                    toast.style.display = 'inline-flex';
                    clearTimeout(toast._hide);
                    toast._hide = setTimeout(function() { toast.style.display = 'none'; }, 4000);
                }
                /* Auto-reset selection so user can pick a new batch */
                bsuwUnitData.forEach(function(u) { u._selected = false; });
                bsuw2RenderUnits();
                bsuw2RenderAmenities();
            });
        })();

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
        function bsuwRenderChips()          { bsuwRenderMatrix(); }
        function bsuwRenderSelStrip()       { /* no-op */ }
        function bsuwUpdateChipStates()     { /* no-op */ }
        function bsuwAmUpdateStats()        { bsuw2UpdateScopeBar(); }
        function bsuwAmUpdateCTA()          { /* no-op */ }
        function bsuwAmHideSuccess()        { /* no-op */ }
        function bsuwAmScopeUnits()         { return bsuw2Scope(); }
        /* Sync the Step-2 unit list whenever Step-1 checkboxes change */
        function bsuwUpdateUnitChecklist()  { bsuw2RenderUnits(); bsuw2UpdateScopeBar(); }

        /* ── Open / close the BSUW overlay ── */
        function bsuwOpen() {
            bsuwRenderStep(1);
            overlay.classList.add('open');
            overlay.scrollTop = 0;
            document.body.style.overflow = 'hidden';
        }
        function bsuwClose() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }
        window.bsuwOpen  = bsuwOpen;
        window.bsuwClose = bsuwClose;

        /* Wire "Bulk Setup Unit" button in the Units tab */
        var bsuwOpenBtn = document.getElementById('btn-bulk-setup-unit-dv');
        if (bsuwOpenBtn) bsuwOpenBtn.addEventListener('click', bsuwOpen);

        /* Wire the Back button inside the BSUW wizard */
        var bsuwCloseTop = document.getElementById('bsuw-close-top');
        if (bsuwCloseTop) bsuwCloseTop.addEventListener('click', bsuwClose);

    })(); /* end BSUW IIFE */
