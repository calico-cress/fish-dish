import { Transform } from 'stream';
interface InitiationCond {
  result: boolean;
  regex: RegExp;
}
const statuses = [
  // 読込準備
  'preparation',
  // 読込開始
  'start',
  // 読込中
  'loading',
  // 読込完了
  'complete',
] as const;
type Status = typeof statuses[number];
/**
 * `emlx`ファイルからワンタイムパスワードを抽出
 * @export
 * @class ExtractStream
 * @extends {Transform}
 */
export default class ExtractStream extends Transform {
  // 現在の読み込みステータス
  private status: Status = 'preparation';
  // デコードする対象
  private buffer: string[] = [];
  // 抽出対象の条件とする件名
  private readonly requireSubj: string = '';
  // 件名の正規表現（UTF-8のBエンコーディングのみ対象）
  private readonly regexSubj = /Subject:\s=\?UTF-8\?B\?(.+)\?=/;
  // メッセージ本文の読み込み開始条件
  private initConds: InitiationCond[] = [
    { result: false, regex: /Content-Transfer-Encoding:\sbase64/ },
    { result: false, regex: /Content-Type:\stext\/plain;/ },
    { result: false, regex: /\s*charset=UTF-8/ },
  ];
  // 本文の終了正規表現
  private readonly regexMsgEnd = /Content-Transfer-Encoding:\sbase64/;
  // ワンタイムパスワードの正規表現
  private readonly regexPass = /\s+(\d{4,})\s+/;

  /**
   * Creates an instance of ExtractStream.
   * @param {string} [subject='確認コード']
   * @memberof ExtractStream
   */
  public constructor(subject = '確認コード') {
    super();
    this.requireSubj = subject;
  }
  /**
   * チャンクの受け取り
   * @param {string} chunk 1行単位
   * @memberof ExtractStream
   */
  public _transform(
    chunk: string | Buffer,
    _encoding: string,
    callback: Function
  ): void {
    const line = chunk.toString();

    switch (this.status) {
      case 'preparation':
        // メールの件名から処理対象の要否を判定する
        const subj = this.regexSubj.exec(line);
        if (
          subj &&
          subj.length > 1 &&
          this._decode(subj[1]).includes(this.requireSubj)
        ) {
          this.status = 'start';
        }
        break;
      case 'start':
        // 開始行に到達したかチェック
        this.initConds.forEach((cond: InitiationCond): void => {
          if (!cond.result) cond.result = cond.regex.test(line);
        });
        if (this.initConds.every((c: InitiationCond): boolean => c.result)) {
          this.status = 'loading';
        }
        break;
      case 'loading':
        // 終了行まで、本文のデータをbufferに蓄積
        if (!this.regexMsgEnd.test(line)) {
          this.buffer.push(line);
        } else {
          this.status = 'complete';
        }
        break;
      case 'complete':
        break;
    }
    // 次の処理へ..
    callback();
  }
  /**
   * ストリームの終了直前に呼ばれる
   * @memberof ExtractStream
   */
  public _flush(callback: Function): void {
    const decoded = this._decode(this.buffer.join(''));
    // ワンタイムパスワードの抽出
    const result = this.regexPass.exec(decoded);
    if (result && result.length > 1) this.push(`${result[1]} `);
    callback(); // 終了
  }
  /**
   * base64でデコード
   * @param {string} letter
   * @returns {string}
   * @memberof ExtractStream
   */
  public _decode(letter: string): string {
    return Buffer.from(letter, 'base64').toString();
  }
}
