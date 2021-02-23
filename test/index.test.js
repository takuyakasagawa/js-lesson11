import App from '../src/index';
import template from './template'; // テスト内でhtmlファイルのbody部分を読み込む。
import moment from 'moment';

// describe('displayTime', () => {
//   test('初期化時に25:00を表示する。', () => {
//     document.body.innerHTML = template;
//     const app = new App();
//     const timeDisplay = document.getElementById('time-display');
//     expect(app.isTimerStopped).toBeTruthy(); // 初期状態でタイマーは止まっています
//     expect(timeDisplay.innerHTML).toEqual('25:00'); // 25:00が表示されていることを確認します。
//   });
// });

// describe('startTimer', () => {
//   test('スタートボタンにdisable属性を追加', () => {
//     document.body.innerHTML = template;
//     const app = new App();
//     app.startTimer();
//     const startButton = document.getElementById('start-button');
//     const stopButton = document.getElementById('stop-button');
//     expect(startButton.disabled).toEqual(true);
//     expect(stopButton.disabled).toEqual(false);
//     expect(app.isTimerStopped).toEqual(false);
//   });
// });

test('カウントダウン中の時間を適切に表示する。', () => {
  document.body.innerHTML = template;
  const app = new App();
  const now = moment();
  const startOfToday = now.startOf('day');
  // タイマースタート後の状態を作り出す。
  app.startButton.disabled = true;
  app.stopButton.disabled = false;
  app.isTimerStopped = false;
  app.startAt = startOfToday;
  app.endAt = moment(startOfToday).add(25, 'minutes');
  // タイマースタートしてから51秒後の時間でテストを行う。
  app.displayTime(moment(startOfToday).add(51, 'seconds'));
  const timeDisplay = document.getElementById('time-display');
  expect(timeDisplay.innerHTML).toEqual('24:09'); // 51秒経過しているので残り時間は24:09
});