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
                <RadioGroup v-model="dialect" type="button" @on-change="databaseTypeChange">
                    <Radio label="MySQL"></Radio>
                    <Radio label="PostgreSQL"></Radio>
                </RadioGroup>
                <Alert v-show="dialect == 'PostgreSQL'" type="warning" show-icon class="top20">
                    索引格式
                    <span slot="desc">
                        CREATE INDEX "idx_name_status" ON "public"."t_user" USING btree ("name","status");
                    </span>
                </Alert>
                <Upload class="top20" type="drag" :action="uploadUrl" :data="uploadData" :show-upload-list="false" :on-success="handleSuccess" :before-upload="beforeUpload">
                    <div style="padding: 30px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或拖拽上传SQL文件</p>
                    </div>
                </Upload>

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
                            <h3 :id="item.tableName">{{tableName(item)}}</h3>
                            <Table class="top20" :columns="getColumnInfos()" :data="item.columnInfos"></Table>
                            <h3 class="top20">索引</h3>
                            <Table class="top20" :columns="getIndexInfos()" :data="item.indexInfos"></Table>
                        </div>
                    </div>
                    </Col>
                </Row>
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
            uploadUrl: this.baseURL + "/database/info",
            uploadData: {},
            dialect: "MySQL",
            columnInfos: [],
            indexInfos: [],
            dataList: [],
        };
    },
    mounted() { },
    methods: {
        databaseTypeChange(val) {
            this.dataList = [];
        },
        beforeUpload() {
            this.dataList = [];
            this.uploadData = {
                dialect: this.dialect.toLowerCase()
            }
            let promise = new Promise((resolve) => {
                this.$nextTick(function () {
                    resolve(true);
                });
            });
            return promise; //通过返回一个promis对象解决

        },
        handleSuccess(res, file, fileList) {
            if (res.code != 200) {
                this.$Notice.error({
                    title: res.message,
                });
                return;
            }
            this.dataList = res.data;
        },
        tableName(item) {
            return item.tableDesc ? (item.tableName + " - " + item.tableDesc) : item.tableName;
        },
        getColumnInfos() {
            return [
                {
                    title: '名称',
                    key: 'name',
                },
                {
                    title: '类型',
                    key: 'type',
                },
                {
                    title: '长度',
                    key: 'length',
                },
                {
                    title: '不为空',
                    key: 'notNull'
                },
                {
                    title: '默认值',
                    key: 'defaultVal'
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
                    title: '索引值',
                    key: 'using'
                },
                {
                    title: '索引列',
                    key: 'indexes'
                },
                {
                    title: '备注',
                    key: 'comment'
                },
            ]
        }
    },
};



</script>
