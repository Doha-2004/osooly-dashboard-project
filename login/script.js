/* Login page: checks email + password against the demo account list and opens the first page of the account's role.
   All markup (form, errors, demo list) is static in index.html; this file only reads/writes values and toggles classes.
   Backend: replace login() with the server call (secure session, hashed passwords, attempt limit) and send each role to its dashboard. */
(function () {
  'use strict';
  var KEY = { lang: 'osooly.lang', session: 'osooly.session' }, root = document.documentElement;
  function $(sel) { return document.querySelector(sel); }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }

  /* DEMO ONLY – same order as the buttons in index.html (data-index). Production: remove, the server checks credentials. */
  var ACCOUNTS = [
    { email: 'admin@osooly.test',             password: 'Admin@2026',     role: 'admin',             name: { ar: 'سارة عبد الله', en: 'Sara Abdullah' } },
    { email: 'insurance.manager@osooly.test', password: 'Manager@2026',   role: 'insurance_manager', name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' } },
    { email: 'insurance.staff@osooly.test',   password: 'Staff@2026',     role: 'insurance_staff',   name: { ar: 'ياسر حامد', en: 'Yasser Hamed' } },
    { email: 'car.dealer@osooly.test',        password: 'CarDealer@2026', role: 'car_dealer',        name: { ar: 'محمود سمير', en: 'Mahmoud Samir' } },
    { email: 'rental.dealer@osooly.test',     password: 'Rental@2026',    role: 'rental_dealer',     name: { ar: 'كريم فوزي', en: 'Karim Fawzy' } },
    { email: 'spare.parts@osooly.test',       password: 'Parts@2026',     role: 'spare_parts',       name: { ar: 'عمر خالد', en: 'Omar Khaled' } },
    { email: 'recovery@osooly.test',          password: 'Recovery@2026',  role: 'recovery',          name: { ar: 'حسن رضا', en: 'Hassan Reda' } }
  ];
  /* First page of each role (relative to /login/). Dashboards not built yet return 404 until their batch. */
  var HOME = {
    admin: '../dashboards/admin/pages/home/index.html',
    insurance_manager: '../dashboards/insurance/pages/all/index.html',
    insurance_staff: '../dashboards/insurance/pages/new/index.html',
    car_dealer: '../dashboards/car-dealer/pages/ads/index.html',
    rental_dealer: '../dashboards/rental/pages/ads/index.html',
    spare_parts: '../dashboards/spare-parts/pages/ads/index.html',
    recovery: '../dashboards/recovery/pages/incoming/index.html'
  };

  /* Already signed in with a valid role: go to the dashboard. */
  try {
    var s = JSON.parse(sessionStorage.getItem(KEY.session) || 'null');
    if (s && s.email && HOME[s.role]) { location.replace(HOME[s.role]); return; }
  } catch (e) { /* storage unavailable */ }

  /* ---------- language ---------- */
  function applyLang(lang) {
    root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $('#bootstrap-rtl').media = lang === 'ar' ? 'all' : 'not all';
    $('#bootstrap-ltr').media = lang === 'ar' ? 'not all' : 'all';
  }
  $('#login-lang').addEventListener('click', function () {
    var next = root.lang === 'ar' ? 'en' : 'ar';
    save(KEY.lang, next); applyLang(next);
  });

  /* ---------- password visibility ---------- */
  var pass = $('#login-password'), toggle = $('#login-toggle-pass'), email = $('#login-email');
  toggle.addEventListener('click', function () {
    var show = pass.type === 'password', icon = toggle.querySelector('i');
    pass.type = show ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', show ? 'true' : 'false');
    icon.classList.toggle('bi-eye', !show);
    icon.classList.toggle('bi-eye-slash', show);
  });

  /* ---------- errors ---------- */
  var form = $('#login-form'), err = $('#login-error'), submit = $('#login-submit');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function setFieldError(input, msg, bad) {
    input.classList.toggle('is-invalid', bad);
    input.setAttribute('aria-invalid', bad ? 'true' : 'false');
    msg.classList.toggle('d-block', bad);
  }
  function hideErrors() {
    err.classList.add('d-none');
    setFieldError(email, $('#login-email-msg'), false);
    setFieldError(pass, $('#login-password-msg'), false);
  }
  email.addEventListener('input', hideErrors);
  pass.addEventListener('input', hideErrors);

  /* ---------- demo accounts (rows are static in the HTML) ---------- */
  var demo = $('#demo-accounts');
  if (demo) {
    var rows = demo.querySelectorAll('.demo-account');
    for (var i = 0; i < rows.length; i++) {
      var slot = rows[i].querySelector('[data-demo-pass]');
      if (slot && ACCOUNTS[i]) slot.textContent = ACCOUNTS[i].password;
    }
    $('#demo-list').addEventListener('click', function (e) {
      var b = e.target.closest('.demo-account'); if (!b) return;
      var a = ACCOUNTS[Number(b.getAttribute('data-index'))]; if (!a) return;
      email.value = a.email; pass.value = a.password;
      hideErrors(); submit.focus();
    });
  }

  /* ---------- form ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideErrors();
    var value = email.value.trim();
    var emailBad = !EMAIL_RE.test(value), passBad = !pass.value;
    setFieldError(email, $('#login-email-msg'), emailBad);
    setFieldError(pass, $('#login-password-msg'), passBad);
    if (emailBad || passBad) { (emailBad ? email : pass).focus(); return; }

    submit.disabled = true;
    setTimeout(function () {   // short pause so the demo feels like a real request
      var key = value.toLowerCase(), acc = null;
      for (var j = 0; j < ACCOUNTS.length; j++) { if (ACCOUNTS[j].email === key && ACCOUNTS[j].password === pass.value) acc = ACCOUNTS[j]; }
      if (!acc) {
        submit.disabled = false; err.classList.remove('d-none');
        pass.value = ''; pass.focus(); return;
      }
      try { sessionStorage.setItem(KEY.session, JSON.stringify({ email: acc.email, role: acc.role, name: acc.name })); }
      catch (x) { submit.disabled = false; err.classList.remove('d-none'); return; }
      location.replace(HOME[acc.role]);
    }, 350);
  });

  var saved = null;
  try { saved = localStorage.getItem(KEY.lang); } catch (e) { /* ignore */ }
  applyLang(saved === 'en' ? 'en' : 'ar');
})();
