let whereDelayPut = document.getElementById('delay-home'); // 地雷表格
let delayList = []; // 地雷與否
let whatToPut = ""; // html置入內容
let whatToDisplay = []; // 九宮格地雷數量
let buttons = []; // 按鈕html
let ldMode = 0; // 明暗模式
// let nineWhere = [-(board+1), -board, -(board-1), -1, 1, board-1, board, board+1]; // 九宮格取數
let board = 9; // 棋盤大小
let start = false; // 開始偵測
let flags = [];
let delays = []; // 地雷位置

// 模式調整
if (!document.cookie) document.cookie = "mode=light";
document.body.setAttribute("class", document.cookie.replace(
    /(?:(?:^|.*;\s*)mode\s*\=\s*([^;]*).*$)|^.*$/,
    "$1",
));

// 按鈕置入html
for (let i=1; i<board*board+1; i++) {
    if (i%9==0) {
        whatToPut += `<td><button id="delay${i}" class="normal" oncontextmenu ="return false" style="width:30px;height:30px;">0</button></td></tr>`
    } else if ((i-1)%9==0) {
        whatToPut += `<tr><td><button id="delay${i}" class="normal" oncontextmenu ="return false" style="width:30px;height:30px;">0</button></td>`
    } else {
        whatToPut += `<td><button id="delay${i}" class="normal" oncontextmenu ="return false" style="width:30px;height:30px;">0</button></td>`
    }
}
whereDelayPut.innerHTML = whatToPut;

// 踩地雷與標點
for (let i=1; i<board*board+1; i++) {
    let btn = document.getElementById(`delay${i}`);
    buttons.push(btn);
    btn.onclick = function() {
        click(i);
    };
    btn.addEventListener("mousedown", (e) => {
        if (e.button == 2) {
            flag(i);
        }
    });
}

// 明暗切換
let lord = document.getElementById('lord');
lord.onclick = ldChange;

// 開始遊戲
function startRanbow(e) {
    // 隨機取地雷位置
    for (let i=0; i<board*board; i++) {
        let num = board*board*0.1;
        

        while (delays.length<num) {
            let n = randomInt(board*board);
            if (delays.includes(n) || n==e) continue;
            delays.push(n);
        }
        for (let k=0; k<board*board; k++) {
            if (delays.includes(k)) {
                delayList.push('1')
            } else {
                delayList.push('0');
            }
        }
    }

    // 統計九宮格地雷數量
    for (let i=0; i<board*board; i++) {
        let howManyDelay = 0;
        if (delayList[i-10] == "1" && i>9 && i%9!=0) howManyDelay++;
        if (delayList[i-9] == "1" && i>8) howManyDelay++;
        if (delayList[i-8] == "1" && i>7 && (i+1)%9!=0) howManyDelay++;
        if (delayList[i-1] == "1" && i>0 && i%9!=0) howManyDelay++;
        if (delayList[i+1] == "1" && i<81&& (i+1)%9!=0) howManyDelay++;
        if (delayList[i+8] == "1" && i<74 && i%9!=0) howManyDelay++;
        if (delayList[i+9] == "1" && i<73) howManyDelay++;
        if (delayList[i+10] == "1" && i<72&& (i+1)%9!=0) howManyDelay++;
        whatToDisplay.push(howManyDelay);
        buttons[i].innerHTML = whatToDisplay[i];
    }
}

// 隨機取數
function randomInt(max) {
	return Math.floor(Math.random()*max);
}

// 點按按鈕
function click(delayNumber) {
    if (!start) {
        start = true;
        startRanbow(delayNumber-1);
    }
    if (flags.includes(delayNumber-1)) {
        flags.splice(flags.indexOf(delayNumber-1), 1);
    }
    let btn = buttons[delayNumber-1];
    if (!btn || btn.disabled == true) return;
    btn.disabled = true;
    let i = delayNumber-1;
    if (delayList[delayNumber-1] == "1") {
        return gameover();
    } else {
        if (whatToDisplay[delayNumber-1] == 0) {
            btn.setAttribute("class", "noDelayNoNine");
        } else {
            btn.innerHTML = whatToDisplay[i];
            btn.setAttribute("class", "noDelayYesNine");
        }
        if (whatToDisplay[i] == 0) {
            let others = jentser(i);
            for (let n=0; n<=others[1].length-1; n++) {
                click(others[1][n]);
            }
        }
    }
}

// 標點
function flag(delayNumber) {
    let btn = buttons[delayNumber-1];
    if (btn.disabled == true) return;
    if (btn.getAttribute('class') == "yesFlag") {
        btn.setAttribute("class", "normal");
        flags.splice(flags.indexOf(delayNumber-1), 1);
    } else {
        btn.setAttribute("class", "yesFlag");
        flags.push(delayNumber-1);
    }
    if (flags.sort().toString() == delays.sort().toString()) gamewin();
}

// 遊戲結束(輸)
function gameover() {
    for (let i=0; i<board*board; i++) {
        let btn = buttons[i];
        btn.disabled = true;
        if (whatToDisplay[i] > 0 && delayList[i] == "0") {
            btn.setAttribute("class", "noDelayYesNine");
        } else if (delayList[i] == "1") {
            btn.setAttribute("class", "yesDelay");
            // btn.innerHTML = "<img src=\"./delay.png\" width=25 height=25\"/>"
        } else {
            btn.setAttribute("class", "noDelayNoNine");
        }
    }
    document.getElementById('gamestatelose').innerHTML = "再接再厲";
}

// 遊戲結束(贏)
function gamewin() {
    for (let i=0; i<board*board; i++) {
        let btn = buttons[i];
        btn.disabled = true;
        if (whatToDisplay[i] > 0 && delayList[i] == "0") {
            btn.setAttribute("class", "noDelayYesNine");
        } else if (delayList[i] == "1") {
            btn.setAttribute("class", "yesDelay");
        } else {
            btn.setAttribute("class", "noDelayNoNine");
        }
    }
    document.getElementById('gamestatewin').innerHTML = "恭喜通關！";
}


// 偵測顯示機制
function jentser(i) {
    let returnData = [];
    if (i>9 && i%9!=0) {
        if (delayList[i-10] == "1") return false;
        returnData.push(i-10+1);
    }
    if (i>8) {
        if (delayList[i-9] == "1") return false;
        returnData.push(i-9+1);
    }
    if (i>7 && (i+1)%9!=0) {
        if (delayList[i-8] == "1") return false;
        returnData.push(i-8+1);
    }
    if (i>0 && i%9!=0) {
        if (delayList[i-1] == "1") return false;
        returnData.push(i-1+1);
    }
    if (i<81&& (i+1)%9!=0) {
        if (delayList[i+1] == "1") return false;
        returnData.push(i+1+1);
    }
    if (i<74 && i%9!=0) {
        if (delayList[i+8] == "1") return false;
        returnData.push(i+8+1);
    }
    if (i<73) {
        if (delayList[i+9] == "1") return false;
        returnData.push(i+9+1);
    }
    if (i<72&& (i+1)%9!=0) {
        if (delayList[i+10] == "1") return false;
        returnData.push(i+10+1);
    }
    return [true, returnData];
}

// 明暗切換
function ldChange() {
    if (ldMode == 0) {
        ldMode = 1;
        document.body.setAttribute("class", "dark");
        document.cookie = "mode=dark"
    } else {
        ldMode = 0;
        document.body.setAttribute("class", "light");
        document.cookie = "mode=light"
    }
}