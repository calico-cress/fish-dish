import minimist from 'minimist';

// 実行時引数の定義
const definition: minimist.Opts = {
  string: ['subj'],
  alias: {
    s: 'subj',
  },
  default: {
    subj: '確認コード',
  },
};

// パース後の型
interface ExecArgs {
  _: string[];
  s: string;
  subj: string;
}

export default function minimize(
  argv: string[]
): ExecArgs & minimist.ParsedArgs {
  return minimist<ExecArgs>(argv, definition);
}
