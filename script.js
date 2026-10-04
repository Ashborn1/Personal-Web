import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. App Navigation (SPA Routing) ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.page-section');

    function switchPage(targetId) {
        navItems.forEach(item => item.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        const activeNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
        const activeSection = document.getElementById(targetId);

        if (activeNav && activeSection) {
            activeNav.classList.add('active');
            activeSection.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    if (navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-target');
                switchPage(targetId);
            });
        });
    }

    // --- 2. Contact Form Handling ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            const originalText = submitBtn.innerHTML;

            const formData = {
                name: contactForm.querySelector('[name="name"]').value.trim(),
                email: contactForm.querySelector('[name="email"]').value.trim(),
                subject: contactForm.querySelector('[name="subject"]').value.trim(),
                message: contactForm.querySelector('[name="message"]').value.trim()
            };

            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> SENDING...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> MESSAGE SENT';
                    submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                    submitBtn.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
                    contactForm.reset();
                } else {
                    submitBtn.innerHTML = '<i class="fas fa-times-circle"></i> ERROR';
                    submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                    submitBtn.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
                }
            } catch (error) {
                submitBtn.innerHTML = '<i class="fas fa-times-circle"></i> ERROR';
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                submitBtn.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
            }

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.style.boxShadow = '';
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    // --- 3. Mouse Parallax on Hero ---
    const heroCard = document.querySelector('.hero-card');
    const homeSection = document.getElementById('home');
    if (homeSection && heroCard) {
        homeSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 40;
            const y = (window.innerHeight / 2 - e.pageY) / 40;
            heroCard.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
        });
        homeSection.addEventListener('mouseleave', () => {
            heroCard.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
            heroCard.style.transition = 'transform 0.5s ease';
        });
        homeSection.addEventListener('mouseenter', () => {
            heroCard.style.transition = 'transform 0.1s ease-out';
        });
    }

    // --- 4. Gallery Hover Z-Index ---
    document.querySelectorAll('.vault-item').forEach(item => {
        item.addEventListener('mouseenter', () => { item.style.zIndex = '10'; });
        item.addEventListener('mouseleave', () => { item.style.zIndex = '1'; });
    });

    // --- 5. Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryImages = document.querySelectorAll('.vault-item img');

    if (lightbox && lightboxImg && lightboxClose && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- 6. Pet Controls ---
    const petToggle = document.getElementById('petToggle');
    const petPicker = document.getElementById('petPicker');
    const petColorBtn = document.getElementById('petColorBtn');
    const petColorPopup = document.getElementById('petColorPopup');

    const PET_ENABLED_KEY = 'petEnabled';
    const PET_TYPE_KEY = 'petType';
    const PET_PRESET_PREFIX = 'petPreset_';

    const COLOR_PRESETS = [
        { name: 'Original',    primary: null,      secondary: null,      tertiary: null      },
        { name: 'Shiba',       primary: '#D4A574', secondary: '#F5E6D3', tertiary: '#5A3A20' },
        { name: 'Tuxedo',      primary: '#2C2C34', secondary: '#F5F5F5', tertiary: '#FF9EB5' },
        { name: 'Panda',       primary: '#F5F5F5', secondary: '#2C2C34', tertiary: '#FF9EB5' },
        { name: 'Husky',       primary: '#8B9BAE', secondary: '#F0F4F8', tertiary: '#4A6B8A' },
        { name: 'Tiger',       primary: '#E8A05A', secondary: '#FFF5E0', tertiary: '#2C2C34' },
        { name: 'Shadow',      primary: '#3A3A4A', secondary: '#6A6A7A', tertiary: '#8A5BA0' },
        { name: 'Bubblegum',   primary: '#FFB3D9', secondary: '#FFE0F0', tertiary: '#FF3B8F' },
        { name: 'Mint',        primary: '#9FE2BF', secondary: '#E0FFF0', tertiary: '#3BB87F' },
        { name: 'Sky',         primary: '#87CEEB', secondary: '#E0F4FF', tertiary: '#3B7FB8' },
        { name: 'Lavender',    primary: '#C8A2E8', secondary: '#EBE0F5', tertiary: '#8B5FC7' },
        { name: 'Butter',      primary: '#FFD97D', secondary: '#FFF5D0', tertiary: '#E8A000' },
        { name: 'Peach',       primary: '#FFB89A', secondary: '#FFE8DC', tertiary: '#E85B5B' },
        { name: 'Cherry',      primary: '#E63946', secondary: '#FFD0D0', tertiary: '#7A0F1A' },
        { name: 'Forest',      primary: '#5B8B4A', secondary: '#D4E8C5', tertiary: '#2C5A2A' },
        { name: 'Midnight',    primary: '#1A1A2E', secondary: '#4A4A6E', tertiary: '#8B5FC7' },
    ];

    function getPresetByName(name) {
        return COLOR_PRESETS.find(p => p.name === name) || COLOR_PRESETS[0];
    }

    function getStoredPresetName(type) {
        return localStorage.getItem(PET_PRESET_PREFIX + type) || 'Original';
    }

    let currentPet = null;
    let currentPetType = localStorage.getItem(PET_TYPE_KEY) || 'dog';

    function buildColorPopup() {
        if (!petColorPopup) return;
        petColorPopup.innerHTML = '';
        COLOR_PRESETS.forEach(preset => {
            const swatch = document.createElement('button');
            swatch.className = 'pet-color-swatch';
            swatch.dataset.presetName = preset.name;
            swatch.title = preset.name;

            if (preset.primary === null) {
                swatch.classList.add('original');
            } else {
                swatch.style.background = `conic-gradient(
                    ${preset.primary} 0deg 120deg,
                    ${preset.secondary} 120deg 240deg,
                    ${preset.tertiary} 240deg 360deg
                )`;
            }

            swatch.addEventListener('click', (e) => {
                e.stopPropagation();
                applyPreset(preset);
            });
            petColorPopup.appendChild(swatch);
        });
        refreshSwatchSelection();
    }

    function refreshSwatchSelection() {
        if (!petColorPopup) return;
        const currentName = getStoredPresetName(currentPetType);
        petColorPopup.querySelectorAll('.pet-color-swatch').forEach(s => {
            s.classList.toggle('active', s.dataset.presetName === currentName);
        });
    }

    function applyPreset(preset) {
        localStorage.setItem(PET_PRESET_PREFIX + currentPetType, preset.name);
        if (currentPet && currentPet.setPreset) {
            currentPet.setPreset(preset);
        }
        refreshSwatchSelection();
    }

    buildColorPopup();

    if (petPicker) {
        petPicker.querySelectorAll('.pet-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.pet === currentPetType);
        });
    }

    function enablePet() {
        if (currentPet) return;
        const preset = getPresetByName(getStoredPresetName(currentPetType));
        currentPet = initPet(currentPetType, preset);
        if (petToggle) petToggle.classList.add('active');
    }

    function disablePet() {
        if (!currentPet) return;
        currentPet.destroy();
        currentPet = null;
        if (petToggle) petToggle.classList.remove('active');
    }

    if (localStorage.getItem(PET_ENABLED_KEY) === 'true') {
        enablePet();
    }

    if (petToggle) {
        petToggle.addEventListener('click', () => {
            if (currentPet) {
                disablePet();
                localStorage.setItem(PET_ENABLED_KEY, 'false');
            } else {
                enablePet();
                localStorage.setItem(PET_ENABLED_KEY, 'true');
            }
        });
    }

    if (petPicker) {
        petPicker.querySelectorAll('.pet-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.pet;
                if (type === currentPetType) return;

                currentPetType = type;
                localStorage.setItem(PET_TYPE_KEY, type);

                petPicker.querySelectorAll('.pet-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                refreshSwatchSelection();

                if (currentPet) {
                    currentPet.destroy();
                    const preset = getPresetByName(getStoredPresetName(currentPetType));
                    currentPet = initPet(currentPetType, preset);
                }
            });
        });
    }

    if (petColorBtn && petColorPopup) {
        petColorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = petColorPopup.classList.toggle('open');
            petColorBtn.classList.toggle('open', isOpen);
        });

        document.addEventListener('click', (e) => {
            if (petColorPopup.classList.contains('open') &&
                !petColorPopup.contains(e.target) &&
                e.target !== petColorBtn) {
                petColorPopup.classList.remove('open');
                petColorBtn.classList.remove('open');
            }
        });
    }
});


