const httpInstance = axios.create({
    baseURL: 'http://localhost:3030',
    timeout: 10000,
});

const source = new EventSource('http://localhost:3030/message')
var app = new Vue({
    el: "#app",
    data: {
        user: "",
        message: "",
        chatMessages: []
    },
    created() {
        source.onmessage = (event) => {
            const { user, message, time } = JSON.parse(event.data)
            this.chatMessages.unshift({user, message, time})
        }
    },
    methods: {
        sendMessage() {
            return httpInstance.post('/message', {
                user: this.user,
                message: this.message,
            })
        }
    }
})
