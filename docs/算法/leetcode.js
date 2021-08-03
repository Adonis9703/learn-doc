//https://labuladong.gitbook.io/algo/

//lc-153
const findMin = function (nums) {
  let low = 0;
  let high = nums.length - 1;
  while (low < high) {
    const pivot = low + Math.floor((high - low) / 2);
    if (nums[pivot] < nums[high]) {
      high = pivot;
    } else {
      low = pivot + 1;
    }
  }
  return nums[low];
}
//lc-49
const groupAnagrams = function (strs) {
  const map = new Map()
  for (let i = 0; i < strs.length; i++) {
    let arr = strs[i].split('')
    arr.sort()
    let str = arr.join('')
    let list = []
    if (map.get(str)) {
      list = map.get(str)
      list.push(strs[i])
      map.set(str, list)
    } else {
      map.set(str, [strs[i]])
    }
  }
  return Array.from(map.values())
}
console.log('lc-40', groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))
//lc-209
const minSubArrayLen = function (target, nums) {
  let left = 0
  let right = 0
  let min = Infinity
  let sum = 0
  while (right < nums.length) {
    sum += nums[right]
    while (sum >= target) {
      min = Math.min(min, right - left + 1)
      sum -= nums[left]
      left++
    }
    right++
  }
  return min === Infinity ? 0 : min
}
console.log('lc-209', minSubArrayLen(7, [2, 3, 1, 2, 4, 3]))
//lc-204
const countPrimes = function (n) {
  // const isPrime = x => {
  //   for (let i = 2; i * i <= x; i++) {
  //     if (x % i === 0) {
  //       return false
  //     }
  //   }
  //   return true
  // }
  // let ans = 0
  // let result = []
  // for (let i = 2; i < n; i++) {
  //   if (isPrime(i)) {
  //     result.push(i)
  //     ans+=1
  //   }
  //   // ans += isPrime(i)
  // }
  // console.log(result)
  // return ans
  const isPrime = new Array(n).fill(1)
  let ans = 0
  for (let i = 2; i < n; i++) {
    if (isPrime[i]) {
      ans += 1
      for (let j = i * i; j < n; j += i) {
        isPrime[j] = 0
      }
    }
  }
  return ans
}
console.log('lc-204', countPrimes(10))
//lc-202
const isHappy = function (n) {
  // const handler = (arr) => {
  //   let sum = 0
  //   arr.forEach(a => {
  //     sum = sum + a * a
  //   })
  //   if (sum === 1) {
  //     return true
  //   } else if (sum > 1 && sum < 10) {
  //     return false
  //   } else {
  //     let newArr = sum.toString().split('').map(item => Number(item))
  //     handler(newArr)
  //   }
  // }
  // return handler(n.toString().split('').map(item => Number(item)))
}
console.log('lc-202', isHappy(19))
//lc-268
const missingNumber = function (nums) {
  let n = nums.length
  for (let i = 0; i <= n; i++) {
    if (!nums.includes(i)) {
      return i
    }
  }
}
console.log('lc-268', missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]))
//lc-56
const merge56 = function (intervals) {
  let slow = 0
  let fast = 1
  if (intervals.length === 1) {
    return intervals
  }
  intervals.sort((a, b) => a[0] - b[0])
  while (fast < intervals.length) {
    if (intervals[slow][1] >= intervals[fast][0]) {
      let start = intervals[slow][0]
      let end = Math.max(intervals[fast][1], intervals[slow][1])
      intervals[fast] = [start, end]
      intervals.splice(slow, 1)
    } else {
      slow++
      fast++
    }
  }
  return intervals
}
console.log('lc-56', merge56([[2, 3], [2, 2], [3, 3], [1, 3], [5, 7], [2, 2], [4, 6]]))
//1,3 2,2 2,2 2,3 3,3 4,6 4,7
//lc-617
const mergeTrees = function (root1, root2) {
  if (root1 === null) {
    return root2
  }
  if (root2 === null) {
    return root1
  }
  let root = new TreeNode(root1.val + root2.val)
  root.left = mergeTrees(root1.left, root2.left)
  root.right = mergeTrees(root1.right, root2.right)
  return root
}
//lc-43
const multiply = function (num1, num2) {
  let len1 = num1.length
  let len2 = num2.length
  const pos = new Array(len1 + len2).fill(0)
  // 为什么是两层for循环 因为 456*3 每个数都要跟3乘一遍
  for (let i = len1 - 1; i >= 0; i--) {
    let n1 = +num1[i]
    for (let j = len2 - 1; j >= 0; j--) {
      let n2 = +num2[j]
      // len1+len2 =len1-1+len2-1+1
      let sum = pos[i + j + 1] + n1 * n2
      pos[i + j + 1] = sum % 10 // 取模的值
      // pos[i+j]相当于进一 就是carry
      pos[i + j] += sum / 10 | 0
    }
  }
  while (pos[0] === 0) {
    pos.shift()
  }
  return pos.length ? pos.join('') : '0';
}
console.log('lc-43', multiply('2', '3'))
//lc-171
const titleToNumber = function (columnTitle) {
  let res = 0
  for (let i = 0; i < columnTitle.length; i++) {
    let num = columnTitle[i].charCodeAt() - 'A'.charCodeAt() + 1
    res = res * 26 + num
  }
  return res
}
console.log('lc-171', titleToNumber('AB'))
//lc-412
const fizzBuzz = function (n) {
  let result = []
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      result.push('FizzBuzz')
    } else if (i % 3 === 0) {
      result.push('Fizz')
    } else if (i % 5 === 0) {
      result.push('Buzz')
    } else {
      result.push(i)
    }
  }
  return result
}
console.log('lc-412', fizzBuzz(15))
//lc-83
const deleteDuplicates = function (head) {
  if (!head) {
    return head
  }
  let node = head
  while (node.next) {
    if (node.val === node.next.val) {
      node.next = node.next.next
    } else {
      node = node.next
    }
  }
  return head
}
//lc-203
const removeElements = function (head, val) {
  let pre = new ListNode(0)
  pre.next = head
  let node = pre
  while (node.next) {
    if (node.next.val === val) {
      node.next = node.next.next
    } else {
      node = node.next
    }
  }
  return pre.next
}
//lc-242
const isAnagram = function (s, t) {
  let strS = s.split('').sort().join('')
  let strT = t.split('').sort().join('')
  return strS === strT
}
console.log('lc-242', isAnagram('rat', 'car'))
//lc-383
const canConstruct = function (ransomNote, magazine) {
  let map = {}
  for (let i = 0; i < ransomNote.length; i++) {
    if (map[ransomNote[i]] === undefined) {
      map[ransomNote[i]] = 1
    } else {
      map[ransomNote[i]]++
    }
  }
  for (let i = 0; i < magazine.length; i++) {
    if (map[magazine[i]]) {
      map[magazine[i]]--
    }
  }
  for (const key in map) {
    if (map[key] > 0) {
      return false
    }
  }
  return true
  
  // let right = 0
  // let arr1 = ransomNote.split('')
  // let arr2 = magazine.split('')
  // if (arr1.length > arr2.length) {
  //   return false
  // }
  // while (right < arr2.length && arr1.length) {
  //   if (arr1[0] === arr2[right]) {
  //     arr1.shift()
  //     arr2.splice(right, 1)
  //     right = 0
  //   } else {
  //     right++
  //   }
  // }
  // return arr1.length === 0
}
console.log('lc-383', canConstruct('aab', 'baa'))
//lc-1662
const arrayStringsAreEqual = function (word1, word2) {
  let str1 = word1.join('')
  let str2 = word2.join('')
  return str1 === str2
}
console.log('lc-1662', arrayStringsAreEqual(['ab', 'c'], ['a', 'bc']))
//lc-724
const pivotIndex = function (nums) {
  const total = nums.reduce((a, b) => a + b, 0)
  let sumL = 0
  for (let i = 0; i < nums.length; i++) {
    if (sumL === total - sumL - nums[i]) {
      return i
    }
    sumL += nums[i]
  }
  return -1
}
console.log('lc-724', pivotIndex([2, 1, -1]))
//lc-45
const jump = function (nums) {

}
//lc-55
const canJump = function (nums) {
  let maxlen = nums[0]
  for (let i = 0; i < nums.length; i++) {
    if (i <= maxlen) {
      maxlen = Math.max(maxlen, i + nums[i])
      if (maxlen >= nums.length - 1) {
        return true
      }
    }
  }
  return false
}
console.log('lc-55', canJump([2, 0, 0]))
//lc-409
const longestPalindrome409 = function (s) {
  // let map = {}
  // for (let i = 0; i < s.length; i++) {
  //   if (map[s[i]] === undefined) {
  //     map[s[i]] = 1
  //   } else {
  //     map[s[i]]++
  //   }
  // }
  // // console.log(map)
  // let maxLen = 0
  // let center = 0
  // for (const key in map) {
  //   if (map[key] % 2 === 1) {
  //     center = Math.max(center, map[key])
  //   }
  //   if (map[key] % 2 === 0) {
  //     maxLen += map[key]
  //
  //   }
  // }
  // return maxLen + center
  let count = 0
  let set = new Set()
  for (let i = 0; i < s.length; i++) {
    if (set.has(s[i])) {
      set.delete(s[i])
      count += 2
    } else {
      set.add(s[i])
    }
  }
  if (set.size > 0) {
    return count + 1
  } else {
    return count
  }
}
console.log('lc-409', longestPalindrome409('bb'))
//lc-125
const isPalindrome125 = function (s) {
  if (!s) {
    return true
  }
  let arr = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  let n = Math.floor((arr.length + 1) / 2) //aabaa
  for (let i = 0; i < n; i++) {
    if (arr[i] !== arr[arr.length - i - 1]) {
      return false
    }
  }
  return true
}
console.log('lc-125', isPalindrome125('A man, a plan, a canal: Panama'))
//lc-35
const searchInsert = function (nums, target) {
  let n = 0
  while (n < nums.length) {
    if (nums[n] === target) {
      return n
    } else {
      if (n === 0 && nums[n] > target) {
        return 0
      } else if (nums[n + 1] && nums[n + 1] > target) {
        return n + 1
      } else if (n === nums.length - 1 && nums[n] < target) {
        return n + 1
      }
    }
    n++
  }
}
console.log('lc-35', searchInsert([1, 3, 5, 6], 5))
//lc-64
const minPathSum = function (grid) {
  //dp[i][j] = Math.min(dp[i-1][j]+grid[i][j], dp[i][j-1]+grid[i][j])
  //dp[0][0] = grid[0][0]
  let row = grid.length
  let col = grid[0].length
  let dp = new Array(row).fill(new Array(col))
  let min = Infinity
  dp[0][0] = grid[0][0]
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (i === 0 && j !== 0) {
        dp[i][j] = dp[i][j - 1] + grid[i][j]
      } else if (i !== 0 && j === 0) {
        dp[i][j] = dp[i - 1][j] + grid[i][j]
      } else if (i !== 0 && j !== 0) {
        dp[i][j] = Math.min(dp[i - 1][j] + grid[i][j], dp[i][j - 1] + grid[i][j])
      }
    }
  }
  return dp[row - 1][col - 1]
}
console.log('lc-64', minPathSum([[1, 3, 1], [1, 5, 1], [4, 2, 1]]))
//lc-239 滑动窗口
const maxSlidingWindow = function (nums, k) {
  let left = 0
  let right = k - 1
  
}
//lc-283
const moveZeroes = function (nums) {
  let len = nums.length
  for (let i = 0; i < len;) {
    if (nums[i] === 0) {
      nums.push(0)
      nums.splice(i, 1)
      len--
    } else {
      i++
    }
  }
}
//lc-572
const isSubtree = function (root, subRoot) {
  const handler = (node, subNode) => {
    if (node === null && subNode === null) {
      return true
    }
    if (node === null || subNode === null || node.val !== subNode.val) {
      return false
    }
    if (node.val === subNode.val) {
      return handler(node.left, subNode.left) && handler(node.right, subNode.right)
    }
  }
  if (!root) {
    return false
  }
  // return handler(root, subRoot) || handler(root.left, subRoot) || handler(root.right, subRoot)
  if (handler(root, subRoot)) {
    return true
  } else {
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot)
  }
}

