import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  MousePointer,
  Crop,
  MoveUpRight,
  Minus,
  Square,
  Circle,
  PenTool,
  Type,
  Highlighter,
  EyeOff,
  ListOrdered,
  Edit3,
  MessageSquare,
  Eraser,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Hand,
  Sun,
  Moon,
  Copy,
  Download,
  Upload,
  ClipboardPaste,
  Trash2,
  Layers,
  ChevronUp,
  ChevronDown,
  CopyPlus,
  Check,
  X,
  HelpCircle,
  Image as ImageIcon,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Eye,
  Sliders,
  RefreshCw,
  FileImage,
  CornerUpRight,
  AlertCircle,
  CheckCircle2,
  PanelLeftClose,
  PanelRightClose,
  PanelLeftOpen,
  PanelRightOpen,
  FolderOpen,
  Command,
  Laptop,
  MoreVertical
} from 'lucide-react';

// ============================================================================
// CONSTANTS & TOOL DEFINITIONS
// ============================================================================

const TOOLS = [
  { id: 'select', name: 'Select & Move', shortcut: 'V', icon: MousePointer, group: 'core' },
  { id: 'crop', name: 'Crop Image', shortcut: 'C', icon: Crop, group: 'core' },
  { id: 'arrow', name: 'Arrow Tool', shortcut: 'A', icon: MoveUpRight, group: 'draw' },
  { id: 'line', name: 'Line Tool', shortcut: 'L', icon: Minus, group: 'draw' },
  { id: 'rect', name: 'Rectangle', shortcut: 'R', icon: Square, group: 'shapes' },
  { id: 'ellipse', name: 'Ellipse / Circle', shortcut: 'O', icon: Circle, group: 'shapes' },
  { id: 'pen', name: 'Freehand Pen', shortcut: 'P', icon: PenTool, group: 'draw' },
  { id: 'text', name: 'Text Annotation', shortcut: 'T', icon: Type, group: 'text' },
  { id: 'highlight', name: 'Highlight Box', shortcut: 'H', icon: Highlighter, group: 'markup' },
  { id: 'blur', name: 'Blur / Pixelate', shortcut: 'B', icon: EyeOff, group: 'markup' },
  { id: 'step', name: 'Numbered Step', shortcut: 'N', icon: ListOrdered, group: 'markup' },
  { id: 'marker', name: 'Marker Pen', shortcut: 'M', icon: Edit3, group: 'markup' },
  { id: 'callout', name: 'Callout Bubble', shortcut: 'K', icon: MessageSquare, group: 'text' },
  { id: 'eraser', name: 'Eraser / Delete', shortcut: 'E', icon: Eraser, group: 'core' }
];

const COLOR_PRESETS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#FACC15', // Yellow
  '#22C55E', // Green
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#A855F7', // Purple
  '#EC4899', // Pink
  '#111827', // Near Black
  '#FFFFFF'  // White
];

const HIGHLIGHT_PRESETS = [
  { name: 'Yellow', color: '#FACC15' },
  { name: 'Green', color: '#4ADE80' },
  { name: 'Blue', color: '#38BDF8' },
  { name: 'Pink', color: '#F472B6' },
  { name: 'Orange', color: '#FB923C' }
];

