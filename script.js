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

    // --- 6. 3D Walking Dog (Three.js) ---
    initDogPet();
});


/* ================================================================
   3D DOG PET
   ================================================================ */
function initDogPet() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x66ccff, 0.6);
    rim.position.set(-4, 2, -3);
    scene.add(rim);

    const dog = buildDog();
    scene.add(dog.group);

    const shadow = buildShadow();
    scene.add(shadow);

    // --- Tunables ---
    const MAX_SPEED = 1.2;
    const ACCEL_LAMBDA = 3.0;
    const DECEL_LAMBDA = 6.0;
    const BLEND = 6;

    // --- Runtime ---
    let posX = 0;
    let velX = 0;
    let targetX = 0;
    let facing = 1;
    let rotY = Math.PI / 2;

    let state = 'idle';
    let stateTimer = 2;
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
        boundsX = Math.max(2.5, visibleW / 2 - 1.6);
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
            case 'idle':
                stateTimer = 1.4 + Math.random() * 2.0;
                break;
            case 'walk': {
                const currentSide = posX >= 0 ? 1 : -1;
                const wantOpposite = Math.random() < 0.8;
                const side = wantOpposite ? -currentSide : currentSide;
                targetX = side * (boundsX * (0.55 + Math.random() * 0.45));
                stateTimer = 12;
                break;
            }
            case 'sit':  stateTimer = 3.0 + Math.random() * 2.5; break;
            case 'lay':  stateTimer = 3.5 + Math.random() * 3.0; break;
            case 'bark': stateTimer = 0.9; break;
            case 'pet':  stateTimer = 2.0; break;
        }
    }

    function pickNextState() {
        const r = Math.random();
        if (r < 0.28)      setState('idle');
        else if (r < 0.62) setState('walk');
        else if (r < 0.80) setState('sit');
        else if (r < 0.94) setState('lay');
        else               setState('bark');
    }

    const clock = new THREE.Clock();
    const tmpVec = new THREE.Vector3();

    function animate() {
        requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;

        // ===== STATE =====
        if (state === 'walk') {
            const dx = targetX - posX;
            const dist = Math.abs(dx);

            if (dist < 0.15) {
                velX = damp(velX, 0, DECEL_LAMBDA, dt);
                if (Math.abs(velX) < 0.08) {
                    posX = targetX;
                    velX = 0;
                    setState('idle');
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

        // ===== BLENDS =====
        sitBlend  = damp(sitBlend,  state === 'sit'  ? 1 : 0, BLEND,       dt);
        layBlend  = damp(layBlend,  state === 'lay'  ? 1 : 0, BLEND,       dt);
        barkBlend = damp(barkBlend, state === 'bark' ? 1 : 0, BLEND * 1.5, dt);
        petBlend  = damp(petBlend,  state === 'pet'  ? 1 : 0, BLEND * 1.5, dt);

        // ===== ROTATION (face camera when petting) =====
        let desiredRotY;
        if (petBlend > 0.3) {
            desiredRotY = 0; // look at viewer
        } else {
            desiredRotY = facing > 0 ? Math.PI / 2 : -Math.PI / 2;
        }
        let diff = desiredRotY - rotY;
        while (diff >  Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        rotY += diff * Math.min(1, dt * 6);

        dog.group.rotation.y = rotY;
        dog.group.position.x = posX;

        // ===== WALK PHASE =====
        const walking = state === 'walk' && Math.abs(velX) > 0.08;
        if (walking) walkPhase += dt * 11 * (Math.abs(velX) / MAX_SPEED);

        // ===== LEGS =====
        dog.legs.forEach(leg => {
            const phase = leg.userData.phase;
            const isFront = leg.userData.isFront;
            let target = 0;

            if (walking) {
                target = Math.sin(walkPhase + phase) * 0.55;
            } else {
                // Combine pose blends
                const sitTarget = isFront ? 0 : 1.3;
                const layTarget = isFront ? -0.55 : 1.15;
                const petTarget = isFront ? -1.1 : 0; // front paws raised when petted

                target = sitBlend * sitTarget
                       + layBlend * layTarget
                       + petBlend * petTarget;
            }

            leg.rotation.x = damp(leg.rotation.x, target, 10, dt);
        });

        // ===== BODY =====
        let bob = walking
            ? Math.abs(Math.sin(walkPhase)) * 0.06
            : Math.sin(t * 1.6) * 0.015;

        // Pet hop
        if (state === 'pet') {
            if (!hopActive) { hopActive = true; hopPhase = 0; }
            hopPhase += dt * 9;
            const fade = Math.max(0, 1 - hopPhase / Math.PI);
            bob += Math.abs(Math.sin(hopPhase)) * 0.18 * fade;
        } else {
            hopActive = false;
        }

        // Body tilt for sit / lay / pet (leaning back while begging)
        const bodyTilt =
            sitBlend * 0.15 +
            layBlend * 0.05 -
            petBlend * 0.22; // lean back a bit when petted (beg pose)
        dog.body.rotation.x = damp(dog.body.rotation.x, bodyTilt, 8, dt);

        const yOffset = -layBlend * 0.32;
        dog.group.position.y = bob + yOffset;

        // ===== HEAD =====
        let headRotX = walking
            ? Math.sin(walkPhase * 2) * 0.05
            : Math.sin(t * 1.4) * 0.03;

        headRotX -= sitBlend * 0.15;
        headRotX += layBlend * 0.5;
        if (state === 'bark') headRotX -= Math.abs(Math.sin(t * 18)) * 0.25 * barkBlend;
        headRotX -= petBlend * 0.35; // look up at the user when petted

        dog.head.rotation.x = damp(dog.head.rotation.x, headRotX, 10, dt);

        let headRotY = 0;
        if (state === 'bark') headRotY = Math.sin(t * 18) * 0.08 * barkBlend;
        if (petBlend > 0.05)  headRotY = Math.sin(t * 2.2) * 0.12 * petBlend; // happy sway
        dog.head.rotation.y = damp(dog.head.rotation.y, headRotY, 8, dt);

        // ===== TAIL WAG =====
        let wagSpeed = 3, wagAmp = 0.10;
        if (walking)           { wagSpeed = 11; wagAmp = 0.35; }
        if (state === 'bark')  { wagSpeed = 16; wagAmp = 0.50; }
        if (state === 'pet')   { wagSpeed = 22; wagAmp = 0.70; }
        if (sitBlend > 0.5)    { wagSpeed = 3;  wagAmp = 0.15; }
        if (layBlend > 0.5)    { wagSpeed = 2;  wagAmp = 0.10; }

        dog.tail.rotation.y = Math.sin(t * wagSpeed) * wagAmp;

        // ===== TONGUE =====
        const tongueOut = Math.max(barkBlend, petBlend * 0.7);
        dog.tongue.scale.set(1, 1, 0.3 + tongueOut * 0.9);
        dog.tongue.position.z = 0.55 + tongueOut * 0.08;

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
    function getDogScreenPos() {
        tmpVec.set(posX, 0.9 + dog.group.position.y, 0);
        tmpVec.project(camera);
        const rect = canvas.getBoundingClientRect();
        return {
            x: (tmpVec.x * 0.5 + 0.5) * rect.width  + rect.left,
            y: (-tmpVec.y * 0.5 + 0.5) * rect.height + rect.top,
        };
    }

    const HIT_RADIUS = 90;

    document.addEventListener('click', (e) => {
        if (e.target.closest('.bottom-nav, .lightbox, .modern-btn, a, button, input, textarea')) return;
        const p = getDogScreenPos();
        if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < HIT_RADIUS) setState('pet');
    });

    document.addEventListener('mousemove', (e) => {
        const p = getDogScreenPos();
        document.body.style.cursor = Math.hypot(e.clientX - p.x, e.clientY - p.y) < HIT_RADIUS ? 'pointer' : '';
    });

    window.addEventListener('resize', () => {
        const w = window.innerWidth;
        renderer.setSize(w, CANVAS_H);
        camera.aspect = w / CANVAS_H;
        camera.updateProjectionMatrix();
        recalcBounds();
        posX = Math.max(-boundsX, Math.min(boundsX, posX));
        targetX = Math.max(-boundsX, Math.min(boundsX, targetX));
    });
}


/* ================================================================
   BUILD DOG — all parts now overlap correctly
   ================================================================ */
function buildDog() {
    const group = new THREE.Group();
    const body = new THREE.Group();
    group.add(body);

    const brown = new THREE.MeshStandardMaterial({ color: 0xB8835A, roughness: 0.85, metalness: 0.05 });
    const cream = new THREE.MeshStandardMaterial({ color: 0xF0DCC0, roughness: 0.9 });
    const nose  = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });
    const pink  = new THREE.MeshStandardMaterial({ color: 0xFF8FA3, roughness: 0.7 });

    // --- TORSO ---
    // Spans: x[-0.775, 0.775], y[0.51, 1.29], z[-0.425, 0.425]
    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.78, 0.85), brown);
    bodyMesh.position.y = 0.9;
    body.add(bodyMesh);

    const belly = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 0.72), cream);
    belly.position.set(0, 0.55, 0);
    body.add(belly);

    // --- HEAD (overlaps body front) ---
    // head at (0, 1.25, 0.6); skull 0.75^3 spans z[0.225, 0.975] — overlaps body front (z=0.425)
    const head = new THREE.Group();
    head.position.set(0, 1.25, 0.6);
    body.add(head);

    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), brown);
    head.add(skull);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.35, 0.4), cream);
    snout.position.set(0, -0.12, 0.53);
    head.add(snout);

    const noseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.12), nose);
    noseMesh.position.set(0, -0.04, 0.75);
    head.add(noseMesh);

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.13, 0.13, 0.06);
    const eyeL = new THREE.Mesh(eyeGeo, nose);
    eyeL.position.set(-0.21, 0.14, 0.385);
    head.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, nose);
    eyeR.position.set(0.21, 0.14, 0.385);
    head.add(eyeR);

    // Eye shine
    const shineGeo = new THREE.BoxGeometry(0.045, 0.045, 0.02);
    const shineMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.4 });
    const sL = new THREE.Mesh(shineGeo, shineMat);
    sL.position.set(-0.18, 0.18, 0.42);
    head.add(sL);
    const sR = new THREE.Mesh(shineGeo, shineMat);
    sR.position.set(0.24, 0.18, 0.42);
    head.add(sR);

    // Ears
    const earGeo = new THREE.BoxGeometry(0.22, 0.42, 0.14);
    const earL = new THREE.Mesh(earGeo, brown);
    earL.position.set(-0.33, 0.47, -0.02);
    earL.rotation.z = -0.2;
    head.add(earL);
    const earR = new THREE.Mesh(earGeo, brown);
    earR.position.set(0.33, 0.47, -0.02);
    earR.rotation.z = 0.2;
    head.add(earR);

    // Tongue
    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.05), pink);
    tongue.position.set(0, -0.25, 0.55);
    tongue.scale.set(1, 1, 0.3);
    head.add(tongue);

    // --- TAIL (thick tapered boxes going back + up) ---
    // Base at back of body (z = -0.42)
    const tail = new THREE.Group();
    tail.position.set(0, 1.1, -0.42);
    body.add(tail);

    const tailInner = new THREE.Group();
    tailInner.rotation.x = 0.45; // angle up-and-back so it doesn't look like a stick
    tail.add(tailInner);

    const tailSeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.3), brown);
    tailSeg1.position.set(0, 0, -0.15);
    tailInner.add(tailSeg1);

    const tailSeg2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.28), brown);
    tailSeg2.position.set(0, 0.03, -0.42);
    tailInner.add(tailSeg2);

    const tailTip = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.22), cream);
    tailTip.position.set(0, 0.07, -0.66);
    tailInner.add(tailTip);

    // --- LEGS (pivots inside body volume) ---
    // Body z range: [-0.425, 0.425]. Legs at z = ±0.28 stay inside.
    // Body x range: [-0.775, 0.775]. Legs at x = ±0.5 stay inside.
    // Body y range: [0.51, 1.29]. Pivot at y = 0.6 is inside.
    const legs = [];
    const legLayout = [
        { x: -0.5, z:  0.28, phase: 0,       isFront: true  },
        { x:  0.5, z:  0.28, phase: Math.PI, isFront: true  },
        { x: -0.5, z: -0.28, phase: Math.PI, isFront: false },
        { x:  0.5, z: -0.28, phase: 0,       isFront: false },
    ];
    legLayout.forEach(cfg => {
        const pivot = new THREE.Group();
        pivot.position.set(cfg.x, 0.6, cfg.z);
        pivot.userData.phase = cfg.phase;
        pivot.userData.isFront = cfg.isFront;

        const legMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.55, 0.24), brown);
        legMesh.position.y = -0.275;
        pivot.add(legMesh);

        const paw = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.32), cream);
        paw.position.set(0, -0.58, 0.03);
        pivot.add(paw);

        body.add(pivot);
        legs.push(pivot);
    });

    return { group, body, head, tail, legs, tongue };
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
    const geo = new THREE.PlaneGeometry(2.4, 1.4);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.01;
    return mesh;
}