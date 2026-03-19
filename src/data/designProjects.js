const placeholder = '/images/placeholder.jpg'

export const designProjects = [
  {
    slug: 'fast-green',
    title: 'Fast Green',
    subtitle: 'Comida rápida saludable',
    type: 'Diseño de productos',
    date: 'Junio 2024',
    description:
      'Fast Green es una propuesta de un carrito ambulante, ofertando a la oferta de comida rápida saludable. Presenta un trabajo de desarrollo comercial sustentable en un producto funcional y moderno.',
    cover: placeholder,
    sections: [
      { type: 'hero', image: placeholder },
      {
        type: 'text',
        content:
          'Fast Green es una propuesta de un carrito ambulante, ofertando a la oferta de comida rápida saludable. Presenta un trabajo de desarrollo comercial sustentable en un producto funcional, adaptado para la producción de comida saludable.',
      },
      {
        type: 'split',
        image: placeholder,
        text: 'El diseño del carrito contempla la experiencia completa del usuario, desde la aproximación visual hasta la interacción con los productos ofrecidos.',
        direction: 'left',
      },
      {
        type: 'showcase',
        images: [placeholder, placeholder, placeholder, placeholder],
      },
      { type: 'fullbleed', image: placeholder, caption: 'Semántica' },
      {
        type: 'grid',
        images: [placeholder, placeholder, placeholder],
        columns: 3,
      },
      {
        type: 'split',
        image: placeholder,
        text: 'El desarrollo tecnológico del producto permite su fabricación en serie manteniendo la calidad artesanal del diseño original.',
        direction: 'right',
      },
    ],
  },
]
