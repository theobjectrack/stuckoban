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

let levelNum;
let levelStr;
let levelW;
let levelH;
let menuNum;

let disableKeys = false;

function setup() {
  // h = Math.max(...levelStrs.slice(1).map(levelStr => levelStr.split("\n").length-2));
  // w = Math.max(Math.floor(3/2*h),Math.max(...levelStrs.slice(1).map(levelStr => Math.max(...levelStr.split("\n").slice(1).map(r=>r.length)))));
  h = 14.25;
  w = 19;
  menuNum = parseInt(localStorage.getItem("menuNum"));
  if (isNaN(menuNum) || menuNum < 0 || menuNum >= 9) menuNum = 0;
  if (menuNum == 1) menuNum = 0;
  if (menuNum == 7) menuNum = 4;
  // let level0 = (w%2?"P":"P ")+"1O2O3O4O5O6O7O8O9O"
  // const sides = "X".repeat(Math.floor((w-level0.length)/2));
  // level0 = sides+level0+sides+"\n";
  // const top = Math.floor((h-1)/2);
  // const bottom = Math.ceil((h-1)/2);
  // levelStrs[0] = "\n"+("X".repeat(w)+"\n").repeat(top)+level0+("X".repeat(w)+"\n").repeat(bottom);
  const canvas = createCanvas((w*density+offset*2)*sc,(h*density+offset*2)*sc)
  canvas.parent("centered")
  const keyCodes = [LEFT_ARROW,RIGHT_ARROW,UP_ARROW,DOWN_ARROW,122,90,120,88]
  keyCodes.forEach(k => {
    lastPresses[k] = 0;
  })
  textAlign(CENTER,CENTER)
  textSize(4.5)
  textFont("Helvetica")
  setupLevel(0);
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

    document.getElementById("controls").innerText = "Swipe to move. Double tap for menu. (Use desktop for best experience.)"
  }
}

const mobileOrTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function swiped(event) {
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
  doKeyPressed('m')
}

const setupLevel = n => {
  levelNum = n;
  if (n > 0) {
    levelStr = levelStrs[n];
  } else if (n < 0) {
    levelStr = bonusLevelStrs[-n];
  } else {
    // levelStr = [
    //   menuStrs.titleStart,      // 0 -> 0
    //   menuStrs.titleFromRight,  // 1 -> 1
    //   menuStrs.levelsFromLeft,  // 2 -> 2
    //   menuStrs.levelsFromRight, // 3 -> 3
    //   menuStrs.statsScreen,     // 4 -> 4
    //   menuStrs.titleStart,      // 5 GONE
    //   menuStrs.titleFromRight,  // 6 GONE
    //   menuStrs.levels2FromLeft, // 7 GONE
    //   menuStrs.levels2FromRight,// 8 GONE
    //   menuStrs.statsScreen,     // 9 GONE
    //   menuStrs.levelsFromBottom,// 10 -> 5
    //   menuStrs.levels2FromTop,  // 11 -> 6
    //   menuStrs.secretRoom,      // 12 -> 7
    //   menuStrs.secretRoom,      // 13 GONE
    // ][menuNum];
    levelStr = [
      menuStrs.titleStart,
      menuStrs.titleFromRight,
      menuStrs.levelsFromLeft,
      menuStrs.levelsFromRight,
      menuStrs.statsScreen,
      menuStrs.levelsFromBottom,
      menuStrs.levels2FromTop,
      menuStrs.secretRoom,
    ][menuNum];
  }
  levelH = levelStr.split("\n").length-2
  levelW = Math.max(...levelStr.split("\n").slice(1).map(r=>r.length));
  reset();
}

