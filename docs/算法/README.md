---
title: 算法相关
---

# 算法

## 数据结构

数据结构与算法之间是相辅相成的，数据结构服务于算法，算法作用于特定的数据结构之上。

> 数据结构中最基础的就是数据（顺序存储）和链表（链式存储）

- 队列和栈可以分别通过数组和链表实现
- 通常情况下我们会用数组实现堆（完全二叉树），用链表也可以实现（二叉搜索树、红黑树、AVL、B树等）
- 图用二维数组实现就是邻接矩阵，用链表实现就是邻接表
- 散列表中可以用链表解决散列冲突（拉链法），也可以用数组（线性探测法）

#### 数据结构与算法在前端中的应用

- `DOM`树、`AST`树、`Vue`、`React`的`Virtual DOM`都是树
- `HTTP`缓存响应消息和`Vue`的`keep-alive`都用到了`LRU`算法
- 浏览器前进后退功能通过栈实现
- 搜索引擎采用的是**广度有限搜索策略**

#### 如何学习数据结构和算法

**刷题**

## 复杂度

### 时间复杂度和空间复杂度

- 时间：执行当前算法所消耗的时间
- 空间：执行当前算法所需要占用的内存空间

加上复杂度

- 时间复杂度：全称是渐进时间复杂度，表示算法的执行时间与数据规模之间的增长关系
- 空间复杂度：全程是渐进空间复杂度，表示算法的存储空间与数据规模之间的增长关系

也就是说，算法的执行效率由**执行时间**、**存储空间**两个方面决定。复杂度分析就是用来分析算法执行效率
与数据规模之间的关系，包括**时间复杂度**和**空间复杂度**

### 大O表示法

`T(n) = O(f(n))`

所有代码的执行时间T(n)与每行代码的执行次数n成正比

- T(n)：代码执行的时间
- n：数据规模
- f(n)：每行代码执行的次数总和
- O：表示T(n)与f(n)成正比

### 常见的时间复杂度

按数量级递增如下：

- 常量阶 O(1)
- 对数阶 O(logn)
- 线性阶 O(n)
- 线性对数阶 O(nlogn)
- 平方阶 O(n^2)
- 立方阶 O(n^3)
- 指数阶 O(2^n)
- 阶乘阶 O(n!)

其中，指数阶和阶乘阶会随着数据规模 n 的增大，执行时间急剧增长，十分低效，我们暂且不去分析。下面我们通过代码来逐一理解其余的时间复杂度。

#### 常量阶 O(1)

```javascript
const a = 1
let b = 2
```
上述代码，执行消耗的时间不受某个变量(n)的增长而影响，所以它的时间复杂度为O(1)。也就是说，一般情况下，除了
循环语句、递归语句，时间复杂度都为O(1)

#### 对数阶 O(logn)

```javascript
let i = 1
const n = 6
while (i < n) {
  i = i * 2
}
```
当循环x次后，循环退出。也就是说2的x次方等于n，那么`x = log2^n`，也就是循环`log2^n`次后循环退出，得出时间复杂度
为O(logn)。
> 二分查找的时间复杂度就是O(logn)

#### 线性阶 O(n)

```javascript
const n = 996;
for (let i = 0; i <= n; i++) {
    console.log('来过' + i +'次前端食堂吃饭');
}
```
毫无疑问，for循环里的代码会执行 n 遍，所以这类代码的时间复杂度就是 O(n)。计数排序、基数排序、桶排序的时间复杂度都是 O(n)。

#### 线性对数阶 O(nlogn)

```javascript
let j = 1;
const n = 6;
for (let i = 0; i <= n; i++) {
    while (j < i) {
        j = j * 2;
    }
}
```
理解了对数阶和线性阶，线性对数阶理解起来就很容易了，就是将时间复杂度为 O(logn) 的代码循环 n 遍，
那么它的时间复杂度就是 O (nlogn)。
> 归并排序、快速排序、堆排序的时间复杂度都是 O(nlogn)。

#### 平方阶 O(n^2)
```javascript
const n = 6;
for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
        console.log('前端食堂的饭真香');
    }
}
```
平方阶就是把 O(n) 的代码再嵌套一层循环，它的时间复杂度就是 O(n^2)了。冒泡排序、插入排序、选择排序的时间复杂度都是 O(n^2)。

