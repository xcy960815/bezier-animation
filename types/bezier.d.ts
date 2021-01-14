export interface Config {
    sourceClassName: string
    targetClassName: string
    moveClassName: string
    radian?: number
    time?: number
    callback?: () => void
}

export declare class Bezier {
    // 传进来的配置
    private config: Config

    private timer: number

    private b: number

    private radian: number

    private time: number

    private sourceNode!: HTMLElement
    private sourceNodeX: number
    private sourceNodeY: number

    private targetNode!: HTMLElement
    private targetNodeX: number
    private targetNodeY: number

    private moveNode!: HTMLElement

    private diffx: number
    private diffy: number

    private speedx: number

    constructor(config: Config)
    // 获取 目标节点、源节点、移动节点
    private static getComponentFunction(selector: string): HTMLElement | null
    // 确定动画方式
    static moveStyle(): string

    move(): void
}
