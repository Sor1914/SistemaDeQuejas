/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearQueja, obtenerTiposQueja } from "./api";
import type { CrearQuejaPayload, TipoQueja } from "./types";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  Nombres: z.string().min(1, "Requerido"),
  Apellidos: z.string().min(1, "Requerido"),
  Email: z.string().email("Correo inválido"),
  Telefono: z.string().regex(/^\d{8}$/, "Debe tener 8 dígitos"),
  Detalle: z.string().min(1, "Requerido").max(200, "Máximo 200 caracteres"),
  Tipo_Queja: z.number().int().min(1, "Selecciona un tipo"),
  ArchivoAdjunto: z
    .instanceof(File)
    .optional()
    .or(z.null())
    .or(z.any().refine((v) => v === undefined, { message: "" })),
});

type FormValues = z.infer<typeof schema>;

export default function CrearQuejaPage() {
  const navigate = useNavigate();
  const [tipos, setTipos] = useState<TipoQueja[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      Nombres: "",
      Apellidos: "",
      Email: "",
      Telefono: "",
      Detalle: "",
      Tipo_Queja: 0,
      ArchivoAdjunto: undefined,
    },
  });

  const file = watch("ArchivoAdjunto");

  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerTiposQueja();
        setTipos(data);
      } catch {
        setTipos([]);
      }
    })();
  }, []);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setValue("ArchivoAdjunto", f, { shouldValidate: true });
  };
  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setValue("ArchivoAdjunto", f, { shouldValidate: true });
  };

  const accept = useMemo(
    () => [".pdf", ".png", ".jpg", ".jpeg", ".webp"].join(","),
    []
  );

  const onSubmit = async (values: FormValues) => {
    const payload: CrearQuejaPayload = {
      Nombres: values.Nombres.trim(),
      Apellidos: values.Apellidos.trim(),
      Email: values.Email.trim(),
      Telefono: values.Telefono.trim(),
      Detalle: values.Detalle.trim(),
      Tipo_Queja: Number(values.Tipo_Queja),
      ArchivoAdjunto: values.ArchivoAdjunto ?? undefined,
    };
    try {
      const creada = await crearQueja(payload);
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: {
            kind: "success",
            message: `¡Queja ${creada.Correlativo} creada!`,
          },
        })
      );
      navigate("/", { replace: true });
    } catch (e) {
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: {
            kind: "error",
            message: "No se pudo crear la queja. Intenta de nuevo.",
          },
        })
      );
    }
  };

  return (
    <section className="py-8 space-y-6 w-full">
      <header>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--ink)" }}>
          Registrar queja
        </h1>
        <p className="section-sub">Todos los campos son obligatorios.</p>
      </header>

      <div className="card p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Nombres</label>
              <input
                {...register("Nombres")}
                className="w-full rounded-lg border px-3 py-2"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
              />
              {errors.Nombres && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.Nombres.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Apellidos</label>
              <input
                {...register("Apellidos")}
                className="w-full rounded-lg border px-3 py-2"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
              />
              {errors.Apellidos && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.Apellidos.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                {...register("Email")}
                className="w-full rounded-lg border px-3 py-2"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
              />
              {errors.Email && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.Email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Teléfono (8 dígitos)</label>
              <input
                inputMode="numeric"
                pattern="\d{8}"
                maxLength={8}
                {...register("Telefono")}
                className="w-full rounded-lg border px-3 py-2"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
              />
              {errors.Telefono && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.Telefono.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Tipo de queja</label>
              <select
                {...register("Tipo_Queja", { valueAsNumber: true })}
                className="w-full rounded-lg border px-3 py-2"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
              >
                <option value={0}>Selecciona...</option>
                {tipos.map((t) => (
                  <option key={t.Id_Tipo} value={t.Id_Tipo}>
                    {t.Siglas_Tipo}{t.Descripcion ? ` — ${t.Descripcion}` : ''}
                  </option>
                ))}
              </select>
              {errors.Tipo_Queja && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.Tipo_Queja.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Detalle (máx 200)</label>
              <textarea
                rows={4}
                {...register("Detalle")}
                className="w-full rounded-lg border px-3 py-2"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
              />
              {errors.Detalle && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.Detalle.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">
              Adjuntar archivo (PDF o imagen)
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className="rounded-xl border p-4 text-sm text-center cursor-pointer"
              style={{
                borderColor: dragOver ? "var(--primary)" : "var(--border)",
                background: "var(--surface)",
              }}
              onClick={() => document.getElementById("fileQueja")?.click()}
            >
              {file ? (
                <span>
                  Archivo seleccionado: <b>{(file as File).name}</b>
                </span>
              ) : (
                <span>Arrastra y suelta aquí, o haz clic para seleccionar</span>
              )}
              <input
                id="fileQueja"
                type="file"
                accept={accept}
                className="hidden"
                onChange={onSelect}
              />
            </div>
            <p className="mt-1 text-xs section-sub">
              Formatos: PDF, PNG, JPG, JPEG, WEBP
            </p>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="btn btn-outline hover-black"
              onClick={() => navigate("/")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary hover-black"
            >
              {isSubmitting ? "Enviando…" : "Registrar queja"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