//lc-654

function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val)
  this.left = (left === undefined ? null : left)
  this.right = (right === undefined ? null : right)
}

//lc-98
const isValidBST = function (root) {
  let handle = (node, lower, upper) => {
    if (!node) {
      return true
    }
    if (node.val <= lower || node.val >= upper) {
      return false
    }
    return handle(node.left, lower, node.val) && handle(node.right, node.val, upper)
  }
  return handle(root, -Infinity, Infinity)
}
//lc-654
const constructMaximumBinaryTree = function (nums) {
  if (!nums.length) {
    return nums
  }
  let handler = (nums, lo, hi) => {
    if (lo > hi) {
      return null
    }
    let maxKey = 0
    let max = -Infinity
    for (let i = lo; i <= hi; i++) {
      if (nums[i] > max) {
        max = nums[i]
        maxKey = i
      }
    }
    let root = new TreeNode(max)
    root.left = handler(nums, lo, maxKey - 1)
    root.right = handler(nums, maxKey + 1, hi)
    return root
  }
  return handler(nums, 0, nums.length - 1)
}
//lc-110
const isBalanced = function (root) {
  let handler = (node) => {
    if (node === null) {
      return 0
    } else {
      return Math.max(handler(node.left), handler(node.right)) + 1
    }
  }
  if (root === null) {
    return true
  } else {
    return Math.abs(handler(root.left) - handler(root.right)) <= 1 && isBalanced(root.left) && isBalanced(root.right)
  }
}

