class Brick {

  constructor(x, y) {
    this.x = x
    this.y = y
  }
  
  badShow() {
    push()
    translate(this.x*density,this.y*density)
    // stroke(0)
    // strokeWeight(0.25)
    // fill(140)
    fill(255)
    rect(0,0,12,12)
    // circle(2.2,2.2,1.05)
    // circle(2.2,5.8,1.05)
    // circle(5.8,2.2,1.05)
    // circle(5.8,5.8,1.05)
    fill(0)
    rect(0,0,2,2)
    rect(3,0,5,2)
    rect(9,0,3,2)
    rect(0,3,5,2)
    rect(6,3,5,2)
    rect(0,6,2,2)
    rect(3,6,5,2)
    rect(9,6,3,2)
    rect(0,9,5,2)
    rect(6,9,5,2)
    pop()
  }

  show() {
    push()
    translate(this.x*density,this.y*density)
    // stroke(0)
    // strokeWeight(0.25)
    // fill(140)
    fill(255)
    rect(0,0,8,8)
    // circle(2.2,2.2,1.05)
    // circle(2.2,5.8,1.05)
    // circle(5.8,2.2,1.05)
    // circle(5.8,5.8,1.05)
    fill(0)
    rect(0,0,5,2)
    rect(6,0,2,2)
    rect(0,3,7,2)
    rect(0,6,5,2)
    rect(6,6,2,2)
    pop()
  }

}
