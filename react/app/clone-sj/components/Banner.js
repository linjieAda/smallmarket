import React from 'react'
import CardPrize from './CardPrize'

export default () =>
  <div className="app-banner">
    <div className="banner-title">钓鱼赢好礼，38元换购8斤油桃+1盒蓝莓+采摘门票</div>
    <div className="banner-countdown">
      <div className="countdown">
        活动 结束 倒计时
        <b>0</b>天
        <b>0</b>时
        <b>0</b>分
        <b>0</b>秒
      </div>
    </div>
    <CardPrize />
  </div>
