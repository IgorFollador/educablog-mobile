import 'dotenv/config';

export default {
  expo: {
    name: "educablog-mobile",
    slug: "educablog-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "educablog.mobile"
    },
    extra: {
      AUTH_SECRET: process.env.AUTH_SECRET,
      PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL,
      PUBLIC_API_URL: process.env.PUBLIC_API_URL,
      PUBLIC_POSTS_LIMIT: process.env.PUBLIC_POSTS_LIMIT,
      PUBLIC_DISQUS_NAME: process.env.PUBLIC_DISQUS_NAME,
    }
  }
};
