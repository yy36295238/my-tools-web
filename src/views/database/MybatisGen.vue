<style scoped>
pre {
    display: block;
    font-family: monospace;
    white-space: pre;
    margin: 0px;
    margin-top: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
    margin-left: 0px;
}
.hljs {
    display: inline;
    overflow-x: auto;
    padding: 0px;
    color: #383a42;
    background: #ffffff;
}
</style>
<template>
    <div class="content">
        <Row :gutter="32">
            <Col span="12">
            <h1>
                代码生成
            </h1>
            </Col>
            <Col span="12" style="text-align:right">
            <Button class="width100" type="dashed" to="/">返回</Button>
            </Col>
        </Row>
        <Divider dashed />
        <div>
            <Row :gutter="20">
                <Col span="4">
                <RadioGroup v-model="dialect" type="button" @on-change="databaseTypeChange">
                    <Radio label="MySQL"></Radio>
                    <Radio label="PostgreSQL"></Radio>
                </RadioGroup>
                </Col>
                <Col span="5">
                <RadioGroup v-model="showType" type="button">
                    <Radio label="Config"></Radio>
                    <Radio label="ResponseResult"></Radio>
                </RadioGroup>
                </Col>
                <Col span="4">
                开启Swagger &nbsp;&nbsp;&nbsp;&nbsp;
                <i-switch v-model="enableSwagger" size="large">
                    <span slot="open">On</span>
                    <span slot="close">Off</span>
                </i-switch>
                </Col>
            </Row>

            <div v-show="showType=='Config'">
                <Row :gutter="32" class="top20">
                    <Col span="8">
                    作者
                    <Input type="text" size="large" v-model="author" placeholder="author" clearable />
                    </Col>
                    <Col span="8">
                    包名
                    <Input type="text" v-model="packages" size="large" placeholder="package" clearable />
                    </Col>
                    <Col span="8">
                    表前缀
                    <Input type="text" v-model="prefix" size="large" placeholder="prefix" clearable />
                    </Col>
                </Row>
                <Row class="top20" :gutter="10">
                    <Col span="24">
                    建表语句
                    <div v-for="(item, index) in ddlList" :key="index" style="margin-top:0px">
                        <div class="floatLeftTop circle shadow pointer">
                            <Poptip transfer confirm title="确认删除?" @on-ok="removeDdl(index)">
                                <Icon type="md-close-circle" size="20" color="red" />
                            </Poptip>
                        </div>
                        <Input v-model="item.val" type="textarea" :autosize="{ minRows: 4, maxRows: 50 }" placeholder="ddl" clearable />
                    </div>
                    </Col>
                </Row>

                <div class="top20">
                    <Button class="width100" type="success" @click="addDdl()">添加</Button>
                    <Button class="width100 left10" type="primary" @click="gen">生成</Button>
                    <Button class="width100 left10" type="dashed" @click="download" v-show="isDownload">下载</Button>
                </div>

                <Divider dashed />

                <!-- 左侧目录 -->
                <Row :gutter="16" class="top20">
                    <Col span="4">
                    <Anchor show-ink :offset-top="20">
                        <AnchorLink :scroll-offset="-800" v-for="(value,key,index) in resData.classModelMap" :key="index" :href="'#L1' + key" :title="key">
                            <AnchorLink :scroll-offset="-800" v-for="(item, index) in value" :key="index" :href="'#' + item.className" :title="item.className">
                            </AnchorLink>
                        </AnchorLink>
                    </Anchor>
                    </Col>
                    <Col span="20">
                    <div v-highlight v-for="(item, index) in dataList" :key="index">
                        <h1 :id="item.className"> {{ item.className }}
                            <Icon class="pointer" type="md-copy" color="#c5c8ce" @click="copy(item.classInfo, $event)" title="复制" />
                        </h1>
                        <div style="margin-top:-20px;margin-left:0px">
                            <pre>
                                    <code :class="codeStyle(item.lang)"><!-- 声明什么类型的代码 -->
                                        <div>{{item.classInfo}}</div>
                                    </code>
                                </pre>
                        </div>
                    </div>
                    </Col>
                </Row>
            </div>
            <div v-show="showType=='ResponseResult'">
                <!-- 左侧目录 -->
                <Row :gutter="16" class="top20">
                    <Col span="4">
                    <Anchor show-ink :offset-top="20">
                        <AnchorLink :scroll-offset="0" v-for="(item, index) in resDataList" :key="index" :href="'#' + item.className" :title="item.className">
                        </AnchorLink>
                    </Anchor>
                    </Col>
                    <Col span="20">
                    <div v-highlight v-for="(item, index) in resDataList" :key="index">
                        <h1 :id="item.className"> {{ item.className }}
                            <Icon style="cursor:pointer;" type="md-copy" color="#c5c8ce" @click="copy(item.classInfo, $event)" title="复制" />
                        </h1>
                        <div>
                            <pre>
                                <code class="java"><!-- 声明什么类型的代码 -->
                                    <div>{{item.classInfo}}</div>
                                </code>
                            </pre>
                        </div>
                    </div>
                    </Col>
                </Row>
            </div>
        </div>
        <BackTop> </BackTop>
    </div>
