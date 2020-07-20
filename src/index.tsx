import { DarkModeProvider } from "material-ui-pack"
import React from "react"
import { hydrate, render } from "react-dom"
import App from "./App"
import "./index.css"
import * as serviceWorker from "./serviceWorker"

const theApp = (
  <React.StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </React.StrictMode>
)

const rootElement = document.getElementById("root") as HTMLElement
if (rootElement.hasChildNodes()) {
  hydrate(theApp, rootElement)
} else {
  render(theApp, rootElement)
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
