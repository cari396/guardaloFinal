import React, { useState, useEffect } from 'react'
import { Link, navigate } from 'gatsby'
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Stack,
  HStack,
  VStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  SimpleGrid,
  Textarea,
  Select,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  FiCalendar,
  FiRepeat,
  FiPlus,
  FiEdit,
  FiDownload,
  FiCheckCircle,
  FiBox,
  FiDollarSign,
  FiUserCheck,
  FiClock,
  FiRefreshCw,
  FiLayers,
  FiSliders,
  FiTrash2,
  FiAlertCircle,
  FiCheck,
  FiTool,
  FiUpload,
  FiEye,
  FiFileText,
} from 'react-icons/fi'
import DashboardLayout, { DashboardTab } from '../components/dashboard/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { boxApi, priceApi, adminApi, paymentApi, API_BASE_URL } from '../services/api'
import SEO from '../components/Seo'

interface BoxItem {
  id: string
  boxNumber: string
  size: string
  expiresAt: string
  status: 'active' | 'pending' | 'expired'
  monthlyPrice: number
  startDate: string
}

interface PriceItem {
  id: string
  period: string
  amount: number
  promoText?: string
  sizeCategory?: string
}

interface OperationItem {
  id: string
  code: string
  boxNumber: string
  date: string
  amount: number
  status: string
  paymentMethod?: string
  transferReceiptPath?: string
  transferReference?: string
}

interface AdminOperationItem {
  id: number
  operation_code: string
  user: {
    id: number
    name: string
    email: string
    phone?: string
    dni?: string
  } | null
  box: {
    id: number
    box_number: string
    size: string
  } | null
  amount: number
  payment_status: string
  payment_method: string
  transfer_reference?: string
  transfer_receipt_path?: string
  contract_url?: string
  created_at: string
}

interface ClientItem {
  id: number
  name: string
  email: string
  phone?: string
  dni?: string
  cuit?: string
  city?: string
  active_boxes: string[]
  status: string
  total_rentals: number
  created_at?: string
}

interface InventorySummaryItem {
  size: 'Pequeño' | 'Mediano' | 'Grande'
  dimensions: string
  total: number
  rented: number
  available: number
  maintenance: number
}

interface AdminBoxItem {
  id: number
  box_number: string
  size: 'Pequeño' | 'Mediano' | 'Grande' | string
  dimensions: string
  status: 'disponible' | 'alquilado' | 'mantenimiento'
  base_price: number
  notes: string | null
  tenant: {
    id: number
    name: string
    email: string
    phone: string | null
    expires_at: string | null
  } | null
}

const DEFAULT_DEMO_OPERATIONS: OperationItem[] = [
  {
    id: 'op1',
    code: '#OP-9482',
    boxNumber: 'BOX 16',
    date: '22/09/2026',
    amount: 13500,
    status: 'Pagado',
    paymentMethod: 'mercadopago',
  },
  {
    id: 'op2',
    code: '#OP-8921',
    boxNumber: 'BOX 17',
    date: '22/09/2026',
    amount: 9800,
    status: 'Pagado',
    paymentMethod: 'transferencia',
  },
]

const DEFAULT_BOXES: BoxItem[] = [
  {
    id: 'b1',
    boxNumber: 'BOX 16',
    size: 'Mediano: 13.75m² (2.75x5m)',
    expiresAt: '22 de diciembre',
    status: 'active',
    monthlyPrice: 13500,
    startDate: '22 de septiembre',
  },
  {
    id: 'b2',
    boxNumber: 'BOX 17',
    size: 'Pequeño: 8.3m² (1.66x5m)',
    expiresAt: '22 de diciembre',
    status: 'active',
    monthlyPrice: 9800,
    startDate: '22 de septiembre',
  },
]

const DEFAULT_PRICES: PriceItem[] = [
  // Mediano
  { id: 'p1', period: '1 DÍA', amount: 6000, sizeCategory: 'Mediano (13.75m²)' },
  { id: 'p2', period: '3 DÍAS', amount: 10000, sizeCategory: 'Mediano (13.75m²)' },
  { id: 'p3', period: '7 DÍAS', amount: 22500, sizeCategory: 'Mediano (13.75m²)' },
  { id: 'p4', period: '15 DÍAS', amount: 26250, sizeCategory: 'Mediano (13.75m²)' },
  { id: 'p5', period: '30 DÍAS', amount: 60000, sizeCategory: 'Mediano (13.75m²)' },
  { id: 'p6', period: '90 DÍAS', amount: 180000, promoText: 'promo +10 días', sizeCategory: 'Mediano (13.75m²)' },
  { id: 'p7', period: '180 DÍAS', amount: 360000, promoText: 'promo +30 días', sizeCategory: 'Mediano (13.75m²)' },
  // Pequeño
  { id: 'p8', period: '1 DÍA', amount: 3650, sizeCategory: 'Pequeño (8.3m²)' },
  { id: 'p9', period: '30 DÍAS', amount: 36500, sizeCategory: 'Pequeño (8.3m²)' },
  { id: 'p10', period: '90 DÍAS', amount: 109500, promoText: 'promo +10 días', sizeCategory: 'Pequeño (8.3m²)' },
  { id: 'p11', period: '180 DÍAS', amount: 219000, promoText: 'promo +30 días', sizeCategory: 'Pequeño (8.3m²)' },
  // Grande
  { id: 'p12', period: '1 DÍA', amount: 9000, sizeCategory: 'Grande (20.5m²)' },
  { id: 'p13', period: '30 DÍAS', amount: 90000, sizeCategory: 'Grande (20.5m²)' },
  { id: 'p14', period: '90 DÍAS', amount: 270000, promoText: 'promo +10 días', sizeCategory: 'Grande (20.5m²)' },
  { id: 'p15', period: '180 DÍAS', amount: 540000, promoText: 'promo +30 días', sizeCategory: 'Grande (20.5m²)' },
]

