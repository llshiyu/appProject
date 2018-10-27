// 双击dblclick事件
document.addEventListener('dblclick', function (e) {
    e.preventDefault();
});
/***************全局变量***************/
var canvasWidth = document.getElementById("pack").offsetWidth;//画布的宽
// var canvasHeight=650;//画布的高
var canvasHeight = document.getElementById("pack").offsetHeight;//画布的高

var DME = 0;//点击操作
var DME_x = 0;//重力感应左右值
var coefficient = 1;


var u = navigator.userAgent;
if (/(Android)/i.test(u)) { //Android
    coefficient = 1;
} else if (/(iPhone|iPad|iPod|iOS)/i.test(u)) {  //ios
    coefficient = -1;
}
// var DME_y = 0 ;
// var DME_z = 0;
//添加重力感应操作
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', deviceMotionHandler, false);
}

/**
 * 重力感应
 * @param eventData
 */
function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;
    DME_x = acceleration.x * coefficient;
    // DME_y = acceleration.y;
    // DME_z = acceleration.z;
}


var canvas = document.getElementById('canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var ctx = canvas.getContext('2d');

var gameSpeed = 40;//游戏速度

const PHASE_DOWNLOAD = 1;//图片下载阶段
const PHASE_READY = 2;  //就绪阶段
const PHASE_LOADING = 3; //游戏加载阶段
const PHASE_PLAY = 4;  //游戏进行阶段
const PHASE_PAUSE = 5;  //游戏暂停阶段
const PHASE_GAMEOVER = 6; //游戏结束阶段

var curPhase = PHASE_DOWNLOAD; // 游戏状态

var heroCount = 0; //剩余英雄可用的数量
var heroScore = 0; //英雄的得分
var score = document.getElementById('score'); // 分数
var HP = document.getElementById('HP'); // 命
var surplusTime = document.getElementById('surplusTime'); // 时间
var gameOver = document.getElementById('gameOver');
var btn = document.getElementById('btn');
var Pause = document.getElementById('Pause');
var bigB = document.getElementById('bigB');
var bgMusic = document.getElementById('bgMusic'); // 背景音乐   可以不这么引用，直接用ID也可以找到

//游戏所需图片对象
var imgBackground;
var imgBullet1;
var imgBullet2;
var enemyBullet; // 子弹图
var clickCartridge = 0;//子弹数量
var imgsEnemy1 = [];  //小号敌机的所有图片
var imgsEnemy2 = [];  //中号敌机的所有图片
var imgsEnemy3 = [];  //大号敌机的所有图片
var imgsGameLoading = []; //游戏加载中所有图片
// var imgGamepauseNor; //暂停图片
var imgsHero = [];  //英雄所有的图片
var imgStart;  //就绪所有图片
var isBig = false;
var hero; // 我方英雄
var bulletList; //子弹列表对象，其中保存着当前的所有子弹
var bulletList_plane; //敌方子弹列表对象，其中保存着当前的所有子弹
var enemyList; //所有敌机组成的列表
var sky;  //天空对象
var logo;
var audio_1;
var audio_2;
var execution = 0; //绘制当前得分和剩余英雄数量
var mainCore; // 保持启动状态的定时器
//var loading = new Loading(imgsGameLoading);
var loading; // 加载

download();  //开始下载图片

/**
 * 点按钮开始游戏
 * @param e
 * @param sd  难度-游戏速度
 */
function beginGame(e, sd) {//鼠标移除
    bgMusic.play();
    clearInterval(mainCore);
    gameSpeed = sd;
    startEngine(); //启动整个游戏的主引擎--保持启动状态的定时器
    if (curPhase === PHASE_READY || curPhase === PHASE_GAMEOVER) {//就绪阶段进入加载阶段

        curPhase = PHASE_LOADING;
        surplusTime.innerHTML = 60;
        heroScore = 0; //英雄的得分
        score.innerHTML = heroScore;
        heroCount = 3; //剩余英雄可用的数量
        bigB.style.display = 'none';
        isBig = false;
        HP.style.backgroundImage = 'url(./imgs/Hp000' + heroCount + '.png)';
        document.getElementById('startPages').style.display = 'none';
        document.getElementById('operate').style.display = 'block';
        document.getElementById('gameOver').style.display = 'none';
        btn.style.display = 'block';
        loading = new Loading(imgsGameLoading);//创建loading对象
    }

}

/**
 * 展示首页的提示框
 */
function hintGame() {
    document.getElementById('hintImg').style.display = 'block';
}

/**
 * 隐藏首页的提示框
 */
function closeHint() {
    document.getElementById('hintImg').style.display = 'none';
}

/**
 * 是否加大飞机
 * @param e
 */
function isBigChange(e) {
    if (curPhase === PHASE_PLAY && e) {
        bigB.style.display = 'block';
        isBig = true;
    } else if (curPhase === PHASE_PLAY && !e) {
        bigB.style.display = 'none';
        isBig = false;
    }
}

/**
 * 开始或暂停
 * @param e
 */
function playOrPause(e) {
    if (curPhase === PHASE_PAUSE && e) {
        curPhase = PHASE_PLAY;
        Pause.style.display = 'none'
    } else if (curPhase === PHASE_PLAY && !e) {
        curPhase = PHASE_PAUSE;
        Pause.style.display = 'block'
    }
}

/***********************阶段1：下载图片************************/
document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    console.log(e.keyCode);
    if (curPhase == PHASE_PLAY && e.keyCode == 32) { // 按的是空格
        clickCartridge += 1;
    } else if (curPhase == PHASE_PLAY && e.keyCode == 37) { // 按的是左箭头
        DME = 2;
    } else if (curPhase == PHASE_PLAY && e.keyCode == 39) { // 按的是右箭头
        DME = -2;
    }
};
document.onkeyup = function (event) {
    DME = 0;
};

