export function NotFound() {
  return (
    <div className=" w-screen h-screen flex flex-col gap-8 justify-center items-center">
      <h1 className="text-gray-100 font-semibold text-2xl">
        OPS! Essa página não existe! 😢
      </h1>

      <a
        href="/"
        className="text-sm font-semibold text-green-100 text-center hover:text-green-200 transition ease-linear"
      >
        Voltar para o início
      </a>
    </div>
  )
}
