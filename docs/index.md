---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Full Event Calendar'
  text: 'Comprehensive event calendar.'
  tagline: 'Simple, light and fast event calendar that renders in any framework and library and supports 18 calendars and 100 locales powered by solid.js.'
  actions:
    - theme: brand
      text: Get Started
      link: /introduction/getting-started.html
    - theme: alt
      text: View on GitHub
      link: https://github.com/persianpack/full-event-calendar
  image:
    src: /image0.png
    alt: VitePress
features:
  - title: Made with solid.js
    icon: <img style="height:35px" src="./solid.svg">
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Built for React
    icon: <svg viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:rgb(20, 158, 202);scale:0.8;" ><circle cx="0" cy="0" r="2" fill="currentColor"></circle><g stroke="currentColor" stroke-width="1" fill="none"><ellipse rx="10" ry="4.5"></ellipse><ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse><ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse></g></svg>
    details: Full-Event-Calendar provides a highly performant React component that accepts JSX components for rendering nested content
  - title: 18 calendar types support.
    icon: <img style="height:35px" src="./intl.png">
    details: using the powerof intL. this calendar formats to any calendar.
---

<style>
.image-src{
  border-radius: 14px;
}
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
