// For H5 Replay Check

class Route extends Array<string> {
    constructor(id: string, ...eles: any[]) {
        super(`id:${id}`, ...eles);
    }

    clear(): void {
        this.splice(1, this.length - 1);
    }

    // 检查格式是否正确
    check(): boolean {
        if (!/^id:[^_]+\#file:[^]+$/.test(this[0])) return false;
        return true;
    }
}

let route: Route;

/**
 * 创建一个录像
 */
export function createRoute(music: string, mtt: string) {
    route = new Route(`${music}#file:${mtt}`);
}

/**
 * 向录像中添加打击时间
 */
export function pushRoute(time: number) {
    route.push(time.toString());
}

/**
 * 清空录像
 */
export function clearRoute() {
    route.clear();
}

/**
 * 游戏结束的时候发送录像到服务器
 */
export function postRoute(form: FormData) {
    if (!route.check()) return;
    form.append('route', JSON.stringify([...route]));
}

// 录像的其它操作? pop? shift? 要这些干什么?
