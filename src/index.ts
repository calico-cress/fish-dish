#!/usr/bin/env node

import fs from 'fs';
import handlErrors from './helper/handle-errors';
import parseArgs from './helper/parse-args';
import parseMail from './parse-mail';

// 例外管理
handlErrors();

// +++ 引数はデコード対象のファイル or 件名に必須となる文字列 +++
const argv = parseArgs(process.argv.slice(2));

// 比較用の型
interface Comparison {
  name: string;
  stat: fs.Stats;
}

// 更新日付の降順でソート
const sorted = argv._.map(
  (f: string): Comparison => ({ name: f, stat: fs.statSync(f) })
).sort((p: Comparison, l: Comparison): number =>
  p.stat.mtime <= l.stat.mtime ? 1 : -1
);

// 実行
sorted.forEach((s: Comparison): void => {
  parseMail(s.name, argv.subj);
});
