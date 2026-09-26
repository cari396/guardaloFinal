import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import styled from '@emotion/styled'

import { Box } from '@chakra-ui/react'

import video from '../videos/hero.mp4'
import videoMobilePortrait from '../videos/mobile_p.mp4'
import videoMobileLandscape from '../videos/mobile_l.mp4'

const Video = styled.video({
  position: 'relative',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'none',
})

type ResponsiveVideoProps = {
  mediaQuery: string
  poster: string
  src: string
}

const ResponsiveVideo: React.FC<ResponsiveVideoProps> = ({ mediaQuery, poster, src }) => (
  <Box
    as={Video}
    autoPlay
    loop
    muted
    playsInline
    poster={poster}
    sx={{
      [mediaQuery]: {
        display: 'block',
      },
    }}
  >
    <source src={src} type="video/mp4" />
  </Box>
)

const HeroBG: React.FC = () => {
  const { img } = useStaticQuery(graphql`
    query HeroBG {
      img: allFile(
        filter: { relativeDirectory: { eq: "informacion" }, extension: { eq: "jpg" } }
        sort: { fields: relativePath, order: ASC }
      ) {
        edges {
          node {
            id
            childImageSharp {
              fixed(width: 1920) {
                src
              }
            }
          }
        }
      }
    }
  `)

  const poster = img.edges[0].node.childImageSharp.fixed.src

  return (
    <Box position="relative" w="100%" h="calc(var(--vh, 1vh) * 100)" zIndex="0">
      <Box
        position="absolute"
        w="100%"
        h="100%"
        background="linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), linear-gradient(220deg, rgba(29,2,163,0.5) 0%, rgba(0,141,210,0.5) 50%, rgba(116,219,252,0.5) 100%)"
        zIndex="1"
        boxShadow="inset 0 -7rem 2em -6em rgba(0, 0, 0, 0.5)"
      />
      <ResponsiveVideo
        poster={poster}
        mediaQuery="@media screen and (max-width: 1023px) and (orientation: portrait)"
        src={videoMobilePortrait}
      />
      <ResponsiveVideo
        poster={poster}
        mediaQuery="@media screen and (max-width: 1023px) and (orientation: landscape)"
        src={videoMobileLandscape}
      />
      <ResponsiveVideo
        poster={poster}
        mediaQuery="@media screen and (min-width: 1024px)"
        src={video}
      />
    </Box>
  )
}

export default HeroBG