//lc-114
const flatten = function (root) {
  if (root === null) {
    return root
  }
  //递归
  flatten(root.left)
  flatten(root.right)
  //后序遍历 主操作
  let l = root.left
  let r = root.right
  
  root.left = null
  root.right = l
  //将原先的右子树接到当前右子树的末端
  let temp = root
  while (temp.right !== null) {
    temp = temp.right
  }
  temp.right = r
}
//lc-116
const connect = function (root) {
  if (root === null) {
    return root
  }
  let handler = (l, r) => {
    //前序遍历主操作
    if (l === null || r === null) {
      return
    }
    l.next = r
    //递归
    handler(l.left, l.right)
    handler(r.left, r.right)
    handler(l.right, r.left)
  }
  handler(root.left, root.right)
  return root
}
//lc-226
const invertTree = function (root) {
  if (!root) {
    return
  }
  let temp = root.left
  root.left = root.right
  root.right = temp
  invertTree(root.left)
  invertTree(root.right)
  
  return root
}
//lc-101 递归
const isSymmetric = function (root) {
  let left = root.left
  let right = root.right
  if (!root) {
    return true
  }
  let handler = (l, r) => {
    if (l === null && r === null) {
      return true
    }
    if (l === null || r === null) {
      return false
    }
    if (l.val !== r.val) {
      return false
    }
    if (l.val === r.val) {
      return handler(l.left, r.right) && handler(l.right, r.left)
    }
  }
  return handler(left, right)
}
//lc-111
const minDepth = function (root) {
  if (root === null) {
    return 0
  }
  if (root.left === null && root.right === null) {
    return 1
  }
  let min = Infinity
  if (root.left !== null) {
    min = Math.min(minDepth(root.left), min)
  }
  if (root.right !== null) {
    min = Math.min(minDepth(root.right), min)
  }
  return min + 1
}
//lc-112
const hasPathSum = function (root, targetSum) {
  if (!root) {
    return false
  }
  if (!root.left && !root.right) {
    return root.val === targetSum
  }
  return hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val)
}
//lc-104
const maxDepth = function (root) {
  if (!root) {
    return 0
  } else {
    let leftH = maxDepth(root.left)
    let rightH = maxDepth(root.right)
    return Math.max(leftH, rightH) + 1
  }
}
//lc-100
const isSameTree = function (p, q) {
  if (p === null && q === null) {
    return true
  }
  if (p === null || q === null) {
    return false
  }
  if (p.val !== q.val) {
    return false
  }
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
}


