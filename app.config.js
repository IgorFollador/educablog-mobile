import 'dotenv/config';

export default {
  expo: {
    name: "educablog-mobile",
    slug: "educablog-mobile",
    version: "1.0.0",
    orientation: "portrait",
    platforms: ["ios", "android"],
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
      AUTH_SECRET: process.env.AUTH_SECRET || "SuperSecretKeyForNextAuth123!ChangeMe",
      PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || "https://educablog-web.vercel.app/",
      PUBLIC_API_URL: process.env.PUBLIC_API_URL || "https://apl-back-educablog-1.onrender.com",
      PUBLIC_POSTS_LIMIT: process.env.PUBLIC_POSTS_LIMIT || "10",
      TOKEN_EXPIRATION_TIME: process.env.TOKEN_EXPIRATION_TIME || "86400000",
      PUBLIC_DISQUS_NAME: process.env.PUBLIC_DISQUS_NAME || "educablog-1",
      "eas": {
        "projectId": "e1d2b4d3-ad0d-4ce1-87d2-3b402113325d"
      }
    }
  }
};