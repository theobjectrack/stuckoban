class Player {

  constructor(x, y) {
    this.x = x
    this.y = y
  }

  move(dir,redoing=false) {
    const beforeX = this.x;
    const beforeY = this.y;
    if (levelNum == 0) rememberBlocks = blocks.filter(b=>b.y == 7);
    const x = this.x + dir[0]
    const y = this.y + dir[1]
    const pushed = []
    let mx = 0
    let found = true
    let newx = x
    let newy = y
    while (found) {
      found = false
      for (let block of blocks) {
        if (block.x === newx && block.y === newy) {
          found = true
          mx = block.val == "?" ? mx : isNaN(block.val) ? NaN : max(block.val,mx)
          newx += dir[0]
          newy += dir[1]
          pushed.push(block)
        }
      }
    }
    if (checkBrick(newx,newy)) {
      return false
    }
    if (isNaN(mx) || mx > pushed.length) {
      return false
    }
    const beforeVals = pushed.map(b => b.val);
    let changed = false;
    for (let block of pushed) {
      const before = block.val;
      block.move(dir);
      if (before != block.val) changed = true;
    }
    this.x = x
    this.y = y
    if (!redoing) {
      history[place++] = [dir, changed ? beforeVals : beforeVals.length]
      history.length = place
      // console.log(history)
    }
    if (levelNum == 0) checkTeleport();
    else {
      if (blocks.every(b => b.onDot())) {
        const moves = place;
        const storedSolves = localStorage.getItem("solves");
        if (!storedSolves) localStorage.setItem("solves",`${levelNum}:${moves}`);
        else {
          const solves = storedSolves.split(",").filter(s=>s.includes(":"));
          if (solves.map(i=>parseInt(i)).includes(levelNum)) {
            let newSolves = ""
            for (let solvePlace of solves) {
              const [solveStr,placeStr] = solvePlace.split(":");
              if (solveStr != levelNum) {
                newSolves += ","+solvePlace;
              } else {
                const oldPlace = parseInt(placeStr);
                if (isNaN(oldPlace) || moves < oldPlace) {
                  newSolves += ","+solveStr+":"+moves;
                } else {
                  newSolves += ","+solvePlace;
                }
              }
            }
            localStorage.setItem("solves",newSolves.substring(1));
          } else {
            localStorage.setItem("solves",solves.join(",")+","+levelNum+":"+moves);
          }
        }
        // out = new Out(beforeX,beforeY);
      }
      // const newplayer = [x, y]
      // const newblocks = []
      // blocks.forEach(block => {
      //   const newblock = [block.x, block.y, block.val]
      //   newblocks.push(newblock)
      // })
    }
    return true;
  }

  undoMove(dir,bs) {
    const xdir = -dir[0];
    const ydir = -dir[1];
    const numType = typeof(bs) == "number";
    const numBlocks = numType ? bs : bs.length
    for (let i = 1; i <= numBlocks; i++) {
      for (let block of blocks) {
        if (block.x === this.x+i*dir[0] && block.y === this.y+i*dir[1]) {
          block.x += xdir;
          block.y += ydir;
          if (!numType) block.val = bs[i-1];
        }
      }
    }
    this.x += xdir;
    this.y += ydir;
  }

  show() {
    push()
    translate(this.x*density,this.y*density)
    fill(255)
    rect(1,1,6,6)
    fill(0)
    rect(2,0,4,1)
    rect(1,1,6,1)
    rect(2,2,1,1)
    rect(5,2,1,2)
    rect(2,3,1,1)
    rect(3,4,1,1)
    rect(4,4,1,1)
    rect(2,5,1,1)
    rect(3,5,2,2)
    rect(5,5,1,1)
    rect(2,7,2,1)
    rect(4,7,2,1)
    pop()
  }

}
