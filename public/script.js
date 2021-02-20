const httpInstance = axios.create({
    baseURL: 'http://localhost:3030',
    timeout: 10000,
});

var app = new Vue({
    el: "#app",
    data: {
        user: "",
        message: "",
        chatMessages: []
    },
    mounted() {
        source.onmessage = (event) => {
            console.log(event)
        }
    },
    methods: {
        sendMessage() {
            return httpInstance.post('/message', {
                user: this.user,
                message: this.message,
            })
            .then((res) => {
                this.chatMessages.push({user: this.user, message: this.message})
            })
            
        }
    }
})
