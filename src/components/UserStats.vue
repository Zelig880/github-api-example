<template>
    <transition>
        <div v-if="showResult" class="searchStats">
        <button @click="previousPage()" :disabled="!previousPageAvailable">Previous page</button>
        <span>Current Page: {{ currentPage }}</span>
        <span>Total Page: {{ totalPages }}</span>
        <span>Total Users: {{ search.userCount }}</span>
        <button @click="nextPage()" :disabled="!nextPageAvailable" >Next page</button>
        </div>
    </transition>
</template>

<script>
export default {
    name: "UserStats",
    props:{
        showResult: Boolean,
        search: Object,
    },
    data () {
        return {
            currentPage: 1,
            nextPageCursor: null,
            previousPageCursor: null,
        }
    },
    computed:{
        nextPageAvailable(){
            if(!this.showResult) return false;

            return this.search.pageInfo.hasNextPage;
        },
        previousPageAvailable(){
            if(!this.showResult) return false;

            return this.currentPage > 1;
        },
        totalPages(){
        if(!this.showResult) return 0;
        
        var totalPages = Math.ceil(this.search.userCount / 10);

        return totalPages;
        }
    },
    methods:{
        nextPage () {
            this.nextPageCursor = this.search.pageInfo.endCursor;
            this.previousPageCursor = this.search.pageInfo.endCursor;
            this.currentPage++;
            this.$emit('PageEvent', 'nextPage', this.nextPageCursor);
        },
        previousPage(){
            this.previousPageCursor = this.search.pageInfo.startCursor;
            this.nextPageCursor = null;
            this.currentPage--;
            this.$emit('PageEvent', 'previousPage', this.previousPageCursor);
        }
    }
}
</script>
<style lang="scss" scoped >
.searchStats{
  display: flex;
  justify-content: space-around;
  align-content: space-around;
  height: 50px;
  margin:10px;
  align-items:baseline;
  
  span, button {
    justify-content: space-around;
    width: 13%;
    height: 40px;
  }
  span{
    border-bottom: 2px solid #999999;
  }
}
.v-enter-active {
    animation: BounceIn 2s
}
.v-leave-active {
    animation: BounceIn 0.5s reverse
}

@keyframes BounceIn {
    0% {
        opacity: 0;
        transform: scale(0.1);
    }
    60% {
        transform: scale(1.2);
    }
    100% {
        opacity: 1;
        transform: 1;
    }
}
</style>

