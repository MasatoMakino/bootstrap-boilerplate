"use strict";

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const makeDir = require("make-dir");

const sizeOf = require("image-size");
const sharp = require("sharp");

const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const imageminMozjpeg = require("imagemin-mozjpeg");
const pluginConfig = {
    plugins: [imageminMozjpeg({}), imageminPngquant({ quality: "65-80" })],
};

const srcDir = `${process.cwd()}/src/img`;
const imgExtension = "+(jpg|jpeg|png|gif|svg)";
const imgExtension_responsive = "+(jpg|jpeg|png|gif)";

const bufferImgPath = `${process.cwd()}/.imgBuffer/`;
let targetDir = bufferImgPath + "img";
let targetDir_responsive = bufferImgPath + "img_xs";

/**
 * 対象ファイルリストを取得する
 * @param extentions
 * @returns {*}
 */
const getImageList = extentions => {
    const pattern = `**/*.${extentions}`;
    const filesMatched = glob.sync(pattern, {
        cwd: srcDir,
    });
    return filesMatched;
};

/**
 * ファイルの更新が必要か否かを判定する
 * @param filePath
 * @param srcDir
 * @param targetDir
 * @returns {boolean}
 */
const isNeedsUpdate = (filePath, srcDir, targetDir) => {
    const targetStats = getStats(filePath, targetDir);
    if (!targetStats) {
        return true;
    }

    const srcStats = getStats(filePath, srcDir);
    if (srcStats.mtime > targetStats.mtime) {
        return true;
    }
    return false;
};

/**
 * fileの情報を取得する。fileが存在しない場合はnullを返す。
 * @param filePath:string
 * @param targetDir:string
 * @returns {*}
 */
const getStats = (filePath, targetDir) => {
    try {
        const stats = fs.statSync(targetDir + "/" + filePath);
        return stats;
    } catch (err) {
        return null;
    }
};

/**
 * 更新対象ファイルのリストを取得する
 * @param targetDir 比較、保存対象ディレクトリ
 * @param imgExtension 対象ファイル拡張子 形式はglob
 * @returns {{path: Array, fileName: Array}} 更新対象ファイルリスト pathはフルパス、filenameはsrcディレクトリからの相対パス
 */
const getUpdateFileList = (targetDir, imgExtension) => {
    const imageList = getImageList(imgExtension);
    const list = {
        path: [],
        fileName: [],
    };

    for (let file of imageList) {
        const update = isNeedsUpdate(file, srcDir, targetDir);

        if (!update) {
            continue;
        }

        list.path.push(srcDir + "/" + file);
        list.fileName.push(file);
    }
    return list;
};

/**
 * ディレクトリに対して更新対象ファイルの抽出、スケーリング、画像最適化と保存の一連の処理を実行する
 * @param scale 出力スケール、ソース画像を1.0とする。1.0を指定した場合、スケーリング処理はスキップされる
 * @param targetDir 保存先ディレクトリ
 */
const optimizeWithScale = (scale, targetDir) => {
    let extension = imgExtension_responsive;
    if (scale === 1.0) extension = imgExtension;

    const list = getUpdateFileList(targetDir, extension);

    for (let filePath of list.fileName) {
        const srcPath = srcDir + "/" + filePath;
        const outputPath = targetDir + "/" + filePath;
        const outputDir = path.dirname(outputPath);

        const onLoad = (err, data) => {
            if (err) {
                throw err;
            }

            if (scale === 1.0) {
                onData(data, outputDir, outputPath);
            } else {
                onDataWithScale(scale, data, outputDir, outputPath);
            }
        };

        fs.readFile(srcPath, onLoad);
    }
};

/**
 * ファイルが読み込まれた後の処理。最適化を行う。
 * @param data
 * @param outputDir
 * @param outputPath
 */
const onData = (data, outputDir, outputPath) => {
    imagemin.buffer(data, pluginConfig).then(buffer => {
        makeDir(outputDir).then(path => {
            console.log(outputPath);
            fs.writeFileSync(outputPath, buffer);
        });
    });
};

/**
 * ファイルが読み込まれた後の処理。スケーリングを行う。
 * スケーリング後に最適化処理を行う。
 * @param scale
 * @param data fsで読み込まれたbuffer
 * @param outputDir
 * @param outputPath
 */
const onDataWithScale = (scale, data, outputDir, outputPath) => {
    const dimensions = sizeOf(data);

    sharp(data)
        .resize(
            parseInt(dimensions.width * scale),
            parseInt(dimensions.height * scale)
        )
        .toBuffer()
        .then(resizeData => {
            onData(resizeData, outputDir, outputPath);
        })
        .catch(err => {});
};

//メイン処理
optimizeWithScale(1.0, targetDir);
// optimizeWithScale(0.5, targetDir_responsive);
