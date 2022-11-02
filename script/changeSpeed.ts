import fs from 'fs/promises';

const to = parseFloat(process.argv[2]);
const file = process.argv[3];

(async function () {
    const origin = await fs.readFile(file, 'utf-8');
    const res = origin.replaceAll(
        /"speed": \{([^\}]+)\}/g,
        (str, $1: string) => {
            return `"speed": {${$1.replaceAll(
                /"([0-9]+)": ([-0-9\.]+)/g,
                (str, $1, $2) => {
                    return `"${$1}": ${parseFloat($2) * to}`;
                }
            )}}`;
        }
    );
    await fs.writeFile(file, res, 'utf-8');
})();
