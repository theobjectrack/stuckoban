const offset = 1
const sc = 4

const LEFT_ = [-1,0]
const RIGHT_ = [1,0]
const UP = [0,-1]
const DOWN = [0,1]

let player
let bricks = []
let blocks = []
let finishes = []
let plusminuses = []
let empties = []
let extrablocks = []
let rememberBlocks = [];
let statVertPos = 0;
// let out;
let bonusPlace = 5

const bonusNames = ["SISYPHUS","SQUARED","LOST"]

let history = []
let place = -1
let keyPressedStartNum = 0;
let repeatThreshold = 7;
const lastPresses = {};

const density = 8;

let w,h;

let levelStr;
let levelW;
let levelH;
let isMobile = false;

let disableKeys = false;

function setup() {
  // h = Math.max(...levelStrs.slice(1).map(levelStr => levelStr.split("\n").length-2));
  // w = Math.max(Math.floor(3/2*h),Math.max(...levelStrs.slice(1).map(levelStr => Math.max(...levelStr.split("\n").slice(1).map(r=>r.length)))));
  h = 14.25;
  w = 19;
  // let level0 = (w%2?"P":"P ")+"1O2O3O4O5O6O7O8O9O"
  // const sides = "X".repeat(Math.floor((w-level0.length)/2));
  // level0 = sides+level0+sides+"\n";
  // const top = Math.floor((h-1)/2);
  // const bottom = Math.ceil((h-1)/2);
  // levelStrs[0] = "\n"+("X".repeat(w)+"\n").repeat(top)+level0+("X".repeat(w)+"\n").repeat(bottom);
  const canvas = createCanvas((w*density+offset*2)*sc,(h*density+offset*2)*sc)
  canvas.parent("centered")
  canvas.style("display","none")
  const keyCodes = [LEFT_ARROW,RIGHT_ARROW,UP_ARROW,DOWN_ARROW,122,90,120,88]
  keyCodes.forEach(k => {
    lastPresses[k] = 0;
  })
  textAlign(CENTER,CENTER)
  textSize(4.5)
  textFont("Helvetica")
  // setupLevel(0);
  setInterval(() => {
    const rate = frameRate();
    if (rate != 0) repeatThreshold = Math.ceil(rate/9.5);
  }, 1000);

  if (mobileOrTabletCheck()) {
    const options = {
      preventDefault: true
    };
    const hammer = new Hammer(document.body, options);
    hammer.get('swipe').set({
      direction: Hammer.DIRECTION_ALL,
    });
    hammer.on("swipe", swiped);
    hammer.on("doubletap", doubletap);

    isMobile = true;
  }
  document.getElementById("level-string").value = ` XXXX
XX  XX
X  O X
XPO1 X
X 1XXX
X  X
XXXX`;
  let check_url = window.location.search;
  if (check_url[0] == "?") check_url = check_url.substring(1);
  if (check_url) {
    let level_str = check_url.replaceAll("n","\n").replaceAll("_"," ").replaceAll("p","+").replaceAll("m","-");
    if (check_url.substring(check_url.length-5) == "/edit") {
      level_str = level_str.substring(0,level_str.length-5);
      document.getElementById("level-string").value = level_str;
      document.getElementById("go-button").onclick = gobuttonfunc;
    } else {
      if (!!check_allowed(level_str)) window.location.search = "";
      setupLevel("\n"+level_str+"\n");
    }
  } else {
    document.getElementById("go-button").onclick = gobuttonfunc;
  }
}

const gobuttonfunc = () => {
  const s = document.getElementById("level-string").value.toUpperCase();
  const err = check_allowed(s);
  if (!err) window.location.search = s.replaceAll("\n","n").replaceAll(" ","_").replaceAll("+","p").replaceAll("-","m");
  const err_p = document.getElementById("errors");
  err_p.innerText = err;
  err_p.style.display = "block";
}

