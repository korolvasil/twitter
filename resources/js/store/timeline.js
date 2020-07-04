import axios from 'axios'
import { get } from 'lodash'

export default {
    namespaced: true,

    state: {
        tweets: []
    },

    getters: {
        tweets(state) {
            return state.tweets.sort((a, b) => b.created_at - a.created_at)
        }
    },

    mutations: {
        PUSH_TWEETS (state, data) {
            state.tweets.push(
                ...data.filter((tweet) =>{
                    return !state.tweets.map(t => t.id).includes(tweet.id)
                })
            )
        },

        SET_LIKES (state, {id, likes_count }) {
            state.tweets = state.tweets.map(tweet => {
                if(tweet.id === id) {
                    tweet.likes_count = likes_count
                }

                if(get(tweet.original_tweet, 'id') === id) {
                    tweet.original_tweet.likes_count = likes_count
                }

                return tweet
            });
        }
    },

    actions: {
        async getTweets ({ commit }, url) {
            let response = await axios.get(url)

            commit('PUSH_TWEETS', response.data.data)

            commit('likes/PUSH_LIKES', response.data.meta.likes, { root: true })
            commit('retweets/PUSH_RETWEETS', response.data.meta.retweets, { root: true })

            return response
        }
    }
}
