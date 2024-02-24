class PlusMinus {

  constructor(x, y, plus) {
    this.x = x
    this.y = y
    this.plus = plus
  }

  show() {
    push()
    translate(this.x*density,this.y*density)
    // stroke(0)
    // strokeWeight(0.25)
    // fill(140)
    fill(0)
    // rect(this.plus?2:2.5,3.5,this.plus?4:3,1);
    // if (this.plus) rect(3.5,2,1,4);
    rect(2.5,3.5,3,1);
    if (this.plus) rect(3.5,2.5,1,3);
    pop()
  }

}
