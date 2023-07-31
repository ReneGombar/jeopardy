//Hey Ben! to change the min score values or the minimum  flipped cards to 
// unlock the next stage go to line 200 and 209


var newElement = document.getElementsByClassName("question");
var hidElement = document.getElementById("hidElement")
import placeholderQuestions from "./placeholder-questions.js"

let url = document.location.search      //returns query string
let params = new URLSearchParams(url)
let user1 = params.get("user1") 
let user2 = params.get("user2") 

let u1score = params.get("u1score") 
let u2score = params.get("u2score") 
let usedQuestionIndexes = params.get("usedQ")

//gets the column elemnts of play grid
let cat0 = document.querySelector("#cat0")
let cat1 = document.querySelector("#cat1")
let cat2 = document.querySelector("#cat2")
let cat3 = document.querySelector("#cat3")
let cat4 = document.querySelector("#cat4")
let cat5 = document.querySelector("#cat5")

let container = document.querySelector(".container")
let nextRound = document.querySelector(".nextRound")

let globalPlayerTracker = document.querySelector("#currentPlayerTracker")
let questionValueDiv = document.querySelector("#questionValue")

let playerTurnLabel = document.querySelector("#playerTurn")
let playerTurnHidden = document.querySelector("#playerTurnQuestionBox")
let questionText = document.querySelector("#questionText")

let player1scoreLabel = document.querySelector("#player1score")
let player2scoreLabel = document.querySelector("#player2score")

let playerAnswer = document.querySelector("#playerAnswer")
let cA = document.querySelector("#correctAnswer")

let passBtn = document.querySelector("#passBtn")
let answerBtn = document.querySelector("#answerBtn")

console.log(globalPlayerTracker.innerHTML)
// Player is a object with 3 keys: id, name, score
class Player{
    constructor(id, name, score){
        this.id = id
        this.name = name
        this.score = score
    }
}

//First check if both names are declared if not redirect to intor page
if (user1 === "" || user2 === "") { document.location = "index.html" } 
//reformat the names to start with capital and launch the main()
else {
    user1 = (user1
        .split(' ')
        .map(word => word != "" ?
             word[0].toUpperCase() +
             word.slice(1).toLowerCase():
             null
            )
        .join(' ')
    );
    user2 = user2
    .split(' ')
    .map(word => word != "" ?
         word[0].toUpperCase() +
         word.slice(1).toLowerCase():
         null
        )
    .join(' ')
    }


// create player objects from user names and assign score values
//if previous rounds -> than assign those values
(u1score === "" || u1score == null ) ? u1score = 0 : null;
(u2score === "" || u2score == null) ? u2score = 0 : null;

let player1 = new Player(1,user1,parseInt(u1score))
let player2 = new Player(2,user2,parseInt(u2score))

//show initial scores of 0 this might change for round 2 (load them from previous round)
player1scoreLabel.textContent = `${player1.name}'s Score: ${player1.score}`
player2scoreLabel.textContent = `${player2.name}'s Score: ${player2.score}`

//*** THIS PART IS HARDCODED! This should get pulled from the question file automatically*/
//index category questions
let ogTable = {
"Nature" : [0,1,2,3,4,5,6,7,8,9],
"Animals" : [10,11,12,13,14,15,16,17,18,19],
"Computers" : [20,21,22,23,24,25,26,27,28,29],
"Mythology" : [30,31,32,33,34,35,36,37,38,39],
"History" : [40,41,42,43,44,45,46,47,48,49],
"General" : [50,51,52,53,54,55,56,57,58,59],
"Final" : [60]
}

//********************* end of hardcoded tables*************/

//get all the keys from og table and for each key shuffle its array
// and assign into a new object CatTable
let catTable = {}
Object.keys(ogTable).map((item) => {
    catTable[item] = ((randomizeArray(ogTable[item])))
})
//console.log(ogTable)
//console.log(catTable)

