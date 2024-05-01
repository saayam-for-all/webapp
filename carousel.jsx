
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
// From here on photos are imported, all from unplash (https://unsplash.com/es/)


export function EmblaCarousel() {

  //delay:3000 is the time the carousel will show an image

  const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay({delay:3000})])

  return (

  //I dont know if this tags should work for validation,should check

    <section className="embla" ref={emblaRef}>
      <article className="embla__container">
        <img className="embla__slide" src='https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='1'/>
        <img className="embla__slide" src='https://images.unsplash.com/photo-1535090467336-9501f96eef89?q=80&w=2100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='2'/>
        <img className="embla__slide" src='https://images.unsplash.com/photo-1617699755337-c79e46f7eb0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aHVtYW5pdGFyaWFufGVufDB8fDB8fHww' alt='3'/>
      </article>
    </section>
  )
}