const editbuttonfunc = () => {
  window.location.search = window.location.search+"/edit";
}

const mobileOrTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function swiped(event) {
  if (!levelStr) return;
  if (event.direction == 4) {
    doKeyPressed("",RIGHT_ARROW)
  } else if (event.direction == 8) {
    doKeyPressed("",UP_ARROW)
  } else if (event.direction == 16) {
    doKeyPressed("",DOWN_ARROW)
  } else if (event.direction == 2) {
    doKeyPressed("",LEFT_ARROW)
  }
}

function doubletap(event) {
  if (!levelStr) return;
  doKeyPressed('m')
}

const check_allowed = s => {
  let ps = 0;
  let blocks = 0;
  let finishes = 0;
  for (let c of s) {
    if (c == "P") {
      if (ps != 0) return "too many Ps";
      ps = 1;
    } else if ("123456789".includes(c)) {
      blocks += 1;
    } else if (c == "O") {
      finishes += 1;
    } else if (!"X+- \n".includes(c)) return "invalid character: "+c;
  }
  if (ps == 0) return "no P";
  if (blocks > finishes) return "not enough finishes";
  return "";
}

const setupLevel = level_str => {
  window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
  }, false);
  document.getElementById("controls").innerText =
    isMobile ? "Swipe to move. Double tap for menu. (Use desktop for best experience.)" : "R to reset. Z to undo. X to redo. M for menu.";
  document.getElementById("defaultCanvas0").style.display = "block";
  document.getElementById("level-string").style.display = "none";
  document.getElementById("go-button").innerText = "edit";
  document.getElementById("go-button").onclick = editbuttonfunc;
  levelStr = level_str;
  levelH = levelStr.split("\n").length-2
  levelW = Math.max(...levelStr.split("\n").slice(1).map(r=>r.length));
  reset();
}

const reset = () => {
  // const grid = lvlStr.substring(1,lvlStr.length-1).split("\n");
  let grid = levelStr.substring(0,levelStr.length-1).split("\n").slice(1);
  bricks = []
  blocks = []
  finishes = [];
  empties = [];
  statVertPos = 0;
  for (let s of levelStr.split("\n")[0].split(";")) {
    if (!s) continue;
    const [xstr,ystr] = s.split(",");
    finishes.push(new Finish(parseInt(xstr),parseInt(ystr)));
  }
  plusminuses = [];
  let h = 0
  // const cols = [color(225,0,0),color(0,225,0),color(0,0,225),color(225,225,0),color(225,0,225),color(0,225,225)]
  // const cols = [color(0,225,0),color(0,225,225),color(0,0,225),color(225,225,0),color(225,0,225),color(225,0,0)]
  const cols = [color(0),color(0),color(0),color(0),color(0),color(0)]
  blockidcounters = {1:0,2:0,3:0}
  order = "ABC"
  grid.forEach(row => {
    let w = 0
    let id = ""
    let val = 0
    row.split("").forEach(cell => {
      switch (cell) {
        case "X":
          bricks.push(new Brick(w,h))
          break
        case "P":
          player = new Player(w,h)
          break
        case "O":
          finishes.push(new Finish(w,h))
          break
        case "+":
        case "-":
          plusminuses.push(new PlusMinus(w,h,cell=="+"))
        case " ": break;
        default:
          val = parseInt(cell)
          if (isNaN(val)) {
            val = cell.toLowerCase()==cell?cell.toUpperCase():cell.charCodeAt(0)-55;
          }
          blocks.push(new Block(w,h,val))
          break
      }
      w++
    })
    h++
  })
  history.length = 0;
  place = 0;
}

const undo = () => {
  if (place > 0) {
    const [pdir,bs] = history[--place]
    player.undoMove(pdir,bs);
    // player = new Player(...p)
    // blocks = []
    // b.forEach(block => {
    //   const newblock = new Block(...block)
    //   blocks.push(newblock)
    // })
  }
}

