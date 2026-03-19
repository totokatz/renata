import truyuConcepto from '../assets/Lamparu TRUYU/6a638f196147747.661ae3fac9080.png'
import truyuIntro from '../assets/Lamparu TRUYU/6a8ef0196147747.661ae3fac8976.png'
import truyuContexto from '../assets/Lamparu TRUYU/01cb06196147747.661ae3faca1af.png'
import truyuDetalles from '../assets/Lamparu TRUYU/3477fe196147747.661ae3fac840f.png'
import truyuMorfologia from '../assets/Lamparu TRUYU/a351a9196147747.661ae3fac9c7f.png'
import truyuBocetos from '../assets/Lamparu TRUYU/eb1d33196147747.661ae3fac978b.png'

export const designProjects = [
  {
    slug: 'lampara-truyu',
    title: 'Lámpara Truyu',
    subtitle: 'Trabajo conceptual inspirado en el beso apasionado',
    type: 'Diseño de productos',
    date: '2024',
    description:
      'La lámpara Truyu representa conceptos derivados del beso apasionado, que implica chispa, fuego y pasión entre dos personas que conectan y se complementan entre sí.',
    cover: truyuConcepto,
    sections: [
      { type: 'hero', image: truyuConcepto },
      {
        type: 'text',
        content:
          'La lámpara Truyu representa conceptos derivados del beso apasionado, que implica chispa, fuego y pasión entre dos personas que conectan y se complementan entre sí. Este concepto es expresado a partir de una lámpara, que al dar luz, representará el fuego, la chispa y la pasión del beso.',
      },
      {
        type: 'split',
        image: truyuIntro,
        text: '«Truyu» significa beso en mapuche, y fue elegido ya que el proceso de diseño de este producto tuvo lugar durante un viaje al sur argentino, en donde los mapuches eran uno de los pueblos originarios.',
        direction: 'left',
      },
      {
        type: 'fullbleed',
        image: truyuMorfologia,
        caption: 'Morfología',
      },
      {
        type: 'showcase',
        images: [truyuConcepto, truyuDetalles, truyuMorfologia, truyuContexto],
      },
      {
        type: 'split',
        image: truyuBocetos,
        text: 'La morfología deriva de la abstracción de un beso. Comienza siendo algo recto, lineal, estructurado... pero se va volviendo una figura más orgánica y fluida, ya que el amor no es tan rígido.',
        direction: 'right',
      },
      {
        type: 'grid',
        images: [truyuDetalles, truyuContexto, truyuBocetos],
        columns: 3,
      },
    ],
  },
]