/**
 * 发射子弹
 */
function clickPause() {
    if (curPhase == PHASE_PLAY) {
        clickCartridge += 1;
    }
}

/**
 * 左移
 * @param e
 */
function mLeft(e) {
    if (e) {
        DME = 2;
    } else {
        DME = 0;
    }
}

/**
 * 右移
 * @param e
 */
function mRight(e) {
    if (e) {
        DME = -2;
    } else {
        DME = 0;
    }
}

/**
 * 子弹声音
 */
function playShot() {
    var audio = document.createElement("audio");
    audio.src = "mp3/s1_1.mp3";
    audio.play();
}

/**
 * 炸裂声音
 */
function playDynamite() {
    var audio = document.createElement("audio");
    audio.src = "mp3/s2_2.mp3";
    audio.play();
}

/**
 * 下载图片
 */
function download() {
    var progress = 0; //下载进度:共有33张   ，每张进度权重算3，背景图权重算4
    ctx.font = '80px Helvetica';  //加载进度的字体
    ctx.fillStyle = "#eee";

    function drawProgress() { //每次加载完成一张图片，都要绘制一次进度
        ctx.clearRect(0, 0, canvasWidth, canvasHeight); //清除原有的字体
        var txt = progress > 100 ? '100%' : progress + '%';
        var w = ctx.measureText(txt).width;
        ctx.fillText(txt, canvasWidth / 2 - w / 2, canvasHeight / 2 + 80 / 2);
        ctx.strokeText(txt, canvasWidth / 2 - w / 2, canvasHeight / 2 + 80 / 2);
        if (progress > 100) {//图片加载完成,开始游戏。
            document.getElementById('startPages').style.display = 'block';
            startGame();
        }
    }

    /****背景图*****/
    imgBackground = new Image(); //每次加载完都会绘制一次图片
    imgBackground.src = 'imgs/bg-img.png';
    imgBackground.onload = function () { //背景图片加载完场
        progress += 6;
        drawProgress();
    };
    /******右侧我方子弹大小选择图*******/
    imgBullet1 = new Image(); // 小号子弹图加载完成
    imgBullet1.src = 'imgs/Bullet0001.png';
    imgBullet1.onload = function () {
        progress += 3;
        drawProgress();
    };
    imgBullet2 = new Image(); //大号子弹图加载完成
    imgBullet2.src = 'imgs/Bullet0002.png';
    imgBullet2.onload = function () {
        progress += 3;
        drawProgress();
    };
    /******敌方子弹图*******/
    enemyBullet = new Image(); //子弹加载完成
    enemyBullet.src = 'imgs/enemyBullet.png';
    enemyBullet.onload = function () {
        progress += 6;
        drawProgress();
    };
    /************小号敌机加载***************/
    imgsEnemy1[0] = new Image(); // 小号敌机加载完成
    imgsEnemy1[0].src = 'imgs/Plane0001.png';
    imgsEnemy1[0].onload = function () {
        progress += 6;
        drawProgress();
    };
    imgsEnemy1[1] = new Image();  // 小号敌机加载完成
    imgsEnemy1[1].src = 'imgs/Plane0004.png';
    imgsEnemy1[1].onload = function () {
        progress += 6;
        drawProgress();
    };
    /************中号敌机加载***************/
    imgsEnemy2[0] = new Image(); //中号敌机加载完成
    imgsEnemy2[0].src = 'imgs/Plane0002.png';
    imgsEnemy2[0].onload = function () {
        progress += 7;
        drawProgress();
    };
    imgsEnemy2[1] = new Image(); //中号敌机加载完成
    imgsEnemy2[1].src = 'imgs/Plane0004.png';
    imgsEnemy2[1].onload = function () {
        progress += 7;
        drawProgress();
    };
    /***********大号敌机加载*************/
    imgsEnemy3[0] = new Image();
    imgsEnemy3[0].src = 'imgs/Plane0003.png';
    imgsEnemy3[0].onload = function () {
        progress += 7;
        drawProgress();
    };
    imgsEnemy3[1] = new Image();
    imgsEnemy3[1].src = 'imgs/Plane0004.png';
    imgsEnemy3[1].onload = function () {
        progress += 6;
        drawProgress();
    };

    /***************游戏加载*********************/
    imgsGameLoading[0] = new Image();
    imgsGameLoading[0].src = 'imgs/game_loading1.png';
    imgsGameLoading[0].onload = function () {
        progress += 7;
        drawProgress();
    };
    imgsGameLoading[1] = new Image();
    imgsGameLoading[1].src = 'imgs/game_loading2.png';
    imgsGameLoading[1].onload = function () {
        progress += 6;
        drawProgress();
    };
    imgsGameLoading[2] = new Image();
    imgsGameLoading[2].src = 'imgs/game_loading3.png';
    imgsGameLoading[2].onload = function () {
        progress += 6;
        drawProgress();
    };
    imgsGameLoading[3] = new Image();
    imgsGameLoading[3].src = 'imgs/game_loading4.png';
    imgsGameLoading[3].onload = function () {
        progress += 6;
        drawProgress();
    };

    /**********hero 本机****************/
    imgsHero[0] = new Image();
    imgsHero[0].src = 'imgs/player0001.png';
    imgsHero[0].onload = function () {
        progress += 6;
        drawProgress();
    };
    imgsHero[1] = new Image();
    imgsHero[1].src = 'imgs/player0002.png';
    imgsHero[1].onload = function () {
        progress += 6;
        drawProgress();
    };
    imgsHero[2] = new Image();
    imgsHero[2].src = 'imgs/pong.png';
    imgsHero[2].onload = function () {
        progress += 7;
        drawProgress();
    }
}


