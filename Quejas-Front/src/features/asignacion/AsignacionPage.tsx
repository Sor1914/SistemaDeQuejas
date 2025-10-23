/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from "../../features/auth/AuthContext";
import {axiosClient} from '../../lib/axiosClient';
import type { AxiosInstance } from 'axios';


/* ========= Tipos ========= */
type Row = {
  Id_Encabezado: number;
  Correlativo: string;
  Fecha: string;
};

type EncabezadoDetalle = {
  Id_Encabezado: number;
  Correlativo: string;
  Nombres: string;
  Apellidos: string;
  Email: string;
  Telefono: string;
  Estado_Interno: string;
  Nombre_Region: string;
  Nombre_Punto_Atencion: string;
  Detalle: string;
  Direccion_Archivo?: string;
};

type Region = {
  Id_Region: number;
  Nombre_Region: string;
};

type PuntoAtencion = {
  Id: number;
  NombrePuntoAtencion: string;
  IdRegion: number;
};

/* ========= Íconos ========= */
function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        fill="currentColor"
        d="M12 5c-5 0-9.27 3.11-11 7c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7m0 12a5 5 0 1 1 0-10a5 5 0 0 1 0 10m0-2a3 3 0 1 0 0-6a3 3 0 0 0 0 6"
      />
    </svg>
  );
}
function CheckBadge(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path fill="currentColor" d="m9 16.2l-3.5-3.5L4 14.2l5 5l12-12l-1.5-1.5z" />
    </svg>
  );
}
function XBadge(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        fill="currentColor"
        d="m12 10.586l4.95-4.95l1.414 1.415L13.414 12l4.95 4.95l-1.414 1.414L12 13.414l-4.95 4.95l-1.414-1.414L10.586 12l-4.95-4.95l1.414-1.414z"
      />
    </svg>
  );
}
function InfoBadge(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        fill="currentColor"
        d="M11 17h2v-6h-2zm0-8h2V7h-2zM12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8.009 8.009 0 0 1-8 8"
      />
    </svg>
  );
}

