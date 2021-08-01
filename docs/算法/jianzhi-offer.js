//15
const hammingWeight = function (n) {

}
//14-I
const cuttingRope = function (n) {
}

//13
const movingCount = function (m, n, k) {
  let handle = (i, j) => {
    if (i < 0 || j < 0 || i >= m || j >= n) {
      return
    }
    let sum = (i + '' + j).split('').reduce((a, b) => +a + +b)
    if (sum <= k && !map[`${i},${j}`]) {
      result++
      map[`${i},${j}`] = true
      // arr[i][j] = 1
      handle(i + 1, j)
      handle(i - 1, j)
      handle(i, j - 1)
      handle(i, j + 1)
    }
  }
  let map = {}
  // let arr = new Array(m).fill(new Array(n).fill(0))
  let result = 0
  handle(0, 0)
  return result
}
console.log('13', movingCount(2, 3, 1))

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
function ListNode(val) {
  this.val = val;
  this.next = null;
}

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

//04
const findNumberIn2DArray = function (matrix, target) {
  let m = matrix.length
  let n = matrix[0].length
  for (let i = 0; i < m; i++) {
    if (target >= matrix[i][0] && target <= matrix[i][n - 1]) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][j] === target) {
          return true
        }
      }
    }
  }
  return false
}
console.log('04', findNumberIn2DArray([
  [1, 4, 7, 11, 15],
  [2, 5, 8, 12, 19],
  [3, 6, 9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30]
], 20))

//05
const replaceSpace = function (s) {
  return s.replace(/\s/g, "%20");
}
console.log('05', replaceSpace('We are happy'))

//06
const reversePrint = function (head) {
  let arr = []
  while (head) {
    arr.push(head.val)
    head = head.next
  }
  arr.reverse()
  return arr
}
//07
const buildTree = (preorder, inorder) => {
  if (inorder.length === 0) return null;
  const root = new TreeNode(preorder[0]);
  const mid = inorder.indexOf(preorder[0]);
  root.left = buildTree(preorder.slice(1, mid + 1), inorder.slice(0, mid));
  root.right = buildTree(preorder.slice(mid + 1), inorder.slice(mid + 1));
  return root;
};

//09
const CQueue = function () {
  this.stack = []
  this.stack2 = []
};

/**
 * @param {number} value
 * @return {void}
 */
CQueue.prototype.appendTail = function (value) {
  this.stack.push(value)
};

/**
 * @return {number}
 */
CQueue.prototype.deleteHead = function () {
  if (this.stack2.length === 0) {
    while (this.stack.length) {
      this.stack2.push(this.stack.pop())
    }
    if (this.stack2.length) {
      return this.stack2.pop()
    } else {
      return -1
    }
  } else {
    return this.stack2.pop()
  }

};

/**
 * Your CQueue object will be instantiated and called as such:
 * var obj = new CQueue()
 * obj.appendTail(value)
 * var param_2 = obj.deleteHead()
 */
// 10-I
const fib = function (n) {
  let a = 0
  let b = 1
  let sum = b
  for (let i = 0; i < n; i++) {
    sum = (a + b) % 1000000007
    a = b
    b = sum
  }
  return a
  // let dp = [0, 1]
  // for (let i = 2; i <= n; i++) {
  //   dp[i] = (dp[i - 1] + dp[i - 2]) % 1000000007
  // }
  // return dp[n]
}

//10-II
const numWays = function (n) {
  let dp = [1, 1, 2]
  for (let i = 3; i <= n; i++) {
    dp[i] = (dp[i - 1] + dp[i - 2]) % 1000000007
  }
  return dp[n]
}
console.log('10-II', numWays(7))

//11
const minArray = function (numbers) {
  // for (let i = 0; i < numbers.length; i++) {
  //   if (numbers[i] < numbers[0]) {
  //     return numbers[i]
  //   }
  // }
  // return numbers[0]
  let low = 0;
  let high = numbers.length - 1;
  while (low < high) {
    const pivot = low + Math.floor((high - low) / 2);
    if (numbers[pivot] < numbers[high]) {
      high = pivot;
    } else if (numbers[pivot] > numbers[high]) {
      low = pivot + 1;
    } else {
      high -= 1;
    }
  }
  return numbers[low];
}
console.log('11', minArray([2, 2, 2, 0, 1]))

//12

const exist = function (board, word) {
  if (word.length > board.length * board[0].length) {
    return false
  }
  const handle = (row, col, target) => {
    // console.log(row, col, target)
    if (row < 0 || col < 0 || row > board.length - 1 || col > board[0].length - 1 || board[row][col] !== word[target]) return false
    if (target === word.length - 1) return true
    let save = board[row][col]
    if (board[row][col] === word[target]) {
      board[row][col] = '-'
      let res = handle(row, col + 1, target + 1)
        || handle(row, col - 1, target + 1)
        || handle(row + 1, col, target + 1)
        || handle(row - 1, col, target + 1)
      board[row][col] = save
      return res
    }
  }
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (handle(i, j, 0)) {
        return true
      }
    }
  }
  return false
}

console.log('12', exist([["a", "b"], ["c", "d"]], "abcd"))



















