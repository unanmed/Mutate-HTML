import fse from 'fs-extra';

// 打包，把temp文件夹的内容复制到dist并覆盖
await fse.copy('./temp', './dist/');
// 删除
await fse.emptyDir('./temp');
await fse.rmdir('./temp');