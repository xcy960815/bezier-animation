/**
 * JavaScript Bezier/parabola animation.
 *
 * The legacy selector fields remain supported:
 * `sourceClassName`, `targetClassName`, and `moveClassName`.
 */
export type BezierElement = string | HTMLElement

export interface BezierConfig {
    /** Start element or selector. */
    source?: BezierElement
    /** Target element or selector. */
    target?: BezierElement
    /** Element or selector that moves along the path. */
    element?: BezierElement

    /** @deprecated Use `source` instead. */
    sourceClassName?: string
    /** @deprecated Use `target` instead. */
    targetClassName?: string
    /** @deprecated Use `element` instead. */
    moveClassName?: string

    /** Curve coefficient. Positive values bend downward, negative values bend upward. */
    radian?: number
    /** Animation duration in milliseconds. */
    time?: number
    /** Alias for `time`. */
    duration?: number
    /** Remove the moving element after the animation finishes. Defaults to `true`. */
    removeOnFinish?: boolean
    /** Called after the animation finishes. */
    callback?: () => void

    /** @deprecated This option is no longer required and is ignored. */
    multiNode?: boolean
}

const DEFAULT_RADIAN = 0.004
const DEFAULT_TIME = 1000
const FRAME_DELAY = 16

interface Geometry {
    sourceX: number
    sourceY: number
    targetX: number
    targetY: number
}

class Bezier {
    /** Static self reference, compatible with `new pkg.Bezier()`. */
    static Bezier: typeof Bezier

    private config: BezierConfig

    private radian: number
    private time: number
    private removeOnFinish: boolean

    private sourceNode: HTMLElement
    private targetNode: HTMLElement
    private moveNode: HTMLElement

    // Parabola constant: y = radian * x^2 + b * x
    private b = 0
    // Horizontal speed(px/ms)
    private speedx = 0
    private diffx = 0
    private diffy = 0

    // requestAnimationFrame handle, 0 means idle.
    private rafId = 0
    // Move mode: 'position' or a transform property name.
    private domMoveStyle = 'position'
    private maskLayerNode: HTMLDivElement | null = null

    constructor(config: BezierConfig) {
        if (!config) {
            throw new Error('[bezier-animation] config is required')
        }
        this.config = config

        this.sourceNode = this.getNode(
            config.source !== undefined ? config.source : config.sourceClassName,
            'source'
        )
        this.targetNode = this.getNode(
            config.target !== undefined ? config.target : config.targetClassName,
            'target'
        )
        this.moveNode = this.getNode(
            config.element !== undefined ? config.element : config.moveClassName,
            'element'
        )

        this.radian = typeof config.radian === 'number' ? config.radian : DEFAULT_RADIAN
        this.time = this.normalizeTime(config.duration, config.time)
        this.removeOnFinish = config.removeOnFinish !== false
        this.domMoveStyle = this.markSureDomMoveStyle()
    }

    /** Get an element from a selector or HTMLElement. */
    private getNode(input: BezierElement | undefined, field: string): HTMLElement {
        if (typeof input === 'string') {
            const node = document.querySelector(input) as HTMLElement | null
            if (!node) {
                throw new Error(
                    `[bezier-animation] ${field} selector "${input}" did not match any element`
                )
            }
            return node
        }

        if (input instanceof HTMLElement) {
            return input
        }

        throw new Error(`[bezier-animation] ${field} is required`)
    }

    private normalizeTime(duration?: number, time?: number): number {
        const value = typeof duration === 'number' ? duration : time
        return typeof value === 'number' && value > 0 ? value : DEFAULT_TIME
    }

    /** Detect the best movement style for the current browser. */
    private markSureDomMoveStyle(): string {
        const style = document.createElement('div').style as any
        const transformList = [
            'transform',
            'webkitTransform',
            'msTransform',
            'mozTransform',
        ]

        for (let index = 0; index < transformList.length; index += 1) {
            const transform = transformList[index]
            if (transform in style) {
                return transform
            }
        }

        return 'position'
    }

    /** Recompute coordinates before every run, including page scroll offset. */
    private computeGeometry(): Geometry {
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft || 0
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0

        const sourceRect = this.sourceNode.getBoundingClientRect()
        const targetRect = this.targetNode.getBoundingClientRect()

        const sourceX = sourceRect.left + scrollX
        const sourceY = sourceRect.top + scrollY
        const targetX = targetRect.left + scrollX
        const targetY = targetRect.top + scrollY

        this.diffx = targetX - sourceX
        this.diffy = targetY - sourceY
        this.speedx = this.diffx === 0 ? 0 : this.diffx / this.time
        this.b =
            this.diffx === 0
                ? 0
                : (this.diffy - this.radian * this.diffx * this.diffx) / this.diffx

        return { sourceX, sourceY, targetX, targetY }
    }

