class Empty {

  constructor(x, y) {
    this.x = x
    this.y = y
    this.val = 0
  }

  show() {
    push()
    translate(this.x*density,this.y*density)
    fill(255)
    rect(1,1,6,6)
    fill(200)
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
