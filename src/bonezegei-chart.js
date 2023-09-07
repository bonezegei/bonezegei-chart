/*Bonezegei Chart
  Author: Jofel Batutay (Bonezegei)
  Date: September 2023 
*/
class BonezegeiConfig {
  constructor() {
    this.type = "line"; //{line, bar, spline}
    this.backgroundColor = "white";
    this.color = "blue";
    this.gridColor = "red"; //grid color
    this.gridX = 1; //grid count for x
    this.gridY = 1; //grid count for y
    this.labelX = [0]; //correspond to number of grid
    this.labelY = [0]; //correspond to number of grid
    this.x = [0]; // x values or label values
    this.dataSet = [{ y: [0], color: "black" }];
  }
}

class BonezegeiChart {
  constructor(id, config) {
    this.config = config;
    this.id = id;
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.labelFont = "12px Arial";

    //compute width and height
    this.maxY = 0;
    this.minY = 0;
    this.yMultiplier;
    this.yMultiplierB;
    this.xMultiplier;
    this.xCount;
    this.yCount;
    this.xgrid = [0];
    this.ygrid = [0];
    //actual draw area of chart
    this.ch_left = 50; //margin left
    this.ch_top = 10; //margin top
    this.ch_bottom = 40; //margin bottom
    this.ch_right = 20; //margin right
    this.ch_height = 0; //chart draw area actual height
    this.ch_width = 0; //chart draw area actual width
    this.ch_color_border = "#dfdfdf";
  }

  getMinMax() {
    for (var a = 0; a < this.config.dataSet.length; a++) {
      for (var b = 0; b < this.config.dataSet[a].y.length; b++) {
        //var val = this.height - this.config.dataSet[a].y[b];
        var val = this.config.dataSet[a].y[b];
        if (this.maxY < val) {
          this.maxY = val;
        }
        if (this.minY > val) {
          this.minY = val;
        }
      }
    }
    this.yMultiplier = this.ch_height / (this.maxY + Math.abs(this.minY));
    this.xMultiplier = this.ch_width / (this.config.x.length - 1);
    for (var a = 0; a < this.config.x.length; a++) {
      this.xgrid[a] = this.ch_left + a * this.xMultiplier;
    }

    this.yCount = 4;
    var Yval = this.maxY - this.minY;
    var yMul = Yval / this.yCount;
    var a = 0;
    for (a = 0; a < this.yCount; a++) {
      this.ygrid[a] = Math.ceil(yMul * a + this.minY);
    }
    this.ygrid[a] = Math.ceil(this.maxY);

    console.log(
      "MAX: " +
        this.maxY +
        " MIN: " +
        Math.abs(this.minY) +
        " YMult:" +
        this.yMultiplier +
        " XMult:" +
        this.xMultiplier +
        " YGrid:" +
        this.ygrid
    );
  }

  getChartArea() {
    this.ch_height = this.height - (this.ch_top + this.ch_bottom);
    this.ch_width = this.width - (this.ch_right + this.ch_left);
    /*this.ctx.beginPath();
    this.ctx.lineWidth = "1";
    this.ctx.strokeStyle = this.ch_color_border;
    this.ctx.rect(
      this.ch_left + 0.5,
      this.ch_top + 0.5,
      this.ch_width,
      this.ch_height
    );
    this.ctx.stroke();*/
  }

  drawLineChart() {
    var top = this.ch_height + this.ch_top;
    var absMin = Math.abs(this.minY) * this.yMultiplier;
    for (var a = 0; a < this.config.dataSet.length; a++) {
      for (var b = 0; b < this.config.dataSet[a].y.length; b++) {
        this.line(
          this.xgrid[b],
          top - this.config.dataSet[a].y[b] * this.yMultiplier - absMin,
          this.xgrid[b + 1],
          top - this.config.dataSet[a].y[b + 1] * this.yMultiplier - absMin,
          this.config.dataSet[a].color
        );
      }
    }
  }

  gridX() {
    for (var a = 0; a < this.xgrid.length; a++) {
      this.line1px(
        this.xgrid[a],
        this.ch_top,
        this.xgrid[a],
        this.ch_top + this.ch_height + 5,
        this.ch_color_border
      );
      this.label(
        this.xgrid[a] - 5,
        this.ch_top + this.ch_height + 20,
        this.config.x[a]
      );
    }
  }

  gridY() {
    var top = this.ch_height + this.ch_top;
    var absMin = Math.abs(this.minY) * this.yMultiplier;
    for (var a = 0; a <= this.yCount + 1; a++) {
      this.line1px(
        this.ch_left - 5,
        top - this.ygrid[a] * this.yMultiplier - absMin,
        this.ch_left + this.ch_width,
        top - this.ygrid[a] * this.yMultiplier - absMin,
        this.ch_color_border
      );
      this.label(
        10,
        top - this.ygrid[a] * this.yMultiplier - absMin + 6,
        this.ygrid[a]
      );
    }
  }

  label(x, y, text) {
    this.ctx.fillStyle = "black";
    this.ctx.font = this.labelFont;
    this.ctx.fillText(text, x, y);
  }
  line(x1, y1, x2, y2, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  line1px(x1, y1, x2, y2, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
    this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  drawLine() {
    for (var a = 0; a < this.config.dataSet.length; a++) {
      for (var b = 0; b < this.config.dataSet[a].y.length; b++) {
        this.line1px(
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

    this.getChartArea();
    this.getMinMax();
    this.gridX();
    this.gridY();
    this.drawLineChart();

    //this.ctx.fillStyle = "red";
    //this.ctx.font = this.labelFont;
    //this.ctx.fillText("bonezegei", 10, 100);
  }
}