//create an array that will hold all the used up questions and sends them with search query 
//to be removed in round two. If any usedQuestions are present it means we are on Round2 page
//we need to filter out the usedQuestions from our original catTbles
if (usedQuestionIndexes === "" || usedQuestionIndexes == null ){
    usedQuestionIndexes = []
    //console.log(usedQuestionIndexes)
}
else {
    // format the query parameters into an array which holds all the used up 
    //questions from the first round
    usedQuestionIndexes = usedQuestionIndexes.split(",").map(item => parseInt(item))
    console.log(usedQuestionIndexes)
    // create a temp object round2Table which has the used up questions filtered out of it
    let round2Table ={}
    Object.keys(catTable).map((item) => {
    round2Table[item] = ((removeDuplicates(catTable[item],usedQuestionIndexes)))
    })
    //console.log(round2Table)
    //assign the temp object to the catTable variable to be used in round 2 page
    catTable = round2Table    
}

// this hold all of the caegory names
let namesOfCategories = await getCategoryNames()
console.log(namesOfCategories)

// ***TO-DO: randomize the order of categories on both pages

//question counter , resets on next page load
//at a certain number it will activate the next round button
let questionsAsked = 0

//return category names from the placeHolder file
async function getCategoryNames(){
    let namesOfCategories =[]
    for (let i=0; i<placeholderQuestions.length;i++){
        namesOfCategories.push(placeholderQuestions[i].category)
    }
    return Array.from(new Set(namesOfCategories)).filter(i => i !=="Final")
}

//function to remove indexes from the catTable that were used in round one so 
//the questions in round two do not repeat
function removeDuplicates(catTable,usedQuestionIndexes){
    let newArray = []
    newArray = catTable.filter(val => !usedQuestionIndexes.includes(val))
    return newArray
}

//this returns a shuffled array of original array x 
function randomizeArray(x){
    let newOrder = []
    let randomNum = null
    //console.log(x.length)
    while (newOrder.length < x.length){
        randomNum = Math.floor(Math.random() * x.length)
        if (!newOrder.includes(x[randomNum])) {newOrder.push(x[randomNum])}
    }
    return newOrder
}

// this is called from main() and after each enswer is submited to update the
// player turn and their scores
async function updateMainInfo(questionsAsked){
    // whoose turn is it
    let currentPlayer = 1
    //read current player from a hidden div elemnt in the body
    // for scoping reasons
    if (globalPlayerTracker.innerHTML == 1){
        currentPlayer = player1
    }
    else {currentPlayer = player2}
    
    // informs whose turn is it 
    playerTurnLabel.textContent = `${currentPlayer.name}'s turn`
    
    //update the score value for players
    player1scoreLabel.textContent = `${player1.name}'s Score: ${player1.score}`
    player2scoreLabel.textContent = `${player2.name}'s Score: ${player2.score}`
    
    //check if anyone reached 15000 point if yes enable Next Round btn
    //check if on first page? If yes check for player scores and if higher than 15000 enable round two btn
    //also check how many questions were asked, if more than 30 enable next round

    if (document.head.querySelector("title").innerHTML == "Jeopardy Round one"){
        if (player1.score >= 10000 || player2.score  >= 10000|| questionsAsked >2 ) {
            nextRound.style = "pointer-events:auto;background-color: rgba(174, 0, 0, 0.582);"
            //modify the link for the next round to include player scores and string of all the used up questions
            //from round 1
            nextRound.href = `round-2.html?user1=${user1}&user2=${user2}&u1score=${player1.score}&u2score=${player2.score}&usedQ=${usedQuestionIndexes}`
        }
        else{nextRound.style = "pointer-events:none;background-color: rgba(83, 18, 18, 0.582);"}
    }
    //check if we are on the second round page and if anyone reached 30000 point than enable Final round btn
    //or questions asked is more than 10 enable final round button
    if (document.head.querySelector("title").innerHTML == "Jeopardy Round Two"){
        if (player1.score >= 15000 || player2.score  >= 15000 || questionsAsked >2 ){
            nextRound.style = "pointer-events:auto;background-color: rgba(174, 0, 0, 0.582);"
            
            //modify the link for the next round to include player scores
            nextRound.href = `final-jeopardy.html?user1=${user1}&user2=${user2}&u1score=${player1.score}&u2score=${player2.score}`    
        }
        else{nextRound.style = "pointer-events:none;background-color: rgba(83, 18, 18, 0.582);"}
    }
}

