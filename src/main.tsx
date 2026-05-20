
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { initializeProtections } from "./utils/preventScreenCapture";

  // Initialize screen capture and right-click protections
  initializeProtections();

  createRoot(document.getElementById("root")!).render(<App />);
  