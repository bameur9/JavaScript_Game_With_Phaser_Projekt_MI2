const Preloader = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

    //Konstructor
        function Preloader() {
            Phaser.Scene.call(this, {key: 'preloader'})
        },

    //Alle assets und Bilder
    preload: function () {
        this.load.image('background', '../assets/bg.png');
        this.load.image('background1', '../assets/bg1.png');
        this.load.image('control', '../assets/controls.png');
        this.load.image('control1', '../assets/controls1.png');

        this.load.image('buttonStart', '../assets/button.png');
        this.load.image('restart', '../assets/restart.png');

        this.load.image('platform3', '../assets/grass_3.png')
        this.load.image('platform', '../assets/grass_8x1.png');
        this.load.image('platform1', '../assets/grass_6x1.png');
        this.load.image('platform2', '../assets/grass_4x1.png');
        this.load.image('platform4', '../assets/grass_1x1.png');
        this.load.image('key', "../assets/key.png");
        this.load.image('health', "../assets/health.png");
        this.load.image('obstacle', '../assets/obstacles.png');
        this.load.image('healthBox', '../assets/HealthGameOver.png');

        this.load.audio('musik', '../assets/sound/Musik_Flute.mp3');
        this.load.audio('keyAudio', '../assets/sound/schlüssel_sound.wav');
        this.load.audio('kollisionAudio', '../assets/sound/Kollision_sound.wav');
        this.load.audio('medikitAudio', '../assets/sound/medikits.wav');
        this.load.audio('shootAudio', '../assets/sound/Schuss1.wav');


        this.load.image('logo', '../img/icon.png');

        this.load.spritesheet('enemy', '../assets/gegner.png', {
            frameWidth: 76.9,
            frameHeight: 119,
            margin: 1,
            space:10
        });

        this.load.spritesheet('enemyLevel1', '../assets/gegnerLevel2.png', {
            frameWidth: 76.9,
            frameHeight: 119,
            margin: 1,
            space:10
        });

        //Player
        this.load.spritesheet('player', '../assets/spieler.png', {
            frameWidth: 96,
            frameHeight: 119,
            margin: 1,
            space:10
        });

        this.load.image('door', '../assets/door.png');
        this.load.image('doorClosed', '../assets/door1.png');
        this.load.image('shoot','../assets/bullet.png');
    },

    //ruf die neue Scene auf.
    create: function () {
        let backgroundmusik = this.sound.add('musik',{loop:true});
        backgroundmusik.play();
        this.scene.start('mainmenu');
    }
});

const MainMenu = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

    //Konstructor
        function MainMenu() {
            Phaser.Scene.call(this, {key: 'mainmenu'});
            window.MENU = this;
        },

    create: function () {
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        const rect = this.add.graphics();
        rect.fillStyle(0x222222, 0.8);
        rect.fillRect(0, 10, 1000, 200);

        this.add.text(255, 70, "Zombie killer", {font: "70px Arial Black", fill:"#570505", stroke: '#fff',
            strokeThickness: 4 , align: "center", fontWeight: "bold"});

        const button = this.add.image(500, 350, 'buttonStart');
        button.setInteractive();
        button.once('pointerup', function (){
            this.scene.start('level1');
        }, this);

        this.enemy =this.add.sprite(0, 600, 'enemy');
        this.enemyWalkAnimation();
    },

    enemyWalkAnimation(){
        this.anims.create({
            key: 'walk_right',
            frames: this.anims.generateFrameNumbers('enemy', { start: 3, end: 5 }),
            frameRate: 7,
            repeat: -1
        });
    },

    update: function () {
        if(this.enemy.x <= 1000){
            this.enemy.x+= 5;
            this.enemy.anims.play('walk_right', true);
        }else {
            this.enemy.x = 0;
        }
    }
});

const Level1 = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

    function Level1(){
        Phaser.Scene.call(this, {key: 'level1'});
        window.GAME = this;
    },

    preload: function () {
        const rect = this.add.graphics();
        rect.fillStyle(0x222222, 0.8);
        rect.fillRect(0, 10, 1000, 550);
    },

    create: function () {
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        this.add.image(0, 200, 'control1').setOrigin(0, 0);

        this.add.text(75,315, "Sammle alle Schlüssel in vorgegebener Zeit und überlebe gegen die Zombies", {font: "20px Arial Black", fill:"#ffffff",stroke: '#000',
            strokeThickness: 2 , align: "center", fontWeight: "bold"});


        this.add.text(400, 100, "Level 1", {font: "50px Arial Black", fill:"#ffffff", stroke: '#5e0707',
            strokeThickness: 4 , align: "center", fontWeight: "bold"});

        this.enemy =this.add.sprite(0, 600, 'enemy');
        this.enemyWalkAnimation();
    },

    enemyWalkAnimation(){
        this.anims.create({
            key: 'walk_right',
            frames: this.anims.generateFrameNumbers('enemy', { start: 3, end: 5 }),
            frameRate: 7,
            repeat: -1
        });
    },

    update: function () {
        if(this.enemy.x <= 1000){
            this.enemy.x+= 5;
            this.enemy.anims.play('walk_right', true);
        }else {
            this.scene.start('game1');
        }
    }
});