</template>

<script>
import clip from '@/utils/clipboard';
export default {
    components: {},
    data() {
        return {
            showType: "Config",
            dialect: "MySQL",
            isDownload: false,
            resData: {},
            dataList: [],
            resDataList: this.resList(),
            author: 'tom',
            packages: 'com.company.example',
            prefix: 't_',
            enableSwagger: true,
            ddlList: [
                mysqlSql(),
            ],
            zipName: '',
        };
    },
    mounted() { },
    methods: {
        databaseTypeChange(val) {
            this.ddlList = [];
            this.dataList = [];
            this.resData = {};
            if (val == "MySQL") {
                this.ddlList.push(mysqlSql());
            } else {
                this.ddlList.push(postgreSql());
            }
        },
        codeStyle(lang) {
            return lang == "vue" ? "xml" : "java";
        },
        addDdl() {
            let uuid = this.tools.uuid()
            this.ddlList.push({
                val: '',
            });
        },
        removeDdl(index) {
            this.ddlList.splice(index, 1);
        },
        gen() {
            this.dataList = [];
            this.axios.post('/database/gen', this.param()).then((res) => {
                this.isDownload = true;
                this.resData = res.data.data;
                this.dataList = res.data.data.classInfoList;
                this.zipName = res.data.data.zipName;
            });
        },
        download() {
            this.axios
                .post('/database/download', this.param(), {
                    responseType: 'blob',
                })
                .then((res) => {
                    let fileName = res.headers['file-name'];
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                });
        },
        param() {
            return {
                dialect: this.dialect.toLowerCase(),
                author: this.author,
                ddlList: this.ddlList.map((item) => {
                    return item.val;
                }),
                enableSwagger: this.enableSwagger,
                packages: this.packages,
                prefix: this.prefix,
                zipName: this.zipName,
            };
        },
        copy(text, event) {
            clip(text, event);
            console.log('clicp');
            this.$Message.success('复制成功');
        },
        resList() {
            return [
                { "className": "ResponseResult", "classInfo": ResponseResult },
                { "className": "ResultEnum", "classInfo": ResultEnum },
            ]
        }
    },
};

function mysqlSql() {
    var str = "";
    str += "CREATE TABLE `customer` (\n";
    str += "    ``id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',\n";
    str += "    `name` varchar(255) NOT NULL COMMENT '名称',\n";
    str += "    `amount` double DEFAULT NULL COMMENT '金额',\n";
    str += "    `text` text COMMENT '文本',\n";
    str += "    `status` smallint(6) NOT NULL DEFAULT '1' COMMENT '状态',\n";
    str += "    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n";
    str += "    PRIMARY KEY (`id`),\n";
    str += "    UNIQUE KEY `unq_name` (`name`) USING BTREE COMMENT '名称唯一索引',\n";
    str += "    KEY `idx_status` (`status`) USING BTREE COMMENT '状态索引',\n";
    str += "    KEY `idx_name_createTime` (`name`,`create_time`) USING BTREE COMMENT '名称_时间'\n";
    str += ") ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='客户表';";
    return {
        val: str
    };
}

