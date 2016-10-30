<template src="./HomeView.pug" lang="pug"/>

<script type="text/javascript">
    import Test from '../components/Test.vue'

    export default {
        data() {
            return {
                nextValue: this.$store.state.text
            }
        },
        components: { Test },
        methods: {
            update() {
                this.$store.dispatch('UPDATE', { text: this.nextValue })
            }
        },
        created () {
            this.setTitle('hehe')
        }
    }
</script>