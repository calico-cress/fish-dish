import { createReadStream } from 'fs';
import split2 from 'split2';
import ExtractStream from './extract-stream';

/**
 * Streamでemlxをパースする。標準出力にワンタイムパスワードを出力する
 * @export
 * @param {string} path
 * @param {string} subject
 */
export default function parse(path: string, subject: string): void {
  createReadStream(path)
    .pipe(split2())
    .pipe(new ExtractStream(subject))
    .pipe(process.stdout);
}
