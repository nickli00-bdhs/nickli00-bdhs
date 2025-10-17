const guessSubmit = document.querySelector(".guessSubmit");
const guessField = document.querySelector(".guessField");
const result = document.querySelector(".result");
const count = document.querySelector(".count");
const guesses = document.querySelector(".guesses");
const restartBtn = document.querySelector(".restartBtn");
const feedback = document.querySelector(".feedback");

const timerDisplay = document.querySelector(".timer");
const scoreDisplay = document.querySelector(".score");
let timeLeft = 30;
let timerInterval = null;
let gameStarted = false;



let countNum =0;   //廣域變數
let randomNumber = Math.floor( Math.random()*100 );
console.log("觀察隨機的數字：", randomNumber);

function checkGuess() {
    startTimer(); // 開始倒數（只會啟動一次）
    countNum++;
    count.textContent = "猜測次數："+countNum;
    const userGuess = Number(guessField.value);  //取得欄位值，並轉為數字
    guesses.textContent += userGuess + " ";  


    if (userGuess === randomNumber) {
        result.textContent = "🎉 猜對了！";
        result.style.backgroundColor = "#8fbc8f";
        giveRating(countNum);
        animateResult("correct");
        calculateScore(); // 顯示總分
        setGameOver();
    } else if (userGuess < randomNumber) {
        result.textContent = "數字太小!";
        animateResult("wrong");
    } else if (userGuess > randomNumber) {
        result.textContent = "數字太大!";
        animateResult("wrong");
    }

    if (countNum >= 10 && userGuess !== randomNumber) {
        result.textContent = "遊戲結束！答案是：" + randomNumber;
        result.style.backgroundColor = "red";
        calculateScore(); // 顯示總分
        setGameOver();
    }
    //guessField.focus();       //游標焦點預設在輸入欄位裡
    if (countNum > 10){
        result.textContent += "遊戲結束";
        result.style.backgroundColor="red";
        alert("遊戲結束");
        setGameOver();
    }
    guessField.value = "";

}
function setGameOver() {
        guessField.disabled = true;   //停止輸入功能
        guessSubmit.disabled = true;  //停止按鈕功能
        clearInterval(timerInterval); // 停止計時

}
function initGame() {
    // 初始化遊戲
    countNum = 0;
    timeLeft = 30;
    gameStarted = false;
    randomNumber = Math.floor(Math.random() * 100) + 1;

    guessField.disabled = false;
    guessSubmit.disabled = false;
    guessField.value = "";

    result.textContent = "猜測結果：";
    result.style.backgroundColor = "";
    feedback.textContent = "";
    guesses.textContent = "已猜過的數字：";
    count.textContent = "猜測次數：0";
    timerDisplay.textContent = "剩餘時間：30 秒";
    scoreDisplay.textContent = "總分：0";

    clearInterval(timerInterval); // 確保清掉計時器

}
function giveRating(guessCount) {
    let rating = "";
    if (guessCount <= 3) {
        rating = "🏆 高手！太強了！";
    } else if (guessCount <= 6) {
        rating = "👍 不錯喔～";
    } else if (guessCount <= 10) {
        rating = "😅 可以更好喔～";
    } else {
        rating = "💪 加油！再試試！";
    }
    feedback.textContent = "評價：" + rating;
}

function animateResult(type) {
  result.classList.remove("shake");
  void result.offsetWidth; // 觸發 reflow
  if (type === "wrong") {
    result.classList.add("shake");
  }
}

function startTimer() {
    if (gameStarted) return; // 防止重複啟動
    gameStarted = true;
    startCountdownTicks(30);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `剩餘時間：${timeLeft} 秒`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            result.textContent = "⏰ 時間到！遊戲結束。答案是：" + randomNumber;
            result.style.backgroundColor = "red";
            playGameOverSound();
            calculateScore(); // 顯示總分
            setGameOver();
        }
    }, 1000);
}

// 計算總分函式
function calculateScore() {
  const score = Math.max(0, timeLeft * 10 - countNum * 5);
  scoreDisplay.textContent = "總分：" + score;
}

guessSubmit.addEventListener("click", checkGuess);   //當按鈕被點擊，執行函式
restartBtn.addEventListener("click", initGame);





const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTick(frequency = 1000, duration = 0.05) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

function startCountdownTicks(totalSeconds = 30) {
  let timeLeft = totalSeconds;

  function tick() {
    if (timeLeft <= 0) {
      console.log("計時結束");
      return;
    }

    playTick();

    // 計算下一次滴答間隔（ms）
    let interval = 1000; // 正常1秒一次

    if (timeLeft <= 1) interval = 100;       // 1秒剩下時，0.1秒一次
    else if (timeLeft <= 3) interval = 200;  // 3秒剩下時，0.2秒一次
    else if (timeLeft <= 5) interval = 300;  // 5秒剩下時，0.3秒一次
    else if (timeLeft <= 10) interval = 500; // 10秒剩下時，0.5秒一次
    else if (timeLeft <= 20) interval = 700; // 20秒剩下時，0.7秒一次

    timeLeft--;

    setTimeout(tick, interval);
  }

  tick(); // 啟動第一次
}
