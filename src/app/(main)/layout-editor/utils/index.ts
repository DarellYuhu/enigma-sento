export const toLocalCoords = (
  box: {
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
  },
  x: number,
  y: number
) => {
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const angle = (-(box.rotation || 0) * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
  const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
  return {
    x: rx + box.width / 2,
    y: ry + box.height / 2,
  };
};

export function wrapText(
  text: string,
  maxWidth: number,
  ctx: CanvasRenderingContext2D
) {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + (line ? " " : "") + words[i];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && line) {
      lines.push(line);
      line = words[i];
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function drawJustifiedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number
) {
  const words = text.split(" ");
  const spaceWidth = ctx.measureText(" ").width;

  // Measure total text width
  const wordsWidth = words.reduce(
    (acc, word) => acc + ctx.measureText(word).width,
    0
  );
  const totalSpaces = words.length - 1;
  const extraSpace = maxWidth - wordsWidth;

  // If there's only one word or the line is too short, just draw normally
  if (totalSpaces === 0 || extraSpace < 0) {
    ctx.fillText(text, x, y);
    return;
  }

  const spacing = spaceWidth + extraSpace / totalSpaces;
  let currentX = x;

  for (let i = 0; i < words.length; i++) {
    ctx.fillText(words[i], currentX, y);
    if (i < words.length - 1) {
      currentX += ctx.measureText(words[i]).width + spacing;
    }
  }
}

export const createImgTag = (boxKey: string, url: string) => {
  const oldTag = document.getElementById(`image-${boxKey}`);
  if (oldTag) oldTag.remove();
  const img = new Image();
  img.src = url;
  img.id = `image-${boxKey}`;
  img.alt = `image-${boxKey}`;
  img.className = "hidden";
  document.body.appendChild(img);
};