const reset = () => {
  // const grid = lvlStr.substring(1,lvlStr.length-1).split("\n");
  let grid = levelStr.substring(0,levelStr.length-1).split("\n").slice(1);
  // if (levelNum == 0) {
  //   grid = grid.map(row=>"X"+row+"X")
  //   levelW += 2;
  // }
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
          if (levelNum == 0 && menuNum == 5) player.y = 23;//fixed
          if (levelNum == 0 && menuNum == 6) player.y = 19;//fixed
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
          if (levelNum == 0) {
            if (menuNum == 4 || menuNum <= 1) {//fixed
              blocks.push(new Block(w,h,val));
            } else {
              let levelIdx = h == 17 ? Math.floor(w/5)+1 : val+2
              if (menuNum == 7 && h == 13) levelIdx = -2;
              if (menuNum == 7 && val == "?") levelIdx = -3;
              if (levelIdx < levelStrs.length || h < 3 || h > 49)
                blocks.push(new Block(w,h,val,levelIdx));
            }
          } else blocks.push(new Block(w,h,val))
          break
      }
      w++
    })
    h++
  })
  history.length = 0;
  place = 0;
  if (levelNum == 0) {
    // if (!ignore && menuNum != 4 && menuNum != 7) {//fixed
    //   const storedPlayerCoords = localStorage.getItem("playerCoords");
    //   if (!!storedPlayerCoords && storedPlayerCoords.includes(",")) {
    //     const [xstr,ystr] = storedPlayerCoords.split(",");
    //     const x = parseInt(xstr);
    //     const y = parseInt(ystr);
    //     if (!isNaN(x) && !isNaN(y) && x >= 0 && y >= 0 && x < w && y < h) {
    //       player = new Player(x,y);
    //     }
    //   }
    // }
    const solves = getStoredSolves();
    if (menuNum == 2 || menuNum == 3 || menuNum == 5 || menuNum == 6 || menuNum == 4) {//fixed
      if (menuNum == 4) {//fixed
        // const storedBonusPlace = localStorage.getItem("bonusPlace");
        // const bonusPlace = !!storedBonusPlace && !isNaN(parseInt(storedBonusPlace)) ? parseInt(storedBonusPlace) : 5;
        // if (bonusPlace <= 18) {
        //   blocks.push(new Block(bonusPlace+1,player.y,bonusPlace,4-bonusPlace));
        // }
        const gobble = (s,n) => {
          const numLen = s.length;
          return (numLen<n ? ("0".repeat(n-numLen)+s).split("")
            : [s.substring(0,numLen-n+1),...s.substring(numLen-n+1).split("")]).map(i=>parseInt(i));
        }
        for (let i = 0; i < levelStrs.length-1; i++) {
          const x = 22+(i%3)*5;
          const y = 2+Math.floor(i/3)*2;
          blocks.push(new Block(x,y,Math.max(1,i-1)))
          const score = solves[i+1];
          if (!!score) {
            finishes.push(new Finish(x,y));
            const scoreStr = score.toString();
            // const numLen = scoreStr.length;
            // const digits = [];
            // let currDig = "";
            // for (let j = numLen-1; j >= 0; j--) {
            //   const dig = scoreStr[j]
            //   currDig = dig+currDig;
            //   if (dig != "0") {
            //     digits.push(currDig);
            //     currDig = "";
            //   }
            // }
            const digits = gobble(scoreStr,3);
            digits.reverse();
            for (let j = 0; j < digits.length; j++) {
              const dig = parseInt(digits[j]);
              // if (dig == 0) plusminuses.push(new PlusMinus(x+j+1,y,true));
              // if (dig == 0) bricks.push(new Brick(x+j+1,y));
              if (dig == 0) empties.push(new Empty(x+3-j,y));
              else blocks.push(new Block(x+3-j,y,dig));
            }
          } else {
            for (let j = 0; j < 3; j++) {
              bricks.push(new Brick(x+j+1,y));
            }
          }
          const startY = 2+Math.floor((levelStrs.length-2)/3)*2;
          let ii = 0;
          // for (let i = 0; i < bonusLevelStrs.length-1; i++) {
          for (let i of [2,0,1]) {
            const score = solves[-i-1];
            if (!score) continue;
            let x = 22;
            const y = startY+2+(ii++)*2;
            for (let c of bonusNames[i].split("")) {
              finishes.push(new Finish(x,y));
              blocks.push(new Block(x++,y,c));
            }
            // blocks.push(new Block(x++,y,":"));c
            if (!!score) {
              const scoreStr = score.toString();
              const maxDigLen = 36-x;
              const digLen = min(maxDigLen,scoreStr.length);
              const digits = gobble(scoreStr,digLen);
              digits.reverse();
              for (let j = 0; j < digits.length; j++) {
                const dig = parseInt(digits[j]);
                const newX = x+digLen-j-(scoreStr.length>=maxDigLen);
                if (dig == 0) empties.push(new Empty(newX,y));
                else blocks.push(new Block(newX,y,dig));
              }
            }
          }
        }
      } else {
        for (const block of blocks) {
          if (!!solves[block.level]) {
            finishes.push(new Finish(block.x,block.y));
          }
        }
        const did = {};
        for (const block of blocks) {
          if (!did[block.level] && block.level >= levelStrs.length) {
            did[block.level] = true;
            bricks.push(new Brick(block.x, block.level < 18 ? 22 : 30));
          }
        }
      }
    }
    if (menuNum == 7) {//fixed
      const realExtraBlocks = rememberBlocks.length > 0 ? rememberBlocks : extrablocks;
      const adder = rememberBlocks.length > 0 ? 0 : 3;
      for (let i = 0; i < realExtraBlocks.length; i++) {
        let newx = realExtraBlocks[i].x+adder;
        if (i == 0 && !!solves[-1]) {
          newx = 5;
          finishes.push(new Finish(newx,player.y))
        }
        blocks.push(new Block(newx,player.y,realExtraBlocks[i].val,i==0 ? -1 : undefined));
      }
      for (let i of [-2,-3]) {
        if (!!solves[i]) {
          blocks.forEach(b => {
            if (b.level == i) finishes.push(new Finish(b.x,b.y));
          })
        }
      }
      // const storedBonusPlace = localStorage.getItem("bonusPlace");
      // const bonusPlace = !!storedBonusPlace && !isNaN(parseInt(storedBonusPlace)) ? parseInt(storedBonusPlace) : 5;
      // if (bonusPlace <= 18) {
      //   for (let i = 1; i < 19; i++) {
      //     if (i-2 == bonusPlace) continue;
      //     bricks.push(new Brick(i,player.y-1));
      //     bricks.push(new Brick(i,player.y+1));
      //   }
      // }
    }
  // } else {
  //   const newplayer = [player.x, player.y]
  //   const newblocks = []
  //   blocks.forEach(block => {
  //     const newblock = [block.x, block.y, block.val]
  //     newblocks.push(newblock)
  //   })
  //   place = 0
  //   history[place] = [newplayer, newblocks]
  //   history.length = place+1
  }
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
    if (menuNum == 1) {
      menuNum = 0;
      setupLevel(0);
    }
    reset()
  }
  if (key === 'z' || key === 'Z') {
    undo()
  } else if (key === 'x' || key === 'X') {
    redo()
  }
  if (levelNum != 0 && (key === 'm' || key === 'M')) {
    const comingFromLevel = levelNum;
    if (comingFromLevel == -1) rememberBlocks.forEach(b => b.x++);
    setupLevel(0);
    if (comingFromLevel > 0) {
      const playerReturns = [[],
        [2,17],[7,17],[12,17],[1,13],[5,13],[9,13],[13,13],[17,13],[1,21],[5,21],[9,21],[13,21],
        [17,21], // comment this and uncomment next line when have >10 levels
        // [15,26],[1,22],[5,22],[9,22],[13,22],[1,30],[5,30],[9,30],[13,30],[17,30],
      ];
      player.x = playerReturns[comingFromLevel][0];
      player.y = playerReturns[comingFromLevel][1];
    } else {
      if (comingFromLevel == -1) {
        player.x = 1+max(blocks.filter(b=>b.y==7).map(b=>b.x));
        player.y = 7;
      } else {
        const playerReturns = [
          [10,13],[6,2],
        ];
        player.x = playerReturns[-comingFromLevel-2][0];
        player.y = playerReturns[-comingFromLevel-2][1];
      }
    }
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

const checkTeleport = () => {
  if ((menuNum == 0 || menuNum == 1) && player.x == levelW) {
    menuNum = 2;
    setupLevel(0);
  }
  if ((menuNum == 2 || menuNum == 3 || menuNum == 5) && player.x == -1) {
    menuNum = 1;
    setupLevel(0);
  }
  if ((menuNum == 2 || menuNum == 3 || menuNum == 5) && player.x == levelW) {
    menuNum = 4;
    setupLevel(0);
  }
  if ((menuNum == 2 || menuNum == 3 || menuNum == 5) && player.y == 24) {
    menuNum = 6;
    setupLevel(0);
  }
  if ((menuNum == 6) && player.y == 18) {
    menuNum = 5;
    setupLevel(0);
  }
  if (menuNum == 4) {
    if (player.x == 18) {
      if (blocks.some(b => b.x == 17)) {
        rememberBlocks = [];
        menuNum = 7;
        extrablocks = blocks.filter(b=>b.x < 19).sort((a,b) => (a.x-b.x));
        // setupLevel(0);
        // blocks.forEach(b=>b.move([0,0]))
      } else {
        menuNum = 3;
      }
      setupLevel(0);
    } else if (player.y > statVertPos+13) {
      statVertPos += 1
    } else if (player.y < statVertPos+1) {
      statVertPos -= 1
    }
  }
  if ((menuNum == 7) && player.x == levelW-3) {
    extrablocks = []
    rememberBlocks = [];
    menuNum = 4;
    setupLevel(0);
  }
  localStorage.setItem("menuNum",menuNum);
  // localStorage.setItem("playerCoords",player.x+","+player.y);
  // localStorage.setItem("vertPos",statVertPos);
}

const drawLevel = () => {
  // push();
  // scale(sc)
  // translate((w-levelW)/2*density,(h-levelH)/2*density);
  // fill(200);
  // noStroke();
  // translate(offset,offset)
  // const painted = {};
  // history.forEach(([p,b]) => {
  //   painted[p[0]+","+p[1]] = true;
  //   b.forEach(([x,y])=>{
  //     painted[x+","+y] = true;
  //   })
  // })
  // Object.keys(painted).forEach(s => {
  //   const [xstr,ystr] = s.split(",");
  //   push();
  //   translate(parseInt(xstr)*8,parseInt(ystr)*8)
  //   rect(0,0,8,8);
  //   pop();
  // })
  // pop();
  push()
  if (levelNum == -1) {
    translate(0,density);
    // scale(0.9);
    // translate(-width/2,-height/2);
  }
  scale(sc)
  if (levelNum == 0 && (menuNum == 4)) {
    translate(-19*density,(-statVertPos-0.375)*density)
  } else {
    translate((w-levelW)/2*density,(h-levelH)/2*density);
  }
  translate(offset,offset)
  noStroke()
  fill(0)
  bricks.forEach(brick => brick.show())
  empties.forEach(empty => empty.show())
  finishes.forEach(finish => finish.show())
  plusminuses.forEach(plusminus => plusminus.show())
  blocks.forEach(block => block.show())
  // if (out) out.show();
  player.show()
  if (levelNum == 0 && menuNum <= 1) {
    push();
    fill(255);
    // stroke(255);
    // strokeWeight(2);
    // rect(80,25,40,4);
    // fill(0);
    stroke(0);
    strokeWeight(0.3)
    // noStroke();
    textStyle(ITALIC);
    textSize(3.5);
    textAlign(LEFT,TOP)
    text("a sokoban variant",87,22.5)
    text("design inspired by TI-83+ Block Dude",92,110.25)
    pop();
  }
  pop()
  if (levelNum != 0) {
    push();
    textFont("Courier New")
    strokeWeight(0.8);
    fill(0);
    textSize(20);
    textAlign(LEFT,TOP);
    if (levelNum == -3) {
      text(`BONUS LEVEL: ${bonusNames[-levelNum-1]}`,density,density);
      text((blocks.every(b => b.onDot()) ? "SOLVED!" : ""),density,density+21);
    } else {
      text((levelNum < 0
        ? `BONUS LEVEL: ${bonusNames[-levelNum-1]}`
        : `LEVEL ${levelNum <= 3 ? `1${" abc"[levelNum]}` : (levelNum-2).toString()}`
      )+(blocks.every(b => b.onDot()) ? " SOLVED!" : ""),density,density);
    }
    textSize(16);
    textAlign(RIGHT,TOP);
    text(`MOVES: ${place}`,width-density,density);
    const solves = getStoredSolves();
    if (!!solves && !!solves[levelNum]) text(`BEST: ${solves[levelNum]}`,width-density,density+20);
    pop();
  }
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
  background(255);
  drawLevel();
  stroke(0);
  strokeWeight(density);
  noFill();
  rect(0,0,width,height);
  checkKeyDown();
}
