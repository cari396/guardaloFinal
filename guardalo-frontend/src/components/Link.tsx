import React from 'react'
import { chakra, Link as ChakraNativeLink } from '@chakra-ui/react'
import { Link as GatsbyLink } from 'gatsby'

const StyledGatsbyLink = chakra(GatsbyLink)

const Link: React.FC<any> = ({ to, href, children, ...props }) => {
  const targetUrl = to || href || ''
  const isExternal =
    typeof targetUrl === 'string' &&
    (targetUrl.startsWith('http://') ||
      targetUrl.startsWith('https://') ||
      targetUrl.startsWith('mailto:') ||
      targetUrl.startsWith('tel:') ||
      props.target === '_blank')

  if (isExternal) {
    return (
      <ChakraNativeLink
        href={targetUrl}
        isExternal={props.target === '_blank'}
        {...props}
      >
        {children}
      </ChakraNativeLink>
    )
  }

  return (
    <StyledGatsbyLink to={targetUrl} {...props}>
      {children}
    </StyledGatsbyLink>
  )
}

export default Link
