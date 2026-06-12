// Grüp landing — scroll reveals + demo card animation. No dependencies.
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("yr").textContent = new Date().getFullYear();

  // Intro splash: play the write-on full screen, then shrink it into the nav logo.
  (function intro() {
    var splash = document.getElementById("splash");
    if (!splash) return;
    var anim = splash.querySelector(".splash-anim");
    var bg = splash.querySelector(".splash-bg");
    var navLogo = document.querySelector(".nav-logo-img");
    var done = false;

    function finish() {
      if (done) return;
      done = true;
      if (navLogo) { navLogo.style.transition = "none"; navLogo.style.opacity = "1"; }
      document.body.classList.remove("intro");
      if (splash.parentNode) splash.parentNode.removeChild(splash);
    }

    // Skip the intro if reduced motion is requested, or already seen this session.
    if (reduced || sessionStorage.getItem("grupIntroSeen")) {
      finish();
      return;
    }
    sessionStorage.setItem("grupIntroSeen", "1");
    document.body.classList.add("intro");

    // Fly the animation down onto the nav logo, then hand off to the static logo.
    function fly() {
      if (done || !navLogo) { finish(); return; }
      var n = navLogo.getBoundingClientRect();
      var s = anim.getBoundingClientRect();
      if (!s.width || !n.width) { finish(); return; }
      var scale = n.width / s.width;
      var tx = n.left - s.left;
      var ty = n.top - s.top;
      anim.style.transition = "transform .85s cubic-bezier(.7,0,.2,1)";
      anim.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
      bg.style.opacity = "0";
      splash.style.pointerEvents = "none";
      setTimeout(finish, 900);
    }

    // Let people skip the intro early.
    function skip() { if (!done) { document.removeEventListener("keydown", skip); finish(); } }
    document.addEventListener("keydown", skip);
    splash.addEventListener("click", skip);

    // Hold full-screen for the write-on (~3.1s), then fly to the corner.
    setTimeout(fly, 3150);
  })();

  // Scroll reveals
  var revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduced) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.18 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Demo card: tick payers paid one by one, fill the tape, count the rands.
  var card = document.getElementById("demoCard");
  if (!card) return;
  var rows = Array.prototype.slice.call(card.querySelectorAll(".payers li[data-paid]"));
  var tape = document.getElementById("tapeFill");
  var amt = document.getElementById("collectedAmt");
  var total = card.querySelectorAll(".payers li").length;
  var share = 250;

  function setState(paidCount) {
    rows.forEach(function (li, i) { li.classList.toggle("is-paid", i < paidCount); });
    tape.style.width = (paidCount / total) * 100 + "%";
    amt.textContent = "R" + (paidCount * share).toLocaleString("en-ZA").replace(/,/g, "\u00a0");
  }

  if (reduced) { setState(rows.length); return; }

  setState(0);
  var played = false;
  var demoIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting || played) return;
      played = true;
      demoIO.disconnect();
      rows.forEach(function (_, i) {
        setTimeout(function () { setState(i + 1); }, 600 + i * 650);
      });
    });
  }, { threshold: 0.45 });
  demoIO.observe(card);
})();
