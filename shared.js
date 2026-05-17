// =======================================================
// TRUSTBRIDGE SHARED NAV + TOAST SYSTEM
// =======================================================

export const NAV_HTML = `

<nav class="top-nav" id="topNav">

  <a href="index.html" class="logo">
    TRUSTBRIDGE
  </a>

  <div class="menu" id="navMenu">

    <a href="index.html">Home</a>
    <a href="marketplace.html">Marketplace</a>
    <a href="escrow.html">Escrow</a>
    <a href="messages.html">Messages</a>
    <a href="dashboard.html">Dashboard</a>
    <a href="support.html">Support</a>

    <a href="#" id="navLogoutBtn" class="logout-link">
      Logout
    </a>

    <a href="login.html" id="navLoginBtn" class="nav-cta">
      Login
    </a>

  </div>

  <button class="hamburger" id="hamburger">
    ☰
  </button>

</nav>


<div class="mobile-nav" id="mobileNav">

  <button class="close-nav" id="closeNav">
    ✕
  </button>

  <a href="index.html">Home</a>
  <a href="marketplace.html">Marketplace</a>
  <a href="escrow.html">Escrow</a>
  <a href="messages.html">Messages</a>
  <a href="dashboard.html">Dashboard</a>
  <a href="support.html">Support</a>

  <a href="login.html" class="mobile-login-btn">
    Login / Sign Up
  </a>

</div>

`;


// =======================================================
// NAVBAR CSS
// =======================================================

export const NAV_CSS = `

.top-nav{
  position:sticky;
  top:0;
  z-index:999;

  display:flex;
  justify-content:space-between;
  align-items:center;

  padding:18px 6%;

  background:rgba(0,0,0,.82);

  backdrop-filter:blur(16px);

  border-bottom:1px solid rgba(245,200,66,.10);

  transition:.3s;
}

.logo{
  text-decoration:none;

  font-family:'Syne',sans-serif;
  font-size:24px;
  font-weight:800;

  letter-spacing:2px;

  background:linear-gradient(
    90deg,
    #FFD700,
    #fff,
    #FFD700
  );

  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

.menu{
  display:flex;
  align-items:center;
  gap:24px;
}

.menu a{
  color:rgba(255,255,255,.72);

  text-decoration:none;

  font-size:14px;
  font-weight:600;

  transition:.3s;
}

.menu a:hover,
.menu a.active{
  color:#FFD700;
}

.nav-cta{
  background:linear-gradient(
    135deg,
    #FFD700,
    #ffb300
  );

  color:#000 !important;

  padding:11px 24px;

  border-radius:999px;

  font-size:13px !important;
  font-weight:800 !important;

  box-shadow:0 10px 25px rgba(255,215,0,.16);
}

.nav-cta:hover{
  transform:translateY(-2px);
}

.logout-link{
  color:#ff6b6b !important;
  display:none;
}

/* =========================
   HAMBURGER
========================= */

.hamburger{
  display:none;

  width:46px;
  height:46px;

  border:none;
  border-radius:14px;

  background:#111;
  color:#FFD700;

  font-size:20px;

  cursor:pointer;

  transition:.3s;
}

.hamburger:hover{
  background:#1b1b1b;
}

/* =========================
   MOBILE NAV
========================= */

.mobile-nav{
  position:fixed;
  inset:0;

  background:rgba(0,0,0,.97);

  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;

  gap:30px;

  z-index:2000;

  opacity:0;
  visibility:hidden;

  transition:.35s;
}

.mobile-nav.open{
  opacity:1;
  visibility:visible;
}

.mobile-nav a{
  text-decoration:none;

  color:#fff;

  font-family:'Syne',sans-serif;
  font-size:28px;
  font-weight:700;

  transition:.3s;
}

.mobile-nav a:hover{
  color:#FFD700;
}

.mobile-login-btn{
  color:#FFD700 !important;
}

.close-nav{
  position:absolute;
  top:24px;
  right:24px;

  background:none;
  border:none;

  color:#fff;

  font-size:34px;

  cursor:pointer;
}

/* =========================
   TOAST
========================= */

.tb-toast{
  position:fixed;
  right:28px;
  bottom:28px;

  min-width:250px;

  background:#111;

  padding:16px 22px;

  border-radius:16px;

  font-size:14px;
  font-weight:700;

  z-index:99999;

  box-shadow:0 14px 40px rgba(0,0,0,.45);

  animation:tbFadeUp .35s ease;
}

@keyframes tbFadeUp{
  from{
    opacity:0;
    transform:translateY(18px);
  }
  to{
    opacity:1;
    transform:translateY(0);
  }
}

/* =========================
   RESPONSIVE
========================= */

@media(max-width:900px){

  .menu{
    display:none;
  }

  .hamburger{
    display:flex;
    align-items:center;
    justify-content:center;
  }

}

`;


