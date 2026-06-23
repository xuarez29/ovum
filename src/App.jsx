import { useEffect, useRef, useState } from 'react';
import CalendarView from './components/CalendarView';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import UserDetail from './components/UserDetail';
import UserForm from './components/UserForm';
import { clearUsers, loadUsers, saveUsers, validateImportPayload } from './utils/storage';

function createId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const [users, setUsers] = useState(() => loadUsers());
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showCycleForm, setShowCycleForm] = useState(false);
  const [message, setMessage] = useState('');
  const importInputRef = useRef(null);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    if (!selectedUserId && users[0]) setSelectedUserId(users[0].id);
  }, [selectedUserId, users]);

  function showMessage(text) {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3500);
  }

  function openCreateUser() {
    setEditingUser(null);
    setShowUserForm(true);
  }

  function saveUser(formData) {
    if (editingUser) {
      setUsers((current) => current.map((user) => (
        user.id === editingUser.id
          ? { ...user, ...formData, cycles: syncBaseCycle(user.cycles, formData) }
          : user
      )));
      showMessage('Usuaria actualizada.');
    } else {
      const id = createId();
      const firstCycle = {
        id: createId(),
        startDate: formData.lastPeriodStart,
        endDate: '',
        symptoms: [],
        notes: 'Registro inicial'
      };
      setUsers((current) => [...current, { id, ...formData, cycles: [firstCycle] }]);
      setSelectedUserId(id);
      showMessage('Usuaria agregada.');
    }
    setShowUserForm(false);
    setEditingUser(null);
    setActiveView('dashboard');
  }

  function syncBaseCycle(cycles = [], formData) {
    if (cycles.some((cycle) => cycle.startDate === formData.lastPeriodStart)) return cycles;
    return [
      ...cycles,
      {
        id: createId(),
        startDate: formData.lastPeriodStart,
        endDate: '',
        symptoms: [],
        notes: 'Actualización de fecha base'
      }
    ];
  }

  function selectUser(userId) {
    setSelectedUserId(userId);
    setActiveView('detail');
    setShowCycleForm(false);
  }

  function editSelectedUser() {
    const user = users.find((item) => item.id === selectedUserId);
    setEditingUser(user);
    setShowUserForm(true);
  }

  function deleteSelectedUser() {
    const user = users.find((item) => item.id === selectedUserId);
    if (!user) return;
    const confirmed = window.confirm(`¿Eliminar a ${user.name} y todo su historial?`);
    if (!confirmed) return;
    const remainingUsers = users.filter((item) => item.id !== selectedUserId);
    setUsers(remainingUsers);
    setSelectedUserId(remainingUsers[0]?.id || '');
    setActiveView('dashboard');
    showMessage('Usuaria eliminada.');
  }

  function addCycle(cycleForm) {
    setUsers((current) => current.map((user) => {
      if (user.id !== selectedUserId) return user;
      const nextCycles = [{ id: createId(), ...cycleForm }, ...(user.cycles || [])];
      const latestStart = nextCycles
        .filter((cycle) => cycle.startDate)
        .sort((a, b) => b.startDate.localeCompare(a.startDate))[0]?.startDate;
      return { ...user, lastPeriodStart: latestStart || user.lastPeriodStart, cycles: nextCycles };
    }));
    setShowCycleForm(false);
    showMessage('Ciclo registrado.');
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ovum-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importData(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!validateImportPayload(parsed)) {
          showMessage('El archivo JSON no tiene una estructura válida.');
          return;
        }
        setUsers(parsed);
        setSelectedUserId(parsed[0]?.id || '');
        setActiveView('dashboard');
        showMessage('Datos importados.');
      } catch {
        showMessage('No se pudo leer el archivo JSON.');
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  }

  function clearAllData() {
    const confirmed = window.confirm('¿Borrar todos los datos guardados en este navegador?');
    if (!confirmed) return;
    clearUsers();
    setUsers([]);
    setSelectedUserId('');
    setActiveView('dashboard');
    showMessage('Todos los datos fueron borrados.');
  }

  const selectedUser = users.find((user) => user.id === selectedUserId);

  return (
    <div className="min-h-screen bg-arcillaBg text-ink">
      <Navbar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          setShowCycleForm(false);
        }}
        onAddUser={openCreateUser}
        onExport={exportData}
        onImportClick={() => importInputRef.current?.click()}
        onClearAll={clearAllData}
      />
      <input ref={importInputRef} type="file" accept="application/json" onChange={importData} className="hidden" />

      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        {message && <div className="mb-5 rounded-2xl border border-[#cfe2d1] bg-[#eef7ef] px-4 py-3 text-sm font-medium text-[#426f4b]">{message}</div>}

        {showUserForm && (
          <section className="mb-6 rounded-3xl border border-arcillaLine bg-white p-5 shadow-soft">
            <h2 className="mb-4 font-serif text-2xl font-medium text-ink">{editingUser ? 'Editar usuaria' : 'Agregar usuaria'}</h2>
            <UserForm user={editingUser} onSave={saveUser} onCancel={() => setShowUserForm(false)} />
          </section>
        )}

        {activeView === 'dashboard' && (
          <Dashboard users={users} onSelectUser={selectUser} onAddUser={openCreateUser} />
        )}

        {activeView === 'users' && (
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-3xl font-medium text-ink">Usuarias registradas</h2>
                <p className="text-sm text-arcillaSub">Administra perfiles y abre el detalle de cada historial.</p>
              </div>
              <button onClick={openCreateUser} className="focus-ring rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white hover:bg-[#463b34]">Agregar</button>
            </div>
            <div className="overflow-hidden rounded-3xl border border-arcillaLine bg-white shadow-soft">
              {users.length ? users.map((user) => (
                <button key={user.id} onClick={() => selectUser(user.id)} className="focus-ring flex w-full items-center justify-between border-b border-arcillaLine px-4 py-3 text-left last:border-b-0 hover:bg-[#fcf8f3]">
                  <span>
                    <strong className="block text-ink">{user.name}</strong>
                    <span className="text-sm text-arcillaSub">Ciclo {user.cycleLength || 28} dias · Periodo {user.periodLength || 5} dias</span>
                  </span>
                  <span className="text-sm font-bold text-period">Ver detalle</span>
                </button>
              )) : <p className="p-5 text-sm text-arcillaSub">No hay usuarias registradas.</p>}
            </div>
          </section>
        )}

        {activeView === 'detail' && selectedUser && (
          <UserDetail
            user={selectedUser}
            showingCycleForm={showCycleForm}
            onBack={() => setActiveView('dashboard')}
            onEdit={editSelectedUser}
            onDelete={deleteSelectedUser}
            onShowCycleForm={() => setShowCycleForm(true)}
            onCancelCycleForm={() => setShowCycleForm(false)}
            onAddCycle={addCycle}
          />
        )}

        {activeView === 'calendar' && (
          <CalendarView users={users} selectedUserId={selectedUserId} onSelectUser={setSelectedUserId} />
        )}
      </main>
    </div>
  );
}
