class Finish {

  constructor(x, y, txt) {
    this.x = x
    this.y = y
    this.txt = txt
    this.activated = false
  }

  show() {
    push()
    translate(this.x*density,this.y*density)
    // fill(this.activated ? color(20,50,156) : color(0))
    //   text("✶",4,4)
    // } else {
    circle(4,4,2)
    pop()
  }
}