// =======================================================
// INITIALIZE NAVIGATION
// =======================================================

export function initNav(){

  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const closeNav = document.getElementById('closeNav');

  // OPEN MOBILE NAV

  if(hamburger){

    hamburger.addEventListener('click',()=>{

      mobileNav.classList.add('open');

      document.body.style.overflow='hidden';

    });

  }

  // CLOSE MOBILE NAV

  if(closeNav){

    closeNav.addEventListener('click',()=>{

      mobileNav.classList.remove('open');

      document.body.style.overflow='';

    });

  }

  // CLOSE WHEN LINK CLICKED

  document.querySelectorAll('.mobile-nav a').forEach(link=>{

    link.addEventListener('click',()=>{

      mobileNav.classList.remove('open');

      document.body.style.overflow='';

    });

  });

  // ACTIVE LINK

  const currentPage = window.location.pathname.split('/').pop();

  const links = document.querySelectorAll('.menu a, .mobile-nav a');

  links.forEach(link=>{

    const href = link.getAttribute('href');

    if(href === currentPage){

      link.classList.add('active');

    }

  });

}


// =======================================================
// PREMIUM TOAST SYSTEM
// =======================================================

export function showToast(msg,type='info'){

  document.querySelectorAll('.tb-toast')
    .forEach(t=>t.remove());

  const colors = {
    success:'#2eff9b',
    error:'#ff6b6b',
    info:'#FFD700'
  };

  const icons = {
    success:'✅',
    error:'⚠️',
    info:'✨'
  };

  const toast = document.createElement('div');

  toast.className='tb-toast';

  toast.style.border=`1px solid ${colors[type] || colors.info}`;
  toast.style.color=colors[type] || colors.info;

  toast.innerHTML=`

    <div style="
      display:flex;
      align-items:center;
      gap:12px;
    ">

      <span style="font-size:18px;">
        ${icons[type] || icons.info}
      </span>

      <span>
        ${msg}
      </span>

    </div>

  `;

  document.body.appendChild(toast);

  setTimeout(()=>{

    toast.style.opacity='0';
    toast.style.transform='translateY(12px)';
    toast.style.transition='.3s';

  },3500);

  setTimeout(()=>{

    toast.remove();

  },3900);

}


// =======================================================
// AUTH BUTTON SWITCHER
// =======================================================

export function updateAuthUI(user){

  const loginBtn = document.getElementById('navLoginBtn');
  const logoutBtn = document.getElementById('navLogoutBtn');

  if(user){

    if(loginBtn){
      loginBtn.style.display='none';
    }

    if(logoutBtn){
      logoutBtn.style.display='inline-flex';
    }

  }else{

    if(loginBtn){
      loginBtn.style.display='inline-flex';
    }

    if(logoutBtn){
      logoutBtn.style.display='none';
    }

  }

}


// =======================================================
// AUTH GUARD
// =======================================================

export function authGuard(user){

  if(!user){

    showToast(
      'Please login first',
      'error'
    );

    setTimeout(()=>{

      window.location.href='login.html';

    },1200);

    return false;
  }

  return true;

}