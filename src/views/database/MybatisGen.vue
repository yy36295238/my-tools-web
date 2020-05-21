<template>
  <div>
    <div style="margin:0 auto;padding:50px;">
      <h1 style="margin-left:16px;">代码生成</h1>
      <Row :gutter="32" style="padding:20px;margin-top:20px;">
        <Col span="8">
        作者
        <Input type="text" size="large" v-model="author" placeholder="author" clearable />
        </Col>
        <Col span="8">
        包名
        <Input type="text" v-model="packages" size="large" placeholder="package" clearable/>
        </Col>
        <Col span="8">
        表前缀
        <Input type="text" v-model="prefix" size="large" placeholder="prefix" clearable/>
        </Col>
      </Row>
      <Row :gutter="32" style="padding:20px;">
        <Col span="24">
        建表语句
        <Input v-model="ddl" type="textarea" :autosize="{ minRows: 8, maxRows: 50 }" placeholder="ddl" clearable/>
        </Col>
      </Row>
      <Button style="margin-left:20px;width:100px;" type="primary" @click="gen">确定</Button>

      <Divider dashed />

      <Row :gutter="16" style="padding:20px;margin-top:20px;">
        <Col span="4">
        <Anchor show-ink>
          <AnchorLink v-for="(item, index) in dataList" :key="index" :href="'#' + item.className" :title="item.className" />
        </Anchor>
        </Col>
        <Col span="20">
        <div v-for="(item, index) in dataList" :key="index">
          <h1 :id="item.className">{{ item.className }}</h1>
          <pre>
      <div style="padding:10px"  contenteditable="true" :autosize="true"  >{{item.classInfo}}</div>
      </pre>
        </div>
        </Col>
      </Row>
    </div>

    <BackTop></BackTop>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      url: "http://localhost:7070",
      dataList: [],
      author: "tom",
      packages: "com.company.example",
      prefix: "t_",
      enableSwagger: true,
      ddl:
        `CREATE TABLE t_poets (
          id int(11) NOT NULL AUTO_INCREMENT,
          name varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '作者姓名',
          created_at datetime DEFAULT NULL COMMENT '创建日期',
          updated_at datetime DEFAULT NULL COMMENT '修改日期',
          PRIMARY KEY (id)
        ) ENGINE = InnoDB AUTO_INCREMENT = 2529 CHARSET = utf8 COLLATE utf8_unicode_ci;`
    };
  },
  mounted() {},
  methods: {
    gen() {
      this.dataList = [];
      const data = {
        author: this.author,
        ddl: this.ddl,
        enableSwagger: true,
        packages: this.packages,
        prefix: this.prefix
      };
      this.axios.post(this.url + "/database/gen", data).then(res => {
        this.dataList = res.data.data;
      });
    },
  }
};
</script>