const redo = () => {
  // console.log("redoing")
  if (place < history.length) {
    const [pdir] = history[place++]
    player.move(pdir,true);
    // player = new Player(...p)
    // blocks = []
    // b.forEach(block => {
    //   const newblock = new Block(...block)
    //   blocks.push(newblock)
    // })
  }
}

const checkBrick = (x,y) => {
  for (let brick of bricks) {
    if (brick.x === x && brick.y === y) {
      return true
    }
  }
  return false
}

const doKeyPressed = (key,keyCode) => {
  if (disableKeys) return;
  if ([OPTION,ALT,CONTROL,91,93].some(k=>keyIsDown(k))) return;
  if (key === 'r' || key === 'R') {
    rememberBlocks = [];
    reset()
  }
  if (key === 'z' || key === 'Z') {
    undo()
  } else if (key === 'x' || key === 'X') {
    redo()
  }
  switch (keyCode) {
    case LEFT_ARROW:
      player.move(LEFT_)
      break
    case RIGHT_ARROW:
      player.move(RIGHT_)
      break
    case UP_ARROW:
      player.move(UP)
      break
    case DOWN_ARROW:
      player.move(DOWN)
    default:
      break
  }
}

function keyPressed() {
  if (!levelStr) return;
  if (disableKeys) return;
  if ([OPTION,ALT,CONTROL,91,93].some(k=>keyIsDown(k))) return;
  keyPressedStartNum = frameCount;
  lastPresses[keyCode] = frameCount;
  doKeyPressed(key,keyCode);
}

const getGrid = () => {
  let grid = ""
  for (let j = 0; j < 14; j++) {
    for (let i = 0; i < 14; i++) {
      if (i === player.x && j === player.y) {
        grid += "P"
        continue
      }
      let put = false
      for (let brick of bricks) {
        if (i === brick.x && j === brick.y) {
          grid += "X"
          put = true
          break
        }
      }
      for (let block of blocks) {
        if (i === block.x && j === block.y) {
          grid += block.val.toString()
          put = true
          break
        }
      }
      if (!put) {
        grid += " "
      }
    }
    grid += "\n"
  }
  return "\n"+grid
}

const drawLevel = () => {
  push()
  scale(sc)
  translate((w-levelW)/2*density,(h-levelH)/2*density);
  translate(offset,offset)
  noStroke()
  fill(0)
  bricks.forEach(brick => brick.show())
  empties.forEach(empty => empty.show())
  finishes.forEach(finish => finish.show())
  plusminuses.forEach(plusminus => plusminus.show())
  blocks.forEach(block => block.show())
  player.show()
  pop()
  push()
  textFont("Courier New")
  strokeWeight(0.8);
  fill(0);
  textSize(20);
  textAlign(LEFT,TOP);
  text(blocks.every(b => b.onDot()) ? "SOLVED!" : "",density,density);
  textSize(16);
  textAlign(RIGHT,TOP);
  text(`MOVES: ${place}`,width-density,density);
  pop();
}

const checkKeyDown = () => {
  const keyPressedDiff = frameCount-keyPressedStartNum;
  if (keyPressedDiff < 4*repeatThreshold) return;
  if (keyPressedDiff%repeatThreshold==0 && [LEFT_ARROW,RIGHT_ARROW,UP_ARROW,DOWN_ARROW,122,90,120,88].some(k=>keyIsDown(k))) {
    const k = [LEFT_ARROW,RIGHT_ARROW,UP_ARROW,DOWN_ARROW,122,90,120,88].sort((a,b)=>lastPresses[b]-lastPresses[a]).find(k=>keyIsDown(k));
    doKeyPressed((k==122||k==90)?'z':(k==120||k==88)?'x':k,k);
  }
}

function draw() {
  if (!levelStr) return;
  background(255);
  drawLevel();
  stroke(0);
  strokeWeight(density);
  noFill();
  rect(0,0,width,height);
  checkKeyDown();
}
