import { useState, useEffect, useRef } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import communesData from './communes.json';
import regionsData from './regions.json';

interface Gender {
  gd_id: number;
  sexo: string;
}

interface Commune {
  co_id: number;
  nombre: string;
}

interface Region {
  rg_id: number;
  nombre: string;
}

interface Role {
  id: number;
  name: string;
  slug: string;
}

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    paterno: '',
    materno: '',
    sexo: '',
    telefono: '',
    nacimiento: '',
    email: '',
    password: '',
    parental_lock: '1234',
    auto_password: '',
    limit_movil: 4,
    gd_id: '',
    rg_id: '',
    co_id: '',
    role_id: '4',
    direccion: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [genders, setGenders] = useState<Gender[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [allCommunes, setAllCommunes] = useState<Commune[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [toastError, setToastError] = useState('');
  const [success, setSuccess] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadGendersAndCommunes();
    }
  }, [isOpen]);

  const loadGendersAndCommunes = async () => {
    try {
      setIsLoading(true);
      setGenders([
        { gd_id: 1, sexo: 'Masculino' },
        { gd_id: 2, sexo: 'Femenino' },
      ]);
      const regs = (regionsData as Region[]) || [];
      setRegions(regs);
      const loadedCommunes = (communesData as Commune[]) || [];
      setAllCommunes(loadedCommunes);
      setCommunes([]);

      try {
        const rolesResponse = await fetch('http://191.98.169.6:5678/webhook/get_rol', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': '7K9P2MX8V3QRTW6ZY4ACB5EJ0FL1NG',
          },
        });
        if (rolesResponse.ok) {
          const rolesData = await rolesResponse.json();
          setRoles(rolesData || []);
        }
      } catch (roleErr) {
        console.error('Error fetching roles:', roleErr);
        setRoles([]);
      }
    } catch (err) {
      setSubmitError('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';

    let password = '';
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));

    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 0; i < 8; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');
    handleChange('password', password);
  };

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'dni':
        if (!value) return 'El campo DNI es obligatorio';
        if (!/^\d+$/.test(value)) return 'El DNI debe contener solo números';
        if (value.length < 7 || value.length > 8) return 'El DNI debe tener entre 7 y 8 caracteres';
        return '';
      case 'nombres':
        if (!value || !value.trim()) return 'El campo Nombres es obligatorio';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'Los nombres solo pueden contener letras y espacios';
        if (value.trim().length < 2 || value.trim().length > 50) return 'El campo Nombres debe tener al menos 2 caracteres y máximo 50';
        return '';
      case 'paterno':
        if (!value || !value.trim()) return 'El campo Apellido Paterno es obligatorio';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(value)) return 'El Apellido Paterno solo puede contener letras';
        if (value.trim().length < 2 || value.trim().length > 50) return 'El Apellido Paterno debe tener al menos 2 caracteres y máximo 50';
        return '';
      case 'materno':
        if (value && value.trim()) {
          if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(value)) return 'El Apellido Materno solo puede contener letras';
          if (value.trim().length < 2 || value.trim().length > 50) return 'El Apellido Materno debe tener al menos 2 caracteres y máximo 50';
        }
        return '';
      case 'gd_id':
        if (!value) return 'El campo Sexo es obligatorio';
        if (value !== '1' && value !== '2') return 'Selecciona una opción válida';
        return '';
      case 'telefono':
        return '';
      case 'nacimiento':
        if (!value) return 'El campo Fecha de Nacimiento es obligatorio';
        const birthDate = new Date(value);
        const today = new Date();
        if (birthDate > today) return 'El formato de Fecha de Nacimiento no es válido (fecha futura)';
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) return 'Debes ser mayor de 18 años para registrarte';
        return '';
      case 'email':
        if (!value) return 'El campo Correo Electrónico es obligatorio';
        if (value.includes(' ')) return 'El formato de correo no es válido';
        if (value.length > 100) return 'El Correo Electrónico debe tener como máximo 100 caracteres';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'El formato de correo no es válido';
        return '';
      case 'password':
        if (!value || value.trim().length === 0) return 'La Contraseña debe tener al menos un carácter';
        return '';
      case 'parental_lock':
        if (!value) return 'El campo Clave Control Parental es obligatorio';
        if (!/^\d{4}$/.test(value)) return 'El formato de Clave Control Parental no es válido';
        return '';
      case 'limit_movil':
        if (!value) return 'El campo Límite de Dispositivos es obligatorio';
        const limit = Number(value);
        if (isNaN(limit) || limit < 1 || limit > 20) return 'Selecciona una opción válida';
        return '';
      case 'co_id':
        if (!value) return 'El campo Distrito es obligatorio';
        return '';
      case 'role_id':
        if (!value) return 'El campo Rol de Usuario es obligatorio';
        if (!['1', '4', '7'].includes(String(value))) return 'Selecciona una opción válida';
        return '';
      case 'direccion':
        return '';
      default:
        return '';
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
    }

    if (field === 'rg_id') {
      const filtered = allCommunes.filter((c: any) => String(c.rg_id) === String(value));
      setCommunes(filtered);
      setFormData(prev => ({ ...prev, rg_id: value, co_id: '' }));
      if (touched['co_id']) {
        setErrors(prev => ({ ...prev, co_id: validateField('co_id', '') }));
      }
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, formData[field as keyof typeof formData]) }));
  };

  const getInputClass = (field: string) => {
    const defaultClasses = "input-field w-full text-sm";
    if (touched[field] && errors[field]) {
      return `${defaultClasses} border-red-500 focus:border-red-500 focus:ring-red-500`;
    }
    return defaultClasses;
  };

  const getErrorElement = (field: string) => {
    if (touched[field] && errors[field]) {
      return <p className="text-xs text-red-500 mt-1">{errors[field]}</p>;
    }
    return null;
  };

  const fieldsToValidate = ['dni', 'nombres', 'paterno', 'materno', 'gd_id', 'telefono', 'nacimiento', 'email', 'password', 'parental_lock', 'limit_movil', 'co_id', 'role_id', 'direccion'];

  const isFormValid = fieldsToValidate.every(field => {
    const val = formData[field as keyof typeof formData];
    return !validateField(field, val);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setToastError('');

    const newErrors: Record<string, string> = {};
    let isValid = true;
    for (const field of fieldsToValidate) {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    setTouched(fieldsToValidate.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    if (!isValid) {
      setTimeout(() => {
        const firstErrorElement = formRef.current?.querySelector('.border-red-500');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    setIsLoading(true);

    try {
      const payload: any = {
        rut: formData.dni,
        nombres: formData.nombres,
        paterno: formData.paterno,
        materno: formData.materno,
        gd_id: parseInt(formData.gd_id),
        telefono: formData.telefono,
        nacimiento: formData.nacimiento,
        email: formData.email,
        password: formData.password,
        parental_lock: formData.parental_lock,
        limit_movil: formData.limit_movil,
        co_id: parseInt(formData.co_id),
        role_id: parseInt(formData.role_id),
        estado: 1,
      };

      if (formData.direccion && formData.direccion.trim()) {
        payload.direccion = formData.direccion.trim();
      }

      const response = await fetch('http://191.98.169.6:5678/webhook/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': '7K9P2MX8V3QRTW6ZY4ACB5EJ0FL1NG',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const responseData = await response.json();

      // Manejar la validación de correo existente devuelta por el backend
      if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].email_exists === 1) {
        setToastError('El correo electrónico ingresado ya se encuentra registrado. Usa otro.');
        setTimeout(() => setToastError(''), 4000);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          dni: '',
          nombres: '',
          paterno: '',
          materno: '',
          sexo: '',
          telefono: '',
          nacimiento: '',
          email: '',
          password: '',
          parental_lock: '1234',
          auto_password: '',
          limit_movil: 4,
          gd_id: '',
          rg_id: '',
          co_id: '',
          role_id: '4',
          direccion: '',
        });
        setTouched({});
        setErrors({});
      }, 3000);
    } catch (err) {
      setSubmitError(`Error al crear la cuenta: ${err instanceof Error ? err.message : 'Intenta de nuevo'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-1 sm:p-2 z-50 overflow-y-auto">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl border border-border my-2">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <h2 className="text-lg sm:text-2xl font-bold text-foreground">Crear Cuenta de Usuario</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
            disabled={isLoading}
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Notificación Toast de Éxito en la esquina superior derecha */}
        {success && (
          <div className="fixed top-4 right-4 z-[60] bg-green-500 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-medium text-sm">¡Cuenta creada correctamente!</p>
          </div>
        )}

        {/* Notificación Toast de Error en la esquina superior derecha */}
        {toastError && (
          <div className="fixed top-4 right-4 z-[60] bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
            <X className="h-5 w-5" />
            <p className="font-medium text-sm">{toastError}</p>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
          {submitError && (
            <div className="p-4 bg-destructive/20 border border-destructive rounded-lg">
              <p className="text-sm text-destructive">{submitError}</p>
            </div>
          )}



          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground mb-2 pb-2 border-b border-border">
                  Datos del Usuario
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">DNI <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      value={formData.dni}
                      onChange={(e) => handleChange('dni', e.target.value)}
                      onBlur={() => handleBlur('dni')}
                      placeholder="12345678"
                      className={getInputClass('dni')}
                      disabled={isLoading}
                    />
                    {getErrorElement('dni')}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Nombre <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      value={formData.nombres}
                      onChange={(e) => handleChange('nombres', e.target.value)}
                      onBlur={() => handleBlur('nombres')}
                      placeholder="Nombres"
                      className={getInputClass('nombres')}
                      disabled={isLoading}
                    />
                    {getErrorElement('nombres')}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Apellido Paterno <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      value={formData.paterno}
                      onChange={(e) => handleChange('paterno', e.target.value)}
                      onBlur={() => handleBlur('paterno')}
                      placeholder="Apellido Paterno"
                      className={getInputClass('paterno')}
                      disabled={isLoading}
                    />
                    {getErrorElement('paterno')}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Apellido Materno</label>
                    <input
                      type="text"
                      value={formData.materno}
                      onChange={(e) => handleChange('materno', e.target.value)}
                      onBlur={() => handleBlur('materno')}
                      placeholder="Apellido Materno (Opcional)"
                      className={getInputClass('materno')}
                      disabled={isLoading}
                    />
                    {getErrorElement('materno')}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Sexo <span className="text-destructive">*</span></label>
                    <div className="space-y-2">
                      {genders.map((gender) => (
                        <label key={gender.gd_id} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="sexo"
                            value={String(gender.gd_id)}
                            checked={formData.gd_id === String(gender.gd_id)}
                            onChange={() => {
                              handleChange('gd_id', String(gender.gd_id));
                              handleChange('sexo', gender.sexo);
                            }}
                            onBlur={() => handleBlur('gd_id')}
                            disabled={isLoading}
                            className="mr-2"
                          />
                          <span className="text-xs sm:text-sm text-foreground">{gender.sexo}</span>
                        </label>
                      ))}
                    </div>
                    {getErrorElement('gd_id')}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => handleChange('telefono', e.target.value)}
                      onBlur={() => handleBlur('telefono')}
                      placeholder="987654321"
                      className={getInputClass('telefono')}
                      disabled={isLoading}
                    />
                    {getErrorElement('telefono')}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Fecha de Nacimiento <span className="text-destructive">*</span></label>
                    <input
                      type="date"
                      value={formData.nacimiento}
                      onChange={(e) => handleChange('nacimiento', e.target.value)}
                      onBlur={() => handleBlur('nacimiento')}
                      className={getInputClass('nacimiento')}
                      disabled={isLoading}
                    />
                    {getErrorElement('nacimiento')}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground mb-2 pb-2 border-b border-border">
                  Contacto y Credenciales
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Correo Electrónico <span className="text-destructive">*</span></label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      placeholder="usuario@example.com"
                      className={getInputClass('email')}
                      disabled={isLoading}
                    />
                    {getErrorElement('email')}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Contraseña</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        onBlur={() => handleBlur('password')}
                        placeholder="Mínimo 8 caracteres"
                        className={getInputClass('password')}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={generatePassword}
                        disabled={isLoading}
                        className="btn-secondary px-3 text-sm"
                      >
                        Generar
                      </button>
                    </div>
                    {getErrorElement('password')}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Rol de Usuario <span className="text-destructive">*</span></label>
                    <select
                      value={formData.role_id}
                      onChange={(e) => handleChange('role_id', e.target.value)}
                      onBlur={() => handleBlur('role_id')}
                      className={getInputClass('role_id')}
                      disabled={isLoading}
                    >
                      <option value="">Seleccione un rol</option>
                      {roles.map((role) => (
                        <option key={role.id} value={String(role.id)}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    {getErrorElement('role_id')}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground mb-2 pb-2 border-b border-border">
                  Dirección
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">País</label>
                    <input
                      type="text"
                      value="Perú"
                      readOnly
                      className="input-field w-full bg-secondary text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Departamento</label>
                    <select
                      value={formData.rg_id}
                      onChange={(e) => handleChange('rg_id', e.target.value)}
                      onBlur={() => handleBlur('rg_id')}
                      className={getInputClass('rg_id')}
                      disabled={isLoading}
                    >
                      <option value="">Seleccione su departamento</option>
                      {regions.map((r) => (
                        <option key={r.rg_id} value={String(r.rg_id)}>
                          {r.nombre}
                        </option>
                      ))}
                    </select>
                    {getErrorElement('rg_id')}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Distrito <span className="text-destructive">*</span></label>
                    <select
                      value={formData.co_id}
                      onChange={(e) => handleChange('co_id', e.target.value)}
                      onBlur={() => handleBlur('co_id')}
                      className={getInputClass('co_id')}
                      disabled={isLoading || communes.length === 0}
                    >
                      <option value="">Seleccione su distrito</option>
                      {communes.map((commune) => (
                        <option key={commune.co_id} value={String(commune.co_id)}>
                          {commune.nombre}
                        </option>
                      ))}
                    </select>
                    {getErrorElement('co_id')}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Dirección</label>
                    <input
                      type="text"
                      value={formData.direccion}
                      onChange={(e) => handleChange('direccion', e.target.value)}
                      onBlur={() => handleBlur('direccion')}
                      placeholder="Calle, número, referencia"
                      className={getInputClass('direccion')}
                      disabled={isLoading}
                    />
                    {getErrorElement('direccion')}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground mb-2 pb-2 border-b border-border">
                  Seguridad
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Clave Control Parental <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      value={formData.parental_lock}
                      onChange={(e) => handleChange('parental_lock', e.target.value)}
                      onBlur={() => handleBlur('parental_lock')}
                      placeholder="Ej: 1234"
                      className={getInputClass('parental_lock')}
                      disabled={isLoading}
                    />
                    {getErrorElement('parental_lock')}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Límite de Dispositivos <span className="text-destructive">*</span></label>
                    <select
                      value={formData.limit_movil}
                      onChange={(e) => handleChange('limit_movil', parseInt(e.target.value))}
                      onBlur={() => handleBlur('limit_movil')}
                      className={getInputClass('limit_movil')}
                      disabled={isLoading}
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    {getErrorElement('limit_movil')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1 sm:pt-2">
            <button
              type="submit"
              disabled={isLoading || success || !isFormValid}
              className="btn-primary px-6 sm:px-8 py-2 sm:py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : success ? (
                '✓ Cuenta creada'
              ) : (
                'Generar Usuario'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
