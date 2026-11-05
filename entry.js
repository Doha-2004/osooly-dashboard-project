/* Root entry (index.html): sends the visitor to the first page of the signed-in role, or to the login page.
   Backend: replace the session read with the server session. */
(function () {
  'use strict';
  var HOME = {
    admin: 'dashboards/admin/pages/home/index.html',
    insurance_manager: 'dashboards/insurance/pages/all/index.html',
    insurance_staff: 'dashboards/insurance/pages/new/index.html',
    car_dealer: 'dashboards/car-dealer/pages/ads/index.html',
    rental_dealer: 'dashboards/rental/pages/ads/index.html',
    spare_parts: 'dashboards/spare-parts/pages/ads/index.html',
    recovery: 'dashboards/recovery/pages/incoming/index.html'
  };
  var s = null;
  try { s = JSON.parse(sessionStorage.getItem('osooly.session') || 'null'); } catch (e) { /* storage unavailable */ }
  location.replace(s && s.role && HOME[s.role] ? HOME[s.role] : 'login/index.html');
})();
