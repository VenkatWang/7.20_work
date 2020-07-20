function wheel(wins, opts, runOpts) {
    //初始化参数
    this.init(wins, opts, runOpts);
    // 获取窗口
    this.getWin();
    //创建盒子
    this.createBox();
    //创建轮播列表
    this.createList();
    //创建按钮
    this.createBtn();
    //自动轮播
    this.autoRun();
    //点击播放
    this.clickRun();
    //鼠标移入移出
    this.mouse();
}

wheel.prototype = {
    init(wins, opts, runOpts) {
        this.wins = wins;
        this.opts = opts;
        this.runOpts = runOpts;
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

        this.imgLength = opts.imgs.length;
        if (this.imgLength == 0) {
            console.error("没有传入相应的内容");
            return;
        }
        this.imgSize = opts.imgSize;
        if (!(this.imgSize instanceof Array)) {
            console.error("请传入合法的尺寸类型");
        }
        if (this.imgSize.length == 0) {
            this.imgSize[0] = document.documentElement.clientWidth;
            this.imgSize[1] = 400;
        }
        if (this.imgSize.some(function (val) {
            return val == 0;
        })) {
            for (var i = 0; i < imgSize.length; i++) {
                if (this.imgSize[i] == 0) {
                    this.imgSize[i] = 500;
                }
            }
        }
        this.btnColor = opts.btnColor || "green";
        this.btnActive = opts.btnActive || "red";
        this.btnPos = opts.btnPos || ["center", "20"];

        this.runOpts = runOpts || {};
        this.time = 0;
        if (runOpts.time) {
            this.time = runOpts.time * 1000;
        } else {
            this.time = 5000;
        }

        this.eachTime = 0;
        if (runOpts.eachTime) {
            this.eachTime = runOpts.eachTime * 1000;
        } else {
            this.eachTime = 500;
        }


        this.runStyle = null;
        if (runOpts.runStyle == "Linear" || !(runOpts.runStyle)) {
            this.runStyle = Tween.Linear;
        } else if (runOpts.runStyle == "in") {
            this.runStyle = Tween.Quad.easeIn;
        } else if (runOpts.runStyle == "out") {
            this.runStyle = Tween.Quad.easeout;
        }
    },
    getWin() {
        this.wins.style.cssText = "width:100%;height:" + this.imgSize[1] + "px;overflow:hidden;position:relative;";
    },
    createBox() {
        this.box = document.createElement("div");
        this.box.style.cssText = "width:" + this.imgLength * 100 + "%;height:100%;";
        this.wins.appendChild(this.box);
    },
    createList() {
        for (var i = 0; i < imgLength; i++) {
            var divList = document.createElement("div");
            divList.style.cssText = `float:left;width:${100 / this.imgLength}%;height:100%;background:${this.opts.imgColor[i]}`;
            var link = document.createElement("a");
            link.href = this.opts.links[i];
            link.style.cssText = "width:" + this.imgSize[0] + "px;height:" + this.imgSize[1] + "px;display:block;margin:auto;background:url(" + this.opts.imgs[i] + ") no-repeat 0 0"
            divList.appendChild(link);
            this.box.appendChild(divList);
        }
    },
    createBtn() {
        var btnBox = document.createElement("div");
        btnBox.style.cssText = "width:300px;height:20px;position:absolute;left:0;right:0;margin:auto;bottom:" + this.btnPos[1] + "px;";
        this.btns = [];

        for (var i = 0; i < this.imgLength - 1; i++) {
            var bgcolor = i == 0 ? this.btnActive : this.btnColor;

            var btn = document.createElement("div");
            btn.style.cssText = "width:20px;height:20px;background:" + bgcolor + ";border-radius:50%;margin:0 10px;cursor;pointer;float:left";
            btnBox.appendChild(btn);
            this.btns.push(btn);
        }

        this.wins.appendChild(btnBox);
    },
    autoRun() {
        var winW = parseInt(getComputedStyle(this.wins, null).width);
        //自动轮播
        //轮播的初始位置
        var num = 0;
        //运动函数
        function move() {
            // 每一次轮播要加1
            num++;
            // 当运动到最后一张的处理逻辑
            if (num > this.btns.length - 1) {
                // 当运动完最后一张，需要及时回到第一张
                animate(this.box, {
                    "margin-left": -num * winW
                }, this.eachTime, this.runStyle, function () {
                    this.box.style.marginLeft = 0;
                })
                // js 特性 单线程异步机制的语言
                // 用js 的单线程 模拟多线程状态
                // 将位置再回拨到第一张
                num = 0;
            } else {
                // 除了最后一张以外的运动方式
                animate(this.box, {
                    "margin-left": -num * winW
                }, this.eachTime, this.runStyle)
            }
            // 按钮随着轮播的变化而变化
            for (var i = 0; i < this.btns.length; i++) {
                this.btns[i].style.background = this.btnColor;
            }
            this.btns[num].style.background = this.btnActive;
        }
        // 每隔3秒运动一次
        var t = setInterval(move, this.time);
    },
    clickRun() {
        for (let i = 0; i < this.btns.length; i++) {
            // 给每一个按钮添加事件
            this.btns[i].onclick = function () {
                num = i;//将当前点击的按钮和轮播的值进行关联
                animate(this.box, {
                    // 点击的时候的运动方式
                    "margin-left": -num * winW
                }, this.eachTime, this.runStyle)
                // 点击的时候，按钮的变化
                for (var j = 0; j < this.btns.length; j++) {
                    this.btns[j].style.background = this.btnColor;
                }
                this.btns[num].style.background = this.btnActive;
            }
        }
    },
    mouse() {
        this.wins.onmouseover = function () {
            clearInterval(t);
        }
        // 当鼠标离开时的时候继续动画
        this.wins.onmouseout = function () {
            t = setInterval(move, 3000)
        }
    }

}











// function wheel(wins, opts, runOpts) {
    // 参数的初始化

    // 创建HTML结构个样式
    // 1.wins样式

    //添加容器


    //创建每一个轮播图


    // 创建按钮



    //进行轮播
    //获得窗口的对象，用他来获得每一次轮播的距离
    // var wins = document.getElementsByClassName("window")[0];
    //获得大的容器的对象
    // var box = document.getElementsByClassName("box")[0];
    //获取按钮的集合
    // var btns = document.querySelectorAll(".btns li");
    //获得轮播的运动的长度

    // 按钮轮播
    // 通过按钮进行切换

    // 鼠标移入移出  事件里面最复杂的一个事件
    // 当鼠标移入的时候停止轮播


// }