function postgreSql() {
    var str = "";
    str += "CREATE TABLE \"public\".\"t_user\" (\n";
    str += "    \"id\" int8 NOT NULL DEFAULT nextval('t_user_id_seq'::regclass),\n";
    str += "    \"name\" varchar(255) COLLATE \"default\" NOT NULL,\n";
    str += "    \"age\" int4,\n";
    str += "    \"create_time\" timestamp(6) NOT NULL,\n";
    str += "    \"remark\" varchar(10) COLLATE \"default\",\n";
    str += "    \"status\" int2 NOT NULL DEFAULT 1,\n";
    str += "    \"user_id\" int4 NOT NULL\n";
    str += ")\n";
    str += ";\n";
    str += "COMMENT ON COLUMN \"public\".\"t_user\".\"id\" IS '主键';\n";
    str += "COMMENT ON COLUMN \"public\".\"t_user\".\"name\" IS '姓名';\n";
    str += "COMMENT ON COLUMN \"public\".\"t_user\".\"age\" IS '年龄';\n";
    str += "COMMENT ON COLUMN \"public\".\"t_user\".\"create_time\" IS '创建时间';\n";
    str += "COMMENT ON COLUMN \"public\".\"t_user\".\"remark\" IS '备注';\n";
    str += "COMMENT ON COLUMN \"public\".\"t_user\".\"status\" IS '状态';\n";
    str += "COMMENT ON COLUMN \"public\".\"t_user\".\"user_id\" IS '用户ID';\n";
    str += "COMMENT ON TABLE \"public\".\"t_user\" IS '用户表';\n";
    str += "ALTER TABLE \"public\".\"t_user\" ADD CONSTRAINT \"uiq_user_id\" UNIQUE (\"user_id\");\n";
    str += "ALTER TABLE \"public\".\"t_user\" ADD CONSTRAINT \"t_user_pkey\" PRIMARY KEY (\"id\");";
    return {
        val: str
    };

}

const ResponseResult = `package com.yyself.tool.utils;


import com.yyself.tool.common.ResultEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author yangyu
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseResult {

    private Integer code;
    private String message;
    private Object data;
    private Long cost;


    public static ResponseResult ok(Object data) {
        return new ResponseResult().success(data);
    }

    public static ResponseResult ok() {
        return new ResponseResult().success();
    }

    public static ResponseResult err(ResultEnum resultEnum) {
        return new ResponseResult().error(resultEnum);
    }

    public static ResponseResult err(ResultEnum resultEnum, String msg) {
        return new ResponseResult(resultEnum.code, resultEnum.message + msg);
    }

    public ResponseResult success(Object data) {
        this.code = ResultEnum.SUCCESS.code;
        this.message = ResultEnum.SUCCESS.message;
        this.data = data;
        return this;
    }

    public ResponseResult error(ResultEnum resultEnum) {
        this.code = resultEnum.code;
        this.message = resultEnum.message;
        return this;
    }

    public ResponseResult success() {
        this.success(null);
        return this;
    }

    public ResponseResult(ResultEnum resultEnum) {
        this.code = resultEnum.code;
        this.message = resultEnum.message;
    }

    public ResponseResult(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
`;

const ResultEnum = `package com.yyself.tool.common;

/**
 * @author YangYu
 */

public enum ResultEnum {
    //结果枚举值
    SUCCESS(200, "成功"),

    SYS_ERR(500, "系统错误");

    public Integer code;
    public String message;

    ResultEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
`;

</script>
