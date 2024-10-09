// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: "en-CA",
      },
    },
  },
  modules: [
    "@nuxt/ui",
    "@formkit/auto-animate",
    "nuxt-vuefire",
    "@nuxt/eslint",
    "@nuxtjs/html-validator",
  ],
  compatibilityDate: "2024-10-06",
  vuefire: {
    config: {
      apiKey: "AIzaSyBza1q8246w_ZdNB60CE6ceiRB-A4gpwF0",
      authDomain: "csc530-job-tracker.firebaseapp.com",
      projectId: "csc530-job-tracker",
      storageBucket: "csc530-job-tracker.appspot.com",
      messagingSenderId: "463225810721",
      appId: "1:463225810721:web:256f993d45ecd6f28f1860",
    },
    options: {
      useFetchStreams: false,
    },
  },
});