在现实中，往往代码会比较复杂，以下是几条小技巧来判断时间复杂度：
- 单段代码看高频：循环
- 多段代码取最大：有循环和多重循环的情况，取多重循环的复杂度
- 嵌套代码求乘积：循环中的递归
- 多个规模求和：分别有两个参数控制两个循环的次数，取二者的复杂度相加


### 常见的空间复杂度

- O(1)
- O(n)
- O(n^2)

逐个分析

#### O(1)

```javascript
const a = 1
let b = 2
```
我们定义的变量a、b所占的空间并不会随着某个变量的变化而变化，所以它的空间复杂度为O(1)

#### O(n)

```javascript
let arr = []
const n = 996
for (let i = 0; i < n; i++) {
  arr[i] = i
}
```
arr所占用的内存由n来决定，会随着n的增大而增大，所以它的空间复杂度就是O(n)。
> 如果初始化一个二维数组 n*n, 那么它的空间复杂度就是O(n^2)

一般在实际中，空间复杂度和你初始化的数组长度有关，除此之外，也和递归的深度有关

### 时空转换

时间复杂度和空间复杂度往往是相互影响的，两者不可兼得。在工程及算法解题中，根据实际情况，
常用做法就是**空间换时间**。比如：记忆化搜索、缓存等

## 递归

很多算法思想都基于递归，无论是DFS、树的遍历、分治算法、动态规划等都是递归思想的应用。学会了用递归来解决问题的这种思维方式，再去学习其他的算法思想，无疑是事半功倍的。

### 递归的本质

> 无可奈何花落去，似曾相识燕归来

递归，去的过程叫“递” ，回来的过程叫“归”。

计算机语言的本质是汇编语言，汇编语言的特点就是没有循环嵌套。
我们平时使用高级语言来写的 if..else.. 也好， for/while 也好，在实际的机器指令层面来看，就是一个简单的地址跳转，跳转到特定的指令位置，类似于 goto 语句。

机器嘛，总是没有温度的。我们再来看一个生活中的例子，大家小的时候一定用新华字典查过字。如果要查的字的解释中，也有不认识的字。那就要接着查第二个字，不幸第二个字的解释中，也有不认识的字，就要接着查第三个字。
直到有一个字的解释我们完全可以看懂，那么递归就到了尽头。接下来我们开始后退，逐个清楚了之前查过的每一个字，最终，我们明白了我们要查的第一个字。

我们再从一段代码中，体会一下递归。

```javascript
const factorial = function(n) {
  if (n <= 1) {
    return 1
  }
  return n * factorial(n - 1)
}
```
`factorial`是一个实现阶乘的函数，我们以`f(6)`来看一下递归。
![avater](/cal-1.png)

`f(6) = n * f(5)`, 而`f(5) = n * f(4)`，以此类推直到`f(1)`,这就是**递**的过程。

当`f(1)`解决后，依次可以解决`f(2)...f(n)`的问题，这就是**归**的过程。

由此可见，递归便是把问题拆解成具有**相同**解决思路的子问题，知道最后被拆解的子问题不能够被拆解，这个过程叫*递*。
当解决了最小粒度可解的子问题后，在*归*的过程中顺其自然的解决了最开始问题。

在通过递归解题之前，需要考虑是否满足递归的三个条件：
1. 问题可以被拆分成几个子问题
2. 问题和子问题的求解方式完全相同
3. 有递归终止的条件

### 例题

> 求解斐波那契数列，该数列由0和1开始，后面的每一项都是前面两项数字的和

```
F(0) = 0,  F(1) = 1
F(N) = F(N-1) + F(N - 2)，其中 N > 1
```
给定N，计算F(N)

![avater](/cal-2.png)

递归树如上所示，要计算`f(5)`，就要先计算子问题`f(4)`和`f(3)`，要计算`f(4)`就要计算子问题`f(3)`和`f(2)`...以此类推，
当计算到`f(1)`或`f(0)`时，结果已知，然后层层返回结果。

#### 递归解法

```javascript
const fib = function(n) {
  if (n === 1 || n === 0) {
    return n
  }
  return fib(n-1) + fib(n-2)
}
```

#### 复杂度分析

- 空间复杂度为O(n)
- 时间复杂度 O(2^n)

> 总时间 = 子问题个数 * 解决一个子问题所需要的时间

- 子问题个数即递归树中的节点总数2^n
- 解决一个子问题需要的时间，因为只有一个加法操作`fib(n-1) + fib(n-2)`，所以解决一个子问题的时间为O(1)

