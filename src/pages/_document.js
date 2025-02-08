// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head />
                <body>
                <div id="root"></div>
                <Main />
                <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
