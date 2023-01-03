const canvas = document.getElementById("play_area");
const ctx = canvas.getContext('2d');

window.onload = init;

  function init(){
    // the code to be called when the dom has loaded
    // #document has its nodes
    const startButton = document.getElementById("start_button");
    const startScreen = document.getElementById("main_screen");
    const againButton = document.getElementById("again_button");
    const resultScreen = document.getElementById("result_screen");
    const homeButton = document.getElementById("home_button");
    
    startButton.addEventListener("click", function (){
        startScreen.classList.add("hide");
    })
    againButton.addEventListener("click", function (){
        resultScreen.classList.add("hide")
        questionCount = 1;
        console.log(questionCount)
        reset();
    })
    homeButton.addEventListener("click", function(){
        location.assign('https://gimme.sg/activations/dementia/');
    })
  }


class ShelfObject {


    constructor(objectName, url) {

        this.objectName = objectName;
        this.url = url;
    }
}

const maxX = 180; // add to the min X for the max X for that shelf.
const SHELF_COORDINATES = [{minX: 100, yLevel: 110},
    {minX: 100, yLevel: 230}, {minX: 100, yLevel: 350}] // 3 rows

const MAX_COUNT_PER_SHELF = 3;

var itemsOnShelf = [];

const shelfObjects = [
    new ShelfObject("Books", "css/images/Objects/Books.png"),
    new ShelfObject("Box", "css/images/Objects/Box.png"),
    new ShelfObject("Candles", "css/images/Objects/Candles.png"),
    new ShelfObject("Clock", "css/images/Objects/clock.png"),
    new ShelfObject("Computer", "css/images/Objects/Computer.png"),
    new ShelfObject("Cup", "css/images/Objects/Cup.png"),
    new ShelfObject("Lamp", "css/images/Objects/Lamp.png"),
    new ShelfObject("Picture Frame", "css/images/Objects/PictureFrame.png"),
    new ShelfObject("Plant", "css/images/Objects/Plant.png"),
    new ShelfObject("Teddy Bear", "css/images/Objects/TeddyBear.png"),
    new ShelfObject("Vases", "css/images/Objects/Vases.png"),
    new ShelfObject("Heart Picture", "css/images/Objects/WallFrame.png"),
    new ShelfObject("Milo", "css/images/Objects/milo.png"),
    new ShelfObject("Phone", "css/images/Objects/phone.png"),
    new ShelfObject("Keys", "css/images/Objects/keys.png"),
    

]
var tempo = [];

var questionCount = 1;
let randomChosenShelfObject;



randomizeShelfObjects();

loadShelf();

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

        document.getElementById("title").innerHTML = "Find: <br> <u>" +
            randomChosenShelfObject.objectName + "</u>";
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
        document.getElementById("question").innerHTML = questionCount + `/5`
        
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

                document.querySelector(".icon").src = "./css/images/correct.svg";
                
                deleteFromArray(tempo, randomChosenShelfObject.objectName);
                console.log(questionCount)
                setTimeout(() =>{
                    document.querySelector(".icon").src = "";
                    questionCount ++;
                    document.getElementById("question").innerHTML = questionCount + `/5`
                    
                    if(questionCount > 5){
                        console.log("win")
                        console.log(questionCount)
                        document.getElementById("result_screen").classList.remove("hide"); 
                    }
                    else{
                        console.log(tempo)
                        reset();
                        randomizeChosenShelfObject();
                    }
                }, 1000)
           
            }
            else{
                document.querySelector(".icon").src = "./css/images/wrong.svg";
                setTimeout(() =>{
                    document.querySelector(".icon").src = "";
                }, 500)
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
