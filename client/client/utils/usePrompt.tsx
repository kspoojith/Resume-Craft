import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function usePrompt(message: string, when: boolean) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;
    const replace = navigator.replace;

    navigator.push = (...args: any[]) => {
      if (window.confirm(message)) {
        push.apply(navigator, args);
      }
    };
    navigator.replace = (...args: any[]) => {
      if (window.confirm(message)) {
        replace.apply(navigator, args);
      }
    };

    return () => {
      navigator.push = push;
      navigator.replace = replace;
    };
  }, [message, navigator, when]);
}
