# bezier-animation-plus

[中文文档](./README.zh-CN.md)

A small TypeScript animation library for Bezier/parabola motion, commonly used for "fly to cart" interactions. It works with selectors or real DOM elements, supports UMD and ESM builds, and keeps the legacy selector API compatible.

## Features

- Bezier/parabola animation between two DOM elements
- Selector API and direct `HTMLElement` API
- Works well with cloned moving elements
- Configurable curve coefficient and duration
- Optional automatic removal of the moving element after animation
- Vertical movement fallback when the start and target have the same `x` coordinate
- TypeScript source and generated declaration files
- Rollup library build with UMD and ESM outputs

## Installation

```sh
npm install bezier-animation-plus
```

```sh
pnpm add bezier-animation-plus
```

```sh
yarn add bezier-animation-plus
```

## Quick Start

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
    callback() {
        console.log('animation finished')
    },
}).move()
```

## Legacy Selector Usage

The previous selector fields are still supported.

```ts
import { Bezier } from 'bezier-animation-plus'

new Bezier({
    sourceClassName: '.goods-title',
    targetClassName: '.shopping-cart',
    moveClassName: '.move-node',
    time: 1000,
}).move()
```

## UMD Usage

```html
<script src="https://unpkg.com/bezier-animation-plus@latest/dist/index.umd.js"></script>
<script>
    new bezierAnimation.Bezier({
        source: '.goods-title',
        target: '.shopping-cart',
        element: '.move-node',
    }).move()
</script>
```

## API

### Exports

| Export          | Type            | Description                           |
| --------------- | --------------- | ------------------------------------- |
| `default`       | `typeof Bezier` | Main animation class.                 |
| `Bezier`        | `typeof Bezier` | Named export for the animation class. |
| `BezierConfig`  | `interface`     | Constructor options.                  |
| `BezierElement` | `type`          | `string \| HTMLElement`.              |

### `BezierConfig`

| Option            | Type                    | Default  | Description                                                                                                                  |
| ----------------- | ----------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `source`          | `string \| HTMLElement` | Required | Start element or selector.                                                                                                   |
| `target`          | `string \| HTMLElement` | Required | Target element or selector.                                                                                                  |
| `element`         | `string \| HTMLElement` | Required | Element that moves along the path.                                                                                           |
| `sourceClassName` | `string`                | -        | Legacy alias for `source`.                                                                                                   |
| `targetClassName` | `string`                | -        | Legacy alias for `target`.                                                                                                   |
| `moveClassName`   | `string`                | -        | Legacy alias for `element`.                                                                                                  |
| `radian`          | `number`                | `0.004`  | Curve coefficient. Positive values bend downward, negative values bend upward.                                               |
| `duration`        | `number`                | `1000`   | Animation duration in milliseconds.                                                                                          |
| `time`            | `number`                | `1000`   | Legacy alias for `duration`.                                                                                                 |
| `removeOnFinish`  | `boolean`               | `true`   | Remove the moving element after the animation finishes. Set to `false` to keep it in `document.body` at the target position. |
| `callback`        | `() => void`            | -        | Called after the animation finishes.                                                                                         |

## Demo

The local demo is a small test bench with shopping-cart animations, batch clicks, vertical paths, legacy selector usage, preserved moving elements, and `destroy()` behavior.

```sh
pnpm install
pnpm dev
```

Open `http://localhost:9908`.

## Development

```sh
pnpm install
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

Git hooks are installed by `pnpm install`. `lint-staged` runs ESLint and Prettier before commit, and commit messages are checked with Conventional Commits.

Build outputs:

- `dist/index.umd.js`
- `dist/index.esm.js`
- `dist/typing/index.d.ts`
- `demo/index.umd.js`

## Architecture

```txt
src/
  index.ts          # Bezier class, DOM resolution, geometry, animation lifecycle
demo/
  index.html        # Local shopping-cart demo
dist/
  index.umd.js      # UMD package output
  index.esm.js      # ESM package output
  typing/           # Type declarations
```

## License

MIT
