# Demo

The local demo is a small test bench with shopping-cart animations, batch clicks, vertical paths, legacy selector usage, preserved moving elements, and `destroy()` behavior.

```sh
pnpm install
pnpm dev
```

Open `http://localhost:9908`.

## Example

```ts
import Bezier from 'bezier-animation-plus'

const source = document.querySelector('.goods-title') as HTMLElement
const target = document.querySelector('.shopping-cart') as HTMLElement
const element = source.cloneNode(true) as HTMLElement

document.body.appendChild(element)

new Bezier({
    source,
    target,
    element,
    radian: -0.0005,
    duration: 1000,
}).move()
```
