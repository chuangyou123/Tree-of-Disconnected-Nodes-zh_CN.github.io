# The-Modding-Tree

在The Modding Tree中制作游戏，主要涉及在对象上定义参数或函数。如果你没有遵循[入门指南](tutorials/getting-started.md)，你应该从在[mod.js](/js/mod.js)中[设置你的基本模组信息](main-mod-info.md)开始。设置模组ID以确保存档正常工作非常重要。

除此之外，添加内容的主要方式是通过创建层（layers）。你可以通过调用`addLayer(layername, layerdata)`来添加新层。[layers.js](/js/layers.js)中有一个基本层的示例。它只是一个示例，可以随意删除。你也可以将其作为参考或作为你自己层的基础。

你可以通过在浏览器中打开[index.html](/index.html)文件来测试你的模组。

大多数情况下，你不需要深入代码来创建东西，但如果你真的想，你仍然可以，例如在[components.js](/js/components.js)中添加新的Vue组件。

The Modding Tree使用[break\_eternity.js](https://github.com/Patashu/break_eternity.js)来存储大数值。这意味着许多数字是`Decimal`对象，必须以不同的方式处理。例如，你必须使用`new Decimal(x)`来创建一个`Decimal`值，而不是普通数字（x可以是数字或字符串以表示更大的值）。你通过调用函数来对它们进行操作。例如，不要使用`x = x + y`，而是使用`x = x.add(y)`。请记住，这也适用于比较运算符，应该用调用`.gt`、`.gte`、`.lt`、`.lte`、`.eq`和`.neq`函数来替代。有关使用`Decimal`值的更多详细信息，请参阅[break\_eternity.js](https://github.com/Patashu/break_eternity.js)文档。

几乎所有值既可以是常量值，也可以是动态值。动态值通过放置一个函数来定义，该函数返回任何给定时间应有的值。

所有显示文本都可以使用基本的HTML元素（但你不能在那里使用大多数Vue功能）。

在阅读本文档时，描述功能时将使用以下图例：

- 无标签：这是必需的，如果不包含，游戏可能会崩溃。
- **有时必需**：这可能根据层中的其他内容而必需。
- **可选**：如果你不打算为该层使用该功能，可以省略。
- **自动分配**：该值将被自动设置，并覆盖你设置的任何值。
- **已弃用**：不建议使用此功能，因为较新的功能能够以更好、更简单的方式实现相同的效果。

## 目录



### 通用

- [入门](tutorials/getting-started.md)：使用Github Desktop设置你自己的代码副本的指南。
- [制作模组](tutorials/making-a-mod.md)：使用TMT制作基本模组的指南。
- [主模组信息](main-mod-info.md)：如何在[mod.js](/js/mod.js)中为你的模组设置常规内容。
- [基本层分解](basic-layer-breakdown.md)：分解具有最少功能的层的组成部分。
- [层功能](layer-features.md)：解释你可以赋予层的所有不同属性。
- [自定义标签页布局](custom-tab-layouts.md)：一种可选方式，为你的标签页提供不同的布局。你甚至可以创建全新的组件来使用。
- [自定义游戏布局](trees-and-tree-customization.md)：你可以去掉树标签页，在树上添加按钮和其他东西，
    甚至像层标签页一样自定义标签页的布局。
- [更新TMT](tutorials/updating-tmt.md)：使用Github Desktop更新你的模组的TMT版本。
- [其他内容](other.md)：TMT拥有的其他简洁功能，这些功能不值得单独开设页面。

### 常见组件

- [升级](upgrades.md)：如何为层创建升级。
- [里程碑](milestones.md)：如何为层创建里程碑。
- [可购买项](buyables.md)：为你的层创建可重复购买的升级（可选择使其可重置）。例如，可用于制作增强器或太空建筑。
- [可点击项](clickables.md)：可购买项的一个更通用的变体，适用于任何有时可点击的东西。在这些和可购买项之间，你几乎可以做任何事情。
- [成就](achievements.md)：如何为层（或整个游戏）创建成就。

### 其他组件和功能

- [挑战](challenges.md)：如何为层创建挑战。
- [进度条](bars.md)：将一些信息显示为进度条、仪表或类似形式。它们高度可定制，也可以水平和垂直显示。
- [子标签页和微标签页](subtabs-and-microtabs.md)：为你的标签页创建子标签页，以及可以放在标签页内的“微标签页”组件。
                        你甚至可以使用它们将一个层嵌入到另一个层中！
- [网格](grids.md)：创建一组行为相同但拥有自己数据的按钮。非常适合地图瓦片、库存网格等！
- [信息框](infoboxes.md)：包含文本的框，可以显示或隐藏。
- [树](trees-and-tree-customization.md)：制作你自己的树。你也可以制作非层的按钮节点！
- [粒子系统](particles.md)：可用于创建视觉效果粒子，也可以用于可交互的东西，如黄金饼干或收藏品。