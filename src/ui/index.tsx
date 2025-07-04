import { createRoot } from "react-dom/client";
import { UI } from "./UI";

const container = document.getElementById("ui");

if (!container) {
  throw new Error("Root container not found");
}

const root = createRoot(container);
root.render(<UI />);
