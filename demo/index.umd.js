
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bezierAnimation = factory());
}(this, (function () { 'use strict';

    class Bezier {
        constructor(config) {
            // 传进来的配置
            this.config = {
                sourceClassName: '',
                targetClassName: '',
                moveClassName: '',
                radian: 0.004,
                time: 1000,
            };
            this.timer = 0;
            this.b = 0;
            this.radian = 0.004;
            this.time = 0;
            this.sourceNodeX = 0;
            this.sourceNodeY = 0;
            this.targetNodeX = 0;
            this.targetNodeY = 0;
            this.diffx = 0;
            this.diffy = 0;
            this.speedx = 0;
            this.config = config || {
                sourceClassName: '',
                targetClassName: '',
                moveClassName: '',
                radian: 0.004,
                time: 1000,
            };
            // 起点
            // @ts-ignore
            this.sourceNode =
                this.getComponentFunction(this.config.sourceClassName) || null;
            // 终点
            // @ts-ignore
            this.targetNode =
                this.getComponentFunction(this.config.targetClassName) || null;
            // 运动的元素
            // @ts-ignore
            this.moveNode =
                this.getComponentFunction(this.config.moveClassName) || null;
            // 曲线弧度
            this.radian = this.config.radian || 0.004;
            // 运动时间(ms)
            this.time = this.config.time || 1000;
            this.sourceNodeX = this.sourceNode.getBoundingClientRect().left;
            this.sourceNodeY = this.sourceNode.getBoundingClientRect().top;
            this.targetNodeX = this.targetNode.getBoundingClientRect().left;
            this.targetNodeY = this.targetNode.getBoundingClientRect().top;
            this.diffx = this.targetNodeX - this.sourceNodeX;
            this.diffy = this.targetNodeY - this.sourceNodeY;
            this.speedx = this.diffx / this.time;
            // 已知a, 根据抛物线函数 y = a*x*x + b*x + c 将抛物线起点平移到坐标原点[0, 0]，终点随之平移，那么抛物线经过原点[0, 0] 得出c = 0;
            // 终点平移后得出：y2-y1 = a*(x2 - x1)*(x2 - x1) + b*(x2 - x1)
            // 即 diffy = a*diffx*diffx + b*diffx;
            // 可求出常数b的值
            this.b =
                (this.diffy - this.radian * this.diffx * this.diffx) / this.diffx;
            // 让需要移动的节点 初始化在出发点的位置上
            this.moveNode.style.position = 'absolute';
            this.moveNode.style.left = `${this.sourceNodeX}px`;
            this.moveNode.style.top = `${this.sourceNodeY}px`;
        }
        // 获取 目标节点、源节点、移动节点
        getComponentFunction(selector) {
            return document.querySelector(selector);
        }
        // 确定动画方式(兼容各个浏览器的运动方法)
        handleMarkSureDomMoveStyle() {
            let domMoveStyle = 'position';
            const inputNode = document.createElement('input');
            const placeholder = 'placeholder';
            if (placeholder in inputNode) {
                const browserTypeList = ['', 'ms', 'moz', 'webkit'];
                browserTypeList.forEach((pre) => {
                    const transform = pre + (pre ? 'T' : 't') + 'ransform';
                    if (transform in inputNode.style) {
                        domMoveStyle = transform;
                    }
                });
            }
            return domMoveStyle;
        }
        move() {
            if (this.timer)
                return; //必须等每一个动画结束之后才能进行新的动画
            const startTime = new Date().getTime();
            const domMoveStyle = this.handleMarkSureDomMoveStyle();
            // 记录运动节点的初始位置
            this.moveNode.style.left = `${this.sourceNodeX}px`;
            this.moveNode.style.top = `${this.sourceNodeY}px`;
            const moveNodeStyle = this.moveNode.style;
            moveNodeStyle[domMoveStyle] = 'translate(0px,0px)';
            let maskLayerNode;
            // 创建全局遮罩层，这是在开启跨节点使用的时候
            maskLayerNode = document.createElement('div');
            maskLayerNode.style.position = 'absolute';
            maskLayerNode.style.zIndex = '99';
            maskLayerNode.style.top = '0px';
            maskLayerNode.style.bottom = '0px';
            maskLayerNode.style.right = '0px';
            maskLayerNode.style.left = '0px';
            maskLayerNode.appendChild(this.moveNode);
            document.body.appendChild(maskLayerNode);
            this.timer = window.setInterval(() => {
                const endTime = new Date().getTime();
                // 判断动画是否完成 判断依据就是 当前时间减去 开始时间 是否大于运动所需总时长
                if (endTime - startTime > this.time) {
                    typeof this.config.callback === 'function' &&
                        this.config.callback();
                    window.clearInterval(this.timer);
                    this.timer = 0;
                    this.moveNode.style.left = `${this.targetNodeX}px`;
                    this.moveNode.style.top = `${this.targetNodeY}px`;
                    maskLayerNode.removeChild(this.moveNode);
                    document.body.removeChild(maskLayerNode);
                    return;
                }
                const x = this.speedx * (endTime - startTime);
                const y = this.radian * x * x + this.b * x;
                if (domMoveStyle === 'position') {
                    this.moveNode.style.left = `${x + this.sourceNodeX}px`;
                    this.moveNode.style.top = `${y + this.sourceNodeY}px`;
                }
                else {
                    const moveNodeStyle = this.moveNode.style;
                    if (window.requestAnimationFrame) {
                        window.requestAnimationFrame(() => {
                            moveNodeStyle[domMoveStyle] = `translate(${x}px,${y}px)`;
                        });
                    }
                    else {
                        moveNodeStyle[domMoveStyle] = `translate(${x}px,${y}px)`;
                    }
                }
            }, 15);
        }
    }
    var index = {
        Bezier,
    };

    return index;

})));