/**********************阶段2：就绪**************/
/**
 * 开始游戏
 */
function startGame() {
    curPhase = PHASE_READY;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); //清除原有的字体
    sky = new Sky(imgBackground);  //创建天空对象
    // sky.draw();
    // sky.move();
    // logo=new Logo(imgStart);
    // startEngine(); //启动整个游戏的主引擎--保持启动状态的定时器
}

/**
 * //天空的构造函数--使用两张图片的轮换， 类似图片轮播
 * @param img
 * @constructor
 */
function Sky(img) {
    this.x1 = 0; //初始时第一张背景图的坐标
    this.y1 = 0;

    this.x2 = 0; //初始时第二张背景图的坐标
    this.y2 = -img.height;

    this.draw = function () {//绘制天空对象,会自动覆盖已有的画面，无需清除
        ctx.drawImage(img, this.x1, this.y1);
        ctx.drawImage(img, this.x2, this.y2);
    };
    this.move = function () {//移动天空对象
        this.y1++; //图片坐标下移
        this.y2++;
        if (this.y1 >= canvasHeight) {//第一张图片移除画布
            this.y1 = this.y2 - img.height;
        }
        if (this.y2 >= canvasHeight) {//第二张图片移除画布
            this.y2 = this.y1 - img.height;
        }
    }
}

