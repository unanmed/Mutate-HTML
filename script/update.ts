import axios from 'axios';
import fs from 'fs/promises';
import fss from 'fs';
import FormData from 'form-data';
import compressing from 'compressing';
import { hex_md5 } from './md_5.js';

const id = parseInt(process.argv[2]); // 用户id
const password = process.argv[3]; // 密码

(async function () {
    // 压缩
    await compressing.zip.compressDir('./dist', './dist.zip');

    const pass = hex_md5(password);
    // 登录
    const res = await axios.postForm(
        'https://h5mota.com/backend/user/login.php',
        {
            nid: id,
            npass: pass
        }
    );
    if (res.data.code === 0) console.log('登录成功');
    else return console.log('登录失败');

    const data = await axios.post(
        'https://h5mota.com/up2cos/getData.php',
        void 0,
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
                Cookie: `id=${id}; password=${pass}`
            }
        }
    );
    if (data.data.code !== 1) return console.log('获取自助更新信息失败');

    const tower = data.data.list.find(
        (v: { name: string }) => v.name === 'Mutate'
    );

    if (!tower) return;

    const stat = await fs.stat('./dist.zip');
    let size = '';
    size = `${stat.size}B`;
    if (stat.size > 1024) size = `${(stat.size / 1024).toFixed(2)}KB`;
    if (stat.size > 1024 ** 2) size = `${(stat.size / 1024 ** 2).toFixed(2)}MB`;
    if (stat.size > 1024 ** 3) size = `${(stat.size / 1024 ** 3).toFixed(2)}GB`;

    const stream = fss.createReadStream('./dist.zip');

    const form = new FormData();
    form.append('type', 'upload');
    form.append('name', 'Mutate');
    form.append('comment', tower.text);
    form.append('file', stream);

    const headers = form.getHeaders(); // 获取headers
    const [err, length] = await new Promise(
        (res: (v: [Error | null, number]) => void) =>
            form.getLength((e, l) => res([e, l]))
    );
    if (err) return console.log('获取content-length失败');
    headers['content-length'] = length;
    headers['cookie'] = `id=${id}; password=${pass}`;

    console.log(`开始上传, 文件大小: ${size}`);
    const ans = await axios.post(
        'https://h5mota.com/up2cos/setData.php',
        form,
        {
            headers
        }
    );
    if (ans.data.error === 0 && ans.data.upload === true && ans.data.code === 1)
        console.log('上传成功');
    else console.log(`上传失败, 失败信息: `, ans.data);
})();
