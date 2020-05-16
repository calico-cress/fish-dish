# fish-dish

`emlx`ファイルをStreamで読み込み、ワンタイムパスワードを返す  
※ 引数は、N件の`emlx`ファイル（フルパス）を受け取る  
※ オプション`-s='text'`や`--subj='text'`で、件名に必須となる文字列を指定できる  

## メモ

1. webpackでバンドルするかも
1. Streamを、`AsyncIterator`に変更するかも or Stateパターンに変更するかも
