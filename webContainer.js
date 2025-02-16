import { WebContainer } from "@webcontainer/api";

let webContainerInstance = null;
let initializing = false; // ✅ Prevent multiple boot calls at once

export const getWebContainer = async () => {
  if (webContainerInstance) {
    console.log(
      "⚡ WebContainer already initialized, returning existing instance."
    );
    return webContainerInstance;
  }

  if (initializing) {
    console.log("⏳ WebContainer initialization is in progress...");
    while (!webContainerInstance) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for instance
    }
    return webContainerInstance;
  }

  try {
    initializing = true;
    webContainerInstance = await WebContainer.boot();
    console.log("✅ WebContainer successfully booted.");
  } catch (err) {
    console.error("❌ WebContainer initialization error:", err);
    throw err;
  } finally {
    initializing = false;
  }

  return webContainerInstance;
};
