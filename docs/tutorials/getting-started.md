# 入门指南

欢迎来到模组树！

在最简单的层面上，使用模组树只需将其副本下载到你的电脑上。然而，如果方法得当，它将带来诸多便利。

别让“Github”这个词吓到你。实际上，它比大多数人想象的要容易得多，尤其是因为大多数人用了复杂的方式。关键在于Github Desktop，它能让你完成所有必要操作，甚至无需接触命令行。

使用Github的好处：

- 它能让你更轻松地更新模组树。
- 你可以通过githack毫不费力地分享你的作品，或者稍加努力，搭建一个github.io站点。
- 它能让你撤销代码更改，并保留多个版本。
- 如果你想，它还能让你与他人协作。

## 使用Github Desktop、Visual Studio Code和模组树进行设置：

1. 安装[Github Desktop](https://desktop.github.com/)和[Visual Studio Code](https://code.visualstudio.com/)。

2. 创建一个Github账户。你可以自行处理。

3. 在浏览器中登录，然后返回[模组树页面](https://github.com/Acamaeda/The-Modding-Tree)。右上角应有一个写着“fork”的按钮。点击它，然后选择你的用户名。现在你拥有了自己的模组树分支，即副本。

4. 打开Github Desktop并登录。忽略其他一切，选择“clone a repository”（克隆仓库）。“仓库”基本上就是一个“Github项目”，比如模组树。“克隆”就是将仓库的副本下载到你的电脑上。

5. 在仓库列表中找到模组树（它应该是唯一的一个），然后点击“clone”（克隆）。

6. 选择你将其用于个人目的，然后点击“continue”（继续）。它将下载文件并处理一切。

### 使用你的仓库

1. 点击右侧的“show in explorer/finder”（在资源管理器中显示），然后打开文件夹中的index.html文件。页面应在你的浏览器中打开。这将让你在本地查看和测试你的项目！

2. 要编辑你的项目，请在Github Desktop中点击“open in VSCode”（在VSCode中打开）。

3. 在VSCode中打开[mod.js](/js/mod.js)，查看顶部包含“modInfo”对象的部分。将你的模组名称填写为你想要的任何内容，并更改id。（它可以是任何字符串值，用于确定存档位置。请设置一个可能唯一的名称，之后不要再更改，否则会有效清除现有存档。）

4. 保存[mod.js](/js/mod.js)，然后在浏览器中重新加载[index.html](/index.html)。标签页标题以及信息页面上的标题现在都会更新！**每次更改代码后，你都可以重新加载页面以快速便捷地测试。**

5. 返回Github Desktop。是时候通过进行“commit”（提交）将你的更改保存到git系统中了。这基本上会保存你的工作并创建当前代码状态的快照，以便日后回顾。

6. 在右下角，添加更改摘要，然后点击“commit to master”（提交到主分支）。

7. 最后，在顶部中间点击“push origin”（推送到远程），将你的更改推送到在线仓库。

8. 你可以通过访问https://raw.githack.com/[你的GITHUB用户名]/The-Modding-Tree/master/index.html在线查看你的项目，或与他人分享。**你无需为此在本地测试你的模组。**

现在，你已经成功使用了Github！你可以查看关于[制作模组](making-a-mod.md)的下一个教程，或查阅[文档](/documentation/!general-info.md)以了解模组树系统的运作方式，并实现你的模组构想。