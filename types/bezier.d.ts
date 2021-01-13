export interface Config {
    sourceClassName: string
    targetClassName: string
    moveClassName: string
    radian?: number
    time?: number
    callback?: () => void
}

export declare class BezierInterface {
    // 传进来的配置
    config: Config

    timer: number

    b: number

    radian: number

    time: number

    sourceNode: HTMLElement
    sourceNodeX: number
    sourceNodeY: number

    targetNode: HTMLElement
    targetNodeX: number
    targetNodeY: number

    moveNode: HTMLElement

    diffx: number
    diffy: number

    speedx: number

    constructor(config: Config)
    // 获取 目标节点、源节点、移动节点
    static getComponentFunction(selector: string): HTMLElement
    // 确定动画方式
    static moveStyle(): string

    move(): this
}
