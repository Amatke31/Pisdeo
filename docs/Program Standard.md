程序保存形式为.json 文件

```javascript
// 以Website解决方案(org.pisdeo.website)为模版
const program = {
    name: "WebApp", //项目名
    author: "Amatke31", //项目所有人/组织,
    type: "website", //项目类型
    mainfile: "index.html", //主文件
    files: { //项目文件
        "index.html": //文件名
        {
            //一个对象代表一个元素
            element: "body",
            class: "dark", //附加属性
            children: [ //子元素
                {
                    element: "div",
                    class: "menu-bar",
                    children: [
                        ...
                    ]
                },
                {
                    element: "style",
                    css: [ //style以css录入
                        {
                            "class": "*", //类名
                            "content": [ //内容
                                {
                                    "label": "margin", //标签
                                    "value": "0" //值
                                },
                                {
                                    "label": "padding",
                                    "value": "0"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        "other/work.html": //保留路径
        {
            ...
        }
    }
}
```