二者相乘，得出算法的时间复杂度为O(2^n)，指数级别，让我们换一种解法。

#### 动态规划解法

递归是自顶向下(看上文递归树)，动态规划是自底向上，将递归改成迭代。为了减少空间消耗，只存储两个值，这种解法是动态规划的最优解。

- 时间复杂度 O(n)
- 空间复杂度 O(1)

```javascript
const fib = function(n) {
  if (n == 0) {
    return 0
  }
  let arr = []
  arr[1] = 1
  arr[0] = 0
  for (let i = 2; i <= n; i++) {
    arr[i] = arr[i - 1] + arr[i - 2]
  }
  return arr[n]
}
```

es6 解构写法 + 空间优化
```javascript
const fib = function(n) {
  if (n == 0) {
    return 0
  }
  let a1 = 0
  let a2 = 1
  for (let i = 1; i < n; i++) {
    [a1, a2] = [a2, a1 + a2]
  }
 return a2
}
```
## 分治算法 Divide and Conquer

> 分而治之，先解决子问题，再将子问题的解合并求出原问题

分治算法思想很大程度上是基于递归的，也比较适合用递归来实现。分而治之，一般分为以下三个过程：
1. 分解
2. 解决
3. 合并

比较经典的应用就是`归并排序（Merge Sort）`和`快速排序（Quick Sort）`等。我们来从归并排序理解分治思想，
归并排序就是将待排序数组不断*二分*为规模更小的子问题处理，再将处理好的子问题合并起来。

```javascript
const mergeSort = function (arr) {
  const len = arr.length
  if (len > 1) {
    //对半分解 分
    const middle = Math.floor(len / 2)
    const left = arr.slice(0, middle)
    const right = arr.slice(middle, len)
    //分别对左右进行排序
    mergeSort(left)
    mergeSort(right)

    //治
    let i = 0
    let j = 0
    let k = 0
    //逐一比较
    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        arr[k] = left[i]
        i++
      } else {
        arr[k] = right[j]
        j++
      }
      k++
    }
    //处理剩余项 由于剩余项本身就已经被上一个递归排序好了 所以直接顺序赋值即可
    while (i < left.length) {
      arr[k] = left[i]
      i++
      k++
    }
    while (j < right.length) {
      arr[k] = right[j]
      j++
      k++
    }
  }
  return arr
}


console.log(mergeSort([8, 4, 5, 7, 1, 3, 6, 2]))
// 分
// [8,4,5,7]  [1,3,6,2]
// [8,4][5,7]   [1,3][6,2]
// 8 4   5 7   1 3   6 2

// 治
// [4,8] [5,7]   [1,3] [2,6]
// [4,5,7,8] [1,2,3,6]
// [1,2,3,4,5,6,7,8]
```

时间复杂度：O(nlogn)
空间复杂度：O(n)

## 动态规划 Dynamic Programming

