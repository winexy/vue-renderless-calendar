import { createSSRApp, h } from 'vue';
import { RenderlessCalendar } from '../dist/index.es';

export { createApp };

function createApp(pageContext) {
  const { Page, pageProps } = pageContext;
  const PageWithLayout = {
    render() {
      return h(Page, pageProps || {});
    },
  };

  const app = createSSRApp(PageWithLayout);

  app.component('RenderlessCalendar', RenderlessCalendar);

  return app;
}
