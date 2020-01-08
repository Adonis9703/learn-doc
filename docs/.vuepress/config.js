module.exports = {
  title: 'YUSIYUAN',
  description: 'Play Fun',
  themeConfig: {
    sidebar: [
      '/welcome/',
      {
        title: '笔记',
        children: [
          '/javascript/',
          '/style/',
          '/vue/'
        ]
      },
      {
        title: '游乐场',
        children: [
          '/canvas/',
          '/css/'
        ]
      },
    ],
    lastUpdated: '上次更新时间',
  },
  sidebar: {},
  postcss: [require('autoprefixer')],
  sass: {indentedSyntax: true}
}