const PanelPage: React.FC = () => {
  const { user, isAuthenticated, updateProfile, switchDemoRole } = useAuth()
  const [activeTab, setActiveTab] = useState<DashboardTab>('boxes')
  const [boxes, setBoxes] = useState<BoxItem[]>([])
  const [prices, setPrices] = useState<PriceItem[]>(DEFAULT_PRICES)
  const toast = useToast()

  const cardBg = useColorModeValue('white', '#1E293B')
  const cardBorder = useColorModeValue('1px solid #e2e8f0', '1px solid #334155')
  const dashedBorder = useColorModeValue('1px dashed #cbd5e1', '1px dashed #475569')

  // Selected item for operations modal
  const [selectedBox, setSelectedBox] = useState<BoxItem | null>(null)
  const {
    isOpen: isOpOpen,
    onOpen: onOpOpen,
    onClose: onOpClose,
  } = useDisclosure()

  // Modal for adding / editing price
  const [editingPrice, setEditingPrice] = useState<PriceItem | null>(null)
  const [pricePeriod, setPricePeriod] = useState('')
  const [priceAmount, setPriceAmount] = useState<number | ''>('')
  const [pricePromo, setPricePromo] = useState('')
  const [priceCategory, setPriceCategory] = useState<string>('Mediano (13.75m²)')
  const [loadingPrices, setLoadingPrices] = useState(false)
  const {
    isOpen: isPriceModalOpen,
    onOpen: onPriceModalOpen,
    onClose: onPriceModalClose,
  } = useDisclosure()

  // State for Mis Datos
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [dni, setDni] = useState(user?.dni || '')
  const [cuit, setCuit] = useState(user?.cuit || '')
  const [address, setAddress] = useState(user?.address || '')
  const [city, setCity] = useState(user?.city || 'Chivilcoy')

  // Operations and Clients state
  const [operaciones, setOperaciones] = useState<OperationItem[]>([])
  const [clients, setClients] = useState<ClientItem[]>([])
  const [loadingClients, setLoadingClients] = useState(false)

  const fetchClients = () => {
    setLoadingClients(true)
    adminApi
      .getClients()
      .then((res) => {
        if (res.data && res.data.clients) {
          setClients(res.data.clients)
        }
      })
      .catch(() => {})
      .finally(() => setLoadingClients(false))
  }

  const fetchPrices = () => {
    setLoadingPrices(true)
    priceApi
      .getPrices()
      .then((res) => {
        if (res.data && res.data.prices && res.data.prices.length > 0) {
          const mapped: PriceItem[] = res.data.prices.map((p: any) => ({
            id: String(p.id),
            period: p.period,
            amount: Number(p.amount),
            promoText: p.promo_text || undefined,
            sizeCategory: p.size_category || 'Mediano (13.75m²)',
          }))
          setPrices(mapped)
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('guardalo_prices_cache', JSON.stringify(res.data.prices))
            } catch (e) {}
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching prices from API:', err)
      })
      .finally(() => setLoadingPrices(false))
  }

  // Inventory state (Admin)
  const [inventorySummary, setInventorySummary] = useState<InventorySummaryItem[]>([])
  const [adminBoxes, setAdminBoxes] = useState<AdminBoxItem[]>([])
  const [loadingInventory, setLoadingInventory] = useState(false)
  const [inventoryFilterSize, setInventoryFilterSize] = useState('todos')
  const [inventoryFilterStatus, setInventoryFilterStatus] = useState('todos')

  // Capacity Modal
  const {
    isOpen: isCapacityModalOpen,
    onOpen: onCapacityModalOpen,
    onClose: onCapacityModalClose,
  } = useDisclosure()
  const [capacitySize, setCapacitySize] = useState<'Pequeño' | 'Mediano' | 'Grande'>('Pequeño')
  const [targetCapacity, setTargetCapacity] = useState<number>(0)
  const [savingCapacity, setSavingCapacity] = useState(false)

  // Add Box Modal
  const {
    isOpen: isAddBoxModalOpen,
    onOpen: onAddBoxModalOpen,
    onClose: onAddBoxModalClose,
  } = useDisclosure()
  const [newBoxNumber, setNewBoxNumber] = useState('')
  const [newBoxSize, setNewBoxSize] = useState<'Pequeño' | 'Mediano' | 'Grande'>('Pequeño')
  const [newBoxStatus, setNewBoxStatus] = useState<'disponible' | 'mantenimiento'>('disponible')
  const [newBoxNotes, setNewBoxNotes] = useState('')
  const [savingBox, setSavingBox] = useState(false)

  const fetchInventory = () => {
    setLoadingInventory(true)
    adminApi
      .getBoxes()
      .then((res) => {
        if (res.data) {
          if (res.data.summary) setInventorySummary(res.data.summary)
          if (res.data.boxes) setAdminBoxes(res.data.boxes)
        }
      })
      .catch((err) => {
        console.error('Error fetching inventory:', err)
      })
      .finally(() => setLoadingInventory(false))
  }

  const handleOpenCapacityModal = (size: 'Pequeño' | 'Mediano' | 'Grande', currentTotal: number) => {
    setCapacitySize(size)
    setTargetCapacity(currentTotal)
    onCapacityModalOpen()
  }

  const handleSaveCapacity = async () => {
    if (targetCapacity < 0) return
    setSavingCapacity(true)
    try {
      const res = await adminApi.setCapacity(capacitySize, targetCapacity)
      toast({
        title: 'Capacidad actualizada',
        description: res.data.message || `Capacidad para ${capacitySize} actualizada.`,
        status: 'success',
      })
      onCapacityModalClose()
      fetchInventory()
    } catch (err: any) {
      toast({
        title: 'Error al actualizar capacidad',
        description: err.response?.data?.message || 'Ocurrió un error',
        status: 'error',
      })
    } finally {
      setSavingCapacity(false)
    }
  }

  const handleCreateBox = async () => {
    if (!newBoxNumber.trim()) {
      toast({ title: 'Número de box requerido', status: 'warning' })
      return
    }
    setSavingBox(true)
    try {
      await adminApi.createBox({
        box_number: newBoxNumber.trim(),
        size: newBoxSize,
        status: newBoxStatus,
        notes: newBoxNotes,
      })
      toast({
        title: 'Box creado',
        description: `${newBoxNumber} creado exitosamente.`,
        status: 'success',
      })
      onAddBoxModalClose()
      setNewBoxNumber('')
      setNewBoxNotes('')
      fetchInventory()
    } catch (err: any) {
      toast({
        title: 'Error al crear box',
        description: err.response?.data?.message || 'Ocurrió un error',
        status: 'error',
      })
    } finally {
      setSavingBox(false)
    }
  }

  const handleToggleMaintenance = async (b: AdminBoxItem) => {
    const nextStatus = b.status === 'mantenimiento' ? 'disponible' : 'mantenimiento'
    try {
      await adminApi.updateBox(b.id, { status: nextStatus })
      toast({
        title: 'Estado actualizado',
        description: `${b.box_number} ahora está ${nextStatus === 'disponible' ? 'disponible' : 'en mantenimiento'}.`,
        status: 'info',
      })
      fetchInventory()
    } catch (err: any) {
      toast({
        title: 'Error al cambiar estado',
        description: err.response?.data?.message || 'Ocurrió un error',
        status: 'error',
      })
    }
  }

  const handleDeleteBox = async (b: AdminBoxItem) => {
    if (b.status === 'alquilado') {
      toast({ title: 'No se puede eliminar un box alquilado', status: 'error' })
      return
    }
    if (!window.confirm(`¿Estás seguro de eliminar el ${b.box_number}?`)) return
    try {
      await adminApi.deleteBox(b.id)
      toast({
        title: 'Box eliminado',
        description: `${b.box_number} ha sido eliminado.`,
        status: 'success',
      })
      fetchInventory()
    } catch (err: any) {
      toast({
        title: 'Error al eliminar box',
        description: err.response?.data?.message || 'Ocurrió un error',
        status: 'error',
      })
    }
  }

  // Admin Operations & Bank Transfer Approvals State
  const [adminOperations, setAdminOperations] = useState<AdminOperationItem[]>([])
  const [loadingAdminOps, setLoadingAdminOps] = useState(false)
  const [approvingOpId, setApprovingOpId] = useState<number | null>(null)
  const [filterOpStatus, setFilterOpStatus] = useState<string>('todos')

  // Upload transfer receipt (Client)
  const [uploadingOp, setUploadingOp] = useState<OperationItem | null>(null)
  const [transferRefInput, setTransferRefInput] = useState('')
  const [receiptFileInput, setReceiptFileInput] = useState<File | null>(null)
  const [submittingReceipt, setSubmittingReceipt] = useState(false)
  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure()

  // Receipt image/pdf modal preview
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null)
  const {
    isOpen: isReceiptModalOpen,
    onOpen: onReceiptModalOpen,
    onClose: onReceiptModalClose,
  } = useDisclosure()

  const fetchAdminOperations = () => {
    setLoadingAdminOps(true)
    adminApi
      .getOperations()
      .then((res) => {
        if (res.data && res.data.operations) {
          setAdminOperations(res.data.operations)
        }
      })
      .catch((err) => {
        console.error('Error fetching admin operations:', err)
      })
      .finally(() => setLoadingAdminOps(false))
  }

  const handleApproveTransfer = async (op: AdminOperationItem) => {
    const boxName = op.box?.box_number || 'unidad'
    const clientName = op.user?.name || 'el cliente'
    if (!window.confirm(`¿Aprobar transferencia por $${op.amount.toLocaleString('es-AR')} de ${clientName} para ${boxName}? Se activará el box y se enviará el contrato oficial por email.`)) {
      return
    }
    setApprovingOpId(op.id)
    try {
      const res = await adminApi.approveTransfer(op.id)
      toast({
        title: 'Transferencia Aprobada',
        description: res.data?.message || 'La transferencia fue aprobada y el box se encuentra activo.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      fetchAdminOperations()
      fetchInventory()
    } catch (err: any) {
      toast({
        title: 'Error al aprobar transferencia',
        description: err.response?.data?.message || 'Ocurrió un error al procesar la aprobación.',
        status: 'error',
      })
    } finally {
      setApprovingOpId(null)
    }
  }

  const handleOpenUploadModal = (op: OperationItem) => {
    setUploadingOp(op)
    setTransferRefInput(op.transferReference || '')
    setReceiptFileInput(null)
    onUploadOpen()
  }

  const handleConfirmTransferSubmit = async () => {
    if (!uploadingOp) return
    if (!transferRefInput.trim()) {
      toast({
        title: 'Referencia requerida',
        description: 'Por favor ingresá el número de comprobante o referencia de tu transferencia.',
        status: 'warning',
      })
      return
    }

    setSubmittingReceipt(true)
    try {
      const formData = new FormData()
      formData.append('operation_code', uploadingOp.code.replace('#', ''))
      formData.append('transfer_reference', transferRefInput.trim())
      if (receiptFileInput) {
        formData.append('receipt_file', receiptFileInput)
      }

      const res = await paymentApi.confirmTransfer(formData)
      toast({
        title: 'Comprobante Registrado',
        description: res.data?.message || 'Comprobante recibido exitosamente. Nuestro equipo lo revisará a la brevedad.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      onUploadClose()

      // Reload client operations
      boxApi.getMyOperations().then((r) => {
        if (r.data && r.data.operations) {
          setOperaciones(
            r.data.operations.map((op: any) => ({
              id: String(op.id),
              code: op.operation_code,
              boxNumber: op.box_number,
              date: op.date,
              amount: op.amount,
              status: op.status,
              paymentMethod: op.payment_method,
              transferReceiptPath: op.transfer_receipt_path,
              transferReference: op.transfer_reference,
            }))
          )
        }
      })
    } catch (err: any) {
      toast({
        title: 'Error al enviar comprobante',
        description: err.response?.data?.message || 'No se pudo enviar el comprobante.',
        status: 'error',
      })
    } finally {
      setSubmittingReceipt(false)
    }
  }

  // Read URL query tab if provided
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab') as DashboardTab
      if (tabParam) {
        setActiveTab(tabParam)
      } else if (user?.role === 'admin') {
        setActiveTab('inventario')
      } else {
        setActiveTab('boxes')
      }
    }
  }, [user?.role])

  useEffect(() => {
    if (activeTab === 'clientes' || user?.role === 'admin') {
      fetchClients()
    }
    if (activeTab === 'inventario' || user?.role === 'admin') {
      fetchInventory()
    }
    if (activeTab === 'precios' || user?.role === 'admin') {
      fetchPrices()
    }
    if (activeTab === 'admin_operaciones' || user?.role === 'admin') {
      fetchAdminOperations()
    }
  }, [activeTab, user?.role])

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone || '')
      setDni(user.dni || '')
      setCuit(user.cuit || '')
      setAddress(user.address || '')
      setCity(user.city || 'Chivilcoy')
    }
  }, [user])

  useEffect(() => {
    const isDemoUser =
      user?.email === 'juan.lopez@ejemplo.com' || user?.email === 'juan@guardalo.com.ar'

    // Attempt fetching real boxes from Laravel API
    boxApi
      .getMyBoxes()
      .then((res) => {
        if (res.data && res.data.boxes && res.data.boxes.length > 0) {
          setBoxes(
            res.data.boxes.map((b: any) => ({
              id: String(b.id),
              boxNumber: b.box_number,
              size: b.size,
              expiresAt: b.expires_at,
              status: b.status,
              monthlyPrice: b.amount,
              startDate: b.start_date,
            }))
          )
        } else {
          setBoxes(isDemoUser ? DEFAULT_BOXES : [])
        }
      })
      .catch(() => {
        setBoxes(isDemoUser ? DEFAULT_BOXES : [])
      })

    // Fetch real operations from Laravel API
    boxApi
      .getMyOperations()
      .then((res) => {
        if (res.data && res.data.operations && res.data.operations.length > 0) {
          setOperaciones(
            res.data.operations.map((op: any) => ({
              id: String(op.id),
              code: op.operation_code,
              boxNumber: op.box_number,
              date: op.date,
              amount: op.amount,
              status: op.status,
              paymentMethod: op.payment_method,
              transferReceiptPath: op.transfer_receipt_path,
              transferReference: op.transfer_reference,
            }))
          )
        } else if (isDemoUser) {
          setOperaciones(DEFAULT_DEMO_OPERATIONS)
        } else {
          // Clean empty state for new user accounts!
          setOperaciones([])
        }
      })
      .catch(() => {
        setOperaciones(isDemoUser ? DEFAULT_DEMO_OPERATIONS : [])
      })

    // Attempt fetching real prices from Laravel API
    const loadPrices = () => {
      priceApi
        .getPrices()
        .then((res) => {
          if (res.data && res.data.prices && res.data.prices.length > 0) {
            setPrices(
              res.data.prices.map((p: any) => ({
                id: String(p.id),
                period: p.period,
                amount: Number(p.amount),
                promoText: p.promo_text,
                sizeCategory: p.size_category,
              }))
            )
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('guardalo_prices_cache', JSON.stringify(res.data.prices))
              } catch (e) {}
            }
          }
        })
        .catch(() => {})
    }
    loadPrices()

    // Load clients
    fetchClients()
  }, [user?.email])

  const handleOpenPriceModal = (item?: PriceItem) => {
    if (item) {
      setEditingPrice(item)
      setPricePeriod(item.period)
      setPriceAmount(item.amount)
      setPricePromo(item.promoText || '')
      setPriceCategory(item.sizeCategory || 'Mediano (13.75m²)')
    } else {
      setEditingPrice(null)
      setPricePeriod('')
      setPriceAmount('')
      setPricePromo('')
      setPriceCategory('Mediano (13.75m²)')
    }
    onPriceModalOpen()
  }

  const handleSavePrice = async () => {
    if (!pricePeriod || priceAmount === '') {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completá período y precio.',
        status: 'warning',
      })
      return
    }

    const numericAmount = Number(priceAmount)

    if (editingPrice) {
      try {
        await priceApi.updatePrice(editingPrice.id, {
          period: pricePeriod.toUpperCase(),
          amount: numericAmount,
          promo_text: pricePromo || undefined,
          size_category: priceCategory,
        })
      } catch (err) {
        console.warn('Could not persist price to backend API, keeping local:', err)
      }

      fetchPrices()

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('prices_updated'))
      }

      toast({
        title: 'Precio actualizado',
        description: 'El nuevo precio se guardó y ya se ve reflejado en toda la web.',
        status: 'success',
        duration: 3000,
      })
    } else {
      try {
        await priceApi.createPrice({
          period: pricePeriod.toUpperCase(),
          amount: numericAmount,
          promo_text: pricePromo || undefined,
          size_category: priceCategory,
        })
      } catch (err) {
        console.warn('Could not create price on backend API:', err)
      }

      fetchPrices()

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('prices_updated'))
      }

      toast({
        title: 'Nuevo precio añadido',
        status: 'success',
        duration: 2500,
      })
    }
    onPriceModalClose()
  }

  const handleDeletePrice = async (item: PriceItem) => {
    if (!window.confirm(`¿Estás seguro de eliminar la tarifa ${item.period} (${item.sizeCategory})?`)) return
    try {
      await priceApi.deletePrice(item.id)
      toast({
        title: 'Tarifa eliminada',
        status: 'info',
        duration: 2500,
      })
      fetchPrices()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('prices_updated'))
      }
    } catch (err) {
      toast({
        title: 'Error al eliminar tarifa',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleSaveProfile = () => {
    updateProfile({
      name,
      email,
      phone,
      dni,
      cuit,
      address,
      city,
    })
    toast({
      title: 'Datos guardados',
      description: 'Tu perfil fue actualizado exitosamente.',
      status: 'success',
      duration: 3000,
    })
  }

  /* =========================================================================
     RENDER: MIS BOXES VIEW (Prototype Page 2)
     ========================================================================= */
  const renderBoxesView = () => (
    <Box maxW="1000px">
      <Heading
        as="h2"
        fontSize={['2xl', '3xl']}
        fontWeight="bold"
        letterSpacing="wider"
        color="primary"
        textTransform="uppercase"
        mb={8}
      >
        MIS BOXES
      </Heading>

      {/* Box Rows or Empty State */}
      {boxes.length === 0 ? (
        <Box
          bg={cardBg}
          p={[6, 10]}
          borderRadius="lg"
          border={dashedBorder}
          textAlign="center"
          mb={8}
        >
          <Box color="gray.400" fontSize="42px" mb={3} display="flex" justifyContent="center">
            <FiBox />
          </Box>
          <Heading as="h3" size="md" color={useColorModeValue('#16284a', 'white')} mb={2}>
            Todavía no tenés ningún box alquilado
          </Heading>
          <Text color="gray.500" fontSize="sm" mb={6} maxW="440px" mx="auto">
            Elegí el tamaño ideal para tus cosas y activá tu primer depósito inteligente en minutos.
          </Text>
          <Button
            leftIcon={<FiPlus />}
            bg="#16284a"
            color="white"
            _hover={{ bg: '#101d36' }}
            px={6}
            h="44px"
            fontWeight="bold"
            onClick={() => navigate('/alquilar')}
          >
            Alquilar mi primer box
          </Button>
        </Box>
      ) : (
        <Stack spacing={4} mb={8}>
          {boxes.map((box) => (
            <Box
              key={box.id}
              bg={cardBg}
              borderRadius="md"
              border={cardBorder}
              boxShadow="0 1px 4px rgba(0,0,0,0.04)"
              py={4}
              px={[4, 6, 8]}
              transition="all 0.2s"
              _hover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            >
              <Flex
                direction={['column', 'row']}
                align={['flex-start', 'center']}
                justify="space-between"
                gap={3}
              >
                {/* Box Identifier */}
                <Box minW={['auto', '140px']}>
                  <Text
                    fontSize={['lg', 'xl']}
                    fontWeight="bold"
                    color={useColorModeValue('#16284a', 'white')}
                    letterSpacing="wide"
                  >
                    {box.boxNumber}
                  </Text>
                </Box>

                {/* Expiration date with Calendar Icon (Prototype Page 2) */}
                <HStack spacing={2.5} color="gray.600">
                  <Box color="#16284a" fontSize="18px">
                    <FiCalendar />
                  </Box>
                  <Text fontSize={['sm', 'md']} fontWeight="medium">
                    Hasta el {box.expiresAt}
                  </Text>
                </HStack>

                {/* Action Buttons: RENOVAR and VER OPERACIÓN ⇄ (Prototype Page 2) */}
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="#16284a"
                    color="#16284a"
                    fontWeight="bold"
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    _hover={{ bg: 'blue.50' }}
                    onClick={() => navigate('/renovar')}
                  >
                    RENOVAR
                  </Button>
                  <Button
                    variant="ghost"
                    rightIcon={<FiRepeat />}
                    color="#16284a"
                    fontWeight="semibold"
                    fontSize="sm"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    _hover={{ bg: 'blue.50', color: 'primary' }}
                    onClick={() => {
                      setSelectedBox(box)
                      onOpOpen()
                    }}
                  >
                    VER OPERACIÓN
                  </Button>
                </HStack>
              </Flex>
            </Box>
          ))}
        </Stack>
      )}

      {/* Button: + Alquilar un nuevo box (Prototype Page 2) */}
      {boxes.length > 0 && (
        <Button
          leftIcon={<FiPlus />}
          bg="#16284a"
          color="white"
          h="48px"
          px={8}
          fontSize="sm"
          fontWeight="bold"
          letterSpacing="wider"
          textTransform="none"
          _hover={{ bg: '#101d36', transform: 'translateY(-1px)' }}
          boxShadow="md"
          onClick={() => navigate('/alquilar')}
        >
          Alquilar un nuevo box
        </Button>
      )}
    </Box>
  )

  /* =========================================================================
     RENDER: INVENTARIO DE BOXES (Admin)
     ========================================================================= */
  const renderInventarioView = () => {
    const filteredBoxes = adminBoxes.filter((b) => {
      const matchSize =
        inventoryFilterSize === 'todos' || b.size.toLowerCase().includes(inventoryFilterSize.toLowerCase())
      const matchStatus =
        inventoryFilterStatus === 'todos' || b.status.toLowerCase() === inventoryFilterStatus.toLowerCase()
      return matchSize && matchStatus
    })

    return (
      <Box maxW="1100px">
        {/* Header */}
        <Flex justify="space-between" align={['flex-start', 'center']} direction={['column', 'row']} gap={4} mb={8}>
          <Box>
            <Heading
              as="h2"
              fontSize={['2xl', '3xl']}
              fontWeight="bold"
              letterSpacing="wider"
              color="primary"
              textTransform="uppercase"
            >
              INVENTARIO DE BOXES
            </Heading>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Supervisá la ocupación en tiempo real, ajustá la cantidad disponible por tamaño y administrá cada unidad.
            </Text>
          </Box>
          <HStack spacing={3}>
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              leftIcon={<FiRefreshCw />}
              isLoading={loadingInventory}
              onClick={fetchInventory}
            >
              Actualizar
            </Button>
            <Button
              size="sm"
              bg="#16284a"
              color="white"
              _hover={{ bg: '#101d36' }}
              leftIcon={<FiPlus />}
              onClick={onAddBoxModalOpen}
            >
              + Nuevo Box
            </Button>
          </HStack>
        </Flex>

        {/* 3 Size Summary Cards */}
        <SimpleGrid columns={[1, 1, 3]} spacing={6} mb={10}>
          {(['Pequeño', 'Mediano', 'Grande'] as const).map((s) => {
            const sum = inventorySummary.find((item) => item.size === s) || {
              size: s,
              dimensions:
                s === 'Pequeño'
                  ? '8.3m² (1.66x5m)'
                  : s === 'Mediano'
                  ? '13.75m² (2.75x5m)'
                  : '20.5m² (4.10x5m)',
              total: 0,
              rented: 0,
              available: 0,
              maintenance: 0,
            }

            const isOut = sum.available === 0

            return (
              <Box
                key={s}
                bg={cardBg}
                borderRadius="lg"
                border="1px solid"
                borderColor={isOut ? 'red.400' : cardBorder}
                boxShadow="sm"
                p={5}
                position="relative"
                overflow="hidden"
                transition="all 0.2s"
                _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h="4px"
                  bg={isOut ? 'red.500' : s === 'Grande' ? 'purple.500' : s === 'Mediano' ? 'blue.500' : 'teal.500'}
                />

                <Flex justify="space-between" align="flex-start" mb={4}>
                  <Box>
                    <Heading as="h3" size="md" color="primary">
                      {s}
                    </Heading>
                    <Text fontSize="xs" color="gray.500">
                      {sum.dimensions}
                    </Text>
                  </Box>
                  <Badge colorScheme={isOut ? 'red' : 'green'} fontSize="xs" px={2} py={0.5}>
                    {isOut ? 'AGOTADO' : `${sum.available} DISPONIBLES`}
                  </Badge>
                </Flex>

                <SimpleGrid columns={3} spacing={2} textAlign="center" py={3} bg={useColorModeValue('gray.50', '#0F172A')} borderRadius="md" mb={4}>
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold" color={isOut ? 'red.500' : 'green.500'}>
                      {sum.available}
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      Disponibles
                    </Text>
                  </Box>
                  <Box borderLeft={cardBorder} borderRight={cardBorder}>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                      {sum.rented}
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      Alquilados
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')}>
                      {sum.total}
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      Total
                    </Text>
                  </Box>
                </SimpleGrid>

                <Button
                  w="100%"
                  size="sm"
                  variant="outline"
                  borderColor={useColorModeValue('#16284a', '#3B82F6')}
                  color={useColorModeValue('#16284a', '#60A5FA')}
                  leftIcon={<FiSliders />}
                  _hover={{ bg: useColorModeValue('blue.50', 'whiteAlpha.100') }}
                  onClick={() => handleOpenCapacityModal(s, sum.total)}
                >
                  Ajustar Capacidad Total
                </Button>
              </Box>
            )
          })}
        </SimpleGrid>

        {/* Individual Boxes Management */}
        <Box bg={cardBg} borderRadius="lg" border={cardBorder} boxShadow="sm" p={6}>
          <Flex justify="space-between" align={['flex-start', 'center']} direction={['column', 'row']} gap={4} mb={6}>
            <Heading as="h3" size="md" color="primary">
              Detalle de Unidades Físicas ({filteredBoxes.length})
            </Heading>
            <HStack spacing={3} wrap="wrap">
              <Select
                size="sm"
                w="160px"
                value={inventoryFilterSize}
                onChange={(e) => setInventoryFilterSize(e.target.value)}
              >
                <option value="todos">Todos los tamaños</option>
                <option value="pequeño">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </Select>
              <Select
                size="sm"
                w="160px"
                value={inventoryFilterStatus}
                onChange={(e) => setInventoryFilterStatus(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="disponible">Disponibles</option>
                <option value="alquilado">Alquilados</option>
                <option value="mantenimiento">Mantenimiento</option>
              </Select>
            </HStack>
          </Flex>

          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Unidad</Th>
                  <Th>Categoría</Th>
                  <Th>Estado</Th>
                  <Th>Inquilino Actual</Th>
                  <Th>Notas</Th>
                  <Th textAlign="right">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredBoxes.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={8} color="gray.500">
                      No se encontraron boxes con los filtros aplicados.
                    </Td>
                  </Tr>
                ) : (
                  filteredBoxes.map((b) => (
                    <Tr key={b.id} _hover={{ bg: 'gray.50' }}>
                      <Td fontWeight="bold" color="primary">
                        <Badge variant="solid" colorScheme="blue" fontSize="xs">
                          {b.box_number}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontWeight="medium" fontSize="sm">
                          {b.size}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {b.dimensions}
                        </Text>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={
                            b.status === 'disponible'
                              ? 'green'
                              : b.status === 'alquilado'
                              ? 'blue'
                              : 'orange'
                          }
                          textTransform="capitalize"
                        >
                          {b.status}
                        </Badge>
                      </Td>
                      <Td>
                        {b.tenant ? (
                          <Box>
                            <Text fontWeight="semibold" fontSize="xs">
                              {b.tenant.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {b.tenant.email} {b.tenant.phone ? `· ${b.tenant.phone}` : ''}
                            </Text>
                            {b.tenant.expires_at && (
                              <Text fontSize="xs" color="blue.600" fontWeight="medium">
                                Vence: {b.tenant.expires_at}
                              </Text>
                            )}
                          </Box>
                        ) : (
                          <Text fontSize="xs" color="gray.400">
                            —
                          </Text>
                        )}
                      </Td>
                      <Td fontSize="xs" color="gray.500">
                        {b.notes || '—'}
                      </Td>
                      <Td textAlign="right">
                        <HStack spacing={1} justify="flex-end">
                          {b.status !== 'alquilado' && (
                            <Button
                              size="xs"
                              variant="outline"
                              colorScheme={b.status === 'mantenimiento' ? 'green' : 'orange'}
                              leftIcon={b.status === 'mantenimiento' ? <FiCheck /> : <FiTool />}
                              onClick={() => handleToggleMaintenance(b)}
                            >
                              {b.status === 'mantenimiento' ? 'Habilitar' : 'Mantenimiento'}
                            </Button>
                          )}
                          {b.status !== 'alquilado' && (
                            <IconButton
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              aria-label="Eliminar box"
                              icon={<FiTrash2 />}
                              onClick={() => handleDeleteBox(b)}
                            />
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>
    )
  }

  /* =========================================================================
     RENDER: PRECIOS VIEW (Prototype Page 1)
     ========================================================================= */
  const renderPreciosView = () => (
    <Box maxW="1000px">
      <Flex justify="space-between" align={['flex-start', 'center']} direction={['column', 'row']} gap={4} mb={8}>
        <Box>
          <Heading
            as="h2"
            fontSize={['2xl', '3xl']}
            fontWeight="bold"
            letterSpacing="wider"
            color="primary"
            textTransform="uppercase"
          >
            TARIFAS Y PRECIOS VIGENTES
          </Heading>
          <Text fontSize="sm" color="gray.600" mt={1}>
            Los cambios que realices aquí se actualizan inmediatamente en toda la web y en los formularios de alquiler.
          </Text>
        </Box>
        <Button
          size="sm"
          variant="outline"
          colorScheme="blue"
          leftIcon={<FiRefreshCw />}
          isLoading={loadingPrices}
          onClick={fetchPrices}
        >
          Actualizar Precios
        </Button>
      </Flex>

      {/* Price Rows (Prototype Page 1) */}
      <Stack spacing={4} mb={8}>
        {prices.map((item) => (
          <Box
            key={item.id}
            bg={cardBg}
            borderRadius="md"
            border={cardBorder}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)"
            py={4}
            px={[4, 6, 8]}
            transition="all 0.2s"
            _hover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          >
            <Flex
              direction={['column', 'row']}
              align={['flex-start', 'center']}
              justify="space-between"
              gap={3}
            >
              {/* Period */}
              <Box minW={['auto', '220px']}>
                <Text
                  fontSize={['lg', 'xl']}
                  fontWeight="bold"
                  color="#16284a"
                  letterSpacing="wide"
                >
                  {item.period}
                </Text>
                {item.sizeCategory && (
                  <Badge colorScheme="blue" fontSize="10px" mt={0.5}>
                    {item.sizeCategory}
                  </Badge>
                )}
              </Box>

              {/* Amount & Promo text */}
              <HStack spacing={2} flex="1">
                <Text fontSize={['lg', 'xl']} fontWeight="bold" color="#16284a">
                  ${' '}
                  {item.amount.toLocaleString('es-AR', {
                    minimumFractionDigits: 0,
                  })}
                </Text>
                {item.promoText && (
                  <Text fontSize={['sm', 'md']} color="gray.500" fontWeight="normal">
                    ({item.promoText})
                  </Text>
                )}
              </HStack>

              {/* Actions: EDITAR & ELIMINAR */}
              <HStack spacing={2}>
                <Button
                  variant="ghost"
                  color="#16284a"
                  fontWeight="semibold"
                  fontSize="sm"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  _hover={{ bg: 'blue.50', color: 'primary' }}
                  onClick={() => handleOpenPriceModal(item)}
                >
                  EDITAR
                </Button>
                <IconButton
                  aria-label="Eliminar tarifa"
                  icon={<FiTrash2 />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => handleDeletePrice(item)}
                  title="Eliminar tarifa"
                />
              </HStack>
            </Flex>
          </Box>
        ))}
      </Stack>

      {/* Button: + AÑADIR NUEVO PRECIO (Prototype Page 1) */}
      <Button
        leftIcon={<FiPlus />}
        bg="#16284a"
        color="white"
        h="48px"
        px={8}
        fontSize="sm"
        fontWeight="bold"
        letterSpacing="wider"
        textTransform="uppercase"
        _hover={{ bg: '#101d36', transform: 'translateY(-1px)' }}
        boxShadow="md"
        onClick={() => handleOpenPriceModal()}
      >
        AÑADIR NUEVO PRECIO
      </Button>
    </Box>
  )

  /* =========================================================================
     RENDER: MIS DATOS VIEW
     ========================================================================= */
  const renderDatosView = () => (
    <Box maxW="800px" bg={cardBg} p={[6, 8]} borderRadius="md" border={cardBorder} boxShadow="sm">
      <Heading
        as="h2"
        fontSize={['xl', '2xl']}
        fontWeight="bold"
        color="primary"
        letterSpacing="wider"
        textTransform="uppercase"
        mb={6}
      >
        MIS DATOS PERSONALES
      </Heading>

      <SimpleGrid columns={[1, 2]} spacing={6} mb={6}>
        <FormControl>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="bold">
            Nombre completo
          </FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="bold">
            Email
          </FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="bold">
            Teléfono de contacto
          </FormLabel>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="bold">
            DNI (Documento de Identidad)
          </FormLabel>
          <Input 
            value={dni} 
            onChange={(e) => setDni(e.target.value)} 
            placeholder="ej: 32456789"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="bold">
            CUIT / CUIL (Facturación AFIP)
          </FormLabel>
          <Input 
            value={cuit} 
            onChange={(e) => setCuit(e.target.value)} 
            placeholder="ej: 20-32456789-4"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="bold">
            Dirección / Domicilio
          </FormLabel>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="bold">
            Localidad / Ciudad
          </FormLabel>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </FormControl>
      </SimpleGrid>

      <HStack spacing={4}>
        <Button
          bg="#16284a"
          color="white"
          _hover={{ bg: '#101d36' }}
          onClick={handleSaveProfile}
        >
          Guardar Cambios
        </Button>
      </HStack>
    </Box>
  )

  /* =========================================================================
     RENDER: MIS OPERACIONES VIEW
     ========================================================================= */
  const renderOperacionesView = () => (
    <Box maxW="1000px">
      <Heading
        as="h2"
        fontSize={['2xl', '3xl']}
        fontWeight="bold"
        letterSpacing="wider"
        color="primary"
        textTransform="uppercase"
        mb={8}
      >
        MIS OPERACIONES
      </Heading>

      {operaciones.length === 0 ? (
        <Box
          bg={cardBg}
          p={[6, 10]}
          borderRadius="lg"
          border={dashedBorder}
          textAlign="center"
          mb={8}
        >
          <Box color="gray.400" fontSize="42px" mb={3} display="flex" justifyContent="center">
            <FiClock />
          </Box>
          <Heading as="h3" size="md" color={useColorModeValue('#16284a', 'white')} mb={2}>
            Todavía no tenés operaciones registradas
          </Heading>
          <Text color="gray.500" fontSize="sm" mb={6} maxW="440px" mx="auto">
            Cuando contrates o renueves un box de guardado, tus comprobantes y transacciones aparecerán aquí.
          </Text>
          <Button
            leftIcon={<FiPlus />}
            bg="#16284a"
            color="white"
            _hover={{ bg: '#101d36' }}
            px={6}
            h="44px"
            fontWeight="bold"
            onClick={() => navigate('/alquilar')}
          >
            Alquilar mi primer box
          </Button>
        </Box>
      ) : (
        <Box bg={cardBg} borderRadius="md" border={cardBorder} overflowX="auto" boxShadow="sm">
          <Table variant="simple" size="md">
            <Thead bg={useColorModeValue('gray.50', '#0F172A')}>
              <Tr>
                <Th>Operación</Th>
                <Th>Box</Th>
                <Th>Fecha</Th>
                <Th>Monto</Th>
                <Th>Estado</Th>
                <Th textAlign="right">Acciones / Comprobante</Th>
              </Tr>
            </Thead>
            <Tbody>
              {operaciones.map((op) => {
                const isPending =
                  op.status === 'pendiente_transferencia' ||
                  op.status === 'pendiente' ||
                  op.status === 'en proceso'

                return (
                  <Tr key={op.id}>
                    <Td fontWeight="bold">{op.code}</Td>
                    <Td>{op.boxNumber}</Td>
                    <Td>{op.date}</Td>
                    <Td fontWeight="bold">$ {op.amount.toLocaleString('es-AR')}</Td>
                    <Td>
                      {op.status === 'pagado' ? (
                        <Badge colorScheme="green">Pagado</Badge>
                      ) : op.status === 'pendiente_transferencia' ? (
                        <Badge colorScheme="orange">En Verificación</Badge>
                      ) : (
                        <Badge colorScheme="yellow">{op.status}</Badge>
                      )}
                    </Td>
                    <Td textAlign="right">
                      <HStack spacing={2} justify="flex-end">
                        {isPending && (
                          <>
                            {op.transferReceiptPath ? (
                              <Button
                                size="xs"
                                variant="outline"
                                colorScheme="teal"
                                leftIcon={<FiEye />}
                                onClick={() => {
                                  const fullUrl = op.transferReceiptPath?.startsWith('http')
                                    ? op.transferReceiptPath
                                    : `${API_BASE_URL.replace('/api', '')}${op.transferReceiptPath}`
                                  setPreviewReceiptUrl(fullUrl)
                                  onReceiptModalOpen()
                                }}
                              >
                                Ver Adjunto
                              </Button>
                            ) : null}
                            <Button
                              size="xs"
                              colorScheme="orange"
                              leftIcon={<FiUpload />}
                              onClick={() => handleOpenUploadModal(op)}
                            >
                              {op.transferReceiptPath ? 'Reemplazar' : 'Subir Comprobante'}
                            </Button>
                          </>
                        )}
                        {op.status === 'pagado' && (
                          <Button
                            size="xs"
                            variant="outline"
                            colorScheme="blue"
                            leftIcon={<FiDownload />}
                            onClick={() => {
                              const cleanCode = op.code.replace('#', '')
                              window.open(`${API_BASE_URL}/contract/${cleanCode}`, '_blank')
                            }}
                          >
                            Contrato / Recibo
                          </Button>
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  )

  /* =========================================================================
     RENDER: ADMIN OPERACIONES Y TRANSFERENCIAS VIEW
     ========================================================================= */
  const renderAdminOperacionesView = () => {
    const filteredOps = adminOperations.filter((op) => {
      if (filterOpStatus === 'pendientes') {
        return op.payment_status === 'pendiente_transferencia' || op.payment_status === 'pendiente'
      }
      if (filterOpStatus === 'pagadas') {
        return op.payment_status === 'pagado'
      }
      return true
    })

    const countPending = adminOperations.filter(
      (o) => o.payment_status === 'pendiente_transferencia' || o.payment_status === 'pendiente'
    ).length

    return (
      <Box maxW="1100px">
        <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={3}>
          <Box>
            <Heading
              as="h2"
              fontSize={['2xl', '3xl']}
              fontWeight="bold"
              letterSpacing="wider"
              color="primary"
              textTransform="uppercase"
            >
              OPERACIONES Y TRANSFERENCIAS
            </Heading>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Controlá cobros, revisá comprobantes adjuntos y aprobá transferencias bancarias.
            </Text>
          </Box>
          <HStack spacing={2}>
            <Button
              size="sm"
              variant={filterOpStatus === 'todos' ? 'solid' : 'outline'}
              bg={filterOpStatus === 'todos' ? '#1E3264' : 'transparent'}
              color={filterOpStatus === 'todos' ? 'white' : 'gray.700'}
              _hover={{ bg: filterOpStatus === 'todos' ? '#16284a' : 'gray.100' }}
              onClick={() => setFilterOpStatus('todos')}
            >
              Todas ({adminOperations.length})
            </Button>
            <Button
              size="sm"
              variant={filterOpStatus === 'pendientes' ? 'solid' : 'outline'}
              colorScheme="orange"
              onClick={() => setFilterOpStatus('pendientes')}
            >
              Por Aprobar ({countPending})
            </Button>
            <Button
              size="sm"
              variant={filterOpStatus === 'pagadas' ? 'solid' : 'outline'}
              colorScheme="green"
              onClick={() => setFilterOpStatus('pagadas')}
            >
              Pagadas ({adminOperations.filter((o) => o.payment_status === 'pagado').length})
            </Button>
            <IconButton
              aria-label="Refrescar operaciones"
              icon={<FiRefreshCw />}
              size="sm"
              variant="outline"
              isLoading={loadingAdminOps}
              onClick={fetchAdminOperations}
            />
          </HStack>
        </Flex>

        {loadingAdminOps ? (
          <Box bg={cardBg} p={12} textAlign="center" borderRadius="md" border={cardBorder}>
            <Text color="gray.500">Cargando operaciones...</Text>
          </Box>
        ) : filteredOps.length === 0 ? (
          <Box bg={cardBg} p={10} textAlign="center" borderRadius="md" border={dashedBorder}>
            <Text color="gray.500">No se encontraron operaciones para este criterio.</Text>
          </Box>
        ) : (
          <Box bg={cardBg} borderRadius="md" border={cardBorder} overflowX="auto" boxShadow="sm">
            <Table variant="simple" size="sm">
              <Thead bg={useColorModeValue('gray.50', '#0F172A')}>
                <Tr>
                  <Th py={3}>Operación</Th>
                  <Th>Fecha</Th>
                  <Th>Cliente</Th>
                  <Th>Unidad</Th>
                  <Th>Monto</Th>
                  <Th>Medio de Pago</Th>
                  <Th>Comprobante / Ref</Th>
                  <Th>Estado</Th>
                  <Th textAlign="right">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredOps.map((op) => {
                  const isPending =
                    op.payment_status === 'pendiente_transferencia' || op.payment_status === 'pendiente'
                  return (
                    <Tr key={op.id} _hover={{ bg: 'gray.50' }}>
                      <Td fontWeight="bold" fontSize="xs" color="gray.800">
                        {op.operation_code || (op as any).code || `#OP-${op.id}`}
                      </Td>
                      <Td fontSize="xs" color="gray.600">
                        {op.created_at}
                      </Td>
                      <Td>
                        <Text fontWeight="bold" fontSize="xs">
                          {op.user?.name || (op as any).client_name || 'Cliente'}
                        </Text>
                        <Text fontSize="11px" color="gray.500">
                          {op.user?.email || (op as any).client_email}
                        </Text>
                        {(op.user?.phone || (op as any).client_phone) && (
                          <Text fontSize="10px" color="gray.400">
                            Tel: {op.user?.phone || (op as any).client_phone}
                          </Text>
                        )}
                      </Td>
                      <Td>
                        <Badge colorScheme="blue" variant="subtle">
                          {op.box?.box_number || (op as any).box_number || 'BOX'}
                        </Badge>
                        <Text fontSize="10px" color="gray.500">
                          {op.box?.size || (op as any).size}
                        </Text>
                      </Td>
                      <Td fontWeight="bold" fontSize="xs">
                        $ {op.amount.toLocaleString('es-AR')}
                      </Td>
                      <Td fontSize="xs" maxW="150px" isTruncated>
                        {op.payment_method || 'Mercado Pago'}
                      </Td>
                      <Td fontSize="xs">
                        {op.transfer_receipt_path ? (
                          <HStack spacing={1}>
                            <Button
                              size="xs"
                              colorScheme="teal"
                              variant="outline"
                              leftIcon={<FiEye />}
                              onClick={() => {
                                const fullUrl = op.transfer_receipt_path?.startsWith('http')
                                  ? op.transfer_receipt_path
                                  : `${API_BASE_URL.replace('/api', '')}${op.transfer_receipt_path}`
                                setPreviewReceiptUrl(fullUrl)
                                onReceiptModalOpen()
                              }}
                            >
                              Ver Adjunto
                            </Button>
                          </HStack>
                        ) : null}
                        {op.transfer_reference ? (
                          <Text fontSize="11px" color="gray.600" mt={0.5}>
                            Ref: <strong>{op.transfer_reference}</strong>
                          </Text>
                        ) : !op.transfer_receipt_path ? (
                          <Text fontSize="11px" color="gray.400">
                            -
                          </Text>
                        ) : null}
                      </Td>
                      <Td>
                        {op.payment_status === 'pagado' ? (
                          <Badge colorScheme="green">Pagado</Badge>
                        ) : op.payment_status === 'pendiente_transferencia' ? (
                          <Badge colorScheme="orange">Por Aprobar</Badge>
                        ) : (
                          <Badge colorScheme="yellow">Pendiente</Badge>
                        )}
                      </Td>
                      <Td textAlign="right">
                        <HStack spacing={1} justify="flex-end">
                          {isPending && (
                            <Button
                              size="xs"
                              bg="#16A34A"
                              _hover={{ bg: '#15803D' }}
                              color="white"
                              leftIcon={<FiCheckCircle />}
                              isLoading={approvingOpId === op.id}
                              onClick={() => handleApproveTransfer(op)}
                              fontWeight="bold"
                              boxShadow="sm"
                              px={3}
                            >
                              Aprobar
                            </Button>
                          )}
                          {op.payment_status === 'pagado' && (
                            <Button
                              size="xs"
                              variant="outline"
                              colorScheme="blue"
                              leftIcon={<FiFileText />}
                              onClick={() => {
                                const cleanCode = op.operation_code.replace('#', '')
                                window.open(`${API_BASE_URL}/contract/${cleanCode}`, '_blank')
                              }}
                            >
                              Contrato
                            </Button>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    )
  }

  /* =========================================================================
     RENDER: CLIENTES VIEW (Admin)
     ========================================================================= */
  const renderClientesView = () => (
    <Box maxW="1000px">
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={3}>
        <Heading
          as="h2"
          fontSize={['2xl', '3xl']}
          fontWeight="bold"
          letterSpacing="wider"
          color="primary"
          textTransform="uppercase"
        >
          CLIENTES REGISTRADOS ({clients.length})
        </Heading>
        <Button
          size="sm"
          variant="outline"
          colorScheme="blue"
          leftIcon={<FiRefreshCw />}
          isLoading={loadingClients}
          onClick={fetchClients}
        >
          Actualizar en tiempo real
        </Button>
      </Flex>

      <Box bg={cardBg} borderRadius="md" border={cardBorder} overflowX="auto" boxShadow="sm">
        <Table variant="simple">
          <Thead bg={useColorModeValue('gray.50', '#0F172A')}>
            <Tr>
              <Th>Cliente</Th>
              <Th>Contacto</Th>
              <Th>Boxes Activos</Th>
              <Th>Estado</Th>
              <Th textAlign="right">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.length === 0 ? (
              <Tr>
                <Td colSpan={5} textAlign="center" py={6} color="gray.500">
                  No hay clientes registrados en este momento.
                </Td>
              </Tr>
            ) : (
              clients.map((c) => (
                <Tr key={c.id}>
                  <Td>
                    <Text fontWeight="bold">{c.name}</Text>
                    <HStack spacing={2} fontSize="xs" color="gray.500">
                      {c.dni ? <Text>DNI {c.dni}</Text> : null}
                      {c.cuit ? <Text>· CUIT {c.cuit}</Text> : null}
                    </HStack>
                  </Td>
                  <Td>
                    <Text fontSize="sm">{c.email}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {c.phone || 'Sin teléfono'} · {c.city || 'Chivilcoy'}
                    </Text>
                  </Td>
                  <Td>
                    {c.active_boxes && c.active_boxes.length > 0 ? (
                      c.active_boxes.map((b, i) => (
                        <Badge key={i} colorScheme="blue" mr={1}>
                          {b}
                        </Badge>
                      ))
                    ) : (
                      <Badge colorScheme="gray">Sin boxes activos</Badge>
                    )}
                  </Td>
                  <Td>
                    <Badge colorScheme={c.active_boxes && c.active_boxes.length > 0 ? 'green' : 'yellow'}>
                      {c.status || (c.active_boxes && c.active_boxes.length > 0 ? 'Al día' : 'Registrado')}
                    </Badge>
                  </Td>
                  <Td textAlign="right">
                    <Button
                      size="xs"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() =>
                        toast({
                          title: 'Ficha de Cliente',
                          description: `${c.name} (${c.email}) - DNI: ${c.dni || 'S/D'} · CUIT: ${c.cuit || 'S/C'}`,
                          status: 'info',
                          duration: 4000,
                        })
                      }
                    >
                      Ver Ficha
                    </Button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )

  /* =========================================================================
     RENDER: CONTRATO VIEW (Admin)
     ========================================================================= */
  const renderContratoView = () => (
    <Box maxW="900px" bg={cardBg} p={[6, 8]} borderRadius="md" border={cardBorder} boxShadow="sm">
      <Heading
        as="h2"
        fontSize={['xl', '2xl']}
        fontWeight="bold"
        color="primary"
        letterSpacing="wider"
        textTransform="uppercase"
        mb={4}
      >
        PLANTILLA DE CONTRATO DE ALQUILER
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Términos y condiciones legales aplicados a los contratos emitidos automáticamente para cada
        unidad rentada.
      </Text>
      <FormControl mb={4}>
        <Textarea
          rows={12}
          defaultValue={`CONTRATO DE LOCACIÓN DE ESPACIO DE ALMACENAJE (BOX)

Entre GUARDALO.COM ("La Locadora") y el CLIENTE ("El Locatario"):
PRIMERA: El Locatario alquila el espacio individual determinado asignado para almacenamiento temporal de enseres y mercadería no peligrosa.
SEGUNDA: El pago se efectuará por período anticipado. El vencimiento operará de pleno derecho al término del período contratado.
TERCERA: Queda prohibido el almacenamiento de sustancias inflamables, tóxicas, ilegales o perecederas.`}
          fontSize="sm"
          fontFamily="monospace"
        />
      </FormControl>
      <Button
        bg="#16284a"
        color="white"
        _hover={{ bg: '#101d36' }}
        onClick={() =>
          toast({
            title: 'Términos actualizados',
            description: 'La plantilla de contrato ha sido guardada.',
            status: 'success',
          })
        }
      >
        Actualizar Plantilla
      </Button>
    </Box>
  )

  return (
    <>
      <SEO
        title={
          activeTab === 'boxes'
            ? 'Mis Boxes'
            : activeTab === 'inventario'
            ? 'Inventario de Boxes'
            : activeTab === 'precios'
            ? 'Precios - Administración'
            : 'Panel'
        }
      />
      <DashboardLayout currentTab={activeTab} onSelectTab={setActiveTab}>
        {activeTab === 'boxes' && renderBoxesView()}
        {activeTab === 'inventario' && renderInventarioView()}
        {activeTab === 'precios' && renderPreciosView()}
        {activeTab === 'datos' && renderDatosView()}
        {activeTab === 'operaciones' && renderOperacionesView()}
        {activeTab === 'clientes' && renderClientesView()}
        {activeTab === 'contrato' && renderContratoView()}
        {activeTab === 'admin_operaciones' && renderAdminOperacionesView()}

        {/* Modal: VER OPERACIÓN (Prototype Page 2 detail) */}
        <Modal isOpen={isOpOpen} onClose={onOpClose} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="primary" borderBottom="1px solid #e2e8f0">
              Detalle de Operación - {selectedBox?.boxNumber}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
              {selectedBox && (
                <Stack spacing={4}>
                  <HStack justify="space-between" bg="blue.50" p={3} borderRadius="md">
                    <Text fontWeight="bold" color="primary">
                      Estado del Alquiler:
                    </Text>
                    <Badge colorScheme="green" fontSize="sm" px={2} py={0.5}>
                      Activo / Al día
                    </Badge>
                  </HStack>

                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                        Unidad
                      </Text>
                      <Text fontWeight="bold">{selectedBox.boxNumber}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                        Tamaño
                      </Text>
                      <Text fontWeight="medium" fontSize="sm">
                        {selectedBox.size}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                        Fecha de Inicio
                      </Text>
                      <Text fontWeight="medium">{selectedBox.startDate}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                        Vigente Hasta
                      </Text>
                      <Text fontWeight="bold" color="#16284a">
                        {selectedBox.expiresAt}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                        Tarifa Período
                      </Text>
                      <Text fontWeight="bold">
                        ${' '}
                        {selectedBox.monthlyPrice.toLocaleString('es-AR', {
                          minimumFractionDigits: 0,
                        })}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                        Titular
                      </Text>
                      <Text fontWeight="medium">{user?.name || 'Juan López'}</Text>
                    </Box>
                  </SimpleGrid>

                  <Divider />

                  <HStack spacing={3}>
                    <Button
                      size="sm"
                      leftIcon={<FiDownload />}
                      variant="outline"
                      w="50%"
                      onClick={() =>
                        toast({
                          title: 'Descarga iniciada',
                          description: `Descargando contrato para ${selectedBox.boxNumber}...`,
                          status: 'info',
                        })
                      }
                    >
                      Descargar Contrato PDF
                    </Button>
                    <Button
                      size="sm"
                      bg="primary"
                      color="white"
                      _hover={{ bg: '#101d36' }}
                      w="50%"
                      onClick={() => {
                        onOpClose()
                        navigate('/renovar')
                      }}
                    >
                      Renovar Período
                    </Button>
                  </HStack>
                </Stack>
              )}
            </ModalBody>
            <ModalFooter bg="gray.50" borderTop="1px solid #e2e8f0">
              <Button onClick={onOpClose}>Cerrar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal: AÑADIR / EDITAR PRECIO (Prototype Page 1 feature) */}
        <Modal isOpen={isPriceModalOpen} onClose={onPriceModalClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="primary" borderBottom="1px solid #e2e8f0">
              {editingPrice ? 'Editar Tarifa' : 'Añadir Nuevo Precio'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="bold">
                    Categoría de Tamaño
                  </FormLabel>
                  <Select
                    value={priceCategory}
                    onChange={(e) => setPriceCategory(e.target.value)}
                  >
                    <option value="Pequeño (8.3m²)">Pequeño (8.3m²)</option>
                    <option value="Mediano (13.75m²)">Mediano (13.75m²)</option>
                    <option value="Grande (20.5m²)">Grande (20.5m²)</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="bold">
                    Período / Duración
                  </FormLabel>
                  <Input
                    placeholder="ej: 1 DÍA, 30 DÍAS, 90 DÍAS, 180 DÍAS"
                    value={pricePeriod}
                    onChange={(e) => setPricePeriod(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="bold">
                    Precio ($)
                  </FormLabel>
                  <Input
                    type="number"
                    placeholder="60000"
                    value={priceAmount}
                    onChange={(e) =>
                      setPriceAmount(e.target.value === '' ? '' : Number(e.target.value))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="bold">
                    Etiqueta Promocional (Opcional)
                  </FormLabel>
                  <Input
                    placeholder="ej: promo +10 días"
                    value={pricePromo}
                    onChange={(e) => setPricePromo(e.target.value)}
                  />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter bg="gray.50" borderTop="1px solid #e2e8f0">
              <Button variant="ghost" mr={3} onClick={onPriceModalClose}>
                Cancelar
              </Button>
              <Button
                bg="#16284a"
                color="white"
                _hover={{ bg: '#101d36' }}
                onClick={handleSavePrice}
              >
                {editingPrice ? 'Guardar Cambios' : 'Crear Precio'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal: AJUSTAR CAPACIDAD TOTAL (Admin) */}
        <Modal isOpen={isCapacityModalOpen} onClose={onCapacityModalClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="primary">Ajustar Capacidad - {capacitySize}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontSize="sm" color="gray.600" mb={4}>
                Establecé el total deseado de boxes para la categoría <strong>{capacitySize}</strong>.
                Si aumentás la cantidad, se darán de alta automáticamente nuevos boxes disponibles. Si la reducís,
                se eliminarán únicamente unidades libres que no estén alquiladas.
              </Text>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="bold">
                  Cantidad Total de Boxes
                </FormLabel>
                <Input
                  type="number"
                  min={1}
                  max={200}
                  value={targetCapacity}
                  onChange={(e) => setTargetCapacity(parseInt(e.target.value) || 0)}
                  fontSize="lg"
                  fontWeight="bold"
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCapacityModalClose}>
                Cancelar
              </Button>
              <Button
                bg="#16284a"
                color="white"
                _hover={{ bg: '#101d36' }}
                isLoading={savingCapacity}
                onClick={handleSaveCapacity}
              >
                Guardar Capacidad
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal: AGREGAR BOX INDIVIDUAL (Admin) */}
        <Modal isOpen={isAddBoxModalOpen} onClose={onAddBoxModalClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="primary">Agregar Nueva Unidad Física</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Número / Código de Box</FormLabel>
                  <Input
                    placeholder="ej: BOX 20"
                    value={newBoxNumber}
                    onChange={(e) => setNewBoxNumber(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Tamaño</FormLabel>
                  <Select
                    value={newBoxSize}
                    onChange={(e) => setNewBoxSize(e.target.value as any)}
                  >
                    <option value="Pequeño">Pequeño (8.3m²)</option>
                    <option value="Mediano">Mediano (13.75m²)</option>
                    <option value="Grande">Grande (20.5m²)</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Estado Inicial</FormLabel>
                  <Select
                    value={newBoxStatus}
                    onChange={(e) => setNewBoxStatus(e.target.value as any)}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="mantenimiento">En Mantenimiento</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Notas / Ubicación interna</FormLabel>
                  <Input
                    placeholder="ej: Pasillo A, planta baja"
                    value={newBoxNotes}
                    onChange={(e) => setNewBoxNotes(e.target.value)}
                  />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onAddBoxModalClose}>
                Cancelar
              </Button>
              <Button
                bg="#16284a"
                color="white"
                _hover={{ bg: '#101d36' }}
                isLoading={savingBox}
                onClick={handleCreateBox}
              >
                Crear Box
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal: SUBIR COMPROBANTE DE TRANSFERENCIA (Client) */}
        <Modal isOpen={isUploadOpen} onClose={onUploadClose} size="md" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="primary" borderBottom="1px solid #e2e8f0">
              Registrar Transferencia - {uploadingOp?.code}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
              <Stack spacing={4}>
                <Box bg="blue.50" p={4} borderRadius="md" border="1px solid #bee3f8">
                  <Text fontSize="xs" fontWeight="bold" color="primary" textTransform="uppercase" mb={1}>
                    Datos de la Cuenta Guardalo
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    <strong>Banco:</strong> Santander Río<br />
                    <strong>Titular:</strong> Guardalo S.A.<br />
                    <strong>CBU:</strong> 0720123420000001234567<br />
                    <strong>Alias:</strong> GUARDALO.CHIVILCOY
                  </Text>
                </Box>

                {uploadingOp && (
                  <HStack justify="space-between" bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="sm" color="gray.600">Monto a abonar:</Text>
                    <Text fontWeight="bold" color="#1E3264" fontSize="lg">
                      $ {uploadingOp.amount.toLocaleString('es-AR')}
                    </Text>
                  </HStack>
                )}

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="bold">
                    Número de Comprobante / Referencia
                  </FormLabel>
                  <Input
                    placeholder="ej: 1234567890 o ID de transacción"
                    value={transferRefInput}
                    onChange={(e) => setTransferRefInput(e.target.value)}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Ingresá el número que figura en el recibo de tu homebanking.
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="bold">
                    Adjuntar Foto o Comprobante PDF (Opcional)
                  </FormLabel>
                  <Input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,application/pdf"
                    p={1}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setReceiptFileInput(e.target.files[0])
                      }
                    }}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Formatos aceptados: JPG, PNG o PDF (hasta 10MB).
                  </Text>
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter bg="gray.50" borderTop="1px solid #e2e8f0">
              <Button variant="ghost" mr={3} onClick={onUploadClose}>
                Cancelar
              </Button>
              <Button
                bg="#16284a"
                color="white"
                _hover={{ bg: '#101d36' }}
                isLoading={submittingReceipt}
                onClick={handleConfirmTransferSubmit}
                leftIcon={<FiUpload />}
              >
                Enviar Comprobante
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal: PREVISUALIZAR COMPROBANTE DE TRANSFERENCIA */}
        <Modal isOpen={isReceiptModalOpen} onClose={onReceiptModalClose} size="2xl" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="primary" borderBottom="1px solid #e2e8f0">
              Comprobante de Pago Adjunto
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6} textAlign="center">
              {previewReceiptUrl ? (
                previewReceiptUrl.toLowerCase().endsWith('.pdf') ? (
                  <Stack spacing={4} align="center">
                    <Text fontSize="sm" color="gray.600">
                      El comprobante adjunto es un archivo PDF.
                    </Text>
                    <Button
                      as="a"
                      href={previewReceiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      colorScheme="blue"
                      leftIcon={<FiDownload />}
                    >
                      Abrir / Descargar PDF
                    </Button>
                  </Stack>
                ) : (
                  <Box maxH="550px" overflowY="auto">
                    <img
                      src={previewReceiptUrl}
                      alt="Comprobante de transferencia"
                      style={{ maxWidth: '100%', maxHeight: '500px', margin: '0 auto', borderRadius: '8px' }}
                    />
                  </Box>
                )
              ) : (
                <Text color="gray.500">No hay comprobante disponible.</Text>
              )}
            </ModalBody>
            <ModalFooter bg="gray.50" borderTop="1px solid #e2e8f0">
              {previewReceiptUrl && (
                <Button
                  as="a"
                  href={previewReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  mr="auto"
                  leftIcon={<FiDownload />}
                >
                  Abrir en pestaña nueva
                </Button>
              )}
              <Button size="sm" onClick={onReceiptModalClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </DashboardLayout>
    </>
  )
}

export default PanelPage
