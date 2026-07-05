# API

## 导出项

| 导出项          | 类型            | 说明                      |
| --------------- | --------------- | ------------------------- |
| `default`       | `typeof Bezier` | 默认导出的动画类。        |
| `Bezier`        | `typeof Bezier` | 命名导出的动画类。        |
| `BezierConfig`  | `interface`     | 构造函数配置。            |
| `BezierElement` | `type`          | `string \| HTMLElement`。 |

## `BezierConfig`

| 配置项            | 类型                    | 默认值  | 说明                          |
| ----------------- | ----------------------- | ------- | ----------------------------- |
| `source`          | `string \| HTMLElement` | 必填    | 起点元素或选择器。            |
| `target`          | `string \| HTMLElement` | 必填    | 目标元素或选择器。            |
| `element`         | `string \| HTMLElement` | 必填    | 运动元素或选择器。            |
| `sourceClassName` | `string`                | -       | 旧版字段，等价于 `source`。   |
| `targetClassName` | `string`                | -       | 旧版字段，等价于 `target`。   |
| `moveClassName`   | `string`                | -       | 旧版字段，等价于 `element`。  |
| `radian`          | `number`                | `0.004` | 抛物线弧度。                  |
| `duration`        | `number`                | `1000`  | 动画时长，单位毫秒。          |
| `time`            | `number`                | `1000`  | 旧版字段，等价于 `duration`。 |
| `removeOnFinish`  | `boolean`               | `true`  | 动画结束后是否移除运动元素。  |
| `callback`        | `() => void`            | -       | 动画结束后的回调。            |

## 方法

| 方法        | 返回值 | 说明                                   |
| ----------- | ------ | -------------------------------------- |
| `move()`    | `this` | 开始动画。动画进行中重复调用会被忽略。 |
| `destroy()` | `void` | 停止当前动画并清理临时遮罩层。         |
