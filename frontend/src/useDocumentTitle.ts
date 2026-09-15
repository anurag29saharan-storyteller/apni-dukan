import { useEffect } from "react";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} · Apni Dukan` : "Apni Dukan";
    return () => {
      document.title = prev;
    };
  }, [title]);
}