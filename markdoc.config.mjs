import { defineMarkdocConfig, nodes, component } from '@astrojs/markdoc/config';
import shiki from '@astrojs/markdoc/shiki';
export default defineMarkdocConfig({
  tags: {
    right: {
      render: component('./src/components/Right.astro')
    },
    figure: {
      attributes: {
        ...nodes.image.attributes,
        width: { type: String, required: false },
        height: { type: String, required: false },
        caption: { type: String, required: false }
      },
      render: component('./src/components/Figure.astro'),
    },
    image: {
      attributes: {
        ...nodes.image.attributes,
        width: { type: String, required: false },
        height: { type: String, required: false },
        caption: { type: String, required: false }
      },
      render: component('./src/components/Image.astro'),
    },
  },
  extends: [
    shiki({ theme: 'red' }),
  ],
});
