// 滑动切换头部导航标题
export default class DotsTitle {
    constructor({categoryId, categoryName, usable}) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    };
};

// 创建切换头部导航标题
export function createDotsTitle(data) {
    return new DotsTitle({
        categoryId: data.categoryId,
        categoryName: data.categoryName
    });
};

// 对滑动切换头部导航标题数据做处理
export function normalizeDotsTitle(list) {
    let ret = [];
    let copyRet = [];

    // 设置第一个标题为全部
    let retOne = [];
    // 获取移除第一个数组之后的数据 将第一个数组分离出来
    // let shiftRet = [];

    list.forEach((data) => {
        if (data.items) {
            data.items.forEach((item) => {
                copyRet.push(createDotsTitle(item));

                // 将第一个数组分离出来
                if (createDotsTitle(item).categoryName === '全部') {
                    retOne = createDotsTitle(item);
                }
                else if (createDotsTitle(item).categoryName !== '佛教音乐') {
                    ret.push(createDotsTitle(item));
                    // 对数据进行随机排序
                    randomDissTag(ret);
                }
            });
        }
    });

    // 设置第一个标题为全部
    ret.unshift(retOne);
    return ret;
}
// 对标题导航进行随机排序
export function randomDissTag (data) {
    let time = new Date();
    let hours = time.getHours();

   //  一天执行一次随机排序
    if (hours === 0) {
        for (let i = data.length - 1; i >= 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            let itemAtIndex = data[randomIndex];

            data[randomIndex] = data[i];
            data[i] = itemAtIndex;
        }
    }

    return data;
}
