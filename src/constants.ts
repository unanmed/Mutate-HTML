/**
 * 歌曲信息
 */
export interface MusicInfo {
    file: {
        music: string;
        image: string;
        chart: {
            [T in keyof MusicHard]: string;
        };
    };
    author: string;
    chart: string;
    hard: MusicHard;
    duration: number;
}

/**
 * 歌曲难度
 */
export type MusicHard = {
    easy: number;
    normal: number;
    hard: number;
    master?: number;
};

/**
 * 歌曲列表
 */
export const musics: Record<string, string[]> = {
    单曲: ['灵', '红枫']
};

/**
 * 歌曲信息
 */
export const info: Record<string, MusicInfo> = {
    灵: {
        file: {
            music: '1.mp3',
            image: '1.jpg',
            chart: {
                easy: '1_1.mtt',
                normal: '1_2.mtt',
                hard: '1_3.mtt'
            }
        },
        author: '弱鸡绿毛怪',
        chart: '古祠',
        duration: 158,
        hard: {
            easy: 4,
            normal: 7,
            hard: 12
        }
    },
    红枫: {
        file: {
            music: '2.mp3',
            image: '2.jpg',
            chart: {
                easy: '2_1.mtt',
                normal: '2_2.mtt',
                hard: '2_3.mtt'
            }
        },
        author: '弱鸡绿毛怪',
        chart: '古祠',
        duration: 135,
        hard: {
            easy: 3,
            normal: 8,
            hard: 14
        }
    }
};
