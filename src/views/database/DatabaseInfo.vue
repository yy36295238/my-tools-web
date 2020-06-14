<style scoped>
</style>
<template>
    <div class="content">
        <Row :gutter="32">
            <Col span="12">
            <h1>
                数据库信息
            </h1>
            </Col>
            <Col span="12" style="text-align:right">
            <Button class="width100" type="dashed" to="/">返回</Button>
            </Col>
        </Row>
        <Divider dashed />
        <div>
            <div>
                <Upload multiple type="drag" action="http://localhost:9999/database/info" :show-upload-list="false" :on-success="handleSuccess">
                    <div style="padding: 30px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或拖拽上传SQL文件</p>
                    </div>
                </Upload>

                <!-- <Row :gutter="32" class="top20">
                    <Col span="8">
                    地址
                    <Input type="text" size="large" v-model="host" placeholder="host" clearable />
                    </Col>
                    <Col span="8">
                    端口
                    <Input type="text" v-model="port" size="large" placeholder="port" clearable />
                    </Col>
                    <Col span="8">
                    数据库名称
                    <Input type="text" v-model="database" size="large" placeholder="database" clearable />
                    </Col>
                </Row> -->

                <!-- 左侧目录 -->
                <Row :gutter="16" class="top20">
                    <Col span="4">
                    <Anchor class="top20" show-ink :offset-top="40">
                        <AnchorLink :scroll-offset="-200" v-for="(item, index) in dataList" :key="index" :href="'#' + item.tableName" :title="item.tableName" />
                    </Anchor>
                    </Col>
                    <Col span="20">
                    <div v-for="(item, index) in dataList" :key="index">
                        <div class="shadow-hover padding20 dashed-border top20">
                            <h3 :id="item.tableName">{{item.tableName}}</h3>
                            <Table class="top20" :columns="getColumnInfos()" :data="item.columnInfos"></Table>
                            <h3 class="top20">索引</h3>
                            <Table class="top20" :columns="getIndexInfos()" :data="item.indexInfos"></Table>
                        </div>
                    </div>
                    </Col>
                </Row>

                <br>
                <br>

            </div>
            <BackTop> </BackTop>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            host: "localhost",
            port: "3306",
            database: "user",
            columnInfos: [],
            indexInfos: [],
            dataList: [],
        };
    },
    mounted() { },
    methods: {
        handleSuccess(res, file, fileList) {
            this.dataList = res.data;
        },
        getColumnInfos() {
            return [
                {
                    title: '名称',
                    key: 'name',
                    width: 200,
                },
                {
                    title: '类型',
                    key: 'type',
                    width: 150,
                },
                {
                    title: '长度',
                    key: 'length',
                    width: 150,
                },
                {
                    title: '其他',
                    key: 'other'
                },
                {
                    title: '备注',
                    key: 'comment'
                },
            ]
        },
        getIndexInfos() {
            return [
                {
                    title: '名称',
                    key: 'key'
                },
                {
                    title: '类型',
                    key: 'type'
                },
                {
                    title: '索引列',
                    key: 'content'
                },
            ]
        }
    },
};



</script>
