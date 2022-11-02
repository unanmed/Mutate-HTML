function main() {
    //------------------------ 用户修改内容 ------------------------//

    this.version = 'v0.1'; // 游戏版本号；如果更改了游戏内容建议修改此version以免造成缓存问题。

    this.useCompress = false; // 是否使用压缩文件
    // 当你即将发布你的塔时，请使用“JS代码压缩工具”将所有js代码进行压缩，然后将这里的useCompress改为true。
    // 请注意，只有useCompress是false时才会读取floors目录下的文件，为true时会直接读取libs目录下的floors.min.js文件。
    // 如果要进行剧本的修改请务必将其改成false

    this.bgmRemote = false; // 是否采用远程BGM
    this.bgmRemoteRoot = 'https://h5mota.com/music/'; // 远程BGM的根目录

    this.isCompetition = false; // 是否是比赛模式

    this.savePages = 1000; // 存档页数，每页可存5个；默认为1000页5000个存档
    this.criticalUseLoop = 1; // 循环临界的分界

    //------------------------ 用户修改内容 END ------------------------//

    this.dom = {};
    this.mode = 'play';
    this.loadList = ['none'];
    this.pureData = ['data'];
    this.materials = [];

    this.statusBar = {
        image: {},
        icons: {}
    };
    this.floors = {};
    this.canvas = {};

    this.__VERSION__ = 'v0.1';
    this.__VERSION_CODE__ = 1000;
}

main.prototype.loadMod = function () {};

main.prototype.init = function () {};

var core = {
    utils: {},
    extensions: {},
    loader: {},
    icons: {},
    control: {
        _replay_error: function () {},
        _replay_finished: function () {},
        stopReplay: function () {}
    },
    maps: {},
    ui: {},
    events: {
        eventdata: {
            win: function () {}
        }
    },
    plugin: {},
    canvas: {},
    enemys: {},
    status: {
        hero: {},
        replay: {}
    },
    firstData: {
        name: 'Mutate'
    },
    decodeRoute: function (str) {
        return str;
    },
    startGame: function () {},
    replay: function () {},
    calValue: function (v) {
        return v;
    },
    clone: function (v) {
        return v;
    }
};
window.core = core;

/** @type {string[]} */
var route = [];
var mtt;
var hard = 'easy';
var music = '';

core.startGame = function (h, seed, r) {
    // seed没啥用，只有hard route有用
    route = JSON.parse(r.replaceAll('\\"', '"'));
    hard = h;
    // 根据第一项加载谱面
    var file = route[0].match(/\#file:[^]+$/)[0].slice(6);
    main.loadMod('./chart_js', file + '.mtt', function () {});
    music = route[0].match(/^id:[^_\#]+/)[0].slice(3);
    mtt = window.mtt;
    core.status.replay.pausing = true;
};

core.replay = function () {
    // 获取每个音符的打击时间
    var notes = mtt.notes;
    var times = Object.values(notes).map(function (v) {
        return (v.config || {}).playTime;
    });
    times = times
        .filter(function (v) {
            return v !== void 0 && v !== null;
        })
        .sort(function (a, b) {
            return a - b;
        });
    // 模拟游玩
    if (!/^id:[^_]+\#file:[^]+$/.test(route[0]))
        return core.control._replay_error();
    route.shift();
    if (times.length !== route.length) core.control._replay_error();
    var perfect = 0,
        good = 0,
        miss = 0,
        maxCombo = 0,
        combo = 0;
    for (var i = 0; i < times.length; i++) {
        var hit = route[i];
        var basetime = times[i];
        if (Math.abs(hit - basetime) <= 50) {
            perfect++;
            combo++;
            if (combo > maxCombo) maxCombo = combo;
        } else if (Math.abs(hit - basetime) <= 80) {
            good++;
            combo++;
            if (combo > maxCombo) maxCombo = combo;
        } else {
            miss++;
            combo = 0;
        }
    }
    var comboScore = (maxCombo / times.length) * 100000;
    var per = 900000 / times.length;
    var hitScore = perfect * per + good * per * 0.5;
    core.status.hero.hp = Math.round(comboScore + hitScore);
    core.events.eventdata.win(music);
    core.control.stopReplay();
};

var main = new main();