// function that gets called when a player clicks on a grid element
// it takes in the elements inner text ($100 ...) and the elements index 
async function changeText(x,i){
    let priceValue = x
    let questionIndex = i
    let currentPlayer = null
    passBtn.style = "pointer-events:auto;";
    //use player object based on the id in the global player tracker
    if (globalPlayerTracker.innerHTML == 1){
        currentPlayer = player1
    }
    else {currentPlayer = player2}

    //increase amount of questions asked by one
    questionsAsked = questionsAsked + 1
    console.log(`questions asked ${questionsAsked}`)

    //change the properties of the question box clicked to grey and deactivate it
    newElement[i].style = "background-color : grey; pointer-events:none; "
    
    // display  the question box with a animation
    hidElement.style = "display:flex;"
    hidElement.style.animation="flipzoom 2s"
    playerAnswer.value =""
    
    //get the parent element of the clicked grid element
    questionIndex = newElement[i].parentElement

    // informs whose turn is it and for $usd
    playerTurnHidden.textContent = `${currentPlayer.name}'s turn for ${priceValue}`
    
    //console.log(priceValue,questionIndex.childNodes[1].textContent,currentPlayer)
    
    //parent category is  array and display it
    let parentCategory = questionIndex.childNodes[1].textContent
    
    // retrieve the array of indexes for question in picked category
    let categoryQuestionsIndexes = catTable[parentCategory]

    //for the  first item in the array, get the question and its answer in variables 
    //and display in box, Always start with first index in the array. Since the array is shuffled
    //in the begining
    let questionInBox = (placeholderQuestions[categoryQuestionsIndexes[0]].question)
    let correctAnswer = (placeholderQuestions[categoryQuestionsIndexes[0]].answer)
    cA.innerHTML = placeholderQuestions[categoryQuestionsIndexes[0]].answer
    questionValueDiv.innerHTML = priceValue.slice(1)
    //console log the question and its index inside catTable and console log the correct answer
    console.log(categoryQuestionsIndexes[0], questionInBox, correctAnswer)

    //the used up questions index is pushed into the usedQuestions Array
    usedQuestionIndexes.push(categoryQuestionsIndexes[0])

    //remove the question from the table of possible questions for this category
    catTable[parentCategory].shift()
    console.log(usedQuestionIndexes)
    
    //console.log(catTable)
    questionText.textContent = questionInBox
    
    // click event for pass buttton switches the players, resets the text and disables the pass button
    passBtn.addEventListener ("click", async (event) => {
        //event.preventDefault()
        //player switching 
        (currentPlayer == player1)? currentPlayer = player2 : currentPlayer = player1
        // update the label top label with whose turn is it and for $usd
        playerTurnHidden.textContent = `${currentPlayer.name}'s chance for ${priceValue}`
        // global player tracker is pdated with the current player after the switch
        globalPlayerTracker.innerHTML = currentPlayer.id
        //clear the text area box 
        playerAnswer.textContent =""
        //disable the pass button
        passBtn.style = "pointer-events:none;";
    })

    // submit answer button click: check if answer is correct then increase current players score
    // if incorect decrese current player score
    answerBtn.addEventListener('click', (event) => submitAnswerBtn() )   //******************* try submitAnswerBtn
        function submitAnswerBtn(){
        //read the correct answer and question value from a  hidden div element in the html body
        // for some scoping reason I could not get the values into here without saving 
        // them into HTML elements
        correctAnswer = cA.innerHTML
        priceValue = questionValueDiv.innerHTML
        //event.preventDefault()
        console.log(playerAnswer.value + " "+ correctAnswer)
        
        //check player input against the correct answer, sanitize input
        if (playerAnswer.value.toLowerCase().trim() == correctAnswer.toLowerCase()){
                //FOR CORRECT ANSWER
                console.log(currentPlayer.name + ` correct answer `+priceValue )
                //increase current player score by the question value
                currentPlayer.score = currentPlayer.score + parseInt(priceValue)
        }
        else {
            // FOR INCORRECT ANSWER
            console.log(currentPlayer.name + ` incorect answer `+priceValue )
            currentPlayer.score = currentPlayer.score - parseInt(priceValue)
            //incorect answer will switch to next player
            currentPlayer == player1 ? currentPlayer = player2 : currentPlayer = player1
        }
        playerAnswer.textContent =""
        hidElement.style = "display:none;"
        globalPlayerTracker.innerHTML = currentPlayer.id
        console.log(player1)
        console.log(player2)
        updateMainInfo(questionsAsked)
        event.stopImmediatePropagation()
    }
}

