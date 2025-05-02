import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add title
document.title = "Research Portal";

// Add meta description
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Fast, ad-free research portal for academic and educational purposes.';
document.head.appendChild(metaDescription);

createRoot(document.getElementById("root")!).render(<App />);
