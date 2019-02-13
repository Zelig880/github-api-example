<template>
  <transition>
    <div v-if="showResult && search.hasOwnProperty('nodes')" id="userContainer">
        <div 

            class="user" 
            v-for="(node, key) in search.nodes" 
            :key="key" 
            v-if="(node.__typename === 'User')"
        > 
            <img class="avatar" :src="node.avatarUrl" :alt="node.name + 'avatar Image'" />
            <h2>{{node.login}}</h2>
            <h3>{{node.name}}</h3>
            <p>
            FOLLOWING:  {{node.starredRepositories.totalCount}}<br/>
            FOLLOWERS:  {{node.followers.totalCount}}<br/>
            STARRED REPOs: {{node.following.totalCount}}
            </p>
            <p class="bio">{{node.bio}}</p>
            <a :href="node.url" target="_blank">Go to Profile</a>
        </div>
    </div>
  </transition>
</template>

<script>
export default {
    
    name: "UserContainer",
    props:{
        showResult: Boolean,
        search: Object,
    }
}
</script>

<style lang="scss">
#userContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
  height: auto;
  margin:10px auto;
  
  .user {
    background-color: white;
    box-shadow: 7px 10px lightgrey;
    flex-grow: 1;
    justify-content: space-between;
    width: 25%;
    min-width: 350px;
    max-width: 400px;
    margin:10px 7px;
    text-align: right;
    padding-right: 20px;
  }

  .avatar{
    margin-top: 10px;
    margin-left: 10px;
    width:150px;
    border-radius: 50%;
    float:left;
    height: auto;
  }

  .bio{
    text-align: center;
  }
}
.v-enter-active {
    animation: slideIn 2s
}
.v-leave-active {
    animation: slideIn 0.5s reverse
}

@keyframes slideIn {
    0% {
        opacity: 0;
        width: 0%;
    }
    100% {
        opacity: 1;
        width: 100%;
    }
}
</style>


