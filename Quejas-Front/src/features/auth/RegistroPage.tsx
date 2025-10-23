/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrarUsuario } from './api';
import { useNavigate } from 'react-router-dom';

// Validaciones
const passwordRules = z
  .string()
  .min(5, 'Mínimo 5 caracteres')
  .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula (A-Z)')
  .regex(/[0-9]/, 'Debe incluir al menos un número (0-9)');

const schema = z.object({
  Usuario: z.string().trim().min(3, 'Ingresa un usuario válido'),
  Password: passwordRules,
  Nombres: z.string().trim().min(1, 'Requerido'),
  Apellidos: z.string().trim().min(1, 'Requerido'),
  Email: z.string().trim().email('Correo inválido'),
  CUI: z.string().trim().min(8, 'Mínimo 8 caracteres'),
});

type FormValues = z.infer<typeof schema>;

export default function RegistroPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: FormValues) => {
    try {
      await registrarUsuario({
        Usuario: v.Usuario.trim(),
        Password: v.Password,
        Nombres: v.Nombres.trim(),
        Apellidos: v.Apellidos.trim(),
        Email: v.Email.trim(),
        CUI: v.CUI.trim(),
      });

      // Listo: avisamos y llevamos al login (abre tu modal si quieres)
      window.dispatchEvent(new CustomEvent('app:toast', {
        detail: { kind: 'success', message: 'Registro exitoso. Ahora puedes iniciar sesión.' }
      }));
      navigate('/'); // vuelves al home; si quieres abrir modal: window.dispatchEvent(new Event('app:open-login'))
      window.dispatchEvent(new Event('app:open-login'));
    } catch (err: any) {
      const msg = String(err?.response?.data ?? err?.message ?? '');
      // Mensajes típicos de tu API para mapear a campo
      if (/usuario ya existe/i.test(msg)) {
        setError('Usuario', { type: 'server', message: 'El usuario ya existe.' });
      } else if (/correo ya existe/i.test(msg)) {
        setError('Email', { type: 'server', message: 'El correo ya existe.' });
      } else if (/cui ya existe/i.test(msg)) {
        setError('CUI', { type: 'server', message: 'El CUI ya existe.' });
      } else if (/cuenta no existe/i.test(msg)) {
        // Por si el backend aún lo exige — mostramos aviso general
        window.dispatchEvent(new CustomEvent('app:toast', {
          detail: { kind: 'warning', message: 'La cuenta asociada no existe. Contacta soporte.' }
        }));
      } else {
        window.dispatchEvent(new CustomEvent('app:toast', {
          detail: { kind: 'error', message: 'No se pudo completar el registro.' }
        }));
      }
    }
  };

  return (
    <section className="w-full py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>Crear cuenta</h1>
        <p className="section-sub">Completa tus datos para registrarte.</p>
      </header>

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Usuario</label>
            <input
              {...register('Usuario')}
              className="w-full rounded-lg border px-3 py-2"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              autoComplete="username"
            />
            {errors.Usuario && <p className="text-xs text-red-600 mt-1">{errors.Usuario.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Nombres</label>
            <input
              {...register('Nombres')}
              className="w-full rounded-lg border px-3 py-2"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              autoComplete="given-name"
            />
            {errors.Nombres && <p className="text-xs text-red-600 mt-1">{errors.Nombres.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Apellidos</label>
            <input
              {...register('Apellidos')}
              className="w-full rounded-lg border px-3 py-2"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              autoComplete="family-name"
            />
            {errors.Apellidos && <p className="text-xs text-red-600 mt-1">{errors.Apellidos.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Correo</label>
            <input
              {...register('Email')}
              className="w-full rounded-lg border px-3 py-2"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              autoComplete="email"
              inputMode="email"
            />
            {errors.Email && <p className="text-xs text-red-600 mt-1">{errors.Email.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">CUI</label>
            <input
              {...register('CUI')}
              className="w-full rounded-lg border px-3 py-2"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              inputMode="numeric"
            />
            {errors.CUI && <p className="text-xs text-red-600 mt-1">{errors.CUI.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              type="password"
              {...register('Password')}
              className="w-full rounded-lg border px-3 py-2"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              autoComplete="new-password"
            />
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              Debe tener <b>mínimo 5 caracteres</b>, al menos <b>una mayúscula</b> y <b>un número</b>.
            </p>
            {errors.Password && <p className="text-xs text-red-600 mt-1">{errors.Password.message}</p>}
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <button type="button" className="btn btn-outline hover-black" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary hover-black" disabled={isSubmitting}>
              {isSubmitting ? 'Creando…' : 'Crear cuenta'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
