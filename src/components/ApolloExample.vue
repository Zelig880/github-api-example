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
    <div> Currently showing page number: {{ currentPage }} </div>
    <div v-if="$apollo.loading">Loading...</div>
    <div v-if="showResult">
          Total user found: {{ search.userCount }}
          <div v-for="(node, key) in search.nodes" :key="key" v-if="node.__typename === 'User'"> 
            1: {{node.name}},
            2: {{node.avatarUrl}},
            3: {{node.bio}},
            6: {{node.starredRepositories.totalCount}},
            7: {{node.url}}
          </div>
    </div>

    <button @click="nextPage()" :disabled="!nextPageAvailable" >Next page</button>
    <button @click="previousPage()" :disabled="!previousPageAvailable">Previous page</button>
    
  </div>
</template>

<script>
import { onLogin } from '../vue-apollo'
import { async } from 'q';

export default {
  data () {
    return {
      nextPageCursor: null,
      previousPageCursor: null,
      search: {},
      userInput: "Zelig",
      queryDisabled: true,
      currentPage: 1
    }
  },
  apollo:{
    search:{
      query: require('../graphql/User.gql'),
      variables() {
        return {
            user: this.userInput,
            afterCursor:  this.nextPageCursor,
            beforeCursor: this.previousPageCursor
        }
      },
      fetchPolicy: 'cache-and-network',
      skip() {
        return this.queryDisabled
      }
    }
  },
  computed: {
    nextPageAvailable(){

      if(!this.search.hasOwnProperty("pageInfo")) return false;

      return this.search.pageInfo.hasNextPage;
    },
    previousPageAvailable(){
      if(!this.search.hasOwnProperty("pageInfo")) return false;

      return this.currentPage > 1;
    },
    showResult(){
      var queryIsEmpty = this.search.hasOwnProperty("userCount");
      var graphQlLoading = this.$apollo.loading;

      if (!queryIsEmpty || graphQlLoading){
        return false;
      }else{
        return true;
      }
    }
  },
  methods: {
    async login(){
        const apolloClient = this.$apollo.provider.defaultClient
        await onLogin(apolloClient, 'bd8cd29334eaf9fc425e4d5957605432327d6838')
    },
    nextPage () {
      this.nextPageCursor = this.search.pageInfo.endCursor;
      this.previousPageCursor = null;
      this.currentPage++;
    },
    previousPage(){
      this.previousPageCursor = this.search.pageInfo.startCursor;
      this.nextPageCursor = null;
      this.currentPage--;
    },
    triggerQuery(){
      this.userInput = this.$refs.userInput.value;
      this.queryDisabled = false;
      this.currentPage= 1;
    }
  },
  beforeMount(){
    this.login();
  }
}
</script>

<style scoped>
.form,
.input,
.apollo,
.message {
  padding: 12px;
}

label {
  display: block;
  margin-bottom: 6px;
}

.input {
  font-family: inherit;
  font-size: inherit;
  border: solid 2px #ccc;
  border-radius: 3px;
}

.error {
  color: red;
}

.images {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
  grid-gap: 10px;
}

.image-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ccc;
  border-radius: 8px;
}

.image {
  max-width: 100%;
  max-height: 100%;
}

.image-input {
  margin: 20px;
}
</style>
