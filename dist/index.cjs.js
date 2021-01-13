
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Bezier = /** @class */ (function () {
    // 是否跨节点使用
    // multiNode: boolean = false
    function Bezier(config) {
        // 传进来的配置
        this.config = {
            sourceClassName: '',
            targetClassName: '',
            moveClassName: '',
            radian: 0.004,
            time: 1000,
            multiNode: false,
        };
        this.timer = null;
        this.b = 0;
        this.radian = 0.004;
        this.time = 0;
        this.sourceNode = null;
        this.sourceNodeX = null;
        this.sourceNodeY = null;
        this.targetNode = null;
        this.targetNodeX = null;
        this.targetNodeY = null;
        this.moveNode = null;
        this.diffx = null;
        this.diffy = null;
        this.speedx = null;
        this.config = config || {
            sourceClassName: '',
            targetClassName: '',
            moveClassName: '',
            radian: 0.004,
            time: 1000,
        };
        // 起点
        this.sourceNode =
            this.getComponentFunction(this.config.sourceClassName) || null;
        // 终点
        this.targetNode =
            this.getComponentFunction(this.config.targetClassName) || null;
        // 运动的元素
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
        // this.multiNode = this.config.multiNode || false
        // 已知a, 根据抛物线函数 y = a*x*x + b*x + c 将抛物线起点平移到坐标原点[0, 0]，终点随之平移，那么抛物线经过原点[0, 0] 得出c = 0;
        // 终点平移后得出：y2-y1 = a*(x2 - x1)*(x2 - x1) + b*(x2 - x1)
        // 即 diffy = a*diffx*diffx + b*diffx;
        // 可求出常数b的值
        this.b =
            (this.diffy - this.radian * this.diffx * this.diffx) / this.diffx;
        // 让需要移动的节点 在出发点的位置上
        this.moveNode.style.position = 'absolute';
        this.moveNode.style.left = this.sourceNodeX + "px";
        this.moveNode.style.top = this.sourceNodeY + "px";
    }
    // 获取 目标节点、源节点、移动节点
    Bezier.prototype.getComponentFunction = function (selector) {
        return document.querySelector(selector);
    };
    // 确定动画方式(兼容各个浏览器的运动方法)
    Bezier.prototype.handleMarkSureDomMoveStyle = function () {
        var domMoveStyle = 'position';
        var inputNode = document.createElement('input');
        var placeholder = 'placeholder';
        if (placeholder in inputNode) {
            var browserTypeList = ['', 'ms', 'moz', 'webkit'];
            browserTypeList.forEach(function (pre) {
                var transform = pre + (pre ? 'T' : 't') + 'ransform';
                if (transform in inputNode.style) {
                    domMoveStyle = transform;
                }
            });
        }
        return domMoveStyle;
    };
    Bezier.prototype.move = function () {
        var _this = this;
        if (this.timer)
            return; //必须等每一个动画结束之后才能进行新的动画
        var startTime = new Date().getTime();
        var domMoveStyle = this.handleMarkSureDomMoveStyle();
        // 记录运动节点的初始位置
        this.moveNode.style.left = this.sourceNodeX + "px";
        this.moveNode.style.top = this.sourceNodeY + "px";
        this.moveNode.style[domMoveStyle] = 'translate(0px,0px)';
        var maskLayerNode;
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
        this.timer = window.setInterval(function () {
            var endTime = new Date().getTime();
            // 判断动画是否完成 判断依据就是 当前时间减去 开始时间 是否大于运动所需总时长
            if (endTime - startTime > _this.time) {
                typeof _this.config.callback === 'function' &&
                    _this.config.callback();
                window.clearInterval(_this.timer);
                _this.timer = null;
                _this.moveNode.style.left = _this.targetNodeX + "px";
                _this.moveNode.style.top = _this.targetNodeY + "px";
                maskLayerNode.removeChild(_this.moveNode);
                document.body.removeChild(maskLayerNode);
                return;
            }
            var x = _this.speedx * (endTime - startTime);
            var y = _this.radian * x * x + _this.b * x;
            if (domMoveStyle === 'position') {
                _this.moveNode.style.left = x + _this.sourceNodeX + "px";
                _this.moveNode.style.top = y + _this.sourceNodeY + "px";
            }
            else {
                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(function () {
                        _this.moveNode.style[domMoveStyle] = "translate(" + x + "px," + y + "px)";
                    });
                }
                else {
                    _this.moveNode.style[domMoveStyle] = "translate(" + x + "px," + y + "px)";
                }
            }
        }, 15);
        // return this
    };
    return Bezier;
}());

exports.Bezier = Bezier;
