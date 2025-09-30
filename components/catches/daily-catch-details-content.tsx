import { Card } from "@/components/ui/card"

interface DailyCatchDetailsContentProps {
  date: string
}

interface CatchDetail {
  species: string
  kgCaught: number
  pricePerKg: number
  subtotal: number
}

interface ShipCatchData {
  shipName: string
  crewCount: number
  totalIncome: number
  catches: CatchDetail[]
}

export function DailyCatchDetailsContent({ date }: DailyCatchDetailsContentProps) {
  // Mock data - in real app, this would come from API/database
  const shipCatchData: ShipCatchData[] = [
    {
      shipName: "El Sol",
      crewCount: 4,
      totalIncome: 3750.0,
      catches: [
        {
          species: "Anchoveta",
          kgCaught: 1500,
          pricePerKg: 2.5,
          subtotal: 3750.0,
        },
      ],
    },
    {
      shipName: "La Perla",
      crewCount: 3,
      totalIncome: 2210.0,
      catches: [
        {
          species: "Bonito",
          kgCaught: 450,
          pricePerKg: 3.8,
          subtotal: 1710.0,
        },
        {
          species: "Jurel",
          kgCaught: 200,
          pricePerKg: 2.5,
          subtotal: 500.0,
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {shipCatchData.map((ship, index) => (
        <Card key={index} className="bg-slate-800/50 border-slate-700 p-6">
          {/* Ship Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Ship: {ship.shipName}</h2>
              <p className="text-slate-400">Crew: {ship.crewCount}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400 mb-1">Total Income for Trip</p>
              <p className="text-2xl font-bold text-blue-400">
                S/ {ship.totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Catch Details Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Species</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Kg Caught</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Price/kg</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {ship.catches.map((catchDetail, catchIndex) => (
                  <tr key={catchIndex} className="border-b border-slate-700/50">
                    <td className="py-4 px-4 text-white">{catchDetail.species}</td>
                    <td className="py-4 px-4 text-right text-slate-300">{catchDetail.kgCaught.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right text-slate-300">S/ {catchDetail.pricePerKg.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right text-white font-medium">
                      S/ {catchDetail.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  )
}