[例题](https://leetcode-cn.com/problems/climbing-stairs/)

假设你正在爬楼梯，需要*n*阶你才能到达楼顶。（*n*是正整数）

每次可以爬1或2个台阶，你有多少中不同的方法可以爬到楼顶呢？

使用动态规划思想解题，首先要明确动态规划的三要素。

### 动态规划三要素

1. 重叠子问题
2. 最优子结构
3. 状态转移方程

#### 重叠子问题

> 切换机器思维，自底向上思考

爬第n阶楼梯的方法数量，等于两部分之和：

- 爬上 n-1 阶楼梯的方法数量
- 爬上 n-2 阶楼梯的方法数量

#### 最优子结构

> 子问题的最优解能够退出原问题的优解

#### 状态转移方程

`dp[n] = dp[n-1] + dp[n-2]` 

#### 解题

确定三要素后，确认边界条件，初始化状态：

- `dp[1] = 1` 只有 1 个台阶时，只有 1 种解法
- `dp[2] = 2` 有 2 个台阶时，可以分两次1步 或 一次2步 2种解法

```javascript
const climbStairs = function(n) {
  if (n === 1 || n === 2) {
    return n
  }
  const dp = []
  dp[1] = 1
  dp[2] = 2
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i-2] + dp[i-1]
  }
  return dp[n]
}
```

- 时间复杂度：O(n)
- 空间复杂度: O(n)

#### 优化

在次基础上，我们还可以通过压缩空间来对算法进行优化。

因为`dp[i]`只与`dp[i-1]`和`dp[i-2]`有关，没必要存储所有出现过的dp项，因此只用
两个临时变量去存储这两个状态即可。

```javascript
const climbStairs = function(n) {
  const climbStairs = function (n) {
    let a1 = 1
    let a2 = 2
    for (let i = 3; i <= n; i++) {
      [a1, a2] = [a2, a1 + a2]
    }
    return a2
  }
}
```
- 时间复杂度：O(n)
- 空间复杂度：O(1)

## 贪心算法 Greedy

贪心算法时动态规划算法的一个子集，可以更高效地解决一部分更特殊的问题。实际上，用贪心算法解决问题的思路，
并不总能给出最优解，因为它在每一步的决策中，选择目前最优策略，不考虑全局是不是最优。

[例题](https://leetcode-cn.com/problems/assign-cookies/description/)

假设你是一位很棒的家长，想要给你的孩子们一些小饼干。但是，每个孩子最多只能给一块饼干。

对每个孩子 i，都有一个胃口值 `g[i]`，这是能让孩子们满足胃口的饼干的最小尺寸；并且每块饼干 j，都有一个尺寸 `s[j]` 。
如果 `s[j] >= g[i]`，我们可以将这个饼干 j 分配给孩子 i ，这个孩子会得到满足。你的目标是尽可能满足越多数量的孩子，并输出这个最大数值。

```javascript
//输入 g = [1,2,3]   s = [1,2]
//输出 1 
//输入 g = [1,2]   s = [1,2,3]
//输出 2 
```

#### 思路

贪心算法 + 双指针求解

- 给一个孩子的饼干应当经量小且能够满足孩子，更大的饼干留给胃口更大的孩子
- 因为胃口小的孩子最容易满足，所以优先满足胃口小的孩子
- 按照从小到大的顺序使用饼干尝试是否可以满足某个孩子
- 当饼干j >= 胃口i时，饼干满足胃口，更新满足的孩子数并移动指针`i++`，`j++`，`res++`
- 当饼干j < 胃口i时，饼干不能满足胃口，需要换大的`j++`

#### 关键点

将需求因子g和s分别从小到大排序，使用贪心思想配合双指针，每个饼干只尝试一次，成功则换下一个孩子来尝试。
```javascript
const findContentChildren = function (g, s) {
  g.sort((a, b) => a - b)
  s.sort((a, b) => a - b)
  let gi = 0 //胃口值index
  let sj = 0 //饼干尺寸index
  let res = 0 //满足的孩子数量
  while (gi < g.length && sj < s.length) {
    if (s[sj] >= g[gi]) {
      gi++
      sj++
      res++
    } else {
      sj++
    }
  }
  return res
}
```
- 时间复杂度：O(nlogn)
- 空间复杂度：O(1)

## 回宿算法 Backtracking

> 回溯算法本质上就是枚举，使用摸着石头过河的查找策略，还可以通过剪枝少走冤枉路

[例题](https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/)

#### 思路

使用*回溯法*进行求解，回溯是一种通过*穷举*所有可能的情况来找到所有解的算法。
如果一个候选解最后被发现并不是可行解，回溯算法会舍弃它，并在前面的一些步骤做出一些修改，并重新尝试找到可行解。究其本质，其实就是枚举。

如果没有更多的数字需要被输入，说明当前的组合已经产生。

如果还有数字需要被输入：
- 遍历下一个数字所对应的所有映射的字母
- 将当前的字母添加到组合最后，也就是str+ tmp[r]

#### 关键点

在for循环中调用递归

```javascript
const letterCombinations = function (digits) {
  if (!digits) {
    return []
  }
  const len = digits.length
  const map = new Map()
  map.set('2', 'abc')
    .set('3', 'def')
    .set('4', 'ghi')
    .set('5', 'jkl')
    .set('6', 'mno')
    .set('7', 'pqrs')
    .set('8', 'tuv')
    .set('9', 'wxyz')
  const result = []

  // console.log(map)
  function generate(i, str) {
    if (i == len) {
      result.push(str)
      return
    }
    const tmp = map.get(digits[i])
    for (let r = 0; r < tmp.length; r++) {
      generate(i + 1, str + tmp[r])
    }
  }

  generate(0, '')
  return result
}
```






