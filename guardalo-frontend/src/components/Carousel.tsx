import { useEmblaCarousel } from 'embla-carousel/react'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import React, { useCallback, useEffect, useState } from 'react'
import '../css/embla.css'

type ThumbnailProps = {
  selected: boolean
  imgSrc: IGatsbyImageData
  onClick: () => void
}

export const Thumbnail: React.FC<ThumbnailProps> = ({ selected, onClick, imgSrc }) => (
  <div className={`embla__slide embla__slide--thumb ${selected ? 'is-selected' : ''}`}>
    <button
      onClick={onClick}
      className="embla__slide__inner embla__slide__inner--thumb"
      type="button"
    >
      <GatsbyImage alt="Depósitos de Guardalo.com" image={imgSrc} />
    </button>
  </div>
)

const EmblaCarousel: React.FC = () => {
  const { img } = useStaticQuery(graphql`
    query galeriaCarouselQuery {
      img: allFile(
        filter: { relativeDirectory: { eq: "galeria" }, ext: { eq: ".jpg" } }
        sort: { fields: relativePath, order: ASC }
      ) {
        edges {
          node {
            id
            ext
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
  `)

  const slides = img.edges

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mainViewportRef, embla] = useEmblaCarousel()
  const [thumbViewportRef, emblaThumbs] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    selectedClass: '',
  })

  const onThumbClick = useCallback(
    (index) => {
      if (!embla || !emblaThumbs) return
      if (emblaThumbs.clickAllowed()) embla.scrollTo(index)
    },
    [embla, emblaThumbs],
  )

  const onSelect = useCallback(() => {
    if (!embla || !emblaThumbs) return
    setSelectedIndex(embla.selectedScrollSnap())
    emblaThumbs.scrollTo(embla.selectedScrollSnap())
  }, [embla, emblaThumbs, setSelectedIndex])

  useEffect(() => {
    if (!embla) return
    onSelect()
    embla.on('select', onSelect)
  }, [embla, onSelect])

  return (
    <>
      <div className="embla">
        <div className="embla__viewport" ref={mainViewportRef}>
          <div className="embla__container">
            {slides.map((item) => {
              if (item.node.ext !== '.jpg') return
              return (
                <div className="embla__slide" key={item.node.id}>
                  <div className="embla__slide__inner">
                    <GatsbyImage
                      alt="Depósitos de Guardalo.com"
                      image={item.node.childImageSharp.gatsbyImageData}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="embla embla--thumb">
        <div className="embla__viewport embla__viewport--thumb" ref={thumbViewportRef}>
          <div className="embla__container embla__container--thumb">
            {slides.map((item, index) => {
              if (item.node.ext !== '.jpg') return
              return (
                <Thumbnail
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  imgSrc={item.node.childImageSharp.gatsbyImageData}
                  key={item.node.id}
                />
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default EmblaCarousel
