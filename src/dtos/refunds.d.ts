type RefundsAPIResponse = {
  id: string
  userId: string
  name: string
  category: CategoriesAPIEnum
  amount: number
  filename: string
  user: {
    name: string
  }
}

type RefundsPaginationAPIResponse = {
  refunds: RefundsAPIResponse[]
  pagination: {
    page: number
    perPage: number
    totalPages: number
  }
}
