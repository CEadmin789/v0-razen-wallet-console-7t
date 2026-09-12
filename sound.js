(function (global) {
  var KEY = "razen.sound";
  var ctx = null;
  var enabled = localStorage.getItem(KEY) !== "0";

  function ac() {
    var C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    if (!ctx) ctx = new C();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, t, dur, type, gain, slideTo) {
    var c = ac();
    if (!c) return;
    var o = c.createOscillator();
    var g = c.createGain();
    var f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(2200, t);
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.014, dur * 0.25));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f);
    f.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.03);
  }

  var cues = {
    nav: function (t) { tone(720, t, 0.04, "sine", 0.03); },
    tick: function (t) { tone(960, t, 0.028, "sine", 0.026); },
    open: function (t) { tone(392, t, 0.1, "sine", 0.038, 640); },
    close: function (t) { tone(494, t, 0.08, "sine", 0.028, 260); },
    success: function (t) {
      tone(523.25, t, 0.11, "triangle", 0.042);
      tone(783.99, t + 0.08, 0.15, "sine", 0.036);
    },
    error: function (t) { tone(207, t, 0.16, "sine", 0.048, 138); }
  };

  function play(name) {
    if (!enabled || !cues[name]) return;
    var c = ac();
    if (!c) return;
    cues[name](c.currentTime + 0.008);
  }

  function paint(btn) {
    btn.setAttribute("aria-pressed", enabled ? "true" : "false");
    btn.innerHTML = (enabled
      ? '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M3 10v4h4l5 4V6L7 10H3zm13.5 2c0-1.77-1-3.29-2.5-4.03v8.05A4.48 4.48 0 0016.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.5 7-8.77s-2.99-7.86-7-8.77z"/></svg><span>เสียง</span>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M16.5 12c0-1.77-1-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zM19 12c0 .94-.2 1.82-.54 2.63l1.51 1.51A8.92 8.92 0 0021 12c0-4.27-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 4v-5.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 6 9.91 7.67 12 9.76V6z"/></svg><span>ปิดเสียง</span>');
  }

  function setEnabled(on) {
    enabled = !!on;
    localStorage.setItem(KEY, enabled ? "1" : "0");
    document.querySelectorAll("[data-razen-sound]").forEach(paint);
    if (enabled) play("tick");
  }

  function place(parent, before) {
    if (!parent || parent.querySelector("[data-razen-sound]")) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "razen-sound";
    b.setAttribute("data-razen-sound", "");
    b.setAttribute("aria-label", "เปิดหรือปิดเสียง");
    b.setAttribute("title", "เปิดหรือปิดเสียง");
    paint(b);
    b.addEventListener("click", function () { setEnabled(!enabled); });
    if (before) parent.insertBefore(b, before);
    else parent.appendChild(b);
  }

  function mount() {
    if (!document.getElementById("razen-sound-style")) {
      var style = document.createElement("style");
      style.id = "razen-sound-style";
      style.textContent = ".razen-sound{appearance:none;border:1px solid rgba(255,255,255,.16);background:rgba(0,0,0,.18);color:#f3efe6;font:600 12px/1 inherit;padding:7px 10px;border-radius:999px;cursor:pointer;flex:0 0 auto}.razen-sound[aria-pressed=false]{opacity:.5}.sidebar-footer .razen-sound{margin-top:10px}";
      document.head.appendChild(style);
    }
    var header = document.getElementById("mobile-header");
    if (header) place(header, header.querySelector(".hamburger"));
    var desk = document.querySelector(".sidebar-desktop .sidebar-footer");
    if (desk) place(desk, null);
  }

  document.addEventListener("pointerdown", function () { ac(); }, { once: true });
  global.RazenSound = { play: play, setEnabled: setEnabled, mount: mount };
})(window);
