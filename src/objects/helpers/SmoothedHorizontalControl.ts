export default class SmoothedHorizontalControl {
  private readonly msSpeed: number;
  public value: number;

  constructor(speed: number) {
    this.msSpeed = speed;
    this.value = 0;
  }

  public moveLeft(delta: number) {
    if (this.value > 0) {
      this.reset();
    }
    this.value -= this.msSpeed * delta;
    if (this.value < -1) {
      this.value = -1;
    }
  }

  public moveRight(delta: number) {
    if (this.value < 0) {
      this.reset();
    }
    this.value += this.msSpeed * delta;
    if (this.value > 1) {
      this.value = 1;
    }
  }

  public reset() {
    this.value = 0;
  }
}
