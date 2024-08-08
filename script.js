let whereDelayPut = document.getElementById('delay-home');
let delayList = [];
let whatToPut = "";
let whatToDisplay = [];
let buttons = [];

for (let i=0; i<9*9; i++) {
    let num = randomInt(99)+1;
    if (num>=85) {
        delayList.push('1');
    } else {
        delayList.push('0');
    }
}

for (let i=0; i<9*9; i++) {
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
}

for (let i=1; i<9*9+1; i++) {
    if (i%9==0) {
        whatToPut += `<td><button id="delay${i}" oncontextmenu ="return false" style="width:30px;height:30px;"></button></td></tr>`
    } else if ((i-1)%9==0) {
        whatToPut += `<tr><td><button id="delay${i}" oncontextmenu ="return false" style="width:30px;height:30px;"></button></td>`
    } else {
        whatToPut += `<td><button id="delay${i}" oncontextmenu ="return false" style="width:30px;height:30px;"></button></td>`
    }
}

whereDelayPut.innerHTML = whatToPut;

for (let i=1; i<9*9+1; i++) {
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

function randomInt(max) {
	return Math.floor(Math.random()*max);
}

function click(delayNumber) {
    let btn = buttons[delayNumber-1];
    if (btn.disabled == true) return;
    btn.disabled = true;
    let i = delayNumber-1;
    if (delayList[delayNumber-1] == "1") return gameover();
    if (whatToDisplay[delayNumber-1] > 0) {
        btn.innerHTML = whatToDisplay[i];
        btn.style.backgroundColor = "#c0c0c0";
    }
    if (delayList[delayNumber-1] != "1") {
        if (whatToDisplay[delayNumber-1] == 0) btn.style.backgroundColor = "#a9a9a9";
        if (whatToDisplay[i] == 0) {
            let others = jentser(i);
            console.log(others);
            for (let n=0; n<=others[1].length-1; n++) {
                click(others[1][n]);
            }          
        }
    }
}

function flag(delayNumber) {
    let btn = buttons[delayNumber-1];
    if (btn.disabled == true) return;
    if (btn.style.backgroundColor == "rgb(205, 133, 63)") {
        btn.style.backgroundColor = "#F0F0F0";
    } else {
        btn.style.backgroundColor = "#cd853f";
    }
}

function gameover() {
    for (let i=0; i<9*9; i++) {
        let btn = buttons[i];
        if (whatToDisplay[i] > 0 && delayList[i] == "0") btn.innerHTML = whatToDisplay[i];
        if (delayList[i] == "1") {
            btn.style.backgroundColor = "#FF9797";
        } else {
            btn.style.backgroundColor = "#a9a9a9";
        }
        btn.disabled = true;
    }
}

function display(delayNumber) {
    let btn = buttons[delayNumber-1];
    btn.disabled = true;
    btn.style.backgroundColor = "#FF9797";
}

function jentser(i) {
    if (delayList[i-10] == "1" && i>9 && i%9!=0) return false;;
    if (delayList[i-9] == "1" && i>8) return false;
    if (delayList[i-8] == "1" && i>7 && (i+1)%9!=0) return false;
    if (delayList[i-1] == "1" && i>0 && i%9!=0) return false;
    if (delayList[i+1] == "1" && i<81&& (i+1)%9!=0) return false;
    if (delayList[i+8] == "1" && i<74 && i%9!=0) return false;
    if (delayList[i+9] == "1" && i<73) return false;
    if (delayList[i+10] == "1" && i<72&& (i+1)%9!=0) return false;

    let returnData = [];
    if (delayList[i-10] == "0" && i>9 && i%9!=0) returnData.push(i-10+1);
    if (delayList[i-9] == "0" && i>8) returnData.push(i-9+1);
    if (delayList[i-8] == "0" && i>7 && (i+1)%9!=0) returnData.push(i-8+1);
    if (delayList[i-1] == "0" && i>0 && i%9!=0) returnData.push(i-1+1);
    if (delayList[i+1] == "0" && i<81&& (i+1)%9!=0) returnData.push(i+1+1);
    if (delayList[i+8] == "0" && i<74 && i%9!=0) returnData.push(i+8+1);
    if (delayList[i+9] == "0" && i<73) returnData.push(i+9+1);
    if (delayList[i+10] == "0" && i<72&& (i+1)%9!=0) returnData.push(i+10+1);
    return [true, returnData];
}