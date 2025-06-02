import { useCanvasStore } from "@/store/use-canvas-store";
import { useEffect, useState } from "react";

export const useLoadFonts = (fonts?: FontAsset[]) => {
  const [mapFonts, setMapFonts] = useState(new Map());
  const [isFontLoad, setIsFontLoad] = useState(false);
  const setTemplate = useCanvasStore((state) => state.setTemplate);
  const template = useCanvasStore((state) => state.template);

  //   @ts-ignore
  async function loadFontFace(fontFace: FontFace[]) {
    await Promise.all(
      fontFace.map(async (font) => {
        const loadedFont = await font.load();
        document.fonts.add(loadedFont);
      })
    );
  }

  useEffect(() => {
    if (fonts) {
      setIsFontLoad(true);
      const fontFaces = fonts.map((font, index) => {
        const newFonts = mapFonts;
        newFonts.set(font._id, `font-${index}`);
        setMapFonts(newFonts);
        return new FontFace(`font-${index}`, `url(${font.url})`);
      });
      loadFontFace(fontFaces).finally(() => {
        setTemplate(
          template.map((shape) => {
            if (shape.fontId) {
              shape.fontId = mapFonts.get(shape.fontId);
            }
            return shape;
          })
        );
        setIsFontLoad(false);
      });
    }
  }, [fonts]);

  return { isFontLoad };
};
