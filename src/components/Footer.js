import Mark from "./Mark";
import { business } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-jade">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Mark size={30} />
            <div className="font-display text-ivory font-semibold">{business.name}</div>
          </div>
          <div className="font-body text-sm text-sage">
            {business.address} · {business.hours}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 font-body text-xs text-sage">
          © {new Date().getFullYear()} Thoth of Codes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
