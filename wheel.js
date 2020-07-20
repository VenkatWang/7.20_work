// 无缝轮播图
// wins String 元素的选择器  要放入轮播图的窗口 选择器
// opts  json  实现轮播图的各种选项
// imgs  数组  要包含轮播图图片的数组
// links  数组  图片链接地址
// imgCOlor Array 图片的颜色，用于全屏显示的颜色拼接
// imgSize  数组  参数一：宽度  参数二：高度
// btnColor string  按钮颜色
// btnActive  string  获得焦点的按钮的颜色
// btnPos  数组  参数一：x轴位置  参数二：y轴位置

function wheel(wins, opts, runOpts) {
    // 参数的初始化
    var wins = document.querySelector(wins);
    if (!(wins && wins.nodeType == 1)) {
        console.error("窗口元素not find");
        return;
    }
    //图片的地址添加一个
    opts.imgs.push(opts.imgs[0]);
    //链接的地址添加一个
    opts.links.push(opts.links[0]);
    //颜色添加
    opts.imgColor.push(opts.imgColor[0]);

    var imgLength = opts.imgs.length;
    if (imgLength == 0) {
        console.error("没有传入相应的内容");
        return;
    }
    var imgSize = opts.imgSize;
    if (!(imgSize instanceof Array)) {
        console.error("请传入合法的尺寸类型");
    }
    if (imgSize.length == 0) {
        imgSize[0] = document.documentElement.clientWidth;
        imgSize[1] = 400;
    }
    if (imgSize.some(function (val) {
        return val == 0;
    })) {
        for (var i = 0; i < imgSize.length; i++) {
            if (imgSize[i] == 0) {
                imgSize[i] = 500;
            }
        }
    }
    var btnColor = opts.btnColor || "green";
    var btnActive = opts.btnActive || "red";
    var btnPos = opts.btnPos || ["center", "20"];

    var runOpts=runOpts||{};
    var time = 0;
    if (runOpts.time) {
        time = runOpts.time * 1000;
    } else{
        time = 5000;
    }

    var eachTime = 0;
    if (runOpts.eachTime) {
        eachTime = runOpts.eachTime * 1000;
    } else{
        eachTime = 500;
    }


    var runStyle = null;
    if (runOpts.runStyle == "Linear" || !(runOpts.runStyle)) {
        runStyle = Tween.Linear;
    } else if (runOpts.runStyle == "in") {
        runStyle = Tween.Quad.easeIn;
    } else if (runOpts.runStyle == "out") {
        runStyle = Tween.Quad.easeout;
    }

    // 创建HTML结构个样式
    // 1.wins样式
    wins.style.cssText = "width:100%;height:" + imgSize[1] + "px;overflow:hidden;position:relative";
    //添加容器
    var box = document.createElement("div");
    box.style.cssText = "width:" + imgLength * 100 + "%;height:100%;";
    wins.appendChild(box);

    //创建每一个轮播图
    for (var i = 0; i < imgLength; i++) {
        var divList = document.createElement("div");
        divList.style.cssText = `float:left;width:${100 / imgLength}%;height:100%;background:${opts.imgColor[i]}`;
        var link = document.createElement("a");
        link.href = opts.links[i];
        link.style.cssText = "width:" + imgSize[0] + "px;height:" + imgSize[1] + "px;display:block;margin:auto;background:url(" + opts.imgs[i] + ") no-repeat 0 0"
        divList.appendChild(link);
        box.appendChild(divList);
    }

    // 创建按钮
    var btnBox = document.createElement("div");
    btnBox.style.cssText = "width:300px;height:20px;position:absolute;left:0;right:0;margin:auto;bottom:" + btnPos[1] + "px;";
    var btns = [];

    for (var i = 0; i < imgLength - 1; i++) {
        var bgcolor = i == 0 ? btnActive : btnColor;

        var btn = document.createElement("div");
        btn.style.cssText = "width:20px;height:20px;background:" + bgcolor + ";border-radius:50%;margin:0 10px;cursor;pointer;float:left";
        btnBox.appendChild(btn);
        btns.push(btn);
    }

    wins.appendChild(btnBox);


    //进行轮播
    //获得窗口的对象，用他来获得每一次轮播的距离
    // var wins = document.getElementsByClassName("window")[0];
    //获得大的容器的对象
    // var box = document.getElementsByClassName("box")[0];
    //获取按钮的集合
    // var btns = document.querySelectorAll(".btns li");
    //获得轮播的运动的长度
    var winW = parseInt(getComputedStyle(wins, null).width);
    //自动轮播
    //轮播的初始位置
    var num = 0;
    //运动函数
    function move() {
        // 每一次轮播要加1
        num++;
        // 当运动到最后一张的处理逻辑
        if (num > btns.length - 1) {
            // 当运动完最后一张，需要及时回到第一张
            animate(box, {
                "margin-left": -num * winW
            },eachTime, runStyle, function () {
                box.style.marginLeft = 0;
            })
            // js 特性 单线程异步机制的语言
            // 用js 的单线程 模拟多线程状态
            // 将位置再回拨到第一张
            num = 0;
        } else {
            // 除了最后一张以外的运动方式
            animate(box, {
                "margin-left": -num * winW
            }, eachTime, runStyle)
        }
        // 按钮随着轮播的变化而变化
        for (var i = 0; i < btns.length; i++) {
            btns[i].style.background = btnColor;
        }
        btns[num].style.background = btnActive;
    }
    // 每隔3秒运动一次
    var t = setInterval(move, time);
    // 按钮轮播
    // 通过按钮进行切换
    for (let i = 0; i < btns.length; i++) {
        // 给每一个按钮添加事件
        btns[i].onclick = function () {
            num = i;//将当前点击的按钮和轮播的值进行关联
            animate(box, {
                // 点击的时候的运动方式
                "margin-left": -num * winW
            }, eachTime, runStyle)
            // 点击的时候，按钮的变化
            for (var j = 0; j < btns.length; j++) {
                btns[j].style.background = btnColor;
            }
            btns[num].style.background = btnActive;
        }
    }
    // 鼠标移入移出  事件里面最复杂的一个事件
    // 当鼠标移入的时候停止轮播
    wins.onmouseover = function () {
        clearInterval(t);
    }
    // 当鼠标离开时的时候继续动画
    wins.onmouseout = function () {
        t = setInterval(move, 3000)
    }

}

