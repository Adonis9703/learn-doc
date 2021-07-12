//jz-21

function IsPopOrder(pushV, popV) {
  let temp = []
  for (let i = 0; i < pushV.length; i++) {
    temp.push(pushV[i])
    while (temp.length && temp[temp.length - 1] === popV[0]) {
      temp.pop()
      popV.shift()
    }
  }
  return temp.length === 0
}

//jz-29
function GetLeastNumbers_Solution(input, k) {
  input.sort((a, b) => {
    return a - b
  })
  return input.slice(0, k)
}

//jz-30
function FindGreatestSumOfSubArray(array) {
  let dp = []
  dp[0] = 0
  let max = array[0]
  for (let i = 1; i <= array.length; i++) {
    dp[i] = Math.max(array[i - 1], dp[i - 1] + array[i - 1])
    max = Math.max(max, dp[i])
  }
  return max
}

//jz-31
function NumberOf1Between1AndN_Solution(n) {
  let count = 0
  for (let i = 1; i <= n; i++) {
    let char = i.toString()
    for (let j = 0; j < char.length; j++) {
      if (char[j] == 1) {
        count++
      }
    }
  }
  return count
}

//jz-32
function PrintMinNumber(numbers) {
  numbers.sort((a, b) => {
    let m = `${a}${b}`
    let n = `${b}${a}`
    
    return Number(m) - Number(n)
  })
  return numbers.join('')
}
