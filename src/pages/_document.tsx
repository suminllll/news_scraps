import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="ko">
        <Head></Head>
        <body>
          <div id="modal-root"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
