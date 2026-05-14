"use client";

import { useEffect } from "react";

export default function EnrollModal() {

  useEffect(() => {
    const handleOpen = () => {
      window.location.href = "/checkout";
    };
    window.addEventListener("openEnrollModal", handleOpen);
    return () => window.removeEventListener("openEnrollModal", handleOpen);
  }, []);

  return null;
}