//DFS 深度优先
const dfs = function (root) {
  if (root === null) {
    return
  }
  
  dfs(root.left)
  dfs(root.right)
}
//BFS 广度优先
const bfs = function (root) {
  let arr = []
  arr.push(root)
  while (arr.length) {
    let node = arr.shift()
    if (node.left !== null) {
      arr.push(node.left)
    }
    if (node.right !== null) {
      arr.push(node.right)
    }
  }
}
//lc-102 层序遍历
const levelOrder = function (root) {
  let res = []
  let arr = []
  if (!root) {
    return []
  }
  arr.push(root)
  while (arr.length) {
    let n = arr.length
    let level = []
    for (let i = 0; i < n; i++) {
      let node = arr.shift()
      level.push(node.val)
      if (node.left !== null) {
        arr.push(node.left)
      }
      if (node.right !== null) {
        arr.push(node.right)
      }
    }
    res.push(level)
  }
  return res
}

//lc-145 后续遍历 迭代
const postorderTraversal = function (root) {
  let stack = []
  let res = []
  while (root || stack.length) {
    while (root) { //先遍历右子树，再遍历左子树
      stack.push(root)//ACF
      res.unshift(root.val)  //      DEBFCA
      root = root.right
    }
    root = stack.pop()
    root = root.left
  }
  return res
}
//lc-144 前序遍历 迭代
const preorderTraversal = function (root) {
  let stack = []
  let res = []
  while (root || stack.length) {
    while (root) {
      res.push(root.val) //1,2,4,2
      stack.push(root)//1/
      root = root.left
    }
    root = stack.pop()
    root = root.right
  }
  return res
}
//lc-94 中序遍历 递归
const inorderTraversal = function (root) {
  let result = []
  let handler = (node) => {
    if (!node) {
      return
    }
    //前序
    // result.push(node.val)
    // handler(node.left)
    // handler(node.right)
    
    //中序
    handler(node.left)
    result.push(node.val)
    handler(node.right)
    
    //后序
    // handler(node.left)
    // handler(node.right)
    // result.push(node.val)
  }
  handler(root)
  return result
}
//lc-94 中序遍历 迭代
const inorderTraversal2 = function (root) {
  let stack = []
  let res = []
  while (root || stack.length) {
    while (root) {
      stack.push(root)
      root = root.left
    }
    root = stack.pop()
    res.push(root.val)
    root = root.right
  }
  return res
}
//lc-387
const firstUniqChar = function (s) {
  let map = {}
  for (let i = 0; i < s.length; i++) {
    if (map[s[i]] === undefined) {
      map[s[i]] = 1
    } else {
      map[s[i]]++
    }
  }
  for (let i = 0; i < s.length; i++) {
    if (map[s[i]] === 1) {
      return i
    }
  }
  return -1
}
console.log('lc-387', firstUniqChar('leetcode'))
//lc-566
const matrixReshape = function (mat, r, c) {
  let flatMat = mat.flat(Infinity)
  if (r * c !== flatMat.length) {
    return mat
  }
  let newMat = []
  for (let i = 0; i < flatMat.length; i++) {
    if ((i + 1) % c === 0) {
      let temp = flatMat.slice(i - c + 1, i + 1)
      newMat.push(temp)
    }
  }
  return newMat
}
console.log('lc-566', matrixReshape([[1, 2], [3, 4]], 4, 1),)
//lc-350
const intersect = function (nums1, nums2) {
  let short = nums1.length > nums2.length ? nums2 : nums1
  let long = nums1.length > nums2.length ? nums1 : nums2
  let map = {}
  for (let i = 0; i < short.length; i++) {
    if (map[short[i]] === undefined) {
      map[short[i]] = 1
    } else {
      map[short[i]]++
    }
  }
  let result = []
  for (let i = 0; i < long.length; i++) {
    if (map[long[i]] !== undefined && --map[long[i]] >= 0) {
      result.push(long[i])
    }
  }
  return result
}
console.log('lc-350', intersect([4, 9, 5], [2, 2, 9, 4, 9, 6, 8, 4]))
//lc-88
const merge = function (nums1, m, nums2, n) {
  nums1.splice(m)
  nums1.push(...nums2)
  nums1.sort((a, b) => a - b)
  return nums1
}

