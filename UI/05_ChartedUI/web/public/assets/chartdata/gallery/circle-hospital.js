//数据
var data = {
    name: "基础数据资源",
    "children": [{
            "name": "基础信息数据量",
            "children": [{
                "name": "建档人数", //类型名称
                "size": 133, //总数
                "add": "11", //本月新增数
                "rate": "13%" //月增长率
            }, {
                "name": "妊娠期妇女管理数",
                "size": 44,
                "add": "11",
                "rate": "13%"
            }, {
                "name": "儿童管理数",
                "size": 24,
                "add": "11",
                "rate": "13%"
            }, {
                "name": "新生儿管理数",
                "size": 4,
                "add": "13",
                "rate": "13%"
            }, {
                "name": "老年人管理数",
                "size": 34,
                "add": "14",
                "rate": "13%"
            }],
            "size": 199,
            "add": "11",
            "rate": "13%"
        }, {
            "name": "健康档案数量",
            "children": [{
                "name": "健康档案管理数", //类型名称
                "size": 155, //总数
                "add": "11", //本月新增数
                "rate": "13%" //月增长率
            }, {
                "name": "门诊管理数",
                "size": 114,
                "add": "1",
                "rate": "13%"
            }, {
                "name": "住院管理数",
                "size": 84,
                "add": "1",
                "rate": "13%"
            }, {
                "name": "检验报告管理数",
                "size": 14,
                "add": "3",
                "rate": "13%"
            }, {
                "name": "检查报告管理数",
                "size": 15,
                "add": "4",
                "rate": "13%"
            }],
            "size": 300,
            "add": "11",
            "rate": "13%"
        },

        {
            "name": "家庭医生签约人数",
            "children": [{
                "name": "慢性病人管理数",
                "children": [{
                    "name": "精神病患者管理数", //类型名称
                    "size": 13, //总数
                    "add": "1", //本月新增数
                    "rate": "13%" //月增长率
                }, {
                    "name": "糖尿病患者管理数",
                    "size": 14,
                    "add": "1",
                    "rate": "13%"
                }, {
                    "name": "高血压患者管理数",
                    "size": 4,
                    "add": "3",
                    "rate": "13%"
                }, {
                    "name": "脑卒中患者管理数",
                    "size": 4,
                    "add": "3",
                    "rate": "13%"
                }, {
                    "name": "残疾患者管理数",
                    "size": 4,
                    "add": "4",
                    "rate": "13%"
                }],
                "size": 55,
                "add": "11",
                "rate": "13%"
            }, {
                "name": "家庭医生签约",
                "children": [{
                        "name": "糖尿病患者签约数", //类型名称
                        "size": 15, //总数
                        "add": "11", //本月新增数
                        "rate": "13%" //月增长率
                    }, {
                        "name": "精神病患者签约数",
                        "size": 4,
                        "add": "1",
                        "rate": "13%"
                    }, {
                        "name": "高血压患者签约数",
                        "size": 4,
                        "add": "1",
                        "rate": "13%"
                    }, {
                        "name": "脑卒中患者签约数",
                        "size": 4,
                        "add": "3",
                        "rate": "13%"
                    }

                ],
                "size": 44,
                "add": "11",
                "rate": "13%"
            }],
            "size": 77,
            "add": "11",
            "rate": "13%"
        }
    ]
};

