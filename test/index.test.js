import App from '../src/index';
import template from './template'; // テスト内でhtmlファイルのbody部分を読み込む。

// describe('displayTime', () => {
//   test('初期化時に25:00を表示する。', () => {
//     document.body.innerHTML = template;
//     const app = new App();
//     const timeDisplay = document.getElementById('time-display');
//     expect(app.isTimerStopped).toBeTruthy(); // 初期状態でタイマーは止まっています
//     expect(timeDisplay.innerHTML).toEqual('25:00'); // 25:00が表示されていることを確認します。
//   });
// });

describe('startTimer', () => {
  test('スタートボタンにdisable属性を追加', () => {
    document.body.innerHTML = template;
    const app = new App();
    app.startTimer();
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    expect(startButton.disabled).toEqual(true);
    expect(stopButton.disabled).toEqual(false);
    expect(app.isTimerStopped).toEqual(false);
  });
});