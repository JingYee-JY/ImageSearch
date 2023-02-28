const play = document.getElementById("play");
const start = document.getElementById("start");
const again = document.getElementById("again");
const home = document.getElementById("home");

const startPage = document.getElementById("startPage");
const instructionPage = document.getElementById("instructionPage");
const gamePage = document.getElementById("gamePage");
const popUp = document.getElementById("popUp");
const finalPage = document.getElementById("finalPage");

const clickSound = document.getElementById("click")
const clap = document.getElementById("clap")
const completed = document.getElementById("correct")
const wrong = document.getElementById("wrong")
const lose = document.getElementById("lose")

const scoreCount = document.getElementById("score-count")
const questionCount = document.getElementById("question-count")
const canvas = document.getElementById("play_area");
const ctx = canvas.getContext('2d');
const mark = document.getElementById("mark")
const checkAnswer = document.getElementById("checkAnswer")
const showAnswer = document.getElementById("showAnswer")
const correctAnswer = document.getElementById("correctAnswer")
const medal = document.getElementById("medal")
const words1 = document.getElementById("words1")
const words2 = document.getElementById("words2")
const scoreText = document.getElementById("scoreText")

//use this for selection page
const levelButtons = document.querySelectorAll(".levelButton");
const selectionPage = document.getElementById("selectionPage");

//here for selection page
let levelIndex;

//here for level buttons condition
const levels = [
    //example of catch the flower game
    {type:"picture&words"},
    {type:"picture"},
    {type:"words"}
]

let current;
let addscore = 1
let total = 5;
let score;

let tempoArray = [];

const maxX = 180; // add to the min X for the max X for that shelf.
const SHELF_COORDINATES = [{minX: 100, yLevel: 110},
    {minX: 100, yLevel: 230}, {minX: 100, yLevel: 350}] // 3 rows

const MAX_COUNT_PER_SHELF = 3;

var itemsOnShelf = [];

class ShelfObject {


    constructor(objectName, url) {

        this.objectName = objectName;
        this.url = url;
    }
}

const shelfObjects = [
    new ShelfObject("Books", "img/Objects/Books.png"),
    new ShelfObject("Box", "img/Objects/Box.png"),
    new ShelfObject("Candles", "img/Objects/Candles.png"),
    new ShelfObject("Clock", "img/Objects/clock.png"),
    new ShelfObject("Computer", "img/Objects/Computer.png"),
    new ShelfObject("Cup", "img/Objects/Cup.png"),
    new ShelfObject("Lamp", "img/Objects/Lamp.png"),
    new ShelfObject("Picture Frame", "img/Objects/PictureFrame.png"),
    new ShelfObject("Plant", "img/Objects/Plant.png"),
    new ShelfObject("Teddy Bear", "img/Objects/TeddyBear.png"),
    new ShelfObject("Vases", "img/Objects/Vases.png"),
    new ShelfObject("Heart Picture", "img/Objects/WallFrame.png"),
    new ShelfObject("Milo", "img/Objects/milo.png"),
    new ShelfObject("Phone", "img/Objects/phone.png"),
    new ShelfObject("Keys", "img/Objects/keys.png"),
    

]
var tempo = [];
let randomChosenShelfObject;

//here is finalV2
const group1 = document.querySelector(".group1");

play.addEventListener("click", () => {
    playClickSound()
    setTimeout(() => {
        startPage.classList.add("hide")
        selectionPage.classList.remove("hide")
    }, 200);
})

start.addEventListener("click", () => {
    playClickSound()
    setTimeout(() => {
        instructionPage.classList.add("hide")
        gamePage.classList.remove("hide")
        current = 1
        score = 0
        randomizeShelfObjects();
        loadShelf();
    }, 200);
})

levelButtons.forEach(function(level){
    level.addEventListener('click', () => {
        playClickSound()
        setTimeout(() => {
            levelIndex = level.getAttribute("data-level") - 1
            selectionPage.classList.add("hide")
            instructionPage.classList.remove("hide")
        }, 200);
    })    
})

function checkingAnswer(playerCorrect){
    playClickSound()
    popUp.classList.remove("hide")
    if(playerCorrect){
        mark.src = "./img/correct.png"
        checkAnswer.textContent = "Correct!"
        showAnswer.classList.add("hide")
        score +=1
        scoreCount.textContent = score;
    }
    else{
        mark.src = "./img/wrong.png"
        checkAnswer.textContent = "Good try!"
    }
    
    setTimeout(function(){
        popUp.classList.add("hide");
        if(current == total){
            endGame()
        }
        else{
            console.log(tempo)
            reset();
            randomizeChosenShelfObject();
            current++;
        }
    }, 3000)
}

