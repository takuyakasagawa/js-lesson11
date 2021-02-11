import './assets/scss/styles.scss';
import moment from 'moment';

class App {
  constructor() {
		this.workLength = 25; // 25分間
        this.breakLength = 5; // 5分間
        this.isTimerStopped = true; // 最初はタイマーは止まっている
    this.onWork = true; // 最初は作業からタイマーは始まる
    
    this.timeDisplay = document.getElementById('time-display');

    this.startAt = null; // カウントダウン開始時の時間
    this.endAt = null; // カウントダウン終了時の時間

    this.startTimer = this.startTimer.bind(this); 

    this.getElements();
    this.toggleEvents();
    this.displayTime();
  }

  getElements() {
    this.timeDisplay = document.getElementById('time-display');
    this.startButton = document.getElementById('start-button');
    this.stopButton = document.getElementById('stop-button');
  }
  
  toggleEvents() {
    this.startButton.addEventListener('click', this.startTimer);
  }


  startTimer(e = null, time = moment()) {
    if (e) e.preventDefault();
    this.startButton.disabled = true;
    this.stopButton.disabled = false;
    this.isTimerStopped = false;
    this.startAt = time;
    const startAtClone = moment(this.startAt);
    this.endAt = startAtClone.add(this.workLength, 'minutes');
    this.timerUpdater = window.setInterval(this.updateTimer, 500);
    // タイムラグがあるので、0.5秒ごとにアップデートする。
  }

  updateTimer() {}
	displayTime() {
    // 残りの分数と秒数を与えるための変数
    let mins;
    let secs;
    // タイマーがストップしている時は、常に作業時間の長さを表示。
    if (this.isTimerStopped) {
      mins = this.workLength;
      secs = 0;
    }
    // 数値を文字に変換
    const minsString = mins.toString();
    let secsString = secs.toString();
    // 秒数が一桁のときは0を加えて2桁表示にする。
    if (secs < 10) {
      secsString = `0${secsString}`;
    }
    // 最後に分数と秒数を表示
    this.timeDisplay.innerHTML = `${minsString}:${secsString}`;
  }
  
}

// ロード時にAppクラスをインスタンス化する。
window.addEventListener('load', () => new App()); 

export default App;