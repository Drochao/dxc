/* ─────────────────────────────────────────────
   Odyssey 手绘画风绘制库
   index.html 通过 <script src="handart.js"> 引入
   所有函数显式接收 ctx，不依赖外部全局变量
   ───────────────────────────────────────────── */
(function (global) {

  const P = {
    INK:      '#1b1210',
    INK_SOFT: '#2e201a',
    ARMOR:    '#4a4d3b',
    HELM:     '#665c45',
    CAPE:     '#85362c',
    TRIM:     '#b08a48',
    SKIN:     '#e3b089',
    BONE:     '#ece3cb',
    BONE_D:   '#bdb096',
    LEATHER:  '#7d5a39'
  };

  /* ── 确定性噪声：同一 seed 永远得到同一个抖动 ── */
  function jit(i) {
    const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }
  function sj(i) { return jit(i) * 2 - 1; }

  /* ── 手绘基础件 ───────────────────────────── */
  function blobPath(cx, cy, rx, ry, seed, n, amp, ctx) {
    const c = ctx;
    c.beginPath();
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2;
      const k = 1 + sj(seed + i) * amp;
      const px = cx + Math.cos(a) * rx * k;
      const py = cy + Math.sin(a) * ry * k;
      if (i === 0) c.moveTo(px, py);
      else {
        const pa = ((i - 0.5) / n) * Math.PI * 2;
        const pk = 1 + sj(seed + i - 0.5) * amp;
        c.quadraticCurveTo(
          cx + Math.cos(pa) * rx * pk * 1.12,
          cy + Math.sin(pa) * ry * pk * 1.12,
          px, py
        );
      }
    }
    c.closePath();
  }

  function roughPath(x1, y1, x2, y2, seed, amp, ctx) {
    const c = ctx;
    const steps = 4;
    c.beginPath();
    c.moveTo(x1, y1);
    for (let i = 1; i <= steps; i++) {
      const k = i / steps;
      c.lineTo(
        x1 + (x2 - x1) * k + sj(seed + i) * amp,
        y1 + (y2 - y1) * k + sj(seed + i + 9) * amp
      );
    }
  }

  // 以撒式"贴纸"：先填色再统一压黑描边
  function ink(ctx, build, fill, lw) {
    ctx.beginPath();
    build();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = lw || 2.2;
    ctx.strokeStyle = P.INK;
    ctx.stroke();
  }

  // 只在形状内部叠光，做出体积
  function innerLight(ctx, cx, cy, rx, ry, color, alpha) {
    ctx.save();
    ctx.clip();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, -0.28, 0, 6.3);
    ctx.fill();
    ctx.restore();
  }

  function shadow(ctx, cx, cy, rx, ry, a) {
    ctx.save();
    ctx.globalAlpha = a === undefined ? 0.30 : a;
    ctx.fillStyle = '#120b08';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.3);
    ctx.fill();
    ctx.restore();
  }

  /* ── 主角：奥德修斯 ──────────────────────────
     opts: { face, walk, animT, scale, blocking }
     face: down | up | left | right（left 由外层镜像处理）
     锚点在脚底中央，原始绘制高度 72 */
  function drawHero(ctx, px, py, t, o) {
    o = o || {};
    const K = o.scale || 0.62;
    const face = o.face || 'down';
    const walk = !!o.walk;
    // 走与站之间做缓动，起步不跳、停步不僵
    const wb = o.walkBlend === undefined ? (walk ? 1 : 0) : o.walkBlend;
    const phase = (o.animT || 0) * 12;
    const stepL = Math.sin(phase) * wb;
    const stepR = Math.sin(phase + Math.PI) * wb;
    // 走路时重心随步频起伏，静止时只剩呼吸
    const by = -Math.abs(Math.sin(phase)) * 3.2 * wb + (1 - wb) * Math.sin(t * 2.4) * 0.8;
    const sway = Math.sin(t * 2.7) * 2;
    const lean = (o.lean || 0) + stepL * 0.018;
    const x = 0;

    ctx.save();
    ctx.translate(px, py);
    ctx.scale(K, K);
    ctx.rotate(lean);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // 1. 披风：从双肩包到膝上，是整个人物的外层轮廓
    ink(ctx, function () {
      ctx.moveTo(x - 11.4, by - 43);
      ctx.quadraticCurveTo(x - 20.5 + sway * 0.6, by - 34, x - 20 + sway, by - 12);
      ctx.quadraticCurveTo(x - 19.4 + sway, by - 6.4, x - 12.6 + sway, by - 5);
      ctx.quadraticCurveTo(x, by - 3.2, x + 12.6 + sway * 0.5, by - 5);
      ctx.quadraticCurveTo(x + 19.4 + sway * 0.5, by - 6.4, x + 20 + sway * 0.5, by - 12);
      ctx.quadraticCurveTo(x + 20.5 + sway * 0.5, by - 34, x + 11.4, by - 43);
      ctx.closePath();
    }, P.CAPE, 2.6);

    // 2. 身体剪影：颈、肩、手臂、腰、腿、靴一次成型
    function bodyPath() {
      ctx.moveTo(x - 4.2, by - 46);
      ctx.quadraticCurveTo(x - 8.8, by - 45.6, x - 11.8, by - 41.6);
      ctx.quadraticCurveTo(x - 14, by - 38.6, x - 14, by - 32);
      ctx.quadraticCurveTo(x - 14, by - 24, x - 13.4, by - 20);
      ctx.quadraticCurveTo(x - 12.8, by - 17.6, x - 11.8, by - 16.6);
      ctx.quadraticCurveTo(x - 10.8, by - 16.2, x - 10.3, by - 17.4);
      ctx.quadraticCurveTo(x - 10.2, by - 22, x - 10.4, by - 26.5);
      ctx.quadraticCurveTo(x - 10.6, by - 23, x - 10.4, by - 21.4);
      ctx.quadraticCurveTo(x - 10, by - 19, x - 10.8, by - 18);
      ctx.quadraticCurveTo(x - 9.8, by - 14, x - 9.2, by - 8);
      ctx.quadraticCurveTo(x - 9.4, by - 6.4, x - 10.1, by - 5.2);
      ctx.quadraticCurveTo(x - 9.8, by + 1.4, x - 5.8, by + 1.5);
      ctx.quadraticCurveTo(x - 3.3, by + 1.4, x - 2.9, by - 1.4);
      ctx.quadraticCurveTo(x - 2.5, by - 4.6, x, by - 8);
      ctx.quadraticCurveTo(x + 2.5, by - 4.6, x + 2.9, by - 1.4);
      ctx.quadraticCurveTo(x + 3.3, by + 1.4, x + 5.8, by + 1.5);
      ctx.quadraticCurveTo(x + 9.8, by + 1.4, x + 10.1, by - 5.2);
      ctx.quadraticCurveTo(x + 9.4, by - 6.4, x + 9.2, by - 8);
      ctx.quadraticCurveTo(x + 9.8, by - 14, x + 10.8, by - 18);
      ctx.quadraticCurveTo(x + 10, by - 19, x + 10.4, by - 21.4);
      ctx.quadraticCurveTo(x + 10.6, by - 23, x + 10.4, by - 26.5);
      ctx.quadraticCurveTo(x + 10.2, by - 22, x + 10.3, by - 17.4);
      ctx.quadraticCurveTo(x + 10.8, by - 16.2, x + 11.8, by - 16.6);
      ctx.quadraticCurveTo(x + 12.8, by - 17.6, x + 13.4, by - 20);
      ctx.quadraticCurveTo(x + 14, by - 24, x + 14, by - 32);
      ctx.quadraticCurveTo(x + 14, by - 38.6, x + 11.8, by - 41.6);
      ctx.quadraticCurveTo(x + 8.8, by - 45.6, x + 4.2, by - 46);
      ctx.quadraticCurveTo(x, by - 46.6, x - 4.2, by - 46);
      ctx.closePath();
    }
    ctx.beginPath();
    bodyPath();
    ctx.fillStyle = P.ARMOR;
    ctx.fill();
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = P.INK;
    ctx.stroke();

    // 3. 剪影内分区
    ctx.save();
    ctx.beginPath();
    bodyPath();
    ctx.clip();

    // 双臂
    for (let s = -1; s <= 1; s += 2) {
      ctx.beginPath();
      ctx.moveTo(x + s * 11.8, by - 40);
      ctx.quadraticCurveTo(x + s * 14, by - 34, x + s * 13.6, by - 28);
      ctx.quadraticCurveTo(x + s * 13, by - 21, x + s * 11.8, by - 17.6);
      ctx.lineTo(x + s * 10.2, by - 17.6);
      ctx.quadraticCurveTo(x + s * 10.4, by - 26, x + s * 10.6, by - 34);
      ctx.closePath();
      ctx.fillStyle = P.SKIN;
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + s * 11.2, by - 17.2, 2.3, 2.1, 0, 0, 6.3);
      ctx.fill();
    }
    // 裤腿：走路时两条腿交替抬起
    ctx.fillStyle = '#3a2f24';
    ctx.save();
    ctx.translate(x - 6.4, by - 6 - Math.max(0, stepL) * 4.2);
    ctx.rotate(stepL * 0.22);
    ctx.fillRect(-3.4, -12, 6.8, 12.4);
    ctx.restore();
    ctx.save();
    ctx.translate(x + 6.4, by - 6 - Math.max(0, stepR) * 4.2);
    ctx.rotate(stepR * 0.22);
    ctx.fillRect(-3.4, -12, 6.8, 12.4);
    ctx.restore();
    // 靴
    ctx.fillStyle = '#1e1813';
    ctx.save();
    ctx.translate(x - 6.5, by - 1.8 - Math.max(0, stepL) * 4.8);
    ctx.rotate(stepL * 0.28);
    ctx.fillRect(-3.9, -3.6, 7.8, 7.2);
    ctx.restore();
    ctx.save();
    ctx.translate(x + 6.5, by - 1.8 - Math.max(0, stepR) * 4.8);
    ctx.rotate(stepR * 0.28);
    ctx.fillRect(-3.9, -3.6, 7.8, 7.2);
    ctx.restore();

    // 侧面明暗
    const sh = ctx.createLinearGradient(x - 14, 0, x + 14, 0);
    sh.addColorStop(0, 'rgba(255,238,196,0.12)');
    sh.addColorStop(0.42, 'rgba(0,0,0,0)');
    sh.addColorStop(1, 'rgba(0,0,0,0.24)');
    ctx.fillStyle = sh;
    ctx.fillRect(x - 15, by - 47, 30, 49);

    // 胸板
    ctx.beginPath();
    ctx.moveTo(x - 9, by - 40.6);
    ctx.quadraticCurveTo(x, by - 43.4, x + 9, by - 40.6);
    ctx.lineTo(x + 7.2, by - 26);
    ctx.quadraticCurveTo(x, by - 23, x - 7.2, by - 26);
    ctx.closePath();
    ctx.fillStyle = '#6a6e50';
    ctx.fill();
    ctx.lineWidth = 1.7;
    ctx.strokeStyle = 'rgba(24,26,18,0.5)';
    ctx.stroke();
    ctx.fillStyle = 'rgba(216,222,171,0.30)';
    ctx.beginPath();
    ctx.ellipse(x - 3.8, by - 35, 5, 3.8, -0.3, 0, 6.3);
    ctx.fill();

    // 背带
    ctx.strokeStyle = 'rgba(46,32,20,0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 7.4, by - 41);
    ctx.lineTo(x - 7, by - 26);
    ctx.moveTo(x + 7.4, by - 41);
    ctx.lineTo(x + 7, by - 26);
    ctx.stroke();

    // 腰带
    ctx.fillStyle = '#4a3524';
    ctx.fillRect(x - 11.2, by - 21.6, 22.4, 3.6);
    ctx.fillStyle = P.TRIM;
    ctx.fillRect(x - 2.4, by - 21.2, 4.8, 2.8);

    // 皮条裙
    for (let i = -2; i <= 2; i++) {
      const px2 = x + i * 4.4;
      const lean2 = i * 0.7 + Math.sin(t * 2.2 + i * 1.7) * 0.5 + (walk ? stepL * 0.6 : 0);
      ctx.beginPath();
      ctx.moveTo(px2 - 2.1, by - 18);
      ctx.quadraticCurveTo(px2 - 2.4 + lean2, by - 16, px2 - 1.8 + lean2, by - 13.2);
      ctx.lineTo(px2 + 1.8 + lean2, by - 13.2);
      ctx.quadraticCurveTo(px2 + 2.4 + lean2, by - 16, px2 + 2.1, by - 18);
      ctx.closePath();
      ctx.fillStyle = P.LEATHER;
      ctx.fill();
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = 'rgba(38,26,16,0.65)';
      ctx.stroke();
    }

    // 护胫：跟着各自的腿一起抬
    for (let s = -1; s <= 1; s += 2) {
      const st = s < 0 ? stepL : stepR;
      ctx.save();
      ctx.translate(0, -Math.max(0, st) * 4.2);
      ctx.beginPath();
      ctx.moveTo(x + s * 9.6, by - 10.8);
      ctx.quadraticCurveTo(x + s * 6.4, by - 11.8, x + s * 3.2, by - 10.8);
      ctx.lineTo(x + s * 3.4, by - 5.4);
      ctx.lineTo(x + s * 9.8, by - 5.4);
      ctx.closePath();
      ctx.fillStyle = '#5c5f48';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(24,26,18,0.55)';
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();   // 结束剪影内绘制

    // 4. 肩甲
    for (let s = -1; s <= 1; s += 2) {
      ink(ctx, function () {
        ctx.ellipse(x + s * 11.2, by - 40.4, 5.2, 4.2, s * 0.26, 0, 6.3);
      }, '#5c5f48', 2.2);
    }

    // 5. 头部
    if (face === 'up') {
      // 背面：只有盔与披风，没有脸
      ink(ctx, function () {
        ctx.moveTo(x - 11.2, by - 48.8);
        ctx.quadraticCurveTo(x - 12.6, by - 59.6, x - 8.6, by - 63.6);
        ctx.quadraticCurveTo(x, by - 67, x + 8.6, by - 63.6);
        ctx.quadraticCurveTo(x + 12.6, by - 59.6, x + 11.2, by - 48.8);
        ctx.quadraticCurveTo(x, by - 46.6, x - 11.2, by - 48.8);
        ctx.closePath();
      }, P.HELM, 2.8);
      // 盔后中缝
      ctx.strokeStyle = 'rgba(30,24,16,0.65)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x, by - 66);
      ctx.lineTo(x, by - 47);
      ctx.stroke();
    } else {
      // 正面：脸、须、盔、牙排
      ink(ctx, function () {
        ctx.moveTo(x - 9.4, by - 50.4);
        ctx.quadraticCurveTo(x - 9.9, by - 59.6, x, by - 60.4);
        ctx.quadraticCurveTo(x + 9.9, by - 59.6, x + 9.4, by - 50.4);
        ctx.quadraticCurveTo(x + 9, by - 44.8, x + 5.4, by - 43);
        ctx.quadraticCurveTo(x, by - 42, x - 5.4, by - 43);
        ctx.quadraticCurveTo(x - 9, by - 44.8, x - 9.4, by - 50.4);
        ctx.closePath();
      }, P.SKIN, 2.6);

      // 胡须
      ink(ctx, function () {
        ctx.moveTo(x - 9, by - 46.4);
        ctx.quadraticCurveTo(x - 10.4, by - 41, x - 6, by - 38.4);
        ctx.quadraticCurveTo(x, by - 36, x + 6, by - 38.4);
        ctx.quadraticCurveTo(x + 10.4, by - 41, x + 9, by - 46.4);
        ctx.quadraticCurveTo(x + 7.2, by - 43.8, x + 4.2, by - 43.6);
        ctx.lineTo(x + 3.6, by - 40.4);
        ctx.quadraticCurveTo(x, by - 39.4, x - 3.6, by - 40.4);
        ctx.lineTo(x - 4.2, by - 43.6);
        ctx.quadraticCurveTo(x - 7.2, by - 43.8, x - 9, by - 46.4);
        ctx.closePath();
      }, '#4a3123', 2.4);

      // 眼
      ctx.fillStyle = '#f3e7cd';
      ctx.beginPath();
      ctx.ellipse(x - 4, by - 48.6, 2.7, 2.7, 0, 0, 6.3);
      ctx.ellipse(x + 4, by - 48.6, 2.7, 2.7, 0, 0, 6.3);
      ctx.fill();
      ctx.fillStyle = '#2b3038';
      ctx.beginPath();
      ctx.ellipse(x - 3.9, by - 48.6, 1.5, 1.7, 0, 0, 6.3);
      ctx.ellipse(x + 4.1, by - 48.6, 1.5, 1.7, 0, 0, 6.3);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath();
      ctx.arc(x - 4.6, by - 49.3, 0.7, 0, 6.3);
      ctx.arc(x + 3.4, by - 49.3, 0.7, 0, 6.3);
      ctx.fill();

      // 盔
      ink(ctx, function () {
        ctx.moveTo(x - 11.2, by - 48.8);
        ctx.quadraticCurveTo(x - 12.6, by - 59.6, x - 8.6, by - 63.6);
        ctx.quadraticCurveTo(x, by - 67, x + 8.6, by - 63.6);
        ctx.quadraticCurveTo(x + 12.6, by - 59.6, x + 11.2, by - 48.8);
        ctx.quadraticCurveTo(x + 9, by - 46.8, x + 6.2, by - 50.8);
        ctx.quadraticCurveTo(x, by - 52.6, x - 6.2, by - 50.8);
        ctx.quadraticCurveTo(x - 9, by - 46.8, x - 11.2, by - 48.8);
        ctx.closePath();
      }, P.HELM, 2.8);
    }

    // 6. 顶鬃结
    ink(ctx, function () {
      ctx.moveTo(x - 2.5, by - 63.6);
      ctx.quadraticCurveTo(x - 3.2 + sway, by - 67.4, x - 1.1 + sway, by - 68.8);
      ctx.quadraticCurveTo(x + 0.6 + sway, by - 70, x + 1.9 + sway * 0.6, by - 67.6);
      ctx.quadraticCurveTo(x + 3, by - 65.8, x + 2.5, by - 63.6);
      ctx.closePath();
    }, '#963f32', 1.8);

    // 7. 野猪牙面甲：两排交错
    const tuskRy = [by - 58.8, by - 54.6];
    const tuskHalf = [7.6, 5.8];
    const tuskN = [6, 4];
    for (let row = 0; row < 2; row++) {
      const ry = tuskRy[row];
      const n = tuskN[row];
      const half = tuskHalf[row];
      for (let i = 0; i <= n; i++) {
        const tx = x - half + (i / n) * half * 2 + sj(row * 7 + i) * 0.5;
        ink(ctx, function () {
          ctx.moveTo(tx - 1.2, ry + 1.4);
          ctx.quadraticCurveTo(tx - 1.5, ry - 1, tx, ry - 2.1);
          ctx.quadraticCurveTo(tx + 1.5, ry - 1, tx + 1.2, ry + 1.4);
          ctx.closePath();
        }, P.BONE, 0.9);
      }
    }

    ctx.restore();
  }

  /* ── 场景地面 ──────────────────────────────── */

  // 沙滩：暖沙 + 沙纹 + 沙粒 + 贝壳 + 脚印
  function drawSandFloor(ctx) {
    const W = 480, H = 270;
    ctx.fillStyle = '#8d7853';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 36; i++) {
      const cx = jit(i * 4.9) * W;
      const cy = 24 + jit(i * 4.9 + 1) * (H - 30);
      const rx = 28 + jit(i * 4.9 + 2) * 44;
      const ry = 18 + jit(i * 4.9 + 3) * 26;
      blobPath(cx, cy, rx, ry, i * 8.7, 8, 0.24, ctx);
      ctx.fillStyle = i % 3 === 0 ? 'rgba(190,168,126,0.14)' : 'rgba(96,80,54,0.18)';
      ctx.fill();
    }

    // 风吹沙纹
    for (let i = 0; i < 17; i++) {
      const y = 30 + jit(i * 3.7) * (H - 56);
      const x0 = 14 + jit(i * 3.7 + 1) * (W - 150);
      const len = 54 + jit(i * 3.7 + 2) * 112;
      ctx.strokeStyle = 'rgba(122,102,68,0.28)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.quadraticCurveTo(x0 + len * 0.5, y + sj(i * 3.7) * 5, x0 + len, y + sj(i * 3.7 + 1) * 2);
      ctx.stroke();
    }

    // 沙粒
    for (let i = 0; i < 440; i++) {
      const x = jit(i * 1.9 + 5) * W;
      const y = jit(i * 2.7 + 13) * H;
      const r = 0.7 + jit(i * 3.3) * 1.2;
      ctx.fillStyle = jit(i * 5.9) > 0.5 ? 'rgba(198,176,132,0.30)' : 'rgba(88,72,48,0.30)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.3);
      ctx.fill();
    }

    // 贝壳
    for (let i = 0; i < 8; i++) {
      const x = 34 + jit(i * 7.7) * (W - 68);
      const y = 52 + jit(i * 7.7 + 1) * (H - 100);
      const r = 2.2 + jit(i * 7.7 + 2) * 1.5;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(sj(i * 7.7) * 0.9);
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI, 0);
      ctx.closePath();
      ctx.fillStyle = jit(i) > 0.5 ? '#e8dcc2' : '#d7c6a6';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(74,58,38,0.7)';
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -r);
      ctx.stroke();
      ctx.restore();
    }

    // 脚印
    for (let i = 0; i < 5; i++) {
      const x = 62 + jit(i * 8.3) * (W - 124);
      const y = 84 + jit(i * 8.3 + 1) * (H - 168);
      for (let f = 0; f < 2; f++) {
        ctx.fillStyle = 'rgba(104,86,58,0.22)';
        ctx.beginPath();
        ctx.ellipse(x + f * 5.8, y + f * 2.6, 2.3, 3.5, 0.24, 0, 6.3);
        ctx.fill();
      }
    }
  }

  // 泥地与莲池
  function drawMudFloor(ctx) {
    const W = 480, H = 270;
    ctx.fillStyle = '#3f4a34';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 30; i++) {
      const cx = jit(i * 4.3) * W;
      const cy = jit(i * 4.3 + 1) * H;
      const rx = 34 + jit(i * 4.3 + 2) * 54;
      const ry = 22 + jit(i * 4.3 + 3) * 32;
      blobPath(cx, cy, rx, ry, i * 7.9, 8, 0.26, ctx);
      ctx.fillStyle = i % 3 === 0 ? 'rgba(96,110,68,0.20)' : 'rgba(40,50,32,0.22)';
      ctx.fill();
    }

    const ponds = [
      [96, 92, 54, 26, 11],
      [356, 198, 62, 30, 23],
      [214, 238, 48, 22, 37]
    ];
    for (let p = 0; p < ponds.length; p++) {
      const cx = ponds[p][0], cy = ponds[p][1];
      const rx = ponds[p][2], ry = ponds[p][3], seed = ponds[p][4];
      blobPath(cx, cy, rx, ry, seed, 8, 0.28, ctx);
      ctx.fillStyle = '#43565a';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(26,36,32,0.55)';
      ctx.stroke();
      ctx.save();
      ctx.beginPath();
      blobPath(cx, cy, rx, ry, seed, 8, 0.28, ctx);
      ctx.clip();
      ctx.strokeStyle = 'rgba(126,158,152,0.32)';
      ctx.lineWidth = 2;
      for (let k = 0; k < 3; k++) {
        const yy = cy - ry * 0.42 + k * 7;
        ctx.beginPath();
        ctx.moveTo(cx - rx * 0.5, yy);
        ctx.quadraticCurveTo(cx, yy - 2.6, cx + rx * 0.4, yy + 1);
        ctx.stroke();
      }
      ctx.restore();
    }

    for (let i = 0; i < 380; i++) {
      const x = jit(i * 1.9 + 7) * W;
      const y = jit(i * 2.7 + 17) * H;
      const r = 0.7 + jit(i * 3.3) * 1.1;
      ctx.fillStyle = jit(i * 5.9) > 0.5 ? 'rgba(120,134,88,0.32)' : 'rgba(34,42,28,0.34)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.3);
      ctx.fill();
    }

    for (let i = 0; i < 14; i++) {
      const gx = 24 + jit(i * 9.7) * (W - 48);
      const gy = 52 + jit(i * 9.7 + 1) * (H - 96);
      ctx.strokeStyle = 'rgba(126,146,88,0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let b = -1; b <= 1; b++) {
        ctx.moveTo(gx, gy);
        ctx.quadraticCurveTo(gx + b * 2.4, gy - 4.6, gx + b * 4.2 + sj(i + b) * 1.2, gy - 8);
      }
      ctx.stroke();
    }

    for (let i = 0; i < 9; i++) {
      const x = 30 + jit(i * 6.1) * (W - 60);
      const y = 48 + jit(i * 6.1 + 1) * (H - 88);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(sj(i * 6.1) * 1.2);
      ctx.beginPath();
      ctx.ellipse(0, 0, 3.2, 1.8, 0, 0, 6.3);
      ctx.fillStyle = i % 3 ? 'rgba(232,168,189,0.5)' : 'rgba(196,115,143,0.45)';
      ctx.fill();
      ctx.restore();
    }
  }

  // 岩地：暖棕岩面 + 苔藓 + 碎石
  function drawRockFloor(ctx) {
    const W = 480, H = 270;
    ctx.fillStyle = '#5a4636';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 28; i++) {
      const cx = jit(i * 4.7) * W;
      const cy = jit(i * 4.7 + 1) * H;
      const rx = 50 + jit(i * 4.7 + 2) * 70;
      const ry = 34 + jit(i * 4.7 + 3) * 46;
      blobPath(cx, cy, rx, ry, i * 8.3, 8, 0.26, ctx);
      ctx.fillStyle = i % 3 === 0 ? 'rgba(112,90,68,0.20)' : 'rgba(64,48,36,0.20)';
      ctx.fill();
    }

    for (let i = 0; i < 520; i++) {
      const x = jit(i * 1.7 + 3) * W;
      const y = jit(i * 2.3 + 11) * H;
      const r = 0.8 + jit(i * 3.1) * 1.4;
      ctx.fillStyle = jit(i * 5.7) > 0.5 ? 'rgba(132,110,84,0.45)' : 'rgba(50,37,27,0.45)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.3);
      ctx.fill();
    }

    for (let i = 0; i < 6; i++) {
      const cx = 50 + jit(i * 6.1 + 2) * (W - 100);
      const cy = 56 + jit(i * 6.1 + 5) * (H - 112);
      blobPath(cx, cy, 26 + jit(i * 6.1) * 30, 16 + jit(i * 6.1 + 1) * 18, i * 12.3, 8, 0.34, ctx);
      ctx.fillStyle = 'rgba(52,38,28,0.16)';
      ctx.fill();
    }

    for (let i = 0; i < 9; i++) {
      const cx = 34 + jit(i * 5.3) * (W - 68);
      const cy = 46 + jit(i * 5.3 + 1) * (H - 92);
      blobPath(cx, cy, 8 + jit(i * 5.3 + 2) * 15, 5 + jit(i * 5.3 + 3) * 8, i * 9.1, 7, 0.34, ctx);
      ctx.fillStyle = 'rgba(86,108,56,0.40)';
      ctx.fill();
    }

    for (let i = 0; i < 11; i++) {
      const x = 36 + jit(i * 5.1 + 2) * (W - 72);
      const y = 48 + jit(i * 5.1 + 6) * (H - 96);
      const r = 2.4 + jit(i * 5.1 + 9) * 3.4;
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = '#120b08';
      ctx.beginPath();
      ctx.ellipse(x + 1, y + r * 0.8, r * 1.2, r * 0.4, 0, 0, 6.3);
      ctx.fill();
      ctx.globalAlpha = 1;
      blobPath(x, y, r, r * 0.72, i * 7.3, 5, 0.24, ctx);
      ctx.fillStyle = jit(i) > 0.45 ? '#8a7458' : '#a08a6a';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(40,29,23,0.8)';
      ctx.stroke();
    }
  }

  // 城池：石板路 + 焦痕 + 碎石（ACT I 伊斯马罗斯）
  function drawCityFloor(ctx) {
    const W = 480, H = 270;
    ctx.fillStyle = '#3b3731';
    ctx.fillRect(0, 0, W, H);

    // 石板：16px 网格，四角带手绘抖动
    const CELL = 16;
    for (let gy = -1; gy < H / CELL + 1; gy++) {
      for (let gx = -1; gx < W / CELL + 1; gx++) {
        const s = gx * 7.3 + gy * 13.1;
        const x0 = gx * CELL + sj(s) * 1.4;
        const y0 = gy * CELL + sj(s + 1) * 1.4;
        const w = CELL - 1.6 + sj(s + 2) * 1.2;
        const h = CELL - 1.6 + sj(s + 3) * 1.2;
        const tone = jit(s + 8);
        ctx.beginPath();
        ctx.moveTo(x0, y0 + sj(s + 4) * 0.7);
        ctx.lineTo(x0 + w, y0 + sj(s + 5) * 0.7);
        ctx.lineTo(x0 + w + sj(s + 6) * 0.7, y0 + h);
        ctx.lineTo(x0 + sj(s + 7) * 0.7, y0 + h + sj(s + 9) * 0.7);
        ctx.closePath();
        ctx.fillStyle = tone > 0.72 ? '#5b554d' : (tone > 0.38 ? '#524d46' : '#4a453e');
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(28,25,21,0.55)';
        ctx.stroke();
      }
    }

    // 焦痕：火烧过的黑斑
    for (let i = 0; i < 6; i++) {
      const cx = 40 + jit(i * 7.1) * (W - 80);
      const cy = 40 + jit(i * 7.1 + 1) * (H - 80);
      blobPath(cx, cy, 16 + jit(i * 7.1 + 2) * 22, 11 + jit(i * 7.1 + 3) * 14, i * 11.3, 7, 0.36, ctx);
      ctx.fillStyle = 'rgba(34,28,24,0.20)';
      ctx.fill();
    }

    // 碎石与渣土
    for (let i = 0; i < 260; i++) {
      const x = jit(i * 1.7 + 2) * W;
      const y = jit(i * 2.9 + 8) * H;
      const r = 0.7 + jit(i * 3.7) * 1.2;
      ctx.fillStyle = jit(i * 5.1) > 0.5 ? 'rgba(126,120,108,0.26)' : 'rgba(38,34,29,0.30)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.3);
      ctx.fill();
    }

    // 裂缝
    for (let i = 0; i < 7; i++) {
      const x0 = 20 + jit(i * 9.1) * (W - 100);
      const y0 = 26 + jit(i * 9.1 + 1) * (H - 60);
      ctx.strokeStyle = 'rgba(28,25,21,0.42)';
      ctx.lineWidth = 1.4;
      roughPath(x0, y0, x0 + 24 + jit(i) * 46, y0 + sj(i) * 12, i * 13.7, 2.4, ctx);
      ctx.stroke();
    }
  }

  // 岩滩：灰褐岩石 + 干草（ACT III 独眼巨人岛）
  function drawCliffFloor(ctx) {
    const W = 480, H = 270;
    ctx.fillStyle = '#635e51';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 34; i++) {
      const cx = jit(i * 4.1) * W;
      const cy = jit(i * 4.1 + 1) * H;
      const rx = 26 + jit(i * 4.1 + 2) * 42;
      const ry = 18 + jit(i * 4.1 + 3) * 26;
      blobPath(cx, cy, rx, ry, i * 8.9, 6, 0.2, ctx);
      ctx.fillStyle = i % 3 === 0 ? '#6e695b' : 'rgba(78,73,64,0.55)';
      ctx.fill();
    }

    for (let i = 0; i < 420; i++) {
      const x = jit(i * 1.9 + 4) * W;
      const y = jit(i * 3.1 + 9) * H;
      const r = 0.7 + jit(i * 2.7) * 1.2;
      ctx.fillStyle = jit(i * 6.1) > 0.5 ? 'rgba(140,134,118,0.28)' : 'rgba(52,48,42,0.32)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.3);
      ctx.fill();
    }

    // 干草
    for (let i = 0; i < 16; i++) {
      const gx = 26 + jit(i * 8.9) * (W - 52);
      const gy = 46 + jit(i * 8.9 + 1) * (H - 92);
      ctx.strokeStyle = 'rgba(138,146,96,0.5)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let b = -1; b <= 1; b++) {
        ctx.moveTo(gx, gy);
        ctx.quadraticCurveTo(gx + b * 2.2, gy - 4.4, gx + b * 3.8 + sj(i + b) * 1.1, gy - 7.6);
      }
      ctx.stroke();
    }

    // 碎石
    for (let i = 0; i < 10; i++) {
      const x = 34 + jit(i * 6.7 + 2) * (W - 68);
      const y = 50 + jit(i * 6.7 + 5) * (H - 100);
      const r = 2.2 + jit(i * 6.7 + 9) * 3;
      blobPath(x, y, r, r * 0.7, i * 7.7, 5, 0.24, ctx);
      ctx.fillStyle = jit(i) > 0.5 ? '#7b766a' : '#8a8578';
      ctx.fill();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = 'rgba(38,34,29,0.7)';
      ctx.stroke();
    }
  }

  global.HandArt = {
    P: P,
    jit: jit,
    sj: sj,
    blobPath: blobPath,
    roughPath: roughPath,
    ink: ink,
    innerLight: innerLight,
    shadow: shadow,
    drawHero: drawHero,
    drawSandFloor: drawSandFloor,
    drawMudFloor: drawMudFloor,
    drawRockFloor: drawRockFloor,
    drawCityFloor: drawCityFloor,
    drawCliffFloor: drawCliffFloor
  };
})(window);
