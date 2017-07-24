var app = getApp();

var moveIndex;
var rowHeight = 52;
var x, y, x1, y1, x2, y2;

Page({
  data: {
    content: [
      { content: 11, id: 1 },
      { content: 22, id: 2 },
      { content: 33, id: 3 },
      { content: 44, id: 4 },
      { content: 55, id: 5 },
      { content: 66, id: 1 },
      { content: 77, id: 2 },
      { content: 88, id: 3 },
      { content: 99, id: 4 },
      { content: 155, id: 5 },
      { content: 166, id: 1 },
      { content: 177, id: 2 },
      { content: 188, id: 3 },
      { content: 199, id: 4 },
    ]
  },
  movestart: function (e) {
    moveIndex = e.target.dataset.index;
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
    x1 = e.currentTarget.offsetLeft;
    y1 = e.currentTarget.offsetTop;
  },
  move: function (e) {

    x2 = e.touches[0].clientX - x + x1;
    y2 = e.touches[0].clientY - y + y1;
    if (y2 < -26) y2 = -26;
    let n = this.data.content.length - 1
    if (y2 > n * 52 - 26) y2 = n * 52 - 26
    this.setData({
      moveIndex: moveIndex,
      offset: { left: x2, top: y2 }
    })
  },
  moveend: function () {
    let index = Math.round(y2 / rowHeight);
    let items = this.data.content;
    let item = items[moveIndex]
    items.splice(moveIndex, 1)
    items.splice(index, 0, item)
    this.setData({
      moveIndex: -1,
      content: items
    })
  },
})