'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  faqs: Array<{ q: string; a: string }>
}

export default function FaqAccordion({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-700 pr-4">{faq.q}</span>
            {open === i
              ? <ChevronUp className="w-4 h-4 text-[#4a43c4] shrink-0" />
              : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
            }
          </button>
          {open === i && (
            <div className="px-4 py-3 text-sm text-gray-600 leading-relaxed bg-white">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
