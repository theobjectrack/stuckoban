class Block {

  constructor(x, y, val, level) {
    this.x = x
    this.y = y
    this.val = val
    this.level = level
  }

  move(dir) {
    this.x += dir[0];
    this.y += dir[1];
    if (this.onDot()) {
      if (!!this.level && levelNum == 0 && (this.x < 18 || (menuNum != 4 && menuNum != 9))) {
        disableKeys = true;
        setTimeout(() => {
          // const dirs = [UP,LEFT,DOWN,RIGHT];
          // let dirI = 0;
          // while (!player.move(dirs[dirI++]));
          setupLevel(this.level)
          disableKeys = false;
        }, 300);
      }
    }
    for (let pm of plusminuses) {
      if (pm.x === this.x && pm.y === this.y) {
        this.val += pm.plus ? 1 : -1;
        if (this.val < 1) this.val = 1;
        return;
      }
    }
  }

  getNumeral() {
    return {
      1: "I",
      2: "II",
      3: "III",
      4: "IV",
      5: "V",
      6: "VI",
      7: "VII",
      8: "VIII",
      9: "IX",
    }[this.val];
  }

  onDot() {
    let onDot = false;
    finishes.forEach(finish => {
      if (finish.x === this.x && finish.y === this.y) {
        onDot = true;
      }
    })
    return onDot;
  }

  show() {
    push()
    translate(this.x*density,this.y*density)
    fill(255)
    rect(1,1,6,6)
    const onDot = this.onDot()
    // fill(onDot ? color(50,156,20) : color(0))
    // fill(onDot ? color(156,50,20) : color(0))
    fill(onDot ? color(79,162,12) : color(0))
    // fill(onDot ? color(192,79,12) : color(0))
    // circle(4,4,8)
    // fill(255)
    // circle(4,4,6)
    // fill(this.col)
    rect(0,0,8,1)
    rect(0,1,1,6)
    rect(7,1,1,6)
    rect(0,7,8,1)
    textStyle(BOLD)
    // text(this.getNumeral(),4,4.25)
    text(this.val.toString(),4,4.25)
    pop()
  }

}
