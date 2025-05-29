import { useEffect, useState } from "react";

export function useFontReady(fontName: string, size: string = "16px") {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkFont = async () => {
      const descriptor = `${size} '${fontName}'`;
      if (document.fonts.check(descriptor)) {
        setIsReady(true);
      } else {
        await document.fonts.load(descriptor);
        setIsReady(true);
      }
    };

    checkFont();
  }, [fontName, size]);

  return isReady;
}
