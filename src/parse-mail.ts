import { createReadStream } from 'fs';
import split2 from 'split2';
import ExtractStream from './extract-stream';
/**
 * Streamでemlxをパースする。標準出力にワンタイムパスワードを出力する
 * @export
 * @param {string} path
 */
export default function parse(path: string): void {
  const extract = new ExtractStream();
  createReadStream(path)
    .pipe(split2())
    .pipe(extract)
    .pipe(process.stdout);
}