/*function Logo(img){
	this.x=canvasWidth/2-img.width/2;
	this.y=canvasHeight/2-img.height/2;
	this.draw=function(){
		ctx.drawImage(img,this.x,this.y);
	}
}*/

/*******************阶段3：加载中**************************/

/**
 * 加载所有图片
 * @param imgs
 * @constructor
 */
function Loading(imgs) {
    this.x = 0;
    this.y = canvasHeight - imgs[0].height;
    this.index = 0;//当前要绘制的是数组中de图片的下标

    this.draw = function () {
        ctx.drawImage(imgs[this.index], this.x, this.y);
    };
    this.counter = 0;//记录move函数调用的次数
    this.move = function () {
        this.counter++;//只有当move被调用的额时候counter+1
        if (this.counter % 6 === 0) {
            this.index++;//绘制下一张图片
            if (this.index >= imgs.length) {//所有图片比方完成 ，进入下一阶段
                curPhase = PHASE_PLAY;
                //进入游戏，可以创建我方英雄
                hero = new Hero(imgsHero);
                bulletList = new BulletList(); //子弹列表对象，其中保存着当前的所有子弹
                bulletList_plane = new BulletList_plane(); //敌方子弹列表对象，其中保存着当前的所有子弹
                enemyList = new EnemyList(); //所有敌机组成的列表
            }

        }
    }
}

/*******************阶段4：游戏进行中**************************/

/**
 * //我方英雄构造方法
 * @param imgs
 * @constructor
 */
function Hero(imgs) {
    //我方飞机开始出现在屏幕下方中央
    this.x = canvasWidth / 2 - imgs[0].width / 2;
    this.y = canvasHeight - imgs[0].height;
    this.crashed = false; //当前是否开始撞毁程序

    this.width = imgs[0].width;
    this.height = imgs[0].height;
    this.index = 0;//待绘制的是数组中的哪个图片

    this.draw = function () {
        ctx.drawImage(imgs[this.index], this.x, this.y);
    };
    this.counter = 0;
    this.move = function () {
        this.counter++;
        if (DME && DME > 1) {//左移动
            this.x = this.x - 15 > this.width / 2 * (-1) ? this.x - 15 : this.x;
        } else if (DME && DME < -1) {//右移动
            this.x = this.x + 15 < canvasWidth - this.width / 2 ? this.x + 15 : this.x
        }
        if (!DME && DME_x && DME_x > 1) {//左移动
            this.x = this.x - 15 > this.width / 2 * (-1) ? this.x - 15 : this.x;
        } else if (!DME && DME_x && DME_x < -1) {//右移动
            this.x = this.x + 15 < canvasWidth - this.width / 2 ? this.x + 15 : this.x
        }

        if (this.counter % 2 == 0) {
            if (!this.crashed) {
                this.index = 0;
            } else {//开始撞毁程序2-3-4
                if (this.index === 0 || this.index == 1) {
                    this.index = 2;
                } else if (this.index < imgs.length - 1) {
                    this.index++;
                } else {//坠毁程序结束，血格要-1，创建新英雄
                    heroCount--;
                    if (heroCount > 0) {//英雄>0,说明还有英雄
                        HP.style.backgroundImage = 'url(./imgs/Hp000' + heroCount + '.png)';
                        hero = new Hero(imgsHero);
                    } else {//血格用完
                        curPhase = PHASE_GAMEOVER;
                        HP.style.backgroundImage = '';
                    }
                }

            }
        }
        //边移动边发射子弹
        if (clickCartridge > 0 && this.counter % 5 == 0) {//此处的10指定每两发子弹的间隔  10越小 发射的速度越快
            this.index = 1;
            this.fire();
            clickCartridge--;
            playShot();
        }
    };
    //发射子弹
    this.fire = function () {
        if (isBig) {
            var b0 = new Bullet(imgBullet2);
        } else {
            var b0 = new Bullet(imgBullet1);
        }
        bulletList.add(b0);

    }
}

