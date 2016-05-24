# wedmapp



### 5月24日晚上更

----------
* 手动速度和加工速度修改，目前是修改了toggle和相应函数，但是没有添加Jason文件固定档位，留待以后开发
* 获取当前的速度类型以及速度档位存在疑问，以后检查，一定要重新检查，嗯。
* 添加上了找边功能,测试好使，但是在内分速度处有疑问。


### 5月22日下午更

----------
* 动画思路为获取坐标，不断画直线，问题是如何搞好比例。现在直接moveto（0，0），以后就是现在监听到跳转加工以后，moveto这个点然后画直线。
* 测试使用手动，可以实时显示动画图形。



### 5月19日下午更

----------
* 调整脉宽占空比输入界面，使用$ionicPopup
* 画图模块与打开文件的结合，可以实现点进文件显示图形


### 5月18日下午更

----------
#### 实现打开文件编辑
* **功能**。实现任意编辑、清空、重置（恢复）和保存功能。
* **接口**。提供用于画图的数据接口，详见`fileModalCtrl.js`。
* **其他**。顺手美化了下加工界面的footbar。

### 5月16日晚上更

----------
#### 完美解决文件导入（文件列表同步更新）问题
* **思路**。`ngCordova-File`插件提供路径，`HTML5 FileSystem API- DirectoryReader.readEntries()`提供方法。
* **测试**。用电脑在`aWEDM/files/`路径下删除三个初始化文件，并拷贝进去100个3b空文件。点击『悬浮按钮-同步』，文件列表刹那间（O(∩_∩)O哈哈~）完成同步；`aWEDM/data/`下的JSON文件数据也同步更新，退出后重新进入列表仍在。

### 5月16日更

----------
* 测试页面添加关于3B代码操作，包括文件的显示，与图形的显示
* 正在考虑是否去掉jshl与operat，目测在3B代码中没有用到
* 开始、暂停、停止按钮按钮设置成了footerbar，页面滑动一直可见，方便操作

### 5月15日下午更

----------
* 修改文件模块初始化提示，由hold to rename file改为hold for more operations
* 修改文件模块悬浮按钮颜色，由暗红色改为浅蓝色
* 修改文件模块hold操作调出的Action Sheet样式，由山寨的IOS范改为清新的Android风
* 修改准备模块UI细节,由坐标Position改为机械坐标，点动按钮加了个框
* 修改侧边栏，将设置按钮齿轮放在左边，bar改为calm浅蓝色，侧边栏选项添加图标并紧凑排列

### 5月14日晚上更

----------
* 添加文件模块
* 修改一些细节问题

----------

###.5.10
----------

* 修改了准备页面的一些变量、toggle；完善了加工速度与手动速度；


* 删除了关于buffer的备注的函数，否则影响阅读体验；


* 准备、加工页面的完善与函数编写，包括内部速度、外部速度、解锁、上丝、运丝、电流大小设置、运丝速度设置、PWM等函数。


* IO设置已经完成，仿照师兄通过位操作；


* 开始、暂停、停止按钮未编写函数？？？？？


###2016.5.9
----------
####主页的修改
连接状态；
机床的加工状态，加工时候显示加工进度        （未完成,还不知道添加什么）
机床io状态（加工状态时候io无法设置）；
将test中的一些东西挪到了home中

####准备页面的完善
加工时候，是无法切换到当前页的。    （尚未解决）
此处包括了手动操作，手动速度设置，可能的io设置，机床对边，机床回零等操作 ；这一部分将test中的部分代码移动到了prepare中


####加工页面的建设
显示当前文件的内容或者图形，
加工参数的设置，包括脉宽、占空比、电流、丝速、速度(未完成)
暂停/开始按钮，停止按钮，加工进度
添加了PWM{'cmd': 'setPWM', ratio: ratio, pulseWidth: pulseWidth}，但是不知道ratio, pulseWidth各是什么样的数据类型？？？

####IP
计划将IP设置页面转移到侧边栏的页面下，现在可以将tabs中的settings删掉即可，其他已经设置好

####其他
双向数据绑定出现问题，两个页面使用的$rootScope定义的变量，一个页面更新，另一个不更新(已解决)
使用全局变量时，在HTML中需要使用$root.var才可以使用。


明日编写设置电流丝速等，查阅通过位设置相应的功能


###2016.5.8
----------
* 在script的注入中删掉了 'btford.socket-io'

* 在variables.js中添加level等变量

* 获取io状态{'cmd': 'getIOState'}完善
电流、运丝速度改

* 获取当前的速度类型以及速度档位{'cmd': 'getSelDiv'}编写

* 明天编写设置PWM{'cmd': 'setPWM', ratio: ratio, pulseWidth: pulseWidth}