//配色
var getFillColor = function(nodeName, isLeaf) {
    var fill = {};
    var baseArray = ["基础信息数据量", "建档人数", "妊娠期妇女管理数", "儿童管理数", "新生儿管理数", "老年人管理数"];
    var signArray = ["家庭医生签约人数", "慢性病人管理数", "家庭医生签约", "精神病患者管理数", "糖尿病患者管理数", "高血压患者管理数", "脑卒中患者管理数", "残疾患者管理数",
        "糖尿病患者签约数", "精神病患者签约数", "高血压患者签约数", "脑卒中患者签约数"
    ];
    var recordArray = ["健康档案数量", "健康档案管理数", "门诊管理数", "住院管理数", "检验报告管理数", "检查报告管理数"];
    if ($.inArray(nodeName, baseArray) != -1) {
        if (isLeaf) {
            fill.fillColor = {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [{
                        offset: 0,
                        color: "#626815" // 0% 处的颜色
                    },
                    /* {
                                               offset: 0.7, color: "#7b8013" // 100% 处的颜色
                                           },*/
                    {
                        offset: 1,
                        color: "#a9aa0e" // 100% 处的颜色
                    }
                ],
                globalCoord: false // 缺省为 false
            };
            fill.borderColor = "rgba(182, 184,30, 1)";
            fill.borderWidth = 2;

            fill.emphasisFillColor = {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [{
                    offset: 0,
                    color: "#a7ac0e" // 0% 处的颜色
                }, {
                    offset: 0.5,
                    color: "#babc0c" // 50% 处的颜色
                }, {
                    offset: 1,
                    color: "#f6f701" // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            };
            fill.emphasisBorderColor = "#f6f701";
            fill.emphasisborderWidth = 2;
        } else {
            fill.fillColor = "rgba(156,156,14,0.1)";
            fill.borderColor = "rgba(64,67,34,1)";
            fill.borderWidth = 1;
            fill.emphasisFillColor = "rgba(156,156,14,0.1)";
            fill.emphasisBorderColor = "rgba(64,67,34,1)";
            fill.emphasisborderWidth = 3;
        }
    } else if ($.inArray(nodeName, signArray) != -1) {
        if (isLeaf) {
            fill.fillColor = {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [{
                        offset: 0,
                        color: "#4e0435" // 0% 处的颜色
                    },
                    /* {
                                               offset: 0.5, color: "#730c50" // 100% 处的颜色
                                           },*/
                    {
                        offset: 1,
                        color: "#84085a" // 100% 处的颜色
                    }
                ],
                globalCoord: false // 缺省为 false
            };
            fill.borderColor = "rgba(154, 14, 109, 1)";
            fill.borderWidth = 2;
            fill.emphasisFillColor = {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [{
                    offset: 0,
                    color: "#ae0876" // 0% 处的颜色
                }, {
                    offset: 0.5,
                    color: "#cd0a8b" // 50% 处的颜色
                }, {
                    offset: 1,
                    color: "#f505a4" // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            };
            fill.emphasisBorderColor = "#f505a4";
            fill.emphasisborderWidth = 3;
        } else {
            fill.fillColor = "rgba(130, 10, 88, 0.18)";
            fill.borderColor = "rgba(77, 15, 75, 1)";
            fill.borderWidth = 1;
            fill.emphasisFillColor = "rgba(130, 10, 88, 0.18)";
            fill.emphasisBorderColor = "rgba(77, 15, 75, 1)";
            fill.emphasisborderWidth = 3;
        }
    } else {
        if (isLeaf) {
            fill.fillColor = {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [{
                    offset: 0,
                    color: "#034e61" // 0% 处的颜色
                }, {
                    offset: 0.7,
                    color: "#086b87" // 70% 处的颜色
                }, {
                    offset: 1,
                    color: "#068ca3" // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            };
            fill.borderColor = "#03a1b3";
            fill.borderWidth = 2;
            fill.emphasisFillColor = {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [{
                    offset: 0,
                    color: "#0a7998" // 0% 处的颜色
                }, {
                    offset: 0.7,
                    color: "#0b9ec8" //70% 处的颜色
                }, {
                    offset: 1,
                    color: "#09c2f6" // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            };
            fill.emphasisBorderColor = "#09c2f6";
            fill.emphasisborderWidth = 1;
        } else {
            fill.fillColor = "rgba(0, 252, 255, 0.1)";
            fill.borderColor = "rgba(11, 72, 115, 1)";
            fill.borderWidth = 1;
            fill.emphasisFillColor = "rgba(0, 252, 255, 0.1)";
            fill.emphasisBorderColor = "rgba(11, 72, 115, 1)";
            fill.emphasisborderWidth = 3;
        }
    }
    return fill;
};

//渲染函数
var renderItem = function(params, api) {
    var fillObj = getFillColor(api.value(2), api.value(9));
    var textPosition = "inside";
    if (!api.value(9)) {
        if (api.value(1) == 1) {
            if (api.value(6) > api.getWidth() / 2) {
                textPosition = "right";
            } else {
                textPosition = "left";
            }
        } else {
            textPosition = "top";
        }
    }
    return {
        type: "circle",
        shape: {
            cx: api.value(6),
            cy: api.value(7),
            r: api.value(8)
        },
        z2: api.value(1) * 2,
        style: api.style({
            stroke: fillObj.borderColor,
            fill: fillObj.fillColor,
            textPosition: textPosition,
            lineWidth: fillObj.borderWidth
                //text: nodeName,
                // textFont: textFont,
                // textDistance : itemLayout.r,
        }),
        styleEmphasis: api.style({
            textPosition: textPosition,
            stroke: fillObj.emphasisBorderColor,
            fill: fillObj.emphasisFillColor,
            lineWidth: fillObj.emphasisborderWidth
        })
    };
};

var root = d3.hierarchy(data)
    .sum(function(d) {
        return d.size;
    })
    .sort(function(a, b) {
        return b.value - a.value;
    });
d3.pack()
    .size([800 - 2, 480 - 2])
    .padding(0.5)(root);
var maxDepth = 0;
var nodeAll = root.descendants();
var nodes = nodeAll.filter(function(it) {
    return it.parent;
});

//获取各圆相关数据
var seriesData = nodes.map(function(node) {
    maxDepth = Math.max(maxDepth, node.depth);
    var color = "#ffffff";
    node.isLeaf = !node.children || !node.children.length;
    if (node.depth == 1) {
        switch (node.data.name) {
            case "家庭医生签约人数":
                color = "rgba(218, 22, 158, 1)";
                break;
            case "基础信息数据量":
                color = "rgba(156,156,14,1)";
                break;
            case "健康档案数量":
                color = "rgba(14, 149, 156, 1)";
                break;
        }
        return {
            value: [
                node.value,
                node.depth,
                node.data.name,
                node.data.size,
                node.data.add,
                node.data.rate,
                node.x,
                node.y,
                node.r,
                node.isLeaf
            ],
            label: {
                normal: {
                    show: true,
                    color: color,
                    formatter: function(params) {
                        return "{type|" + params.value[2] + "}\n{numAll|" + params.value[3] + "}\n{add|本月新增：" + params.value[4] + "}";
                    },
                    rich: {
                        type: {
                            fontSize: 14,
                            color: color
                        },
                        numAll: {
                            fontSize: 28,
                            padding: [5, 0, 5, 0],
                            color: color
                        },
                        add: {
                            fontSize: 14,
                            color: color
                        }
                    }
                }
            }
        }
    } else {
        if (node.data.name == "家庭医生签约" || node.data.name == "慢性病人管理数") {
            color = "rgba(222, 0, 155,1)";
        }
        return {
            value: [
                node.value,
                node.depth,
                node.data.name,
                node.data.size,
                node.data.add,
                node.data.rate,
                node.x,
                node.y,
                node.r,
                node.isLeaf
            ],
            label: {
                normal: {
                    show: true,
                    color: color,
                    position: "inside",
                    formatter: function(params) {
                        var result = "";
                        var nodeName = params.value[2];
                        if (params.value[9]) {
                            if (params.value[8] > 10) {
                                var trunText = echarts.format.truncateText(nodeName, 2 * params.value[8], {
                                    fontSize: 14,
                                    fontFamily: "微软雅黑"
                                }, '.');
                                if (trunText.indexOf(".") > 0) {
                                    var strindex1 = nodeName.indexOf("患者");
                                    var strindex2 = nodeName.indexOf("管理数");
                                    if (strindex1 > 0) {
                                        result += "{type|" + nodeName.substring(0, strindex1) + "}";
                                    } else {
                                        result += "{type|" + nodeName.substring(0, strindex2) + "}";
                                    }
                                } else {
                                    result += "{type|" + nodeName + "}";
                                }
                                if (params.value[8] > 45) {
                                    result += "\n{num|" + params.value[3] + "}";
                                }
                            }
                        } else {
                            result += "{type|" + params.value[2] + "}";
                        }
                        return result;
                    },
                    rich: {
                        type: {
                            fontSize: 12,
                            padding: [5, 0, 5, 0],
                            color: color
                        },
                        num: {
                            fontSize: 16,
                            color: color
                        }
                    }
                }
            }
        }
    }
});

//echarts 配置
option = {
    backgroundColor: "#0c1b3e",
    title: {
        text: "2017-10",
        textStyle: {
            color: "rgba(164, 159, 159, 0.21)",
            fontSize: 32,
            fontFamily: "微软雅黑",
            fontWeight: "normal"
        },
        right: 10,
        bottom: 10
    },
    xAxis: {
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: false
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: false
        },
        splitLine: {
            show: false
        }
    },
    tooltip: {
        backgroundColor: "rgba(50,50,50,0.95)",
        formatter: function(params) {
            var size = ("" + params.value[3]).replace(/\d{1,3}(?=(\d{3})+$)/g, "$&,");
            var add = ("" + params.value[4]).replace(/\d{1,3}(?=(\d{3})+$)/g, "$&,");
            var result = "<span>" + params.value[2] + "</span><br>" +
                "<span style = 'line-height:30px;font-size : 25px; font-weight:bold;'>" + size + "</span></br>" +
                "<div>" +
                "<div style = 'float : left; padding-right:20px; border-right: solid 1px #4c4a4a;'>" +
                "<span >本月新增</span></br>" +
                "<span style = 'color : red; '>" + add + "</span>" +
                "</div>" +
                "<div style = 'float : right; margin-left:20px;'>" +
                "<span style = 'width : 100px;'>月增长率</span></br>";
            if (params.value[5] > 0) {
                result += "<span style = 'color : red;  width : 100px;'>+" + params.value[5] + "</span>"
            } else {
                result += "<span style = 'color : red;  width : 100px;'>" + params.value[5] + "</span>"
            }
            result += "</div>" +
                "</div>";
            return result;
        }
    },
    series: {
        type: "custom",
        renderItem: renderItem,
        data: seriesData
    }
};