again.addEventListener("click", () => {
  playClickSound()
  //controls amd buttons visibility
  let delay = setTimeout(() => {
    startPage.classList.remove("hide");
    finalPage.classList.add("hide")
  }, 200);
});

home.addEventListener("click", () => {
  playClickSound()
  let delay = setTimeout(() => {
    location.assign('https://gimme.sg/activations/minigames/main.html');
  }, 200);
})

function getMousePos(canvas, e) { // because canvas and bitmap is diff size
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

    return {
        x: (e.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (e.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}

function randomizeShelfObjects()
{
    tempo = [];
    for(let i=0; i < shelfObjects.length; i++){
        tempo.push(shelfObjects[i]);
    }

    for(let i = tempo.length - 1; i > 0; i--)
    {
        var randomIndex = Math.floor(Math.random() * i);
        
        var lastIndex = tempo[i];


        tempo[i] = tempo[randomIndex];
        tempo[randomIndex] = lastIndex;
        
    }
    
    console.log(tempo);


    

}

function randomizeChosenShelfObject()
{
    if(tempo.length > 0)
    {
        randomChosenShelfObject = tempo[Math.floor(Math.random() * tempo.length)]

        console.log(randomChosenShelfObject)

        if(levels[levelIndex].type == "words" ){
            document.getElementById("questionTitle").innerHTML = "<p>Find:<p><p>" +
            randomChosenShelfObject.objectName + "</p>";
        }
        else if(levels[levelIndex].type == "picture" ){
            document.getElementById("questionTitle").innerHTML = "<p>Find:<p><img src='" +
            randomChosenShelfObject.url + "'>";
        }
        else{
            document.getElementById("questionTitle").innerHTML = "<p>Find:<p><img src='" +
            randomChosenShelfObject.url + "'><p>"+
            randomChosenShelfObject.objectName + "</p>";
        }
    }

}

function isIntersect(point, object) 
{
    return Math.sqrt((point.x- object.x) ** 2 + (point.y - object.y) ** 2) < object.radius;
}

function loadShelf()
{
    
    var image = new Image();
    image.src = "css/images/shelf.png";
    
    
    image.onload = function () {

        ctx.drawImage(image, 0, 0, 450, 650);
        
        
        
        var shelfCount = 0;
        var xPositionIncrement = 0;
        var count = 0;
        questionCount.innerHTML = current + `/5`
        
        var itemCount = 0;
        
        var extraObjects = [];


        tempo.forEach((shelfObj) => 
        {
            
      

            if(itemCount < 9)
            {
              
                var newImage = new Image();
                newImage.src = shelfObj.url;

                var shelfRowDetails = SHELF_COORDINATES[shelfCount];
                var shelfRowX = shelfRowDetails.minX + xPositionIncrement;

                newImage.onload = function () {




                    console.log(newImage.src)


                    ctx.drawImage(newImage, shelfRowX, shelfRowDetails.yLevel, 70, 90);
                    
                    


                }

                itemsOnShelf.push({
                    x: shelfRowX + 30,
                    y: shelfRowDetails.yLevel + 50,
                    radius: 40,
                    name: shelfObj.objectName
                })

                /*ctx.beginPath();
                ctx.arc(shelfRowX + 30, 
                    shelfRowDetails.yLevel + 50, 45, 0, 2 * Math.PI, false);
                ctx.fillStyle = "green";
                ctx.fill();*/


                xPositionIncrement += 90;


                count++;

                if(MAX_COUNT_PER_SHELF === count)
                {
                    xPositionIncrement = 0;
                    shelfCount++;
                    count = 0;
                }
            }
            else
            {
              

                extraObjects.push(shelfObj.objectName);
            }
            
            itemCount++;
            
        })
        
        extraObjects.forEach((value) => {

            console.log(value)
            deleteFromArray(tempo, value);
        })
        
        
        console.log(tempo)
        randomizeChosenShelfObject();
  

        /*image = new Image();
        image.src = "css/images/Room 1/Book.png";

        image.onload = function () {

            ctx.drawImage(image, 280, 180, 70, 90);

            itemsOnShelf.push({
                x: 280 + 30, 
                y: 180 + 50,
                radius: 40,
                name: "red_book"
            })

            ctx.beginPath();
            ctx.arc(280 + 30, 180 + 50, 40, 0, 2 * Math.PI, false);
            ctx.fillStyle = "green";
            ctx.fill();


            ctx.drawImage(image, 100, 180, 70, 90);

            itemsOnShelf.push({
                x: 100 + 30,
                y: 180 + 50,
                radius: 40,
                name: "red_book2"
            })

            ctx.beginPath();
            ctx.arc(100 + 30, 180 + 50, 40, 0, 2 * Math.PI, false);
            ctx.fillStyle = "green";
            ctx.fill();

            
            ctx.drawImage(image, 190, 180, 70, 90);

            itemsOnShelf.push({
                x: 190 + 30,
                y: 180 + 50,
                radius: 40,
                name: "red_book3"
            })

            ctx.beginPath();
            ctx.arc(190 + 30, 180 + 50, 40, 0, 2 * Math.PI, false);
            ctx.fillStyle = "green";
            ctx.fill();*/
            
            
        //}
        
    }
 
}

canvas.addEventListener("click", function (e) {

    const mousePos = getMousePos(canvas, e);

    
    // debug click circle
    /*console.log(canvas.style.width)
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, 70, 0, 2 * Math.PI, false);
    ctx.fillStyle = "green";
    ctx.fill();*/
    
    for(let i = 0; i < itemsOnShelf.length; i++)
    {
    


        if(isIntersect(mousePos, itemsOnShelf[i]))
        {
            console.log(itemsOnShelf[i].name)

            if(itemsOnShelf[i].name === randomChosenShelfObject.objectName)
            {
                console.log("correct")

                checkingAnswer(true)
                
                deleteFromArray(tempo, randomChosenShelfObject.objectName);
            }
            else{
                checkingAnswer(false)
            }
            break;
        }
    }
    

})


function deleteFromArray(array, name)
{
    let deleteCount = 0;
    for(let x = 0; x < array.length; x++)
    {
        if(array[x].objectName === name)
        {
            deleteCount = x;
            console.log(deleteCount + " DELETE")
            console.log("DELETED " + name);
            break;
        }
    }
    
    array.splice(deleteCount, 1);
}

function reset(){
    itemsOnShelf = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    randomizeShelfObjects();
    loadShelf();
}


function playClickSound(){
    console.log(clickSound)
    clickSound.currentTime = 0
    clickSound.play()
}

function endGame(){
    console.log("end")
    finalPage.classList.remove("hide")

    let pass = total / 2

    //this is for first version
    if(levelIndex == 0){//REMOVE THIS BARKET/LINE
        if(score < pass){
            lose.currentTime = 0
            lose.play()
            medal.classList.add("hidden")
            scoreText.textContent = "You tried!"
            words1.innerHTML = "Good try!"
            words2.textContent = "do better next time"
        }
        else{
            clap.currentTime = 0
            clap.play() 
            medal.classList.remove("hidden")
            scoreText.textContent = "Good job!"
            words1.innerHTML = `You got <br> ${score} right!`
            words2.textContent = ""
            setTimeout(function(){
                confetti.start()
                setTimeout(function(){
                    confetti.stop()
                }, 2000)
            }, 500)
        }
    } //REMOVE THIS BARKET/LINE

    //this is for second version
    else{//REMOVE THIS BARKET/LINE
        let starScore = total / 5;
        //change the star image according the score;
        if(score < pass){
            lose.currentTime = 0
            lose.play()
            if(score == starScore + starScore)
                    medal.src = "./img/youTried.png"
                else if(score < starScore + starScore && score >= starScore) // score < 2 && score >= 1
                    medal.src = "./img/youTried1.png"
                else
                    medal.src = "./img/youTried2.png"

            group1.classList.add("group1V2")
            scoreText.textContent = "Good try!"
            scoreText.classList.add("scoreTextV2")
            words1.classList.add("words1V2")
            words2.classList.add("words2V2")
            words1.innerHTML = "Your score"
        }
        else{
            clap.currentTime = 0
            clap.play()
            if(score == total) // score = 5
                medal.src = "./img/excellent.png"
            else if(score < total && score >= total - starScore) // score < 5 && score >= 4
                medal.src = "./img/wellDone.png"
            else if(score < total - starScore && score >= (total - starScore - starScore)) // score < 4 && score >= 3
                medal.src = "./img/wellDone1.png"

            group1.classList.add("group1V2")
            words1.classList.add("words1V2")
            words2.classList.add("words2V2")

            scoreText.classList.add("scoreTextV2")

            if(score == total){
                scoreText.textContent = "Superstar!"
            }
            else if(score > pass){
                scoreText.textContent = "Well done!"
            }
            else{
                scoreText.textContent = "Good try!"
            }

            setTimeout(function(){
                confetti.start()
                setTimeout(function(){
                    confetti.stop()
                }, 2000)
            }, 500)
        }
        words1.innerHTML = "Your score"
        words2.textContent = score + "/" + total
    } //REMOVE THIS BARKET/LINE
}

/*prevent double tag zoom*/
document.addEventListener('dblclick', function(event) {
    event.preventDefault();
    }, { passive: false });

/*prevent right click*/
document.addEventListener('contextmenu', event =>
 event.preventDefault());
