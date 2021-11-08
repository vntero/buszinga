let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')

let intervalId = 0;
let gameTime = 0;
let score = 0;
let chargerIndexes = []
let speed = 5


// --------- IMAGES ---------

let bg = new Image();
bg.src = "./Images/sun-and-clouds.png";

let road = new Image ();
road.src = './Images/road.png';

let mountain = new Image ();
mountain.src = './Images/mountain.png';

let bigMountain = new Image ();
bigMountain.src = './Images/big-mountain.png';

let carOne = new Image();
carOne.src = "./Images/car-one.png";

let carTwo = new Image();
carTwo.src = "./Images/car-two.png";

let carThree = new Image();
carThree.src = "./Images/car-three.png";

let carFour = new Image ();
carFour.src = "./Images/car-four.png";

let truckOne = new Image ();
truckOne.src = './Images/truck-one.png'

let truckTwo = new Image ();
truckTwo.src = './Images/truck-two.png'

let truckThree = new Image ();
truckThree.src = './Images/truck-three.png'

let truckA = new Image ();
truckA.src = './Images/truck-ambulance.png'

let bushes = new Image ();
bushes.src = './Images/bushes.png'

let trees = new Image ();
trees.src = './Images/trees.png'

let bus = new Image();
bus.src = "./Images/bus.png";

let charger = new Image ();
charger.src = './Images/charger.png'

let school = new Image ();
school.src = './Images/school.png';

//SOUND EFFECTS
var soundtrack = new Audio ("./Sound/soundtrack.mp3");
soundtrack.volume = 0.1;

var scoreUp = new Audio ("./Sound/score.mp3");
scoreUp.volume = 0.6;

var crash = new Audio ("./Sound/crash.mp3");
crash.volume = 0.3;

var youlose = new Audio ("./Sound/youlose.mp3");
youlose.volume = 0.1;

var youwin = new Audio ("./Sound/youwin.mp3");
youwin.volume = 0.5;


//MOVING BACKGROUND
let movingTrees = [
    {img: trees, x:0 , y:0},
    {img: trees, x:1000, y:0},
    {img: trees, x:2000, y:0},
    {img: trees, x:3000, y:0},
    {img: trees, x:4000, y:0},
    {img: trees, x:5000, y:0},
    {img: trees, x:6000, y:0},
    {img: trees, x:7000, y:0},
    {img: trees, x:8000, y:0},
    {img: trees, x:9000, y:0},
    {img: trees, x:10000, y:0},
    {img: trees, x:11000, y:0},
]

let movingBushes = [
  {img: bushes, x:0 , y:0},
  {img: bushes, x:1000, y:0},
  {img: bushes, x:2000, y:0},
  {img: bushes, x:3000, y:0},
  {img: bushes, x:4000, y:0},
  {img: bushes, x:5000, y:0},
  {img: bushes, x:6000, y:0},
  {img: bushes, x:7000, y:0},
  {img: bushes, x:8000, y:0},
  {img: bushes, x:9000, y:0},
  {img: bushes, x:10000, y:0},
  {img: bushes, x:11000, y:0},
]

//OBSTACLES ON THE ROAD
let busX = 20, busY= 320;
let schoolX = 700, schoolY= 390;
let isGameOver = false;

let characters = [truckOne, truckA, truckTwo, truckThree, charger, carOne, carTwo, carThree, carFour]
let lanes = [330, 390, 450]
let obstacles = [
    {
        img: characters[Math.floor(Math.random() * characters.length)],
        x: canvas.width,
        y: lanes[Math.floor(Math.random() * lanes.length -10)]
    }
]

//CONTROLLING THE BUS
document.addEventListener('keydown', e => {
    switch (e.keyCode) {
        case 40:
        if (busY < 400){
            busY = busY + 60;
              };
             break;
        case 38:
        if (busY > 350){
            busY = busY - 60;
             };
             break;
        }
})

//THIIIIS COULD BE THE STAAAART OF SOMETHING NEEEWWW
function startGame(){
    ctx.drawImage(bg, 0, 0, 1000, 400);
    ctx.drawImage(mountain, 0, 0, 1000, 350);
    ctx.drawImage(bigMountain, 600, 0, 300, 300);
    ctx.drawImage(road, 0, 300, 1000, 200);
    ctx.drawImage(bus, busX, busY, 70, 40);


        soundtrack.play();

      //MAKE THE BACKGROUND ACTUALLY MOVE
        for (let i = 0; i < movingBushes.length; i++){
          ctx.drawImage(bushes, movingBushes[i].x, movingBushes[i].y, 1000, 300)
          movingBushes[i].x = movingBushes[i].x - 0.25;
        }

        for (let i = 0; i < movingTrees.length; i++){
          ctx.drawImage(trees, movingTrees[i].x, movingTrees[i].y, 1000, 300)
          movingTrees[i].x = movingTrees[i].x - 0.5;
        }

        //OBSTACLES
        for(let i=0; i< obstacles.length; i++){
            if(obstacles[i] != null){

        ctx.drawImage(obstacles[i].img, obstacles[i].x, obstacles[i].y)
        obstacles[i].x -= speed

            if (obstacles[i].x == 900) {
                obstacles.push({
                    img: characters[Math.floor(Math.random() * characters.length)],
                    x: canvas.width + 75,
                    y:lanes[Math.floor(Math.random() * lanes.length)]
                })
            }

        //HOW TO HANDLE COLLISIONS
            if (
                busX < obstacles[i].x + obstacles[i].img.width &&
                busX + 70 > obstacles[i].x &&
                busY < obstacles[i].y + obstacles[i].img.height &&
                busY + 40 > obstacles[i].y
            ) {
                if (obstacles[i].img.src.includes('charger') && !chargerIndexes.includes(i)){
                    chargerIndexes.push(i)
                    score = score + 10;
                    scoreUp.play();
                    if (score == 110){
                        speed++;
                        bus.src = './Images/bus.png'
                    }
                }
                else if (!obstacles[i].img.src.includes('charger') ) {
                    crash.play();
                    youlose.play();
                    isGameOver = true
                    window.location.href = './youlose.html';

                }
                else if (obstacles[i].img.src.includes('charger')){
                    obstacles[i] = null;
                }
            }

            if (score == 50) {
              youwin.play();
              window.location.href = './youwin.html';
            }
         }
        }

    //SCORE
    ctx.font = '35px montserrat, sans-serif, white';
    ctx.fillStyle = 'white'
    ctx.fillText(`Battery: ${score} kWh`, 30, 30)

    if (isGameOver) {
        cancelAnimationFrame(intervalId)
    }
    else {
        intervalId = requestAnimationFrame(startGame)
    }
}


startGame()
