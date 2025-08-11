// Simple frontend to register/login and track clickstream events
const apiBase = '';

function track(user, action, details) {
  fetch('/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, action, details })
  }).catch(err => console.warn('track failed', err));
}

document.getElementById('btn-register').addEventListener('click', async () => {
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  if (!username || !password) return alert('enter username and password');
  const res = await fetch('/register', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.success) { alert('Registered! You may now login.'); track(username, 'REGISTER', 'registered via UI'); }
  else alert('Register failed: ' + (data.message || 'unknown'));
});

document.getElementById('btn-login').addEventListener('click', async () => {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  if (!username || !password) return alert('enter username and password');
  const res = await fetch('/login', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem('lw_user', username);
    showCourse(username);
  } else alert('Login failed');
});

function showCourse(username) {
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('course').classList.remove('hidden');
  document.getElementById('who').textContent = username;
  track(username, 'PAGE_VIEW', 'course page opened');
}

document.getElementById('btn-logout').addEventListener('click', () => {
  const u = localStorage.getItem('lw_user') || 'anonymous';
  track(u, 'LOGOUT', 'user clicked logout');
  localStorage.removeItem('lw_user');
  document.getElementById('auth').classList.remove('hidden');
  document.getElementById('course').classList.add('hidden');
});

// image click
document.getElementById('course-img').addEventListener('click', (e) => {
  const user = localStorage.getItem('lw_user') || 'anonymous';
  track(user, 'IMAGE_CLICK', 'course image clicked');
});

// Remove old video events, add iframe load tracking
const iframe = document.getElementById('fun-video');
if (iframe) {
  iframe.addEventListener('load', () => {
    const user = localStorage.getItem('lw_user') || 'anonymous';
    track(user, 'VIDEO_VIEW', 'YouTube video loaded');
  });
}

// Add normal HTML5 video event tracking
const normalVid = document.getElementById('fun-video-normal');
if (normalVid) {
  normalVid.addEventListener('play', () => {
    const user = localStorage.getItem('lw_user') || 'anonymous';
    track(user, 'VIDEO_PLAY', 'normal video played');
  });
  normalVid.addEventListener('pause', () => {
    const user = localStorage.getItem('lw_user') || 'anonymous';
    track(user, 'VIDEO_PAUSE', 'normal video paused');
  });
  normalVid.addEventListener('ended', () => {
    const user = localStorage.getItem('lw_user') || 'anonymous';
    track(user, 'VIDEO_ENDED', 'normal video ended');
  });
}

// quiz buttons
document.querySelectorAll('.quiz-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const ans = btn.dataset.answer;
    const user = localStorage.getItem('lw_user') || 'anonymous';
    const correct = ans === 'video';
    track(user, 'QUIZ_ATTEMPT', `answer=${ans};correct=${correct}`);
    alert(correct ? 'Correct!' : 'Not quite — try again.');
  });
});

// Tab logic for login/register
document.getElementById('tab-login').addEventListener('click', () => {
  document.getElementById('tab-login').classList.add('active');
  document.getElementById('tab-register').classList.remove('active');
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
});
document.getElementById('tab-register').addEventListener('click', () => {
  document.getElementById('tab-register').classList.add('active');
  document.getElementById('tab-login').classList.remove('active');
  document.getElementById('register-form').classList.remove('hidden');
  document.getElementById('login-form').classList.add('hidden');
});

// on load, restore session
window.addEventListener('load', () => {
  const u = localStorage.getItem('lw_user');
  if (u) showCourse(u);
});
