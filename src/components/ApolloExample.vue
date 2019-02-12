<template>
  <div class="apollo-example">
    <!-- Cute tiny form -->
    <div class="form">
      <label for="field-name" class="label">Name</label>
      <input
        v-model="user"
        placeholder="Type a name"
        class="input"
        id="field-name"
      >
    </div>

    <!-- Apollo watched Graphql query -->
    <ApolloQuery
      
      :query="require('../graphql/User.gql')"
      :variables="{ 
        user,
        afterCursor }"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occured</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo">
          Total user found: {{ data.search.userCount }}
          <div v-for="(edge, key) in data.search.edges" v-bind="key">

            1: {{edge.node.name}},
            2: {{edge.node.avatarUrl}},
            3: {{edge.node.bio}},
            4: {{edge.node.followers.totalCount}},
            5: {{edge.node.following.totalCount}},
            6: {{edge.node.starredRepositories.totalCount}},
            7: {{edge.node.url}}



          </div>
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script>
import { onLogin } from '../vue-apollo'
import { async } from 'q';

export default {
  data () {
    return {
      user: 'Zelig',
      afterCursor: null,
      search: {},
      page: 0,
      showMoreEnabled: true,
    }
  },
  methods: {
    async login(){
        const apolloClient = this.$apollo.provider.defaultClient
        await onLogin(apolloClient, 'a3886ef3a2894604ae4452bc736ded5660abda54')
    },
    showMore () {
      this.page++
      // Fetch more data and transform the original result
      this.$apollo.queries.tagsPage.fetchMore({
        // New variables
        variables: {
          page: this.page,
          pageSize,
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newTags = fetchMoreResult.tagsPage.tags
          const hasMore = fetchMoreResult.tagsPage.hasMore

          this.showMoreEnabled = hasMore

          return {
            tagsPage: {
              __typename: previousResult.tagsPage.__typename,
              // Merging the tag list
              tags: [...previousResult.tagsPage.tags, ...newTags],
              hasMore,
            }
          }
        }
      })
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
