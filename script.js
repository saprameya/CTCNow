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

function rearrange(array, num, index) {
  if (index == wpIndex) {
    while (array.indexOf(num) !== wpIndex) shuffleArray(array);
    return array;
  }
  if (index === notWpIndex1) {
    while (array.indexOf(num) === notWpIndex1) shuffleArray(array);
    return array;
  }
  if (index === notWpIndex2) {
    while (array.indexOf(num) === notWpIndex2) shuffleArray(array);
    return array;
  }
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
  const tempSet = new Set();
  let num = Math.floor(Math.random() * 10);
  while (nonExistent.has(num)) num = Math.floor(Math.random() * 10);
  tempSet.add(num);
  existent.add(num);
  wpNum = num;

  while (tempSet.size < 3) {
    num = Math.floor(Math.random() * 10);
    while (existent.has(num)) num = Math.floor(Math.random() * 10);
    tempSet.add(num);
    nonExistent.add(num);
  }

  let temp = Array.from(tempSet);

  temp = rearrange(temp, wpNum, wpIndex);

  for (const num of temp) {
    wellPlaced.push(num);
  }

  if (existent.size < 3) {
    wpNum == notWpNum1 ? (notWpNum1 = -1) : (notWpNum2 = -1);
  }
}

function twoClue() {
  let temp = Array.from(setClue());
  notWpNum1 = temp[notWpIndex1];
  existent.add(notWpNum1);
  notWpNum2 = temp[notWpIndex2];
  existent.add(notWpNum2);
  nonExistent.add(temp[wpIndex]);

  for (const num of temp) {
    twoCorrect.push(num);
  }
}

function oneClue() {
  const tempSet = new Set();
  let num = -1;
  let tempNum = -1;

  if (existent.size < 3) {
    num = Math.floor(Math.random() * 10);
    while (nonExistent.has(num)) num = Math.floor(Math.random() * 10);
    tempSet.add(num);
    existent.add(num);
  } else {
    let index = Math.floor(Math.random() * 3);
    num = Array.from(existent)[index];
    tempSet.add(num);
  }

  if (notWpNum1 == -1) {
    notWpNum1 = num;
  } else if (notWpNum2 == -1) {
    notWpNum2 = num;
  }

  while (tempSet.size < 3) {
    num = Math.floor(Math.random() * 10);
    while (existent.has(num)) num = Math.floor(Math.random() * 10);
    tempSet.add(num);
    nonExistent.add(num);
  }

  let temp = Array.from(tempSet);
  if (temp.includes(wpNum)) {
    while (temp.indexOf(wpNum) == wpIndex) shuffleArray(temp);
  }
  if (temp.includes(notWpNum1)) {
    while (temp.indexOf(notWpNum1) == notWpIndex1) shuffleArray(temp);
  }
  if (temp.includes(notWpNum2)) {
    while (temp.indexOf(notWpNum2) == notWpIndex2) shuffleArray(temp);
  }

  for (const num of temp) {
    oneCorrect.push(num);
  }

  console.log(`wellPlaced: ${wellPlaced}`);
  console.log(`twoCorrect: ${twoCorrect}`);
  console.log(`oneCorrect: ${oneCorrect}`);
  console.log(`wpNum: ${wpNum}`);
  console.log(`notWpNum1: ${notWpNum1}`);
  console.log(`notWpNum2: ${notWpNum2}`);
  console.log(`existent: ${Array.from(existent)}`);
  console.log(`nonExistent: ${Array.from(nonExistent)}`);
}

$().ready(() => {
  //set clues
  twoClue();

  wpClue();
  oneClue();

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
    if (answerSet.includes("")) {
      alert("Please fill all 3 boxes");
    }

    console.log(answer); ///////////////////////////////////////////////////////////////
    e.preventDefault();
  });
});
