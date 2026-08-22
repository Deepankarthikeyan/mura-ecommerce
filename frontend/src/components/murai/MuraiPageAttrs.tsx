"use client";

import { useEffect } from "react";

type MuraiPageAttrsProps = {
  page: string;
};

export default function MuraiPageAttrs({ page }: MuraiPageAttrsProps) {
  useEffect(() => {
    document.body.dataset.page = page;
    return () => {
      delete document.body.dataset.page;
    };
  }, [page]);

  return null;
}
