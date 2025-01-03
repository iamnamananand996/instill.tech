import { useEffect } from "react";
import { useInstillAICtx } from "@/contexts/InstillAIContext";

// Custom Hook for dark mode
const useDarkTheme = () => {
  const { isDark, setIsDark } = useInstillAICtx();

  useEffect(() => {
    //  Get value on localstorage
    const darkMode = localStorage.getItem("dark") === "true";
    if (setIsDark) {
      setIsDark(darkMode);
    }
  }, [setIsDark]);

  useEffect(() => {
    const html = document.querySelector("html");
    if (!html) return;
    if (setIsDark) {
      //  Add or Remove "dark" classname
      setIsDark((prevIsDark) => {
        if (prevIsDark) {
          html.classList.add("dark");
          //  Set value on localstorage true
          localStorage.setItem("dark", "true");
        } else {
          html.classList.remove("dark");
          //  Set value on localstorage false
          localStorage.setItem("dark", "false");
        }
        return prevIsDark;
      });
    }
  }, [isDark, setIsDark]);

  return [isDark, setIsDark] as const;
};

export default useDarkTheme;
