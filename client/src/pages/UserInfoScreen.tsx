import { useState, useEffect } from 'react';
import { useAuth, UserData } from '@/contexts/AuthContext';
import { ArrowLeft, Pencil, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import communesData from './communes.json';
import regionsData from './regions.json';

interface Gender { gd_id: number; sexo: string; }
interface Commune { co_id: number; nombre: string; rg_id?: number; }
interface Region { rg_id: number; nombre: string; }
interface Role { id: number; name: string; slug: string; }

export default function UserInfoScreen() {
  const { userData, usersList, setStep, setUserData, userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    paterno: '',
    materno: '',
    gd_id: '',
    sexo: '',
    telefono: '',
    nacimiento: '',
    email: '',
    password: '',
    parental_lock: '',
    limit_movil: 4,
    rg_id: '',
    co_id: '',
    role_id: '',
    direccion: '',
    estado: 1,
  });

  // which fields are in "edit mode" (solo usado por Admin)
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

  const [genders] = useState<Gender[]>([
    { gd_id: 1, sexo: 'Masculino' },
    { gd_id: 2, sexo: 'Femenino' },
  ]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [allCommunes, setAllCommunes] = useState<Commune[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Un solo useEffect: carga listas estáticas + roles + formData juntos
  useEffect(() => {
    // 1. Cargar regiones y comunas desde JSON (sincrónico)
    const regs = (regionsData as Region[]) || [];
    setRegions(regs);
    const loadedCommunes = (communesData as Commune[]) || [];
    setAllCommunes(loadedCommunes);

    if (!userData) return;

    // Debug: ver exactamente qué devuelve la API
    console.log('[UserInfoScreen] userData recibido:', JSON.stringify(userData, null, 2));

    // 2. Derivar rg_id desde la comuna si la API no lo devuelve
    //    El JSON de comunas incluye rg_id en cada entrada
    const rawCoId = userData.co_id;
    const communeEntry = rawCoId
      ? loadedCommunes.find((c: any) =>
        c.co_id === rawCoId || String(c.co_id) === String(rawCoId)
      )
      : undefined;
    const derivedRgId = (userData.rg_id != null && userData.rg_id !== undefined)
      ? userData.rg_id
      : (communeEntry as any)?.rg_id ?? null;

    // 3. Filtrar comunas del departamento para el select admin
    if (derivedRgId) {
      const filtered = loadedCommunes.filter(
        (c: any) => c.rg_id === derivedRgId || String(c.rg_id) === String(derivedRgId)
      );
      filtered.sort((a: Commune, b: Commune) => a.nombre.localeCompare(b.nombre, 'es'));
      setCommunes(filtered);
    }

    // 3. Cargar roles desde API
    fetch('https://n8n-oneplaype.cd-latam.com:5678/webhook/get_rol', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: '7K9P2MX8V3QRTW6ZY4ACB5EJ0FL1NG',
      },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setRoles(data || []))
      .catch(() => setRoles([]));

    // 5. Derivar gd_id desde el texto de sexo si la API no devuelve gd_id
    const rawGdId = userData.gd_id;
    let derivedGdId = '';
    if (rawGdId != null && rawGdId !== undefined) {
      derivedGdId = String(rawGdId);
    } else if (userData.sexo) {
      const genderMatch = [{ gd_id: 1, sexo: 'Masculino' }, { gd_id: 2, sexo: 'Femenino' }]
        .find(g => g.sexo.toLowerCase() === String(userData.sexo).toLowerCase());
      if (genderMatch) derivedGdId = String(genderMatch.gd_id);
    }
    console.log('[UserInfoScreen] gd_id raw:', rawGdId, '→ derivedGdId:', derivedGdId);

    // role_id: la API puede devolverlo como role_id, rol_id, rol, sa_id
    const rawRoleId = userData.role_id
      ?? (userData as any).rol_id
      ?? (userData as any).rol
      ?? (userData as any).sa_id
      ?? null;
    console.log('[UserInfoScreen] role_id raw:', userData.role_id, 'rol_id:', (userData as any).rol_id, 'sa_id:', (userData as any).sa_id, '→ rawRoleId:', rawRoleId);

    // 6. Setear formData — usar rg_id derivado si el original no llegó
    setFormData({
      dni: userData.rut || '',
      nombres: userData.nombres || '',
      paterno: userData.paterno || '',
      materno: userData.materno || '',
      gd_id: derivedGdId,
      sexo: userData.sexo || '',
      telefono: userData.telefono || '',
      nacimiento: userData.nacimiento ? userData.nacimiento.split('T')[0] : '',
      email: userData.email || '',
      password: '',
      parental_lock: userData.parental_lock || '',
      limit_movil: userData.limit_movil || 4,
      rg_id: derivedRgId != null ? String(derivedRgId) : '',
      co_id: rawCoId != null ? String(rawCoId) : '',
      role_id: rawRoleId != null ? String(rawRoleId) : '',
      direccion: userData.direccion || '',
      estado: userData.estado ?? 1,
    });
  }, [userData]);

  const toggleEdit = (field: string) => {
    setEditing(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'rg_id') {
      const filtered = allCommunes.filter((c: any) => String(c.rg_id) === String(value));
      filtered.sort((a: Commune, b: Commune) => a.nombre.localeCompare(b.nombre, 'es'));
      setCommunes(filtered);
      setFormData(prev => ({ ...prev, rg_id: value, co_id: '' }));
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pwd = '';
    for (let i = 0; i < 12; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    handleChange('password', pwd);
    if (isAdmin) setEditing(prev => ({ ...prev, password: true }));
  };

  const handleGoBack = () => {
    if (usersList && usersList.length > 1) {
      setStep('user-list');
    } else if (isAdmin) {
      setStep('search');
    } else {
      setStep('dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsLoading(true);

    try {
      const payload: any = {
        rut: formData.dni,
      };

      // Cliente solo envía contraseña
      if (!isAdmin) {
        if (!formData.password || !formData.password.trim()) {
          setSubmitError('Ingresa una nueva contraseña antes de guardar.');
          setIsLoading(false);
          return;
        }
        payload.password = formData.password.trim();
      } else {
        // Admin envía todo
        Object.assign(payload, {
          nombres: formData.nombres,
          paterno: formData.paterno,
          materno: formData.materno,
          gd_id: formData.gd_id ? parseInt(formData.gd_id) : undefined,
          telefono: formData.telefono,
          nacimiento: formData.nacimiento,
          email: formData.email,
          parental_lock: formData.parental_lock,
          limit_movil: formData.limit_movil,
          co_id: formData.co_id ? parseInt(formData.co_id) : undefined,
          role_id: formData.role_id ? parseInt(formData.role_id) : undefined,
          estado: formData.estado,
          direccion: formData.direccion,
        });
        if (formData.password && formData.password.trim()) {
          payload.password = formData.password.trim();
        }
      }

      const endpoint = isAdmin
        ? 'https://n8n-oneplaype.cd-latam.com:5678/webhook/update_user'
        : 'https://n8n-oneplaype.cd-latam.com:5678/webhook/update_password_user';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: '7K9P2MX8V3QRTW6ZY4ACB5EJ0FL1NG',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      setSuccess(true);
      setEditing({});
      if (!isAdmin) handleChange('password', '');

      // Sync updated form data back into context so re-entering this screen shows fresh values
      if (userData) {
        const updatedUserData = {
          ...userData,
          nombres: formData.nombres,
          paterno: formData.paterno,
          materno: formData.materno,
          gd_id: formData.gd_id ? parseInt(formData.gd_id) : userData.gd_id,
          sexo: formData.sexo || userData.sexo,
          telefono: formData.telefono,
          nacimiento: formData.nacimiento,
          email: formData.email,
          parental_lock: formData.parental_lock,
          limit_movil: formData.limit_movil,
          rg_id: formData.rg_id ? parseInt(formData.rg_id) : userData.rg_id,
          co_id: formData.co_id ? parseInt(formData.co_id) : userData.co_id,
          role_id: formData.role_id ? parseInt(formData.role_id) : userData.role_id,
          estado: formData.estado,
          direccion: formData.direccion,
        };
        setUserData(updatedUserData);
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setSubmitError(`Error al actualizar: ${err instanceof Error ? err.message : 'Intenta de nuevo'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full p-6 text-center">
          <p className="text-foreground">No hay datos de usuario disponibles</p>
        </div>
      </div>
    );
  }

  // ── Helpers de UI ──────────────────────────────────────────────────────────

  /** Etiqueta con botón de editar (admin) o sin él (cliente) */
  const fieldLabel = (label: string, field: string, canEdit = true) => (
    <div className="flex items-center justify-between mb-1">
      <label className="block text-xs sm:text-sm font-medium text-foreground">{label}</label>
      {isAdmin && canEdit && (
        <button
          type="button"
          onClick={() => toggleEdit(field)}
          className={`p-1 rounded transition-colors text-xs flex items-center gap-1 ${editing[field] ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Pencil className="h-3 w-3" />
          {editing[field] ? 'Editando' : 'Editar'}
        </button>
      )}
    </div>
  );

  /** Clase del input dependiendo de si puede editarse */
  const inputClass = (field: string) => {
    const editable = isAdmin ? editing[field] : false;
    return `input-field w-full text-sm ${!editable ? 'bg-secondary/50 cursor-default opacity-80' : ''}`;
  };

  // Lookups: 3 estrategias para cubrir cualquier formato de API
  // (número==número, string==string, campo texto directo)
  const regionName =
    regions.find(r => r.rg_id === userData.rg_id)?.nombre
    || regions.find(r => String(r.rg_id) === String(userData.rg_id))?.nombre
    || regions.find(r => String(r.rg_id) === String(formData.rg_id))?.nombre
    || (userData.rg_id ? `Región ${userData.rg_id}` : '—');

  const communeName =
    allCommunes.find(c => c.co_id === userData.co_id)?.nombre
    || allCommunes.find(c => String(c.co_id) === String(userData.co_id))?.nombre
    || allCommunes.find(c => String(c.co_id) === String(formData.co_id))?.nombre
    || (userData.co_id ? `Distrito ${userData.co_id}` : '—');

  const genderName =
    genders.find(g => g.gd_id === userData.gd_id)?.sexo
    || genders.find(g => String(g.gd_id) === String(userData.gd_id))?.sexo
    || userData.sexo
    || formData.sexo
    || '—';

  const roleName =
    roles.find(r => r.id === userData.role_id)?.name
    || roles.find(r => String(r.id) === String(userData.role_id))?.name
    || roles.find(r => String(r.id) === String(formData.role_id))?.name
    || (userData.role_id ? `Rol ${userData.role_id}` : '—');

  // ── Vista CLIENTE (read-only + sección contraseña) ────────────────────────
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-1 sm:p-2 z-50 overflow-y-auto">
        <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl border border-border my-2">

          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-gradient-to-r from-accent/10 to-cyan-500/10">
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoBack}
                className="p-1 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-foreground">Mi Información</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Información de solo lectura · Solo puedes cambiar tu contraseña</p>
              </div>
            </div>
          </div>

          {/* Success Toast */}
          {success && (
            <div className="fixed top-4 right-4 z-[60] bg-green-500 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-medium text-sm">¡Contraseña actualizada correctamente!</p>
            </div>
          )}

          <div className="p-3 sm:p-6 space-y-6 max-h-[calc(100vh-160px)] overflow-y-auto">
            {submitError && (
              <div className="p-3 bg-destructive/20 border border-destructive rounded-lg">
                <p className="text-sm text-destructive">{submitError}</p>
              </div>
            )}

            {/* Info personal (solo lectura) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Columna izquierda */}
              <div className="space-y-4">
                <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground pb-2 border-b border-border">
                  Datos Personales
                </h3>

                {[
                  { label: 'DNI', value: formData.dni },
                  { label: 'Nombre', value: formData.nombres },
                  { label: 'Apellido Paterno', value: formData.paterno },
                  { label: 'Apellido Materno', value: formData.materno },
                  { label: 'Sexo', value: genderName },
                  { label: 'Fecha de Nacimiento', value: formData.nacimiento },
                  { label: 'Teléfono', value: formData.telefono },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">{label}</label>
                    <div className="input-field w-full text-sm bg-secondary/50 opacity-80 cursor-default">
                      {value || '—'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Columna derecha */}
              <div className="space-y-4">
                <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground pb-2 border-b border-border">
                  Contacto y Dirección
                </h3>

                {[
                  { label: 'Correo Electrónico', value: formData.email },
                  { label: 'País', value: 'Perú' },
                  { label: 'Departamento', value: regionName },
                  { label: 'Distrito', value: communeName },
                  { label: 'Dirección', value: formData.direccion },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">{label}</label>
                    <div className="input-field w-full text-sm bg-secondary/50 opacity-80 cursor-default">
                      {value || '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ══ Sección Cambiar Contraseña ══ */}
            <form onSubmit={handleSubmit}>
              <div className="border border-primary/30 bg-primary/5 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/20 rounded-lg">
                    <Pencil className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Cambiar Contraseña</h3>
                    <p className="text-xs text-muted-foreground">Este es el único campo que puedes modificar</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                    Nueva Contraseña
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={e => handleChange('password', e.target.value)}
                        placeholder="Escribe o genera una contraseña"
                        className="input-field w-full text-sm pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={generatePassword}
                      disabled={isLoading}
                      className="btn-secondary px-3 text-sm whitespace-nowrap"
                    >
                      Generar
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleGoBack}
                    disabled={isLoading}
                    className="btn-secondary flex-1"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || success || !formData.password.trim()}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />Guardando...</>
                    ) : success ? (
                      '✓ Guardado'
                    ) : (
                      'Actualizar Contraseña'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Vista ADMIN (edición completa) ─────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-1 sm:p-2 z-50 overflow-y-auto">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl border border-border my-2">

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <button
              onClick={handleGoBack}
              className="p-1 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <h2 className="text-lg sm:text-2xl font-bold text-foreground">Información del Cliente</h2>
          </div>
        </div>

        {/* Success Toast */}
        {success && (
          <div className="fixed top-4 right-4 z-[60] bg-green-500 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-medium text-sm">¡Usuario actualizado correctamente!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto">
          {submitError && (
            <div className="p-3 bg-destructive/20 border border-destructive rounded-lg">
              <p className="text-sm text-destructive">{submitError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">

            {/* ========== Columna Izquierda ========== */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground mb-2 pb-2 border-b border-border">
                  Datos del Usuario
                </h3>
                <div className="space-y-2 sm:space-y-3">

                  {/* DNI */}
                  <div>
                    {fieldLabel('DNI', 'dni')}
                    <input
                      type="text"
                      value={formData.dni}
                      onChange={e => handleChange('dni', e.target.value)}
                      readOnly={!editing['dni']}
                      className={inputClass('dni')}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Nombres */}
                  <div>
                    {fieldLabel('Nombre', 'nombres')}
                    <input
                      type="text"
                      value={formData.nombres}
                      onChange={e => handleChange('nombres', e.target.value)}
                      readOnly={!editing['nombres']}
                      className={inputClass('nombres')}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Paterno */}
                  <div>
                    {fieldLabel('Apellido Paterno', 'paterno')}
                    <input
                      type="text"
                      value={formData.paterno}
                      onChange={e => handleChange('paterno', e.target.value)}
                      readOnly={!editing['paterno']}
                      className={inputClass('paterno')}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Materno */}
                  <div>
                    {fieldLabel('Apellido Materno', 'materno')}
                    <input
                      type="text"
                      value={formData.materno}
                      onChange={e => handleChange('materno', e.target.value)}
                      readOnly={!editing['materno']}
                      className={inputClass('materno')}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Sexo */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs sm:text-sm font-medium text-foreground">Sexo</label>
                      <button type="button" onClick={() => toggleEdit('gd_id')} className={`p-1 rounded text-xs flex items-center gap-1 transition-colors ${editing['gd_id'] ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        <Pencil className="h-3 w-3" />{editing['gd_id'] ? 'Editando' : 'Editar'}
                      </button>
                    </div>
                    <div className="space-y-1">
                      {genders.map(g => (
                        <label key={g.gd_id} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="sexo"
                            value={String(g.gd_id)}
                            checked={String(formData.gd_id) === String(g.gd_id)}
                            onChange={() => { handleChange('gd_id', String(g.gd_id)); handleChange('sexo', g.sexo); }}
                            disabled={!editing['gd_id'] || isLoading}
                            className="mr-2"
                          />
                          <span className="text-xs sm:text-sm text-foreground">{g.sexo}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div>
                    {fieldLabel('Teléfono', 'telefono')}
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={e => handleChange('telefono', e.target.value)}
                      readOnly={!editing['telefono']}
                      className={inputClass('telefono')}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div>
                    {fieldLabel('Fecha de Nacimiento', 'nacimiento')}
                    <input
                      type={editing['nacimiento'] ? 'date' : 'text'}
                      value={formData.nacimiento}
                      onChange={e => handleChange('nacimiento', e.target.value)}
                      readOnly={!editing['nacimiento']}
                      className={inputClass('nacimiento')}
                      disabled={isLoading}
                    />
                  </div>

                </div>
              </div>
            </div>

            {/* ========== Columna Derecha ========== */}
            <div className="space-y-3 sm:space-y-4">

              {/* Contacto y Credenciales */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground mb-2 pb-2 border-b border-border">
                  Contacto y Credenciales
                </h3>
                <div className="space-y-2 sm:space-y-3">

                  {/* Email */}
                  <div>
                    {fieldLabel('Correo Electrónico', 'email')}
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => handleChange('email', e.target.value)}
                      readOnly={!editing['email']}
                      className={inputClass('email')}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Contraseña */}
                  <div>
                    {fieldLabel('Contraseña (nueva)', 'password')}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.password}
                        onChange={e => handleChange('password', e.target.value)}
                        readOnly={!editing['password']}
                        placeholder="Dejar en blanco para no cambiar"
                        className={inputClass('password')}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={generatePassword}
                        disabled={isLoading}
                        className="btn-secondary px-3 text-sm whitespace-nowrap"
                      >
                        Generar
                      </button>
                    </div>
                  </div>

                  {/* Rol */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs sm:text-sm font-medium text-foreground">Rol de Usuario</label>
                      <button type="button" onClick={() => toggleEdit('role_id')} className={`p-1 rounded text-xs flex items-center gap-1 transition-colors ${editing['role_id'] ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        <Pencil className="h-3 w-3" />{editing['role_id'] ? 'Editando' : 'Editar'}
                      </button>
                    </div>
                    <select
                      value={formData.role_id}
                      onChange={e => handleChange('role_id', e.target.value)}
                      disabled={!editing['role_id'] || isLoading}
                      className={`input-field w-full text-sm ${!editing['role_id'] ? 'bg-secondary/50 opacity-80' : ''}`}
                    >
                      <option value="">Seleccione un rol</option>
                      {roles.map(r => (
                        <option key={r.id} value={String(r.id)}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Estado */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs sm:text-sm font-medium text-foreground">Estado</label>
                      <button type="button" onClick={() => toggleEdit('estado')} className={`p-1 rounded text-xs flex items-center gap-1 transition-colors ${editing['estado'] ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        <Pencil className="h-3 w-3" />{editing['estado'] ? 'Editando' : 'Editar'}
                      </button>
                    </div>
                    <select
                      value={formData.estado}
                      onChange={e => handleChange('estado', parseInt(e.target.value))}
                      disabled={!editing['estado'] || isLoading}
                      className={`input-field w-full text-sm ${!editing['estado'] ? 'bg-secondary/50 opacity-80' : ''}`}
                    >
                      <option value={1}>Activo</option>
                      <option value={0}>Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground mb-2 pb-2 border-b border-border">
                  Dirección
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    {fieldLabel('País', 'pais', false)}
                    <input type="text" value="Perú" readOnly className="input-field w-full text-sm bg-secondary/50 opacity-80" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs sm:text-sm font-medium text-foreground">Departamento</label>
                      <button type="button" onClick={() => toggleEdit('rg_id')} className={`p-1 rounded text-xs flex items-center gap-1 transition-colors ${editing['rg_id'] ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        <Pencil className="h-3 w-3" />{editing['rg_id'] ? 'Editando' : 'Editar'}
                      </button>
                    </div>
                    <select
                      value={formData.rg_id}
                      onChange={e => handleChange('rg_id', e.target.value)}
                      disabled={!editing['rg_id'] || isLoading}
                      className={`input-field w-full text-sm ${!editing['rg_id'] ? 'bg-secondary/50 opacity-80' : ''}`}
                    >
                      <option value="">Seleccione su departamento</option>
                      {regions.map(r => (
                        <option key={r.rg_id} value={String(r.rg_id)}>{r.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs sm:text-sm font-medium text-foreground">Distrito</label>
                      <button type="button" onClick={() => toggleEdit('co_id')} className={`p-1 rounded text-xs flex items-center gap-1 transition-colors ${editing['co_id'] ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        <Pencil className="h-3 w-3" />{editing['co_id'] ? 'Editando' : 'Editar'}
                      </button>
                    </div>
                    <select
                      value={formData.co_id}
                      onChange={e => handleChange('co_id', e.target.value)}
                      disabled={!editing['co_id'] || isLoading || communes.length === 0}
                      className={`input-field w-full text-sm ${!editing['co_id'] ? 'bg-secondary/50 opacity-80' : ''}`}
                    >
                      <option value="">Seleccione su distrito</option>
                      {communes.map(c => (
                        <option key={c.co_id} value={String(c.co_id)}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    {fieldLabel('Dirección', 'direccion')}
                    <input
                      type="text"
                      value={formData.direccion}
                      onChange={e => handleChange('direccion', e.target.value)}
                      readOnly={!editing['direccion']}
                      placeholder="Calle, número, referencia"
                      className={inputClass('direccion')}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Seguridad */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground mb-2 pb-2 border-b border-border">
                  Seguridad
                </h3>
                <div className="space-y-2 sm:space-y-3">

                  <div>
                    {fieldLabel('Clave Control Parental', 'parental_lock')}
                    <input
                      type="text"
                      value={formData.parental_lock}
                      onChange={e => handleChange('parental_lock', e.target.value)}
                      readOnly={!editing['parental_lock']}
                      placeholder="Ej: 1234"
                      className={inputClass('parental_lock')}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs sm:text-sm font-medium text-foreground">Límite de Dispositivos</label>
                      <button type="button" onClick={() => toggleEdit('limit_movil')} className={`p-1 rounded text-xs flex items-center gap-1 transition-colors ${editing['limit_movil'] ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        <Pencil className="h-3 w-3" />{editing['limit_movil'] ? 'Editando' : 'Editar'}
                      </button>
                    </div>
                    <select
                      value={formData.limit_movil}
                      onChange={e => handleChange('limit_movil', parseInt(e.target.value))}
                      disabled={!editing['limit_movil'] || isLoading}
                      className={`input-field w-full text-sm ${!editing['limit_movil'] ? 'bg-secondary/50 opacity-80' : ''}`}
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4 border-t border-border mt-2">
            <button
              type="button"
              onClick={handleGoBack}
              disabled={isLoading}
              className="btn-secondary flex-1"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={isLoading || success}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Actualizando...</>
              ) : success ? (
                '✓ Actualizado'
              ) : (
                'Actualizar Cliente'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