////////**********v5版新增内容***************/////////////

/**
 * //子弹对象构造方法
 * @param img
 * @constructor
 */
function Bullet(img) {
    //子弹对象初始坐标
    this.x = hero.x + (imgsHero[0].width / 2 - img.width / 2);
    this.y = hero.y - img.height;
    this.removable = false;//当前子弹能否删除

    this.width = img.width;
    this.height = img.height;

    this.draw = function () {
        //console.log('bullet.draw');
        //console.log(img);
        //console.log(this.x+'-'+this.y);
        ctx.drawImage(img, this.x, this.y);
    };
    this.move = function () {
        this.y -= 20; //此处的5指定子弹的移动速度
        //若飞出画布上边界，或打中敌机，子弹消失
        if (this.y <= -img.height) {
            this.removable = true;
        }
    }
}

/**
 * 己方子弹列表构造方法
 * @constructor
 */
function BulletList() {
    this.arr = [];//画布上所有子弹对象
    this.add = function (bullet) {//添加子弹的方法
        this.arr.push(bullet);
    };
    this.remove = function (i) {
        this.arr.splice(i, 1);
    };
    this.draw = function () {
        for (var i in this.arr) {
            this.arr[i].draw();
            //console.log('画子弹',i);
        }
    };
    this.move = function () {
        for (let i in this.arr) {
            this.arr[i].move();//让每一个子弹都移动
            if (this.arr[i].removable) {
                this.remove(i);
            }
        }
    }
}

/**
 * //敌方子弹子弹对象构造方法
 * @param img
 * @param obj
 * @constructor
 */
function Bullet_plane(img, obj) {
    //子弹对象初始坐标
    this.x = obj.x + obj.width / 2;
    this.y = obj.y + obj.height;
    this.removable = false;//当前子弹能否删除

    this.width = img.width;
    this.height = img.height;

    this.draw = function () {
        //console.log('bullet.draw');
        //console.log(img);
        //console.log(this.x+'-'+this.y);
        ctx.drawImage(img, this.x, this.y);
    };
    this.move = function () {
        this.y += 10; //此处的5指定子弹的移动速度
        //若飞出画布上边界，或打中敌机，子弹消失
        //每个敌机必须再和我方的英雄做碰撞检验
        if ((this.x + this.width >= hero.x + hero.width / 4)
            && (hero.x + hero.width * 3 / 4 >= this.x)
            && (this.y + this.height >= hero.y + hero.height / 4)
            && (hero.y + hero.height * 3 / 4 >= this.y)) {
            hero.crashed = true; //我方英雄开始撞毁程序
        }
        if (this.y >= canvasHeight) {
            this.removable = true;
        }
    }
}

/**
 * 地方子弹列表构造方法
 * @constructor
 */
function BulletList_plane() {
    this.arr = [];//画布上所有子弹对象
    this.add = function (bullet) {//添加子弹的方法
        this.arr.push(bullet);
    };
    this.remove = function (i) {
        this.arr.splice(i, 1);
    };
    this.draw = function () {
        for (var i in this.arr) {
            this.arr[i].draw();
            //console.log('画子弹',i);
        }
    };
    this.move = function () {
        for (var i in this.arr) {
            this.arr[i].move();//让每一个子弹都移动
            if (this.arr[i].removable) {
                this.remove(i);
            }
        }
    }
}

////////////////**********新增********///////////////////////////////

/**
 * //小号敌机
 * @param imgs
 * @constructor
 */
