export function wrapText(
  text: string,
  maxWidth: number,
  ctx: CanvasRenderingContext2D
): string[] {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      lines.push(line.trim());
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  return lines;
}

export function fitTextToBox(
  text: string,
  box: { width: number; height: number },
  align: "left" | "center" | "right"
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const padding = 1;
  const maxWidth = box.width - padding * 2;
  const maxHeight = box.height - padding * 2;

  let fontSize = 30;
  let lines: string[] = [];

  while (fontSize > 5) {
    ctx.font = `${fontSize}px sans-serif`;
    lines = wrapText(text, maxWidth, ctx);
    const totalHeight = lines.length * fontSize;

    if (totalHeight <= maxHeight) break;
    fontSize--;
  }

  return {
    text: lines.join("\n"),
    fontSize,
    padding,
    align,
  };
}
