let productModal = null;
let delProductModal = null;
const vm = Vue.createApp({
    data() {
        return {
            // 產品資料格式
            products: [
                
            ],
            tempProduct: {
                imagesUrl: [],
            },
            // 判斷是新增還是修改產品
            isNew:false,
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            path: 'coldplay',
        }
    },
    methods: {
        checkLogin() {
            //確認是否登入
            // this.apiUrl要加上，不然沒有cookie的時候，不會導向登入頁面
            axios.post(`${this.apiUrl}/api/user/check`)
                .then((res) => {
                    console.log(res.data);
                    this.getData();
                }).catch((err) => {
                    console.log(err);
                    window.location = 'login.html';
                })
        },
        getData() {
            const url = `${this.apiUrl}/api/${this.path}/admin/products`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                    console.log(this.products);
                })
                .catch(err => {
                    console.dir(err);
                    // alert(err.data.message);
                })
        },
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.path}/admin/product`;
            if(!this.isNew){
                url = `${this.apiUrl}/api/${this.path}/admin/product/${this.tempProduct.id}`;
                axios.put(url, { data: this.tempProduct })
                    .then(res => {
                        console.log(res);
                        alert(res.data.message);
                        productModal.hide();
                        this.getData();
                    })
                    .catch(err => {
                        console.dir(err);
                        alert(err.data.message);
                    })
            }else {
                axios.post(url, { data: this.tempProduct })
                    .then(res => {
                        console.log(res);
                        alert(res.data.message);
                        productModal.hide();
                        this.getData();
                    })
                    .catch(err => {
                        console.dir(err);
                        alert(err.data.message);
                    })
            }
        },
        openModal(newEditDel, item) {
            // 點擊「新增產品」，帶入的參數為 new
            if (newEditDel === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
                // 點擊「修改產品」，帶入的參數為 edit
            } else if (newEditDel === 'edit') {
                this.tempProduct = { ...item };
                //if (!this.isNew) 使用put方法
                this.isNew = false;
                productModal.show();
                // 點擊「刪除產品」，帶入的參數為 delete
            } else if (newEditDel === 'delete') {
                this.tempProduct = { ...item };
                console.log(this.tempProduct);
                delProductModal.show();
            }
        },
        // 刪除產品，介接API，隱藏刪除產品Modal
        delProduct() {
            const url = `${this.apiUrl}/api/${this.path}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then(res => {
                    console.log(res);
                    delProductModal.hide();
                    this.getData();
                })
                .catch(err => {
                    console.dir(err);
                    alert(err.data.message);
                })
        },
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },

    },
    mounted() {
        //取消按下 ESC 鍵時關閉 Bootstrape 互動視窗。
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false,
            backdrop: 'static'
        });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false,
            backdrop: 'static'
        });
        // 取得 Token（Token 僅需要設定一次）
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        console.log(token);
        axios.defaults.headers.common["Authorization"] = token;
        this.checkLogin()
    }
})
vm.mount('#app')