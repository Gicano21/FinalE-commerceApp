export const initializeProtections = () => {
  const stopEvent = (e: Event) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  };

  // ===== UI HELPERS =====
  let alertMes = false;
  const showOverlay = (text: string) => {
    let overlay = document.getElementById('screen-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'screen-overlay';

      Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        background: 'rgba(0,0,0,0.95)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        zIndex: '9999',
        textAlign: 'center',
        pointerEvents: 'none'
      });

      document.body.appendChild(overlay);
    }

    overlay.innerHTML = text;
    overlay.style.display = 'flex';

    setTimeout(() => {
      overlay && (overlay.style.display = 'none');
    }, 1500);
  };

  const showWarning = (msg: string) => {
    let el = document.getElementById('warn-box');
    if (!el) {
      el = document.createElement('div');
      el.id = 'warn-box';

      Object.assign(el.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(220,38,38,0.95)',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: '999px',
        fontSize: '0.9rem',
        zIndex: '9999',
        pointerEvents: 'none'
      });

      document.body.appendChild(el);
    }

    el.textContent = msg;
    el.style.opacity = '1';

    setTimeout(() => {
      el!.style.opacity = '0';
      if(alertMes) window.alert('SCREENSHOT DISABLED');
      alertMes = false;
    }, 1200);
  };

  // ===== RIGHT CLICK BLOCK =====
  document.addEventListener('contextmenu', (e) => {
    stopEvent(e);
    showWarning('Right click disabled');
  });

  document.addEventListener('mousedown', (e: MouseEvent) => {
    if (e.button === 2) {
      stopEvent(e);
      showWarning('Right click disabled');
    }
  });

  // ===== TEXT PROTECTION =====
  document.addEventListener('copy', stopEvent);
  document.addEventListener('cut', stopEvent);

  // ===== KEYBOARD SHORTCUT BLOCK =====
  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    const blocked =
      e.key === 'PrintScreen' ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && ['s', 'i', 'j', 'c'].includes(key)) ||
      ((e.ctrlKey || e.metaKey) && key === 'p') ||
      e.key === 'F12' || e.metaKey || e.ctrlKey && e.shiftKey;

      alertMes = blocked;
    if (blocked) {
      stopEvent(e);
      showOverlay('SCREENSHOT DISABLED');
      showWarning('Action blocked');
      navigator.clipboard?.writeText('').catch(() => {});
    }
  });

  // ===== PRINT BLOCK =====
  window.addEventListener('beforeprint', (e) => {
    stopEvent(e);
    showOverlay('Printing disabled');
  });

  // ===== MOBILE FIXES =====

  // ✅ Allow scrolling
  document.documentElement.style.touchAction = 'pan-y';
  document.body.style.touchAction = 'pan-y';

  // ===== 3-FINGER DETECTION (SAFE) =====
  let multiTouchActive = false;
  let touchTimer: any = null;

  document.addEventListener('touchstart', (e) => {
    const fingers = e.touches.length;

    if (fingers === 3 /*&& !multiTouchActive*/) {
      multiTouchActive = true;

      // optional delay to avoid accidental triggers
      touchTimer = setTimeout(() => {
        showOverlay('SCREENSHOT DISABLED');
        showWarning('3-finger gesture detected');
        alertMes = true;
      }, 80);
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    multiTouchActive = false;
    clearTimeout(touchTimer);
  });

  // ===== OPTIONAL: BLOCK PINCH ZOOM (SAFE) =====
  document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
  });

  // ===== DEVTOOLS DETECTION =====
  detectDevTools();
};

// ===== DEVTOOLS DETECTOR =====
const detectDevTools = () => {
  let open = false;
  const threshold = 160;

  setInterval(() => {
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;

    if (widthDiff > threshold || heightDiff > threshold) {
      if (!open) {
        open = true;
        console.warn('DevTools detected');
      }
    } else {
      open = false;
    }
  }, 800);
};