/* ================================================================
   PRESET APPLIER
   ================================================================ */
function applyPreset(materialList, preset) {
    if (!preset || preset.primary === null) {
        materialList.forEach(({ mat, originalHex }) => {
            mat.color.setHex(originalHex);
        });
        return;
    }
    materialList.forEach(({ mat, role, shade }) => {
        const base = preset[role] || preset.primary;
        const c = new THREE.Color(base);
        if (shade) {
            const hsl = { h: 0, s: 0, l: 0 };
            c.getHSL(hsl);
            c.setHSL(hsl.h, hsl.s, Math.max(0.05, Math.min(0.95, hsl.l + shade)));
        }
        mat.color.copy(c);
    });
}


/* ================================================================
   PET FACTORY
   ================================================================ */
function initPet(type, preset) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return { destroy() {}, setPreset() {} };
    }

    let alive = true;
    let rafId = null;

    const CANVAS_H = 200;
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
        position: 'fixed',
        bottom: '90px',
        left: '0',
        width: '100%',
        height: CANVAS_H + 'px',
        pointerEvents: 'none',
        zIndex: '999',
    });
    document.body.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, CANVAS_H);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, window.innerWidth / CANVAS_H, 0.1, 100);
    camera.position.set(0, 2.2, 6.5);
    camera.lookAt(0, 0.8, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x66ccff, 0.6);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    let pet;
    if (type === 'cat')           pet = buildCat();
    else if (type === 'axolotl')  pet = buildAxolotl();
    else                          pet = buildDog();

    if (preset && pet.setPreset) pet.setPreset(preset);

    scene.add(pet.group);

    const shadow = buildShadow();
    scene.add(shadow);

    const MAX_SPEED = type === 'cat' ? 1.8 : (type === 'axolotl' ? 1.1 : 1.6);
    const ACCEL_LAMBDA  = 4.5;
    const DECEL_LAMBDA  = 8.0;
    const BLEND         = 10;
    const WALK_FREQ     = 14;
    const ROT_LERP      = 9;

    let posX = 0;
    let velX = 0;
    let targetX = 0;
    let facing = 1;
    let rotY = Math.PI / 2;

    let state = 'idle';
    let stateTimer = 0.6;
    let walkPhase = 0;

    let sitBlend = 0;
    let layBlend = 0;
    let actionBlend = 0;
    let petBlend = 0;
    let specialBlend = 0;
    let specialTime = 0;

    // Spin offset — computed from progress so it always ends at a full rotation
    let spinOffset = 0;
    const DOG_SPIN_TURNS = 8;   // number of full spins in one special

    let hopPhase = 0;
    let hopActive = false;

    const headBaseY = pet.head.position.y;

    let boundsX = 3;
    function recalcBounds() {
        const vFov = camera.fov * Math.PI / 180;
        const dist = camera.position.z;
        const visibleH = 2 * Math.tan(vFov / 2) * dist;
        const visibleW = visibleH * camera.aspect;
        boundsX = Math.max(2.5, visibleW / 2 - 1.9);
    }
    recalcBounds();

    function lerp(a, b, t) { return a + (b - a) * t; }
    function damp(current, target, lambda, dt) {
        return lerp(current, target, 1 - Math.exp(-lambda * dt));
    }
    function dampAngle(current, target, lambda, dt) {
        let d = target - current;
        while (d >  Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        return current + d * (1 - Math.exp(-lambda * dt));
    }

    function setState(newState) {
        if (state === newState) return;
        state = newState;

        switch (newState) {
            case 'walk': {
                let newTarget = 0;
                let tries = 0;
                do {
                    newTarget = (Math.random() * 2 - 1) * boundsX;
                    tries++;
                } while (Math.abs(newTarget - posX) < 1.4 && tries < 12);
                targetX = newTarget;
                stateTimer = 12;
                break;
            }
            case 'sit':    stateTimer = 2.6 + Math.random() * 1.2; break;
            case 'lay':    stateTimer = 3.2 + Math.random() * 1.2; break;
            case 'action': {
                if (type === 'cat')            stateTimer = 1.4;
                else if (type === 'axolotl')   stateTimer = 1.6;
                else                           stateTimer = 1.8;
                break;
            }
            case 'special': {
                if (type === 'dog')            stateTimer = 10.0;
                else if (type === 'cat')       stateTimer = 4.5;
                else                           stateTimer = 5.5;
                specialTime = 0;
                break;
            }
            case 'pet':    stateTimer = 1.8; break;
            case 'idle':   stateTimer = 0.4; break;
        }
    }

    function pickNextState() {
        const r = Math.random();
        if (r < 0.32)      setState('walk');
        else if (r < 0.48) setState('sit');
        else if (r < 0.64) setState('lay');
        else if (r < 0.80) setState('action');
        else               setState('special');
    }

    const clock = new THREE.Clock();
    const tmpVec = new THREE.Vector3();

    function animate() {
        if (!alive) return;
        rafId = requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;

        // ===== STATE MACHINE =====
        if (state === 'walk') {
            const dx = targetX - posX;
            const dist = Math.abs(dx);

            if (dist < 0.15) {
                velX = damp(velX, 0, DECEL_LAMBDA, dt);
                if (Math.abs(velX) < 0.08) {
                    posX = targetX;
                    velX = 0;
                    pickNextState();
                }
            } else {
                facing = dx > 0 ? 1 : -1;
                const targetVel = Math.sign(dx) * MAX_SPEED;
                velX = damp(velX, targetVel, ACCEL_LAMBDA, dt);
                stateTimer = 12;
            }
        } else {
            velX = damp(velX, 0, DECEL_LAMBDA, dt);
            if (Math.abs(velX) < 0.02) velX = 0;

            stateTimer -= dt;
            if (stateTimer <= 0) {
                if (velX === 0) pickNextState();
                else stateTimer = 0.05;
            }
        }

        if (state === 'special') specialTime += dt;

        posX += velX * dt;
        posX = Math.max(-boundsX, Math.min(boundsX, posX));

        // ===== POSE BLENDS =====
        sitBlend     = damp(sitBlend,     state === 'sit'     ? 1 : 0, BLEND,        dt);
        layBlend     = damp(layBlend,     state === 'lay'     ? 1 : 0, BLEND,        dt);
        actionBlend  = damp(actionBlend,  state === 'action'  ? 1 : 0, BLEND * 2.0,  dt);
        petBlend     = damp(petBlend,     state === 'pet'     ? 1 : 0, BLEND * 1.8,  dt);
        specialBlend = damp(specialBlend, state === 'special' ? 1 : 0, BLEND * 1.5,  dt);

        // ===== FACING =====
        const faceUserBlend = Math.max(petBlend, actionBlend);
        let desiredRotY;
        if (faceUserBlend > 0.25) desiredRotY = 0;
        else                      desiredRotY = facing > 0 ? Math.PI / 2 : -Math.PI / 2;

        const rotSpeed = actionBlend > 0.3 ? ROT_LERP * 1.6 : ROT_LERP;
        rotY = dampAngle(rotY, desiredRotY, rotSpeed, dt);

        // ===== DOG TAIL-CHASE SPIN (safe version) =====
        // Compute spin from a closed-form formula that goes 0 → N * 2π over the
        // special duration, so it always ends exactly on a full rotation.
        if (type === 'dog' && state === 'special') {
            const p = Math.min(1, specialTime / stateTimer);
            // ∫ sin(pπ) with proper scaling → π * N * (1 - cos(pπ))
            //   p=0  → 0
            //   p=1  → 2πN   (visually identical to 0)
            spinOffset = Math.PI * DOG_SPIN_TURNS * (1 - Math.cos(p * Math.PI));
        } else {
            // Not spinning: smoothly return spinOffset to the nearest full rotation
            // (invisible correction, prevents any sideways walking afterwards)
            const twoPi = Math.PI * 2;
            const nearest = Math.round(spinOffset / twoPi) * twoPi;
            spinOffset = damp(spinOffset, nearest, 6, dt);
            if (Math.abs(spinOffset - nearest) < 0.0005) spinOffset = nearest;
        }

        pet.group.rotation.y = rotY + spinOffset;
        pet.group.position.x = posX;

        // ===== WALK PHASE =====
        const walking = state === 'walk' && Math.abs(velX) > 0.08;
        if (walking) walkPhase += dt * WALK_FREQ * (Math.abs(velX) / MAX_SPEED);

        // ============================================================
        // SPECIES IDLE FLAVORS
        // ============================================================
        let speciesHeadTiltX = 0;
        let speciesHeadTiltY = 0;
        let speciesHeadTiltZ = 0;
        let speciesFrontRightLift = 0;
        let speciesBobExtra = 0;
        let catBlink = 0;

        if (!walking && state !== 'action' && state !== 'special') {
            if (type === 'dog') {
                const phase = (t % 5) / 5;
                if (phase > 0.7) {
                    const k = Math.sin((phase - 0.7) / 0.3 * Math.PI);
                    speciesHeadTiltZ = k * 0.4;
                    speciesHeadTiltX = k * 0.1;
                }
            } else if (type === 'cat') {
                const phase = (t % 8) / 8;
                if (phase > 0.75) {
                    const k = Math.sin((phase - 0.75) / 0.25 * Math.PI);
                    speciesFrontRightLift = k;
                    speciesHeadTiltX = 0.5 * k;
                    speciesHeadTiltY = -0.2 * k;
                }
                const blinkPhase = (t % 6) / 6;
                if (blinkPhase > 0.9) catBlink = 1;
            } else if (type === 'axolotl') {
                speciesBobExtra = Math.sin(t * 1.0) * 0.035;
            }
        }

        // ============================================================
        // CAT STRETCH
        // ============================================================
        let catStretchFront = 0;
        let catStretchHind = 0;
        if (type === 'cat' && state === 'special') {
            const p = Math.min(1, specialTime / stateTimer);
            const eased = p < 0.15 ? p / 0.15
                       : p > 0.85 ? (1 - p) / 0.15
                       : 1;
            catStretchFront = eased;
            catStretchHind = eased;
        }

        // ===== LEGS =====
        pet.legs.forEach(leg => {
            const phase = leg.userData.phase;
            const isFront = leg.userData.isFront;
            let target = 0;

            if (walking) {
                target = Math.sin(walkPhase + phase) * 0.6;
            } else if (type === 'dog' && state === 'special') {
                target = Math.sin(t * 14 + phase) * 0.45;
            } else {
                const sitTarget = isFront ? 0 : 1.35;
                const layTarget = isFront ? -0.55 : 1.15;
                const petTarget = isFront ? -1.2 : 0;
                target = sitBlend * sitTarget
                       + layBlend * layTarget
                       + petBlend * petTarget;
            }

            if (type === 'cat' && catStretchFront > 0.01) {
                if (isFront) target += -0.9 * catStretchFront;
                else         target += 0.85 * catStretchHind;
            }

            if (type === 'cat' && speciesFrontRightLift > 0.01 && isFront && leg.position.x > 0) {
                target = -1.8 * speciesFrontRightLift;
            }

            leg.rotation.x = damp(leg.rotation.x, target, 14, dt);
        });

        // ============================================================
        // ACTION PULSE
        // ============================================================
        let pulseSpeed = 22;
        if (type === 'cat')      pulseSpeed = 10;
        if (type === 'axolotl')  pulseSpeed = 6;
        const actionPulse = Math.abs(Math.sin(t * pulseSpeed)) * actionBlend;

        // ============================================================
        // SPECIAL PULSE
        // ============================================================
        let specialPulse = 0;
        if (state === 'special') {
            if (type === 'dog')            specialPulse = Math.abs(Math.sin(t * 12)) * specialBlend;
            else if (type === 'cat')       specialPulse = Math.abs(Math.sin(t * 4))  * specialBlend;
            else                           specialPulse = Math.abs(Math.sin(t * 3))  * specialBlend;
        }

        // ===== BODY BOB =====
        let bob = walking
            ? Math.abs(Math.sin(walkPhase)) * 0.07
            : Math.sin(t * 1.6) * 0.015;

        bob += speciesBobExtra;

        if (state === 'pet') {
            if (!hopActive) { hopActive = true; hopPhase = 0; }
            hopPhase += dt * 13;
            const fade = Math.max(0, 1 - hopPhase / Math.PI);
            bob += Math.abs(Math.sin(hopPhase)) * 0.22 * fade;
            if (type === 'axolotl') bob += 0.15 * petBlend;
        } else {
            hopActive = false;
        }

        if (type === 'dog') bob += actionPulse * 0.045;
        if (type === 'cat') bob += actionPulse * 0.02;

        if (type === 'axolotl' && state === 'special') {
            bob += 0.1 * specialBlend + Math.sin(t * 3) * 0.03 * specialBlend;
        }
        if (type === 'dog' && state === 'special') {
            bob += Math.abs(Math.sin(t * 12)) * 0.08 * specialBlend;
        }
        if (type === 'cat' && state === 'special') {
            bob -= 0.08 * catStretchFront;
        }

        // ===== BODY TILT =====
        let bodyTilt =
            sitBlend * 0.15 +
            layBlend * 0.05 -
            petBlend * 0.22;

        if (type === 'dog') bodyTilt -= actionPulse * 0.08;
        if (type === 'cat') bodyTilt -= actionBlend * 0.10;
        if (type === 'cat') bodyTilt += 0.4 * catStretchFront;
        if (type === 'axolotl' && state === 'special') {
            bodyTilt += Math.sin(t * 2.5) * 0.08 * specialBlend;
        }

        pet.body.rotation.x = damp(pet.body.rotation.x, bodyTilt, 14, dt);

        const yOffset = -layBlend * 0.32;
        pet.group.position.y = bob + yOffset;

        if (type === 'cat' && petBlend > 0.05) {
            pet.body.position.x = Math.sin(t * 60) * 0.015 * petBlend;
        } else {
            pet.body.position.x = damp(pet.body.position.x, 0, 10, dt);
        }

        // ===== HEAD =====
        let headRotX = walking
            ? Math.sin(walkPhase * 2) * 0.06
            : Math.sin(t * 1.4) * 0.03;

        headRotX -= sitBlend * 0.15;
        headRotX += layBlend * 0.5;
        headRotX -= petBlend * 0.35;
        headRotX += speciesHeadTiltX;

        if (type === 'dog')      headRotX -= actionPulse * 0.55;
        if (type === 'cat')      headRotX -= actionBlend * 0.35;
        if (type === 'axolotl')  headRotX -= Math.sin(t * 8) * 0.08 * actionBlend;

        if (type === 'dog' && state === 'special') {
            headRotX += 0.3 * specialBlend;
        }
        if (type === 'cat') {
            headRotX += 0.5 * catStretchFront;
        }
        if (type === 'axolotl' && state === 'special') {
            headRotX += Math.sin(t * 2.2) * 0.18 * specialBlend;
        }

        pet.head.rotation.x = damp(pet.head.rotation.x, headRotX, 18, dt);

        let headRotY = 0;
        if (type === 'dog' && state === 'action')      headRotY = Math.sin(t * 22) * 0.14 * actionBlend;
        if (type === 'cat' && state === 'action')      headRotY = Math.sin(t * 5) * 0.06 * actionBlend;
        if (type === 'axolotl' && state === 'action')  headRotY = Math.sin(t * 4) * 0.05 * actionBlend;
        if (petBlend > 0.05)  headRotY = Math.sin(t * 2.4) * 0.12 * petBlend;
        headRotY += speciesHeadTiltY;

        if (type === 'dog' && state === 'special') {
            headRotY += Math.sin(t * 14) * 0.35 * specialBlend;
        }

        pet.head.rotation.y = damp(pet.head.rotation.y, headRotY, 14, dt);
        pet.head.rotation.z = damp(pet.head.rotation.z, speciesHeadTiltZ, 12, dt);

        let headYExtra = 0;
        if (type === 'axolotl' && state === 'action') {
            headYExtra = Math.sin(t * 8) * 0.05 * actionBlend;
        }
        pet.head.position.y = damp(pet.head.position.y, headBaseY + headYExtra, 12, dt);

        // ============================================================
        // EARS / GILLS
        // ============================================================
        if (type === 'axolotl' && pet.allGills) {
            const wiggle = Math.sin(t * 3.5) * 0.1;
            const fanOut = actionBlend * 0.22 + petBlend * 0.2;
            const specialFan = (state === 'special') ? 0.4 * specialBlend : 0;
            pet.allGills.forEach(g => {
                const s = g.userData.side;
                const base = g.userData.baseRotY ?? 0;
                g.rotation.y = base + s * (wiggle + fanOut + specialFan);
            });
        } else if (pet.earL && pet.earR) {
            const baseZL = pet.earL.userData.baseEarZ ?? -0.2;
            const baseZR = pet.earR.userData.baseEarZ ?? 0.2;

            if (type === 'dog') {
                const spinFlap = (state === 'special') ? Math.sin(t * 14) * 0.35 * specialBlend : 0;
                pet.earL.rotation.z = baseZL - actionPulse * 0.35 + spinFlap;
                pet.earR.rotation.z = baseZR + actionPulse * 0.35 - spinFlap;
            } else if (type === 'cat') {
                pet.earL.rotation.z = baseZL;
                pet.earR.rotation.z = baseZR;
                const perk = -0.4 * actionBlend;
                pet.earL.rotation.x = damp(pet.earL.rotation.x ?? 0, perk, 10, dt);
                pet.earR.rotation.x = damp(pet.earR.rotation.x ?? 0, perk, 10, dt);
            }
        }

        if (type === 'axolotl') {
            const specialPuff = (state === 'special') ? specialBlend * 0.1 : 0;
            const puff = 1 + actionPulse * 0.06 + specialPuff;
            pet.body.scale.set(puff, puff, puff);
        } else {
            pet.body.scale.set(1, 1, 1);
        }

        // ===== TAIL =====
        let wagSpeed = 3.5, wagAmp = 0.10;
        if (walking)                                 { wagSpeed = 14; wagAmp = 0.4; }
        if (type === 'dog' && state === 'action')    { wagSpeed = 24; wagAmp = 0.55; }
        if (type === 'cat' && state === 'action')    { wagSpeed = 8;  wagAmp = 0.15; }
        if (state === 'pet')                         { wagSpeed = 26; wagAmp = 0.75; }
        if (sitBlend > 0.5)                          { wagSpeed = 4;  wagAmp = 0.15; }
        if (layBlend > 0.5)                          { wagSpeed = 2.5; wagAmp = 0.10; }

        if (type === 'axolotl' && !walking && state !== 'action') {
            wagSpeed = 2.2;
            wagAmp = 0.28;
        }

        if (type === 'dog' && state === 'special') {
            wagSpeed = 30;
            wagAmp = 0.8;
        }

        pet.tail.rotation.y = Math.sin(t * wagSpeed) * wagAmp;

        if (type === 'cat') {
            let targetTailX = actionBlend * -0.9;
            if (state === 'special') targetTailX = -1.4 * catStretchFront;
            pet.tail.rotation.x = damp(pet.tail.rotation.x ?? 0, targetTailX, 8, dt);
        }

        // ===== TONGUE =====
        let tongueOut = Math.max(actionBlend * (type === 'dog' ? 1.0 : 0.6), petBlend * 0.7);
        if (type === 'dog' && state === 'special') tongueOut = Math.max(tongueOut, 0.9 * specialBlend);
        if (type === 'cat' && state === 'special') tongueOut = Math.max(tongueOut, 0.3 * catStretchFront);

        const tongueBaseZ = type === 'cat' ? 0.44 : (type === 'axolotl' ? 0.64 : 0.52);
        pet.tongue.scale.set(1, 1, 0.3 + tongueOut * 1.1);
        pet.tongue.position.z = tongueBaseZ + tongueOut * 0.1;

        if (pet.shineL) {
            const blinkScale = catBlink > 0.5 ? 0.1 : 1;
            pet.shineL.scale.y = blinkScale;
            pet.shineR.scale.y = blinkScale;
        }

        // ===== SHADOW =====
        shadow.position.x = posX;
        shadow.position.y = 0.01 + yOffset;
        const shadowScale = (1 - bob * 1.5) * (1 - layBlend * 0.1);
        shadow.scale.set(shadowScale, shadowScale, 1);
        shadow.material.opacity = 0.55 * Math.max(0.3, shadowScale);

        renderer.render(scene, camera);
    }
    animate();

    // ===== CLICK TO PET =====
    function getPetScreenPos() {
        tmpVec.set(posX, 0.9 + pet.group.position.y, 0);
        tmpVec.project(camera);
        const rect = canvas.getBoundingClientRect();
        return {
            x: (tmpVec.x * 0.5 + 0.5) * rect.width  + rect.left,
            y: (-tmpVec.y * 0.5 + 0.5) * rect.height + rect.top,
        };
    }

    const HIT_RADIUS = 100;

    function onClick(e) {
        if (e.target.closest('.bottom-nav, .lightbox, .modern-btn, a, button, input, textarea, .pet-controls')) return;
        const p = getPetScreenPos();
        if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < HIT_RADIUS) setState('pet');
    }

    function onMove(e) {
        const p = getPetScreenPos();
        document.body.style.cursor = Math.hypot(e.clientX - p.x, e.clientY - p.y) < HIT_RADIUS ? 'pointer' : '';
    }

    function onResize() {
        if (!alive) return;
        const w = window.innerWidth;
        renderer.setSize(w, CANVAS_H);
        camera.aspect = w / CANVAS_H;
        camera.updateProjectionMatrix();
        recalcBounds();
        posX = Math.max(-boundsX, Math.min(boundsX, posX));
        targetX = Math.max(-boundsX, Math.min(boundsX, targetX));
    }

    document.addEventListener('click', onClick);
    document.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);

    return {
        setPreset(preset) {
            if (pet.setPreset) pet.setPreset(preset);
        },
        destroy() {
            alive = false;
            if (rafId) cancelAnimationFrame(rafId);
            document.removeEventListener('click', onClick);
            document.removeEventListener('mousemove', onMove);
            window.removeEventListener('resize', onResize);
            document.body.style.cursor = '';
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
            renderer.dispose();
        }
    };
}


