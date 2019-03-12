/**
 *
 * @authors liwb (you@example.org)
 * @date    2019-03-11 19:57
 * @description 采用TinyPNG node.js API 进行在线压缩图片，并且转换 Webp 格式文件
 * 相关链接：
 * https://tinypng.com
 * https://github.com/jdf2e/Gaea4
 *
 */
'use strict';

const path = require('path');
const fs = require('fs');
const tinify = require('tinify');
const config = require('../package.json');
const chalk = require('chalk');
if (config.tinypngkey === '') {
  console.log(chalk.red('请在package.json 文件配置tinypng的key，如果没有key，请前往【https://tinypng.com/developers】申请'));
  return;
}
tinify.key = config.tinypngkey;
const filePath = './src/assets/img';
const files = fs.readdirSync(filePath);
const reg = /\.(jpg|png)$/;
console.log(chalk.yellow(`上传TinyPNG中...`));

async function compress() {
  for (let file of files) {
    let filePathAll = path.join(filePath, file);
    let stats = fs.statSync(path.join(filePath, file));
    if (!stats.isDirectory() && reg.test(file)) {
      await new Promise((resolve, reject) => {
        fs.readFile(filePathAll, (err, sourceData) => {
          if (err) {
            console.log(chalk.red(`${file} 压缩失败`));
            reject(err);
          } else {
            let fileSize = fs.statSync(filePathAll).size;

            tinify.fromBuffer(sourceData).toBuffer((err, resultData) => {
              if (err) {
                console.log(chalk.red(`${file} 压缩失败`));
                reject(err);
              }
              //将压缩后的文件保存覆盖
              fs.writeFile(filePathAll, resultData, err => {
                let compressFileSize = fs.statSync(filePathAll).size;
                console.log(chalk.green(`${file} ${(fileSize / 1024).toFixed(2)}kb 压缩成功 ${(compressFileSize / 1024).toFixed(2)}kb ${((compressFileSize - fileSize) * 100 / fileSize).toFixed(1)}%`));
                resolve();
              });
            });
          }
        });
      });
    }
  }
}

compress();

