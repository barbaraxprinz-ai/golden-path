/*
 * board.js - geometry of a classic 7-circuit (Cretan) labyrinth as SVG.
 *
 * Model: 7 concentric circuits (ring 1 = outermost, ring 7 = innermost)
 * around a central goal. The upper part of every ring is a plain circular
 * arc; the bottom sector holds the classic "seed" - four corridor columns
 * (L, E, F, R) whose cells are filled by the turns, exactly like the
 * cross / L-shapes / dots seed of the Cretan labyrinth.
 *
 * Logical coordinates (s, v):
 *   v : ring coordinate. v = k is the centreline of circuit k, v = k + 0.5 is
 *       the wall between circuit k and k+1 (v = 0.5 outer wall, 7.5 centre wall)
 *   s : arc-length along the ring, in corridor units, measured from the
 *       bottom axis (s > 0 to the right). Columns: L=[-2,-1] E=[-1,0]
 *       F=[0,1] R=[1,2].
 *   r = RC + (7.5 - v) * D,  phi = s * D / r  (phi = 0 at the bottom)
 *
 * Path order: entrance -> 3 -> 2 -> 1 -> 4 -> 7 -> 6 -> 5 -> centre.
 */
(function () {
  function buildLabyrinth() {
    var CX = 400, CY = 400;
    var D = 40;          // corridor pitch (centre to centre of adjacent circuits)
    var RC = 88;         // radius of the centre wall
    var STEP = 2.5;      // sampling step (svg units)

    function R(v) { return RC + (7.5 - v) * D; }
    function P(s, v) {
      var r = R(v), ph = s * D / r;
      return [CX + r * Math.sin(ph), CY + r * Math.cos(ph)];
    }
    function f1(n) { return Math.round(n * 10) / 10; }
    function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }

    // ---- chain builder: accumulates sampled points and an svg d-string ----
    function Chain() {
      this.pts = [];
      this.d = '';
      this.marks = {};
    }
    Chain.prototype._add = function (p, cmd) {
      if (this.pts.length === 0) {
        this.pts.push(p);
        this.d += 'M' + f1(p[0]) + ' ' + f1(p[1]);
        return;
      }
      var last = this.pts[this.pts.length - 1];
      if (dist(last, p) < 1e-6) return;
      this.pts.push(p);
      if (cmd !== false) this.d += 'L' + f1(p[0]) + ' ' + f1(p[1]);
    };
    // generic logical curve f(t) -> [s,v], t in [0,1]
    Chain.prototype.curve = function (fn) {
      // estimate length
      var n0 = 40, len = 0, prev = P.apply(null, fn(0));
      for (var i = 1; i <= n0; i++) {
        var q = P.apply(null, fn(i / n0));
        len += dist(prev, q); prev = q;
      }
      var n = Math.max(2, Math.ceil(len / STEP));
      for (var j = 0; j <= n; j++) this._add(P.apply(null, fn(j / n)));
      return this;
    };
    Chain.prototype.line = function (s1, v1, s2, v2) {
      return this.curve(function (t) { return [s1 + (s2 - s1) * t, v1 + (v2 - v1) * t]; });
    };
    // logical circular arc around (cs,cv), radius rr (logical), angles in degrees
    // angle convention: point = (cs + rr cos a, cv + rr sin a)
    Chain.prototype.circ = function (cs, cv, rr, a0, a1) {
      return this.curve(function (t) {
        var a = (a0 + (a1 - a0) * t) * Math.PI / 180;
        return [cs + rr * Math.cos(a), cv + rr * Math.sin(a)];
      });
    };
    // circular arc over the top on ring/wall v, from edge s=from to edge s=to
    // (from = -2, to = +2 : left side -> over the top -> right side)
    Chain.prototype.top = function (v, from, to) {
      var r = R(v);
      var pa = from * D / r, pb = to * D / r;
      var total, sgn;
      if (from < to) { total = 2 * Math.PI - (pb - pa); sgn = -1; } // phi decreasing
      else { total = 2 * Math.PI - (pa - pb); sgn = +1; }           // phi increasing
      var n = Math.ceil(total * r / STEP);
      for (var i = 0; i <= n; i++) {
        var ph = pa + sgn * total * i / n;
        this._add([CX + r * Math.sin(ph), CY + r * Math.cos(ph)], false);
      }
      var end = this.pts[this.pts.length - 1];
      // split in two svg arcs (each < 360, the first one large)
      var mid = pa + sgn * total / 2;
      var mp = [CX + r * Math.sin(mid), CY + r * Math.cos(mid)];
      var sweep = sgn < 0 ? 1 : 0;
      this.d += 'A' + f1(r) + ' ' + f1(r) + ' 0 0 ' + sweep + ' ' + f1(mp[0]) + ' ' + f1(mp[1]);
      this.d += 'A' + f1(r) + ' ' + f1(r) + ' 0 0 ' + sweep + ' ' + f1(end[0]) + ' ' + f1(end[1]);
      return this;
    };
    Chain.prototype.mark = function (name) {
      this.marks[name] = this.pts.length - 1;
      return this;
    };

    // ------------------------------- PATH --------------------------------
    var path = new Chain();
    path
      .line(-0.5, 0.0, -0.5, 0.5).mark('mouth')            // entrance stub
      .line(-0.5, 0.5, -0.5, 2.5)                           // up column E
      .circ(-1, 2.5, 0.5, 0, 90)                            // turn left
      .line(-1, 3, -2, 3)
      .top(3, -2, 2)                                        // circuit 3
      .circ(2, 2.5, 0.5, 90, 180).mark('t1')                // hairpin 3->2
      .circ(2, 2.5, 0.5, 180, 270)
      .top(2, 2, -2)                                        // circuit 2
      .circ(-2, 1.5, 0.5, 90, 0).mark('t2')                 // hairpin 2->1
      .circ(-2, 1.5, 0.5, 0, -90)
      .top(1, -2, 2)                                        // circuit 1
      .line(2, 1, 1, 1)
      .circ(1, 1.5, 0.5, -90, -180)
      .line(0.5, 1.5, 0.5, 2.5).mark('t3')                  // U-turn 1->4
      .line(0.5, 2.5, 0.5, 3.5)
      .circ(1, 3.5, 0.5, 180, 90)
      .line(1, 4, 2, 4)
      .top(4, 2, -2)                                        // circuit 4
      .line(-2, 4, -1, 4)
      .circ(-1, 4.5, 0.5, -90, 0)
      .line(-0.5, 4.5, -0.5, 5.5).mark('t4')                // U-turn 4->7
      .line(-0.5, 5.5, -0.5, 6.5)
      .circ(-1, 6.5, 0.5, 0, 90)
      .line(-1, 7, -2, 7)
      .top(7, -2, 2)                                        // circuit 7
      .circ(2, 6.5, 0.5, 90, 180).mark('t5')                // hairpin 7->6
      .circ(2, 6.5, 0.5, 180, 270)
      .top(6, 2, -2)                                        // circuit 6
      .circ(-2, 5.5, 0.5, 90, 0).mark('t6')                 // hairpin 6->5
      .circ(-2, 5.5, 0.5, 0, -90)
      .top(5, -2, 2)                                        // circuit 5
      .line(2, 5, 1, 5)
      .circ(1, 5.5, 0.5, -90, -180)
      .line(0.5, 5.5, 0.5, 7.5).mark('cmouth');             // into the centre
    // final straight into the centre point
    (function () {
      var a = path.pts[path.pts.length - 1], b = [CX, CY];
      var n = Math.ceil(dist(a, b) / STEP);
      for (var i = 1; i <= n; i++) {
        path._add([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]);
      }
    })();

    // ------------------------------- WALLS -------------------------------
    // Three continuous wall chains (the classic labyrinth's walls form the
    // cross-and-L seed in the bottom sector).
    var w1 = new Chain();      // w2 tip ... w0 ... axis ... w7 ... w5 tip
    w1.line(2, 2.5, 2, 2.5)
      .top(2.5, 2, -2)
      .line(-2, 2.5, -1, 2.5)
      .line(-1, 2.5, -1, 0.5)
      .line(-1, 0.5, -2, 0.5)
      .top(0.5, -2, 2)
      .line(2, 0.5, 0, 0.5)
      .line(0, 0.5, 0, 7.5)
      .line(0, 7.5, -2, 7.5)
      .top(7.5, -2, 2)
      .line(2, 7.5, 1, 7.5)
      .line(1, 7.5, 1, 5.5)
      .line(1, 5.5, 2, 5.5)
      .top(5.5, 2, -2);
    var w2 = new Chain();      // w3 ... w1 tip
    w2.line(0, 3.5, -2, 3.5)
      .top(3.5, -2, 2)
      .line(2, 3.5, 1, 3.5)
      .line(1, 3.5, 1, 1.5)
      .line(1, 1.5, 2, 1.5)
      .top(1.5, 2, -2);
    var w3 = new Chain();      // w4 ... w6 tip
    w3.line(0, 4.5, 2, 4.5)
      .top(4.5, 2, -2)
      .line(-2, 4.5, -1, 4.5)
      .line(-1, 4.5, -1, 6.5)
      .line(-1, 6.5, -2, 6.5)
      .top(6.5, -2, 2);
    var walls = [w1, w2, w3];

    // --------------------------- FIELDS ----------------------------------
    var pp = path.pts, cum = [0];
    for (var i = 1; i < pp.length; i++) cum.push(cum[i - 1] + dist(pp[i - 1], pp[i]));
    function at(L) {
      var lo = 0, hi = cum.length - 1;
      while (hi - lo > 1) { var m = (lo + hi) >> 1; if (cum[m] <= L) lo = m; else hi = m; }
      var seg = cum[hi] - cum[lo] || 1, t = (L - cum[lo]) / seg;
      var a = pp[lo], b = pp[hi];
      return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t,
               angle: Math.atan2(b[1] - a[1], b[0] - a[0]) };
    }
    var L0 = cum[path.marks.mouth], L1 = cum[path.marks.cmouth];
    var N = 40, margin = 30;
    var spacing = (L1 - L0 - 2 * margin) / (N - 1);
    var fields = [], fieldL = [];
    for (var k = 0; k < N; k++) {
      var Lk = L0 + margin + spacing * k;
      var q = at(Lk);
      fields.push({ x: f1(q.x), y: f1(q.y), angle: Math.round(q.angle * 1000) / 1000 });
      fieldL.push(Lk);
    }

    // --------------------------- TURNS -----------------------------------
    var turns = ['t1', 't2', 't3', 't4', 't5', 't6'].map(function (m) {
      var idx = path.marks[m], Lt = cum[idx], best = 0;
      for (var k = 1; k < N; k++) if (Math.abs(fieldL[k] - Lt) < Math.abs(fieldL[best] - Lt)) best = k;
      return { x: f1(pp[idx][0]), y: f1(pp[idx][1]), field: best + 1 };
    });

    // --------------------------- RAYS ------------------------------------
    var rays = [], rOut = R(0.5);
    for (var j = 0; j < 12; j++) {
      var th = j * Math.PI / 6;
      var dx = Math.sin(th), dy = -Math.cos(th);
      rays.push({ x1: f1(CX + dx * RC), y1: f1(CY + dy * RC),
                  x2: f1(CX + dx * rOut), y2: f1(CY + dy * rOut) });
    }

    var ent = P(-0.5, 0.0);
    var result = {
      viewBox: '0 0 800 800',
      wallsD: walls.map(function (w) { return w.d; }).join(' '),
      pathD: path.d,
      fields: fields,
      entrance: { x: f1(ent[0]), y: f1(ent[1]) },
      center: { x: CX, y: CY, r: RC - 10 },
      rays: rays,
      turns: turns
    };
    // sampled geometry for tests / hit-testing (non-enumerable)
    Object.defineProperty(result, '_debug', {
      enumerable: false,
      value: { pathPts: pp, pathLen: cum, mouthL: L0, centerL: L1, fieldL: fieldL,
               wallPts: walls.map(function (w) { return w.pts; }), spacing: spacing }
    });
    return result;
  }

  if (typeof window !== 'undefined') window.buildLabyrinth = buildLabyrinth;
})();
