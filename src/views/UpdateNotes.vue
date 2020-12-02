<template>
  <div>
    <h3>{{$t('title')}}</h3>
    <div v-for="date in updateNotes[$t('key')]" :key="date[0]">
      <h5>{{ date[0] }}</h5>
      <ul class="browser-default">
        <li class="browser-default" v-for="note in date[1]" :key="note" v-html="note"></li>
      </ul>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "key":"en",
    "title": "Update Notes"
  },
  "zh": {
    "key":"zh",
    "title": "更新日志"
  }
}
</i18n>

<script>
export default {
  data: () => ({
    updateNotes: {"en":[
      [
        '2020/12/02', [
          'Added recent plays page'
        ]
      ],
      [
        '2020/11/26', [
          'Added English translation',
          'Music infos are now auto updated'
        ]
      ],
      [
        '2020/11/23', [
          'Added change name page'
        ]
      ],
      [
        '2020/11/21', [
          'Added color scheme option',
          'Improved layout for daily ranking'
        ]
      ],
      [
        '2020/11/20', [
          'Added daily cheese',
          'Added change password',
          'Added update notes'
        ]
      ],
      [
        '2020/11/19', [
          'JiNALE-NET is now online!'
          // '<s>Yuuki, when will you release maimai.best</s>'
        ]
      ]
    ], "zh":[
      [
        '2020/12/02', [
          '添加了最近游玩页面'
        ]
      ],
      [
        '2020/11/26', [
          '添加英文界面',
          '歌曲曲单改为动态更新'
        ]
      ],
      [
        '2020/11/23', [
          '添加了更名页面'
        ]
      ],
      [
        '2020/11/21', [
          '添加主题配色选项',
          '改进了每日金曲榜的显示'
        ]
      ],
      [
        '2020/11/20', [
          '新增了每日奶酪签到',
          '新增了修改密码',
          '新增了更新日志'
        ]
      ],
      [
        '2020/11/19', [
          'JiNALE-NET正式上线啦'
          // '<s>Yuuki, when will you release maimai.best</s>'
        ]
      ]
    ]}
  })
}
</script>
