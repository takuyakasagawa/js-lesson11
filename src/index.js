import './assets/scss/styles.scss';
import moment from 'moment';

const SECOND = 1000; // 1000ミリ秒
const MINUTE = 60 * SECOND; // 1分のミリ秒数
const DAY = 24 * 60 * MINUTE; // 1日のミリ秒数

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
    this.updateTimer = this.updateTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.pausedTimer = this.pausedTimer.bind(this);
    this.resetValues = this.resetValues.bind(this);
    this.displayTime = this.displayTime.bind(this);
    this.getHistory = App.getHistory.bind(this);
    this.saveIntervalData = this.saveIntervalData.bind(this);
    this.displayCyclesToday = this.displayCyclesToday.bind(this);
    this.displayHistory = this.displayHistory.bind(this);

    this.resetValues();
    this.getElements();
    this.toggleEvents();
    this.displayTime();
    this.displayCyclesToday();
    this.displayHistory();
    this.removeOldHistory();
  }

  saveIntervalData(momentItem) {
    const collection = this.getHistory(); // 既に保存されているデータの取得。
    collection.push(momentItem.valueOf()); // 新しいデータを追加する。
    // JSON形式で再度保存する。
    localStorage.setItem('intervalData', JSON.stringify(collection));
  }

  removeOldHistory() {
    const now = moment();
    const startOfToday = now.startOf('day'); // 今日の開始時
    const sevenDaysAgo = startOfToday.subtract(7, 'days'); // 今日の開始時から7日前
    const collection = this.getHistory(); 
    // フィルター関数で今日の開始時から今日の開始時から7日前までの間のデータのみを取得する
    const newCollection = collection.filter((item) => {
      const timestampOfItem = parseInt(item, 10);
      return timestampOfItem >= sevenDaysAgo;
    });
    // 取得したデータを再度保存する。
    localStorage.setItem('intervalData', JSON.stringify(newCollection));
  }

  static getHistory() {
    const items = localStorage.getItem('intervalData');
    let collection = [];
    // localStorageにはArrayを直接保存出来ないので、JSON形式で保存しています。
    // 取り出す時は、JSON.parseでarrayに戻します。
    if (items) collection = JSON.parse(items);
    return collection;
  }

  displayCyclesToday(time = moment()) {
    const collection = this.getHistory();
    const startOfToday = time.startOf('day');
    // 今日の始まりより後の時間のデータのみを取得してfilterItemsに格納する。
    const filterItems = collection.filter(item => (
      parseInt(item, 10) >= startOfToday.valueOf()
    ));
    const count = filterItems.length;
    const percent = count / 4 * 100;
    this.countOfTodayDisplay.innerHTML = `${count.toString()}回 / 4回`;
    this.percentOfTodayDisplay.innerHTML = `目標を${percent}％達成中です。`;
  }

  resetValues() {
    this.workLength = 25;
    this.breakLength = 5;
    this.longBreakLength = 15;
    this.startAt = null;
    this.endAt = null;
    this.pausedAt = null;
    this.isTimerStopped = true;
    this.onWork = true;
    this.tempCycles = 0;
  }

  getElements() {
    this.timeDisplay = document.getElementById('time-display');
    this.countOfTodayDisplay = document.getElementById('count-today');
    this.percentOfTodayDisplay = document.getElementById('percent-today');
    this.historyDisplay = document.getElementById('history');
    this.startButton = document.getElementById('start-button');
    this.stopButton = document.getElementById('stop-button');
    this.pausedButton = document.getElementById('paused-button');
  }
  
  toggleEvents() {
    this.startButton.addEventListener('click', this.startTimer);
    this.stopButton.addEventListener('click', this.stopTimer);
    this.pausedButton.addEventListener('click', this.pausedTimer);
  }

  startTimer(e = null, time = moment()) {
    if (e) e.preventDefault();
    this.startButton.disabled = true;
    this.stopButton.disabled = false;
    this.pausedButton.disabled = false;
    this.timerUpdater = window.setInterval(this.updateTimer, 500);
    if (this.pausedAt) {
      const diff = moment(time).diff(this.pausedAt);//var duration = moment.duration(x.diff(y));
      console.log(diff);
    } else {
      this.isTimerStopped = false;
      this.startAt = time;
      const startAtClone = moment(this.startAt);
      this.endAt = startAtClone.add(this.workLength, 'minutes');
    }
    // タイムラグがあるので、0.5秒ごとにアップデートする。
    this.displayTime();
  }

  pausedTimer() {
    this.displayTime();
  }
  
  stopTimer(e = null) {
    if (e) e.preventDefault();
    this.resetValues();
    this.startButton.disabled = false;
    this.stopButton.disabled = true;
    //this.pausedButton.disabled = true;
    window.clearInterval(this.timerUpdater);
    this.timerUpdater = null;
    this.displayTime();
  }

  updateTimer(time = moment()) {
    const rest = this.endAt.diff(time); // 残り時間を取得
    if (rest <= 0) { // 残り時間が0以下の場合に切り替えを行う。
      if (this.onWork) {
        this.saveIntervalData(time);
        this.displayCyclesToday(); // 追加
        this.displayHistory(); // 追加
      }
      this.onWork = !this.onWork;
      this.startAt = time;

      //Aの条件
      if (this.onWork) {
        this.endAt = moment(time).add(this.workLength, 'minutes');
      }

      if (!this.onWork) {
        this.endAt = moment(time).add(this.breakLength, 'minutes');
        this.tempCycles ++;
      }

      //Bの条件式
      if (this.tempCycles == 4) {
        this.endAt = moment(time).add(this.longBreakLength, 'minutes');
        this.tempCycles = 0;
      } 
    }
    this.displayTime(time);
  }

	displayTime(time = moment()) {
    let mins;
    let secs;
    if (this.isTimerStopped) {
      mins = this.workLength.toString();
      secs = 0;
    } else {
      const diff = this.endAt.diff(time); // 与えられた時間(通常現在時刻)と、終了時刻との差を取得。差はミリ秒で得られる。
      mins = Math.floor(diff / MINUTE); // 分数を得て、少数点以下の切り捨てを行う
      secs = Math.floor((diff % MINUTE) / 1000); // 秒数を得て、少数点以下の切り捨てを行う
    }
    const minsString = mins.toString();
    let secsString = secs.toString();
    if (secs < 10) {
      secsString = `0${secsString}`;
    }
    this.timeDisplay.innerHTML = `${minsString}:${secsString}`;
  }

  displayHistory(time = moment()) {
    const collection = this.getHistory();
    const startOfToday = time.startOf('day');
    const startOfTodayClone = moment(startOfToday);
    const sevenDaysAgo = startOfTodayClone.subtract(7, 'days');
    const valOfSevenDaysAgo = sevenDaysAgo.valueOf();
    const tableEl = document.createElement('table');
    tableEl.classList.add('table', 'table-bordered');
    const trElDate = document.createElement('tr');
    const trElCount = document.createElement('tr');
    for (let i = 0; i <= 6; i += 1) {
      const filterItems = collection.filter((item) => {
        const timestampOfItem = parseInt(item, 10);
        return timestampOfItem >= valOfSevenDaysAgo + i * DAY
          && timestampOfItem < valOfSevenDaysAgo + (i + 1) * DAY;
      });
      const count = filterItems.length;
      const thElDate = document.createElement('th');
      const tdElCount = document.createElement('td');
      const sevenDaysAgoCloen = moment(sevenDaysAgo);
      thElDate.innerHTML = sevenDaysAgoCloen.add(i, 'day').format('MM月DD日');
      tdElCount.innerHTML = `${count}回<br>達成率${count / 4 * 100}%`;
      trElDate.appendChild(thElDate);
      trElCount.appendChild(tdElCount);
    }
    tableEl.appendChild(trElDate);
    tableEl.appendChild(trElCount);
    this.historyDisplay.appendChild(tableEl);
  }
}
// ロード時にAppクラスをインスタンス化する。
window.addEventListener('load', () => new App()); 

export default App;