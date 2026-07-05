# API

## Exports

| Export          | Type            | Description                           |
| --------------- | --------------- | ------------------------------------- |
| `default`       | `typeof Bezier` | Main animation class.                 |
| `Bezier`        | `typeof Bezier` | Named export for the animation class. |
| `BezierConfig`  | `interface`     | Constructor options.                  |
| `BezierElement` | `type`          | `string \| HTMLElement`.              |

## `BezierConfig`

| Option            | Type                    | Default  | Description                                        |
| ----------------- | ----------------------- | -------- | -------------------------------------------------- |
| `source`          | `string \| HTMLElement` | Required | Start element or selector.                         |
| `target`          | `string \| HTMLElement` | Required | Target element or selector.                        |
| `element`         | `string \| HTMLElement` | Required | Moving element or selector.                        |
| `sourceClassName` | `string`                | -        | Legacy alias for `source`.                         |
| `targetClassName` | `string`                | -        | Legacy alias for `target`.                         |
| `moveClassName`   | `string`                | -        | Legacy alias for `element`.                        |
| `radian`          | `number`                | `0.004`  | Curve coefficient.                                 |
| `duration`        | `number`                | `1000`   | Duration in milliseconds.                          |
| `time`            | `number`                | `1000`   | Legacy alias for `duration`.                       |
| `removeOnFinish`  | `boolean`               | `true`   | Whether to remove the moving element after finish. |
| `callback`        | `() => void`            | -        | Finish callback.                                   |

## Methods

| Method      | Return | Description                                                      |
| ----------- | ------ | ---------------------------------------------------------------- |
| `move()`    | `this` | Start the animation. Calling it during an active run is ignored. |
| `destroy()` | `void` | Stop the active animation and remove the temporary mask layer.   |
