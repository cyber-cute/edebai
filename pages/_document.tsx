import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Edebiyat sorularınıza yapay zeka ile cevap verin."
          />
          <meta property="og:site_name" content="edebai.vercel.app" />
          <meta
            property="og:description"
            content="Edebiyat sorularınıza yapay zeka ile cevap verin"
          />
          <meta property="og:title" content="EdebAI" />
          
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