/* ========= Página ========= */
export default function AsignacionPage() {
  const { token } = useAuth();

  const api = useMemo<AxiosInstance>(() => {
    const instance = axiosClient.create({
      baseURL: import.meta.env.VITE_API_BASE || "http://localhost:61342",
      validateStatus: (s) => s >= 200 && s < 400,
    });
    return instance;
  }, []);

  const authHeaders = useMemo(
    () => ({ Authorization: token ? `Bearer ${token}` : "" }),
    [token]
  );

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal VER
  const [openVer, setOpenVer] = useState(false);
  const [viewData, setViewData] = useState<EncabezadoDetalle | null>(null);

  // Modal DETALLE
  const [openDetalle, setOpenDetalle] = useState(false);
  const [detalleForId, setDetalleForId] = useState<number | null>(null);
  const [detalleTxt, setDetalleTxt] = useState("");
  const [detalleFile, setDetalleFile] = useState<File | null>(null);
  const [savingDetalle, setSavingDetalle] = useState(false);

  // Modal ASIGNAR
  const [openAsignar, setOpenAsignar] = useState(false);
  const [asignarForId, setAsignarForId] = useState<number | null>(null);
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [puntos, setPuntos] = useState<PuntoAtencion[]>([]);
  const [selRegion, setSelRegion] = useState<number | "">("");
  const [selPunto, setSelPunto] = useState<number | "">("");

  // Modal RECHAZAR
  const [openRechazar, setOpenRechazar] = useState(false);
  const [rechazarForId, setRechazarForId] = useState<number | null>(null);
  const [rechazoJust, setRechazoJust] = useState("");
  const [savingRechazo, setSavingRechazo] = useState(false);

  // Paginación simple (cliente)
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

  /* ====== CARGAS ====== */
  async function refreshRows() {
    setLoading(true);
    try {
      const r = await api.get("/API/SEGUIMIENTO/ObtenerQuejasAsignacion", {
        headers: authHeaders,
      });
      setRows((r.data as Row[]) || []);
      setPage(1);
    } catch {
      toast("error", "Error cargando asignaciones");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshRows();
  }, []); // eslint-disable-line

  useEffect(() => {
    // catálogos para Asignar
    (async () => {
      try {
        const [rg, pt] = await Promise.all([
          api.get("/API/USUARIOPUNTOATENCION/ObtenerRegiones", {
            headers: authHeaders,
          }),
          api.post(
            "/API/USUARIOPUNTOATENCION/ObtenerPuntos",
            {},
            { headers: { ...authHeaders, "Content-Type": "application/json" } }
          ),
        ]);
        setRegiones(rg.data as Region[]);
        setPuntos(pt.data as PuntoAtencion[]);
      } catch {
        // silencioso; el modal muestra validaciones si faltan
      }
    })();
  }, [api, authHeaders]);

  /* ====== TOAST ====== */
  function toast(kind: "success" | "error" | "info" | "warn", message: string) {
    window.dispatchEvent(
      new CustomEvent("app:toast", { detail: { kind, message } })
    );
  }

  /* ====== VER ====== */
  async function handleVer(id: number) {
    try {
      const body = { Id_Encabezado: id };
      const r = await api.post(
        "/API/SEGUIMIENTO/ObtenerEncabezadoQueja",
        body,
        { headers: { ...authHeaders, "Content-Type": "application/json" } }
      );
      const arr = (r.data as EncabezadoDetalle[]) || [];
      if (!arr[0]) return toast("warn", "No se encontró la queja.");
      setViewData(arr[0]);
      setOpenVer(true);
    } catch {
      toast("error", "No se pudo abrir la queja.");
    }
  }

  async function downloadAdjunto(url?: string) {
    if (!url) return;
    try {
      const r = await api.post(
        `/API/SEGUIMIENTO/DescargarArchivo`,
        {},
        {
          headers: authHeaders,
          params: { direccionArchivo: url },
          responseType: "blob",
        }
      );
      const blob = new Blob([r.data]);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = url.split("/").pop() || "archivo";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      toast("error", "No se pudo descargar el archivo.");
    }
  }

  /* ====== DETALLE ====== */
  function openDetalleModal(id: number) {
    setDetalleForId(id);
    setDetalleTxt("");
    setDetalleFile(null);
    setOpenDetalle(true);
  }

  async function saveDetalle() {
    if (!detalleForId) return;
    if (!detalleTxt.trim()) return toast("warn", "Escribe un comentario.");

    try {
      setSavingDetalle(true);
      const form = new FormData();
      form.append("Comentario", detalleTxt);
      form.append("Id_Encabezado", String(detalleForId));
      if (detalleFile) form.append("ArchivoAdjunto", detalleFile);

      const r = await api.post("/API/SEGUIMIENTO/InsertarDetalleQueja", form, {
        headers: { ...authHeaders },
      });
      if (r.status >= 200 && r.status < 300) {
        toast("success", "Detalle guardado.");
        setOpenDetalle(false);
      } else {
        throw new Error();
      }
    } catch {
      toast("error", "Error al guardar el detalle.");
    } finally {
      setSavingDetalle(false);
    }
  }

  /* ====== ASIGNAR ====== */
  function openAsignarModal(id: number) {
    setAsignarForId(id);
    setSelRegion("");
    setSelPunto("");
    setOpenAsignar(true);
  }

  const puntosDeRegion = puntos.filter(
    (p) => (selRegion || 0) === p.IdRegion
  );

  async function saveAsignacion() {
    if (!asignarForId) return;
    if (!selRegion) return toast("warn", "Selecciona una región.");
    if (!selPunto) return toast("warn", "Selecciona un punto.");

    try {
      const body = {
        Id_Encabezado: asignarForId,
        Id_Region: selRegion,
        Id_Punto_Atencion: selPunto,
        Id_Estado_Externo: 4,
        Id_Estado_Interno: 2,
      };
      const r = await api.post(
        "/API/SEGUIMIENTO/ActualizarPuntoEstadoQueja",
        body,
        { headers: { ...authHeaders, "Content-Type": "application/json" } }
      );
      if (r.status >= 200 && r.status < 300) {
        toast("success", "La información se almacenó correctamente.");
        setOpenAsignar(false);
        refreshRows();
      } else {
        throw new Error();
      }
    } catch {
      toast("error", "Hubo un error al guardar la información.");
    }
  }

  /* ====== RECHAZAR ====== */
  function openRechazarModal(id: number) {
    setRechazarForId(id);
    setRechazoJust("");
    setOpenRechazar(true);
  }

  async function saveRechazo() {
    if (!rechazarForId) return;
    if (!rechazoJust.trim())
      return toast("warn", "Escribe la justificación.");

    try {
      const body = {
        Id_Encabezado: rechazarForId,
        Id_Estado_Externo: 9,
        Id_Estado_Interno: 3,
        Justificacion: rechazoJust,
      };
      const r = await api.post("/API/SEGUIMIENTO/ActualizarEstadoQueja", body, {
        headers: { ...authHeaders, "Content-Type": "application/json" },
      });
      if (r.status >= 200 && r.status < 300) {
        toast("success", "La información se almacenó correctamente.");
        setOpenRechazar(false);
        refreshRows();
      } else {
        throw new Error();
      }
    } catch {
      toast("error", "Hubo un error al guardar la información.");
    } finally {
      setSavingRechazo(false);
    }
  }

  /* ====== UI ====== */
  return (
    <section className="w-full py-6 space-y-4">
      <h1 className="text-2xl font-semibold" style={{ color: "var(--ink)" }}>
        Asignación de Quejas
      </h1>

      {/* Paginación top */}
      <div className="flex items-center gap-2">
        <button
          className="btn btn-outline hover-black"
          onClick={() => setPage(1)}
          disabled={page === 1}
        >
          ⏮
        </button>
        <button
          className="btn btn-outline hover-black"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ◀
        </button>
        <span className="section-sub">
          {page} de {totalPages}
        </span>
        <button
          className="btn btn-outline hover-black"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          ▶
        </button>
        <button
          className="btn btn-outline hover-black"
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        >
          ⏭
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: "var(--bg)" }}>
              <tr>
                <th className="px-3 py-2 text-left border-b" style={{ borderColor: "var(--border)" }}>ID</th>
                <th className="px-3 py-2 text-left border-b" style={{ borderColor: "var(--border)" }}>Correlativo</th>
                <th className="px-3 py-2 text-left border-b" style={{ borderColor: "var(--border)" }}>Creación</th>
                <th className="px-3 py-2 text-center border-b" style={{ borderColor: "var(--border)" }}>Ver</th>
                <th className="px-3 py-2 text-center border-b" style={{ borderColor: "var(--border)" }}>Asignar</th>
                <th className="px-3 py-2 text-center border-b" style={{ borderColor: "var(--border)" }}>Rechazar</th>
                <th className="px-3 py-2 text-center border-b" style={{ borderColor: "var(--border)" }}>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                pageRows.map((r) => (
                  <tr key={r.Id_Encabezado} className="hover-black-soft">
                    <td className="px-3 py-2">{r.Id_Encabezado}</td>
                    <td className="px-3 py-2">{r.Correlativo}</td>
                    <td className="px-3 py-2">{r.Fecha}</td>
                    <td className="px-3 py-2">
                      <div className="flex justify-center">
                        <button className="icon-btn" title="Ver" onClick={() => handleVer(r.Id_Encabezado)}>
                          <EyeIcon />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-center">
                        <button className="icon-btn success" title="Asignar" onClick={() => openAsignarModal(r.Id_Encabezado)}>
                          <CheckBadge />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-center">
                        <button className="icon-btn danger" title="Rechazar" onClick={() => openRechazarModal(r.Id_Encabezado)}>
                          <XBadge />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-center">
                        <button className="icon-btn info" title="Detalle" onClick={() => openDetalleModal(r.Id_Encabezado)}>
                          <InfoBadge />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center section-sub" colSpan={7}>
                    No se encontraron registros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <div className="px-4 py-3 text-sm section-sub">Cargando…</div>}
      </div>

      {/* ===== Modal Ver ===== */}
      {openVer && viewData && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenVer(false)} />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-3xl rounded-2xl border p-6 card" role="dialog" aria-modal="true">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Visualizar Queja</h2>
                <button className="p-2 rounded hover:bg-[var(--hover)]" onClick={() => setOpenVer(false)}>✕</button>
              </div>

              <div className="text-center text-lg font-semibold mb-4">{viewData.Correlativo}</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReadOnly label="Nombre:" value={`${viewData.Nombres} ${viewData.Apellidos}`} />
                <ReadOnly label="Email:" value={viewData.Email} />
                <ReadOnly label="Teléfono:" value={viewData.Telefono} />
                <ReadOnly label="Etapa:" value={viewData.Estado_Interno} />
                <ReadOnly label="Región:" value={viewData.Nombre_Region} />
                <ReadOnly label="P.A.:" value={viewData.Nombre_Punto_Atencion} />
                <ReadOnly label="Queja:" value={viewData.Detalle} full />
              </div>

              <div className="mt-6 flex items-center gap-3">
                {viewData.Direccion_Archivo && (
                  <button className="btn btn-primary" onClick={() => downloadAdjunto(viewData.Direccion_Archivo)}>
                    Descargar
                  </button>
                )}
                <div className="flex-1" />
                <button className="btn btn-outline hover-black" onClick={() => setOpenVer(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal Detalle ===== */}
      {openDetalle && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenDetalle(false)} />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-3xl rounded-2xl border p-6 card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Detalle de Queja</h2>
                <button className="p-2 rounded hover:bg-[var(--hover)]" onClick={() => setOpenDetalle(false)}>✕</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Comentario</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-lg border px-3 py-2"
                    style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }}
                    value={detalleTxt}
                    onChange={(e) => setDetalleTxt(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Seleccionar archivo:</label>
                  <input
                    type="file"
                    onChange={(e) => setDetalleFile(e.currentTarget.files?.[0] || null)}
                    className="w-full rounded-lg border px-3 py-2"
                    style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button className="btn btn-primary" onClick={saveDetalle} disabled={savingDetalle}>
                  {savingDetalle ? "Guardando…" : "Guardar"}
                </button>
                <button className="btn btn-outline hover-black" onClick={() => setOpenDetalle(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal Asignar ===== */}
      {openAsignar && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenAsignar(false)} />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl rounded-2xl border p-6 card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Asignación de Queja</h2>
                <button className="p-2 rounded hover:bg-[var(--hover)]" onClick={() => setOpenAsignar(false)}>✕</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Región</label>
                  <select
                    className="w-full rounded-lg border px-3 py-2"
                    style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }}
                    value={selRegion}
                    onChange={(e) => {
                      const v = e.target.value ? Number(e.target.value) : "";
                      setSelRegion(v);
                      setSelPunto("");
                    }}
                  >
                    <option value="">Seleccionar región</option>
                    {regiones.map((r) => (
                      <option key={r.Id_Region} value={r.Id_Region}>
                        {r.Nombre_Region}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Punto de atención</label>
                  <select
                    className="w-full rounded-lg border px-3 py-2"
                    style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }}
                    value={selPunto}
                    onChange={(e) => setSelPunto(e.target.value ? Number(e.target.value) : "")}
                    disabled={!selRegion}
                  >
                    <option value="">Seleccionar punto</option>
                    {puntosDeRegion.map((p) => (
                      <option key={p.Id} value={p.Id}>
                        {p.NombrePuntoAtencion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button className="btn btn-primary" onClick={saveAsignacion}>Guardar</button>
                <button className="btn btn-outline hover-black" onClick={() => setOpenAsignar(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal Rechazar ===== */}
      {openRechazar && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenRechazar(false)} />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl rounded-2xl border p-6 card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Rechazar Queja</h2>
                <button className="p-2 rounded hover:bg-[var(--hover)]" onClick={() => setOpenRechazar(false)}>✕</button>
              </div>

              <div>
                <label className="block text-sm mb-1">Justificación</label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border px-3 py-2"
                  style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }}
                  value={rechazoJust}
                  onChange={(e) => setRechazoJust(e.target.value)}
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button className="btn btn-primary" onClick={saveRechazo} disabled={savingRechazo}>
                  {savingRechazo ? "Guardando…" : "Guardar"}
                </button>
                <button className="btn btn-outline hover-black" onClick={() => setOpenRechazar(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ====== Componente de lectura ====== */
function ReadOnly({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm mb-1">{label}</label>
      <input
        className="w-full rounded-lg border px-3 py-2"
        readOnly
        value={value ?? ""}
        style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }}
      />
    </div>
  );
}
