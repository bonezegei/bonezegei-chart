/*Bonezegei Chart
  Author: Jofel Batutay (Bonezegei)
  Date: September 2023 
*/
class BonezegeiConfig {
  constructor() {
    this.type = "line"; //{line, bar, spline}
    this.backgroundColor = "white";
    //Grid
    this.gridColor = "#dfdfdf"; //grid color
    this.labelX = 6; //correspond to number of grid in X to display
    this.labelY = 6; //correspond to number of grid in Y
    //datasets
    this.x = [0]; // x values or label values
    this.dataSet = [{ y: [0], color: "black", size: 2 }]; //label y[data array] color width
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
    this.hasDecimal = 0;
    this.maxY = 0;
    this.minY = 0;
    this.yMultiplier;
    this.yMultiplierB;
    this.xMultiplier;
    this.xgrid = [0];
    this.ygrid = [0];
    //actual draw area of chart
    this.ch_left = 0; //margin left
    this.ch_top = 50; //margin top
    this.ch_bottom = 40; //margin bottom
    this.ch_right = 20; //margin right
    this.ch_height = 0; //chart draw area actual height
    this.ch_width = 0; //chart draw area actual width
    this.ch_color_border = "#dfdfdf";
  }
  //==================================================================================

  getMinMax() {
    //get Min and Maximum Y value
    this.hasDecimal = 0;
    for (var a = 0; a < this.config.dataSet.length; a++) {
      for (var b = 0; b < this.config.dataSet[a].y.length; b++) {
        //var val = this.height - this.config.dataSet[a].y[b];
        var val = this.config.dataSet[a].y[b];
        if (val % 1 != 0) {
          this.hasDecimal = 1;
        }
        if (this.maxY < val) {
          this.maxY = val;
        }
        if (this.minY > val) {
          this.minY = val;
        }
      }
    }
    // check if grid labels are specified
    if (this.config.labelY == 0) {
      this.ch_height = this.height - 10;
      this.ch_bottom = 5;
      this.ch_top = 5;
    }
    //Y grid Label
    this.yMultiplier = this.ch_height / (this.maxY + Math.abs(this.minY));
    var Yval = this.maxY - this.minY;
    var yMul = Yval / this.config.labelY;
    var a = 0;
    for (a = 0; a < this.config.labelY; a++) {
      if (this.hasDecimal) {
        this.ygrid[a] = (yMul * a + this.minY).toFixed(2);
      } else {
        this.ygrid[a] = Math.ceil(yMul * a + this.minY);
      }
    }
    if (this.hasDecimal) {
      this.ygrid[a] = this.maxY.toFixed(2);
    } else {
      this.ygrid[a] = this.maxY;
    }

    // check if grid labels are specified
    if (this.config.labelX != 0) {
      this.getLeftMargin();
    } else {
      this.ch_left = 5;
      this.ch_right = 5;
    }

    //update chart area width
    this.ch_width = this.width - (this.ch_right + this.ch_left);
    //X grid Label
    this.xMultiplier = this.ch_width / (this.config.x.length - 1);
    for (var a = 0; a < this.config.x.length; a++) {
      this.xgrid[a] = this.ch_left + a * this.xMultiplier;
    }
  }

  getChartArea() {
    this.ch_height = this.height - (this.ch_top + this.ch_bottom);
    this.ch_width = this.width - (this.ch_right + this.ch_left);
  }

  getLeftMargin() {
    this.ch_left = 0;
    for (var a = 0; a <= this.config.labelY; a++) {
      this.ctx.font = this.labelFont;
      var txt = this.ctx.measureText(this.ygrid[a]).width;
      if (txt > this.ch_left) {
        this.ch_left = txt;
      }
    }
    this.ch_left += 15;
  }
  //==================================================================================

  //Grid Functions
  gridX() {
    if (this.config.labelX > 0) {
      var divider = this.xgrid.length / this.config.labelX;
      var mod = Math.ceil(divider);
      var a = 0;
      for (a = 0; a < this.xgrid.length; a++) {
        if (a % mod == 0) {
          this.line1px(
            this.xgrid[a],
            this.ch_top,
            this.xgrid[a],
            this.ch_top + this.ch_height + 5,
            this.ch_color_border
          );
          this.gridLabelX(
            this.xgrid[a],
            this.ch_top + this.ch_height + 20,
            this.config.x[a]
          );
        }
      }
      //draw last X grid
      this.line1px(
        this.xgrid[a - 1],
        this.ch_top,
        this.xgrid[a - 1],
        this.ch_top + this.ch_height,
        this.ch_color_border
      );
    }
  }

  gridY() {
    if (this.config.labelY > 0) {
      var top = this.ch_height + this.ch_top;
      var absMin = Math.abs(this.minY) * this.yMultiplier;
      for (var a = 0; a <= this.config.labelY + 1; a++) {
        this.line1px(
          this.ch_left - 10,
          top - this.ygrid[a] * this.yMultiplier - absMin,
          this.ch_left + this.ch_width,
          top - this.ygrid[a] * this.yMultiplier - absMin,
          this.ch_color_border
        );
        this.gridLabelY(
          top - this.ygrid[a] * this.yMultiplier - absMin + 5,
          this.ygrid[a]
        );
      }
    }
  }

  gridLabelY(y, text) {
    var x = this.ch_left - this.ctx.measureText(text).width - 12;
    this.label(x, y, text);
  }

  gridLabelX(x, y, text) {
    var xa = x - this.ctx.measureText(text).width / 2;
    this.label(xa, y, text);
  }
  //==================================================================================

  // Basic functions
  label(x, y, text) {
    this.ctx.fillStyle = "#4f4f4f";
    this.ctx.font = this.labelFont;
    this.ctx.fillText(text, x, y);
  }

  line(x1, y1, x2, y2, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  circle(x, y, color) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  line1px(x1, y1, x2, y2, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
    this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }
  //==================================================================================

  //Draw the actual Line Chart
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
        this.circle(
          this.xgrid[b],
          top - this.config.dataSet[a].y[b] * this.yMultiplier - absMin,
          this.config.dataSet[a].color
        );
      }
    }
  }

  //==================================================================================

  getDefaultConfig() {
    var defaultCFG = new BonezegeiConfig();
    if (this.config.backgroundColor === undefined) {
      this.config.backgroundColor = defaultCFG.backgroundColor;
    }
    if (this.config.labelX === undefined) {
      this.config.labelX = defaultCFG.labelX;
    }

    console.log(this.config.labelY);
    if (this.config.labelY === undefined) {
      this.config.labelY = defaultCFG.labelY;
    }
  }

  update() {
    this.getDefaultConfig();
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.getChartArea();
    this.getMinMax();
    this.gridX();
    this.gridY();
    this.drawLineChart();
  }
}
