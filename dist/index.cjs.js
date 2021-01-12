
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Bezier = /** @class */ (function () {
    function Bezier(config) {
        // 传进来的配置
        this.config = {
            sourceClassName: '',
            targetClassName: '',
            moveClassName: '',
            radian: 0.004,
            time: 1000,
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
        // 已知a, 根据抛物线函数 y = a*x*x + b*x + c 将抛物线起点平移到坐标原点[0, 0]，终点随之平移，那么抛物线经过原点[0, 0] 得出c = 0;
        // 终点平移后得出：y2-y1 = a*(x2 - x1)*(x2 - x1) + b*(x2 - x1)
        // 即 diffy = a*diffx*diffx + b*diffx;
        // 可求出常数b的值
        this.b =
            (this.diffy - this.radian * this.diffx * this.diffx) / this.diffx;
        this.moveNode.style.left = this.sourceNodeX + "px";
        this.moveNode.style.top = this.sourceNodeY + "px";
    }
    // 获取 目标节点、源节点、移动节点
    Bezier.prototype.getComponentFunction = function (selector) {
        return document.querySelector(selector);
    };
    // 确定动画方式
    Bezier.prototype.moveStyle = function () {
        var moveStyle = 'position';
        var testDiv = document.createElement('input');
        var placeholder = 'placeholder';
        if (placeholder in testDiv) {
            var browserTypeList = ['', 'ms', 'moz', 'webkit'];
            browserTypeList.forEach(function (pre) {
                var transform = pre + (pre ? 'T' : 't') + 'ransform';
                if (transform in testDiv.style) {
                    moveStyle = transform;
                }
            });
        }
        return moveStyle;
    };
    Bezier.prototype.move = function () {
        var _this = this;
        var start = new Date().getTime();
        var moveStyle = this.moveStyle();
        if (this.timer)
            return;
        this.moveNode.style.left = this.sourceNodeX + "px";
        this.moveNode.style.top = this.sourceNodeY + "px";
        this.moveNode.style[moveStyle] = 'translate(0px,0px)';
        this.timer = window.setInterval(function () {
            if (new Date().getTime() - start > _this.time) {
                _this.moveNode.style.left = _this.targetNodeX + "px";
                _this.moveNode.style.top = _this.targetNodeY + "px";
                typeof _this.config.callback === 'function' &&
                    _this.config.callback();
                window.clearInterval(_this.timer);
                _this.timer = null;
                return;
            }
            var x = _this.speedx * (new Date().getTime() - start);
            var y = _this.radian * x * x + _this.b * x;
            if (moveStyle === 'position') {
                _this.moveNode.style.left = x + _this.sourceNodeX + "px";
                _this.moveNode.style.top = y + _this.sourceNodeY + "px";
            }
            else {
                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(function () {
                        _this.moveNode.style[moveStyle] =
                            'translate(' + x + 'px,' + y + 'px)';
                    });
                }
                else {
                    _this.moveNode.style[moveStyle] =
                        'translate(' + x + 'px,' + y + 'px)';
                }
            }
        }, 15);
        return this;
    };
    return Bezier;
}());

exports.Bezier = Bezier;
