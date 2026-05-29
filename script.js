// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar scroll + progress
const navbar = document.getElementById('navbar');
const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / h) * 100 + '%';
});

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const icon = themeToggle.querySelector('i');
const saved = localStorage.getItem('theme');
if (saved === 'light') { document.documentElement.setAttribute('data-theme','light'); icon.className='fa-solid fa-sun'; }
themeToggle.addEventListener('click', () => {
  const light = document.documentElement.getAttribute('data-theme') === 'light';
  if (light) { document.documentElement.removeAttribute('data-theme'); icon.className='fa-solid fa-moon'; localStorage.setItem('theme','dark'); }
  else { document.documentElement.setAttribute('data-theme','light'); icon.className='fa-solid fa-sun'; localStorage.setItem('theme','light'); }
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => { hamburger.classList.toggle('open'); navLinks.classList.toggle('open'); });
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { hamburger.classList.remove('open'); navLinks.classList.remove('open'); }));

// Typing effect
const roles = ['Data Analyst','Python Developer','SQL Enthusiast','Power BI Specialist','Problem Solver'];
const typed = document.getElementById('typed');
let ri = 0, ci = 0, deleting = false;
function type(){
  const word = roles[ri];
  typed.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
  if (!deleting && ci === word.length + 1){ deleting = true; setTimeout(type, 1400); return; }
  if (deleting && ci === 0){ deleting = false; ri = (ri+1)%roles.length; }
  setTimeout(type, deleting ? 55 : 110);
}
type();

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const links = navLinks.querySelectorAll('a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#'+cur));
});

// Reveal + skill bars + counters via IntersectionObserver
document.querySelectorAll('.section, .t-item, .proj-card').forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('show');
    // skill bars
    e.target.querySelectorAll('.fill').forEach(f => f.style.width = f.dataset.w);
    // counters
    e.target.querySelectorAll('.num').forEach(n => {
      if (n.dataset.done) return; n.dataset.done = '1';
      const target = +n.dataset.target, suffix = n.dataset.suffix || '';
      let c = 0; const step = Math.max(1, Math.ceil(target/40));
      const t = setInterval(() => { c += step; if (c >= target){ c = target; clearInterval(t); } n.textContent = c + suffix; }, 35);
    });
    io.unobserve(e.target);
  });
}, { threshold: .2 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Contact form
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const note = document.getElementById('formNote');
  note.textContent = 'Thanks! Your message has been recorded. 🎉';
  e.target.reset();
  setTimeout(() => note.textContent = '', 4000);
});

// Résumé button
document.getElementById('downloadCv').addEventListener('click', () => {
  alert('Add your résumé PDF to the folder and link it here in script.js (downloadCv handler).');
});
