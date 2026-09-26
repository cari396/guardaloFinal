import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react'
import React from 'react'
import TosText from './TosText'

type TosModalProps = {
  isOpen: boolean
  onClose: () => void
}

const TosModal: React.FC<TosModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent px="2rem" mx="1rem" maxW="1170px">
        <ModalHeader color="primary">Términos y condiciones de servicio</ModalHeader>
        <ModalCloseButton color="primary" />
        <ModalBody color="text">
          <TosText />
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} variant="ghost" color="primary">
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default TosModal
