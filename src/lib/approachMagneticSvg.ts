export type ApproachSvgPath = {
  d: string;
  fill: string;
  cx: number;
  cy: number;
};

export type ParsedApproachSvg = {
  viewBox: string;
  paths: ApproachSvgPath[];
};

/** Prvý `M` v path — pre bodové SVG stačí ako kotva odporu. */
export function centroidFromPathD(d: string): { x: number; y: number } {
  const match = d.match(/M\s*(-?[\d.]+)\s+(-?[\d.]+)/);
  if (!match) return { x: 0, y: 0 };
  return { x: Number.parseFloat(match[1]), y: Number.parseFloat(match[2]) };
}

export function parseViewBox(viewBox: string): [number, number, number, number] {
  const parts = viewBox.trim().split(/\s+/).map(Number);
  if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
    return parts as [number, number, number, number];
  }
  return [0, 0, 100, 100];
}

export function parseApproachSvgMarkup(markup: string): ParsedApproachSvg {
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  const root = doc.querySelector("svg");
  if (!root) {
    return { viewBox: "0 0 100 100", paths: [] };
  }

  const viewBox =
    root.getAttribute("viewBox") ??
    (() => {
      const w = root.getAttribute("width") ?? "100";
      const h = root.getAttribute("height") ?? "100";
      return `0 0 ${w} ${h}`;
    })();

  const paths: ApproachSvgPath[] = [];
  root.querySelectorAll("path").forEach((node) => {
    const d = node.getAttribute("d");
    if (!d) return;
    const { x, y } = centroidFromPathD(d);
    paths.push({
      d,
      fill: node.getAttribute("fill") ?? "white",
      cx: x,
      cy: y,
    });
  });

  return { viewBox, paths };
}

export function clientPointToSvg(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  viewBox: string,
): { x: number; y: number } {
  const [vx, vy, vw, vh] = parseViewBox(viewBox);
  if (rect.width <= 0 || rect.height <= 0) {
    return { x: vx + vw * 0.5, y: vy + vh * 0.5 };
  }
  return {
    x: vx + ((clientX - rect.left) / rect.width) * vw,
    y: vy + ((clientY - rect.top) / rect.height) * vh,
  };
}

/** Posun pathu od kurzora (viewBox jednotky). */
export function repelOffset(
  cx: number,
  cy: number,
  mx: number,
  my: number,
  radius: number,
  maxDisp: number,
  strength: number,
): { x: number; y: number } {
  const dx = cx - mx;
  const dy = cy - my;
  const distSq = dx * dx + dy * dy;
  const r = Math.max(radius, 1e-6);
  if (distSq >= r * r) return { x: 0, y: 0 };
  const dist = Math.sqrt(distSq) || 1e-6;
  const t = 1 - dist / r;
  const w = t * t * strength;
  const scale = (maxDisp * w) / dist;
  return { x: dx * scale, y: dy * scale };
}