const Game1 = new Phaser.Class({
    Extends: Phaser.Scene,


    initialize:

    function Game1(){
        Phaser.Scene.call(this, {key: 'game1'});
        window.GAME = this;
        this.init();
    },

    init(){
        this.isleft = true;
        this.colliderWithPlayer = false;
        this.walkCounter1 =0;
        this.walkCounter =0;

        this.jumpCounter =0;

        this.totalKey=0;
        this.lifeCounter = 50;
        this.counter=0;
        this.timer= 1;

        this.index = 0;
        this.won= false;
        this.controls;

        this.colliderWithObstacle = false;

        this.shootingActiv = false;
    },

    create: function () {
        this.value = 13;
        this.total = Phaser.Math.Between(15,20);
        this.timer = 1;

        this.add.image(0, 0, 'background').setOrigin(0, 0);

        var rect = this.add.graphics();
        rect.fillStyle(0x222222, 0.8);
        rect.fillRect(0, 0,1000, 50);

        this.cursor = this.input.keyboard.createCursorKeys();
        this.key = this.input.keyboard.addKeys('R');

        this.add.text(610, 14, 'Life: ', { fontSize: '32px', fill: '#5e0202' });
        this.life1 = this.add.image(750, 25, 'logo');
        this.life2 = this.add.image(800, 25, 'logo');
        this.life3 = this.add.image(850, 25, 'logo');
        this.life4 = this.add.image(900, 25, 'logo');
        this.life5 = this.add.image(950, 25, 'logo');


        this.platforms = this.physics.add.staticGroup();
        let platform0 = this.add.sprite(500, 740, 'platform3');
        let platform1 = this.add.sprite(900, 600, 'platform');
        let platform2 = this.add.sprite(400,500, 'platform1');
        let platform3 = this.add.sprite(90,450,  'platform2');
        let platform4 = this.add.sprite(400,284, 'platform2');
        let platform5 = this.add.sprite(790,300, 'platform');
        let platform6 = this.add.sprite(80,150,  'platform1');
        let platform7= this.add.sprite(1050, 150, 'platform');

        this.platforms.add(platform0);
        this.platforms.add(platform1);
        this.platforms.add(platform2);
        this.platforms.add(platform3);
        this.platforms.add(platform4);
        this.platforms.add(platform5);
        this.platforms.add(platform6);
        this.platforms.add(platform7);


        //lade Player
        this.player = this.physics.add.sprite(1000/2,620, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        this.ball = this.add.image(this.player.x, this.player.y, 'shoot');

        //lade Enemi
        this.enemi1 = this.physics.add.sprite(900,520, 'enemy');
        this.enemi1.setCollideWorldBounds(true);
        this.enemi1.setBounce(0.2);

        this.enemi2 = this.physics.add.sprite(400,420, 'enemy');
        this.enemi2.setCollideWorldBounds(true);
        this.enemi2.setBounce(0.2);

        this.enemi3 = this.physics.add.sprite(790,220, 'enemy');
        this.enemi3.setCollideWorldBounds(true);
        this.enemi3.setBounce(0.2);

        this.enemi4 = this.physics.add.sprite(80,30, 'enemy');
        this.enemi4.setCollideWorldBounds(true);
        this.enemi4.setBounce(0.2);

        this.enemyMove();
        this.playerStand();
        this.playerMove();
        this.playerJump();
        this.playerShot();
        this.playerTouching();

        this.keys = this.physics.add.group({
            key: 'key',
            repeat: this.value,
            // setXY: { x: keyfallX, y: 0, stepX: stepXValue }
            setXY: { x: 20, y: 0, stepX: 70 }
        });

        this.obstacle = this.physics.add.sprite(500, -30, 'obstacle');

        this.totalKey = this.value+1;
        this.scoreText = this.add.text(16, 14, 'Keys: 0'+'/'+ this.totalKey, { fontSize: '32px', fill: '#5e0202' });

        this.timeText = this.add.text(257, 14, 'Timer: '+this.timer+'/'+this.total+'sec.', { fontSize: '32px', fill: '#5e0202' });


        this.physics.add.collider(this.keys, this.platforms);
        this.physics.add.collider(this.player, this.platforms);

        this.physics.add.collider(this.enemi1, this.platforms);
        this.physics.add.collider(this.enemi1, this.player, this.colliderPlayerEnenemi, null, this);

        this.physics.add.collider(this.enemi2, this.platforms);
        this.physics.add.collider(this.enemi2, this.player, this.colliderPlayerEnenemi, null, this);

        this.physics.add.collider(this.enemi3, this.platforms);
        this.physics.add.collider(this.enemi3, this.player, this.colliderPlayerEnenemi, null, this);

        this.physics.add.overlap(this.player, this.keys, this.collectKeys, null, this);

        this.physics.add.collider(this.enemi4, this.platforms);
        this.physics.add.collider(this.enemi4, this.player, this.colliderPlayerEnenemi, null, this);

        this.physics.add.overlap(this.player, this.obstacle, this.colliderPlayerObstacle, null, this);
        },

    colliderPlayerObstacle(){
        this.sound.add('kollisionAudio').play();
        this.colliderWithObstacle = true;
    },

    colliderPlayerEnenemi() {
        this.sound.add('kollisionAudio').play();
        this.colliderWithPlayer = true;
    },

    collectKeys (player, keys){
        this.keyAudio = this.sound.add('keyAudio');
        this.keyAudio.play();
        keys.disableBody(true, true);
        this.counter++;
        if (this.won == false) {
            this.scoreText.setText('Keys: ' + this.counter+'/'+ this.totalKey);
        }
    },

    enemyMove(){
        this.anims.create({
            key: 'enemi_left',
            frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 2 }),
            frameRate: 7,
            repeat: -1
        });

        this.anims.create({
            key: 'enemi_right',
            frames: this.anims.generateFrameNumbers('enemy', { start: 3, end: 5 }),
            frameRate: 7,
            repeat: -1
        });
    },


    playerStand() {
        this.anims.create({
            key:'stand_left',
            frames: [ { key: 'player', frame: 8 } ],
            frameRate: 15
        });

        this.anims.create({
            key:'stand_right',
            frames: [ { key: 'player', frame: 11 } ],
            frameRate: 15
        });
    },

    playerMove() {
        this.anims.create({
            key: 'move_left',
            frames: this.anims.generateFrameNumbers('player', { start: 7, end: 2 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'move_right',
            frames: this.anims.generateFrameNumbers('player', {start: 12, end: 16}),
            frameRate: 15,
            repeat: -1
        });

        this.cursor = this.input.keyboard.createCursorKeys();
        this.key = this.input.keyboard.addKeys('R');
    },

    playerJump() {
        this.anims.create({
            key: 'jump_right',
            frames: [ { key: 'player', frame: 18 } ],
            frameRate: 15
        }),

            this.anims.create({
                key:'jump_left',
                frames: [ { key: 'player', frame: 1} ],
                frameRate:15
            })
    },

    playerTouching() {
        this.anims.create({
            key:'touch_left',
            frames: [ { key: 'player', frame: 0 } ],
        });

        this.anims.create({
            key:'touch_right',
            frames: [ { key: 'player', frame: 19 } ],
        });
    },

    playerShot() {
        this.anims.create({
            key:'shot_left',
            frames: [ { key: 'player', frame: 9 } ],
        });

        this.anims.create({
            key:'shot_right',
            frames: [ { key: 'player', frame: 10 } ],
        });
    },


    winner(){
        this.destroyAll();

        var style = { font: "90px Arial Black", fill:"#570505", stroke: '#fff',
            strokeThickness: 4 , align: "center", fontWeight:"bold" };
        var text = this.add.text(300, 50,"You win", style);

        const restart = this.add.image(490, 285, 'restart');
        restart.setInteractive();
        restart .once('pointerup', function (){
            this.scene.restart();
        }, this);

        this.add.image(558, 560, 'door');
       // this.add.image(658, 570, 'door');
        this.won == true;
    },

    enemyKill(){
        if(this.enemi1.y <= (this.ball.y+20) && (this.enemi1.y + this.enemi1.height) >= this.ball.y && this.enemi1.x <= this.ball.x){
            this.enemi1.disableBody(true, true);
        }

        if(this.enemi3.y <= (this.ball.y+20) && (this.enemi3.y + this.enemi3.height) >= this.ball.y && this.enemi3.x <= this.ball.x){
            this.enemi3.disableBody(true, true);
        }

       if(this.enemi2.y <= (this.ball.y) && (this.enemi2.y + this.enemi2.height)-30 >= this.ball.y && this.ball.x <= (this.enemi2.x + this.enemi2.width)
           && this.enemi2.x <= this.ball.x){
           this.enemi2.disableBody(true, true);
       }

        if(this.enemi4.y <= (this.ball.y) && (this.enemi4.y + this.enemi4.height)-30 >= this.ball.y && this.ball.x <= (this.enemi4.x + this.enemi4.width)
        && this.enemi4.x <= this.ball.x){
            this.enemi4.disableBody(true, true);
        }
    },

    destroyAll(){
        this.player.disableBody(true, true);
        this.enemi1.disableBody(true, true);
        this.enemi2.disableBody(true, true);
        this.enemi3.disableBody(true, true);
        this.enemi4.disableBody(true, true);
        this.obstacle.disableBody(true,true);
        this.ball.setVisible(false);
    },

    gameOver(){
        this.destroyAll();
        var style = { font: "90px Arial Black", fill:"#570505", stroke: '#fff',
            strokeThickness: 4 , align: "center", fontWeight:"bold" };
        var text = this.add.text(220, 50, "Game Over", style);

        const restart = this.add.image(490, 285, 'restart');
        restart.setInteractive();
        restart .once('pointerup', function (){
            this.scene.restart();
        }, this);

        this.add.image(558, 570, 'doorClosed');
    },

    update: function () {
            this.enemyKill();
            this.walkCounter1++;
            this.walkCounter++;
            //Enemy 3/4 Walk left
            if (this.walkCounter1 < 400) {
                this.enemi3.setVelocityX(-25);
                this.enemi3.anims.play('enemi_left', true);

                this.enemi4.setVelocityX(+6);
                this.enemi4.anims.play('enemi_right', true);
            }

            //Enemy 3/4 walk right
            if (this.walkCounter1 >= 400 && this.walkCounter1 < 600) {
                this.enemi3.setVelocityX(+25);
                this.enemi3.anims.play('enemi_right', true);

                this.enemi4.setVelocityX(-6);
                this.enemi4.anims.play('enemi_left', true);
            }

            //Init
            if (this.walkCounter1 == 900) {
                this.walkCounter1 = 1;
            }

            if (this.walkCounter < 500) {
                this.enemi1.setVelocityX(-15);
                this.enemi1.anims.play('enemi_left', true);

                this.enemi2.setVelocityX(10);
                this.enemi2.anims.play('enemi_right', true);
            }

            if (this.walkCounter >= 500 && this.walkCounter < 1000) {
                this.enemi1.setVelocityX(15);
                this.enemi1.anims.play('enemi_right', true);

                this.enemi2.setVelocityX(-10);
                this.enemi2.anims.play('enemi_left', true);
            }

            if (this.walkCounter == 1000) {
                this.walkCounter = 1;
            }

            if (this.cursor.left.isDown && !this.shootingActiv) {
                this.player.setVelocityX(-200);
                this.player.anims.play('move_left', true);
                this.isleft = true;
            } else if (this.cursor.right.isDown && !this.shootingActiv) {
                this.player.setVelocityX(+200);
                this.player.anims.play('move_right', true);
                this.isleft = false;
            } else if (!this.isleft && this.cursor.right.isUp) {
                this.player.setVelocityX(0);
                this.player.anims.play('stand_right', true);
            } else if (this.isleft && this.cursor.left.isUp) {
                this.player.setVelocityX(0);
                this.player.anims.play('stand_left', true);
            }

            //if(cursor.up.isDown &&player.body.touching.down 9 Wenn der Spieler sich auf dem Boden befinden
            if (this.cursor.up.isDown && this.jumpCounter <= 10) {
                this.player.setVelocityY(-240);
                if (!this.isleft) {
                    this.player.anims.play('jump_right', true);
                } else {
                    this.player.anims.play('jump_left', true);
                }
                this.jumpCounter++;
            }

            if (this.player.body.touching.down) {
                this.jumpCounter = 0;
            }

            if (this.key.R.isDown  && this.player.body.touching.down) {
                if (!this.isleft) {
                    this.player.anims.play('shot_right', true);
                } else {
                    this.player.anims.play('shot_left', true);
                }
                this.sound.add('shootAudio').play();
                this.shootingActiv = true;
            }


            if ((this.player.body.touching.left || this.player.body.touching.right || this.obstacle.body.touching.down)) {
                if (this.colliderWithPlayer ||   this.colliderWithObstacle  ) {
                    if (!this.isleft) {
                        this.player.anims.play('touch_right', true);
                        this.lifeCounter--;
                    } else {
                        this.player.anims.play('touch_left', true);
                        this.lifeCounter--;
                    }
                }
            }

        if((this.obstacle.y > 850 && this.obstacle.y < 900) ){
            this.positionX = Phaser.Math.Between(0,1000);
            this.obstacle.x = this.positionX;
            this.obstacle.y = -30;
            this.obstacle.setVelocityY(-7);
        }


            if (this.shootingActiv && !this.isleft) {
                this.ball.setVisible(true);
                this.ball.x += 40;
            }

            if (this.shootingActiv && this.isleft) {
                this.ball.setVisible(true);
                this.ball.x -= 40;
            }

            if (this.ball.x < 0 || this.ball.x > 1000) {
                this.shootingActiv = false;
            }

            if (!this.shootingActiv) {
                this.ball.setVisible(false);
                this.ball.x = this.player.x;
                this.ball.y = this.player.y;
            }


            if (this.lifeCounter == 40) {
                this.life5.destroy();
            }
            if (this.lifeCounter == 30) {
                this.life4.destroy();
            }
            if (this.lifeCounter == 20) {
                this.life3.destroy();
            }
            if (this.lifeCounter == 10) {
                this.life2.destroy();
            }
            if (this.lifeCounter == 0) {
                this.life1.destroy();
                this.gameOver();
            }

            if (this.counter != this.value && this.timer == this.total) {
                this.life1.destroy();
                this.gameOver();
            }

            if (this.counter == this.totalKey) {
                //this.winner();
                this.scene.start('level2');
                this.won = true;
            }
            if (this.timer < this.total) {
                this.index++;

                if (this.index == 300 || this.index == 600 || this.index == 900 || this.index == 1200 || this.index == 1500
                    || this.index == 1800 || this.index == 2100 || this.index == 2400 || this.index == 2700 || this.index == 3000) {
                    if (this.won == false) {
                        this.timer++;
                    }
                    this.timeText.setText('Timer: ' + this.timer + '/' + this.total + 'sec.');
                }
            }
        this.colliderWithPlayer = false;
        this.colliderWithObstacle = false;
    },
});



















const Level2 = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        function Level2(){
            Phaser.Scene.call(this, {key: 'level2'});
            window.GAME = this;
        },


    create: function () {
        this.add.image(0, 0, 'background1').setOrigin(0, 0);
        const rect = this.add.graphics();
        rect.fillStyle(0x222222, 0.8);
        rect.fillRect(0, 10, 1000, 550);

        this.add.image(0, 200, 'control1').setOrigin(0, 0);

        this.add.text(25,315, "Sammle alle medizinisches Kit in vorgegebener Zeit und überlebe gegen die Zombies", {font: "20px Arial Black", fill:"#ffffff",stroke: '#000',
            strokeThickness: 2 , align: "center", fontWeight: "bold"});


        this.add.text(400, 100, "Level 2", {font: "50px Arial Black", fill:"#ffffff", stroke: '#5e0707',
            strokeThickness: 4 , align: "center", fontWeight: "bold"});

       this.enemy =this.add.sprite(0, 600, 'enemyLevel1');
        this.enemyWalkAnimation();
    },

    enemyWalkAnimation(){
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('enemyLevel1', { start: 3, end: 5 }),
            frameRate: 7,
            repeat: -1
        });
    },

    update: function () {
        if(this.enemy.x <= 1000){
            this.enemy.x+= 5;
            this.enemy.anims.play('right', true);
        }else {
            this.scene.start('game2');
        }
    }
});

