#!/usr/bin/env node

import fs from 'fs';
import handleErrors from './helper/handle-errors';
import parseArgs from './parse-args';
import parseMail from './parse-mail';

// 例外管理
handleErrors();

// +++ 引数は、解析対象を特定するための文字列（件名の一部） +++
const subject = parseArgs(process.argv.slice(2)).subj;

// 比較用の型
interface Comparison {
  name: string;
  stat: fs.Stats;
}

/**
 * ファイル名（xN）を更新時刻の降順にする
 * @param {string} line
 * @returns {Comparison[]}
 */
function sort(line: string): Comparison[] {
  const _map = (f: string): Comparison => ({ name: f, stat: fs.statSync(f) });
  const _sort = (p: Comparison, l: Comparison): number =>
    p.stat.mtime <= l.stat.mtime ? 1 : -1;
  return line.split(' ').map(_map).sort(_sort); // 整形して返す
}

/**
 * メインのパース処理
 * @param {Comparison[]} files
 */
const parse = (files: Comparison[]): void =>
  files.forEach((f: Comparison): void => parseMail(f.name, subject));

let input = ''; // 退避したチャンク
process.stdin
  .on('readable', (): void => {
    let chunk: string | Buffer;
    while ((chunk = process.stdin.read()) !== null) {
      input += chunk.toString().trim();
    }
  })
  .on('end', (): void => {
    const files = sort(input);
    parse(files);
  });
