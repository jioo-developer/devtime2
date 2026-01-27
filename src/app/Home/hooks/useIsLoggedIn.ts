"use client";

import { useState, useEffect } from "react";
import { getAccessToken } from "@/config/utils/tokenStorage";

export function useIsLoggedIn(): boolean {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());
  }, []);

  return isLoggedIn;
}
