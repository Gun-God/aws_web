//导入moment时间插件工具
import moment from "moment";
/**
 * 时间格式化过滤器
 * @param {10位时间戳} timestamp
 * @param {格式} format
 * @returns {格式化之后的时间字符串}
 */

 export const dateFormat = (timestamp, format = "YYYY-MM-DD HH:mm:ss") => {
    // if (timestamp.includes('Invalid'))
    //     return '无'
    return moment(timestamp).format(format);
};
//导出过滤器方法
export default { dateFormat };