/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
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
  }, [open, reset, clearErrors]);

  if (!open) return null;

  const onSubmit = async (values: FormValues) => {
    try {
      const data: LoginResponse = await autenticar(values); // <- ya viene normalizado

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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
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
              <input
                type="password"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--ink)",
                  background: "var(--surface)",
                }}
                {...register("Pass")}
                autoComplete="current-password"
              />
              {errors.Pass && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.Pass.message}
                </p>
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
