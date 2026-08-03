# 网格

网格是一种更简便的方式来创建一组相似的点击项。它们都具有相同的行为，但根据其数据而有所不同。

**注意：网格项在某些方面与点击项相似，但在很多方面与普通的 TMT 大功能有根本区别。请务必牢记以下几点：**
  - 网格项的 id 使用 100 进制而非 10 进制，因此一行中可以容纳超过 10 个格子。这意味着网格可能看起来像这样：
    101  102
    201  202
  - 单个网格项不是单独定义的。所有属性直接放入“grid”对象中。函数在调用时会接收网格项的 id 及其关联数据作为参数，因此你可以根据这些来赋予它们合适的外观和属性。
  - 如果在一个层中需要两个不相关的网格，你需要使用层代理组件。

处理网格时常用的函数：

- getGridData(layer, id)：获取所选网格项的数据
- setGridData(layer, id, state)：设置所选网格项的数据
- gridEffect(layer, id)：获取所选网格项的效果

网格的格式应如下所示：

```js
grid: {
    rows: 4, // 如果这些是动态的，请确保同时设置最大值！
    cols: 5,
    getStartData(id) {
        return 0
    },
    getUnlocked(id) { // 默认
        return true
    },
    getCanClick(data, id) {
        return true
    },
    onClick(data, id) { 
        player[this.layer].grid[id]++
    },
    getDisplay(data, id) {
        return data 
    },

    等等
}
```

功能特性：

- rows, cols：要显示的网格项的行数和列数。

- maxRows, maxCols：**有时需要**。如果 rows 或 cols 是动态的，你需要定义可能的最大值（不过你可以在更新游戏时增加它）。这些不能是动态的。

- getStartData(id)：在此位置创建网格项的默认数据。这可以是一个对象，也可以是一个普通值。

- getUnlocked(id)：**可选**。如果此位置的网格项应该可见，则返回 true。

- getTitle(data, id)：**可选**。根据网格项的位置和数据，返回应以较大字体显示在顶部的文本。

- getDisplay(data, id)：**可选**。根据网格项的位置和数据，返回在标题之后应显示在网格项上的所有内容。

- getStyle(data, id)：**可选**。返回应用于此网格项的 CSS，形式为一个对象，其中键是 CSS 属性，值是对应属性的值（均为字符串）。

- getCanClick(data, id)：**可选**。一个返回布尔值的函数，用于根据网格项的数据和位置确定是否可以点击它。如果不存在，则始终可以点击。

- onClick(data, id)：一个根据网格项的位置和数据实现点击行为的函数。

- onHold(data, id)：**可选**。当按钮被按住至少 0.25 秒时，每秒调用 20 次的函数。
                  
- getEffect(data, id)：**可选**。一个根据网格项的位置和数据计算并返回其效果的函数。（具体含义取决于网格项）

- getTooltip(data, id)：**可选**。为网格项添加工具提示，在悬停时显示。可以使用基本 HTML。默认为无工具提示。如果此函数返回空值，也会禁用工具提示。

- layer：**自动分配**。它与该层的名称相同，因此你可以使用 `player[this.layer].points` 或类似操作。