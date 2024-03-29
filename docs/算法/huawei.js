/***
 * 给定一个字符串 s 和 p，请问最少去掉s中的多少个字符，
 * 才能使得p是s的字串呢
 *
 * s和p只包含小写英文字母，s的长度不超过2000，p的长度不超过10，保证有解
 * @param s
 * @param p
 * @returns {*}
 */

const handler = (s, p) => {
  if (s.includes(p)) {
    return 0
  }
  let idxP = 0
  let idxS = s.indexOf(p[0])
  let start = s.indexOf(p[0])
  let result = []
  while (idxS < s.length) {
    if (s[idxS] === p[idxP] && s[idxS] !== p[0]) { //如果字符相等且字符不是p[0]
      if (idxP === p.length - 1) { //如果遍历完一次P，说明匹配完全
        idxP = 0 //将p指针归零，从头再次匹配
        result.push(idxS-start-p.length+1) //将答案保存
      } else { //如果p没有遍历完，p和s同时向后移
        idxP++
        idxS++
      }
    } else if (s[idxS] === p[0]){ //如果字符匹配到p[0]，重置start标记
      start = idxS
      idxP++
      idxS++
    } else { //如果不相等 则将s向后移动
      idxS++
    }
  }
  return result
}
console.log(handler('axxxbcxxaxbcxb', 'abc'))
console.log(handler('axb', 'ab'))