function Enemy1(imgs) {
    this.x_0 = this.x = Math.random() * (canvasWidth - imgs[0].width);//初始位置
    this.x_x = 0;//偏移位置
    this.x_speed = 5;//偏移速度
    this.x_scope = 100;//偏移范围
    this.y = -imgs[0].height;
    this.width = imgs[0].width;
    this.height = imgs[0].height;
    this.index = 0;//当前绘制敌机图片在数组中的下标]
    this.speed = 7; //小敌机的飞行速度 每42毫秒移动的速度
    this.removable = false;//可以删除了吗
    this.blood = 1; //小敌机只有1格血
    this.crashed = false;//是否被撞毁
    this.draw = function () {
        ctx.drawImage(imgs[this.index], this.x, this.y);
    };
    this.counter = 0;  //move()函数被调用的次数
    this.move = function () {
        this.counter++;
        this.y += this.speed;
        if (this.counter % 1 == 0) {
            if (this.x_x > this.x_scope || this.x_x < -this.x_scope) {
                this.x_speed = -this.x_speed;
            }
            this.x_x += this.x_speed;
            this.x = this.x_0 + this.x_x;
        }
        if (this.counter % 50 == 0) {

        }

        this.checkHit();//碰撞检查
        //若飞出下边界了或炸毁了，则可以删除
        if (this.crashed && this.counter % 2 === 0) {
            if (this.index === 0) {
                this.index = 1;
            }
            else if (this.index < imgs.length - 1) {
                this.index++;
            }
            else {
                this.removable = true;
                heroScore += 1;
                score.innerHTML = heroScore;
            }
        }
        if (this.y >= canvasHeight) {
            this.removable = true;
            return;
        }
        //边移动边发射子弹
        if (this.counter % 100 === 0) {//此处的10指定每两发子弹的间隔  10越小 发射的速度越快
            this.fire();
        }
    };
    //发射子弹
    this.fire = function () {
        var b0 = new Bullet_plane(enemyBullet, this);
        bulletList_plane.add(b0);
    };
    ////碰撞检测
    /*
      碰撞的四个条件obj1.x+obj1.width>obj2.x
                    obj2.x+obj2.width>obj1.x
                    obj1.y+obj1.height>=obj2.y
                    obj2.y+obj2.height>=obj1.y

    */
    this.checkHit = function () {
        //每个敌机必须和我方的每个子弹/英雄进行碰撞
        for (var i in bulletList.arr) {
            var b = bulletList.arr[i];
            //console.log('b');
            if ((this.x + this.width >= b.x)
                && (b.x + b.width >= this.x)
                && (this.y + this.height >= b.y)
                && (b.y + b.height >= this.y)) {
                //console.log('碰撞上了');
                this.blood--;
                if (this.blood <= 0) {//没有血格了开始撞毁程序
                    this.crashed = true;
                    playDynamite()
                }
                b.removable = true;
            }
        }
        //每个敌机必须再和我方的英雄做碰撞检验
        if ((this.x + this.width >= hero.x)
            && (hero.x + hero.width >= this.x)
            && (this.y + this.height >= hero.y)
            && (hero.y + hero.height >= this.y)) {
            hero.crashed = true; //我方英雄开始撞毁程序
        }
    }
}

/**
 * //中号敌机
 * @param imgs
 * @constructor
 */
