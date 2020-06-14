<style scoped>
.card {
    cursor: pointer;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    text-align: center;
    transition: all 0.25s;
}
.card:hover {
    margin-top: -10px;
    box-shadow: 5px 8px 5px #778899;
}
.header {
    margin: 0 auto;
    padding: 40px;
    border-radius: 2px;
}
.cl0 {
    /* background-image: linear-gradient(to top, #dfe9f3 0%, white 100%); */
    background: #ffffff;
}
.cl1 {
    background-image: linear-gradient(45deg, #f43f3b 0%, #ec008c 100%);
}
.cl2 {
    background-image: linear-gradient(45deg, #0081ff 0%, #1cbbb4 100%);
}
.cl3 {
    background-image: linear-gradient(45deg, #ff9700 0%, #ed1c24 100%);
}
.cl4 {
    background-image: linear-gradient(45deg, #39b54a 0%, #8dc63f 100%);
}
.cl5 {
    background-image: linear-gradient(45deg, #9000ff 0%, #5e00ff 100%);
}
.cl6 {
    background-image: linear-gradient(45deg, #ec008c 0%, #6739b6 100%);
}
</style>
<template>
    <div style="padding:100px; height:100%" class="cl0">
        <Row :gutter="60">
            <Col span="6">
            <Card :padding="4" :bordered="false" class="card " to="/mybatisGen">
                <div>
                    <div class="header cl2">
                        <a style="text-decoration:none;font-size: 24px;color: #fff;">Kot-代码生成器</a>
                    </div>
                </div>
            </Card>
            </Col>
            <Col span="6">
            <Card :padding="4" :bordered="false" class="card" to="/databaseInfo">
                <div>
                    <div class="header cl3" @click="later()">
                        <a style="text-decoration:none;font-size: 24px;color: #fff;">数据库字典</a>
                    </div>
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {};
    },
    mounted() { },
    methods: {
        later() {
            // this.$Message.warning({
            //     background: true,
            //     content: "敬请期待"
            // });
        }
    }
};
</script>
