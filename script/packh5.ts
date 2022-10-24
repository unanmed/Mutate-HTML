import fs from 'fs/promises';
import fse from 'fs-extra';

(async function () {
    // 1. 把mtt文件转一个js出来，供录像验证
    const mtts = await fs.readdir('./dist/chart/');
    try {
        await fs.mkdir('./dist/chart_js');
    } catch {}

    const tasks = mtts.map(v => {
        fs.readFile(`./dist/chart/${v}`, 'utf-8').then(async vv => {
            await fs.writeFile(
                `./dist/chart_js/${v.slice(0, -4)}.js`,
                `window.mtt=${vv}`,
                'utf-8'
            );
        });
    });
    await Promise.all(tasks);

    // 2. 移动main.js等，生成h5魔塔的发塔形式
    try {
        await fs.mkdir('./dist/libs');
    } catch {}

    try {
        await fs.mkdir('./dist/libs/thirdparty');
    } catch {}

    try {
        await fs.mkdir('./dist/project');
    } catch {}

    await fse.copyFile('./script/main.js', './dist/main.js');
    await fse.copyFile('./script/data.js', './dist/project/data.js');
})();