/* ================================================================
   BUILD DOG
   ================================================================ */
function buildDog() {
    const group = new THREE.Group();
    const body = new THREE.Group();
    group.add(body);

    const brown = new THREE.MeshStandardMaterial({ color: 0xB8835A, roughness: 0.85, metalness: 0.05 });
    const cream = new THREE.MeshStandardMaterial({ color: 0xF0DCC0, roughness: 0.9 });
    const nose  = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });
    const pink  = new THREE.MeshStandardMaterial({ color: 0xFF8FA3, roughness: 0.7 });

    const materialList = [
        { mat: brown, role: 'primary',   shade:  0.00, originalHex: 0xB8835A },
        { mat: cream, role: 'secondary', shade:  0.00, originalHex: 0xF0DCC0 },
        { mat: pink,  role: 'tertiary',  shade:  0.00, originalHex: 0xFF8FA3 },
    ];
    function setPreset(preset) {
        applyPreset(materialList, preset);
    }

    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.7, 1.9), brown);
    bodyMesh.position.y = 0.9;
    body.add(bodyMesh);

    const belly = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.12, 1.72), cream);
    belly.position.set(0, 0.58, 0);
    body.add(belly);

    const head = new THREE.Group();
    head.position.set(0, 1.22, 0.95);
    body.add(head);

    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.72, 0.72), brown);
    head.add(skull);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.32, 0.38), cream);
    snout.position.set(0, -0.12, 0.5);
    head.add(snout);

    const noseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.13, 0.11), nose);
    noseMesh.position.set(0, -0.04, 0.71);
    head.add(noseMesh);

    const eyeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.06);
    const eyeL = new THREE.Mesh(eyeGeo, nose);
    eyeL.position.set(-0.2, 0.12, 0.36);
    head.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, nose);
    eyeR.position.set(0.2, 0.12, 0.36);
    head.add(eyeR);

    const shineGeo = new THREE.BoxGeometry(0.042, 0.042, 0.02);
    const shineMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.4 });
    const sL = new THREE.Mesh(shineGeo, shineMat);
    sL.position.set(-0.17, 0.16, 0.4);
    head.add(sL);
    const sR = new THREE.Mesh(shineGeo, shineMat);
    sR.position.set(0.23, 0.16, 0.4);
    head.add(sR);

    const earGeo = new THREE.BoxGeometry(0.2, 0.4, 0.13);
    const earL = new THREE.Mesh(earGeo, brown);
    earL.position.set(-0.32, 0.45, -0.05);
    earL.rotation.z = -0.2;
    earL.userData.baseEarZ = -0.2;
    head.add(earL);
    const earR = new THREE.Mesh(earGeo, brown);
    earR.position.set(0.32, 0.45, -0.05);
    earR.rotation.z = 0.2;
    earR.userData.baseEarZ = 0.2;
    head.add(earR);

    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.05), pink);
    tongue.position.set(0, -0.23, 0.52);
    tongue.scale.set(1, 1, 0.3);
    head.add(tongue);

    const tail = new THREE.Group();
    tail.position.set(0, 1.05, -0.9);
    body.add(tail);

    const tailInner = new THREE.Group();
    tailInner.rotation.x = 0.5;
    tail.add(tailInner);

    const tailSeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.32), brown);
    tailSeg1.position.set(0, 0, -0.16);
    tailInner.add(tailSeg1);

    const tailSeg2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.3), brown);
    tailSeg2.position.set(0, 0.03, -0.46);
    tailInner.add(tailSeg2);

    const tailTip = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.24), cream);
    tailTip.position.set(0, 0.07, -0.72);
    tailInner.add(tailTip);

    const legs = [];
    const legLayout = [
        { x: -0.32, z:  0.62, phase: 0,       isFront: true  },
        { x:  0.32, z:  0.62, phase: Math.PI, isFront: true  },
        { x: -0.32, z: -0.62, phase: Math.PI, isFront: false },
        { x:  0.32, z: -0.62, phase: 0,       isFront: false },
    ];
    legLayout.forEach(cfg => {
        const pivot = new THREE.Group();
        pivot.position.set(cfg.x, 0.6, cfg.z);
        pivot.userData.phase = cfg.phase;
        pivot.userData.isFront = cfg.isFront;

        const legMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.55, 0.2), brown);
        legMesh.position.y = -0.275;
        pivot.add(legMesh);

        const paw = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.28), cream);
        paw.position.set(0, -0.58, 0.03);
        pivot.add(paw);

        body.add(pivot);
        legs.push(pivot);
    });

    return { group, body, head, tail, legs, tongue, earL, earR, setPreset };
}


