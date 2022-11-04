import axios from 'axios';
import { hex_md5 } from './md_5.js';
import FormData from 'form-data';

const id = parseInt(process.argv[2]); // 用户id
const password = process.argv[3]; // 密码

// 等待10秒钟，确保服务器已经处理完毕
await new Promise(res => setTimeout(res, 10000));

(async function () {
    const list = await axios.get(
        'https://h5mota.com/backend/admin/tower/auditRecord.php',
        {
            headers: {
                Cookie: `id=${id}; password=${hex_md5(password)}`
            }
        }
    );
    const target = list.data.list.filter(
        (v: { userId: string; status: string }) => {
            return Number(v.userId) === id && Number(v.status) === 1;
        }
    );

    for await (const tower of target) {
        const form = new FormData();
        form.append('type', 'yes');
        form.append('id', tower.id);

        const headers = form.getHeaders(); // 获取headers
        const [err, length] = await new Promise(
            (res: (v: [Error | null, number]) => void) =>
                form.getLength((e, l) => res([e, l]))
        );
        if (err) return console.log('获取content-length失败');
        headers['content-length'] = length;
        headers['cookie'] = `id=${id}; password=${hex_md5(password)}`;

        const data = await axios.postForm(
            'https://h5mota.com/backend/admin/tower/doAudit.php',
            form,
            { headers }
        );
        if (Number(data.data.code) === 0) {
            await new Promise(res => setTimeout(res, 2000));
            const form = new FormData();
            form.append('type', 'confirm');
            form.append('id', tower.id);
            form.append('bgm_remote', 'true');
            form.append('reset_hot', 'false');
            const headers = form.getHeaders(); // 获取headers
            const [err, length] = await new Promise(
                (res: (v: [Error | null, number]) => void) =>
                    form.getLength((e, l) => res([e, l]))
            );
            if (err) return console.log('获取content-length失败');
            headers['content-length'] = length;
            headers['cookie'] = `id=${id}; password=${hex_md5(password)}`;

            const data = await axios.postForm(
                'https://h5mota.com/backend/admin/tower/doAudit.php',
                form,
                { headers }
            );

            if (Number(data.data.code) === 0)
                console.log(`${tower.title}更新成功！`);
        } else {
            console.log(`${tower.title}更新失败！错误信息：`);
            console.log(data.data);
        }
    }
})();
