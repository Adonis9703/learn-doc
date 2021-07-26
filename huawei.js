const handler = (s, p) => {
  if (s.includes(p)) {
    return 0
  }
  let result = []
  //avaaxbyzab
  //ab
  let idxs = 0
  let idxp = 0
  let start = []
  let end = 0

  for (let i = 0; i < s.length; i++) {
    if (s[i] === p[0]) {
      start.push(i)
    }
  }



  //s xxxxxxxxxaxbcabc
  //p abc
  //
}