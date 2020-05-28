<template>
  <div>
    <div style="margin:0 auto;padding:50px;">
      <Row :gutter="32">
        <Col span="12">
        <h1 style="margin-left:16px;">代码生成</h1>
        </Col>
        <Col span="12" style="text-align:right">
        <Button style="width:100px;margin-right:16px;" type="dashed" to="/">返回</Button>
        </Col>
      </Row>
      <Row :gutter="32" style="padding:20px;margin-top:20px;">
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
      <Row style="padding:20px;" :gutter="10">
        <Col span="24">
        建表语句
        <div v-for="(item, index) in ddlList" :key="index" style="margin-top:10px">
          <div style="position: relative;left: -10px;top: 12px;z-index:1000">
            <Poptip transfer confirm title="确认删除?" @on-ok="removeDdl(index)">
              <Icon type="md-close-circle" size="20" color="red" />
            </Poptip>
          </div>
          <Input v-model="item.val" type="textarea" :autosize="{ minRows: 8, maxRows: 50 }" placeholder="ddl" clearable />
        </div>
        </Col>
      </Row>
      <Button style="margin-left:20px;width:100px;" type="success" @click="addDdl()">添加</Button>
      <Button style="margin-left:20px;width:100px;" type="primary" @click="gen">生成</Button>
      <Button v-show="isDownload" style="margin-left:20px;width:100px;" type="dashed" @click="download">下载</Button>

      <Divider dashed />

      <!-- 左侧目录 -->
      <Row :gutter="16" style="padding:20px;margin-top:20px;">
        <Col span="4">
        <Anchor show-ink :offset-top="20">
          <AnchorLink :scroll-offset="-500" v-for="(item, index) in dataList" :key="index" :href="'#' + item.className" :title="item.className" />
        </Anchor>
        </Col>
        <Col span="20">
        <div v-highlight v-for="(item, index) in dataList" :key="index">
          <h1 :id="item.className">
            {{ item.className }}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Icon style="cursor:pointer" type="md-copy" color="#c5c8ce" @click="copy(item.classInfo, $event)" title="复制" />
          </h1>

          <div style="margin-top:-50px;margin-left:-32px">
            <pre>
            <code class="css"><!-- 声明什么类型的代码 -->
                 <div style="padding-left:25px"  contenteditable="false" :autosize="true"  >{{item.classInfo}}</div>
            </code>
      </pre>
          </div>
        </div>
        </Col>
      </Row>
    </div>

    <BackTop></BackTop>
  </div>
</template>

<script>
import clip from "@/utils/clipboard";
export default {
  components: {},
  data() {
    return {
      isDownload: false,
      url: "http://localhost:7070",
      dataList: [],
      author: "tom",
      packages: "com.company.example",
      prefix: "t_",
      enableSwagger: true,
      ddlList: [
        {
          val: `CREATE TABLE t_user (
          id bigint(20) NOT NULL AUTO_INCREMENT,
          name varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '作者姓名',
          create_time datetime DEFAULT NULL COMMENT '创建日期',
          update_time datetime DEFAULT NULL COMMENT '修改日期',
          PRIMARY KEY (id)
        ) ENGINE = InnoDB AUTO_INCREMENT = 2529 CHARSET = utf8 COLLATE utf8_unicode_ci;`
        }
      ],
      zipName: ""
    };
  },
  mounted() {},
  methods: {
    addDdl() {
      this.ddlList.push({ val: "" });
    },
    removeDdl(index) {
      this.ddlList.splice(index, 1);
    },
    gen() {
      this.dataList = [];
      this.axios.post(this.url + "/database/gen", this.param()).then(res => {
        this.isDownload = true;
        this.dataList = res.data.data.classInfoList;
        this.zipName = res.data.data.zipName;
      });
    },
    download() {
      this.axios
        .post(this.url + "/database/download", this.param(), {
          responseType: "blob"
        })
        .then(res => {
          let fileName = res.headers["file-name"];
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
        });
    },
    param() {
      return {
        author: this.author,
        ddlList: this.ddlList.map(item => {
          return item.val;
        }),
        enableSwagger: true,
        packages: this.packages,
        prefix: this.prefix,
        zipName: this.zipName
      };
    },
    copy(text, event) {
      clip(text, event);
      console.log("clicp");
      this.$Message.success("复制成功");
    }
  }
};
</script>
