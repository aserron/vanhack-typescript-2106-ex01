import './style.css'
import balanced from "./lib/balanced/balanced";

const app = document.querySelector<HTMLDivElement>('#app')!

let invList = [
    'assadd'
]
let invokedFn = 'balanced'
let invoked = invList[0];
let result = balanced(invoked);

let output = `[${invokedFn}] (${invoked}) = ${result}`


console.log(output)

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
  <main>
    <section>
    <pre>
        <code class="language-typescript">
            ${invokedFn}("${invoked}")=${result};
        </code>
    </pre>
    </section>
  </main>
`
