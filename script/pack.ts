import fse from 'fs-extra';
import fs from 'fs/promises';

(async function () {
    // 打包，把temp文件夹的内容复制到dist并覆盖
    await fse.copy('./temp', './dist/');
    // 删除
    await fse.emptyDir('./temp');
    await fse.rmdir('./temp');

    // 2. 删除.template.mtt
    await fs.rm('./dist/chart/.template.mtt');
})();
