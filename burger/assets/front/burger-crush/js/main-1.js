var gameState = {
  _config: {
    countDownTimerText: [],
    fps: 120,
    timeInSeconds: 120,
    unmountAfter: 2,
    scaleFit: true,
    rtl: false,
    celldimension: 100,
    labels: {
      time: "TIME",
      clockTickingInfo: "THE CLOCK IS TICKING",
      hurryUpInfo: "HURRY UP",
    },
    onComplete: function () { }
  },
  init: function (options) {
    this.itemIncrement = 0;
    var pixelDimension = window.devicePixelRatio <= 2 ? 1.2 : 1.6;
    this.config = Object.assign(this._config, options);
    var scaleFix = 1;
    // console.log({pixelDimension});
    // this.windowWidth = 414 || window.innerWidth;
    this.windowWidth = window.innerWidth;
    // this.windowHeight = 736|| window.innerHeight;
    this.windowHeight = window.innerHeight;
    this.timeInSeconds = this.config.timeInSeconds;
    this.totalElapsedSeconds = 0;
    this.label = this.config.labels;
    this.celldimension = this.config.celldimension;
    this.gameStarted = false;
    this.bgSound = undefined;
    // this.windowVerticalBound = this.windowHeight * .85;
    this.game = undefined;
    this.swapReverts = [];
    this.timerText = undefined;
    this._isPaused = true;
    this.boxSize = 20;
    this.selectedItem = undefined;
    this.matchPatternLength = 0;
    this.debugMode = false;
    this._matchImage = images_url + '/match.png';
    this._gridImages = [
      { name: 'box1', image: images_url + '/box-1.png' },
      { name: 'box2', image: images_url + '/box-2.png' },
      { name: 'box3', image: images_url + '/box-3.png' },
      { name: 'box4', image: images_url + '/box-4.png' },
      { name: 'box5', image: images_url + '/box-5.png' },
    ]
    this.gridImages = this.config.gridImages || this._gridImages;
    this._audios = {
      background: audio_url + '/timer.mp3',
      crush: audio_url + '/crush.ogg',
      patternmatch: audio_url +  '/excellent.ogg',
      cleargrid: audio_url +  '/excellent.ogg'
    }
    this.audios = { ...this._audios, ...(this.config.audios || {}) };
    this.matchImage = this.config.matchImage || this._matchImage;
  },
  preload: function () {
    if (this.restartTriggered) return;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.load.crossOrigin = true;
    this.game.load.image('box', images_url + '/block.jpg');
    this.game.load.image('gradient', images_url + '/gradient.png');
    this.game.load.image('headerRepeat', images_url + '/header.png');
    this.game.load.image('blast', images_url + '/blast.png');
    this.gridImages.forEach(function (item) {
      this.game.load.image(item.name, item.image || images_url + '/4x4.png');
    }.bind(this));
    this.game.load.image('headerTimer', images_url + '/header-timer.png');
    this.game.load.image('refresh', images_url + '/refresh.png');
    this.game.load.image('match-image', this.matchImage);
    this.loadSound('audio-bg', this.audios.background);
    this.loadSound('crush-audio', this.audios.crush);
    this.loadSound('clear-grid-audio', this.audios.cleargrid);
    this.loadSound('excellent-audio', this.audios.patternmatch);

  },
  loadSound: function (key, path) {
    if (!this.game.load.cache._cache.sound[key]) this.game.load.audio(key, path);
  },
  formatTime: function (s) {
    // var minutes = "" + Math.floor(s / 60);
    // var seconds = "0" + (s - minutes * 60);
    return s;
  },

  createscoreBoard: function () {
    var gradientBg = this.game.add.sprite(0, 0, 'gradient');
    gradientBg.width = this.game.camera.width;
    gradientBg.height = this.game.camera.height;
    this.headerGroup = this.game.add.group();
    var xPos = this._config.rtl ? this.game.camera.width - 60 : 60;
    var gameHeader = this.game.add.tileSprite(0, 15, this.game.camera.width, 99, 'headerRepeat');
    this.headerGroup.add(gameHeader);

    var scoreBoard = this.game.add.sprite((this.game.camera.centerX-50), 35,'headerTimer');
    this.pointsLabel = this.game.add.text(xPos, 40, this.config.labels.count, {
      font: "12px SpeedeeBold",
      fill: "#471e02",
    });
    this.pointsLabel.anchor.setTo(0.5);
    this.headerGroup.add(this.pointsLabel);
    this.pointsHolder = this.game.add.text(xPos, 65, 0, {
      font: "34px SpeedeeBold",
      fill: "#ffffff",
    });
    this.pointsHolder.anchor.setTo(0.5);
    this.createGradient(this.pointsHolder);
    this.headerGroup.add(this.pointsHolder);

    this.targetLabel = this.game.add.text(this.game.camera.width-xPos,40,this.config.labels.target, {
      font: "12px SpeedeeBold",
      fill: "#471e02",
    });
    this.targetLabel.anchor.setTo(0.5)
    this.headerGroup.add(this.targetLabel);
    this.targetHolder = this.game.add.text(this.game.camera.width-xPos,65,this.config.target, {
      font: "34px SpeedeeBold",
      fill: "#ffffff",
    });
    this.targetHolder.anchor.setTo(0.5);
    this.createGradient(this.targetHolder);
    // logo.anchor.setTo(0);
    // scoreBoard.anchor.setTo(0.5);
    // scoreBoard.position.y = scoreBoard.height * -1;
    this.headerGroup.add(this.targetHolder);
    var timerLabel = this.game.add.text(29, 12, this.config.labels.time, {
      font: "13px SpeedeeBold",
      fill: "#ffffff",
    });
    // timerLabel.anchor.setTo(0.5)
    this.timerText = this.game.add.text(25, 20, this.formatTime(this.timeInSeconds), {
      font: "52px SpeedeeBold",
      fill: "#ffffff",
      boundsAlignH: "center"
    });
    this.timerText.setTextBounds(0, 0, 45, 0);
    this.createGradient(this.timerText);
    this.timerText.anchor.setTo(0)
    scoreBoard.addChild(this.timerText);
    scoreBoard.addChild(timerLabel);
    this.headerGroup.add(scoreBoard);

    this.gameRefreshButton = this.game.add.sprite(this.game.camera.centerX, this.game.height - 15, 'refresh')
    this.gameRefreshButton.anchor.setTo(0.5, 1);
    this.gameRefreshButton.inputEnabled = true;
    // box.input.enableDrag();
    // box.addChild(this.game.add.text(0,0,row))
    this.gameRefreshButton.events.onInputDown.add(() => this.shuffleGrid(), this);
    // this.game.add.tween(scoreBoard.position)
    //   .to({ y: 15 }, Phaser.Timer.SECOND * .5, Phaser.Easing.Linear.In)
    //   .start()
    // scoreBoard.scale.setTo(this.windowHeight* (window.devicePixelRatio/3) < 580 ? window.devicePixelRatio/3 : 1);

  },

  create: function () {
    // this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.stage.backgroundColor = "#d10e06";
    this.createscoreBoard();
    this.swipeHandler();
    this.boxGroup = this.game.add.group();
    this.topPadding = 100;
    this.createGrid(7, 5, true, false);
    this.allowInput();
    this.success_combinations = {};
    // this.checkMatch();
  },
  
  swipeHandler: function () {
    if (this.matchFound) return;
    var swipeCoordX, swipeCoordX2, swipeCoordY, swipeCoordY2, swipeMinDistance = 25;

    this.game.input.onDown.add(pointer => {
      swipeCoordX = pointer.clientX;
      swipeCoordY = pointer.clientY;
    });
    this.game.input.onUp.add(pointer => {
      if (!this.selectedItem) return;
      // const { row, column, color,ignore } = this.selectedItem.cellData;
      // console.log(row, column, color,ignore)
      swipeCoordX2 = pointer.clientX;
      swipeCoordY2 = pointer.clientY;
      // console.log(swipeCoordY2 / swipeCoordY,swipeCoordY / swipeCoordY2)
      var hasAngle = swipeCoordY2 / swipeCoordY > 1.1 || swipeCoordY / swipeCoordY2 > 1.1;
      if (swipeCoordX2 < swipeCoordX - swipeMinDistance && !hasAngle) {
        this.swapPosition(this.selectedItem, 'left');
        // this.scrollH('right', swipeCoordX - swipeCoordX2);
      } else if (swipeCoordX2 > swipeCoordX + swipeMinDistance && !hasAngle) {
        this.swapPosition(this.selectedItem, 'right');
        // this.scrollH('left', swipeCoordX2 - swipeCoordX);
      } else if (swipeCoordY2 < swipeCoordY - swipeMinDistance) {
        this.swapPosition(this.selectedItem, 'top');
      } else if (swipeCoordY2 > swipeCoordY + swipeMinDistance) {
        this.swapPosition(this.selectedItem, 'bottom');
      }
      this.selectedItem = null;
    });
  },
  createGradient(context) {
    context.setShadow(1, 1, 'rgba(0,0,0,0.2)', 5);
    // var textGrad = context.context.createLinearGradient(0, 0, 0, context.height);

    // //  Add in 2 color stops
    // textGrad.addColorStop(0, '#ffffff');   
    // textGrad.addColorStop(0.35, '#ffffff');   
    // textGrad.addColorStop(0.5, '#c2bfbf');
    // textGrad.addColorStop(0.52, '#c2bfbf');
    // textGrad.addColorStop(0.65, '#ffffff');
    // textGrad.addColorStop(1, '#ffffff');

    // //  And apply to the Text
    // context.fill = textGrad;
  },
  clearGradient(context) {
    context.context.clearRect(0, 0, 0, context.height);
  },
  showClockTicking: function () {
    // this.tapInfoLabel.alpha = 0;
    // this.wrongInfoLabel.alpha = 0;
    // this.keepLabel.alpha = 0;
    // this.hurryUpLabel.alpha = 1;
  },

  allowInput: function () {
    this.gameStarted = true;
    this.timerSound = this.game.add.audio('audio-bg', 1, true);
    this.timerSound.play();
    this.timerSound.volume = 0.3;
    this.curshSound = this.game.add.audio('crush-audio');
    this.excellentSound = this.game.add.audio('excellent-audio');
    this.cleargridSound = this.game.add.audio('clear-grid-audio');
    this.game.time.events.loop(Phaser.Timer.SECOND, function () {
      this.totalElapsedSeconds++;
    }.bind(this));
  },


  updateInfo: function () {
    if (this.tapInfoLabel) this.tapInfoLabel.text = this.activeItem.meta.label.toUpperCase();
  },
  createTempBox: function (x, y, color, playExcellent, callback) {
    var box = this.game.add.sprite(x, y);
    var box1 = this.game.add.sprite(0, 0, color);
    box1.anchor.setTo(0.5);
    var box2 = this.game.add.sprite(0, 0, 'blast');
    box2.anchor.setTo(0.5);
    box2.alpha = 0;
    var box3 = this.game.add.sprite(0, 0, 'match-image');
    box3.alpha = 0;
    box3.anchor.setTo(0.5);
    box.scale.setTo(this.boxSize*0.4)
    box.anchor.setTo(0.5);
    // box1.tint = 0xf6fa00;
    box.alpha = 1
    box.addChild(box1)
    box.addChild(box2)
    box.addChild(box3)
    this.boxGroup.addChild(box);
    this.game.add.tween(box1).to({ alpha: 0 }, Phaser.Timer.SECOND * .15, Phaser.Easing.Linear.In,).start();
    this.game.add.tween(box2).to({ alpha: 1 }, Phaser.Timer.SECOND * .15, Phaser.Easing.Linear.In,).start().onComplete.add(() => {
      this.game.add.tween(box2).to({ alpha: 0 }, Phaser.Timer.SECOND * .15, Phaser.Easing.Linear.In,).start()
    });
    this.game.add.tween(box3).to({ alpha: 1 }, Phaser.Timer.SECOND * 0.12, Phaser.Easing.Linear.In,).start();

    this.game.add.tween(box).to({ alpha: 0.7 }, Phaser.Timer.SECOND * .4, Phaser.Easing.Linear.In,).start();
    this.curshSound.play();
    if (playExcellent) this.excellentSound.play();
    this.game.add.tween(box.scale).to({ x: 1, y: 1 }, Phaser.Timer.SECOND * 0.3, Phaser.Easing.Linear.In,).start().onComplete.add(() => {
      if (callback) callback(box);
      box.destroy();
    });
  },
  createSwapBox: function (currentItem, newItem, callback) {
    
    var boxTwo = this.game.add.sprite(newItem.position.x, newItem.position.y, newItem.cellData.color);
    boxTwo.scale.setTo(this.boxSize)
    boxTwo.anchor.setTo(0);
    boxTwo.cellData = { ...newItem.cellData };
    // boxTwo.tint = newItem.cellData.color;
    this.boxGroup.addChild(boxTwo);
    this.game.add.tween(boxTwo).to({ x: currentItem.position.x,y:currentItem.position.y  }, Phaser.Timer.SECOND*0.2 , Phaser.Easing.Linear.In,).start().onComplete.add(() => {
      boxTwo.destroy();
    });

    var boxOne = this.game.add.sprite(currentItem.position.x, currentItem.position.y, currentItem.cellData.color);
    boxOne.scale.setTo(this.boxSize)
    boxOne.anchor.setTo(0);
    boxOne.cellData = { ...currentItem.cellData };
    // boxOne.tint = currentItem.cellData.color;
    this.boxGroup.addChild(boxOne);
    this.swapReverts = [boxOne, boxTwo, currentItem, newItem];
    this.game.add.tween(boxOne).to({ x: newItem.position.x,y:newItem.position.y  }, Phaser.Timer.SECOND*0.2 , Phaser.Easing.Linear.In,).start().onComplete.add(() => {
      boxOne.destroy();
      if (callback) callback();
    });
    
  },

  createGrid: function (rowCount, columnCount, pauseTimer, createFromCenter) {
    this.setShuffleProgress(true);
    this.matchPatternLength = 0;
    // console.log({gameDimension,devicePixelRatio,hightConstraint})
    // const itemCount = 4;
    // var blockSize = 30;
    // var baseWidth = 440;
    this.rowCount = rowCount
    // var rowWidth = this.game.width-rightPadding;
    // this.boxSize = 1.7*gameDimension;
    this.adjustmentPixels =  0;
    var rightPadding = 40;
    this.paddingAdjustment = 1;
    this.marginRight = 1.05;
    this.marginTop = 1.05;
    const gameHeight = this.game.height - ((this.headerGroup.height+40) + (this.gameRefreshButton.height+40));
    // const gameHeight = this.game.height;
    this.gridSize = (this.game.width / gameHeight) * this.celldimension;
    
    // console.log((this.game.width / (this.gridSize*columnCount)),(this.game.height / (this.gridSize*rowCount)),{rowCount,columnCount})
    this.gridSize = this.gridSize * Math.min((this.game.width / (this.gridSize*this.marginRight*columnCount)),(gameHeight / (this.gridSize*this.marginTop*rowCount)));
    // this.gridSize = this.gridSize * (this.game.width / (this.gridSize*columnCount));
    // console.log(this.gridSize,this.game.width, this.game.height, gameHeight,this.headerGroup.height,this.gameRefreshButton.height);
    // this.gridSize = (((this.game.width/this.game.height)-rightPadding)/(columnCount*(this.marginRight+this.adjustmentPixels)));
    this.boxSize = this.gridSize/this.celldimension;
    // this.boxSize = 0.8;
    this.columGroupHeight = this.gridSize*((rowCount-1)*(this.marginTop+this.adjustmentPixels));
    var cells = Array.from(Array(columnCount)).map(item => Array.from(Array(rowCount)))
    this.columnGroup = this.game.add.group();
    var iterationCount = 0;
    var leftPadding = (this.game.width - (this.gridSize*columnCount*this.marginRight))/2;
    var randomDuration = [0.01, 0.2, 0.4, 0.5, 0.6, 1];
    cells.forEach((rows, columnIndex) => {
      var column = this.game.add.group();
      rows.forEach((_item, rowindex) => {
        const x = (columnIndex * this.gridSize * (this.marginRight * this.paddingAdjustment)) + leftPadding;
        const y = this.columGroupHeight - this.paddingAdjustment*this.marginTop * this.gridSize * rowindex;
        
        // var box = this.game.add.sprite(, , 'box');
        // box.anchor.setTo(0.5);
        // box.scale.setTo(boxSize);
        // const color = Phaser.ArrayUtils.getRandomItem(colors);
        // box.tint = color;
        // box.cellData = {
        //   row: rowindex,
        //   color,
        //   column: columnIndex
        // };
        // box.inputEnabled = true;
        // box.events.onInputDown.add(() => this.checkTap(box), this);
        var cordinates = { x: 10, y: -110 };
        if (createFromCenter) {
          cordinates = {
            x: ((columnCount/2) * this.gridSize * (this.marginRight * this.paddingAdjustment)) + leftPadding,
            y: this.columGroupHeight - this.paddingAdjustment*this.marginTop * this.gridSize * (rowCount/2)
          };
        }
        // ((1/Math.abs((rowCount/2)-(rowindex+1)))) *
        var plotDuration = createFromCenter ? (Phaser.Timer.SECOND *  Math.abs((rowCount/2)-rowindex))* (Math.abs(columnCount/2 -columnIndex)) : Phaser.Timer.SECOND * 0.3;
        var plotDelay = createFromCenter ? Phaser.Timer.SECOND *0.1 : Phaser.Timer.SECOND * 0.06 * ((rowindex + 1) * (columnIndex))
        var box = this.createBox(cordinates.x, cordinates.y, rowindex, columnIndex, false, true);
        // this.game.add.tween(box.scale).to({ x: this.boxSize, y: this.boxSize }, Phaser.Timer.SECOND * 0.06 * ((rowindex + 1) * (columnIndex + 1)), Phaser.Easing.Linear.In).start();
      
        this.game.add.tween(box).to({ x, y, alpha: 1 }, plotDuration, Phaser.Easing.Quintic.Out, true, plotDelay).start().onComplete.add(() => {
          iterationCount++;
          if (iterationCount >= (rowCount * columnCount)) {
            this.setShuffleProgress(false);
            if(!this.debugMode) this.checkMatch();
            if (pauseTimer) {
              this.totalElapsedSeconds = 0;
              this.startTimer = true;
            }
          }
        });
        column.add(box);
      })
      this.columnGroup.add(column)
    });
    // const columnBoundingBox = this.adjustmentPixels ? (this.game.height-this.gridSize*2.5)-this.columGroupHeight : (this.game.height-(this.headerGroup.height)-(this.gameRefreshButton.height/2)) - this.columGroupHeight - this.gridSize;
    const columnBoundingBox = (this.game.height-this.gridSize-this.gameRefreshButton.height-40) - this.columGroupHeight;
    this.columnGroup.position.setTo(0, columnBoundingBox);
    // this.columnGroup.position.setTo(0, this.topPadding)
    this.boxGroup.position.setTo(0, columnBoundingBox);
    this.game.world.bringToTop(this.headerGroup);
  },
  setShuffleProgress(setValue) {
    this.shuffleProgress = setValue;
    this.game.add.tween(this.gameRefreshButton).to({alpha:!setValue ? 1 : 0.3},Phaser.Timer.SECOND*.6,Phaser.Easing.Linear.In,).start()
    // this.gameRefreshButton.alpha = !setValue ? 1 : 0.3;
  },
  shuffleGrid(animateFromCenter) {
    if (this.shuffleProgress) return;
    this.columnGroup.destroy();
    this.columnGroup.removeAll();
    this.createGrid(7, 5, false, animateFromCenter);
  },
  createBox(x, y, row, column, group, randomScale) {
    const colors = Phaser.ArrayUtils.shuffle(Phaser.ArrayUtils.shuffle(this.gridImages.map(item => item.name)));
    // const colors = ['0xcee926', '0xe415eb', '0x3ab1acfc','0xa18bee','0xfc4040'];
    // const colors = ['0xcee926', '0xe415eb', '0x3ab1acfc','0xfc4040'];
    const color = this.debugMode ? colors[this.itemIncrement] : Phaser.ArrayUtils.getRandomItem(colors);
    if(this.debugMode) this.itemIncrement++;
    var box = this.game.add.sprite(x, y, color);
    // box.anchor.setTo(0);
    if (randomScale) {
      const randomScaleValues = [0.2, 0.4, 0.5, 1];
      box.scale.setTo(this.boxSize);
      box.alpha = 0
    } else {
      box.scale.setTo(this.boxSize);
    }
    // box.tint = color;
    box.cellData = {
      row,
      color,
      column
    };
    box.inputEnabled = true;
    // box.input.enableDrag();
    // box.addChild(this.game.add.text(0,0,row+":"+column))
    box.events.onInputDown.add(() => this.checkTap(box), this);
    if (group) {
      box.alpha = 0;
      group.addChild(box);
    }
    return box;
  },
  checkTap: function (box) {
    this.selectedItem = box;
  },
  swapPosition: function (box, position) {
    if (this.shuffleProgress) return;
    const { row, column, color } = box.cellData;
    let newPosition;
    switch (position) {
      case 'right':
        if (column + 1 <= this.columnGroup.children.length) {
          newPosition = this.columnGroup.children[column+1].children[row];
        }
        break;
      case 'left':
        if(column) newPosition = this.columnGroup.children[column-1].children[row];
        break;
      case 'bottom':
        if(row) newPosition = this.columnGroup.children[column].children[row - 1];
        break;
      case 'top':
        if (row + 1 <= this.columnGroup.children[column].children.length) {
          newPosition = this.columnGroup.children[column].children[row + 1];
        }
        break;
      default:
        break
    }
    if (newPosition) {
      box.alpha = 0;
      newPosition.alpha = 0;
      this.createSwapBox(box, newPosition, () => {
        box.cellData.color = newPosition.cellData.color;
        box.alpha = 1;
        newPosition.alpha = 1;
        newPosition.cellData.color = color;
        // box.tint = box.cellData.color;
        try {
          box.loadTexture(box.cellData.color,0);
          newPosition.loadTexture(color,0);
        }catch(e){}
        // box.sprite = box.cellData.color;
        // newPosition.tint = color;
        // newPosition.sprite = color;
        this.checkMatch();
      })
    }
  },
  revertSwapPositions() {
    if (!this.swapReverts.length) return;
    if (this.gridBlast) return;
    this.setShuffleProgress(true);
    var firstItem = this.swapReverts[0];
    var newItem = this.swapReverts[1];
    var prevfirstItem = this.swapReverts[2];
    var prevnewItem = this.swapReverts[3];
    prevfirstItem.alpha = 0;
    prevnewItem.alpha = 0;
    this.createSwapBox(firstItem, newItem, () => {
      if (this.gridBlast) return;
      prevfirstItem.cellData.color = firstItem.cellData.color;
      try {
        prevfirstItem.loadTexture(firstItem.cellData.color,0);
      } catch (e){};
      prevfirstItem.alpha = 1;
      prevnewItem.alpha = 1;
      prevnewItem.cellData.color = newItem.cellData.color;
      // // // box.tint = box.cellData.color;
      prevnewItem.loadTexture(newItem.cellData.color, 0);
      this.setShuffleProgress(false);
    });
  },
  checkMatch: function () {
    // const { row, column, color } = box.cellData;
    // let boxesRow = [0, 1, 2, 3, 4].map(item => this.columnGroup.children[item].children[row]);
    // const boxes = [].concat.apply([], this.columnGroup.children.map(item => item.children)).filter(item => item.cellData.color == color);
    // let boxesColumn = [];
    const boxesColumns = this.checkRepeats();
    const boxesColumnIndexes = boxesColumns.map(item => item.cellData.column + ':' + item.cellData.color);
    let boxesRows = this.checkRepeats(true);
    // .filter(item => boxesColumnIndexes.indexOf(item.cellData.column) == -1);
    const hasPossibleCrossMatch = boxesRows.filter(item => boxesColumnIndexes.indexOf(item.cellData.column+':'+item.cellData.color) != -1);
    if (hasPossibleCrossMatch.length) {
      const crossedPath = hasPossibleCrossMatch[0].cellData;
      const isTShape = boxesRows.filter(item => [crossedPath.column - 1, crossedPath.column + 1].indexOf(item.cellData.column) != -1).length >= 2 || boxesColumns.filter(item => item.cellData.column == crossedPath.column && [crossedPath.row - 1, crossedPath.row + 1].indexOf(item.cellData.row) != -1 && item.cellData.color == crossedPath.color).length >= 2;
      if (isTShape) {
        this.matchPatternLength = 5;
        this.success_combinations[5] = (this.success_combinations[5] || 0) + 1;
        if (this.success_combinations[4]) {
          this.success_combinations[4] = this.success_combinations[4] - 1;
        }
        if (this.success_combinations[3]) { 
          this.success_combinations[3] = this.success_combinations[3] - 1;
        }
      } else {
        const isLShape = boxesColumns.filter(item => item.cellData.color == hasPossibleCrossMatch[0].cellData.color).length >=3 && 
          boxesRows.filter(item => item.cellData.color == hasPossibleCrossMatch[0].cellData.color).length >= 3;
        if (isLShape) {
          this.success_combinations[3] = this.success_combinations[3] - 1;
          boxesRows = boxesRows.filter(item => item.cellData.row !== hasPossibleCrossMatch[0].cellData.row);
        } else {
          boxesRows = boxesRows.filter(item => item !== hasPossibleCrossMatch[0]);
        }
      }
    }
    const boxes = [...boxesColumns, ...boxesRows];
    if (boxes.length) {
      this.matchFound = true;
      this.removeBoxes(boxes);
      this.swapReverts = [];
    } else {
      this.matchFound = false;
      if (!this.debugMode) this.revertSwapPositions();
    }
  },
  checkRepeats: function (rowMatch) {
    const matchingItems = [];
    const matchLength = 3;
    let Column;
    if (rowMatch) {
      Column = Array.from(Array(this.rowCount).keys()).map(i => ({ children: this.columnGroup.children.map(d => d.children[i]) }));
    } else {
      Column = this.columnGroup.children;
    }
    const stackLength = Column.length;
    Column.forEach((group, row) => {
      let children;
      // if (rowMatch) {
      //   children = Column.map(group => group.children[row]).filter(item=>item);
      // } else {
      children = group.children;
      // }
      
      let tempCollection = [children[0]];
      let removedItems = 1;
      for (i = 1; i < children.length; i++) {
        const currentItem = children[i];
        if (currentItem.cellData.ignore) return;
        if (currentItem.cellData.color == children[i - 1].cellData.color) {
          tempCollection.push(currentItem);
          removedItems++;
        } else {
          if (tempCollection.length >= matchLength) {
            var matchedPatterns = this.fourPatternCheck(tempCollection, Column, stackLength, matchingItems);
            if (matchedPatterns) {
              removedItems += matchedPatterns;
              return;
            }
            matchingItems.push(...tempCollection);
            this.success_combinations[tempCollection.length] = (this.success_combinations[tempCollection.length] || 0) + 1;
            this.matchPatternLength = this.matchPatternLength > tempCollection.length ? this.matchPatternLength : tempCollection.length;
            removedItems++;
          }
          if (tempCollection.length == 2 && !rowMatch) {
            // console.log(tempCollection);
            removedItems += this.fourPatternCheck(tempCollection, Column, stackLength, matchingItems);
          }
          tempCollection = [currentItem];
        }
      }
      if (tempCollection.length >= matchLength) {
        matchingItems.push(...tempCollection);
        this.success_combinations[tempCollection.length] = (this.success_combinations[tempCollection.length] || 0) + 1;
        this.matchPatternLength = this.matchPatternLength > tempCollection.length ? this.matchPatternLength : tempCollection.length;
        removedItems++;
      }
      if (tempCollection.length == 2 && !rowMatch) {
        // console.log(tempCollection);
        removedItems += this.fourPatternCheck(tempCollection, Column, stackLength, matchingItems);
      }
      // console.log(removedItems - 1);
      // this.createNextItems(children);
      removedItems = 1;
    });
    
    return matchingItems;
  },
  fourPatternCheck(tempCollection, Column, stackLength, matchingItems) {
    var itemsRemoved = 0;
    var currentMatch = tempCollection[0].cellData;
    // console.log('another',currentMatch.column,stackLength);
    if (currentMatch.column <= (stackLength - 1)) {
      var rowReferences = tempCollection.map(item => item.cellData.row);
      // rowReferences.splice(2);
      var siblings = [];
      if (currentMatch.column < (stackLength - 1)) {
        rowReferences.forEach(ro=>{
            var rowcursor = Column[currentMatch.column + 1].children[ro];
            if(rowcursor && rowcursor.cellData.color == currentMatch.color){
                siblings.push(rowcursor);
            }else{
              if(siblings.length < 2) siblings=[];
            }
        })
      }
      // var siblings = Column[currentMatch.column + 1].children.filter(item =>
      //   rowReferences.indexOf(item.cellData.row) != -1 &&
      //   item.cellData.color == currentMatch.color
      // );
      // console.log({ column:currentMatch.column, sibilingLength: siblings.length, tempLength: tempCollection.length });
      if (siblings.length == 2) {
        // check tShape in 4 pattern
        if (rowReferences.length > 2 && currentMatch.column < stackLength - 2) {
          const targetRows = [...rowReferences];
          targetRows.shift();
          targetRows.pop();
          const hasTshapeHorizontal = !!Column[currentMatch.column + 2].children.filter(item => targetRows.indexOf(item.cellData.row) !== -1 && item.cellData.color == currentMatch.color).length;
          if (hasTshapeHorizontal) return itemsRemoved;
        }
        if (currentMatch.column && (rowReferences.length > 2) && (currentMatch.column < stackLength - 1)) {
          const targetRows = [...rowReferences];
          const firstItem = targetRows.shift();
          const lastItem = targetRows.pop();
          const hasTshapeVertical = [...Column[currentMatch.column - 1].children, ...Column[currentMatch.column + 1].children].filter(d => [firstItem, lastItem].indexOf(d.cellData.row) != -1 && d.cellData.color == currentMatch.color).length >= 2;
          if (hasTshapeVertical) return itemsRemoved;
        }
        const [firstMatch, secondMatch] = siblings;
        if (firstMatch.cellData.column + 1 <= stackLength - 1) {
          let _columnIndex = siblings.map(item => item.cellData.row);
          _columnIndex[0] = _columnIndex[0] - 1;
          _columnIndex[1] = _columnIndex[1] + 1;
          
          const hasVerticalMatch = !!Column[currentMatch.column + 1].children.filter(item => _columnIndex.indexOf(item.cellData.row) != -1 && item.cellData.color == currentMatch.color).length;
        
          const _rowIndex = [firstMatch.cellData.row, secondMatch.cellData.row];
          
          const hasHorizontalMatch = !!Column[firstMatch.cellData.column + 1].children.filter(item => _rowIndex.indexOf(item.cellData.row) != -1 && item.cellData.color == firstMatch.cellData.color).length;
          
          if (hasVerticalMatch && hasHorizontalMatch) return itemsRemoved;
        }
        var matchedReferences = siblings.map(item => item.cellData.row);
        tempCollection = tempCollection.filter(item => matchedReferences.indexOf(item.cellData.row) != -1);
        [...tempCollection,...siblings].forEach(item => {
          item.cellData.ignore = true;
        });
        matchingItems.push(...tempCollection, ...siblings);
        itemsRemoved+=4;
      }
    }
    if (itemsRemoved) {
      this.matchPatternLength = 4;
      this.success_combinations[4] = (this.success_combinations[4] || 0) + 1;
    }
    return itemsRemoved;
  },
  removeBoxes: function (boxes) {
    this.setShuffleProgress(true);
    // console.log({ matchLength: this.matchPatternLength });
    // console.log({ boxesLength: boxes.length,success_combinations:this.success_combinations });
    // console.log({success_combinations:this.success_combinations})

    boxes.forEach((box, i) => {
      const { row, column } = box.cellData;
      this.columnGroup.removeChild(box);
      box.kill();
      box.destroy();
      const parentGroup = this.columnGroup.children[column];
      this.createBox(box.position.x, -100, row, column, parentGroup);
      const playExcellent = i && i % 3 == 0;
      // if (playExcellent) this.pointsHolder.text = parseInt(this.pointsHolder.text) + 2;
      this.createTempBox(box.position.x+(box.width/2), box.position.y+(box.height/2), box.cellData.color, playExcellent);
      // this.game.add.tween(box).to({ : 0 }, Phaser.Timer.SECOND * 0.2, Phaser.Easing.Cubic.In, true, 100).start().onComplete.add((item) => {
      // });
    });
    if (this.success_combinations[4] > this.combinationCaptured[4]) {
      this.combinationCaptured[4] = this.success_combinations[4];
      this.addPoint();
    }
    if (this.success_combinations[5] > this.combinationCaptured[5]) {
      this.combinationCaptured[5] = this.success_combinations[5];
      
      this.updatePoints(35);
      if (parseInt(this.pointsHolder.text) >= this.config.target) {
        this.gameComplete();
      } else {
          this.setShuffleProgress(false);  
          this.deleteGrid();
      }
      return; 
    }
    this.updatePoints(boxes.length);
    this.matchPatternLength = 0;
    let iterationCount = 0;
    let tweenCount = 0;
    this.columnGroup.children.forEach(column => {
      column.children.forEach((cell, _i) => {
        cell.cellData.row = _i;
        iterationCount++;
        this.game.add.tween(cell).to({ y: this.columGroupHeight-(_i * this.gridSize*this.marginTop*this.paddingAdjustment), alpha: 1 }, Phaser.Timer.SECOND * 0.4, Phaser.Easing.Cubic.In, true, _i * 100).start().onComplete.add((item) => {
          tweenCount++;
          if (iterationCount == tweenCount) {
            if (parseInt(this.pointsHolder.text) >= this.config.target) {
              this.gameComplete();
            } else {
              this.setShuffleProgress(false);
              this.checkMatch();
            }
          }
        });
      })
    })
  },
  updatePoints(value) {
    this.pointsHolder.text = parseInt(this.pointsHolder.text) + value;
    this.clearGradient(this.pointsHolder);
  },
  deleteGrid() {
    this.setShuffleProgress(true);
    setTimeout(() => {
      var iterationCount = 0;
      this.columnGroup.children.forEach(column=>{
        column.children.reverse().forEach((item,itemIndex)=>{
          this.game.add.tween(item).to({ x: -100, y: -100 }, Phaser.Timer.SECOND * (0.2 * (itemIndex + 1)), Phaser.Easing.Cubic.In, true, 100).start().onComplete.add((item) => {
            iterationCount++;
            if (iterationCount >= 35) {
              this.cleargridSound.play();
              this.setShuffleProgress(false);
              this.shuffleGrid();
            }
          });
        })
      })  
    },100)
    
  },
  blastGrid(callback) {
    this.gridBlast = true;
    this.setShuffleProgress(true);
    const boxes = [];
    this.columnGroup.children.forEach(column => {
      column.children.forEach(box => {
        boxes.push(box);
      })
    });
    const maxboxes = boxes.length;
    let boxcounter = 0;
    boxes.forEach(box => {
      this.createTempBox(box.position.x + (box.width / 2), box.position.y + (box.height / 2), box.cellData.color, true, () => {
        boxcounter++;
        if (boxcounter >= maxboxes) if(callback) callback();
      });
      box.kill();
      box.destroy();
    })
  },
  createCarouselGroup: function (xPos, side) {
    // debugger;
    var carouselGroup = this.game.add.group();
    // this.carouselGroup.width = 300;
    // this.carouselGroup.height = 600;
    carouselGroup.position.setTo((xPos || 0), 0);
    this.ingredientList.forEach((item, index) => {
      var carouselItemHolder = this.game.add.sprite(this.carouselItemWidth * index, 0, 'box');
      // carouselItemHolder.anchor.setTo(0);
      var carouselItem = this.game.add.sprite(0, 0, 'carouselItem');
      carouselItem.inputEnabled = true;
      // carouselItem.anchor.setTo(0);
      carouselItemHolder.addChild(carouselItem);
      var labelObjGroup = this.game.add.group();
      var labels = item.label.split(' ');
      labels.forEach((label, index) => {
        labelObj = this.game.add.text(0, 95 + (index * 20), label, {
          font: "15px SpeedeeRegular",
          fill: "#000000",
          boundsAlignH: "center"
        });
        labelObj.setTextBounds(0, 0, 90, 10);
        labelObjGroup.add(labelObj);
      });
      
      carouselItemHolder.addChild(labelObjGroup);
      var carouselIcon = this.game.add.sprite(carouselItem.width * .5, 40, item.label);
      carouselIcon.anchor.setTo(0.5);
      carouselItem.addChild(carouselIcon);
      // if (item.particle) carouselItem.meta = { particle: item.particle };
      // carouselItem.events.onInputUp.add(this.stopPouring, this);
      carouselItem.events.onInputDown.add(() => this.checkSelectedIngredient(item, carouselItemHolder), this);
      carouselItem.input.priorityID = 1;
      carouselGroup.add(carouselItemHolder);
    });
    if (side === 'right') {
      this.rightChildPosition = (this.rightChildPosition + (this.ingredientList.length * this.carouselItemWidth));
    }
    // this.leftChildPosition = this.leftChildPosition - (this.ingredientList.length * carouselItemWidth);
    return carouselGroup;
  },
  scrollH: function (side, slidePercentage) {
    if (!this.gameStarted) return;
    if (this.progressPercentage) this.progressPercentage.alpha = 0;
    var incrementalPoint = side == 'left' ? 1 : -1;
    this.scrollProgress = true;
    this.xScrollPos = (this.xScrollPos || 0) + ((slidePercentage ? (Math.round(slidePercentage/this.carouselItemWidth)*this.carouselItemWidth) : this.carouselItemWidth) * incrementalPoint);
    if (this.gameTween && this.gameTween.isRunning) {
      this.gameTween.stop();
    }
    this.gameTween = this.game.add.tween(this.carouselGroupWrapper.position).to({ x: this.xScrollPos }, Phaser.Timer.SECOND * .1, Phaser.Easing.Linear.In).start().onComplete.add(() => {
      this.scrollProgress = false;
      this.getScrollOffset();
     });
  },
  getScrollOffset: function () {
    // console.log(this.carouselGroupWrapper.position.x*-1, this.rightChildPosition);
    if (this.carouselGroupWrapper.position.x * -1 >= (this.rightChildPosition * .5)) {
      this.appendCarouselGroup(this.rightChildPosition, 'right');
    }
    if (this.carouselGroupWrapper.position.x * -1 <= this.leftChildPosition) {
      this.appendCarouselGroup(this.leftChildPosition, 'left');
    }
    // if (this.carouselGroupWrapper.position.x * -1<= (this.carouselGroupWrapper.children.length * (this.ingredientList.length * 100))) {
    //   this.appendCarouselGroup(this.carouselGroupWrapper.position.x * this.ingredientList.length * -1);
    // }
    // if ((this.carouselGroupWrapper.position.x + 100) <= (this.carouselGroupWrapper.children.length * (this.ingredientList.length * 100))) {
    // }
  },
  appendCarouselGroup: function (xPos, side) {
    // console.log('adding new child', this.carouselGroupWrapper.children.length);

    if (side == 'left') {
      this.leftChildPosition = this.leftChildPosition - this.ingredientListWidth;
      xPos = this.leftChildPosition;
    }
    this.carouselGroupWrapper.add(this.createCarouselGroup(xPos, side));
    // console.log(this.leftChildPosition);
    // this.rightChildPosition = this.rightChildPosition += this.ingredientList.length;
    // console.log(this.rightChildPosition);
    // this.leftChildPosition = this.leftChildPosition += this.ingredientList.length;
  },
  checkSelectedIngredient: function (selection, carouselHolder) {
    if (!this.gameStarted) return;
    if (!this.activeItem) return;
    if (this.scrollProgress) return;
    if (this.activeItem.meta.id === selection.id) {
      this.setCorrect(carouselHolder);
      this.startPouring(carouselHolder, selection);
    } else {
      this.knob.height = 0;
      this.setWrong(carouselHolder, selection);
    }
  },

  startGame: function () {
    this._isPaused = false;
  },

  updateTimer: function () {
    var seconds = this.totalElapsedSeconds;
    this.timerText.text = this.formatTime(Math.round(this.timeInSeconds - seconds));
    if (Math.round((this.timeInSeconds) - seconds) < 3) { 
      this.showClockTicking();
    }
    if (Math.round((this.timeInSeconds) - seconds) < 0) {
      this.timerText.text = this.formatTime(0);
      this.timesUpHandler();
      // this.gameComplete();
    }
    this.clearGradient(this.timerText)
  },
  addPoint() {
    var pointMarker = this.game.add.sprite(this.game.camera.centerX, this.game.camera.centerY, 'blast');
    // pointMarker.anchor.setTo(0.5)
    pointMarker.position.setTo(pointMarker.position.x-pointMarker.width/2,pointMarker.position.y-pointMarker.height/2,)
    var pointText = this.game.add.text(0, 0, '+5', {
      font: "45px SpeedeeBold",
      fill: "#cb0006",
    });
    pointText.position.setTo(50,45);
    
    // pointText.anchor.setTo(0.5)
    pointMarker.addChild(pointText);
    this.game.add.tween(pointMarker).to({ alpha: 0 }, Phaser.Timer.SECOND * .4, Phaser.Easing.Linear.In).start().onComplete.add(() => {
      this.timeInSeconds += 5;
      pointMarker.destroy();
    })
    this.game.add.tween(pointMarker.scale).to({ x: 0.4, y: 0.4 }, Phaser.Timer.SECOND * .4, Phaser.Easing.Linear.In).start();
    
    this.game.add.tween(pointMarker).to({ x: '+40', y: 10 }, Phaser.Timer.SECOND * .4, Phaser.Easing.Linear.In).start();
  },
  update: function () {
    if (!this.gameStarted) return;
    if (this.timesUp) return;
    if (this.preStop) return;
    if (!this.startTimer) return;
    this.updateTimer();
  },

  timesUpHandler: function () {
    this.timesUp = true;
    // this.totalElapsedSeconds = this.timeInSeconds;
    // this.attemptsCompleted += 1;
    // this.addPoint('system', true);
    // this.showModal(this.config.labels.timesup, 'goal');
    this.gameComplete();
  },
  gameComplete: function () {
    // alert('Times up');
    this.blastGrid(() => {
      this.game.sound.stopAll();
      var points = parseInt(this.pointsHolder.text);
      var isWon = points >= this.config.target;
      this.game.paused = true;
      this._isPaused = true;
      this._config.onComplete({
        totalElapsedSeconds: this.totalElapsedSeconds,
        won: isWon,
        points_earned: points,
        success_combinations: this.success_combinations
      });
    });
  },

  render: function () {
    if (this._isPaused) {
      this.game.paused = true;
    } else {
      this.game.paused = false;
    }
  },
  start: function () {
    this.combinationCaptured = { 4: 0, 5: 0 };
    this.timeInSeconds = this.config.timeInSeconds;
    this.matchFound = false;
    this.timesUp = false;
    this._isPaused = false;
    this.gridBlast = false;
  },
  load: function (options) {
    if (this.game && this.game.state) return;
    this.init(options);
    const _this = this;
    setTimeout(function () {
      _this.game = new Phaser.Game(_this.windowWidth, _this.windowHeight, options.webview ? Phaser.WEBGL : Phaser.CANVAS, 'game');
      _this.initStage(_this);
    }, options && options.delay)
  },
  restart: function () {
    if (this.game && this.game.state) {
      this.progressPercentage = undefined;
      this.totalElapsedSeconds = 0;
      this.timesUp = false;
      this.game.sound.stopAll();
      this.game.state.restart();
      this.preStop = false;
      this.gameStarted = false;
      this.start();
      return;
    }
  },
  initStage: function (context) {
    var now = Date.now();
    // context.game.stage.backgroundColor = "#4488AA";
    context.game.state.add('play' + now, {
      preload: context.preload.bind(context),
      create: context.create.bind(context),
      update: context.update.bind(context),
      render: context.render.bind(context)
    });
    // context.game.paused = true;
    context.game.state.start('play' + now);

  }
}
