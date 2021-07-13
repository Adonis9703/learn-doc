// lc-2
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val
  this.next = next === undefined ? null : next
}

/**
 *
 * @param l1
 * @param l2
 */
let addTwoNumbers = function (l1, l2) {
  let head = null
  let tail = null
  let flag = 0
  while (l1 || l2) {
    const n1 = l1 ? l1.val : 0
    const n2 = l2 ? l2.val : 0
    const sum = n1 + n2 + flag
    if (!head) {
      head = tail = new ListNode(sum % 10)
    } else {
      tail.next = new ListNode(sum % 10)
      tail = tail.next
    }
    flag = Math.floor(sum / 10)
    if (l1) {
      l1 = l1.next
    }
    if (l2) {
      l2 = l2.next
    }
  }
  if (flag > 0) {
    tail.next = new ListNode(flag)
  }
  return head
}

//lc-3

let lengthOfLongestSubstring = function (s) {
  let result = 0
  let map = new Map()
  let left = 0
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right]) && map.get(s[right]) >= left) { //当发现重复字符的时候且重复字符的位置大于map中记录的位置，则将左指针向后移动一位
      left = map.get(s[right]) + 1
    }
    result = Math.max(result, right - left + 1)
    map.set(s[right], right)
  }
  // console.log(result)
  return result
}

// lengthOfLongestSubstring('abcabcbb')

//lc-4

let findMedianSortedArrays = function (nums1, nums2) {
  let newArr = [...nums1, ...nums2].sort((a, b) => {
    return a - b
  })
  if (newArr.length % 2 === 0) {
    let pos = newArr.length / 2
    let result = (newArr[pos] + newArr[pos - 1]) / 2
    console.log(result.toFixed(5))
    return result.toFixed(5)
  } else {
    let pos = Math.floor(newArr.length / 2)
    console.log(newArr[pos].toFixed(5))
    return newArr[pos].toFixed(5)
  }
};
// findMedianSortedArrays([],[2])

//lc-5
let longestPalindrome = function (s) {
  function check(str) {
    let len = Math.floor((str.length + 1) / 2)
    for (let i = 0; i < len; i++) {
      if (str[i] !== str[str.length - i - 1]) {
        return false
      }
    }
    return true
  }

  let map = new Map()
  let max = ''
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length + 1; j++) {
      if (check(s.slice(i, j))) {
        if (!map.get(s.slice(i, j))) {
          map.set(s.slice(i, j), s.slice(i, j).length)
        }
      }
    }
  }
  map.forEach((val, key) => {
    if (max.length < val) {
      max = key
    }
  })
  console.log(max)
  return max
};

// longestPalindrome('aabswdaaabbsdbadbabdsda')

// lc-7
let reverse = function (x) {
  let arr = x.toString().split('')
  if (arr[0] === '-') {
    arr.shift()
    arr.reverse()
    let n = -Number(arr.join(''))
    if (-Math.pow(2, 31) <= n && n <= Math.pow(2, 31)) {
      return n
    } else {
      return 0
    }
  } else {
    arr.reverse()
    let n = Number(arr.join(''))
    if (-Math.pow(2, 31) <= n && n <= Math.pow(2, 31)) {
      return n
    } else {
      return 0
    }
  }
}
// console.log(reverse(-123))

// lc-8
let myAtoi = function (s) {
  let n = parseInt(s, 10)
  if (isNaN(n)) {
    return 0
  } else {
    if (n < Math.pow(-2, 31)) {
      return (Math.pow(-2, 31))
    } else if (n > Math.pow(2, 31) - 1) {
      return (Math.pow(2, 31) - 1)
    } else {
      return (n)
    }
  }
  // return parseInt(s, 10)
};
// console.log(myAtoi(' 32lsdjl lasdkj as'))

// lc-9
let isPalindrome = function (x) {
  let str = x.toString()
  let len = Math.floor((str.length + 1) / 2)
  for (let i = 0; i < len; i++) {
    if (str[i] !== str[str.length - i - 1]) {
      return false
    }
  }
  return true
}