/* ================================================================
   BUILD CAT
   ================================================================ */
function buildCat() {
    const group = new THREE.Group();
    const body = new THREE.Group();
    group.add(body);

    const orange = new THREE.MeshStandardMaterial({ color: 0xE8A05A, roughness: 0.85, metalness: 0.05 });
    const cream  = new THREE.MeshStandardMaterial({ color: 0xF5E0C3, roughness: 0.9 });
    const dark   = new THREE.MeshStandardMaterial({ color: 0x1A1005, roughness: 0.35 });
    const pink   = new THREE.MeshStandardMaterial({ color: 0xFF9EB5, roughness: 0.7 });

    const materialList = [
        { mat: orange, role: 'primary',   shade:  0.00, originalHex: 0xE8A05A },
        { mat: cream,  role: 'secondary', shade:  0.00, originalHex: 0xF5E0C3 },
        { mat: pink,   role: 'tertiary',  shade:  0.00, originalHex: 0xFF9EB5 },
    ];
    function setPreset(preset) {
        applyPreset(materialList, preset);
    }

    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 1.55), orange);
    bodyMesh.position.y = 0.75;
    body.add(bodyMesh);

    const belly = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 1.4), cream);
    belly.position.set(0, 0.47, 0);
    body.add(belly);

    const head = new THREE.Group();
    head.position.set(0, 1.05, 0.78);
    body.add(head);

    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), orange);
    head.add(skull);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.24, 0.28), cream);
    snout.position.set(0, -0.1, 0.42);
    head.add(snout);

    const noseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.08), pink);
    noseMesh.position.set(0, -0.02, 0.58);
    head.add(noseMesh);

    const eyeGeo = new THREE.BoxGeometry(0.14, 0.16, 0.05);
    const eyeL = new THREE.Mesh(eyeGeo, dark);
    eyeL.position.set(-0.17, 0.1, 0.31);
    head.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, dark);
    eyeR.position.set(0.17, 0.1, 0.31);
    head.add(eyeR);

    const shineGeo = new THREE.BoxGeometry(0.05, 0.05, 0.02);
    const shineMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6 });
    const shineL = new THREE.Mesh(shineGeo, shineMat);
    shineL.position.set(-0.14, 0.14, 0.34);
    head.add(shineL);
    const shineR = new THREE.Mesh(shineGeo, shineMat);
    shineR.position.set(0.2, 0.14, 0.34);
    head.add(shineR);

    const earGeo = new THREE.ConeGeometry(0.15, 0.32, 4);
    const earL = new THREE.Mesh(earGeo, orange);
    earL.position.set(-0.22, 0.42, 0);
    earL.rotation.y = Math.PI / 4;
    earL.rotation.z = -0.15;
    earL.userData.baseEarZ = -0.15;
    head.add(earL);
    const earR = new THREE.Mesh(earGeo, orange);
    earR.position.set(0.22, 0.42, 0);
    earR.rotation.y = Math.PI / 4;
    earR.rotation.z = 0.15;
    earR.userData.baseEarZ = 0.15;
    head.add(earR);

    const innerEarGeo = new THREE.ConeGeometry(0.08, 0.2, 4);
    const innerL = new THREE.Mesh(innerEarGeo, pink);
    innerL.position.set(-0.22, 0.4, 0.05);
    innerL.rotation.y = Math.PI / 4;
    innerL.rotation.z = -0.15;
    head.add(innerL);
    const innerR = new THREE.Mesh(innerEarGeo, pink);
    innerR.position.set(0.22, 0.4, 0.05);
    innerR.rotation.y = Math.PI / 4;
    innerR.rotation.z = 0.15;
    head.add(innerR);

    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.04), pink);
    tongue.position.set(0, -0.2, 0.44);
    tongue.scale.set(1, 1, 0.3);
    head.add(tongue);

    const tail = new THREE.Group();
    tail.position.set(0, 0.85, -0.75);
    body.add(tail);

    const tailInner = new THREE.Group();
    tailInner.rotation.x = 0.9;
    tail.add(tailInner);

    const tailSeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.28), orange);
    tailSeg1.position.set(0, 0, -0.14);
    tailInner.add(tailSeg1);

    const tailSeg2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.28), orange);
    tailSeg2.position.set(0, 0.02, -0.4);
    tailInner.add(tailSeg2);

    const tailSeg3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.26), orange);
    tailSeg3.position.set(0, 0.05, -0.65);
    tailInner.add(tailSeg3);

    const tailTip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.2), cream);
    tailTip.position.set(0, 0.08, -0.86);
    tailInner.add(tailTip);

    const legs = [];
    const legLayout = [
        { x: -0.27, z:  0.5, phase: 0,       isFront: true  },
        { x:  0.27, z:  0.5, phase: Math.PI, isFront: true  },
        { x: -0.27, z: -0.5, phase: Math.PI, isFront: false },
        { x:  0.27, z: -0.5, phase: 0,       isFront: false },
    ];
    legLayout.forEach(cfg => {
        const pivot = new THREE.Group();
        pivot.position.set(cfg.x, 0.5, cfg.z);
        pivot.userData.phase = cfg.phase;
        pivot.userData.isFront = cfg.isFront;

        const legMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.45, 0.16), orange);
        legMesh.position.y = -0.225;
        pivot.add(legMesh);

        const paw = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.24), cream);
        paw.position.set(0, -0.47, 0.03);
        pivot.add(paw);

        body.add(pivot);
        legs.push(pivot);
    });

    return { group, body, head, tail, legs, tongue, earL, earR, shineL, shineR, setPreset };
}


