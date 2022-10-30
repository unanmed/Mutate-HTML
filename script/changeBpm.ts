import fs from 'fs/promises';

const from = parseFloat(process.argv[2]);
const to = parseFloat(process.argv[3]);
const file = process.argv[4];

(async function () {
    const origin = await fs.readFile(file, 'utf-8');
    const res = origin
        .replaceAll(/("playTime"|"start"|"time"): ([0-9]+)/g, (str, $1, $2) => {
            const origin = parseFloat($2);
            return `${$1}: ${(origin * from) / to}`;
        })
        .replaceAll(/"bpm": \{([^\}]+)\}/g, (str, $1: string) => {
            return `"bpm": {\n${$1.replaceAll(
                /"([0-9]+)": ([-0-9\.]+)/g,
                (str, $1, $2) => {
                    return `"${Math.round((parseFloat($1) * from) / to)}": ${
                        (parseFloat($2) * to) / from
                    }`;
                }
            )}\n}`;
        });
    await fs.writeFile(file, res, 'utf-8');
})();
