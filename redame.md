安装：npm install bezier-animation-plus --save
使用：import bezierAnimationPlus from "bezier-animation-plus"

此库是本人从网上找的一个 demo，但是那个 demo 只考虑同一个节点内贝塞尔曲线的动画，本人在不同节点的使用场景中发现位置计算和最终位置有些偏差，或者因为某些节点特殊的 css 样式 导致样式定位出错 故写了此库，并用 ts 重写此库，大的实现原理依旧没变，但是加了一个全局遮罩层（用户感知不到），修复了在不同节点使用的场景下位置发生偏差的问题