async function main(player1,player2){
    //add eventListener to all af the question boxes in the grid, when clicked the clicked
    //elements ineerHTML and elements index are sent into changeText()
    for (let i=0; i < newElement.length; i++){
        newElement[i].addEventListener('focus', async function(){changeText(newElement[i].innerHTML, i);});}
    
    //populate category names into the grid
    // only for  round one and round two
    //*** HARDCODED category placement! Should be randomly assigned****** */
    //for round one
    if (document.head.querySelector("title").innerHTML == "Jeopardy Round one"){
        cat0.childNodes[1].textContent = namesOfCategories[0]
        cat1.childNodes[1].textContent = namesOfCategories[1]
        cat2.childNodes[1].textContent = namesOfCategories[2]
        cat3.childNodes[1].textContent = namesOfCategories[3]
        cat4.childNodes[1].textContent = namesOfCategories[4]
        cat5.childNodes[1].textContent = namesOfCategories[5]
    }
    //for round two
    if (document.head.querySelector("title").innerHTML == "Jeopardy Round Two"){
        cat0.childNodes[1].textContent = namesOfCategories[0]
        cat1.childNodes[1].textContent = namesOfCategories[1]
        cat2.childNodes[1].textContent = namesOfCategories[2]
        cat3.childNodes[1].textContent = namesOfCategories[3]
        cat4.childNodes[1].textContent = namesOfCategories[4]
        cat5.childNodes[1].textContent = namesOfCategories[5]
    }

    //all of final round page code is bellow .First check if page is on final round then proceed
    if (document.head.querySelector("title").innerHTML == "Final Round"){
        let mainAlex = document.querySelector(".alex")
        let h1Winner = document.querySelector("#winnerLabel")
        let winner = document.querySelector("#winner")
        
        //condition to check if one of the players have zero or negative score makes the other one 
        //be the automatic winner. If both negative than go home
        if (player1.score <=0 && player2.score >0){
            mainAlex.style="display:none;"
            winner.style = "display:flex"
            h1Winner.textContent = `Congratulations ${player2.name} YOU WIN ${player2.score}$`
        }
        else if (player1.score >0 && player2.score <=0 ){
            mainAlex.style="display:none;"
            winner.style = "display:flex"
            h1Winner.textContent = `Congratulations ${player1.name} YOU WIN ${player1.score}$`
        }
        else if (player1.score <= 0 && player2.score <=0){
            mainAlex.style="display:none;"
            winner.style = "display:flex"
            h1Winner.textContent = `You both are pathetic loosers. Go home!`
        }

        let finalCategory = document.querySelector(".finalCategory")
        let playerTurn = document.querySelector("#currentPlayerTracker")
        let user1WagerAmount = document.querySelector("#user1Wager")
        let user2WagerAmount = document.querySelector("#user2Wager")
        let placeBetsBtn = document.querySelector("#placeBetsBtn")

        //two inputs for player to enter their wagers
        user1WagerAmount.style = "font-size:1em;"
        user2WagerAmount.style = "font-size:1em;"
        user1WagerAmount.placeholder = `${player1.name}'s wager max(${player1.score}):`
        user2WagerAmount.placeholder = `${player2.name}'s wager max(${player2.score}):`
    
        //when clicked place wagers do this
        placeBetsBtn.addEventListener("click", (event)=>{
            event.preventDefault()
            
            //check if wagers are lower or equal to players score and not lower than 0
            if (parseInt(user1WagerAmount.value) <= player1.score && parseInt(user2WagerAmount.value) <= player2.score &&
            parseInt(user1WagerAmount.value) >= 0 && parseInt(user2WagerAmount.value) >= 0 ){
                
                let scoreLine = document.querySelector(".score")
                let lastAnswer = document.querySelector("#LastQuestion")
                let lastAnswerInput = document.querySelector("#userFinalAnswer")
                let finalAnswerBtn = document.querySelector("#finalAnswerBtn")

                //save the two wages as numbers
                let p1wager = parseInt(user1WagerAmount.value)
                let p2wager = parseInt(user2WagerAmount.value)
                player1scoreLabel.style = "display:flex;"

                //display a label with how much each player wagered
                player1scoreLabel.innerHTML= `${player1.name} you waged ${p1wager}$ of your ${player1.score}$.`
                player2scoreLabel.innerHTML= `${player2.name} you waged ${p2wager}$ of your ${player2.score}$.`
                console.log(p1wager,p2wager )
                user1WagerAmount.style = "display:none;"
                user2WagerAmount.style = "display:none;"
                lastAnswerInput.style = "font-size:1em;"
                finalAnswerBtn.style = "font-size:1.2em;"
                finalCategory.textContent = `FINAL QUESTION:`
                document.querySelector("#finalQuestion").innerHTML = `${placeholderQuestions[catTable.Final].question}`
                placeBetsBtn.style= "display:flex;"
                lastAnswer.style = "display:flex;"
                
                //ask for player 1 answer
                lastAnswerInput.placeholder = `${player1.name} enter your answer`
                let p1=""
                let p2=""
                finalAnswerBtn.addEventListener("click", (e)=>{
                    e.preventDefault()
                    
                    if (playerTurn.innerHTML == 1){
                        p1 = lastAnswerInput.value
                        lastAnswerInput.value = ""
                        lastAnswerInput.placeholder = `${player2.name} enter your answer`
                        playerTurn.innerHTML = 2}
                    else {
                        p2 = lastAnswerInput.value
                        console.log(p1,p2)
                        let p1FinalScore = 0
                        let p2FinalScore = 0

                        //check if any player is correct if yes add their wager to their score
                        //if wrong take the wager away
                        //than check who has the higher final score and declare the winner
                        if (p1.toLowerCase() == placeholderQuestions[catTable.Final].answer.toLowerCase()){
                            mainAlex.style ="display:none"
                            winner.style= "display:flex;"   
                            p1FinalScore = player1.score + p1wager}
                        else {p1FinalScore = player1.score - p1wager}

                        //player 2 check for correct answer
                        if (p2.toLowerCase() == placeholderQuestions[catTable.Final].answer.toLowerCase()){
                            mainAlex.style ="display:none;"
                            winner.style= "display:flex;"
                            p2FinalScore = player2.score + p2wager}
                        else {p2FinalScore = player2.score - p2wager}
                        
                        //check who has the higher score
                        if (p1FinalScore > p2FinalScore){
                            h1Winner.textContent = `Congratulations ${player1.name} YOU WIN ${p1FinalScore}$`}
                        else if (p1FinalScore < p2FinalScore){
                            h1Winner.textContent = `Congratulations ${player2.name} YOU WIN ${p2FinalScore}$`}
                        
                        //if the score is equal they both go home with it
                        else if (p1FinalScore == p2FinalScore){
                            h1Winner.textContent = `${player1.name} you go home with ${p1FinalScore}$ and ${player2.name} you go home with ${p2FinalScore}$ `
                            mainAlex.style ="display:none"
                            winner.style= "display:flex;"
                        }
                    }
                })
            }
        })
    }

    // update the info on board page
    updateMainInfo()
}

// call main() function with player names as paramaters
main(player1,player2)

/* timer is not implemented yet
    //timer 30s
    let timeleft = 30;
    let countdown = setInterval(function(){
        if (timeleft <= 0){clearInterval(countdown);
            document.getElementById("timer").innerHTML="Finished";}
        else{
            document.getElementById("timer").innerHTML = timeleft + " second left.";}
            timeleft -=1;}
        ,1000)
    */
