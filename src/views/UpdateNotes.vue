<template>
  <div>
    <h3>更新日志</h3>
    <div v-for="date in updateNotes" :key="date[0]">
      <h5>{{ date[0] }}</h5>
      <ul class="browser-default">
        <li class="browser-default" v-for="note in date[1]" :key="note" v-html="note"></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    updateNotes: [
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
    ]
  })
}
</script>