console.log('lc-88', merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3))
//lc-206
const reverseList = function (head) {
  let prev = null, curr = head
  while (curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}
//lc-1
const twoSum = function (nums, target) {
  for (let i = 0; i < nums.length; i++) {
    let diff = target - nums[i]
    if (nums.indexOf(diff) !== -1 && nums.indexOf(diff) !== i) {
      return [i, nums.indexOf(diff)]
    }
  }
}
//lc-989
const addToArrayForm = function (num, k) {

}

//lc-665
const checkPossibility = function (nums) {

}

//lc-141
const hasCycle = function (head) {
  let fast = head
  let slow = head
  while (fast) {
    fast = fast.next
    if (fast.next) {
      fast = fast.next
    }
    if (fast === slow) {
      return true
    }
    slow = slow.next
  }
  return false
}
//lc-400
const findNthDigit = function (n) {
  //12345678910111213
  //1 1-9 共有 10^0*9*1个数
  //2 10-99 共有 10^1*9*2个数
  //3 100-999 共有 10^2*9*3 个数
  //x 10^(x-1)*9*x
  let digit = 1 //数位 1十位 2百位 3千位等
  let start = 1 //起始点数（个位1，十位10，百位100）
  let count = digit * 9 * start //该数位共有多少个索引数（不是数字个数）
  
  while (n > count) {
    //找出n属于哪个数位里的索引
    n -= count
    ++digit
    start *= 10
    count = digit * 9 * start
  }
  let num = start + (n - 1) / digit
  let remainder = (n - 1) % digit
  num = num.toString()
  return Number(num[remainder])
}

//lc-221
const maximalSquare = function (matrix) {

}
//lc-2046 offer-57-II
const findContinuousSequence = function (target) {
  //滑动窗口
  let sum = 0
  let left = 1
  let right = 1
  let result = []
  while (left < target / 2) {
    if (sum < target) {
      sum += right
      right++
    } else if (sum > target) {
      sum -= left
      left++
    } else {
      let arr = []
      for (let i = left; i < right; i++) {
        arr.push(i)
      }
      result.push(arr)
      sum -= left
      left++
    }
  }
  return result
}

// console.log('offer 57', findContinuousSequence(15))

//lc-888
const fairCandySwap = function (aliceSizes, bobSizes) {
  let sumA = aliceSizes.reduce((pre, cur) => {
    return pre + cur
  }, 0)
  let sumB = bobSizes.reduce((pre, cur) => {
    return pre + cur
  }, 0)
  let diff = sumA - sumB
  for (let i = 0; i < aliceSizes.length; i++) {
    for (let j = 0; j < bobSizes.length; j++) {
      if (aliceSizes[i] - bobSizes[j] === diff / 2) {
        return [aliceSizes[i], bobSizes[j]]
      }
    }
  }
}
console.log('lc-888', fairCandySwap([1, 2, 5], [2, 4]))
//lc-28
const strStr = function (haystack, needle) {
  if (!needle) return 0
  return haystack.indexOf(needle)
}
//lc-58
const lengthOfLastWord = function (s) {
  let arr = s.trim().split(' ')
  arr.reverse()
  return arr[0].length || 0
}

//lc-6
const convert = function (s, numRows) {

}

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
// let longestPalindrome = function (s) {
//   function check(str) {
//     let len = Math.floor((str.length + 1) / 2)
//     for (let i = 0; i < len; i++) {
//       if (str[i] !== str[str.length - i - 1]) {
//         return false
//       }
//     }
//     return true
//   }
//
//   let map = new Map()
//   let max = ''
//   for (let i = 0; i < s.length; i++) {
//     for (let j = i; j < s.length + 1; j++) {
//       if (check(s.slice(i, j))) {
//         if (!map.get(s.slice(i, j))) {
//           map.set(s.slice(i, j), s.slice(i, j).length)
//         }
//       }
//     }
//   }
//   map.forEach((val, key) => {
//     if (max.length < val) {
//       max = key
//     }
//   })
//   console.log(max)
//   return max
// };

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

const maxArea2 = function (height) {

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
// console.log(longestCommonPrefix(['flasdw', 'flqwd', 'flqws']))

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
    if (str.length === 2 * n) { //字符串构建完成
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

//lc-5 动态规划版

const longestPalindrome = function (s) {
  let len = s.length
  let res = ''
  //创建二维数组
  let dp = Array.from(new Array(len), () => (new Array(len).fill(0)))
  //从字符串首部开始
  for (let i = 0; i < len; i++) {
    //从字符串i前开始依次向前查找
    for (let j = i; j >= 0; j--) {
      dp[j][i] = s[i] == s[j] && (i - j < 2 || dp[j + 1][i - 1])
      if (dp[j][i] && i - j + 1 > res.length) {
        res = s.substring(j, i + 1)
      }
    }
  }
  console.log(dp)
  return res
}
// console.log(longestPalindrome('ababa'))

//lc-22 动态规划版本

const generateParenthesis2 = function (n) {

}

//lc-53

const maxSubArray = function (nums) {
  // let max = nums[0]
  // let pre = 0
  // nums.forEach(x => {
  //   pre = Math.max(pre + x, x)
  //   max = Math.max(max, pre)
  // })
  // return max
  
  //dp[i] = Math.max(dp[i-1]+nums[i], dp[i-1])
  //dp[0] = nums[0]
  let dp = [nums[0]]
  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]) //如果nums[i]都大于dp[i-1]+nums[i]了，说明dp[i-1]对于nums[i]是负增益，所以肯定取nums[i]
  }
  return Math.max(...dp)
}
// console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))