const Game2 = new Phaser.Class({
    Extends: Phaser.Scene,


    initialize:

        function Game2(){
            Phaser.Scene.call(this, {key: 'game2'});
            window.GAME = this;

        },

    create: function(){
        this.totalTimer = Phaser.Math.Between(25, 30);
        this.values = 13;
        this.time = 1;
        this.walkCounterA =0;
        this.walkCounterB =0;
        this.lifeCounter = 50;
        this.colliderWithObstacle1 = false;
        this.index = 0;

        this.totalHealth = 0;
        this.isleft = true;
        this.colliderWithPlayer = false;
        this.shooting = false;
        this.won1= false;
        this.counter1 =0;
        this.jumpCounter=0;

        this.add.image(0,0,'background1').setOrigin(0,0);

        var rect = this.add.graphics();
        rect.fillStyle(0xffff00, 0.5);
        rect.fillRect(0,0, 1000, 50);


        this.cursor = this.input.keyboard.createCursorKeys();
        this.keyR = this.input.keyboard.addKeys('R');

        this.add.text(610, 14, 'Life: ', { fontSize: '32px', fill: '#5e0202' });
        this.life1 = this.add.image(750, 25, 'logo');
        this.life2 = this.add.image(800, 25, 'logo');
        this.life3 = this.add.image(850, 25, 'logo');
        this.life4 = this.add.image(900, 25, 'logo');
        this.life5 = this.add.image(950, 25, 'logo');

        this.health = this.physics.add.group({
            key: 'health',
            repeat: this.values,
            setXY: { x: 17, y: 0, stepX: 70 }
        });

        this.totalHealth = this.values + 1;
        this.scoreText = this.add.text(16, 14, 'Kits: 0'+'/'+ this.totalHealth, { fontSize: '32px', fill: '#5e0202' });
        this.timeText = this.add.text(285, 14, 'Timer: '+this.time+'/'+this.totalTimer+'sec.', { fontSize: '32px', fill: '#5e0202' });

        this.platformGroup = this.physics.add.staticGroup();

        let ground0 = this.add.sprite(500, 740, 'platform3');
        this.platformGroup.add(ground0);

        let ground1 = this.add.sprite(0, 700, 'platform');
        this.platformGroup.add(ground1);
        let ground2 = this.add.sprite(300, 600, 'platform');
        this.platformGroup.add(ground2);
        let ground3 = this.add.sprite(400, 300, 'platform1');
        this.platformGroup.add(ground3);
        let ground4 = this.add.sprite(700, 500, 'platform1');
        this.platformGroup.add(ground4);

        let ground5 = this.add.sprite(290, 420, 'platform2');
        this.platformGroup.add(ground5);

        let ground6 = this.add.sprite(1010, 300, 'platform');
        this.platformGroup.add(ground6);

        let ground7 = this.add.sprite(100, 200, 'platform4');
        this.platformGroup.add(ground7);

        let ground7a = this.add.sprite(120, 200, 'platform4');
        this.platformGroup.add(ground7a);
        let ground8 = this.add.sprite(700, 200, 'platform4');
        this.platformGroup.add(ground8);

        //lade Player
        this.player1 = this.physics.add.sprite(600,620, 'player');
        this.player1.setBounce(0.1);
        this.player1.setCollideWorldBounds(true);


        this.enemi1a = this.physics.add.sprite(300,520, 'enemyLevel1');
        this.enemi1a.setCollideWorldBounds(true);
        this.enemi1a.setBounce(0.2);

        this.enemi2a = this.physics.add.sprite(700,420, 'enemyLevel1');
        this.enemi2a.setCollideWorldBounds(true);
        this.enemi2a.setBounce(0.2);

        this.enemi3a = this.physics.add.sprite(400,220, 'enemyLevel1');
        this.enemi3a.setCollideWorldBounds(true);
        this.enemi3a.setBounce(0.2);

        this.enemi4a = this.physics.add.sprite(920,220, 'enemyLevel1');
        this.enemi4a.setCollideWorldBounds(true);
        this.enemi4a.setBounce(0.2);

        this.enemyFrame();
        this.playerStand1();
        this.playerMove1();
        this.playerJump1();
        this.playerShot1();
        this.playerTouching1();

        this.ball = this.add.image(this.player1.x, this.player1.y, 'shoot');

        this.obstacle1 = this.physics.add.sprite(Phaser.Math.Between(0, 1000), -30, 'obstacle');
        this.obstacle2 = this.physics.add.sprite(Phaser.Math.Between(0, 1000), -30, 'obstacle');
        this.physics.add.collider(this.player1, this.platformGroup);
        this.physics.add.collider(this.health, this.platformGroup);

        this.physics.add.collider(this.enemi1a, this.platformGroup);
        this.physics.add.collider(this.enemi1a, this.player1,this.colliderEnemyPlayer, null, this);

        this.physics.add.collider(this.enemi2a, this.platformGroup);
        this.physics.add.collider(this.enemi2a, this.player1,this.colliderEnemyPlayer, null, this);

        this.physics.add.collider(this.enemi3a, this.platformGroup);
        this.physics.add.collider(this.enemi3a, this.player1,this.colliderEnemyPlayer, null, this);

        this.physics.add.collider(this.enemi4a, this.platformGroup);
        this.physics.add.collider(this.enemi4a, this.player1,this.colliderEnemyPlayer, null, this);

        this.physics.add.overlap(this.player1, this.health , this.collectHealth, null, this);
        this.physics.add.overlap(this.player1, this.obstacle1 , this.colliderObctaclePlayer, null, this);
        this.physics.add.overlap(this.player1, this.obstacle2 , this.colliderObctaclePlayer, null, this);
    },

    colliderObctaclePlayer(){
        this.sound.add('kollisionAudio').play();
        this.colliderWithObstacle1 = true;
    },

    colliderEnemyPlayer(){
        this.sound.add('kollisionAudio').play();
        this.colliderWithPlayer = true;
    },

    collectHealth (player1, health){
        health.disableBody(true, true);
        this.sound.add('medikitAudio').play();
        this.counter1++;
        if (this.won1 == false) {
            this.scoreText.setText('Kits: ' + this.counter1+'/'+ this.totalHealth);
        }
    },

    playerMove1() {
        this.anims.create({
            key: 'move_left',
            frames: this.anims.generateFrameNumbers('player', { start: 7, end: 2 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'move_right',
            frames: this.anims.generateFrameNumbers('player', {start: 12, end: 16}),
            frameRate: 15,
            repeat: -1
        });
    },

    playerStand1() {
        this.anims.create({
            key:'stand_left',
            frames: [ { key: 'player', frame: 8 } ],
            frameRate: 15
        });

        this.anims.create({
            key:'stand_right',
            frames: [ { key: 'player', frame: 11 } ],
            frameRate: 15
        });
    },

    playerJump1() {
        this.anims.create({
            key: 'jump_right',
            frames: [ { key: 'player', frame: 18 } ],
            frameRate: 15
        }),

            this.anims.create({
                key:'jump_left',
                frames: [ { key: 'player', frame: 1} ],
                frameRate:15
            })
    },

    playerTouching1() {
        this.anims.create({
            key:'touch_left',
            frames: [ { key: 'player', frame: 0 } ],
        });

        this.anims.create({
            key:'touch_right',
            frames: [ { key: 'player', frame: 19 } ],
        });
    },

    playerShot1() {
        this.anims.create({
            key:'shot_left',
            frames: [ { key: 'player', frame: 9 } ],
        });

        this.anims.create({
            key:'shot_right',
            frames: [ { key: 'player', frame: 10 } ],
        });
    },

    enemyFrame(){
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('enemyLevel1', { start: 0, end: 2 }),
            frameRate: 7,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('enemyLevel1', { start: 3, end: 5 }),
            frameRate: 7,
            repeat: -1
        });
    },
    enemyWalk(){
        this.walkCounterA++;
        this.walkCounterB++;
        //Enemy 3/4 Walk left
        if (this.walkCounterA < 400) {
            this.enemi3a.setVelocityX(-15);
            this.enemi3a.anims.play('left', true);

            this.enemi4a.setVelocityX(+6);
            this.enemi4a.anims.play('right', true);
        }

        //Enemy 3/4 walk right
        if (this.walkCounterA >= 400 && this.walkCounterA < 600) {
            this.enemi3a.setVelocityX(+15);
            this.enemi3a.anims.play('right', true);

            this.enemi4a.setVelocityX(-6);
            this.enemi4a.anims.play('left', true);
        }

        //Init
        if (this.walkCounterA == 900) {
            this.walkCounterA = 1;
        }

        if (this.walkCounterB < 500) {
            this.enemi1a.setVelocityX(-15);
            this.enemi1a.anims.play('left', true);

            this.enemi2a.setVelocityX(10);
            this.enemi2a.anims.play('right', true);
        }

        if (this.walkCounterB >= 500 && this.walkCounterB < 1000) {
            this.enemi1a.setVelocityX(15);
            this.enemi1a.anims.play('right', true);

            this.enemi2a.setVelocityX(-10);
            this.enemi2a.anims.play('left', true);
        }

        if (this.walkCounterB == 1000) {
            this.walkCounterB = 1;
        }
    },

    obstacleFall(){
        this.positionX = Phaser.Math.Between(0,1000);
        this.position1X = Phaser.Math.Between(0,1000);

        if((this.obstacle1.y > 850 && this.obstacle1.y < 900) ){
            this.obstacle1.x = this.positionX;
            this.obstacle1.y = -30;
            this.obstacle1.setVelocityY(-7);
        }

        if((this.obstacle2.y > 750 && this.obstacle2.y < 800) ){
            this.obstacle2.x = this.position1X;
            this.obstacle2.y = -30;
            this.obstacle2.setVelocityY(-7);
        }
    },

    playerControl(){
        if (this.cursor.left.isDown && !this.shooting) {
            this.player1.setVelocityX(-200);
            this.player1.anims.play('move_left', true);
            this.isleft = true;
        } else if (this.cursor.right.isDown && !this.shooting) {
            this.player1.setVelocityX(+200);
            this.player1.anims.play('move_right', true);
            this.isleft = false;
        } else if (!this.isleft && this.cursor.right.isUp) {
            this.player1.setVelocityX(0);
            this.player1.anims.play('stand_right', true);
        } else if (this.isleft && this.cursor.left.isUp) {
            this.player1.setVelocityX(0);
            this.player1.anims.play('stand_left', true);
        }

        if (this.cursor.up.isDown && this.jumpCounter <= 15) {
            this.player1.setVelocityY(-240);
            if (!this.isleft) {
                this.player1.anims.play('jump_right', true);
            } else {
                this.player1.anims.play('jump_left', true);
            }
            this.jumpCounter++;
        }

        if (this.player1.body.touching.down) {
            this.jumpCounter = 0;
        }

        if (this.keyR.R.isDown  && this.player1.body.touching.down) {
            if (!this.isleft) {
                this.player1.anims.play('shot_right', true);
            } else {
                this.player1.anims.play('shot_left', true);
            }
            this.sound.add('shootAudio').play();
           this.shooting = true;
        }


        if ((this.player1.body.touching.left || this.player1.body.touching.right || this.obstacle1.body.touching.down
        || this.obstacle2.body.touching.down)) {
            if ( this.colliderWithPlayer || this.colliderWithObstacle1) {
                if (!this.isleft) {
                    this.player1.anims.play('touch_right', true);
                    this.lifeCounter--;
                } else {
                    this.player1.anims.play('touch_left', true);
                    this.lifeCounter--;
                }
            }
        }
    },

    decreaseLife(){
        if (this.lifeCounter == 40) {
            this.life5.destroy();
        }
        if (this.lifeCounter == 30) {
            this.life4.destroy();
        }
        if (this.lifeCounter == 20) {
            this.life3.destroy();
        }
        if (this.lifeCounter == 10) {
            this.life2.destroy();
        }
        if (this.lifeCounter == 0) {
            this.life1.destroy();
            this.gameOver();
        }
    },

    gameTimer(){
        if (this.time < this.totalTimer) {
            this.index++;
            if (this.index == 300 || this.index == 600 || this.index == 900 || this.index == 1200 || this.index == 1500
                || this.index == 1800 || this.index == 2100 || this.index == 2400 || this.index == 2700 || this.index == 3000) {
                if (!this.won1) {
                    this.time++;
                }
                this.timeText.setText('Timer: ' + this.time + '/' + this.totalTimer + 'sec.');
            }
        }
    },

    killEnemies(){
        if(this.enemi1a.y <= (this.ball.y) && (this.enemi1a.y + this.enemi1a.height)-30 >= this.ball.y && this.ball.x <= (this.enemi1a.x + this.enemi1a.width)
            && this.enemi1a.x <= this.ball.x){
            this.enemi1a.disableBody(true, true);
        }

        if(this.enemi3a.y <= (this.ball.y) && (this.enemi3a.y + this.enemi3a.height)-30 >= this.ball.y && this.ball.x <= (this.enemi3a.x + this.enemi3a.width)
            && this.enemi3a.x <= this.ball.x){
            this.enemi3a.disableBody(true, true);
        }

        if(this.enemi2a.y <= (this.ball.y) && (this.enemi2a.y + this.enemi2a.height)-30 >= this.ball.y && this.ball.x <= (this.enemi2a.x + this.enemi2a.width)
            && this.enemi2a.x <= this.ball.x){
            this.enemi2a.disableBody(true, true);
        }

        if(this.enemi4a.y <= (this.ball.y) && (this.enemi4a.y + this.enemi4a.height)-30 >= this.ball.y && this.ball.x <= (this.enemi4a.x + this.enemi4a.width)
            && this.enemi4a.x <= this.ball.x){
            this.enemi4a.disableBody(true, true);
        }
    },


    ballAnimation(){
        if (this.shooting && !this.isleft) {
            this.ball.setVisible(true);
            this.ball.x += 40;
        }

        if (this.shooting&& this.isleft) {
            this.ball.setVisible(true);
            this.ball.x -= 40;
        }

        if (this.ball.x < -10 || this.ball.x > 1010) {
            this.shooting = false;
        }

        if (!this.shooting) {
            this.ball.setVisible(false);
            this.ball.x = this.player1.x;
            this.ball.y = this.player1.y;
        }
    },

    destroyAll(){
        this.player1.disableBody(true, true);
        this.enemi1a.disableBody(true, true);
        this.enemi2a.disableBody(true, true);
        this.enemi3a.disableBody(true, true);
        this.enemi4a.disableBody(true, true);
        this.obstacle1.disableBody(true,true);
        this.obstacle2.disableBody(true,true);
        this.ball.setVisible(false);
    },

    gameOver(){
        this.destroyAll();
        this.add.text(220, 50, "Game Over", { font: "90px Arial Black", fill:"#570505", stroke: '#fff',
            strokeThickness: 4 , align: "center", fontWeight:"bold" });

        const restart = this.add.image(490, 285, 'restart');
        restart.setInteractive();
        restart .once('pointerup', function (){
            this.scene.restart();
        }, this);

        this.add.image(558, 570, 'healthBox');
    },


    update: function (){
        this.gameTimer();
       this. killEnemies();
       this.obstacleFall();
       this.enemyWalk();
       this.playerControl();

       this. ballAnimation();

       this.decreaseLife();

       if(this.counter1 != this.values && this.time == this.totalTimer){
           this.life1.destroy();
           this.gameOver();
       }

       if(this.counter1 == this.totalHealth){
           console.log("winner")
           this.scene.start('mainmenu');
           this.won1 = true;
       }

       this.colliderWithObstacle1 = false;
       this.colliderWithPlayer = false;
    }

});







const config = {
    type: Phaser.AUTO,
    backgroundColor: '#fff',
    scale: {
        parent: "game",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1000,
        height: 740
    },

    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 350},
            debug: false
        }
    },
    scene: [Preloader, MainMenu,Level1, Game1, Level2, Game2]
};

const game = new Phaser.Game(config);