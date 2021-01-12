/**
 * js抛物线动画
 * @param  {[object]} sourceClassName [起点元素]
 * @param  {[object]} targetClassName [目标点元素]
 * @param  {[object]} moveClassName [要运动的元素]
 * @param  {[number]} radian [抛物线弧度]
 * @param  {[number]} time [动画执行时间]
 * @param  {[function]} callback [抛物线执行完成后回调]
 */
import { Config } from '../types/bezier'

export class Bezier {
    // 传进来的配置
    config: Config = {
        sourceClassName: '',
        targetClassName: '',
        moveClassName: '',
        radian: 0.004,
        time: 1000,
    }

    timer: number = null

    b: number = 0

    radian: number = 0.004

    time: number = 0

    sourceNode: HTMLElement = null
    sourceNodeX: number = null
    sourceNodeY: number = null

    targetNode: HTMLElement = null
    targetNodeX: number = null
    targetNodeY: number = null

    moveNode: HTMLElement = null

    diffx: number = null
    diffy: number = null

    speedx: number = null

    constructor(config: Config) {
        this.config = config || {
            sourceClassName: '',
            targetClassName: '',
            moveClassName: '',
            radian: 0.004,
            time: 1000,
        }
        // 起点
        this.sourceNode =
            this.getComponentFunction(this.config.sourceClassName) || null

        // 终点
        this.targetNode =
            this.getComponentFunction(this.config.targetClassName) || null

        // 运动的元素
        this.moveNode =
            this.getComponentFunction(this.config.moveClassName) || null

        // 曲线弧度
        this.radian = this.config.radian || 0.004

        // 运动时间(ms)
        this.time = this.config.time || 1000

        this.sourceNodeX = this.sourceNode.getBoundingClientRect().left
        this.sourceNodeY = this.sourceNode.getBoundingClientRect().top

        this.targetNodeX = this.targetNode.getBoundingClientRect().left
        this.targetNodeY = this.targetNode.getBoundingClientRect().top

        this.diffx = this.targetNodeX - this.sourceNodeX
        this.diffy = this.targetNodeY - this.sourceNodeY

        this.speedx = this.diffx / this.time

        // 已知a, 根据抛物线函数 y = a*x*x + b*x + c 将抛物线起点平移到坐标原点[0, 0]，终点随之平移，那么抛物线经过原点[0, 0] 得出c = 0;
        // 终点平移后得出：y2-y1 = a*(x2 - x1)*(x2 - x1) + b*(x2 - x1)
        // 即 diffy = a*diffx*diffx + b*diffx;
        // 可求出常数b的值
        this.b =
            (this.diffy - this.radian * this.diffx * this.diffx) / this.diffx

        this.moveNode.style.left = `${this.sourceNodeX}px`
        this.moveNode.style.top = `${this.sourceNodeY}px`
    }
    // 获取 目标节点、源节点、移动节点
    getComponentFunction(selector: string): HTMLElement {
        return document.querySelector(selector)
    }
    // 确定动画方式
    moveStyle(): string {
        let moveStyle = 'position'
        const testDiv = document.createElement('input')
        const placeholder = 'placeholder'
        if (placeholder in testDiv) {
            const browserTypeList: Array<string> = ['', 'ms', 'moz', 'webkit']
            browserTypeList.forEach((pre) => {
                const transform: string = pre + (pre ? 'T' : 't') + 'ransform'
                if (transform in testDiv.style) {
                    moveStyle = transform
                }
            })
        }
        return moveStyle
    }

    move(): this {
        const start: number = new Date().getTime()
        const moveStyle = this.moveStyle()
        if (this.timer) return
        this.moveNode.style.left = `${this.sourceNodeX}px`
        this.moveNode.style.top = `${this.sourceNodeY}px`
        this.moveNode.style[moveStyle] = 'translate(0px,0px)'
        this.timer = window.setInterval(() => {
            if (new Date().getTime() - start > this.time) {
                this.moveNode.style.left = `${this.targetNodeX}px`
                this.moveNode.style.top = `${this.targetNodeY}px`
                typeof this.config.callback === 'function' &&
                    this.config.callback()
                window.clearInterval(this.timer)
                this.timer = null
                return
            }
            const x: number = this.speedx * (new Date().getTime() - start)
            const y: number = this.radian * x * x + this.b * x
            if (moveStyle === 'position') {
                this.moveNode.style.left = `${x + this.sourceNodeX}px`
                this.moveNode.style.top = `${y + this.sourceNodeY}px`
            } else {
                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(() => {
                        this.moveNode.style[moveStyle] =
                            'translate(' + x + 'px,' + y + 'px)'
                    })
                } else {
                    this.moveNode.style[moveStyle] =
                        'translate(' + x + 'px,' + y + 'px)'
                }
            }
        }, 15)
        return this
    }
}
