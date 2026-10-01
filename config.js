/**
 * DevFest & CCD Post Generator - Configuration File
 * Exact specifications matching official event posters.
 */

const CONFIG = {
  // Global Event Metadata
  communityName: "Chandigarh Developer Community",
  year: "2026",
  officialWebsite: "devfest.gdgchandigarh.com",

  // Templates Configuration: Exactly 2 Options (DevFest and CCD)
  templates: {
    devfest: {
      id: "devfest",
      title: "DevFest Chandigarh",
      badgeText: "DEVFEST CHANDIGARH",
      headline: "I'M JOINING DEVFEST!",
      titlePrefix: "{DevFest}",
      subtitle: "Chandigarh 2026",
      date: "24 October 2026",
      venue: "Chandigarh University",
      showBothLogos: true,
      themeType: "dark_4color",
      leftHandwriting: ["Build", "Learn", "Connect", "Grow"],
      rightHandwriting: ["Bigger Community", "Brighter Possibilities"],
      pillars: [
        { icon: "👥", label: "Connect", sub: "with Developers" },
        { icon: "💡", label: "Learn", sub: "New Technologies" },
        { icon: "</>", label: "Build", sub: "Real Solutions" },
        { icon: "🚀", label: "Grow", sub: "Together" }
      ],
      hashtags: ["#DevFestChandigarh", "#DevFest2026", "#GDG", "#CloudChandigarh"],
      caption: `Excited to be part of DevFest Chandigarh 2026 at Chandigarh University on 24 October 2026! 🚀

I'm [NAME] and I can't wait to learn about the latest in Web, AI, Cloud & Android, and connect with awesome developers!

Join me at DevFest Chandigarh!

#DevFestChandigarh #DevFest2026 #GDG #CloudChandigarh`,
    },
    ccd: {
      id: "ccd",
      title: "Cloud Community Day (CCD)",
      badgeText: "CLOUD COMMUNITY DAY",
      headline: "I'M JOINING CLOUD COMMUNITY DAY!",
      titlePrefix: "Cloud Community Day",
      subtitle: "Chandigarh 2026",
      date: "23 October 2026",
      venue: "Chandigarh University",
      showBothLogos: true,
      themeType: "light_cloud",
      leftHandwriting: ["Learn", "Explore", "Build", "Together"],
      rightHandwriting: ["Cloud", "AI", "Open Source", "Community"],
      pillars: [
        { icon: "☁️", label: "Explore", sub: "Cloud Technologies" },
        { icon: "👥", label: "Learn", sub: "from Experts" },
        { icon: "</>", label: "Build", sub: "with Community" },
        { icon: "📈", label: "Grow", sub: "Your Skills" }
      ],
      hashtags: ["#CloudCommunityDay", "|", "#CCD", "|", "#GDGCloudChandigarh"],
      caption: `Thrilled to attend Cloud Community Day (CCD) Chandigarh 2026 at Chandigarh University on 23 October 2026! ☁️🚀

I'm [NAME] and I'm eager to dive deep into Cloud Native, DevOps, Serverless & Generative AI architectures!

See you at Cloud Community Day!

#CloudCommunityDay #CCD #GDGCloudChandigarh #GCP #CloudNative`,
    }
  },

  // Canvas Dimensions
  canvas: {
    width: 1080,
    height: 1350
  },

  // Theme Colors
  theme: {
    bgDark: "#070A14",
    bgLight: "#F0F6FF",
    googleBlue: "#4285F4",
    googleRed: "#EA4335",
    googleYellow: "#FBBC04",
    googleGreen: "#34A853",
    neonCyan: "#00F2FE"
  }
};

if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}
