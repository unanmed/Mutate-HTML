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
    教程: ['教程'],
    单曲: ['灵']
};

/**
 * 歌曲信息
 */
export const info: Record<string, MusicInfo> = {
    教程: {
        file: {
            music: 'mutate.mp3',
            image: 'mutate.png',
            chart: {
                easy: 'tutorial.mtt',
                normal: 'tutorial.mtt',
                hard: 'tutorial.mtt'
            }
        },
        author: '古祠',
        chart: '古祠',
        duration: 108,
        hard: {
            easy: 2,
            normal: 2,
            hard: 2
        }
    },
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
            normal: 9,
            hard: 13
        }
    }
    // 红枫: {
    //     file: {
    //         music: '2.mp3',
    //         image: '2.jpg',
    //         chart: {
    //             easy: '2_1.mtt',
    //             normal: '2_2.mtt',
    //             hard: '2_3.mtt'
    //         }
    //     },
    //     author: '弱鸡绿毛怪',
    //     chart: '古祠',
    //     duration: 135,
    //     hard: {
    //         easy: 3,
    //         normal: 8,
    //         hard: 14
    //     }
    // }
};
