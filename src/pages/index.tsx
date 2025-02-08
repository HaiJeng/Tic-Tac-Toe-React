import React, { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

const Index = () => {
    useEffect(() => {
        const rootElement = document.getElementById("root");
        if (rootElement) {
            const root = createRoot(rootElement);
            root.render(
                <StrictMode>
                    <App />
                </StrictMode>
            );
        }
    }, []);

    return null; // 这个组件本身不需要渲染内容，实际渲染由 `createRoot` 负责
};

export default Index;
