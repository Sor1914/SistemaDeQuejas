import type { SeguimientoRow } from '../types';
import { FlagIcon, SpinnerDots, CheckIcon } from './icons';

function Pill({
  active, label, icon
}: { active: boolean; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-24 h-24 rounded-full grid place-content-center"
        style={{
          background: active ? 'rgba(16,185,129,.9)' : 'rgba(107,114,128,.8)',
          color: '#fff'
        }}
      >
        {icon}
      </div>
      <div className="text-sm font-semibold">{label}</div>
    </div>
  );
}

export default function AutoconsultaModal({
  open, onClose, data
}: { open: boolean; onClose: () => void; data: SeguimientoRow }) {
  if (!open) return null;

  const estadoNum = Number(data.Id_Estado_Externo ?? 0); // 1 / 4 / 9
  const presentado = estadoNum >= 1;
  const analisis = estadoNum >= 4;
  const finalizado = estadoNum >= 9;

  const fecha = data.Fecha ? new Date(data.Fecha) : null;
  const fechaTexto = fecha
    ? fecha.toLocaleDateString() + (data.Hora ? ` ${data.Hora}` : '')
    : (data.Hora ?? '');

  let leyenda = 'A la fecha se está atendiendo su queja';
  if (estadoNum === 4) leyenda = 'Su queja se encuentra en análisis';
  if (estadoNum === 9) leyenda = 'Su queja fue finalizada';

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-3xl rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', color: 'var(--ink)' }}>
          <div className="px-5 py-3 text-white text-lg font-semibold" style={{ background: '#000' }}>
            Estado de Queja {data.Correlativo}
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center gap-10">
              <Pill active={presentado} label="Presentado" icon={<FlagIcon width={44} height={44} />} />
              <Pill active={analisis} label="En Análisis" icon={<SpinnerDots width={60} height={60} />} />
              <Pill active={finalizado} label="Finalizado" icon={<CheckIcon width={44} height={44} />} />
            </div>

            <p className="text-center text-base" style={{ color: 'var(--ink)' }}>
              {leyenda}{fechaTexto ? ` ingresada el ${fechaTexto}` : ''}.
            </p>
          </div>

          <div className="border-t p-3 flex justify-end" style={{ borderColor: 'var(--border)' }}>
            <button className="btn btn-outline hover-black" onClick={onClose}>Cerrar ✕</button>
          </div>
        </div>
      </div>
    </div>
  );
}
