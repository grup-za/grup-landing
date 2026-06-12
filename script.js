// Grüp landing — scroll reveals + demo card animation. No dependencies.
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("yr").textContent = new Date().getFullYear();

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