//lc-118

const generate = function (numRows) {
  let res = []
  for (let i = 0; i < numRows; i++) {
    let temp = []
    for (let j = 0; j <= i; j++) {
      let sum = 0
      if (!res[i - 1]) {
        sum = 1
      } else {
        let left = res[i - 1][j - 1] || 0
        let right = res[i - 1][j] || 0
        sum = sum + left + right
      }
      temp.push(sum || 1)
    }
    res.push(temp)
  }
  return res
}
// console.log(generate(5))


//lc-300

const lengthOfLIS = function (nums) {
  let n = nums.length
  if (n === 0) {
    return 0
  }
  let dp = new Array(n).fill(1)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
  }
  return Math.max(...dp)
}
// console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]))

//lc-121

const maxProfit = function (prices) {
  let res = 0
  let left = Infinity
  for (let i = 0; i < prices.length; i++) {
    left = Math.min(left, prices[i])
    res = Math.max(res, prices[i] - left)
  }
  return res
}

// console.log(maxProfit([7, 1, 5, 3, 6, 4]))

//lc-338

const countBits = function (n) {
  let result = []
  for (let i = 0; i <= n; i++) {
    let count = 0
    let temp = i.toString(2)
    for (let j = 0; j < temp.length; j++) {
      if (temp[j] == 1) {
        count += 1
      }
    }
    result.push(count)
  }
  return result
}
// console.log(countBits(5))


