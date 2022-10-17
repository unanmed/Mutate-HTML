import Fontmin from 'fontmin';
import fs from 'fs/promises';
import fse from 'fs-extra';

(async function () {
    // 1. 移动文件至临时文件夹
    try {
        await fse.emptyDir('./temp');
        await fs.rmdir('./temp');
    } catch {}

    try {
        await fs.mkdir('./temp');
    } catch {}

    await fse.copy('./src', './temp');

    // 2. 删除不是.ts .vue的文件
    const del = async (dir: string): Promise<void> => {
        // 文件夹
        const stat = await fs.stat(`./temp/${dir}`);
        if (!stat.isFile()) {
            const all = await fs.readdir(`./temp/${dir}`);
            for await (const name of all) {
                await del(`${dir}/${name}`);
            }
            return;
        }
        // 文件
        if (!/.(ts|vue)$/.test(dir) || /.d.ts$/.test(dir))
            return await fs.rm(`./temp/${dir}`);
    };
    const all = await fs.readdir('./temp');
    for await (const i of all) await del(i);

    let text = '';
    const exclude = ` \t\n\r\n`;
    // 3. 提取所有用得到的字，并压缩字体
    const read = async (dir: string) => {
        // 文件夹
        const stat = await fs.stat(`./temp/${dir}`);
        if (!stat.isFile()) {
            const all = await fs.readdir(`./temp/${dir}`);
            for await (const name of all) {
                await read(`${dir}/${name}`);
            }
            return;
        }
        // 文件
        const data = await fs.readFile(`./temp/${dir}`, 'utf-8');
        for (const str of data) {
            if (!text.includes(str) && !exclude.includes(str)) text += str;
        }
    };
    const all2 = await fs.readdir('./temp');
    for await (const i of all2) await read(i);

    // 开始压缩字体
    await fse.copy('./public', './temp/');
    const fonts = await fs.readdir('./public/font');
    await Promise.all([
        ...fonts.map(v =>
            (async () => {
                const fontmin = new Fontmin();
                fontmin.src(`./public/font/${v}`).dest('./temp/font').use(
                    Fontmin.glyph({
                        text
                    })
                );
                await new Promise(res => {
                    fontmin.run(err => {
                        if (err) throw err;
                        res('success');
                    });
                });
            })()
        )
    ]);

    // 4. 删除非font文件夹
    for await (const i of all2) {
        const stat = await fs.stat(`./temp/${i}`);
        if (!stat.isFile()) {
            await fse.emptyDir(`./temp/${i}`);
            await fs.rmdir(`./temp/${i}`);
        } else await fs.rm(`./temp/${i}`);
    }

    // 5. 移动游戏开始前的加载资源，计算其大小
    let size = 0;
    const data = await fs.readFile('./src/components/start.vue', 'utf-8');
    const urls = data.match(/loadOne\(\`(\$\{base\})?[\w,\s\`\'/.]+\)/g)!;
    await Promise.all(
        urls.map(async v => {
            const url = v.split('`')[1].replace('${base}', './temp/');
            const stat = await fs.stat(url);
            size += stat.size;
        })
    );
    const res = data.replace(
        /\/\/\s*#{3}\s总下载量\r\nconst\s*total\s*=\s*[0-9]+;/,
        `// ### 总下载量
const total = ${size};`
    );
    await fs.writeFile('./src/components/start.vue', res, 'utf-8');
})();
