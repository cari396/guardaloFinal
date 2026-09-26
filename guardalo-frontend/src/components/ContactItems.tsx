import React from 'react'
import { MdMail, MdPhone, MdContentCopy } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'

import { graphql, useStaticQuery } from 'gatsby'
import {
  Box,
  Popover,
  PopoverTrigger,
  Button,
  Text,
  UnorderedList,
  ListProps,
  Stack,
  HStack,
  LinkProps,
  Link,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  useToast,
} from '@chakra-ui/react'

type QueryTypes = {
  text: {
    contactItems: Array<{
      icon: string
      text: string
      url: string
    }>
  }
}

const ClipboardToast: React.FC = () => (
  <Box color="white" borderRadius="md" p={3} bg="green" r={1}>
    <HStack>
      <MdContentCopy />
      <Text color="white">
        Se copió {item.icon === 'email' ? 'la dirección de email' : null}
        {item.icon === 'phone' ? 'el número de teléfono' : null}
      </Text>
    </HStack>
  </Box>
)

const ContactItems: React.FC<ListProps & { itemProps?: LinkProps }> = ({
  itemProps = { m: '0 1rem 0 0' },
  ...props
}) => {
  const { text } = useStaticQuery<QueryTypes>(graphql`
    query contactItems {
      text: contactoYaml {
        contactItems {
          icon
          text
          url
        }
      }
    }
  `)

  const toast = useToast()

  return (
    <UnorderedList {...props}>
      {text.contactItems.map(
        (item): JSX.Element => (
          <Popover key={item.text} fontFamily="body">
            {({ onClose }) => (
              <>
                <PopoverTrigger>
                  <Button className="contact-link" href={item.url} {...itemProps}>
                    <Stack
                      direction="row"
                      spacing="0.5rem"
                      as="li"
                      w="fit-content"
                      alignItems="center"
                      _hover={{ opacity: '0.8' }}
                    >
                      {item.icon === 'email' ? (
                        <MdMail color="primary" size="1.5em" />
                      ) : null}
                      {item.icon === 'phone' ? (
                        <MdPhone color="primary" size="1.5em" />
                      ) : null}
                      <Text color="white" m="0 0 0 0.5rem">
                        {item.text}
                      </Text>
                    </Stack>
                  </Button>
                </PopoverTrigger>
                <PopoverContent color="text" fontFamily="body" border="none" shadow="xl">
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody fontWeight="medium">
                    <Stack
                      direction="column"
                      align="center"
                      wrap="nowrap"
                      pt={6}
                      pb={2}
                      spacing={4}
                    >
                      <Link
                        onClick={(e) => {
                          e.preventDefault()
                          navigator.clipboard.writeText(item.text)
                          onClose()
                          toast({
                            status: 'success',
                            duration: 5000,
                            render: ClipboardToast,
                          })
                        }}
                      >
                        <HStack>
                          <MdContentCopy />
                          <Text>
                            Copiar {item.icon === 'email' ? 'dirección de email' : null}{' '}
                            {item.icon === 'phone' ? 'número de teléfono' : null}
                          </Text>
                        </HStack>
                      </Link>
                      {item.icon === 'email' ? (
                        <HStack>
                          <MdMail />
                          <Link href={item.url}>Escribir email</Link>
                        </HStack>
                      ) : null}
                      {item.icon === 'phone' ? (
                        <HStack>
                          <MdPhone />
                          <Link href={`tel:${item.text}`}>Llamada telefónica</Link>
                        </HStack>
                      ) : null}
                      {item.icon === 'phone' ? (
                        <HStack>
                          <FaWhatsapp />
                          <Link href={item.url}>Escribir por WhatsApp</Link>
                        </HStack>
                      ) : null}
                    </Stack>
                  </PopoverBody>
                </PopoverContent>
              </>
            )}
          </Popover>
        ),
      )}
    </UnorderedList>
  )
}

export default ContactItems
