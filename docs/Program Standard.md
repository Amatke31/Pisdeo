程序保存形式为.json 文件

```javascript
let program = {
    name: "WebApp", //项目名
    author: "Amatke31", //项目所有人/组织,
    file: {
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
