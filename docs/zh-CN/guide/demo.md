# 示例

本地 demo 是一个小测试台，覆盖商品飞入购物车、批量触发、垂直路径、旧 selector API、保留运动节点和 `destroy()` 等场景。

```sh
pnpm install
pnpm dev
```

打开 `http://localhost:9908`。

## 示例代码

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
