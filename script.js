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
    const PET_ENABLED_KEY = 'petEnabled';
    const PET_TYPE_KEY = 'petType';

    let currentPet = null;
    let currentPetType = localStorage.getItem(PET_TYPE_KEY) || 'dog';

    // Sync picker UI with saved type
    if (petPicker) {
        petPicker.querySelectorAll('.pet-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.pet === currentPetType);
        });
    }

    function enablePet() {
        if (currentPet) return;
        currentPet = initPet(currentPetType);
        if (petToggle) petToggle.classList.add('active');
    }

    function disablePet() {
        if (!currentPet) return;
        currentPet.destroy();
        currentPet = null;
        if (petToggle) petToggle.classList.remove('active');
    }

    // Restore saved enabled state (default = OFF)
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

                // Live swap if the pet is currently shown
                if (currentPet) {
                    currentPet.destroy();
                    currentPet = initPet(currentPetType);
                }
            });
        });
    }
});


/* ================================================================
   PET FACTORY
   ================================================================ */
function initPet(type) {
    // Reduce motion — return no-op handle
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return { destroy() {} };
    }

    let alive = true;
    let rafId = null;

    // --- Canvas overlay ---
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

    // --- Build the right model ---
    const pet = (type === 'cat') ? buildCat() : buildDog();
    scene.add(pet.group);

    const shadow = buildShadow();
    scene.add(shadow);

    // ============================================================
    // TUNABLES
    // ============================================================
    const MAX_SPEED     = type === 'cat' ? 1.8 : 1.6;   // cats are quicker
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
    let barkBlend = 0;
    let petBlend = 0;

    let hopPhase = 0;
    let hopActive = false;

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
            case 'sit':   stateTimer = 2.6 + Math.random() * 1.2; break;
            case 'lay':   stateTimer = 3.2 + Math.random() * 1.2; break;
            case 'bark':  stateTimer = 1.8; break;
            case 'pet':   stateTimer = 1.8; break;
            case 'idle':  stateTimer = 0.4; break;
        }
    }

    function pickNextState() {
        const r = Math.random();
        if (r < 0.45)      setState('walk');
        else if (r < 0.65) setState('sit');
        else if (r < 0.85) setState('lay');
        else               setState('bark');
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

        posX += velX * dt;
        posX = Math.max(-boundsX, Math.min(boundsX, posX));

        // ===== POSE BLENDS =====
        sitBlend  = damp(sitBlend,  state === 'sit'  ? 1 : 0, BLEND,        dt);
        layBlend  = damp(layBlend,  state === 'lay'  ? 1 : 0, BLEND,        dt);
        barkBlend = damp(barkBlend, state === 'bark' ? 1 : 0, BLEND * 2.0,  dt);
        petBlend  = damp(petBlend,  state === 'pet'  ? 1 : 0, BLEND * 1.8,  dt);

        // ===== FACING =====
        const faceUserBlend = Math.max(petBlend, barkBlend);
        let desiredRotY;
        if (faceUserBlend > 0.25) {
            desiredRotY = 0;
        } else {
            desiredRotY = facing > 0 ? Math.PI / 2 : -Math.PI / 2;
        }
        let diff = desiredRotY - rotY;
        while (diff >  Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        const rotSpeed = barkBlend > 0.3 ? ROT_LERP * 1.6 : ROT_LERP;
        rotY += diff * Math.min(1, dt * rotSpeed);

        pet.group.rotation.y = rotY;
        pet.group.position.x = posX;

        // ===== WALK PHASE =====
        const walking = state === 'walk' && Math.abs(velX) > 0.08;
        if (walking) walkPhase += dt * WALK_FREQ * (Math.abs(velX) / MAX_SPEED);

        // ===== LEGS =====
        pet.legs.forEach(leg => {
            const phase = leg.userData.phase;
            const isFront = leg.userData.isFront;
            let target = 0;

            if (walking) {
                target = Math.sin(walkPhase + phase) * 0.6;
            } else {
                const sitTarget = isFront ? 0 : 1.35;
                const layTarget = isFront ? -0.55 : 1.15;
                const petTarget = isFront ? -1.2 : 0;
                target = sitBlend * sitTarget
                       + layBlend * layTarget
                       + petBlend * petTarget;
            }
            leg.rotation.x = damp(leg.rotation.x, target, 14, dt);
        });

        // ===== BODY BOB / HOP / BARK RECOIL =====
        const barkPulse = Math.abs(Math.sin(t * 22)) * barkBlend;

        let bob = walking
            ? Math.abs(Math.sin(walkPhase)) * 0.07
            : Math.sin(t * 1.6) * 0.015;

        if (state === 'pet') {
            if (!hopActive) { hopActive = true; hopPhase = 0; }
            hopPhase += dt * 13;
            const fade = Math.max(0, 1 - hopPhase / Math.PI);
            bob += Math.abs(Math.sin(hopPhase)) * 0.22 * fade;
        } else {
            hopActive = false;
        }

        bob += barkPulse * 0.045;

        const bodyTilt =
            sitBlend * 0.15 +
            layBlend * 0.05 -
            petBlend * 0.22 -
            barkPulse * 0.08;
        pet.body.rotation.x = damp(pet.body.rotation.x, bodyTilt, 14, dt);

        const yOffset = -layBlend * 0.32;
        pet.group.position.y = bob + yOffset;

        // ===== HEAD =====
        let headRotX = walking
            ? Math.sin(walkPhase * 2) * 0.06
            : Math.sin(t * 1.4) * 0.03;

        headRotX -= sitBlend * 0.15;
        headRotX += layBlend * 0.5;
        headRotX -= petBlend * 0.35;
        headRotX -= barkPulse * 0.55;

        pet.head.rotation.x = damp(pet.head.rotation.x, headRotX, 18, dt);

        let headRotY = 0;
        if (state === 'bark') headRotY = Math.sin(t * 22) * 0.14 * barkBlend;
        if (petBlend > 0.05)  headRotY = Math.sin(t * 2.4) * 0.12 * petBlend;
        pet.head.rotation.y = damp(pet.head.rotation.y, headRotY, 14, dt);

        // ===== EARS =====
        if (pet.earL) pet.earL.rotation.z = -0.2 - barkPulse * 0.35;
        if (pet.earR) pet.earR.rotation.z =  0.2 + barkPulse * 0.35;

        // ===== TAIL =====
        let wagSpeed = 3.5, wagAmp = 0.10;
        if (walking)           { wagSpeed = 14; wagAmp = 0.4; }
        if (state === 'bark')  { wagSpeed = 24; wagAmp = 0.55; }
        if (state === 'pet')   { wagSpeed = 26; wagAmp = 0.75; }
        if (sitBlend > 0.5)    { wagSpeed = 4;  wagAmp = 0.15; }
        if (layBlend > 0.5)    { wagSpeed = 2.5; wagAmp = 0.10; }

        pet.tail.rotation.y = Math.sin(t * wagSpeed) * wagAmp;

        // ===== TONGUE =====
        const tongueOut = Math.max(barkBlend, petBlend * 0.7);
        pet.tongue.scale.set(1, 1, 0.3 + tongueOut * 1.1);
        pet.tongue.position.z = (type === 'cat' ? 0.44 : 0.52) + tongueOut * 0.1;

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
    head.add(earL);
    const earR = new THREE.Mesh(earGeo, brown);
    earR.position.set(0.32, 0.45, -0.05);
    earR.rotation.z = 0.2;
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

    return { group, body, head, tail, legs, tongue, earL, earR };
}


/* ================================================================
   BUILD CAT  — slimmer body, pointy ears, longer curved tail
   ================================================================ */
function buildCat() {
    const group = new THREE.Group();
    const body = new THREE.Group();
    group.add(body);

    // Colors
    const orange = new THREE.MeshStandardMaterial({ color: 0xE8A05A, roughness: 0.85, metalness: 0.05 });
    const cream  = new THREE.MeshStandardMaterial({ color: 0xF5E0C3, roughness: 0.9 });
    const dark   = new THREE.MeshStandardMaterial({ color: 0x1A1005, roughness: 0.35 });
    const pink   = new THREE.MeshStandardMaterial({ color: 0xFF9EB5, roughness: 0.7 });

    // --- TORSO (slimmer + shorter than dog) ---
    // Width 0.7, height 0.6, length 1.55
    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 1.55), orange);
    bodyMesh.position.y = 0.75;
    body.add(bodyMesh);

    const belly = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 1.4), cream);
    belly.position.set(0, 0.47, 0);
    body.add(belly);

    // --- HEAD (smaller, rounder) ---
    const head = new THREE.Group();
    head.position.set(0, 1.05, 0.78);
    body.add(head);

    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), orange);
    head.add(skull);

    // Small cream snout
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.24, 0.28), cream);
    snout.position.set(0, -0.1, 0.42);
    head.add(snout);

    // Pink nose
    const noseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.08), pink);
    noseMesh.position.set(0, -0.02, 0.58);
    head.add(noseMesh);

    // Big eyes
    const eyeGeo = new THREE.BoxGeometry(0.14, 0.16, 0.05);
    const eyeL = new THREE.Mesh(eyeGeo, dark);
    eyeL.position.set(-0.17, 0.1, 0.31);
    head.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, dark);
    eyeR.position.set(0.17, 0.1, 0.31);
    head.add(eyeR);

    // Eye shine
    const shineGeo = new THREE.BoxGeometry(0.05, 0.05, 0.02);
    const shineMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6 });
    const sL = new THREE.Mesh(shineGeo, shineMat);
    sL.position.set(-0.14, 0.14, 0.34);
    head.add(sL);
    const sR = new THREE.Mesh(shineGeo, shineMat);
    sR.position.set(0.2, 0.14, 0.34);
    head.add(sR);

    // Pointy triangular ears (cones)
    const earGeo = new THREE.ConeGeometry(0.15, 0.32, 4);
    const earL = new THREE.Mesh(earGeo, orange);
    earL.position.set(-0.22, 0.42, 0);
    earL.rotation.y = Math.PI / 4;
    earL.rotation.z = -0.15;
    head.add(earL);
    const earR = new THREE.Mesh(earGeo, orange);
    earR.position.set(0.22, 0.42, 0);
    earR.rotation.y = Math.PI / 4;
    earR.rotation.z = 0.15;
    head.add(earR);

    // Inner ear (pink)
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

    // Tiny tongue
    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.04), pink);
    tongue.position.set(0, -0.2, 0.44);
    tongue.scale.set(1, 1, 0.3);
    head.add(tongue);

    // --- TAIL (longer, thinner, curves up) ---
    const tail = new THREE.Group();
    tail.position.set(0, 0.85, -0.75);
    body.add(tail);

    const tailInner = new THREE.Group();
    tailInner.rotation.x = 0.9; // much more vertical than dog
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

    // --- LEGS (shorter + thinner) ---
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

    return { group, body, head, tail, legs, tongue, earL, earR };
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