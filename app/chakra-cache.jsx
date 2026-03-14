"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";

export function ChakraCacheProvider({ children }) {
  const [cache] = useState(() =>
    createCache({
      key: "chakra",
      prepend: true,
    })
  );

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