// console.log(isPalindrome(-11221))

//lc- 11
let maxArea = function (height) {
  let left = 0
  let right = height.length - 1
  let max = 0
  while (left < right) {
    max = Math.max(max, Math.min(height[left], height[right]) * (right - left))
    if (height[left] < height[right]) {
      left++
    } else {
      right--
    }
  }
  return max
}

// console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]))

// lc-14
let longestCommonPrefix = function (strs) {
  if (strs.length === 0) {
    return ''
  }
  let key = strs[0]
  for (let i = 0; i < strs.length; i++) {
    let j = 0
    for (; j < key.length && j < strs[i].length; j++) {
      if (key[j] !== strs[i][j]) {
        break
      }
    }
    key = key.substr(0, j)
    if (key === '') return key
  }
  return key
}
console.log(longestCommonPrefix(['flasdw', 'flqwd', 'flqws']))

// lc-19
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
let removeNthFromEnd = function (head, n) {
  let vNode = new ListNode(0, head)
  let slow = vNode
  let fast = vNode
  while (n--) {
    fast = fast.next
  }
  if (!fast) {
    return vNode.next
  }
  while (fast.next) {
    fast = fast.next
    slow = slow.next
  }
  slow.next = slow.next.next
  return vNode.next
};

//lc-20

/**
 * @param {string} s
 * @return {boolean}
 */
let isValid = function (s) {
  let stack = []
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(' || s[i] === '[' || s[i] === '{') {
      stack.push(s[i])
    } else {
      if (i === 0) {
        return false
      }
      if (s[i] === ')' && stack[stack.length - 1] === '(') {
        console.log('pop (:', stack)
        stack.pop()
      } else if (s[i] === ')' && stack[stack.length - 1] !== '(') {
        return false
      }
      if (s[i] === ']' && stack[stack.length - 1] === '[') {
        console.log('pop [:', stack)
        stack.pop()
      } else if (s[i] === ']' && stack[stack.length - 1] !== '[') {
        return false
      }
      if (s[i] === '}' && stack[stack.length - 1] === '{') {
        console.log('pop {:', stack)
        stack.pop()
      } else if (s[i] === '}' && stack[stack.length - 1] !== '{') {
        return false
      }
    }
  }
  console.log(stack)
  return stack.length === 0;
};

// console.log(isValid('({[{}]})'))

//lc-21
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
let mergeTwoLists = function (l1, l2) {
  if (l1 === null) {
    return l2
  } else if (l2 === null) {
    return l1
  } else if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2)
    return l1
  } else {
    l2.next = mergeTwoLists(l2.next, l1)
    return l2
  }
  // const prehead = new ListNode(-1);

  // let prev = prehead;
  // while (l1 != null && l2 != null) {
  //   if (l1.val <= l2.val) {
  //     prev.next = l1;
  //     l1 = l1.next;
  //   } else {
  //     prev.next = l2;
  //     l2 = l2.next;
  //   }
  //   prev = prev.next;
  // }
  //
  // // 合并后 l1 和 l2 最多只有一个还未被合并完，我们直接将链表末尾指向未合并完的链表即可
  // prev.next = l1 === null ? l2 : l1;
  //
  // return prehead.next;
};

//lc-22

const generateParenthesis = function (n) {
  const result = []
  const dfs = (lRemain, rRemain, str) => { //左右括号所剩的数量
    if (str.length === 2*n) { //字符串构建完成
      result.push(str) //加入解集
      return //结束当前递归分支
    }
    if (lRemain > 0) { //只要左括号有剩余，就可以选择它，然后继续做选择
      dfs(lRemain - 1, rRemain, str + '(')
    }
    if (lRemain < rRemain) { //只有右括号比左括号多，才可以选择右括号
      dfs(lRemain, rRemain - 1, str + ')') //然后继续递归选择
    }
  }
  dfs(n, n, '') //递归入口
  return result
}