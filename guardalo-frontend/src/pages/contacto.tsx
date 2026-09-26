import React from 'react'
import ContactForm from '../components/ContactForm'
import ContactHeader from '../components/ContactHeader'
import HeaderBox from '../components/HeaderBox'
import SEO from '../components/Seo'

const ContactoPage: React.FC = (): JSX.Element => {
  return (
    <>
      <SEO title="Contacto" />
      <HeaderBox />
      <ContactHeader />
      <ContactForm />
    </>
  )
}

export default ContactoPage
