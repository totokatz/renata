import truyuConcepto from '../assets/lampara-truyu/concepto.png'
import truyuConceptoAmpliado from '../assets/lampara-truyu/concepto ampliado.png'
import truyuCloseup from '../assets/lampara-truyu/closeup ampliado.png'
import truyuContexto from '../assets/lampara-truyu/contexto.png'
import truyuDetalleSketch from '../assets/lampara-truyu/detalle-sketch.png'
import truyuDetalleCabeza from '../assets/lampara-truyu/detalle-cabeza 2.png'
import truyuDetalleBase from '../assets/lampara-truyu/detalle-base.png'
import truyuMorfologia from '../assets/lampara-truyu/morfologia.png'
import truyuBocetos from '../assets/lampara-truyu/bocetos.png'

// GLB model
import truyuModel from '../assets/Lamparu TRUYU/LAMPARA TRUYU.glb?url'

export const designProjects = [
  {
    slug: 'lampara-truyu',
    title: 'Lámpara Truyu',
    subtitle: 'Trabajo conceptual inspirado en el beso apasionado',
    type: 'Diseño de productos',
    date: '2024',
    description:
      'La lámpara Truyu representa conceptos derivados del beso apasionado, que implica chispa, fuego y pasión entre dos personas que conectan y se complementan entre sí.',
    cover: truyuConceptoAmpliado,
    sections: [
      { type: 'hero', image: truyuConceptoAmpliado },
      {
        type: 'text',
        content:
          'La lámpara Truyu representa conceptos derivados del beso apasionado, que implica chispa, fuego y pasión entre dos personas que conectan y se complementan entre sí. Este concepto es expresado a partir de una lámpara, que al dar luz, representará el fuego, la chispa y la pasión del beso.',
      },
      {
        type: 'model3d',
        model: truyuModel,
        mode: 'scroll-rotate',
        caption: 'Explorá la lámpara en 360°',
      },
      {
        type: 'split',
        image: truyuCloseup,
        text: '«Truyu» significa beso en mapuche, y fue elegido ya que el proceso de diseño de este producto tuvo lugar durante un viaje al sur argentino, en donde los mapuches eran uno de los pueblos originarios.',
        direction: 'left',
      },
      // {
      //   type: 'fullbleed',
      //   image: truyuMorfologia,
      //   caption: 'Morfología',
      // },
      // {
      //   type: 'model3d',
      //   model: truyuModel,
      //   mode: 'explode',
      //   caption: 'Descomposición de piezas',
      // },
      // {
      //   type: 'split',
      //   image: truyuBocetos,
      //   text: 'La morfología deriva de la abstracción de un beso. Comienza siendo algo recto, lineal, estructurado... pero se va volviendo una figura más orgánica y fluida, ya que el amor no es tan rígido.',
      //   direction: 'right',
      // },
      // {
      //   type: 'showcase',
      //   images: [truyuConcepto, truyuContexto, truyuCloseup, truyuDetalleSketch],
      // },
      {
        type: 'model3d',
        model: truyuModel,
        mode: 'interactive',
        caption: 'Interactuá con el modelo',
      },
      {
        type: 'grid',
        images: [truyuDetalleSketch, truyuDetalleCabeza, truyuDetalleBase],
        columns: 3,
      },
    ],
  },
]
