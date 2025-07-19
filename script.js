// === AUTH ===
async function register(email, password) {
  const response = await fetch('https://job-assistant-g3e3.onrender.com/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  alert(data.message);
}

async function login(email, password) {
  const response = await fetch('https://job-assistant-g3e3.onrender.com/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('userId', data.userId);
    alert(data.message);
    showDashboard();
  } else {
    alert(data.message);
  }
}

// === JOBS ===
async function postJob(title, company, requirement, salary, contact) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('Please log in first!');
    return;
  }

  const response = await fetch('https://job-assistant-g3e3.onrender.com/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, post: title, company, requirement, salary, contact })
  });
  const data = await response.json();
  alert(data.message);
}

async function loadJobs() {
  const response = await fetch('https://job-assistant-g3e3.onrender.com/jobs');
  const jobs = await response.json();

  const list = document.getElementById('jobs-list');
  list.innerHTML = '';
  jobs.forEach(job => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${job.post} at ${job.company}</strong><br>
      ${job.requirement}<br>
      Salary: ${job.salary}<br>
      Contact: ${job.contact}<br>
      <button onclick="deleteJob('${job._id}')">Delete</button>
    `;
    list.appendChild(li);
  });
}

async function deleteJob(jobId) {
  const response = await fetch(`https://job-assistant-g3e3.onrender.com/jobs/${jobId}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  alert(data.message);
  loadJobs();
}

// === PAGE SWITCHING ===
function showDashboard() {
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
}

function showPostJobPage() {
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('post-job-page').style.display = 'block';
}

function showSeeJobsPage() {
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('see-jobs-page').style.display = 'block';
  loadJobs();
}

function showAuthPage() {
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('post-job-page').style.display = 'none';
  document.getElementById('see-jobs-page').style.display = 'none';
  document.getElementById('auth-container').style.display = 'block';
}

// === BUTTONS ===
document.getElementById('auth-submit-btn').addEventListener('click', () => {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const mode = document.getElementById('auth-title').innerText;

  if (mode === 'Sign Up') {
    register(email, password);
  } else {
    login(email, password);
  }
});

document.getElementById('toggle-auth').addEventListener('click', (e) => {
  e.preventDefault();
  const title = document.getElementById('auth-title');
  const btn = document.getElementById('auth-submit-btn');
  if (title.innerText === 'Sign Up') {
    title.innerText = 'Log In';
    btn.innerText = 'Log In';
    document.getElementById('toggle-auth').innerHTML = 'Don\'t have an account? <a href="#">Sign Up</a>';
  } else {
    title.innerText = 'Sign Up';
    btn.innerText = 'Sign Up';
    document.getElementById('toggle-auth').innerHTML = 'Already have an account? <a href="#">Log In</a>';
  }
});

document.getElementById('post-job-page-btn').addEventListener('click', showPostJobPage);
document.getElementById('see-jobs-page-btn').addEventListener('click', showSeeJobsPage);

document.getElementById('switch-to-see-jobs').addEventListener('click', showSeeJobsPage);
document.getElementById('switch-to-post-job').addEventListener('click', showPostJobPage);

document.querySelectorAll('.logout-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    localStorage.removeItem('userId');
    showAuthPage();
  });
});

document.getElementById('post-job-btn').addEventListener('click', () => {
  const title = document.getElementById('job-title').value;
  const company = document.getElementById('company-name').value;
  const requirement = document.getElementById('requirement').value;
  const salary = document.getElementById('salary').value;
  const contact = document.getElementById('contact').value;

  postJob(title, company, requirement, salary, contact);
});

// === INIT ===
if (localStorage.getItem('userId')) {
  showDashboard();
} else {
  showAuthPage();
}

