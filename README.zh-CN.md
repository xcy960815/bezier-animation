# bezier-animation-plus

一个基于 TypeScript 的贝塞尔/抛物线动画库，适合“加入购物车”“元素飞入目标区域”这类交互。它支持选择器和真实 DOM 节点两种写法，同时保留旧版 `sourceClassName`、`targetClassName`、`moveClassName` API。

## 特性

- 支持两个 DOM 元素之间的贝塞尔/抛物线动画
- 支持传选择器，也支持直接传 `HTMLElement`
- 适合克隆节点的飞入购物车场景
- 可配置曲线弧度和动画时长
- 动画结束后是否移除运动节点可配置
- 起点和终点垂直对齐时不再直接跳到终点
- TypeScript 源码和类型声明
- Rollup 构建 UMD 和 ESM 产物

## 安装

```sh
npm install bezier-animation-plus
```

```sh
pnpm add bezier-animation-plus
```

```sh
yarn add bezier-animation-plus
```

## 快速开始

推荐在“飞入购物车”场景里克隆一个临时节点，然后把这个克隆节点作为 `element` 传入。

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
        console.log('动画执行完成')
    },
}).move()
```

## 兼容旧写法

旧版选择器字段仍然可以继续使用。

```ts
import { Bezier } from 'bezier-animation-plus'

new Bezier({
    sourceClassName: '.goods-title',
    targetClassName: '.shopping-cart',
    moveClassName: '.move-node',
    time: 1000,
}).move()
```

## 浏览器直引

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

### 导出项

| 导出项          | 类型            | 说明                      |
| --------------- | --------------- | ------------------------- |
| `default`       | `typeof Bezier` | 默认导出的动画类。        |
| `Bezier`        | `typeof Bezier` | 命名导出的动画类。        |
| `BezierConfig`  | `interface`     | 构造函数配置。            |
| `BezierElement` | `type`          | `string \| HTMLElement`。 |

### `BezierConfig`

| 配置项            | 类型                    | 默认值  | 说明                                                                                   |
| ----------------- | ----------------------- | ------- | -------------------------------------------------------------------------------------- |
| `source`          | `string \| HTMLElement` | 必填    | 起点元素或选择器。                                                                     |
| `target`          | `string \| HTMLElement` | 必填    | 目标元素或选择器。                                                                     |
| `element`         | `string \| HTMLElement` | 必填    | 沿路径运动的元素。                                                                     |
| `sourceClassName` | `string`                | -       | 旧版字段，等价于 `source`。                                                            |
| `targetClassName` | `string`                | -       | 旧版字段，等价于 `target`。                                                            |
| `moveClassName`   | `string`                | -       | 旧版字段，等价于 `element`。                                                           |
| `radian`          | `number`                | `0.004` | 抛物线弧度。正数向下弯曲，负数向上弯曲。                                               |
| `duration`        | `number`                | `1000`  | 动画时长，单位毫秒。                                                                   |
| `time`            | `number`                | `1000`  | 旧版字段，等价于 `duration`。                                                          |
| `removeOnFinish`  | `boolean`               | `true`  | 动画结束后是否移除运动元素。设为 `false` 时会把元素保留在 `document.body` 的目标位置。 |
| `callback`        | `() => void`            | -       | 动画结束后的回调。                                                                     |

## 本地示例

```sh
pnpm install
pnpm dev
```

打开 `http://localhost:9908`。本地 demo 覆盖商品飞入购物车、批量触发、垂直路径、旧 selector API、保留运动节点和 `destroy()` 等场景。

## 开发

```sh
pnpm install
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

执行 `pnpm install` 后会安装 Git hooks。提交前会通过 `lint-staged` 执行 ESLint 和 Prettier，提交信息会按 Conventional Commits 规则校验。

构建产物：

- `dist/index.umd.js`
- `dist/index.esm.js`
- `dist/typing/index.d.ts`
- `demo/index.umd.js`

## 项目结构

```txt
src/
  index.ts          # Bezier 类、DOM 解析、坐标计算、动画生命周期
demo/
  index.html        # 本地购物车示例
dist/
  index.umd.js      # UMD 产物
  index.esm.js      # ESM 产物
  typing/           # 类型声明
```

## License

MIT
