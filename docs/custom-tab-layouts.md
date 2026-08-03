# 自定义标签页布局

注意：如果你使用子标签页，`tabFormat` 的使用方式有所不同，但定义其布局时使用的格式是相同的。[点击此处了解更多关于子标签页的信息](subtabs-and-microtabs.md)。

自定义标签页布局可用于在标签页窗口中实现几乎任何功能，尤其是与“style”图层功能结合使用时。`tabFormat` 功能是一个数组，包含各种元素，如下所示：

```js
tabFormat: [
    "main-display",
    ["prestige-button"],
    "blank",
    ["display-text",
        function() { return '我有 ' + format(player.points) + ' 个尖尖点数！' },
        { "color": "red", "font-size": "32px", "font-family": "Comic Sans MS" }],
    "blank",
    ["toggle", ["c", "beep"]],
    "milestones",
    "blank",
    "blank",
    "upgrades"
]
```

它是一个组件列表，每个组件可以只是一个名称，也可以是一个带参数的数组。如果是数组，第一项是组件名称，第二项是传入该组件的数据，第三项（可选）使用“CSS 对象”为其应用 CSS 样式，其中键为 CSS 属性。

以下是现有的组件，但你可以在 [components.js](/js/components.js) 中创建更多组件：

- display-text：显示一些文本（可以使用基本 HTML）。参数是要显示的文本。它也可以是一个返回动态更新文本的函数。

- display-image：显示一张图片。参数是图片的 URL。

- h-line、v-line：分别显示水平或垂直的分隔线。

- raw-html：显示一些基本 HTML，也可以是一个函数。

- blank：添加空白空间。默认尺寸为 8px x 17px。参数可更改尺寸。如果是一个单一值（例如 "20px"），则决定高度。如果有一对参数，第一个是宽度，第二个是高度。

- row：水平显示一组组件。参数是一个采用标签页布局格式的组件数组。

- column：垂直显示一组组件。参数是一个采用标签页布局格式的组件数组。这对于在行内显示列非常有用。

- main-display：显示该图层的主要货币及其效果的文本。参数是使用的精度值，允许显示非整数。

- resource-display：显示该图层所基于的货币，以及该图层声望货币的最佳值和/或总值（如果它们被放入该图层的 `startData` 中）的文本。

- prestige-button：用于重置该图层中某种货币的按钮。

- text-input：一个文本输入框。参数是 `player[layer]` 中该输入对应的变量名，即 `player[layer][argument]`
    （支持字符串、数字和 Decimal！）

- slider：让用户通过滑块输入一个值。参数是一个 3 元素数组：[name, min, max]。
    name 是 `player[layer]` 中该输入对应的变量名，min 和 max 是滑块的范围。
    （不适用于 Decimal 值）

- drop-down：让用户通过下拉菜单输入一个值。参数是一个 2 元素数组：[name, options]。
    name 是 `player[layer]` 中该输入对应的变量名，options 是一个字符串数组，表示可用的选项。

- upgrades、milestones、challenges、achievements、buyables、clickables：相应地显示图层的升级/挑战等。参数是可选的，如果该组件不包含所有行，则它是一个该组件应包含的行列表。

- microtabs：为一个区域显示一组子标签页。参数是“microtabs”功能中该组子标签页的名称。

- bar：显示一个进度条。参数是要显示的进度条的 id。

- infobox：显示一个信息框。参数是要显示的信息框的 id。

- tree：显示一个树状图。参数是一个数组的数组，包含树中节点的名称（先按行，再按列）
    [点击此处了解更多关于树状图布局和节点的信息！](trees-and-tree-customization.md)

- upgrade-tree、buyable-tree、clickable-tree：显示来自该图层的升级/可购买项/可点击项的树状图。参数是一个数组的数组，包含树中升级等的 id（先按行，再按列）。一个树只能包含一种类型的组件。

- toggle：一个切换按钮，用于切换布尔值。参数是一对标识 `player` 中要切换的布尔值位置的标识符，例如 `[layer, id]`。'layer' 也会影响切换按钮的颜色。

- grid：显示该图层的可网格化网格。如果你需要多个网格，请使用图层代理。参数是可选的，如果该组件不包含所有行，则它是一个该组件应包含的行列表。

- layer-proxy：允许你使用来自另一个图层的组件。参数是一对 `[layer, data]`，由要代理的图层的 id 和要显示的组件的 tabFormat 组成。
    （注意：你不能在图层代理中使用子标签页）


其余组件是子组件。它们可以像其他组件一样使用，但通常是其他组件的一部分。

- upgrade、milestone、challenge、buyable、clickable、achievement、gridable：单个升级、挑战等。参数是 id。例如，如果你想将升级拆分到多个子标签页中，可以使用此功能。

- respec-button、master-button：分别是可购买项和可点击项的重置和主按钮。

- sell-one、sell-all：分别是可购买项的“出售一个”和“全部出售”。参数是可购买项的 id。