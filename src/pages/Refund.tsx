import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { z, ZodError } from "zod"
import { AxiosError } from "axios"

import { api, BASE_URL } from "../services/api"

import fileSvg from "../assets/file.svg"

import { CATEGORIES, CATEGORIES_KEYS } from "../utils/categories"

import { Input } from "../components/Input"
import { Select } from "../components/Select"
import { Upload } from "../components/Upload"
import { Button } from "../components/Button"
import { formatCurrency } from "../utils/formatCurrency"

const refundSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Informe um nome descritivo para sua solicitação" }),
  category: z.string().min(1, { message: "Informe a categoria" }),
  amount: z.coerce
    .number({ message: "Informe um valor válido" })
    .positive({ message: "Informe um valor válido e superior a 0(zero)" }),
})

export function Refund() {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileURL, setFileURL] = useState<string | null>(null)

  const navigate = useNavigate()
  const params = useParams<{ id: string }>()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (params.id) {
      return navigate(-1)
    }

    try {
      setIsLoading(true)

      if (!file) {
        return alert("Selecione um arquivo de comprovante")
      }

      const fileUploadForm = new FormData()
      fileUploadForm.append("file", file)

      const response = await api.post("/uploads", fileUploadForm)

      const data = refundSchema.parse({
        name,
        category,
        amount: amount.replace(",", "."),
      })
      console.log(data)
      await api.post("/refunds", {
        ...data,
        filename: response.data.filename,
      })

      navigate("/confirm", { state: { fromSubmit: true } })
    } catch (error) {
      if (error instanceof ZodError) {
        return { message: error.issues[0].message }
      }

      if (error instanceof AxiosError) {
        return alert(error.response?.data.message)
      }

      return alert("Não foi possível realizar a solicitação")
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchRefund(id: string) {
    try {
      const { data } = await api.get<RefundsAPIResponse>(`/refunds/${id}`)

      setName(data.name)
      setCategory(data.category)
      setAmount(formatCurrency(data.amount))
      setFileURL(data.filename)
    } catch (error) {
      if (error instanceof AxiosError) {
        return alert(error.response?.data.message)
      }

      return alert("não foi possível carregar")
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchRefund(params.id)
    }
  }, [params.id])

  return (
    <form
      onSubmit={onSubmit}
      className="bg-gray-500 justify-self-center w-full rounded-xl flex flex-col p-10 gap-6 lg:min-w-128.5"
    >
      <header>
        <h1 className="text-xl font-bold text-gray-100">
          Solicitação de reembolso
        </h1>
        <p className="text-sm text-gray-200 mt-2 mb-4">
          dados de despesas para solicitar reembolso.
        </p>
      </header>

      <Input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        legend="Nome da solicitação"
        disabled={!!params.id}
      />

      <div className="flex gap-4">
        <Select
          required
          legend="categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={!!params.id}
        >
          {CATEGORIES_KEYS.map((category) => (
            <option key={category} value={category}>
              {CATEGORIES[category].name}
            </option>
          ))}
        </Select>

        <Input
          legend="valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          placeholder="R$0,00"
          disabled={!!params.id}
        />
      </div>

      {params.id && fileURL ? (
        <a
          href={`${BASE_URL}/uploads/${fileURL}`}
          target="_blank"
          className="text-sm text-green-100 font-semibold flex items-center justify-center gap-2 my-6 hover:opacity-70 transition ease-linear"
        >
          <img src={fileSvg} alt="ícone de arquivo" />
          Abrir comprovante
        </a>
      ) : (
        <Upload
          filename={file && file.name}
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
      )}

      <p className="text-sm text-red-600 text-center my-4 font-medium">{}</p>

      <Button type="submit" isLoading={isLoading}>
        {params.id ? "Voltar" : "Enviar"}
      </Button>
    </form>
  )
}
