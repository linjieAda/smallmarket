import React from 'react'

export default () =>
  <div className="card">
    <div className="card-header">排行榜</div>
    <div className="card-body">
      <table className="rank-table">
        <thead>
          <tr>
            <th>排名</th>
            <th>姓名</th>
            <th>鱼数</th>
            <th>完成时间</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>木</td>
            <td>1</td>
            <td>2017-07-08</td>
          </tr>
          <tr>
            <td>1</td>
            <td>木</td>
            <td>1</td>
            <td>2017-07-08</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