const FONT_FAMILIES = [
  { label: 'Inter / Sans', value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { label: 'Monospace', value: '"JetBrains Mono", "Fira Code", Menlo, Consolas, monospace' },
  { label: 'Editorial Serif', value: 'Georgia, Cambria, "Times New Roman", Times, serif' },
  { label: 'Rounded / Marker', value: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif' }
];

const DEFAULT_TOOL_SETTINGS = {
  strokeColor: '#EF4444',
  fillColor: 'transparent',
  strokeWidth: 4,
  opacity: 1,
  fontSize: 22,
  fontFamily: FONT_FAMILIES[0].value,
  fontWeight: 'bold',
  fontStyle: 'normal',
  textAlign: 'left',
  textBg: true,
  textBgColor: '#111827',
  cornerRadius: 8,
  arrowStyle: 'single', // 'single' | 'double' | 'outline'
  arrowCurved: false,
  dashStyle: 'solid', // 'solid' | 'dashed' | 'dotted'
  blurMode: 'pixelate', // 'pixelate' | 'blur'
  blurIntensity: 14,
  stepRadius: 18,
  highlightColor: '#FACC15',
  highlightOpacity: 0.38
};

// ============================================================================
// PROCEDURAL SAMPLE SCREENSHOT GENERATOR
// ============================================================================
// Generates crisp, high-resolution realistic screenshots on an offscreen canvas
// so users can test all annotation tools (Blur, Arrows, Callouts, Crop, etc.)
// immediately with one click.

function generateSampleScreenshot(type = 'dashboard') {
  const canvas = document.createElement('canvas');
  const width = 1280;
  const height = 800;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Helper for rounded rectangles
  const roundRect = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  if (type === 'dashboard') {
    // Background
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, width, height);

    // Left Sidebar
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, 240, height);

    // Brand header in sidebar
    ctx.fillStyle = '#6366F1';
    roundRect(24, 24, 36, 36, 8);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText('PulseMetrics', 72, 48);

    // Sidebar nav items
    const navItems = ['Overview', 'Revenue & MRR', 'Active Customers', 'API Keys & Secrets', 'Billing Settings'];
    navItems.forEach((item, idx) => {
      if (idx === 0) {
        ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
        roundRect(16, 88 + idx * 44, 208, 36, 6);
        ctx.fill();
        ctx.fillStyle = '#818CF8';
      } else {
        ctx.fillStyle = '#94A3B8';
      }
      ctx.font = '500 14px Inter, sans-serif';
      ctx.fillText(item, 32, 111 + idx * 44);
    });

    // Top Header
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(240, 0, width - 240, 68);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(240, 68);
    ctx.lineTo(width, 68);
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillText('Q3 Executive Revenue & API Telemetry', 276, 42);

    // Date pill
    ctx.fillStyle = '#F1F5F9';
    roundRect(1080, 20, 164, 32, 6);
    ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.font = '500 13px Inter, sans-serif';
    ctx.fillText('Oct 1 – Oct 31, 2025', 1098, 41);

    // 3 Metric Cards
    const cards = [
      { label: 'Monthly Recurring Revenue', value: '$148,920.00', delta: '+24.8% vs last month', deltaColor: '#16A34A' },
      { label: 'Avg. Checkout Conversion', value: '4.82%', delta: '-1.4% drop on Safari', deltaColor: '#EF4444' },
      { label: 'Production API Key (Live)', value: 'sk_live_98a7f6c42e109b3d', delta: 'Sensitive credential — blur before sharing', deltaColor: '#D97706' }
    ];

    cards.forEach((c, i) => {
      const cx = 276 + i * 328;
      const cy = 96;
      ctx.fillStyle = '#FFFFFF';
      roundRect(cx, cy, 308, 128, 12);
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = '500 13px Inter, sans-serif';
      ctx.fillText(c.label, cx + 22, cy + 34);

      ctx.fillStyle = '#0F172A';
      ctx.font = i === 2 ? 'bold 18px monospace' : 'bold 28px Inter, sans-serif';
      ctx.fillText(c.value, cx + 22, cy + 74);

      ctx.fillStyle = c.deltaColor;
      ctx.font = '600 12px Inter, sans-serif';
      ctx.fillText(c.delta, cx + 22, cy + 104);
    });

    // Main Revenue Chart Box
    ctx.fillStyle = '#FFFFFF';
    roundRect(276, 248, 636, 310, 12);
    ctx.fill();
    ctx.strokeStyle = '#E2E8F0';
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('Daily Gross Volume & Checkout Spike', 300, 282);

    // Grid lines
    ctx.strokeStyle = '#F1F5F9';
    for (let g = 0; g < 5; g++) {
      const gy = 315 + g * 48;
      ctx.beginPath();
      ctx.moveTo(300, gy);
      ctx.lineTo(884, gy);
      ctx.stroke();
    }

    // Smooth chart line
    const pts = [
      [300, 490], [360, 470], [420, 480], [480, 430], [540, 445],
      [600, 390], [660, 340], [720, 415], [780, 330], [840, 310], [884, 325]
    ];
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Area under curve
    ctx.lineTo(884, 520);
    ctx.lineTo(300, 520);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 300, 0, 520);
    grad.addColorStop(0, 'rgba(99, 102, 241, 0.24)');
    grad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Highlight anomaly dot on chart
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(720, 415, 6, 0, Math.PI * 2);
    ctx.fill();

    // Right Box: Recent Enterprise Signups (with emails for blur testing)
    ctx.fillStyle = '#FFFFFF';
    roundRect(932, 248, 308, 310, 12);
    ctx.fill();
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('Recent Customer Accounts', 954, 282);

    const customers = [
      { name: 'Sarah Jenkins', email: 's.jenkins@acmecorp.io', plan: '$2,400/mo' },
      { name: 'Marcus Vance', email: 'mvance@globex.net', plan: '$1,850/mo' },
      { name: 'Elena Rostova', email: 'elena@starklabs.ai', plan: '$4,200/mo' },
      { name: 'Devon Brooks', email: 'dbrooks@initech.org', plan: '$950/mo' }
    ];
    customers.forEach((cust, idx) => {
      const ry = 312 + idx * 58;
      ctx.fillStyle = '#EEF2FF';
      ctx.beginPath();
      ctx.arc(970, ry + 14, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4F46E5';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(cust.name[0], 966, ry + 18);

      ctx.fillStyle = '#0F172A';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillText(cust.name, 998, ry + 10);

      ctx.fillStyle = '#64748B';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(cust.email, 998, ry + 28);

      ctx.fillStyle = '#0F172A';
      ctx.font = '600 12px monospace';
      ctx.fillText(cust.plan, 1160, ry + 18);
    });

    // Bottom Table Banner
    ctx.fillStyle = '#FFFFFF';
    roundRect(276, 580, 964, 184, 12);
    ctx.fill();
    ctx.strokeStyle = '#E2E8F0';
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText('Deployment & Webhook Status Logs', 300, 614);

    const logs = [
      ['200 OK', 'POST /v1/webhooks/stripe-invoice', '142ms', '10.24.88.192'],
      ['502 ERR', 'POST /v1/checkout/confirm-session', '4,120ms', '10.24.91.044'],
      ['200 OK', 'GET  /v1/analytics/realtime-stream', '38ms', '10.24.88.192']
    ];
    logs.forEach((row, rIdx) => {
      const ly = 648 + rIdx * 36;
      ctx.fillStyle = row[0].includes('502') ? '#FEF2F2' : '#F8FAFC';
      roundRect(300, ly - 18, 916, 28, 6);
      ctx.fill();

      ctx.fillStyle = row[0].includes('502') ? '#DC2626' : '#16A34A';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(row[0], 314, ly);

      ctx.fillStyle = '#334155';
      ctx.font = '13px monospace';
      ctx.fillText(row[1], 400, ly);
      ctx.fillText(row[2], 820, ly);
      ctx.fillText(row[3], 1040, ly);
    });
  } else if (type === 'code') {
    // Dark IDE Code Review Screenshot
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, width, height);

    // Window titlebar
    ctx.fillStyle = '#161B22';
    ctx.fillRect(0, 0, width, 48);
    const dots = ['#FF5F56', '#FFBD2E', '#27C93F'];
    dots.forEach((d, i) => {
      ctx.fillStyle = d;
      ctx.beginPath();
      ctx.arc(24 + i * 22, 24, 6.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#C9D1D9';
    ctx.font = '600 13px monospace';
    ctx.fillText('PR #418: src/services/paymentProcessor.ts — Code Review Diff', 440, 29);

    const codeLines = [
      { num: 41, text: 'export async function processSubscriptionCharge(user: UserProfile, amountCents: number) {', type: 'normal' },
      { num: 42, text: '  const stripeSecret = process.env.STRIPE_SECRET_KEY; // Loaded securely from env', type: 'normal' },
      { num: 43, text: '  if (!user.paymentMethodId) {', type: 'normal' },
      { num: 44, text: '    throw new PaymentError("Missing default payment method for customer");', type: 'normal' },
      { num: 45, text: '  }', type: 'normal' },
      { num: 46, text: '- const fee = amountCents * 0.029;', type: 'del' },
      { num: 47, text: '+ const fee = Math.round(amountCents * 0.029) + 30;', type: 'add' },
      { num: 48, text: '  const netAmount = amountCents - fee;', type: 'normal' },
      { num: 49, text: '  const response = await fetch("https://api.stripe.com/v1/charges", {', type: 'normal' },
      { num: 50, text: '    method: "POST",', type: 'normal' },
      { num: 51, text: '    headers: { Authorization: `Bearer ${stripeSecret}` },', type: 'normal' },
      { num: 52, text: '  });', type: 'normal' },
      { num: 53, text: '  return response.json();', type: 'normal' },
      { num: 54, text: '}', type: 'normal' }
    ];

    codeLines.forEach((line, idx) => {
      const y = 96 + idx * 38;
      if (line.type === 'del') {
        ctx.fillStyle = 'rgba(248, 81, 73, 0.16)';
        ctx.fillRect(0, y - 24, width, 36);
      } else if (line.type === 'add') {
        ctx.fillStyle = 'rgba(46, 160, 67, 0.16)';
        ctx.fillRect(0, y - 24, width, 36);
      } else if (line.type === 'warn') {
        ctx.fillStyle = 'rgba(210, 153, 34, 0.14)';
        ctx.fillRect(0, y - 24, width, 36);
      }

      ctx.fillStyle = '#484F58';
      ctx.font = '15px monospace';
      ctx.fillText(String(line.num), 36, y);

      ctx.fillStyle =
        line.type === 'del' ? '#FFA198' :
        line.type === 'add' ? '#7EE787' :
        line.type === 'warn' ? '#F2CC60' : '#E6EDF3';
      ctx.font = '15px "JetBrains Mono", monospace';
      ctx.fillText(line.text, 96, y);
    });

    // Terminal Panel at bottom
    ctx.fillStyle = '#161B22';
    ctx.fillRect(0, 640, width, 160);
    ctx.fillStyle = '#8B949E';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('TERMINAL — VITEST SUITE RUNNER', 36, 672);

    ctx.fillStyle = '#7EE787';
    ctx.font = '14px monospace';
    ctx.fillText('✓ test/paymentProcessor.spec.ts (4 passed, 1 warning) — 184ms', 36, 710);
    ctx.fillStyle = '#F2CC60';
    ctx.fillText('⚠ SECURITY LINT: Hardcoded secret token detected on line 42', 36, 742);
  } else {
    // Mobile App Checkout Flow Screenshot
    ctx.fillStyle = '#EEF2FF';
    ctx.fillRect(0, 0, width, height);

    // Decorative title
    ctx.fillStyle = '#1E1B4B';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText('Mobile Checkout Flow — V2.4 Design Spec', 80, 56);

    const drawPhone = (px, title, stepBadge) => {
      ctx.fillStyle = '#0F172A';
      roundRect(px, 88, 360, 650, 40);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      roundRect(px + 12, 100, 336, 626, 30);
      ctx.fill();

      // Notch
      ctx.fillStyle = '#0F172A';
      roundRect(px + 120, 108, 120, 22, 11);
      ctx.fill();

      ctx.fillStyle = '#6366F1';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(stepBadge, px + 36, 162);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText(title, px + 36, 190);
    };

    drawPhone(200, 'Order Summary', 'STEP 01');
    // Credit card inside Phone 1
    const cardGrad = ctx.createLinearGradient(232, 220, 520, 380);
    cardGrad.addColorStop(0, '#4F46E5');
    cardGrad.addColorStop(1, '#7C3AED');
    ctx.fillStyle = cardGrad;
    roundRect(232, 215, 296, 170, 16);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 13px Inter, sans-serif';
    ctx.fillText('CORPORATE PLATINUM', 254, 248);
    ctx.font = 'bold 19px monospace';
    ctx.fillText('4532  8910  7741  9024', 254, 305);
    ctx.font = '13px monospace';
    ctx.fillText('ALEXANDER WRIGHT   09/28', 254, 355);

    // Line items in Phone 1
    const items = [
      ['PixelMark Pro License (Annual)', '$144.00'],
      ['Team Cloud Workspace Add-on', '$48.00'],
      ['Estimated Tax (VAT)', '$19.20']
    ];
    items.forEach((it, i) => {
      const iy = 430 + i * 48;
      ctx.fillStyle = '#334155';
      ctx.font = '500 14px Inter, sans-serif';
      ctx.fillText(it[0], 236, iy);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText(it[1], 468, iy);
    });

    // CTA Button in Phone 1
    ctx.fillStyle = '#0F172A';
    roundRect(232, 636, 296, 52, 12);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText('Confirm & Pay $211.20', 302, 668);

    // Phone 2
    drawPhone(720, 'Payment Confirmed', 'STEP 02');
    ctx.fillStyle = '#DCFCE7';
    ctx.beginPath();
    ctx.arc(900, 290, 44, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#16A34A';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('✓', 886, 303);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText('Receipt #PM-89241-X', 810, 376);

    ctx.fillStyle = '#F8FAFC';
    roundRect(752, 410, 296, 170, 12);
    ctx.fill();
    ctx.strokeStyle = '#E2E8F0';
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.font = '13px Inter, sans-serif';
    ctx.fillText('Merchant: PixelMark Studio Inc.', 772, 446);
    ctx.fillText('Auth Code: AUTH_9948102', 772, 480);
    ctx.fillText('Account Email: billing@client.co', 772, 514);
    ctx.fillText('Total Charged: $211.20 USD', 772, 548);

    ctx.fillStyle = '#4F46E5';
    roundRect(752, 636, 296, 52, 12);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText('Download PDF Invoice', 822, 668);
  }

  return canvas.toDataURL('image/png');
}

// ============================================================================
// GEOMETRY & HIT-TESTING HELPERS
// ============================================================================

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;
  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }
  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

function normalizeRect(x, y, w, h) {
  const nx = w < 0 ? x + w : x;
  const ny = h < 0 ? y + h : y;
  const nw = Math.abs(w);
  const nh = Math.abs(h);
  return { x: nx, y: ny, width: nw, height: nh };
}

function getAnnotationBounds(ann) {
  if (!ann) return { x: 0, y: 0, width: 0, height: 0 };
  if (['rect', 'ellipse', 'highlight', 'blur', 'callout'].includes(ann.type)) {
    return normalizeRect(ann.x, ann.y, ann.width, ann.height);
  }
  if (ann.type === 'arrow' || ann.type === 'line') {
    const minX = Math.min(ann.x1, ann.x2, ann.cx ?? ann.x1);
    const minY = Math.min(ann.y1, ann.y2, ann.cy ?? ann.y1);
    const maxX = Math.max(ann.x1, ann.x2, ann.cx ?? ann.x2);
    const maxY = Math.max(ann.y1, ann.y2, ann.cy ?? ann.y2);
    return {
      x: minX - 10,
      y: minY - 10,
      width: Math.max(20, maxX - minX + 20),
      height: Math.max(20, maxY - minY + 20)
    };
  }
  if (ann.type === 'pen' || ann.type === 'marker') {
    if (!ann.points || ann.points.length === 0) return { x: 0, y: 0, width: 20, height: 20 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    ann.points.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    });
    const pad = (ann.strokeWidth || 4) / 2 + 4;
    return {
      x: minX - pad,
      y: minY - pad,
      width: Math.max(16, maxX - minX + pad * 2),
      height: Math.max(16, maxY - minY + pad * 2)
    };
  }
  if (ann.type === 'step') {
    const r = ann.radius || 18;
    const labelWidth = ann.label ? ann.label.length * 9 + 24 : 0;
    return {
      x: ann.x - r,
      y: ann.y - r,
      width: r * 2 + labelWidth,
      height: r * 2
    };
  }
  if (ann.type === 'text') {
    const lines = (ann.text || 'Text').split('\n');
    const fontSize = ann.fontSize || 22;
    const maxChars = Math.max(...lines.map(l => l.length), 4);
    const w = ann.width || Math.max(80, maxChars * fontSize * 0.62 + 24);
    const h = ann.height || Math.max(fontSize * 1.4, lines.length * fontSize * 1.35 + 16);
    return { x: ann.x, y: ann.y, width: w, height: h };
  }
  return { x: ann.x || 0, y: ann.y || 0, width: ann.width || 50, height: ann.height || 50 };
}

function hitTestAnnotation(ann, px, py) {
  if (!ann || ann.visible === false) return false;
  if (ann.type === 'arrow' || ann.type === 'line') {
    const threshold = Math.max(10, (ann.strokeWidth || 4) + 6);
    if (ann.type === 'arrow' && ann.curved && ann.cx !== undefined && ann.cy !== undefined) {
      // Sample points along quadratic curve
      let prevX = ann.x1;
      let prevY = ann.y1;
      for (let t = 0.1; t <= 1; t += 0.1) {
        const inv = 1 - t;
        const qx = inv * inv * ann.x1 + 2 * inv * t * ann.cx + t * t * ann.x2;
        const qy = inv * inv * ann.y1 + 2 * inv * t * ann.cy + t * t * ann.y2;
        if (distanceToSegment(px, py, prevX, prevY, qx, qy) <= threshold) return true;
        prevX = qx;
        prevY = qy;
      }
      return false;
    }
    return distanceToSegment(px, py, ann.x1, ann.y1, ann.x2, ann.y2) <= threshold;
  }
  if (ann.type === 'pen' || ann.type === 'marker') {
    const threshold = Math.max(10, (ann.strokeWidth || 6) + 5);
    const pts = ann.points || [];
    for (let i = 0; i < pts.length - 1; i++) {
      if (distanceToSegment(px, py, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y) <= threshold) {
        return true;
      }
    }
    return false;
  }
  if (ann.type === 'step') {
    const r = (ann.radius || 18) + 4;
    const dx = px - ann.x;
    const dy = py - ann.y;
    if (dx * dx + dy * dy <= r * r) return true;
    const b = getAnnotationBounds(ann);
    return px >= b.x && px <= b.x + b.width && py >= b.y && py <= b.y + b.height;
  }
  if (ann.type === 'callout') {
    const b = getAnnotationBounds(ann);
    const inBox = px >= b.x && px <= b.x + b.width && py >= b.y && py <= b.y + b.height;
    if (inBox) return true;
    if (ann.tailX !== undefined && ann.tailY !== undefined) {
      const cx = b.x + b.width / 2;
      const cy = b.y + b.height / 2;
      if (distanceToSegment(px, py, cx, cy, ann.tailX, ann.tailY) <= 14) return true;
    }
    return false;
  }
  const b = getAnnotationBounds(ann);
  return px >= b.x - 4 && px <= b.x + b.width + 4 && py >= b.y - 4 && py <= b.y + b.height + 4;
}

// ============================================================================
// CORE CANVAS ANNOTATION RENDERER
// ============================================================================
// Renders the cropped base image + all visible annotations onto any 2D canvas
// context (used for both live interactive canvas and clean high-DPI export).

function renderSceneToContext(ctx: any, imageEl: any, crop: any, annotations: any, options: any = {}) {
  const {
    scale = 1,
    padding = 0,
    paddingColor = '#0F172A',
    transparentBg = false
  } = options || {};

  const cropX = crop?.x || 0;
  const cropY = crop?.y || 0;
  const cropW = crop?.width || imageEl.width;
  const cropH = crop?.height || imageEl.height;

  ctx.save();
  ctx.scale(scale, scale);

  // Optional CleanShot-style studio backdrop padding
  if (padding > 0 && !transparentBg) {
    ctx.fillStyle = paddingColor;
    ctx.fillRect(0, 0, cropW + padding * 2, cropH + padding * 2);
    ctx.translate(padding, padding);
  }

  // Draw base cropped screenshot
  ctx.drawImage(
    imageEl,
    cropX,
    cropY,
    cropW,
    cropH,
    0,
    0,
    cropW,
    cropH
  );

  // Helper for rounded rectangle path
  const traceRoundRect = (x, y, w, h, r) => {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  };

  // Render each visible annotation in stacking order
  annotations.forEach(ann => {
    if (!ann || ann.visible === false) return;
    ctx.save();
    ctx.globalAlpha = ann.opacity !== undefined ? ann.opacity : 1;

    // Dash pattern
    if (ann.dashStyle === 'dashed') {
      ctx.setLineDash([(ann.strokeWidth || 4) * 2.5, (ann.strokeWidth || 4) * 1.8]);
    } else if (ann.dashStyle === 'dotted') {
      ctx.setLineDash([ann.strokeWidth || 4, (ann.strokeWidth || 4) * 1.8]);
    } else {
      ctx.setLineDash([]);
    }

    // 1. BLUR / PIXELATE REGION
    if (ann.type === 'blur') {
      const b = normalizeRect(ann.x, ann.y, ann.width, ann.height);
      if (b.width > 2 && b.height > 2) {
        const intensity = Math.max(4, ann.blurIntensity || 14);
        const sx = Math.max(0, Math.min(imageEl.width - 1, cropX + b.x));
        const sy = Math.max(0, Math.min(imageEl.height - 1, cropY + b.y));
        const sw = Math.min(imageEl.width - sx, b.width);
        const sh = Math.min(imageEl.height - sy, b.height);

        if (sw > 1 && sh > 1) {
          if (ann.blurMode === 'blur') {
            // Two-pass downscale/upscale + CSS filter for guaranteed cross-browser smooth Gaussian blur
            const off = document.createElement('canvas');
            const factor = Math.max(2, Math.floor(intensity / 2));
            const smallW = Math.max(2, Math.ceil(sw / factor));
            const smallH = Math.max(2, Math.ceil(sh / factor));
            off.width = smallW;
            off.height = smallH;
            const octx = off.getContext('2d');
            octx.imageSmoothingEnabled = true;
            octx.drawImage(imageEl, sx, sy, sw, sh, 0, 0, smallW, smallH);

            ctx.save();
            ctx.beginPath();
            ctx.rect(b.x, b.y, b.width, b.height);
            ctx.clip();
            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(off, 0, 0, smallW, smallH, b.x, b.y, b.width, b.height);
            ctx.restore();
          } else {
            // Crisp mosaic pixelation
            const off = document.createElement('canvas');
            const cols = Math.max(2, Math.ceil(sw / intensity));
            const rows = Math.max(2, Math.ceil(sh / intensity));
            off.width = cols;
            off.height = rows;
            const octx = off.getContext('2d');
            octx.imageSmoothingEnabled = false;
            octx.drawImage(imageEl, sx, sy, sw, sh, 0, 0, cols, rows);

            ctx.save();
            ctx.beginPath();
            ctx.rect(b.x, b.y, b.width, b.height);
            ctx.clip();
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(off, 0, 0, cols, rows, b.x, b.y, b.width, b.height);
            ctx.restore();
          }
        }
      }
    }

    // 2. RECTANGLE
    else if (ann.type === 'rect') {
      const b = normalizeRect(ann.x, ann.y, ann.width, ann.height);
      const r = ann.cornerRadius || 0;
      traceRoundRect(b.x, b.y, b.width, b.height, r);
      if (ann.fillColor && ann.fillColor !== 'transparent') {
        ctx.fillStyle = ann.fillColor;
        ctx.fill();
      }
      if ((ann.strokeWidth || 0) > 0) {
        ctx.strokeStyle = ann.strokeColor || '#EF4444';
        ctx.lineWidth = ann.strokeWidth || 4;
        ctx.stroke();
      }
    }

    // 3. HIGHLIGHT BOX
    else if (ann.type === 'highlight') {
      const b = normalizeRect(ann.x, ann.y, ann.width, ann.height);
      ctx.globalAlpha = ann.opacity !== undefined ? ann.opacity : 0.38;
      ctx.fillStyle = ann.strokeColor || '#FACC15';
      traceRoundRect(b.x, b.y, b.width, b.height, 4);
      ctx.fill();
    }

    // 4. ELLIPSE / CIRCLE
    else if (ann.type === 'ellipse') {
      const b = normalizeRect(ann.x, ann.y, ann.width, ann.height);
      ctx.beginPath();
      ctx.ellipse(
        b.x + b.width / 2,
        b.y + b.height / 2,
        Math.max(1, b.width / 2),
        Math.max(1, b.height / 2),
        0,
        0,
        Math.PI * 2
      );
      if (ann.fillColor && ann.fillColor !== 'transparent') {
        ctx.fillStyle = ann.fillColor;
        ctx.fill();
      }
      if ((ann.strokeWidth || 0) > 0) {
        ctx.strokeStyle = ann.strokeColor || '#EF4444';
        ctx.lineWidth = ann.strokeWidth || 4;
        ctx.stroke();
      }
    }

    // 5. LINE
    else if (ann.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(ann.x1, ann.y1);
      ctx.lineTo(ann.x2, ann.y2);
      ctx.strokeStyle = ann.strokeColor || '#EF4444';
      ctx.lineWidth = ann.strokeWidth || 4;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // 6. ARROW (Straight or Curved, Single or Double or Outline)
    else if (ann.type === 'arrow') {
      const sw = ann.strokeWidth || 4;
      const headLen = Math.max(14, sw * 3.6);
      const color = ann.strokeColor || '#EF4444';

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = sw;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const isCurved = ann.curved && ann.cx !== undefined && ann.cy !== undefined;

      // Draw shaft
      ctx.beginPath();
      ctx.moveTo(ann.x1, ann.y1);
      if (isCurved) {
        ctx.quadraticCurveTo(ann.cx, ann.cy, ann.x2, ann.y2);
      } else {
        ctx.lineTo(ann.x2, ann.y2);
      }
      ctx.stroke();

      // Helper to draw arrowhead at (tx, ty) with incoming vector from (fx, fy)
      const drawHead = (fx, fy, tx, ty) => {
        const angle = Math.atan2(ty - fy, tx - fx);
        const spread = Math.PI / 6.5;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(
          tx - headLen * Math.cos(angle - spread),
          ty - headLen * Math.sin(angle - spread)
        );
        if (ann.arrowStyle === 'outline') {
          ctx.moveTo(tx, ty);
          ctx.lineTo(
            tx - headLen * Math.cos(angle + spread),
            ty - headLen * Math.sin(angle + spread)
          );
          ctx.stroke();
        } else {
          ctx.lineTo(
            tx - headLen * 0.78 * Math.cos(angle),
            ty - headLen * 0.78 * Math.sin(angle)
          );
          ctx.lineTo(
            tx - headLen * Math.cos(angle + spread),
            ty - headLen * Math.sin(angle + spread)
          );
          ctx.closePath();
          ctx.fill();
        }
      };

      const endFromX = isCurved ? ann.cx : ann.x1;
      const endFromY = isCurved ? ann.cy : ann.y1;
      drawHead(endFromX, endFromY, ann.x2, ann.y2);

      if (ann.arrowStyle === 'double') {
        const startFromX = isCurved ? ann.cx : ann.x2;
        const startFromY = isCurved ? ann.cy : ann.y2;
        drawHead(startFromX, startFromY, ann.x1, ann.y1);
      }
    }

    // 7. FREEHAND PEN & MARKER HIGHLIGHTER
    else if (ann.type === 'pen' || ann.type === 'marker') {
      const pts = ann.points || [];
      if (pts.length > 0) {
        ctx.strokeStyle = ann.strokeColor || '#EF4444';
        ctx.lineWidth = ann.strokeWidth || (ann.type === 'marker' ? 22 : 4);
        ctx.lineCap = ann.type === 'marker' ? 'square' : 'round';
        ctx.lineJoin = 'round';
        if (ann.type === 'marker') {
          ctx.globalAlpha = ann.opacity !== undefined ? ann.opacity : 0.38;
        }
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          const midX = (pts[i - 1].x + pts[i].x) / 2;
          const midY = (pts[i - 1].y + pts[i].y) / 2;
          ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, midX, midY);
        }
        if (pts.length === 1) {
          ctx.lineTo(pts[0].x + 0.5, pts[0].y + 0.5);
        } else {
          ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        }
        ctx.stroke();
      }
    }

    // 8. NUMBERED STEP BADGE
    else if (ann.type === 'step') {
      const r = ann.radius || 18;
      const color = ann.strokeColor || '#EF4444';
      ctx.setLineDash([]);

      // Subtle drop shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;

      // Optional label pill next to step badge
      if (ann.label && ann.label.trim().length > 0) {
        ctx.font = `600 ${Math.round(r * 0.78)}px Inter, sans-serif`;
        const textMetrics = ctx.measureText(ann.label);
        const pillW = r + textMetrics.width + 22;
        const pillH = r * 1.65;
        ctx.fillStyle = '#0F172A';
        traceRoundRect(ann.x, ann.y - pillH / 2, pillW, pillH, pillH / 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(ann.label, ann.x + r + 8, ann.y + 1);
      }

      // Main circle
      ctx.beginPath();
      ctx.arc(ann.x, ann.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
      ctx.restore();

      // Step number text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.round(r * 0.95)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(ann.stepNumber ?? 1), ann.x, ann.y + 1);
    }

    // 9. TEXT ANNOTATION
    else if (ann.type === 'text') {
      const fontSize = ann.fontSize || 22;
      const fontWeight = ann.fontWeight || 'bold';
      const fontStyle = ann.fontStyle || 'normal';
      const fontFamily = ann.fontFamily || FONT_FAMILIES[0].value;
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

      const lines = (ann.text || 'Text').split('\n');
      const lineHeight = fontSize * 1.32;
      const padX = 12;
      const padY = 8;

      let maxLineW = 40;
      lines.forEach(l => {
        const m = ctx.measureText(l).width;
        if (m > maxLineW) maxLineW = m;
      });

      const boxW = Math.max(ann.width || 0, maxLineW + padX * 2);
      const boxH = Math.max(ann.height || 0, lines.length * lineHeight + padY * 2);

      // Update measured dimensions on annotation object for crisp selection bounds
      ann.width = boxW;
      ann.height = boxH;

      ctx.setLineDash([]);
      if (ann.textBg) {
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.18)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = ann.textBgColor || '#111827';
        traceRoundRect(ann.x, ann.y, boxW, boxH, 8);
        ctx.fill();
        ctx.restore();
      }

      ctx.fillStyle = ann.strokeColor || '#FFFFFF';
      ctx.textBaseline = 'top';
      const align = ann.textAlign || 'left';
      ctx.textAlign = align;

      lines.forEach((line, i) => {
        let tx = ann.x + padX;
        if (align === 'center') tx = ann.x + boxW / 2;
        if (align === 'right') tx = ann.x + boxW - padX;
        ctx.fillText(line, tx, ann.y + padY + i * lineHeight);
      });
    }

    // 10. CALLOUT / SPEECH BUBBLE
    else if (ann.type === 'callout') {
      const b = normalizeRect(ann.x, ann.y, ann.width, ann.height);
      const tailX = ann.tailX !== undefined ? ann.tailX : b.x - 36;
      const tailY = ann.tailY !== undefined ? ann.tailY : b.y + b.height + 36;
      const bg = ann.fillColor && ann.fillColor !== 'transparent' ? ann.fillColor : '#111827';
      const borderCol = ann.strokeColor || '#EF4444';
      const sw = ann.strokeWidth || 3;

      ctx.setLineDash([]);
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.22)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;

      // Draw tail triangle from center of callout box to (tailX, tailY)
      const cx = b.x + b.width / 2;
      const cy = b.y + b.height / 2;
      const angle = Math.atan2(tailY - cy, tailX - cx);
      const perp = angle + Math.PI / 2;
      const baseHalf = Math.min(18, Math.min(b.width, b.height) * 0.25);

      ctx.fillStyle = bg;
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = sw;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(perp) * baseHalf, cy + Math.sin(perp) * baseHalf);
      ctx.lineTo(tailX, tailY);
      ctx.lineTo(cx - Math.cos(perp) * baseHalf, cy - Math.sin(perp) * baseHalf);
      ctx.closePath();
      ctx.fill();
      if (sw > 0) ctx.stroke();

      // Draw callout rounded rectangle
      traceRoundRect(b.x, b.y, b.width, b.height, ann.cornerRadius ?? 10);
      ctx.fill();
      if (sw > 0) ctx.stroke();
      ctx.restore();

      // Callout Text inside box
      const fontSize = ann.fontSize || 16;
      const fontFamily = ann.fontFamily || FONT_FAMILIES[0].value;
      ctx.font = `${ann.fontStyle || 'normal'} ${ann.fontWeight || 'bold'} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textBaseline = 'middle';
      ctx.textAlign = ann.textAlign || 'center';

      const lines = (ann.text || 'Callout note').split('\n');
      const lh = fontSize * 1.3;
      const totalH = lines.length * lh;
      const startY = b.y + (b.height - totalH) / 2 + lh / 2;

      lines.forEach((line, idx) => {
        let tx = b.x + b.width / 2;
        if (ann.textAlign === 'left') tx = b.x + 14;
        if (ann.textAlign === 'right') tx = b.x + b.width - 14;
        ctx.fillText(line, tx, startY + idx * lh, Math.max(20, b.width - 20));
      });
    }

    ctx.restore();
  });

  ctx.restore();
}

// ============================================================================
// MAIN PIXELMARK APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // Theme & Layout State (Default to system preference, with persistent localStorage override)
  const [themePreference, setThemePreference] = useState<'system' | 'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'system';
    const saved = localStorage.getItem('pixelmark_theme');
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved as any;
    return 'system';
  });

  const [systemDark, setSystemDark] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const darkMode = themePreference === 'system' ? systemDark : themePreference === 'dark';

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = (pref: 'system' | 'dark' | 'light') => {
    setThemePreference(pref);
    localStorage.setItem('pixelmark_theme', pref);
  };

  // Pre-rendered sample screenshot thumbnails for real UI preview cards
  const [sampleThumbnails, setSampleThumbnails] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    try {
      const dash = generateSampleScreenshot('dashboard');
      const code = generateSampleScreenshot('code');
      const mob = generateSampleScreenshot('mobile');
      setSampleThumbnails({ dashboard: dash, code, mobile: mob });
    } catch (e) {
      console.error('Failed to pre-render sample thumbnails', e);
    }
  }, []);

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });
  const [mobileEmptyMenuOpen, setMobileEmptyMenuOpen] = useState(false);
  const [mobileMoreMenuOpen, setMobileMoreMenuOpen] = useState(false);

  // Document & Base Image State
  const [docName, setDocName] = useState('pixelmark-capture');
  const [isEditingName, setIsEditingName] = useState(false);
  const [imageObj, setImageObj] = useState(null); // HTMLImageElement
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // History State: array of { annotations: [...], crop: { x, y, width, height } }
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Working Annotations & Crop (kept in sync with history during drag operations)
  const [annotations, setAnnotations] = useState([]);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [pendingCrop, setPendingCrop] = useState(null);

  // Tool & Selection State
  const [activeTool, setActiveTool] = useState('select');
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [toolSettings, setToolSettings] = useState(DEFAULT_TOOL_SETTINGS);
  const [clipboardAnnotation, setClipboardAnnotation] = useState(null);

  // Inline Text Editing State
  const [editingTextId, setEditingTextId] = useState(null);
  const [editingTextValue, setEditingTextValue] = useState('');

  // Viewport Zoom & Pan State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanMode, setIsPanMode] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Modals & Toasts
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null); // { title, message, onConfirm }
  const [clipboardFallbackDataUrl, setClipboardFallbackDataUrl] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Export Modal Options
  const [exportFormat, setExportFormat] = useState('image/png');
  const [exportScale, setExportScale] = useState(1);
  const [exportQuality, setExportQuality] = useState(0.92);
  const [exportPadding, setExportPadding] = useState(0);
  const [exportPreviewUrl, setExportPreviewUrl] = useState('');

  // Refs
  const canvasRef = useRef(null);
  const workspaceRef = useRef(null);
  const fileInputRef = useRef<any>(null);
  const interactionRef = useRef<any>({
    mode: null, // 'pan' | 'draw' | 'move' | 'resize' | 'crop-handle' | 'crop-move' | 'crop-new'
    startMouse: { x: 0, y: 0 },
    startPan: { x: 0, y: 0 },
    startImgPt: { x: 0, y: 0 },
    activeId: null,
    handle: null,
    initialAnn: null,
    initialCrop: null,
    hasMoved: false
  });

  // Toast Notification Helper
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3400);
  }, []);

  // Selected Annotation Object
  const selectedAnnotation = useMemo(
    () => annotations.find(a => a.id === selectedId) || null,
    [annotations, selectedId]
  );

  // Commit a new state snapshot into Undo/Redo history
  const pushHistory = useCallback((nextAnnotations, nextCrop) => {
    setHistory(prev => {
      const sliced = prev.slice(0, historyIndex + 1);
      const snapshot = {
        annotations: JSON.parse(JSON.stringify(nextAnnotations)),
        crop: { ...(nextCrop || crop) }
      };
      return [...sliced, snapshot];
    });
    setHistoryIndex(prev => prev + 1);
    setHasUnsavedChanges(true);
  }, [historyIndex, crop]);

  // Fit Image to Workspace Viewport
  const fitToScreen = useCallback((targetW?: number, targetH?: number) => {
    if (!workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    const w = targetW || crop.width || imageNaturalSize.width || 1000;
    const h = targetH || crop.height || imageNaturalSize.height || 700;
    const pad = 72;
    const availW = Math.max(200, rect.width - pad);
    const availH = Math.max(200, rect.height - pad);
    const scale = Math.min(1, availW / w, availH / h);
    const clampedZoom = Math.max(0.15, Math.min(2, Number(scale.toFixed(2))));
    setZoom(clampedZoom);
    setPan({ x: 0, y: 0 });
  }, [crop.width, crop.height, imageNaturalSize.width, imageNaturalSize.height]);

  // Load an image dataURL or ObjectURL into the editor
  const loadImageFromSource = useCallback((src, name = 'pixelmark-capture') => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const initialCrop = { x: 0, y: 0, width: img.width, height: img.height };
      setImageObj(img);
      setImageNaturalSize({ width: img.width, height: img.height });
      setCrop(initialCrop);
      setPendingCrop(null);
      setAnnotations([]);
      setSelectedId(null);
      setEditingTextId(null);
      const cleanName = name.replace(/\.[^/.]+$/, '') || 'pixelmark-capture';
      setDocName(cleanName);
      setHistory([{ annotations: [], crop: initialCrop }]);
      setHistoryIndex(0);
      setHasUnsavedChanges(false);
      setActiveTool('select');
      setTimeout(() => fitToScreen(img.width, img.height), 40);
      addToast(`Loaded "${cleanName}" (${img.width} × ${img.height}px)`, 'success');
    };
    img.onerror = () => {
      addToast('Failed to decode image file. Please try PNG, JPEG, or WebP.', 'error');
    };
    img.src = src;
  }, [fitToScreen, addToast]);

  // Handle File Upload / Drop
  const handleFileImport = useCallback((file) => {
    if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      addToast('Unsupported file format. Please upload PNG, JPG, or WebP.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        loadImageFromSource(e.target.result, file.name);
      }
    };
    reader.onerror = () => addToast('Error reading local file.', 'error');
    reader.readAsDataURL(file);
  }, [loadImageFromSource, addToast]);

  // Undo & Redo Actions
  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const nextIdx = historyIndex - 1;
    const snap = history[nextIdx];
    if (snap) {
      setAnnotations(JSON.parse(JSON.stringify(snap.annotations)));
      setCrop({ ...snap.crop });
      setHistoryIndex(nextIdx);
      setSelectedId(null);
      setEditingTextId(null);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const nextIdx = historyIndex + 1;
    const snap = history[nextIdx];
    if (snap) {
      setAnnotations(JSON.parse(JSON.stringify(snap.annotations)));
      setCrop({ ...snap.crop });
      setHistoryIndex(nextIdx);
      setSelectedId(null);
      setEditingTextId(null);
    }
  }, [history, historyIndex]);

  // Update either selected annotation property OR default tool setting
  const updateProperty = useCallback((key, value) => {
    setToolSettings(prev => ({ ...prev, [key]: value }));
    if (selectedId) {
      setAnnotations(prev => {
        const next = prev.map(ann => {
          if (ann.id !== selectedId) return ann;
          const updated = { ...ann, [key]: value };
          if (key === 'arrowCurved') {
            updated.curved = value;
            if (value && updated.cx === undefined) {
              updated.cx = (updated.x1 + updated.x2) / 2;
              updated.cy = (updated.y1 + updated.y2) / 2 - 45;
            }
          }
          return updated;
        });
        pushHistory(next, crop);
        return next;
      });
    }
  }, [selectedId, crop, pushHistory]);

  // Delete Selected Annotation
  const deleteAnnotationById = useCallback((idToDelete) => {
    const target = idToDelete || selectedId;
    if (!target) return;
    setAnnotations(prev => {
      const next = prev.filter(a => a.id !== target);
      pushHistory(next, crop);
      return next;
    });
    if (selectedId === target) setSelectedId(null);
    if (editingTextId === target) setEditingTextId(null);
    addToast('Annotation removed', 'info');
  }, [selectedId, editingTextId, crop, pushHistory, addToast]);

  // Duplicate Selected Annotation
  const duplicateSelected = useCallback(() => {
    if (!selectedAnnotation) return;
    const clone = JSON.parse(JSON.stringify(selectedAnnotation));
    clone.id = `ann_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const offset = 24;
    if (clone.x !== undefined) clone.x += offset;
    if (clone.y !== undefined) clone.y += offset;
    if (clone.x1 !== undefined) {
      clone.x1 += offset;
      clone.y1 += offset;
      clone.x2 += offset;
      clone.y2 += offset;
      if (clone.cx !== undefined) {
        clone.cx += offset;
        clone.cy += offset;
      }
    }
    if (clone.tailX !== undefined) {
      clone.tailX += offset;
      clone.tailY += offset;
    }
    if (clone.points) {
      clone.points = clone.points.map(p => ({ x: p.x + offset, y: p.y + offset }));
    }
    if (clone.type === 'step') {
      const maxStep = annotations
        .filter(a => a.type === 'step')
        .reduce((m, a) => Math.max(m, a.stepNumber || 0), 0);
      clone.stepNumber = maxStep + 1;
    }
    const next = [...annotations, clone];
    setAnnotations(next);
    setSelectedId(clone.id);
    pushHistory(next, crop);
    addToast('Annotation duplicated', 'success');
  }, [selectedAnnotation, annotations, crop, pushHistory, addToast]);

  // Layer Ordering Controls
  const moveLayer = useCallback((id, direction) => {
    const idx = annotations.findIndex(a => a.id === id);
    if (idx === -1) return;
    const next = [...annotations];
    if (direction === 'forward' && idx < next.length - 1) {
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    } else if (direction === 'backward' && idx > 0) {
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
    } else if (direction === 'front' && idx < next.length - 1) {
      const [item] = next.splice(idx, 1);
      next.push(item);
    } else if (direction === 'back' && idx > 0) {
      const [item] = next.splice(idx, 1);
      next.unshift(item);
    } else {
      return;
    }
    setAnnotations(next);
    pushHistory(next, crop);
  }, [annotations, crop, pushHistory]);

  // Toggle Layer Visibility
  const toggleLayerVisibility = useCallback((id) => {
    const next = annotations.map(a =>
      a.id === id ? { ...a, visible: a.visible === false ? true : false } : a
    );
    setAnnotations(next);
    pushHistory(next, crop);
  }, [annotations, crop, pushHistory]);

  // Tool Switch Handler
  const selectTool = useCallback((toolId) => {
    if (toolId === 'eraser' && selectedId) {
      deleteAnnotationById(selectedId);
      return;
    }
    setEditingTextId(null);
    setActiveTool(toolId);
    if (toolId === 'crop' && imageObj) {
      setPendingCrop({ x: 0, y: 0, width: crop.width, height: crop.height });
      setSelectedId(null);
    } else {
      setPendingCrop(null);
    }
  }, [selectedId, deleteAnnotationById, imageObj, crop.width, crop.height]);

  // Apply Crop Operation (Adjusts annotation coordinates relative to crop offset & pushes to history!)
  const applyCrop = useCallback(() => {
    if (!pendingCrop) return;
    const norm = normalizeRect(pendingCrop.x, pendingCrop.y, pendingCrop.width, pendingCrop.height);
    const clampedX = Math.max(0, Math.min(crop.width - 20, Math.round(norm.x)));
    const clampedY = Math.max(0, Math.min(crop.height - 20, Math.round(norm.y)));
    const clampedW = Math.max(20, Math.min(crop.width - clampedX, Math.round(norm.width)));
    const clampedH = Math.max(20, Math.min(crop.height - clampedY, Math.round(norm.height)));

    const newCrop = {
      x: crop.x + clampedX,
      y: crop.y + clampedY,
      width: clampedW,
      height: clampedH
    };

    // Shift all existing annotations by (-clampedX, -clampedY) so they stay locked to image features
    const shiftedAnnotations = annotations.map(ann => {
      const copy = JSON.parse(JSON.stringify(ann));
      if (copy.x !== undefined) copy.x -= clampedX;
      if (copy.y !== undefined) copy.y -= clampedY;
      if (copy.x1 !== undefined) {
        copy.x1 -= clampedX;
        copy.y1 -= clampedY;
        copy.x2 -= clampedX;
        copy.y2 -= clampedY;
        if (copy.cx !== undefined) {
          copy.cx -= clampedX;
          copy.cy -= clampedY;
        }
      }
      if (copy.tailX !== undefined) {
        copy.tailX -= clampedX;
        copy.tailY -= clampedY;
      }
      if (copy.points) {
        copy.points = copy.points.map(p => ({ x: p.x - clampedX, y: p.y - clampedY }));
      }
      return copy;
    });

    setCrop(newCrop);
    setAnnotations(shiftedAnnotations);
    setPendingCrop(null);
    setActiveTool('select');
    pushHistory(shiftedAnnotations, newCrop);
    addToast(`Cropped to ${clampedW} × ${clampedH}px`, 'success');
  }, [pendingCrop, crop, annotations, pushHistory, addToast]);

  // Programmatic "Paste Image" Button Handler
  const handleProgrammaticPaste = useCallback(async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        addToast('Press Ctrl+V (or Cmd+V) on your keyboard to paste an image directly.', 'info');
        return;
      }
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find(type => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          handleFileImport(new File([blob], 'clipboard-paste.png', { type: imageType }));
          return;
        }
      }
      addToast('No image found in clipboard. Copy a screenshot first or press Ctrl+V.', 'info');
    } catch {
      addToast('Browser blocked button access — press Ctrl+V (or Cmd+V) to paste directly!', 'info');
    }
  }, [handleFileImport, addToast]);

  // Render clean offscreen canvas for Export & Clipboard Copy
  const generateExportCanvas = useCallback((scale = 1, padding = 0) => {
    if (!imageObj) return null;
    const offscreen = document.createElement('canvas');
    const outW = Math.round((crop.width + padding * 2) * scale);
    const outH = Math.round((crop.height + padding * 2) * scale);
    offscreen.width = outW;
    offscreen.height = outH;
    const ctx = offscreen.getContext('2d');
    renderSceneToContext(ctx, imageObj, crop, annotations, {
      scale,
      padding,
      paddingColor: darkMode ? '#0F172A' : '#E2E8F0'
    });
    return offscreen;
  }, [imageObj, crop, annotations, darkMode]);

  // Copy Final Annotated Image to System Clipboard
  const handleCopyImageToClipboard = useCallback(async () => {
    if (!imageObj) return;
    const offscreen = generateExportCanvas(1, 0);
    if (!offscreen) return;

    offscreen.toBlob(async (blob) => {
      if (!blob) {
        addToast('Could not generate image blob.', 'error');
        return;
      }
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new window.ClipboardItem({ 'image/png': blob })
          ]);
          setHasUnsavedChanges(false);
          addToast('Copied annotated screenshot to clipboard!', 'success');
        } else {
          setClipboardFallbackDataUrl(offscreen.toDataURL('image/png'));
        }
      } catch {
        // Fallback modal when iframe permissions restrict direct ClipboardItem write
        setClipboardFallbackDataUrl(offscreen.toDataURL('image/png'));
        addToast('Opened image copy preview (right-click to copy).', 'info');
      }
    }, 'image/png');
  }, [imageObj, generateExportCanvas, addToast]);

  // Download Exported Image
  const handleDownloadExport = useCallback(() => {
    const offscreen = generateExportCanvas(exportScale, exportPadding);
    if (!offscreen) return;
    const ext =
      exportFormat === 'image/jpeg' ? 'jpg' :
      exportFormat === 'image/webp' ? 'webp' : 'png';
    const dataUrl = offscreen.toDataURL(exportFormat, exportQuality);
    const link = document.createElement('a');
    link.download = `${docName || 'pixelmark-annotation'}.${ext}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setHasUnsavedChanges(false);
    setShowExportModal(false);
    addToast(`Downloaded ${docName}.${ext}`, 'success');
  }, [generateExportCanvas, exportScale, exportPadding, exportFormat, exportQuality, docName, addToast]);

  // Update Export Live Preview when Export Modal is open
  useEffect(() => {
    if (!showExportModal || !imageObj) return;
    const offscreen = generateExportCanvas(exportScale, exportPadding);
    if (offscreen) {
      setExportPreviewUrl(offscreen.toDataURL(exportFormat, exportQuality));
    }
  }, [showExportModal, imageObj, generateExportCanvas, exportScale, exportPadding, exportFormat, exportQuality]);

  // Global Paste Event Listener (`Ctrl+V` / `Cmd+V` for images or internal annotations)
  useEffect(() => {
    const onPaste = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith('image/')) {
            const file = items[i].getAsFile();
            if (file) {
              e.preventDefault();
              handleFileImport(file);
              return;
            }
          }
        }
      }
      // If no system image in clipboard, check internal copied annotation
      if (clipboardAnnotation && imageObj) {
        e.preventDefault();
        const clone = JSON.parse(JSON.stringify(clipboardAnnotation));
        clone.id = `ann_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        if (clone.x !== undefined) { clone.x += 24; clone.y += 24; }
        if (clone.x1 !== undefined) {
          clone.x1 += 24; clone.y1 += 24; clone.x2 += 24; clone.y2 += 24;
          if (clone.cx !== undefined) { clone.cx += 24; clone.cy += 24; }
        }
        const next = [...annotations, clone];
        setAnnotations(next);
        setSelectedId(clone.id);
        pushHistory(next, crop);
        addToast('Pasted annotation', 'success');
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [handleFileImport, clipboardAnnotation, imageObj, annotations, crop, pushHistory, addToast]);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const onKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '')) {
        if (e.key === 'Escape') {
          (document.activeElement as HTMLElement | null)?.blur();
          setEditingTextId(null);
        }
        return;
      }

      if (e.code === 'Space' && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
        return;
      }

      const cmdOrCtrl = e.metaKey || e.ctrlKey;

      // Command Palette / Shortcuts (`Ctrl+K` or `Cmd+K`)
      if (cmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowShortcutsModal(s => !s);
        return;
      }

      // Undo / Redo
      if (cmdOrCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
        return;
      }
      if (cmdOrCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Copy Annotation (`Ctrl+C`)
      if (cmdOrCtrl && e.key.toLowerCase() === 'c' && selectedAnnotation) {
        e.preventDefault();
        setClipboardAnnotation(JSON.parse(JSON.stringify(selectedAnnotation)));
        addToast('Copied selected annotation', 'info');
        return;
      }

      // Duplicate (`Ctrl+D`)
      if (cmdOrCtrl && e.key.toLowerCase() === 'd' && selectedAnnotation) {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      // Layer ordering `[` and `]`
      if (e.key === ']' && selectedId) {
        e.preventDefault();
        moveLayer(selectedId, 'forward');
        return;
      }
      if (e.key === '[' && selectedId) {
        e.preventDefault();
        moveLayer(selectedId, 'backward');
        return;
      }

      // Delete / Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        deleteAnnotationById(selectedId);
        return;
      }

      // Escape
      if (e.key === 'Escape') {
        setSelectedId(null);
        setEditingTextId(null);
        if (activeTool === 'crop') {
          setPendingCrop(null);
          setActiveTool('select');
        }
        setShowExportModal(false);
        setShowShortcutsModal(false);
        return;
      }

      // Zoom shortcuts
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        setZoom(z => Math.min(4, Number((z + 0.15).toFixed(2))));
        return;
      }
      if (e.key === '-') {
        e.preventDefault();
        setZoom(z => Math.max(0.2, Number((z - 0.15).toFixed(2))));
        return;
      }
      if (e.key === '0') {
        e.preventDefault();
        fitToScreen();
        return;
      }
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcutsModal(s => !s);
        return;
      }

      // Single-key tool shortcuts
      if (!cmdOrCtrl && !e.altKey) {
        const keyUpper = e.key.toUpperCase();
        const foundTool = TOOLS.find(t => t.shortcut === keyUpper);
        if (foundTool) {
          e.preventDefault();
          selectTool(foundTool.id);
        }
      }
    };

    const onKeyUp = (e) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [
    isSpacePressed,
    handleUndo,
    handleRedo,
    selectedAnnotation,
    selectedId,
    duplicateSelected,
    moveLayer,
    deleteAnnotationById,
    activeTool,
    fitToScreen,
    selectTool,
    addToast
  ]);

  // ============================================================================
  // INTERACTIVE CANVAS RENDERING (Image + Annotations + Selection Handles + Crop)
  // ============================================================================

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = crop.width * dpr;
    canvas.height = crop.height * dpr;
    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Render base cropped image + all visible annotations
    renderSceneToContext(ctx, imageObj, crop, annotations, { scale: 1, padding: 0 });

    // 2. Render Hover Highlight (e.g. Eraser red outline or subtle hover outline)
    if (hoveredId && hoveredId !== selectedId && activeTool !== 'crop') {
      const hov = annotations.find(a => a.id === hoveredId);
      if (hov) {
        const b = getAnnotationBounds(hov);
        ctx.save();
        ctx.strokeStyle = activeTool === 'eraser' ? '#EF4444' : 'rgba(59, 130, 246, 0.55)';
        ctx.lineWidth = 2 / zoom;
        ctx.setLineDash(activeTool === 'eraser' ? [5 / zoom, 4 / zoom] : []);
        ctx.strokeRect(b.x - 4, b.y - 4, b.width + 8, b.height + 8);
        ctx.restore();
      }
    }

    // 3. Render Active Selection Handles
    if (selectedAnnotation && activeTool !== 'crop') {
      ctx.save();
      const handleRadius = Math.max(4.5, 6 / zoom);
      ctx.strokeStyle = '#3B82F6';
      ctx.fillStyle = '#FFFFFF';
      ctx.lineWidth = 1.75 / zoom;

      const drawHandle = (hx, hy, fill = '#FFFFFF') => {
        ctx.beginPath();
        ctx.arc(hx, hy, handleRadius, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.stroke();
      };

      if (selectedAnnotation.type === 'arrow' || selectedAnnotation.type === 'line') {
        // Endpoint handles + midpoint curve handle
        ctx.save();
        ctx.setLineDash([4 / zoom, 4 / zoom]);
        ctx.beginPath();
        ctx.moveTo(selectedAnnotation.x1, selectedAnnotation.y1);
        if (selectedAnnotation.curved && selectedAnnotation.cx !== undefined) {
          ctx.lineTo(selectedAnnotation.cx, selectedAnnotation.cy);
        }
        ctx.lineTo(selectedAnnotation.x2, selectedAnnotation.y2);
        ctx.stroke();
        ctx.restore();

        drawHandle(selectedAnnotation.x1, selectedAnnotation.y1);
        drawHandle(selectedAnnotation.x2, selectedAnnotation.y2);
        if (selectedAnnotation.type === 'arrow' && selectedAnnotation.curved) {
          drawHandle(
            selectedAnnotation.cx ?? (selectedAnnotation.x1 + selectedAnnotation.x2) / 2,
            selectedAnnotation.cy ?? (selectedAnnotation.y1 + selectedAnnotation.y2) / 2,
            '#BFDBFE'
          );
        }
      } else {
        const b = getAnnotationBounds(selectedAnnotation);
        ctx.strokeRect(b.x, b.y, b.width, b.height);

        // 8 Resize Handles for box-based annotations
        if (['rect', 'ellipse', 'highlight', 'blur', 'callout', 'text'].includes(selectedAnnotation.type)) {
          const pts = [
            [b.x, b.y],
            [b.x + b.width / 2, b.y],
            [b.x + b.width, b.y],
            [b.x + b.width, b.y + b.height / 2],
            [b.x + b.width, b.y + b.height],
            [b.x + b.width / 2, b.y + b.height],
            [b.x, b.y + b.height],
            [b.x, b.y + b.height / 2]
          ];
          pts.forEach(([hx, hy]) => drawHandle(hx, hy));
        }

        // Callout tail handle
        if (selectedAnnotation.type === 'callout') {
          drawHandle(selectedAnnotation.tailX, selectedAnnotation.tailY, '#FDE047');
        }
      }
      ctx.restore();
    }

    // 4. Render Interactive Crop Overlay when Crop Tool is active
    if (activeTool === 'crop' && pendingCrop) {
      const cb = normalizeRect(pendingCrop.x, pendingCrop.y, pendingCrop.width, pendingCrop.height);
      ctx.save();
      // Dim outside area
      ctx.fillStyle = 'rgba(15, 23, 42, 0.58)';
      ctx.fillRect(0, 0, crop.width, cb.y);
      ctx.fillRect(0, cb.y + cb.height, crop.width, crop.height - (cb.y + cb.height));
      ctx.fillRect(0, cb.y, cb.x, cb.height);
      ctx.fillRect(cb.x + cb.width, cb.y, crop.width - (cb.x + cb.width), cb.height);

      // Crop frame border
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2 / zoom;
      ctx.strokeRect(cb.x, cb.y, cb.width, cb.height);

      // Rule of thirds grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1 / zoom;
      ctx.beginPath();
      ctx.moveTo(cb.x + cb.width / 3, cb.y);
      ctx.lineTo(cb.x + cb.width / 3, cb.y + cb.height);
      ctx.moveTo(cb.x + (cb.width * 2) / 3, cb.y);
      ctx.lineTo(cb.x + (cb.width * 2) / 3, cb.y + cb.height);
      ctx.moveTo(cb.x, cb.y + cb.height / 3);
      ctx.lineTo(cb.x + cb.width, cb.y + cb.height / 3);
      ctx.moveTo(cb.x, cb.y + (cb.height * 2) / 3);
      ctx.lineTo(cb.x + cb.width, cb.y + (cb.height * 2) / 3);
      ctx.stroke();

      // 8 Crop Handles
      const hSize = Math.max(6, 7 / zoom);
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 2 / zoom;
      const cPts = [
        [cb.x, cb.y],
        [cb.x + cb.width / 2, cb.y],
        [cb.x + cb.width, cb.y],
        [cb.x + cb.width, cb.y + cb.height / 2],
        [cb.x + cb.width, cb.y + cb.height],
        [cb.x + cb.width / 2, cb.y + cb.height],
        [cb.x, cb.y + cb.height],
        [cb.x, cb.y + cb.height / 2]
      ];
      cPts.forEach(([cx, cy]) => {
        ctx.fillRect(cx - hSize, cy - hSize, hSize * 2, hSize * 2);
        ctx.strokeRect(cx - hSize, cy - hSize, hSize * 2, hSize * 2);
      });
      ctx.restore();
    }

    ctx.restore();
  }, [imageObj, crop, annotations, selectedAnnotation, selectedId, hoveredId, activeTool, pendingCrop, zoom]);

  // ============================================================================
  // POINTER / MOUSE / TOUCH CANVAS INTERACTION HANDLERS
  // ============================================================================

  const getImageCoordsFromEvent = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) / zoom;
    const y = (clientY - rect.top) / zoom;
    return { x, y, clientX, clientY };
  }, [zoom]);

  // Check if pointer hits a resize/endpoint handle of the currently selected annotation
  const hitTestSelectionHandle = useCallback((ann, x, y) => {
    if (!ann) return null;
    const tol = Math.max(10, 12 / zoom);
    const near = (hx, hy) => Math.hypot(x - hx, y - hy) <= tol;

    if (ann.type === 'arrow' || ann.type === 'line') {
      if (near(ann.x1, ann.y1)) return 'p1';
      if (near(ann.x2, ann.y2)) return 'p2';
      if (ann.type === 'arrow' && ann.curved) {
        const cx = ann.cx ?? (ann.x1 + ann.x2) / 2;
        const cy = ann.cy ?? (ann.y1 + ann.y2) / 2;
        if (near(cx, cy)) return 'curve';
      }
      return null;
    }

    if (ann.type === 'callout' && near(ann.tailX, ann.tailY)) {
      return 'tail';
    }

    if (['rect', 'ellipse', 'highlight', 'blur', 'callout', 'text'].includes(ann.type)) {
      const b = getAnnotationBounds(ann);
      if (near(b.x, b.y)) return 'nw';
      if (near(b.x + b.width / 2, b.y)) return 'n';
      if (near(b.x + b.width, b.y)) return 'ne';
      if (near(b.x + b.width, b.y + b.height / 2)) return 'e';
      if (near(b.x + b.width, b.y + b.height)) return 'se';
      if (near(b.x + b.width / 2, b.y + b.height)) return 's';
      if (near(b.x, b.y + b.height)) return 'sw';
      if (near(b.x, b.y + b.height / 2)) return 'w';
    }
    return null;
  }, [zoom]);

  const handlePointerDown = (e) => {
    if (!imageObj) return;
    if (editingTextId) {
      setEditingTextId(null);
    }

    const { x, y, clientX, clientY } = getImageCoordsFromEvent(e);

    // 1. Hand / Pan Mode or Middle Mouse or Spacebar hold
    if (isPanMode || isSpacePressed || e.button === 1) {
      e.preventDefault();
      interactionRef.current = {
        mode: 'pan',
        startMouse: { x: clientX, y: clientY },
        startPan: { ...pan }
      };
      return;
    }

    // 2. Crop Tool Interaction
    if (activeTool === 'crop' && pendingCrop) {
      const cb = normalizeRect(pendingCrop.x, pendingCrop.y, pendingCrop.width, pendingCrop.height);
      const tol = Math.max(12, 14 / zoom);
      const near = (hx, hy) => Math.hypot(x - hx, y - hy) <= tol;
      let handle = null;
      if (near(cb.x, cb.y)) handle = 'nw';
      else if (near(cb.x + cb.width / 2, cb.y)) handle = 'n';
      else if (near(cb.x + cb.width, cb.y)) handle = 'ne';
      else if (near(cb.x + cb.width, cb.y + cb.height / 2)) handle = 'e';
      else if (near(cb.x + cb.width, cb.y + cb.height)) handle = 'se';
      else if (near(cb.x + cb.width / 2, cb.y + cb.height)) handle = 's';
      else if (near(cb.x, cb.y + cb.height)) handle = 'sw';
      else if (near(cb.x, cb.y + cb.height / 2)) handle = 'w';

      if (handle) {
        interactionRef.current = {
          mode: 'crop-handle',
          handle,
          startImgPt: { x, y },
          initialCrop: { ...cb }
        };
      } else if (x >= cb.x && x <= cb.x + cb.width && y >= cb.y && y <= cb.y + cb.height) {
        interactionRef.current = {
          mode: 'crop-move',
          startImgPt: { x, y },
          initialCrop: { ...cb }
        };
      } else {
        interactionRef.current = {
          mode: 'crop-new',
          startImgPt: { x, y }
        };
        setPendingCrop({ x, y, width: 1, height: 1 });
      }
      return;
    }

    // 3. Eraser Tool: Click any annotation to delete immediately
    if (activeTool === 'eraser') {
      for (let i = annotations.length - 1; i >= 0; i--) {
        if (hitTestAnnotation(annotations[i], x, y)) {
          deleteAnnotationById(annotations[i].id);
          return;
        }
      }
      return;
    }

    // 4. Check if clicking a handle on the currently selected annotation
    if (selectedAnnotation) {
      const handle = hitTestSelectionHandle(selectedAnnotation, x, y);
      if (handle) {
        interactionRef.current = {
          mode: 'resize',
          handle,
          activeId: selectedAnnotation.id,
          startImgPt: { x, y },
          initialAnn: JSON.parse(JSON.stringify(selectedAnnotation)),
          hasMoved: false
        };
        return;
      }
    }

    // 5. Select Tool (or clicking an existing object when in Select mode)
    if (activeTool === 'select') {
      for (let i = annotations.length - 1; i >= 0; i--) {
        if (hitTestAnnotation(annotations[i], x, y)) {
          const clicked = annotations[i];
          setSelectedId(clicked.id);
          interactionRef.current = {
            mode: 'move',
            activeId: clicked.id,
            startImgPt: { x, y },
            initialAnn: JSON.parse(JSON.stringify(clicked)),
            hasMoved: false
          };
          return;
        }
      }
      setSelectedId(null);
      return;
    }

    // 6. Creating a New Annotation based on Active Tool
    const newId = `ann_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // Numbered Step Tool: Instant single-click placement
    if (activeTool === 'step') {
      const nextStepNum =
        annotations
          .filter(a => a.type === 'step')
          .reduce((max, a) => Math.max(max, a.stepNumber || 0), 0) + 1;
      const newStep = {
        id: newId,
        type: 'step',
        x,
        y,
        stepNumber: nextStepNum,
        radius: toolSettings.stepRadius,
        strokeColor: toolSettings.strokeColor,
        opacity: toolSettings.opacity,
        label: '',
        visible: true
      };
      const next = [...annotations, newStep];
      setAnnotations(next);
      setSelectedId(newId);
      pushHistory(next, crop);
      return;
    }

    // Text Tool: Instant placement + open inline editor
    if (activeTool === 'text') {
      const newText = {
        id: newId,
        type: 'text',
        x,
        y: y - (toolSettings.fontSize || 22) / 2,
        text: 'Double-click to edit',
        fontSize: toolSettings.fontSize,
        fontFamily: toolSettings.fontFamily,
        fontWeight: toolSettings.fontWeight,
        fontStyle: toolSettings.fontStyle,
        textAlign: toolSettings.textAlign,
        strokeColor: toolSettings.strokeColor,
        textBg: toolSettings.textBg,
        textBgColor: toolSettings.textBgColor,
        opacity: toolSettings.opacity,
        visible: true
      };
      const next = [...annotations, newText];
      setAnnotations(next);
      setSelectedId(newId);
      setEditingTextId(newId);
      setEditingTextValue('Double-click to edit');
      setActiveTool('select');
      pushHistory(next, crop);
      return;
    }

    // Callout Bubble Tool: Drag or Click to create callout box with pointer tail
    if (activeTool === 'callout') {
      const newCallout = {
        id: newId,
        type: 'callout',
        x,
        y,
        width: 190,
        height: 76,
        tailX: x - 38,
        tailY: y + 108,
        text: 'Important note here',
        fontSize: 16,
        fontFamily: toolSettings.fontFamily,
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'center',
        strokeColor: toolSettings.strokeColor,
        fillColor: '#111827',
        strokeWidth: 3,
        cornerRadius: 10,
        opacity: toolSettings.opacity,
        visible: true
      };
      const next = [...annotations, newCallout];
      setAnnotations(next);
      setSelectedId(newId);
      setEditingTextId(newId);
      setEditingTextValue(newCallout.text);
      setActiveTool('select');
      pushHistory(next, crop);
      return;
    }

    // Drag-to-draw Tools: Arrow, Line, Rect, Ellipse, Highlight, Blur, Pen, Marker
    let newAnn = null;
    if (activeTool === 'arrow' || activeTool === 'line') {
      newAnn = {
        id: newId,
        type: activeTool,
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        curved: toolSettings.arrowCurved,
        cx: x,
        cy: y,
        arrowStyle: toolSettings.arrowStyle,
        strokeColor: toolSettings.strokeColor,
        strokeWidth: toolSettings.strokeWidth,
        dashStyle: toolSettings.dashStyle,
        opacity: toolSettings.opacity,
        visible: true
      };
    } else if (activeTool === 'rect' || activeTool === 'ellipse') {
      newAnn = {
        id: newId,
        type: activeTool,
        x,
        y,
        width: 1,
        height: 1,
        strokeColor: toolSettings.strokeColor,
        fillColor: toolSettings.fillColor,
        strokeWidth: toolSettings.strokeWidth,
        cornerRadius: toolSettings.cornerRadius,
        dashStyle: toolSettings.dashStyle,
        opacity: toolSettings.opacity,
        visible: true
      };
    } else if (activeTool === 'highlight') {
      newAnn = {
        id: newId,
        type: 'highlight',
        x,
        y,
        width: 1,
        height: 1,
        strokeColor: toolSettings.highlightColor || '#FACC15',
        opacity: toolSettings.highlightOpacity || 0.38,
        visible: true
      };
    } else if (activeTool === 'blur') {
      newAnn = {
        id: newId,
        type: 'blur',
        x,
        y,
        width: 1,
        height: 1,
        blurMode: toolSettings.blurMode,
        blurIntensity: toolSettings.blurIntensity,
        opacity: 1,
        visible: true
      };
    } else if (activeTool === 'pen' || activeTool === 'marker') {
      newAnn = {
        id: newId,
        type: activeTool,
        points: [{ x, y }],
        strokeColor: activeTool === 'marker' ? (toolSettings.highlightColor || '#FACC15') : toolSettings.strokeColor,
        strokeWidth: activeTool === 'marker' ? Math.max(18, toolSettings.strokeWidth * 4) : toolSettings.strokeWidth,
        opacity: activeTool === 'marker' ? 0.38 : toolSettings.opacity,
        visible: true
      };
    }

    if (newAnn) {
      setAnnotations(prev => [...prev, newAnn]);
      setSelectedId(newId);
      interactionRef.current = {
        mode: 'draw',
        activeId: newId,
        startImgPt: { x, y },
        hasMoved: false
      };
    }
  };

  const handlePointerMove = (e) => {
    if (!imageObj) return;
    const { x, y, clientX, clientY } = getImageCoordsFromEvent(e);
    const inter = interactionRef.current;

    // If idle, update hover state
    if (!inter.mode) {
      let foundHover = null;
      for (let i = annotations.length - 1; i >= 0; i--) {
        if (hitTestAnnotation(annotations[i], x, y)) {
          foundHover = annotations[i].id;
          break;
        }
      }
      if (foundHover !== hoveredId) setHoveredId(foundHover);
      return;
    }

    // 1. Panning Viewport
    if (inter.mode === 'pan') {
      const dx = clientX - inter.startMouse.x;
      const dy = clientY - inter.startMouse.y;
      setPan({ x: inter.startPan.x + dx, y: inter.startPan.y + dy });
      return;
    }

    // 2. Crop Interactions
    if (inter.mode === 'crop-new') {
      setPendingCrop({
        x: inter.startImgPt.x,
        y: inter.startImgPt.y,
        width: x - inter.startImgPt.x,
        height: y - inter.startImgPt.y
      });
      return;
    }
    if (inter.mode === 'crop-move' && inter.initialCrop) {
      const dx = x - inter.startImgPt.x;
      const dy = y - inter.startImgPt.y;
      const nx = Math.max(0, Math.min(crop.width - inter.initialCrop.width, inter.initialCrop.x + dx));
      const ny = Math.max(0, Math.min(crop.height - inter.initialCrop.height, inter.initialCrop.y + dy));
      setPendingCrop({ ...inter.initialCrop, x: nx, y: ny });
      return;
    }
    if (inter.mode === 'crop-handle' && inter.initialCrop) {
      const c = { ...inter.initialCrop };
      const dx = x - inter.startImgPt.x;
      const dy = y - inter.startImgPt.y;
      if (inter.handle.includes('e')) c.width += dx;
      if (inter.handle.includes('s')) c.height += dy;
      if (inter.handle.includes('w')) { c.x += dx; c.width -= dx; }
      if (inter.handle.includes('n')) { c.y += dy; c.height -= dy; }
      setPendingCrop(c);
      return;
    }

    // 3. Drawing a New Annotation
    if (inter.mode === 'draw' && inter.activeId) {
      inter.hasMoved = true;
      setAnnotations(prev =>
        prev.map(ann => {
          if (ann.id !== inter.activeId) return ann;
          if (ann.type === 'arrow' || ann.type === 'line') {
            let tx = x;
            let ty = y;
            if (e.shiftKey) {
              const dx = x - ann.x1;
              const dy = y - ann.y1;
              const angle = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4);
              const dist = Math.hypot(dx, dy);
              tx = ann.x1 + Math.cos(angle) * dist;
              ty = ann.y1 + Math.sin(angle) * dist;
            }
            const midX = (ann.x1 + tx) / 2;
            const midY = (ann.y1 + ty) / 2;
            const perpAngle = Math.atan2(ty - ann.y1, tx - ann.x1) - Math.PI / 2;
            const curveOffset = ann.curved ? Math.min(60, Math.hypot(tx - ann.x1, ty - ann.y1) * 0.25) : 0;
            return {
              ...ann,
              x2: tx,
              y2: ty,
              cx: midX + Math.cos(perpAngle) * curveOffset,
              cy: midY + Math.sin(perpAngle) * curveOffset
            };
          }
          if (['rect', 'ellipse', 'highlight', 'blur'].includes(ann.type)) {
            let w = x - inter.startImgPt.x;
            let h = y - inter.startImgPt.y;
            if (e.shiftKey) {
              const side = Math.max(Math.abs(w), Math.abs(h));
              w = w < 0 ? -side : side;
              h = h < 0 ? -side : side;
            }
            return { ...ann, width: w, height: h };
          }
          if (ann.type === 'pen' || ann.type === 'marker') {
            return { ...ann, points: [...ann.points, { x, y }] };
          }
          return ann;
        })
      );
      return;
    }

    // 4. Moving an Existing Annotation
    if (inter.mode === 'move' && inter.activeId && inter.initialAnn) {
      const dx = x - inter.startImgPt.x;
      const dy = y - inter.startImgPt.y;
      if (Math.hypot(dx, dy) > 1) inter.hasMoved = true;
      const init = inter.initialAnn;

      setAnnotations(prev =>
        prev.map(ann => {
          if (ann.id !== inter.activeId) return ann;
          if (ann.type === 'arrow' || ann.type === 'line') {
            return {
              ...ann,
              x1: init.x1 + dx,
              y1: init.y1 + dy,
              x2: init.x2 + dx,
              y2: init.y2 + dy,
              cx: (init.cx ?? (init.x1 + init.x2) / 2) + dx,
              cy: (init.cy ?? (init.y1 + init.y2) / 2) + dy
            };
          }
          if (ann.type === 'pen' || ann.type === 'marker') {
            return {
              ...ann,
              points: init.points.map(p => ({ x: p.x + dx, y: p.y + dy }))
            };
          }
          if (ann.type === 'callout') {
            return {
              ...ann,
              x: init.x + dx,
              y: init.y + dy,
              tailX: init.tailX + dx,
              tailY: init.tailY + dy
            };
          }
          return {
            ...ann,
            x: init.x + dx,
            y: init.y + dy
          };
        })
      );
      return;
    }

    // 5. Resizing or Moving Handle on Existing Annotation
    if (inter.mode === 'resize' && inter.activeId && inter.initialAnn) {
      inter.hasMoved = true;
      const init = inter.initialAnn;
      const dx = x - inter.startImgPt.x;
      const dy = y - inter.startImgPt.y;

      setAnnotations(prev =>
        prev.map(ann => {
          if (ann.id !== inter.activeId) return ann;
          if (ann.type === 'arrow' || ann.type === 'line') {
            if (inter.handle === 'p1') return { ...ann, x1: x, y1: y };
            if (inter.handle === 'p2') return { ...ann, x2: x, y2: y };
            if (inter.handle === 'curve') return { ...ann, cx: x, cy: y, curved: true };
          }
          if (ann.type === 'callout' && inter.handle === 'tail') {
            return { ...ann, tailX: x, tailY: y };
          }
          const b = getAnnotationBounds(init);
          let nx = b.x;
          let ny = b.y;
          let nw = b.width;
          let nh = b.height;
          if (inter.handle.includes('e')) nw = Math.max(16, b.width + dx);
          if (inter.handle.includes('s')) nh = Math.max(16, b.height + dy);
          if (inter.handle.includes('w')) {
            const possibleW = b.width - dx;
            if (possibleW >= 16) {
              nx = b.x + dx;
              nw = possibleW;
            }
          }
          if (inter.handle.includes('n')) {
            const possibleH = b.height - dy;
            if (possibleH >= 16) {
              ny = b.y + dy;
              nh = possibleH;
            }
          }
          return { ...ann, x: nx, y: ny, width: nw, height: nh };
        })
      );
    }
  };

  const handlePointerUp = () => {
    const inter = interactionRef.current;
    if (!inter.mode) return;

    if (inter.mode === 'draw' && inter.activeId) {
      // Normalize negative width/height rectangles and discard tiny accidental clicks
      setAnnotations(prev => {
        const target = prev.find(a => a.id === inter.activeId);
        if (!target) return prev;

        if (['rect', 'ellipse', 'highlight', 'blur'].includes(target.type)) {
          const norm = normalizeRect(target.x, target.y, target.width, target.height);
          if (norm.width < 6 && norm.height < 6) {
            // Default size if user just clicked without dragging
            norm.width = 140;
            norm.height = 80;
          }
          const next = prev.map(a => (a.id === inter.activeId ? { ...a, ...norm } : a));
          pushHistory(next, crop);
          return next;
        }
        if (target.type === 'arrow' || target.type === 'line') {
          if (Math.hypot(target.x2 - target.x1, target.y2 - target.y1) < 8) {
            const next = prev.map(a =>
              a.id === inter.activeId ? { ...a, x2: a.x1 + 120, y2: a.y1 - 60 } : a
            );
            pushHistory(next, crop);
            return next;
          }
        }
        pushHistory(prev, crop);
        return prev;
      });
    } else if ((inter.mode === 'move' || inter.mode === 'resize') && inter.hasMoved) {
      pushHistory(annotations, crop);
    } else if (inter.mode?.startsWith('crop-') && pendingCrop) {
      setPendingCrop(prev => normalizeRect(prev.x, prev.y, prev.width, prev.height));
    }

    interactionRef.current = { mode: null };
  };

  // Double-Click on Canvas to Edit Text, Callout, or Step Label Inline
  const handleCanvasDoubleClick = (e) => {
    if (!imageObj) return;
    const { x, y } = getImageCoordsFromEvent(e);
    for (let i = annotations.length - 1; i >= 0; i--) {
      const ann = annotations[i];
      if (hitTestAnnotation(ann, x, y)) {
        if (ann.type === 'text' || ann.type === 'callout') {
          setSelectedId(ann.id);
          setEditingTextId(ann.id);
          setEditingTextValue(ann.text || '');
          return;
        }
        if (ann.type === 'step') {
          setSelectedId(ann.id);
          setEditingTextId(ann.id);
          setEditingTextValue(ann.label || '');
          return;
        }
      }
    }
  };

  // Wheel Zoom / Trackpad Pan on Workspace
  const handleWheel = (e) => {
    if (!imageObj) return;
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.12 : -0.12;
      setZoom(z => Math.max(0.2, Math.min(4, Number((z + delta).toFixed(2)))));
    } else {
      setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  };

  // Active Value Resolver for Right Properties Inspector
  const activeProp = (key) => {
    if (selectedAnnotation && selectedAnnotation[key] !== undefined) {
      return selectedAnnotation[key];
    }
    return toolSettings[key];
  };

  // Contextual tool type for Right Properties Panel
  const inspectorContextType = selectedAnnotation ? selectedAnnotation.type : activeTool;

  // ============================================================================
  // RENDER UI
  // ============================================================================

  return (
    <div
      className={`h-screen w-screen overflow-hidden flex flex-col select-none transition-colors duration-150 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!isDraggingFile) setIsDraggingFile(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
        setIsDraggingFile(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingFile(false);
        const file = e.dataTransfer?.files?.[0];
        if (file) handleFileImport(file);
      }}
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileImport(file);
          e.target.value = '';
        }}
      />

      {/* Global Drag & Drop Overlay */}
      {isDraggingFile && (
        <div className="fixed inset-0 z-50 bg-indigo-600/20 backdrop-blur-sm border-4 border-dashed border-indigo-500 flex items-center justify-center pointer-events-none">
          <div className={`px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-4 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
            <Upload className="w-8 h-8 text-indigo-500 animate-bounce" />
            <div>
              <p className="text-lg font-bold">Drop screenshot to open in PixelMark</p>
              <p className="text-sm text-slate-400">Supports PNG, JPEG, and WebP in full resolution</p>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          A. TOP NAVIGATION BAR
         ==================================================================== */}
      <header
        className={`h-14 px-3 lg:px-4 border-b flex items-center justify-between gap-2 shrink-0 z-30 ${
          darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Left: Brand + Document Title + Save Status */}
        <div className="flex items-center gap-2.5 min-w-0">
          {imageObj ? (
            <button
              onClick={() => setLeftSidebarOpen(o => !o)}
              title="Toggle Left Toolbar"
              className={`p-1.5 rounded-lg lg:hidden ${
                darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {leftSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
          ) : (
            <button
              onClick={() => setMobileEmptyMenuOpen(o => !o)}
              title="Toggle Navigation Menu"
              className={`p-1.5 rounded-lg md:hidden ${
                darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {mobileEmptyMenuOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
          )}

          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-sm">PixelMark</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                Studio
              </span>
            </div>
          </div>

          <div className={`h-4 w-px mx-1 hidden sm:block ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* Document Name or 'New annotation' */}
          {imageObj ? (
            <div className="hidden md:flex items-center gap-2 min-w-0">
              {isEditingName ? (
                <input
                  type="text"
                  value={docName}
                  autoFocus
                  onChange={(e) => setDocName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEditingName(false);
                  }}
                  className={`px-2 py-1 text-xs font-medium rounded border outline-none w-36 sm:w-44 ${
                    darkMode
                      ? 'bg-slate-800 border-indigo-500 text-white'
                      : 'bg-slate-50 border-indigo-500 text-slate-900'
                  }`}
                />
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  title="Click to rename file"
                  className={`px-2 py-1 rounded text-xs font-medium truncate max-w-[130px] sm:max-w-[180px] transition ${
                    darkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {docName}.png
                </button>
              )}

              {/* Status Badge */}
              <span
                className={`hidden md:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  hasUnsavedChanges
                    ? (darkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700')
                    : (darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600')
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${hasUnsavedChanges ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <span>{hasUnsavedChanges ? 'Unsaved' : `${imageNaturalSize.width} × ${imageNaturalSize.height}`}</span>
              </span>
            </div>
          ) : (
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 hidden sm:inline">
              New annotation
            </span>
          )}
        </div>

        {/* Center: Undo / Redo + Zoom & Pan Controls */}
        {imageObj && (
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Undo / Redo */}
            <div
              className={`flex items-center p-0.5 rounded-lg border ${
                darkMode ? 'bg-slate-800/70 border-slate-700/80' : 'bg-slate-100/80 border-slate-200'
              }`}
            >
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                title="Undo (Ctrl+Z)"
                className={`p-1.5 rounded-md transition ${
                  historyIndex <= 0
                    ? 'opacity-35 cursor-not-allowed'
                    : darkMode
                    ? 'hover:bg-slate-700 text-slate-200'
                    : 'hover:bg-white text-slate-700 shadow-xs'
                }`}
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                title="Redo (Ctrl+Y)"
                className={`p-1.5 rounded-md transition ${
                  historyIndex >= history.length - 1
                    ? 'opacity-35 cursor-not-allowed'
                    : darkMode
                    ? 'hover:bg-slate-700 text-slate-200'
                    : 'hover:bg-white text-slate-700 shadow-xs'
                }`}
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom & Pan Bar */}
            <div
              className={`hidden sm:flex items-center p-0.5 rounded-lg border ${
                darkMode ? 'bg-slate-800/70 border-slate-700/80' : 'bg-slate-100/80 border-slate-200'
              }`}
            >
              <button
                onClick={() => setZoom(z => Math.max(0.2, Number((z - 0.15).toFixed(2))))}
                title="Zoom Out (-)"
                className={`p-1.5 rounded-md transition ${
                  darkMode ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-white text-slate-700'
                }`}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                title="Reset Zoom to 100%"
                className="px-2 text-xs font-mono font-semibold min-w-[52px] text-center"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={() => setZoom(z => Math.min(4, Number((z + 0.15).toFixed(2))))}
                title="Zoom In (+)"
                className={`p-1.5 rounded-md transition ${
                  darkMode ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-white text-slate-700'
                }`}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className={`h-3.5 w-px mx-0.5 ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />
              <button
                onClick={() => fitToScreen()}
                title="Fit to Screen (0)"
                className={`p-1.5 rounded-md transition ${
                  darkMode ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-white text-slate-700'
                }`}
              >
                <Maximize className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPanMode(p => !p)}
                title="Hand / Pan Tool (Hold Spacebar)"
                className={`p-1.5 rounded-md transition ${
                  isPanMode || isSpacePressed
                    ? 'bg-indigo-600 text-white'
                    : darkMode
                    ? 'hover:bg-slate-700 text-slate-200'
                    : 'hover:bg-white text-slate-700'
                }`}
              >
                <Hand className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Right Controls: Responsive Mobile Streamlined + Full Desktop */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* ==========================================================
              1. MOBILE CONTROLS (Screen < 640px)
             ========================================================== */}
          {imageObj ? (
            <div className="flex sm:hidden items-center gap-1.5">
              {/* Properties / Inspector Toggle (ALWAYS VISIBLE ON MOBILE) */}
              <button
                onClick={() => setRightSidebarOpen(o => !o)}
                title={rightSidebarOpen ? 'Close Properties Panel' : 'Open Properties Panel'}
                className={`p-1.5 rounded-lg flex items-center gap-1 transition ${
                  rightSidebarOpen
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30'
                    : darkMode
                    ? 'bg-slate-800 text-indigo-400 border border-slate-700 hover:bg-slate-750'
                    : 'bg-indigo-50/80 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 shadow-xs'
                }`}
              >
                <Sliders className="w-4 h-4" />
              </button>

              {/* Mobile Export Button */}
              <button
                onClick={() => setShowExportModal(true)}
                title="Export Image"
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 shadow-sm shadow-indigo-500/20 transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Export</span>
              </button>

              {/* Mobile 3-Dots Overflow Menu Trigger */}
              <div className="relative">
                <button
                  onClick={() => setMobileMoreMenuOpen(o => !o)}
                  title="More Options"
                  className={`p-1.5 rounded-lg border transition ${
                    mobileMoreMenuOpen
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : darkMode
                      ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Mobile Overflow Dropdown Menu */}
                {mobileMoreMenuOpen && (
                  <>
                    <div
                      onClick={() => setMobileMoreMenuOpen(false)}
                      className="fixed inset-0 z-40 bg-black/25"
                    />
                    <div
                      className={`absolute right-0 top-full mt-2 w-72 rounded-2xl border p-3 shadow-2xl z-50 transition-all ${
                        darkMode
                          ? 'bg-slate-900 border-slate-800 text-white shadow-black/70'
                          : 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-800">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Options
                        </span>
                        <button
                          onClick={() => setMobileMoreMenuOpen(false)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Theme Selector */}
                      <div className="mb-3">
                        <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center justify-between">
                          <span>Theme</span>
                          <span className="text-[10px] capitalize text-indigo-400 font-semibold">{themePreference}</span>
                        </div>
                        <div
                          className={`grid grid-cols-3 gap-1 p-1 rounded-xl border ${
                            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
                          }`}
                        >
                          <button
                            onClick={() => toggleTheme('light')}
                            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition ${
                              themePreference === 'light'
                                ? 'bg-white text-amber-500 shadow-xs'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <Sun className="w-3.5 h-3.5" />
                            <span>Light</span>
                          </button>
                          <button
                            onClick={() => toggleTheme('system')}
                            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition ${
                              themePreference === 'system'
                                ? (darkMode ? 'bg-slate-900 text-indigo-400 shadow-xs' : 'bg-white text-indigo-600 shadow-xs')
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <Laptop className="w-3.5 h-3.5" />
                            <span>Auto</span>
                          </button>
                          <button
                            onClick={() => toggleTheme('dark')}
                            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition ${
                              themePreference === 'dark'
                                ? 'bg-slate-900 text-indigo-400 shadow-xs'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <Moon className="w-3.5 h-3.5" />
                            <span>Dark</span>
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setMobileMoreMenuOpen(false);
                            handleCopyImageToClipboard();
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                            darkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Copy className="w-4 h-4 text-indigo-500" />
                          <span>Copy Image to Clipboard</span>
                        </button>

                        <button
                          onClick={() => {
                            setMobileMoreMenuOpen(false);
                            if (annotations.length > 0 && hasUnsavedChanges) {
                              setConfirmModal({
                                title: 'Start New Screenshot Session?',
                                message: 'You have unsaved annotations on the current image. Are you sure you want to replace it?',
                                onConfirm: () => {
                                  setImageObj(null);
                                  setAnnotations([]);
                                  setConfirmModal(null);
                                }
                              });
                            } else {
                              setImageObj(null);
                            }
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                            darkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <RefreshCw className="w-4 h-4 text-indigo-500" />
                          <span>New / Replace Image</span>
                        </button>

                        <button
                          onClick={() => {
                            setMobileMoreMenuOpen(false);
                            setShowShortcutsModal(true);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                            darkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <HelpCircle className="w-4 h-4 text-indigo-500" />
                          <span>Help & Shortcuts</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Empty State Mobile Controls */
            <div className="flex sm:hidden items-center gap-1.5">
              {/* Segmented Theme Switcher */}
              <div
                className={`flex items-center p-0.5 rounded-full border transition ${
                  darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <button
                  onClick={() => toggleTheme('light')}
                  title="Light theme"
                  className={`p-1.5 rounded-full transition ${
                    themePreference === 'light'
                      ? 'bg-white text-amber-500 shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => toggleTheme('system')}
                  title={`System default (${systemDark ? 'Dark' : 'Light'})`}
                  className={`p-1.5 rounded-full transition ${
                    themePreference === 'system'
                      ? (darkMode ? 'bg-slate-900 text-indigo-400 shadow-xs' : 'bg-white text-indigo-600 shadow-xs')
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => toggleTheme('dark')}
                  title="Dark theme"
                  className={`p-1.5 rounded-full transition ${
                    themePreference === 'dark'
                      ? 'bg-slate-900 text-indigo-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setShowShortcutsModal(true)}
                title="Help & Shortcuts (?)"
                className={`p-1.5 rounded-lg border transition ${
                  darkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ==========================================================
              2. DESKTOP / TABLET CONTROLS (Screen >= 640px)
             ========================================================== */}
          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
            {imageObj && (
              <button
                onClick={() => {
                  if (annotations.length > 0 && hasUnsavedChanges) {
                    setConfirmModal({
                      title: 'Start New Screenshot Session?',
                      message: 'You have unsaved annotations on the current image. Are you sure you want to replace it?',
                      onConfirm: () => {
                        setImageObj(null);
                        setAnnotations([]);
                        setConfirmModal(null);
                      }
                    });
                  } else {
                    setImageObj(null);
                  }
                }}
                title="Import or Replace Screenshot"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                  darkMode
                    ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">New Image</span>
              </button>
            )}

            {/* Help Button */}
            <button
              onClick={() => setShowShortcutsModal(true)}
              title="Help & Shortcuts (?)"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                darkMode
                  ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Help</span>
            </button>

            {/* Shortcuts Command Badge */}
            <button
              onClick={() => setShowShortcutsModal(true)}
              title="Shortcuts reference (⌘K / Ctrl+K)"
              className={`px-2 py-1 rounded-md text-[11px] font-mono border flex items-center gap-1 transition ${
                darkMode
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              <Command className="w-3 h-3" />
              <span>K</span>
            </button>

            {/* Segmented Theme Switcher: Sun (Light), Laptop (System), Moon (Dark) */}
            <div
              className={`flex items-center p-0.5 rounded-full border transition ${
                darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                onClick={() => toggleTheme('light')}
                title="Light theme"
                className={`p-1.5 rounded-full transition ${
                  themePreference === 'light'
                    ? 'bg-white text-amber-500 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleTheme('system')}
                title={`System default (${systemDark ? 'Dark' : 'Light'})`}
                className={`p-1.5 rounded-full transition ${
                  themePreference === 'system'
                    ? (darkMode ? 'bg-slate-900 text-indigo-400 shadow-xs' : 'bg-white text-indigo-600 shadow-xs')
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleTheme('dark')}
                title="Dark theme"
                className={`p-1.5 rounded-full transition ${
                  themePreference === 'dark'
                    ? 'bg-slate-900 text-indigo-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {imageObj && (
              <>
                {/* One-Click Copy Image to Clipboard */}
                <button
                  onClick={handleCopyImageToClipboard}
                  title="Copy annotated image to clipboard (PNG)"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition shadow-xs ${
                    darkMode
                      ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-white'
                      : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden md:inline">Copy Image</span>
                </button>

                {/* Export / Download Modal Trigger */}
                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>

                {/* Properties Toggle on Tablet (< 1024px) */}
                <button
                  onClick={() => setRightSidebarOpen(o => !o)}
                  title="Toggle Properties Panel"
                  className={`p-1.5 rounded-lg lg:hidden transition ${
                    rightSidebarOpen
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : (darkMode ? 'hover:bg-slate-800 text-slate-300 border border-slate-700' : 'hover:bg-slate-100 text-slate-600 border border-slate-200')
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ====================================================================
          MAIN WORKSPACE BODY (Empty State OR 3-Column Editor)
         ==================================================================== */}
      {!imageObj ? (
        /* ==================================================================
           EMPTY STATE: STUDIO NAVIGATION + HERO DROPZONE + SAMPLE CARDS
           ================================================================== */
        <div className="flex-1 flex overflow-hidden relative">
          {/* Mobile backdrop for left navigation drawer */}
          {mobileEmptyMenuOpen && (
            <div
              onClick={() => setMobileEmptyMenuOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
            />
          )}

          {/* Left Navigation Sidebar */}
          <aside
            className={`${
              mobileEmptyMenuOpen
                ? 'fixed inset-y-0 left-0 z-50 w-64 shadow-2xl translate-x-0'
                : 'hidden md:flex w-48 lg:w-56 shrink-0'
            } border-r flex flex-col justify-between p-3.5 overflow-y-auto select-none transition-all duration-200 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
            }`}
          >
            <div className="space-y-4">
              {/* Mobile Drawer Header */}
              <div className="flex items-center justify-between md:hidden pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</span>
                <button
                  onClick={() => setMobileEmptyMenuOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Actions: New & Open */}
              <div className="space-y-1">
                <button
                  onClick={() => setMobileEmptyMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    darkMode
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>New</span>
                </button>
                <button
                  onClick={() => {
                    setMobileEmptyMenuOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    darkMode
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FolderOpen className="w-4 h-4 text-slate-400" />
                  <span>Open</span>
                </button>
              </div>

              <div className={`h-px w-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200/80'}`} />

              {/* Tools Quick Preview Palette */}
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider px-3 mb-2 text-slate-400">
                  Tools
                </p>
                <div className="space-y-0.5">
                  {TOOLS.slice(0, 9).map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveTool(t.id);
                          setMobileEmptyMenuOpen(false);
                          addToast(`Selected ${t.name}. Drop or open an image to start!`, 'info');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition ${
                          activeTool === t.id
                            ? (darkMode ? 'bg-slate-800 text-indigo-400 font-semibold' : 'bg-slate-100 text-indigo-600 font-semibold')
                            : (darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80')
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{t.name.split(' ')[0]}</span>
                        </div>
                        <kbd className="text-[10px] font-mono text-slate-400 opacity-60">
                          {t.shortcut}
                        </kbd>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Privacy & Author Card at bottom of sidebar */}
            <div
              className={`p-3 rounded-xl border text-[11px] space-y-1.5 ${
                darkMode ? 'bg-slate-950/60 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200/80 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>PixelMark Studio</span>
              </div>
              <p className="leading-relaxed text-[10px] text-slate-400">
                100% in-browser canvas. Zero server uploads.
              </p>
              <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800 text-[10px] flex items-center justify-between">
                <span>By <strong className="text-indigo-400 font-medium">Satyam Prajapati</strong></span>
                <span className="text-slate-400 font-mono">v1.0</span>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto flex flex-col justify-between">
            <div className="max-w-5xl w-full mx-auto p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
              {/* Header Title & Subtitle */}
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  New annotation
                </h1>
                <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Bring in a screenshot to start marking it up.
                </p>
              </div>

              {/* Big Clean Dropzone Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`group cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-10 md:p-12 text-center transition-all duration-200 ${
                  darkMode
                    ? 'bg-slate-900/40 border-slate-700/80 hover:border-indigo-500 hover:bg-slate-900/70'
                    : 'bg-white border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/20 shadow-xs'
                }`}
              >
                {/* Upload Icon in Rounded Square */}
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
                  <Upload className="w-6 h-6" />
                </div>

                <h2 className={`text-xl font-bold tracking-tight mb-1.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Drop an image here
                </h2>
                <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Paste with{' '}
                  <kbd
                    className={`px-2 py-0.5 text-xs rounded-md border font-mono font-semibold ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    Ctrl + V
                  </kbd>{' '}
                  or choose a file from your device.
                </p>

                {/* Buttons Row - Full width stacked on mobile, row on sm+ */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 mb-6 max-w-sm sm:max-w-none mx-auto" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                  >
                    <FolderOpen className="w-4 h-4" />
                    Choose image
                  </button>
                  <button
                    onClick={handleProgrammaticPaste}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border flex items-center justify-center gap-2 transition active:scale-95 ${
                      darkMode
                        ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-xs'
                    }`}
                  >
                    <ClipboardPaste className="w-4 h-4 text-indigo-500" />
                    Paste from clipboard
                  </button>
                </div>

                {/* Subtext and Privacy Assurance */}
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">
                    Supports PNG, JPG, JPEG, WebP • Max 20 MB • High resolution
                  </p>
                  <p className="text-xs text-slate-400/90 flex items-center justify-center gap-1.5">
                    <span>🔒</span> Images stay on your device. We don't upload or store your files.
                  </p>
                </div>
              </div>

              {/* Start With a Sample Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      Start with a sample
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Try one of these sample images to explore the annotation tools.
                    </p>
                  </div>
                  <span
                    onClick={() => {
                      const url = sampleThumbnails['dashboard'] || generateSampleScreenshot('dashboard');
                      loadImageFromSource(url, 'sample-dashboard');
                    }}
                    className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 cursor-pointer hidden sm:inline-flex items-center gap-1"
                  >
                    Explore presets →
                  </span>
                </div>

                {/* 3 Interactive Cards - 1 col on mobile, 2 col on tablet, 3 col on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {[
                    {
                      id: 'dashboard',
                      title: 'Product dashboard',
                      badge: '1280 × 800',
                      desc: 'Charts, KPIs & live API telemetry diff view'
                    },
                    {
                      id: 'code',
                      title: 'Code review',
                      badge: '1280 × 800',
                      desc: 'Dark IDE diff with security lint & terminal'
                    },
                    {
                      id: 'mobile',
                      title: 'Mobile checkout',
                      badge: '1280 × 800',
                      desc: 'Dual phone mockups & payment receipt'
                    }
                  ].map((sample) => (
                    <div
                      key={sample.id}
                      onClick={() => {
                        const url = sampleThumbnails[sample.id] || generateSampleScreenshot(sample.id);
                        loadImageFromSource(url, `sample-${sample.id}`);
                      }}
                      className={`group cursor-pointer rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
                        darkMode
                          ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/80 hover:bg-slate-850 hover:shadow-xl hover:shadow-indigo-500/5'
                          : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5'
                      }`}
                    >
                      {/* Visual Thumbnail */}
                      <div
                        className={`h-36 sm:h-40 w-full overflow-hidden relative border-b ${
                          darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-100'
                        }`}
                      >
                        {sampleThumbnails[sample.id] ? (
                          <img
                            src={sampleThumbnails[sample.id]}
                            alt={sample.title}
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <FileImage className="w-8 h-8 opacity-40 animate-pulse" />
                          </div>
                        )}
                      </div>

                      {/* Card Info & Action */}
                      <div className="p-4 flex items-center justify-between gap-2">
                        <div>
                          <h3
                            className={`text-sm font-semibold transition group-hover:text-indigo-500 ${
                              darkMode ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {sample.title}
                          </h3>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            {sample.badge}
                          </p>
                        </div>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            darkMode
                              ? 'bg-slate-800 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white'
                          }`}
                        >
                          <CornerUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Status Tip Bar */}
            <footer
              className={`h-auto sm:h-11 py-2 sm:py-0 px-4 sm:px-6 border-t flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 text-xs shrink-0 select-none ${
                darkMode ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2 text-center sm:text-left">
                <span>⌨</span>
                <span className="hidden sm:inline">
                  Tip: Press{' '}
                  <kbd className="px-1.5 py-0.5 rounded border text-[11px] font-mono">
                    Ctrl + V
                  </kbd>{' '}
                  anywhere to paste an image from your clipboard.
                </span>
                <span className="sm:hidden text-[11px]">
                  Tip: Tap "Choose image" or drop any photo to annotate
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-slate-400 text-xs">
                <span>Built with ❤️ by <strong className="text-slate-200 font-medium">Satyam Prajapati</strong></span>
              </div>
            </footer>
          </main>
        </div>
      ) : (
        /* ==================================================================
           MAIN 3-COLUMN ANNOTATION EDITOR WORKSPACE
           ================================================================== */
        <div className="flex-1 flex overflow-hidden relative">
          {/* ================================================================
              B. LEFT VERTICAL TOOLBAR (14 Tools with Shortcuts)
             ================================================================ */}
          <aside
            className={`${
              leftSidebarOpen ? 'w-12 sm:w-16' : 'w-0 overflow-hidden'
            } transition-all duration-150 border-r flex flex-col items-center py-2 sm:py-2.5 gap-0.5 sm:gap-1 shrink-0 z-20 overflow-y-auto ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {TOOLS.map((tool, index) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              const showDivider = index === 2 || index === 6 || index === 12;
              return (
                <React.Fragment key={tool.id}>
                  <button
                    onClick={() => selectTool(tool.id)}
                    title={`${tool.name} (${tool.shortcut})`}
                    className={`relative group w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition active:scale-95 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                        : darkMode
                        ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span
                      className={`hidden sm:inline absolute bottom-0.5 right-1 text-[9px] font-mono leading-none ${
                        isActive ? 'text-indigo-200' : 'text-slate-400 opacity-75'
                      }`}
                    >
                      {tool.shortcut}
                    </span>
                  </button>
                  {showDivider && (
                    <div className={`w-6 sm:w-7 h-px my-0.5 sm:my-1 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </aside>

          {/* ================================================================
              C. CENTRAL INTERACTIVE CANVAS WORKSPACE
             ================================================================ */}
          <main
            ref={workspaceRef}
            onWheel={handleWheel}
            onMouseDown={(e) => {
              // Clicking on the empty background area outside the canvas clears active selection
              if (e.target === workspaceRef.current) {
                setSelectedId(null);
                setEditingTextId(null);
              }
            }}
            style={{
              backgroundImage: darkMode
                ? 'radial-gradient(#334155 1px, transparent 1px)'
                : 'radial-gradient(#CBD5E1 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
            className={`flex-1 relative overflow-hidden flex items-center justify-center ${
              isPanMode || isSpacePressed
                ? 'cursor-grab active:cursor-grabbing'
                : activeTool === 'eraser'
                ? 'cursor-pointer'
                : activeTool === 'select'
                ? 'cursor-default'
                : 'cursor-crosshair'
            }`}
          >
            {/* Floating Crop Confirmation Bar when Crop Tool is active */}
            {activeTool === 'crop' && pendingCrop && (
              <div
                className={`absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl border shadow-xl flex items-center gap-3 ${
                  darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-medium">
                  <Crop className="w-4 h-4 text-indigo-500" />
                  <span>Crop Region:</span>
                  <span className="font-mono font-bold text-indigo-500">
                    {Math.round(Math.abs(pendingCrop.width))} × {Math.round(Math.abs(pendingCrop.height))} px
                  </span>
                </div>
                <div className={`h-4 w-px ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                <button
                  onClick={applyCrop}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  Apply Crop
                </button>
                <button
                  onClick={() => {
                    setPendingCrop(null);
                    setActiveTool('select');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Transformed Canvas Wrapper */}
            <div
              style={{
                width: crop.width * zoom,
                height: crop.height * zoom,
                transform: `translate(${pan.x}px, ${pan.y}px)`
              }}
              className="relative shadow-2xl ring-1 ring-black/15 transition-shadow"
            >
              {/* Subtle checkerboard behind transparent areas */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, rgba(148,163,184,0.12) 25%, transparent 25%), linear-gradient(-45deg, rgba(148,163,184,0.12) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(148,163,184,0.12) 75%), linear-gradient(-45deg, transparent 75%, rgba(148,163,184,0.12) 75%)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0'
                }}
              />

              <canvas
                ref={canvasRef}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onDoubleClick={handleCanvasDoubleClick}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                style={{
                  width: crop.width * zoom,
                  height: crop.height * zoom
                }}
                className="block relative z-10 touch-none"
              />

              {/* Inline On-Canvas Text / Callout / Step Label Editor */}
              {editingTextId && (() => {
                const target = annotations.find(a => a.id === editingTextId);
                if (!target) return null;
                const b = getAnnotationBounds(target);
                return (
                  <div
                    style={{
                      left: b.x * zoom,
                      top: (b.y + b.height + 8) * zoom
                    }}
                    className={`absolute z-30 p-2.5 rounded-xl border shadow-2xl w-64 ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-1">
                      {target.type === 'step' ? 'Step Badge Label' : 'Edit Annotation Text'}
                    </label>
                    <textarea
                      autoFocus
                      rows={2}
                      value={editingTextValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingTextValue(val);
                        setAnnotations(prev =>
                          prev.map(a =>
                            a.id === editingTextId
                              ? target.type === 'step'
                                ? { ...a, label: val }
                                : { ...a, text: val }
                              : a
                          )
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          pushHistory(annotations, crop);
                          setEditingTextId(null);
                        }
                      }}
                      className={`w-full text-xs p-2 rounded-lg border outline-none resize-none ${
                        darkMode
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                      }`}
                    />
                    <div className="flex justify-end gap-1.5 mt-1.5">
                      <button
                        onClick={() => {
                          pushHistory(annotations, crop);
                          setEditingTextId(null);
                        }}
                        className="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-[11px] font-semibold"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bottom Floating Status Pill & Mobile Zoom Bar */}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none gap-2">
              <div
                className={`pointer-events-auto px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-medium border flex items-center gap-1.5 sm:gap-2 backdrop-blur-md max-w-[calc(100%-110px)] sm:max-w-none truncate ${
                  darkMode
                    ? 'bg-slate-900/80 border-slate-800 text-slate-400'
                    : 'bg-white/85 border-slate-200 text-slate-600 shadow-xs'
                }`}
              >
                <span>{crop.width} × {crop.height} px</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{annotations.length} {annotations.length === 1 ? 'annotation' : 'annotations'}</span>
                {selectedAnnotation && (
                  <>
                    <span>•</span>
                    <span className="text-indigo-500 font-semibold capitalize truncate">
                      {selectedAnnotation.type}
                    </span>
                  </>
                )}
              </div>

              {/* Floating Mobile Zoom Controls (hidden on sm+ since header has it) */}
              <div
                className={`pointer-events-auto flex sm:hidden items-center p-0.5 rounded-full border shadow-md backdrop-blur-md ${
                  darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200'
                }`}
              >
                <button
                  onClick={() => setZoom(z => Math.max(0.2, Number((z - 0.15).toFixed(2))))}
                  title="Zoom Out"
                  className="p-1 text-slate-500 dark:text-slate-400"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => fitToScreen()}
                  title="Fit to Screen"
                  className="px-1 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  onClick={() => setZoom(z => Math.min(4, Number((z + 0.15).toFixed(2))))}
                  title="Zoom In"
                  className="p-1 text-slate-500 dark:text-slate-400"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Floating Mobile Open Inspector Button (Visible only when right sidebar is closed on mobile/tablet) */}
            {!rightSidebarOpen && (
              <div className="absolute bottom-12 sm:bottom-14 right-3 z-20 lg:hidden pointer-events-auto">
                <button
                  onClick={() => setRightSidebarOpen(true)}
                  title="Open Properties Panel"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg border backdrop-blur-md font-semibold text-xs transition active:scale-95 ${
                    darkMode
                      ? 'bg-slate-900/95 border-indigo-500/40 text-indigo-400 shadow-indigo-950/50 hover:bg-slate-800'
                      : 'bg-white/95 border-indigo-200 text-indigo-600 shadow-indigo-500/20 hover:bg-indigo-50/50'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{selectedAnnotation ? `${selectedAnnotation.type} Props` : 'Properties'}</span>
                </button>
              </div>
            )}
          </main>

          {/* ================================================================
              D. RIGHT CONTEXTUAL PROPERTIES & LAYERS PANEL
             ================================================================ */}
          {/* Mobile backdrop when right inspector is open */}
          {rightSidebarOpen && (
            <div
              onClick={() => setRightSidebarOpen(false)}
              className="lg:hidden fixed inset-x-0 top-14 bottom-0 z-30 bg-black/50 backdrop-blur-xs transition-opacity"
            />
          )}

          <aside
            className={`${
              rightSidebarOpen
                ? 'w-[85vw] max-w-[320px] sm:w-80 translate-x-0'
                : 'w-0 translate-x-full lg:translate-x-0 overflow-hidden'
            } fixed lg:static right-0 top-14 bottom-0 z-40 transition-all duration-200 border-l flex flex-col shrink-0 shadow-2xl lg:shadow-none ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Inspector Header */}
            <div className={`px-4 py-3 border-b flex items-center justify-between ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {selectedAnnotation ? `${selectedAnnotation.type} Properties` : `${inspectorContextType} Settings`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {selectedAnnotation && (
                  <>
                    <button
                      onClick={duplicateSelected}
                      title="Duplicate (Ctrl+D)"
                      className={`p-1.5 rounded-lg transition ${
                        darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <CopyPlus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteAnnotationById(selectedAnnotation.id)}
                      title="Delete (Backspace)"
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                {/* Close Button on Mobile / Tablet */}
                <button
                  onClick={() => setRightSidebarOpen(false)}
                  title="Close Panel"
                  className="p-1.5 rounded-lg lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Contextual Controls */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* 1. COLOR PICKER (For all tools except Blur & Crop) */}
              {!['blur', 'crop'].includes(inspectorContextType) && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-400">
                      {inspectorContextType === 'text'
                        ? 'Text Color'
                        : inspectorContextType === 'highlight'
                        ? 'Highlight Color'
                        : 'Primary / Stroke Color'}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={
                          inspectorContextType === 'highlight'
                            ? activeProp('highlightColor') || '#FACC15'
                            : activeProp('strokeColor') || '#EF4444'
                        }
                        onChange={(e) => {
                          if (inspectorContextType === 'highlight' && !selectedAnnotation) {
                            updateProperty('highlightColor', e.target.value);
                          } else {
                            updateProperty('strokeColor', e.target.value);
                          }
                        }}
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={
                          inspectorContextType === 'highlight' && !selectedAnnotation
                            ? activeProp('highlightColor') || '#FACC15'
                            : activeProp('strokeColor') || '#EF4444'
                        }
                        onChange={(e) => updateProperty('strokeColor', e.target.value)}
                        className={`w-20 px-1.5 py-0.5 text-[11px] font-mono rounded border uppercase ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  {inspectorContextType === 'highlight' ? (
                    <div className="flex items-center gap-2">
                      {HIGHLIGHT_PRESETS.map((hp) => (
                        <button
                          key={hp.name}
                          onClick={() => {
                            updateProperty('highlightColor', hp.color);
                            updateProperty('strokeColor', hp.color);
                          }}
                          title={hp.name}
                          style={{ backgroundColor: hp.color }}
                          className={`w-7 h-7 rounded-lg border-2 transition transform hover:scale-105 ${
                            (activeProp('strokeColor') || activeProp('highlightColor')) === hp.color
                              ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                              : 'border-black/10'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-11 gap-1.5">
                      {COLOR_PRESETS.map((hex) => (
                        <button
                          key={hex}
                          onClick={() => updateProperty('strokeColor', hex)}
                          style={{ backgroundColor: hex }}
                          className={`w-5 h-5 rounded-md border transition transform hover:scale-110 ${
                            activeProp('strokeColor') === hex
                              ? 'ring-2 ring-indigo-500 ring-offset-1'
                              : 'border-black/15'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. FILL COLOR (For Rect, Ellipse, Callout) */}
              {['rect', 'ellipse', 'callout'].includes(inspectorContextType) && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-400">Fill Color</label>
                    <button
                      onClick={() =>
                        updateProperty(
                          'fillColor',
                          activeProp('fillColor') === 'transparent' ? '#EF4444' : 'transparent'
                        )
                      }
                      className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
                        activeProp('fillColor') === 'transparent'
                          ? 'border-indigo-500 text-indigo-500 bg-indigo-500/10'
                          : darkMode
                          ? 'border-slate-700 text-slate-400'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {activeProp('fillColor') === 'transparent' ? 'No Fill (Transparent)' : 'Clear Fill'}
                    </button>
                  </div>
                  <div className="grid grid-cols-11 gap-1.5">
                    {COLOR_PRESETS.map((hex) => (
                      <button
                        key={hex}
                        onClick={() => updateProperty('fillColor', hex)}
                        style={{ backgroundColor: hex }}
                        className={`w-5 h-5 rounded-md border transition transform hover:scale-110 ${
                          activeProp('fillColor') === hex
                            ? 'ring-2 ring-indigo-500 ring-offset-1'
                            : 'border-black/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 3. STROKE THICKNESS & DASH STYLE */}
              {['arrow', 'line', 'rect', 'ellipse', 'pen', 'marker', 'callout'].includes(inspectorContextType) && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-400">Stroke Thickness</span>
                      <span className="font-mono font-semibold">{activeProp('strokeWidth')} px</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      {[2, 4, 8, 14].map((w) => (
                        <button
                          key={w}
                          onClick={() => updateProperty('strokeWidth', w)}
                          className={`flex-1 py-1 rounded-lg text-xs font-mono font-semibold border transition ${
                            activeProp('strokeWidth') === w
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : darkMode
                              ? 'bg-slate-800 border-slate-700 text-slate-300'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {w}px
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="32"
                      value={activeProp('strokeWidth') || 4}
                      onChange={(e) => updateProperty('strokeWidth', Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {['arrow', 'line', 'rect', 'ellipse'].includes(inspectorContextType) && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Line Style</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['solid', 'dashed', 'dotted'].map((ds) => (
                          <button
                            key={ds}
                            onClick={() => updateProperty('dashStyle', ds)}
                            className={`py-1.5 rounded-lg text-xs font-medium capitalize border transition ${
                              activeProp('dashStyle') === ds
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : darkMode
                                ? 'bg-slate-800 border-slate-700 text-slate-300'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            {ds}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. ARROWHEAD & CURVATURE OPTIONS */}
              {inspectorContextType === 'arrow' && (
                <div className="space-y-3 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Arrowhead Style</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'single', label: 'Single' },
                        { id: 'double', label: 'Double' },
                        { id: 'outline', label: 'Chevron' }
                      ].map((st) => (
                        <button
                          key={st.id}
                          onClick={() => updateProperty('arrowStyle', st.id)}
                          className={`py-1.5 rounded-lg text-xs font-medium border transition ${
                            activeProp('arrowStyle') === st.id
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : darkMode
                              ? 'bg-slate-800 border-slate-700 text-slate-300'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Curved Arrow Path</span>
                    <button
                      onClick={() =>
                        updateProperty(
                          'arrowCurved',
                          !(selectedAnnotation ? selectedAnnotation.curved : toolSettings.arrowCurved)
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition ${
                        (selectedAnnotation ? selectedAnnotation.curved : toolSettings.arrowCurved)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <CornerUpRight className="w-3.5 h-3.5" />
                      {(selectedAnnotation ? selectedAnnotation.curved : toolSettings.arrowCurved)
                        ? 'Curved (Drag midpoint)'
                        : 'Straight'}
                    </button>
                  </div>
                </div>
              )}

              {/* 5. RECTANGLE CORNER RADIUS */}
              {['rect', 'callout'].includes(inspectorContextType) && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-400">Corner Radius</span>
                    <span className="font-mono font-semibold">{activeProp('cornerRadius') ?? 8} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="48"
                    value={activeProp('cornerRadius') ?? 8}
                    onChange={(e) => updateProperty('cornerRadius', Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              )}

              {/* 6. TEXT & CALLOUT TYPOGRAPHY CONTROLS */}
              {['text', 'callout'].includes(inspectorContextType) && (
                <div className="space-y-3 pt-1 border-t border-slate-200 dark:border-slate-800">
                  {selectedAnnotation && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Text Content</label>
                      <textarea
                        rows={2}
                        value={selectedAnnotation.text || ''}
                        onChange={(e) => updateProperty('text', e.target.value)}
                        className={`w-full text-xs p-2 rounded-lg border outline-none resize-none ${
                          darkMode
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Font Family</label>
                    <select
                      value={activeProp('fontFamily')}
                      onChange={(e) => updateProperty('fontFamily', e.target.value)}
                      className={`w-full text-xs p-2 rounded-lg border outline-none ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      {FONT_FAMILIES.map((f) => (
                        <option key={f.label} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-400">Font Size</span>
                      <span className="font-mono font-semibold">{activeProp('fontSize') || 20} px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={activeProp('fontSize') || 20}
                      onChange={(e) => updateProperty('fontSize', Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Style & Alignment Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateProperty('fontWeight', activeProp('fontWeight') === 'bold' ? 'normal' : 'bold')
                        }
                        className={`p-2 rounded-lg border ${
                          activeProp('fontWeight') === 'bold'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : darkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          updateProperty('fontStyle', activeProp('fontStyle') === 'italic' ? 'normal' : 'italic')
                        }
                        className={`p-2 rounded-lg border ${
                          activeProp('fontStyle') === 'italic'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : darkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {[
                        { align: 'left', icon: AlignLeft },
                        { align: 'center', icon: AlignCenter },
                        { align: 'right', icon: AlignRight }
                      ].map(({ align, icon: AlignIcon }) => (
                        <button
                          key={align}
                          onClick={() => updateProperty('textAlign', align)}
                          className={`p-2 rounded-lg border ${
                            activeProp('textAlign') === align
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : darkMode
                              ? 'bg-slate-800 border-slate-700 text-slate-300'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <AlignIcon className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {inspectorContextType === 'text' && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-slate-400">Background Pill Fill</span>
                      <div className="flex items-center gap-2">
                        {activeProp('textBg') && (
                          <input
                            type="color"
                            value={activeProp('textBgColor') || '#111827'}
                            onChange={(e) => updateProperty('textBgColor', e.target.value)}
                            className="w-5 h-5 rounded cursor-pointer border-0"
                          />
                        )}
                        <button
                          onClick={() => updateProperty('textBg', !activeProp('textBg'))}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                            activeProp('textBg')
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : darkMode
                              ? 'bg-slate-800 border-slate-700 text-slate-300'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {activeProp('textBg') ? 'Enabled' : 'Transparent'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 7. BLUR / PIXELATE CONTROLS */}
              {inspectorContextType === 'blur' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Redaction Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'pixelate', label: 'Pixelate Mosaic' },
                        { id: 'blur', label: 'Smooth Blur' }
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => updateProperty('blurMode', m.id)}
                          className={`py-2 rounded-lg text-xs font-semibold border transition ${
                            activeProp('blurMode') === m.id
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : darkMode
                              ? 'bg-slate-800 border-slate-700 text-slate-300'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-400">Obscure Intensity</span>
                      <span className="font-mono font-semibold">{activeProp('blurIntensity') || 14} px</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="40"
                      value={activeProp('blurIntensity') || 14}
                      onChange={(e) => updateProperty('blurIntensity', Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              )}

              {/* 8. NUMBERED STEP BADGE CONTROLS */}
              {inspectorContextType === 'step' && (
                <div className="space-y-3">
                  {selectedAnnotation && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Step Number</label>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={selectedAnnotation.stepNumber ?? 1}
                          onChange={(e) => updateProperty('stepNumber', Number(e.target.value))}
                          className={`w-full text-xs p-2 rounded-lg border font-mono ${
                            darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Optional Badge Tag</label>
                        <input
                          type="text"
                          placeholder="e.g. Click Settings"
                          value={selectedAnnotation.label || ''}
                          onChange={(e) => updateProperty('label', e.target.value)}
                          className={`w-full text-xs p-2 rounded-lg border ${
                            darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-400">Badge Size</span>
                      <span className="font-mono font-semibold">{activeProp('radius') || activeProp('stepRadius') || 18} px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="36"
                      value={activeProp('radius') || activeProp('stepRadius') || 18}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateProperty('stepRadius', val);
                        updateProperty('radius', val);
                      }}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              )}

              {/* 9. OPACITY SLIDER */}
              {inspectorContextType !== 'crop' && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-400">Opacity</span>
                    <span className="font-mono font-semibold">
                      {Math.round((activeProp('opacity') ?? 1) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.15"
                    max="1"
                    step="0.05"
                    value={activeProp('opacity') ?? 1}
                    onChange={(e) => updateProperty('opacity', Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              )}
            </div>

            {/* ==============================================================
                LAYERS & ANNOTATIONS STACK PANEL (Bottom of Right Sidebar)
               ============================================================== */}
            <div className={`h-60 border-t flex flex-col shrink-0 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Annotations ({annotations.length})
                  </span>
                </div>
                {annotations.length > 0 && (
                  <button
                    onClick={() =>
                      setConfirmModal({
                        title: 'Clear All Annotations?',
                        message: 'This will remove all annotations from the canvas (you can still Undo with Ctrl+Z).',
                        onConfirm: () => {
                          setAnnotations([]);
                          setSelectedId(null);
                          pushHistory([], crop);
                          setConfirmModal(null);
                        }
                      })
                    }
                    className="text-[11px] font-semibold text-rose-500 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {annotations.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4 text-slate-400">
                    <p className="text-xs">No annotations yet.</p>
                    <p className="text-[11px] opacity-75">Select a tool on the left and draw on the screenshot.</p>
                  </div>
                ) : (
                  [...annotations].reverse().map((ann, revIdx) => {
                    const isSelected = ann.id === selectedId;
                    return (
                      <div
                        key={ann.id}
                        onClick={() => {
                          setSelectedId(ann.id);
                          setActiveTool('select');
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between gap-2 cursor-pointer transition ${
                          isSelected
                            ? 'bg-indigo-600/15 text-indigo-500 border border-indigo-500/30 font-semibold'
                            : darkMode
                            ? 'hover:bg-slate-800/80 text-slate-300'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20"
                            style={{ backgroundColor: ann.strokeColor || '#6366F1' }}
                          />
                          <span className="truncate capitalize">
                            {ann.type === 'step'
                              ? `Step #${ann.stepNumber}`
                              : ann.type === 'text' || ann.type === 'callout'
                              ? `${ann.type}: "${ann.text}"`
                              : `${ann.type} #${annotations.length - revIdx}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => moveLayer(ann.id, 'forward')}
                            title="Bring Forward (])"
                            className="p-1 rounded hover:bg-black/10"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveLayer(ann.id, 'backward')}
                            title="Send Backward ([)"
                            className="p-1 rounded hover:bg-black/10"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => toggleLayerVisibility(ann.id)}
                            title={ann.visible === false ? 'Show Layer' : 'Hide Layer'}
                            className={`p-1 rounded hover:bg-black/10 ${ann.visible === false ? 'opacity-40' : ''}`}
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteAnnotationById(ann.id)}
                            title="Delete"
                            className="p-1 rounded hover:bg-rose-500/20 text-rose-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ====================================================================
          EXPORT & DOWNLOAD MODAL (Live Preview, Format, Resolution Scale)
         ==================================================================== */}
      {showExportModal && imageObj && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-2xl w-full max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-base">Export Annotated Screenshot</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 overflow-y-auto">
              {/* Live Clean Render Preview */}
              <div className="md:col-span-7 flex flex-col items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950/40 p-3 min-h-[240px]">
                {exportPreviewUrl ? (
                  <img
                    src={exportPreviewUrl}
                    alt="Export Preview"
                    className="max-h-64 w-auto object-contain rounded shadow-md"
                  />
                ) : (
                  <span className="text-xs text-slate-400">Rendering preview...</span>
                )}
                <p className="text-[11px] font-mono text-slate-400 mt-2">
                  Output: {Math.round((crop.width + exportPadding * 2) * exportScale)} ×{' '}
                  {Math.round((crop.height + exportPadding * 2) * exportScale)} px
                </p>
              </div>

              {/* Export Options */}
              <div className="md:col-span-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Image Format</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { mime: 'image/png', label: 'PNG' },
                      { mime: 'image/jpeg', label: 'JPEG' },
                      { mime: 'image/webp', label: 'WebP' }
                    ].map((fmt) => (
                      <button
                        key={fmt.mime}
                        onClick={() => setExportFormat(fmt.mime)}
                        className={`py-2 rounded-lg text-xs font-bold border transition ${
                          exportFormat === fmt.mime
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : darkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Resolution Scale</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { s: 0.5, label: '0.5x' },
                      { s: 1, label: '1x (Exact)' },
                      { s: 2, label: '2x (HiDPI)' }
                    ].map((sc) => (
                      <button
                        key={sc.s}
                        onClick={() => setExportScale(sc.s)}
                        className={`py-2 rounded-lg text-xs font-semibold border transition ${
                          exportScale === sc.s
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : darkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {sc.label}
                      </button>
                    ))}
                  </div>
                </div>

                {exportFormat !== 'image/png' && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-400">Compression Quality</span>
                      <span className="font-mono font-semibold">{Math.round(exportQuality * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="1"
                      step="0.05"
                      value={exportQuality}
                      onChange={(e) => setExportQuality(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                )}

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-400">Studio Frame Padding</span>
                    <span className="font-mono font-semibold">{exportPadding} px</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[0, 24, 48].map((pad) => (
                      <button
                        key={pad}
                        onClick={() => setExportPadding(pad)}
                        className={`py-1.5 rounded-lg text-xs font-medium border ${
                          exportPadding === pad
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : darkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {pad === 0 ? 'None' : `${pad}px`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                onClick={handleCopyImageToClipboard}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                  darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Copy className="w-4 h-4 text-indigo-500" />
                Copy to Clipboard
              </button>
              <button
                onClick={handleDownloadExport}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
              >
                <Download className="w-4 h-4" />
                Download File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          KEYBOARD SHORTCUTS MODAL (`?`)
         ==================================================================== */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-lg w-full max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                Keyboard Shortcuts Reference
              </h3>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs overflow-y-auto">
              {[
                ['Select & Move', 'V'],
                ['Crop Tool', 'C'],
                ['Arrow Tool', 'A'],
                ['Line Tool', 'L'],
                ['Rectangle', 'R'],
                ['Ellipse / Circle', 'O'],
                ['Freehand Pen', 'P'],
                ['Text Annotation', 'T'],
                ['Highlight Box', 'H'],
                ['Blur / Pixelate', 'B'],
                ['Numbered Step', 'N'],
                ['Marker Pen', 'M'],
                ['Callout Bubble', 'K'],
                ['Eraser / Delete', 'E / Del'],
                ['Undo / Redo', 'Ctrl+Z / Ctrl+Y'],
                ['Duplicate Selected', 'Ctrl+D'],
                ['Paste Image / Object', 'Ctrl+V'],
                ['Hold to Pan Canvas', 'Spacebar']
              ].map(([label, key]) => (
                <div key={label} className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800">
                  <span className="text-slate-400">{label}</span>
                  <kbd className={`px-1.5 py-0.5 rounded font-mono text-[11px] border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`}>
                    {key}
                  </kbd>
                </div>
              ))}
            </div>

            {/* Modal Footer with Author Credit */}
            <div className={`px-6 py-3 border-t flex items-center justify-between text-xs shrink-0 ${
              darkMode ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>PixelMark Studio • Built with ❤️ by <strong className="text-indigo-400 font-semibold">Satyam Prajapati</strong></span>
              </div>
              <a
                href="https://github.com/devSp741/pixelMark"
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-400 underline font-medium transition"
              >
                GitHub Repo →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          CUSTOM CONFIRMATION MODAL (No window.confirm!)
         ==================================================================== */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-sm w-full rounded-2xl border p-6 shadow-2xl ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h3 className="font-bold text-base mb-1.5">{confirmModal.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">{confirmModal.message}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmModal(null)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border ${
                  darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          CLIPBOARD FALLBACK MODAL (When browser blocks ClipboardItem API)
         ==================================================================== */}
      {clipboardFallbackDataUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-2xl border p-5 shadow-2xl ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">Right-Click Image Below to Copy</h3>
              <button onClick={() => setClipboardFallbackDataUrl(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={clipboardFallbackDataUrl}
              alt="Rendered Annotation"
              className="max-h-64 mx-auto rounded border border-slate-700 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setClipboardFallbackDataUrl(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          TOAST NOTIFICATIONS STACK
         ==================================================================== */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-2.5 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-semibold transition-all ${
              darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {t.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}