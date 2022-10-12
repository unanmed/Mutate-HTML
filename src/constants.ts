/**
 * 歌曲信息
 */
export interface MusicInfo {
    file: string
    author: string
    chart: string
    hard: MusicHard
    duration: number
}

/**
 * 歌曲难度
 */
export type MusicHard = {
    easy: number
    normal: number
    hard: number
    master?: number
}

/**
 * 歌曲列表
 */
export const musics: Record<string, string[]> = {
    '单曲': ['靈']
}

/**
 * 歌曲信息
 */
export const info: Record<string, MusicInfo> = {
    '靈': {
        file: '1.mp3',
        author: '弱鸡绿毛怪',
        chart: '古祠',
        duration: 158,
        hard: {
            easy: 2,
            normal: 7,
            hard: 12
        }
    }
}