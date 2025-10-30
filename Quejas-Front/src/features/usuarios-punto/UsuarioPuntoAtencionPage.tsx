/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../features/auth/AuthContext";
import {
  actualizarDatosUsuario,
  obtenerPuntos,
  obtenerRegiones,
  obtenerUsuarioPorCui,
  obtenerUsuarios,
  type Punto,
  type Region,
  type UsuarioPunto,
} from "./api";
import { RequirePermission } from "../../app/routes/guards";

type ModalState =
  | { type: "none" }
  | { type: "nuevo" }
  | { type: "editar"; registro: UsuarioPunto }
  | { type: "eliminar"; registro: UsuarioPunto };

type FormDTO = {
  Cui: string;
  Nombres: string;
  Email: string;
  Id_Region?: number;
  Id_Punto_Atencion?: number;
  // Cargo se envía fijo desde el padre
};

const PAGE_SIZE = 5;
// Cargo fijo a usar en crear/editar:
const FIXED_CARGO_ID = 2;

export default function UsuarioPuntoAtencionPage() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [puntos, setPuntos] = useState<Punto[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioPunto[]>([]);

  // filtros
  const [idRegion, setIdRegion] = useState<number | "">("");
  const [idPunto, setIdPunto] = useState<number | "">("");
  const [cuiSearch, setCuiSearch] = useState("");
  const [page, setPage] = useState(1);

  // modales
  const [modal, setModal] = useState<ModalState>({ type: "none" });

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      const [r, p, u] = await Promise.all([
        obtenerRegiones(token),
        obtenerPuntos(token),
        obtenerUsuarios(token),
      ]);
      setRegiones(r);
      setPuntos(p);
      setUsuarios(u);
      setLoading(false);
    })();
  }, [token]);

  const puntosFiltrados = useMemo(
    () => (idRegion ? puntos.filter((x) => x.IdRegion === idRegion) : []),
    [idRegion, puntos]
  );

  const listaFiltrada = useMemo(() => {
    let list = usuarios;
    if (idRegion) list = list.filter((x) => x.Id_Region === idRegion);
    if (idPunto) list = list.filter((x) => x.Id_Punto_Atencion === idPunto);
    if (cuiSearch.trim())
      list = list.filter((x) =>
        x.Cui?.toUpperCase().includes(cuiSearch.trim().toUpperCase())
      );
    return list;
  }, [usuarios, idRegion, idPunto, cuiSearch]);

  const totalPages = Math.max(1, Math.ceil(listaFiltrada.length / PAGE_SIZE));
  const pageClamped = Math.min(page, totalPages);
  const dataPage = useMemo(() => {
    const start = (pageClamped - 1) * PAGE_SIZE;
    return listaFiltrada.slice(start, start + PAGE_SIZE);
  }, [listaFiltrada, pageClamped]);

  function toast(ok: boolean, message: string) {
    window.dispatchEvent(
      new CustomEvent("app:toast", {
        detail: { kind: ok ? "success" : "error", message },
      })
    );
  }

  async function refreshTabla() {
    if (!token) return;
    const u = await obtenerUsuarios(token);
    setUsuarios(u);
  }

  // acciones (crea/edita con Id_Cargo fijo = 2)
  async function guardarNuevo(form: FormDTO) {
    if (!token) return;
    const ok = await actualizarDatosUsuario(token, {
      Cui: form.Cui,
      Nombres: form.Nombres,
      Email: form.Email,
      Id_Region: form.Id_Region!,
      Id_Punto_Atencion: form.Id_Punto_Atencion!,
      Id_Cargo: FIXED_CARGO_ID, // ← fijo a 2
      Apellidos: "",
      Usuario: "",
    });
    toast(
      ok,
      ok
        ? "La información se almacenó correctamente"
        : "Hubo un error al guardar la información"
    );
    if (ok) {
      await refreshTabla();
      setModal({ type: "none" });
    }
  }

  async function guardarEdicion(form: FormDTO, original: UsuarioPunto) {
    if (!token) return;
    const ok = await actualizarDatosUsuario(token, {
      Cui: original.Cui,
      Nombres: original.Nombres,
      Email: original.Email,
      Id_Region: form.Id_Region!,
      Id_Punto_Atencion: form.Id_Punto_Atencion!,
      Id_Cargo: FIXED_CARGO_ID, // ← fijo a 2
      Apellidos: original.Apellidos ?? "",
      Usuario: original.Usuario ?? "",
    });
    toast(
      ok,
      ok
        ? "La información se actualizó correctamente"
        : "Hubo un error al guardar la información"
    );
    if (ok) {
      await refreshTabla();
      setModal({ type: "none" });
    }
  }

  async function eliminarRegistro(reg: UsuarioPunto) {
    if (!token) return;
    // Desasignar: Punto = 1, Cargo = 1 (como en tu MVC)
    const ok = await actualizarDatosUsuario(token, {
      Cui: reg.Cui,
      Nombres: reg.Nombres,
      Email: reg.Email,
      Id_Region: reg.Id_Region,
      Id_Punto_Atencion: 1,
      Id_Cargo: 1,
      Apellidos: reg.Apellidos ?? "",
      Usuario: reg.Usuario ?? "",
    });
    toast(
      ok,
      ok
        ? "El registro se eliminó correctamente"
        : "Hubo un error al eliminar el registro"
    );
    if (ok) {
      await refreshTabla();
      setModal({ type: "none" });
    }
  }

  return (
    <RequirePermission permission="UsuarioPuntoAtencion">
      <div className="w-full">
        <div
          className="rounded-xl border"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
        >
          {/* Header */}
          <div
            className="p-4 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">
                Usuarios - Puntos de Atención
              </h1>
              <button
                className="btn btn-outline"
                onClick={() => setModal({ type: "nuevo" })}
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex gap-2 items-center">
                <span
                  className="px-2 py-1 rounded text-sm"
                  style={{ background: "var(--ink)", color: "var(--surface)" }}
                >
                  Región
                </span>
                <select
                  value={idRegion}
                  onChange={(e) => {
                    const v = e.target.value ? Number(e.target.value) : "";
                    setIdRegion(v as any);
                    setIdPunto("");
                    setPage(1);
                  }}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                    color: "var(--ink)",
                  }}
                >
                  <option value="">Seleccionar región</option>
                  {regiones.map((r) => (
                    <option key={r.Id_Region} value={r.Id_Region}>
                      {r.Nombre_Region}
                    </option>
                  ))}
                </select>

                <span
                  className="px-2 py-1 rounded text-sm"
                  style={{ background: "var(--ink)", color: "var(--surface)" }}
                >
                  Puntos
                </span>
                <select
                  value={idPunto}
                  onChange={(e) => {
                    setIdPunto(
                      e.target.value ? Number(e.target.value) : ("" as any)
                    );
                    setPage(1);
                  }}
                  disabled={!idRegion}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                    color: "var(--ink)",
                  }}
                >
                  <option value="">Seleccionar punto</option>
                  {puntosFiltrados.map((p) => (
                    <option key={p.Id} value={p.Id}>
                      {p.NombrePuntoAtencion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 items-center justify-end">
                <span
                  className="px-2 py-1 rounded text-sm"
                  style={{ background: "var(--ink)", color: "var(--surface)" }}
                >
                  CUI
                </span>
                <input
                  placeholder="Número de DPI"
                  inputMode="numeric"
                  pattern="\d{0,13}"
                  value={cuiSearch}
                  onChange={(e) =>
                    setCuiSearch(e.target.value.replace(/[eE+\-.]/g, ""))
                  }
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                    color: "var(--ink)",
                  }}
                />
                <button className="btn" onClick={() => setPage(1)}>
                  Buscar
                </button>
              </div>
            </div>

            {/* Tabla */}
            <div
              className="overflow-x-auto rounded-lg border"
              style={{ borderColor: "var(--border)" }}
            >
              <table className="w-full text-sm">
                <thead style={{ background: "var(--subtle)" }}>
                  <tr className="text-left">
                    <th className="px-3 py-2">DPI</th>
                    <th className="px-3 py-2">Usuario</th>
                    <th className="px-3 py-2">Nombre</th>
                    <th className="px-3 py-2">Punto Atención</th>
                    <th className="px-3 py-2">Cargo</th>
                    <th className="px-3 py-2 text-center">Editar</th>
                    <th className="px-3 py-2 text-center">Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-4">
                        Cargando…
                      </td>
                    </tr>
                  ) : dataPage.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-4">
                        No se encontraron registros.
                      </td>
                    </tr>
                  ) : (
                    dataPage.map((u) => (
                      <tr
                        key={u.Cui}
                        className="border-t"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <td className="px-3 py-2">{u.Cui}</td>
                        <td className="px-3 py-2">{u.Usuario ?? ""}</td>
                        <td className="px-3 py-2">
                          {u.Nombres} {u.Apellidos ?? ""}
                        </td>
                        <td className="px-3 py-2">
                          {u.Nombre_Punto_Atencion ?? ""}
                        </td>
                        <td className="px-3 py-2">{u.Nombre_Cargo ?? ""}</td>
                        <td className="px-3 py-2 text-center">
                          <button
                            className="btn btn-ghost"
                            onClick={() =>
                              setModal({ type: "editar", registro: u })
                            }
                          >
                            ✎
                          </button>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              setModal({ type: "eliminar", registro: u })
                            }
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex items-center gap-2">
              <button
                className="btn"
                disabled={pageClamped <= 1}
                onClick={() => setPage(1)}
              >
                ⏮
              </button>
              <button
                className="btn"
                disabled={pageClamped <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ◀
              </button>
              <span className="text-sm">
                {pageClamped} de {totalPages}
              </span>
              <button
                className="btn"
                disabled={pageClamped >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                ▶
              </button>
              <button
                className="btn"
                disabled={pageClamped >= totalPages}
                onClick={() => setPage(totalPages)}
              >
                ⏭
              </button>
            </div>
          </div>
        </div>

        {/* Modales */}
        {modal.type === "nuevo" && (
          <ModalNuevo
            token={token}
            regiones={regiones}
            puntos={puntos}
            onGuardar={guardarNuevo}
            onClose={() => setModal({ type: "none" })}
          />
        )}

        {modal.type === "editar" && (
          <ModalEditar
            registro={modal.registro}
            regiones={regiones}
            puntos={puntos}
            onGuardar={(f) => guardarEdicion(f, modal.registro)}
            onClose={() => setModal({ type: "none" })}
          />
        )}

        {modal.type === "eliminar" && (
          <Confirm
            title="Notificación del sistema"
            message="¿Está seguro de eliminar el usuario del punto de atención?"
            onCancel={() => setModal({ type: "none" })}
            onConfirm={() => eliminarRegistro(modal.registro)}
          />
        )}
      </div>
    </RequirePermission>
  );
}

/* ---------- UI genérico (dialogos) ---------- */
function Frame({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center px-3">
        <div
          className="w-full max-w-3xl rounded-2xl border shadow-xl"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 className="text-lg font-semibold">{title}</h3>
            <button className="btn btn-ghost" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="p-4">{children}</div>
          <div
            className="px-4 py-3 border-t flex justify-end gap-2"
            style={{ borderColor: "var(--border)" }}
          >
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}

function Confirm({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  return (
    <Frame
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn" onClick={onCancel}>
            Cancelar ✖
          </button>
          <button className="btn btn-warning" onClick={onConfirm}>
            Continuar 🗑️
          </button>
        </>
      }
    >
      <p>{message}</p>
    </Frame>
  );
}

/* ---------- Modal NUEVO ---------- */
function ModalNuevo({
  token,
  regiones,
  puntos,
  onGuardar,
  onClose,
}: {
  token: string | null;
  regiones: Region[];
  puntos: Punto[];
  onGuardar: (f: FormDTO) => void | Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormDTO>({
    Cui: "",
    Nombres: "",
    Email: "",
  });
  const [errorCui, setErrorCui] = useState("");
  const [idRegion, setIdRegion] = useState<number | "">("");
  const [idPunto, setIdPunto] = useState<number | "">("");

  const puntosReg = useMemo(
    () => (idRegion ? puntos.filter((p) => p.IdRegion === idRegion) : []),
    [idRegion, puntos]
  );

  async function blurCui() {
    const cui = form.Cui.trim();
    if (!cui) return;
    const data = await obtenerUsuarioPorCui(token, cui);
    if (!data) {
      setErrorCui("El usuario no existe");
      setForm((f) => ({ ...f, Nombres: "", Email: "" }));
      return;
    }
    if (data.Id_Punto_Atencion !== 1) {
      setErrorCui(
        `El usuario ya existe en el punto de atención ${
          data.Nombre_Punto_Atencion ?? ""
        }`
      );
      setForm((f) => ({ ...f, Nombres: "", Email: "" }));
      return;
    }
    setErrorCui("");
    setForm((f) => ({
      ...f,
      Nombres: `${data.Nombres} ${data.Apellidos ?? ""}`.trim(),
      Email: data.Email,
    }));
  }

  const canSave = !!form.Cui && !errorCui && !!idRegion && !!idPunto;

  return (
    <Frame
      title="Creación de Puntos de Atención"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancelar ✖
          </button>
          <button
            className="btn btn-primary"
            disabled={!canSave}
            onClick={() =>
              onGuardar({
                ...form,
                Id_Region: idRegion as number,
                Id_Punto_Atencion: idPunto as number,
              })
            }
          >
            Guardar 💾
          </button>
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">CUI</label>
          <input
            value={form.Cui}
            onChange={(e) =>
              setForm({
                ...form,
                Cui: e.target.value.replace(/[eE+\-.]/g, ""),
              })
            }
            onBlur={blurCui}
            inputMode="numeric"
            pattern="\d{0,13}"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--ink)",
            }}
          />
          {errorCui && (
            <p className="text-sm mt-1" style={{ color: "var(--danger)" }}>
              {errorCui}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            value={form.Nombres}
            disabled
            className="w-full rounded-lg border px-3 py-2"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--ink)",
            }}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            value={form.Email}
            disabled
            className="w-full rounded-lg border px-3 py-2"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--ink)",
            }}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Región</label>
          <select
            value={idRegion}
            onChange={(e) => {
              setIdRegion(
                e.target.value ? Number(e.target.value) : ("" as any)
              );
              setIdPunto("");
            }}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--ink)",
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
            value={idPunto}
            onChange={(e) =>
              setIdPunto(e.target.value ? Number(e.target.value) : ("" as any))
            }
            disabled={!idRegion}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--ink)",
            }}
          >
            <option value="">Seleccionar punto</option>
            {puntosReg.map((p) => (
              <option key={p.Id} value={p.Id}>
                {p.NombrePuntoAtencion}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- Modal EDITAR ---------- */
function ModalEditar({
  registro,
  regiones,
  puntos,
  onGuardar,
  onClose,
}: {
  registro: UsuarioPunto;
  regiones: Region[];
  puntos: Punto[];
  onGuardar: (f: FormDTO) => void | Promise<void>;
  onClose: () => void;
}) {
  const [idRegion, setIdRegion] = useState<number | "">(
    registro.Id_Region ?? ""
  );
  const [idPunto, setIdPunto] = useState<number | "">(
    registro.Id_Punto_Atencion ?? ""
  );
  const puntosReg = useMemo(
    () => (idRegion ? puntos.filter((p) => p.IdRegion === idRegion) : []),
    [idRegion, puntos]
  );

  const canSave = !!idRegion && !!idPunto;

  return (
    <Frame
      title="Editar Punto de Atención"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancelar ✖
          </button>
          <button
            className="btn btn-primary"
            disabled={!canSave}
            onClick={() =>
              onGuardar({
                Cui: registro.Cui,
                Nombres: registro.Nombres,
                Email: registro.Email,
                Id_Region: idRegion as number,
                Id_Punto_Atencion: idPunto as number,
              })
            }
          >
            Guardar 💾
          </button>
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">CUI</label>
          <input
            value={registro.Cui}
            disabled
            className="w-full rounded-lg border px-3 py-2"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--ink)",
            }}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            value={`${registro.Nombres} ${registro.Apellidos ?? ""}`.trim()}
            disabled
            className="w-full rounded-lg border px-3 py-2"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--ink)",
            }}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            value={registro.Email}
            disabled
            className="w-full rounded-lg border px-3 py-2"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--ink)",
            }}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Región</label>
          <select
            value={idRegion}
            onChange={(e) => {
              setIdRegion(
                e.target.value ? Number(e.target.value) : ("" as any)
              );
              setIdPunto("");
            }}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--ink)",
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
            value={idPunto}
            onChange={(e) =>
              setIdPunto(e.target.value ? Number(e.target.value) : ("" as any))
            }
            disabled={!idRegion}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--ink)",
            }}
          >
            <option value="">Seleccionar punto</option>
            {puntosReg.map((p) => (
              <option key={p.Id} value={p.Id}>
                {p.NombrePuntoAtencion}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Frame>
  );
}