function Enemy2(imgs) {
    this.x_0 = this.x = Math.random() * (canvasWidth - imgs[0].width);//初始位置
    this.x_x = 0;//偏移位置
    this.x_speed = 2;//偏移速度
    this.x_scope = 70;//偏移范围

    this.y = -imgs[0].height;
    this.width = imgs[0].width;
    this.height = imgs[0].height;
    this.index = 0;//当前绘制敌机图片在数组中的下标]
    this.speed = 6; //中号敌机的飞行速度 每42毫秒移动的速度
    this.removable = false;//可以删除了吗
    this.blood = 2; //中号敌机只有3格血

    this.crashed = false; //是否被撞毁
    this.draw = function () {
        ctx.drawImage(imgs[this.index], this.x, this.y);
    };

    this.counter = 0;
    this.move = function () {
        this.counter++;
        this.y += this.speed;
        if (this.counter % 1 == 0) {
            if (this.x_x > this.x_scope || this.x_x < -this.x_scope) {
                this.x_speed = -this.x_speed;
            }
            this.x_x += this.x_speed;
            this.x = this.x_0 + this.x_x;
        }

        //若飞出下边界了或炸毁了，则可以删除
        this.checkHit();//检查碰撞
        //若飞出下边界了或炸毁了，则可以删除
        if (this.crashed && this.counter % 2 === 0) {
            if (this.index === 0) {
                this.index = 1;
            }
            else if (this.index < imgs.length - 1) {
                this.index++;
            }
            else {
                this.removable = true;
                heroScore += 1;
                score.innerHTML = heroScore;
            }
        }

        if (this.y >= canvasHeight) {//飞出下边界
            this.removable = true;
            return;
        }
        //边移动边发射子弹
        if (this.counter % 80 === 0) {//此处的10指定每两发子弹的间隔  10越小 发射的速度越快
            this.fire();
        }
    };
    //发射子弹
    this.fire = function () {
        var b0 = new Bullet_plane(enemyBullet, this);
        bulletList_plane.add(b0);
    };
    this.checkHit = function () {
        //每个敌机必须和我方的每个子弹/英雄进行碰撞
        for (var i in bulletList.arr) {
            var b = bulletList.arr[i];
            //console.log('b');
            if ((this.x + this.width >= b.x)
                && (b.x + b.width >= this.x)
                && (this.y + this.height >= b.y)
                && (b.y + b.height >= this.y)) {
                //console.log('碰撞上了');
                this.blood--;
                if (this.blood <= 0) {//没有血格了开始撞毁程序
                    this.crashed = true;
                    playDynamite();
                }
                b.removable = true;
            }
        }
        //每个敌机必须再和我方的英雄做碰撞检验
        if ((this.x + this.width >= hero.x)
            && (hero.x + hero.width >= this.x)
            && (this.y + this.height >= hero.y)
            && (hero.y + hero.height >= this.y)) {
            hero.crashed = true; //我方英雄开始撞毁程序
        }
    }
}

/**
 * //大号敌机
 * @param imgs
 * @constructor
 */
function Enemy3(imgs) {
    this.x_0 = this.x = Math.random() * (canvasWidth - imgs[0].width);//初始位置
    this.x_x = 0;//偏移位置
    this.x_speed = 1;//偏移速度
    this.x_scope = 40;//偏移范围

    this.y = -imgs[0].height;
    this.width = imgs[0].width;
    this.height = imgs[0].height;

    this.index = 0;//当前绘制敌机图片在数组中的下标]
    this.speed = 3; //大号敌机的飞行速度 每42毫秒移动的速度
    this.removable = false;//可以删除了吗
    this.blood = 3; //大号敌机只有7格血
    this.crashed = false;//是否被撞
    this.draw = function () {
        ctx.drawImage(imgs[this.index], this.x, this.y);
    };
    this.counter = 0;  //move()函数被调用的次数
    this.move = function () {
        this.counter++;
        this.y += this.speed;
        if (this.counter % 1 == 0) {
            if (this.x_x > this.x_scope || this.x_x < -this.x_scope) {
                this.x_speed = -this.x_speed;
            }
            this.x_x += this.x_speed;
            this.x = this.x_0 + this.x_x;
        }
        //若飞出下边界了或炸毁了，则可以删除
        this.checkHit();//检查碰撞
        //若飞出下边界了或炸毁了，则可以删除
        if (this.crashed && this.counter % 2 === 0) {
            if (this.index === 0) {
                this.index = 1;
            }
            else if (this.index < imgs.length - 1) {
                this.index++;
            }
            else {
                this.removable = true;
                heroScore += 1;
                score.innerHTML = heroScore;
            }
        }
        //若飞出下边界了或炸毁了，则可以删除
        if (this.y >= canvasHeight) {
            this.removable = true;
            return;
        }
        //边移动边发射子弹
        if (this.counter % 70 === 0) {//此处的10指定每两发子弹的间隔  10越小 发射的速度越快
            this.fire();
        }
    };
    //发射子弹
    this.fire = function () {
        var b0 = new Bullet_plane(enemyBullet, this);
        bulletList_plane.add(b0);
    };
    this.checkHit = function () {
        //每个敌机必须和我方的每个子弹/英雄进行碰撞
        for (var i in bulletList.arr) {
            var b = bulletList.arr[i];
            ///console.log('b');
            if ((this.x + this.width >= b.x)
                && (b.x + b.width >= this.x)
                && (this.y + this.height >= b.y)
                && (b.y + b.height >= this.y)) {
                //console.log('碰撞上了');
                this.blood--;
                if (this.blood <= 0) {//没有血格了开始撞毁程序
                    this.crashed = true;
                    playDynamite();
                }
                b.removable = true;
            }
        }
        //每个敌机必须再和我方的英雄做碰撞检验
        if ((this.x + this.width >= hero.x)
            && (hero.x + hero.width >= this.x)
            && (this.y + this.height >= hero.y)
            && (hero.y + hero.height >= this.y)) {
            hero.crashed = true; //我方英雄开始撞毁程序
        }
    }
}