    /** Move the element to a relative coordinate. */
    private applyPosition(x: number, y: number, baseX: number, baseY: number): void {
        const style = this.moveNode.style as any
        if (this.domMoveStyle === 'position') {
            style.left = `${x + baseX}px`
            style.top = `${y + baseY}px`
        } else {
            style[this.domMoveStyle] = `translate(${x}px, ${y}px)`
        }
    }

    private prepareMoveNode(sourceX: number, sourceY: number): void {
        this.moveNode.style.position = 'absolute'
        this.moveNode.style.left = `${sourceX}px`
        this.moveNode.style.top = `${sourceY}px`

        if (this.domMoveStyle !== 'position') {
            ;(this.moveNode.style as any)[this.domMoveStyle] = 'translate(0px, 0px)'
        }
    }

    private createMaskLayer(): void {
        const maskLayerNode = document.createElement('div')
        maskLayerNode.style.position = 'absolute'
        maskLayerNode.style.zIndex = '99'
        maskLayerNode.style.top = '0px'
        maskLayerNode.style.bottom = '0px'
        maskLayerNode.style.right = '0px'
        maskLayerNode.style.left = '0px'
        maskLayerNode.style.pointerEvents = 'none'
        maskLayerNode.appendChild(this.moveNode)
        document.body.appendChild(maskLayerNode)
        this.maskLayerNode = maskLayerNode
    }

    private requestFrame(callback: FrameRequestCallback): number {
        if (typeof window.requestAnimationFrame === 'function') {
            return window.requestAnimationFrame(callback)
        }

        return window.setTimeout(callback, FRAME_DELAY)
    }

    private cancelFrame(frameId: number): void {
        if (typeof window.cancelAnimationFrame === 'function') {
            window.cancelAnimationFrame(frameId)
            return
        }

        window.clearTimeout(frameId)
    }

    move(): this {
        // Wait for the current animation before starting another run.
        if (this.rafId) return this

        const { sourceX, sourceY, targetX, targetY } = this.computeGeometry()
        this.prepareMoveNode(sourceX, sourceY)
        this.createMaskLayer()

        const startTime = Date.now()

        const step = () => {
            const elapsed = Date.now() - startTime

            if (elapsed >= this.time) {
                this.finish(targetX, targetY)
                return
            }

            const progress = elapsed / this.time
            const x = this.diffx === 0 ? 0 : this.speedx * elapsed
            const y =
                this.diffx === 0
                    ? this.diffy * progress
                    : this.radian * x * x + this.b * x

            this.applyPosition(x, y, sourceX, sourceY)
            this.rafId = this.requestFrame(step)
        }

        this.rafId = this.requestFrame(step)
        return this
    }

    /** Finish the animation, clean the mask, and run the callback. */
    private finish(targetX: number, targetY: number): void {
        this.stopRaf()

        if (this.domMoveStyle !== 'position') {
            ;(this.moveNode.style as any)[this.domMoveStyle] = ''
        }
        this.moveNode.style.left = `${targetX}px`
        this.moveNode.style.top = `${targetY}px`

        this.cleanupMask(this.removeOnFinish)

        if (typeof this.config.callback === 'function') {
            this.config.callback()
        }
    }

    private stopRaf(): void {
        if (this.rafId) {
            this.cancelFrame(this.rafId)
            this.rafId = 0
        }
    }

    private cleanupMask(removeMoveNode: boolean): void {
        if (!this.maskLayerNode) {
            return
        }

        if (!removeMoveNode && this.moveNode.parentNode === this.maskLayerNode) {
            document.body.appendChild(this.moveNode)
        }

        if (this.maskLayerNode.parentNode) {
            this.maskLayerNode.parentNode.removeChild(this.maskLayerNode)
        }
        this.maskLayerNode = null
    }

    /** Stop the animation and clean the temporary mask layer. */
    destroy(): void {
        this.stopRaf()
        this.cleanupMask(this.removeOnFinish)
    }
}

// Static self reference, compatible with `new pkg.Bezier()`.
Bezier.Bezier = Bezier

export { Bezier }
export default Bezier
