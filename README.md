# bootstrap-boilerplate

> [!WARNING]
> This repository has been archived. This repository is no longer actively maintained. All code, documentation, and other files are provided for reference purposes only. Please note that new issues and pull requests will not be accepted.

静的サイト向けの BootStrap ボイラープレートです。

## Getting Started

#### ファイルの取得

このパッケージを利用する最も簡単な方法は、全てのファイルをダウンロードし、ローカルのディレクトリに展開することです。

#### npm install

次に、ターミナルを開き、ファイルを展開したディレクトリに移動します。

```bash
cd <ファイルを展開したディレクトリ>
```

移動したら以下のコマンドを実行します。

```bash
npm ci
```

必要なパッケージが`node_modules`ディレクトリ内にダウンロードされます。

#### start:dev

これで必要なファイルがすべて揃いました。次のコマンドを実行してください。

```bash
npm run start:dev
```

ブラウザが立ち上がり、インデックスページが表示されます。

## パッケージセット

このボイラープレートでは、以下のパッケージを使用しています。

- CSS フレームワーク
  - [Bootstrap](https://getbootstrap.com/)
  - [Font Awesome](https://fontawesome.com/)
- タスクランナー / ビルドヘルパー
  - [Gulp 4](https://gulpjs.com/)
  - [webpack](https://webpack.js.org/)
- パッケージマネージャー
  - [yarn](https://yarnpkg.com/lang/ja/)

## npm scripts

このボイラープレートで使用する npm scripts は以下の３つです。

```bash
npm run <コマンド名>
```

でそれぞれ実行できます。

### start:dev

開発用サーバーを立ち上げ、ソースファイルの監視を開始します。
デフォルトでは`./src`以下のファイルを監視し、これらに更新があるとブラウザでホットリロードを行います。

### build:dev

ファイルをビルドします。デフォルトでは`./dist`以下にビルドしたファイルを展開します。

### build:release

リリース用のファイルをビルドします。`build:dev`コマンドとの違いは以下の通りです。

- 静的アセットファイルのファイル名にハッシュを追加します。キャッシュのミスヒットを回避します。
- Javascript ファイルに Tree Shaking を行います。ビルドに時間がかかりますが、ファイル容量が大幅に小さくなります。

## License

[MIT licensed](LICENSE).
