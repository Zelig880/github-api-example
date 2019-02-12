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

    <div v-if="showResult" class="searchStats">
      <button @click="previousPage()" :disabled="!previousPageAvailable">Previous page</button>
      <span>Current Page: {{ currentPage }}</span>
      <span>Total Page: {{ totalPages }}</span>
      <span>Total Users: {{ search.userCount }}</span>
      <button @click="nextPage()" :disabled="!nextPageAvailable" >Next page</button>
    </div>

    <div v-if="$apollo.loading">Loading...</div>
    <div v-if="showResult">
      <div> Currently showing page number: {{ currentPage }} </div>
      <div id="userContainer">
        <div 
          class="user" 
          v-for="(node, key) in search.nodes" 
          :key="key" 
          v-if="node.__typename === 'User'"
        > 
          <img class="avatar" :src="node.avatarUrl" :alt="node.name + 'avatar Image'" />
          <h2>{{node.name}}</h2>
          <h3>{{node.bio}}</h3>
          <p>
            FOLLOWING:  {{node.starredRepositories.totalCount}}<br/>
            FOLLOWERS:  {{node.followers.totalCount}}<br/>
            STARRED REPOs: {{node.following.totalCount}}
          </p>
          <a :href="node.url" target="_blank">Go to Profile</a>
        </div>
      </div>
      
      <button @click="previousPage()" :disabled="!previousPageAvailable">Previous page</button>
      <button @click="nextPage()" :disabled="!nextPageAvailable" >Next page</button>
    </div>

    
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

      if(!this.searchCompleted()) return false;

      return this.search.pageInfo.hasNextPage;
    },
    previousPageAvailable(){
      if(!this.searchCompleted()) return false;

      return this.currentPage > 1;
    },
    showResult(){
      var graphQlLoading = this.$apollo.loading;

      if (!this.searchCompleted() || graphQlLoading){
        return false;
      }else{
        return true;
      }
    },
    totalPages(){
      if(!this.searchCompleted()) return 0;
      
      var totalPages = Math.ceil(this.search.userCount / 10);

      return totalPages;
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
    },
    searchCompleted(){
      return this.search.hasOwnProperty("pageInfo");
    }
  },
  beforeMount(){
    this.login();
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

#userContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
  height: auto;
  margin:10px;
  
  .user {
    background-color: white;
    box-shadow: 7px 10px lightgrey;
    flex-grow: 1;
    justify-content: space-between;
    width: 25%;
    min-width: 350px;
    max-width: 400px;
    margin:10px 7px
  }

  .avatar{
    margin-top: 10px;
    margin-left: 10px;
    width:150px;
    border-radius: 50%;
    float:left;
    height: auto;
  }
}
</style>
