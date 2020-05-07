import logBuilder from './trailer';
/**
 * 例外管理
 * @export
 */
export default function handleErrors(): void {
  // コンソール及び、ログに残す
  const leaveLog = logBuilder(''); // `app.log`に書き込む
  // Promiseのエラーがcatchされなかった場合
  process.on('unhandledRejection', (reason: unknown): void => {
    if (typeof reason === 'string') {
      leaveLog(`${reason}`); // ログに残しておく
      process.exitCode = 1;
    }
  });
  // 予期せぬエラー
  process.on('uncaughtException', (err: Error): void => {
    process.stderr.write(err.message);
    process.abort();
  });
}