/**
 * 所有敌机组成的列表构造方法
 * @constructor
 */
function EnemyList() {
    this.arr = [];//保存所有的敌机
    this.add = function (enemy) {//增加新敌机
        this.arr.push(enemy);
    };
    this.remove = function (i) {//删除指定的额敌机
        this.arr.splice(i, 1);
    };
    this.draw = function () {//绘制所有的敌机
        for (var i in this.arr) {
            this.arr[i].draw();
        }
    };
    this.move = function () {//让所有的敌机移动
        this.generate();//生成新的敌人
        for (var i in this.arr) {
            var e = this.arr[i];
            e.move();
            if (e.removable) {
                this.remove(i);
            }
        }
    };
    //随机生成一个敌机
    this.generate = function () {
        /*敌机生成要求：
        *何时生成敌机是随机的，不是定时或者连续的
        *小号敌机的概率最大，中号其次，大号最少
        *思路：0~100随机数 小号0/1/2/3/4/5/   中好6/7/8/  大号9  其他值不生成敌机
        *进一步扩展：可以将6/9/10 设置为变量，
        */
        var num = Math.floor(Math.random() * 600);
        if (num < 6) {
            this.add(new Enemy1(imgsEnemy1));
        } else if (num < 9) {
            this.add(new Enemy2(imgsEnemy2));
        } else if (num < 10) {
            this.add(new Enemy3(imgsEnemy3));
        }
    }
}

/**
 * 绘制倒计时和当前速度
 */
function drawStat() {
    execution += gameSpeed;
    if (execution > 1000) {
        execution = execution - 1000;
        if (surplusTime.innerHTML > 0) {
            surplusTime.innerHTML = surplusTime.innerHTML - 1; // 倒计时
        } else {
            surplusTime.innerHTML = 60;
            gameSpeed = gameSpeed <= 20 ? gameSpeed : gameSpeed - 20; //游戏速度
        }
    }
}

/*******************阶段5：游戏暂停**************************/

/*function drawPause(){
	var x= canvasWidth/2-imgGamepauseNor.width/2 ;
	var y= canvasHeight/2-imgGamepauseNor.height/2 ;
	ctx.drawImage(imgGamepauseNor, x ,y);
}*/


/*******************阶段6：游戏结束**************************/
/**
 * 游戏结束
 */
function drawGameover() {
    gameOver.style.display = 'block';
    btn.style.display = 'none';
    surplusTime.innerHTML = '';
}


/******************游戏的主引擎-----主定时器**************************/

/**
 * //启动整个游戏的主引擎--保持启动状态的定时器
 */
function startEngine() {
    mainCore = setInterval(function () {
        sky.draw();
        sky.move();
        switch (curPhase) {
            case PHASE_READY:
                // logo.draw();
                break;
            case PHASE_LOADING:
                loading.draw();
                loading.move();
                break;
            case PHASE_PLAY:
                hero.draw();
                hero.move();
                bulletList.draw();
                bulletList.move();
                bulletList_plane.draw();
                bulletList_plane.move();
                enemyList.draw();
                enemyList.move();
                drawStat();
                break;
            case PHASE_PAUSE:
                hero.draw();
                bulletList.draw();
                bulletList_plane.draw();
                enemyList.draw();
                // drawPause();
                break;
            case PHASE_GAMEOVER:
                drawGameover();
                break;
        }
    }, gameSpeed);//1秒动25次
}