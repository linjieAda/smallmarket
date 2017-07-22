import React from 'react'
import CardAccept from './CardAccept'
import CardRule from './CardRule'
import CardAbout from './CardAbout'
import CardRankList from './CardRankList'

export default () =>
  <div className="app-card">
    <CardRule />
    <CardAccept />
    <CardAbout />
    <CardRankList />
    <div className="space"></div>
  </div>
