export default function UnauthorizedPage() {

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
    ">

      <div className="
        bg-white
        p-10
        rounded-2xl
        shadow
        text-center
      ">

        <h1 className="
          text-4xl
          font-bold
          text-red-600
          mb-4
        ">
          Acceso Denegado
        </h1>

        <p className="
          text-gray-600
        ">
          No tienes permisos para acceder a esta página.
        </p>

      </div>

    </div>

  )
}
