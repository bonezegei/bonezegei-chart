/*Bonezegei Chart
  Author: Jofel Batutay (Bonezegei)
  Date: September 2023 
*/
class BonezegeiConfig {
  constructor() {
    this.type = "line";
    this.backgroundColor = "white";
    this.color = "blue";
    this.gridColor = "red"; //grid color
    this.gridX = 1; //grid count for x
    this.gridY = 1; //grid count for y
    this.labelX = [0];
    this.labelY = [0];
    this.x = [0]; // x values or label values
    this.dataSet = [{ y: [0], color: "black" }];
  }
}

class BonezegeiChart {
  constructor(id, config) {
    this.id = id;
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.config = config;
  }

  grid() {
    this.ctx.beginPath();
    this.ctx.moveTo(100, 0);
    this.ctx.lineTo(100, 200);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = this.config.gridColor;
    this.ctx.stroke();
  }

  line(x1, y1, x2, y2, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  drawLine() {
    for (var a = 0; a < this.config.dataSet.length; a++) {
      for (var b = 0; b < this.config.dataSet[a].y.length; b++) {
        this.line(
          this.config.x[b],
          this.height - this.config.dataSet[a].y[b],
          this.config.x[b + 1],
          this.height - this.config.dataSet[a].y[b + 1],
          this.config.dataSet[a].color
        );
      }
    }
    console.log(this.config.dataSet);
  }

  update() {
    if (!this.config) {
      this.config = new BonezegeiConfig();
    }
    console.log(
      "W:" +
        this.width +
        " H:" +
        this.height +
        " D:" +
        this.config.dataSet.length
    );

    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.grid();
    this.drawLine();
  }
}
