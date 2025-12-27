import Link from "next/link";

interface Props {
  compact?: boolean;
}

export default function PromoBanner({ compact = false }: Props) {
  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
            $
          </div>
          <div>
            <div className="text-xs text-gray-600">Need help financing?</div>
            <div className="text-sm font-black text-gray-900">
              Get financing · Value your car
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/get-financing"
            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-md text-sm font-bold"
          >
            Get
          </Link>

          <Link
            href="/value-my-car"
            className="inline-flex items-center gap-1 bg-white border border-emerald-200 text-emerald-700 px-3 py-1 rounded-md text-sm font-bold hover:bg-emerald-50"
          >
            Value
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 bg-gradient-to-r from-emerald-50 to-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-lg">
            $
          </div>
          <div>
            <div className="text-sm text-gray-600">Need help financing?</div>
            <div className="text-lg font-black text-gray-900">
              Get Financing or Value Your Car
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/get-financing"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold"
          >
            Get Financing
          </Link>

          <Link
            href="/value-my-car"
            className="inline-flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl font-bold hover:bg-emerald-50"
          >
            Value My Car
          </Link>
        </div>
      </div>
    </div>
  );
}
