<template>
  <div>
    <div class="form">
      <label for="field-name" class="label">Name</label>
      <input
        placeholder="Type a name"
        class="input"
        id="field-name"
        ref="userInput"
      >
      
      <button @click="triggerQuery()" @disabled="$apollo.queries.search.loading" >Search</button>
    </div>

    <UserStats 
      :search="search"
      :showResult="showResult"
      @PageEvent="triggerQuery"
      ref="statsComponent"
    ></UserStats>

    <div v-if="$apollo.loading && !searchCompleted">Loading...</div>
    <UserContainer 
      :search="search"
      :showResult="showResult">
    </UserContainer>

  </div>
</template>

<script>
import UserStats from './UserStats.vue'
import UserContainer from './UserContainer.vue'

export default {
  data () {
    return {
      search: {},
      queryDisabled: true
    }
  },
  components: {
    UserStats,
    UserContainer
  },
  apollo:{
    search:{
      query: require('../graphql/User.gql'),
      variables: {
          user: "",
          afterCursor:  null,
          beforeCursor: null
      },
      fetchPolicy: 'cache-and-network',
      skip() {
        return this.queryDisabled
      }
    }
  },
  computed: {
    showResult(){
      var graphQlLoading = this.$apollo.loading;

      if (!this.searchCompleted || graphQlLoading){
        return false;
      }else{
        return true;
      }
    },
    searchCompleted(){
      return this.search.hasOwnProperty("pageInfo");
    }
  },
  methods: {
    triggerQuery(action, cursor){
      this.queryDisabled = false;

      this.$apollo.queries.search.options.variables.user = this.$refs.userInput.value;

      switch (action) {
        case "nextPage":
          this.$apollo.queries.search.options.variables.afterCursor = cursor;
          this.$apollo.queries.search.options.variables.beforeCursor = null;
          break;
        case "previousPage":
          this.$apollo.queries.search.options.variables.afterCursor = null;
          this.$apollo.queries.search.options.variables.beforeCursor = cursor;
          break;
        default:
          this.$apollo.queries.search.options.variables.afterCursor = null;
          this.$apollo.queries.search.options.variables.beforeCursor = null;
          this.$refs.statsComponent.currentPage = 1;
          break;
      }
      this.$apollo.queries.search.refresh()
    },
  }
}
</script>

<style lang="scss" scoped>
.form{

  width: 400px;
  margin: auto;
  label, input, button{
    display: block;
    width: 80%;
    margin: auto;
    padding: 10px;
    margin-bottom: 15px;
  }
  label{
    font-weight: bold;
    font-size: 1.25rem;
  }
  input{
    width: 75%;
  }
}
</style>
