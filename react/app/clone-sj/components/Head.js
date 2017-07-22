import React from 'react'
const smallfishImg = require('../img/smallfish.png');

export default () =>
  <div className="app-heading">
    <div className="getfish"></div>
    <img className="smallfish" src={smallfishImg} alt="" />
    <img className="smallfishright" src={smallfishImg} alt="" />
  </div>

