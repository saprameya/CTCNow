"use strict";
//declare clue arrays
const twoCorrect = new Array();
const oneCorrect = new Array();
const wellPlaced = new Array();
const noCorrect = new Array();

function shuffleArray(array) {
  // Shuffle using Fisher–Yates
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
  return array;
}

//set named indexes
const indexes = shuffleArray([0, 1, 2]);

let wpIndex = indexes[0];
let notWpIndex1 = indexes[1];
let notWpIndex2 = indexes[2];

console.log(wpIndex, notWpIndex1, notWpIndex2); // each will be 0, 1, 2 in random order/////////////////////////////////////////

//declare named clue numbers
let wpNum = -1;
let notWpNum1 = -1;
let notWpNum2 = -1;

//declare arrays to hold existent and non-existent values
const existent = new Set();
const nonExistent = new Set();

let currentAnsBox = $("#ans1"); //to recieve user set value

function setClue() {
  const clueSet = new Set();
  while (clueSet.size < 3) {
    const num = Math.floor(Math.random() * 10);
    clueSet.add(num);
  }

  return clueSet;
}

function wpClue() {
  const temp = Array.from(setClue());
  wpNum = temp[wpIndex];
  for (const num of temp) {
    num !== wpNum ? nonExistent.add(num) : existent.add(num);
  }

  for (const num of temp) {
    wellPlaced.push(num);
  }
}

function twoClue() {
  console.log(`existent: ${Array.from(existent)} `); /////////////////////////////////////////////
  console.log(`non existent: ${Array.from(nonExistent)}`); /////////////////////////////////////////////
  

  const tempSet = new Set();

  //Add two numbers that will exist in the answer
  let num = -1;
  for (let i = 0; i < 2; i++) {
    num = Math.floor(Math.random() * 10);
    console.log(i); /////////////////////////
    console.log(`num: ${num}`); ////////////////////////////////////

    while (nonExistent.has(num)) num = Math.floor(Math.random() * 10);
    existent.add(num);
    tempSet.add(num);
  }

  //Add one number that will not exist in the answer
  num = Math.floor(Math.random() * 10);
  console.log(`num: ${num}`); ////////////////////////////////////
  console.log(`existent.has(num): ${existent.has(num)}`); ////////////////////////////
  if (existent.has(num)) {
    while (existent.has(num)) {
      num = Math.floor(Math.random() * 10);
    }
  }
  nonExistent.add(num);
  tempSet.add(num);

  const temp = Array.from(tempSet);
  if (temp.includes(wpNum)) {
    notWpNum1 = wpNum;
    while (temp.indexOf[wpNum] == wpIndex) shuffleArray(temp);
    
  } else{
    for (let i = 0;  i < temp.length; i++) {
      if(!nonExistent.has(temp[i])){
        if(notWpNum1 == -1){
          notWpNum1 = temp[notWpIndex1];
        }else if (notWpNum2 == -1){
           notWpNum2 = temp[notWpIndex2];
        }
      }
    }
  }

  

  console.log(`temp: ${temp}`);///////////////////////////
  console.log(`wpNum: ${wpNum}`); ////////////////////////
  console.log(`notWpNum1: ${notWpNum1}`); //////////////////////
  console.log(`notWpNum2: ${notWpNum2}`); /////////////////////////
}

function oneClue() {
  let correctCount = 0;
  let notCorrectCount = 0;
  let temp;

  temp = new Array();
  temp = Array.from(setClue());
  correctCount = 0;
  notCorrectCount = 0;
  for (const num of temp) {
    if (existent.has(num)) correctCount++;
    if (nonExistent.has(num)) notCorrectCount++;
  }
  while (correctCount > 1 || notCorrectCount > 2) {
    temp = new Array();
    temp = Array.from(setClue());
    correctCount = 0;
    notCorrectCount = 0;
    for (const num of temp) {
      if (existent.has(num)) correctCount++;
      if (nonExistent.has(num)) notCorrectCount++;
    }
  }

  if (correctCount == 0) {
    if (existent.size == 3) {
      temp[Math.floor(Math.random() * 3)] = Array.from(existent)[Math.random() * 3];
    } else {
      do {
        temp[notWpIndex1] = Math.floor(Math.random() * 10);
      } while (!nonExistent.has(temp[notWpIndex1]));
      notWpNum2 = temp[notWpIndex1];
      existent.add(temp[notWpIndex1]);
    }
  }

  if (temp.includes(wpNum)) {
    while (temp.indexOf(wpNum) == wpIndex) {
      shuffleArray(temp);
    }
  }
  if (temp.includes(notWpNum1)) {
    while (temp.indexOf(notWpNum1) == notWpNum2) {
      shuffleArray(temp);
    }
  }
  if (temp.includes(notWpNum2)) {
    while (temp.indexOf(notWpNum2) == notWpNum1) {
      shuffleArray(temp);
    }
  }
  for (const num of temp) {
    oneCorrect.push(num);
  }
}

$().ready(() => {
  //set clues

  wpClue();
  twoClue();
  // oneClue();
  console.log(`wellPlaced:`);
  console.log(wellPlaced); ////////////////////////////
  console.log(`twoCorrect:`);
  console.log(twoCorrect); ////////////////////////////
  console.log(`oneCorrect:`);
  console.log(oneCorrect); ////////////////////////////
  console.log(`existent:`);
  console.log(existent); /////////////////////////////////
  console.log(`nonExistent:`);
  console.log(nonExistent); ///////////////////////////////
  // set currentAnsBox if user clicks on an input box
  $(".ans-box").on("click", function (e) {
    currentAnsBox = $(this);
    e.preventDefault();
  });

  //set value of input box and move active input box to the next box
  $(".number-btn").click((e) => {
    if (currentAnsBox.length == 0) {
      currentAnsBox = $("#ans1");
    }
    currentAnsBox.val(e.currentTarget.value);
    currentAnsBox = currentAnsBox.next();
    e.preventDefault();
  });

  //get submitted answer
  $("#submit").click((e) => {
    const answer = [];
    $(".ans-box").each(function () {
      answer.push($(this).val());
    });

    const answerSet = Array.from(new Set(answer));
    if (answerSet.length !== answer.length) {
      alert("Duplicate numbers not allowed");
    }

    console.log(new Set(answer).size); ///////////////////////////////////////////////////////////////
    e.preventDefault();
  });
});