/* ================================================================
   BUILD AXOLOTL
   ================================================================ */
function buildAxolotl() {
    const group = new THREE.Group();
    const body = new THREE.Group();
    group.add(body);

    const pinkLight = new THREE.MeshStandardMaterial({ color: 0xFFB8D1, roughness: 0.75, metalness: 0.02 });
    const pinkMid   = new THREE.MeshStandardMaterial({ color: 0xFF9BC0, roughness: 0.75 });
    const pinkDark  = new THREE.MeshStandardMaterial({ color: 0xFF6FA8, roughness: 0.7 });
    const pinkDeep  = new THREE.MeshStandardMaterial({ color: 0xE85B94, roughness: 0.65 });
    const cream     = new THREE.MeshStandardMaterial({ color: 0xFFE5EE, roughness: 0.9 });
    const dark      = new THREE.MeshStandardMaterial({ color: 0x1A0A12, roughness: 0.3 });
    const pinkMouth = new THREE.MeshStandardMaterial({ color: 0xD14A7E, roughness: 0.6 });

    const materialList = [
        { mat: pinkLight, role: 'primary',   shade:  0.00, originalHex: 0xFFB8D1 },
        { mat: pinkMid,   role: 'primary',   shade: -0.06, originalHex: 0xFF9BC0 },
        { mat: pinkDark,  role: 'tertiary',  shade:  0.06, originalHex: 0xFF6FA8 },
        { mat: pinkDeep,  role: 'tertiary',  shade: -0.10, originalHex: 0xE85B94 },
        { mat: cream,     role: 'secondary', shade:  0.00, originalHex: 0xFFE5EE },
        { mat: pinkMouth, role: 'tertiary',  shade: -0.22, originalHex: 0xD14A7E },
    ];
    function setPreset(preset) {
        applyPreset(materialList, preset);
    }

    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 1.75), pinkLight);
    bodyMesh.position.y = 0.72;
    body.add(bodyMesh);

    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 1.6), pinkLight);
    ridge.position.set(0, 1.0, 0);
    body.add(ridge);

    const belly = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.1, 1.6), cream);
    belly.position.set(0, 0.5, 0);
    body.add(belly);

    const head = new THREE.Group();
    head.position.set(0, 0.85, 0.9);
    body.add(head);

    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.5, 0.75), pinkLight);
    head.add(skull);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.35), pinkLight);
    snout.position.set(0, -0.05, 0.5);
    head.add(snout);

    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.05), pinkMouth);
    mouth.position.set(0, -0.18, 0.66);
    head.add(mouth);

    const eyeGeo = new THREE.BoxGeometry(0.11, 0.11, 0.06);
    const eyeL = new THREE.Mesh(eyeGeo, dark);
    eyeL.position.set(-0.32, 0.15, 0.38);
    head.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, dark);
    eyeR.position.set(0.32, 0.15, 0.38);
    head.add(eyeR);

    const shineGeo = new THREE.BoxGeometry(0.035, 0.035, 0.02);
    const shineMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6 });
    const sL = new THREE.Mesh(shineGeo, shineMat);
    sL.position.set(-0.29, 0.18, 0.42);
    head.add(sL);
    const sR = new THREE.Mesh(shineGeo, shineMat);
    sR.position.set(0.35, 0.18, 0.42);
    head.add(sR);

    const allGills = [];
    function makeGill(side, yOff, zOff, pitchAngle, backAngle, scale = 1) {
        const g = new THREE.Group();
        g.position.set(side * 0.48, yOff, zOff);
        head.add(g);

        const yaw = side * (Math.PI / 2 + backAngle);
        g.rotation.y = yaw;
        g.rotation.x = -pitchAngle;

        g.userData.side = side;
        g.userData.baseRotY = yaw;
        allGills.push(g);

        const stalkLen = 0.16 * scale;
        const stalk = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, stalkLen), pinkMid);
        stalk.position.z = stalkLen / 2;
        g.add(stalk);

        const tuftZ = stalkLen + 0.02;
        const core = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.18), pinkDark);
        core.position.z = tuftZ + 0.06;
        g.add(core);

        const frillGeo = new THREE.BoxGeometry(0.07, 0.07, 0.18);
        const frillRing = [
            [ 0.14,  0.00, -0.30], [-0.14,  0.00, -0.30],
            [ 0.00,  0.14, -0.30], [ 0.00, -0.14, -0.30],
            [ 0.11,  0.11, -0.35], [-0.11,  0.11, -0.35],
            [ 0.11, -0.11, -0.35], [-0.11, -0.11, -0.35],
            [ 0.00,  0.00, -0.45], [ 0.00,  0.00, -0.20],
        ];
        frillRing.forEach(([dx, dy, dz]) => {
            const frill = new THREE.Mesh(frillGeo, pinkDeep);
            frill.position.set(dx, dy, tuftZ + dz + 0.15);
            frill.rotation.x = -0.4;
            frill.rotation.y = dx * 2;
            frill.rotation.z = -dy * 2;
            g.add(frill);
        });

        return g;
    }

    makeGill(-1,  0.16, -0.18, 0.35, 0.5, 1.0);
    makeGill(-1,  0.00, -0.22, 0.10, 0.55, 0.95);
    makeGill(-1, -0.15, -0.22, -0.20, 0.5, 0.9);

    makeGill(1,  0.16, -0.18, 0.35, 0.5, 1.0);
    makeGill(1,  0.00, -0.22, 0.10, 0.55, 0.95);
    makeGill(1, -0.15, -0.22, -0.20, 0.5, 0.9);

    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.04), pinkMouth);
    tongue.position.set(0, -0.24, 0.64);
    tongue.scale.set(1, 1, 0.3);
    head.add(tongue);

    const tail = new THREE.Group();
    tail.position.set(0, 0.72, -0.85);
    body.add(tail);

    const tailInner = new THREE.Group();
    tailInner.rotation.x = 0.15;
    tail.add(tailInner);

    const tailSeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.5, 0.35), pinkLight);
    tailSeg1.position.set(0, 0.05, -0.18);
    tailInner.add(tailSeg1);

    const tailSeg2 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.55, 0.35), pinkLight);
    tailSeg2.position.set(0, 0.05, -0.52);
    tailInner.add(tailSeg2);

    const tailSeg3 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.5, 0.3), pinkLight);
    tailSeg3.position.set(0, 0.03, -0.82);
    tailInner.add(tailSeg3);

    const tailTip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.25), pinkDark);
    tailTip.position.set(0, 0, -1.05);
    tailInner.add(tailTip);

    const legs = [];
    const legLayout = [
        { x: -0.4, z:  0.55, phase: 0,       isFront: true  },
        { x:  0.4, z:  0.55, phase: Math.PI, isFront: true  },
        { x: -0.4, z: -0.55, phase: Math.PI, isFront: false },
        { x:  0.4, z: -0.55, phase: 0,       isFront: false },
    ];
    legLayout.forEach(cfg => {
        const pivot = new THREE.Group();
        pivot.position.set(cfg.x, 0.5, cfg.z);
        pivot.userData.phase = cfg.phase;
        pivot.userData.isFront = cfg.isFront;

        const legMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.4, 0.18), pinkLight);
        legMesh.position.y = -0.2;
        pivot.add(legMesh);

        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.26), pinkLight);
        foot.position.set(0, -0.42, 0.03);
        pivot.add(foot);

        body.add(pivot);
        legs.push(pivot);
    });

    return {
        group, body, head, tail, legs, tongue,
        allGills, setPreset,
    };
}


/* ================================================================
   SOFT FAKE SHADOW
   ================================================================ */
function buildShadow() {
    const size = 128;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0.0,  'rgba(0,0,0,0.55)');
    grad.addColorStop(0.55, 'rgba(0,0,0,0.18)');
    grad.addColorStop(1.0,  'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.MeshBasicMaterial({
        map: tex, transparent: true, depthWrite: false, opacity: 0.55,
    });
    const geo = new THREE.PlaneGeometry(3.0, 1.4);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.01;
    return mesh;
}