const isDev = process.env.NODE_ENV === 'development';

const PASSCODES = {
  'demonic-pacts-guide': { guide: true },
};

function getUnlocked() {
  try {
    return JSON.parse(localStorage.getItem('__flags__') || '{}');
  } catch {
    return {};
  }
}

export const DEV_FLAGS = {
  guide: isDev,
};

export const FLAGS = {
  guide: true,
};

// Expose to browser console
if (typeof window !== 'undefined') {
  window.unlock = (code) => {
    const flags = PASSCODES[code];
    if (!flags) {
      console.warn('Invalid passcode.');
      return;
    }
    const current = getUnlocked();
    localStorage.setItem('__flags__', JSON.stringify({ ...current, ...flags }));
    console.log('Unlocked! Reloading...');
    window.location.reload();
  };

  window.lock = (flag) => {
    const current = getUnlocked();
    if (flag) {
      delete current[flag];
    } else {
      localStorage.removeItem('__flags__');
    }
    localStorage.setItem('__flags__', JSON.stringify(current));
    console.log('Locked. Reloading...');
    window.location.reload();
  };
}
