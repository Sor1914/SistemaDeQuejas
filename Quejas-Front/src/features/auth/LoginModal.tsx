/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { autenticar } from "./api";
import { useAuth } from "./AuthContext";
import type { Permisos } from "./types";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  Usuario: z
    .string()
    .min(4, "Mínimo 4 caracteres")
    .max(20, "Máximo 20 caracteres")
    .regex(/^[A-Za-z0-9]+$/, "Solo letras y números"),
  Pass: z
    .string()
    .min(4, "Mínimo 4 caracteres")
    .max(20, "Máximo 20 caracteres")
    .regex(/^[A-Za-z0-9]+$/, "Solo letras y números"),
});
type FormValues = z.infer<typeof schema>;

type LoginResponse = {
  Token: string;
  Usuario: string;
  rol?: string;
  permisos: Permisos;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LoginModal({ open, onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const { login } = useAuth();
  const navigate = useNavigate();

  // NEW: estado para ver/ocultar contraseña
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) reset({ Usuario: "", Pass: "" });
    clearErrors();
    setShowPass(false); // por seguridad, siempre ocultar al reabrir
  }, [open, reset, clearErrors]);

  if (!open) return null;

  const onSubmit = async (values: FormValues) => {
    try {
      const data: LoginResponse = await autenticar(values);

      login({
        token: data.Token,
        permisos: data.permisos,
        user: { nombre: data.Usuario, rol: data.rol },
      });

      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: {
            kind: "success",
            message: `¡Bienvenido ${(data as any).Usuario}!`,
          },
        })
      );

      onClose();
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError("Pass", { type: "server", message: "Credenciales inválidas" });
      } else {
        setError("Pass", {
          type: "server",
          message: "Error al iniciar sesión",
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Iniciar sesión"
        className="absolute inset-0 flex items-center justify-center px-4"
      >
        <div
          className="w-full max-w-md rounded-2xl border p-6 shadow-xl"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Iniciar sesión</h2>
            <button
              className="p-2 rounded hover:bg-gray-100"
              aria-label="Cerrar"
              onClick={onClose}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M18.3 5.71L12 12l6.3 6.29l-1.41 1.42L10.59 13.4L4.29 19.7L2.88 18.3L9.17 12L2.88 5.71L4.29 4.29L10.59 10.6l6.3-6.3z"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm mb-1">Usuario</label>
              <input
                type="text"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--ink)",
                  background: "var(--surface)",
                }}
                {...register("Usuario")}
                autoComplete="username"
                autoFocus
              />
              {errors.Usuario && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.Usuario.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Contraseña</label>

              {/* Contenedor relativo para el botón ojo */}
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--ink)",
                    background: "var(--surface)",
                  }}
                  {...register("Pass")}
                  autoComplete="current-password"
                />

                {/* Botón ojo */}
                <button
                  type="button"
                  aria-label={showPass ? "Ocultar contraseña" : "Ver contraseña"}
                  aria-pressed={showPass}
                  className="absolute inset-y-0 right-0 px-3 flex items-center justify-center rounded-r-lg hover:bg-gray-100 focus:outline-none"
                  onClick={() => setShowPass((s) => !s)}
                >
                  {showPass ? (
                    // eye-off
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M2.1 3.51L3.51 2.1l18.38 18.39l-1.41 1.41l-2.34-2.34C16.6 20.34 14.39 21 12 21c-4.97 0-9.16-3.11-10.94-7.5c.73-1.86 1.92-3.49 3.41-4.77L2.1 3.51M12 7a5 5 0 0 1 5 5c0 .61-.11 1.19-.31 1.73L14.27 11.3A3 3 0 0 0 12 9a3 3 0 0 0-1.73.56L8.27 7.56C9.07 7.2 9.99 7 12 7m0-5c4.97 0 9.16 3.11 10.94 7.5a12.42 12.42 0 0 1-3.08 4.57L18.5 12.7A8.4 8.4 0 0 0 21 9.5C19.22 5.11 15.03 2 12 2C9.62 2 7.4 2.66 5.36 3.84L6.78 5.26C8.22 4.46 10.03 4 12 4Z"
                      />
                    </svg>
                  ) : (
                    // eye
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12 6c5 0 9.27 3.11 11 7.5C21.27 17.89 17 21 12 21S2.73 17.89 1 13.5C2.73 9.11 7 6 12 6m0 2C8.69 8 5.78 9.64 4.22 12C5.78 14.36 8.69 16 12 16s6.22-1.64 7.78-4C18.22 9.64 15.31 8 12 8m0 2a2 2 0 1 1 0 4a2 2 0 0 1 0-4Z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {errors.Pass && (
                <p className="mt-1 text-xs text-red-600">{errors.Pass.message}</p>
              )}
            </div>

            <button
              type="button"
              className="text-sm hover:underline"
              onClick={(e) => {
                e.preventDefault();
                onClose?.();
                navigate("/registro");
              }}
              style={{ color: "var(--primary)" }}
            >
              ¿No tienes cuenta? Crear cuenta
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? "Ingresando…" : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