//lc-746

const minCostClimbingStairs = function (cost) {
  let dp = [0, 0]
  let n = cost.length
  for (let i = 2; i <= n; i++) {
    dp[i] = Math.min(dp[i - 2] + cost[i - 2], dp[i - 1] + cost[i - 1])
  }
  return dp[n]
}
// console.log(minCostClimbingStairs([10, 15, 20]))

//lc-53 dp

const maxSubArraydp = function (nums) {
  //dp[i] = dp[i-1] + nums[i]
  let dp = []
  let res = 0
  dp[0] = nums[0]
  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i])
    res = Math.max(dp[i], res)
  }
  return res
}
// console.log(maxSubArraydp([-2, 1, -3, 4, -1, 2, 1, -5, 4]))

//lc-62

//dp[m][n] =  dp[m-1][n] + dp[m][n-1]
//dp[1][n] = 1
//dp[m][1] = 1

const uniquePaths = function (m, n) {
  if (m === 1 || n === 1) {
    return 1
  }
  let dp = new Array(m).fill(new Array(n).fill(0))
  for (let i = 0; i < n; i++) dp[0][i] = 1
  for (let i = 0; i < m; i++) dp[i][0] = 1
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    }
  }
  return dp[m - 1][n - 1]
}

console.log('lc-62', uniquePaths(3, 7))

//lc-198
const rob = function (nums) {
  //dp[i] = Math.max(dp[i-2] + nums[i], dp[i-1])
  //dp[0] = nums[0]
  //dp[1] = Math.max(nums[0], nums[1])
  //求dp[nums.length-1]
  if (nums.length === 1) {
    return nums[0]
  }
  let dp = []
  dp[0] = nums[0]
  dp[1] = Math.max(nums[0], nums[1])
  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1])
  }
  return dp[nums.length - 1]
  
}
console.log('lc-198', rob([1, 1, 1, 2]))

//lc-213
const rob2 = function (nums) {
  if (nums.length === 1) {
    return nums[0]
  }
  if (nums.length === 2) {
    return Math.max(nums[0], nums[1])
  }
  let dp1 = []
  let dp2 = []
  
  dp1[0] = 0
  dp1[1] = nums[1]
  dp2[0] = nums[0]
  dp2[1] = Math.max(nums[0], nums[1])
  
  for (let i = 2; i < nums.length; i++) {
    dp1[i] = Math.max(dp1[i - 2] + nums[i], dp1[i - 1])
  }
  for (let i = 2; i < nums.length - 1; i++) {
    dp2[i] = Math.max(dp2[i - 2] + nums[i], dp2[i - 1])
  }
  return Math.max(dp1[nums.length - 1], dp2[nums.length - 2])
}
console.log('lc-213', rob2([1, 2, 3, 1]))


//lc-344
const reverseString = function (s) {
  let left = 0
  let right = s.length - 1
  let n = Math.floor(s.length / 2)
  for (let i = 0; i < n; i++) {
    let temp = s[left]
    s[left] = s[right]
    s[right] = temp
    left++
    right--
  }
}






