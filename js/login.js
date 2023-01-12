import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

createApp({
    data() {
        return {
            user: {
                username: '',
                password: '',
            },
        }
    },
    methods: {
        login() {
            // const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
            const url = 'https://vue3-course-api.hexschool.io/v2';
            const path = 'coldplay';
            axios.post(`${url}/admin/signin`, this.user).then((res) => {
                const { token, expired } = res.data;
                console.log(res);
                debugger;
                // 寫入 cookie token
                // expires 設置有效時間
                document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
                window.location = 'products.html';
            }).catch((err) => {
                console.dir(err)
                alert(err.data.message);
            });
        },

    },
}).mount('#app');