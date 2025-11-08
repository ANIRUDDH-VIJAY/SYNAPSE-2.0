// src/lib/sanitize.ts

import React from "react";

function isReactElement(obj: any): boolean {
  return obj && typeof obj === "object" && (
    React.isValidElement(obj) ||
    "$$typeof" in obj ||
    "_owner" in obj ||
    "_store" in obj ||
    "props" in obj
  );
}

export function getSafeMarkdownString(input: any): string {
  // Handle null/undefined
  if (input == null) {
    return "";
  }

  try {
    // Handle string input
    if (typeof input === "string") {
      return input.trim() || "";
    }
    
    // Convert non-string input to string
    if (input != null) {
      return String(input).trim() || "";
    }

    // Handle primitives
    return String(input).trim();

  } catch (err) {
    console.warn("Error in getSafeMarkdownString:", err);
    return "[Error: Invalid content]";
  }
}
